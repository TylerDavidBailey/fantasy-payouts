import type { JSX } from "react";
import { useCopyStatus, type CopyStatus } from "./useCopyStatus";

type CopyStatusButtonProps = {
  labels: Record<CopyStatus, string>;
  idleIcon: JSX.Element;
  getText: () => string;
};

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

function CopyStatusButton({ labels, idleIcon, getText }: CopyStatusButtonProps): JSX.Element {
  const { copyStatus, copy } = useCopyStatus();

  return (
    <button
      type="button"
      className="share-button"
      data-status={copyStatus}
      aria-label={labels[copyStatus]}
      onClick={() => {
        void copy(getText());
      }}
    >
      {copyStatus === "success" ? <CheckIcon /> : idleIcon}
      <span className="share-button-label" role="status">
        {labels[copyStatus]}
      </span>
    </button>
  );
}

export default CopyStatusButton;
