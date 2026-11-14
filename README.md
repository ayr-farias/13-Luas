# Sincronário das 13 Luas

Site estático em Astro: calendário do Sincronário da Paz com planner/diário por data.

    npm install
    npm run dev      # desenvolvimento
    npm run build    # gera ./dist
    npm test         # valida o cálculo contra datas conhecidas

Páginas: Hoje, Calendário, Diário (`/dia/?d=AAAA-MM-DD`), Guia, Sobre, Conta.
Cálculo em `src/lib/calc.ts`, dados em `src/lib/data.ts`.

## Publicar no GitHub Pages

1. Envie o código para `main` em https://github.com/ayr-farias/13-Luas
2. Settings → Pages → Source: **GitHub Actions**.
3. O site fica em https://ayr-farias.github.io/13-Luas/ (o `base` está em `astro.config.mjs`).

## Ativar o login (opcional)

Sem configuração, o planner funciona em **modo local** (salvo só no navegador). Para contas e sincronização:

1. Crie um projeto gratuito em https://supabase.com
2. SQL Editor: rode o conteúdo de `supabase/schema.sql` (cria a tabela `entries` com Row Level Security).
3. Authentication → URL Configuration: *Site URL* = `https://ayr-farias.github.io/13-Luas/` e adicione a mesma URL (e `http://localhost:4321/13-Luas/conta/`) em *Redirect URLs*.
4. Settings → API: copie *Project URL* e a chave *anon public*.
5. No GitHub: Settings → Secrets and variables → Actions → aba **Variables** → crie `PUBLIC_SUPABASE_URL` e `PUBLIC_SUPABASE_ANON_KEY`.
6. Rode o workflow de novo (Actions → Deploy → Run workflow).

Para testar localmente, copie `.env.example` para `.env` e preencha. A chave anon é pública por desenho; a proteção está nas regras RLS.
