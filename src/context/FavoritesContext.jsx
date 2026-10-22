import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { user, showToast } = useAuth();
  const storageKey = `cinecritica_favorites_${user ? user.id : 'guest'}`;

  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // When user changes (login/logout/switch), load their respective favorites
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setFavorites(saved ? JSON.parse(saved) : []);
    } catch {
      setFavorites([]);
    }
  }, [storageKey]);

  const isFavorite = (movieId) => {
    return favorites.some(m => String(m.id) === String(movieId));
  };

  const toggleFavorite = (movie) => {
    if (!movie || !movie.id) return;
    setFavorites(prev => {
      const exists = prev.some(m => String(m.id) === String(movie.id));
      let updated;
      if (exists) {
        updated = prev.filter(m => String(m.id) !== String(movie.id));
        showToast(`«${movie.title}» eliminada de tus favoritos.`);
      } else {
        const compactMovie = {
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          release_date: movie.release_date,
          vote_average: movie.vote_average,
          vote_count: movie.vote_count,
          genre_ids: movie.genre_ids || (movie.genres ? movie.genres.map(g => g.id) : []),
          overview: movie.overview
        };
        updated = [compactMovie, ...prev];
        showToast(`«${movie.title}» guardada en tus favoritos ❤️`);
      }
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving favorites:', err);
      }
      return updated;
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
