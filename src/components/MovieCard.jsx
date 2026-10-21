import React from 'react';
import { Star, MessageSquare, Calendar, Play } from 'lucide-react';
import { getImageUrl } from '../services/tmdb';

export function MovieCard({ movie, onOpenMovie, reviewsCount }) {
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const rating = Number(movie.vote_average || 0).toFixed(1);

  return (
    <div className="movie-card" onClick={() => onOpenMovie(movie)}>
      <div className="movie-poster-wrapper">
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
          className="movie-poster-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80';
          }}
        />

        {/* Top Badges */}
        <div className="poster-top-badges">
          <span className="poster-rating-badge">
            <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
            <span>{rating}</span>
          </span>

          {reviewsCount > 0 && (
            <span className="poster-reviews-badge">
              <MessageSquare size={12} />
              <span>{reviewsCount}</span>
            </span>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="poster-hover-overlay">
          <div className="hover-action-btn">
            <Play size={20} fill="#ffffff" />
          </div>
          <span className="hover-action-text">Ver Modal & Reseñas</span>
        </div>
      </div>

      <div className="movie-card-info">
        <h3 className="movie-card-title" title={movie.title}>{movie.title}</h3>
        <div className="movie-card-meta">
          <span className="movie-card-year">
            <Calendar size={12} />
            {year || 'N/A'}
          </span>
          <span className="movie-card-votes">
            {movie.vote_count ? `${movie.vote_count.toLocaleString()} votos` : 'TMDB'}
          </span>
        </div>
      </div>
    </div>
  );
}
