"use client";

type PageSizeSelectorProps = Readonly<{
  /** 현재 선택된 페이지 크기 */
  value: number;
  /** 선택 가능한 페이지 크기 옵션들 */
  options?: number[];
  /** 페이지 크기 변경 시 호출되는 콜백 */
  onChange: (size: number) => void;
  disabled?: boolean;
  className?: string;
}>;

/** 기본 페이지 크기 옵션 */
const DEFAULT_OPTIONS = [10, 20, 50] as const;

/**
 * 페이지당 표시할 항목 수를 선택하는 드롭다운 컴포넌트.
 *
 * @example
 * <PageSizeSelector
 *   value={10}
 *   onChange={(size) => setPageSize(size)}
 * />
 */
export function PageSizeSelector({
  className = "",
  disabled = false,
  onChange,
  options = [...DEFAULT_OPTIONS],
  value,
}: PageSizeSelectorProps) {
  return (
    <div
      className={["inline-flex items-center gap-2 text-sm text-muted", className]
        .filter(Boolean)
        .join(" ")}
    >
      <label htmlFor="page-size-select">페이지당</label>
      <select
        className="rounded-lg border border-border bg-surface px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        disabled={disabled}
        id="page-size-select"
        onChange={(e) => onChange(Number(e.target.value))}
        value={value}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span>개</span>
    </div>
  );
}
