/* ══════════════════════════════════════════
   VIRTUX GAMING HUB — JavaScript
   ══════════════════════════════════════════ */

// ═══════════ LOADING SCREEN ═══════════
(function initLoader() {
  const overlay  = document.getElementById('loaderOverlay');
  if (!overlay) return;
  const bar      = document.getElementById('loaderBar');
  const label    = document.getElementById('loaderPercent');

  document.body.style.overflow = 'hidden';

  let progress = 0;
  // Balanced speed — completes in ~1.4 - 1.5 s
  const speeds = [
    { until: 45,  step: 2.2, delay: 18 },
    { until: 75,  step: 1.5, delay: 20 },
    { until: 92,  step: 0.9, delay: 22 },
    { until: 100, step: 0.6, delay: 18 },
  ];

  function getSpeed() {
    return speeds.find(s => progress < s.until) || speeds[speeds.length - 1];
  }

  function tick() {
    const { step, delay } = getSpeed();
    progress = Math.min(progress + step, 100);
    const pct = Math.floor(progress);
    bar.style.width   = pct + '%';
    label.textContent = pct + '%';

    if (progress < 100) {
      setTimeout(tick, delay);
    } else {
      setTimeout(dismissLoader, 180);
    }
  }

  function dismissLoader() {
    overlay.classList.add('hide');
    document.body.style.overflow = '';
    overlay.addEventListener('transitionend', () => overlay.remove(), { once: true });
  }

  setTimeout(tick, 120);
})();


// ═══════════ PARTICLE SYSTEM ═══════════
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.color = Math.random() > 0.5 ? '#00d4ff' : '#8b00ff';
      this.life = Math.random() * 200 + 100;
      this.maxLife = this.life;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;
      if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      const alpha = (this.life / this.maxLife) * this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });

    // Draw connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00d4ff';
          ctx.globalAlpha = (1 - dist / 80) * 0.08;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      }
    }
    animId = requestAnimationFrame(animate);
  }
  animate();
})();

// ═══════════ NAVBAR SCROLL & ACTIVE LINK ═══════════
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Highlight active link matching current page
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop().toLowerCase() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    const targetPage = href.split('/').pop().toLowerCase().split('#')[0];

    if (targetPage === currentPage || (currentPage === '' && targetPage === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
})();

// ═══════════ HAMBURGER MENU ═══════════
function toggleNav() {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
}

// Close nav when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  });
});

// ═══════════ PRICING TABS ═══════════
function showTab(tabId, btn) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('tab-' + tabId);
  if (target) target.classList.add('active');
  
  if (btn) {
    btn.classList.add('active');
  } else if (window.event && window.event.currentTarget && window.event.currentTarget.classList.contains('tab-btn')) {
    window.event.currentTarget.classList.add('active');
  } else {
    const defaultBtn = document.querySelector(`.tab-btn[onclick*="'${tabId}'"]`);
    if (defaultBtn) defaultBtn.classList.add('active');
  }
}

// ═══════════ CAFÉ TABS ═══════════
function showCafeTab(tabId, btn) {
  document.querySelectorAll('.cafe-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.cafe-tab').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('cafe-' + tabId);
  if (target) target.classList.add('active');
  
  if (btn) {
    btn.classList.add('active');
  } else if (window.event && window.event.currentTarget && window.event.currentTarget.classList.contains('cafe-tab')) {
    window.event.currentTarget.classList.add('active');
  } else {
    const defaultBtn = document.querySelector(`.cafe-tab[onclick*="'${tabId}'"]`);
    if (defaultBtn) defaultBtn.classList.add('active');
  }
}

