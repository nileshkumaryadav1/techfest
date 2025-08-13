// /api/payment/create-registration-order.js
import Razorpay from "razorpay";

export async function POST(req) {
  const { name, email, password } = await req.json();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET
  });

  const order = await razorpay.orders.create({
    amount: 5000, // Rs 50.00 (in paise)
    currency: "INR",
    receipt: `registration-${email}`,
  });

  return new Response(JSON.stringify({
    order,
    studentData: { name, email, password } // store temporarily in frontend
  }), { status: 200 });
}
