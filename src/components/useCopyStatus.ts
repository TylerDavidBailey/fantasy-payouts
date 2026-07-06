import { useEffect, useRef, useState } from "react";

export type CopyStatus = "idle" | "success" | "error";

const resetDelayMs = 1800;

export function useCopyStatus(): {
  copyStatus: CopyStatus;
  copy: (text: string) => Promise<void>;
} {
  const [copyStatus, setCopyStatus] = useState<CopyStatus>("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  async function copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
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
    }, resetDelayMs);
  }

  return { copyStatus, copy };
}
