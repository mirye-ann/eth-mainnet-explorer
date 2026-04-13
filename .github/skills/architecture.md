# 아키텍처 가이드

이 문서는 `eth-mainnet-explorer` 프로젝트의 아키텍처 패턴을 정의합니다.

## MVVM 패턴 (Model-View-ViewModel)

### 개요

```
┌─────────────────────────────────────────────────────────┐
│                        View                             │
│  (React 컴포넌트 - page.tsx, components/)               │
│                         │                               │
│                         ▼                               │
│                    ViewModel                            │
│  (useXxxViewModel 훅 - viewmodels/)                     │
│                         │                               │
│                         ▼                               │
│                      Model                              │
│  (API 클라이언트, Zod 스키마 - models/)                 │
└─────────────────────────────────────────────────────────┘
```

### View (뷰)

- **위치**: `src/app/`, `src/components/`
- **역할**: UI 렌더링, 사용자 입력 처리
- **규칙**:
  - 비즈니스 로직을 포함하지 않습니다.
  - ViewModel에서 상태와 액션을 받아 사용합니다.

```typescript
// src/app/blocks/blocks-content.tsx
export function BlocksPageContent() {
  const vm = useBlocksViewModel();

  if (vm.isLoading) return <Loading />;
  if (vm.error) return <ErrorMessage message={vm.error} />;

  return <BlockList blocks={vm.blocks} />;
}
```

### ViewModel (뷰모델)

- **위치**: `src/viewmodels/`
- **파일명**: `use-[feature]-viewmodel.ts`
- **역할**: View에 필요한 상태와 액션을 제공
- **규칙**:
  - Query 훅을 조합하여 데이터를 가공합니다.
  - 에러 메시지를 사용자 친화적으로 변환합니다.
  - UI 상태(로딩, 페이지네이션 등)를 관리합니다.

```typescript
// src/viewmodels/use-blocks-viewmodel.ts
export function useBlocksViewModel() {
  const [currentPage, setCurrentPage] = useState(1);
  const latestBlockQuery = useLatestBlockNumber();
  const blocksQuery = useBlocks({ page: currentPage, ... });

  return {
    // 데이터
    blocks: blocksQuery.data ?? [],

    // 상태
    isLoading: blocksQuery.isLoading,
    error: blocksQuery.error?.message ?? null,

    // 페이지네이션
    currentPage,
    totalPages,

    // 액션
    goToPage: (page: number) => setCurrentPage(page),
  } as const;
}
```

### Model (모델)

- **위치**: `src/models/`
- **역할**: 데이터 구조 정의, API 통신
- **하위 구조**:
  - `schemas/`: Zod 스키마 (데이터 검증 및 변환)
  - `api/`: API 클라이언트

```typescript
// src/models/schemas/block.ts
export const blockSchema = z.object({ ... }).transform((data) => ({ ... }));
export type Block = z.infer<typeof blockSchema>;

// src/models/api/etherscan-client.ts
export class EtherscanClient {
  async getBlockByNumber(blockNumber: number): Promise<Block> { ... }
}
```

## TanStack Query 훅 (Query Hooks)

### 위치

- `src/hooks/queries/`

### 파일명

- `use-[resource]-query.ts`
- 예: `use-blocks-query.ts`, `use-transaction-query.ts`

### 구조

```typescript
// src/hooks/queries/use-blocks-query.ts
import { useQuery } from "@tanstack/react-query";
import { createEtherscanClient } from "@/models/api/etherscan-client";

/**
 * 특정 블록 번호의 블록 정보를 조회하는 쿼리 훅.
 */
export function useBlockByNumber(blockNumber: number) {
  return useQuery({
    queryKey: ["blocks", "detail", blockNumber],
    queryFn: async () => {
      const client = createEtherscanClient();
      return client.getBlockByNumber(blockNumber);
    },
    enabled: blockNumber >= 0,
    staleTime: 60 * 1000, // 블록 데이터는 불변이므로 긴 stale time
  });
}
```

