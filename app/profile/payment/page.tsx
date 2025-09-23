"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function PaymentPage() {
  const videos = [
    { id: 1, title: "Belajar React Dasar", price: 75000, thumbnail: "/thumb1.jpg", duration: "2j 15m" },
    { id: 2, title: "Next.js Fullstack Tutorial", price: 120000, thumbnail: "/thumb2.jpg", duration: "4j 30m" },
    { id: 3, title: "Tailwind CSS Mastery", price: 60000, thumbnail: "/thumb3.jpg", duration: "1j 45m" },
    { id: 4, title: "Laravel x Livewire Crash Course", price: 95000, thumbnail: "/thumb4.jpg", duration: "3j 20m" },
  ];

  const [selected, setSelected] = useState<number[]>([]);
  const [isPaying, setIsPaying] = useState(false);

  const toggleSelect = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const selectedVideos = videos.filter((v) => selected.includes(v.id));
  const total = selectedVideos.reduce((acc, v) => acc + v.price, 0);

  const handlePay = () => {
    if (selected.length === 0) {
      alert("Pilih minimal 1 video untuk dibayar!");
      return;
    }
    setIsPaying(true);

    setTimeout(() => {
      setIsPaying(false);
      confetti({ particleCount: 200, spread: 90, origin: { y: 0.6 } });
      alert(`Pembayaran berhasil untuk ${selectedVideos.length} video! 🎉`);
      setSelected([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white p-6 flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-bold text-3xl text-gray-800"
      >
        Checkout Video
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-gray-500 text-sm mb-2"
      >
        Pilih video yang ingin dibayar lalu lanjutkan checkout.
      </motion.p>

      {/* List Video dengan Framer Motion */}
      <div className="bg-white rounded-2xl shadow-md divide-y overflow-hidden">
        <AnimatePresence>
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`flex gap-4 p-4 items-center transition transform hover:scale-[1.02] hover:shadow-md ${
                selected.includes(video.id) ? "bg-red-50 border-l-4 border-red-400" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(video.id)}
                onChange={() => toggleSelect(video.id)}
                className="w-5 h-5 accent-red-500 transition-transform duration-200 ease-in-out transform hover:scale-110"
              />
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-28 h-20 rounded-lg object-cover shadow-sm"
              />
              <div className="flex flex-col flex-1">
                <h2 className="font-semibold text-gray-800">{video.title}</h2>
                <p className="text-xs text-gray-500">Durasi: {video.duration}</p>
                <span className="text-red-600 font-bold mt-1">
                  Rp {video.price.toLocaleString("id-ID")}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sticky Checkout Bar dengan animasi slide-up */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80, damping: 15 }}
        className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col flex-1 items-end">
            <span className="text-sm text-gray-500">
              {selectedVideos.length} video dipilih
            </span>
            <span className="text-lg font-bold text-gray-800">
              Total: Rp {total.toLocaleString("id-ID")}
            </span>
          </div>
          <button
            onClick={handlePay}
            disabled={isPaying || selected.length === 0}
            className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition ${
              isPaying || selected.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isPaying ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              />
            ) : (
              <>Bayar</>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
