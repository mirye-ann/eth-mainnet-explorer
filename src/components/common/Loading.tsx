type LoadingProps = Readonly<{
  className?: string;
  label?: string;
}>;

export function Loading({ className = "", label = "데이터를 불러오는 중입니다." }: LoadingProps) {
  return (
    <div
      aria-live="polite"
      className={["inline-flex items-center gap-3 text-sm text-muted", className]
        .filter(Boolean)
        .join(" ")}
      role="status"
    >
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-accent" />
      <span>{label}</span>
    </div>
  );
}
