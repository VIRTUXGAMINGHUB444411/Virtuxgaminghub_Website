"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, showToast } = useStore();
  const [mode, setMode] = useState<"login" | "register" | "admin" | "forgot">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [adminPin, setAdminPin] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || "sourav.gamer@virtux.local", "customer");
    router.push("/dashboard");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email || `${name.toLowerCase().replace(/\s+/g, "")}@virtux.local`, "customer");
    router.push("/dashboard");
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === "1234" || adminPin === "admin" || adminPin.length >= 4) {
      login("admin@virtuxgaminghub.com", "admin");
      router.push("/admin");
    } else {
      showToast("❌ Invalid Master PIN! Use 1234 for demo.", "error");
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Password reset link & OTP sent to ${forgotEmail || "your email"}!`, "success");
    setMode("login");
  };

  const quickDemo = (role: "customer" | "admin") => {
    if (role === "admin") {
      login("admin@virtuxgaminghub.com", "admin");
      router.push("/admin");
    } else {
      login("arpan.roy@virtux.local", "customer");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white border border-slate-200 shadow-cleanLg relative">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-md bg-[#f92f35] p-1.5 mx-auto flex items-center justify-center mb-3 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Virtux" className="w-full h-full object-contain filter brightness-200" />
          </div>
          <h2 className="font-orbitron font-black text-2xl text-slate-900">
            VIRTUX GAMING HUB
          </h2>
          <p className="text-xs font-rajdhani text-[#f92f35] font-bold tracking-widest uppercase mt-0.5">
            Player Access & Station Pass
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 mb-6 gap-2">
          <button
            onClick={() => setMode("login")}
            className={`pb-3 text-xs font-orbitron font-bold tracking-wider uppercase transition-colors relative flex-1 text-center ${
              mode === "login"
                ? "text-[#f92f35] border-b-2 border-[#f92f35]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`pb-3 text-xs font-orbitron font-bold tracking-wider uppercase transition-colors relative flex-1 text-center ${
              mode === "register"
                ? "text-[#f92f35] border-b-2 border-[#f92f35]"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Register
          </button>
          <button
            onClick={() => setMode("admin")}
            className={`pb-3 text-xs font-orbitron font-bold tracking-wider uppercase transition-colors relative flex-1 text-center ${
              mode === "admin"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Admin PIN
          </button>
        </div>

        {/* LOGIN FORM */}
        {mode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Gamer Email / Phone
              </label>
              <input
                type="text"
                placeholder="player@virtux.local or phone"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35] font-rajdhani font-semibold"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-orbitron font-bold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setMode("forgot")}
                  className="text-[11px] text-[#f92f35] hover:underline font-rajdhani font-bold"
                >
                  Forgot Password?
                </button>
              </div>
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
              className="w-full py-3 rounded-md bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-bold text-xs uppercase tracking-wider transition-all shadow-crimsonSm"
            >
              Sign In to Player Portal ⚡
            </button>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] text-slate-400 block text-center font-rajdhani font-semibold">
                One-Click Instant Preview:
              </span>
              <button
                type="button"
                onClick={() => quickDemo("customer")}
                className="w-full py-2 rounded-md bg-slate-100 border border-slate-200 text-xs font-rajdhani font-bold text-slate-800 hover:bg-slate-200"
              >
                🎮 Quick Demo Gamer Login (Arpan Roy)
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Full Name / Gamer Tag
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35] font-rajdhani font-semibold"
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
                Phone Number
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
              Create Virtux Account 🚀
            </button>
          </form>
        )}

        {/* ADMIN PIN FORM */}
        {mode === "admin" && (
          <form onSubmit={handleAdminSubmit} className="space-y-4">
            <div className="p-3.5 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 font-rajdhani leading-relaxed">
              🔒 Arena Manager / Administrative console. Master PIN: <strong>1234</strong>.
            </div>

            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Master Security Code
              </label>
              <input
                type="password"
                placeholder="1234"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white border border-slate-200 text-center font-orbitron tracking-widest text-xl text-slate-900 focus:outline-none focus:border-[#f92f35]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-orbitron font-bold text-xs uppercase tracking-wider"
            >
              Access Command Center
            </button>

            <button
              type="button"
              onClick={() => quickDemo("admin")}
              className="w-full py-2 rounded-md bg-slate-100 border border-slate-200 text-xs font-rajdhani font-bold text-slate-700 hover:bg-slate-200"
            >
              ⚡ Instant 1-Click Admin Access (Demo)
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div className="text-xs text-slate-600 font-sans">
              Enter your registered email address or phone number and we will send an OTP reset code.
            </div>

            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Your Email / Phone
              </label>
              <input
                type="text"
                required
                placeholder="player@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-md bg-[#f92f35] text-white font-orbitron font-bold text-xs uppercase tracking-wider"
            >
              Send Reset Code 📧
            </button>

            <button
              type="button"
              onClick={() => setMode("login")}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-900 underline font-rajdhani"
            >
              ← Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
