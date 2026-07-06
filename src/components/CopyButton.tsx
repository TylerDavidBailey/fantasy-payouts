import { useCopyStatus, type CopyStatus } from "./useCopyStatus";

const copyStatusLabel: Record<CopyStatus, string> = {
  idle: "Copy results",
  success: "Copied",
  error: "Copy failed",
};

function CopyIcon(): JSX.Element {
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
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
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

type CopyButtonProps = {
  text: string;
};

function CopyButton({ text }: CopyButtonProps): JSX.Element {
  const { copyStatus, copy } = useCopyStatus();

  return (
    <button
      type="button"
      className="share-button"
      data-status={copyStatus}
      aria-label={copyStatusLabel[copyStatus]}
      onClick={() => {
        void copy(text);
      }}
    >
      {copyStatus === "success" ? <CheckIcon /> : <CopyIcon />}
      <span className="share-button-label" role="status">
        {copyStatusLabel[copyStatus]}
      </span>
    </button>
  );
}

export default CopyButton;
