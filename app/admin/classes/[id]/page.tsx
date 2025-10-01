"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getClassDetails } from "@/utils/api";
import { ArrowLeft, Clock, Film } from "lucide-react";

export default function ClassDetails() {
    const params = useParams();
    const router = useRouter();
    const [classData, setClassData] = useState<Class | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/auth/login");
                    return;
                }

                const response = await getClassDetails(token, params.id as string);
                setClassData(response.data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!classData) return null;

    return (
        <div className="p-6 space-y-6">
            {/* Header with Back Button */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-6"
            >
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Class Details</h1>
            </motion.div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Class Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    {/* Class Overview Card */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="aspect-video rounded-lg overflow-hidden mb-4">
                            <img
                                src={classData.thumbnailUrl}
                                alt={classData.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{classData.title}</h2>
                        <p className="text-gray-600 mb-4">{classData.description}</p>
                        <div className="flex items-center gap-4 text-gray-500">
                            <span className="flex items-center gap-2">
                                <Film className="w-4 h-4" />
                                {classData.videos?.length || 0} Videos
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {classData.videos?.reduce((acc: number, video: Video) => acc + video.duration, 0)} minutes
                            </span>
                        </div>
                    </div>

                    {/* Videos List */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Course Content</h3>
                        <div className="space-y-4">
                            {classData.videos?.map((video: Video, index: number) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <div className="bg-red-100 p-2 rounded-lg">
                                        <Film className="w-5 h-5 text-red-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{video.title}</h4>
                                        <p className="text-sm text-gray-500">{video.duration} minutes</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column - Additional Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    {/* Price Card */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Price Information</h3>
                        <p className="text-2xl font-bold text-red-600">
                            Rp {classData.price.toLocaleString()}
                        </p>
                    </div>

                    {/* Mentor Card */}
                    <div className="bg-white rounded-xl shadow p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Mentor</h3>
                        <div className="flex items-center gap-4">
                            <img
                                src={classData.mentorProfileUrl || '/images/profile.svg'}
                                alt={classData.mentor}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                                <p className="font-medium text-gray-800">{classData.mentor}</p>
                                <p className="text-sm text-gray-500">Course Instructor</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}