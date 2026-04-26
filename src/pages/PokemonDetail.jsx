import { Fragment, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  fetchEvolutionChainByUrl,
  fetchPokemon,
  fetchPokemonSpeciesByUrl,
  flattenEvolutionChain,
  mapStats,
  maxStatValue,
  officialArtworkUrl,
  PokeApiError,
} from '../api/pokeapi.js';
import { LoadingSpinner } from '../components/LoadingSpinner.jsx';
import { useFavorites } from '../context/FavoritesContext.jsx';
import { typeIconSymbol, typeLabelEs } from '../utils/typeLabels.js';

function displayNameEs(species, fallbackName) {
  const n = species?.names?.find((x) => x.language?.name === 'es');
  if (n?.name) return n.name;
  const s = String(fallbackName || '');
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

function formatAbilitySlug(slug) {
  return String(slug)
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export function PokemonDetail() {
  const { id } = useParams();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evoStages, setEvoStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setPokemon(null);
      setSpecies(null);
      setEvoStages([]);
      if (!id || id === 'undefined') {
        setError('Pokémon no encontrado.');
        setLoading(false);
        return;
      }
      try {
        const mon = await fetchPokemon(id);
        if (cancelled) return;
        setPokemon(mon);
        const sp = await fetchPokemonSpeciesByUrl(mon.species.url);
        if (cancelled) return;
        setSpecies(sp);
        try {
          const chainRes = await fetchEvolutionChainByUrl(
            sp.evolution_chain.url
          );
          const flat = flattenEvolutionChain(chainRes.chain);
          const stages = await Promise.all(
            flat.map(async (step) => {
              const m = await fetchPokemon(step.name);
              return {
                id: m.id,
                name: m.name,
                label: displayNameEs(null, m.name),
                minLevel: step.minLevel,
              };
            })
          );
          if (!cancelled) setEvoStages(stages);
        } catch {
          if (!cancelled) setEvoStages([]);
        }
      } catch (e) {
        if (!cancelled) {
          const msg =
            e instanceof PokeApiError
              ? e.message
              : 'No se pudo cargar el Pokémon.';
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading && !pokemon && !error) {
    return (
      <div className="page-detalle">
        <div className="page-detalle__main">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="page-detalle">
        <div className="page-detalle__main">
          <p
            className="dex-text-body"
            role="alert"
            style={{ color: 'var(--color-primary-container)' }}
          >
            {error || 'Pokémon no encontrado.'}
          </p>
          <p className="dex-text-body">
            <Link
              to="/explorar"
              style={{ color: 'var(--color-tertiary)', fontWeight: 600 }}
            >
              ← Volver a explorar
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const title = displayNameEs(species, pokemon.name);
  const types = pokemon.types || [];
  const stats = mapStats(pokemon);
  const maxV = maxStatValue(stats);
  const fav = isFavorite(pokemon.id);

  return (
    <div className="page-detalle">
      <div className="page-detalle__main">
        <section className="page-detalle__hero" aria-labelledby="pokemon-name">
          <div className="page-detalle__fav-wrap">
            <button
              type="button"
              className={`page-detalle__fav-btn${fav ? ' page-detalle__fav-btn--active' : ''}`}
              aria-label={
                fav
                  ? 'Quitar de favoritos'
                  : 'Meter en la Pokéball (favoritos)'
              }
              aria-pressed={fav}
              onClick={() => toggleFavorite(pokemon.id, pokemon.name)}
            >
              <span
                className={`material-symbols-outlined${fav ? ' material-symbols-outlined--fill' : ''}`}
                aria-hidden="true"
              >
                favorite
              </span>
            </button>
          </div>
          <p className="page-detalle__number">
            #{String(pokemon.id).padStart(4, '0')}
          </p>
          <h1 id="pokemon-name" className="page-detalle__name dex-text-display">
            {title}
          </h1>
          <div className="page-detalle__types">
            {types.map((t, idx) => {
              const slug = t.type.name;
              const badgeClass =
                idx === 0
                  ? 'poke-type-badge poke-type-badge--primary-container'
                  : 'poke-type-badge poke-type-badge--secondary-container';
              return (
                <span key={t.slot} className={badgeClass}>
                  <span
                    className="material-symbols-outlined material-symbols-outlined--fill"
                    style={{ fontSize: '1.6rem' }}
                    aria-hidden="true"
                  >
                    {typeIconSymbol(slug)}
                  </span>
                  {typeLabelEs(slug)}
                </span>
              );
            })}
          </div>
          <div className="page-detalle__figure-wrap">
            <div className="page-detalle__figure-glow" aria-hidden="true" />
            <img
              className="page-detalle__figure-img"
              alt={title}
              src={officialArtworkUrl(pokemon.id)}
              width={512}
              height={512}
            />
          </div>
        </section>

        <section
          className="app-glass-panel page-detalle__panel"
          aria-labelledby="bio-heading"
        >
          <h2
            id="bio-heading"
            className="page-detalle__panel-title dex-text-headline"
          >
            <span className="material-symbols-outlined">scale</span>
            Datos
          </h2>
          <dl
            className="dex-text-body"
            style={{
              display: 'grid',
              gap: 'var(--space-md)',
              margin: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: 'var(--space-lg)',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <dt style={{ fontWeight: 700, margin: 0 }}>Altura</dt>
                <dd style={{ margin: 0 }}>
                  {(pokemon.height / 10).toFixed(1).replace('.', ',')} m
                </dd>
              </div>
              <div>
                <dt style={{ fontWeight: 700, margin: 0 }}>Peso</dt>
                <dd style={{ margin: 0 }}>
                  {(pokemon.weight / 10).toFixed(1).replace('.', ',')} kg
                </dd>
              </div>
            </div>
          </dl>
        </section>

        {pokemon.abilities?.length ? (
          <section
            className="app-glass-panel page-detalle__panel"
            aria-labelledby="abilities-heading"
          >
            <h2
              id="abilities-heading"
              className="page-detalle__panel-title dex-text-headline"
            >
              <span className="material-symbols-outlined">bolt</span>
              Habilidades
            </h2>
            <ul style={{ margin: 0, paddingLeft: '2rem' }}>
              {pokemon.abilities.map((a) => (
                <li key={a.slot} className="dex-text-body">
                  {formatAbilitySlug(a.ability.name)}
                  {a.is_hidden ? ' (oculta)' : ''}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section
          className="app-glass-panel page-detalle__panel"
          aria-labelledby="stats-heading"
        >
          <h2
            id="stats-heading"
            className="page-detalle__panel-title dex-text-headline"
          >
            <span className="material-symbols-outlined">bar_chart</span>
            Estadísticas base
          </h2>
          <div className="poke-stat-list">
            {stats.map((s) => (
              <div key={s.key} className="poke-stat-row">
                <span className="poke-stat-row__label">{s.label}</span>
                <span className="poke-stat-row__value">{s.base}</span>
                <div className="poke-stat-row__track">
                  <div
                    className="poke-stat-row__fill poke-stat-row__fill--gradient-fire"
                    style={{
                      width: `${Math.min(100, Math.round((s.base / maxV) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {evoStages.length > 0 ? (
          <section
            className="app-glass-panel page-detalle__evo"
            aria-labelledby="evo-heading"
          >
            <h2
              id="evo-heading"
              className="page-detalle__evo-title dex-text-headline"
            >
              <span className="material-symbols-outlined">transform</span>
              Cadena evolutiva
            </h2>
            <div className="page-detalle__evo-row">
              {evoStages.map((stage, i) => (
                <Fragment key={stage.id}>
                  <div className="page-detalle__evo-stage">
                    <Link
                      to={`/pokemon/${stage.id}`}
                      className={`page-detalle__evo-thumb${stage.id === pokemon.id ? ' page-detalle__evo-thumb--current' : ''}`}
                      aria-current={
                        stage.id === pokemon.id ? 'location' : undefined
                      }
                    >
                      {stage.id !== pokemon.id ? (
                        <div
                          className="page-detalle__evo-thumb-overlay"
                          aria-hidden="true"
                        />
                      ) : null}
                      <img
                        alt={stage.label}
                        src={officialArtworkUrl(stage.id)}
                        loading="lazy"
                      />
                    </Link>
                    <div className="page-detalle__evo-meta">
                      <div
                        className={
                          stage.id === pokemon.id
                            ? 'page-detalle__evo-name page-detalle__evo-name--accent'
                            : 'page-detalle__evo-name'
                        }
                      >
                        {stage.label}
                      </div>
                      <div className="page-detalle__evo-id dex-text-label dex-text-label--xs">
                        #{String(stage.id).padStart(4, '0')}
                      </div>
                    </div>
                  </div>
                  {i < evoStages.length - 1 ? (
                    <div className="page-detalle__evo-arrow">
                      <span className="material-symbols-outlined">
                        arrow_forward
                      </span>
                      {evoStages[i + 1]?.minLevel != null ? (
                        <span className="page-detalle__evo-level dex-text-label dex-text-label--xs">
                          Niv. {evoStages[i + 1].minLevel}
                        </span>
                      ) : (
                        <span className="page-detalle__evo-level dex-text-label dex-text-label--xs">
                          —
                        </span>
                      )}
                    </div>
                  ) : null}
                </Fragment>
              ))}
            </div>
          </section>
        ) : null}

        <p className="dex-text-body" style={{ textAlign: 'center', margin: 0 }}>
          <Link
            to="/explorar"
            style={{ color: 'var(--color-tertiary)', fontWeight: 600 }}
          >
            ← Volver al listado
          </Link>
        </p>
      </div>
      <footer
        className="page-fav-desk__footer"
        style={{ marginTop: 'var(--space-4xl)' }}
      >
        <div className="page-fav-desk__footer-inner">
          <span className="page-fav-desk__footer-brand">Prism Dex</span>
          <p className="page-fav-desk__footer-copy">Datos mediante PokéAPI.</p>
        </div>
      </footer>
    </div>
  );
}
