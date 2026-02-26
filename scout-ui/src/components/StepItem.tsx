import type { CheckStep } from "./types";
import { StatusIcon } from "./StatusIcon";

interface StepItemProps {
  step: CheckStep;
  index: number;
  isLast: boolean;
}

export function StepItem({ step, index, isLast }: StepItemProps) {
  return (
    <div className={`step-item step-${step.status}`} style={{ "--step-index": index } as React.CSSProperties}>
      <div className="step-indicator">
        <div className="step-icon-wrapper">
          <StatusIcon status={step.status} />
        </div>
        {!isLast && <div className="step-connector" />}
      </div>
      <div className="step-content">
        <span className="step-label">{step.label}</span>
        {step.description && step.status === "running" && (
          <span className="step-description">{step.description}</span>
        )}
      </div>
    </div>
  );
}
