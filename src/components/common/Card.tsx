type CardProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export function Card({ children, className = "" }: CardProps) {
  return (
    <section
      className={["rounded-[20px] border border-border bg-surface p-6 shadow-sm sm:p-8", className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </section>
  );
}
