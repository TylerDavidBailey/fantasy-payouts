import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { defaultConfig, presets } from "../lib/payouts";
import PresetPicker from "./PresetPicker";

describe("PresetPicker", () => {
  it("renders a chip for every preset", () => {
    render(<PresetPicker config={defaultConfig} onSelect={vi.fn()} />);

    const chips = screen.getAllByRole("button");

    expect(chips.map((chip) => chip.textContent)).toEqual(presets.map((preset) => preset.name));
  });

  it("marks only the preset matching the current config as active", () => {
    const { name: activeName, ...activeConfig } = presets[1];
    render(<PresetPicker config={activeConfig} onSelect={vi.fn()} />);

    for (const chip of screen.getAllByRole("button")) {
      if (chip.textContent === activeName) {
        expect(chip).toHaveClass("is-active");
      } else {
        expect(chip).not.toHaveClass("is-active");
      }
    }
  });

  it("notifies when a preset is chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<PresetPicker config={defaultConfig} onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: presets[2].name }));

    expect(onSelect).toHaveBeenCalledWith(presets[2]);
  });
});
