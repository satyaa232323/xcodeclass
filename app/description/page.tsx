"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";

export default function desc() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Navbar */}
      <Navbar />

      <main className="p-0 m-0 flex flex-col gap-6">
        {/* Header Section */}
        <div className="w-full mt-10 flex flex-col md:flex-row justify-between py-6 px-4 md:px-10 lg:px-24 xl:px-32 gap-6">
          <div className="flex flex-col gap-1 flex-1">
            <h1 className="font-bold text-black text-3xl md:text-4xl lg:text-5xl">
              Ini Judul Kelas
            </h1>
            <h1 className="text-lg text-black md:text-xl mt-2">Mentor:</h1>
            <h1 className="text-base text-black md:text-lg">Bu Keksi</h1>
          </div>
          <div className="flex flex-col gap-4 flex-1 max-w-xs md:max-w-sm lg:max-w-md w-full items-center">
            <Image
              src="/images/foto_vid.png"
              alt="Thumbnail Video"
              width={400}
              height={300}
              className="rounded-lg w-full object-cover h-48 md:h-60 lg:h-72"
            />
            <button className="mt-auto py-4 px-6 bg-red-500 text-white text-lg  rounded-lg hover:bg-red-600 transition font-semibold w-full">
              Beli
            </button>
          </div>
        </div>

        {/* Video List Section */}
        <div className="w-full bg-gray-50 flex flex-col gap-4 justify-between py-6 px-4 md:px-10 lg:px-24 xl:px-32">
          <h1 className="text-lg md:text-xl font-medium text-black">
            Video yang di dapat
          </h1>
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
            {/* vid 1 */}
            <Image
              src="/images/foto_vid.png"
              alt="Thumbnail Video"
              width={380}
              height={180}
              className="rounded-lg w-60 md:w-72 lg:w-80 h-32 md:h-40 lg:h-44 object-cover flex-shrink-0"
            />
            {/* vid 2 */}
            <Image
              src="/images/foto_vid.png"
              alt="Thumbnail Video"
              width={380}
              height={180}
              className="rounded-lg w-60 md:w-72 lg:w-80 h-32 md:h-40 lg:h-44 object-cover flex-shrink-0"
            />
            {/* vid 3 */}
            <Image
              src="/images/foto_vid.png"
              alt="Thumbnail Video"
              width={380}
              height={180}
              className="rounded-lg w-60 md:w-72 lg:w-80 h-32 md:h-40 lg:h-44 object-cover flex-shrink-0"
            />
            {/* vid 4 */}
            <Image
              src="/images/foto_vid.png"
              alt="Thumbnail Video"
              width={380}
              height={180}
              className="rounded-lg w-60 md:w-72 lg:w-80 h-32 md:h-40 lg:h-44 object-cover flex-shrink-0"
            />
          </div>
          <h1 className="text-lg md:text-xl text-black mt-4 font-bold">
            Deskripsi Kelas:
          </h1>
          {/* deskripsi */}
          <p className="text-black text-base md:text-lg leading-relaxed">
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

        {/* Rekomendasi Kelas Section */}
        <div className="flex flex-col gap-8 px-4 md:px-10 lg:px-24 xl:px-32">
          <h1 className="text-black text-lg md:text-xl font-bold">
            Rekomendasi Kelas
          </h1>
          <div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto no-scrollbar overflow-y-hidden h-80 md:h-100">
            {/* Card Video */}
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md w-full min-h-[220px] md:min-h-[250px]">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={380}
                height={180}
                className="object-cover w-full h-32 md:h-40 lg:h-44"
              />
              <div className="flex flex-col flex-1 p-3 gap-2">
                <div>
                  <h2 className="font-bold text-base mb-1">Judul Kelas</h2>
                  <p className="font-extralight text-xs mb-2 line-clamp-1">
                    deskripsi
                  </p>
                </div>
                <span className="font-bold text-sm mb-2">10.000</span>
                <button className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>
            {/* Card Video Kedua */}
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md w-full min-h-[220px] md:min-h-[250px]">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={380}
                height={180}
                className="object-cover w-full h-32 md:h-40 lg:h-44"
              />
              <div className="flex flex-col flex-1 p-3 gap-2">
                <div>
                  <h2 className="font-bold text-base mb-1">Judul Kelas</h2>
                  <p className="font-extralight text-xs mb-2 line-clamp-1">
                    deskripsi
                  </p>
                </div>
                <span className="font-bold text-sm mb-2">10.000</span>
                <button className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>
            {/* Card Video Ketiga */}
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md w-full min-h-[220px] md:min-h-[250px]">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={380}
                height={180}
                className="object-cover w-full h-32 md:h-40 lg:h-44"
              />
              <div className="flex flex-col flex-1 p-3 gap-2">
                <div>
                  <h2 className="font-bold text-base mb-1">Judul Kelas</h2>
                  <p className="font-extralight text-xs mb-2 line-clamp-1">
                    deskripsi
                  </p>
                </div>
                <span className="font-bold text-sm mb-2">10.000</span>
                <button className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md w-full min-h-[220px] md:min-h-[250px]">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={380}
                height={180}
                className="object-cover w-full h-32 md:h-40 lg:h-44"
              />
              <div className="flex flex-col flex-1 p-3 gap-2">
                <div>
                  <h2 className="font-bold text-base mb-1">Judul Kelas</h2>
                  <p className="font-extralight text-xs mb-2 line-clamp-1">
                    deskripsi
                  </p>
                </div>
                <span className="font-bold text-sm mb-2">10.000</span>
                <button className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md w-full min-h-[220px] md:min-h-[250px]">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={380}
                height={180}
                className="object-cover w-full h-32 md:h-40 lg:h-44"
              />
              <div className="flex flex-col flex-1 p-3 gap-2">
                <div>
                  <h2 className="font-bold text-base mb-1">Judul Kelas</h2>
                  <p className="font-extralight text-xs mb-2 line-clamp-1">
                    deskripsi
                  </p>
                </div>
                <span className="font-bold text-sm mb-2">10.000</span>
                <button className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md w-full min-h-[220px] md:min-h-[250px]">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={380}
                height={180}
                className="object-cover w-full h-32 md:h-40 lg:h-44"
              />
              <div className="flex flex-col flex-1 p-3 gap-2">
                <div>
                  <h2 className="font-bold text-base mb-1">Judul Kelas</h2>
                  <p className="font-extralight text-xs mb-2 line-clamp-1">
                    deskripsi
                  </p>
                </div>
                <span className="font-bold text-sm mb-2">10.000</span>
                <button className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>
            <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md w-full min-h-[220px] md:min-h-[250px]">
              <Image
                src="/images/foto_vid.png"
                alt="Thumbnail Video"
                width={380}
                height={180}
                className="object-cover w-full h-32 md:h-40 lg:h-44"
              />
              <div className="flex flex-col flex-1 p-3 gap-2">
                <div>
                  <h2 className="font-bold text-base mb-1">Judul Kelas</h2>
                  <p className="font-extralight text-xs mb-2 line-clamp-1">
                    deskripsi
                  </p>
                </div>
                <span className="font-bold text-sm mb-2">10.000</span>
                <button className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                  Beli
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
