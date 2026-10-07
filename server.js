const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'virtux_cyber_secret_key_2026';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ifzhczvuenwuvpzvvwph.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_UddVD3JaGmkYolBaDqQuvQ_X-OzaQhg';

let supabase = null;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  console.warn('Supabase client init note:', e.message);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
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
function formatMembershipId(id) {
  return 'VIRTUXGAMING' + String(id).padStart(9, '0');
}

// Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const tempId = ((db.prepare('SELECT COUNT(*) as count FROM users').get() || {}).count || 0) + 1;
    const initialMemId = formatMembershipId(tempId);

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, phone, role, membership_id, stamps_count)
      VALUES (?, ?, ?, ?, 'user', ?, 0)
    `);
    const result = stmt.run(name.trim(), cleanEmail, hashedPassword, phone ? phone.trim() : null, initialMemId, 0);

    const actualId = result.lastInsertRowid || tempId;
    const finalMemId = formatMembershipId(actualId);
    try {
      db.prepare('UPDATE users SET membership_id = ? WHERE id = ?').run(finalMemId, actualId);
    } catch (e) {}

    const newUser = {
      id: actualId,
      name: name.trim(),
      email: cleanEmail,
      role: 'user',
      phone: phone || '',
      membership_id: finalMemId,
      stamps_count: 0
    };
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

    const cleanEmail = email.toLowerCase().trim();
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    let membership_id = user.membership_id;
    if (!membership_id) {
      membership_id = formatMembershipId(user.id);
      try {
        db.prepare('UPDATE users SET membership_id = ? WHERE id = ?').run(membership_id, user.id);
      } catch (e) {}
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      membership_id,
      stamps_count: user.stamps_count || 0
    };
    const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', user: userData, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Google Authentication (Sign In & Sign Up)
app.post('/api/auth/google', (req, res) => {
  try {
    const { email, name, phone, googleId } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Google account email is required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    let user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);

    if (user) {
      let membership_id = user.membership_id;
      if (!membership_id) {
        membership_id = formatMembershipId(user.id);
        try {
          db.prepare('UPDATE users SET membership_id = ? WHERE id = ?').run(membership_id, user.id);
        } catch (e) {}
      }

      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        membership_id,
        stamps_count: user.stamps_count || 0
      };
      const token = jwt.sign(userData, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ message: 'Google sign-in successful', user: userData, token });
    }

    // Register new user via Google
    const dummyPassword = bcrypt.hashSync('google_' + (googleId || Date.now()) + Math.random(), 10);
    const tempId = ((db.prepare('SELECT COUNT(*) as count FROM users').get() || {}).count || 0) + 1;
    const initialMemId = formatMembershipId(tempId);

    const result = db.prepare(`
      INSERT INTO users (name, email, password, phone, role, membership_id, stamps_count)
      VALUES (?, ?, ?, ?, 'user', ?, 0)
    `).run(name ? name.trim() : 'Google Gamer', cleanEmail, dummyPassword, phone ? phone.trim() : null, initialMemId, 0);

    const actualId = result.lastInsertRowid || tempId;
    const finalMemId = formatMembershipId(actualId);
    try {
      db.prepare('UPDATE users SET membership_id = ? WHERE id = ?').run(finalMemId, actualId);
    } catch (e) {}

    const newUser = {
      id: actualId,
      name: name ? name.trim() : 'Google Gamer',
      email: cleanEmail,
      role: 'user',
      phone: phone || '',
      membership_id: finalMemId,
      stamps_count: 0
    };
    const token = jwt.sign(newUser, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Google account registered successfully', user: newUser, token });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Server error during Google authentication' });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required' });
    }
    const cleanEmail = email.toLowerCase().trim();

    // Check if user exists in database
    const user = db.prepare('SELECT id, name, email FROM users WHERE email = ?').get(cleanEmail);

    // Also trigger Supabase Auth reset email if Supabase client is available
    if (supabase) {
      try {
        await supabase.auth.resetPasswordForEmail(cleanEmail, {
          redirectTo: `${req.protocol}://${req.get('host')}/login.html`
        });
      } catch (e) {
        console.warn('Supabase resetPassword error:', e.message);
      }
    }

    if (!user) {
      return res.json({ 
        message: 'If an account is associated with this email, recovery instructions have been sent.' 
      });
    }

    res.json({
      message: `Password recovery instructions have been sent to ${cleanEmail}. Check your inbox or contact counter support with your Membership ID.`
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Could not process password recovery request' });
  }
});

