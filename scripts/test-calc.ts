import { leitura, kinOf, ringInfo, parseISO, oraculoDoKin, kinFromSeloTom } from '../src/lib/calc';
import { SELOS, TONS, kinNome } from '../src/lib/data';

let fails = 0;
const ok = (cond: boolean, msg: string) => { if (!cond) { fails++; console.log('FALHA:', msg); } };
const D = (s: string) => parseISO(s)!;

// [data, kin] — âncoras de fontes independentes (yokai.jp, Oráculo da Presença, 13lunas.net, photon.net)
const vetores: [string, number][] = [
  ['2025-09-07', 167], ['2025-06-23', 91], ['2025-06-27', 95], ['2025-06-28', 96],
  ['2025-04-27', 34], ['2024-07-26', 19],
  ['1972-11-14', 130], ['1997-07-25', 43], ['1988-12-16', 22], ['1949-11-22', 63],
  ['2064-02-24', 167], ['2047-05-29', 36], ['1964-10-20', 45], ['1984-10-31', 76],
  ['1958-07-19', 102], ['2051-12-19', 140], ['1950-10-30', 145], ['2055-06-05', 103],
];
for (const [iso, kin] of vetores) {
  const k = kinOf(D(iso));
  ok(k === kin, `kin de ${iso}: esperado ${kin}, obtido ${k}`);
}

// 25/04/2025: Lua Planetária (10), dia 24, Mago Galáctico Branco, Onda da Mão, Castelo 1
const l = leitura(D('2025-04-27'));
ok(l.lua === 10 && l.diaDaLua === 24, `lua/dia 27/04/2025: ${l.lua}/${l.diaDaLua}`);
ok(kinNome(SELOS[l.selo! - 1], TONS[l.tom! - 1]) === 'Mago Galáctico Branco', 'nome 27/04/2025');
ok(l.castelo === 1, 'castelo 27/04/2025');
ok(l.seloDaOnda === 7, `onda 27/04/2025 (selo ${l.seloDaOnda})`); // onda 3 = Mão

// Onda do kin 130 = Espelho Branco (118~)
ok(leitura(D('1972-11-14')).seloDaOnda === 18, 'onda do kin 130');

// 26/jul = Lua 1 dia 1; 25/jul = Dia Fora do Tempo
ok(leitura(D('2025-07-26')).lua === 1 && leitura(D('2025-07-26')).diaDaLua === 1, '26/jul');
ok(leitura(D('2026-07-25')).tipo === 'fora-do-tempo', '25/jul');
ok(leitura(D('2025-07-25')).tipo === 'fora-do-tempo', '25/jul/2025');

// Bissexto: 29/fev sem kin, entre dia 22 e 23 da Lua 8; kins contínuos
ok(leitura(D('2024-02-29')).tipo === 'bissexto' && leitura(D('2024-02-29')).kin === null, '29/fev');
ok(leitura(D('2024-02-28')).diaDaLua === 22 && leitura(D('2024-03-01')).diaDaLua === 23, 'dias 22 e 23 da Lua 8');
ok(((kinOf(D('2024-02-28'))! % 260) + 1) === kinOf(D('2024-03-01')), 'kin contínuo através do 29/fev');

// Anel NS1.37 (2024-25): Tormenta Rítmica Azul (kin 19); NS1.0 = kin 34
const r = ringInfo(2024);
ok(r.nome === 'NS1.37' && r.kin === 19, 'NS1.37');
ok(kinNome(SELOS[r.selo - 1], TONS[r.tom - 1]) === 'Tormenta Rítmica Azul', 'nome do anel NS1.37');
ok(r.luas[7].inicio.m === 2 && r.luas[7].inicio.d === 7 && r.luas[7].fim.m === 3 && r.luas[7].fim.d === 6, 'Lua 8: 7/fev–6/mar');
ok(r.luas[0].inicio.m === 7 && r.luas[0].inicio.d === 26 && r.luas[0].fim.m === 8 && r.luas[0].fim.d === 22, 'Lua 1: 26/jul–22/ago');
ok(r.luas[12].fim.m === 7 && r.luas[12].fim.d === 24, 'Lua 13 termina em 24/jul');

// Oráculo (exemplo documentado): Sol Lunar Amarelo
const kSol = kinFromSeloTom(20, 2);
const o = oraculoDoKin(kSol);
const nome = (m: { selo: number; tom: number }) => kinNome(SELOS[m.selo - 1], TONS[m.tom - 1]);
ok(nome(o.analogo) === 'Tormenta Lunar Azul', 'análogo ' + nome(o.analogo));
ok(nome(o.guia) === 'Humano Lunar Amarelo', 'guia ' + nome(o.guia));
ok(nome(o.antipoda) === 'Cachorro Lunar Branco', 'antípoda ' + nome(o.antipoda));
ok(nome(o.oculto) === 'Dragão Cristal Vermelho', 'oculto ' + nome(o.oculto));
ok(o.oculto.kin + kSol === 261, 'oculto soma 261');

// Propriedades gerais por varredura de 40 anos
let prev: number | null = null;
for (let y = 2000; y < 2040; y++) {
  for (let m = 1; m <= 12; m++) for (let d = 1; d <= 31; d++) {
    const p = parseISO(`${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    if (!p) continue;
    const k = kinOf(p);
    if (k === null) continue;
    if (prev !== null) ok(k === (prev % 260) + 1, `continuidade em ${y}-${m}-${d}`);
    prev = k;
    const L = leitura(p);
    if (L.tipo === 'normal') ok(L.diaDaLua! >= 1 && L.diaDaLua! <= 28 && L.lua! >= 1 && L.lua! <= 13, `faixa ${y}-${m}-${d}`);
  }
}
// ciclo de 52 anos: mesmo kin e mesmo dia do anel
ok(kinOf(D('2025-09-07')) === kinOf(D('2077-09-07')), 'ciclo de 52 anos (kin)');

console.log(fails === 0 ? 'OK — todos os testes passaram' : `${fails} falha(s)`);
process.exit(fails ? 1 : 0);
