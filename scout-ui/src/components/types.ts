export type CheckStatus = "pending" | "running" | "passed" | "failed" | "skipped";

export interface CheckStep {
  id: string;
  label: string;
  description?: string;
  status: CheckStatus;
  elapsedMs?: number;
}
