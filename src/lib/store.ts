// Armazenamento do planner/diário por data.
// Dois adaptadores com a mesma interface:
//   • local — localStorage do navegador (sem login; usado quando o Supabase não está configurado)
//   • cloud — Supabase (login por e-mail e senha ou link mágico; dados por usuário protegidos por RLS)

import type { SupabaseClient } from '@supabase/supabase-js';
import { CLOUD, SUPABASE_URL, SUPABASE_ANON_KEY } from './config';
import { u } from './url';

export interface Task {
  id: string;
  text: string;
  done: boolean;
  time: string; // "HH:MM" ou ""
}

export interface Entry {
  date: string; // YYYY-MM-DD (data gregoriana)
  intention: string;
  tasks: Task[];
  journal: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  email: string;
}

export interface Store {
  mode: 'local' | 'cloud';
  getSession(): Promise<Session | null>;
  onAuthChange(cb: (s: Session | null) => void): void;
  signIn(email: string, password: string): Promise<void>;
  signUp(email: string, password: string): Promise<{ needsConfirmation: boolean }>;
  magicLink(email: string): Promise<void>;
  signOut(): Promise<void>;
  get(date: string): Promise<Entry | null>;
  save(entry: Entry): Promise<void>;
  range(from: string, to: string): Promise<Entry[]>;
}

export const emptyEntry = (date: string): Entry => ({ date, intention: '', tasks: [], journal: '', updatedAt: '' });
export const hasContent = (e: Entry) => Boolean(e.intention.trim() || e.journal.trim() || e.tasks.length);
export const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);

function cleanTasks(raw: unknown): Task[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t) => t && typeof t === 'object')
    .map((t: any) => ({
      id: typeof t.id === 'string' && t.id ? t.id : newId(),
      text: typeof t.text === 'string' ? t.text : '',
      done: Boolean(t.done),
      time: typeof t.time === 'string' ? t.time : '',
    }));
}

function cleanEntry(date: string, raw: any): Entry {
  return {
    date,
    intention: typeof raw?.intention === 'string' ? raw.intention : '',
    tasks: cleanTasks(raw?.tasks),
    journal: typeof raw?.journal === 'string' ? raw.journal : '',
    updatedAt: typeof raw?.updatedAt === 'string' ? raw.updatedAt : typeof raw?.updated_at === 'string' ? raw.updated_at : '',
  };
}

/* ——————— modo local ——————— */

const KEY = 'sinc:entries:v1';
const IMPORTED_KEY = 'sinc:imported:v1';

function readLocal(): Record<string, Entry> {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || '{}');
    const out: Record<string, Entry> = {};
    for (const [date, e] of Object.entries(parsed ?? {})) out[date] = cleanEntry(date, e);
    return out;
  } catch {
    return {};
  }
}

function writeLocal(all: Record<string, Entry>) {
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    throw new Error('Não foi possível salvar neste navegador (armazenamento bloqueado ou cheio).');
  }
}

const localStore: Store = {
  mode: 'local',
  async getSession() {
    return { id: 'local', email: 'modo local' };
  },
  onAuthChange() {},
  async signIn() {
    throw new Error('O login não está configurado nesta instalação.');
  },
  async signUp() {
    throw new Error('O login não está configurado nesta instalação.');
  },
  async magicLink() {
    throw new Error('O login não está configurado nesta instalação.');
  },
  async signOut() {},
  async get(date) {
    return readLocal()[date] ?? null;
  },
  async save(entry) {
    const all = readLocal();
    if (hasContent(entry)) all[entry.date] = { ...entry, updatedAt: new Date().toISOString() };
    else delete all[entry.date];
    writeLocal(all);
  },
  async range(from, to) {
    return Object.values(readLocal()).filter((e) => e.date >= from && e.date <= to);
  },
};

/** Entradas salvas no navegador (para importar para a conta depois do login). */
export function localEntries(): Entry[] {
  return Object.values(readLocal()).filter(hasContent);
}
export function wasImported(): boolean {
  try {
    return localStorage.getItem(IMPORTED_KEY) === '1';
  } catch {
    return true;
  }
}
export function markImported() {
  try {
    localStorage.setItem(IMPORTED_KEY, '1');
  } catch {
    /* ignora */
  }
}

/* ——————— Supabase ——————— */

let clientPromise: Promise<SupabaseClient> | null = null;
function client(): Promise<SupabaseClient> {
  clientPromise ??= import('@supabase/supabase-js').then(({ createClient }) =>
    createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    }),
  );
  return clientPromise;
}

function traduzErro(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail (veja a caixa de entrada) antes de entrar.';
  if (m.includes('already registered')) return 'Já existe uma conta com este e-mail.';
  if (m.includes('at least') && m.includes('characters')) return 'A senha precisa ter ao menos 6 caracteres.';
  if (m.includes('rate limit') || m.includes('too many')) return 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
  if (m.includes('valid email') || m.includes('invalid email')) return 'Digite um e-mail válido.';
  if (m.includes('failed to fetch') || m.includes('network')) return 'Sem conexão com o servidor. Verifique sua internet.';
  return message;
}

const toSession = (user: { id: string; email?: string | null } | null | undefined): Session | null =>
  user ? { id: user.id, email: user.email ?? '' } : null;

const redirectUrl = () => `${location.origin}${u('/conta/')}`;

const cloudStore: Store = {
  mode: 'cloud',
  async getSession() {
    const c = await client();
    const { data } = await c.auth.getSession();
    return toSession(data.session?.user);
  },
  onAuthChange(cb) {
    client().then((c) => c.auth.onAuthStateChange((_event, session) => cb(toSession(session?.user))));
  },
  async signIn(email, password) {
    const c = await client();
    const { error } = await c.auth.signInWithPassword({ email, password });
    if (error) throw new Error(traduzErro(error.message));
  },
  async signUp(email, password) {
    const c = await client();
    const { data, error } = await c.auth.signUp({ email, password, options: { emailRedirectTo: redirectUrl() } });
    if (error) throw new Error(traduzErro(error.message));
    return { needsConfirmation: !data.session };
  },
  async magicLink(email) {
    const c = await client();
    const { error } = await c.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectUrl() } });
    if (error) throw new Error(traduzErro(error.message));
  },
  async signOut() {
    const c = await client();
    await c.auth.signOut();
  },
  async get(date) {
    const c = await client();
    const { data, error } = await c.from('entries').select('date,intention,tasks,journal,updated_at').eq('date', date).maybeSingle();
    if (error) throw new Error(traduzErro(error.message));
    return data ? cleanEntry(date, data) : null;
  },
  async save(entry) {
    const c = await client();
    const session = await this.getSession();
    if (!session) throw new Error('Sua sessão expirou. Entre novamente.');
    if (!hasContent(entry)) {
      const { error } = await c.from('entries').delete().eq('date', entry.date);
      if (error) throw new Error(traduzErro(error.message));
      return;
    }
    const { error } = await c.from('entries').upsert(
      {
        user_id: session.id,
        date: entry.date,
        intention: entry.intention,
        tasks: entry.tasks,
        journal: entry.journal,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,date' },
    );
    if (error) throw new Error(traduzErro(error.message));
  },
  async range(from, to) {
    const c = await client();
    const { data, error } = await c.from('entries').select('date,intention,tasks,journal,updated_at').gte('date', from).lte('date', to);
    if (error) throw new Error(traduzErro(error.message));
    return (data ?? []).map((row: any) => cleanEntry(row.date, row));
  },
};

export const getStore = (): Store => (CLOUD ? cloudStore : localStore);
