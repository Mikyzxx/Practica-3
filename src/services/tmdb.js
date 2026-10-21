import { MOCK_MOVIES, MOCK_GENRES } from '../data/mockMovies';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// Key management in localStorage
export function getStoredTmdbKey() {
  return localStorage.getItem('tmdb_api_key') || '';
}

export function setStoredTmdbKey(key) {
  if (key) {
    localStorage.setItem('tmdb_api_key', key.trim());
  } else {
    localStorage.removeItem('tmdb_api_key');
  }
}

// Build request headers or params based on token type (v3 API key vs v4 Bearer token)
function getAuthOptions() {
  const key = getStoredTmdbKey();
  if (!key) return null;

  // If token is very long or starts with 'ey', it is likely a v4 JWT Bearer Token
  if (key.length > 50 || key.startsWith('eyJ')) {
    return {
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json;charset=utf-8'
      },
      params: ''
    };
  }

  // Otherwise it's a standard v3 api_key
  return {
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    params: `api_key=${encodeURIComponent(key)}`
  };
}

export function getImageUrl(path, size = 'w500') {
  if (!path) {
    return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';
  }
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

// Test key validity
export async function testApiKey(key) {
  try {
    const isBearer = key.length > 50 || key.startsWith('eyJ');
    const url = isBearer
      ? `${TMDB_BASE_URL}/authentication`
      : `${TMDB_BASE_URL}/movie/popular?api_key=${encodeURIComponent(key.trim())}&page=1`;

    const options = isBearer
      ? { headers: { Authorization: `Bearer ${key.trim()}` } }
      : {};

    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`Código de estado TMDB: ${res.status}`);
    }
    const data = await res.json();
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// Fetch helper with fallback
async function tmdbFetch(endpoint, queryParams = {}) {
  const auth = getAuthOptions();

  if (!auth) {
    return { isDemo: true, data: null };
  }

  const searchParams = new URLSearchParams(queryParams);
  if (auth.params) {
    const [k, v] = auth.params.split('=');
    searchParams.set(k, v);
  }
  searchParams.set('language', 'es-ES');

  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, { headers: auth.headers });
    if (!response.ok) {
      console.warn(`TMDB request failed with status ${response.status}`);
      return { isDemo: true, data: null };
    }
    const data = await response.json();
    return { isDemo: false, data };
  } catch (error) {
    console.error('TMDB Network Error:', error);
    return { isDemo: true, data: null };
  }
}

// 1. Trending movies
export async function getTrendingMovies(timeWindow = 'week') {
  const res = await tmdbFetch(`/trending/movie/${timeWindow}`);
  if (res.data && res.data.results) {
    return { movies: res.data.results, isDemo: false };
  }
  return { movies: MOCK_MOVIES, isDemo: true };
}

// 2. Popular movies
export async function getPopularMovies(page = 1) {
  const res = await tmdbFetch('/movie/popular', { page });
  if (res.data && res.data.results) {
    return { movies: res.data.results, isDemo: false };
  }
  return { movies: MOCK_MOVIES, isDemo: true };
}

// 3. Top Rated movies
export async function getTopRatedMovies(page = 1) {
  const res = await tmdbFetch('/movie/top_rated', { page });
  if (res.data && res.data.results) {
    return { movies: res.data.results, isDemo: false };
  }
  const sorted = [...MOCK_MOVIES].sort((a, b) => b.vote_average - a.vote_average);
  return { movies: sorted, isDemo: true };
}

// 4. Upcoming movies
export async function getUpcomingMovies(page = 1) {
  const res = await tmdbFetch('/movie/upcoming', { page });
  if (res.data && res.data.results) {
    return { movies: res.data.results, isDemo: false };
  }
  return { movies: MOCK_MOVIES.slice(0, 6), isDemo: true };
}

// 5. Search movies
export async function searchMovies(query, page = 1) {
  if (!query || !query.trim()) {
    return getPopularMovies();
  }

  const res = await tmdbFetch('/search/movie', { query: query.trim(), page });
  if (res.data && res.data.results) {
    return { movies: res.data.results, isDemo: false };
  }

  // Local search on mock movies
  const q = query.toLowerCase();
  const filtered = MOCK_MOVIES.filter(m =>
    m.title.toLowerCase().includes(q) ||
    (m.original_title && m.original_title.toLowerCase().includes(q)) ||
    (m.overview && m.overview.toLowerCase().includes(q)) ||
    (m.director && m.director.toLowerCase().includes(q))
  );

  return { movies: filtered, isDemo: true };
}

// 6. Detailed movie info (with credits & videos)
export async function getMovieDetails(movieId) {
  const res = await tmdbFetch(`/movie/${movieId}`, {
    append_to_response: 'credits,videos,similar'
  });

  if (res.data) {
    const movie = res.data;
    const director = movie.credits?.crew?.find(c => c.job === 'Director')?.name || 'Director no especificado';
    const trailer = movie.videos?.results?.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));

    return {
      movie: {
        ...movie,
        director,
        trailer_key: trailer ? trailer.key : null,
        cast: movie.credits?.cast?.slice(0, 8) || []
      },
      isDemo: false
    };
  }

  // Fallback to mock movie
  const found = MOCK_MOVIES.find(m => String(m.id) === String(movieId));
  if (found) {
    return { movie: found, isDemo: true };
  }

  // Generic fallback if not in mock
  return {
    movie: {
      id: movieId,
      title: 'Película de Catálogo',
      overview: 'Información detallada no disponible en modo demostración para este título.',
      vote_average: 7.5,
      runtime: 120,
      release_date: '2024-01-01',
      genres: [{ id: 28, name: 'Cine' }],
      director: 'Cineasta',
      cast: []
    },
    isDemo: true
  };
}

export { MOCK_GENRES };
