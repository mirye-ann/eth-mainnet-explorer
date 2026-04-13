"use client";

import Link from "next/link";

import { BlockInfoCard, BlockTransactionList } from "@/components/blocks/BlockDetail";
import { Button } from "@/components/common/Button";
import { Loading } from "@/components/common/Loading";
import { useBlockDetailViewModel } from "@/viewmodels/use-block-detail-viewmodel";

type BlockDetailContentProps = Readonly<{
  /** URL 파라미터로 받은 블록 번호 문자열 */
  blockNumberParam: string;
}>;

/**
 * 블록 상세 페이지의 클라이언트 컴포넌트.
 *
 * URL 파라미터를 파싱하여 블록 번호를 추출하고,
 * useBlockDetailViewModel을 통해 데이터와 상태를 관리합니다.
 */
export function BlockDetailContent({ blockNumberParam }: BlockDetailContentProps) {
  // 블록 번호 파싱 및 유효성 검사
  const blockNumber = parseInt(blockNumberParam, 10);
  const isValidBlockNumber = !isNaN(blockNumber) && blockNumber >= 0;

  // 유효하지 않은 블록 번호인 경우
  if (!isValidBlockNumber) {
    return (
      <div className="py-12 text-center">
        <h1 className="mb-4 text-2xl font-bold">잘못된 블록 번호</h1>
        <p className="mb-6 text-muted">
          &quot;{blockNumberParam}&quot;은(는) 유효한 블록 번호가 아닙니다.
        </p>
        <Link href="/blocks">
          <Button>블록 목록으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return <BlockDetailView blockNumber={blockNumber} />;
}

type BlockDetailViewProps = Readonly<{
  blockNumber: number;
}>;

/**
 * 유효한 블록 번호가 확인된 후 렌더링되는 뷰 컴포넌트.
 */
function BlockDetailView({ blockNumber }: BlockDetailViewProps) {
  const vm = useBlockDetailViewModel({ blockNumber });

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">블록 #{blockNumber.toLocaleString()}</h1>
        </div>
        <div className="flex gap-2">
          {/* 이전/다음 블록 네비게이션 */}
          {blockNumber > 0 && (
            <Link href={`/block/${blockNumber - 1}`}>
              <Button variant="secondary">← 이전 블록</Button>
            </Link>
          )}
          <Link href={`/block/${blockNumber + 1}`}>
            <Button variant="secondary">다음 블록 →</Button>
          </Link>
        </div>
      </div>

      {/* 로딩 상태 */}
      {vm.isLoading && (
        <div className="flex justify-center py-12">
          <Loading label="블록 정보를 불러오는 중입니다..." />
        </div>
      )}

      {/* 에러 상태 */}
      {vm.error && !vm.isLoading && (
        <div className="py-12 text-center">
          <p className="text-red-500">{vm.error}</p>
          <button
            className="mt-4 text-sm text-accent hover:underline"
            onClick={() => vm.refetch()}
            type="button"
          >
            다시 시도
          </button>
        </div>
      )}

      {/* 블록 정보 및 트랜잭션 목록 */}
      {!vm.isLoading && !vm.error && vm.block && (
        <>
          <BlockInfoCard block={vm.block} />
          <BlockTransactionList transactions={vm.transactions} />
        </>
      )}
    </div>
  );
}
