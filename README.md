# 🎬 CineCrítica - Práctica 3: Reseñas de Películas con TMDB API

Plataforma web moderna para explorar películas, consultar detalles y tráilers mediante la API oficial de **The Movie Database (TMDB)**, con autenticación de usuarios y un sistema interactivo de reseñas y calificaciones por película.

---

## 🌟 Características Principales

1. **Catálogo de Películas con TMDB**:
   - Categorías: **Tendencias**, **Populares**, **Mejor Valoradas**, **Próximos Estrenos** y **Reseñas de la Comunidad**.
   - Búsqueda en tiempo real de títulos, directores y géneros.
   - Filtro por géneros cinematográficos (Acción, Ciencia Ficción, Drama, Comedia, Animación, etc.).
   - Modos duales: Conexión en vivo con TMDB API + Catálogo offline de demostración de alta definición con fallbacks garantizados.

2. **Modal Completo por Película (Requerimiento Clave)**:
   - Fondo panorámico en alta resolución o tráiler oficial de YouTube incrustado.
   - Puntuación oficial de TMDB vs. Puntuación promedio de la comunidad.
   - Ficha técnica: Director, año de estreno, duración, sinopsis y galería del reparto principal con fotos.
   - Sección de opiniones con filtro de spoilers ("Haz clic para revelar").
   - Votos útiles ("Like") en reseñas de otros usuarios.

3. **Autenticación y Login para Reseñas (Requerimiento Clave)**:
   - Registro de nuevas cuentas con selección de avatar temático (🍿, 🎬, ⭐, 📽️, 🎭, 🕶️, 🚀, 🦊) y biografía.
   - Inicio de sesión seguro con JWT y contraseñas cifradas con bcrypt.
   - **Botón de Acceso Rápido Demo**: Permite ingresar con 1 solo clic como crítico destacado (*Alex Rivera*) para probar inmediatamente sin tener que rellenar formularios.
   - Formulario de reseña interactivo con selector de 10 estrellas animadas, título, análisis y casilla de advertencia de spoilers.

4. **Backend ligero con Node.js / Express**:
   - Servidor API en `http://localhost:5000` con almacenamiento local persistente en `server/data/database.json`.
   - Endpoints de autenticación (`/api/auth/login`, `/api/auth/register`, `/api/auth/demo-login`).
   - Endpoints de reseñas (`/api/reviews`, `/api/reviews/:id`, `/api/reviews/:id/like`).
   - Endpoints de estadísticas de la comunidad (`/api/community/stats`).

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Iniciar Frontend y Backend simultáneamente
```bash
npm run dev
```
Esto iniciará:
- **Frontend (Vite + React)** en: `http://localhost:5173`
- **Backend (Express)** en: `http://localhost:5000`

---

## 🔑 Configuración de la API de TMDB

La aplicación funciona inmediatamente gracias a su catálogo de demostración sin necesidad de clave. Sin embargo, para activar el modo en vivo con millones de películas:

1. Haz clic en el botón **"Modo Demo"** en la barra superior (icono de llave).
2. Pega tu **Clave de API (v3)** o **Token de acceso (v4)** obtenido gratuitamente en [themoviedb.org](https://www.themoviedb.org/settings/api).
3. Haz clic en **"Verificar y Guardar"**. La clave se valida contra los servidores de TMDB y se guarda en tu navegador.

---

## 👥 Credenciales de Prueba (Cuenta Demo)

- **Usuario Demo pre-cargado**:
  - **Email**: `demo@cinecritica.com`
  - **Contraseña**: `password123`
  - **Nombre**: Alex Rivera (🍿 Crítico Destacado)
- O simplemente presiona el botón **"Acceso Rápido Demo"** en la barra de navegación o en el modal de login.

---

## 📁 Estructura del Proyecto

```
├── index.html                 # Plantilla HTML con fuentes Outfit y Plus Jakarta Sans
├── package.json               # Dependencias y scripts
├── vite.config.js             # Configuración de Vite con proxy /api -> localhost:5000
├── server/
│   ├── index.js               # Servidor Express con endpoints de Auth y Reseñas
│   └── data/
│       └── database.json      # Base de datos JSON con usuarios y reseñas iniciales
└── src/
    ├── main.jsx               # Punto de entrada de React
    ├── App.jsx                # Componente principal y layout
    ├── index.css              # Variables y sistema de diseño Glassmorphism
    ├── App.css                # Estilos detallados de componentes
    ├── context/
    │   └── AuthContext.jsx    # Manejo global de sesión, login, registro y toasts
    ├── services/
    │   ├── api.js             # Cliente HTTP para el backend Express
    │   └── tmdb.js            # Servicio de integración con la API de TMDB y fallback
    ├── data/
    │   └── mockMovies.js      # Catálogo de demostración curado en alta definición
    └── components/
        ├── Navbar.jsx         # Barra de navegación, búsqueda y estado de TMDB
        ├── HeroBanner.jsx     # Billboard destacado con póster panorámico
        ├── MovieCard.jsx      # Tarjeta individual con efectos de hover
        ├── MovieGrid.jsx      # Cuadrícula con filtros de géneros y ordenación
        ├── MovieModal.jsx     # Modal de película con tráiler y sistema de reseñas
        ├── AuthModal.jsx      # Modal de inicio de sesión y registro
        ├── TmdbKeyModal.jsx   # Modal de configuración de clave TMDB
        └── CommunityFeed.jsx  # Pestaña con las últimas reseñas de la comunidad
```
