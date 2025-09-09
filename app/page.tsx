"use client";

import Navbar from "@/components/navbar";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <main className="px-4 lg:px-6 py-4 lg:py-6 space-y-6 lg:space-y-8">
        <div className="grid gap-6 grid-cols-[200px,1fr,2fr] items-center">
          {/* Foto */}
          <div className="relative w-full h-64 lg:h-96">
            <Image
              src="/images/5.jpeg"
              alt="Class Xcode"
              fill
              className="rounded-lg object-cover"
            />
          </div>

          {/* Teks */}
          <div className="flex flex-col space-y-4">
            <h1 className="text-black text-2xl lg:text-3xl font-bold leading-snug">
              Kuasai Keamanan Siber, Amankan Karier Digital Anda
            </h1>
            <p className="text-black text-base lg:text-lg leading-relaxed">
              Ikuti pembelajaran praktis berbasis studi kasus nyata untuk
              meningkatkan kemampuan Anda dalam melindungi data dan sistem
              digital.
            </p>
          </div>

          {/* Video Class */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card Video */}
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={400}
                height={220}
                className="object-cover w-full h-48"
              />
              <div className="flex flex-col flex-1 p-4 gap-2">
                <div>
                  <h2 className="font-bold text-lg mb-1">Judul video</h2>
                  <p className="font-extralight text-sm mb-2">deskripsi</p>
                </div>
                <span className="font-bold text-base mb-4">10.000</span>
                <button className="mt-auto py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>

            {/* Card Video Kedua */}
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={400}
                height={220}
                className="object-cover w-full h-48"
              />
              <div className="flex flex-col flex-1 p-4 gap-2">
                <div>
                  <h2 className="font-bold text-lg mb-1">Judul video</h2>
                  <p className="font-extralight text-sm mb-2">deskripsi</p>
                </div>
                <span className="font-bold text-base mb-4">10.000</span>
                <button className="mt-auto py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
