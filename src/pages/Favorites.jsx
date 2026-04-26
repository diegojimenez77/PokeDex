import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPokemon, PokeApiError } from '../api/pokeapi.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { PokemonCard } from '../components/PokemonCard.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';

export function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('id');

  useEffect(() => {
    let cancelled = false;
    if (!favorites.length) {
      setItems([]);
      setLoading(false);
      setError(null);
      return undefined;
    }
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const mons = await Promise.all(
          favorites.map((f) => fetchPokemon(f.id).catch(() => null))
        );
        const valid = mons.filter(Boolean);
        if (!cancelled) setItems(valid);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof PokeApiError
              ? e.message
              : 'No se pudieron cargar los favoritos.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [favorites]);

  const sorted = useMemo(() => {
    const copy = [...items];
    if (sort === 'name') {
      copy.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    } else {
      copy.sort((a, b) => a.id - b.id);
    }
    return copy;
  }, [items, sort]);

  return (
    <div className="page-fav-desk__scroll-inner">
      <div className="page-fav-desk__page-head">
        <div>
          <div className="page-fav-desk__title-row">
            <span className="material-symbols-outlined material-symbols-outlined--fill">
              favorite
            </span>
            <h1 className="page-fav-desk__title dex-text-display">
              Mis favoritos
            </h1>
          </div>
          <p className="page-fav-desk__subtitle dex-text-body">
            Pokémon guardados en tu Pokéball (localStorage del navegador).
          </p>
        </div>
        <div className="page-fav-desk__sort" role="group" aria-label="Ordenar">
          <button
            type="button"
            className={`page-fav-desk__sort-btn${sort === 'id' ? ' page-fav-desk__sort-btn--active' : ''}`}
            onClick={() => setSort('id')}
          >
            <span className="material-symbols-outlined material-symbols-outlined--xs">
              tag
            </span>
            Número
          </button>
          <button
            type="button"
            className={`page-fav-desk__sort-btn${sort === 'name' ? ' page-fav-desk__sort-btn--active' : ''}`}
            onClick={() => setSort('name')}
          >
            <span className="material-symbols-outlined material-symbols-outlined--xs">
              sort_by_alpha
            </span>
            Nombre
          </button>
        </div>
      </div>

      {error ? (
        <p
          className="dex-text-body"
          role="alert"
          style={{ color: 'var(--color-primary-container)', marginBottom: '2rem' }}
        >
          {error}
        </p>
      ) : null}

      {loading ? <LoadingSpinner /> : null}

      {!loading && !favorites.length ? (
        <p className="dex-text-body" style={{ maxWidth: '56rem' }}>
          Aún no tienes favoritos. Explora la Pokédex y pulsa el corazón en la
          ficha para guardarlos aquí.
        </p>
      ) : null}

      {!loading && favorites.length > 0 && !sorted.length && !error ? (
        <p className="dex-text-body">
          No se pudieron cargar las fichas. Prueba de nuevo más tarde.
        </p>
      ) : null}

      <div className="page-explorar__grid" style={{ marginTop: 'var(--space-xl)' }}>
        {sorted.map((p) => (
          <div key={p.id} className="favorites-page__card-wrap">
            <PokemonCard
              pokemon={p}
              linkTo={`/pokemon/${p.id}`}
              showExploreMark={false}
            />
            <button
              type="button"
              className="poke-fav-desk-card__fav favorites-page__unfav"
              aria-label={`Sacar a ${p.name} de la Pokéball`}
              onClick={() => removeFavorite(p.id)}
            >
              <span
                className="material-symbols-outlined material-symbols-outlined--fill"
                aria-hidden="true"
              >
                favorite
              </span>
            </button>
          </div>
        ))}
      </div>

      <footer className="page-fav-desk__footer" style={{ marginTop: 'var(--space-4xl)' }}>
        <div className="page-fav-desk__footer-inner">
          <span className="page-fav-desk__footer-brand">Prism Dex</span>
          <nav className="page-fav-desk__footer-links" aria-label="Enlaces del pie">
            <Link className="page-fav-desk__footer-link" to="/">
              Inicio
            </Link>
            <Link className="page-fav-desk__footer-link" to="/explorar">
              Explorar
            </Link>
            <Link className="page-fav-desk__footer-link" to="/favoritos">
              Favoritos
            </Link>
            <a
              className="page-fav-desk__footer-link"
              href="https://pokeapi.co"
              target="_blank"
              rel="noopener noreferrer"
            >
              PokéAPI
            </a>
          </nav>
          <p className="page-fav-desk__footer-copy">
            Pokémon © Nintendo/Game Freak. Proyecto educativo con datos públicos.
          </p>
        </div>
      </footer>
    </div>
  );
}
