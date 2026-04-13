import Link from "next/link";

import { SearchBar } from "@/components/common/SearchBar";

export function Header() {
  return (
    <header className="border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link className="text-2xl font-semibold tracking-tight text-foreground" href="/">
              Ethereum Mainnet Explorer
            </Link>
            <p className="mt-1 text-sm text-muted">
              블록, 트랜잭션, 주소를 빠르게 탐색하는 유지보수 가능한 Toy Explorer
            </p>
          </div>
        </div>
        <SearchBar />
      </div>
    </header>
  );
}
