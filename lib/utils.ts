import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const handleArcjetError = (error: any) => {
  if (error?.response?.status === 429) {
    return "Terlalu banyak permintaan. Silakan coba lagi nanti.";
  }

  if (error?.response?.status === 429) {
    if (error?.response?.data?.reason?.isBot()) {
      return "Akses ditolak. Terdeteksi sebagai bot.";
    }
    return "akses ditolak";
  }
}