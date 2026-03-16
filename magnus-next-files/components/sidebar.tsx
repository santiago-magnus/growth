"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { label: "PRINCIPAL", items: [
    { id: "crm", name: "CRM", href: "/crm" },
    { id: "agente", name: "Agente IA", href: "/agente" },
    { id: "campanas", name: "Campañas", href: "/campanas" },
    { id: "agenda", name: "Agenda", href: "/agenda" },
  ]},
  { label: "CONFIG", items: [
    { id: "config", name: "Configuración", href: "/config" },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-[210px] min-h-screen flex flex-col shrink-0"
      style={{ background: "#0B2F33" }}>
      {/* Logo */}
      <div className="flex items-center gap-2 p-3 border-b border-white/5">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-extrabold text-sm"
          style={{ background: "linear-gradient(135deg, #C47A4A, #D9956A)" }}>M</div>
        <div>
          <div className="text-white text-sm font-serif leading-none"
            style={{ fontFamily: "'DM Serif Display', serif" }}>Magnus</div>
          <div className="text-white/30 text-[9px] mt-0.5">Growth Platform</div>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 p-2 overflow-y-auto">
        {NAV.map(sec => (
          <div key={sec.label}>
            <div className="text-[9px] font-bold text-white/20 tracking-widest px-2 pt-3 pb-1 uppercase">
              {sec.label}
            </div>
            {sec.items.map(item => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link key={item.id} href={item.href}
                  className="flex items-center gap-2 px-2.5 py-2 rounded-lg mb-0.5 transition-all"
                  style={{
                    background: active ? "rgba(255,255,255,0.08)" : "transparent",
                    borderLeft: active ? "2.5px solid #C47A4A" : "2.5px solid transparent",
                  }}>
                  <span className="text-[13px]"
                    style={{
                      fontWeight: active ? 600 : 400,
                      color: active ? "#fff" : "rgba(255,255,255,0.4)",
                    }}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* User */}
      <div className="flex items-center gap-2 p-2.5 border-t border-white/5">
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[10px]"
          style={{ background: "linear-gradient(135deg, #1B6E6A, #2A9490)" }}>SC</div>
        <div>
          <div className="text-white/80 text-[11px] font-semibold">Santiago C.</div>
          <div className="text-white/30 text-[9px]">CEO</div>
        </div>
      </div>
    </div>
  );
}
