"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";

export const CafeCartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    placeOrder,
    user,
  } = useStore();

  const [deliveryLocation, setDeliveryLocation] = useState("PS5 Station 01");
  const [customNote, setCustomNote] = useState("");

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, ci) => acc + ci.item.price * ci.quantity, 0);
  const discountPercent = user ? (user.points > 200 ? 5 : 0) : 0;
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const finalTotal = subtotal - discountAmount;

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder(deliveryLocation + (customNote ? ` (${customNote})` : ""));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 text-slate-900 flex flex-col shadow-2xl relative">
          {/* Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="text-xl">🍔</span>
              <div>
                <h3 className="font-orbitron font-black text-base text-slate-900">
                  Gamer Fuel Cart
                </h3>
                <p className="text-xs text-[#f92f35] font-rajdhani font-bold">
                  {cart.length} unique item{cart.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-3xl">
                  🍟
                </div>
                <h4 className="font-orbitron text-sm font-bold text-slate-900">Your cart is empty</h4>
                <p className="text-xs text-slate-500 max-w-xs font-sans">
                  Browse our chilled mocktails, espresso, loaded peri-peri fries, and gamer combos to fuel your match!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-4 py-2 rounded-md bg-[#f92f35] text-white text-xs font-orbitron font-bold hover:bg-[#e02228] transition-all"
                >
                  Explore Café Menu
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map(({ item, quantity }) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.isVeg ? "bg-emerald-500" : "bg-red-500"}`} />
                          <h5 className="font-rajdhani font-bold text-sm text-slate-900 truncate">
                            {item.name}
                          </h5>
                        </div>
                        <p className="text-xs text-[#f92f35] font-orbitron font-bold mt-0.5">
                          ₹{item.price * quantity}
                          <span className="text-slate-400 text-[11px] ml-1.5 font-normal">
                            (₹{item.price} each)
                          </span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded border border-slate-200 bg-white overflow-hidden shadow-xs">
                          <button
                            onClick={() => updateCartQuantity(item.id, -1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                          >
                            -
                          </button>
                          <span className="w-7 text-center text-xs font-black font-orbitron text-slate-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, 1)}
                            className="w-7 h-7 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-xs text-slate-500 hover:text-red-600 underline font-rajdhani font-semibold"
                  >
                    Clear All Items
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Footer / Checkout */}
          {cart.length > 0 && (
            <form onSubmit={handleCheckout} className="p-5 border-t border-slate-200 bg-slate-50 space-y-4">
              <div>
                <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1.5">
                  Deliver To Station / Location
                </label>
                <select
                  value={deliveryLocation}
                  onChange={(e) => setDeliveryLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-sm font-rajdhani font-bold text-slate-900 focus:outline-none focus:border-[#f92f35]"
                >
                  <optgroup label="PlayStation 5 Consoles">
                    <option value="PS5 Station 01">PS5 Station 01</option>
                    <option value="PS5 Station 02">PS5 Station 02</option>
                    <option value="PS5 Station 03">PS5 Station 03</option>
                    <option value="PS5 Station 04">PS5 Station 04</option>
                    <option value="PS5 Station 05">PS5 Station 05</option>
                    <option value="PS5 Station 06">PS5 Station 06</option>
                  </optgroup>
                  <optgroup label="PC Battle Stations">
                    <option value="RTX 4090 Rig 01">RTX 4090 Rig 01 (360Hz)</option>
                    <option value="RTX 4070 Rig 02">RTX 4070 Rig 02</option>
                    <option value="RTX 4070 Rig 03">RTX 4070 Rig 03</option>
                    <option value="RTX 3060 Rig 04">RTX 3060 Rig 04</option>
                  </optgroup>
                  <optgroup label="Specialized Zones">
                    <option value="Racing Cockpit G29">Racing Cockpit G29</option>
                    <option value="Private Dolby Lounge">Private Dolby Lounge</option>
                    <option value="Café Table 01">Café Table 01</option>
                    <option value="Café Table 02">Café Table 02</option>
                    <option value="Takeaway / Counter Pickup">Takeaway / Counter Pickup</option>
                  </optgroup>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Special instructions (e.g. extra spicy / less ice)"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-md bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#f92f35]"
                />
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-200 text-xs font-rajdhani font-semibold">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Member Discount ({discountPercent}%)</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-orbitron font-black text-slate-900 pt-1">
                  <span>Total Amount</span>
                  <span className="text-[#f92f35]">₹{finalTotal}</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-md bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-bold text-xs tracking-wider uppercase shadow-crimsonSm transition-all"
              >
                Send Order to Kitchen (₹{finalTotal}) ⚡
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
