import type { JSX } from "react";
import { useCopyStatus, type CopyStatus } from "./useCopyStatus";

const copyStatusLabel: Record<CopyStatus, string> = {
  idle: "Share link",
  success: "Link copied",
  error: "Copy failed",
};

function ShareIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

function CheckIcon(): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ShareButton(): JSX.Element {
  const { copyStatus, copy } = useCopyStatus();

  return (
    <button
      type="button"
      className="share-button"
      data-status={copyStatus}
      aria-label={copyStatusLabel[copyStatus]}
      onClick={() => {
        void copy(window.location.href);
      }}
    >
      {copyStatus === "success" ? <CheckIcon /> : <ShareIcon />}
      <span className="share-button-label" role="status">
        {copyStatusLabel[copyStatus]}
      </span>
    </button>
  );
}

export default ShareButton;
