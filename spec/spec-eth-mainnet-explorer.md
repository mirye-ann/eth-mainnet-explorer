# Spec (Toy): Ethereum Mainnet Explorer - Next.js Only

## Project Info

- Repository name: `eth-mainnet-explorer`
- Visibility: Public
- Node.js version: 22.22.2
- Target blockchain: Ethereum Mainnet

## Defaults / Conventions

- 이 문서에 명시되지 않은 세부 구현은 최근 기준으로 널리 쓰이는 안정적이고 유지보수 가능한 Next.js + TypeScript 업계 관행을 따른다.
- 실험적/마이너/유행성 라이브러리 사용은 피하고, "범용적이고 문서가 풍부한" 선택을 우선한다.
- 구현 선택지가 생기면 다음 우선순위를 따른다: Next.js 권장 방식 > 단순성 > 유지보수성 > 성능.

## Ambiguities

- 스펙에 없는 내용이라도 결정이 결과에 큰 영향을 주는 경우는 임의로 결정하지 말고 먼저 질문한다.
- 단, 사소한 선택(파일명, 소규모 유틸 구조, 기본 ESLint/Prettier 설정 등)은 일반적인 관례로 진행한다.

## Repository Bootstrap

- 이 스펙을 기반으로 새 GitHub repository를 생성하는 절차(명령)를 단계별로 제시한다.
- 로컬에 `mkdir`로 폴더 생성 후 초기화하는 흐름을 포함한다:
  - `git init`
  - `.gitignore` 생성/설정
  - 초기 커밋 생성
  - 원격(origin) 추가 및 push
- (선택) GitHub CLI(`gh`)를 사용할 수 있으면 `gh repo create`로 레포 생성 명령을 제시한다.
- 레포 내에 스펙 문서를 함께 포함한다:
  - 경로: `spec/`
  - 파일명: `spec/spec-eth-mainnet-explorer.md`
- 스펙 파일도 커밋 대상에 포함한다.

## Repository / Workflow Rules

- Local development에서는 Docker를 사용하지 않는다.
- Docker는 stg/prod 배포용으로만 제공한다.

## Package Manager / Tooling

- Package manager: Yarn 1.22.22 (Classic)
- Node.js: 22.22.2 (engines field에 명시)
- Formatting: Prettier
- Lint: ESLint (Next.js 권장 구성 + Prettier 연동)
- Tests:
  - Unit/UI: Vitest + Testing Library 기본 설치, example 제공
  - E2E는 추후 병행 예정이므로 Playwright를 "추후 추가하기 쉬운 구조"로만 준비(필수 설치는 아님)

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- Server state: TanStack Query (React Query)
- Model: Zod

## Architecture (MVVM)

- MVVM 스타일을 따른다.
- View: React components/pages
- ViewModel: `useXxxViewModel()` hooks
- Model: API client

## Rendering

- 데이터가 방대한 경우 첫 진입 시에만 SSR 사용
- 부분 렌더링 혹은 이외의 경우는 CSR 사용

## External Upstream

- Ethereum Mainnet Explorer API를 사용하여 데이터를 조회(read-only).
- API key / rate limit 고려:
  - 키 필요 시 `.env.local`로 관리하고 gitignore
  - `.env.example` 제공

## Features

- Toy 프로젝트에 적합한 수준의 기본 Explorer 기능을 구현한다:
  - 최신 블록/트랜잭션 조회
  - 블록/트랜잭션/주소 상세 정보 조회

## Code Documentation / Comments

- 사람이 함께 작업하기 좋도록 코드에 주석을 작성한다.

## Local Development (No Docker)

- Next dev server: `http://localhost:3000`
- `.env.local`에 Explorer API 관련 설정 추가

## Docker (stg/prod)

- Next는 내부 3000
- 호스트 노출: `80:3000`
- Dockerfile 제공

## CI/CD (GitHub Actions)

- `scripts/release.js`는 사용하지 않고 GitHub Actions로 CI/CD를 구성한다.
- Container Registry는 GitHub Container Registry(GHCR)를 사용한다.

### CI (Pull Request)

- PR마다 실행한다.
- Yarn 기반으로 install/lint/format-check/test/build를 수행한다.
  - 세부 job 구성은 일반적으로 널리 쓰이는 관례에 따라 작성한다.

### CD (Release on tag -> Build & Push to GHCR)

- 태그는 사람이 수동으로 생성하여 push한다.
- Release 트리거: git tag push 시 `v*` 패턴 (예: `v1.2.3`)
- 버전 일치 규칙:
  - tag에서 `v` prefix를 제거한 값이 `package.json`의 `version`과 일치해야 한다.
  - 불일치하면 workflow를 실패 처리한다.
- 동작:
  1. 테스트/빌드 수행(필요 시 CI와 동일 단계 재사용)
  2. Docker image build
  3. GHCR 로그인 및 push
- Image naming:
  - GHCR image: `ghcr.io/<github_owner>/<github_repo>:<version>`
  - `<version>`은 `package.json version`을 사용한다.
- Permissions / Auth:
  - GitHub Actions의 `GITHUB_TOKEN`을 사용해 GHCR에 push한다.
  - workflow에는 `permissions: packages: write, contents: read`를 포함한다.

## Bundling / Performance (Optimization Requirements)

- 번들러를 Next.js 표준 도구 체인으로 최적화한다.
- 로컬 개발 시 Next.js 최신 개발 도구를 활용한다.
- 프로덕션 최적화:
  - 페이지/탭 단위로 `next/dynamic` 코드 스플리팅 적용
  - 필요 시 번들 분석 스크립트 제공(예: @next/bundle-analyzer)
