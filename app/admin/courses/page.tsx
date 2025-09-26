"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// interface Class {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   thumbnailUrl: string;
//   mentor: string;
//   videos?: Video[];
// }

// interface Video {
//   id?: string;
//   title: string;
//   videoUrl: string;
//   duration: number;
//   order: number;
// }

export default function CoursesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mentor, setMentor] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);

  // Fetch classes on mount
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch("/api/admin/classes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch classes");

      const data = await response.json();
      setClasses(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch("/api/admin/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          thumbnailUrl,
          mentor,
          videos,
        }),
      });

      if (!response.ok) throw new Error("Failed to create class");

      // Refresh classes list
      await fetchClasses();
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setMentor("");
    setThumbnailUrl("");
    setVideos([]);
  };

  const addVideo = () => {
    setVideos([
      ...videos,
      { title: "", videoUrl: "", duration: 0, order: videos.length + 1 },
    ]);
  };

  const updateVideo = (index: number, field: keyof Video, value: string | number) => {
    const newVideos = [...videos];
    newVideos[index] = { ...newVideos[index], [field]: value };
    setVideos(newVideos);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-700">Courses Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Add New Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
        {classes.map((course) => (
          <div key={course.id} className="bg-white p-4 rounded-lg shadow">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="font-bold text-lg mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-2">{course.description}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold">Rp {course.price.toLocaleString()}</span>
              <span className="text-gray-500">{course.mentor}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-lg border border-gray-200 
                          animate-[fadeIn_0.2s_ease-out] scale-95">
            {/* Header */}
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Course</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Form Content with limited scroll */}
            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scroll">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none text-gray-800"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none text-gray-800"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Price</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none text-gray-800"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Mentor</label>
                    <input
                      type="text"
                      value={mentor}
                      onChange={(e) => setMentor(e.target.value)}
                      className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none text-gray-800"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Thumbnail URL</label>
                  <input
                    type="url"
                    value={thumbnailUrl}
                    onChange={(e) => setThumbnailUrl(e.target.value)}
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none text-gray-800"
                    required
                  />
                </div>

                {/* Videos Section */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-semibold text-gray-700">Videos</label>
                    <button
                      type="button"
                      onClick={addVideo}
                      className="text-sm font-medium text-red-500 hover:text-red-600"
                    >
                      + Add Video
                    </button>
                  </div>

                  {videos.map((video, index) => (
                    <div
                      key={index}
                      className="space-y-3 mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <input
                        type="text"
                        placeholder="Video Title"
                        value={video.title}
                        onChange={(e) => updateVideo(index, "title", e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-400 focus:outline-none"
                        required
                      />
                      <input
                        type="url"
                        placeholder="Video URL"
                        value={video.videoUrl}
                        onChange={(e) => updateVideo(index, "videoUrl", e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-400 focus:outline-none"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={video.duration}
                        onChange={(e) =>
                          updateVideo(index, "duration", Number(e.target.value))
                        }
                        className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-red-400 focus:outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t p-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 shadow-sm"
              >
                Save Course
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
