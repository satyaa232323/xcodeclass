// Video yang ada di kelas
interface Video {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string; // selalu ada, hasil generate dari Cloudinary
  duration: number;
  order: number;
}

// Data umum kelas
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

// Data kelas yang sudah dibeli user
interface UserClassVideo {
  id: string;
  purchaseDate: string;
  classObj: Class;
}

// Order Item
interface OrderItem {
  id: string;
  orderId: string;
  classId: string;
  price: number;
  classObj: Class;
  date: Date;
}

// Order
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

// User
interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

// Detail Kelas (untuk page detail)
interface DetailClass extends Class {
  description: string; // di sini wajib ada
}
