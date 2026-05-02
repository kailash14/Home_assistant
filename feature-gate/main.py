from __future__ import annotations

import argparse
import asyncio
import json
from pathlib import Path

from dotenv import load_dotenv
from rich.console import Console

from orchestrator import run_batch
from report import write_reports
from schemas.agents import FeatureRequest


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run Feature Gate on feature briefs.")
    parser.add_argument(
        "--input",
        type=Path,
        default=Path("inputs/features.json"),
        help="Input JSON file containing a list of FeatureRequest objects",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=Path("outputs/reports"),
        help="Output directory for generated reports",
    )
    parser.add_argument(
        "--concurrency",
        type=int,
        default=5,
        help="Max number of feature pipelines to run in parallel",
    )
    parser.add_argument(
        "--product-strategy",
        type=Path,
        default=None,
        help="Optional path to product strategy markdown",
    )
    return parser.parse_args()


def load_features(path: Path) -> list[FeatureRequest]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(payload, list):
        raise ValueError("Input JSON must be a list of feature request objects")
    return [FeatureRequest.model_validate(item) for item in payload]


async def _main() -> int:
    load_dotenv()
    args = parse_args()
    console = Console()

    features = load_features(args.input)
    console.print(f"[bold]Loaded {len(features)} feature(s) from {args.input}[/bold]")
    reports, summary = await run_batch(
        features,
        concurrency=args.concurrency,
        product_strategy_path=str(args.product_strategy) if args.product_strategy else None,
    )
    outputs = write_reports(reports=reports, summary=summary, output_dir=args.output)
    console.print(f"[green]JSON report:[/green] {outputs['json']}")
    console.print(f"[green]Summary markdown:[/green] {outputs['summary_markdown']}")
    console.print(f"[green]Feature markdown dir:[/green] {outputs['feature_markdown_dir']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(_main()))
