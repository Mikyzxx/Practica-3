import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { MovieGrid } from './components/MovieGrid';
import { MovieModal } from './components/MovieModal';
import { AuthModal } from './components/AuthModal';
import { TmdbKeyModal } from './components/TmdbKeyModal';
import { CommunityFeed } from './components/CommunityFeed';
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies
} from './services/tmdb';
import { fetchRecentReviews } from './services/api';
import { Film, Heart, ExternalLink } from 'lucide-react';

function CineCriticaApp() {
  const [activeCategory, setActiveCategory] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Modal states
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [startWithTrailer, setStartWithTrailer] = useState(false);
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  // Community reviews count cache { [movieId]: count }
  const [reviewsMap, setReviewsMap] = useState({});

  // Fetch reviews map on mount
  useEffect(() => {
    async function loadReviewsCount() {
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
    }
    loadReviewsCount();
  }, []);

  // Fetch movies based on active category or search query
  const loadMovies = useCallback(async () => {
    setLoading(true);
    try {
      if (searchQuery.trim()) {
        const res = await searchMovies(searchQuery);
        setMovies(res.movies || []);
        setIsDemoMode(res.isDemo);
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
        setIsDemoMode(res.isDemo);

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
  }, [activeCategory, searchQuery, heroMovie]);

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
  };

  const handleKeyUpdated = () => {
    setKeyModalOpen(false);
    // Reload movies with updated key
    loadMovies();
  };

  // Section title helpers
  const getSectionTitle = () => {
    if (searchQuery.trim()) return `Resultados para «${searchQuery}»`;
    switch (activeCategory) {
      case 'popular': return 'Películas Populares';
      case 'top_rated': return 'Mejor Valoradas por la Crítica';
      case 'upcoming': return 'Próximos Estrenos en Cine';
      case 'trending':
      default: return 'Tendencias de la Semana';
    }
  };

  const getSectionSubtitle = () => {
    if (searchQuery.trim()) return 'Títulos coincidentes de la base de datos de TMDB';
    switch (activeCategory) {
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
        onOpenKeyModal={() => setKeyModalOpen(true)}
        isDemoMode={isDemoMode}
      />

      <main className="main-content">
        {activeCategory === 'community' ? (
          <CommunityFeed onOpenMovie={handleOpenMovie} />
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
              isDemoMode={isDemoMode}
              onOpenKeyModal={() => setKeyModalOpen(true)}
              loading={loading}
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
            <h4>Práctica 3 - Desarrollo Web</h4>
            <p>Arquitectura React + Express + TMDB API.</p>
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
        />
      )}

      {/* Auth Modal (Login / Register) */}
      <AuthModal />

      {/* TMDB API Key Configuration Modal */}
      <TmdbKeyModal
        isOpen={keyModalOpen}
        onClose={() => setKeyModalOpen(false)}
        onKeyUpdated={handleKeyUpdated}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CineCriticaApp />
    </AuthProvider>
  );
}
