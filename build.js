const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const staticFiles = [
  'index.html',
  'about.html',
  'cafe.html',
  'pricing.html',
  'gallery.html',
  'contact.html',
  'feedback.html',
  'login.html',
  'admin.html',
  'dashboard.html',
  'styles.css',
  'script.js',
  'logo.png'
];

staticFiles.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(publicDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} -> public/${file}`);
  }
});

console.log('Build complete: all static assets synced to public/');

