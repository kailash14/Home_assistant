export type TaskOwner = "nurse" | "doctor" | "patient" | "family" | "coordinator";

export interface Goal {
  goal: string;
  target: string;
  timeline: string;
}

export interface DayTask {
  time: string;
  task: string;
  owner: TaskOwner;
  notes: string;
}

export interface DaySchedule {
  day: string;
  tasks: DayTask[];
}

export interface MedicationChange {
  medication: string;
  change: string;
  reason: string;
}

export interface MonitoringParameter {
  parameter: string;
  frequency: string;
  alert_threshold: string;
}

export interface FollowUp {
  next_visit: string;
  teleconsult: string;
  lab_tests: string;
}

export interface CarePlan {
  care_plan_title: string;
  goals: Goal[];
  daily_schedule: DaySchedule[];
  medication_changes: MedicationChange[];
  monitoring_parameters: MonitoringParameter[];
  patient_education: string[];
  follow_up: FollowUp;
}
