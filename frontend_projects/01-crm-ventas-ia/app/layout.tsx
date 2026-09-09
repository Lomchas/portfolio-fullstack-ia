import type { Metadata } from "next";
import "./globals.css";
import { CrmProvider } from "./lib/store";
import Sidebar from "./components/Sidebar";

export const metadata: Metadata = {
  title: "CRM Ventas IA — Portafolio Daniel Losada",
  description: "CRM comercial SMB con IA local: pipeline, leads, cotizaciones y reportes."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-slate-950 text-slate-100">
        <CrmProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="min-w-0 flex-1 px-4 py-6 md:px-8 md:pt-8">{children}</main>
          </div>
        </CrmProvider>
      </body>
    </html>
  );
}
