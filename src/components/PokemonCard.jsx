import { Link } from 'react-router-dom';
import {
  exploreCardModifierFromTypes,
  typeIconSymbol,
  typeLabelEs,
  typeToMiniModifier,
} from '../utils/typeLabels.js';
import { officialArtworkUrl } from '../api/pokeapi.js';
import { useFavorites } from '../context/FavoritesContext.jsx';

function TypeChip({ slug }) {
  const mod = typeToMiniModifier(slug);
  const icon = typeIconSymbol(slug);
  return (
    <span className={`poke-mini-type poke-mini-type--${mod}`}>
      <span
        className="material-symbols-outlined material-symbols-outlined--xs"
        aria-hidden="true"
      >
        {icon}
      </span>
      {typeLabelEs(slug)}
    </span>
  );
}

export function PokemonCard({
  pokemon,
  linkTo,
  showExploreMark = true,
  favoriteToggle = false,
}) {
  const { toggleFavorite, isFavorite } = useFavorites();
  const id = pokemon.id;
  const name = pokemon.name;
  const types = pokemon.types || [];
  const mod = exploreCardModifierFromTypes(types);
  const fav = isFavorite(id);
  const inner = (
    <article className={`poke-fav-card poke-fav-card--${mod}`}>
      <div className="poke-fav-card__wash" aria-hidden="true" />
      <div className="poke-fav-card__top">
        <span className="poke-fav-card__id">
          #{String(id).padStart(4, '0')}
        </span>
        {showExploreMark ? (
          <span className="poke-fav-card__explore-mark" aria-hidden="true">
            <span className="material-symbols-outlined material-symbols-outlined--fill">
              capture
            </span>
          </span>
        ) : null}
      </div>
      <div className="poke-fav-card__media">
        <img
          className="poke-fav-card__img"
          alt={name}
          src={officialArtworkUrl(id)}
          loading="lazy"
        />
      </div>
      <div className="poke-fav-card__body">
        <h3 className="poke-fav-card__name dex-text-headline">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </h3>
        <div className="poke-fav-card__types">
          {types.map((t) => (
            <TypeChip key={t.slot} slug={t.type.name} />
          ))}
        </div>
      </div>
    </article>
  );

  const card = linkTo ? (
    <Link className="poke-card-link" to={linkTo} aria-label={`Ver ${name}`}>
      {inner}
    </Link>
  ) : (
    inner
  );

  if (!favoriteToggle) return card;

  return (
    <div className="favorites-page__card-wrap">
      {card}
      <button
        type="button"
        className={`poke-fav-desk-card__fav favorites-page__unfav${fav ? ' favorites-page__unfav--on' : ''}`}
        aria-label={
          fav ? `Quitar a ${name} de favoritos` : `Añadir a ${name} a favoritos`
        }
        aria-pressed={fav}
        onClick={() => toggleFavorite(id, name)}
      >
        <span
          className={`material-symbols-outlined${fav ? ' material-symbols-outlined--fill' : ''}`}
          aria-hidden="true"
        >
          favorite
        </span>
      </button>
    </div>
  );
}
