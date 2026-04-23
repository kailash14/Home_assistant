import { NextRequest, NextResponse } from "next/server";
import { callClaude } from "@/lib/anthropic";
import { ANALYSIS_SYSTEM_PROMPT } from "@/lib/prompts";
import { buildAnalysisUserMessage } from "@/lib/patient-context";
import { validateVitals, validateAndNormalizeAnalysis } from "@/lib/validators";
import { Patient } from "@/types/patient";

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  let patient: Patient;
  let notes: string;

  try {
    const body = await request.json();
    patient = body.patient as Patient;
    notes = body.notes as string;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!patient || !notes) {
    return NextResponse.json({ error: "patient and notes are required" }, { status: 400 });
  }

  if (notes.trim().length < 10) {
    return NextResponse.json(
      { error: "Please enter visit notes before running analysis" },
      { status: 400 }
    );
  }

  const vitalErrors = validateVitals(patient.vitals);
  if (vitalErrors.length > 0) {
    return NextResponse.json(
      { error: "Vital signs out of valid range", details: vitalErrors },
      { status: 400 }
    );
  }

  const userMessage = buildAnalysisUserMessage(patient, notes);

  try {
    const { parsed, raw, usage } = await callClaude(ANALYSIS_SYSTEM_PROMPT, userMessage);
    const normalized = validateAndNormalizeAnalysis(parsed);
    const latency = Date.now() - startTime;

    return NextResponse.json({
      result: normalized,
      meta: {
        model: "claude-sonnet-4-20250514",
        latency_ms: latency,
        usage,
        request: {
          system: ANALYSIS_SYSTEM_PROMPT,
          user: userMessage,
        },
        raw_response: raw,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Analysis failed: ${message}` },
      { status: 500 }
    );
  }
}
