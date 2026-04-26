const BASE = 'https://pokeapi.co/api/v2';

export class PokeApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

async function jsonFetch(url) {
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new PokeApiError('network', 'Error de red. Comprueba tu conexión.');
  }
  if (res.status === 404) {
    throw new PokeApiError('notfound', 'No se encontró el recurso.');
  }
  if (!res.ok) {
    throw new PokeApiError('http', `Error del servidor (${res.status}).`);
  }
  return res.json();
}

export function officialArtworkUrl(id) {
  const n = Number(id);
  if (!Number.isFinite(n)) return '';
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${n}.png`;
}

export function pokemonIdFromUrl(url) {
  const m = String(url).match(/\/pokemon\/(\d+)\/?$/);
  return m ? Number(m[1]) : null;
}

/**
 * @param {number} offset
 * @param {number} limit
 */
export async function fetchPokemonPage(offset = 0, limit = 20) {
  const data = await jsonFetch(
    `${BASE}/pokemon?offset=${offset}&limit=${limit}`
  );
  return {
    results: data.results || [],
    count: data.count ?? 0,
    next: data.next,
    previous: data.previous,
  };
}

/**
 * @param {string|number} nameOrId
 */
export async function fetchPokemon(nameOrId) {
  const q = String(nameOrId).trim().toLowerCase();
  if (!q) {
    throw new PokeApiError('notfound', 'Pokémon no encontrado.');
  }
  try {
    return await jsonFetch(`${BASE}/pokemon/${encodeURIComponent(q)}`);
  } catch (e) {
    if (e instanceof PokeApiError && e.code === 'notfound') {
      throw new PokeApiError('notfound', 'Pokémon no encontrado.');
    }
    throw e;
  }
}

export async function fetchPokemonSpeciesByUrl(url) {
  return jsonFetch(url);
}

export async function fetchEvolutionChainByUrl(url) {
  return jsonFetch(url);
}

/**
 * @param {number} typeId
 */
export async function fetchType(typeId) {
  return jsonFetch(`${BASE}/type/${typeId}`);
}

/**
 * @param {number} generationId
 */
export async function fetchGeneration(generationId) {
  return jsonFetch(`${BASE}/generation/${generationId}`);
}

/**
 * Recorre el árbol evolutivo en preorden (primera rama primero en bifurcaciones).
 * @param {object} chain
 * @returns {{ name: string, url: string, minLevel: number|null }[]}
 */
export function flattenEvolutionChain(chain) {
  const out = [];
  function pre(node) {
    if (!node?.species?.name || !node?.species?.url) return;
    const isRoot = out.length === 0;
    const det = !isRoot ? node.evolution_details?.[0] : null;
    out.push({
      name: node.species.name,
      url: node.species.url,
      minLevel: det?.min_level ?? null,
    });
    for (const evo of node.evolves_to || []) {
      pre(evo);
    }
  }
  pre(chain);
  return out;
}

/** Stats en orden estándar con nombres en español */
export const STAT_LABELS_ES = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. esp.',
  'special-defense': 'Def. esp.',
  speed: 'Velocidad',
};

export function mapStats(pokemon) {
  if (!pokemon?.stats) return [];
  return pokemon.stats.map((s) => ({
    key: s.stat.name,
    label: STAT_LABELS_ES[s.stat.name] || s.stat.name,
    base: s.base_stat,
  }));
}

export function maxStatValue(stats) {
  if (!stats?.length) return 255;
  return Math.max(...stats.map((s) => s.base), 255);
}
