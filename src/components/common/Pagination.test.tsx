import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Pagination } from "./Pagination";

describe("Pagination", () => {
  it("renders nothing when totalPages is 1", () => {
    const { container } = render(
      <Pagination currentPage={1} onPageChange={() => {}} totalPages={1} />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders page numbers and navigation buttons", () => {
    render(<Pagination currentPage={3} onPageChange={() => {}} totalPages={10} />);

    // 탐색 버튼들이 있는지 확인
    expect(screen.getByLabelText("첫 페이지로 이동")).toBeInTheDocument();
    expect(screen.getByLabelText("이전 페이지로 이동")).toBeInTheDocument();
    expect(screen.getByLabelText("다음 페이지로 이동")).toBeInTheDocument();
    expect(screen.getByLabelText("마지막 페이지로 이동")).toBeInTheDocument();

    // 현재 페이지가 표시되는지 확인
    expect(screen.getByLabelText("3페이지로 이동")).toHaveAttribute("aria-current", "page");
  });

  it("disables navigation buttons on first page", () => {
    render(<Pagination currentPage={1} onPageChange={() => {}} totalPages={5} />);

    expect(screen.getByLabelText("첫 페이지로 이동")).toBeDisabled();
    expect(screen.getByLabelText("이전 페이지로 이동")).toBeDisabled();
    expect(screen.getByLabelText("다음 페이지로 이동")).not.toBeDisabled();
    expect(screen.getByLabelText("마지막 페이지로 이동")).not.toBeDisabled();
  });

  it("disables navigation buttons on last page", () => {
    render(<Pagination currentPage={5} onPageChange={() => {}} totalPages={5} />);

    expect(screen.getByLabelText("첫 페이지로 이동")).not.toBeDisabled();
    expect(screen.getByLabelText("이전 페이지로 이동")).not.toBeDisabled();
    expect(screen.getByLabelText("다음 페이지로 이동")).toBeDisabled();
    expect(screen.getByLabelText("마지막 페이지로 이동")).toBeDisabled();
  });

  it("calls onPageChange when clicking page number", async () => {
    const user = userEvent.setup();
    let selectedPage = 1;

    render(
      <Pagination
        currentPage={1}
        onPageChange={(page) => {
          selectedPage = page;
        }}
        totalPages={5}
      />,
    );

    await user.click(screen.getByLabelText("3페이지로 이동"));
    expect(selectedPage).toBe(3);
  });

  it("calls onPageChange when clicking navigation buttons", async () => {
    const user = userEvent.setup();
    let selectedPage = 3;

    const { rerender } = render(
      <Pagination
        currentPage={selectedPage}
        onPageChange={(page) => {
          selectedPage = page;
        }}
        totalPages={10}
      />,
    );

    // 이전 페이지로
    await user.click(screen.getByLabelText("이전 페이지로 이동"));
    expect(selectedPage).toBe(2);

    // 컴포넌트 업데이트 후 다음 페이지로
    rerender(
      <Pagination
        currentPage={selectedPage}
        onPageChange={(page) => {
          selectedPage = page;
        }}
        totalPages={10}
      />,
    );

    await user.click(screen.getByLabelText("다음 페이지로 이동"));
    expect(selectedPage).toBe(3);
  });
});
