
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { Loader, CheckCircle, XCircle } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function DashboardHome() {
//   const [user, setUser] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       const token = localStorage.getItem('authToken');
      
//       if (!token) {
//         setLoading(false);
//         router.push('/login');
//         return;
//       }

//       try {
//         const response = await fetch('http://localhost:5000/api/auth/profile', {
//           headers: {
//             'Authorization': `Bearer ${token}`
//           }
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch user profile');
//         }

//         const data = await response.json();
//         setUser(data.user);
//       } catch (err) {
//         console.error("Error fetching profile:", err);
//         setError("Error loading your profile");
//         if ((err as Error).message.includes('401')) {
//           localStorage.removeItem('authToken');
//           router.push('/login');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserProfile();
//   }, [router]);

//   const handleLogout = useCallback(() => {
//     localStorage.removeItem('authToken');
//     router.push('/login');
//   }, [router]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
//         <Loader className="animate-spin h-12 w-12 text-red-500" />
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
//         <div className="text-center">
//           <p className="mb-4">Please log in to view your dashboard</p>
//           <button 
//             onClick={() => router.push('/login')}
//             className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-sm"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
//       {error && (
//         <div className="mb-6 p-4 bg-red-800 rounded-lg">
//           <p className="flex items-center">
//             <XCircle className="h-5 w-5 mr-2" />
//             {error}
//           </p>
//         </div>
//       )}

//       <div className="mb-8 p-6 rounded-lg border border-gray-700 bg-gray-800">
//         <h1 className="text-3xl font-bold">Welcome, {user.full_name}</h1>
//         <p className="text-gray-400 mt-2">{user.email}</p>
        
//         <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="p-4 bg-gray-700 rounded-lg">
//             <h3 className="text-xl font-semibold mb-2">Membership Details</h3>
//             <p className="flex items-center space-x-2">
//               <strong>Status:</strong>
//               {user.membership_status === "Active" ? (
//                 <span className="text-green-400 flex items-center">
//                   <CheckCircle className="h-5 w-5 mr-1" /> Active
//                 </span>
//               ) : (
//                 <span className="text-red-400 flex items-center">
//                   <XCircle className="h-5 w-5 mr-1" /> Inactive
//                 </span>
//               )}
//             </p>
//             <p><strong>ID:</strong> {user.membershipID}</p>
//             {user.membership_plan && <p><strong>Plan:</strong> {user.membership_plan}</p>}
//             {user.payment_status && <p><strong>Payment:</strong> {user.payment_status}</p>}
//           </div>

//           <div className="p-4 bg-gray-700 rounded-lg">
//             <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
//             <p><strong>Age:</strong> {user.age}</p>
//             <p><strong>Gender:</strong> {user.gender}</p>
//             <p><strong>Phone:</strong> {user.phone_number}</p>
//             <p><strong>Address:</strong> {user.address}</p>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-center">
//         <button
//           onClick={handleLogout}
//           className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-sm"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader, CheckCircle, XCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setLoading(false);
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        setUser(data.user);
        localStorage.setItem('memberID',data.user.membershipID)
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("Error loading your profile");
        if ((err as Error).message.includes('401')) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('memberID');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('memberID');
    router.push('/login');
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <Loader className="animate-spin h-12 w-12 text-red-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
        <div className="text-center">
          <p className="mb-4">Please log in to view your dashboard</p>
          <button 
            onClick={() => router.push('/login')}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition-all shadow-sm"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
      {error && (
        <div className="mb-6 p-4 bg-red-800 rounded-lg">
          <p className="flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            {error}
          </p>
        </div>
      )}

      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user.full_name}</h1>
          <p className="text-gray-400 mt-1">{user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm"
        >
          <LogOut className="h-5 w-5 mr-2" /> Logout
        </button>
      </div>

      {/* Membership and Personal Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Membership Details Card */}
        <div className="p-6 rounded-lg border border-gray-700 bg-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Membership Details</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Status:</span>
              {user.membership_status === "Active" ? (
                <span className="text-green-400 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-1" /> Active
                </span>
              ) : (
                <span className="text-red-400 flex items-center">
                  <XCircle className="h-5 w-5 mr-1" /> Inactive
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">ID:</span>
              <span className="text-white">{user.membershipID}</span>
            </div>
            {user.membership_plan && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Plan:</span>
                <span className="text-white">{user.membership_plan}</span>
              </div>
            )}
            {user.payment_status && (
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Payment:</span>
                <span className="text-white">{user.payment_status}</span>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information Card */}
        <div className="p-6 rounded-lg border border-gray-700 bg-gray-800">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Age:</span>
              <span className="text-white">{user.age}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Gender:</span>
              <span className="text-white">{user.gender}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Phone:</span>
              <span className="text-white">{user.phone_number}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Address:</span>
              <span className="text-white">{user.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-8 text-center text-gray-400">
        {/* <p>© 2025 Flex Zone Gym. All rights reserved.</p> */}
      </div>
    </div>
  );
}
