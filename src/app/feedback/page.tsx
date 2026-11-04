"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/context/StoreContext";

export default function FeedbackPage() {
  const { reviews, addReview } = useStore();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState("");
  const [service, setService] = useState("PS5 Console Arena");
  const [comment, setComment] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<number | "all">("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addReview({
      name: name || "Verified Gamer",
      rating,
      service,
      comment: comment || "Awesome experience at Virtux Gaming Hub!",
    });
    setName("");
    setComment("");
    setRating(5);
  };

  const filteredReviews = reviews.filter((r) => {
    if (selectedFilter === "all") return true;
    return r.rating === selectedFilter;
  });

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="relative py-12 bg-white text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-rajdhani text-slate-500 mb-6 uppercase tracking-wider font-semibold">
          <Link href="/" className="hover:text-[#f92f35]">Home</Link>
          <span>/</span>
          <span className="text-[#f92f35] font-bold">Feedback & Reviews</span>
        </div>

        {/* Hero Section */}
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-orbitron font-bold text-[#f92f35] uppercase tracking-widest block mb-2">
            Community Hall of Fame
          </span>
          <h1 className="text-3xl sm:text-5xl font-orbitron font-black text-slate-900 leading-tight">
            Player Feedback & <span className="text-[#f92f35]">Reviews</span>
          </h1>
          <p className="mt-4 text-base text-slate-600 font-sans leading-relaxed">
            Every review helps us elevate the arena experience. Read what local champions think or share your own thoughts on our PS5 pods, RTX rigs, and café treats.
          </p>
        </div>

        {/* Rating Summary Bar */}
        <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="font-orbitron font-black text-4xl sm:text-5xl text-amber-500">
              {averageRating}
            </div>
            <div>
              <div className="flex items-center gap-1 text-amber-500 text-lg">
                {"★★★★★"}
              </div>
              <span className="text-xs text-slate-500 font-rajdhani font-semibold block">
                Based on {reviews.length} authentic gamer reviews in Ranaghat
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-orbitron">
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-3 py-1.5 rounded-md ${
                selectedFilter === "all"
                  ? "bg-[#f92f35] text-white font-bold"
                  : "bg-white border border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
            >
              All ({reviews.length})
            </button>
            <button
              onClick={() => setSelectedFilter(5)}
              className={`px-3 py-1.5 rounded-md ${
                selectedFilter === 5
                  ? "bg-[#f92f35] text-white font-bold"
                  : "bg-white border border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
            >
              5 ★
            </button>
            <button
              onClick={() => setSelectedFilter(4)}
              className={`px-3 py-1.5 rounded-md ${
                selectedFilter === 4
                  ? "bg-[#f92f35] text-white font-bold"
                  : "bg-white border border-slate-200 text-slate-700 hover:text-slate-900"
              }`}
            >
              4 ★
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Submit Review Card */}
          <div className="lg:col-span-1">
            <div className="editorial-card p-6 sm:p-8 sticky top-28">
              <h3 className="font-orbitron font-bold text-xl text-slate-900 mb-2">
                Leave Your Review ⭐
              </h3>
              <p className="text-xs text-slate-500 font-sans mb-6">
                Tell us about your gaming session and food quality!
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Interactive Star Rating */}
                <div>
                  <label className="block text-xs font-orbitron font-bold text-slate-700 mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-2 text-3xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`transition-transform hover:scale-125 focus:outline-none ${
                          (hoverRating || rating) >= star
                            ? "text-amber-500"
                            : "text-slate-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="text-xs font-orbitron font-bold text-amber-600 ml-2">
                      {rating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                    Your Gamer Tag / Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Subhojit K."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35] font-rajdhani font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                    Service Experienced
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm font-rajdhani font-bold text-slate-900 focus:outline-none focus:border-[#f92f35]"
                  >
                    <option value="PS5 Console Arena">🎮 PlayStation 5 Arena</option>
                    <option value="PC Battle Rig (RTX 4090)">💻 PC Battle Rig (RTX 4090 / 360Hz)</option>
                    <option value="Racing Simulator (G29)">🏎️ Motion Racing Cockpit (Logitech G29)</option>
                    <option value="Cinema & OTT Suite">🎬 Private Dolby Cinema Suite</option>
                    <option value="Gamer Café & Lounge">☕ Gamer Café & Bites</option>
                    <option value="Staff & Atmosphere">🛡️ Staff Co-operation & Hygiene</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-orbitron font-bold text-slate-700 mb-1">
                    Your Review & Comments
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How was the display smoothness, controllers, food, or ambiance?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-md bg-white border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#f92f35] font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-md bg-[#f92f35] hover:bg-[#e02228] text-white font-orbitron font-bold text-xs uppercase tracking-wider transition-all shadow-crimsonSm"
                >
                  Publish Public Review ⭐
                </button>
              </form>
            </div>
          </div>

          {/* Reviews Wall */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-orbitron font-bold text-xl text-slate-900 mb-4">
              Recent Player Reviews ({filteredReviews.length})
            </h3>

            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="editorial-card p-6 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-red-50 border border-red-200 flex items-center justify-center font-orbitron font-bold text-[#f92f35] text-sm">
                      {rev.avatarLetter}
                    </div>
                    <div>
                      <h4 className="font-rajdhani font-bold text-base text-slate-900">
                        {rev.name}
                      </h4>
                      <span className="text-xs text-[#f92f35] font-rajdhani font-semibold block -mt-0.5">
                        {rev.service}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex text-amber-500 text-sm">
                      {"★".repeat(rev.rating)}
                    </div>
                    <span className="text-[11px] font-rajdhani text-slate-400 font-semibold">
                      {rev.date}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed pt-1">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
