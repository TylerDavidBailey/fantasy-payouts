import { useEffect, useRef, useState } from "react";

type CopyStatus = "idle" | "success" | "error";

const copyStatusLabel: Record<CopyStatus, string> = {
  idle: "Copy share link",
  success: "Link copied",
  error: "Copy failed",
};

function ShareButton(): JSX.Element {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function copyShareLink(): Promise<void> {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyStatus("success");
    } catch {
      setCopyStatus("error");
    }

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setCopyStatus("idle");
      timeoutRef.current = null;
    }, 1800);
  }

  return (
    <button
      type="button"
      className="action-primary"
      data-status={copyStatus}
      onClick={() => {
        void copyShareLink();
      }}
    >
      {copyStatusLabel[copyStatus]}
    </button>
  );
}

export default ShareButton;
