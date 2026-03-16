"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Meeting, Lead } from "@/lib/types";
import { colors } from "@/lib/tokens";

export default function AgendaPage() {
  const [meetings, setMeetings] = useState<(Meeting & { lead?: Lead })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMeetings(); }, []);

  async function loadMeetings() {
    setLoading(true);
    const { data } = await supabase
      .from("meetings").select("*, leads(*)").order("date", { ascending: true });
    if (data) {
      setMeetings(data.map((m: any) => ({ ...m, lead: m.leads })));
    }
    setLoading(false);
  }

  const confirmed = meetings.filter(m => m.status === "confirmed").length;
  const pending = meetings.filter(m => m.status === "pending").length;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-normal" style={{ fontFamily: "'DM Serif Display', serif", color: colors.pet }}>Agenda</h1>
      </div>

      <div className="grid gap-3 mb-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
        <KPI label="Total reuniones" value={meetings.length} color={colors.tl} />
        <KPI label="Confirmadas" value={confirmed} color={colors.gn} />
        <KPI label="Pendientes" value={pending} color={colors.am} />
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: colors.g4, fontSize: 13 }}>Cargando agenda...</div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3">📅</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: colors.pet }}>Sin reuniones agendadas</div>
          <div style={{ fontSize: 12, color: colors.g4, marginTop: 4 }}>Cuando Sofía agende una reunión, aparecerá aquí.</div>
        </div>
      ) : (
        <div className="rounded-xl border overflow-hidden" style={{ background: colors.w, borderColor: colors.g1 }}>
          <div className="grid gap-2 px-5 py-2.5 border-b"
            style={{ gridTemplateColumns: "2fr 1.2fr 1fr .7fr .7fr 90px", borderColor: colors.g1, background: colors.g0 }}>
            {["Lead", "Tipo", "Modo", "Fecha", "Hora", "Estado"].map(h => (
              <div key={h} className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.g4 }}>{h}</div>
            ))}
          </div>
          {meetings.map((m, i) => (
            <div key={m.id} className="grid gap-2 px-5 py-3 items-center transition-colors hover:bg-gray-50"
              style={{ gridTemplateColumns: "2fr 1.2fr 1fr .7fr .7fr 90px", borderBottom: i < meetings.length - 1 ? `1px solid ${colors.g0}` : "none" }}>
              <span style={{ fontWeight: 600, color: colors.pet, fontSize: 13 }}>{m.lead?.nombre || m.lead?.telefono || "—"}</span>
              <span style={{ fontSize: 12, color: colors.g5 }}>{m.event_type}</span>
              <span style={{ fontSize: 12, color: colors.g4 }}>{m.mode}</span>
              <span style={{ fontSize: 12, color: colors.g7 }}>{m.date}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: colors.pet }}>{m.time}</span>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold"
                style={{ background: m.status === "confirmed" ? colors.gnL : colors.amL, color: m.status === "confirmed" ? colors.gn : colors.am }}>
                {m.status === "confirmed" ? "Confirmada" : "Pendiente"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div className="rounded-xl border p-5" style={{ background: colors.w, borderColor: colors.g1 }}>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.g4 }}>{label}</div>
      <div className="text-2xl" style={{ fontFamily: "'DM Serif Display', serif", color, lineHeight: 1.1 }}>{value}</div>
    </div>
  );
}
