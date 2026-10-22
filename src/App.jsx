import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider, useFavorites } from './context/FavoritesContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieGrid } from './components/MovieGrid';
import { MovieModal } from './components/MovieModal';
import { AuthModal } from './components/AuthModal';
import { CommunityFeed } from './components/CommunityFeed';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies
} from './services/tmdb';
import { fetchRecentReviews } from './services/api';
import { Film, Heart } from 'lucide-react';

function CineCriticaApp() {
  const { favorites } = useFavorites();
  const [activeCategory, setActiveCategory] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [startWithTrailer, setStartWithTrailer] = useState(false);

  // Community reviews count cache { [movieId]: count }
  const [reviewsMap, setReviewsMap] = useState({});

  // Refresh review count cache helper
  const loadReviewsCount = useCallback(async () => {
    try {
      const res = await fetchRecentReviews(100);
      if (res && res.reviews) {
        const counts = {};
        res.reviews.forEach(r => {
          counts[r.movieId] = (counts[r.movieId] || 0) + 1;
        });
        setReviewsMap(counts);
      }
    } catch (err) {
      console.warn('Could not load reviews count:', err);
    }
  }, []);

  // Fetch reviews map on mount
  useEffect(() => {
    loadReviewsCount();
  }, [loadReviewsCount]);

  // Fetch movies based on active category or search query
  const loadMovies = useCallback(async () => {
    if (activeCategory === 'favorites') {
      let list = [...favorites];
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        list = list.filter(m => (m.title || '').toLowerCase().includes(q));
      }
      setMovies(list);
      setLoading(false);
      return;
    }

    if (activeCategory === 'community' || activeCategory === 'my_reviews') {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const res = await searchMovies(searchQuery);
        setMovies(res.movies || []);
      } else {
        let res;
        switch (activeCategory) {
          case 'popular':
            res = await getPopularMovies();
            break;
          case 'top_rated':
            res = await getTopRatedMovies();
            break;
          case 'upcoming':
            res = await getUpcomingMovies();
            break;
          case 'trending':
          default:
            res = await getTrendingMovies();
            break;
        }
        setMovies(res.movies || []);

        // Set top movie for the hero banner if in trending/popular and no search
        if (res.movies && res.movies.length > 0 && !heroMovie) {
          setHeroMovie(res.movies[0]);
        }
      }
    } catch (err) {
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, searchQuery, heroMovie, favorites]);

  // Trigger load on category or search query changes
  useEffect(() => {
    const timer = setTimeout(() => {
      loadMovies();
    }, searchQuery ? 350 : 0);

    return () => clearTimeout(timer);
  }, [loadMovies, searchQuery]);

  // Open movie modal
  const handleOpenMovie = (movie, withTrailer = false) => {
    setSelectedMovie(movie);
    setStartWithTrailer(withTrailer);
  };

  const handleCloseMovie = () => {
    setSelectedMovie(null);
    setStartWithTrailer(false);
    loadReviewsCount();
  };

  // Section title helpers
  const getSectionTitle = () => {
    if (searchQuery.trim()) return `Resultados para «${searchQuery}»`;
    switch (activeCategory) {
      case 'favorites': return `Mis Películas Favoritas (${favorites.length})`;
      case 'popular': return 'Películas Populares';
      case 'top_rated': return 'Mejor Valoradas por la Crítica';
      case 'upcoming': return 'Próximos Estrenos en Cine';
      case 'trending':
      default: return 'Tendencias de la Semana';
    }
  };

  const getSectionSubtitle = () => {
    if (searchQuery.trim()) return 'Títulos coincidentes con tu búsqueda';
    switch (activeCategory) {
      case 'favorites': return 'Tu colección personal de películas guardadas para ver y seguir';
      case 'popular': return 'Las películas más reproducidas y comentadas del momento';
      case 'top_rated': return 'Obras maestras con las puntuaciones más altas de la historia';
      case 'upcoming': return 'Lanzamientos programados para los próximos meses';
      case 'trending':
      default: return 'Lo más visto y comentado por cinéfilos en los últimos 7 días';
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setSearchQuery('');
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="main-content">
        {activeCategory === 'community' || activeCategory === 'my_reviews' ? (
          <CommunityFeed
            onOpenMovie={handleOpenMovie}
            initialFilter={activeCategory === 'my_reviews' ? 'mine' : 'all'}
            onReviewsCountChange={loadReviewsCount}
          />
        ) : (
          <>
            {/* Show Hero billboard if on trending and not searching */}
            {!searchQuery && activeCategory === 'trending' && heroMovie && (
              <HeroBanner
                movie={heroMovie}
                onOpenMovie={handleOpenMovie}
              />
            )}

            {/* Movies Catalog Grid */}
            <MovieGrid
              movies={movies}
              title={getSectionTitle()}
              subtitle={getSectionSubtitle()}
              onOpenMovie={handleOpenMovie}
              reviewsMap={reviewsMap}
              loading={loading}
              isFavoritesView={activeCategory === 'favorites'}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="cinema-footer">
        <div className="footer-container">
          <div className="footer-col-brand">
            <div className="footer-logo">
              <Film size={22} className="footer-logo-icon" />
              <span>Cine<strong>Crítica</strong></span>
            </div>
            <p className="footer-desc">
              Plataforma interactiva de reseñas cinematográficas con autenticación y datos de The Movie Database.
            </p>
          </div>

          <div className="footer-col-tmdb">
            <h4>TMDB Attribution</h4>
            <div className="tmdb-badge-footer">
              <img
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg"
                alt="TMDB Logo"
                className="tmdb-logo-img"
              />
              <p>
                Este producto utiliza la API de TMDB pero no está avalado ni certificado por TMDB.
              </p>
            </div>
          </div>

          <div className="footer-col-academic">
            <h4>CineCrítica</h4>
            <p>Catálogo cinematográfico y comunidad de reseñas en tiempo real.</p>
            <p className="footer-academic-meta">
              Diseño con Glassmorphism, autenticación JWT, base de datos local y modales interactivos.
            </p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <span>&copy; {new Date().getFullYear()} CineCrítica. Todos los derechos reservados.</span>
          <span>Hecho para Práctica 3</span>
        </div>
      </footer>

      {/* Core Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={handleCloseMovie}
          startWithTrailer={startWithTrailer}
          onReviewsUpdated={loadReviewsCount}
        />
      )}

      {/* Auth Modal (Login / Register) */}
      <AuthModal />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CineCriticaApp />
      </FavoritesProvider>
    </AuthProvider>
  );
}
