import type { CheckStep } from "./types";
import { StepItem } from "./StepItem";
import "./CheckStepper.css";

interface CheckStepperProps {
  steps: CheckStep[];
  title?: string;
}

export function CheckStepper({ steps, title }: CheckStepperProps) {
  const passed = steps.filter((s) => s.status === "passed").length;
  const failed = steps.filter((s) => s.status === "failed").length;
  const total = steps.length;
  const done = steps.every((s) => s.status !== "pending" && s.status !== "running");
  const progress = ((passed + failed + steps.filter((s) => s.status === "skipped").length) / total) * 100;

  return (
    <div className={`check-stepper ${done ? (failed > 0 ? "done-fail" : "done-pass") : ""}`}>
      {title && <h3 className="stepper-title">{title}</h3>}

      <div className="stepper-summary">
        <div className="progress-track">
          <div
            className={`progress-fill ${failed > 0 ? "has-failures" : ""}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="progress-text">
          {done
            ? failed > 0
              ? `${failed} of ${total} failed`
              : `All ${total} checks passed`
            : `${passed + failed} of ${total}`}
        </span>
      </div>

      <div className="stepper-steps">
        {steps.map((step, i) => (
          <StepItem key={step.id} step={step} index={i} isLast={i === steps.length - 1} />
        ))}
      </div>
    </div>
  );
}
