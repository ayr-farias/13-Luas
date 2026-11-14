// Prefixa caminhos internos com a base do site (ex.: /13-Luas quando hospedado no GitHub Pages).
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const u = (path: string) => BASE + path;
export const BASE_PATH = BASE;
