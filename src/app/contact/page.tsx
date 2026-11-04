"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function ContactPage() {
  const { showToast } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("General Arena Inquiry");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("🚀 Message sent! Our team will contact you on WhatsApp/Phone shortly.", "success");
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  };

  return (
    <div className="relative py-12 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-rajdhani text-slate-500 mb-6 uppercase tracking-wider font-semibold">
          <Link href="/" className="hover:text-[#f92f35]">Home</Link>
          <span>/</span>
          <span className="text-[#f92f35] font-bold">Contact & Location</span>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest block mb-2">
            Reach The Arena Crew
          </span>
          <h1 className="text-3xl sm:text-5xl font-orbitron font-black text-slate-900 leading-tight">
            Find Us in <span className="text-[#f92f35]">Ranaghat</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 font-sans leading-relaxed">
            Open daily from morning till night. Whether you want to book for a tournament squad, host a private movie screening, or grab a quick FIFA match, we are ready for you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Information Cards */}
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-2xl shrink-0 text-[#f92f35]">
                📍
              </div>
              <div className="space-y-1">
                <h4 className="font-orbitron font-bold text-slate-900 text-base">Arena Address</h4>
                <p className="text-xs text-[#f92f35] font-rajdhani font-bold">Ranaghat City Centre</p>
                <p className="text-sm text-slate-700 font-sans leading-relaxed pt-1">
                  Srimanta Kundu Lane, Nearby Brojoballav Mandir, Ghotokpara, Ranaghat, Nadia, West Bengal, Pin - 741201
                </p>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-2xl shrink-0 text-[#f92f35]">
                📞
              </div>
              <div className="space-y-1">
                <h4 className="font-orbitron font-bold text-slate-900 text-base">Phone & WhatsApp</h4>
                <p className="text-xs text-[#f92f35] font-rajdhani font-bold">Instant Response Support</p>
                <div className="pt-1 space-y-1">
                  <a href="tel:+919147718768" className="text-sm font-orbitron font-bold text-slate-900 hover:text-[#f92f35] block">
                    +91 91477 18768
                  </a>
                  <a href="tel:+916294713465" className="text-sm font-orbitron font-bold text-slate-900 hover:text-[#f92f35] block">
                    +91 62947 13465
                  </a>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-2xl shrink-0 text-[#f92f35]">
                📧
              </div>
              <div className="space-y-1">
                <h4 className="font-orbitron font-bold text-slate-900 text-base">Email Support</h4>
                <p className="text-xs text-[#f92f35] font-rajdhani font-bold">Business & Queries</p>
                <a
                  href="mailto:consumersupport.virtuxgaminghub@gmail.com"
                  className="text-sm text-slate-700 hover:text-[#f92f35] transition-colors block pt-1 break-all font-sans"
                >
                  consumersupport.virtuxgaminghub@gmail.com
                </a>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-2xl shrink-0 text-[#f92f35]">
                🕐
              </div>
              <div className="space-y-1">
                <h4 className="font-orbitron font-bold text-slate-900 text-base">Operating Hours</h4>
                <p className="text-xs text-[#f92f35] font-rajdhani font-bold">Every Single Day</p>
                <p className="text-base font-orbitron font-black text-slate-900 pt-1">
                  Open Daily: 10:00 am – 9:30 pm
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Inquiry Form */}
          <div className="editorial-card p-8">
            <h3 className="font-orbitron font-black text-2xl text-slate-900 mb-2">
              Send us a <span className="text-[#f92f35]">Direct Message</span>
            </h3>
            <p className="text-xs text-slate-500 font-sans mb-6">
              Have a question about pricing, private booking, or tournament registrations? Drop your note below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sayan Mukherjee"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 91477 18768"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35]"
                />
              </div>

              <div>
                <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                  Interested Service / Subject
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm font-rajdhani font-bold text-slate-900 focus:outline-none focus:border-[#f92f35]"
                >
                  <option value="General Arena Inquiry">General Arena Inquiry</option>
                  <option value="PS5 Console Station Booking">PS5 Console Station Booking</option>
                  <option value="PC Battle Station / LAN Squad">PC Battle Station / LAN Squad</option>
                  <option value="Racing Simulator Cockpit">Racing Simulator Cockpit</option>
                  <option value="Dolby Cinema Private Watch Party">Dolby Cinema Private Watch Party</option>
                  <option value="Esports Tournament Registration">Esports Tournament Registration</option>
                  <option value="Monthly / Weekly Membership Pass">Monthly / Weekly Membership Pass</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we help you plan your gaming session?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35] font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-md bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-bold text-xs uppercase tracking-wider shadow-crimsonSm transition-all"
              >
                Send Message ⚡
              </button>
            </form>
          </div>
        </div>

        {/* Map / Directions Helper */}
        <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🗺️</span>
            <div>
              <h3 className="font-orbitron font-bold text-lg text-slate-900">
                How to Reach Virtux Gaming Hub
              </h3>
              <p className="text-xs text-slate-500 font-rajdhani font-semibold">
                Located conveniently in the heart of Ranaghat city
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-600 font-sans leading-relaxed">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
              <strong className="text-[#f92f35] block font-orbitron text-xs">From Ranaghat Railway Station:</strong>
              Just 5–7 minutes via auto-rickshaw or toto towards Brojoballav Mandir / Ghotokpara.
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
              <strong className="text-[#f92f35] block font-orbitron text-xs">From College More / NH12:</strong>
              Head towards Srimanta Kundu Lane. Look for the illuminated Virtux Gaming Hub signage!
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-1 shadow-xs">
              <strong className="text-[#f92f35] block font-orbitron text-xs">Parking Available:</strong>
              Dedicated two-wheeler and squad parking available directly in front of the arena facility.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
