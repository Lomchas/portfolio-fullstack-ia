import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CRM Ventas IA — Portafolio Daniel Losada",
  description: "Kanban de ventas con scoring y asistente IA para equipos comerciales."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
