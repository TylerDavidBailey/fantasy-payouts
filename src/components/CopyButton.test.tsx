import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import CopyButton from "./CopyButton";

function stubClipboard(writeText: () => Promise<void>) {
  Object.defineProperty(window.navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
}

describe("CopyButton", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("copies the provided text and confirms", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    stubClipboard(writeText);
    render(<CopyButton text="1st — $500" />);

    fireEvent.click(screen.getByRole("button", { name: /copy results/i }));

    expect(await screen.findByRole("button", { name: /copied/i })).toBeInTheDocument();
    expect(writeText).toHaveBeenCalledWith("1st — $500");
  });

  it("announces the copy result via a live region", async () => {
    stubClipboard(vi.fn(() => Promise.resolve()));
    render(<CopyButton text="payouts" />);

    fireEvent.click(screen.getByRole("button", { name: /copy results/i }));

    expect(await screen.findByRole("status")).toHaveTextContent("Copied");
  });

  it("shows an error state when the clipboard write fails", async () => {
    stubClipboard(vi.fn(() => Promise.reject(new Error("denied"))));
    render(<CopyButton text="payouts" />);

    fireEvent.click(screen.getByRole("button", { name: /copy results/i }));

    expect(await screen.findByRole("button", { name: /copy failed/i })).toBeInTheDocument();
  });

  it("returns to idle after the confirmation delay", async () => {
    vi.useFakeTimers();
    stubClipboard(vi.fn(() => Promise.resolve()));
    render(<CopyButton text="payouts" />);
    const button = screen.getByRole("button");

    fireEvent.click(button);
    await act(() => Promise.resolve());

    expect(button).toHaveTextContent("Copied");

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(button).toHaveTextContent("Copy results");
  });
});
