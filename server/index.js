import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'cinecritica_secret_key_2026';
const DB_PATH = path.join(__dirname, 'data', 'database.json');

app.use(cors());
app.use(express.json());

// Helper to read database
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initialData = { users: [], reviews: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], reviews: [] };
  }
}

// Helper to write database safely
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing database:', error);
  }
}

// Auth Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado. Inicia sesión.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
    req.user = user;
    next();
  });
}

// --- AUTH ENDPOINTS ---

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, avatar, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres.' });
    }

    const db = readDB();
    const existing = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'Ya existe una cuenta con este correo electrónico.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      id: `u-${Date.now()}`,
      name: name.trim(),
      username: name.toLowerCase().replace(/[^a-z0-9]/g, '_') + Math.floor(100 + Math.random() * 900),
      email: email.toLowerCase().trim(),
      passwordHash,
      avatar: avatar || '🍿',
      badge: 'Cineasta Novato',
      bio: bio || 'Amante del séptimo arte.',
      createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDB(db);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, name: newUser.name, avatar: newUser.avatar },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userSafe } = newUser;
    return res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Error interno del servidor al registrarse.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Por favor ingresa correo y contraseña.' });
    }

    const db = readDB();
    const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas. Verifica tu correo.' });
    }

    // Check password
    const valid = await bcrypt.compare(password, user.passwordHash).catch(() => false);

    if (!valid) {
      return res.status(400).json({ error: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { passwordHash: _, ...userSafe } = user;
    return res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Error interno en el inicio de sesión.' });
  }
});

// Current User Profile
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'Usuario no encontrado.' });
  }
  const { passwordHash: _, ...userSafe } = user;
  return res.json(userSafe);
});

// --- REVIEWS ENDPOINTS ---

// Get reviews (all, or filtered by movieId)
app.get('/api/reviews', (req, res) => {
  const { movieId, limit } = req.query;
  const db = readDB();

  let filtered = [...db.reviews];
  if (movieId) {
    filtered = filtered.filter(r => String(r.movieId) === String(movieId));
  }

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (limit) {
    filtered = filtered.slice(0, parseInt(limit, 10));
  }

  // Calculate average rating if movieId is passed
  let averageRating = null;
  if (movieId && filtered.length > 0) {
    const sum = filtered.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    averageRating = (sum / filtered.length).toFixed(1);
  }

  return res.json({
    reviews: filtered,
    totalCount: filtered.length,
    averageRating
  });
});

// Add a review
app.post('/api/reviews', authenticateToken, (req, res) => {
  try {
    const {
      movieId,
      movieTitle,
      moviePoster,
      movieYear,
      rating,
      headline,
      content,
      hasSpoilers
    } = req.body;

    if (!movieId || !movieTitle || !content || rating === undefined) {
      return res.status(400).json({ error: 'movieId, movieTitle, calificación y texto de la reseña son obligatorios.' });
    }

    const numericRating = Math.min(10, Math.max(1, Number(rating)));

    const db = readDB();
    const user = db.users.find(u => u.id === req.user.id) || {
      id: req.user.id,
      name: req.user.name || 'Crítico Anónimo',
      avatar: req.user.avatar || '🍿'
    };

    const newReview = {
      id: `rev-${Date.now()}`,
      movieId: Number(movieId),
      movieTitle: movieTitle.trim(),
      moviePoster: moviePoster || '',
      movieYear: movieYear || '',
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      rating: numericRating,
      headline: (headline || '').trim(),
      content: content.trim(),
      hasSpoilers: Boolean(hasSpoilers),
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString()
    };

    db.reviews.unshift(newReview);
    writeDB(db);

    return res.status(201).json({
      message: '¡Reseña publicada con éxito!',
      review: newReview
    });
  } catch (err) {
    console.error('Error creating review:', err);
    return res.status(500).json({ error: 'Error al publicar la reseña.' });
  }
});

// Update review (own review)
app.put('/api/reviews/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { rating, headline, content, hasSpoilers } = req.body;
    const db = readDB();

    const review = db.reviews.find(r => r.id === id);
    if (!review) {
      return res.status(404).json({ error: 'Reseña no encontrada.' });
    }

    if (review.userId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para editar esta reseña.' });
    }

    if (rating !== undefined) {
      review.rating = Math.min(10, Math.max(1, Number(rating)));
    }
    if (headline !== undefined) {
      review.headline = headline.trim();
    }
    if (content !== undefined) {
      review.content = content.trim();
    }
    if (hasSpoilers !== undefined) {
      review.hasSpoilers = Boolean(hasSpoilers);
    }
    review.updatedAt = new Date().toISOString();

    writeDB(db);

    return res.json({
      message: 'Reseña actualizada exitosamente.',
      review
    });
  } catch (err) {
    console.error('Error updating review:', err);
    return res.status(500).json({ error: 'Error al actualizar la reseña.' });
  }
});

// Delete review (own review)
app.delete('/api/reviews/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const index = db.reviews.findIndex(r => r.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Reseña no encontrada.' });
  }

  if (db.reviews[index].userId !== req.user.id) {
    return res.status(403).json({ error: 'No tienes permiso para eliminar esta reseña.' });
  }

  const deleted = db.reviews.splice(index, 1);
  writeDB(db);

  return res.json({ message: 'Reseña eliminada correctamente.', review: deleted[0] });
});

// Like / helpful toggle on a review
app.post('/api/reviews/:id/like', authenticateToken, (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const review = db.reviews.find(r => r.id === id);
  if (!review) {
    return res.status(404).json({ error: 'Reseña no encontrada.' });
  }

  if (!Array.isArray(review.likedBy)) {
    review.likedBy = [];
  }

  const alreadyLiked = review.likedBy.includes(req.user.id);
  if (alreadyLiked) {
    review.likedBy = review.likedBy.filter(uid => uid !== req.user.id);
    review.likes = Math.max(0, (review.likes || 1) - 1);
  } else {
    review.likedBy.push(req.user.id);
    review.likes = (review.likes || 0) + 1;
  }

  writeDB(db);

  return res.json({
    message: alreadyLiked ? 'Voto retirado' : '¡Voto útil registrado!',
    likes: review.likes,
    liked: !alreadyLiked
  });
});

// General community stats
app.get('/api/community/stats', (req, res) => {
  const db = readDB();
  const totalReviews = db.reviews.length;
  const uniqueMovies = new Set(db.reviews.map(r => r.movieId)).size;
  const totalUsers = db.users.length;

  return res.json({
    totalReviews,
    uniqueMovies,
    totalUsers
  });
});

app.listen(PORT, () => {
  console.log(`🎬 CineCrítica Backend Server running on http://localhost:${PORT}`);
});
