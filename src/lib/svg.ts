// Geradores de SVG (strings) usados no servidor (Astro) e no cliente.
// Os "sigilos" dos selos são desenhos geométricos ilustrativos — não os glifos originais.

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
const rad = (deg: number) => (deg * Math.PI) / 180;
const f = (x: number) => x.toFixed(2);

function polygonPath(points: number, step: number, r: number, rotDeg = -90): string {
  const v = Array.from({ length: points }, (_, i) => {
    const a = rad(rotDeg + (360 / points) * ((i * step) % points));
    return `${f(50 + r * Math.cos(a))} ${f(50 + r * Math.sin(a))}`;
  });
  return `M${v.join(' L')} Z`;
}

export function sigilSvg(n: number, hex: string, size = 120): string {
  const p = 5 + ((n * 5) % 7); // 5..11 pontas
  const steps = [1, 2, 3, 4, 5].filter((s) => s < p / 2 + 0.01 && gcd(p, s) === 1);
  const step = steps[(n * 2) % steps.length] ?? 1;
  const q = 3 + (n % 5);
  const ticks = Array.from({ length: 20 }, (_, i) => {
    const a = rad(-90 + i * 18);
    const on = i === n - 1;
    const r1 = on ? 38 : 41;
    return `<line x1="${f(50 + r1 * Math.cos(a))}" y1="${f(50 + r1 * Math.sin(a))}" x2="${f(50 + 45 * Math.cos(a))}" y2="${f(50 + 45 * Math.sin(a))}" stroke="${hex}" stroke-opacity="${on ? 1 : 0.28}" stroke-width="${on ? 2.6 : 1}" stroke-linecap="round"/>`;
  }).join('');
  return `<svg class="sigil" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="Sigilo ilustrativo do selo ${n}" xmlns="http://www.w3.org/2000/svg">
<circle cx="50" cy="50" r="47.5" fill="none" stroke="${hex}" stroke-opacity=".5" stroke-width=".8"/>${ticks}
<path d="${polygonPath(p, step, 32)}" fill="${hex}" fill-opacity=".1" stroke="${hex}" stroke-width="1.7" stroke-linejoin="round"/>
<path d="${polygonPath(q, 1, 17, -90 + 180 / q)}" fill="none" stroke="${hex}" stroke-opacity=".75" stroke-width="1.2" stroke-linejoin="round"/>
<circle cx="50" cy="50" r="3.2" fill="${hex}"/></svg>`;
}

/** Numeração maia: barras = 5, pontos = 1. */
export function toneSvg(n: number, hex: string, w = 64): string {
  const bars = Math.floor(n / 5);
  const dots = n % 5;
  const dotZone = dots > 0 ? 16 : 0;
  const gap = dots > 0 && bars > 0 ? 5 : 0;
  const barH = 8;
  const barGap = 5;
  const h = dotZone + gap + bars * barH + Math.max(0, bars - 1) * barGap;
  const parts: string[] = [];
  const cx = w / 2;
  for (let i = 0; i < dots; i++) {
    const x = cx - ((dots - 1) * 13) / 2 + i * 13;
    parts.push(`<circle cx="${f(x)}" cy="8" r="5" fill="${hex}"/>`);
  }
  for (let b = 0; b < bars; b++) {
    const y = dotZone + gap + b * (barH + barGap);
    parts.push(`<rect x="4" y="${y}" width="${w - 8}" height="${barH}" rx="4" fill="${hex}"/>`);
  }
  return `<svg class="tone" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="Tom ${n}" xmlns="http://www.w3.org/2000/svg">${parts.join('')}</svg>`;
}

/** Fase lunar (0 = nova, 0.5 = cheia). */
export function moonSvg(phase: number, size = 64): string {
  const r = 30;
  const c = 32;
  const k = Math.cos(2 * Math.PI * phase);
  const rx = Math.abs(k) * r;
  const waxing = phase < 0.5;
  const outer = waxing ? 1 : 0;
  const inner = waxing ? (k > 0 ? 0 : 1) : k > 0 ? 1 : 0;
  const lit = `M${c} ${c - r} A${r} ${r} 0 0 ${outer} ${c} ${c + r} A${f(rx)} ${r} 0 0 ${inner} ${c} ${c - r} Z`;
  return `<svg class="moonphase" viewBox="0 0 64 64" width="${size}" height="${size}" role="img" aria-label="Fase da Lua" xmlns="http://www.w3.org/2000/svg">
<circle cx="${c}" cy="${c}" r="${r}" fill="#120d3a" stroke="#e2c275" stroke-opacity=".5" stroke-width="1"/>
<path d="${lit}" fill="#f6e9bd"/></svg>`;
}
