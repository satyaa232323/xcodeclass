interface Class {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnailUrl: string;
  mentor: string;
}


interface Video {
  id: string;
  title: string;
  videoUrl: string;
}

interface DetailClass {
  id: string;
  thumbnailUrl: string;
  title: string;
  mentor: string;
  description: string;
  price: number;
  videos: Video[];
  class: Class;
}