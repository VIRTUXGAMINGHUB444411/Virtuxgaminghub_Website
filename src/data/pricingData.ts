export interface RateItem {
  duration: string;
  price: number;
  highlight?: boolean;
}

export interface SubscriptionPack {
  hours: number;
  oldPrice: number;
  price: number;
  highlight?: boolean;
}

export interface MembershipWeekly {
  hoursPerDay: number;
  totalHours: number;
  price: number;
  highlight?: boolean;
}

export interface MembershipMonthly {
  hoursPerDay: number;
  totalHours: number;
  price: number;
  highlight?: boolean;
}

export const PS5_NORMAL_RATES: RateItem[] = [
  { duration: "30 Minutes", price: 80 },
  { duration: "1 Hour", price: 139 },
  { duration: "2 Hours", price: 239 },
  { duration: "3 Hours", price: 299, highlight: true },
];

export const PS5_EXTRA_CONTROLLER_RATES: RateItem[] = [
  { duration: "30 Minutes", price: 40 },
  { duration: "1 Hour", price: 59 },
  { duration: "2 Hours", price: 99 },
  { duration: "3 Hours", price: 119, highlight: true },
];

export const PS5_SUBSCRIPTIONS: SubscriptionPack[] = [
  { hours: 10, oldPrice: 1399, price: 1099 },
  { hours: 20, oldPrice: 2399, price: 1999 },
  { hours: 30, oldPrice: 2999, price: 2799 },
  { hours: 40, oldPrice: 4799, price: 3599 },
  { hours: 60, oldPrice: 5999, price: 4999 },
  { hours: 80, oldPrice: 9599, price: 6899 },
  { hours: 100, oldPrice: 10799, price: 8299, highlight: true },
];

export const PS5_DUO_SUBSCRIPTIONS: SubscriptionPack[] = [
  { hours: 10, oldPrice: 1999, price: 1699 },
  { hours: 20, oldPrice: 3399, price: 3259 },
  { hours: 30, oldPrice: 4199, price: 4099 },
  { hours: 40, oldPrice: 6799, price: 5299 },
  { hours: 60, oldPrice: 8399, price: 7699 },
  { hours: 80, oldPrice: 13599, price: 9999 },
  { hours: 100, oldPrice: 15199, price: 11199, highlight: true },
];

export const PC_NORMAL_RATES: RateItem[] = [
  { duration: "30 Minutes", price: 65 },
  { duration: "1 Hour", price: 119 },
  { duration: "2 Hours", price: 199 },
  { duration: "3 Hours", price: 239, highlight: true },
];

export const PC_SUBSCRIPTIONS: SubscriptionPack[] = [
  { hours: 10, oldPrice: 1199, price: 999 },
  { hours: 20, oldPrice: 1999, price: 1799 },
  { hours: 30, oldPrice: 2399, price: 2299 },
  { hours: 40, oldPrice: 3999, price: 2999 },
  { hours: 60, oldPrice: 4799, price: 4299 },
  { hours: 80, oldPrice: 8999, price: 5399 },
  { hours: 100, oldPrice: 10799, price: 6499, highlight: true },
];

export const MOVIE_RATES: RateItem[] = [
  { duration: "1 Hour", price: 40 },
  { duration: "2 Hours", price: 70 },
  { duration: "3 Hours", price: 100, highlight: true },
];

export const SIMULATOR_RATES: RateItem[] = [
  { duration: "30 Minutes Quick Lap", price: 70 },
  { duration: "1 Hour Session", price: 120 },
  { duration: "2 Hours Championship", price: 210, highlight: true },
  { duration: "3 Hours Endurance", price: 270 },
];

// Limited Memberships (Weekly & Monthly)
export const MEMBERSHIP_LIMITED_WEEKLY = {
  ps5: [
    { hoursPerDay: 1, totalHours: 7, price: 849 },
    { hoursPerDay: 2, totalHours: 14, price: 1699 },
    { hoursPerDay: 3, totalHours: 21, price: 2499 },
    { hoursPerDay: 4, totalHours: 28, price: 3199 },
    { hoursPerDay: 5, totalHours: 35, price: 3899, highlight: true },
  ],
  ps5Duo: [
    { hoursPerDay: 1, totalHours: 7, price: 1199 },
    { hoursPerDay: 2, totalHours: 14, price: 2299 },
    { hoursPerDay: 3, totalHours: 21, price: 3399 },
    { hoursPerDay: 4, totalHours: 28, price: 4499 },
    { hoursPerDay: 5, totalHours: 35, price: 5449, highlight: true },
  ],
  pc: [
    { hoursPerDay: 1, totalHours: 7, price: 749 },
    { hoursPerDay: 2, totalHours: 14, price: 1449 },
    { hoursPerDay: 3, totalHours: 21, price: 2099 },
    { hoursPerDay: 4, totalHours: 28, price: 2749 },
    { hoursPerDay: 5, totalHours: 35, price: 3359, highlight: true },
  ],
};

export const MEMBERSHIP_LIMITED_MONTHLY = {
  ps5: [
    { hoursPerDay: 1, totalHours: 30, price: 3559 },
    { hoursPerDay: 2, totalHours: 60, price: 6899 },
    { hoursPerDay: 3, totalHours: 90, price: 10199 },
    { hoursPerDay: 4, totalHours: 120, price: 13199 },
    { hoursPerDay: 5, totalHours: 150, price: 15749, highlight: true },
  ],
  ps5Duo: [
    { hoursPerDay: 1, totalHours: 30, price: 5059 },
    { hoursPerDay: 2, totalHours: 60, price: 9959 },
    { hoursPerDay: 3, totalHours: 90, price: 14659 },
    { hoursPerDay: 4, totalHours: 120, price: 18999 },
    { hoursPerDay: 5, totalHours: 150, price: 23199, highlight: true },
  ],
  pc: [
    { hoursPerDay: 1, totalHours: 30, price: 3149 },
    { hoursPerDay: 2, totalHours: 60, price: 6099 },
    { hoursPerDay: 3, totalHours: 90, price: 8899 },
    { hoursPerDay: 4, totalHours: 120, price: 11499 },
    { hoursPerDay: 5, totalHours: 150, price: 13949, highlight: true },
  ],
};

// Unlimited Memberships
export const MEMBERSHIP_UNLIMITED = {
  weekly: {
    ps5: 4399,
    ps5Duo: 5999,
    pc: 3999,
  },
  monthly: {
    ps5: 14999,
    ps5Duo: 19999,
    pc: 13999,
  },
};

export const PRICING_RULES = {
  overtime: {
    ps5: "₹2/min after booked session",
    ps5Controller: "₹1/min after booked session",
    pc: "₹1.5/min after booked session",
  },
  movieRules: "Covers up to 3 people. Beyond 3 people: ₹15 per extra person.",
  limitedDisclaimer: "Transferable membership. Current holder avails benefits. 5% café discount on weekly, 10% on monthly.",
  unlimitedDisclaimer: "Non-transferable personal membership. Free daily tea/coffee/refreshment on Monthly Unlimited + 10% café discount.",
};