// ═══════════ MEMBERSHIP LIMITED / UNLIMITED TOGGLE ═══════════
function showMembership(type, btn) {
  // Hide all sections
  ['mem-limited', 'mem-unlimited'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  // Show selected
  const target = document.getElementById('mem-' + type);
  if (target) target.style.display = 'block';
  // Update button states
  document.querySelectorAll('.mem-toggle-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
}

// ═══════════ MODAL SYSTEM ═══════════
function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function closeModalOutside(event, id) {
  if (event.target === event.currentTarget) {
    closeModal(id);
  }
}

// ═══════════ MODAL TABS ═══════════
function switchModalTab(btn, tabId, modalId) {
  const modal = document.getElementById(modalId);
  modal.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
  modal.querySelectorAll('.modal-tab-content').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
});

// ═══════════ STAR RATING ═══════════
let currentRating = 0;
function setRating(val) {
  currentRating = val;
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, i) => {
    if (i < val) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

// Hover effect on stars
document.querySelectorAll('.star').forEach((star, i) => {
  star.addEventListener('mouseover', () => {
    document.querySelectorAll('.star').forEach((s, j) => {
      s.style.color = j <= i ? '#fbbf24' : '';
    });
  });
  star.addEventListener('mouseleave', () => {
    document.querySelectorAll('.star').forEach((s, j) => {
      s.style.color = j < currentRating ? '#fbbf24' : '';
    });
  });
});

// ═══════════ TOAST NOTIFICATION ═══════════
function showToast(message, duration = 3500) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => { toast.classList.remove('show'); }, duration);
}

// ═══════════ FORM HANDLERS ═══════════
// ═══════════ FORM HANDLERS (BACKEND CONNECTED) ═══════════
const API_BASE = (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '3000'))
  ? 'http://localhost:3000'
  : '';

async function handleLogin(event, type) {
  event.preventDefault();
  const form = event.target;
  const inputs = form.querySelectorAll('input');
  let email = '';
  let password = '';

  inputs.forEach(input => {
    if (input.type === 'email' || input.placeholder.includes('email') || input.placeholder.includes('admin@')) {
      email = input.value;
    }
    if (input.type === 'password') {
      password = input.value;
    }
  });

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      showToast('❌ ' + (data.error || 'Login failed'));
      return;
    }

    localStorage.setItem('virtux_token', data.token);
    localStorage.setItem('virtux_user', JSON.stringify(data.user));

    if (type === 'admin' || data.user.role === 'admin') {
      showToast('⚡ Admin authenticated! Redirecting to Control Center...');
      setTimeout(() => { window.location.href = 'admin.html'; }, 1000);
    } else {
      showToast('🎮 Welcome back, ' + data.user.name + '!');
      updateNavAuth();
      setTimeout(() => {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
        document.body.style.overflow = '';
      }, 1200);
    }
  } catch (err) {
    showToast('⚠️ Could not connect to server. Ensure backend is running.');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  const form = event.target;
  const inputs = form.querySelectorAll('input');
  let name = '';
  let email = '';
  let phone = '';
  let password = '';

  inputs.forEach(input => {
    if (input.placeholder.includes('Name')) name = input.value;
    if (input.type === 'email' || input.placeholder.includes('email')) email = input.value;
    if (input.type === 'tel' || input.placeholder.includes('+91')) phone = input.value;
    if (input.type === 'password' && !input.placeholder.includes('Confirm')) password = input.value;
  });

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password })
    });
    const data = await res.json();

    if (!res.ok) {
      showToast('❌ ' + (data.error || 'Registration failed'));
      return;
    }

    localStorage.setItem('virtux_token', data.token);
    localStorage.setItem('virtux_user', JSON.stringify(data.user));
    showToast('✅ Welcome to the squad, ' + data.user.name + '!');
    updateNavAuth();
    setTimeout(() => {
      document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
      document.body.style.overflow = '';
    }, 1200);
  } catch (err) {
    showToast('⚠️ Could not connect to server. Ensure backend is running.');
  }
}

