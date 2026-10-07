const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'virtux_cyber_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// ════════════════ AUTH MIDDLEWARE ════════════════
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Admin access required' });
    }
  });
}

// ════════════════ AUTH ROUTES ════════════════
// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, phone, role)
      VALUES (?, ?, ?, ?, 'user')
    `);
    const result = stmt.run(name.trim(), email.toLowerCase().trim(), hashedPassword, phone ? phone.trim() : null);

    const newUser = { id: result.lastInsertRowid, name: name.trim(), email: email.toLowerCase().trim(), role: 'user', phone: phone || '' };
    const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Account registered successfully', user: newUser, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const userData = { id: user.id, name: user.name, email: user.email, role: user.role, phone: user.phone || '' };
    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', user: userData, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get Current User Profile + User Bookings
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? OR phone = ? ORDER BY id DESC').all(user.id, user.phone || '');
    const myFeedback = db.prepare('SELECT * FROM feedback WHERE user_id = ? OR email = ? ORDER BY id DESC').all(user.id, user.email);

    res.json({ user, bookings, feedback: myFeedback });
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ error: 'Could not fetch profile' });
  }
});

// ════════════════ FEEDBACK ROUTES ════════════════
// Public: Submit Feedback
app.post('/api/feedback', (req, res) => {
  try {
    const { name, email, rating, service, comment } = req.body;
    if (!name || !comment) {
      return res.status(400).json({ error: 'Name and comment are required' });
    }

    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (e) { /* ignore optional token */ }
    }

    const stmt = db.prepare(`
      INSERT INTO feedback (user_id, name, email, rating, service, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      userId,
      name.trim(),
      email ? email.trim() : null,
      parseInt(rating) || 5,
      service || 'General Gaming',
      comment.trim()
    );

    res.status(201).json({ message: 'Feedback submitted successfully!', id: result.lastInsertRowid });
  } catch (err) {
    console.error('Feedback submit error:', err);
    res.status(500).json({ error: 'Could not submit feedback' });
  }
});

// Public: Get Recent or Featured Feedback
app.get('/api/feedback', (req, res) => {
  try {
    const list = db.prepare(`
      SELECT id, name, rating, service, comment, is_featured, created_at 
      FROM feedback 
      ORDER BY is_featured DESC, id DESC 
      LIMIT 20
    `).all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch reviews' });
  }
});

// ════════════════ BOOKING / RESERVATION ROUTES ════════════════
// Public: Submit Reservation Request
app.post('/api/bookings', (req, res) => {
  try {
    const { name, phone, service, booking_date, booking_time, duration, guests, notes } = req.body;
    if (!name || !phone || !service) {
      return res.status(400).json({ error: 'Name, phone, and service are required' });
    }

    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (e) { /* ignore */ }
    }

    const stmt = db.prepare(`
      INSERT INTO bookings (user_id, name, phone, service, booking_date, booking_time, duration, guests, notes, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `);
    const result = stmt.run(
      userId,
      name.trim(),
      phone.trim(),
      service.trim(),
      booking_date || null,
      booking_time || null,
      duration || null,
      parseInt(guests) || 1,
      notes ? notes.trim() : null
    );

    res.status(201).json({
      message: 'Reservation request submitted! Our crew will contact you shortly.',
      id: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Could not submit reservation' });
  }
});

// ════════════════ ANNOUNCEMENTS & BANNERS ════════════════
// Public: Get Active Announcements
app.get('/api/announcements', (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM announcements WHERE is_active = 1 ORDER BY id DESC').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Could not load announcements' });
  }
});

// ════════════════ CAFE ITEMS ════════════════
// Public: Get Cafe Menu & Combos
app.get('/api/cafe', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM cafe_items WHERE is_available = 1 ORDER BY category ASC, id ASC').all();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Could not load cafe menu' });
  }
});

// ════════════════ ADMIN DASHBOARD ROUTES ════════════════
// Admin Stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get('user').count;
    const totalFeedback = db.prepare('SELECT COUNT(*) as count FROM feedback').get().count;
    const pendingBookings = db.prepare('SELECT COUNT(*) as count FROM bookings WHERE status = ?').get('pending').count;
    const totalBookings = db.prepare('SELECT COUNT(*) as count FROM bookings').get().count;
    const totalCafeItems = db.prepare('SELECT COUNT(*) as count FROM cafe_items').get().count;

    res.json({
      totalUsers,
      totalFeedback,
      pendingBookings,
      totalBookings,
      totalCafeItems
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not load stats' });
  }
});

