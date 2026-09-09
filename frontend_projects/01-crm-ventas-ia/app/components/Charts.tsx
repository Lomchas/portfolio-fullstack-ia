"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function FunnelChart({ data }: { data: { name: string; value: number; count: number }[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
          <YAxis type="category" dataKey="name" width={110} tick={{ fill: "#e2e8f0", fontSize: 12 }} />
          <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, "Valor"]} />
          <Bar dataKey="value" fill="#0ea5e9" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
