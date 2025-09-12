"use client";

import Navbar from "@/components/navbar";
import { useState } from "react";
import Image from "next/image";

export default function IsiVideoPage() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="flex flex-1 flex-col md:flex-row">
        {/* SIDEBAR */}

        {/* MAIN VIDEO SECTION */}
        <main className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-black">
              Nama kelas
            </h2>

            {/* Video player */}
            <div className="relative w-full mb-4">
              {!playing ? (
                <div
                  className="relative cursor-pointer"
                  onClick={() => setPlaying(true)}
                >
                  <Image
                    src="/elon.jpg"
                    alt="Video Thumbnail"
                    width={1000}
                    height={560}
                    className="w-full h-auto rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-red-600 text-white rounded-full p-4 text-2xl">
                      ▶
                    </div>
                  </div>
                </div>
              ) : (
                <video
                  controls
                  autoPlay
                  className="w-full h-auto rounded-lg"
                  src="/sample.mp4"
                />
              )}
            </div>

            <p className="text-base sm:text-lg font-bold mb-6 text-black">
              memperbesar kekuatan spiritual, elemen api
            </p>

            {/* Info creator + laporkan */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <div className="flex items-center space-x-2">
                <Image
                  src="/avatar.jpg"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
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
                quia voluptas sit aspernatur aut odit aut fugit. Lorem ipsum
                dolor sit amet, consectetur adipisicing elit. Sed ut
                perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium. Nemo enim ipsam voluptatem
                quia voluptas sit aspernatur aut odit aut fugit.
              </p>
            </div>
          </div>
        </main>
        <aside className="bg-red-500 w-full md:w-1/5 p-4 md:p-6 space-y-4 md:space-y-8 overflow-y-auto">
          {[1, 2, 3, 4].map((v) => (
            <div
              key={v}
              className="bg-white rounded-lg overflow-hidden shadow cursor-pointer"
            >
              <Image
                src="/thumbnail.jpg"
                alt="Thumbnail"
                width={250}
                height={100}
                className="w-full h-[90px] object-cover"
              />
              <div className="p-2">
                <h3 className="font-semibold text-xs sm:text-sm text-black">
                  Cara besarin otong
                </h3>
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Lorem Ipsum Dolor Sit Amet...
                </p>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}
