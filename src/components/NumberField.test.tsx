import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import NumberField from "./NumberField";

function renderField(overrides: Partial<Parameters<typeof NumberField>[0]> = {}) {
  const onCommit = vi.fn();
  render(
    <NumberField
      label="Number of entries"
      value={10}
      min={1}
      max={100}
      onCommit={onCommit}
      {...overrides}
    />,
  );

  return { onCommit, input: screen.getByLabelText<HTMLInputElement>(/number of entries/i) };
}

describe("NumberField", () => {
  it("shows the current value", () => {
    const { input } = renderField();

    expect(input).toHaveValue(10);
  });

  it("renders an optional prefix", () => {
    renderField({ prefix: "$" });

    expect(screen.getByText("$")).toBeInTheDocument();
  });

  it("commits every parseable value while typing", async () => {
    const user = userEvent.setup();
    const { onCommit, input } = renderField();

    await user.clear(input);
    await user.type(input, "25");

    expect(onCommit).toHaveBeenNthCalledWith(1, 2);
    expect(onCommit).toHaveBeenNthCalledWith(2, 25);
  });

  it("does not commit while the input is empty", async () => {
    const user = userEvent.setup();
    const { onCommit, input } = renderField();

    await user.clear(input);

    expect(onCommit).not.toHaveBeenCalled();
  });

  it("snaps back to the sanitized value on blur", async () => {
    const user = userEvent.setup();
    const { input } = renderField();

    await user.clear(input);
    await user.tab();

    expect(input).toHaveValue(10);
  });

  it("reflects external value changes while not focused", () => {
    const onCommit = vi.fn();
    const { rerender } = render(
      <NumberField label="Payout spots" value={8} min={1} max={100} onCommit={onCommit} />,
    );

    rerender(
      <NumberField label="Payout spots" value={5} min={1} max={100} onCommit={onCommit} />,
    );

    expect(screen.getByLabelText<HTMLInputElement>(/payout spots/i)).toHaveValue(5);
  });
});
