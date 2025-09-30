export interface Class {
  id: string;
  title: string;
  description: string | null;
  price: number;
  thumbnailUrl?: string; // Made optional
  mentorProfileUrl?: string;
  mentor?: string; // Made optional
  videos: Video[];
}

export interface UserClassVideo {
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


export interface OrderItem {
  id: string;
  orderId: string;
  classId: string;
  price: number;
  classObj: Class;
  date: Date;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  createdAt: string;
  orderItems: OrderItem[];
  date: Date;
  status: "PENDING" | "COMPLETED" | "FAILED";
  user?: User;
}

export interface Video {
  id?: string;
  title: string;
  videoUrl: string;
  thumbnailUrl?: string; // Made optional
  duration: number;
  order: number;
}

export interface DetailClass {
  id: string;
  thumbnailUrl: string;
  title: string;
  mentor: string;
  description: string;
  price: number;
  videos: Video[];
  class: Class;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

export interface ClassData {
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