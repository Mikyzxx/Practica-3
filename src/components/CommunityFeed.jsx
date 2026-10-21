import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, Film, Users, Sparkles, ThumbsUp } from 'lucide-react';
import { fetchRecentReviews, fetchCommunityStats, toggleReviewLike } from '../services/api';
import { getImageUrl } from '../services/tmdb';
import { useAuth } from '../context/AuthContext';

export function CommunityFeed({ onOpenMovie }) {
  const { user, openAuth, showToast } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, uniqueMovies: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCommunity() {
      try {
        setLoading(true);
        const [reviewsRes, statsRes] = await Promise.all([
          fetchRecentReviews(20),
          fetchCommunityStats()
        ]);
        if (reviewsRes && reviewsRes.reviews) {
          setReviews(reviewsRes.reviews);
        }
        if (statsRes) {
          setStats(statsRes);
        }
      } catch (err) {
        console.error('Error loading community feed:', err);
      } finally {
        setLoading(false);
      }
    }

    loadCommunity();
  }, []);

  const handleLike = async (reviewId) => {
    if (!user) {
      openAuth('login');
      return;
    }

    try {
      const res = await toggleReviewLike(reviewId);
      setReviews(prev =>
        prev.map(r => {
          if (r.id === reviewId) {
            const currentLikedBy = Array.isArray(r.likedBy) ? r.likedBy : [];
            const newLikedBy = res.liked
              ? [...currentLikedBy, user.id]
              : currentLikedBy.filter(id => id !== user.id);
            return { ...r, likes: res.likes, likedBy: newLikedBy };
          }
          return r;
        })
      );
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <section className="community-feed-section">
      {/* Community Stats Header Banner */}
      <div className="community-stats-banner glass-panel">
        <div className="stats-header-info">
          <h2>Comunidad Cinéfila de CineCrítica</h2>
          <p>Lee las opiniones más recientes de nuestros críticos y espectadores registrados.</p>
        </div>

        <div className="stats-counters-row">
          <div className="stat-counter-card">
            <MessageSquare size={20} className="stat-icon" />
            <div className="stat-details">
              <strong>{stats.totalReviews}</strong>
              <span>Reseñas Totales</span>
            </div>
          </div>

          <div className="stat-counter-card">
            <Film size={20} className="stat-icon" />
            <div className="stat-details">
              <strong>{stats.uniqueMovies}</strong>
              <span>Películas Evaluadas</span>
            </div>
          </div>

          <div className="stat-counter-card">
            <Users size={20} className="stat-icon" />
            <div className="stat-details">
              <strong>{stats.totalUsers}</strong>
              <span>Críticos Activos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Stream */}
      {loading ? (
        <div className="grid-loading-state">
          <div className="cinema-spinner"></div>
          <p>Cargando reseñas de la comunidad...</p>
        </div>
      ) : reviews.length > 0 ? (
        <div className="community-reviews-grid">
          {reviews.map(rev => {
            const isLiked = user && Array.isArray(rev.likedBy) && rev.likedBy.includes(user.id);
            return (
              <div key={rev.id} className="community-review-card glass-panel">
                <div className="comm-card-top">
                  <div
                    className="comm-movie-link"
                    onClick={() => onOpenMovie({ id: rev.movieId, title: rev.movieTitle, poster_path: rev.moviePoster })}
                  >
                    {rev.moviePoster ? (
                      <img
                        src={getImageUrl(rev.moviePoster, 'w185')}
                        alt={rev.movieTitle}
                        className="comm-movie-thumb"
                      />
                    ) : (
                      <div className="comm-movie-thumb-placeholder">🎬</div>
                    )}
                    <div>
                      <h4 className="comm-movie-title">{rev.movieTitle}</h4>
                      <span className="comm-movie-year">{rev.movieYear || 'Cine'}</span>
                    </div>
                  </div>

                  <span className="review-score-badge">
                    <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
                    <span>{rev.rating}/10</span>
                  </span>
                </div>

                <div className="comm-user-info">
                  <span className="comm-avatar">{rev.userAvatar || '🍿'}</span>
                  <div>
                    <strong className="comm-username">{rev.userName}</strong>
                    <span className="comm-date">
                      {new Date(rev.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                {rev.headline && (
                  <h5 className="comm-headline">«{rev.headline}»</h5>
                )}

                <p className="comm-content">{rev.content}</p>

                <div className="comm-card-footer">
                  <button
                    className={`btn-like-review ${isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(rev.id)}
                  >
                    <ThumbsUp size={13} fill={isLiked ? 'currentColor' : 'none'} />
                    <span>{rev.likes || 0}</span>
                  </button>

                  <button
                    className="btn-ghost btn-sm-card"
                    onClick={() => onOpenMovie({ id: rev.movieId, title: rev.movieTitle, poster_path: rev.moviePoster })}
                  >
                    Ver Película y Modal &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid-empty-state">
          <p>No hay reseñas en la comunidad en este momento.</p>
        </div>
      )}
    </section>
  );
}
