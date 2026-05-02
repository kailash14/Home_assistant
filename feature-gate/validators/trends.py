"""Google Trends validator."""

from __future__ import annotations

import asyncio
from typing import Any

from pytrends.request import TrendReq

from schemas.agents import SignalStrength, ValidatorSignal


def _strength_from_interest(avg_interest: float) -> SignalStrength:
    if avg_interest >= 60:
        return SignalStrength.STRONG
    if avg_interest >= 30:
        return SignalStrength.MODERATE
    if avg_interest > 0:
        return SignalStrength.WEAK
    return SignalStrength.NONE


def _run_sync(query: str, timeframe: str = "today 12-m") -> ValidatorSignal:
    pytrends = TrendReq(hl="en-US", tz=0)
    pytrends.build_payload([query], cat=0, timeframe=timeframe, geo="", gprop="")
    interest_df = pytrends.interest_over_time()

    raw: list[dict[str, Any]] = []
    avg_interest = 0.0
    trend_note = "No trend data returned."
    if not interest_df.empty and query in interest_df.columns:
        series = interest_df[query]
        avg_interest = float(series.mean())
        latest = int(series.iloc[-1])
        oldest = int(series.iloc[0])
        direction = "flat"
        if latest > oldest + 5:
            direction = "rising"
        elif latest < oldest - 5:
            direction = "declining"
        trend_note = (
            f"Average interest {avg_interest:.1f}/100 over the last 12 months; "
            f"trend appears {direction} (oldest={oldest}, latest={latest})."
        )

        for idx, row in interest_df.tail(24).iterrows():
            raw.append(
                {
                    "date": (
                        idx.to_pydatetime().date().isoformat()
                        if hasattr(idx, "to_pydatetime")
                        else str(idx)
                    ),
                    "interest": int(row[query]),
                    "is_partial": bool(row.get("isPartial", False)),
                }
            )

    summary = (
        f"Google Trends signal for '{query}': {trend_note}"
        if raw
        else f"Google Trends signal for '{query}': no measurable interest in selected window."
    )
    return ValidatorSignal(
        queried=query,
        raw=raw,
        signal_summary=summary,
        signal_strength=_strength_from_interest(avg_interest),
    )


async def run_google_trends_validator(query: str) -> ValidatorSignal:
    try:
        return await asyncio.to_thread(_run_sync, query)
    except Exception as exc:  # pragma: no cover
        return ValidatorSignal(
            queried=query,
            raw=[],
            signal_summary=f"Google Trends validator unavailable ({type(exc).__name__}): {exc}",
            signal_strength=SignalStrength.NONE,
        )


def run_google_trends(query: str) -> ValidatorSignal:
    return asyncio.run(run_google_trends_validator(query))
