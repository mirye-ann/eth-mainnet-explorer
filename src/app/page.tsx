import { Card } from "@/components/common/Card";
import { Loading } from "@/components/common/Loading";

const currentScope = [
  "최신 블록 / 트랜잭션 목록",
  "블록 / 트랜잭션 / 주소 상세 화면",
  "MVVM 구조 기반의 유지보수 가능한 프런트엔드",
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 sm:py-16">
      <Card className="rounded-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-accent">
          Toy project bootstrap
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
          Ethereum Mainnet Explorer
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-muted sm:text-lg">
          최신 블록, 트랜잭션, 주소 정보를 탐색하는 Explorer를 Next.js App Router와 TypeScript
          기반으로 구축합니다.
        </p>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold text-foreground">Current scope</h2>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-7 text-muted">
          {currentScope.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2 className="text-2xl font-semibold text-foreground">Project notes</h2>
        <p className="mt-4 text-base leading-8 text-muted">
          {/* Keep the first screen informative while later issues fill in the real explorer views. */}
          현재 화면은 초기 부트스트랩 상태를 보여주는 안내 페이지입니다. 이후 이슈 순서에 맞춰
          레이아웃, 데이터 계층, 검색, 상세 화면을 단계적으로 추가합니다.
        </p>
        <Loading className="mt-6" label="레이아웃과 데이터 기반 기능을 순차적으로 확장 중입니다." />
      </Card>
    </div>
  );
}
