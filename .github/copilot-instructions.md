# Copilot Instructions

이 문서는 GitHub Copilot CLI가 이 프로젝트에서 작업할 때 따라야 할 지침입니다.

## 작업 시작 전

**반드시 `.github/skills/getting-started.md`를 먼저 읽고**, 작업 유형에 맞는 skill 파일을 참조하세요.

## 프로젝트 개요

- **프로젝트**: Ethereum Mainnet Explorer (Toy Project)
- **스택**: Next.js (App Router) + TypeScript + Tailwind CSS + TanStack Query
- **아키텍처**: MVVM 패턴
- **패키지 매니저**: Yarn Classic 1.22.22 (npm 사용 금지)

## 의사결정 우선순위

구현 방식을 결정할 때 다음 순서를 따릅니다:

1. **Next.js 권장 방식** - 공식 문서에서 권장하는 방법 우선
2. **단순성** - 복잡한 해결책보다 간단한 방법 선호
3. **유지보수성** - 코드의 가독성과 수정 용이성
4. **성능** - 필요한 경우에만 최적화

## 라이브러리 선택 원칙

- **범용적이고 안정적인 라이브러리** 우선
- **문서가 풍부한 라이브러리** 선호
- **실험적 기능이나 신규 라이브러리** 지양
- 예: lodash, dayjs, zod 등 검증된 라이브러리 선호

## 애매한 결정 시 질문

다음과 같은 경우 먼저 질문합니다:

- 아키텍처나 구현 방식에 큰 영향을 미치는 결정
- 스펙 문서에 명시되지 않은 사항
- 여러 가지 합리적인 선택지가 있는 경우

참고 문서: `spec/spec-eth-mainnet-explorer.md`

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
- `.github/skills/getting-started.md` - 시작 가이드 (작업 유형별 참조 파일 안내)
