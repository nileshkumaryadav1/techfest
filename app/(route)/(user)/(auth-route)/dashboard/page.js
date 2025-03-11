"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    router.replace("/login");
    return;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[90vh] text-center ">
      <div className="p-6 bg-white rounded-lg shadow-md ">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <p>Welcome, {session.user.name}!</p>
        <p>Email: {session.user.email}</p>
        <p>Role: {session.user.role}</p>
        <button
          className="mt-4 inline-block bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
