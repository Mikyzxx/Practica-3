import React, { useState, useMemo } from 'react';
import { MovieCard } from './MovieCard';
import { MOCK_GENRES } from '../services/tmdb';
import { Filter, Sparkles, SlidersHorizontal, Key } from 'lucide-react';

export function MovieGrid({
  movies,
  title,
  subtitle,
  onOpenMovie,
  reviewsMap = {},
  isDemoMode,
  onOpenKeyModal,
  loading
}) {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [sortBy, setSortBy] = useState('default');

  // Filter & sort movies
  const filteredMovies = useMemo(() => {
    let list = [...movies];

    if (selectedGenre) {
      list = list.filter(m =>
        m.genre_ids && m.genre_ids.includes(selectedGenre)
      );
    }

    if (sortBy === 'rating_desc') {
      list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    } else if (sortBy === 'date_desc') {
      list.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
    } else if (sortBy === 'title_asc') {
      list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    }

    return list;
  }, [movies, selectedGenre, sortBy]);

  return (
    <section className="movie-grid-section">
      {/* Grid Header & Filters */}
      <div className="grid-header-row">
        <div>
          <h2 className="grid-section-title">{title}</h2>
          {subtitle && <p className="grid-section-subtitle">{subtitle}</p>}
        </div>

        <div className="grid-controls-row">
          {/* Sort Selector */}
          <div className="sort-selector-wrapper">
            <SlidersHorizontal size={14} className="sort-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
            >
              <option value="default">Orden por defecto</option>
              <option value="rating_desc">Mayor calificación</option>
              <option value="date_desc">Más recientes</option>
              <option value="title_asc">Título (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Genre Filter Chips */}
      <div className="genre-chips-container">
        <button
          className={`genre-chip ${selectedGenre === null ? 'active' : ''}`}
          onClick={() => setSelectedGenre(null)}
        >
          Todos los géneros
        </button>
        {MOCK_GENRES.map(genre => (
          <button
            key={genre.id}
            className={`genre-chip ${selectedGenre === genre.id ? 'active' : ''}`}
            onClick={() => setSelectedGenre(genre.id === selectedGenre ? null : genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {/* Demo Mode Notice Banner if active */}
      {isDemoMode && (
        <div className="demo-notice-banner">
          <div className="demo-notice-text">
            <Sparkles size={16} className="sparkle-icon" />
            <span>
              <strong>Modo de demostración activo:</strong> Mostrando catálogo curado con reseñas de ejemplo. Puedes conectar tu propia clave TMDB en cualquier momento para explorar millones de títulos en vivo.
            </span>
          </div>
          <button onClick={onOpenKeyModal} className="btn-secondary btn-sm-notice">
            <Key size={13} />
            Configurar TMDB Key
          </button>
        </div>
      )}

      {/* Movies Grid */}
      {loading ? (
        <div className="grid-loading-state">
          <div className="cinema-spinner"></div>
          <p>Cargando películas de TMDB...</p>
        </div>
      ) : filteredMovies.length > 0 ? (
        <div className="movies-grid">
          {filteredMovies.map(movie => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onOpenMovie={onOpenMovie}
              reviewsCount={reviewsMap[movie.id] || 0}
            />
          ))}
        </div>
      ) : (
        <div className="grid-empty-state">
          <FilmEmptyIcon />
          <h3>No se encontraron películas</h3>
          <p>Intenta cambiar el género seleccionado o la búsqueda para encontrar títulos.</p>
          <button
            className="btn-secondary"
            onClick={() => { setSelectedGenre(null); setSortBy('default'); }}
          >
            Restablecer filtros
          </button>
        </div>
      )}
    </section>
  );
}

function FilmEmptyIcon() {
  return (
    <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎞️</div>
  );
}
