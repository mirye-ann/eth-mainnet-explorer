import Link from "next/link";

import { Card } from "@/components/common/Card";

import type { BlockTransaction } from "@/models/schemas/transaction";

type BlockInfoCardProps = Readonly<{
  /** 블록 데이터 (formattedTimestamp, gasUsagePercent 포함) */
  block: {
    baseFeePerGas: string | null;
    blockNumber: number;
    formattedTimestamp: string;
    gasLimit: string;
    gasUsagePercent: string;
    gasUsed: string;
    hash: string;
    miner: string;
    parentHash: string;
    transactionCount: number;
  };
}>;

/**
 * 블록 상세 정보를 카드 형태로 표시하는 컴포넌트.
 */
export function BlockInfoCard({ block }: BlockInfoCardProps) {
  return (
    <Card>
      <h2 className="mb-6 text-lg font-semibold">블록 정보</h2>
      <dl className="grid gap-4 sm:grid-cols-2">
        <InfoRow label="블록 번호" value={block.blockNumber.toLocaleString()} />
        <InfoRow label="생성 시간" value={block.formattedTimestamp} />
        <InfoRow label="블록 해시" mono value={block.hash} />
        <InfoRow
          copyable
          label="부모 해시"
          linkTo={`/block/${block.blockNumber - 1}`}
          mono
          value={block.parentHash}
        />
        <InfoRow label="채굴자" linkTo={`/address/${block.miner}`} mono value={block.miner} />
        <InfoRow label="트랜잭션 수" value={`${block.transactionCount.toLocaleString()}개`} />
        <InfoRow
          label="Gas 사용량"
          value={`${BigInt(block.gasUsed).toLocaleString()} / ${BigInt(block.gasLimit).toLocaleString()} (${block.gasUsagePercent}%)`}
        />
        <InfoRow
          label="Base Fee"
          value={block.baseFeePerGas ? `${BigInt(block.baseFeePerGas).toLocaleString()} wei` : "-"}
        />
      </dl>
    </Card>
  );
}

type BlockTransactionListProps = Readonly<{
  transactions: BlockTransaction[];
}>;

/**
 * 블록에 포함된 트랜잭션 목록을 표시하는 컴포넌트.
 */
export function BlockTransactionList({ transactions }: BlockTransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <h2 className="mb-4 text-lg font-semibold">트랜잭션 목록</h2>
        <p className="py-8 text-center text-muted">이 블록에 트랜잭션이 없습니다.</p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="mb-4 text-lg font-semibold">
        트랜잭션 목록 ({transactions.length.toLocaleString()}개)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b border-border text-left text-sm text-muted">
              <th className="px-4 py-3 font-medium">인덱스</th>
              <th className="px-4 py-3 font-medium">트랜잭션 해시</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">To</th>
              <th className="px-4 py-3 font-medium">Value (Wei)</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <TransactionRow key={tx.hash} transaction={tx} />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

type TransactionRowProps = Readonly<{
  transaction: BlockTransaction;
}>;

/**
 * 개별 트랜잭션 행 컴포넌트.
 */
function TransactionRow({ transaction }: TransactionRowProps) {
  return (
    <tr className="border-b border-border transition-colors hover:bg-surface/50">
      <td className="px-4 py-3 text-sm">{transaction.transactionIndex}</td>
      <td className="px-4 py-3">
        <Link
          className="font-mono text-sm text-accent hover:underline"
          href={`/tx/${transaction.hash}`}
        >
          {shortenHash(transaction.hash)}
        </Link>
      </td>
      <td className="px-4 py-3">
        <Link
          className="font-mono text-sm text-accent hover:underline"
          href={`/address/${transaction.from}`}
        >
          {shortenAddress(transaction.from)}
        </Link>
      </td>
      <td className="px-4 py-3">
        {transaction.to ? (
          <Link
            className="font-mono text-sm text-accent hover:underline"
            href={`/address/${transaction.to}`}
          >
            {shortenAddress(transaction.to)}
          </Link>
        ) : (
          <span className="text-sm text-muted">컨트랙트 생성</span>
        )}
      </td>
      <td className="px-4 py-3 font-mono text-sm">{BigInt(transaction.value).toLocaleString()}</td>
    </tr>
  );
}

type InfoRowProps = Readonly<{
  label: string;
  value: string;
  mono?: boolean;
  linkTo?: string;
  copyable?: boolean;
}>;

/**
 * 정보 표시용 행 컴포넌트 (label: value 형태).
 */
function InfoRow({ label, linkTo, mono = false, value }: InfoRowProps) {
  const valueClass = mono ? "font-mono text-sm break-all" : "text-sm";

  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className={valueClass}>
        {linkTo ? (
          <Link className="text-accent hover:underline" href={linkTo}>
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

/**
 * 트랜잭션 해시를 축약된 형태로 표시합니다.
 * 예: "0x1234...5678"
 */
function shortenHash(hash: string): string {
  if (hash.length <= 16) return hash;
  return `${hash.slice(0, 10)}...${hash.slice(-6)}`;
}

/**
 * 이더리움 주소를 축약된 형태로 표시합니다.
 * 예: "0x1234...5678"
 */
function shortenAddress(address: string): string {
  if (address.length <= 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
