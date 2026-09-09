export function Badge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}
export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-white/10 bg-white/5 p-4 ${className}`}>{children}</div>;
}
export function Btn({ children, onClick, variant = "primary", className = "", type = "button" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "ghost" | "danger"; className?: string; type?: "button" | "submit" }) {
  const styles =
    variant === "primary"
      ? "bg-sky-500 text-white hover:bg-sky-400"
      : variant === "danger"
        ? "bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30"
        : "border border-white/15 text-slate-200 hover:bg-white/10";
  return (
    <button type={type} onClick={onClick} className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${styles} ${className}`}>
      {children}
    </button>
  );
}
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm outline-none focus:border-sky-500 ${props.className ?? ""}`} />;
}
export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm ${props.className ?? ""}`} />;
}
export function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 85 ? "bg-emerald-500/20 text-emerald-300" : score >= 70 ? "bg-amber-500/20 text-amber-300" : "bg-red-500/20 text-red-300";
  return <span title="Score IA local" className={`rounded-full px-2.5 py-1 text-xs font-bold ${cls}`}>IA {score}</span>;
}
