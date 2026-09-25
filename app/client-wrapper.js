"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import MobileNavbar from "@/components/MobileNavbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main className={isAdminRoute ? "" : "mt-12 md:mt-16"}>{children}</main>
      <Toaster position="top-right" reverseOrder={false} />
      {!isAdminRoute && <MobileNavbar />}
      {!isAdminRoute && <Footer />}
    </>
  );
}
