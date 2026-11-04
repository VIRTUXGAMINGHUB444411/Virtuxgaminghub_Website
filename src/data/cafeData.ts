export interface CafeItem {
  id: string;
  name: string;
  category: 'drinks' | 'snacks' | 'cakes' | 'combos';
  subcategory?: string;
  price: number;
  originalPrice?: number;
  description: string;
  badge?: string;
  isVeg: boolean;
  popular?: boolean;
}

export const CAFE_ITEMS: CafeItem[] = [
  // Hot Coffee & Tea
  { id: 'c1', name: 'Espresso (Single / Double)', category: 'drinks', subcategory: 'Hot Coffee & Tea', price: 60, description: 'Bold, rich roast shot for instant laser focus.', isVeg: true },
  { id: 'c2', name: 'Classic Cappuccino', category: 'drinks', subcategory: 'Hot Coffee & Tea', price: 80, description: 'Velvety micro-foam poured over artisan espresso.', isVeg: true, popular: true },
  { id: 'c3', name: 'Café Latte', category: 'drinks', subcategory: 'Hot Coffee & Tea', price: 90, description: 'Smooth, creamy steamed milk paired with roasted beans.', isVeg: true },
  { id: 'c4', name: 'Caramel Macchiato', category: 'drinks', subcategory: 'Hot Coffee & Tea', price: 110, description: 'Fresh espresso drizzled with golden salted caramel.', isVeg: true },
  { id: 'c5', name: 'Hot Mocha Chocolate', category: 'drinks', subcategory: 'Hot Coffee & Tea', price: 100, description: 'Dutch cocoa blend fused with dark roast coffee.', isVeg: true },
  { id: 'c6', name: 'Masala Kadak Chai', category: 'drinks', subcategory: 'Hot Coffee & Tea', price: 40, description: 'Authentic brewed ginger-cardamom tea.', isVeg: true },
  { id: 'c7', name: 'Green Tea / Lemon Tea', category: 'drinks', subcategory: 'Hot Coffee & Tea', price: 50, description: 'Detoxifying aromatic green tea or zesty lemon tea.', isVeg: true },

  // Energy & Boosters
  { id: 'e1', name: 'Monster Energy (Classic / Ultra)', category: 'drinks', subcategory: 'Energy & Boosters', price: 120, description: 'Unleash the beast with chilled 350ml cans.', isVeg: true, popular: true },
  { id: 'e2', name: 'Red Bull Energy Can (250ml)', category: 'drinks', subcategory: 'Energy & Boosters', price: 130, description: 'Vitalizes body and mind for long ranked grinds.', isVeg: true },
  { id: 'e3', name: 'Sting Berry Blast', category: 'drinks', subcategory: 'Energy & Boosters', price: 50, description: 'High-energy sweet berry carbonated recharge.', isVeg: true },
  { id: 'e4', name: 'Virtux Charged Overdrive', category: 'drinks', subcategory: 'Energy & Boosters', price: 90, description: 'Signature citrus taurine electrolyte house blend.', isVeg: true, badge: 'House Special' },
  { id: 'e5', name: 'Gatorade Electrolyte Cooler', category: 'drinks', subcategory: 'Energy & Boosters', price: 80, description: 'Blue Bolt or Lemon hydration refill.', isVeg: true },
  { id: 'e6', name: 'Protein Shake (Whey 25g)', category: 'drinks', subcategory: 'Energy & Boosters', price: 140, description: 'Chocolate / Vanilla 25g pure whey protein blend.', isVeg: true },

  // Chilled Mocktails & Coolers
  { id: 'm1', name: 'Blue Ocean Curacao', category: 'drinks', subcategory: 'Chilled Mocktails', price: 90, description: 'Electric neon blue citrus mocktail with crushed ice.', isVeg: true, popular: true },
  { id: 'm2', name: 'Virgin Mojito Mint Splash', category: 'drinks', subcategory: 'Chilled Mocktails', price: 85, description: 'Crushed garden mint, freshly squeezed lime and soda.', isVeg: true },
  { id: 'm3', name: 'Green Apple Sparkler Fizz', category: 'drinks', subcategory: 'Chilled Mocktails', price: 85, description: 'Crisp tart green apple syrup topped with bubbling fizz.', isVeg: true },
  { id: 'm4', name: 'Iced Americano Cold Brew', category: 'drinks', subcategory: 'Chilled Mocktails', price: 80, description: 'Slow-steeped Arabica over ice.', isVeg: true },
  { id: 'm5', name: 'Peach Passion Iced Tea', category: 'drinks', subcategory: 'Chilled Mocktails', price: 80, description: 'Infused black tea with sweet peach puree and mint.', isVeg: true },

  // Snacks & Bites
  { id: 's1', name: 'Crispy French Fries (Salted)', category: 'snacks', price: 70, description: 'Golden potato fries seasoned with fine sea salt.', isVeg: true },
  { id: 's2', name: 'Peri-Peri Spicy Loaded Fries', category: 'snacks', price: 90, description: 'Tossed in hot African peri-peri spice dust & garlic dip.', isVeg: true, popular: true },
  { id: 's3', name: 'Cheesy Jalapeño Nachos', category: 'snacks', price: 110, description: 'Tortilla crisps crowned with melted cheddar & salsa.', isVeg: true },
  { id: 's4', name: 'Crispy Chicken Popcorn', category: 'snacks', price: 120, description: 'Bite-sized spiced boneless tender chicken bites.', isVeg: false, popular: true },
  { id: 's5', name: 'Steamed Chicken Momos (6 pcs)', category: 'snacks', price: 110, description: 'Juicy minced chicken dumplings with fiery red chutney.', isVeg: false },
  { id: 's6', name: 'Crispy Veg Momos (6 pcs)', category: 'snacks', price: 80, description: 'Seasoned shredded garden vegetables wrapped and fried.', isVeg: true },
  { id: 's7', name: 'Classic Crispy Chicken Burger', category: 'snacks', price: 120, description: 'Fried chicken patty, chipotle mayo, lettuce in toasted bun.', isVeg: false },
  { id: 's8', name: 'Grilled Paneer Tikka Sandwich', category: 'snacks', price: 100, description: 'Spiced cottage cheese, mint chutney and cheese slices.', isVeg: true },
  { id: 's9', name: 'Mozzarella Cheese Sticks (4 pcs)', category: 'snacks', price: 110, description: 'Crispy crumb-coated stringy cheese with marinara sauce.', isVeg: true },

  // Cakes & Desserts
  { id: 'd1', name: 'Molten Choco Lava Cake', category: 'cakes', price: 90, description: 'Warm cocoa sponge with a center of oozing chocolate.', isVeg: true, popular: true },
  { id: 'd2', name: 'Sizzling Brownie with Vanilla Scoop', category: 'cakes', price: 130, description: 'Hot fudge brownie served sizzling with cold vanilla ice cream.', isVeg: true },
  { id: 'd3', name: 'Red Velvet Cream Cheese Pastry', category: 'cakes', price: 95, description: 'Classic velvety crimson sponge with tangy cream frosting.', isVeg: true },
  { id: 'd4', name: 'Belgian Waffle with Nutella & Choco chips', category: 'cakes', price: 120, description: 'Golden crisp waffle loaded with hazelnut spread.', isVeg: true },
  { id: 'd5', name: 'Chilled Oreo Milkshake', category: 'cakes', price: 100, description: 'Thick creamy shake blended with real Oreo cookies.', isVeg: true },

  // Gamer Combos
  {
    id: 'cb1',
    name: 'Solo Grinder Combo',
    category: 'combos',
    price: 169,
    originalPrice: 210,
    description: '1x Peri-Peri Fries + 1x Monster Energy / Virtux Overdrive Drink.',
    badge: 'Popular',
    isVeg: true,
  },
  {
    id: 'cb2',
    name: 'Duo Co-op Feast',
    category: 'combos',
    price: 299,
    originalPrice: 380,
    description: '1x Crispy Chicken Popcorn / Loaded Nachos + 2x Blue Ocean Mocktails + 1x Large Salted Fries.',
    badge: 'Best Value',
    isVeg: false,
    popular: true,
  },
  {
    id: 'cb3',
    name: 'All-Nighter Squad Platter',
    category: 'combos',
    price: 499,
    originalPrice: 650,
    description: '4x Energy Cans (Red Bull/Monster) + 1x Cheesy Nachos + 1x Chicken Burger + 1x Choco Lava Cake.',
    badge: 'Squad Pick',
    isVeg: false,
  },
  {
    id: 'cb4',
    name: 'Virtux VIP Royale Platter',
    category: 'combos',
    price: 699,
    originalPrice: 890,
    description: '2x Burgers + 2x Loaded Fries + 4x Mocktails/Coolers + 2x Sizzling Brownies delivered to station.',
    badge: 'Royal VIP',
    isVeg: false,
  },
];
