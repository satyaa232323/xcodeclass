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
        <h1 className="text-2xl font-bold">Courses Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Add New Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Add New Course</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1  text-black">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border p-2 rounded text-black"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border p-2 rounded text-black"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border p-2 rounded text-black"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Thumbnail URL</label>
                <input
                  type="url"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="w-full border p-2 rounded text-black"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Mentor</label>
                <input
                  type="text"
                  value={mentor}
                  onChange={(e) => setMentor(e.target.value)}
                  className="w-full border p-2 rounded text-black"
                  required
                />
              </div>

              {/* Videos Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold">Videos</label>
                  <button
                    type="button"
                    onClick={addVideo}
                    className="text-blue-500 text-black"
                  >
                    + Add Video
                  </button>
                </div>

                {videos.map((video, index) => (
                  <div key={index} className="space-y-2 mb-4 p-4 border rounded">
                    <input
                      type="text"
                      placeholder="Video Title"
                      value={video.title}
                      onChange={(e) => updateVideo(index, "title", e.target.value)}
                      className="w-full border p-2 rounded text-black"
                      required
                    />
                    <input
                      type="url"
                      placeholder="Video URL text-black"
                      value={video.videoUrl}
                      onChange={(e) => updateVideo(index, "videoUrl", e.target.value)}
                      className="w-full border p-2 rounded text-black"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Duration (minutes)"
                      value={video.duration}
                      onChange={(e) => updateVideo(index, "duration", Number(e.target.value))}
                      className="w-full border p-2 rounded text-black"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
