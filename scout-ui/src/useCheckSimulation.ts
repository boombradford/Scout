import { useReducer, useCallback, useRef } from "react";
import type { CheckStep, CheckStatus } from "./components/types";

const INITIAL_CHECKS: CheckStep[] = [
  { id: "lint", label: "Lint", description: "Checking code style..." },
  { id: "typecheck", label: "Typecheck", description: "Verifying types..." },
  { id: "unit", label: "Unit tests", description: "Running 142 tests..." },
  { id: "integration", label: "Integration tests", description: "Testing API endpoints..." },
  { id: "build", label: "Build", description: "Compiling production bundle..." },
  { id: "security", label: "Security scan", description: "Scanning for vulnerabilities..." },
  { id: "deploy-preview", label: "Deploy preview", description: "Provisioning preview environment..." },
].map((c) => ({ ...c, status: "pending" as const }));

type State = {
  steps: CheckStep[];
  isRunning: boolean;
};

type Action =
  | { type: "RESET" }
  | { type: "START" }
  | { type: "SET_STATUS"; index: number; status: CheckStatus; elapsedMs?: number }
  | { type: "FINISH" };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "RESET":
      return { steps: INITIAL_CHECKS, isRunning: false };
    case "START":
      return { ...state, isRunning: true };
    case "SET_STATUS":
      return {
        ...state,
        steps: state.steps.map((s, i) =>
          i === action.index
            ? { ...s, status: action.status, elapsedMs: action.elapsedMs }
            : s
        ),
      };
    case "FINISH":
      return { ...state, isRunning: false };
  }
}

export function useCheckSimulation() {
  const [state, dispatch] = useReducer(reducer, {
    steps: INITIAL_CHECKS,
    isRunning: false,
  });
  const timeoutIds = useRef<number[]>([]);

  const reset = useCallback(() => {
    timeoutIds.current.forEach(clearTimeout);
    timeoutIds.current = [];
    dispatch({ type: "RESET" });
  }, []);

  const run = useCallback(() => {
    reset();
    dispatch({ type: "START" });

    let cumulativeDelay = 0;

    INITIAL_CHECKS.forEach((_, i) => {
      const runDelay = cumulativeDelay;
      timeoutIds.current.push(
        window.setTimeout(() => {
          dispatch({ type: "SET_STATUS", index: i, status: "running" });
        }, runDelay)
      );

      const duration = Math.round(400 + Math.random() * 800);
      cumulativeDelay += duration;

      timeoutIds.current.push(
        window.setTimeout(() => {
          // 90% pass rate; integration test (index 3) fails more often
          const passed = i === 3 ? Math.random() > 0.4 : Math.random() > 0.08;
          dispatch({
            type: "SET_STATUS",
            index: i,
            status: passed ? "passed" : "failed",
            elapsedMs: duration,
          });

          if (i === INITIAL_CHECKS.length - 1) {
            dispatch({ type: "FINISH" });
          }
        }, cumulativeDelay)
      );
    });
  }, [reset]);

  return { steps: state.steps, isRunning: state.isRunning, run, reset };
}
