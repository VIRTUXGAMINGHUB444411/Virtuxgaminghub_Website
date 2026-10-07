const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'virtux.sqlite');
const db = new Database(dbPath);

// Enable foreign keys and WAL mode for better concurrency
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initDb() {
  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      role TEXT DEFAULT 'user', -- 'user' or 'admin'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

  // Bookings / Reservations Table
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
      status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
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

  // Cafe Menu Items Table (for dynamic items & combos)
  db.exec(`
    CREATE TABLE IF NOT EXISTS cafe_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL, -- 'Beverages', 'Snacks', 'Combos', 'Desserts'
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
  const adminCheck = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
  if (!adminCheck) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('admin123', salt);
    db.prepare(`
      INSERT INTO users (name, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?)
    `).run('Virtux Admin', 'admin@virtux.com', hash, '+91 91477 18768', 'admin');
    console.log('⚡ Default Admin created: admin@virtux.com / admin123');
  }

  // Seed default announcement if none
  const announcementCount = db.prepare('SELECT COUNT(*) as count FROM announcements').get().count;
  if (announcementCount === 0) {
    db.prepare(`
      INSERT INTO announcements (title, badge, message, link, is_active)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      'Special Weekend Tournament',
      '🏆 ESPORTS',
      'EA FC 24 Weekend Championship happening this Sunday! Register at the counter.',
      '/contact.html',
      1
    );
  }

  // Seed sample cafe items if empty
  const cafeCount = db.prepare('SELECT COUNT(*) as count FROM cafe_items').get().count;
  if (cafeCount === 0) {
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
}

initDb();

module.exports = db;

