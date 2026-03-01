import { useState, useMemo, useEffect } from "react";
import type { CheckStep } from "./types";
import { StepItem } from "./StepItem";
import "./CheckStepper.css";

interface CheckStepperProps {
  steps: CheckStep[];
  title?: string;
}

const MOBILE_BREAKPOINT = 480;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}

export function CheckStepper({ steps, title }: CheckStepperProps) {
  const isMobile = useIsMobile();
  const [userToggled, setUserToggled] = useState(false);
  const [userCollapsed, setUserCollapsed] = useState(false);

  const { passed, failed, skipped, total, done, activeAndAfter, completedBefore } = useMemo(() => {
    const passed = steps.filter((s) => s.status === "passed").length;
    const failed = steps.filter((s) => s.status === "failed").length;
    const skipped = steps.filter((s) => s.status === "skipped").length;
    const total = steps.length;
    const done = steps.every((s) => s.status !== "pending" && s.status !== "running");

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

  // Auto-collapse on mobile when enough steps complete, respect manual toggle
  const collapsed = canCollapse && (userToggled ? userCollapsed : isMobile);

  const handleToggle = (value: boolean) => {
    setUserToggled(true);
    setUserCollapsed(value);
  };

  // Reset manual toggle when steps reset (all pending again)
  useEffect(() => {
    if (steps.every((s) => s.status === "pending")) {
      setUserToggled(false);
      setUserCollapsed(false);
    }
  }, [steps]);

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
        {collapsed && (
          <button
            className="collapsed-summary"
            onClick={() => handleToggle(false)}
            aria-expanded={false}
          >
            <span className="collapsed-count">{completedBefore.length} passed</span>
            <span className="collapsed-expand">Show</span>
          </button>
        )}

        {!collapsed && completedBefore.map((step, i) => (
          <StepItem key={step.id} step={step} index={i} isLast={false} />
        ))}

        {canCollapse && !collapsed && (
          <button
            className="collapsed-summary"
            onClick={() => handleToggle(true)}
            aria-expanded={true}
          >
            <span className="collapsed-expand">Hide {completedBefore.length} passed</span>
          </button>
        )}

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
