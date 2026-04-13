# 코드 스타일 가이드

이 문서는 `eth-mainnet-explorer` 프로젝트의 코드 스타일 규칙을 정의합니다.

## 주석 (Comments)

### 언어

- 모든 주석은 **한글**로 작성합니다.
- JSDoc 태그(`@param`, `@returns` 등)는 영어 키워드를 사용하되, 설명은 한글로 작성합니다.

### 함수/컴포넌트 문서화

```typescript
/**
 * 블록 목록을 테이블 형태로 표시하는 컴포넌트.
 * 각 행을 클릭하면 해당 블록 상세 페이지로 이동합니다.
 *
 * @example
 * <BlockList blocks={blocks} />
 */
export function BlockList({ blocks }: BlockListProps) { ... }
```

### 인라인 주석

- 복잡한 로직이나 비즈니스 규칙에 대해서만 주석을 답니다.
- 자명한 코드에는 주석을 달지 않습니다.

```typescript
// ✅ 좋은 예: 왜 이렇게 하는지 설명
// 블록 번호가 0부터 시작하므로 +1
return Math.ceil((latestBlockNumber + 1) / pageSize);

// ❌ 나쁜 예: 코드가 하는 일을 반복
// pageSize로 나눈다
return total / pageSize;
```

## 파일 명명 (File Naming)

### 규칙

| 유형     | 패턴                      | 예시                                             |
| -------- | ------------------------- | ------------------------------------------------ |
| 컴포넌트 | PascalCase                | `BlockList.tsx`, `SearchBar.tsx`                 |
| 훅       | kebab-case, `use-` 접두사 | `use-blocks-query.ts`, `use-blocks-viewmodel.ts` |
| 유틸리티 | kebab-case                | `format-utils.ts`, `etherscan-client.ts`         |
| 테스트   | 원본파일명 + `.test`      | `BlockList.test.tsx`, `SearchBar.test.tsx`       |
| 스키마   | kebab-case                | `block.ts`, `transaction.ts`                     |

### 폴더 구조

```
src/
├── app/                    # Next.js App Router 페이지
│   └── [route]/
│       ├── page.tsx        # 서버 컴포넌트 (메타데이터)
│       └── [route]-content.tsx  # 클라이언트 컴포넌트
├── components/
│   ├── common/             # 공통 UI 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트 (Header, Footer)
│   └── [feature]/          # 기능별 컴포넌트 (blocks/, transactions/)
├── hooks/
│   └── queries/            # TanStack Query 훅
├── models/
│   ├── api/                # API 클라이언트
│   └── schemas/            # Zod 스키마
├── providers/              # React Context Provider
└── viewmodels/             # MVVM ViewModel 훅
```

## 컴포넌트 구조 (Component Structure)

### Props 타입 정의

- `type`을 사용합니다 (interface 대신).
- `Readonly<>` 래퍼를 사용하여 불변성을 명시합니다.

```typescript
type BlockListProps = Readonly<{
  blocks: Block[];
  className?: string;
}>;
```

### 컴포넌트 선언

- 함수 선언문(`function`)을 사용합니다.
- `export function`으로 직접 내보냅니다.

```typescript
// ✅ 좋은 예
export function BlockList({ blocks, className = "" }: BlockListProps) { ... }

// ❌ 피할 것
const BlockList: React.FC<BlockListProps> = ({ blocks }) => { ... };
export default BlockList;
```

### className 조합

- 배열 + `filter(Boolean).join(" ")` 패턴을 사용합니다.

```typescript
className={["base-class", conditional && "conditional-class", className]
  .filter(Boolean)
  .join(" ")}
```

## 테스트 (Testing)

### 테스트 파일 위치

- 테스트 파일은 **원본 파일과 같은 폴더**에 위치합니다.
- E2E 테스트는 `tests/e2e/` 폴더에 위치합니다.

### 테스트 명명

```typescript
describe("BlockList", () => {
  it("renders block data in table format", () => { ... });
  it("shows empty message when no blocks", () => { ... });
});
```

### 테스트 패턴

- `@testing-library/react`의 `render`, `screen` 사용
- 사용자 상호작용은 `@testing-library/user-event` 사용
- `vitest`의 `describe`, `it`, `expect` 사용
