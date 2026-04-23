import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { CARE_PLAN_SYSTEM_PROMPT } from "@/lib/prompts";
import { buildCarePlanUserMessage } from "@/lib/patient-context";
import { AnalysisResult } from "@/types/analysis";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  let analysis: AnalysisResult;

  try {
    const body = await request.json();
    analysis = body.analysis as AnalysisResult;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!analysis) {
    return NextResponse.json({ error: "analysis is required" }, { status: 400 });
  }

  const userMessage = buildCarePlanUserMessage(JSON.stringify(analysis, null, 2));

  try {
    const { parsed, raw, usage } = await callClaude(CARE_PLAN_SYSTEM_PROMPT, userMessage);
    const latency = Date.now() - startTime;

    return NextResponse.json({
      result: parsed,
      meta: {
        model: "claude-sonnet-4-20250514",
        latency_ms: latency,
        usage,
        request: {
          system: CARE_PLAN_SYSTEM_PROMPT,
          user: userMessage,
        },
        raw_response: raw,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Care plan generation failed: ${message}` },
      { status: 500 }
    );
  }
}
