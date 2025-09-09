"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";

export default function desc() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <main className="p-0 m-0 grid gap-4 grid-rows-[300px,auto,300px]">
        <div className="w-full bg-red-500 flex flex-row items-center justify-between py-4 px-30 overflow-hidden">
          <div className="flex flex-col gap-0.5">
            <h1 className="font-bold text-5xl">Ini Judul Video</h1>
            <h1 className="text-xl mt-2">Mentor:</h1>
            <h1>Bu Keksi</h1>
          </div>
          <div className="flex flex-col gap-4">
            <Image
              src="/images/foto_vid.png"
              alt="Thumbnail Video"
              width={400}
              height={300}
              className="rounded-lg"
            />
            <button className="mt-auto py-2 px-6 bg-white text-red-500 rounded-lg hover:bg-gray-200 transition font-semibold w-full">
              Beli
            </button>
          </div>
        </div>
        <div className="w-full bg-gray-50 flex flex-col gap-4 justify-between py-6 px-30">
          <h1 className="text-xl font-medium text-black">
            Video yang di dapat
          </h1>
          <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 py-2">
            {/* vid 1 */}
            <Image
              src="/images/foto_vid.png"
              alt="Thumbnail Video"
              width={380}
              height={180}
              className="rounded-lg"
            />
            {/* vid 2 */}
            <Image
              src="/images/foto_vid.png"
              alt="Thumbnail Video"
              width={380}
              height={180}
              className="rounded-lg"
            />
            {/* vid 3 */}
            <Image
              src="/images/foto_vid.png"
              alt="Thumbnail Video"
              width={380}
              height={180}
              className="rounded-lg"
            />
            {/* vid 4 */}
            <Image
              src="/images/foto_vid.png"
              alt="Thumbnail Video"
              width={380}
              height={180}
              className="rounded-lg"
            />
          </div>
          <h1 className="text-xl text-black mt-4 font-bold">
            Deskripsi Video:
          </h1>
          {/* deskripsi */}
          <p className="text-black text-base lg:text-lg leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipiscing elit. QLorem ipsum
            dolor sit amet consectetur adipiscing elit. QLorem ipsum dolor sit
            amet consectetur adipiscing elit. QLorem ipsum dolor sit amet
            consectetur adipiscing elit. QLorem ipsum dolor sit amet consectetur
            adipiscing elit. QLorem ipsum dolor sit amet consectetur adipiscing
            elit. QLorem ipsum dolor sit amet consectetur adipiscing elit.
            QLorem ipsum dolor sit amet consectetur adipiscing elit. Q Lorem
            ipsum dolor sit amet consectetur adipiscing elit. QLorem ipsum dolor
            sit amet consectetur adipiscing elit. QLorem ipsum dolor sit amet
            consectetur adipiscing elit. QLorem ipsum dolor sit amet consectetur
            adipiscing elit. QLorem ipsum dolor sit amet consectetur adipiscing
            elit. QLorem ipsum dolor sit amet consectetur adipiscing elit.
            QLorem ipsum dolor sit amet consectetur adipiscing elit. QLorem
            ipsum dolor sit amet consectetur adipiscing elit. Q Lorem ipsum
            dolor sit amet consectetur adipiscing elit. QLorem ipsum dolor sit
            amet consectetur adipiscing elit. QLorem ipsum dolor sit amet
            consectetur adipiscing elit. QLorem ipsum dolor sit amet consectetur
            adipiscing elit. QLorem ipsum dolor sit amet consectetur adipiscing
            elit. QLorem ipsum dolor sit amet consectetur adipiscing elit.
            QLorem ipsum dolor sit amet consectetur adipiscing elit. QLorem
            ipsum dolor sit amet consectetur adipiscing elit. Q Lorem ipsum
            dolor sit amet consectetur adipiscing elit. QLorem ipsum dolor sit
            amet consectetur adipiscing elit. QLorem ipsum dolor sit amet
            consectetur adipiscing elit. QLorem ipsum dolor sit amet consectetur
            adipiscing elit. QLorem ipsum dolor sit amet consectetur adipiscing
            elit. QLorem ipsum dolor sit amet consectetur adipiscing elit.
            QLorem ipsum dolor sit amet consectetur adipiscing elit. QLorem
            ipsum dolor sit amet consectetur adipiscing elit. Q
          </p>
        </div>
        <div className="flex flex-col px-30 gap-8">
          <h1 className="text-black text-xl font-bold">Rekomendasi Kelas</h1>
          <div className="grid gap-4 grid-cols-3">
            {/* Card Video */}
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md w-[380px] min-h-[270px]">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={380}
                height={180}
                className="object-cover w-full h-[180px]"
              />
              <div className="flex flex-col flex-1 p-3 gap-2">
                <div>
                  <h2 className="font-bold text-base mb-1">Judul video</h2>
                  <p className="font-extralight text-xs mb-2">deskripsi</p>
                </div>
                <span className="font-bold text-sm mb-2">10.000</span>
                <button className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>
            {/* Card Video Kedua */}
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md w-[380px] min-h-[270px]">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={380}
                height={180}
                className="object-cover w-full h-[180px]"
              />
              <div className="flex flex-col flex-1 p-3 gap-2">
                <div>
                  <h2 className="font-bold text-base mb-1">Judul video</h2>
                  <p className="font-extralight text-xs mb-2">deskripsi</p>
                </div>
                <span className="font-bold text-sm mb-2">10.000</span>
                <button className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>
            {/* Card Video Ketiga */}
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md w-[380px] min-h-[270px]">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={380}
                height={180}
                className="object-cover w-full h-[180px]"
              />
              <div className="flex flex-col flex-1 p-3 gap-2">
                <div>
                  <h2 className="font-bold text-base mb-1">Judul video</h2>
                  <p className="font-extralight text-xs mb-2">deskripsi</p>
                </div>
                <span className="font-bold text-sm mb-2">10.000</span>
                <button className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
