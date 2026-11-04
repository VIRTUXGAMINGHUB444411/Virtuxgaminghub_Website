"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore, StationStatus } from "@/context/StoreContext";

export default function AdminPage() {
  const {
    user,
    login,
    stations,
    updateStationStatus,
    bookings,
    updateBookingStatus,
    cafeOrders,
    updateOrderStatus,
    showToast,
  } = useStore();

  const [pinInput, setPinInput] = useState("");
  const [activeAdminTab, setActiveAdminTab] = useState<"stations" | "bookings" | "orders" | "analytics">("stations");

  const isAdmin = user?.role === "admin";

  const handlePinUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "1234" || pinInput === "admin" || pinInput.length >= 4) {
      login("admin@virtuxgaminghub.com", "admin");
    } else {
      showToast("❌ Incorrect PIN. Enter '1234' for demo admin.", "error");
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-6 bg-white text-slate-900">
        <div className="w-full max-w-md p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-6 shadow-clean">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-3xl mx-auto text-[#f92f35]">
            🔒
          </div>

          <div>
            <h2 className="font-orbitron font-black text-2xl text-slate-900">
              Arena Command Center
            </h2>
            <p className="text-xs text-slate-500 font-sans mt-1">
              Protected Administrator Terminal. Enter master 4-digit code.
            </p>
          </div>

          <form onSubmit={handlePinUnlock} className="space-y-4">
            <input
              type="password"
              placeholder="Enter PIN (e.g. 1234)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white border border-slate-200 text-center font-orbitron tracking-widest text-xl text-slate-900 focus:outline-none focus:border-[#f92f35]"
            />

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-bold text-xs uppercase tracking-wider transition-colors shadow-crimsonSm"
            >
              Authenticate Admin Key
            </button>
          </form>

          <button
            onClick={() => login("admin@virtuxgaminghub.com", "admin")}
            className="text-xs text-[#f92f35] hover:underline font-rajdhani font-bold"
          >
            ⚡ Click Here for One-Tap Instant Demo Admin Access
          </button>
        </div>
      </div>
    );
  }

  const inUseCount = stations.filter((s) => s.status === "In-Use").length;
  const availableCount = stations.filter((s) => s.status === "Available").length;
  const totalOrdersAmount = cafeOrders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="relative py-12 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-slate-200 mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f92f35] animate-ping" />
              <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest">
                Admin Control Room
              </span>
            </div>
            <h1 className="font-orbitron font-black text-2xl sm:text-3xl text-slate-900">
              Arena Operations <span className="text-[#f92f35]">Matrix</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 rounded-md bg-slate-100 border border-slate-200 text-xs font-rajdhani font-bold text-slate-700 hover:text-slate-900"
            >
              Player View
            </Link>
            <button
              onClick={() => showToast("Telemetry synchronized across stations.", "info")}
              className="px-3.5 py-1.5 rounded-md bg-red-50 border border-red-200 text-xs font-orbitron font-bold text-[#f92f35] hover:bg-red-100"
            >
              Sync Telemetry 🔄
            </button>
          </div>
        </div>

        {/* Telemetry Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-orbitron text-slate-500 uppercase block font-bold">Active Gamers</span>
            <span className="font-orbitron font-black text-2xl sm:text-3xl text-[#f92f35]">
              {inUseCount} Pods
            </span>
            <span className="text-xs text-slate-500 font-rajdhani font-semibold block mt-1">{availableCount} stations ready</span>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-orbitron text-slate-500 uppercase block font-bold">Reservations</span>
            <span className="font-orbitron font-black text-2xl sm:text-3xl text-slate-900">
              {bookings.length} Bookings
            </span>
            <span className="text-xs text-slate-500 font-rajdhani font-semibold block mt-1">Today&apos;s roster</span>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-orbitron text-slate-500 uppercase block font-bold">Café Kitchen</span>
            <span className="font-orbitron font-black text-2xl sm:text-3xl text-emerald-600">
              ₹{totalOrdersAmount}
            </span>
            <span className="text-xs text-slate-500 font-rajdhani font-semibold block mt-1">{cafeOrders.length} orders processed</span>
          </div>

          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-orbitron text-slate-500 uppercase block font-bold">Ping & Fiber LAN</span>
            <span className="font-orbitron font-black text-2xl sm:text-3xl text-amber-600">
              7.2 ms
            </span>
            <span className="text-xs text-emerald-600 font-rajdhani font-bold block mt-1">99.9% Optical Uptime</span>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200 mb-8 overflow-x-auto">
          {[
            { id: "stations", label: `🎮 Stations Matrix (${stations.length})` },
            { id: "bookings", label: `📅 Bookings Queue (${bookings.length})` },
            { id: "orders", label: `🍔 Café Kitchen (${cafeOrders.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2 rounded-md font-orbitron text-xs font-bold uppercase tracking-wider transition-all ${
                activeAdminTab === tab.id
                  ? "bg-[#f92f35] text-white shadow-crimsonSm"
                  : "bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ══════════ ADMIN: STATIONS ══════════ */}
        {activeAdminTab === "stations" && (
          <div className="space-y-6">
            <p className="text-xs text-slate-500 font-rajdhani font-semibold">
              Click status pills to live toggle station occupancy in the public arena view:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stations.map((st) => (
                <div
                  key={st.id}
                  className="editorial-card p-5 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron font-bold text-sm text-slate-900">
                      {st.name}
                    </span>
                    <span className="text-xs uppercase font-orbitron text-slate-400 font-bold">
                      {st.category}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-rajdhani">
                    {st.currentGamer ? (
                      <p>
                        Current: <strong className="text-[#f92f35]">{st.currentGamer}</strong> ({st.game || "Session"})
                      </p>
                    ) : (
                      <p className="text-emerald-600 font-bold">Station Idle & Cleaned</p>
                    )}
                  </div>

                  {/* Status Toggle Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {(["Available", "In-Use", "Reserved", "Maintenance"] as StationStatus["status"][]).map((status) => (
                      <button
                        key={status}
                        onClick={() => updateStationStatus(st.id, status)}
                        className={`px-2.5 py-1 rounded text-[10px] font-orbitron font-bold transition-all ${
                          st.status === status
                            ? status === "Available"
                              ? "bg-emerald-600 text-white"
                              : status === "In-Use"
                              ? "bg-[#f92f35] text-white"
                              : status === "Reserved"
                              ? "bg-amber-500 text-white"
                              : "bg-slate-800 text-white"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ ADMIN: BOOKINGS ══════════ */}
        {activeAdminTab === "bookings" && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-left text-xs font-rajdhani">
                <thead className="bg-slate-50 text-slate-600 uppercase font-orbitron text-[11px] border-b border-slate-200 font-bold">
                  <tr>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Gamer Details</th>
                    <th className="p-4">Requested Service</th>
                    <th className="p-4">Slot</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50">
                      <td className="p-4 font-orbitron font-bold text-[#f92f35]">{b.id}</td>
                      <td className="p-4">
                        <strong className="text-slate-900 block font-bold text-sm">{b.name}</strong>
                        <span className="text-slate-500">{b.phone}</span>
                      </td>
                      <td className="p-4 text-slate-700 font-semibold">{b.service}</td>
                      <td className="p-4 text-slate-700">
                        {b.date} · {b.timeSlot}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-orbitron font-bold ${
                            b.status === "Confirmed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : b.status === "Completed"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => updateBookingStatus(b.id, "Confirmed")}
                          className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold border border-emerald-200"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, "Completed")}
                          className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold border border-blue-200"
                        >
                          Complete
                        </button>
                        <button
                          onClick={() => updateBookingStatus(b.id, "Cancelled")}
                          className="px-2.5 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100 font-bold border border-red-200"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════ ADMIN: CAFÉ KITCHEN ══════════ */}
        {activeAdminTab === "orders" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cafeOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="editorial-card p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-orbitron font-bold text-sm text-[#f92f35]">
                      {ord.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-orbitron font-bold ${
                        ord.status === "Delivered"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>

                  <div className="text-xs font-rajdhani text-slate-800 font-semibold">
                    <p>
                      Deliver to: <strong className="text-[#f92f35] text-sm">{ord.stationOrTable}</strong>
                    </p>
                    <p className="text-slate-500 font-normal">Customer: {ord.customerName} · {ord.timestamp}</p>
                  </div>

                  <div className="p-3 rounded-md bg-slate-50 border border-slate-200 text-xs font-sans text-slate-700 space-y-1">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{it.name} (x{it.quantity})</span>
                        <span className="font-orbitron text-slate-500 font-bold">₹{it.price * it.quantity}</span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-200 flex justify-between font-orbitron font-black text-slate-900 text-sm">
                      <span>Total</span>
                      <span className="text-[#f92f35]">₹{ord.total}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => updateOrderStatus(ord.id, "Preparing")}
                      className="flex-1 py-1.5 rounded bg-amber-100 text-amber-800 hover:bg-amber-200 text-xs font-orbitron font-bold"
                    >
                      In Kitchen
                    </button>
                    <button
                      onClick={() => updateOrderStatus(ord.id, "Delivered")}
                      className="flex-1 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-orbitron font-bold"
                    >
                      Delivered ✓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
