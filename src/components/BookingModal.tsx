"use client";

import React, { useState, useEffect } from "react";
import { useStore } from "@/context/StoreContext";

export const BookingModal: React.FC = () => {
  const { isBookingOpen, setIsBookingOpen, bookingServicePreset, addBooking, user } = useStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState(bookingServicePreset);
  const [date, setDate] = useState("Today");
  const [timeSlot, setTimeSlot] = useState("06:00 PM");
  const [hours, setHours] = useState(2);
  const [extraController, setExtraController] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (bookingServicePreset) {
      setService(bookingServicePreset);
    }
    if (user) {
      setName(user.name);
      setPhone(user.phone || "+91 91477 18768");
    }
  }, [bookingServicePreset, user, isBookingOpen]);

  if (!isBookingOpen) return null;

  let estimatedPrice = 0;
  if (service.includes("PS5")) {
    const basePS5 = hours === 1 ? 139 : hours === 2 ? 239 : hours === 3 ? 299 : hours * 110;
    const controllerCost = extraController ? (hours === 1 ? 59 : hours === 2 ? 99 : hours === 3 ? 119 : hours * 40) : 0;
    estimatedPrice = basePS5 + controllerCost;
  } else if (service.includes("PC")) {
    estimatedPrice = hours === 1 ? 119 : hours === 2 ? 199 : hours === 3 ? 239 : hours * 90;
  } else if (service.includes("Racing") || service.includes("Simulator")) {
    estimatedPrice = hours === 1 ? 120 : hours === 2 ? 210 : hours === 3 ? 270 : hours * 100;
  } else if (service.includes("Movie") || service.includes("Cinema")) {
    estimatedPrice = hours === 1 ? 40 : hours === 2 ? 70 : hours === 3 ? 100 : hours * 35;
  } else {
    estimatedPrice = 199;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addBooking({
      name: name || "Gamer Champion",
      phone: phone || "+91 91477 18768",
      service: `${service} (${hours} Hour${hours > 1 ? "s" : ""}${extraController ? " + Extra Controller" : ""})`,
      date,
      timeSlot,
      hours,
      controllers: extraController ? 2 : 1,
      notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsBookingOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 p-6 md:p-8 shadow-2xl text-slate-900 z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#f92f35] text-white flex items-center justify-center text-sm font-bold shadow-xs">
              ⚡
            </div>
            <div>
              <h3 className="font-orbitron font-black text-lg text-slate-900">
                Reserve Station
              </h3>
              <p className="text-xs text-[#f92f35] font-rajdhani font-bold">
                Instant Lock-In · Zero Hidden Fees · Pay at Counter
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsBookingOpen(false)}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-800 hover:bg-slate-100"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Gamer Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Suman Roy"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35] font-rajdhani font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                required
                placeholder="+91 98000 00000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35] font-rajdhani font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
              Select Gaming Station
            </label>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35] font-rajdhani font-bold"
            >
              <option value="PlayStation 5 (Console + Controller)">🎮 PlayStation 5 4K 120Hz Arena</option>
              <option value="Gaming PC Battle Station (RTX Rigs)">💻 High-FPS RTX Gaming PC Battle Station</option>
              <option value="Racing Simulator (Logitech G29)">🏎️ Motion Racing Cockpit (Logitech G29)</option>
              <option value="Dolby Cinema & OTT Suite">🎬 Private Dolby Cinema & Squad Suite</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Date
              </label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35] font-rajdhani font-semibold"
              >
                <option value="Today">Today (Open until 9:30 PM)</option>
                <option value="Tomorrow">Tomorrow</option>
                <option value="This Weekend">This Coming Weekend</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Preferred Slot
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35] font-rajdhani font-semibold"
              >
                <option value="11:00 AM">11:00 AM (Morning Grind)</option>
                <option value="01:00 PM">01:00 PM (Afternoon)</option>
                <option value="03:30 PM">03:30 PM (Matinee)</option>
                <option value="05:30 PM">05:30 PM (Peak Esports)</option>
                <option value="07:00 PM">07:00 PM (Prime Squad)</option>
                <option value="08:00 PM">08:00 PM (Late Night Session)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                Duration (Hours)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 5].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHours(h)}
                    className={`flex-1 py-2 rounded-md text-xs font-orbitron font-bold transition-all ${
                      hours === h
                        ? "bg-[#f92f35] text-white shadow-xs"
                        : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            {service.includes("PS5") && (
              <div className="pt-4 sm:pt-0">
                <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-md bg-slate-50 border border-slate-200 hover:border-slate-300 transition-colors">
                  <input
                    type="checkbox"
                    checked={extraController}
                    onChange={(e) => setExtraController(e.target.checked)}
                    className="w-4 h-4 rounded text-[#f92f35] focus:ring-0"
                  />
                  <span className="text-xs font-rajdhani font-bold text-slate-800">
                    + Add 2nd Controller (Co-op/FIFA)
                  </span>
                </label>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
              Notes or Game Requests (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Please preload EA FC 25 / Tekken 8"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-md bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#f92f35]"
            />
          </div>

          {/* Rate Estimate */}
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-orbitron text-slate-500 uppercase block font-bold">
                Estimated Rate
              </span>
              <span className="text-xs text-[#f92f35] font-rajdhani font-bold">
                Pay after your session at the counter
              </span>
            </div>
            <div className="text-right">
              <span className="font-orbitron font-black text-2xl text-[#f92f35]">
                ₹{estimatedPrice}/-
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-md bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-black text-xs tracking-widest uppercase shadow-crimsonSm transition-all"
          >
            PLAY NOW · Confirm Reservation ⚡
          </button>
        </form>
      </div>
    </div>
  );
};
