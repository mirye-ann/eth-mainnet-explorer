"use client";

import { BlockList } from "@/components/blocks/BlockList";
import { Card } from "@/components/common/Card";
import { Loading } from "@/components/common/Loading";
import { PageSizeSelector } from "@/components/common/PageSizeSelector";
import { Pagination } from "@/components/common/Pagination";
import { PAGE_SIZE_OPTIONS, useBlocksViewModel } from "@/viewmodels/use-blocks-viewmodel";

/**
 * 최신 블록 목록 페이지의 클라이언트 컴포넌트.
 *
 * useBlocksViewModel을 통해 데이터와 상태를 관리하며,
 * 페이지네이션과 페이지 크기 설정 기능을 제공합니다.
 */
export function BlocksPageContent() {
  const vm = useBlocksViewModel();

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">최신 블록</h1>
          {vm.latestBlockNumber !== null && (
            <p className="mt-1 text-sm text-muted">
              최신 블록: #{vm.latestBlockNumber.toLocaleString()}
            </p>
          )}
        </div>

        {/* 페이지 크기 선택기 */}
        <PageSizeSelector
          disabled={vm.isLoading}
          onChange={vm.changePageSize}
          options={[...PAGE_SIZE_OPTIONS]}
          value={vm.pageSize}
        />
      </div>

      {/* 메인 콘텐츠 영역 */}
      <Card>
        {/* 로딩 상태 */}
        {vm.isLoading && (
          <div className="flex justify-center py-12">
            <Loading label="블록 데이터를 불러오는 중입니다..." />
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

        {/* 블록 목록 */}
        {!vm.isLoading && !vm.error && <BlockList blocks={vm.blocks} />}
      </Card>

      {/* 페이지네이션 */}
      {!vm.isLoading && !vm.error && vm.totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={vm.currentPage}
            disabled={vm.isRefetching}
            onPageChange={vm.goToPage}
            totalPages={vm.totalPages}
          />
        </div>
      )}
    </div>
  );
}
