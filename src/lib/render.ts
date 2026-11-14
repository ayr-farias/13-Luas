// Renderiza uma "leitura" de data (HTML em string) — usado na página inicial, consulta e calendário.

import {
  SELOS, TONS, LUAS, PLASMAS, CASTELOS, FAMILIAS, COR_HEX, COR_INFO, COR_SEMANA, DIAS_SEMANA, MESES,
  kinNome, luaNome, corAdj, ANO_NOVO, DIA_FORA_DO_TEMPO, HUNAB_KU,
} from './data';
import { type Leitura, type YMD, type OraculoMembro, pad } from './calc';
import { sigilSvg, toneSvg, moonSvg } from './svg';
import { u } from './url';

const MES_ABR = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const fmtLong = ({ y, m, d }: YMD) => `${d} de ${MESES[m - 1]} de ${y}`;
export const fmtShort = ({ m, d }: YMD) => `${d} ${MES_ABR[m - 1]}`;
export const fmtDM = ({ m, d }: YMD) => `${pad(d)}/${pad(m)}`;

const steps = (pos: number, total: number) =>
  `<div class="steps" aria-hidden="true">${Array.from({ length: total }, (_, i) => `<span class="${i + 1 < pos ? 'on' : i + 1 === pos ? 'now' : ''}"></span>`).join('')}</div>`;

function oraculoCell(papel: string, rotulo: string, m: OraculoMembro): string {
  const selo = SELOS[m.selo - 1];
  const tom = TONS[m.tom - 1];
  const hex = COR_HEX[selo.cor];
  return `<div class="oracle__cell oracle__cell--${papel}" style="--sc:${hex}">
    <span class="oracle__role">${rotulo}</span>
    ${sigilSvg(selo.n, hex, 52)}
    <strong>${kinNome(selo, tom)}</strong>
    <small>Kin ${m.kin}</small>
  </div>`;
}

function bannerEspecial(l: Leitura): string {
  if (l.tipo === 'bissexto') return `<aside class="banner"><h3>${HUNAB_KU.nome}</h3><p>${HUNAB_KU.texto}</p></aside>`;
  if (l.tipo === 'fora-do-tempo') return `<aside class="banner"><h3>${DIA_FORA_DO_TEMPO.nome}</h3><p>${DIA_FORA_DO_TEMPO.texto}</p></aside>`;
  if (l.lua === 1 && l.diaDaLua === 1) return `<aside class="banner"><h3>${ANO_NOVO.nome}</h3><p>${ANO_NOVO.texto}</p></aside>`;
  if (l.diaDaLua === 1) return `<aside class="banner banner--soft"><p>Primeiro dia da ${luaNome(LUAS[(l.lua as number) - 1])}.</p></aside>`;
  if (l.diaDaLua === 28) return `<aside class="banner banner--soft"><p>Último dia da ${luaNome(LUAS[(l.lua as number) - 1])}.</p></aside>`;
  return '';
}


export function linhaSync(l: Leitura): string {
  if (l.tipo === 'bissexto') return 'Dia 0.0 · Hunab Ku 21 — entre os dias 22 e 23 da 8ª Lua Galáctica';
  if (l.tipo === 'fora-do-tempo') return `Dia Fora do Tempo · encerra o Anel Solar ${l.anel.nome}`;
  return `${luaNome(LUAS[(l.lua as number) - 1])} · dia ${l.diaDaLua} de 28`;
}

/** Versão enxuta: data, Kin e plasma do dia. A leitura completa é renderLeitura(). */
export function renderResumo(l: Leitura): string {
  const sel = l.selo ? SELOS[l.selo - 1] : null;
  const tom = l.tom ? TONS[l.tom - 1] : null;
  const head = `<header class="lt-head">
    <p class="eyebrow">${DIAS_SEMANA[l.diaSemanaGregoriano]}</p>
    <h2 class="lt-date">${fmtLong(l.data)}</h2>
    <p class="lt-sync">${linhaSync(l)}</p>
  </header>`;
  let kin = '';
  let plasma = '';
  if (sel && tom && l.kin) {
    const hex = COR_HEX[sel.cor];
    kin = `<section class="kin kin--compact" style="--sc:${hex}">
      <div class="kin__glyphs">${sigilSvg(sel.n, hex, 96)}${toneSvg(tom.n, hex, 52)}</div>
      <div class="kin__body">
        <p class="eyebrow">Kin ${l.kin} de 260</p>
        <h3 class="kin__name">${kinNome(sel, tom)}</h3>
        <p class="muted" style="margin:0">${tom.acao} · ${tom.poder} · ${tom.essencia} — ${sel.acao.toLowerCase()} · ${sel.poder.toLowerCase()} · ${sel.essencia.toLowerCase()}</p>
      </div>
    </section>`;
  }
  if (l.plasma && l.heptada) {
    const p = PLASMAS[l.plasma - 1];
    const cor = COR_SEMANA[l.heptada - 1];
    plasma = `<p class="plasma-line">Plasma do dia: <strong style="color:${COR_HEX[p.cor]}">${p.nome}</strong> (${p.verbo.toLowerCase()}) · semana <strong style="color:${COR_HEX[cor]}">${corAdj(cor, true).toLowerCase()}</strong>, ${COR_INFO[cor].verbo.toLowerCase()}</p>`;
  }
  return `<div class="lt">${head}${bannerEspecial(l)}${kin}${plasma}</div>`;
}

