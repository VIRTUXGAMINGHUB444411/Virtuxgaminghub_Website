const path = require('path');
const os = require('os');
const bcrypt = require('bcryptjs');

const isVercel = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
const dbPath = isVercel ? path.join(os.tmpdir(), 'virtux.sqlite') : path.join(__dirname, 'virtux.sqlite');

function generateMembershipId(serialNumber) {
  return 'VIRTUXGAMING' + String(serialNumber).padStart(9, '0');
}

let db;

try {
  const Database = require('better-sqlite3');
  db = new Database(dbPath);
  if (!isVercel) {
    try { db.pragma('journal_mode = WAL'); } catch (e) {}
  }
  try { db.pragma('foreign_keys = ON'); } catch (e) {}
} catch (err) {
  console.warn('⚠️ better-sqlite3 native binary could not be loaded; using in-memory store for serverless:', err.message);
  db = createInMemoryStore();
}

function createInMemoryStore() {
  const store = {
    users: [],
    feedback: [],
    bookings: [],
    announcements: [],
    cafe_items: [],
    stamp_requests: [],
    counters: { users: 0, feedback: 0, bookings: 0, announcements: 0, cafe_items: 0, stamp_requests: 0 }
  };

  return {
    exec(sql) { return this; },
    pragma() { return this; },
    prepare(sql) {
      const trimmed = sql.trim();
      const lower = trimmed.toLowerCase();

      return {
        get(...params) {
          if (lower.includes('from users where email =')) {
            const email = (params[0] || '').toLowerCase().trim();
            return store.users.find(u => u.email.toLowerCase() === email);
          }
          if (lower.includes('from users where membership_id =')) {
            return store.users.find(u => u.membership_id === params[0]);
          }
          if (lower.includes('from users where role =')) {
            return store.users.find(u => u.role === params[0]);
          }
          if (lower.includes('from users where id =')) {
            return store.users.find(u => u.id === Number(params[0]));
          }
          if (lower.includes('from stamp_requests where id =')) {
            return store.stamp_requests.find(s => s.id === Number(params[0]));
          }
          if (lower.includes('count(*) as count from announcements')) {
            return { count: store.announcements.length };
          }
          if (lower.includes('count(*) as count from cafe_items')) {
            return { count: store.cafe_items.length };
          }
          if (lower.includes('count(*) as count from users')) {
            return { count: store.users.length };
          }
          if (lower.includes('count(*) as count from feedback')) {
            return { count: store.feedback.length };
          }
          if (lower.includes('count(*) as count from bookings')) {
            return { count: store.bookings.length };
          }
          if (lower.includes('count(*) as count from stamp_requests')) {
            if (lower.includes("status = 'pending'")) {
              return { count: store.stamp_requests.filter(s => s.status === 'pending').length };
            }
            return { count: store.stamp_requests.length };
          }
          return undefined;
        },
        all(...params) {
          if (lower.includes('from users')) {
            return store.users.map(u => ({
              id: u.id,
              name: u.name,
              email: u.email,
              phone: u.phone,
              role: u.role,
              membership_id: u.membership_id || generateMembershipId(u.id),
              stamps_count: u.stamps_count || 0,
              created_at: u.created_at
            })).reverse();
          }
          if (lower.includes('from stamp_requests')) {
            if (lower.includes('user_id = ?')) {
              return store.stamp_requests.filter(s => s.user_id === Number(params[0])).slice().reverse();
            }
            return store.stamp_requests.slice().reverse();
          }
          if (lower.includes('from feedback')) {
            if (lower.includes('is_featured = 1')) {
              return store.feedback.filter(f => f.is_featured === 1).slice().reverse();
            }
            return store.feedback.slice().reverse();
          }
          if (lower.includes('from bookings')) {
            if (lower.includes('user_id = ?')) {
              return store.bookings.filter(b => b.user_id === Number(params[0])).slice().reverse();
            }
            return store.bookings.slice().reverse();
          }
          if (lower.includes('from announcements')) {
            if (lower.includes('is_active = 1')) {
              return store.announcements.filter(a => a.is_active === 1).slice().reverse();
            }
            return store.announcements.slice().reverse();
          }
          if (lower.includes('from cafe_items')) {
            if (lower.includes('is_available = 1')) {
              return store.cafe_items.filter(c => c.is_available === 1);
            }
            return store.cafe_items.slice();
          }
          return [];
        },
        run(...params) {
          const now = new Date().toISOString();
          if (lower.startsWith('insert into users')) {
            store.counters.users++;
            const newId = store.counters.users;
            const membership_id = params[5] || generateMembershipId(newId);
            const user = {
              id: newId,
              name: params[0],
              email: params[1],
              password: params[2],
              phone: params[3],
              role: params[4] || 'user',
              membership_id,
              stamps_count: params[6] || 0,
              created_at: now
            };
            store.users.push(user);
            return { changes: 1, lastInsertRowid: user.id };
          }
          if (lower.startsWith('insert into stamp_requests')) {
            store.counters.stamp_requests++;
            const item = {
              id: store.counters.stamp_requests,
              user_id: params[0],
              membership_id: params[1],
              user_name: params[2],
              user_email: params[3],
              bill_amount: params[4] || 150,
              bill_notes: params[5] || '',
              status: 'pending',
              created_at: now
            };
            store.stamp_requests.push(item);
            return { changes: 1, lastInsertRowid: item.id };
          }
          if (lower.startsWith('insert into feedback')) {
            store.counters.feedback++;
            const item = { id: store.counters.feedback, user_id: params[0], name: params[1], email: params[2], rating: params[3], service: params[4], comment: params[5], is_featured: params[6] || 0, created_at: now };
            store.feedback.push(item);
            return { changes: 1, lastInsertRowid: item.id };
          }
          if (lower.startsWith('insert into bookings')) {
            store.counters.bookings++;
            const item = { id: store.counters.bookings, user_id: params[0], name: params[1], phone: params[2], service: params[3], booking_date: params[4], booking_time: params[5], duration: params[6], guests: params[7], notes: params[8], status: 'pending', created_at: now };
            store.bookings.push(item);
            return { changes: 1, lastInsertRowid: item.id };
          }
          if (lower.startsWith('insert into cafe_items')) {
            store.counters.cafe_items++;
            const item = { id: store.counters.cafe_items, category: params[0], name: params[1], description: params[2], price: params[3], original_price: params[4], badge: params[5], is_available: params[6] !== undefined ? params[6] : 1, created_at: now };
            store.cafe_items.push(item);
            return { changes: 1, lastInsertRowid: item.id };
          }
          if (lower.startsWith('update users set name = ?, phone = ?, email = ?')) {
            const id = Number(params[3]);
            const user = store.users.find(u => u.id === id);
            if (user) {
              user.name = params[0];
              user.phone = params[1];
              user.email = params[2];
            }
            return { changes: user ? 1 : 0 };
          }
          if (lower.startsWith('update users set stamps_count')) {
            const id = Number(params[1]);
            const user = store.users.find(u => u.id === id);
            if (user) user.stamps_count = Number(params[0]);
            return { changes: user ? 1 : 0 };
          }
          if (lower.startsWith('update users set membership_id')) {
            const id = Number(params[1]);
            const user = store.users.find(u => u.id === id);
            if (user) user.membership_id = params[0];
            return { changes: user ? 1 : 0 };
          }
          if (lower.startsWith('update stamp_requests set status')) {
            const id = Number(params[1]);
            const s = store.stamp_requests.find(x => x.id === id);
            if (s) s.status = params[0];
            return { changes: s ? 1 : 0 };
          }
          if (lower.startsWith('update feedback set is_featured')) {
            const id = Number(params[1]);
            const fb = store.feedback.find(f => f.id === id);
            if (fb) fb.is_featured = Number(params[0]);
            return { changes: fb ? 1 : 0 };
          }
          if (lower.startsWith('update bookings set status')) {
            const id = Number(params[1]);
            const bk = store.bookings.find(b => b.id === id);
            if (bk) bk.status = params[0];
            return { changes: bk ? 1 : 0 };
          }
          if (lower.startsWith('delete from feedback')) {
            const id = Number(params[0]);
            store.feedback = store.feedback.filter(f => f.id !== id);
            return { changes: 1 };
          }
          if (lower.startsWith('delete from bookings')) {
            const id = Number(params[0]);
            store.bookings = store.bookings.filter(b => b.id !== id);
            return { changes: 1 };
          }
          if (lower.startsWith('delete from stamp_requests')) {
            const id = Number(params[0]);
            store.stamp_requests = store.stamp_requests.filter(s => s.id !== id);
            return { changes: 1 };
          }
          return { changes: 1 };
        }
      };
    }
  };
}

