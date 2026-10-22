import React, { useState, useEffect, useMemo } from 'react';
import {
  MessageSquare,
  Star,
  Film,
  Users,
  Sparkles,
  ThumbsUp,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
  Search,
  Filter
} from 'lucide-react';
import {
  fetchRecentReviews,
  fetchCommunityStats,
  toggleReviewLike,
  deleteMovieReview
} from '../services/api';
import { getImageUrl } from '../services/tmdb';
import { useAuth } from '../context/AuthContext';

export function CommunityFeed({ onOpenMovie, initialFilter = 'all', onReviewsCountChange }) {
  const { user, openAuth, showToast } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ totalReviews: 0, uniqueMovies: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  // Community view interactive controls
  const [activeFilter, setActiveFilter] = useState(initialFilter); // 'all' | 'mine' | 'spoilers'
  const [searchFilter, setSearchFilter] = useState('');
  const [revealedSpoilers, setRevealedSpoilers] = useState({});

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  const loadCommunityData = async () => {
    try {
      setLoading(true);
      const [reviewsRes, statsRes] = await Promise.all([
        fetchRecentReviews(50),
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
  };

  useEffect(() => {
    loadCommunityData();
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

  const handleDelete = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar tu reseña?')) return;

    try {
      await deleteMovieReview(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      setStats(prev => ({ ...prev, totalReviews: Math.max(0, prev.totalReviews - 1) }));
      showToast('Reseña eliminada con éxito.');
      onReviewsCountChange?.();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const toggleSpoilerReveal = (reviewId) => {
    setRevealedSpoilers(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Filtered reviews
  const myReviewsCount = useMemo(() => {
    if (!user) return 0;
    return reviews.filter(r => r.userId === user.id).length;
  }, [reviews, user]);

  const filteredReviews = useMemo(() => {
    let list = [...reviews];

    if (activeFilter === 'mine') {
      if (!user) return [];
      list = list.filter(r => r.userId === user.id);
    } else if (activeFilter === 'spoilers') {
      list = list.filter(r => r.hasSpoilers);
    }

    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      list = list.filter(
        r =>
          (r.movieTitle || '').toLowerCase().includes(q) ||
          (r.headline || '').toLowerCase().includes(q) ||
          (r.content || '').toLowerCase().includes(q) ||
          (r.userName || '').toLowerCase().includes(q)
      );
    }

    return list;
  }, [reviews, activeFilter, user, searchFilter]);

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

      {/* Community Controls: Filter Tabs & Search */}
      <div className="community-controls-bar">
        <div className="community-tabs">
          <button
            className={`community-tab-btn ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            Todas las reseñas ({reviews.length})
          </button>
          {user && (
            <button
              className={`community-tab-btn ${activeFilter === 'mine' ? 'active' : ''}`}
              onClick={() => setActiveFilter('mine')}
            >
              Mis reseñas ({myReviewsCount})
            </button>
          )}
          <button
            className={`community-tab-btn ${activeFilter === 'spoilers' ? 'active' : ''}`}
            onClick={() => setActiveFilter('spoilers')}
          >
            ⚠️ Con spoilers
          </button>
        </div>

        <div className="community-search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar por película, crítico o texto..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="community-search-input"
          />
          {searchFilter && (
            <button
              className="search-clear-btn"
              onClick={() => setSearchFilter('')}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Reviews Stream */}
      {loading ? (
        <div className="grid-loading-state">
          <div className="cinema-spinner"></div>
          <p>Cargando reseñas de la comunidad...</p>
        </div>
      ) : filteredReviews.length > 0 ? (
        <div className="community-reviews-grid">
          {filteredReviews.map(rev => {
            const isAuthor = user && user.id === rev.userId;
            const isLiked = user && Array.isArray(rev.likedBy) && rev.likedBy.includes(user.id);
            const isSpoilerHidden = rev.hasSpoilers && !revealedSpoilers[rev.id];

            return (
              <div key={rev.id} className="community-review-card glass-panel">
                <div className="comm-card-top">
                  <div
                    className="comm-movie-link"
                    onClick={() =>
                      onOpenMovie({
                        id: rev.movieId,
                        title: rev.movieTitle,
                        poster_path: rev.moviePoster
                      })
                    }
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

                  <div className="comm-card-top-right">
                    <span className="review-score-badge">
                      <Star size={13} fill="#fbbf24" stroke="#fbbf24" />
                      <span>{rev.rating}/10</span>
                    </span>

                    {isAuthor && (
                      <button
                        className="btn-delete-review-comm"
                        onClick={() => handleDelete(rev.id)}
                        title="Eliminar mi reseña"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="comm-user-info">
                  <span className="comm-avatar">{rev.userAvatar || '🍿'}</span>
                  <div>
                    <strong className="comm-username">
                      {rev.userName}
                      {isAuthor && <span className="comm-author-badge">Tú</span>}
                    </strong>
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

                {/* Spoiler Shield for Community cards */}
                {isSpoilerHidden ? (
                  <div className="spoiler-shield-box comm-spoiler-box">
                    <div className="spoiler-warning">
                      <AlertTriangle size={15} />
                      <span>Contiene spoilers de la trama</span>
                    </div>
                    <button
                      className="btn-secondary btn-reveal-spoiler btn-sm"
                      onClick={() => toggleSpoilerReveal(rev.id)}
                    >
                      <Eye size={13} />
                      Mostrar
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="comm-content">{rev.content}</p>
                    {rev.hasSpoilers && (
                      <button
                        className="btn-ghost btn-hide-spoiler btn-sm"
                        onClick={() => toggleSpoilerReveal(rev.id)}
                      >
                        <EyeOff size={13} />
                        Ocultar spoiler
                      </button>
                    )}
                  </>
                )}

                <div className="comm-card-footer">
                  <button
                    className={`btn-like-review ${isLiked ? 'liked' : ''}`}
                    onClick={() => handleLike(rev.id)}
                    title={isLiked ? 'Quitar voto útil' : 'Marcar como útil'}
                  >
                    <ThumbsUp size={13} fill={isLiked ? 'currentColor' : 'none'} />
                    <span>{rev.likes || 0}</span>
                  </button>

                  <button
                    className="btn-ghost btn-sm-card"
                    onClick={() =>
                      onOpenMovie({
                        id: rev.movieId,
                        title: rev.movieTitle,
                        poster_path: rev.moviePoster
                      })
                    }
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
          <p>
            {activeFilter === 'mine'
              ? 'Aún no has publicado reseñas. ¡Abre cualquier película y sé el primero en opinar!'
              : searchFilter
              ? `No se encontraron reseñas para «${searchFilter}».`
              : 'No hay reseñas en la comunidad en este momento.'}
          </p>
          {(activeFilter !== 'all' || searchFilter) && (
            <button
              className="btn-secondary"
              onClick={() => {
                setActiveFilter('all');
                setSearchFilter('');
              }}
            >
              Ver todas las reseñas
            </button>
          )}
        </div>
      )}
    </section>
  );
}
