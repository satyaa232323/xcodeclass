"use client";

import Navbar from "@/components/navbarclass";
import { useState } from "react";
import Image from "next/image";

export default function IsiVideoPage() {
  // Data video
  const videos = [
    {
      id: 1,
      title: "Memperbesar kekuatan spiritual, elemen api",
      desc: "Video ini menjelaskan cara memperbesar kekuatan spiritual dengan elemen api.",
      thumbnail: "/thumbnail/thumbnail1.jpeg",
      src: "/videos/contoh1.mp4",
    },
    {
      id: 2,
      title: "Meditasi energi alam",
      desc: "Belajar menyerap energi dari alam untuk memperkuat tubuh dan pikiran.",
      thumbnail: "/thumbnail/thumbnail2.jpeg",
      src: "/videos/contoh2.mp4",
    },
    {
      id: 3,
      title: "Latihan fokus tingkat lanjut",
      desc: "Tutorial latihan fokus untuk meningkatkan konsentrasi dan kontrol diri.",
      thumbnail: "/thumbnail/thumbnail3.jpeg",
      src: "/videos/contoh3.mp4",
    },
    {
      id: 4,
      title: "Mengendalikan elemen air",
      desc: "Cara melatih tubuh dan pikiran agar bisa beradaptasi dengan elemen air.",
      thumbnail: "/thumbnail/thumbnail4.jpeg",
      src: "/videos/contoh4.mp4",
    },
  ];

  // State video yang lagi diputar
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* MAIN VIDEO SECTION */}
        <main className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-black">
              {selectedVideo.title}
            </h2>

            {/* Video player selalu 16:9 */}
            <div className="relative w-full mb-4 aspect-video bg-black rounded-lg overflow-hidden">
              {!playing ? (
                <div
                  className="relative w-full h-full cursor-pointer"
                  onClick={() => setPlaying(true)}
                >
                  <Image
                    src={selectedVideo.thumbnail}
                    alt="Video Thumbnail"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 text-white rounded-full w-14 h-14 flex items-center justify-center">
                      ▶
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                  src={selectedVideo.src}
                />
              )}
            </div>

            <p className="text-base sm:text-lg font-bold mb-6 text-black">
              {selectedVideo.desc}
            </p>

            {/* Info creator + laporkan */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div className="flex items-center space-x-2">
                <Image
                  src="/images/ctokurniawan.png"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-black">Master Kurniawan</p>
                  <p className="text-sm text-black">Chief Technology Officer</p>
                </div>
              </div>
              <p className="text-sm text-black">
                Ada masalah dengan video?{" "}
                <span className="text-red-600 font-semibold cursor-pointer">
                  laporkan
                </span>
              </p>
            </div>

            {/* Description */}
            <div className="bg-gray-200 p-4 sm:p-6 rounded-lg shadow w-full">
              <p className="text-sm sm:text-base leading-relaxed text-black">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sed ut
                perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium. Nemo enim ipsam voluptatem
                quia voluptas sit aspernatur aut odit aut fugit.
              </p>
            </div>
          </div>
        </main>

        {/* SIDEBAR VIDEO LIST */}
        <aside className="bg-black-500 w-full md:w-1/4 p-4 md:p-9 space-y-4 md:space-y-8 overflow-y-auto">
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => {
                setSelectedVideo(video);
                setPlaying(false); // reset biar muncul thumbnail dulu
              }}
              className={`bg-white rounded-lg overflow-hidden shadow cursor-pointer border-3 ${
                selectedVideo.id === video.id
                  ? "border-gray-600"
                  : "border-transparent"
              }`}
            >
              {/* Thumbnail sidebar juga 16:9 */}
              <div className="w-full aspect-video bg-black relative">
                <Image
                  src={video.thumbnail}
                  alt="Thumbnail"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <h3 className="font-semibold text-xs sm:text-sm text-black line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2">
                  {video.desc}
                </p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
