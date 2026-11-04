"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function DashboardPage() {
  const { user, bookings, cafeOrders, logout, showToast, setIsBookingOpen, setIsCartOpen } = useStore();
  const [activeTab, setActiveTab] = useState<"session" | "bookings" | "orders" | "profile">("session");

  const [gamerTag, setGamerTag] = useState(user?.name || "Arpan Roy");
  const [phone, setPhone] = useState(user?.phone || "+91 91477 18768");
  const [favoriteGame, setFavoriteGame] = useState("EA Sports FC 25");

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-white text-slate-900">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-3xl mb-4 text-[#f92f35]">
          👤
        </div>
        <h2 className="font-orbitron font-black text-2xl text-slate-900 mb-2">
          Player Access Required
        </h2>
        <p className="text-sm text-slate-600 max-w-sm mb-6 font-sans">
          Log in with your Virtux account to access active station time, booking history, and café orders.
        </p>
        <Link
          href="/login"
          className="btn-red-action"
        >
          <span>Sign In / Create Gamer Tag</span>
        </Link>
      </div>
    );
  }

  const copyMemberId = () => {
    navigator.clipboard.writeText(user.memberId);
    showToast(`Copied Member ID: ${user.memberId} to clipboard!`, "info");
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Profile settings updated successfully!", "success");
  };

  return (
    <div className="relative py-12 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-rajdhani text-slate-500 mb-6 uppercase tracking-wider font-semibold">
          <Link href="/" className="hover:text-[#f92f35]">Home</Link>
          <span>/</span>
          <span className="text-[#f92f35] font-bold">Player Dashboard</span>
        </div>

        {/* Gamer Profile Header Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-200 mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative shadow-clean">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-[#f92f35] p-1 flex items-center justify-center shadow-md shrink-0">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-orbitron font-black text-2xl text-[#f92f35]">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <h1 className="font-orbitron font-black text-2xl sm:text-3xl text-slate-900">
                  {user.name}
                </h1>
                <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Active Player
                </span>
              </div>

              <p className="text-xs text-slate-500 font-rajdhani font-semibold">
                {user.email} · {user.phone}
              </p>

              {/* Member ID with Copy Button */}
              <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <div className="px-3 py-1 rounded bg-white border border-slate-200 font-orbitron text-xs font-bold text-[#f92f35] shadow-xs">
                  ID: {user.memberId}
                </div>
                <button
                  onClick={copyMemberId}
                  className="px-2.5 py-1 rounded bg-white border border-slate-200 text-xs font-rajdhani font-bold text-slate-700 hover:text-slate-900 shadow-xs"
                >
                  Copy ID 📋
                </button>
                <div className="px-3 py-1 rounded bg-slate-200 text-slate-800 font-orbitron text-xs font-bold">
                  Level 8 · {user.points} XP Points
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsBookingOpen(true)}
              className="btn-red-action text-xs py-2 px-4"
            >
              PLAY NOW
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-md bg-white border border-slate-200 text-slate-700 hover:text-red-600 text-xs font-orbitron font-bold shadow-xs transition-colors"
            >
              Logout 🚪
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-8 overflow-x-auto">
          {[
            { id: "session", label: "⚡ Active Station HUD" },
            { id: "bookings", label: `📅 My Bookings (${bookings.length})` },
            { id: "orders", label: `🍔 Café Orders (${cafeOrders.length})` },
            { id: "profile", label: "⚙️ Profile Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-md font-orbitron text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#f92f35] text-white shadow-crimsonSm"
                  : "bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════ TAB: ACTIVE SESSION ══════════ */}
        {activeTab === "session" && (
          <div className="space-y-8">
            <div className="editorial-card p-6 sm:p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-orbitron font-bold text-emerald-600 uppercase">
                      Live Arena Session Assigned
                    </span>
                  </div>
                  <h3 className="font-orbitron font-black text-2xl sm:text-3xl text-slate-900">
                    {user.activeSession?.station || "PS5 Station 01"}
                  </h3>
                  <p className="text-xs text-slate-500 font-rajdhani font-semibold mt-1">
                    {user.activeSession?.stationType || "PlayStation 5 (4K 120Hz)"} · Session Started at {user.activeSession?.startedAt || "18:00"}
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-2">
                  <span className="text-[11px] font-orbitron text-slate-400 uppercase font-bold">
                    Time Remaining
                  </span>
                  <div className="font-orbitron font-black text-3xl sm:text-4xl text-[#f92f35]">
                    42:18 min
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => showToast("Extended station time by +30 minutes!", "success")}
                      className="px-3 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs font-orbitron font-bold hover:bg-slate-200"
                    >
                      + Extend 30m
                    </button>
                    <button
                      onClick={() => setIsCartOpen(true)}
                      className="px-3 py-1.5 rounded-md bg-[#f92f35] text-white text-xs font-orbitron font-bold hover:bg-[#e02228] shadow-xs"
                    >
                      Order Food 🍔
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-8 pt-6 border-t border-slate-100 space-y-2">
                <div className="flex justify-between text-xs font-rajdhani text-slate-500 font-semibold">
                  <span>Session Elapsed: 78 mins</span>
                  <span>Total Booked: 120 mins</span>
                </div>
                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#f92f35] to-red-400 rounded-full w-[65%]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-2xl">⚡</span>
                <h4 className="font-orbitron font-bold text-slate-900 text-sm">Need Controller / Headset?</h4>
                <p className="text-xs text-slate-600 font-sans">
                  Notify arena staff directly or request sanitized DualSense controllers at the counter.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-2xl">☕</span>
                <h4 className="font-orbitron font-bold text-slate-900 text-sm">Active 5% Café Perk</h4>
                <p className="text-xs text-slate-600 font-sans">
                  Your VIP player tag entitles you to 5% off on all snacks, burgers, and cold mocktails.
                </p>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-2xl">🏆</span>
                <h4 className="font-orbitron font-bold text-slate-900 text-sm">Weekly FIFA Cup</h4>
                <p className="text-xs text-slate-600 font-sans">
                  Registered for the Saturday EA FC 25 tournament? Leaderboards update every Sunday.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ TAB: BOOKINGS ══════════ */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-orbitron font-black text-lg text-slate-900">
                Arena Reservations
              </h3>
              <button
                onClick={() => setIsBookingOpen(true)}
                className="px-3.5 py-1.5 rounded-md bg-[#f92f35] text-white font-orbitron font-bold text-xs uppercase"
              >
                + New Reservation
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-xl bg-slate-50">
                {"No active bookings found. Click \"New Reservation\" to book a station!"}
              </div>
            ) : (
              bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-orbitron font-bold text-sm text-[#f92f35]">{b.id}</span>
                      <span className="text-[10px] font-orbitron font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {b.status}
                      </span>
                    </div>
                    <h4 className="font-rajdhani font-bold text-base text-slate-900">{b.service}</h4>
                    <p className="text-xs text-slate-500 font-rajdhani font-semibold">
                      📅 {b.date} · ⏰ {b.timeSlot} ({b.hours} hrs)
                    </p>
                  </div>

                  <div className="text-right">
                    <button
                      onClick={() => showToast(`Reschedule request sent for booking #${b.id}`, "info")}
                      className="px-3 py-1.5 rounded-md border border-slate-200 text-xs font-rajdhani font-bold text-slate-700 hover:bg-slate-100"
                    >
                      Reschedule
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ══════════ TAB: ORDERS ══════════ */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-orbitron font-black text-lg text-slate-900">
                Café In-Seat Orders
              </h3>
              <button
                onClick={() => setIsCartOpen(true)}
                className="px-3.5 py-1.5 rounded-md bg-[#f92f35] text-white font-orbitron font-bold text-xs uppercase"
              >
                Open Café Cart 🍔
              </button>
            </div>

            {cafeOrders.length === 0 ? (
              <div className="p-8 text-center text-slate-500 border border-slate-200 rounded-xl bg-slate-50">
                No café orders yet. Order cold mocktails, fries or burgers directly to your station!
              </div>
            ) : (
              cafeOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-orbitron font-bold text-sm text-[#f92f35]">{ord.id}</span>
                      <span
                        className={`text-[10px] font-orbitron font-bold px-2 py-0.5 rounded ${
                          ord.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-rajdhani font-bold">
                      Destination: <strong className="text-[#f92f35]">{ord.stationOrTable}</strong> · {ord.timestamp}
                    </p>

                    <div className="text-xs text-slate-600 font-sans">
                      {ord.items.map((it, idx) => (
                        <span key={idx} className="mr-2">
                          • {it.name} (x{it.quantity})
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-orbitron font-black text-lg text-slate-900 block">
                      ₹{ord.total}
                    </span>
                    <span className="text-[11px] text-slate-400 font-rajdhani font-semibold">
                      Cash / UPI at billing
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ══════════ TAB: PROFILE ══════════ */}
        {activeTab === "profile" && (
          <div className="max-w-xl">
            <div className="editorial-card p-6 sm:p-8">
              <h3 className="font-orbitron font-bold text-xl text-slate-900 mb-4">
                Update Gamer Profile
              </h3>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                    Gamer Tag / Display Name
                  </label>
                  <input
                    type="text"
                    value={gamerTag}
                    onChange={(e) => setGamerTag(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                    Favorite Arena Game
                  </label>
                  <input
                    type="text"
                    value={favoriteGame}
                    onChange={(e) => setFavoriteGame(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-md bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-bold text-xs uppercase tracking-wider"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
