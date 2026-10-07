const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'virtux_cyber_secret_key_2026';
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://ifzhczvuenwuvpzvvwph.supabase.co';
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || 'sb_secret_uFnYlqrh4phDpIe02Mh2wA_g0inw3Q8';

// ─── Supabase Admin Client (service role — bypasses RLS) ──────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY);
console.log('⚡ Supabase Admin client initialized');

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname)));

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatMembershipId(id) {
  return 'VIRTUXGAMING' + String(id).padStart(9, '0');
}

function makeUserPayload(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role || 'user',
    phone: u.phone || '',
    membership_id: u.membership_id || formatMembershipId(u.id),
    stamps_count: u.stamps_count || 0
  };
}

// ─── Auth Middleware ───────────────────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
}

function requireAdmin(req, res, next) {
  authenticateToken(req, res, () => {
    if (req.user && req.user.role === 'admin') next();
    else res.status(403).json({ error: 'Admin access required' });
  });
}

// ════════════════════════════════════════════════════════════════════════════
// AUTH ROUTES — All data stored in Supabase
// ════════════════════════════════════════════════════════════════════════════

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    const cleanEmail = email.toLowerCase().trim();

    // Check existing user
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        phone: phone ? phone.trim() : null,
        role: 'user',
        stamps_count: 0
      })
      .select()
      .single();

    if (insertError) {
      console.error('Register insert error:', insertError);
      if (insertError.code === 'PGRST205') {
        return res.status(500).json({ error: 'Supabase database tables are not initialized yet. Please execute supabase_schema.sql in the Supabase SQL Editor.' });
      }
      return res.status(500).json({ error: 'Could not create account: ' + insertError.message });
    }

    // Assign membership_id using the new row's id
    const membership_id = formatMembershipId(newUser.id);
    await supabase.from('users').update({ membership_id }).eq('id', newUser.id);

    const payload = makeUserPayload({ ...newUser, membership_id });
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Account registered successfully', user: payload, token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Auto-seed admin user helper
async function ensureAdminExists() {
  try {
    const { data: existingAdmin, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'admin@virtux.com')
      .maybeSingle();

    if (!existingAdmin && !error) {
      const hash = '$2b$10$FEjIMHcE4RPqSWroBaUcteY5Q77zwpNbyiKrNZPv2wSFbUgivuJ.W';
      await supabase.from('users').insert({
        name: 'Virtux Admin',
        email: 'admin@virtux.com',
        password: hash,
        phone: '+91 91477 18768',
        role: 'admin',
        membership_id: 'VIRTUXGAMING000000001',
        stamps_count: 10
      });
      console.log('⚡ Admin account auto-created in Supabase');
    }
  } catch (e) {
    // Schema may not be created yet, silently ignore
  }
}
ensureAdminExists();

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const cleanEmail = email.toLowerCase().trim();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Ensure membership_id
    if (!user.membership_id) {
      const membership_id = formatMembershipId(user.id);
      await supabase.from('users').update({ membership_id }).eq('id', user.id);
      user.membership_id = membership_id;
    }

    const payload = makeUserPayload(user);
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', user: payload, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Google Auth
app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, name, phone, googleId } = req.body;
    if (!email) return res.status(400).json({ error: 'Google account email is required' });
    const cleanEmail = email.toLowerCase().trim();

    const { data: existing } = await supabase
      .from('users')
      .select('*')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (existing) {
      if (!existing.membership_id) {
        const membership_id = formatMembershipId(existing.id);
        await supabase.from('users').update({ membership_id }).eq('id', existing.id);
        existing.membership_id = membership_id;
      }
      const payload = makeUserPayload(existing);
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ message: 'Google sign-in successful', user: payload, token });
    }

    // New Google user
    const dummyPassword = bcrypt.hashSync('google_' + (googleId || Date.now()) + Math.random(), 10);
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert({
        name: name ? name.trim() : 'Google Gamer',
        email: cleanEmail,
        password: dummyPassword,
        phone: phone ? phone.trim() : null,
        role: 'user',
        stamps_count: 0
      })
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ error: 'Could not register Google account: ' + insertError.message });
    }

    const membership_id = formatMembershipId(newUser.id);
    await supabase.from('users').update({ membership_id }).eq('id', newUser.id);

    const payload = makeUserPayload({ ...newUser, membership_id });
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Google account registered successfully', user: payload, token });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(500).json({ error: 'Server error during Google authentication' });
  }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email address is required' });
    const cleanEmail = email.toLowerCase().trim();

    const { data: user } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('email', cleanEmail)
      .maybeSingle();

    // Trigger Supabase auth reset email
    try {
      await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `https://virtuxgaminghub-website.vercel.app/login.html`
      });
    } catch (e) {
      console.warn('Supabase resetPassword note:', e.message);
    }

    res.json({
      message: user
        ? `Password recovery instructions have been sent to ${cleanEmail}. Check your inbox.`
        : 'If an account is associated with this email, recovery instructions have been sent.'
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Could not process password recovery request' });
  }
});

