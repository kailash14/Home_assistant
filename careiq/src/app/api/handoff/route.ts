import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { HANDOFF_SYSTEM_PROMPT } from "@/lib/prompts";
import { buildHandoffUserMessage } from "@/lib/patient-context";
import { Patient } from "@/types/patient";
import { RiskFlag } from "@/types/analysis";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  let patient: Patient;
  let notes: string;
  let riskFlags: RiskFlag[];

  try {
    const body = await request.json();
    patient = body.patient as Patient;
    notes = body.notes as string;
    riskFlags = body.riskFlags as RiskFlag[];
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!patient || !notes || !riskFlags) {
    return NextResponse.json({ error: "patient, notes, and riskFlags are required" }, { status: 400 });
  }

  const userMessage = buildHandoffUserMessage(patient, notes, JSON.stringify(riskFlags, null, 2));

  try {
    const { parsed, raw, usage } = await callClaude(HANDOFF_SYSTEM_PROMPT, userMessage);
    const latency = Date.now() - startTime;

    return NextResponse.json({
      result: parsed,
      meta: {
        model: "claude-sonnet-4-20250514",
        latency_ms: latency,
        usage,
        request: {
          system: HANDOFF_SYSTEM_PROMPT,
          user: userMessage,
        },
        raw_response: raw,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Handoff generation failed: ${message}` },
      { status: 500 }
    );
  }
}
