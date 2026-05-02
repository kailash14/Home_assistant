"""Validator fan-out and utility helpers."""

from __future__ import annotations

import asyncio
from functools import partial
from typing import Callable

from schemas.agents import FeatureRequest, SignalStrength, ValidationSignals, ValidatorSignal
from validators.github import run_github
from validators.hackernews import run_hackernews
from validators.reddit import run_reddit
from validators.trends import run_google_trends


def _build_query(feature: FeatureRequest) -> str:
    return f"{feature.title} {feature.description}".strip()


async def _run_sync(func: Callable[[str], ValidatorSignal], query: str) -> ValidatorSignal:
    return await asyncio.to_thread(partial(func, query))


def _fallback_signal(query: str, label: str, err: Exception) -> ValidatorSignal:
    return ValidatorSignal(
        queried=query,
        raw=[],
        signal_summary=f"{label} validator error: {type(err).__name__}: {err}",
        signal_strength=SignalStrength.NONE,
    )


async def run_all_validators(feature: FeatureRequest) -> ValidationSignals:
    query = _build_query(feature)

    trends_task = _run_sync(run_google_trends, query)
    reddit_task = _run_sync(run_reddit, query)
    hn_task = _run_sync(run_hackernews, query)
    github_task = _run_sync(run_github, query)

    trends_res, reddit_res, hn_res, github_res = await asyncio.gather(
        trends_task, reddit_task, hn_task, github_task, return_exceptions=True
    )

    trends = (
        trends_res
        if isinstance(trends_res, ValidatorSignal)
        else _fallback_signal(query, "Google Trends", trends_res)
    )
    reddit = (
        reddit_res
        if isinstance(reddit_res, ValidatorSignal)
        else _fallback_signal(query, "Reddit", reddit_res)
    )
    hackernews = (
        hn_res
        if isinstance(hn_res, ValidatorSignal)
        else _fallback_signal(query, "Hacker News", hn_res)
    )
    github = (
        github_res
        if isinstance(github_res, ValidatorSignal)
        else _fallback_signal(query, "GitHub", github_res)
    )

    combined_summary = "\n".join(
        [
            f"Google Trends: {trends.signal_summary}",
            f"Reddit: {reddit.signal_summary}",
            f"Hacker News: {hackernews.signal_summary}",
            f"GitHub: {github.signal_summary}",
        ]
    )

    return ValidationSignals(
        trends=trends,
        reddit=reddit,
        hackernews=hackernews,
        github=github,
        combined_summary=combined_summary,
    )
