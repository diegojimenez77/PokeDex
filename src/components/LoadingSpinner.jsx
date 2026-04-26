export function LoadingSpinner({ label = 'Cargando…' }) {
  return (
    <div className="poke-loading" role="status" aria-live="polite" aria-busy="true">
      <div className="poke-loading__icon-wrap">
        <span className="material-symbols-outlined poke-loading__icon dex-animate-spin material-symbols-outlined--fill">
          capture
        </span>
      </div>
      <span className="visually-hidden">{label}</span>
    </div>
  );
}
