"use client";

import Navbar from "@/components/navbar";
import Image from "next/image";
import Footer from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <main className=" py-4 lg:py-6 space-y-6 lg:space-y-8">
        <div className="flex flex-col gap-10 w-full">
          {/* Call to Action */}
          <div className="w-full bg-white flex flex-col md:flex-row items-center justify-between min-h-64 lg:min-h-[440px] px-4 md:px-10 py-10 gap-6">
            <div className="flex-1 flex flex-col items-center md:items-start justify-center gap-4 text-black text-center md:text-left px-4 md:px-10">
              <h1 className="text-3xl lg:text-5xl font-bold mb-2">
                Gabung Kelas XcodeClass Sekarang!
              </h1>
              <p className="text-lg lg:text-xl mb-4 max-w-2xl">
                Tingkatkan skill Cybermu bersama mentor berpengalaman dan materi
                berbasis studi kasus nyata. Raih peluang karier di dunia
                teknologi!
              </p>
              <button className="px-10 py-4 bg-red-500 text-white font-bold rounded-full shadow hover:bg-red-600 transition text-xl cursor-pointer">
                Beli Kelas
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center md:justify-end h-full pr-0 md:pr-8 mt-6 md:mt-0">
              <Image
                src="/images/landing.png"
                alt="Landing Illustration"
                width={320}
                height={320}
                className="object-contain h-40 xs:h-56 sm:h-64 md:h-[340px] lg:h-[440px] w-auto"
                priority
              />
            </div>
          </div>

          {/* Teks */}
          <div className="flex flex-col space-y-4 px-4 md:px-20">
            <h1 className="text-black text-2xl lg:text-2xl font-bold leading-snug">
              Kuasai Keamanan Cyber, Amankan Karier Digital Anda
            </h1>
            <p className="text-black text-base lg:text-lg leading-relaxed">
              Ikuti pembelajaran praktis berbasis studi kasus nyata untuk
              meningkatkan kemampuan Anda dalam melindungi data dan sistem
              digital.
            </p>
          </div>

          {/* Video Class */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 md:px-20 w-full">
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
                  <h2 className="font-bold text-lg mb-1">Judul kelas</h2>
                  <p className="font-extralight text-sm mb-2 line-clamp-1">
                    deskripsi
                  </p>
                </div>
                <span className="font-bold text-base mb-4">10.000</span>
                <button className="mt-auto py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full cursor-pointer">
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
                  <h2 className="font-bold text-lg mb-1">Judul Kelas</h2>
                  <p className="font-extralight text-sm mb-2 line-clamp-1">
                    deskripsi
                  </p>
                </div>
                <span className="font-bold text-base mb-4">10.000</span>
                <button className="mt-auto py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full cursor-pointer">
                  Beli
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-whte py-10 gap-10 px-4 md:px-20 w-full">
            <h1 className="text-3xl text-black font-bold">Mentor Kami</h1>
            <div className="flex flex-col lg:flex-row justify-center items-center gap-10 lg:gap-20 border-2 border-gray-200 rounded-xl p-6 md:p-14 w-full max-w-full mx-auto bg-white">
              <Image
                src="/images/ctokurniawan.png"
                alt="Mentor Master Kurniawan"
                width={340}
                height={380}
                className="object-fit rounded-2xl aspect-square"
              />
              <div className=" flex-1 flex flex-col items-center md:items-start justify-center h-full px-8 text-center md:text-left">
                <h2 className="text-2xl text-black font-bold mb-4">
                  Master Kurniawan
                </h2>
                <p className="text-black text-lg leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit. QLorem
                  ipsum dolor sit amet consectetur adipiscing elit. QLorem ipsum
                  dolor sit amet consectetur adipiscing elit. QLorem ipsum dolor
                  sit amet consectetur adipiscing elit. QLorem ipsum dolor sit
                  amet consectetur adipiscing elit. QLorem ipsum dolor sit amet
                  consectetur adipiscing elit. Lorem ipsum dolor sit amet
                  consectetur adipiscing elit. QLorem ipsum dolor sit amet
                  consectetur adipiscing elit. QLorem ipsum dolor sit amet
                  consectetur adipiscing elit. QLorem ipsum dolor sit amet
                  consectetur adipiscing elit. QLorem ipsum dolor sit amet
                  consectetur adipiscing elit. QLorem ipsum dolor sit amet
                  consectetur adipiscing elit.
                </p>
              </div>
            </div>
          </div>
          {/* Footer*/}
          <div>
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
