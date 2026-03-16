// Magnus Design System — shared tokens
export const colors = {
  pet: "#0B2F33",
  tl: "#1B6E6A",
  tlL: "#2A9490",
  cp: "#C47A4A",
  cpL: "#D9956A",
  w: "#FFFFFF",
  bg: "#F5F0EA",
  g0: "#F9F8F6",
  g1: "#F0EDE8",
  g2: "#DDD8D0",
  g3: "#B8B0A4",
  g4: "#8C8278",
  g5: "#5C554E",
  g7: "#2C2820",
  gn: "#2D7A55",
  gnL: "#EAF5EE",
  rd: "#B54040",
  rdL: "#FDEAEA",
  am: "#D4903A",
  amL: "#FDF2EA",
  bl: "#2B5BA8",
  blL: "#EAF0FC",
  pu: "#6B48B5",
  puL: "#F0EAFA",
};

export const CH_ICON: Record<string, string> = {
  whatsapp: "📱", web: "🌐", email: "✉️",
  instagram: "📸", facebook: "💬", referido: "🤝", feria: "🎪",
};

export const CH_COLOR: Record<string, string> = {
  whatsapp: colors.gn, web: colors.bl, email: colors.pu,
  instagram: "#E1306C", facebook: colors.bl, referido: colors.cp, feria: colors.am,
};

export const LC_LABEL: Record<string, string> = {
  new: "Nuevo", conversation: "En conversación", qualified: "Calificado",
  meeting_booked: "Reunión agendada", proposal_sent: "Propuesta enviada",
  closed_won: "Cerrado ganado", closed_lost: "Cerrado perdido",
};

export const LC_COLOR: Record<string, string> = {
  new: colors.bl, conversation: colors.tlL, qualified: colors.tl,
  meeting_booked: colors.am, proposal_sent: colors.cp,
  closed_won: colors.gn, closed_lost: colors.rd,
};

export const STAGES = [
  "Nuevo", "Contactado", "Calificado", "En evaluación",
  "Propuesta", "Negociación", "Ganado", "Perdido",
];

export const STAGE_COLORS = [
  colors.bl, "#3DB8B2", colors.tlL, colors.tl,
  colors.cp, colors.cpL, colors.gn, colors.rd,
];
