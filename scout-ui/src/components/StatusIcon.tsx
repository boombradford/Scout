import { memo } from "react";
import type { CheckStatus } from "./types";

interface StatusIconProps {
  status: CheckStatus;
}

export const StatusIcon = memo(function StatusIcon({ status }: StatusIconProps) {
  switch (status) {
    case "passed":
      return (
        <svg viewBox="0 0 20 20" fill="none" className="status-icon passed" aria-label="Passed" role="img">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M6 10.5l2.5 2.5 5.5-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "failed":
      return (
        <svg viewBox="0 0 20 20" fill="none" className="status-icon failed" aria-label="Failed" role="img">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M7 7l6 6M13 7l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case "running":
      return (
        <svg viewBox="0 0 20 20" fill="none" className="status-icon running" aria-label="Running" role="img">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="14 42" className="spinner" />
        </svg>
      );
    case "skipped":
      return (
        <svg viewBox="0 0 20 20" fill="none" className="status-icon skipped" aria-label="Skipped" role="img">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
          <path d="M7 10h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 20 20" fill="none" className="status-icon pending" aria-label="Pending" role="img">
          <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
  }
});
