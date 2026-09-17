export function Arrow({ className = "arrow" }: { className?: string }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ size = 34, markOnly = false }: { size?: number; markOnly?: boolean }) {
  return (
    <svg width={size} height={size} viewBox={markOnly ? "18 14 32 36" : "0 0 64 64"} aria-hidden="true" style={{ borderRadius: markOnly ? 0 : 9 }}>
      {!markOnly && <rect width="64" height="64" rx="12" fill="#0f67c7" />}
      <path d="M18 14h12c12 0 20 7 20 18s-8 18-20 18H18V14zm11 27c6.8 0 11-3.4 11-9s-4.2-9-11-9h-2v18h2z" fill={markOnly ? "currentColor" : "#fff"} />
      {!markOnly && <path d="M17 47V17h8v30h-8zm20 0L25 32l12-15h9L34 32l12 15h-9z" fill="#d9ecff" opacity=".55" />}
    </svg>
  );
}
