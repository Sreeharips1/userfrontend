"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CreditCard, Dumbbell, Bell, CalendarCheck } from "lucide-react";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Home", path: "/dashboard", icon: <Home size={18} /> },
    { name: "Payment History", path: "/dashboard/payment-history", icon: <CreditCard size={18} /> },
    { name: "Assigned Trainer", path: "/dashboard/assigned-trainer", icon: <Dumbbell size={18} /> },
    { name: "Notifications", path: "/dashboard/notifications", icon: <Bell size={18} /> },
    { name: "Select Membership", path: "/dashboard/select-membership", icon: <CalendarCheck size={18} /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-6 flex flex-col border-r border-gray-800">
      {/* Logo Section */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-wide text-red-600">FLEX ZONE GYM</h2>
        <p className="text-sm text-gray-400 mt-1">Your Fitness Journey Starts Here</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map(({ name, path, icon }) => (
            <li key={path}>
              <Link
                href={path}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all 
                ${
                  pathname === path
                    ? "bg-red-600 text-white shadow-lg border-l-4 border-red-500 hover:bg-red-700"
                    : "hover:bg-gray-800 text-gray-300 hover:text-white"
                }`}
              >
                <span className="flex items-center justify-center w-6 h-6">
                  {icon}
                </span>
                <span className="text-sm font-medium">{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logo Image Above Footer */}
      <div className="mt-8 mb-4 flex justify-center">
        <Image
          src="/logo.png" // Replace with the correct path to your logo
          alt="Flex Zone Gym Logo"
          width={100}
          height={100}
          className="rounded-lg"
        />
      </div>

      {/* Footer Section */}
      <div className="text-center text-gray-400 text-sm">
        <p>© 2025 webgeon solutions</p>
        <p>All rights reserved</p>
      </div>
    </div>
  );
}
// "use client";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Home, CreditCard, Dumbbell, Bell } from "lucide-react";

// export default function Sidebar() {
//   const pathname = usePathname();

//   const menuItems = [
//     { name: "Home", path: "/dashboard", icon: <Home size={18} /> },
//     { name: "Payment History", path: "/dashboard/payment-history", icon: <CreditCard size={18} /> },
//     { name: "Assigned Trainer", path: "/dashboard/assigned-trainer", icon: <Dumbbell size={18} /> },
//     { name: "Notifications", path: "/dashboard/notifications", icon: <Bell size={18} /> },
//   ];

//   return (
//     <div className="w-64 bg-gray-900 text-white h-screen p-6 flex flex-col border-r border-gray-800">
//       {/* Logo Section */}
//       <div className="text-center mb-8">
//         <h2 className="text-2xl font-bold tracking-wide text-red-600">FLEX ZONE GYM</h2>
//         <p className="text-sm text-gray-400 mt-1">Your Fitness Journey Starts Here</p>
//       </div>

//       {/* Navigation Menu */}
//       <nav className="flex-1">
//         <ul className="space-y-2">
//           {menuItems.map(({ name, path, icon }) => (
//             <li key={path}>
//               <Link
//                 href={path}
//                 className={`flex items-center gap-3 p-3 rounded-lg transition-all 
//                 ${
//                   pathname === path
//                     ? "bg-red-600 text-white shadow-lg border-l-4 border-red-500 hover:bg-red-700"
//                     : "hover:bg-gray-800 text-gray-300 hover:text-white"
//                 }`}
//               >
//                 <span className="flex items-center justify-center w-6 h-6">
//                   {icon}
//                 </span>
//                 <span className="text-sm font-medium">{name}</span>
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </nav>

//       {/* Footer Section */}
//       <div className="mt-auto text-center text-gray-400 text-sm">
//         <p>© 2025 webgeon solutions</p>
//         <p>All rights reserved</p>
//       </div>
//     </div>
//   );
// }

