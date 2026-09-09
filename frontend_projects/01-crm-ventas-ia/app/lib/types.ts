export type Role = "admin" | "gerente" | "vendedor";
export type LeadStatus = "open" | "won" | "lost" | "archived";
export type ActivityType = "llamada" | "email" | "whatsapp" | "reunion" | "nota" | "tarea";
export type QuoteStatus = "borrador" | "enviada" | "aprobada" | "rechazada";

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  avatarColor: string;
}

export interface Stage {
  id: string;
  name: string;
  color: string; // tailwind classes for badge
  probability: number; // 0-100
  order: number;
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  stages: Stage[];
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  value: number;
  currency: string;
  pipelineId: string;
  stageId: string;
  status: LeadStatus;
  ownerId: string;
  tags: string[];
  source: string;
  expectedClose: string; // ISO date
  createdAt: string;
  updatedAt: string;
  lostReason?: string;
  score?: number;
}

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  title: string;
  detail: string;
  date: string; // ISO
  done: boolean;
  reminder?: string; // ISO optional
  createdBy: string;
}

export interface QuoteItem {
  id: string;
  description: string;
  qty: number;
  price: number;
}

export interface Quote {
  id: string;
  leadId: string;
  number: string;
  items: QuoteItem[];
  discount: number; // %
  tax: number; // %
  status: QuoteStatus;
  notes: string;
  createdAt: string;
  validUntil: string;
}

export interface AppSettings {
  companyName: string;
  currency: string;
  lossReasons: string[];
  tags: string[];
  activePipelineId: string;
  activeRole: Role;
  activeUserId: string;
}
