import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { SearchBar } from "./SearchBar";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
  }),
}));

describe("SearchBar", () => {
  beforeEach(() => {
    push.mockReset();
  });

  it("routes block number searches to the block detail path", () => {
    render(<SearchBar />);

    fireEvent.change(screen.getByLabelText("Search input"), {
      target: { value: "12345" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Search" }));

    expect(push).toHaveBeenCalledWith("/block/12345");
  });

  it("shows an error for unsupported input", () => {
    render(<SearchBar />);

    fireEvent.change(screen.getByLabelText("Search input"), {
      target: { value: "not-a-valid-query" },
    });
    fireEvent.submit(screen.getByRole("button", { name: "Search" }));

    expect(screen.getByRole("alert")).toHaveTextContent(
      "블록 번호, 트랜잭션 해시, 주소 형식 중 하나로 입력해주세요.",
    );
    expect(push).not.toHaveBeenCalled();
  });
});
