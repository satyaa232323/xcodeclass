interface Course {
  id: number;
  title: string;
  mentor: string;
  description: string;
  videos: string[];
}

export default function coursecard({ course }: { course: Course }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col gap-3">
      <h3 className="text-lg font-semibold text-red-600">{course.title}</h3>
      <p className="text-sm text-gray-600">Mentor: {course.mentor}</p>
      <p className="text-gray-700">{course.description}</p>
      <div className="flex flex-col gap-2">
        {course.videos.map((video, idx) => (
          <video key={idx} controls className="rounded-lg">
            <source src={video} type="video/mp4" />
            Browser kamu tidak mendukung video.
          </video>
        ))}
      </div>
    </div>
  );
}