// Admin: Feedback Management
app.get('/api/admin/feedback', requireAdmin, (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM feedback ORDER BY id DESC').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback list' });
  }
});

app.put('/api/admin/feedback/:id/feature', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const current = db.prepare('SELECT is_featured FROM feedback WHERE id = ?').get(id);
    if (!current) return res.status(404).json({ error: 'Feedback not found' });

    const newStatus = current.is_featured ? 0 : 1;
    db.prepare('UPDATE feedback SET is_featured = ? WHERE id = ?').run(newStatus, id);
    res.json({ message: 'Featured status toggled', is_featured: newStatus });
  } catch (err) {
    res.status(500).json({ error: 'Could not update feedback' });
  }
});

app.delete('/api/admin/feedback/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM feedback WHERE id = ?').run(id);
    res.json({ message: 'Feedback entry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete feedback' });
  }
});

// Admin: Bookings Management
app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM bookings ORDER BY id DESC').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.put('/api/admin/bookings/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
    res.json({ message: 'Booking status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Could not update booking status' });
  }
});

app.delete('/api/admin/bookings/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM bookings WHERE id = ?').run(id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete booking' });
  }
});

// Admin: Announcements Management
app.get('/api/admin/announcements', requireAdmin, (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM announcements ORDER BY id DESC').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch announcements' });
  }
});

app.post('/api/admin/announcements', requireAdmin, (req, res) => {
  try {
    const { title, badge, message, link, is_active } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }
    const stmt = db.prepare(`
      INSERT INTO announcements (title, badge, message, link, is_active)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(title, badge || '🔥 NEW', message, link || null, is_active !== undefined ? is_active : 1);
    res.status(201).json({ message: 'Announcement created!', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: 'Could not create announcement' });
  }
});

app.put('/api/admin/announcements/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { title, badge, message, link, is_active } = req.body;
    db.prepare(`
      UPDATE announcements
      SET title = ?, badge = ?, message = ?, link = ?, is_active = ?
      WHERE id = ?
    `).run(title, badge, message, link, is_active ? 1 : 0, id);
    res.json({ message: 'Announcement updated!' });
  } catch (err) {
    res.status(500).json({ error: 'Could not update announcement' });
  }
});

app.delete('/api/admin/announcements/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM announcements WHERE id = ?').run(id);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete announcement' });
  }
});

// Admin: Cafe Menu Management
app.get('/api/admin/cafe', requireAdmin, (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM cafe_items ORDER BY category ASC, id DESC').all();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch cafe items' });
  }
});

app.post('/api/admin/cafe', requireAdmin, (req, res) => {
  try {
    const { category, name, description, price, original_price, badge, is_available } = req.body;
    if (!category || !name || price === undefined) {
      return res.status(400).json({ error: 'Category, name, and price are required' });
    }
    const stmt = db.prepare(`
      INSERT INTO cafe_items (category, name, description, price, original_price, badge, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      category,
      name,
      description || null,
      parseFloat(price),
      original_price ? parseFloat(original_price) : null,
      badge || null,
      is_available !== undefined ? is_available : 1
    );
    res.status(201).json({ message: 'Menu item added successfully!', id: result.lastInsertRowid });
  } catch (err) {
    res.status(500).json({ error: 'Could not add cafe item' });
  }
});

app.put('/api/admin/cafe/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { category, name, description, price, original_price, badge, is_available } = req.body;
    db.prepare(`
      UPDATE cafe_items
      SET category = ?, name = ?, description = ?, price = ?, original_price = ?, badge = ?, is_available = ?
      WHERE id = ?
    `).run(
      category,
      name,
      description,
      parseFloat(price),
      original_price ? parseFloat(original_price) : null,
      badge,
      is_available ? 1 : 0,
      id
    );
    res.json({ message: 'Menu item updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Could not update cafe item' });
  }
});

app.delete('/api/admin/cafe/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM cafe_items WHERE id = ?').run(id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete cafe item' });
  }
});

// Admin: Users list
app.get('/api/admin/users', requireAdmin, (req, res) => {
  try {
    const users = db.prepare('SELECT id, name, email, phone, role, created_at FROM users ORDER BY id DESC').all();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch users' });
  }
});

// Fallback to index.html for unknown routes if needed
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Virtux Gaming Hub Server running on: http://localhost:${PORT}`);
    console.log(`⚡ Admin Panel: http://localhost:${PORT}/admin.html`);
    console.log(`👤 User Login:  http://localhost:${PORT}/login.html`);
    console.log(`🔑 Default Admin Credentials: admin@virtux.com / admin123`);
    console.log(`==================================================\n`);
  });
}

module.exports = app;

