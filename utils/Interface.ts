interface Class {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnailUrl: string;
  mentor: string;
}

interface UserClassVideo {
  id: string;
  userId: string;
  classId: string;
  purchaseDate: string;
  classObj: Class;   // 👈 sudah bener
}


interface OrderItem {
   id: string;
  orderId: string;
  classId: string;
  price: number;
  classObj: Class ;
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

}

interface Video {
 id?: string;
  title: string;
  videoUrl: string;
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