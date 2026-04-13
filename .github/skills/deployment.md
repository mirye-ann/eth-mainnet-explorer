# 배포 및 최적화 가이드

이 문서는 배포 환경 설정과 번들 최적화에 관한 가이드를 정의합니다.

## Docker 사용 규칙

| 환경              | Docker 사용   |
| ----------------- | ------------- |
| 로컬 개발         | ❌ 사용 안 함 |
| 스테이징/프로덕션 | ✅ 사용       |

- 로컬에서는 `yarn dev`로 직접 실행
- Docker 관련 작업은 CI/CD 또는 배포 시에만 진행

## 코드 스플리팅 (Code Splitting)

### next/dynamic 사용

무거운 컴포넌트나 조건부 렌더링 컴포넌트는 `next/dynamic`을 사용하여 번들을 분리합니다.

```typescript
import dynamic from "next/dynamic";

// 차트 컴포넌트는 무거우므로 동적 임포트
const TransactionChart = dynamic(
  () => import("@/components/charts/TransactionChart"),
  {
    loading: () => <Loading />,
    ssr: false, // 클라이언트 전용 컴포넌트
  }
);

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

## CI/CD 워크플로우

### 브랜치 전략

- `develop`: 개발 브랜치 (기본 작업 브랜치)
- `main`: 프로덕션 브랜치

### 배포 흐름

```
feature/* → develop → main → production
```

### GitHub Actions (예정)

- PR 생성 시: 린트, 테스트, 빌드 검증
- main 머지 시: Docker 이미지 빌드 및 GHCR 푸시
- 릴리스 태그 시: 프로덕션 배포

## 환경 변수

### 로컬 개발

`.env.local` 파일 사용:

```bash
NEXT_PUBLIC_ETHERSCAN_API_KEY=your_api_key
```

### 배포 환경

- GitHub Secrets 또는 환경별 설정 사용
- `NEXT_PUBLIC_` 접두사: 클라이언트에 노출되는 변수
- 접두사 없음: 서버 전용 변수
