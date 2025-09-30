interface Class {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnailUrl?: string; // Made optional
  mentorProfileUrl?: string;
  mentor?: string; // Made optional
  videos: Video[];
}
interface UserClassVideo {
  id: string;
  purchaseDate: string;
  classObj: {
    id: string;
    title: string;
    description: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    videos: Video[];
    mentorProfileUrl?: string;
  };
}

interface OrderItem {
  id: string;
  orderId: string;
  classId: string;
  price: number;
  classObj: Class;
  date: Date;
}
interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
  date: Date;
  status: "PENDING" | "COMPLETED" | "FAILED";
  user?: User;
}
interface Video {
  id?: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string; // Made optional
  duration: number;
  order: number;
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
interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}
interface ClassData {
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  mentor: string;
  mentorProfileUrl?: string;
  videos: {
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
    order: number;
  }[];
}