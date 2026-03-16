"use client";

import { usePathname } from "next/navigation";

const TITLES: Record<string, string> = {
  "/crm": "CRM",
  "/agente": "Agente IA",
  "/campanas": "Campañas",
  "/agenda": "Agenda",
  "/config": "Configuración",
};

export default function TopBar() {
  const pathname = usePathname();
  const title = Object.entries(TITLES).find(([k]) => pathname?.startsWith(k))?.[1] || "Dashboard";

  return (
    <div className="flex items-center justify-between px-6 py-2.5 border-b shrink-0"
      style={{ borderColor: "#F0EDE8", background: "#FFF" }}>
      <div className="flex items-center gap-1.5">
        <span className="text-[11px] uppercase tracking-wider" style={{ color: "#8C8278" }}>Magnus</span>
        <span style={{ color: "#B8B0A4" }}>›</span>
        <span className="text-[13px] font-semibold" style={{ color: "#0B2F33" }}>{title}</span>
      </div>
      <span className="text-[12px]" style={{ color: "#8C8278" }}>v26</span>
    </div>
  );
}
