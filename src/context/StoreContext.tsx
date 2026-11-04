"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CafeItem } from "@/data/cafeData";

export interface User {
  name: string;
  email: string;
  role: "customer" | "admin";
  memberId: string;
  phone: string;
  points: number;
  activeSession?: {
    station: string;
    stationType: string;
    startedAt: string;
    durationMinutes: number;
  };
}

export interface CartItem {
  item: CafeItem;
  quantity: number;
}

export interface StationStatus {
  id: string;
  name: string;
  category: "ps5" | "pc" | "sim" | "cinema";
  status: "Available" | "In-Use" | "Reserved" | "Maintenance";
  currentGamer?: string;
  game?: string;
  timeRemaining?: string;
}

export interface Booking {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  timeSlot: string;
  hours: number;
  controllers?: number;
  notes?: string;
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface CafeOrder {
  id: string;
  customerName: string;
  stationOrTable: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "Received" | "Preparing" | "Delivered" | "Cancelled";
  timestamp: string;
}

export interface FeedbackReview {
  id: string;
  name: string;
  rating: number;
  service: string;
  comment: string;
  date: string;
  avatarLetter: string;
}

interface ToastMessage {
  id: string;
  text: string;
  type: "success" | "info" | "error";
}

interface StoreContextType {
  user: User | null;
  login: (email: string, role?: "customer" | "admin") => void;
  logout: () => void;
  cart: CartItem[];
  addToCart: (item: CafeItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  placeOrder: (stationOrTable: string) => void;
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, "id" | "status" | "createdAt">) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  stations: StationStatus[];
  updateStationStatus: (id: string, status: StationStatus["status"]) => void;
  cafeOrders: CafeOrder[];
  updateOrderStatus: (id: string, status: CafeOrder["status"]) => void;
  reviews: FeedbackReview[];
  addReview: (review: Omit<FeedbackReview, "id" | "date" | "avatarLetter">) => void;
  toasts: ToastMessage[];
  showToast: (text: string, type?: "success" | "info" | "error") => void;
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;
  bookingServicePreset: string;
  setBookingServicePreset: (service: string) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  authTab: "login" | "register" | "admin";
  setAuthTab: (tab: "login" | "register" | "admin") => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const INITIAL_STATIONS: StationStatus[] = [
  { id: "ps5-1", name: "PS5 Station 01", category: "ps5", status: "In-Use", currentGamer: "Rohan D.", game: "EA FC 25", timeRemaining: "42 min" },
  { id: "ps5-2", name: "PS5 Station 02", category: "ps5", status: "Available" },
  { id: "ps5-3", name: "PS5 Station 03", category: "ps5", status: "In-Use", currentGamer: "Ayan K.", game: "Tekken 8", timeRemaining: "15 min" },
  { id: "ps5-4", name: "PS5 Station 04", category: "ps5", status: "Available" },
  { id: "ps5-5", name: "PS5 Station 05", category: "ps5", status: "Reserved", currentGamer: "Sayan M." },
  { id: "ps5-6", name: "PS5 Station 06", category: "ps5", status: "Available" },
  { id: "pc-1", name: "RTX 4090 Rig 01", category: "pc", status: "In-Use", currentGamer: "Suman B.", game: "Valorant (360Hz)", timeRemaining: "55 min" },
  { id: "pc-2", name: "RTX 4070 Rig 02", category: "pc", status: "Available" },
  { id: "pc-3", name: "RTX 4070 Rig 03", category: "pc", status: "In-Use", currentGamer: "Priya S.", game: "Cyberpunk 2077", timeRemaining: "1 hr 10 min" },
  { id: "pc-4", name: "RTX 3060 Rig 04", category: "pc", status: "Available" },
  { id: "sim-1", name: "Racing Cockpit G29", category: "sim", status: "In-Use", currentGamer: "Arjun P.", game: "Gran Turismo 7", timeRemaining: "20 min" },
  { id: "cinema-1", name: "Private Dolby Lounge", category: "cinema", status: "Reserved", currentGamer: "Squad Watchparty (5 guests)", timeRemaining: "7:00 PM Slot" },
];

const INITIAL_REVIEWS: FeedbackReview[] = [
  {
    id: "r1",
    name: "Sourav Ganguly (Gamer)",
    rating: 5,
    service: "PS5 Console Arena",
    comment: "Ranaghat finally has a true tier-1 gaming lounge! The 4K 120Hz displays with DualSense controllers feel unreal. Great peri-peri fries too!",
    date: "2 days ago",
    avatarLetter: "S",
  },
  {
    id: "r2",
    name: "Ritobroto Bhattacharya",
    rating: 5,
    service: "PC Battle Rig (RTX 4090)",
    comment: "Sub-10ms ping in Valorant with a genuine 360Hz display. Never played this smoothly outside Kolkata tournaments. Staff is super cooperative.",
    date: "4 days ago",
    avatarLetter: "R",
  },
  {
    id: "r3",
    name: "Aniket & Squad",
    rating: 5,
    service: "Cinema & OTT Suite",
    comment: "Booked the private lounge for India vs Pakistan cricket stream and FIFA matches with friends. Dolby sound and privacy were 10/10.",
    date: "1 week ago",
    avatarLetter: "A",
  },
  {
    id: "r4",
    name: "Debolina Sen",
    rating: 5,
    service: "Gamer Café & Lounge",
    comment: "The Blue Ocean Mocktail and hot chocolate mocha are so refreshing during gaming breaks. Very clean and hygienic atmosphere.",
    date: "1 week ago",
    avatarLetter: "D",
  },
];

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-9021",
    name: "Rohan Das",
    phone: "+91 98300 12345",
    service: "PS5 Station (DualSense)",
    date: "Today",
    timeSlot: "05:00 PM - 07:00 PM",
    hours: 2,
    controllers: 2,
    notes: "FIFA tournament warm up with a friend.",
    status: "Confirmed",
    createdAt: "10 mins ago",
  },
  {
    id: "BK-9022",
    name: "Vikram Chatterjee",
    phone: "+91 87770 98765",
    service: "RTX 4090 PC Battle Station",
    date: "Today",
    timeSlot: "07:30 PM - 09:30 PM",
    hours: 2,
    status: "Confirmed",
    createdAt: "1 hour ago",
  },
];

