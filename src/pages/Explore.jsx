import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  fetchGeneration,
  fetchPokemon,
  fetchPokemonPage,
  fetchType,
  PokeApiError,
} from '../api/pokeapi.js';
import { PokemonCard } from '../components/PokemonCard.jsx';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';

const BATCH = 20;

const TYPE_CHIPS = [
  { id: 1, slug: 'normal', label: 'Normal' },
  { id: 10, slug: 'fire', label: 'Fuego' },
  { id: 11, slug: 'water', label: 'Agua' },
  { id: 12, slug: 'grass', label: 'Planta' },
  { id: 13, slug: 'electric', label: 'Eléctrico' },
  { id: 14, slug: 'psychic', label: 'Psíquico' },
];

const GEN_OPTIONS = [
  { id: 1, label: 'Gen 1' },
  { id: 2, label: 'Gen 2' },
  { id: 3, label: 'Gen 3' },
  { id: 4, label: 'Gen 4' },
  { id: 5, label: 'Gen 5' },
  { id: 6, label: 'Gen 6' },
  { id: 7, label: 'Gen 7' },
  { id: 8, label: 'Gen 8' },
  { id: 9, label: 'Gen 9' },
];

function sortNamesFromEntries(entries, urlKey = 'url') {
  return [...entries]
    .map((e) => {
      const url = e.pokemon?.url || e.url;
      const name = e.pokemon?.name || e.name;
      const m = String(url).match(/\/(\d+)\/?$/);
      const id = m ? Number(m[1]) : 0;
      return { name, id };
    })
    .filter((x) => x.name)
    .sort((a, b) => a.id - b.id)
    .map((x) => x.name);
}

