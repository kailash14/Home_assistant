export interface Vitals {
  bp_sys: number;
  bp_dia: number;
  pulse: number;
  spo2: number;
  temp: number;
  glucose_fasting: number;
  weight: number;
}

export interface VisitHistory {
  date: string;
  type: string;
  note: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  conditions: string[];
  address: string;
  nurse: string;
  visits: number;
  risk: number;
  program: string;
  lastVisit: string;
  vitals: Vitals;
  notes: string;
  history: VisitHistory[];
}
