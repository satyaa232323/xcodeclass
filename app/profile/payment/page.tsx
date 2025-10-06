"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ToastContext";
import { fetchOrders, myClasses } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Class } from "@/app/generated/prisma";

export default function PaymentPage() {
  const toast = useToast();
  const router = useRouter();

  // Show toast if redirected from payment success
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const paymentStatus = params.get("payment");

      if (paymentStatus === "success") {
        toast.showToast("Pembayaran berhasil!", "success");

        const prevPage = sessionStorage.getItem("prevPage");
        sessionStorage.removeItem("prevPage");

        setTimeout(() => {
          if (prevPage) {
            router.push(prevPage);
          } else {
            router.push("/profile/my-classes");
          }
        }, 3000);

      } else if (paymentStatus === "failed") {
        toast.showToast("Pembayaran gagal atau dibatalkan", "error");
      }

      // Hapus query param dari URL
      const url = new URL(window.location.href);
      url.searchParams.delete("payment");
      window.history.replaceState({}, document.title, url.pathname);
    }
  }, [router, toast]);

  const [processingOrderId, setProcessingOrderId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [purchasedClasses, setPurchasedClasses] = useState<Set<string>>(
    new Set()
  );

  const fetchOrder = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please login to view your order history");
      return;
    }

    try {
      const response = await fetchOrders(token);
      // Filter hanya order dengan status PENDING
      const pendingOrders = response.orders.filter(
        (order: Order) => order.status === "PENDING"
      );
      setOrders(pendingOrders);

      // Fetch purchased classes
      const purchasedResponse = await myClasses(token);
      setPurchasedClasses(
        new Set(purchasedResponse.data.map((item: Class) => item.id))
      );
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Terjadi kesalahan memuat Data");
    }
  };

  // Refresh data setiap 5 detik
  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePay = async (orderId: string) => {
    setProcessingOrderId(orderId);
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      // Check if class is already purchased
      const orderClass = orders.find((order) => order.id === orderId)
        ?.orderItems[0].classObj;
      if (orderClass && purchasedClasses.has(orderClass.id)) {
        setError("You have already purchased this class");
        toast.showToast("Kelas sudah pernah dibeli", "error");
        setProcessingOrderId(null);
        return;
      }

      sessionStorage.setItem("prevPage", window.location.pathname);

      const response = await fetch(`/api/payment/${orderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        toast.showToast(data.error || "Gagal memulai pembayaran", "error");
        throw new Error(data.error || "Payment initiation failed");
      }

      if (data.redirectUrl) {
        // Remove the paid order from the list
        setOrders((prev) => prev.filter((order) => order.id !== orderId));
        // Redirect to Midtrans payment page
        toast.showToast("Berhasil, mengalihkan ke pembayaran...", "success");
        window.location.href = data.redirectUrl;
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      setError(error.message || "Terjadi kesalahan saat memproses pembayaran");
      toast.showToast(
        error.message || "Terjadi kesalahan saat memproses pembayaran",
        "error"
      );
    } finally {
      setProcessingOrderId(null);
    }
  };

  return (
    <div className="flex p-2 sm:p-4 gap-2 sm:gap-4 flex-col w-full min-h-screen bg-white max-w-7xl mx-auto">
      <h1 className="font-bold text-xl sm:text-2xl text-black">
        Checkout Video
      </h1>
      <p className="font-medium text-base sm:text-lg text-gray-600">
        Berikut pesanan yang belum dibayar
      </p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md divide-y overflow-hidden">
        <div className="flex flex-col gap-2 sm:gap-4 max-h-none md:max-h-[600px] overflow-y-auto no-scrollbar w-full">
          {orders.map((item) => (
            <div
              key={item.id}
              className="border-2 border-gray-200 rounded-2xl shadow-md p-4 bg-white"
            >
              <div className="flex justify-between items-center mb-3">
                <h2 className="font-bold text-gray-500 text-lg">
                  Order #{item.id.slice(-6)}
                </h2>
                <span className="text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString("id-ID")}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Image
                  src={item.orderItems[0].classObj.thumbnailUrl || ""}
                  alt={item.orderItems[0].classObj.title}
                  width={50}
                  height={50}
                  className="w-28 h-20 rounded-lg object-cover shadow-sm"
                />
                <div className="flex flex-col flex-1">
                  <h2 className="font-semibold text-gray-500">
                    {item.orderItems[0].classObj.title}
                  </h2>
                  {purchasedClasses.has(item.orderItems[0].classObj.id) && (
                    <span className="text-yellow-600 text-sm mt-1">
                      You already own this class
                    </span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-gray-200 pt-3 mt-2">
                <div className="flex flex-col justify-between">
                  <span className="font-bold text-lg text-gray-700">
                    Rp {item.totalAmount.toLocaleString("id-ID")}
                  </span>
                  <span
                    className={`font-bold text-sm 
                      ${item.status === "PENDING" ? "text-gray-500" : ""}
                      ${item.status === "COMPLETED" ? "text-green-600" : ""}
                      ${item.status === "FAILED" ? "text-red-600" : ""}
                    `}
                  >
                    {item.status}
                  </span>
                </div>
                <button
                  onClick={() => handlePay(item.orderItems[0].orderId)}
                  disabled={
                    processingOrderId === item.id ||
                    purchasedClasses.has(item.orderItems[0].classObj.id)
                  }
                  className={`px-6 py-3 rounded-xl font-bold text-white transition ${
                    processingOrderId === item.id ||
                    purchasedClasses.has(item.orderItems[0].classObj.id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {processingOrderId === item.id ? "Processing..." : "Bayar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {orders.length === 0 && !error && (
        <div className="text-center text-gray-500 mt-8">
          No pending orders found
        </div>
      )}
    </div>
  );
}