function initDb() {
  try {
    // Users Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        phone TEXT,
        role TEXT DEFAULT 'user',
        membership_id TEXT UNIQUE,
        stamps_count INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure columns exist if table was already created
    try { db.exec(`ALTER TABLE users ADD COLUMN membership_id TEXT;`); } catch (e) {}
    try { db.exec(`ALTER TABLE users ADD COLUMN stamps_count INTEGER DEFAULT 0;`); } catch (e) {}

    // Stamp Requests Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS stamp_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        membership_id TEXT NOT NULL,
        user_name TEXT NOT NULL,
        user_email TEXT,
        bill_amount REAL DEFAULT 150,
        bill_notes TEXT,
        status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Feedback Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        email TEXT,
        rating INTEGER DEFAULT 5,
        service TEXT DEFAULT 'General',
        comment TEXT NOT NULL,
        is_featured INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Bookings Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        service TEXT NOT NULL,
        booking_date TEXT,
        booking_time TEXT,
        duration TEXT,
        guests INTEGER DEFAULT 1,
        notes TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    // Announcements Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        badge TEXT DEFAULT '🔥 NEW',
        message TEXT NOT NULL,
        link TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Cafe Menu Items Table
    db.exec(`
      CREATE TABLE IF NOT EXISTS cafe_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        original_price REAL,
        badge TEXT,
        is_available INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default admin account if none exists
    const adminCheck = db.prepare('SELECT id, membership_id FROM users WHERE role = ?').get('admin');
    if (!adminCheck) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('admin123', salt);
      const adminId = 'VIRTUXGAMING000000001';
      db.prepare(`
        INSERT INTO users (name, email, password, phone, role, membership_id, stamps_count)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run('Virtux Admin', 'admin@virtux.com', hash, '+91 91477 18768', 'admin', adminId, 10);
      console.log('⚡ Default Admin created: admin@virtux.com / admin123 (ID: ' + adminId + ')');
    }

    // Auto-assign membership_id to any user lacking one
    try {
      const unassigned = db.prepare('SELECT id FROM users WHERE membership_id IS NULL OR membership_id = ""').all();
      if (unassigned && unassigned.length > 0) {
        const updateStmt = db.prepare('UPDATE users SET membership_id = ? WHERE id = ?');
        unassigned.forEach(u => {
          updateStmt.run(generateMembershipId(u.id), u.id);
        });
      }
    } catch (e) {}

    // Seed sample cafe items if empty
    const cafeCheck = db.prepare('SELECT COUNT(*) as count FROM cafe_items').get();
    if (!cafeCheck || cafeCheck.count === 0) {
      const insertItem = db.prepare(`
        INSERT INTO cafe_items (category, name, description, price, original_price, badge, is_available)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      insertItem.run('Combos', '⚡ Gamer Fuel Combo', 'Monster Energy / Red Bull + Peri Peri Fries + Warm Chocolate Brownie', 249, 330, '🔥 Most Popular', 1);
      insertItem.run('Combos', '🎮 Solo Grind Pack', 'Signature Cold Coffee + Grilled Club Sandwich + Pringles Snack Can', 229, 310, null, 1);
      insertItem.run('Combos', '👥 4-Player LAN Party Pack', '4× Chilled Soft Drinks + 2× Loaded Cheesy Fries + 1× Large Nachos + 1× Tub Popcorn', 399, 560, '👥 Squad Saver', 1);
      insertItem.run('Beverages', 'Signature Cold Coffee', 'Rich espresso blended with thick milk and vanilla ice cream', 119, null, null, 1);
      insertItem.run('Beverages', 'Monster Energy Drink', 'Ice-cold canned energy boost (350ml)', 125, null, null, 1);
      insertItem.run('Snacks', 'Peri Peri Crinkle Fries', 'Crispy spiced crinkle cut fries with cheesy dip', 99, null, null, 1);
    }
  } catch (err) {
    console.error('Error during initDb:', err);
  }
}

initDb();

module.exports = db;
module.exports.generateMembershipId = generateMembershipId;
