import { useState, useMemo } from "react";
import type { CheckStep } from "./types";
import { StepItem } from "./StepItem";
import "./CheckStepper.css";

interface CheckStepperProps {
  steps: CheckStep[];
  title?: string;
}

export function CheckStepper({ steps, title }: CheckStepperProps) {
  const [collapsed, setCollapsed] = useState(false);

  const { passed, failed, skipped, total, done, activeAndAfter, completedBefore } = useMemo(() => {
    const passed = steps.filter((s) => s.status === "passed").length;
    const failed = steps.filter((s) => s.status === "failed").length;
    const skipped = steps.filter((s) => s.status === "skipped").length;
    const total = steps.length;
    const done = steps.every((s) => s.status !== "pending" && s.status !== "running");

    // Split steps into "completed leading block" and "active + remaining"
    let firstNonCompleted = steps.findIndex(
      (s) => s.status === "pending" || s.status === "running"
    );
    if (firstNonCompleted === -1) firstNonCompleted = total;

    const completedBefore = steps.slice(0, firstNonCompleted);
    const activeAndAfter = steps.slice(firstNonCompleted);

    return { passed, failed, skipped, total, done, activeAndAfter, completedBefore };
  }, [steps]);

  const finished = passed + failed + skipped;
  const passedPct = (passed / total) * 100;
  const failedPct = (failed / total) * 100;

  const canCollapse = completedBefore.length >= 2;
  const showCollapsed = canCollapse && collapsed;

  return (
    <div className={`check-stepper ${done ? (failed > 0 ? "done-fail" : "done-pass") : ""}`}>
      {title && <h3 className="stepper-title">{title}</h3>}

      <div className="stepper-summary">
        <div className="progress-track">
          <div
            className="progress-fill progress-passed"
            style={{ width: `${passedPct}%` }}
          />
          <div
            className="progress-fill progress-failed"
            style={{ width: `${failedPct}%`, left: `${passedPct}%` }}
          />
        </div>
        <span className="progress-text">
          {done
            ? failed > 0
              ? `${failed} of ${total} failed`
              : `All ${total} checks passed`
            : `${finished} of ${total}`}
        </span>
      </div>

      <div className="stepper-steps" role="list" aria-label="Check steps">
        {/* Collapsed completed summary */}
        {showCollapsed && (
          <button
            className="collapsed-summary"
            onClick={() => setCollapsed(false)}
            aria-expanded={false}
          >
            <span className="collapsed-count">{completedBefore.length} passed</span>
            <span className="collapsed-expand">Show</span>
          </button>
        )}

        {/* Expanded completed steps */}
        {!showCollapsed && completedBefore.map((step, i) => (
          <StepItem key={step.id} step={step} index={i} isLast={false} />
        ))}

        {/* Collapse toggle — show after expanded completed steps */}
        {canCollapse && !showCollapsed && (
          <button
            className="collapsed-summary"
            onClick={() => setCollapsed(true)}
            aria-expanded={true}
          >
            <span className="collapsed-expand">Hide {completedBefore.length} passed</span>
          </button>
        )}

        {/* Active + remaining steps */}
        {activeAndAfter.map((step, i) => (
          <StepItem
            key={step.id}
            step={step}
            index={completedBefore.length + i}
            isLast={completedBefore.length + i === total - 1}
          />
        ))}
      </div>
    </div>
  );
}