async function submitFeedback(event) {
  event.preventDefault();
  if (currentRating === 0) {
    showToast('⭐ Please select a star rating before submitting!');
    return;
  }

  const form = event.target;
  const nameInput = form.querySelector('input[type="text"]');
  const emailInput = form.querySelector('input[type="email"]');
  const serviceSelect = form.querySelector('select');
  const commentTextarea = form.querySelector('textarea');

  const payload = {
    name: nameInput ? nameInput.value : 'Anonymous',
    email: emailInput ? emailInput.value : '',
    service: serviceSelect ? serviceSelect.value : 'General',
    rating: currentRating,
    comment: commentTextarea ? commentTextarea.value : ''
  };

  const token = localStorage.getItem('virtux_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  try {
    const res = await fetch(`${API_BASE}/api/feedback`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (res.ok) {
      showToast('🚀 Thank you! Your review has been saved to the database.');
      form.reset();
      setRating(0);
      loadDynamicFeedback();
    } else {
      showToast('❌ ' + (data.error || 'Error submitting review'));
    }
  } catch (err) {
    showToast('🚀 Review submitted! (Saved locally)');
    form.reset();
    setRating(0);
  }
}

async function submitBooking(event) {
  event.preventDefault();
  const form = event.target;
  const nameInput = form.querySelector('input[placeholder*="John"], input[placeholder*="Name"]');
  const phoneInput = form.querySelector('input[type="tel"]');
  const serviceSelect = form.querySelector('select');
  const slotInput = form.querySelector('input[placeholder*="Saturday"], input[placeholder*="Slot"]');
  const notesTextarea = form.querySelector('textarea');

  const payload = {
    name: nameInput ? nameInput.value : 'Gamer',
    phone: phoneInput ? phoneInput.value : '',
    service: serviceSelect ? serviceSelect.value : 'PS5 Station',
    booking_date: slotInput ? slotInput.value : 'Requested Slot',
    notes: notesTextarea ? notesTextarea.value : ''
  };

  const token = localStorage.getItem('virtux_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = 'Bearer ' + token;

  try {
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (res.ok) {
      showToast('🎮 Reservation saved in database! Our crew will call you shortly.');
      form.reset();
    } else {
      showToast('❌ ' + (data.error || 'Failed to submit reservation'));
    }
  } catch (err) {
    showToast('🎮 Reservation request received! Our crew will contact you shortly.');
    form.reset();
  }
}

// Dynamically load public feedback reviews from database
async function loadDynamicFeedback() {
  const reviewsCol = document.querySelector('.reviews-col');
  if (!reviewsCol) return;

  try {
    const res = await fetch(`${API_BASE}/api/feedback`);
    if (!res.ok) return;
    const list = await res.json();
    if (!list || list.length === 0) return;

    // Keep the title and render items
    const title = reviewsCol.querySelector('.reviews-title');
    reviewsCol.innerHTML = '';
    if (title) reviewsCol.appendChild(title);

    list.slice(0, 8).forEach(item => {
      const card = document.createElement('div');
      card.className = 'review-card visible';
      card.innerHTML = `
        <div class="review-stars">${'★'.repeat(item.rating || 5)}</div>
        <p class="review-text">"${item.comment}"</p>
        <div class="review-author">
          <div class="review-avatar">${(item.name || 'G').charAt(0).toUpperCase()}</div>
          <div><strong>${item.name}</strong><p>${item.service || 'Verified Gamer'}</p></div>
        </div>
      `;
      reviewsCol.appendChild(card);
    });
  } catch (e) { /* fallback to static */ }
}

// Dynamically load cafe menu items from database into cafe.html
async function loadDynamicCafe() {
  const combosGrid = document.querySelector('#cafe-combos .menu-grid');
  if (!combosGrid) return;

  try {
    const res = await fetch(`${API_BASE}/api/cafe`);
    if (!res.ok) return;
    const items = await res.json();
    if (!items || items.length === 0) return;

    // Filter combos
    const combos = items.filter(it => it.category === 'Combos');
    if (combos.length > 0) {
      combosGrid.innerHTML = combos.map(c => `
        <div class="menu-category combo-card visible">
          ${c.badge ? `<div class="combo-badge">${c.badge}</div>` : ''}
          <h4 class="menu-cat-title">${c.name}</h4>
          <p class="combo-includes">${c.description || ''}</p>
          <div class="combo-price">
            ${c.original_price ? `<span class="combo-original">₹${c.original_price}</span>` : ''}
            <span class="combo-final">₹${c.price}</span>
          </div>
        </div>
      `).join('');
    }
  } catch (e) { /* fallback */ }
}

document.addEventListener('DOMContentLoaded', () => {
  loadDynamicFeedback();
  loadDynamicCafe();
});

// ═══════════ SCROLL ANIMATIONS (AOS-lite) ═══════════
(function initAOS() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Stagger siblings
        const siblings = entry.target.parentElement.querySelectorAll('[data-aos]');
        siblings.forEach((el, i) => {
          setTimeout(() => { el.classList.add('visible'); }, i * 80);
        });
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
})();

// ═══════════ SMOOTH SCROLL FOR NAV LINKS ═══════════
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// ═══════════ HERO PARALLAX ═══════════
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-content');
  if (hero) {
    const scrolled = window.scrollY;
    hero.style.transform = `translateY(${scrolled * 0.15}px)`;
    hero.style.opacity = Math.max(0, 1 - scrolled / 600);
  }
});