// Direct Password Reset
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: 'Email and new password are required' });
    if (newPassword.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    const cleanEmail = email.toLowerCase().trim();

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (!user) return res.status(404).json({ error: 'No account found with this email address' });

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await supabase.from('users').update({ password: hashedPassword }).eq('id', user.id);

    res.json({ message: 'Password has been updated successfully! You can now sign in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Could not reset password' });
  }
});

// Get Current User Profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    let { data: user } = await supabase
      .from('users')
      .select('id, name, email, phone, role, membership_id, stamps_count, created_at')
      .eq('id', req.user.id)
      .maybeSingle();

    // Serverless fallback: use JWT payload if DB lookup missed
    if (!user && req.user) {
      user = {
        id: req.user.id,
        name: req.user.name || 'Gamer',
        email: req.user.email,
        phone: req.user.phone || '',
        role: req.user.role || 'user',
        membership_id: req.user.membership_id || formatMembershipId(req.user.id),
        stamps_count: req.user.stamps_count || 0
      };
    }

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.membership_id) {
      user.membership_id = formatMembershipId(user.id);
      await supabase.from('users').update({ membership_id: user.membership_id }).eq('id', user.id);
    }

    // Fetch related data
    const [{ data: bookings }, { data: myFeedback }, { data: stampRequests }] = await Promise.all([
      supabase.from('bookings').select('*').eq('user_id', user.id).order('id', { ascending: false }),
      supabase.from('feedback').select('*').eq('user_id', user.id).order('id', { ascending: false }),
      supabase.from('stamp_requests').select('*').eq('user_id', user.id).order('id', { ascending: false })
    ]);

    res.json({
      user,
      bookings: bookings || [],
      feedback: myFeedback || [],
      stamp_requests: stampRequests || [],
      stamps_count: user.stamps_count || 0
    });
  } catch (err) {
    console.error('Fetch profile error:', err);
    res.status(500).json({ error: 'Could not fetch profile' });
  }
});

