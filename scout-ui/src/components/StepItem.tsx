import { memo } from "react";
import type { CheckStep } from "./types";
import { StatusIcon } from "./StatusIcon";

interface StepItemProps {
  step: CheckStep;
  index: number;
  isLast: boolean;
}

function formatElapsed(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

export const StepItem = memo(function StepItem({ step, index, isLast }: StepItemProps) {
  const isActive = step.status === "running";
  const isDone = step.status === "passed" || step.status === "failed" || step.status === "skipped";

  return (
    <div
      className={`step-item step-${step.status}`}
      style={{ "--step-index": index } as React.CSSProperties}
      role="listitem"
      aria-current={isActive ? "step" : undefined}
    >
      <div className="step-indicator">
        <div className="step-icon-wrapper">
          <StatusIcon status={step.status} />
        </div>
        {!isLast && <div className="step-connector" />}
      </div>
      <div className="step-content">
        <span className="step-label">
          {step.label}
          {isDone && step.elapsedMs != null && (
            <span className="step-elapsed"> — {formatElapsed(step.elapsedMs)}</span>
          )}
        </span>
        {step.description && isActive && (
          <span className="step-description">{step.description}</span>
        )}
      </div>
    </div>
  );
});
