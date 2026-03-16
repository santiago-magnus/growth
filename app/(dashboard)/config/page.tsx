"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { colors } from "@/lib/tokens";

export default function ConfigPage() {
  const [leadCount, setLeadCount] = useState(0);
  const [convCount, setConvCount] = useState(0);
  const [msgCount, setMsgCount] = useState(0);

  useEffect(() => {
    supabase.from("leads").select("id", { count: "exact", head: true }).then(({ count }) => setLeadCount(count || 0));
    supabase.from("conversations").select("id", { count: "exact", head: true }).then(({ count }) => setConvCount(count || 0));
    supabase.from("messages").select("id", { count: "exact", head: true }).then(({ count }) => setMsgCount(count || 0));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-normal mb-4" style={{ fontFamily: "'DM Serif Display', serif", color: colors.pet }}>Configuración</h1>

      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="rounded-xl border p-5" style={{ background: colors.w, borderColor: colors.g1 }}>
          <div className="text-sm font-bold mb-3" style={{ color: colors.pet }}>Empresa</div>
          {[["Nombre", "Magnus SpA"], ["Email", "contacto@soymagnus.com"], ["Web", "soymagnus.com"], ["Zona horaria", "GMT-3 (Santiago)"]].map(([l, v]) => (
            <div key={l} className="flex justify-between py-2.5 border-b" style={{ borderColor: colors.g0 }}>
              <span style={{ fontSize: 12, color: colors.g5 }}>{l}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: colors.pet }}>{v}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-5" style={{ background: colors.w, borderColor: colors.g1 }}>
          <div className="text-sm font-bold mb-3" style={{ color: colors.pet }}>Base de datos (Supabase)</div>
          {[["Leads", leadCount], ["Conversaciones", convCount], ["Mensajes", msgCount]].map(([l, v]) => (
            <div key={String(l)} className="flex justify-between py-2.5 border-b" style={{ borderColor: colors.g0 }}>
              <span style={{ fontSize: 12, color: colors.g5 }}>{l}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: colors.pet }}>{v}</span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-5" style={{ background: colors.w, borderColor: colors.g1 }}>
          <div className="text-sm font-bold mb-3" style={{ color: colors.pet }}>Integraciones</div>
          {[
            ["WhatsApp Business", "Activo", colors.gn],
            ["Supabase (DB)", "Conectado", colors.gn],
            ["Claude AI (Sofía)", "Activo", colors.gn],
            ["Cloudflare Pages", "Desplegado", colors.gn],
            ["Cloudflare R2", "Pendiente", colors.am],
            ["Resend (Email)", "Pendiente", colors.am],
          ].map(([nm, st, co]) => (
            <div key={String(nm)} className="flex justify-between items-center py-2.5 border-b" style={{ borderColor: colors.g0 }}>
              <span style={{ fontSize: 13, color: colors.pet }}>{nm}</span>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold"
                style={{ background: co === colors.gn ? colors.gnL : colors.amL, color: co as string }}>
                {st}
              </span>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-5" style={{ background: colors.w, borderColor: colors.g1 }}>
          <div className="text-sm font-bold mb-3" style={{ color: colors.pet }}>Sofía V26</div>
          {[
            ["Versión", "4.0.0 (V26)"],
            ["Modelo", "claude-sonnet-4"],
            ["Canal principal", "WhatsApp"],
            ["Scoring engine", "6 variables (0-100)"],
            ["Intent detection", "Reunión + Escalación"],
            ["CRM sync", "Activo"],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between py-2.5 border-b" style={{ borderColor: colors.g0 }}>
              <span style={{ fontSize: 12, color: colors.g5 }}>{l}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: colors.pet }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
