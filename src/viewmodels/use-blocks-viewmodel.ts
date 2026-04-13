"use client";

import { useCallback, useMemo, useState } from "react";

import { useBlocks, useLatestBlockNumber } from "@/hooks/queries/use-blocks-query";

/** 기본 페이지 크기 */
const DEFAULT_PAGE_SIZE = 10;

/** 페이지 크기 옵션들 */
export const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;

type UseBlocksViewModelOptions = {
  /** 초기 페이지 (기본값: 1) */
  initialPage?: number;
  /** 초기 페이지 크기 (기본값: 10) */
  initialPageSize?: number;
};

/**
 * 블록 목록 페이지의 ViewModel 훅.
 *
 * MVVM 패턴에 따라 View에서 필요한 상태와 액션을 제공합니다:
 * - 블록 데이터 및 로딩/에러 상태
 * - 페이지네이션 상태 및 제어 함수
 * - 페이지 크기 설정
 *
 * @example
 * const vm = useBlocksViewModel();
 *
 * if (vm.isLoading) return <Loading />;
 * if (vm.error) return <Error message={vm.error} />;
 *
 * return (
 *   <>
 *     <BlockList blocks={vm.blocks} />
 *     <Pagination
 *       currentPage={vm.currentPage}
 *       totalPages={vm.totalPages}
 *       onPageChange={vm.goToPage}
 *     />
 *   </>
 * );
 */
export function useBlocksViewModel(options: UseBlocksViewModelOptions = {}) {
  const { initialPage = 1, initialPageSize = DEFAULT_PAGE_SIZE } = options;

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // 최신 블록 번호 조회
  const latestBlockQuery = useLatestBlockNumber();

  // 블록 목록 조회 (최신 블록 번호가 있을 때만 활성화)
  const blocksQuery = useBlocks({
    enabled: latestBlockQuery.isSuccess,
    latestBlockNumber: latestBlockQuery.data,
    page: currentPage,
    pageSize,
  });

  // 전체 페이지 수 계산
  const totalPages = useMemo(() => {
    if (!latestBlockQuery.data) return 0;
    // 블록 번호가 0부터 시작하므로 +1
    return Math.ceil((latestBlockQuery.data + 1) / pageSize);
  }, [latestBlockQuery.data, pageSize]);

  // 페이지 변경 핸들러
  const goToPage = useCallback(
    (page: number) => {
      if (page < 1 || page > totalPages) return;
      setCurrentPage(page);
    },
    [totalPages],
  );

  // 페이지 크기 변경 핸들러 (페이지를 1로 리셋)
  const changePageSize = useCallback((size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  // 에러 메시지 추출
  const error = useMemo(() => {
    if (latestBlockQuery.error) {
      return latestBlockQuery.error.message;
    }
    if (blocksQuery.error) {
      return blocksQuery.error.message;
    }
    return null;
  }, [latestBlockQuery.error, blocksQuery.error]);

  return {
    // 데이터
    blocks: blocksQuery.data ?? [],
    latestBlockNumber: latestBlockQuery.data ?? null,

    // 로딩/에러 상태
    error,
    isLoading: latestBlockQuery.isLoading || blocksQuery.isLoading,
    isRefetching: latestBlockQuery.isRefetching || blocksQuery.isRefetching,

    // 페이지네이션 상태
    currentPage,
    pageSize,
    totalPages,

    // 페이지네이션 액션
    changePageSize,
    goToPage,

    // 리프레시 액션
    refetch: latestBlockQuery.refetch,
  } as const;
}
