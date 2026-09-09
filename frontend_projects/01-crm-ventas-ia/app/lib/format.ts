export function formatMoney(value: number, currency = "USD"): string {
  return `$${value.toLocaleString("es-CO")} ${currency}`;
}
export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}
export function isOverdue(iso: string): boolean {
  return new Date(iso).getTime() < Date.now() - 86400000 * 0.5 && new Date(iso).getTime() < Date.now();
}
export function initials(name: string): string {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}
