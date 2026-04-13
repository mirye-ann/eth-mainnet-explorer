"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "./Button";

const addressPattern = /^0x[a-fA-F0-9]{40}$/;
const transactionPattern = /^0x[a-fA-F0-9]{64}$/;
const blockNumberPattern = /^\d+$/;

export function resolveSearchTarget(value: string) {
  const query = value.trim();

  if (!query) {
    return null;
  }

  if (blockNumberPattern.test(query)) {
    return `/block/${query}`;
  }

  if (transactionPattern.test(query)) {
    return `/tx/${query}`;
  }

  if (addressPattern.test(query)) {
    return `/address/${query}`;
  }

  return null;
}

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const target = resolveSearchTarget(query);

    if (!target) {
      setErrorMessage("블록 번호, 트랜잭션 해시, 주소 형식 중 하나로 입력해주세요.");
      return;
    }

    setErrorMessage("");
    router.push(target);
  }

  return (
    <form className="flex w-full flex-col gap-2" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          aria-label="Search input"
          className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-accent"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Block / Tx Hash / Address"
          value={query}
        />
        <Button className="h-11 sm:px-5" type="submit">
          Search
        </Button>
      </div>
      <p className="min-h-5 text-xs text-muted" role="alert">
        {errorMessage}
      </p>
    </form>
  );
}
