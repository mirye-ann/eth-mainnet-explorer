"use client";

import { useMemo } from "react";

import { useBlockByNumber } from "@/hooks/queries/use-block-detail-query";

type UseBlockDetailViewModelOptions = {
  /** 조회할 블록 번호 */
  blockNumber: number;
};

/**
 * 블록 상세 페이지의 ViewModel 훅.
 *
 * MVVM 패턴에 따라 View에서 필요한 상태와 데이터를 제공합니다:
 * - 블록 상세 정보
 * - 블록에 포함된 트랜잭션 목록
 * - 로딩/에러 상태
 *
 * @example
 * const vm = useBlockDetailViewModel({ blockNumber: 12345678 });
 *
 * if (vm.isLoading) return <Loading />;
 * if (vm.error) return <Error message={vm.error} />;
 *
 * return <BlockDetail block={vm.block} />;
 */
export function useBlockDetailViewModel({ blockNumber }: UseBlockDetailViewModelOptions) {
  const blockQuery = useBlockByNumber(blockNumber);

  // 에러 메시지 추출
  const error = useMemo(() => {
    if (blockQuery.error) {
      return blockQuery.error.message;
    }
    return null;
  }, [blockQuery.error]);

  // 포맷된 블록 정보 (View에서 사용하기 쉬운 형태로 가공)
  const formattedBlock = useMemo(() => {
    if (!blockQuery.data) return null;

    const block = blockQuery.data;
    const date = new Date(block.timestamp * 1000);

    return {
      ...block,
      // 사람이 읽기 쉬운 형태의 타임스탬프
      formattedTimestamp: date.toLocaleString("ko-KR", {
        day: "2-digit",
        hour: "2-digit",
        hour12: false,
        minute: "2-digit",
        month: "2-digit",
        second: "2-digit",
        year: "numeric",
      }),
      // Gas 사용률
      gasUsagePercent: calculateGasUsagePercent(block.gasUsed, block.gasLimit),
    };
  }, [blockQuery.data]);

  return {
    // 데이터
    block: formattedBlock,
    transactions: blockQuery.data?.transactions ?? [],

    // 로딩/에러 상태
    error,
    isLoading: blockQuery.isLoading,

    // 리프레시 액션
    refetch: blockQuery.refetch,
  } as const;
}

/**
 * Gas 사용률을 백분율로 계산합니다.
 */
function calculateGasUsagePercent(gasUsed: string, gasLimit: string): string {
  const used = BigInt(gasUsed);
  const limit = BigInt(gasLimit);

  if (limit === BigInt(0)) return "0.00";

  const percent = (Number(used) / Number(limit)) * 100;
  return percent.toFixed(2);
}
