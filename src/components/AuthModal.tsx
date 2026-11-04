"use client";

import React, { useState } from "react";
import { useStore } from "@/context/StoreContext";

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen, authTab, setAuthTab, login, showToast } = useStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [adminPin, setAdminPin] = useState("");

  if (!isAuthOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "player.ranaghat@virtux.local", "customer");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || `${name.toLowerCase().replace(/\s+/g, "")}@virtux.local`, "customer");
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === "1234" || adminPin === "admin" || adminPin === "9999" || adminPin.length >= 4) {
      login("admin@virtuxgaminghub.com", "admin");
    } else {
      showToast("❌ Invalid Security Code! (Demo code is: 1234)", "error");
    }
  };

  const quickDemoLogin = (role: "customer" | "admin") => {
    if (role === "admin") {
      login("admin@virtuxgaminghub.com", "admin");
    } else {
      login("sourav.gamer@virtux.local", "customer");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsAuthOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl text-slate-900 z-10">
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-5 right-5 p-1 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            onClick={() => setAuthTab("login")}
            className={`pb-3 text-xs font-orbitron font-bold tracking-wider uppercase transition-colors relative ${
              authTab === "login"
                ? "text-[#f92f35] border-b-2 border-[#f92f35]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Player Login
          </button>
          <button
            onClick={() => setAuthTab("register")}
            className={`pb-3 text-xs font-orbitron font-bold tracking-wider uppercase transition-colors relative ${
              authTab === "register"
                ? "text-[#f92f35] border-b-2 border-[#f92f35]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setAuthTab("admin")}
            className={`pb-3 text-xs font-orbitron font-bold tracking-wider uppercase transition-colors relative ${
              authTab === "admin"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Admin PIN
          </button>
        </div>

        {/* Player Login Form */}
        {authTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Gamer Email / Phone
              </label>
              <input
                type="text"
                placeholder="gamer@virtux.local or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
              />
            </div>

            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-crimsonSm"
            >
              Log In to Player Hub
            </button>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => quickDemoLogin("customer")}
                className="w-full py-2 rounded-md bg-slate-100 border border-slate-200 text-xs font-rajdhani font-bold text-slate-800 hover:bg-slate-200"
              >
                🎮 Quick Demo Gamer Login (Arpan Roy)
              </button>
            </div>
          </form>
        )}

        {/* Register Form */}
        {authTab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Full Name / Gamer Tag
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
              />
            </div>

            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
              />
            </div>

            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                WhatsApp Phone
              </label>
              <input
                type="tel"
                placeholder="+91 91477 18768"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
              />
            </div>

            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Create Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-crimsonSm"
            >
              Create Virtux Gamer Pass 🚀
            </button>
          </form>
        )}

        {/* Admin Login */}
        {authTab === "admin" && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 font-rajdhani">
              🔒 Arena Manager / Admin Access. Requires 4-digit PIN.
            </div>

            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Master Security PIN
              </label>
              <input
                type="password"
                placeholder="1234"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 text-center tracking-widest text-lg text-slate-900 focus:outline-none focus:border-[#f92f35] font-orbitron"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-orbitron font-bold text-xs uppercase tracking-wider"
            >
              Authenticate Control Center
            </button>

            <button
              type="button"
              onClick={() => quickDemoLogin("admin")}
              className="w-full py-2 rounded-md bg-slate-100 border border-slate-200 text-xs font-rajdhani font-bold text-slate-700 hover:bg-slate-200"
            >
              ⚡ Quick Demo Admin Access (PIN: 1234)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
