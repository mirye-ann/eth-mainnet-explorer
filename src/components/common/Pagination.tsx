"use client";

import { Button } from "./Button";

type PaginationProps = Readonly<{
  /** 현재 페이지 번호 (1-indexed) */
  currentPage: number;
  /** 전체 페이지 수 */
  totalPages: number;
  /** 페이지 변경 시 호출되는 콜백 */
  onPageChange: (page: number) => void;
  /** 페이지 버튼 양쪽에 표시할 페이지 수 (기본값: 2) */
  siblingCount?: number;
  /** 로딩 상태일 때 버튼 비활성화 */
  disabled?: boolean;
  className?: string;
}>;

/**
 * 페이지 번호와 이동 버튼(처음/이전/다음/마지막)을 포함하는 페이지네이션 컴포넌트.
 *
 * @example
 * <Pagination
 *   currentPage={1}
 *   totalPages={10}
 *   onPageChange={(page) => setPage(page)}
 * />
 */
export function Pagination({
  className = "",
  currentPage,
  disabled = false,
  onPageChange,
  siblingCount = 2,
  totalPages,
}: PaginationProps) {
  // 페이지가 없거나 1페이지 이하면 표시하지 않음
  if (totalPages <= 1) return null;

  // 현재 페이지 주변에 표시할 페이지 범위 계산
  const pageNumbers = generatePageNumbers(currentPage, totalPages, siblingCount);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <nav
      aria-label="페이지 네비게이션"
      className={["flex items-center justify-center gap-1", className].filter(Boolean).join(" ")}
    >
      {/* 맨 앞으로 버튼 */}
      <Button
        aria-label="첫 페이지로 이동"
        disabled={disabled || isFirstPage}
        onClick={() => onPageChange(1)}
        variant="secondary"
      >
        «
      </Button>

      {/* 이전 버튼 */}
      <Button
        aria-label="이전 페이지로 이동"
        disabled={disabled || isFirstPage}
        onClick={() => onPageChange(currentPage - 1)}
        variant="secondary"
      >
        ‹
      </Button>

      {/* 페이지 번호들 */}
      {pageNumbers.map((pageNumber, index) => {
        if (pageNumber === "ellipsis") {
          return (
            <span
              className="flex h-10 w-10 items-center justify-center text-muted"
              key={`ellipsis-${index}`}
            >
              …
            </span>
          );
        }

        const isActive = pageNumber === currentPage;

        return (
          <Button
            aria-current={isActive ? "page" : undefined}
            aria-label={`${pageNumber}페이지로 이동`}
            className={isActive ? "ring-2 ring-accent" : ""}
            disabled={disabled}
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            variant={isActive ? "primary" : "secondary"}
          >
            {pageNumber}
          </Button>
        );
      })}

      {/* 다음 버튼 */}
      <Button
        aria-label="다음 페이지로 이동"
        disabled={disabled || isLastPage}
        onClick={() => onPageChange(currentPage + 1)}
        variant="secondary"
      >
        ›
      </Button>

      {/* 맨 뒤로 버튼 */}
      <Button
        aria-label="마지막 페이지로 이동"
        disabled={disabled || isLastPage}
        onClick={() => onPageChange(totalPages)}
        variant="secondary"
      >
        »
      </Button>
    </nav>
  );
}

type PageItem = number | "ellipsis";

/**
 * 페이지네이션에 표시할 페이지 번호 배열을 생성합니다.
 * 현재 페이지 양쪽에 siblingCount만큼의 페이지를 표시하고,
 * 생략된 구간은 "ellipsis"로 표시합니다.
 */
function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number,
): PageItem[] {
  // 총 표시할 최대 버튼 수: 첫 페이지 + 마지막 페이지 + 현재 페이지 + 양쪽 siblings + 2 ellipsis
  const totalDisplayed = siblingCount * 2 + 5;

  // 전체 페이지 수가 충분히 적으면 모든 페이지 표시
  if (totalPages <= totalDisplayed) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  // 좌측/우측에 ellipsis가 필요한지 판단
  const showLeftEllipsis = leftSiblingIndex > 2;
  const showRightEllipsis = rightSiblingIndex < totalPages - 1;

  const items: PageItem[] = [];

  // 항상 첫 페이지 표시
  items.push(1);

  // 좌측 ellipsis 또는 2페이지
  if (showLeftEllipsis) {
    items.push("ellipsis");
  } else if (leftSiblingIndex > 1) {
    // 첫 페이지와 왼쪽 sibling 사이에 간격이 있으면 해당 페이지들 추가
    for (let i = 2; i < leftSiblingIndex; i++) {
      items.push(i);
    }
  }

  // 현재 페이지 주변 페이지들
  for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
    if (i !== 1 && i !== totalPages) {
      items.push(i);
    }
  }

  // 우측 ellipsis 또는 마지막-1 페이지
  if (showRightEllipsis) {
    items.push("ellipsis");
  } else if (rightSiblingIndex < totalPages) {
    // 오른쪽 sibling과 마지막 페이지 사이에 간격이 있으면 해당 페이지들 추가
    for (let i = rightSiblingIndex + 1; i < totalPages; i++) {
      items.push(i);
    }
  }

  // 항상 마지막 페이지 표시 (첫 페이지와 같지 않은 경우)
  if (totalPages > 1) {
    items.push(totalPages);
  }

  return items;
}
