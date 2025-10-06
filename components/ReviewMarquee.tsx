import Image from "next/image";

const reviews = [
  {
    user: "Ayu",
    avatar: "/avataricon/avatar2.png",
    stars: 5,
    comment:
      "Kelasnya sangat bermanfaat! Materinya lengkap, penjelasan mentor sangat detail dan mudah dipahami. Saya jadi lebih percaya diri untuk belajar cyber security dan mencoba studi kasus nyata. Terima kasih XcodeClass!",
  },
  {
    user: "Budi",
    avatar: "/avataricon/avatar1.png",
    stars: 5,
    comment:
      "Mentor ramah dan penjelasan detail. Cocok untuk pemula maupun yang ingin upgrade skill.",
  },
  {
    user: "Citra",
    avatar: "/avataricon/avatar3.png",
    stars: 4,
    comment:
      "Materi lengkap, recommended! Banyak contoh kasus dan latihan yang bisa langsung dipraktikkan.",
  },
  {
    user: "Dewi",
    avatar: "/avataricon/avatar5.png",
    stars: 5,
    comment:
      "Belajar jadi lebih seru di sini! Mentor selalu support.",
  },
  {
    user: "Eko",
    avatar: "/avataricon/avatar4.png",
    stars: 4,
    comment:
      "Video pembelajaran jelas. Penjelasan step by step sangat membantu, dan ada banyak tips praktis dari mentor.",
  },
];

export default function ReviewMarquee() {
  const loopedReviews = [...reviews, ...reviews];

  return (
    <div className="w-full py-6 overflow-hidden">
      <div className="max-w-3xl mx-auto flex gap-10 whitespace-nowrap animate-marquee text-lg font-semibold text-gray-700">
        {loopedReviews.map((review, idx) => (
          <div
            key={idx}
            className="min-w-[260px] max-w-xs min-h-[200px] bg-white rounded-xl shadow-lg p-5 flex flex-col gap-2 relative flex-shrink-0"
          >
            {/* === Foto profil + Bintang + Username === */}
            <div className="flex items-start gap-3 mb-2">
              {/* Foto Profil */}
              <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-gray-300 flex items-center justify-center">
                <Image
                  src={review.avatar}
                  alt={review.user}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Bintang dan Username vertikal */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  {Array.from({ length: review.stars }).map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">
                      ★
                    </span>
                  ))}
                </div>
                <div className="font-bold text-gray-800 text-sm mt-1">
                  {review.user}
                </div>
              </div>
            </div>

            {/* Komentar */}
            <div className="text-gray-600 font-light text-sm break-words overflow-auto max-h-32 whitespace-pre-line">
              {review.comment}
            </div>
          </div>
        ))}
      </div>

      {/* Animasi marquee */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          display: inline-flex;
          min-width: 200%;
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
