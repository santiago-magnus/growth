export interface Lead {
  id: string;
  nombre: string;
  edad: number | null;
  comuna: string;
  email: string;
  telefono: string;
  score: number;
  stage: string;
  lifecycle: string;
  channel: string;
  tag: string;
  prop_value: string;
  hipoteca: string;
  owner_id: string | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  lead_id: string;
  channel: string;
  status: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: "lead" | "agent" | "human";
  body: string;
  created_at: string;
}

export interface Meeting {
  id: string;
  lead_id: string;
  exec_id: string | null;
  event_type: string;
  date: string;
  time: string;
  mode: string;
  status: string;
  created_at: string;
}

export interface Note {
  id: string;
  lead_id: string;
  type: string;
  body: string;
  author_id: string | null;
  created_at: string;
}

export interface Task {
  id: string;
  lead_id: string;
  title: string;
  due_date: string | null;
  priority: string;
  done: boolean;
  assigned_to: string | null;
  created_at: string;
}
