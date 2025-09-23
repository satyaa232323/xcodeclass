"use client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createOrder, fetchClassDetails, fetchClasses } from "@/utils/api";

export default function DetailClass() {
    const { id } = useParams();
    const router = useRouter();
    const [detailClass, setDetailClass] = useState<DetailClass | null>(null);
    const [classes, setClass] = useState<Class[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                setIsAuthenticated(true);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        const detailData = async () => {
            try {
                const response = await fetchClassDetails(id as string);
                setDetailClass(response?.data);
                console.log(response.data);
            } catch (err) {
                setError("gagal memuat data");
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        const fetchClass = async () => {
            try {
                const response = await fetchClasses();
                setClass(response?.data);
            } catch (err) {
                setError("gagal memuat data");
                console.log(err);
            } finally {
                setLoading(false);
            }
        }



        fetchClass();
        detailData();
    }, [id],);


    const handleClick = async () => {


        try {

            setLoading(true);
            const token = localStorage.getItem("token");
            setIsAuthenticated(!!token);
            if (!token || !isAuthenticated) {
                alert("Silakan login terlebih dahulu untuk membeli kelas.");
                router.push("/auth/login");
            }

            const response = await createOrder(token as string, id as string);

            if (response?.data?.redirectUrl) {
                router.push(response.data.redirectUrl);
            } else {
                alert('Pembelian kelas berhasil!');
                router.push('/profile/history');
            }

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                <Navbar />
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
                <Navbar />
                <div>Error: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            {/* Navbar */}
            <Navbar />
            {detailClass && (
                <main className="p-0 m-0 flex flex-col gap-6" key={detailClass.id}>
                    {/* Header Section */}
                    <div className="w-full bg-red-500 flex flex-col md:flex-row items-center justify-between py-6 px-4 md:px-10 lg:px-24 xl:px-32 gap-6">
                        <div className="flex flex-col gap-1 flex-1">
                            <h1 className="font-bold text-3xl md:text-4xl lg:text-5xl">
                                {detailClass.title}
                            </h1>
                            <h1 className="text-lg md:text-xl mt-2">Mentor:</h1>
                            <h1 className="text-base md:text-lg">{detailClass.mentor}</h1>
                        </div>
                        <div className="flex flex-col gap-4 flex-1 max-w-xs md:max-w-sm lg:max-w-md w-full items-center">
                            <Image
                                src={detailClass.thumbnailUrl}
                                alt="Thumbnail Class"
                                width={400}
                                height={300}
                                className="rounded-lg w-full object-cover h-48 md:h-60 lg:h-72"
                            />
                            <button onClick={handleClick}  className="mt-auto py-2 px-6 bg-white text-red-500 rounded-lg hover:bg-gray-200 transition font-semibold w-full">
                                Beli
                            </button>
                        </div>
                    </div>

                    <div className="w-full bg-gray-50 flex flex-col gap-4 justify-between py-6 px-4 md:px-10 lg:px-24 xl:px-32" >
                        <h1 className="text-lg md:text-xl font-medium text-black" >
                            Video yang di dapat
                        </h1>
                        {detailClass.videos.slice(0, 1).map((video) => (
                            <div className="flex gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 py-2" key={video.id}>
                                {/* vid 1 */}
                                <Image
                                    src={video.videoUrl}
                                    alt="Thumbnail Video"
                                    width={380}
                                    height={180}
                                    className="rounded-lg w-60 md:w-72 lg:w-80 h-32 md:h-40 lg:h-44 object-cover flex-shrink-0 text-black overflow-x-auto flex"
                                />

                            </div>
                        ))}

                        <h1 className="text-lg md:text-xl text-black mt-4 font-bold">
                            Deskripsi Kelas:
                        </h1>
                        {/* deskripsi */}
                        <p className="text-black text-base md:text-lg leading-relaxed">
                            {detailClass.description}
                        </p>
                    </div>
                    {/* Video List Section */}

                    {/* Rekomendasi Kelas Section */}
                    <div className="flex flex-col gap-8 px-4 md:px-10 lg:px-24 xl:px-32">
                        <h1 className="text-black text-lg md:text-xl font-bold">
                            Rekomendasi Kelas
                        </h1>

                        <div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto overflow-y-hidden h-80 md:h-100">
                            {/* Card Video */}
                            {classes.slice(0, 4).map((cls) => (
                                <div className="flex flex-col bg-white text-black border-gray-200 border-2 rounded-xl overflow-hidden shadow-md w-full min-h-[220px] md:min-h-[250px]" key={cls.id}>
                                    <Image
                                        src={cls.thumbnailUrl}
                                        alt="Thumbnail Video"
                                        width={380}
                                        height={180}
                                        className="object-cover w-full h-32 md:h-40 lg:h-44"
                                    />
                                    <div className="flex flex-col flex-1 p-3 gap-2">
                                        <div>
                                            <h2 className="font-bold text-base mb-1">{cls.title}</h2>
                                            <p className="font-extralight text-xs mb-2 line-clamp-1">
                                                deskripsi
                                            </p>
                                        </div>
                                        <span className="font-bold text-sm mb-2">{cls.price}</span>

                                        <button 
                                        className="mt-auto py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold w-full">
                                        
                                            Beli
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div>
                        <Footer />
                    </div>
                </main>
            )
            }

        </div >
    );
}