"""Hacker News validator using Algolia's public search API."""

from __future__ import annotations

import asyncio
import os
from typing import Any

import httpx
from tenacity import retry, stop_after_attempt, wait_exponential

from schemas.agents import SignalStrength, ValidatorSignal

ALGOLIA_HN_URL = "https://hn.algolia.com/api/v1/search"


@retry(wait=wait_exponential(multiplier=0.5, min=0.5, max=3), stop=stop_after_attempt(2), reraise=True)
async def _search_hn(query: str, timeout_seconds: float, limit: int) -> dict[str, Any]:
    async with httpx.AsyncClient(timeout=timeout_seconds) as client:
        response = await client.get(
            ALGOLIA_HN_URL,
            params={"query": query, "hitsPerPage": limit, "tags": "story"},
        )
        response.raise_for_status()
        return response.json()


async def run_hackernews_validator(query: str) -> ValidatorSignal:
    timeout_seconds = float(os.getenv("VALIDATOR_TIMEOUT_SECONDS", "8"))
    limit = int(os.getenv("VALIDATOR_RESULTS_LIMIT", "5"))

    try:
        payload = await _search_hn(query=query, timeout_seconds=timeout_seconds, limit=limit)
        hits = payload.get("hits", []) or []

        stories: list[dict[str, Any]] = []
        for hit in hits:
            stories.append(
                {
                    "title": hit.get("title") or hit.get("story_title"),
                    "url": hit.get("url") or hit.get("story_url"),
                    "points": hit.get("points"),
                    "num_comments": hit.get("num_comments"),
                    "created_at": hit.get("created_at"),
                }
            )

        if not stories:
            summary = "No meaningful Hacker News discussion was found for this query."
            strength = SignalStrength.NONE
        else:
            comment_total = sum((story.get("num_comments") or 0) for story in stories)
            if len(stories) >= 4 or comment_total >= 80:
                strength = SignalStrength.STRONG
            elif len(stories) >= 2 or comment_total >= 20:
                strength = SignalStrength.MODERATE
            else:
                strength = SignalStrength.WEAK
            summary = (
                f"Found {len(stories)} relevant Hacker News posts with ~{comment_total} total comments, "
                "indicating technical-community interest."
            )
    except Exception as exc:  # pragma: no cover - network/auth dependent
        stories = []
        summary = f"Hacker News validation unavailable ({type(exc).__name__}): {exc}"
        strength = SignalStrength.NONE

    return ValidatorSignal(
        queried=query,
        raw=stories,
        signal_summary=summary,
        signal_strength=strength,
    )


def run_hackernews(query: str) -> ValidatorSignal:
    return asyncio.run(run_hackernews_validator(query))
