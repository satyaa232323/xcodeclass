"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  createClass,
  updateClass,
  deleteClass,
  fetchAllClasses,
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "@/utils/api";
import { Edit2, Eye, PencilIcon, Trash2, TrashIcon } from "lucide-react";


// ===================== TYPES =====================
interface Video {
  id?: string;
  title: string;
  videoUrl: string;
  file?: File;
  duration: number;
  order: number;
  thumbnailUrl?: string;
  originalUrl?: string;  // Store original URL when editing
}

interface Class {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnailUrl: string;
  mentor: string;
  mentorProfileUrl?: string;
  videos: Video[];
}

// ===================== MAIN COMPONENT =====================
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
  const [mentorProfileUrl, setMentorProfileUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);


  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);

  // Upload states
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingVideos, setUploadingVideos] = useState<Record<number, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  // filtered class
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  // ===================== FETCH DATA =====================
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      const response = await fetchAllClasses(token);
      setClasses(response.data);
      setFilteredClasses(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    const result = classes.filter(item => {
      const matchTitle = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchMentor = item.mentor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchTitle || matchMentor;
    })
    setFilteredClasses(result);
  }, [searchTerm, classes]);

  // ===================== HANDLE SUBMIT =====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      // Validate required fields
      if (!title || !description || !price || !thumbnailUrl || !mentor || !mentorProfileUrl) {
        setError("Please fill in all required fields");
        return;
      }

      if (videos.length === 0) {
        setError("Please add at least one video");
        return;
      }

      // Process videos - no need to upload here as they're already uploaded
      const processedVideos = videos.map((video, index) => ({
        title: video.title,
        videoUrl: video.videoUrl,
        thumbnailUrl: video.thumbnailUrl || thumbnailUrl,
        duration: video.duration,
        order: index + 1
      }));

      // Create the class data object with videos
      const classData = {
        title,
        description,
        price: Number(price),
        thumbnailUrl: thumbnailUrl,
        mentor,
        mentorProfileUrl,
        videos: processedVideos
      };

      if (editingId) {
        // Update existing class
        await updateClass(token, editingId, classData);
      } else {
        // Create new class
        await createClass(token, classData);
      }

      await fetchClasses();
      resetForm();
      setShowModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ===================== HANDLE DELETE =====================
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/auth/login");

      await deleteClass(token, id);

      fetchClasses();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ===================== MODAL DETAIL =====================

  const handleDetailClass = (id: string) => {
    router.push(`/admin/classes/${id}`);
  }

  // ===================== HELPERS =====================
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setMentor("");
    setThumbnailUrl("");
    setThumbnailFile(null);
    setVideos([]);
    setEditingId(null);
  };

  const addVideo = () => {
    setVideos([
      ...videos,
      { title: "", videoUrl: "", duration: 0, order: videos.length + 1 },
    ]);
  };

  const updateVideo = async (index: number, field: keyof Video, value: string | number | File) => {
    try {
      const newVideos = [...videos];

      if (field === "file" && value instanceof File) {
        // Get duration from video file
        const video = document.createElement('video');
        video.preload = 'metadata';

        // Create a promise to handle metadata loading
        const getDuration = new Promise<number>((resolve) => {
          video.onloadedmetadata = () => {
            const durationInMinutes = Math.ceil(video.duration / 60);
            resolve(durationInMinutes);
          };
          video.src = URL.createObjectURL(value);
        });

        // Upload video to Cloudinary
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication required");
          return;
        }

        setError("");
        setUploadingVideos(prev => ({ ...prev, [index]: true }));

        try {
          // First get the duration
          const duration = await getDuration;

          // Then upload the video
          console.log('Starting video upload for file:', value.name);
          const uploadResult = await uploadVideoToCloudinary(token, value);
          console.log('Upload result:', uploadResult);

          if (!uploadResult?.secure_url) {
            console.error('Missing secure_url in upload result:', uploadResult);
            throw new Error('No URL received from video upload');
          }

          newVideos[index] = {
            ...newVideos[index],
            videoUrl: uploadResult.secure_url,
            thumbnailUrl: uploadResult.thumbnail_url || uploadResult.secure_url,
            duration: Math.max(duration, Math.ceil((uploadResult.duration || 0) / 60)), // Use the longer duration
            title: newVideos[index].title || value.name.split('.')[0] // Use filename as default title if not set
          };

          console.log('Updated video data:', newVideos[index]);

          setVideos([...newVideos]);
        } catch (error) {
          console.error('Error processing video:', error);
          setError('Failed to process video: ' + (error instanceof Error ? error.message : 'Unknown error'));
        } finally {
          setUploadingVideos(prev => ({ ...prev, [index]: false }));
        }
      } else {
        newVideos[index] = { ...newVideos[index], [field]: value };
        setVideos(newVideos);
      }
    } catch (error) {
      console.error('Error in updateVideo:', error);
      setError('Failed to update video: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const handleEditClick = (course: Class) => {
    setEditingId(course.id);
    setTitle(course.title);
    setDescription(course.description || "");
    setPrice(course.price.toString());
    setMentor(course.mentor);
    setMentorProfileUrl(course.mentorProfileUrl || "");
    setThumbnailUrl(course.thumbnailUrl);
    setShowModal(true);
  };

  // ===================== RENDER =====================
  if (loading) return <div>Loading...</div>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-600">
        {classes.map((course) => (
          <div
            key={course.id}
            className="bg-white p-4 rounded-lg shadow relative"
          >
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-full h-48 object-cover rounded mb-4"
            />
            <h3 className="font-bold text-lg mb-2">{course.title}</h3>
            <p className="text-gray-600 mb-2 line-clamp-2">
              {course.description}
            </p>
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">
                Rp {course.price.toLocaleString()}
              </span>
              <span className="text-gray-500">{course.mentor}</span>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => handleDetailClass(course.id)}
                className="p-2 text-gray-600 hover:text-gray-800 cursor-pointer"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => handleEditClick(course)}
                className="p-2 text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => {
                  handleDelete(course.id);
                }}
                className="p-2 text-red-600 hover:text-red-800 cursor-pointer"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>


      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Course" : "Add New Course"}
            </h2>
            <label className="block mb-1 font-medium">Classes Title</label>
            <form onSubmit={handleSubmit} className="space-y-4 text-black">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full border p-2 rounded"
                required
              />

              <label className="block mb-1 font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                className="w-full border p-2 rounded"
                required
              />

              <label className="block mb-1 font-medium">Price (IDR)</label>
              <input
                type="text"
                value={Number(price).toLocaleString('id-ID')}
                onChange={(e) => {
                  // Remove non-numeric characters and convert to number
                  const numericValue = e.target.value.replace(/[^0-9]/g, '');
                  setPrice(numericValue);
                }}
                placeholder="Price"
                className="w-full border p-2 rounded"
                required
              />

              {/* Thumbnail Upload */}
              <div>
                <label className="block mb-1 font-medium">Thumbnail Class</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const token = localStorage.getItem("token");
                        if (!token) return;
                        setError("");
                        setUploadingThumbnail(true);
                        const uploadResult = await uploadImageToCloudinary(token, file);
                        if (uploadResult?.secure_url) {
                          setThumbnailUrl(uploadResult.secure_url);
                          setThumbnailFile(null); // Clear the file after successful upload
                        } else {
                          throw new Error('No URL received from image upload');
                        }
                      } catch (error) {
                        console.error('Error uploading thumbnail:', error);
                        setError('Failed to upload thumbnail: ' + (error instanceof Error ? error.message : 'Unknown error'));
                      } finally {
                        setUploadingThumbnail(false);
                      }
                    }
                  }}
                  className="w-full border p-2 rounded"
                />
                {uploadingThumbnail && <p className="text-blue-500 text-sm mt-1">Uploading thumbnail...</p>}
                {thumbnailUrl && (
                  <div className="mt-2">
                    <img src={thumbnailUrl} alt="Thumbnail preview" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
              </div>

              <label className="block mb-1 font-medium">Mentor</label>
              <input
                type="text"
                value={mentor}
                onChange={(e) => setMentor(e.target.value)}
                placeholder="Mentor"
                className="w-full border p-2 rounded"
                required
              />

              <div>
                <label className="block mb-1 font-medium">Mentor Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        const token = localStorage.getItem("token");
                        if (!token) return;
                        setError("");
                        const uploadResult = await uploadImageToCloudinary(token, file);
                        if (uploadResult?.secure_url) {
                          setMentorProfileUrl(uploadResult.secure_url);
                        } else {
                          throw new Error('No URL received from image upload');
                        }
                      } catch (error) {
                        console.error('Error uploading mentor profile:', error);
                        setError('Failed to upload mentor profile image: ' + (error instanceof Error ? error.message : 'Unknown error'));
                      }
                    }
                  }}
                  className="w-full border p-2 rounded"
                />
                {mentorProfileUrl && (
                  <div className="mt-2">
                    <img src={mentorProfileUrl} alt="Mentor profile" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
              </div>

              {/* Videos */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-bold">Videos</label>
                  <button
                    type="button"
                    onClick={addVideo}
                    className="text-blue-500 hover:underline"
                  >
                    + Add Video
                  </button>
                </div>

                {videos.map((video, index) => (
                  <div key={index} className="space-y-2 mb-4 p-4 border rounded bg-gray-50">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Video {index + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeVideo(index)}
                        className="text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Video Title"
                      value={video.title}
                      onChange={(e) => updateVideo(index, "title", e.target.value)}
                      className="w-full border p-2 rounded"
                      required
                    />

                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => updateVideo(index, "file", e.target.files?.[0] || new File([], ""))}
                      className="w-full border p-2 rounded"
                      required
                    />

                    {uploadingVideos[index] && (
                      <p className="text-blue-500 text-sm">Uploading video...</p>
                    )}

                    {video.videoUrl && (
                      <video src={video.videoUrl} controls className="w-full h-32 rounded" />
                    )}

                    <div className="text-gray-600">
                      Duration: {video.duration} minutes
                      {/* Hidden input for form validation */}
                      <input
                        type="hidden"
                        value={video.duration}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
                  disabled={submitting || uploadingThumbnail || Object.values(uploadingVideos).some(Boolean)}
                >
                  {submitting ? "Saving..." : "Save Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
