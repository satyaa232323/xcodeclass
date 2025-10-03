import midtransClient from "midtrans-client";

export const createMidtransTransaction = async (
  orderNumber: string | number,
  amount: number,
  customerEmail: string,
  customerName: string
) => {
  // Validasi env
  if (!process.env.MIDTRANS_SERVER_KEY || !process.env.MIDTRANS_CLIENT_KEY) {
    throw new Error("MIDTRANS_SERVER_KEY / MIDTRANS_CLIENT_KEY not configured");
  }

  // Gunakan orderNumber (autoincrement) untuk order_id Midtrans
  const midtransOrderId = `APP-${orderNumber}-${Date.now()}`;

  const snap = new midtransClient.Snap({
    // gunakan NODE_ENV atau variable khusus untuk production
    isProduction: process.env.NODE_ENV === "production",
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });



  const parameter = {
    transaction_details: {
      order_id: midtransOrderId,
      gross_amount: amount,
    },
    customer_details: {
      email: customerEmail,
      first_name: customerName,
    },
    credit_card: {
      secure: true,
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_APP_URL}/profile/payment?orderId=${midtransOrderId}&status=finish`,
      error: `${process.env.NEXT_PUBLIC_APP_URL}/profile/payment?orderId=${midtransOrderId}&status=error`,
      pending: `${process.env.NEXT_PUBLIC_APP_URL}/profile/payment?orderId=${midtransOrderId}&status=pending`,
    }
  };

  // createTransaction mengembalikan object dengan token & redirect_url
  const transaction = await snap.createTransaction(parameter);

  return {
    order_id: midtransOrderId,
    token: transaction.token,
    redirect_url: transaction.redirect_url,
  };
};
