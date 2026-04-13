import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PageSizeSelector } from "./PageSizeSelector";

describe("PageSizeSelector", () => {
  it("renders with default options", () => {
    render(<PageSizeSelector onChange={() => {}} value={10} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(select).toHaveValue("10");

    // 기본 옵션들이 있는지 확인
    expect(screen.getByRole("option", { name: "10" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "20" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "50" })).toBeInTheDocument();
  });

  it("renders with custom options", () => {
    render(<PageSizeSelector onChange={() => {}} options={[5, 10, 25]} value={5} />);

    expect(screen.getByRole("option", { name: "5" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "10" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "25" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: "50" })).not.toBeInTheDocument();
  });

  it("calls onChange when selection changes", async () => {
    const user = userEvent.setup();
    let selectedSize = 10;

    render(
      <PageSizeSelector
        onChange={(size) => {
          selectedSize = size;
        }}
        value={10}
      />,
    );

    await user.selectOptions(screen.getByRole("combobox"), "20");
    expect(selectedSize).toBe(20);
  });

  it("is disabled when disabled prop is true", () => {
    render(<PageSizeSelector disabled onChange={() => {}} value={10} />);

    expect(screen.getByRole("combobox")).toBeDisabled();
  });
});
