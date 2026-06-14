import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ShareButton from "./ShareButton";

function stubClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(window.navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
}

describe("ShareButton", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("copies the current URL and confirms", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    stubClipboard(writeText);
    render(<ShareButton />);

    fireEvent.click(screen.getByRole("button", { name: /share link/i }));

    expect(await screen.findByRole("button", { name: /link copied/i })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith(window.location.href);
  });

  it("shows an error state when the clipboard write fails", async () => {
    stubClipboard(vi.fn(() => Promise.reject(new Error("denied"))));
    render(<ShareButton />);

    fireEvent.click(screen.getByRole("button", { name: /share link/i }));

    expect(await screen.findByRole("button", { name: /copy failed/i })).toBeInTheDocument();
  });

  it("returns to idle after the confirmation delay", async () => {
    vi.useFakeTimers();
    stubClipboard(vi.fn(() => Promise.resolve()));
    render(<ShareButton />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    await act(() => Promise.resolve());

    expect(button).toHaveTextContent("Link copied");

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(button).toHaveTextContent("Share link");
  });
});
