"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";
import { CAFE_ITEMS } from "@/data/cafeData";

export default function CafePage() {
  const { cart, addToCart, updateCartQuantity, setIsCartOpen } = useStore();
  const [activeCategory, setActiveCategory] = useState<"drinks" | "snacks" | "cakes" | "combos">("drinks");
  const [vegOnly, setVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = CAFE_ITEMS.filter((item) => {
    if (item.category !== activeCategory) return false;
    if (vegOnly && !item.isVeg) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);
    }
    return true;
  });

  const getItemQuantity = (id: string) => {
    const found = cart.find((ci) => ci.item.id === id);
    return found ? found.quantity : 0;
  };

  const totalCartCount = cart.reduce((acc, ci) => acc + ci.quantity, 0);
  const totalCartSum = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);

  return (
    <div className="relative py-12 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-rajdhani text-slate-500 mb-6 uppercase tracking-wider font-semibold">
          <Link href="/" className="hover:text-[#f92f35]">Home</Link>
          <span>/</span>
          <span className="text-[#f92f35] font-bold">Café & Lounge</span>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-2xl">
            <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest block mb-2">
              Gamer Fuel & Refreshments
            </span>
            <h1 className="text-3xl sm:text-5xl font-orbitron font-black text-slate-900 leading-tight">
              Virtux <span className="text-[#f92f35]">Café & Bites</span>
            </h1>
            <p className="mt-3 text-base text-slate-600 font-sans leading-relaxed">
              Premium roasts, chilled mocktails, high-voltage energy cans, loaded peri-peri fries, gourmet burgers, and artisan desserts delivered directly to your gaming station.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-4 shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#f92f35] text-white flex items-center justify-center text-xl shadow-xs">
              🚀
            </div>
            <div>
              <span className="text-xs font-orbitron font-black text-slate-900 block">
                Direct In-Seat Delivery
              </span>
              <span className="text-xs font-rajdhani text-[#f92f35] font-bold">
                Playing right now? Just enter your station number!
              </span>
            </div>
          </div>
        </div>

        {/* Menu Navigation & Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "drinks", label: "☕ Drinkable Items" },
              { id: "snacks", label: "🍟 Snacks & Bites" },
              { id: "cakes", label: "🎂 Cakes & Desserts" },
              { id: "combos", label: "🎁 Gamer Combos" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-4 py-2 rounded-md font-orbitron text-xs font-bold uppercase tracking-wider transition-all ${
                  activeCategory === tab.id
                    ? "bg-[#f92f35] text-white shadow-crimsonSm"
                    : "bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search coffee, burger..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-3.5 py-2 rounded-md bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#f92f35]"
            />

            <label className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-100 border border-slate-200 cursor-pointer text-xs font-rajdhani font-bold">
              <input
                type="checkbox"
                checked={vegOnly}
                onChange={(e) => setVegOnly(e.target.checked)}
                className="w-3.5 h-3.5 text-emerald-600 rounded focus:ring-0"
              />
              <span className={vegOnly ? "text-emerald-700" : "text-slate-600"}>Veg Only</span>
            </label>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredItems.map((item) => {
            const qty = getItemQuantity(item.id);
            return (
              <div
                key={item.id}
                className="editorial-card p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          item.isVeg ? "bg-emerald-500" : "bg-red-500"
                        }`}
                        title={item.isVeg ? "Vegetarian" : "Non-Vegetarian"}
                      />
                      {item.subcategory && (
                        <span className="text-[10px] font-orbitron uppercase text-slate-500 font-bold">
                          {item.subcategory}
                        </span>
                      )}
                    </div>

                    {item.badge && (
                      <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-red-50 text-[#f92f35] border border-red-200">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="font-orbitron font-bold text-base text-slate-900 group-hover:text-[#f92f35] transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-xs text-slate-600 font-sans mt-1.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron font-black text-lg text-slate-900">
                      ₹{item.price}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs line-through text-slate-400">
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  {qty > 0 ? (
                    <div className="flex items-center rounded-md border border-[#f92f35] bg-red-50 overflow-hidden">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="w-8 h-8 flex items-center justify-center text-[#f92f35] font-bold hover:bg-red-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-black font-orbitron text-slate-900">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#f92f35] font-bold hover:bg-red-100"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3.5 py-1.5 rounded-md bg-[#f92f35] text-white text-xs font-orbitron font-bold hover:bg-[#e02228] transition-colors shadow-xs"
                    >
                      + Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Floating Cart Trigger Pill */}
        {totalCartCount > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-6 py-3 rounded-full bg-[#f92f35] text-white font-orbitron font-black text-xs uppercase tracking-wider shadow-crimson flex items-center gap-3 animate-bounce"
            >
              <span>🍔 View Cart ({totalCartCount} items)</span>
              <span className="bg-black/30 px-2.5 py-0.5 rounded-full text-white">
                ₹{totalCartSum}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
