"""Shared Claude agent runner for Feature Gate specialist agents."""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any, TypeVar

from anthropic import Anthropic
from pydantic import BaseModel
from tenacity import retry, stop_after_attempt, wait_exponential


PROJECT_ROOT = Path(__file__).resolve().parent.parent
PROMPTS_DIR = PROJECT_ROOT / "prompts"

_T = TypeVar("_T", bound=BaseModel)


def _read_prompt(prompt_name: str) -> str:
    prompt_path = PROMPTS_DIR / prompt_name
    return prompt_path.read_text(encoding="utf-8")


def _extract_text_content(response: Any) -> str:
    parts = []
    for item in response.content:
        if getattr(item, "type", None) == "text":
            parts.append(item.text)
    if not parts:
        raise ValueError("Claude response did not include text content.")
    return "\n".join(parts).strip()


class AgentRunner:
    """Executes a single prompt + payload against Claude and validates JSON."""

    def __init__(self, prompt_name: str, output_model: type[_T]):
        self.prompt_name = prompt_name
        self.output_model = output_model
        self.model = os.getenv("CLAUDE_MODEL", "claude-sonnet-4-5-20250929")
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        self._client: Anthropic | None = None

    @property
    def client(self) -> Anthropic:
        if not self.api_key:
            raise RuntimeError(
                "ANTHROPIC_API_KEY is required for running agents. Set it in your .env file."
            )
        if self._client is None:
            self._client = Anthropic(api_key=self.api_key)
        return self._client

    @retry(wait=wait_exponential(multiplier=1, min=1, max=8), stop=stop_after_attempt(3))
    def _call_model(self, system_prompt: str, user_payload: dict[str, Any]) -> str:
        response = self.client.messages.create(
            model=self.model,
            max_tokens=2000,
            system=system_prompt,
            messages=[{"role": "user", "content": json.dumps(user_payload, ensure_ascii=True)}],
        )
        return _extract_text_content(response)

    def run(self, payload: dict[str, Any]) -> _T:
        system_prompt = _read_prompt(self.prompt_name)
        raw_output = self._call_model(system_prompt=system_prompt, user_payload=payload)
        return self.output_model.model_validate_json(raw_output)

    async def arun(self, payload: dict[str, Any]) -> _T:
        import asyncio

        return await asyncio.to_thread(self.run, payload)


def run_agent(prompt_name: str, output_model: type[_T], payload: dict[str, Any]) -> _T:
    runner = AgentRunner(prompt_name=prompt_name, output_model=output_model)
    return runner.run(payload)


async def run_agent_async(prompt_name: str, output_model: type[_T], payload: dict[str, Any]) -> _T:
    runner = AgentRunner(prompt_name=prompt_name, output_model=output_model)
    return await runner.arun(payload)
