import type { Lead } from "./types";

export function leadsToCSV(leads: Lead[]): string {
  const head = "id,company,contact,email,phone,value,status,stageId,ownerId,expectedClose,source,tags";
  const rows = leads.map((l) =>
    [l.id, `"${l.company}"`, `"${l.name}"`, l.email, l.phone, l.value, l.status, l.stageId, l.ownerId, l.expectedClose.slice(0, 10), l.source, `"${l.tags.join("|")}"`].join(",")
  );
  return [head, ...rows].join("\n");
}

export function downloadText(filename: string, text: string, mime = "text/plain") {
  const blob = new Blob([text], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

export function parseLeadsCSV(csv: string): Partial<Lead>[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];
  const out: Partial<Lead>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    if (cols.length < 6) continue;
    out.push({
      company: cols[1]?.replace(/"/g, "").trim() || "Sin empresa",
      name: cols[2]?.replace(/"/g, "").trim() || "Sin contacto",
      email: cols[3]?.trim() || "",
      value: Number(cols[5]) || 0
    });
  }
  return out;
}
