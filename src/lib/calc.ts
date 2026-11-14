// Motor de cálculo do Sincronário das 13 Luas (Dreamspell).
//
// Regras:
//  • Ano (Anel Solar) começa em 26/jul e tem 13 Luas × 28 dias + 1 Dia Fora do Tempo (25/jul) = 365.
//  • 29/fev é o "Dia 0.0 / Hunab Ku 21": não tem Kin, Lua nem dia da semana.
//  • Os Kins avançam 1 por dia (inclusive no Dia Fora do Tempo), exceto em 29/fev.
//  • Âncora: 07/09/2025 = Kin 167 (Mão Espectral Azul: tom 11, selo 7), confirmada por várias fontes
//    e validada em scripts/test-calc.ts com dezenas de datas, incluindo anos bissextos.

import { SELOS, TONS } from './data';

const MS = 86400000;

export interface YMD {
  y: number;
  m: number;
  d: number;
}

export const ANCHOR = { y: 2025, m: 9, d: 7, kin: 167 };
const NS_BASE_YEAR = 1987; // NS1.0 começou em 26/07/1987

export const mod = (a: number, n: number) => ((a % n) + n) % n;
export const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
export const isFeb29 = ({ m, d }: YMD) => m === 2 && d === 29;

export function toDayNumber({ y, m, d }: YMD): number {
  const dt = new Date(0);
  dt.setUTCFullYear(y, m - 1, d);
  return Math.round(dt.getTime() / MS);
}

export function fromDayNumber(n: number): YMD {
  const dt = new Date(n * MS);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
}

const leapsThrough = (y: number) => Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400);

// quantos 29/fev ocorreram até a data (inclusive)
function leapDaysUpTo({ y, m, d }: YMD): number {
  let n = leapsThrough(y - 1);
  if (isLeap(y) && (m > 2 || (m === 2 && d === 29))) n += 1;
  return n;
}

// contador contínuo de dias que ignora 29/fev
const syncDay = (date: YMD) => toDayNumber(date) - leapDaysUpTo(date);
const ANCHOR_SYNC = syncDay(ANCHOR);

export function kinOf(date: YMD): number | null {
  if (isFeb29(date)) return null;
  return mod(ANCHOR.kin - 1 + syncDay(date) - ANCHOR_SYNC, 260) + 1;
}

export const seloDoKin = (kin: number) => ((kin - 1) % 20) + 1;
export const tomDoKin = (kin: number) => ((kin - 1) % 13) + 1;

export function kinFromSeloTom(selo: number, tom: number): number {
  for (let k = 1; k <= 260; k++) if (seloDoKin(k) === selo && tomDoKin(k) === tom) return k;
  throw new Error('kin inexistente');
}

export function ringStartYear(date: YMD): number {
  return date.m > 7 || (date.m === 7 && date.d >= 26) ? date.y : date.y - 1;
}

/** Data gregoriana do índice (0..364) dentro do Anel que começa em 26/jul de startYear. */
export function ringDate(startYear: number, idx: number): YMD {
  let dn = toDayNumber({ y: startYear, m: 7, d: 26 });
  let left = idx;
  while (left > 0) {
    dn += 1;
    if (!isFeb29(fromDayNumber(dn))) left -= 1;
  }
  return fromDayNumber(dn);
}

export interface RingInfo {
  startYear: number;
  ns: number;
  nome: string; // NS1.37
  kin: number;
  selo: number;
  tom: number;
  posCiclo52: number; // 1..52
  ciclo13: number; // 1..4
  anoCiclo13: number; // 1..13
  luas: { n: number; inicio: YMD; fim: YMD }[];
  diaForaDoTempo: YMD;
  hunabKu: YMD | null; // 29/fev dentro do Anel, se houver
}

export function ringInfo(startYear: number): RingInfo {
  const ns = startYear - NS_BASE_YEAR;
  const kin = kinOf({ y: startYear, m: 7, d: 26 }) as number;
  const pos0 = mod(ns, 52);
  const luas = Array.from({ length: 13 }, (_, i) => ({
    n: i + 1,
    inicio: ringDate(startYear, i * 28),
    fim: ringDate(startYear, i * 28 + 27),
  }));
  const feb = startYear + 1;
  return {
    startYear,
    ns,
    nome: `NS1.${ns}`,
    kin,
    selo: seloDoKin(kin),
    tom: tomDoKin(kin),
    posCiclo52: pos0 + 1,
    ciclo13: Math.floor(pos0 / 13) + 1,
    anoCiclo13: (pos0 % 13) + 1,
    luas,
    diaForaDoTempo: ringDate(startYear, 364),
    hunabKu: isLeap(feb) ? { y: feb, m: 2, d: 29 } : null,
  };
}

const GUIA_OFFSET: Record<number, number> = { 1: 0, 6: 0, 11: 0, 2: 12, 7: 12, 12: 12, 3: 4, 8: 4, 13: 4, 4: 16, 9: 16, 5: 8, 10: 8 };

export interface OraculoMembro {
  kin: number;
  selo: number;
  tom: number;
}
export interface Oraculo {
  destino: OraculoMembro;
  guia: OraculoMembro;
  analogo: OraculoMembro;
  antipoda: OraculoMembro;
  oculto: OraculoMembro;
}

const membro = (selo: number, tom: number): OraculoMembro => ({ kin: kinFromSeloTom(selo, tom), selo, tom });
const wrap20 = (n: number) => mod(n - 1, 20) + 1;