// Update Profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
    const cleanEmail = email.toLowerCase().trim();

    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .neq('id', req.user.id)
      .maybeSingle();

    if (existing) return res.status(400).json({ error: 'This email is already associated with another account' });

    const { data: updated } = await supabase
      .from('users')
      .update({ name: name.trim(), phone: phone ? phone.trim() : null, email: cleanEmail })
      .eq('id', req.user.id)
      .select()
      .single();

    if (!updated.membership_id) {
      updated.membership_id = formatMembershipId(updated.id);
    }

    const token = jwt.sign(makeUserPayload(updated), JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Profile updated successfully!', user: updated, token });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Could not update profile' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// LOYALTY STAMPS ROUTES
// ════════════════════════════════════════════════════════════════════════════

// Customer: Request a Stamp
app.post('/api/stamps/request', authenticateToken, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id, name, email, membership_id, stamps_count')
      .eq('id', req.user.id)
      .maybeSingle();

    if (!user) return res.status(404).json({ error: 'User not found' });
    if ((user.stamps_count || 0) >= 10) {
      return res.status(400).json({ error: 'You have completed all 10 stamps! Show your Membership ID at the counter to claim your surprise reward!' });
    }

    const { bill_amount, bill_notes } = req.body;
    const amount = Number(bill_amount) || 150;
    if (amount < 149) return res.status(400).json({ error: 'Visit purchase must be ₹149 or higher to qualify for a stamp.' });

    const memId = user.membership_id || formatMembershipId(user.id);
    const { data: result, error } = await supabase
      .from('stamp_requests')
      .insert({
        user_id: user.id,
        membership_id: memId,
        user_name: user.name,
        user_email: user.email,
        bill_amount: amount,
        bill_notes: bill_notes ? String(bill_notes).trim() : 'Store visit over ₹149',
        status: 'pending'
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Could not submit stamp request: ' + error.message });

    res.status(201).json({
      message: 'Stamp request submitted! Once approved by the store manager, your stamp will appear in your envelope.',
      requestId: result.id
    });
  } catch (err) {
    console.error('Stamp request error:', err);
    res.status(500).json({ error: 'Could not submit stamp request' });
  }
});

// Customer: Get Stamp Status
app.get('/api/stamps/status', authenticateToken, async (req, res) => {
  try {
    const { data: user } = await supabase
      .from('users')
      .select('id, name, membership_id, stamps_count')
      .eq('id', req.user.id)
      .maybeSingle();

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { data: requests } = await supabase
      .from('stamp_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false });

    res.json({
      membership_id: user.membership_id || formatMembershipId(user.id),
      stamps_count: user.stamps_count || 0,
      max_stamps: 10,
      surprise_unlocked: (user.stamps_count || 0) >= 10,
      requests: requests || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch stamp status' });
  }
});

// Admin: Get All Stamp Requests
app.get('/api/admin/stamps', requireAdmin, async (req, res) => {
  try {
    const { data: list } = await supabase.from('stamp_requests').select('*').order('id', { ascending: false });
    res.json(list || []);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch stamp requests' });
  }
});

// Admin: Approve Stamp Request
app.post('/api/admin/stamps/approve/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: request } = await supabase.from('stamp_requests').select('*').eq('id', id).maybeSingle();
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const { data: user } = await supabase.from('users').select('id, stamps_count').eq('id', request.user_id).maybeSingle();
    const newCount = Math.min(10, ((user ? user.stamps_count : 0) || 0) + 1);

    if (user) await supabase.from('users').update({ stamps_count: newCount }).eq('id', user.id);
    await supabase.from('stamp_requests').update({ status: 'approved' }).eq('id', id);

    res.json({ message: `Stamp approved! Customer now has ${newCount}/10 stamps.`, stamps_count: newCount });
  } catch (err) {
    res.status(500).json({ error: 'Could not approve stamp' });
  }
});

// Admin: Reject Stamp Request
app.post('/api/admin/stamps/reject/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await supabase.from('stamp_requests').update({ status: 'rejected' }).eq('id', id);
    res.json({ message: 'Stamp request rejected' });
  } catch (err) {
    res.status(500).json({ error: 'Could not reject stamp request' });
  }
});

