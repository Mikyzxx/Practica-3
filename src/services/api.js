const API_BASE = '/api';

// Token helpers
export function getAuthToken() {
  return localStorage.getItem('cinecritica_token') || null;
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('cinecritica_token', token);
  } else {
    localStorage.removeItem('cinecritica_token');
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('cinecritica_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user) {
  if (user) {
    localStorage.setItem('cinecritica_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('cinecritica_user');
  }
}

// Request helper
async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Error en la solicitud (${response.status})`);
  }
  return data;
}

// Auth API
export async function loginUser(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
  setAuthToken(data.token);
  setStoredUser(data.user);
  return data.user;
}

export async function registerUser({ name, email, password, avatar, bio }) {
  const data = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, avatar, bio })
  });
  setAuthToken(data.token);
  setStoredUser(data.user);
  return data.user;
}

export async function quickDemoLogin() {
  const data = await request('/auth/demo-login', {
    method: 'POST'
  });
  setAuthToken(data.token);
  setStoredUser(data.user);
  return data.user;
}

export async function fetchCurrentUser() {
  try {
    const user = await request('/auth/me');
    setStoredUser(user);
    return user;
  } catch (err) {
    setAuthToken(null);
    setStoredUser(null);
    return null;
  }
}

export function logoutUser() {
  setAuthToken(null);
  setStoredUser(null);
}

// Reviews API
export async function fetchMovieReviews(movieId) {
  return request(`/reviews?movieId=${movieId}`);
}

export async function fetchRecentReviews(limit = 6) {
  return request(`/reviews?limit=${limit}`);
}

export async function submitMovieReview(reviewData) {
  return request('/reviews', {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
}

export async function deleteMovieReview(reviewId) {
  return request(`/reviews/${reviewId}`, {
    method: 'DELETE'
  });
}

export async function toggleReviewLike(reviewId) {
  return request(`/reviews/${reviewId}/like`, {
    method: 'POST'
  });
}

export async function fetchCommunityStats() {
  return request('/community/stats');
}
