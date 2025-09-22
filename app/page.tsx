"use client";

import Navbar from "@/components/navbar";
import Image from "next/image";
import Footer from "@/components/footer";
import ReviewMarquee from "@/components/ReviewMarquee";
import { useEffect, useState } from "react";
import { FaUserTie, FaBookOpen, FaUsers, FaInfinity } from "react-icons/fa";
import { fetchClasses } from "@/utils/api";
import Link from "next/link";



export default function HomePage() {

  // fecth classes 4 aja
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchClasses();
        setClasses(res.data);
        setError("");
      } catch (err) {
        setError("Gagal memuat data kelas");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }





  const handleScroll = () => {
    const element = document.getElementById("class");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" }); // animasi smooth
    }
  };
  
  const keunggulanCards = [
    {
      icon: <FaUserTie className="w-7 h-7 text-red-500" />,
      title: "Mentor Berpengalaman",
      desc: "Dibimbing langsung oleh mentor yang ahli di bidangnya dan berpengalaman puluhan tahun.",
    },
    {
      icon: <FaBookOpen className="w-7 h-7 text-blue-500" />,
      title: "Materi Studi Kasus Nyata",
      desc: "Pembelajaran berbasis studi kasus nyata agar siap menghadapi tantangan dunia kerja.",
    },
    {
      icon: <FaUsers className="w-7 h-7 text-green-500" />,
      title: "Komunitas Aktif",
      desc: "Bergabung dengan komunitas belajar yang aktif dan saling support.",
    },
    {
      icon: <FaInfinity className="w-7 h-7 text-purple-500" />,
      title: "Akses Selamanya",
      desc: "Materi dan video kelas bisa diakses kapan saja tanpa batas waktu.",
    },
    {
      icon: <FaBookOpen className="w-7 h-7 text-orange-500" />,
      title: "Sertifikat Resmi",
      desc: "Dapatkan sertifikat resmi setelah menyelesaikan kelas dan tugas akhir.",
    },
    {
      icon: <FaUsers className="w-7 h-7 text-cyan-500" />,
      title: "Konsultasi Gratis",
      desc: "Bisa konsultasi langsung dengan mentor tanpa biaya tambahan.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-22">
      {/* Navbar */}
      <Navbar />

      <main className=" py-4 lg:py-6 space-y-6 lg:space-y-8">
        <div className="flex flex-col gap-10 w-full">
          {/* Call to Action */}
          <div className="w-full bg-gray-50 flex flex-col md:flex-row items-center justify-between min-h-64 lg:min-h-[440px] px-4 md:px-10 py-10 gap-6">
            <div className="flex-1 flex flex-col items-center md:items-start justify-center gap-4 text-black text-center md:text-left px-4 md:px-10">
              <h1 className="text-3xl lg:text-5xl font-bold mb-2">
                Gabung Kelas XcodeClass Sekarang!
              </h1>
              <p className="text-lg lg:text-xl mb-4 max-w-2xl">
                Tingkatkan skill Cybermu bersama mentor berpengalaman dan materi
                berbasis studi kasus nyata. Raih peluang karier di dunia
                teknologi!
              </p>
              <button
                className="px-10 py-4 bg-red-500 text-white font-bold rounded-full shadow hover:bg-red-600 transition text-xl cursor-pointer"
                onClick={handleScroll}
              >
                Beli Kelas
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center md:justify-end h-full pr-0 md:pr-8 mt-6 md:mt-0">
              <Image
                src="/images/lan2.svg"
                alt="Landing Illustration"
                width={320}
                height={320}
                className="object-contain h-40 xs:h-56 sm:h-64 md:h-[340px] lg:h-[440px] w-auto"
                priority
              />
            </div>
          </div>
          <hr className="border-t-2 border-gray-200 my-4 w-full" />

          {/* Teks */}
          <div className="flex flex-col space-y-4 px-4 md:px-20 " id="class">
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
            {classes.slice(0, 4).map((item) => (
              <div
                key={item.id}
                className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md"
              >
                <Image
                  src={item.thumbnailUrl || `/images/foto_vid.png`}
                  alt="Thumbnail Video"
                  width={400}
                  height={220}
                  className="object-cover w-full h-48"
                />
                <div className="flex flex-col flex-1 p-4 gap-2">
                  <div>
                    <h2 className="font-bold text-lg mb-1">{item.title}</h2>
                    <p className="font-extralight text-sm mb-2 line-clamp-1">
                      {item.description}
                    </p>
                  </div>
                  <span className="font-bold text-base mb-4">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                  <button className="mt-auto py-2 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full cursor-pointer">
                    <Link 
                    key={item.id}
                    href={`/classes/${item.id}`}
                    >
                      Beli  
                    </Link>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Link
              href="/classes"
              className="px-8 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition text-lg shadow"
            >
              Lihat Semua Kelas
            </Link>
          </div>
        </div>
        <hr className="border-t-2 border-gray-200 my-4 w-full" />
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
                Kurniawan adalah seorang intelektual dan ahli IT Security,
                penetration testing, software engineering, dan cloud
                architecture dengan pengalaman lebih dari 29 tahun di dunia
                komputer dan 24 tahun di bidang hacking & cyber security. Ia
                telah menangani berbagai klien besar, termasuk Kementerian
                Pertahanan RI, Kominfo, KPK, ITB, Metro TV, Kimia Farma,
                Alterra, Mamikos.com, hingga klien internasional dari Malaysia,
                Timor Leste, dan Madagascar, serta aktif menjadi pembicara
                seminar, workshop, dan dosen tamu di berbagai universitas
                ternama di Indonesia.
              </p>
            </div>
          </div>
        </div>
        <hr className="border-t-2 border-gray-200 my-4 w-full" />
        {/* Section Keunggulan */}
        <div className="w-full flex flex-col items-center mb-10">
          <h2 className="text-3xl font-bold text-black mb-6">
            Keunggulan Kelas
          </h2>
          <p className="mb-6 text-center text-lg px-4 md:px-20 text-black">
            Inilah alasan mengapa program kami menjadi pilihan terbaik untuk
            menguasai keamanan siber.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10 justify-center">
            {keunggulanCards.map((item, idx) => (
              <div
                key={idx}
                className="min-w-[220px] max-w-xl bg-white rounded-xl shadow-lg p-12 flex flex-col gap-3 relative"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="font-bold text-gray-800 text-base">
                    {item.title}
                  </span>
                </div>
                <div className="text-gray-600 text-sm font-light">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
        <hr className="border-t-2 border-gray-200 my-4 w-full" />

        {/* Review Marquee */}
        <div className="flex flex-col items-center justify-center py-10 gap-10 px-4 md:px-20 w-full">
          <h1 className="text-3xl text-black font-bold">Reviews</h1>
          <p className="mb-6 text-center text-lg px-4 md:px-20 text-black">
            Ini yang mereka sampaikan setelah belajar di kelas kami!{" "}
          </p>
          <ReviewMarquee />
        </div>
        {/* Footer*/}
        <div>
          <Footer />
        </div>
      </main>
    </div>
  );
}
