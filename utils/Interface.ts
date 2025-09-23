interface Class {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnailUrl: string;
  mentor: string;
}

interface OrderItem {
  id: string;
  orderId: string;
  classId: string;
  price: number;
  class: Class;
  date: Date;
  status: "COMPELETED" | "PENDING" | "FAILED";
}

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
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

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}