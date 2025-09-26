"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";

interface Class {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  mentor: string;
  videos?: Video[];
}

interface Video {
  id?: string;
  title: string;
  videoUrl: string;
  duration: number;
  order: number;
}

export default function CoursesPage() {
  const router = useRouter();
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Modal states
  const [detailCourse, setDetailCourse] = useState<Class | null>(null);
  const [editCourse, setEditCourse] = useState<Class | null>(null);
  const [deleteCourse, setDeleteCourse] = useState<Class | null>(null);

  // Form states for Add/Edit
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mentor, setMentor] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videos, setVideos] = useState<Video[]>([]);

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
        headers: { Authorization: `Bearer ${token}` },
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

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setMentor("");
    setThumbnailUrl("");
    setVideos([]);
  };

  // reset form tiap kali buka Add New Course
  useEffect(() => {
    if (showModal) {
      resetForm();
    }
  }, [showModal]);

  // Add new
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");
      const response = await fetch("/api/admin/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
      await fetchClasses();
      setShowModal(false);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Edit
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editCourse) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");
      const response = await fetch(`/api/admin/classes/${editCourse.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title,
          description,
          price: Number(price),
          thumbnailUrl,
          mentor,
          videos,
        }),
      });
      if (!response.ok) throw new Error("Failed to update class");
      await fetchClasses();
      setEditCourse(null);
      resetForm();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteCourse) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");
      const response = await fetch(`/api/admin/classes/${deleteCourse.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to delete class");
      await fetchClasses();
      setDeleteCourse(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addVideo = () => {
    setVideos([...videos, { title: "", videoUrl: "", duration: 0, order: videos.length + 1 }]);
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
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold">Rp {course.price.toLocaleString()}</span>
              <span className="text-gray-500">{course.mentor}</span>
            </div>
            <div className="flex justify-between items-center">
              {/* Detail di kiri */}
              <button
                onClick={() => setDetailCourse(course)}
                className="text-sm px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
              >
                Detail
              </button>

              {/* Edit & Delete di kanan */}
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditCourse(course);
                    setTitle(course.title);
                    setDescription(course.description);
                    setPrice(course.price.toString());
                    setMentor(course.mentor);
                    setThumbnailUrl(course.thumbnailUrl);
                    setVideos(course.videos || []);
                  }}
                  className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => setDeleteCourse(course)}
                  className="p-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center justify-center"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-800/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-lg border border-gray-200">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-bold text-gray-800">Add New Course</h2>
              <button onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* ---- isi form asli Add New Course ---- */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg"
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
                      className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">Mentor</label>
                    <input
                      type="text"
                      value={mentor}
                      onChange={(e) => setMentor(e.target.value)}
                      className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg"
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
                    className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="font-semibold text-gray-700">Videos</label>
                    <button type="button" onClick={addVideo} className="text-sm text-red-500">
                      + Add Video
                    </button>
                  </div>
                  {videos.map((video, index) => (
                    <div key={index} className="space-y-3 mb-4 p-4 border rounded-lg bg-gray-50">
                      <input
                        type="text"
                        placeholder="Video Title"
                        value={video.title}
                        onChange={(e) => updateVideo(index, "title", e.target.value)}
                        className="text-gray-700 w-full border border-gray-300 p-2 rounded"
                        required
                      />
                      <input
                        type="url"
                        placeholder="Video URL"
                        value={video.videoUrl}
                        onChange={(e) => updateVideo(index, "videoUrl", e.target.value)}
                        className="text-gray-700 w-full border border-gray-300 p-2 rounded"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Duration (minutes)"
                        value={video.duration}
                        onChange={(e) => updateVideo(index, "duration", Number(e.target.value))}
                        className="text-gray-700 w-full border border-gray-300 p-2 rounded"
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-3 border-t pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="text-gray-700 px-5 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-red-500 text-white rounded-lg">
                    Save Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {editCourse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6">
            <h2 className="text-gray-700 text-xl font-bold mb-4">Edit Course</h2>
            <form onSubmit={handleUpdate} className="space-y-5">
              {/* ---- isi form sama persis dengan Add, tapi field sudah terisi ---- */}
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-gray-700 w-full border border-gray-400 p-3 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg"
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
                    className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">Mentor</label>
                  <input
                    type="text"
                    value={mentor}
                    onChange={(e) => setMentor(e.target.value)}
                    className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg"
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
                  className="text-gray-700 w-full border border-gray-300 p-3 rounded-lg"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="font-semibold text-gray-700">Videos</label>
                  <button type="button" onClick={addVideo} className="text-sm text-red-500">
                    + Add Video
                  </button>
                </div>
                {videos.map((video, index) => (
                  <div key={index} className="space-y-3 mb-4 p-4 border rounded-lg bg-gray-50">
                    <input
                      type="text"
                      placeholder="Video Title"
                      value={video.title}
                      onChange={(e) => updateVideo(index, "title", e.target.value)}
                      className="text-gray-700 w-full border border-gray-300 p-2 rounded"
                      required
                    />
                    <input
                      type="url"
                      placeholder="Video URL"
                      value={video.videoUrl}
                      onChange={(e) => updateVideo(index, "videoUrl", e.target.value)}
                      className="text-gray-700 w-full border border-gray-300 p-2 rounded"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Duration (minutes)"
                      value={video.duration}
                      onChange={(e) => updateVideo(index, "duration", Number(e.target.value))}
                      className="text-gray-700 w-full border border-gray-300 p-2 rounded"
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setEditCourse(null)}
                  className="text-gray-700 px-5 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 bg-blue-500 text-white rounded-lg">
                  Update Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {detailCourse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h2 className="text-gray-700 text-xl font-bold mb-4">{detailCourse.title}</h2>

            {detailCourse.thumbnailUrl && (
              <img
                src={detailCourse.thumbnailUrl}
                alt={detailCourse.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}

            <p className="text-gray-700">{detailCourse.description}</p>
            <p className="text-gray-700 mt-2 font-semibold">Rp {detailCourse.price.toLocaleString()}</p>
            <p className="text-gray-700">Mentor: {detailCourse.mentor}</p>
            <div className="mt-4">
              <h3 className="text-gray-700 font-semibold">Videos:</h3>
              {detailCourse.videos?.map((v, i) => (
                <div key={i} className="text-sm text-gray-700">
                  {v.title} -{" "}
                  <a href={v.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    {v.videoUrl}
                  </a>{" "}
                  ({v.duration} min)
                </div>
              ))}
            </div>
            <button
              onClick={() => setDetailCourse(null)} className="text-gray-700 mt-4 px-4 py-2 bg-gray-200 rounded">
              Close
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteCourse && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-red-700 text-lg font-bold">Delete Course</h2>
            <p className="text-gray-700 mt-2">Are you sure you want to delete "{deleteCourse.title}"?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setDeleteCourse(null)} className="text-gray-700 px-4 py-2 border rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
