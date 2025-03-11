import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="p-10 m-5 flex flex-col items-center justify-center border rounded border-gray-400 m-40 bg-gray-100 shadow-xl">
      <h2 className="text-3xl font-bold mb-5" >Admin</h2>
      <Link
        href={"/admin/homepage"}
        className="m-2 border border-blue-400 p-2 rounded bg-blue-400 text-white hover:bg-blue-600"
      >
        Manage data
      </Link>
    </div>
  );
}

export default page;
