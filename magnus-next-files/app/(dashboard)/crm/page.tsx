"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lead } from "@/lib/types";
import { colors, CH_ICON, CH_COLOR, LC_LABEL, LC_COLOR, STAGES, STAGE_COLORS } from "@/lib/tokens";

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"contacts" | "pipeline" | "deals">("contacts");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadLeads();
  }, []);

  async function loadLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLeads(data);
    setLoading(false);
  }

  const filtered = leads.filter(l =>
    !query || l.nombre.toLowerCase().includes(query.toLowerCase()) ||
    l.telefono.includes(query) || l.email.toLowerCase().includes(query.toLowerCase())
  );

  const active = leads.filter(l => !["Ganado", "Perdido"].includes(l.stage));
  const won = leads.filter(l => l.stage === "Ganado");
  const pipelineUF = active.reduce((a, l) => a + parseUF(l.prop_value), 0);

  const tabs = [
    { id: "contacts" as const, label: "Contactos" },
    { id: "pipeline" as const, label: "Pipeline" },
    { id: "deals" as const, label: "Deals" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-2xl mb-2">⏳</div>
        <div style={{ color: colors.g4, fontSize: 13 }}>Cargando CRM...</div>
      </div>
    </div>
  );

  // ═══ CONTACT DETAIL ═══
  if (selected) return (
    <div>
      <button onClick={() => setSelected(null)}
        className="border-none bg-transparent cursor-pointer font-semibold mb-3"
        style={{ color: colors.cp, fontSize: 12 }}>← Contactos</button>

      <div className="grid gap-4" style={{ gridTemplateColumns: "340px 1fr" }}>
        {/* Left: Card */}
        <div className="rounded-xl border p-5" style={{ background: colors.w, borderColor: colors.g1 }}>
          <div className="flex gap-3 mb-4">
            <Avatar name={selected.nombre} tag={selected.tag} size={52} />
            <div>
              <div className="text-xl" style={{ fontFamily: "'DM Serif Display', serif", color: colors.pet }}>
                {selected.nombre || "(Sin nombre)"}
              </div>
              <div className="text-xs mt-1" style={{ color: colors.g4 }}>
                {selected.edad ? `${selected.edad} años · ` : ""}{selected.comuna || "Sin comuna"}
              </div>
              <div className="flex gap-1 mt-2">
                <ChannelBadge ch={selected.channel} />
                <LifecycleBadge lc={selected.lifecycle} />
              </div>
            </div>
          </div>
          <div className="border-t pt-3" style={{ borderColor: colors.g1 }}>
            {[
              ["Email", selected.email],
              ["Teléfono", selected.telefono],
              ["Propiedad", selected.prop_value],
              ["Fuente", selected.source],
              ["Score", `${selected.score}/100`],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between py-2 border-b" style={{ borderColor: colors.g0 }}>
                <span style={{ fontSize: 12, color: colors.g4 }}>{l}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: colors.pet }}>{v || "—"}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-4 flex-wrap">
            <Btn onClick={() => router.push(`/agente?leadId=${selected.id}`)}>💬 Ver chat</Btn>
            <Btn onClick={() => router.push(`/agenda?leadId=${selected.id}`)}>📅 Agenda</Btn>
          </div>
        </div>

        {/* Right: Timeline */}
        <div className="rounded-xl border p-5" style={{ background: colors.w, borderColor: colors.g1 }}>
          <div className="font-bold mb-4" style={{ fontSize: 14, color: colors.pet }}>Timeline</div>
          <div className="relative pl-5">
            <div className="absolute left-1 top-0 bottom-0 w-0.5" style={{ background: colors.g1 }} />
            <TimelineItem color={colors.tl} title={`Lead creado via ${selected.channel}`}
              detail={new Date(selected.created_at).toLocaleDateString("es-CL", { day: "numeric", month: "short", year: "numeric" })} />
            {selected.lifecycle !== "new" && (
              <TimelineItem color={colors.am} title={`Lifecycle: ${LC_LABEL[selected.lifecycle] || selected.lifecycle}`}
                detail={`Score: ${selected.score}/100`} />
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // ═══ MAIN VIEW ═══
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-normal" style={{ fontFamily: "'DM Serif Display', serif", color: colors.pet }}>CRM</h1>
        <div className="flex gap-2">
          <Btn primary onClick={loadLeads}>↻ Refrescar</Btn>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-5" style={{ borderColor: colors.g2 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setSelected(null); }}
            className="px-4 py-2.5 bg-transparent border-none cursor-pointer"
            style={{
              fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? colors.cp : colors.g4,
              borderBottom: tab === t.id ? `2.5px solid ${colors.cp}` : "2.5px solid transparent",
              marginBottom: -1,
            }}>{t.label}</button>
        ))}
      </div>

      {/* CONTACTS */}
      {tab === "contacts" && (
        <div>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por nombre, teléfono o email..."
            className="w-full max-w-md mb-4 px-3 py-2.5 rounded-lg border outline-none"
            style={{ borderColor: colors.g2, fontSize: 13, background: colors.w, fontFamily: "inherit" }} />

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3">📭</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: colors.pet }}>
                {leads.length === 0 ? "Sin leads aún" : "Sin resultados"}
              </div>
              <div style={{ fontSize: 12, color: colors.g4, marginTop: 4 }}>
                {leads.length === 0
                  ? "Cuando alguien escriba por WhatsApp, aparecerá aquí automáticamente."
                  : "Intenta con otro término de búsqueda."}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden" style={{ background: colors.w, borderColor: colors.g1 }}>
              {/* Header */}
              <div className="grid gap-2 px-5 py-2.5 border-b"
                style={{ gridTemplateColumns: "2fr .7fr 1fr .7fr .5fr", borderColor: colors.g1, background: colors.g0 }}>
                {["Contacto", "Canal", "Lifecycle", "Etapa", "Score"].map(h => (
                  <div key={h} className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.g4 }}>{h}</div>
                ))}
              </div>
              {/* Rows */}
              {filtered.map((l, i) => (
                <div key={l.id} onClick={() => setSelected(l)}
                  className="grid gap-2 px-5 py-3 items-center cursor-pointer transition-colors hover:bg-gray-50"
                  style={{ gridTemplateColumns: "2fr .7fr 1fr .7fr .5fr", borderBottom: i < filtered.length - 1 ? `1px solid ${colors.g0}` : "none" }}>
                  <div className="flex items-center gap-2">
                    <Avatar name={l.nombre} tag={l.tag} />
                    <div>
                      <div style={{ fontWeight: 600, color: colors.pet, fontSize: 13 }}>{l.nombre || l.telefono}</div>
                      <div style={{ fontSize: 11, color: colors.g4 }}>{l.email || l.telefono}</div>
                    </div>
                  </div>
                  <ChannelBadge ch={l.channel} />
                  <LifecycleBadge lc={l.lifecycle} />
                  <Pill color={l.stage === "Ganado" ? "green" : "blue"} label={l.stage} />
                  <ScoreRing score={l.score} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PIPELINE */}
      {tab === "pipeline" && (
        <div className="flex gap-2 overflow-x-auto pb-3">
          {STAGES.slice(0, 7).map((stage, si) => {
            const stageLeads = leads.filter(l => l.stage === stage);
            return (
              <div key={stage} className="min-w-[190px] flex-shrink-0">
                <div className="px-2.5 py-2 rounded-t-lg border-b-2"
                  style={{ background: STAGE_COLORS[si] + "12", borderColor: STAGE_COLORS[si] }}>
                  <div className="flex justify-between">
                    <span className="text-[11px] font-bold" style={{ color: colors.pet }}>{stage}</span>
                    <span className="text-[10px] font-bold" style={{ color: STAGE_COLORS[si] }}>{stageLeads.length}</span>
                  </div>
                </div>
                <div className="rounded-b-lg p-1 min-h-[130px]" style={{ background: colors.g0 }}>
                  {stageLeads.map(l => (
                    <div key={l.id} onClick={() => { setSelected(l); setTab("contacts"); }}
                      className="rounded-lg p-2.5 mb-1 border cursor-pointer transition-colors hover:border-amber-600"
                      style={{ background: colors.w, borderColor: colors.g1 }}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[12px] font-semibold" style={{ color: colors.pet }}>
                          {(l.nombre || l.telefono).split(" ").slice(0, 2).join(" ")}
                        </span>
                        <ScoreRing score={l.score} size={20} />
                      </div>
                      <div className="text-[10px] mb-1" style={{ color: colors.g4 }}>{l.comuna} · {l.prop_value}</div>
                      <ChannelBadge ch={l.channel} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DEALS */}
      {tab === "deals" && (
        <div>
          <div className="grid gap-3 mb-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
            <KPI label="Activos" value={active.length} color={colors.tl} />
            <KPI label="Pipeline" value={`UF ${Math.round(pipelineUF).toLocaleString("es-CL")}`} color={colors.cp} />
            <KPI label="Cerrados" value={won.length} color={colors.gn} />
            <KPI label="Win rate" value={leads.length > 0 ? `${Math.round(won.length / leads.length * 100)}%` : "0%"} color={colors.gn} />
          </div>
          <div className="rounded-xl border overflow-hidden" style={{ background: colors.w, borderColor: colors.g1 }}>
            {active.map((l, i) => (
              <div key={l.id} onClick={() => { setSelected(l); setTab("contacts"); }}
                className="grid gap-2 px-5 py-3 items-center cursor-pointer transition-colors hover:bg-gray-50"
                style={{ gridTemplateColumns: "2fr .7fr 1fr 1fr .5fr", borderBottom: i < active.length - 1 ? `1px solid ${colors.g0}` : "none" }}>
                <span style={{ fontWeight: 600, color: colors.pet, fontSize: 13 }}>{l.nombre || l.telefono}</span>
                <ChannelBadge ch={l.channel} />
                <LifecycleBadge lc={l.lifecycle} />
                <span style={{ fontWeight: 600 }}>{l.prop_value}</span>
                <ScoreRing score={l.score} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══ SHARED UI COMPONENTS ═══

function Avatar({ name, tag, size = 32 }: { name: string; tag: string; size?: number }) {
  const initials = (name || "?").split(" ").map(w => w[0]).filter(Boolean).join("").slice(0, 2);
  const bg = tag === "hot" ? "linear-gradient(135deg, #C47A4A, #D9956A)" : "linear-gradient(135deg, #1B6E6A, #2A9490)";
  return (
    <div className="flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, borderRadius: size * 0.3, background: bg, fontSize: size * 0.34 }}>
      {initials}
    </div>
  );
}

function ScoreRing({ score, size = 28 }: { score: number; size?: number }) {
  const r = size / 2 - 3;
  const circ = 2 * Math.PI * r;
  const co = score >= 80 ? colors.gn : score >= 60 ? colors.tl : score >= 40 ? colors.am : colors.rd;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={colors.g1} strokeWidth={2.5} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={co} strokeWidth={2.5}
        strokeDasharray={circ} strokeDashoffset={circ * (1 - score / 100)} strokeLinecap="round" />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" fill={co}
        style={{ fontSize: size * 0.28, fontWeight: 700, transform: "rotate(90deg)", transformOrigin: "center" }}>{score}</text>
    </svg>
  );
}

function Pill({ color, label }: { color: string; label: string }) {
  const map: Record<string, [string, string]> = {
    green: [colors.gnL, colors.gn], red: [colors.rdL, colors.rd], amber: [colors.amL, colors.am],
    blue: [colors.blL, colors.bl], purple: [colors.puL, colors.pu], gray: [colors.g1, colors.g5],
  };
  const [bg, fg] = map[color] || map.gray;
  return <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: bg, color: fg }}>{label}</span>;
}

function ChannelBadge({ ch }: { ch: string }) {
  const co = CH_COLOR[ch] || colors.g4;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-xl text-[10px] font-semibold"
      style={{ background: co + "12", color: co }}>
      {CH_ICON[ch] || "?"} {ch}
    </span>
  );
}

function LifecycleBadge({ lc }: { lc: string }) {
  const co = LC_COLOR[lc] || colors.g4;
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
      style={{ background: co + "15", color: co }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: co }} />
      {LC_LABEL[lc] || lc}
    </span>
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

function Btn({ children, onClick, primary }: { children: React.ReactNode; onClick?: () => void; primary?: boolean }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg cursor-pointer"
      style={{
        fontSize: 12.5, fontWeight: 600,
        border: primary ? "none" : `1.5px solid ${colors.g2}`,
        background: primary ? colors.cp : colors.w,
        color: primary ? "#fff" : colors.g7,
      }}>{children}</button>
  );
}

function TimelineItem({ color, title, detail }: { color: string; title: string; detail: string }) {
  return (
    <div className="relative mb-4">
      <div className="absolute -left-5 top-0.5 w-3 h-3 rounded-full border-2 border-white" style={{ background: color }} />
      <div className="rounded-lg p-3" style={{ background: colors.g0 }}>
        <div className="text-xs font-semibold" style={{ color: colors.pet }}>{title}</div>
        <div className="text-[11px] mt-1" style={{ color: colors.g5 }}>{detail}</div>
      </div>
    </div>
  );
}

function parseUF(s: string): number {
  const m = (s || "").match(/[\d.,]+/);
  return m ? parseFloat(m[0].replace(/\./g, "")) : 0;
}
