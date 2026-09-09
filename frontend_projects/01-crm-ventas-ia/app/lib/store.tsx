"use client";
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { Activity, AppSettings, Lead, Pipeline, Quote, User } from "./types";
import { seedPipelines, seedSettings, seedUsers } from "./seed";
import { seedLeads } from "./seed-leads";
import { seedLeads2 } from "./seed-leads2";
import { seedActivities, seedQuotes } from "./seed-misc";

export interface CrmState {
  users: User[];
  pipelines: Pipeline[];
  leads: Lead[];
  activities: Activity[];
  quotes: Quote[];
  settings: AppSettings;
  hydrated: boolean;
}

type Action =
  | { type: "HYDRATE"; state: CrmState }
  | { type: "ADD_LEAD"; lead: Lead }
  | { type: "UPDATE_LEAD"; lead: Lead }
  | { type: "DELETE_LEAD"; id: string }
  | { type: "MOVE_LEAD"; id: string; stageId: string }
  | { type: "ADD_ACTIVITY"; activity: Activity }
  | { type: "TOGGLE_ACTIVITY"; id: string }
  | { type: "DELETE_ACTIVITY"; id: string }
  | { type: "ADD_QUOTE"; quote: Quote }
  | { type: "UPDATE_QUOTE"; quote: Quote }
  | { type: "DELETE_QUOTE"; id: string }
  | { type: "SET_PIPELINES"; pipelines: Pipeline[] }
  | { type: "SET_SETTINGS"; settings: AppSettings }
  | { type: "RESET_DEMO" };

const STORAGE_KEY = "crm-ia-v1";

function initialState(): CrmState {
  return {
    users: seedUsers,
    pipelines: seedPipelines,
    leads: [...seedLeads, ...seedLeads2],
    activities: seedActivities,
    quotes: seedQuotes,
    settings: seedSettings,
    hydrated: false
  };
}

function reducer(state: CrmState, action: Action): CrmState {
  switch (action.type) {
    case "HYDRATE":
      return { ...action.state, hydrated: true };
    case "ADD_LEAD":
      return { ...state, leads: [action.lead, ...state.leads] };
    case "UPDATE_LEAD":
      return { ...state, leads: state.leads.map((l) => (l.id === action.lead.id ? action.lead : l)) };
    case "DELETE_LEAD":
      return { ...state, leads: state.leads.filter((l) => l.id !== action.id), activities: state.activities.filter((a) => a.leadId !== action.id), quotes: state.quotes.filter((q) => q.leadId !== action.id) };
    case "MOVE_LEAD": {
      const lead = state.leads.find((l) => l.id === action.id);
      if (!lead) return state;
      const updated: Lead = { ...lead, stageId: action.stageId, updatedAt: new Date().toISOString() };
      const autoActivity: Activity = {
        id: `a-${Date.now()}`,
        leadId: lead.id,
        type: "nota",
        title: "Cambio de etapa",
        detail: `Movido a etapa ${action.stageId}`,
        date: new Date().toISOString(),
        done: true,
        createdBy: state.settings.activeUserId
      };
      return { ...state, leads: state.leads.map((l) => (l.id === updated.id ? updated : l)), activities: [autoActivity, ...state.activities] };
    }
    case "ADD_ACTIVITY":
      return { ...state, activities: [action.activity, ...state.activities] };
    case "TOGGLE_ACTIVITY":
      return { ...state, activities: state.activities.map((a) => (a.id === action.id ? { ...a, done: !a.done } : a)) };
    case "DELETE_ACTIVITY":
      return { ...state, activities: state.activities.filter((a) => a.id !== action.id) };
    case "ADD_QUOTE":
      return { ...state, quotes: [action.quote, ...state.quotes] };
    case "UPDATE_QUOTE":
      return { ...state, quotes: state.quotes.map((q) => (q.id === action.quote.id ? action.quote : q)) };
    case "DELETE_QUOTE":
      return { ...state, quotes: state.quotes.filter((q) => q.id !== action.id) };
    case "SET_PIPELINES":
      return { ...state, pipelines: action.pipelines };
    case "SET_SETTINGS":
      return { ...state, settings: action.settings };
    case "RESET_DEMO":
      return { ...initialState(), hydrated: true };
    default:
      return state;
  }
}

const CrmContext = createContext<{ state: CrmState; dispatch: React.Dispatch<Action> } | null>(null);

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined as unknown as CrmState, initialState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CrmState;
        dispatch({ type: "HYDRATE", state: { ...parsed, hydrated: true } });
      } else {
        dispatch({ type: "HYDRATE", state: { ...initialState(), hydrated: true } });
      }
    } catch {
      dispatch({ type: "HYDRATE", state: { ...initialState(), hydrated: true } });
    }
  }, []);

  useEffect(() => {
    if (!state.hydrated) return;
    try {
      const { hydrated: _h, ...toSave } = state;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      /* storage lleno o bloqueado */
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm debe usarse dentro de CrmProvider");
  return ctx;
}

export function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
