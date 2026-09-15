"use client";
import { useState } from "react";
import { Copy, Mail, MessageCircle, Sparkles } from "lucide-react";
import type { Lead } from "../lib/types";
import { useCrm } from "../lib/store";
import { generateEmail, generateWhatsApp, scoreLead, suggestNextAction, summarizeLead } from "../lib/ai";
import { Card, Btn, Select, ScoreBadge } from "./ui";

export default function AiPanel({ lead }: { lead: Lead }) {
  const { state } = useCrm();
  const [tone, setTone] = useState<"cercano" | "formal">("cercano");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const { score, reasons } = scoreLead(lead, state.activities);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      alert("No se pudo copiar automáticamente. Selecciona el texto y cópialo manualmente.");
    }
  }
  return (
    <Card className="border-violet-500/20 bg-violet-500/5">
      <p className="inline-flex items-center gap-2 font-semibold"><Sparkles size={16} className="text-violet-300" /> IA local</p>
      <div className="mt-2"><ScoreBadge score={score} /></div>
      <ul className="mt-2 list-disc pl-4 text-xs text-slate-400">{reasons.map((r) => <li key={r}>{r}</li>)}</ul>
      <p className="mt-2 text-xs">→ {suggestNextAction(lead, state.activities)}</p>
      <p className="mt-2 text-xs text-slate-400">{summarizeLead(lead, state.activities)}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Select value={tone} onChange={(e) => setTone(e.target.value as never)} className="!w-32">
          <option value="cercano">cercano</option><option value="formal">formal</option>
        </Select>
        <Btn onClick={() => setText(generateEmail(lead, tone))}><span className="inline-flex items-center gap-1"><Mail size={14} /> Email</span></Btn>
        <Btn variant="ghost" onClick={() => setText(generateWhatsApp(lead))}><span className="inline-flex items-center gap-1"><MessageCircle size={14} /> WA</span></Btn>
      </div>
      {text && (
        <div className="mt-3">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={9} className="w-full rounded-xl border border-white/10 bg-slate-900 p-3 text-xs" />
          <Btn variant="ghost" className="mt-2" onClick={copy}><span className="inline-flex items-center gap-1"><Copy size={14} /> {copied ? "¡Copiado!" : "Copiar"}</span></Btn>
        </div>
      )}
    </Card>
  );
}
