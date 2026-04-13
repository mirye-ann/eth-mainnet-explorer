# Copilot Instructions

이 문서는 GitHub Copilot CLI가 이 프로젝트에서 작업할 때 따라야 할 지침입니다.

## 프로젝트 개요

- **프로젝트**: Ethereum Mainnet Explorer (Toy Project)
- **스택**: Next.js (App Router) + TypeScript + Tailwind CSS + TanStack Query
- **아키텍처**: MVVM 패턴

## 언어 규칙

- **코드 주석**: 한글
- **커밋 메시지**: 한글
- **JSDoc 설명**: 한글 (태그는 영어)

## 검증 명령어

코드 변경 후 반드시 다음 명령어로 검증:

```bash
yarn validate
```

이 명령어는 순차적으로 실행됩니다:

1. `yarn format` - Prettier 포맷팅
2. `yarn lint` - ESLint 검사
3. `yarn test` - Vitest 테스트
4. `yarn build` - Next.js 빌드

**검증 실패 시 push하지 않습니다.**

## 커밋 규칙

- 작은 단위로 나누어 커밋
- 이슈 번호 연동 (`closes #번호`)
- Co-authored-by 트레일러 포함

## 브랜치 규칙

- 기본 개발 브랜치: `develop`
- 프로덕션 브랜치: `main`
- 기능 브랜치 패턴: `feature/<설명>`

## 참조 문서

- `spec/spec-eth-mainnet-explorer.md` - 프로젝트 스펙
- `.github/skills/` - 코드 스타일, Git 컨벤션, 아키텍처 가이드
