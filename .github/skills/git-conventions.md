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

- `main`: 프로덕션 배포 브랜치
- 직접 커밋보다는 PR을 통한 머지를 권장합니다.

## 워크플로우

### 일반적인 작업 흐름

1. 이슈 확인
2. (선택) 기능 브랜치 생성
3. 코드 작성 및 테스트
4. `yarn format && yarn lint && yarn test && yarn build` 검증
5. 커밋 (이슈 번호 포함)
6. (선택) PR 생성 및 머지

### Copilot과 협업 시

- Copilot이 작성한 커밋에는 `Co-authored-by` 트레일러가 자동으로 추가됩니다.
- 이슈 번호는 커밋 메시지에 명시하여 추적성을 유지합니다.
