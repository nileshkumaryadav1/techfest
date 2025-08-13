// /api/payment/verify-registration.js
import crypto from "crypto";
import Student from "@/models/Student";
import connectDB from "@/utils/db";

export async function POST(req) {
  await connectDB();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, studentData, amount } = await req.json();

  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {
    // Create student with hasPaid: true
    await Student.create({
      ...studentData,
      hasPaid: true,
      paymentId: razorpay_payment_id,
      amountPaid: amount
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ success: false, message: "Invalid signature" }), { status: 400 });
}
