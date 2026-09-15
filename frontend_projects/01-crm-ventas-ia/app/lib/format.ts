export function formatMoney(value: number, currency = "USD"): string {
  const n = Number.isFinite(value) ? value : 0;
  return `$${n.toLocaleString("es-CO")} ${currency}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

export function isOverdue(iso: string): boolean {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  return t < Date.now();
}

/** Días (enteros) que faltan para una fecha ISO. Negativo si ya venció. */
export function daysUntil(iso: string): number {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.ceil((t - Date.now()) / 86400000);
}

export function initials(name: string): string {
  return (
    (name || "?")
      .split(" ")
      .filter(Boolean)
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?"
  );
}