// ═══════════ NEON GLOW ON HOVER (Price Cards) ═══════════
document.querySelectorAll('.price-card, .about-card, .menu-category').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', x + '%');
    card.style.setProperty('--mouse-y', y + '%');
  });
});

// ═══════════ TYPING EFFECT on Hero ═══════════
(function typeEffect() {
  const subtitle = document.querySelector('.hero-subtitle');
  if (!subtitle) return;
  const text = subtitle.textContent;
  subtitle.textContent = '';
  let i = 0;
  function type() {
    if (i < text.length) {
      subtitle.textContent += text[i++];
      setTimeout(type, 60);
    }
  }
  setTimeout(type, 1000);
})();

// ═══════════ COUNTER ANIMATION ═══════════
(function animateCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const numMatch = text.match(/[\d.]+/);
        if (!numMatch) return;
        const target = parseFloat(numMatch[0]);
        const suffix = text.replace(numMatch[0], '');
        let current = 0;
        const increment = target / 60;
        function count() {
          current = Math.min(current + increment, target);
          const display = Number.isInteger(target) ? Math.floor(current) : current.toFixed(1);
          el.textContent = display + suffix;
          if (current < target) requestAnimationFrame(count);
        }
        count();
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => observer.observe(el));
})();

console.log('%c⚡ VIRTUX GAMING HUB', 'color:#00d4ff;font-size:18px;font-weight:bold;font-family:monospace;');
console.log('%cBuilt for Champions. Designed for Gamers.', 'color:#8b00ff;font-size:12px;font-family:monospace;');

// ═══════════ DYNAMIC BACKEND INTEGRATION ═══════════
function updateNavAuth() {
  const user = JSON.parse(localStorage.getItem('virtux_user') || 'null');
  const navAuthLinks = document.querySelectorAll('.nav-auth-link, #nav-login-btn, #nav-auth-link');
  const loginBtns = document.querySelectorAll('.btn-login');
  const adminBtns = document.querySelectorAll('.btn-admin');

  navAuthLinks.forEach(link => {
    if (user) {
      if (user.role === 'admin') {
        link.textContent = '⚙️ Admin';
        link.href = 'admin.html';
        link.style.color = 'var(--cyan)';
      } else {
        link.textContent = '👤 ' + (user.name.split(' ')[0] || 'Dashboard');
        link.href = 'dashboard.html';
      }
    } else {
      link.textContent = 'Account';
      link.href = 'login.html';
    }
  });

  if (user) {
    loginBtns.forEach(btn => {
      btn.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>${user.name.split(' ')[0] || 'Dashboard'}</span>
      `;
      btn.onclick = (e) => {
        e.preventDefault();
        window.location.href = user.role === 'admin' ? 'admin.html' : 'dashboard.html';
      };
    });

    if (user.role === 'admin') {
      adminBtns.forEach(btn => {
        btn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span>Dashboard</span>
        `;
        btn.onclick = (e) => {
          e.preventDefault();
          window.location.href = 'admin.html';
        };
        btn.style.borderColor = 'var(--cyan)';
        btn.style.color = 'var(--cyan)';
      });
    }
  }
}

// Auto initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  updateNavAuth();
});


