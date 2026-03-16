"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Lead, Conversation, Message } from "@/lib/types";
import { colors, CH_ICON, CH_COLOR } from "@/lib/tokens";

export default function AgentePage() {
  const [leads, setLeads] = useState<(Lead & { conversation_id?: string; last_msg?: string; last_time?: string; unread?: boolean })[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const focusLeadId = searchParams?.get("leadId");

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (focusLeadId) setSelected(focusLeadId);
  }, [focusLeadId]);

  useEffect(() => {
    if (!selected) return;
    loadMessages(selected);

    // Realtime subscription
    const channel = supabase.channel("messages-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const newMsg = payload.new as Message;
        setMessages(prev => [...prev, newMsg]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selected]);

  async function loadConversations() {
    setLoading(true);
    const { data: convs } = await supabase
      .from("conversations").select("*, leads(*)").eq("status", "active").order("created_at", { ascending: false });

    if (convs) {
      const mapped = convs.map((c: any) => ({
        ...c.leads,
        conversation_id: c.id,
      }));
      setLeads(mapped);
      if (focusLeadId) setSelected(focusLeadId);
    }
    setLoading(false);
  }

  async function loadMessages(leadId: string) {
    const lead = leads.find(l => l.id === leadId);
    if (!lead?.conversation_id) return;

    const { data } = await supabase
      .from("messages").select("*")
      .eq("conversation_id", lead.conversation_id)
      .order("created_at", { ascending: true });
    if (data) setMessages(data);
  }

  const selLead = leads.find(l => l.id === selected);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="text-2xl mb-2">💬</div>
        <div style={{ color: colors.g4, fontSize: 13 }}>Cargando conversaciones...</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-2xl font-normal" style={{ fontFamily: "'DM Serif Display', serif", color: colors.pet }}>Agente IA</h1>
        <div className="px-3 py-1 rounded-md text-[11px] font-semibold" style={{ background: colors.gnL, color: colors.gn }}>Sofía en línea</div>
      </div>

      <div className="grid rounded-xl border overflow-hidden mt-4"
        style={{ gridTemplateColumns: "280px 1fr", height: "calc(100vh - 200px)", background: colors.w, borderColor: colors.g1 }}>

        {/* Thread list */}
        <div className="border-r overflow-y-auto" style={{ borderColor: colors.g1 }}>
          {leads.length === 0 ? (
            <div className="p-8 text-center" style={{ color: colors.g3, fontSize: 12 }}>
              Sin conversaciones aún. Cuando un lead escriba por WhatsApp, aparecerá aquí.
            </div>
          ) : leads.map(l => (
            <div key={l.id} onClick={() => setSelected(l.id)}
              className="flex items-center gap-2 px-3 py-3 cursor-pointer border-b transition-colors"
              style={{ borderColor: colors.g0, background: selected === l.id ? colors.cp + "08" : "transparent" }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-[11px] shrink-0"
                style={{ background: l.tag === "hot" ? `linear-gradient(135deg, ${colors.cp}, ${colors.cpL})` : `linear-gradient(135deg, ${colors.tl}, ${colors.tlL})` }}>
                {(l.nombre || "?").split(" ").map(w => w[0]).filter(Boolean).join("").slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between mb-0.5">
                  <span className="text-xs font-semibold" style={{ color: colors.pet }}>{(l.nombre || l.telefono).split(" ").slice(0, 2).join(" ")}</span>
                </div>
                <div className="text-[11px] truncate" style={{ color: colors.g4 }}>
                  {CH_ICON[l.channel]} Conversación activa
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chat */}
        <div className="flex flex-col">
          {selLead ? (
            <>
              <div className="flex justify-between items-center px-4 py-2.5 border-b" style={{ borderColor: colors.g1 }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-[11px]"
                    style={{ background: `linear-gradient(135deg, ${colors.tl}, ${colors.tlL})` }}>
                    {(selLead.nombre || "?").split(" ").map(w => w[0]).filter(Boolean).join("").slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: colors.pet }}>{selLead.nombre || selLead.telefono}</div>
                    <div className="text-[11px]" style={{ color: colors.g4 }}>{selLead.channel} · {selLead.comuna} · {selLead.prop_value}</div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto" style={{ background: colors.g0 }}>
                {messages.length === 0 ? (
                  <div className="text-center py-12" style={{ color: colors.g3, fontSize: 12 }}>Sin mensajes aún</div>
                ) : messages.map(m => (
                  <div key={m.id} className="flex mb-2" style={{ justifyContent: m.sender === "lead" ? "flex-start" : "flex-end" }}>
                    <div className="max-w-[340px] px-3 py-2 shadow-sm"
                      style={{
                        background: m.sender === "lead" ? colors.w : colors.tl,
                        color: m.sender === "lead" ? colors.g7 : "#fff",
                        borderRadius: m.sender === "lead" ? "12px 12px 12px 4px" : "12px 12px 4px 12px",
                      }}>
                      {m.sender === "agent" && <div className="text-[9px] opacity-60 mb-0.5">Sofía (IA)</div>}
                      <div className="text-[13px] leading-relaxed">{m.body}</div>
                      <div className="text-[10px] opacity-50 mt-1 text-right">
                        {new Date(m.created_at).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2 p-3 border-t" style={{ borderColor: colors.g1, background: colors.w }}>
                <input placeholder="Escribe como humano (override IA)..."
                  className="flex-1 px-3 py-2 rounded-lg border outline-none"
                  style={{ borderColor: colors.g2, fontSize: 13, fontFamily: "inherit" }} />
                <button className="px-4 py-2 rounded-lg border-none text-white font-semibold cursor-pointer"
                  style={{ background: colors.cp, fontSize: 12.5 }}>Enviar</button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full" style={{ color: colors.g3, fontSize: 13 }}>
              Selecciona una conversación
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
