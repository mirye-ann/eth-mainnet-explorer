import { useQuery } from "@tanstack/react-query";

import { createEtherscanClient } from "@/models/api/etherscan-client";

/**
 * 특정 블록 번호의 블록 상세 정보를 조회하는 쿼리 훅.
 *
 * @param blockNumber - 조회할 블록 번호
 */
export function useBlockByNumber(blockNumber: number) {
  return useQuery({
    enabled: Number.isInteger(blockNumber) && blockNumber >= 0,
    queryFn: async () => {
      const client = createEtherscanClient();
      return client.getBlockByNumber(blockNumber);
    },
    queryKey: ["blocks", "detail", blockNumber],
    // 블록 데이터는 불변이므로 긴 stale time 설정
    staleTime: 60 * 1000,
  });
}
