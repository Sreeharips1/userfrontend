'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";
import { Suspense } from 'react';
import RegisterFormContent from './RegisterFormContent'; // Import the child component

interface FormData {
  full_name: string;
  email: string;
  age: string;
  gender: string;
  phone_number: string;
  emergency_contact: string;
  address: string;
  pincode: string;
  health_condition: string;
}

interface ApiResponse {
  token: string;
  error?: string;
}

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    email: "",
    age: "",
    gender: "male",
    phone_number: "",
    emergency_contact: "",
    address: "",
    pincode: "",
    health_condition: "Normal",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: ApiResponse = await response.json();

      if (response.ok) {
        localStorage.setItem("authToken", data.token);
        alert("Registration Successful!");
        router.push("/dashboard");
      } else {
        setError(data.error || "Error in Registration");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Registration Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="flex items-center justify-center min-h-screen p-4"
      style={{
        backgroundImage: "url('/assets/bbb.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-gray-800 bg-opacity-90 p-8 rounded-xl shadow-2xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Register</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <Suspense fallback={<div>Loading...</div>}>
          <RegisterFormContent formData={formData} setFormData={setFormData} />
        </Suspense>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                placeholder="Enter your full name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
              <input
                type="number"
                name="age"
                placeholder="Enter your age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                placeholder="Enter your phone number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Emergency Contact</label>
              <input
                type="text"
                name="emergency_contact"
                placeholder="Enter emergency contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Pincode */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                placeholder="Enter your pincode"
                value={formData.pincode}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Health Condition */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Health Condition</label>
              <select
                name="health_condition"
                value={formData.health_condition}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
              >
                <option value="Normal">Normal</option>
                <option value="Not Normal">Not Normal</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-gray-300 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-red-400 hover:text-red-600">Login</Link>
        </p>
        <p className="text-white text-sm text-center">
          By registering, you agree to{" "}
          <Link href="/terms-policy" className="text-red-400 underline hover:text-red-600 transition-all">
            Terms & Privacy Policy
          </Link>
        </p>
        <div className="flex justify-center mt-4">
          <Link
            href="/"
            className="text-red-600 hover:text-red-800 transition-all duration-300 flex items-center justify-center"
          >
            <Home className="w-6 h-6 md:w-8 md:h-8 transition-transform transform hover:scale-110" />
          </Link>
        </div>
      </div>
    </div>
  );
}
// 'use client';

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { Home } from "lucide-react";
// import { Suspense } from 'react';
// import RegisterFormContent from './RegisterFormContent'; // Import the child component

// interface FormData {
//   full_name: string;
//   email: string;
//   age: string;
//   gender: string;
//   phone_number: string;
//   emergency_contact: string;
//   address: string;
//   pincode: string;
//   health_condition: string;
// }

// interface ApiResponse {
//   token: string;
//   error?: string;
// }

// export default function RegisterForm() {
//   const router = useRouter();
//   const [formData, setFormData] = useState<FormData>({
//     full_name: "",
//     email: "",
//     age: "",
//     gender: "male",
//     phone_number: "",
//     emergency_contact: "",
//     address: "",
//     pincode: "",
//     health_condition: "Normal",
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data: ApiResponse = await response.json();

//       if (response.ok) {
//         localStorage.setItem("authToken", data.token);
//         alert("Registration Successful!");
//         router.push("/dashboard");
//       } else {
//         setError(data.error || "Error in Registration");
//       }
//     } catch (err) {
//       setError("An error occurred. Please try again.");
//       console.error("Registration Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 p-4">
//       <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-2xl border-2 border-red-600">
//         <h2 className="text-3xl font-bold text-white text-center mb-6">Register</h2>

//         {error && <div className="text-red-500 text-center mb-4">{error}</div>}

//         <Suspense fallback={<div>Loading...</div>}>
//           <RegisterFormContent formData={formData} setFormData={setFormData} />
//         </Suspense>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Form Fields */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Full Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
//               <input
//                 type="text"
//                 name="full_name"
//                 placeholder="Enter your full name"
//                 value={formData.full_name}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
//               <input
//                 type="email"
//                 name="email"
//                 placeholder="Enter your email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
//               />
//             </div>

//             {/* Age */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Age</label>
//               <input
//                 type="number"
//                 name="age"
//                 placeholder="Enter your age"
//                 value={formData.age}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
//               />
//             </div>

//             {/* Gender */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Gender</label>
//               <select
//                 name="gender"
//                 value={formData.gender}
//                 onChange={handleChange}
//                 className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
//               >
//                 <option value="male">Male</option>
//                 <option value="female">Female</option>
//               </select>
//             </div>

//             {/* Phone Number */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
//               <input
//                 type="text"
//                 name="phone_number"
//                 placeholder="Enter your phone number"
//                 value={formData.phone_number}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
//               />
//             </div>

//             {/* Emergency Contact */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Emergency Contact</label>
//               <input
//                 type="text"
//                 name="emergency_contact"
//                 placeholder="Enter emergency contact"
//                 value={formData.emergency_contact}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
//               />
//             </div>

//             {/* Address */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
//               <input
//                 type="text"
//                 name="address"
//                 placeholder="Enter your address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
//               />
//             </div>

//             {/* Pincode */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Pincode</label>
//               <input
//                 type="text"
//                 name="pincode"
//                 placeholder="Enter your pincode"
//                 value={formData.pincode}
//                 onChange={handleChange}
//                 required
//                 className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
//               />
//             </div>

//             {/* Health Condition */}
//             <div>
//               <label className="block text-sm font-medium text-gray-300 mb-1">Health Condition</label>
//               <select
//                 name="health_condition"
//                 value={formData.health_condition}
//                 onChange={handleChange}
//                 className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-red-500"
//               >
//                 <option value="Normal">Normal</option>
//                 <option value="Not Normal">Not Normal</option>
//               </select>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 disabled:opacity-50"
//           >
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         <p className="text-gray-300 text-sm text-center mt-6">
//           Already have an account?{" "}
//           <Link href="/login" className="text-red-400 hover:text-red-600">Login</Link>
//         </p>
//         <p className="text-white text-sm text-center">
//           By registering, you agree to{" "}
//           <Link href="/terms-policy" className="text-red-400 underline hover:text-red-600 transition-all">
//             Terms & Privacy Policy
//           </Link>
//         </p>
//         <div className="flex justify-center mt-4">
//           <Link
//             href="/"
//             className="text-red-600 hover:text-red-800 transition-all duration-300 flex items-center justify-center"
//           >
//             <Home className="w-6 h-6 md:w-8 md:h-8 transition-transform transform hover:scale-110" />
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
