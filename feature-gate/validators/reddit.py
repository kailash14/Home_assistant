"""Reddit validator using PRAW search."""

from __future__ import annotations

import asyncio
import os
from collections import Counter
from typing import Any

import praw

from schemas.agents import SignalStrength, ValidatorSignal


def _build_reddit_client() -> praw.Reddit:
    client_id = os.getenv("REDDIT_CLIENT_ID")
    client_secret = os.getenv("REDDIT_CLIENT_SECRET")
    user_agent = os.getenv("REDDIT_USER_AGENT", "feature-gate-validator/0.1")

    if not client_id or not client_secret:
        raise RuntimeError("REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET are required")

    return praw.Reddit(
        client_id=client_id,
        client_secret=client_secret,
        user_agent=user_agent,
        check_for_async=False,
    )


def _run_reddit_sync(query: str, limit: int) -> ValidatorSignal:
    reddit = _build_reddit_client()
    posts = list(reddit.subreddit("all").search(query, limit=limit, sort="relevance"))

    if not posts:
        return ValidatorSignal(
            queried=query,
            raw=[],
            signal_summary="No relevant Reddit posts found for this query.",
            signal_strength=SignalStrength.WEAK,
        )

    raw: list[dict[str, Any]] = []
    subreddit_counts: Counter[str] = Counter()
    comment_total = 0
    score_total = 0
    for post in posts:
        subreddit = str(post.subreddit.display_name)
        subreddit_counts[subreddit] += 1
        comment_total += int(post.num_comments)
        score_total += int(post.score)
        raw.append(
            {
                "title": post.title,
                "subreddit": subreddit,
                "score": int(post.score),
                "num_comments": int(post.num_comments),
                "url": f"https://reddit.com{post.permalink}",
            }
        )

    avg_comments = comment_total / len(posts)
    avg_score = score_total / len(posts)
    top_subreddit = subreddit_counts.most_common(1)[0][0]

    if len(posts) >= 4 and avg_comments >= 20:
        strength = SignalStrength.STRONG
    elif len(posts) >= 3 and avg_comments >= 8:
        strength = SignalStrength.MODERATE
    else:
        strength = SignalStrength.WEAK

    return ValidatorSignal(
        queried=query,
        raw=raw,
        signal_summary=(
            f"Found {len(posts)} Reddit results; avg comments={avg_comments:.1f}, "
            f"avg score={avg_score:.1f}, most active subreddit=r/{top_subreddit}."
        ),
        signal_strength=strength,
    )


async def run_reddit_validator(query: str) -> ValidatorSignal:
    limit = int(os.getenv("VALIDATOR_RESULTS_LIMIT", "5"))
    try:
        return await asyncio.to_thread(_run_reddit_sync, query, limit)
    except Exception as exc:  # pragma: no cover - network/auth dependent
        return ValidatorSignal(
            queried=query,
            raw=[],
            signal_summary=f"Reddit lookup unavailable ({type(exc).__name__}): {exc}",
            signal_strength=SignalStrength.NONE,
        )


def run_reddit(query: str) -> ValidatorSignal:
    return asyncio.run(run_reddit_validator(query))
