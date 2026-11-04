export interface GalleryItem {
  id: string;
  title: string;
  category: 'ps5' | 'pc' | 'sim' | 'cinema' | 'cafe' | 'events';
  categoryLabel: string;
  tagline: string;
  specs: string;
  description: string;
  icon: string;
  accent: string;
  bgGradient: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'PS5 Ultra Console Pods',
    category: 'ps5',
    categoryLabel: 'Console Arena',
    tagline: '4K 120Hz Displays · DualSense Haptics',
    specs: 'Custom Sony PS5 Pods · LG OLED 120Hz · Pulse 3D Audio · Ergonomic Racing Recliners',
    description: 'Immerse yourself in true 4K HDR gaming. Each station is equipped with high-refresh low-lag gaming displays, sanitized DualSense controllers, and comfortable ergonomic seating.',
    icon: '🎮',
    accent: '#00d4ff',
    bgGradient: 'from-cyan-950/70 via-blue-950/40 to-black',
  },
  {
    id: 'gal-2',
    title: 'Pro PC Battle Arena',
    category: 'pc',
    categoryLabel: 'PC Esports',
    tagline: 'GeForce RTX 4090 · 360Hz Monitors',
    specs: 'RTX 4090 / 4070 Liquid Cooled · Intel i9 / Ryzen 7 · 360Hz IPS Panels · 8000Hz Mechanical Keyboards',
    description: 'Engineered for tournament champions. Zero frame drops, sub-10ms server pings, and professional tournament peripherals for tactical shooters like Valorant and CS2.',
    icon: '💻',
    accent: '#8b00ff',
    bgGradient: 'from-purple-950/70 via-indigo-950/40 to-black',
  },
  {
    id: 'gal-3',
    title: 'Motion Racing Cockpit',
    category: 'sim',
    categoryLabel: 'Sim Racing',
    tagline: 'Force Feedback Logitech Wheel & Pedals',
    specs: 'Logitech G29 TrueForce Dual-Motor · Load Cell 3-Pedal Unit · Six-Speed Shifter · Sparco Bucket Cockpit',
    description: 'Feel every curb, apex, and slide with direct force feedback. Connected directly to high-FPS PS5 and PC telemetry rigs for realistic simulation.',
    icon: '🏎️',
    accent: '#f59e0b',
    bgGradient: 'from-amber-950/70 via-orange-950/40 to-black',
  },
  {
    id: 'gal-4',
    title: 'Private Dolby Cinema Suite',
    category: 'cinema',
    categoryLabel: 'OTT & Cinema',
    tagline: 'Giant 4K Projection · 7.2 Dolby Atmos Sound',
    specs: '150-inch 4K Laser Projection · 7.2 Channel Dolby Atmos Surround · Plush Recliners · Netflix/Prime/Hotstar',
    description: 'Enjoy web series, blockbusters, and live esports finals with your entire squad in private air-conditioned acoustic comfort.',
    icon: '🎬',
    accent: '#ec4899',
    bgGradient: 'from-pink-950/70 via-rose-950/40 to-black',
  },
  {
    id: 'gal-5',
    title: 'Gamer Café & Mocktail Bar',
    category: 'cafe',
    categoryLabel: 'Café & Lounge',
    tagline: 'Espresso · Energy Boosters · Fresh Gourmet Bites',
    specs: 'Italian Espresso Station · Handcrafted Mocktail Shakers · Fresh Air-Fried Hot Snacks · In-Seat Delivery',
    description: 'Full-service kitchen bringing piping-hot peri-peri fries, gourmet burgers, sizzling brownies, and ice-cold Monster/Red Bull mocktails right to your gaming station.',
    icon: '☕',
    accent: '#10b981',
    bgGradient: 'from-emerald-950/70 via-teal-950/40 to-black',
  },
  {
    id: 'gal-6',
    title: 'Esports Stage & LAN Showdowns',
    category: 'events',
    categoryLabel: 'Tournaments',
    tagline: 'Weekly EA FC & Tekken Tournaments · Cash Prizes',
    specs: 'Tournament Broadcast Station · Live Shoutcasting Rig · Stage Lighting · Official Leaderboards & Trophies',
    description: 'Weekly tournaments attracting top gamers from Ranaghat and across Nadia. Compete in FIFA, Tekken, and Valorant for cash prizes and bragging rights.',
    icon: '🏆',
    accent: '#00d4ff',
    bgGradient: 'from-sky-950/70 via-cyan-950/40 to-black',
  },
];
