// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import * as Icons from "lucide-react";
// import { mobileNavItems } from "@/data/FestData";

// const MobileNavbar = () => {
//   const pathname = usePathname();

//   return (
//     <nav
//       className="fixed bottom-0 left-0 w-full z-50 sm:hidden"
//       style={{
//         backgroundColor: "var(--background)",
//         color: "var(--foreground)",
//         borderTop: "1px solid var(--border)",
//       }}
//     >
//       <div className="flex justify-around items-center px-2 py-3">
//         {mobileNavItems.map((item) => (
//           <NavItem
//             key={item.href}
//             href={item.href}
//             label={item.label}
//             icon={Icons[item.icon]}
//             active={pathname === item.href}
//           />
//         ))}
//       </div>
//     </nav>
//   );
// };

// const NavItem = ({ href, icon: Icon , label, active }) => {
//   return (
//     <Link
//       href={href}
//       aria-label={label}
//       title={label}
//       className={`flex flex-col items-center justify-center px-3 py-2 rounded-full text-sm transition-all duration-200 ${
//         active ? "bg-[var(--border)] text-[var(--accent)]" : "text-[var(--secondary)] hover:text-[var(--highlight)]"
//       }`}
//     >
//       <Icon size={22} />
//       {/* Uncomment below if you want to show text label under icons */}
//       {/* <span className="text-[10px] mt-0.5">{label}</span> */}
//     </Link>
//   );
// };

// export default MobileNavbar;
