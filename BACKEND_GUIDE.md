# 🎮 Virtux Gaming Hub — Backend & Admin CMS Documentation

## 🚀 How to Run the Backend Server

Open your terminal in this project folder (`virtuxgaminghub`) and run:

```bash
npm start
```
*(Or `node server.js`)*

The server will start on:
- **Public Website:** `http://localhost:3000`
- **User Login & Account Dashboard:** `http://localhost:3000/login.html`
- **Admin Control Center (CMS):** `http://localhost:3000/admin.html`

---

## 🔑 Default Administrator Credentials

- **Admin Email:** `admin@virtux.com`
- **Admin Password:** `admin123`

---

## ⚙️ Features & Capabilities

### 1. 🛡️ User Login & Customer Dashboard (`/login.html`)
- Gamers can register an account with their Name, Email, Phone, and Password.
- Customers can log in to view:
  - Profile details & gamer avatar
  - Real-time status of their **Station Bookings & Party Reservations** (`Pending`, `Confirmed`, `Completed`)
  - Direct quick links to book a station or write a review.

### 2. 📝 Customer Feedback System (`/feedback.html`)
- Reviews submitted via the feedback form are **automatically stored in the SQLite database** (`db/virtux.sqlite`).
- The reviews column on `feedback.html` **dynamically loads the verified customer reviews** straight from the database.
- In the Admin Panel, you can:
  - Read all reviews, ratings, and customer comments
  - Click **⭐ Feature** to highlight top reviews on the website
  - Delete spam or unwanted reviews with one click

### 3. 📅 Station Bookings & Inquiries (`/contact.html`)
- When a visitor fills out the **Station & Party Booking Request** form on the Contact page, it is saved directly to the database.
- In the Admin Panel under **Station Bookings**, you can:
  - See the customer's name, phone number (with one-click call), requested station (PS5, PC, Simulator, Movie room), date/time slot, and notes.
  - Update their status via a dropdown: `Pending` ➔ `Confirmed` ➔ `Completed` ➔ `Cancelled`.

### 4. ☕ Café Menu & Combos CMS (`/admin.html ➔ Café Menu CMS`)
- **Add, edit, or remove menu items & combos directly from the dashboard!**
- You do **NOT** need to touch any code files:
  - Enter the Item Name, Category (Combos, Beverages, Snacks, Desserts), Description, Price (₹), Original Price (for strikethrough discount), and Badges (e.g., `🔥 Most Popular`, `👥 Squad Saver`).
  - As soon as you save, it is stored in the database and **automatically updates the live Café menu on `cafe.html`**!

### 5. 📢 Live Announcements & Banners CMS
- Create top notice tickers for:
  - Weekend esports tournaments
  - Special holiday hours
  - Limited-time discounts
- When published from the Admin Panel, a glowing cyber notice ticker automatically appears at the top of the website for all visitors.

---

## 💾 Database Details

- **Database:** Local SQLite (`db/virtux.sqlite`) via `better-sqlite3`.
- **Security:** Passwords encrypted using `bcryptjs`, and authentication sessions secured with `jsonwebtoken` (JWT).
- **Portability:** 100% self-contained — no external cloud accounts or credit cards required. Runs locally and can be deployed easily to any Node.js hosting platform (Render, Railway, VPS, etc.).

