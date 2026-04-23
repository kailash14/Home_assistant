export interface SBAR {
  situation: string;
  background: string;
  assessment: string;
  recommendation: string;
}

export interface Handoff {
  sbar: SBAR;
  critical_alerts: string[];
  pending_tasks: string[];
  family_notes: string;
}