export function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = (searchParams.get('q') || '').trim();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [filterType, setFilterType] = useState(null);
  const [filterGen, setFilterGen] = useState(null);

  const offsetRef = useRef(0);
  const nameQueueRef = useRef([]);
  const queuePosRef = useRef(0);
  const sentinelRef = useRef(null);
  const [searchActive, setSearchActive] = useState(false);

  const resetList = useCallback(() => {
    setItems([]);
    setError(null);
    setHasMore(true);
    offsetRef.current = 0;
    nameQueueRef.current = [];
    queuePosRef.current = 0;
  }, []);

  const loadBatchByNames = useCallback(async (names) => {
    const results = await Promise.all(
      names.map((name) => fetchPokemon(name).catch(() => null))
    );
    return results.filter(Boolean);
  }, []);

  const loadMoreAll = useCallback(async () => {
    const { results, next } = await fetchPokemonPage(
      offsetRef.current,
      BATCH
    );
    if (!results.length) {
      setHasMore(false);
      return [];
    }
    const names = results.map((r) => r.name);
    const mons = await loadBatchByNames(names);
    offsetRef.current += results.length;
    setHasMore(Boolean(next));
    return mons;
  }, [loadBatchByNames]);

  const loadMoreQueue = useCallback(async () => {
    const qn = nameQueueRef.current;
    const start = queuePosRef.current;
    const slice = qn.slice(start, start + BATCH);
    if (!slice.length) {
      setHasMore(false);
      return [];
    }
    const mons = await loadBatchByNames(slice);
    queuePosRef.current += slice.length;
    if (queuePosRef.current >= qn.length) setHasMore(false);
    return mons;
  }, [loadBatchByNames]);

  const runLoadMore = useCallback(async () => {
    if (filterType || filterGen) return loadMoreQueue();
    return loadMoreAll();
  }, [filterType, filterGen, loadMoreAll, loadMoreQueue]);

  useEffect(() => {
    let cancelled = false;

    const runSearch = async () => {
      if (!q) return;
      resetList();
      setSearchActive(true);
      setHasMore(false);
      setLoading(true);
      setError(null);
      try {
        const mon = await fetchPokemon(q);
        if (!cancelled) setItems([mon]);
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof PokeApiError
              ? e.message
              : 'No se pudo completar la búsqueda.';
          setError(msg);
          setItems([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (q) {
      runSearch();
      return () => {
        cancelled = true;
      };
    }

    resetList();
    setSearchActive(false);

    const initFilters = async () => {
      if (filterType) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchType(filterType);
          const names = sortNamesFromEntries(data.pokemon || []);
          nameQueueRef.current = names;
          queuePosRef.current = 0;
          setHasMore(names.length > 0);
          const first = await loadMoreQueue();
          if (!cancelled) setItems(first);
        } catch (e) {
          if (!cancelled) {
            setError(
              e instanceof PokeApiError
                ? e.message
                : 'Error al cargar el tipo.'
            );
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
        return;
      }
      if (filterGen) {
        setLoading(true);
        setError(null);
        try {
          const data = await fetchGeneration(filterGen);
          const names = sortNamesFromEntries(data.pokemon_species || [], 'url');
          nameQueueRef.current = names;
          queuePosRef.current = 0;
          setHasMore(names.length > 0);
          const first = await loadMoreQueue();
          if (!cancelled) setItems(first);
        } catch (e) {
          if (!cancelled) {
            setError(
              e instanceof PokeApiError
                ? e.message
                : 'Error al cargar la generación.'
            );
          }
        } finally {
          if (!cancelled) setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const first = await loadMoreAll();
        if (!cancelled) setItems(first);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof PokeApiError ? e.message : 'Error al cargar la lista.'
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initFilters();
    return () => {
      cancelled = true;
    };
  }, [q, filterType, filterGen, resetList, loadMoreAll, loadMoreQueue]);

  const onLoadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore || searchActive) return;
    setLoadingMore(true);
    setError(null);
    try {
      const next = await runLoadMore();
      if (next.length) setItems((prev) => [...prev, ...next]);
    } catch (e) {
      setError(
        e instanceof PokeApiError ? e.message : 'Error al cargar más datos.'
      );
    } finally {
      setLoadingMore(false);
    }
  }, [loading, loadingMore, hasMore, runLoadMore, searchActive]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || searchActive) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) onLoadMore();
      },
      { rootMargin: '120px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [onLoadMore, items.length, hasMore, q, filterType, filterGen, searchActive]);

  const clearSearch = () => {
    searchParams.delete('q');
    setSearchParams(searchParams);
  };

  return (
    <div className="page-explorar__main">
      <section className="page-explorar__section" aria-labelledby="explorar-title">
        <h2 id="explorar-title" className="page-explorar__title dex-text-display">
          Pokédex nacional
        </h2>
        <p className="dex-text-body" style={{ color: 'var(--color-on-surface-variant)', maxWidth: '60rem' }}>
          Filtra por tipo o generación. El listado se amplía al hacer scroll. Busca desde
          la barra superior.
        </p>
        {q ? (
          <p className="dex-text-body">
            Resultado para «{q}».{' '}
            <button
              type="button"
              className="poke-filter-chip poke-filter-chip--normal"
              style={{ marginLeft: '0.8rem' }}
              onClick={clearSearch}
            >
              Ver todo el listado
            </button>
          </p>
        ) : null}
      </section>

      <section className="page-explorar__section" aria-label="Filtros">
        <p className="dex-text-title-sm" style={{ marginBottom: 'var(--space-md)' }}>
          Tipo
        </p>
        <div className="poke-filter-strip" style={{ marginBottom: 'var(--space-xl)' }}>
          <button
            type="button"
            className={`poke-filter-chip poke-filter-chip--normal${filterType === null && filterGen === null ? '' : ''}`}
            onClick={() => {
              setFilterType(null);
              setFilterGen(null);
            }}
          >
            <span className="poke-filter-chip__dot" aria-hidden="true" />
            Todos
          </button>
          {TYPE_CHIPS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`poke-filter-chip poke-filter-chip--${t.slug}${filterType === t.id ? ' poke-filter-chip--active' : ''}`}
              style={
                filterType === t.id
                  ? { boxShadow: '0 0 0 2px var(--color-primary-container)' }
                  : undefined
              }
              onClick={() => {
                setFilterGen(null);
                setFilterType(t.id);
              }}
            >
              <span className="poke-filter-chip__dot" aria-hidden="true" />
              {t.label}
            </button>
          ))}
        </div>
        <p className="dex-text-title-sm" style={{ marginBottom: 'var(--space-md)' }}>
          Generación
        </p>
        <div className="poke-filter-strip flex-wrap">
          {GEN_OPTIONS.map((g) => (
            <button
              key={g.id}
              type="button"
              className="poke-filter-chip poke-filter-chip--psychic"
              style={
                filterGen === g.id
                  ? { boxShadow: '0 0 0 2px var(--color-primary-container)' }
                  : undefined
              }
              onClick={() => {
                setFilterType(null);
                setFilterGen(g.id);
              }}
            >
              <span className="poke-filter-chip__dot" aria-hidden="true" />
              {g.label}
            </button>
          ))}
        </div>
      </section>

      {error ? (
        <p
          className="dex-text-body"
          role="alert"
          style={{ color: 'var(--color-primary-container)', margin: '2rem 0' }}
        >
          {error}
        </p>
      ) : null}

      {loading && !items.length ? <LoadingSpinner /> : null}

      <section className="page-explorar__grid" aria-label="Listado de Pokémon">
        {items.map((p) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            linkTo={`/pokemon/${p.id}`}
            favoriteToggle
          />
        ))}
      </section>

      {loadingMore ? <LoadingSpinner /> : null}

      {!searchActive && hasMore && !loading && !q ? (
        <div ref={sentinelRef} style={{ height: '1px' }} aria-hidden="true" />
      ) : null}

      <footer className="page-fav-desk__footer" style={{ marginTop: 'var(--space-4xl)' }}>
        <div className="page-fav-desk__footer-inner">
          <span className="page-fav-desk__footer-brand">Prism Dex</span>
          <p className="page-fav-desk__footer-copy">
            Datos mediante PokéAPI.
          </p>
        </div>
      </footer>
    </div>
  );
}
