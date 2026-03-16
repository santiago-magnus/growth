"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Lead } from "@/lib/types";
import { colors } from "@/lib/tokens";

export default function CampanasPage() {
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    supabase.from("leads").select("*").then(({ data }) => { if (data) setLeads(data); });
  }, []);

  const segments = [
    { nm: "Leads hot (score >75)", count: leads.filter(l => l.score > 75).length, co: colors.rd },
    { nm: "Canal WhatsApp", count: leads.filter(l => l.channel === "whatsapp").length, co: colors.gn },
    { nm: "Canal Web/Email", count: leads.filter(l => l.channel === "web" || l.channel === "email").length, co: colors.bl },
    { nm: "Sin reunión", count: leads.length, co: colors.am },
    { nm: "Sector oriente", count: leads.filter(l => ["Providencia", "Las Condes", "Vitacura", "Ñuñoa"].includes(l.comuna)).length, co: colors.tl },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-normal" style={{ fontFamily: "'DM Serif Display', serif", color: colors.pet }}>Campañas</h1>
      </div>

      <h2 className="text-sm font-bold mb-3" style={{ color: colors.pet }}>Segmentos dinámicos (desde CRM)</h2>
      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
        {segments.map(sg => (
          <div key={sg.nm} className="rounded-xl border p-5" style={{ background: colors.w, borderColor: colors.g1 }}>
            <div className="text-sm font-semibold mb-1" style={{ color: colors.pet }}>{sg.nm}</div>
            <div className="text-3xl font-bold mb-1" style={{ color: sg.co }}>{sg.count}</div>
            <div className="text-[11px] mb-3" style={{ color: colors.g4 }}>contactos · Se actualiza desde el CRM</div>
            <button className="px-4 py-2 rounded-lg border-none text-white font-semibold cursor-pointer text-xs"
              style={{ background: colors.cp }}>Enviar campaña</button>
          </div>
        ))}
      </div>
    </div>
  );
}
