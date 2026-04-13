import Link from "next/link";

import type { Block } from "@/models/schemas/block";

type BlockListProps = Readonly<{
  blocks: Block[];
  className?: string;
}>;

/**
 * 블록 목록을 테이블 형태로 표시하는 컴포넌트.
 * 각 행을 클릭하면 해당 블록 상세 페이지로 이동합니다.
 */
export function BlockList({ blocks, className = "" }: BlockListProps) {
  if (blocks.length === 0) {
    return (
      <div className="py-8 text-center text-muted">
        <p>블록 데이터가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={["overflow-x-auto", className].filter(Boolean).join(" ")}>
      <table className="w-full min-w-[640px] border-collapse">
        <thead>
          <tr className="border-b border-border text-left text-sm text-muted">
            <th className="px-4 py-3 font-medium">블록 번호</th>
            <th className="px-4 py-3 font-medium">생성 시간</th>
            <th className="px-4 py-3 font-medium">트랜잭션 수</th>
            <th className="px-4 py-3 font-medium">채굴자</th>
            <th className="px-4 py-3 font-medium">Gas 사용량</th>
          </tr>
        </thead>
        <tbody>
          {blocks.map((block) => (
            <BlockRow block={block} key={block.hash} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

type BlockRowProps = Readonly<{
  block: Block;
}>;

/**
 * 개별 블록 행 컴포넌트.
 * timestamp를 사람이 읽기 쉬운 형식으로 변환하고,
 * 긴 주소는 축약해서 표시합니다.
 */
function BlockRow({ block }: BlockRowProps) {
  // Unix timestamp를 로컬 시간 문자열로 변환
  const formattedTime = formatTimestamp(block.timestamp);

  // 채굴자 주소 축약 (0x1234...5678)
  const shortenedMiner = shortenAddress(block.miner);

  // Gas 사용률 계산
  const gasUsagePercent = calculateGasUsagePercent(block.gasUsed, block.gasLimit);

  return (
    <tr className="border-b border-border transition-colors hover:bg-surface/50">
      {/* 블록 번호 - 클릭 가능 */}
      <td className="px-4 py-3">
        <Link
          className="font-mono text-accent hover:underline"
          href={`/block/${block.blockNumber}`}
        >
          {block.blockNumber.toLocaleString()}
        </Link>
      </td>

      {/* 생성 시간 */}
      <td className="px-4 py-3 text-sm">{formattedTime}</td>

      {/* 트랜잭션 수 */}
      <td className="px-4 py-3 text-sm">{block.transactionCount.toLocaleString()}</td>

      {/* 채굴자 주소 */}
      <td className="px-4 py-3">
        <Link
          className="font-mono text-sm text-accent hover:underline"
          href={`/address/${block.miner}`}
        >
          {shortenedMiner}
        </Link>
      </td>

      {/* Gas 사용량 (사용량 / 한도, 백분율) */}
      <td className="px-4 py-3 text-sm">
        <div className="flex items-center gap-2">
          <span className="font-mono">{formatGas(block.gasUsed)}</span>
          <span className="text-muted">({gasUsagePercent}%)</span>
        </div>
      </td>
    </tr>
  );
}

/**
 * Unix timestamp를 로컬 시간 문자열로 변환합니다.
 * 예: "2024-01-15 14:30:25"
 */
function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("ko-KR", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    second: "2-digit",
    year: "numeric",
  });
}

/**
 * 이더리움 주소를 축약된 형태로 표시합니다.
 * 예: "0x1234567890abcdef..." → "0x1234...cdef"
 */
function shortenAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Gas 사용률을 백분율로 계산합니다.
 */
function calculateGasUsagePercent(gasUsed: string, gasLimit: string): string {
  const used = BigInt(gasUsed);
  const limit = BigInt(gasLimit);

  if (limit === BigInt(0)) return "0.00";

  // 백분율 계산 (소수점 2자리)
  const percent = (Number(used) / Number(limit)) * 100;
  return percent.toFixed(2);
}

/**
 * 큰 숫자를 읽기 쉬운 형태로 포맷팅합니다.
 * 예: "15000000" → "15,000,000"
 */
function formatGas(gas: string): string {
  return BigInt(gas).toLocaleString();
}
