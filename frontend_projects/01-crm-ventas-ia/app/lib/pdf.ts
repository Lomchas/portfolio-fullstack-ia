"use client";
import jsPDF from "jspdf";
import type { Quote } from "../lib/types";
import { quoteTotal } from "../lib/seed";

export function downloadQuotePDF(q: Quote, companyName: string, clientName: string, clientCompany: string) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(companyName, 14, 18);
  doc.setFontSize(11);
  doc.text(`Cotización ${q.number}`, 14, 27);
  doc.text(`Cliente: ${clientCompany} — ${clientName}`, 14, 34);
  doc.text(`Válida hasta: ${new Date(q.validUntil).toLocaleDateString()} · Estado: ${q.status}`, 14, 40);
  let y = 52;
  doc.setFontSize(10);
  q.items.forEach((it, i) => {
    doc.text(`${i + 1}. ${it.description} x${it.qty} @ $${it.price} = $${it.qty * it.price}`, 14, y);
    y += 7;
  });
  y += 4;
  const sub = q.items.reduce((s, it) => s + it.qty * it.price, 0);
  doc.text(`Subtotal: $${sub.toFixed(2)}`, 14, y); y += 7;
  doc.text(`Descuento: ${q.discount}%`, 14, y); y += 7;
  doc.text(`Impuestos: ${q.tax}%`, 14, y); y += 7;
  doc.setFontSize(13);
  doc.text(`TOTAL: $${quoteTotal(q).toFixed(2)}`, 14, y); y += 10;
  doc.setFontSize(10);
  doc.text(`Notas: ${q.notes}`, 14, y);
  doc.save(`${q.number}.pdf`);
}