export function oraculoDoKin(kin: number): Oraculo {
  const selo = seloDoKin(kin);
  const tom = tomDoKin(kin);
  return {
    destino: { kin, selo, tom },
    guia: membro(wrap20(selo + GUIA_OFFSET[tom]), tom),
    analogo: membro(wrap20(19 - selo), tom),
    antipoda: membro(wrap20(selo + 10), tom),
    oculto: membro(wrap20(21 - selo), 14 - tom),
  };
}

export interface Lunar {
  fase: number; // 0..1 (0 = nova, 0.5 = cheia)
  iluminacao: number; // 0..1
  nome: string;
}

const SYNODIC = 29.530588853;
const NEW_MOON_JD = 2451550.26; // 06/01/2000 18:14 UTC
const FASES = ['Lua Nova', 'Lua Crescente', 'Quarto Crescente', 'Crescente Gibosa', 'Lua Cheia', 'Minguante Gibosa', 'Quarto Minguante', 'Lua Minguante'];

/** Fase média da Lua ao meio-dia UTC (aproximação; erro de até ~1 dia). */
export function faseLunar(date: YMD): Lunar {
  const jd = toDayNumber(date) + 2440587.5 + 0.5;
  const fase = mod((jd - NEW_MOON_JD) / SYNODIC, 1);
  return {
    fase,
    iluminacao: (1 - Math.cos(2 * Math.PI * fase)) / 2,
    nome: FASES[Math.floor(fase * 8 + 0.5) % 8],
  };
}

export type TipoDia = 'normal' | 'fora-do-tempo' | 'bissexto';

export interface Leitura {
  data: YMD;
  iso: string;
  diaSemanaGregoriano: number;
  tipo: TipoDia;
  anel: RingInfo;
  indice: number | null; // 0..364
  lua: number | null;
  diaDaLua: number | null;
  heptada: number | null; // semana da lua 1..4
  plasma: number | null; // 1..7
  semanaDoAnel: number | null; // 1..52
  kin: number | null;
  selo: number | null;
  tom: number | null;
  onda: number | null;
  posNaOnda: number | null;
  seloDaOnda: number | null;
  castelo: number | null;
  familia: number | null;
  oraculo: Oraculo | null;
  lunar: Lunar;
}

export const pad = (n: number, w = 2) => String(n).padStart(w, '0');
export const toISO = ({ y, m, d }: YMD) => `${pad(y, 4)}-${pad(m)}-${pad(d)}`;

export function parseISO(s: string): YMD | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const date = { y: +m[1], m: +m[2], d: +m[3] };
  const back = fromDayNumber(toDayNumber(date));
  return back.y === date.y && back.m === date.m && back.d === date.d ? date : null;
}

export function leitura(date: YMD): Leitura {
  const start = ringStartYear(date);
  const anel = ringInfo(start);
  const base = {
    data: date,
    iso: toISO(date),
    diaSemanaGregoriano: mod(toDayNumber(date) + 4, 7),
    anel,
    lunar: faseLunar(date),
  };
  const vazio = {
    indice: null, lua: null, diaDaLua: null, heptada: null, plasma: null, semanaDoAnel: null,
    kin: null, selo: null, tom: null, onda: null, posNaOnda: null, seloDaOnda: null,
    castelo: null, familia: null, oraculo: null,
  };

  if (isFeb29(date)) {
    return { ...base, ...vazio, tipo: 'bissexto', lua: 8, diaDaLua: null };
  }

  const kin = kinOf(date) as number;
  const selo = seloDoKin(kin);
  const tom = tomDoKin(kin);
  const onda = Math.floor((kin - 1) / 13) + 1;
  const kinData = {
    kin,
    selo,
    tom,
    onda,
    posNaOnda: tom,
    seloDaOnda: ((onda - 1) * 13) % 20 + 1,
    castelo: Math.floor((kin - 1) / 52) + 1,
    familia: selo % 5 === 0 ? 5 : selo % 5,
    oraculo: oraculoDoKin(kin),
  };

  const indice = syncDay(date) - syncDay({ y: start, m: 7, d: 26 });
  if (indice === 364) {
    return { ...base, ...vazio, ...kinData, tipo: 'fora-do-tempo', indice };
  }
  const diaDaLua = (indice % 28) + 1;
  return {
    ...base,
    ...vazio,
    ...kinData,
    tipo: 'normal',
    indice,
    lua: Math.floor(indice / 28) + 1,
    diaDaLua,
    heptada: Math.floor((diaDaLua - 1) / 7) + 1,
    plasma: ((diaDaLua - 1) % 7) + 1,
    semanaDoAnel: Math.floor(indice / 7) + 1,
  };
}

export const seloTom = (kin: number) => ({ selo: SELOS[seloDoKin(kin) - 1], tom: TONS[tomDoKin(kin) - 1] });

/** Avança n dias do Sincronário (ignora 29/fev) a partir de uma data. */
export function addDiasSinc(date: YMD, n: number): YMD {
  let dn = toDayNumber(date);
  let left = n;
  while (left > 0) {
    dn += 1;
    if (!isFeb29(fromDayNumber(dn))) left -= 1;
  }
  return fromDayNumber(dn);
}

/** Próximas ocorrências de um Kin a partir de uma data (inclusive). */
export function proximasDoKin(kin: number, desde: YMD, quantas = 8): YMD[] {
  let atual = desde;
  if (isFeb29(atual)) atual = addDiasSinc(atual, 1);
  const k0 = kinOf(atual) as number;
  let d = addDiasSinc(atual, mod(kin - k0, 260));
  const out: YMD[] = [d];
  while (out.length < quantas) {
    d = addDiasSinc(d, 260);
    out.push(d);
  }
  return out;
}