// Admin: Adjust Stamps
app.post('/api/admin/stamps/adjust', requireAdmin, async (req, res) => {
  try {
    const { identifier, action } = req.body;
    if (!identifier) return res.status(400).json({ error: 'User identifier required' });
    const cleanId = String(identifier).trim();

    let { data: user } = await supabase
      .from('users')
      .select('id, name, membership_id, stamps_count')
      .or(`membership_id.eq.${cleanId},email.eq.${cleanId.toLowerCase()}`)
      .maybeSingle();

    if (!user) {
      const numId = parseInt(cleanId);
      if (!isNaN(numId)) {
        const { data: u2 } = await supabase.from('users').select('id, name, membership_id, stamps_count').eq('id', numId).maybeSingle();
        user = u2;
      }
    }

    if (!user) return res.status(404).json({ error: 'User not found' });

    let count = user.stamps_count || 0;
    if (action === 'subtract') count = Math.max(0, count - 1);
    else if (action === 'reset') count = 0;
    else count = Math.min(10, count + 1);

    await supabase.from('users').update({ stamps_count: count }).eq('id', user.id);
    res.json({ message: `Stamps updated for ${user.name}: ${count}/10`, stamps_count: count });
  } catch (err) {
    res.status(500).json({ error: 'Could not adjust stamps' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// FEEDBACK ROUTES
// ════════════════════════════════════════════════════════════════════════════

app.post('/api/feedback', async (req, res) => {
  try {
    const { name, email, rating, service, comment } = req.body;
    if (!name || !comment) return res.status(400).json({ error: 'Name and comment are required' });

    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      try { userId = jwt.verify(authHeader.split(' ')[1], JWT_SECRET).id; } catch (e) {}
    }

    const { data: result, error } = await supabase
      .from('feedback')
      .insert({
        user_id: userId,
        name: name.trim(),
        email: email ? email.trim() : null,
        rating: parseInt(rating) || 5,
        service: service || 'General Gaming',
        comment: comment.trim()
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Could not submit feedback: ' + error.message });
    res.status(201).json({ message: 'Feedback submitted successfully!', id: result.id });
  } catch (err) {
    console.error('Feedback submit error:', err);
    res.status(500).json({ error: 'Could not submit feedback' });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const { data: list } = await supabase
      .from('feedback')
      .select('id, name, rating, service, comment, is_featured, created_at')
      .order('is_featured', { ascending: false })
      .order('id', { ascending: false })
      .limit(20);
    res.json(list || []);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch reviews' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// BOOKING / RESERVATION ROUTES
// ════════════════════════════════════════════════════════════════════════════

app.post('/api/bookings', async (req, res) => {
  try {
    const { name, phone, service, booking_date, booking_time, duration, guests, notes } = req.body;
    if (!name || !phone || !service) return res.status(400).json({ error: 'Name, phone, and service are required' });

    let userId = null;
    const authHeader = req.headers['authorization'];
    if (authHeader) {
      try { userId = jwt.verify(authHeader.split(' ')[1], JWT_SECRET).id; } catch (e) {}
    }

    const { data: result, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        name: name.trim(),
        phone: phone.trim(),
        service: service.trim(),
        booking_date: booking_date || null,
        booking_time: booking_time || null,
        duration: duration || null,
        guests: parseInt(guests) || 1,
        notes: notes ? notes.trim() : null,
        status: 'pending'
      })
      .select()
      .single();

    if (error) return res.status(500).json({ error: 'Could not submit reservation: ' + error.message });
    res.status(201).json({ message: 'Reservation request submitted! Our crew will contact you shortly.', id: result.id });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ error: 'Could not submit reservation' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ANNOUNCEMENTS & BANNERS
// ════════════════════════════════════════════════════════════════════════════

app.get('/api/announcements', async (req, res) => {
  try {
    const { data: list } = await supabase
      .from('announcements')
      .select('*')
      .eq('is_active', 1)
      .order('id', { ascending: false });
    res.json(list || []);
  } catch (err) {
    res.status(500).json({ error: 'Could not load announcements' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// CAFE ITEMS
// ════════════════════════════════════════════════════════════════════════════

app.get('/api/cafe', async (req, res) => {
  try {
    const { data: items } = await supabase
      .from('cafe_items')
      .select('*')
      .eq('is_available', 1)
      .order('category')
      .order('id');
    res.json(items || []);
  } catch (err) {
    res.status(500).json({ error: 'Could not load cafe menu' });
  }
});

// ════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD ROUTES
// ════════════════════════════════════════════════════════════════════════════

// Admin Stats
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const [
      { count: totalUsers },
      { count: totalFeedback },
      { count: pendingBookings },
      { count: totalBookings },
      { count: totalCafeItems }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'user'),
      supabase.from('feedback').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('cafe_items').select('*', { count: 'exact', head: true })
    ]);
    res.json({ totalUsers, totalFeedback, pendingBookings, totalBookings, totalCafeItems });
  } catch (err) {
    res.status(500).json({ error: 'Could not load stats' });
  }
});

// Admin: Feedback Management
app.get('/api/admin/feedback', requireAdmin, async (req, res) => {
  try {
    const { data: list } = await supabase.from('feedback').select('*').order('id', { ascending: false });
    res.json(list || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback list' });
  }
});

app.put('/api/admin/feedback/:id/feature', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { data: current } = await supabase.from('feedback').select('is_featured').eq('id', id).maybeSingle();
    if (!current) return res.status(404).json({ error: 'Feedback not found' });
    const newStatus = current.is_featured ? 0 : 1;
    await supabase.from('feedback').update({ is_featured: newStatus }).eq('id', id);
    res.json({ message: 'Featured status toggled', is_featured: newStatus });
  } catch (err) {
    res.status(500).json({ error: 'Could not update feedback' });
  }
});

app.delete('/api/admin/feedback/:id', requireAdmin, async (req, res) => {
  try {
    await supabase.from('feedback').delete().eq('id', req.params.id);
    res.json({ message: 'Feedback entry deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete feedback' });
  }
});

// Admin: Bookings Management
app.get('/api/admin/bookings', requireAdmin, async (req, res) => {
  try {
    const { data: list } = await supabase.from('bookings').select('*').order('id', { ascending: false });
    res.json(list || []);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.put('/api/admin/bookings/:id/status', requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await supabase.from('bookings').update({ status }).eq('id', req.params.id);
    res.json({ message: 'Booking status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Could not update booking status' });
  }
});

app.delete('/api/admin/bookings/:id', requireAdmin, async (req, res) => {
  try {
    await supabase.from('bookings').delete().eq('id', req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete booking' });
  }
});

// Admin: Announcements Management
app.get('/api/admin/announcements', requireAdmin, async (req, res) => {
  try {
    const { data: list } = await supabase.from('announcements').select('*').order('id', { ascending: false });
    res.json(list || []);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch announcements' });
  }
});

app.post('/api/admin/announcements', requireAdmin, async (req, res) => {
  try {
    const { title, badge, message, link, is_active } = req.body;
    if (!title || !message) return res.status(400).json({ error: 'Title and message are required' });
    const { data: result, error } = await supabase
      .from('announcements')
      .insert({ title, badge: badge || '🔥 NEW', message, link: link || null, is_active: is_active !== undefined ? is_active : 1 })
      .select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: 'Announcement created!', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Could not create announcement' });
  }
});

app.put('/api/admin/announcements/:id', requireAdmin, async (req, res) => {
  try {
    const { title, badge, message, link, is_active } = req.body;
    await supabase.from('announcements').update({ title, badge, message, link, is_active: is_active ? 1 : 0 }).eq('id', req.params.id);
    res.json({ message: 'Announcement updated!' });
  } catch (err) {
    res.status(500).json({ error: 'Could not update announcement' });
  }
});

app.delete('/api/admin/announcements/:id', requireAdmin, async (req, res) => {
  try {
    await supabase.from('announcements').delete().eq('id', req.params.id);
    res.json({ message: 'Announcement deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete announcement' });
  }
});

// Admin: Cafe Menu Management
app.get('/api/admin/cafe', requireAdmin, async (req, res) => {
  try {
    const { data: items } = await supabase.from('cafe_items').select('*').order('category').order('id', { ascending: false });
    res.json(items || []);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch cafe items' });
  }
});

app.post('/api/admin/cafe', requireAdmin, async (req, res) => {
  try {
    const { category, name, description, price, original_price, badge, is_available } = req.body;
    if (!category || !name || price === undefined) return res.status(400).json({ error: 'Category, name, and price are required' });
    const { data: result, error } = await supabase
      .from('cafe_items')
      .insert({
        category, name, description: description || null,
        price: parseFloat(price),
        original_price: original_price ? parseFloat(original_price) : null,
        badge: badge || null,
        is_available: is_available !== undefined ? is_available : 1
      })
      .select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json({ message: 'Menu item added successfully!', id: result.id });
  } catch (err) {
    res.status(500).json({ error: 'Could not add cafe item' });
  }
});

app.put('/api/admin/cafe/:id', requireAdmin, async (req, res) => {
  try {
    const { category, name, description, price, original_price, badge, is_available } = req.body;
    await supabase.from('cafe_items').update({
      category, name, description,
      price: parseFloat(price),
      original_price: original_price ? parseFloat(original_price) : null,
      badge, is_available: is_available ? 1 : 0
    }).eq('id', req.params.id);
    res.json({ message: 'Menu item updated successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Could not update cafe item' });
  }
});

app.delete('/api/admin/cafe/:id', requireAdmin, async (req, res) => {
  try {
    await supabase.from('cafe_items').delete().eq('id', req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Could not delete cafe item' });
  }
});

// Admin: Users list
app.get('/api/admin/users', requireAdmin, async (req, res) => {
  try {
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email, phone, role, membership_id, stamps_count, created_at')
      .order('id', { ascending: false });
    const formatted = (users || []).map(u => ({
      ...u,
      membership_id: u.membership_id || formatMembershipId(u.id),
      stamps_count: u.stamps_count || 0
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch users' });
  }
});

// ─── Root fallback ─────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  const fs = require('fs');
  const pubPath = path.join(__dirname, 'public', 'index.html');
  if (fs.existsSync(pubPath)) return res.sendFile(pubPath);
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ─── Start ──────────────────────────────────────────────────────────────────
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Virtux Gaming Hub Server: http://localhost:${PORT}`);
    console.log(`⚡ Admin Panel: http://localhost:${PORT}/admin.html`);
    console.log(`👤 User Login:  http://localhost:${PORT}/login.html`);
    console.log(`🗄️  Database:   Supabase (${SUPABASE_URL})`);
    console.log(`==================================================\n`);
  });
}

module.exports = app;
