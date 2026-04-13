# eth-mainnet-explorer

Ethereum Mainnet 데이터를 조회하는 **Next.js + TypeScript 기반 Toy Explorer** 프로젝트입니다.  
현재 저장소는 초기 부트스트랩 단계이며, 이후 이슈 순서대로 기능을 확장합니다.

## Project defaults

- **Node.js**: `22.22.2`
- **Package manager**: `Yarn 1.22.22 (Classic)`
- **Framework**: `Next.js (App Router)`
- **Architecture**: `MVVM`
- **API target**: `Ethereum Mainnet`

## Repository bootstrap

아래 절차는 이 저장소를 처음부터 다시 구성할 때 기준으로 사용할 수 있는 명령 모음입니다.

### 1. 로컬 폴더 생성 및 git 초기화

```bash
mkdir eth-mainnet-explorer
cd eth-mainnet-explorer
git init
git branch -M main
```

### 2. 기본 파일 준비

다음 파일을 생성하고 커밋 대상에 포함합니다.

- `.gitignore`
- `README.md`
- `spec/spec-eth-mainnet-explorer.md`

### 3. 초기 커밋 생성

```bash
git add .
git commit -m "chore: bootstrap repository"
```

### 4. 원격 저장소 연결 및 push

GitHub CLI를 사용할 수 있다면 아래 명령으로 공개 저장소를 생성할 수 있습니다.

```bash
gh repo create mirye-ann/eth-mainnet-explorer --public --source=. --remote=origin --push
```

이미 원격 저장소가 만들어져 있다면 일반적인 git 명령으로 연결합니다.

```bash
git remote add origin https://github.com/mirye-ann/eth-mainnet-explorer.git
git push -u origin main
```

## Spec

프로젝트 기준 스펙은 아래 파일에 함께 보관합니다.

- `spec/spec-eth-mainnet-explorer.md`

## Available scripts

```bash
yarn dev
yarn build
yarn start
yarn lint
yarn format
yarn format:check
yarn test
yarn test:watch
```

## Environment variables

`.env.local`은 커밋하지 않고, 아래 예제 파일을 복사해 로컬에서만 사용합니다.

```bash
cp .env.example .env.local
```

```env
ETHERSCAN_API_KEY=your_api_key_here
ETHERSCAN_API_URL=https://api.etherscan.io/api
```

## Data layer

- `src/models/api/etherscan-client.ts`: Etherscan API client and error handling
- `src/models/schemas/*.ts`: Zod schemas and normalized response types
- 현재 rate limit 대응은 **기본형**으로 두고, API 에러를 명시적으로 노출합니다.

## Providers

- `src/providers/query-provider.tsx`: TanStack Query `QueryClientProvider`
- `src/hooks/queries/query-defaults.ts`: 공통 query / mutation 기본 옵션

## UI foundation

- `src/components/layout/*`: Header / Footer
- `src/components/common/*`: SearchBar, Button, Card, Loading

## Notes for maintenance

- 스펙에 없는 중대한 결정은 임의로 정하지 않고 먼저 확인합니다.
- 사소한 구현 선택은 **Next.js 권장 방식 > 단순성 > 유지보수성 > 성능** 순서로 판단합니다.
- Local development에서는 Docker를 사용하지 않고, Docker는 stg/prod 배포용으로만 다룹니다.