// Direct Password Reset
app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    const cleanEmail = email.toLowerCase().trim();
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email address' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, user.id);

    res.json({ message: 'Password has been updated successfully! You can now sign in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Could not reset password' });
  }
});

// Update Profile (Name, Phone, Email)
app.put('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const cleanEmail = email.toLowerCase().trim();
    // Ensure email is not occupied by another user
    const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(cleanEmail, req.user.id);
    if (existing) {
      return res.status(400).json({ error: 'This email is already associated with another account' });
    }

    db.prepare('UPDATE users SET name = ?, phone = ?, email = ? WHERE id = ?')
      .run(name.trim(), phone ? phone.trim() : null, cleanEmail, req.user.id);

    const updated = db.prepare('SELECT id, name, email, phone, role, membership_id, stamps_count, created_at FROM users WHERE id = ?').get(req.user.id);
    if (updated && !updated.membership_id) {
      updated.membership_id = formatMembershipId(updated.id);
    }

    // Refresh JWT with updated details
    const token = jwt.sign({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      phone: updated.phone || '',
      membership_id: updated.membership_id,
      stamps_count: updated.stamps_count || 0
    }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Profile updated successfully!', user: updated, token });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Could not update profile' });
  }
});

// Get Current User Profile + User Bookings + Stamps
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, phone, role, membership_id, stamps_count, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.membership_id) {
      user.membership_id = formatMembershipId(user.id);
      try {
        db.prepare('UPDATE users SET membership_id = ? WHERE id = ?').run(user.membership_id, user.id);
      } catch (e) {}
    }

    const bookings = db.prepare('SELECT * FROM bookings WHERE user_id = ? OR phone = ? ORDER BY id DESC').all(user.id, user.phone || '');
    const myFeedback = db.prepare('SELECT * FROM feedback WHERE user_id = ? OR email = ? ORDER BY id DESC').all(user.id, user.email);
    let stampRequests = [];
    try {
      stampRequests = db.prepare('SELECT * FROM stamp_requests WHERE user_id = ? ORDER BY id DESC').all(user.id);
    } catch (e) {}

    res.json({
      user,
      bookings,
      feedback: myFeedback,
      stamp_requests: stampRequests,
      stamps_count: user.stamps_count || 0
    });
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ error: 'Could not fetch profile' });
  }
});

// ════════════════ LOYALTY STAMPS ROUTES ════════════════
// Customer: Request a Stamp (for store visits / purchases > ₹149)
app.post('/api/stamps/request', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, membership_id, stamps_count FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if ((user.stamps_count || 0) >= 10) {
      return res.status(400).json({ error: 'You have completed all 10 stamps! Show your Membership ID at the counter to claim your surprise reward!' });
    }

    const { bill_amount, bill_notes } = req.body;
    const amount = Number(bill_amount) || 150;
    if (amount < 149) {
      return res.status(400).json({ error: 'Visit purchase must be ₹149 or higher to qualify for a stamp.' });
    }

    const memId = user.membership_id || formatMembershipId(user.id);
    const result = db.prepare(`
      INSERT INTO stamp_requests (user_id, membership_id, user_name, user_email, bill_amount, bill_notes, status)
      VALUES (?, ?, ?, ?, ?, ?, 'pending')
    `).run(user.id, memId, user.name, user.email, amount, bill_notes ? String(bill_notes).trim() : 'Store visit over ₹149');

    res.status(201).json({
      message: 'Stamp request submitted! Once approved by the store manager, your stamp will appear in your envelope.',
      requestId: result.lastInsertRowid
    });
  } catch (err) {
    console.error('Stamp request error:', err);
    res.status(500).json({ error: 'Could not submit stamp request' });
  }
});