### Query Key 규칙

```typescript
// 계층적 구조 사용
["blocks", "latestNumber"][("blocks", "list", { page, size })][("blocks", "detail", blockNumber)][ // 최신 블록 번호 // 블록 목록 (페이지네이션 파라미터 포함) // 블록 상세
  ("transactions", "detail", hash)
][("address", "overview", address)]; // 트랜잭션 상세 // 주소 개요
```

### staleTime 가이드

| 데이터 유형    | staleTime | 이유                        |
| -------------- | --------- | --------------------------- |
| 최신 블록 번호 | 10초      | 블록 생성 주기 (~12초) 고려 |
| 블록 상세      | 60초+     | 블록 데이터는 불변          |
| 트랜잭션 상세  | 60초+     | 확정된 트랜잭션은 불변      |
| 주소 잔액      | 30초      | 자주 변경될 수 있음         |

## 페이지 구조 (Page Structure)

### Next.js App Router 페이지

```
src/app/[route]/
├── page.tsx           # 서버 컴포넌트 (메타데이터, SSR)
└── [route]-content.tsx  # 클라이언트 컴포넌트 (CSR, 인터랙션)
```

### 서버 컴포넌트 (page.tsx)

```typescript
import type { Metadata } from "next";
import { BlockDetailContent } from "./block-detail-content";

export const metadata: Metadata = {
  title: "블록 상세 | Ethereum Explorer",
  description: "이더리움 블록 상세 정보를 조회합니다.",
};

export default function BlockDetailPage() {
  return <BlockDetailContent />;
}
```

### 클라이언트 컴포넌트 ([route]-content.tsx)

```typescript
"use client";

import { useBlockDetailViewModel } from "@/viewmodels/use-block-detail-viewmodel";

export function BlockDetailContent() {
  const vm = useBlockDetailViewModel();
  // ...
}
```

## 렌더링 전략 (Rendering Strategy)

### 기본 원칙 (spec.md 기준)

- **첫 진입 시**: SSR 사용 (대용량 데이터)
- **이후 탐색/부분 렌더링**: CSR 사용

### 현재 구현

- 대부분의 페이지는 **CSR** (TanStack Query 사용)
- 메타데이터는 서버 컴포넌트에서 정적으로 제공

### SSR이 필요한 경우 (향후)

```typescript
// 서버 컴포넌트에서 데이터 프리페칭
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function Page() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({ ... });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PageContent />
    </HydrationBoundary>
  );
}
```

## 코드 스플리팅 (Code Splitting)

### next/dynamic 사용

무거운 컴포넌트나 조건부 렌더링 컴포넌트는 `next/dynamic`을 사용하여 번들을 분리합니다.

```typescript
import dynamic from "next/dynamic";

// 차트 컴포넌트는 무거우므로 동적 임포트
const TransactionChart = dynamic(() => import("@/components/charts/TransactionChart"), {
  loading: () => <Loading />,
  ssr: false, // 클라이언트 전용 컴포넌트
});

// 모달은 초기 로드 시 불필요
const DetailModal = dynamic(() => import("@/components/modals/DetailModal"));
```

### 적용 기준

| 컴포넌트 유형          | 동적 임포트 권장 |
| ---------------------- | ---------------- |
| 차트/그래프 라이브러리 | ✅               |
| 모달/다이얼로그        | ✅               |
| 조건부 렌더링 (탭 등)  | ✅               |
| 핵심 UI 컴포넌트       | ❌               |
| 레이아웃 컴포넌트      | ❌               |

## 개발 환경 (Development Environment)

### Docker 사용 규칙

| 환경              | Docker 사용   |
| ----------------- | ------------- |
| 로컬 개발         | ❌ 사용 안 함 |
| 스테이징/프로덕션 | ✅ 사용       |

- 로컬에서는 `yarn dev`로 직접 실행
- Docker 관련 작업은 CI/CD 또는 배포 시에만 진행
