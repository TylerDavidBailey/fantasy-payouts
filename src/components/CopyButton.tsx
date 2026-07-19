import type { JSX } from "react";
import CopyStatusButton from "./CopyStatusButton";

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

type CopyButtonProps = {
  text: string;
};

function CopyButton({ text }: CopyButtonProps): JSX.Element {
  return (
    <CopyStatusButton
      labels={{ idle: "Copy results", success: "Copied", error: "Copy failed" }}
      idleIcon={<CopyIcon />}
      getText={() => text}
    />
  );
}

export default CopyButton;