// Customer: Get Stamp Envelope Status
app.get('/api/stamps/status', authenticateToken, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, membership_id, stamps_count FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    let requests = [];
    try {
      requests = db.prepare('SELECT * FROM stamp_requests WHERE user_id = ? ORDER BY id DESC').all(user.id);
    } catch (e) {}

    res.json({
      membership_id: user.membership_id || formatMembershipId(user.id),
      stamps_count: user.stamps_count || 0,
      max_stamps: 10,
      surprise_unlocked: (user.stamps_count || 0) >= 10,
      requests
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch stamp status' });
  }
});

// Admin: Get All Stamp Requests
app.get('/api/admin/stamps', requireAdmin, (req, res) => {
  try {
    const list = db.prepare('SELECT * FROM stamp_requests ORDER BY id DESC').all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch stamp requests' });
  }
});

// Admin: Approve Stamp Request
app.post('/api/admin/stamps/approve/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const request = db.prepare('SELECT * FROM stamp_requests WHERE id = ?').get(id);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const user = db.prepare('SELECT id, stamps_count FROM users WHERE id = ?').get(request.user_id);
    const newCount = Math.min(10, ((user ? user.stamps_count : 0) || 0) + 1);

    if (user) {
      db.prepare('UPDATE users SET stamps_count = ? WHERE id = ?').run(newCount, user.id);
    }
    db.prepare("UPDATE stamp_requests SET status = 'approved' WHERE id = ?").run(id);

    res.json({ message: 'Stamp approved! Customer now has ' + newCount + '/10 stamps.', stamps_count: newCount });
  } catch (err) {
    res.status(500).json({ error: 'Could not approve stamp' });
  }
});

// Admin: Reject Stamp Request
app.post('/api/admin/stamps/reject/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.prepare("UPDATE stamp_requests SET status = 'rejected' WHERE id = ?").run(id);
    res.json({ message: 'Stamp request rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Could not reject stamp request' });
  }
});

// Admin: Manually Add / Subtract / Reset Stamps
app.post('/api/admin/stamps/adjust', requireAdmin, (req, res) => {
  try {
    const { identifier, action } = req.body; // action: 'add' | 'subtract' | 'reset'
    if (!identifier) return res.status(400).json({ error: 'User identifier required' });

    const cleanId = String(identifier).trim();
    const user = db.prepare('SELECT id, name, membership_id, stamps_count FROM users WHERE membership_id = ? OR email = ? OR id = ?')
      .get(cleanId, cleanId.toLowerCase(), Number(cleanId) || -1);

    if (!user) return res.status(404).json({ error: 'User not found' });

    let count = user.stamps_count || 0;
    if (action === 'subtract') count = Math.max(0, count - 1);
    else if (action === 'reset') count = 0;
    else count = Math.min(10, count + 1);

    db.prepare('UPDATE users SET stamps_count = ? WHERE id = ?').run(count, user.id);
    res.json({ message: `Stamps updated for ${user.name}: ${count}/10`, stamps_count: count });
  } catch (err) {
    res.status(500).json({ error: 'Could not adjust stamps' });
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
    const users = db.prepare('SELECT id, name, email, phone, role, membership_id, stamps_count, created_at FROM users ORDER BY id DESC').all();
    const formatted = users.map(u => ({
      ...u,
      membership_id: u.membership_id || formatMembershipId(u.id),
      stamps_count: u.stamps_count || 0
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch users' });
  }
});

// Fallback to index.html for unknown routes if needed
app.get('/', (req, res) => {
  const fs = require('fs');
  const pubPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(pubPath)) {
    return res.sendFile(pubPath);
  }
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

