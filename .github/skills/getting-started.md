# 시작 가이드

이 문서는 작업 시작 전 참조해야 할 skill 파일을 안내합니다.

## 작업 유형별 필수 참조 파일

| 작업 유형       | 필수 파일                         |
| --------------- | --------------------------------- |
| 코드 작성/수정  | `code-style.md`, `development.md` |
| 새 기능 개발    | `code-style.md`, `development.md` |
| 커밋/PR         | `git-conventions.md`              |
| 배포/최적화     | `deployment.md`                   |
| skill 파일 작성 | `skill-authoring.md`              |
| 문서 작업       | `code-style.md` (주석/언어 규칙)  |

## 항상 참조해야 할 문서

- `spec/spec-eth-mainnet-explorer.md` - 프로젝트 스펙 (애매한 결정 시 참조)

## 검증 명령어

코드 변경 후 반드시 실행:

```bash
yarn validate
```

이 명령어는 순차적으로 실행됩니다:

1. `yarn format` - Prettier 포맷팅
2. `yarn lint` - ESLint 검사
3. `yarn test` - Vitest 테스트
4. `yarn build` - Next.js 빌드

**검증 실패 시 push하지 않습니다.**

## skill 파일 목록

| 파일                 | 설명                             |
| -------------------- | -------------------------------- |
| `getting-started.md` | 이 파일 (시작 가이드)            |
| `code-style.md`      | 주석, 파일명, 컴포넌트 구조 규칙 |
| `development.md`     | MVVM 패턴, Query 훅, 페이지 구조 |
| `deployment.md`      | Docker, 코드 스플리팅, CI/CD     |
| `git-conventions.md` | 커밋 메시지, 브랜치 규칙         |
| `skill-authoring.md` | skill 파일 작성 가이드           |
