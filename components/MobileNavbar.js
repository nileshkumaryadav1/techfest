"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, User, Presentation } from "lucide-react";
// import { useSession} from "next-auth/react";

const MobileNavbar = () => {
  const pathname = usePathname();
  // const { data: session } = useSession();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900shadow-lg sm:hidden">
      <div className="flex justify-around items-center bg-gray-800 p-3 shadow-md">
        <NavItem href="/" icon={Home} label="Home" active={pathname === "/"} />
        <NavItem
          href="/events"
          icon={Calendar}
          label="Events"
          active={pathname === "/events"}
        />
        <NavItem
          href="/registered-event"
          icon={Presentation}
          label="Registered Event"
          active={pathname === "/registered-event"}
        />
        <NavItem
          href="/dashboard"
          icon={User}
          label="Dashboard"
          active={pathname === "/dashboard"}
        />
        {/* {session ? (
          <NavItem
          href="/dashboard"
          icon={User}
          label="Dashboard"
          active={pathname === "/dashboard"}
        />
        ) : (
          <NavItem
          href="/login"
          icon={User}
          label="Login"
          active={pathname === "/login"}
        />
        )} */}
      </div>
    </nav>
  );
};

const NavItem = ({ href, icon: Icon, label, active }) => {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center px-4 
        py-2 transition-all ${
          active
            ? "text-blue-400 bg-gray-700 rounded-full px-2 py-2"
            : "text-gray-400"
        }`}
    >
      <Icon size={24} className="mb-1" />
      {/* <span className="text-xs font-medium">{label}</span> */}
    </Link>
  );
};

export default MobileNavbar;
