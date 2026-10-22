import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Calendar,
  Clock,
  Film,
  User,
  ThumbsUp,
  Trash2,
  Sparkles,
  AlertTriangle,
  Send,
  Play,
  Eye,
  EyeOff,
  Heart,
  Share2,
  Pencil
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { getMovieDetails, getImageUrl } from '../services/tmdb';
import {
  fetchMovieReviews,
  submitMovieReview,
  updateMovieReview,
  deleteMovieReview,
  toggleReviewLike
} from '../services/api';

export function MovieModal({ movie: initialMovie, onClose, startWithTrailer = false, onReviewsUpdated }) {
  const { user, openAuth, showToast } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [movie, setMovie] = useState(initialMovie);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [showTrailer, setShowTrailer] = useState(startWithTrailer);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [averageCommunityRating, setAverageCommunityRating] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Review form state (Add or Edit)
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [rating, setRating] = useState(9);
  const [hoverRating, setHoverRating] = useState(0);
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [hasSpoilers, setHasSpoilers] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Spoilers revealed tracker
  const [revealedSpoilers, setRevealedSpoilers] = useState({});

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Load detailed movie information & reviews on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setLoadingDetails(true);
        const detailsRes = await getMovieDetails(initialMovie.id);
        if (isMounted && detailsRes.movie) {
          setMovie(prev => ({ ...prev, ...detailsRes.movie }));
        }
      } catch (err) {
        console.error('Error loading movie details:', err);
      } finally {
        if (isMounted) setLoadingDetails(false);
      }

      // Load reviews
      try {
        setLoadingReviews(true);
        const reviewsData = await fetchMovieReviews(initialMovie.id);
        if (isMounted && reviewsData) {
          setReviews(reviewsData.reviews || []);
          setAverageCommunityRating(reviewsData.averageRating);
        }
      } catch (err) {
        console.error('Error loading reviews:', err);
      } finally {
        if (isMounted) setLoadingReviews(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [initialMovie.id]);

  // Handle submitting review (New or Edit)
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!user) {
      openAuth('login');
      return;
    }

    if (!content.trim()) {
      showToast('Por favor escribe tu opinión antes de publicar.', 'error');
      return;
    }

    try {
      setSubmittingReview(true);

      if (editingReviewId) {
        // Edit existing review
        const res = await updateMovieReview(editingReviewId, {
          rating,
          headline,
          content,
          hasSpoilers
        });

        setReviews(prev =>
          prev.map(r => (r.id === editingReviewId ? res.review : r))
        );
        showToast('¡Reseña actualizada con éxito!');
        setEditingReviewId(null);
      } else {
        // Create new review
        const res = await submitMovieReview({
          movieId: movie.id,
          movieTitle: movie.title,
          moviePoster: movie.poster_path || '',
          movieYear: movie.release_date ? movie.release_date.split('-')[0] : '',
          rating,
          headline,
          content,
          hasSpoilers
        });

        // Update reviews list
        setReviews(prev => [res.review, ...prev]);
        showToast('¡Tu reseña ha sido publicada con éxito!');
      }

      // Reset form
      setHeadline('');
      setContent('');
      setHasSpoilers(false);

      onReviewsUpdated?.();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Start editing a review
  const handleStartEdit = (rev) => {
    setEditingReviewId(rev.id);
    setRating(rev.rating);
    setHeadline(rev.headline || '');
    setContent(rev.content);
    setHasSpoilers(Boolean(rev.hasSpoilers));

    // Smooth scroll to form
    const el = document.querySelector('.review-box-card');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setHeadline('');
    setContent('');
    setHasSpoilers(false);
  };

  // Share movie link / details
  const handleShareMovie = () => {
    const text = `¡Descubre «${movie.title}» en CineCrítica!`;
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: movie.title, text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text} ${url}`);
      showToast('¡Enlace de la película copiado al portapapeles!');
    }
  };

  // Handle deleting review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta reseña?')) return;

    try {
      await deleteMovieReview(reviewId);
      const remaining = reviews.filter(r => r.id !== reviewId);
      setReviews(remaining);
      showToast('Reseña eliminada.');
      onReviewsUpdated?.();

      if (remaining.length > 0) {
        const sum = remaining.reduce((acc, r) => acc + Number(r.rating || 0), 0);
        setAverageCommunityRating((sum / remaining.length).toFixed(1));
      } else {
        setAverageCommunityRating(null);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Handle liking review
  const handleToggleLike = async (reviewId) => {
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
            return {
              ...r,
              likes: res.likes,
              likedBy: newLikedBy
            };
          }
          return r;
        })
      );
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const backdropUrl = getImageUrl(movie.backdrop_path || movie.poster_path, 'original');
  const posterUrl = getImageUrl(movie.poster_path, 'w500');
  const year = movie.release_date ? movie.release_date.split('-')[0] : '';
  const tmdbScore = Number(movie.vote_average || 0).toFixed(1);

  // Close when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  const toggleSpoilerReveal = (reviewId) => {
    setRevealedSpoilers(prev => ({
      ...prev,
      [reviewId]: !prev[reviewId]
    }));
  };

  // Descriptive text for rating stars
  const getRatingLabel = (val) => {
    if (val >= 10) return '🏆 Obra Maestra (10/10)';
    if (val >= 9) return '⭐ Excelente (9/10)';
    if (val >= 8) return '✨ Muy Buena (8/10)';
    if (val >= 7) return '👍 Buena (7/10)';
    if (val >= 6) return '🙂 Decente (6/10)';
    if (val >= 5) return '😐 Regular (5/10)';
    if (val >= 4) return '👎 Floja (4/10)';
    return '💀 Mala (1-3/10)';
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container movie-modal-body">
        {/* Floating Close Button */}
        <button className="modal-close-float" onClick={onClose} title="Cerrar modal">
          <X size={20} />
        </button>

        {/* Modal Header: Video Trailer or Backdrop */}
        <div className="modal-hero-header">
          {showTrailer && movie.trailer_key ? (
            <div className="modal-trailer-wrapper">
              <iframe
                title="Tráiler de la película"
                src={`https://www.youtube.com/embed/${movie.trailer_key}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="modal-trailer-iframe"
              ></iframe>
              <button
                className="btn-secondary btn-switch-trailer"
                onClick={() => setShowTrailer(false)}
              >
                Volver a la portada
              </button>
            </div>
          ) : (
            <div
              className="modal-backdrop-image"
              style={{ backgroundImage: `url(${backdropUrl})` }}
            >
              <div className="modal-backdrop-gradient"></div>

              {movie.trailer_key && (
                <button
                  className="btn-play-trailer-hero"
                  onClick={() => setShowTrailer(true)}
                >
                  <Play size={22} fill="currentColor" />
                  <span>Ver Tráiler Oficial</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Modal Movie Info Grid */}
        <div className="modal-info-section">
          <div className="modal-poster-col">
            <img src={posterUrl} alt={movie.title} className="modal-poster-img" />
          </div>

          <div className="modal-details-col">
            <div className="modal-title-row">
              <div className="modal-title-wrap">
                <h1 className="modal-movie-title">{movie.title}</h1>
                {movie.original_title && movie.original_title !== movie.title && (
                  <span className="modal-original-title">({movie.original_title})</span>
                )}
              </div>

              <div className="modal-action-buttons">
                <button
                  className={`btn-modal-action ${isFavorite(movie.id) ? 'active-fav' : ''}`}
                  onClick={() => toggleFavorite(movie)}
                  title={isFavorite(movie.id) ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                >
                  <Heart
                    size={16}
                    fill={isFavorite(movie.id) ? '#ef4444' : 'none'}
                    color={isFavorite(movie.id) ? '#ef4444' : 'currentColor'}
                  />
                  <span>{isFavorite(movie.id) ? 'En Favoritos' : 'Favorito'}</span>
                </button>

                <button
                  className="btn-modal-action"
                  onClick={handleShareMovie}
                  title="Compartir película"
                >
                  <Share2 size={16} />
                  <span>Compartir</span>
                </button>
              </div>
            </div>

            {movie.tagline && (
              <p className="modal-movie-tagline">«{movie.tagline}»</p>
            )}

            {/* Badges / Metrics */}
            <div className="modal-badges-row">
              <span className="badge-pill badge-gold" title="Calificación general">
                <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                Crítica: {tmdbScore}/10
              </span>

              {averageCommunityRating ? (
                <span className="badge-pill badge-accent" title="Promedio de usuarios de CineCrítica">
                  <Sparkles size={14} />
                  Comunidad: {averageCommunityRating}/10 ({reviews.length} reseñas)
                </span>
              ) : (
                <span className="badge-pill">
                  Comunidad: Sin reseñas aún
                </span>
              )}

              {year && (
                <span className="badge-pill">
                  <Calendar size={13} />
                  {year}
                </span>
              )}

              {movie.runtime ? (
                <span className="badge-pill">
                  <Clock size={13} />
                  {movie.runtime} minutos
                </span>
              ) : null}

              {movie.director && (
                <span className="badge-pill">
                  <Film size={13} />
                  Dir: {movie.director}
                </span>
              )}
            </div>

            {/* Genres */}
            {movie.genres && movie.genres.length > 0 && (
              <div className="modal-genres-list">
                {movie.genres.map(g => (
                  <span key={g.id || g.name} className="modal-genre-tag">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            <div className="modal-synopsis-block">
              <h3>Sinopsis</h3>
              <p>{movie.overview || 'Sinopsis no disponible en este momento.'}</p>
            </div>

            {/* Cast row if available */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="modal-cast-block">
                <h3>Reparto Principal</h3>
                <div className="modal-cast-scroll">
                  {movie.cast.map(actor => (
                    <div key={actor.id || actor.name} className="cast-card">
                      <div className="cast-avatar">
                        {actor.profile_path ? (
                          <img
                            src={getImageUrl(actor.profile_path, 'w185')}
                            alt={actor.name}
                          />
                        ) : (
                          <span>🎭</span>
                        )}
                      </div>
                      <span className="cast-name">{actor.name}</span>
                      {actor.character && (
                        <span className="cast-character">{actor.character}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="modal-section-divider"></div>

        {/* ======================================================== */}
        {/* REVIEWS & COMMENTS SECTION (User Requirement)           */}
        {/* ======================================================== */}
        <section className="modal-reviews-section">
          <div className="reviews-section-header">
            <div>
              <h2 className="reviews-main-title">Reseñas y Críticas de la Comunidad</h2>
              <p className="reviews-subtitle">
                {reviews.length === 0
                  ? 'Aún no hay reseñas para esta película. ¡Sé el primero en opinar!'
                  : `Opiniones y puntuaciones de los espectadores (${reviews.length})`}
              </p>
            </div>
          </div>

          {/* ADD REVIEW BOX */}
          <div className="review-box-card glass-panel">
            {user ? (
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="review-form-header">
                  <div className="review-author-info">
                    <span className="author-avatar">{user.avatar || '🍿'}</span>
                    <div>
                      <strong className="author-name">{user.name}</strong>
                      <span className="author-badge">{user.badge || 'Crítico'}</span>
                    </div>
                  </div>

                  {/* Rating Selector (1 to 10) */}
                  <div className="rating-interactive-box">
                    <span className="rating-label">Tu Calificación:</span>
                    <div className="stars-row">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(starVal => (
                        <button
                          key={starVal}
                          type="button"
                          className={`star-btn ${starVal <= (hoverRating || rating) ? 'star-active' : ''}`}
                          onMouseEnter={() => setHoverRating(starVal)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(starVal)}
                          title={`${starVal}/10`}
                        >
                          <Star size={18} fill="currentColor" />
                        </button>
                      ))}
                    </div>
                    <span className="rating-hint-text">
                      {getRatingLabel(hoverRating || rating)}
                    </span>
                  </div>
                </div>

                <div className="review-inputs-group">
                  <input
                    type="text"
                    placeholder="Título o resumen de tu reseña (ej. «Una experiencia cinematográfica única»)"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="review-input-headline"
                  />

                  <textarea
                    rows={4}
                    placeholder="Escribe tu análisis: ¿Qué te pareció el guion, la música, las actuaciones o la dirección? Comparte tu punto de vista..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="review-textarea"
                    required
                  ></textarea>
                </div>

                <div className="review-form-footer">
                  <label className="spoiler-checkbox-label">
                    <input
                      type="checkbox"
                      checked={hasSpoilers}
                      onChange={(e) => setHasSpoilers(e.target.checked)}
                    />
                    <AlertTriangle size={15} className="spoiler-warn-icon" />
                    <span>Esta reseña contiene spoilers de la trama</span>
                  </label>

                  <div className="review-form-actions-right">
                    {editingReviewId && (
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="btn-secondary btn-cancel-edit"
                      >
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="btn-primary btn-submit-review"
                    >
                      <Send size={15} />
                      {submittingReview
                        ? 'Guardando...'
                        : editingReviewId
                        ? 'Guardar Cambios'
                        : 'Publicar Reseña'}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="login-prompt-card">
                <div className="login-prompt-icon">💬</div>
                <div className="login-prompt-content">
                  <h3>¿Quieres comentar o calificar esta película?</h3>
                  <p>Inicia sesión con tu cuenta para publicar reseñas, calificar del 1 al 10 e interactuar con otros cinéfilos.</p>
                </div>
                <div className="login-prompt-actions">
                  <button
                    onClick={() => openAuth('login')}
                    className="btn-primary"
                  >
                    <User size={15} />
                    Iniciar Sesión / Registrarse
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* REVIEWS LIST */}
          <div className="reviews-list-container">
            {loadingReviews ? (
              <div className="reviews-loading">
                <div className="cinema-spinner"></div>
                <p>Cargando opiniones...</p>
              </div>
            ) : reviews.length > 0 ? (
              reviews.map((rev) => {
                const isAuthor = user && user.id === rev.userId;
                const isLiked = user && Array.isArray(rev.likedBy) && rev.likedBy.includes(user.id);
                const isSpoilerHidden = rev.hasSpoilers && !revealedSpoilers[rev.id];

                return (
                  <article key={rev.id} className="review-card glass-panel">
                    <div className="review-card-header">
                      <div className="review-user-block">
                        <span className="review-avatar">{rev.userAvatar || '🍿'}</span>
                        <div>
                          <strong className="review-username">{rev.userName}</strong>
                          <span className="review-date">
                            {new Date(rev.createdAt).toLocaleDateString('es-ES', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="review-header-right">
                        <span className="review-score-badge">
                          <Star size={14} fill="#fbbf24" stroke="#fbbf24" />
                          <span>{rev.rating}/10</span>
                        </span>

                        {isAuthor && (
                          <div className="author-actions-group">
                            <button
                              className="btn-edit-review"
                              onClick={() => handleStartEdit(rev)}
                              title="Editar mi reseña"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              className="btn-delete-review"
                              onClick={() => handleDeleteReview(rev.id)}
                              title="Eliminar mi reseña"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {rev.headline && (
                      <h4 className="review-headline">«{rev.headline}»</h4>
                    )}

                    {/* Spoiler Shield */}
                    {isSpoilerHidden ? (
                      <div className="spoiler-shield-box">
                        <div className="spoiler-warning">
                          <AlertTriangle size={18} />
                          <span>Esta reseña contiene spoilers de la película.</span>
                        </div>
                        <button
                          className="btn-secondary btn-reveal-spoiler"
                          onClick={() => toggleSpoilerReveal(rev.id)}
                        >
                          <Eye size={15} />
                          Mostrar contenido
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="review-content-text">{rev.content}</p>
                        {rev.hasSpoilers && (
                          <button
                            className="btn-ghost btn-hide-spoiler"
                            onClick={() => toggleSpoilerReveal(rev.id)}
                          >
                            <EyeOff size={14} />
                            Ocultar spoilers
                          </button>
                        )}
                      </>
                    )}

                    <div className="review-card-footer">
                      <button
                        className={`btn-like-review ${isLiked ? 'liked' : ''}`}
                        onClick={() => handleToggleLike(rev.id)}
                        title={isLiked ? 'Quitar voto útil' : 'Marcar como útil'}
                      >
                        <ThumbsUp size={14} fill={isLiked ? 'currentColor' : 'none'} />
                        <span>{rev.likes || 0} personas encontraron esto útil</span>
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              <div className="no-reviews-box">
                <span className="no-reviews-icon">✍️</span>
                <p>Todavía no hay comentarios para esta película.</p>
                <p className="no-reviews-hint">
                  {user
                    ? '¡Usa el formulario arriba para compartir tu opinión!'
                    : 'Inicia sesión para ser el primero en calificarla.'}
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
