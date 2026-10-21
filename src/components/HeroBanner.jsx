import React from 'react';
import { Star, Play, MessageSquare, Calendar, Clock, Film } from 'lucide-react';
import { getImageUrl } from '../services/tmdb';

export function HeroBanner({ movie, onOpenMovie }) {
  if (!movie) return null;

  const backdropUrl = getImageUrl(movie.backdrop_path || movie.poster_path, 'original');
  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const rating = Number(movie.vote_average || 0).toFixed(1);

  return (
    <section className="hero-banner-section">
      {/* Background with layered gradients */}
      <div
        className="hero-backdrop"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="hero-gradient-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-meta-badges">
          <span className="badge-pill badge-gold">
            <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
            {rating} / 10 en TMDB
          </span>
          {year && (
            <span className="badge-pill">
              <Calendar size={13} />
              {year}
            </span>
          )}
          {movie.runtime && (
            <span className="badge-pill">
              <Clock size={13} />
              {movie.runtime} min
            </span>
          )}
          <span className="badge-pill badge-accent">
            <Film size={13} />
            Destacado de la Semana
          </span>
        </div>

        <h1 className="hero-title">{movie.title}</h1>
        {movie.tagline && (
          <p className="hero-tagline">«{movie.tagline}»</p>
        )}

        <p className="hero-overview">
          {movie.overview || 'Explora los detalles, el reparto y las reseñas de la comunidad sobre esta destacada obra cinematográfica.'}
        </p>

        <div className="hero-actions">
          <button
            onClick={() => onOpenMovie(movie)}
            className="btn-primary hero-btn-main"
          >
            <MessageSquare size={18} />
            Ver Ficha y Reseñas
          </button>

          {movie.trailer_key && (
            <button
              onClick={() => onOpenMovie(movie, true)}
              className="btn-secondary hero-btn-sub"
            >
              <Play size={18} fill="currentColor" />
              Ver Tráiler
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
