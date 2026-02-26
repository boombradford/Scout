import { useState, useCallback, useRef } from "react";
import type { CheckStep } from "./components/types";

const INITIAL_CHECKS: CheckStep[] = [
  { id: "lint", label: "Lint", description: "Checking code style..." },
  { id: "typecheck", label: "Typecheck", description: "Verifying types..." },
  { id: "unit", label: "Unit tests", description: "Running 142 tests..." },
  { id: "integration", label: "Integration tests", description: "Testing API endpoints..." },
  { id: "build", label: "Build", description: "Compiling production bundle..." },
  { id: "security", label: "Security scan", description: "Scanning for vulnerabilities..." },
  { id: "deploy-preview", label: "Deploy preview", description: "Provisioning preview environment..." },
].map((c) => ({ ...c, status: "pending" as const }));

export function useCheckSimulation() {
  const [steps, setSteps] = useState<CheckStep[]>(INITIAL_CHECKS);
  const [isRunning, setIsRunning] = useState(false);
  const timeoutIds = useRef<number[]>([]);

  const reset = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    setSteps(INITIAL_CHECKS);
    setIsRunning(false);
  }, []);

  const run = useCallback(() => {
    reset();
    setIsRunning(true);

    let cumulativeDelay = 0;

    INITIAL_CHECKS.forEach((_, i) => {
      // Mark step as running
      const runDelay = cumulativeDelay;
      timeoutIds.current.push(
        window.setTimeout(() => {
          setSteps((prev) =>
            prev.map((s, j) => (j === i ? { ...s, status: "running" } : s))
          );
        }, runDelay)
      );

      // Simulate variable durations — some checks are fast, some slower
      const duration = 400 + Math.random() * 800;
      cumulativeDelay += duration;

      // Mark step as passed/failed
      timeoutIds.current.push(
        window.setTimeout(() => {
          setSteps((prev) =>
            prev.map((s, j) => {
              if (j !== i) return s;
              // 90% pass rate for demo realism — integration test fails sometimes
              const passed = i === 3 ? Math.random() > 0.4 : Math.random() > 0.08;
              return { ...s, status: passed ? "passed" : "failed" };
            })
          );

          // If this is the last step, mark as done
          if (i === INITIAL_CHECKS.length - 1) {
            setIsRunning(false);
          }
        }, cumulativeDelay)
      );
    });
  }, [reset]);

  return { steps, isRunning, run, reset };
}