const INITIAL_CAFE_ORDERS: CafeOrder[] = [
  {
    id: "ORD-101",
    customerName: "Rohan D.",
    stationOrTable: "PS5 Station 01",
    items: [
      { name: "Peri-Peri Spicy Loaded Fries", quantity: 1, price: 90 },
      { name: "Blue Ocean Curacao", quantity: 1, price: 90 },
    ],
    total: 180,
    status: "Delivered",
    timestamp: "15 min ago",
  },
  {
    id: "ORD-102",
    customerName: "Ayan K.",
    stationOrTable: "PS5 Station 03",
    items: [
      { name: "Monster Energy (Ultra)", quantity: 2, price: 240 },
    ],
    total: 240,
    status: "Preparing",
    timestamp: "4 min ago",
  },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [stations, setStations] = useState<StationStatus[]>(INITIAL_STATIONS);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [cafeOrders, setCafeOrders] = useState<CafeOrder[]>(INITIAL_CAFE_ORDERS);
  const [reviews, setReviews] = useState<FeedbackReview[]>(INITIAL_REVIEWS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingServicePreset, setBookingServicePreset] = useState("PlayStation 5 (Console + Controller)");
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register" | "admin">("login");

  // Load persisted demo user or cart on client mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("virtux_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default guest/demo user for pleasant preview
        const demoUser: User = {
          name: "Arpan Roy",
          email: "arpan.gamer@virtux.local",
          role: "customer",
          memberId: "VTX-77402",
          phone: "+91 91477 18768",
          points: 320,
          activeSession: {
            station: "PS5 Station 01",
            stationType: "PlayStation 5 4K",
            startedAt: "18:00",
            durationMinutes: 120,
          },
        };
        setUser(demoUser);
        localStorage.setItem("virtux_user", JSON.stringify(demoUser));
      }
    } catch (e) {
      // safe fallback
    }
  }, []);

  const showToast = (text: string, type: "success" | "info" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const login = (email: string, role: "customer" | "admin" = "customer") => {
    const namePart = email.split("@")[0].replace(/[^a-zA-Z]/g, " ") || "Gamer";
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newUser: User = {
      name: role === "admin" ? "Virtux Master Admin" : formattedName,
      email,
      role,
      memberId: role === "admin" ? "VTX-ADMIN-01" : `VTX-${Math.floor(10000 + Math.random() * 90000)}`,
      phone: "+91 91477 18768",
      points: role === "admin" ? 9999 : 250,
      activeSession: role === "customer" ? {
        station: "PS5 Station 02",
        stationType: "PlayStation 5",
        startedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        durationMinutes: 60,
      } : undefined,
    };
    setUser(newUser);
    localStorage.setItem("virtux_user", JSON.stringify(newUser));
    showToast(
      role === "admin"
        ? "⚡ Admin access granted! Command Center unlocked."
        : `🎮 Welcome back, ${newUser.name}!`,
      "success"
    );
    setIsAuthOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("virtux_user");
    showToast("Logged out successfully. See you at the arena!", "info");
  };

  // Cart operations
  const addToCart = (item: CafeItem) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.item.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    showToast(`Added ${item.name} to café cart! 🍟`, "success");
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.item.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((ci) => {
          if (ci.item.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const placeOrder = (stationOrTable: string) => {
    if (cart.length === 0) return;
    const total = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
    const newOrder: CafeOrder = {
      id: `ORD-${Math.floor(100 + Math.random() * 900)}`,
      customerName: user ? user.name : "Arena Guest",
      stationOrTable: stationOrTable || "Takeaway / Front Counter",
      items: cart.map((ci) => ({
        name: ci.item.name,
        quantity: ci.quantity,
        price: ci.item.price,
      })),
      total,
      status: "Preparing",
      timestamp: "Just now",
    };
    setCafeOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setIsCartOpen(false);
    showToast(`Order #${newOrder.id} confirmed! Delivering to ${newOrder.stationOrTable} shortly 🍔`, "success");
  };

  // Bookings
  const addBooking = (bookingData: Omit<Booking, "id" | "status" | "createdAt">) => {
    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      ...bookingData,
      status: "Confirmed",
      createdAt: "Just now",
    };
    setBookings((prev) => [newBooking, ...prev]);
    setIsBookingOpen(false);
    showToast(`🎉 Reservation confirmed! Booking ID: ${newBooking.id}`, "success");
  };

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    showToast(`Booking #${id} updated to ${status}.`, "info");
  };

  // Stations
  const updateStationStatus = (id: string, status: StationStatus["status"]) => {
    setStations((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
    showToast(`Station ${id} marked as ${status}.`, "info");
  };

  // Orders
  const updateOrderStatus = (id: string, status: CafeOrder["status"]) => {
    setCafeOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    showToast(`Order #${id} marked as ${status}.`, "info");
  };

  // Reviews
  const addReview = (reviewData: Omit<FeedbackReview, "id" | "date" | "avatarLetter">) => {
    const newReview: FeedbackReview = {
      id: `r-${Date.now()}`,
      ...reviewData,
      date: "Just now",
      avatarLetter: (reviewData.name || "G").charAt(0).toUpperCase(),
    };
    setReviews((prev) => [newReview, ...prev]);
    showToast("⭐ Thank you! Your review has been published.", "success");
  };

  return (
    <StoreContext.Provider
      value={{
        user,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        placeOrder,
        bookings,
        addBooking,
        updateBookingStatus,
        stations,
        updateStationStatus,
        cafeOrders,
        updateOrderStatus,
        reviews,
        addReview,
        toasts,
        showToast,
        isBookingOpen,
        setIsBookingOpen,
        bookingServicePreset,
        setBookingServicePreset,
        isAuthOpen,
        setIsAuthOpen,
        authTab,
        setAuthTab,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
