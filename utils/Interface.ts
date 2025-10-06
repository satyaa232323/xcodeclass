interface User {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "USER";
  createdAt: string;
  updatedAt: string;
}

interface Video {
 id?: string;
  title: string;
  videoUrl: string;
  file?: File;
  duration: number;
  order: number;
  thumbnailUrl?: string;
  originalUrl?: string;  // Store original URL when editingss
}

interface Class {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnailUrl: string;
  mentor: string;
  mentorProfileUrl: string | null;
  createdAt: string;
  updatedAt: string;
  videos: Video[];
}

interface UserClassVideo {
  id: string;
  userId: string;
  classId: string;
  purchaseDate: string;
  classObj: Class;
}

interface OrderItem {
  id: number;
  orderId: string;
  classId: string;
  price: number;
  classObj: Class;
}

interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: "PENDING" | "COMPLETED" | "FAILED";
  midtransOrderId: string | null;
  orderNumber: number;
  orderItems: OrderItem[];
  createdAt: string;
  user?: User;
}

interface PaymentLog {
  id: string;
  orderId: string;
  rawBody: any;  // JSON data from payment provider
  createdAt: string;
}

interface DetailClass extends Omit<Class, 'videos'> {
  videos: Video[];
}

interface ClassData {
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  mentor: string;
  mentorProfileUrl?: string | null;
  videos: {
    title: string;
    videoUrl: string;
    thumbnailUrl: string;
    duration: number;
    order: number;
  }[];
}

// TypeScript interfaces
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}


interface LoginFormData {
  email: string;
  password: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    username: string;
    email: string;
  };
}