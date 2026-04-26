import { Link } from 'react-router-dom';
import { officialArtworkUrl } from '../api/pokeapi.js';

const HERO_CENTER = { id: 6, name: 'Charizard' };

const HERO_ORBIT = [
  { id: 25, name: 'Pikachu' },
  { id: 94, name: 'Gengar' },
  { id: 197, name: 'Umbreon' },
  { id: 448, name: 'Lucario' },
  { id: 384, name: 'Rayquaza' },
];

const HIGHLIGHTS = [
  {
    id: 133,
    name: 'Eevee',
    title: 'Busca y filtra',
    caption: 'Nombre, número, tipo o generación.',
    to: '/explorar',
  },
  {
    id: 445,
    name: 'Garchomp',
    title: 'Ficha al detalle',
    caption: 'Stats, evolución y tipos con color.',
    to: '/explorar',
  },
  {
    id: 143,
    name: 'Snorlax',
    title: 'Tu Pokéball',
    caption: 'Favoritos guardados en el navegador.',
    to: '/favoritos',
  },
];

export function Landing() {
  return (
    <div className="page-fav-desk__scroll-inner">
      <div className="page-landing">
        <section
          className="page-landing__hero page-landing__hero--impact"
          aria-labelledby="landing-hero-title"
        >
          <div className="page-landing__hero-deco" aria-hidden="true">
            <span className="page-landing__hero-blob page-landing__hero-blob--a" />
            <span className="page-landing__hero-blob page-landing__hero-blob--b" />
            <span className="page-landing__hero-blob page-landing__hero-blob--c" />
          </div>

          <div className="page-landing__hero-panel">
            <div className="page-landing__hero-inner">
              <div className="page-landing__hero-copy">
                <p className="page-landing__badge page-landing__badge--hero">
                  <span className="material-symbols-outlined material-symbols-outlined--xs">
                    catching_pokemon
                  </span>{' '}
                  PokéAPI · Gratis
                </p>
                <h1
                  id="landing-hero-title"
                  className="page-landing__title page-landing__title--hero dex-text-display"
                >
                  <span className="page-landing__title-line">Tu Pokédex,</span>
                  <span className="page-landing__title-line page-landing__title-line--shine">
                    sin rodeos
                  </span>
                </h1>
                <p className="page-landing__tagline">
                  Arte oficial, filtros y favoritos en el navegador.
                </p>
                <ul className="page-landing__hero-perks" aria-label="Características">
                  <li className="page-landing__hero-perk">
                    <span
                      className="page-landing__hero-perk-icon material-symbols-outlined"
                      aria-hidden="true"
                    >
                      translate
                    </span>
                    <span>Español</span>
                  </li>
                  <li className="page-landing__hero-perk">
                    <span
                      className="page-landing__hero-perk-icon material-symbols-outlined"
                      aria-hidden="true"
                    >
                      all_inclusive
                    </span>
                    <span>Scroll infinito</span>
                  </li>
                  <li className="page-landing__hero-perk">
                    <span
                      className="page-landing__hero-perk-icon material-symbols-outlined"
                      aria-hidden="true"
                    >
                      contrast
                    </span>
                    <span>Claro / oscuro</span>
                  </li>
                </ul>
                <div className="page-landing__cta-row">
                  <Link
                    className="page-landing__btn page-landing__btn--primary"
                    to="/explorar"
                  >
                    <span className="material-symbols-outlined">travel_explore</span>
                    Explorar
                  </Link>
                  <Link
                    className="page-landing__btn page-landing__btn--secondary"
                    to="/favoritos"
                  >
                    <span className="material-symbols-outlined">favorite</span>
                    Favoritos
                  </Link>
                </div>
              </div>

              <div className="page-landing__showcase" aria-label="Pokémon destacados">
                <div
                  className="page-landing__showcase-vignette"
                  aria-hidden="true"
                />
                <div className="page-landing__showcase-ring" aria-hidden="true" />
                <div className="page-landing__showcase-center">
                  <Link
                    className="page-landing__showcase-center-link"
                    to={`/pokemon/${HERO_CENTER.id}`}
                    aria-label={`Ver ficha de ${HERO_CENTER.name}`}
                  >
                    <span
                      className="page-landing__showcase-center-glow"
                      aria-hidden="true"
                    />
                    <img
                      className="page-landing__showcase-center-img"
                      src={officialArtworkUrl(HERO_CENTER.id)}
                      alt=""
                      width={512}
                      height={512}
                      fetchPriority="high"
                      decoding="async"
                    />
                  </Link>
                </div>
                <ul className="page-landing__showcase-satellites">
                  {HERO_ORBIT.map((p, i) => (
                    <li
                      key={p.id}
                      className={`page-landing__satellite page-landing__satellite--${i + 1}`}
                    >
                      <Link
                        className="page-landing__satellite-link"
                        to={`/pokemon/${p.id}`}
                        aria-label={`Ver ficha de ${p.name}`}
                      >
                        <span
                          className="page-landing__satellite-glow"
                          aria-hidden="true"
                        />
                        <img
                          src={officialArtworkUrl(p.id)}
                          alt=""
                          width={128}
                          height={128}
                          loading="lazy"
                          decoding="async"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="page-landing__highlights" aria-labelledby="highlights-title">
          <h2 id="highlights-title" className="visually-hidden">
            Funciones principales
          </h2>
          <ul className="page-landing__highlight-grid">
            {HIGHLIGHTS.map((h) => (
              <li key={h.title}>
                <Link className="page-landing__highlight-card" to={h.to}>
                  <div className="page-landing__highlight-media">
                    <img
                      src={officialArtworkUrl(h.id)}
                      alt=""
                      width={200}
                      height={200}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="page-landing__highlight-text">
                    <h3 className="page-landing__highlight-title dex-text-headline">
                      {h.title}
                    </h3>
                    <p className="page-landing__highlight-caption dex-text-body">
                      {h.caption}
                    </p>
                  </div>
                  <span
                    className="page-landing__highlight-arrow material-symbols-outlined"
                    aria-hidden="true"
                  >
                    arrow_forward
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <p className="page-landing__footnote dex-text-label">
          Datos públicos vía{' '}
          <a
            className="page-landing__footnote-link"
            href="https://pokeapi.co"
            target="_blank"
            rel="noopener noreferrer"
          >
            PokéAPI
          </a>
          . Pokémon © Nintendo / Game Freak.
        </p>
      </div>

      <footer className="page-fav-desk__footer">
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
            Proyecto educativo con datos públicos.
          </p>
        </div>
      </footer>
    </div>
  );
}
