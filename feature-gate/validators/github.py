"""GitHub repository and issue search validator."""

from __future__ import annotations

import os
from typing import Any

from github import Github

from schemas.agents import SignalStrength, ValidatorSignal


def _strength(repo_count: int, issue_count: int) -> SignalStrength:
    score = repo_count + issue_count
    if score >= 40:
        return SignalStrength.STRONG
    if score >= 10:
        return SignalStrength.MODERATE
    if score > 0:
        return SignalStrength.WEAK
    return SignalStrength.NONE


def _safe_total_count(collection: Any) -> int:
    try:
        return int(collection.totalCount)
    except Exception:
        return 0


def run_github(query: str, limit: int = 5) -> ValidatorSignal:
    token = os.getenv("GITHUB_TOKEN")
    if not token:
        return ValidatorSignal(
            queried=query,
            raw=[],
            signal_summary="GitHub validator skipped: missing GITHUB_TOKEN.",
            signal_strength=SignalStrength.NONE,
        )

    client = Github(login_or_token=token, per_page=max(1, limit))

    try:
        repo_results = client.search_repositories(query=query, sort="stars", order="desc")
        issue_results = client.search_issues(query=f"{query} in:title,body", sort="comments", order="desc")

        raw: list[dict[str, Any]] = []
        for idx, repo in enumerate(repo_results):
            if idx >= limit:
                break
            raw.append(
                {
                    "kind": "repository",
                    "name": repo.full_name,
                    "stars": repo.stargazers_count,
                    "forks": repo.forks_count,
                    "open_issues": repo.open_issues_count,
                    "url": repo.html_url,
                }
            )

        for idx, issue in enumerate(issue_results):
            if idx >= limit:
                break
            raw.append(
                {
                    "kind": "issue",
                    "title": issue.title,
                    "repo": issue.repository.full_name if issue.repository else None,
                    "comments": issue.comments,
                    "state": issue.state,
                    "url": issue.html_url,
                }
            )

        repo_count = _safe_total_count(repo_results)
        issue_count = _safe_total_count(issue_results)
        strength = _strength(repo_count, issue_count)
        summary = (
            f"Found {repo_count} repositories and {issue_count} issues/discussions on GitHub "
            f"for '{query}'."
        )
        return ValidatorSignal(
            queried=query,
            raw=raw,
            signal_summary=summary,
            signal_strength=strength,
        )
    except Exception as exc:  # pragma: no cover
        return ValidatorSignal(
            queried=query,
            raw=[],
            signal_summary=f"GitHub validation unavailable ({type(exc).__name__}): {exc}",
            signal_strength=SignalStrength.NONE,
        )
