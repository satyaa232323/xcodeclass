"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import XLoading from "@/components/LoadingEffect";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    createOrder,
    fetchClassDetails,
    fetchClasses,
    myClasses,
    fetchOrders,
} from "@/utils/api";
import { useToast } from "@/components/ToastContext";

export default function DetailClass() {
    const { id } = useParams();
    const toast = useToast();
    const router = useRouter();

    const [detailClass, setDetailClass] = useState<DetailClass | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
    const [order, setOrder] = useState<Order | null>(null);

    const [hasPurchased, setHasPurchased] = useState(false);
    const [isPendingOrder, setIsPendingOrder] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetchClassDetails(id as string);
                setDetailClass(response?.data ?? null);

                const all = await fetchClasses();
                setFilteredClasses(all?.data || []);
            } catch (err) {
                setError("Gagal memuat data");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    // 🔍 Cek apakah user sudah beli atau masih pending
    useEffect(() => {
        const checkPurchaseStatus = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;

            try {
                // Cek kelas yang sudah dibeli
                const myClassesResponse = await myClasses(token);
                const ownedClass = myClassesResponse?.data?.find(
                    (cls: UserClassVideo) => cls.classId === id
                );
                if (ownedClass) {
                    setHasPurchased(true);
                    return;
                }

                // Cek order yang masih pending
                const ordersResponse = await fetchOrders(token);
                const pending = ordersResponse.orders?.find((order: Order) =>
                    order.orderItems.some(
                        (item: OrderItem) =>
                            item.classId === id && order.status === "PENDING"
                    )
                );
                if (pending) setIsPendingOrder(true);
            } catch (err) {
                console.error("Gagal cek status pembelian:", err);
            }
        };

        checkPurchaseStatus();
    }, [id]);

    const handleClick = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            if (!token) {
                toast.showToast("Silakan login terlebih dahulu untuk membeli kelas.", "error");
                router.push("/auth/login");
                return;
            }

            // Buat order baru
            const response = await createOrder(token, id as string);
            setOrder(response.data);

            toast.showToast("Order berhasil dibuat! Silakan lanjutkan ke pembayaran.", "success");
            router.push("/profile/payment");

        } catch (err: any) {
            if (err.response?.status === 429) {
                toast.showToast("Terlalu banyak request. Mohon tunggu beberapa saat...", "error");
                setTimeout(() => setLoading(false), 10000);
                return;
            }

            if (err.response?.status === 401) {
                toast.showToast("Sesi anda telah berakhir. Silakan login kembali.", "error");
                router.push("/auth/login");
            } else {
                toast.showToast(err.response?.data?.error || "Terjadi kesalahan sistem", "error");
            }

            console.error("Gagal memproses pembelian:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex items-center gap-3">
                    <XLoading size={50} />
                    <p className="text-gray-600 text-base font-medium tracking-wide animate-pulse">
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (error || !detailClass) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <p>{error || "Data tidak ditemukan"}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="container mx-auto px-4 py-10 flex flex-col gap-2">
                {/* Back Button */}
                <Link
                    href="/"
                    className="relative text-gray-500 text-xl font-semibold mb-4 pl-6 hover:text-gray-700 transition before:content-['←'] before:absolute before:left-0"
                >
                    Kembali
                </Link>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {/* Left Section */}
                    <div className="col-span-2 flex flex-col gap-6">
                        {/* Thumbnail */}
                        <div className="bg-white shadow rounded-lg p-4 border">
                            <Image
                                src={detailClass.thumbnailUrl || "/images/foto_vid.png"}
                                alt="Thumbnail Class"
                                width={800}
                                height={500}
                                className="rounded-xl object-cover w-full h-auto"
                            />
                            <div className="mt-4">
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {detailClass.title}
                                </h1>
                                <p className="text-gray-600">{detailClass.description}</p>
                                <div className="flex gap-6 text-sm text-gray-500 mt-2">
                                    <span>📹 {detailClass.videos?.length || 0} Videos</span>
                                    <span>⏱ {(detailClass.videos?.length || 0) * 5} minutes</span>
                                </div>
                            </div>
                        </div>

                        {/* Course Content */}
                        <div className="bg-white shadow rounded-lg p-6 border flex-1">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Course Content</h2>
                            <div className="flex flex-col gap-3">
                                {detailClass.videos?.length > 0 ? (
                                    detailClass.videos.map((video, idx) => (
                                        <div
                                            key={video.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-red-500">🎬</span>
                                                <p className="font-medium text-black">
                                                    Part {idx + 1} - {video.title}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500">Belum ada video tersedia</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col gap-6">
                        {/* Mentor Card */}
                        <div className="bg-white shadow rounded-lg p-4 border">
                            <h2 className="text-lg font-bold text-gray-700">Mentor</h2>
                            <div className="flex items-center mt-2 gap-3">
                                <Image
                                    src={detailClass.mentorProfileUrl || "/images/profile.svg"}
                                    alt="Mentor"
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                />
                                <div>
                                    <p className="font-bold text-black">{detailClass.mentor}</p>
                                </div>
                            </div>
                        </div>

                        {/* Price Card */}
                        <div className="bg-white shadow rounded-lg p-4 border">
                            <h2 className="text-lg font-bold text-gray-700">Price Information</h2>
                            <p className="text-red-600 font-bold text-xl mt-2">
                                Rp {detailClass.price.toLocaleString("id-ID")}
                            </p>
                            <button
                                onClick={
                                    hasPurchased
                                        ? undefined
                                        : isPendingOrder
                                        ? () => router.push("/profile/payment")
                                        : handleClick
                                }
                                disabled={hasPurchased || isPendingOrder}
                                className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold transition cursor-pointer ${
                                    hasPurchased || isPendingOrder
                                        ? "bg-gray-400 text-white cursor-not-allowed"
                                        : "bg-red-500 text-white hover:bg-red-600"
                                }`}
                            >
                                {hasPurchased
                                    ? "Sudah Dibeli"
                                    : isPendingOrder
                                    ? "Menunggu Pembayaran"
                                    : "Beli"}
                            </button>
                        </div>

                        {/* Rekomendasi Kelas */}
                        <div className="p-4">
                            <h2 className="text-lg font-bold text-gray-700 mb-4">
                                Rekomendasi Kelas
                            </h2>
                            <div className="grid gap-4 grid-cols-1">
                                {filteredClasses
                                    .filter((item) => item.id !== detailClass?.id)
                                    .sort(() => Math.random() - 0.5)
                                    .slice(0, 2)
                                    .map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex flex-col bg-white text-black border-gray-200 border rounded-xl overflow-hidden shadow-md"
                                        >
                                            <Image
                                                src={item.thumbnailUrl || "/images/foto_vid.png"}
                                                alt={`${item.title} Thumbnail`}
                                                width={400}
                                                height={220}
                                                className="object-cover w-full h-auto"
                                            />
                                            <div className="flex flex-col flex-1 p-2 gap-2">
                                                <h2 className="font-bold text-lg line-clamp-1">{item.title}</h2>
                                                <span className="font-bold text-sm">
                                                    Rp {item.price.toLocaleString("id-ID")}
                                                </span>
                                                <Link href={`/classes/${item.id}`} passHref>
                                                    <button className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                                                        Lihat
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
