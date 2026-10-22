import React, { useState } from 'react';
import { Search, Film, User, LogOut, ChevronDown, Heart, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';

export function Navbar({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange
}) {
  const { user, openAuth, logout } = useAuth();
  const { favorites } = useFavorites();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => onSelectCategory('trending')}>
          <div className="brand-icon-wrapper">
            <Film className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Cine<span className="brand-accent">Crítica</span></span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar películas, directores, géneros..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Borrar búsqueda"
            >
              ×
            </button>
          )}
        </div>

        {/* Right Action Items */}
        <div className="navbar-actions">
          {/* User Auth Section */}
          {user ? (
            <div className="user-profile-menu">
              <button
                className="user-profile-button"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <span className="user-avatar-badge">{user.avatar || '🍿'}</span>
                <span className="user-name-label">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className="user-chevron" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="dropdown-overlay"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="user-dropdown-card">
                    <div className="dropdown-user-header">
                      <div className="dropdown-avatar">{user.avatar || '🍿'}</div>
                      <div className="dropdown-info">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                    </div>
                    <div className="dropdown-badge-row">
                      <span className="badge-pill badge-accent">{user.badge || 'Crítico'}</span>
                    </div>

                    <div className="dropdown-divider"></div>

                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onSelectCategory('favorites');
                      }}
                    >
                      <Heart size={16} className="text-accent" />
                      <span>Mis Favoritos ({favorites.length})</span>
                    </button>

                    <button
                      className="dropdown-item"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onSelectCategory('my_reviews');
                      }}
                    >
                      <MessageSquare size={16} className="text-accent" />
                      <span>Mis Reseñas Publicadas</span>
                    </button>

                    <div className="dropdown-divider"></div>

                    <button
                      className="dropdown-item dropdown-item-danger"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={16} />
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="auth-buttons-group">
              <button
                onClick={() => openAuth('login')}
                className="btn-primary"
              >
                <User size={16} />
                <span>Entrar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sub-bar / Categories */}
      <nav className="nav-categories-bar">
        <div className="categories-scroll">
          <button
            className={`cat-pill ${activeCategory === 'trending' ? 'active' : ''}`}
            onClick={() => onSelectCategory('trending')}
          >
            🔥 Tendencias
          </button>
          <button
            className={`cat-pill ${activeCategory === 'popular' ? 'active' : ''}`}
            onClick={() => onSelectCategory('popular')}
          >
            ⭐ Populares
          </button>
          <button
            className={`cat-pill ${activeCategory === 'top_rated' ? 'active' : ''}`}
            onClick={() => onSelectCategory('top_rated')}
          >
            🏆 Mejor Valoradas
          </button>
          <button
            className={`cat-pill ${activeCategory === 'upcoming' ? 'active' : ''}`}
            onClick={() => onSelectCategory('upcoming')}
          >
            📅 Próximos Estrenos
          </button>
          <button
            className={`cat-pill ${activeCategory === 'community' || activeCategory === 'my_reviews' ? 'active' : ''}`}
            onClick={() => onSelectCategory('community')}
          >
            💬 Reseñas Comunidad
          </button>
          <button
            className={`cat-pill ${activeCategory === 'favorites' ? 'active' : ''}`}
            onClick={() => onSelectCategory('favorites')}
          >
            ❤️ Favoritos {favorites.length > 0 ? `(${favorites.length})` : ''}
          </button>
        </div>
      </nav>
    </header>
  );
}
