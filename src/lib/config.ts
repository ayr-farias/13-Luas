// Configuração do login e da sincronização (Supabase).
// Sem essas variáveis, o site funciona em "modo local": diário e tarefas ficam salvos
// apenas no navegador. A chave "anon" do Supabase é pública por desenho; quem protege
// os dados é a Row Level Security definida em supabase/schema.sql.
export const SUPABASE_URL: string = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY: string = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '';
export const CLOUD = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
