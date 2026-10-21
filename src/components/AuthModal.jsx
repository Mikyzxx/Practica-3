import React, { useState } from 'react';
import { X, User, Mail, Lock, Sparkles, Film, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AVATAR_OPTIONS = ['🍿', '🎬', '⭐', '📽️', '🎭', '🕶️', '🚀', '🦊'];

export function AuthModal() {
  const { authModalOpen, authModalMode, openAuth, closeAuth, login, register, demoLogin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🍿');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!authModalOpen) return null;

  const isLogin = authModalMode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMessage(res.error || 'Credenciales inválidas.');
      }
    } else {
      const res = await register({ name, email, password, avatar, bio });
      if (!res.success) {
        setErrorMessage(res.error || 'Error al crear la cuenta.');
      }
    }
    setLoading(false);
  };

  const handleDemoClick = async () => {
    setLoading(true);
    await demoLogin();
    setLoading(false);
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      closeAuth();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container auth-modal-container">
        <button className="modal-close-float" onClick={closeAuth} title="Cerrar">
          <X size={18} />
        </button>

        <div className="auth-modal-header">
          <div className="auth-brand-icon">
            <Film size={26} />
          </div>
          <h2>{isLogin ? 'Iniciar Sesión en CineCrítica' : 'Crea tu Cuenta de Crítico'}</h2>
          <p>
            {isLogin
              ? 'Accede para calificar películas, compartir reseñas y guardar favoritos.'
              : 'Únete a nuestra comunidad de aficionados al cine y debate con otros cinéfilos.'}
          </p>
        </div>

        {/* Quick Demo Access Bar */}
        <div className="auth-demo-banner">
          <div className="auth-demo-info">
            <Sparkles size={16} className="sparkle-gold" />
            <div>
              <strong>¿Solo quieres probar la app?</strong>
              <p>Inicia sesión al instante con la cuenta de demostración.</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-demo-action"
            onClick={handleDemoClick}
            disabled={loading}
          >
            Acceso Rápido Demo
          </button>
        </div>

        {/* Tab Selector */}
        <div className="auth-tabs-row">
          <button
            className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => { setErrorMessage(''); openAuth('login'); }}
          >
            Iniciar Sesión
          </button>
          <button
            className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => { setErrorMessage(''); openAuth('register'); }}
          >
            Registrarse
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="auth-error-banner">
            <span>⚠️ {errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form-body">
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Nombre o Alias</label>
                <div className="input-with-icon">
                  <User size={16} />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Roberto Morales"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Elige tu Avatar Cinéfilo</label>
                <div className="avatar-picker-grid">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      className={`avatar-option-btn ${avatar === av ? 'active' : ''}`}
                      onClick={() => setAvatar(av)}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Correo Electrónico</label>
            <div className="input-with-icon">
              <Mail size={16} />
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-with-icon">
              <Lock size={16} />
              <input
                type="password"
                required
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label>Biografía breve (opcional)</label>
              <input
                type="text"
                placeholder="Ej. Amante de Nolan, Tarantino y el cine clásico."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="input-plain"
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Procesando...' : isLogin ? 'Entrar a CineCrítica' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="auth-footer-help">
          {isLogin ? (
            <p>
              ¿Aún no tienes cuenta?{' '}
              <button
                type="button"
                className="text-link-btn"
                onClick={() => { setErrorMessage(''); openAuth('register'); }}
              >
                Regístrate aquí gratis
              </button>
            </p>
          ) : (
            <p>
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                className="text-link-btn"
                onClick={() => { setErrorMessage(''); openAuth('login'); }}
              >
                Inicia sesión aquí
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
