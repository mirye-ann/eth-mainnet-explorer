import { useQuery } from "@tanstack/react-query";

import { createEtherscanClient } from "@/models/api/etherscan-client";

/**
 * 최신 블록 번호를 조회하는 쿼리 훅.
 * 다른 쿼리에서 최신 블록 번호 기반으로 데이터를 가져올 때 사용합니다.
 */
export function useLatestBlockNumber() {
  return useQuery({
    queryFn: async () => {
      const client = createEtherscanClient();
      return client.getLatestBlockNumber();
    },
    queryKey: ["blocks", "latestNumber"],
    // 블록 생성 주기(~12초)를 고려하여 stale 시간 설정
    staleTime: 10 * 1000,
  });
}

type UseBlocksOptions = {
  /** 현재 페이지 번호 (1-indexed) */
  page: number;
  /** 페이지당 블록 수 */
  pageSize: number;
  /** 쿼리 활성화 여부 (최신 블록 번호가 로드된 후에만 활성화) */
  enabled?: boolean;
  /** 최신 블록 번호 (페이지네이션 계산용) */
  latestBlockNumber?: number;
};

/**
 * 특정 페이지의 블록 목록을 조회하는 쿼리 훅.
 *
 * 최신 블록부터 내림차순으로 블록을 가져옵니다.
 * 예: latestBlockNumber가 1000이고 page=1, pageSize=10이면
 *     블록 1000, 999, 998, ..., 991을 가져옵니다.
 */
export function useBlocks({ enabled = true, latestBlockNumber, page, pageSize }: UseBlocksOptions) {
  return useQuery({
    enabled: enabled && latestBlockNumber !== undefined && latestBlockNumber > 0,
    queryFn: async () => {
      if (latestBlockNumber === undefined) {
        throw new Error("latestBlockNumber is required");
      }

      const client = createEtherscanClient();

      // 페이지에 해당하는 블록 번호 범위 계산
      // page=1이면 latestBlockNumber부터 시작
      // page=2이면 latestBlockNumber - pageSize부터 시작
      const startBlock = latestBlockNumber - (page - 1) * pageSize;
      const endBlock = Math.max(startBlock - pageSize + 1, 0);

      // 블록 번호 배열 생성 (내림차순)
      const blockNumbers = [];
      for (let i = startBlock; i >= endBlock && i >= 0; i--) {
        blockNumbers.push(i);
      }

      // 병렬로 블록 데이터 조회
      const blocks = await Promise.all(blockNumbers.map((num) => client.getBlockByNumber(num)));

      return blocks;
    },
    queryKey: ["blocks", "list", { latestBlockNumber, page, pageSize }],
    // 블록 데이터는 불변이므로 긴 stale time 설정
    staleTime: 60 * 1000,
  });
}
