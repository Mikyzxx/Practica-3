import React, { useState } from 'react';
import { X, Key, ExternalLink, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { getStoredTmdbKey, setStoredTmdbKey, testApiKey } from '../services/tmdb';
import { useAuth } from '../context/AuthContext';

export function TmdbKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const { showToast } = useAuth();
  const [apiKey, setApiKey] = useState(getStoredTmdbKey());
  const [testing, setTesting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text }

  if (!isOpen) return null;

  const handleTestAndSave = async (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setStatusMessage({ type: 'error', text: 'Por favor ingresa una clave o usa el modo de demostración.' });
      return;
    }

    setTesting(true);
    setStatusMessage(null);

    const result = await testApiKey(apiKey.trim());

    if (result.success) {
      setStoredTmdbKey(apiKey.trim());
      setStatusMessage({
        type: 'success',
        text: '¡Conexión exitosa con TMDB! La clave es válida y se ha guardado.'
      });
      showToast('¡Clave TMDB conectada con éxito!');
      if (onKeyUpdated) onKeyUpdated(apiKey.trim());
    } else {
      setStatusMessage({
        type: 'error',
        text: `Error de verificación TMDB: ${result.error || 'Clave no válida. Verifica que esté copiada correctamente.'}`
      });
    }

    setTesting(false);
  };

  const handleResetToDemo = () => {
    setStoredTmdbKey('');
    setApiKey('');
    setStatusMessage({
      type: 'success',
      text: 'Modo demo restablecido. Utilizando catálogo offline curado.'
    });
    showToast('Modo de demostración activado.');
    if (onKeyUpdated) onKeyUpdated('');
  };

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('modal-backdrop')) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-container tmdb-modal-container">
        <button className="modal-close-float" onClick={onClose} title="Cerrar">
          <X size={18} />
        </button>

        <div className="tmdb-modal-header">
          <div className="tmdb-modal-icon">
            <Key size={26} />
          </div>
          <h2>Configuración de TMDB API</h2>
          <p>
            Conecta tu cuenta oficial de The Movie Database para acceder a millones de películas, pósters en alta resolución y calificaciones en tiempo real.
          </p>
        </div>

        {/* Steps Guide */}
        <div className="tmdb-guide-card">
          <h4>¿Cómo obtener tu clave gratuita de TMDB?</h4>
          <ol>
            <li>
              Crea una cuenta gratuita en{' '}
              <a
                href="https://www.themoviedb.org/signup"
                target="_blank"
                rel="noreferrer"
                className="external-link"
              >
                themoviedb.org <ExternalLink size={12} />
              </a>.
            </li>
            <li>Ve a <strong>Ajustes &gt; API</strong> y solicita una clave de desarrollador.</li>
            <li>Copia tu <strong>Clave de API (v3)</strong> o <strong>Token de lectura (v4)</strong> y pégala abajo.</li>
          </ol>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div className={`status-feedback-box feedback-${statusMessage.type}`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleTestAndSave} className="tmdb-form">
          <div className="form-group">
            <label>Clave de API o Token de Lectura de TMDB</label>
            <div className="input-with-icon">
              <Key size={16} />
              <input
                type="text"
                placeholder="Pega aquí tu clave v3 o token v4..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>
            <span className="field-hint">
              Se almacena de forma segura en el almacenamiento local de tu navegador.
            </span>
          </div>

          <div className="tmdb-form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleResetToDemo}
            >
              <Sparkles size={15} />
              Usar Modo Demo
            </button>

            <button
              type="submit"
              className="btn-primary"
              disabled={testing}
            >
              {testing ? (
                <>
                  <RefreshCw size={15} className="spin-icon" />
                  Verificando...
                </>
              ) : (
                'Verificar y Guardar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
