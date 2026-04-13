# Git 컨벤션 가이드

이 문서는 `eth-mainnet-explorer` 프로젝트의 Git 사용 규칙을 정의합니다.

## 커밋 메시지 (Commit Messages)

### 언어

- 커밋 메시지는 **한글**로 작성합니다.

### 형식

```
<type>: <제목>

<본문 (선택)>

<이슈 연동 (선택)>

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

### 타입 (Type)

| 타입       | 설명                                   |
| ---------- | -------------------------------------- |
| `feat`     | 새로운 기능 추가                       |
| `fix`      | 버그 수정                              |
| `refactor` | 코드 리팩토링 (기능 변경 없음)         |
| `style`    | 코드 스타일 변경 (포맷팅, 세미콜론 등) |
| `docs`     | 문서 수정                              |
| `test`     | 테스트 추가/수정                       |
| `chore`    | 빌드 설정, 패키지 업데이트 등          |

### 예시

```
feat: 블록 상세 페이지 구현

- 블록 정보 카드 컴포넌트 추가
- 트랜잭션 목록 테이블 추가
- useBlockDetailViewModel 훅 구현

closes #11

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>
```

## 이슈 연동 (Issue Linking)

### 참조 키워드

| 키워드           | 효과                      |
| ---------------- | ------------------------- |
| `#번호`          | 이슈 참조 (링크만 생성)   |
| `closes #번호`   | PR 머지 시 이슈 자동 닫기 |
| `fixes #번호`    | PR 머지 시 이슈 자동 닫기 |
| `resolves #번호` | PR 머지 시 이슈 자동 닫기 |

### 사용 위치

- 커밋 메시지 본문 끝에 별도 줄로 작성합니다.
- 여러 이슈를 닫을 경우 쉼표로 구분합니다.

```
closes #11, closes #12
```

## 브랜치 전략 (Branch Strategy)

### 브랜치 명명

| 유형      | 패턴              | 예시                        |
| --------- | ----------------- | --------------------------- |
| 기능      | `feature/<설명>`  | `feature/block-detail-page` |
| 버그 수정 | `fix/<설명>`      | `fix/pagination-error`      |
| 리팩토링  | `refactor/<설명>` | `refactor/query-hooks`      |

### 기본 브랜치

- `develop`: 기본 개발 브랜치 (기능 개발, PR 타겟)
- `main`: 프로덕션 배포 브랜치
- 기능 브랜치는 `develop`에서 분기하고, `develop`으로 머지합니다.
- `main`으로의 머지는 릴리스 시에만 수행합니다.

## 워크플로우

### 커밋 단위

- 커밋은 **작은 단위**로 나누어 올립니다.
- 하나의 커밋은 하나의 논리적 변경을 포함합니다.
- 예: 컴포넌트 추가, 테스트 추가, 버그 수정 등을 별도 커밋으로 분리

### 검증 및 Push

1. 코드 작성 완료
2. `yarn validate` 실행 (format → lint → test → build)
3. 검증 통과 시 커밋
4. **테스트 완료 후 push** (검증 실패 시 push 금지)

### 일반적인 작업 흐름

1. 이슈 확인
2. `develop` 브랜치에서 기능 브랜치 생성 (선택)
3. 코드 작성
4. `yarn validate` 검증
5. 작은 단위로 커밋 (이슈 번호 포함)
6. 테스트 완료 후 push
7. PR 생성 및 머지 (선택)

### Copilot과 협업 시

- Copilot이 작성한 커밋에는 `Co-authored-by` 트레일러가 자동으로 추가됩니다.
- 이슈 번호는 커밋 메시지에 명시하여 추적성을 유지합니다.
