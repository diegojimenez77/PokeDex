/** Etiquetas de tipo en español (slug PokeAPI → texto) */
export const TYPE_LABEL_ES = {
  normal: 'Normal',
  fighting: 'Lucha',
  flying: 'Volador',
  poison: 'Veneno',
  ground: 'Tierra',
  rock: 'Roca',
  bug: 'Bicho',
  ghost: 'Fantasma',
  steel: 'Acero',
  fire: 'Fuego',
  water: 'Agua',
  grass: 'Planta',
  electric: 'Eléctrico',
  psychic: 'Psíquico',
  ice: 'Hielo',
  dragon: 'Dragón',
  dark: 'Siniestro',
  fairy: 'Hada',
};

export function typeLabelEs(slug) {
  if (!slug) return '';
  return TYPE_LABEL_ES[String(slug).toLowerCase()] || slug;
}

/** Modificador BEM poke-mini-type--* / poke-fav-card--explore-* */
export function typeToMiniModifier(slug) {
  const s = String(slug).toLowerCase();
  if (s === 'flying') return 'fly';
  return s.replace(/[^a-z-]/g, '') || 'normal';
}

/** Icono Material Symbols por tipo (slug API) */
export function typeIconSymbol(slug) {
  const mod = typeToMiniModifier(slug);
  const iconMap = {
    grass: 'energy_savings_leaf',
    fire: 'local_fire_department',
    water: 'water_drop',
    electric: 'bolt',
    psychic: 'psychology',
    dragon: 'whatshot',
    poison: 'science',
    fly: 'air',
    fighting: 'sports_martial_arts',
    steel: 'hardware',
    ghost: 'visibility_off',
    ice: 'ac_unit',
    ground: 'landscape',
    rock: 'terrain',
    bug: 'pest_control',
    dark: 'dark_mode',
    fairy: 'auto_awesome',
    normal: 'circle',
  };
  return iconMap[mod] || 'category';
}

export function exploreCardModifierFromTypes(types) {
  const first = types?.[0]?.type?.name;
  const map = {
    grass: 'explore-grass',
    fire: 'explore-fire',
    water: 'explore-water',
    electric: 'explore-electric',
    psychic: 'explore-psychic',
    dragon: 'explore-dragon',
    ice: 'explore-water',
    fighting: 'explore-fire',
    poison: 'explore-grass',
    ground: 'explore-fire',
    flying: 'explore-water',
    bug: 'explore-grass',
    rock: 'explore-fire',
    ghost: 'explore-psychic',
    dark: 'explore-psychic',
    steel: 'explore-water',
    fairy: 'explore-psychic',
    normal: 'explore-grass',
  };
  return map[first] || 'explore-grass';
}