export function renderLeitura(l: Leitura): string {
  const { anel } = l;
  const kinSel = l.selo ? SELOS[l.selo - 1] : null;
  const kinTom = l.tom ? TONS[l.tom - 1] : null;
  const hex = kinSel ? COR_HEX[kinSel.cor] : COR_HEX.amarelo;

  const sync = linhaSync(l);

  const head = `<header class="lt-head">
    <p class="eyebrow">${DIAS_SEMANA[l.diaSemanaGregoriano]}</p>
    <h2 class="lt-date">${fmtLong(l.data)}</h2>
    <p class="lt-sync">${sync}</p>
  </header>`;

  let kinBlock = '';
  let cards = '';
  let oracle = '';

  if (kinSel && kinTom && l.kin) {
    const nome = kinNome(kinSel, kinTom);
    const info = COR_INFO[kinSel.cor];
    kinBlock = `<section class="kin" style="--sc:${hex}">
      <div class="kin__glyphs">${sigilSvg(kinSel.n, hex, 132)}${toneSvg(kinTom.n, hex, 64)}</div>
      <div class="kin__body">
        <p class="eyebrow">Kin ${l.kin} de 260</p>
        <h3 class="kin__name">${nome}</h3>
        <ul class="chips">
          <li class="chip" style="--c:${hex}">Selo ${kinSel.n} · ${kinSel.nome}</li>
          <li class="chip">Tom ${kinTom.n} · ${kinTom.m}</li>
          <li class="chip">${kinSel.maya} <small>(nome maia)</small></li>
          <li class="chip" style="--c:${hex}">${corAdj(kinSel.cor, false)} · ${info.direcao}</li>
        </ul>
      </div>
    </section>`;

    const sOnda = SELOS[(l.seloDaOnda as number) - 1];
    const cast = CASTELOS[(l.castelo as number) - 1];
    const castHex = COR_HEX[cast.cor];
    const fam = FAMILIAS[(l.familia as number) - 1];
    const ondaNoCastelo = ((((l.onda as number) - 1) % 4) + 1);

    cards += `<article class="card" style="--sc:${hex}">
      <h4>Selo · <a href="${u("/guia/#selos")}">${kinSel.nome} ${corAdj(kinSel.cor, kinSel.fem)}</a></h4>
      <dl class="trio"><div><dt>Ação</dt><dd>${kinSel.acao}</dd></div><div><dt>Poder</dt><dd>${kinSel.poder}</dd></div><div><dt>Essência</dt><dd>${kinSel.essencia}</dd></div></dl>
      <p>${kinSel.texto}</p>
      <p class="muted">Família terrestre: <strong>${fam.nome}</strong></p>
    </article>
    <article class="card" style="--sc:${hex}">
      <h4>Tom · <a href="${u("/guia/#tons")}">${kinTom.n} — ${kinTom.m}</a></h4>
      <dl class="trio"><div><dt>Ação</dt><dd>${kinTom.acao}</dd></div><div><dt>Poder</dt><dd>${kinTom.poder}</dd></div><div><dt>Essência</dt><dd>${kinTom.essencia}</dd></div></dl>
      <p>${kinTom.texto}</p>
      <p class="quote">“${kinTom.pergunta}”</p>
    </article>
    <article class="card">
      <h4>Onda Encantada</h4>
      <p class="big">${sOnda.nome} ${corAdj(sOnda.cor, sOnda.fem)}</p>
      <p>Dia <strong>${l.posNaOnda}</strong> de 13 · onda ${l.onda} de 20</p>
      ${steps(l.posNaOnda as number, 13)}
      <p class="muted">Poder da onda: ${sOnda.poder}. Cada onda atravessa os 13 tons, do propósito à presença.</p>
    </article>
    <article class="card" style="--sc:${castHex}">
      <h4>Castelo</h4>
      <p class="big" style="color:${castHex}">${cast.nome}</p>
      <p>${cast.tema} · ${cast.direcao} · Kins ${cast.primeiroKin}–${cast.ultimoKin}</p>
      ${steps(ondaNoCastelo, 4)}
      <p class="muted">Onda ${ondaNoCastelo} de 4 neste castelo. ${cast.texto}</p>
    </article>`;

    const o = l.oraculo!;
    oracle = `<section class="card oracle-wrap">
      <h4>Oráculo do Destino</h4>
      <div class="oracle">
        ${oraculoCell('guia', 'Guia', o.guia)}
        ${oraculoCell('antipoda', 'Antípoda · desafio', o.antipoda)}
        ${oraculoCell('destino', 'Destino', o.destino)}
        ${oraculoCell('analogo', 'Análogo · apoio', o.analogo)}
        ${oraculoCell('oculto', 'Oculto · poder escondido', o.oculto)}
      </div>
    </section>`;
  }

  // Lua do Sincronário + plasma
  if (l.lua && l.tipo === 'normal') {
    const lua = LUAS[l.lua - 1];
    const tomLua = TONS[l.lua - 1];
    const periodo = anel.luas[l.lua - 1];
    const plasma = PLASMAS[(l.plasma as number) - 1];
    const plHex = COR_HEX[plasma.cor];
    const corSem = COR_SEMANA[(l.heptada as number) - 1];
    const semHex = COR_HEX[corSem];
    cards += `<article class="card">
      <h4><a href="${u("/guia/#luas")}">${luaNome(lua)}</a></h4>
      <p>Lua ${lua.n} de 13 · totem: <strong>${lua.totem}</strong> · tom ${tomLua.m}</p>
      <p class="muted">${fmtShort(periodo.inicio)} a ${fmtShort(periodo.fim)} · ${tomLua.acao} · ${tomLua.poder} · ${tomLua.essencia}</p>
      ${steps(l.diaDaLua as number, 28)}
      <p class="quote">“${tomLua.pergunta}”</p>
    </article>
    <article class="card" style="--sc:${plHex}">
      <h4>Plasma radial do dia</h4>
      <p class="big" style="color:${plHex}">${plasma.nome}</p>
      <p>${plasma.verbo} · chakra ${plasma.chakra} (${plasma.chakraSans})</p>
      <p class="muted">${plasma.verso}</p>
      <p>Dia ${plasma.n} da semana · semana <strong style="color:${semHex}">${corAdj(corSem, true)}</strong> (${l.heptada}ª da Lua, ${COR_INFO[corSem].direcao} — ${COR_INFO[corSem].verbo.toLowerCase()}) · semana ${l.semanaDoAnel} de 52 do Anel.</p>
    </article>`;
  }

  const ringSel = SELOS[anel.selo - 1];
  const ringTom = TONS[anel.tom - 1];
  const ringHex = COR_HEX[ringSel.cor];
  const fim = anel.diaForaDoTempo;
  const lunar = `<article class="card moonbox">
    <div>${moonSvg(l.lunar.fase, 72)}</div>
    <div>
      <h4>Lua no céu</h4>
      <p class="big">${l.lunar.nome}</p>
      <p class="muted">≈ ${Math.round(l.lunar.iluminacao * 100)}% iluminada (fase média, aproximada). O Sincronário não segue as fases reais: suas 13 Luas de 28 dias são ciclos de tempo natural.</p>
    </div>
  </article>`;

  const anelCard = `<article class="card" style="--sc:${ringHex}">
    <h4>Anel Solar · ${anel.nome}</h4>
    <p class="big" style="color:${ringHex}">${kinNome(ringSel, ringTom)}</p>
    <p>Kin ${anel.kin} · de 26 jul ${anel.startYear} a 25 jul ${fim.y}</p>
    <p class="muted">Ano ${anel.posCiclo52} do ciclo de 52 anos · ciclo de 13 anos ${anel.ciclo13}/4, ano ${anel.anoCiclo13}/13.${anel.hunabKu ? ' Este Anel contém um Dia 0.0 (29/fev).' : ''}</p>
  </article>`;

  return `<div class="lt">
    ${head}
    ${bannerEspecial(l)}
    ${kinBlock}
    <div class="lt-grid">${cards}</div>
    ${oracle}
    <div class="lt-grid">${anelCard}${lunar}</div>
  </div>`;
}
