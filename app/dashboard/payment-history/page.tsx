// "use client";
// import { useEffect, useState } from "react";
// import { Loader } from "lucide-react";

// interface PaymentDetails {
//   full_name: string;
//   email: string;
//   amount_Paid: number;
//   payment_date: string;
//   renewal_date: string;
//   membership_plan: string;
//   payment_status: string;
//   transactionID: string;
// }

// export default function PaymentHistory() {
//   const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const memberID = localStorage.getItem("memberID"); // Retrieve memberID from localStorage

//   useEffect(() => {
//     if (!memberID) {
//       setError("Member ID is missing. Please log in again.");
//       setLoading(false);
//       return;
//     }

//     // Fetch payment details
//     const fetchPaymentDetails = async () => {
//       try {
//         const response = await fetch(
//           `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payment/payment-details/${memberID}`
//         );

//         if (!response.ok) {
//           throw new Error("Failed to fetch payment details");
//         }

//         const data: PaymentDetails = await response.json();
//         setPaymentDetails(data);
//       } catch (err) {
//         console.error("Error fetching payment details:", err);
//         setError("Failed to fetch payment details. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPaymentDetails();
//   }, [memberID]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-900">
//         <Loader className="animate-spin h-12 w-12 text-red-500" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">
//         {error}
//       </div>
//     );
//   }

//   if (!paymentDetails) {
//     return (
//       <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
//         No payment history found.
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
//       <h1 className="text-3xl font-bold mb-6">Payment History</h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
//           <thead className="bg-gray-700">
//             <tr>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">
//                 Field
//               </th>
//               <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">
//                 Value
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-700">
//             <tr>
//               <td className="px-6 py-4 text-sm font-medium text-gray-300">
//                 Full Name
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-400">
//                 {paymentDetails.full_name}
//               </td>
//             </tr>
//             <tr>
//               <td className="px-6 py-4 text-sm font-medium text-gray-300">
//                 Email
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-400">
//                 {paymentDetails.email}
//               </td>
//             </tr>
//             <tr>
//               <td className="px-6 py-4 text-sm font-medium text-gray-300">
//                 Amount Paid
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-400">
//                 ₹{paymentDetails.amount_Paid}
//               </td>
//             </tr>
//             <tr>
//               <td className="px-6 py-4 text-sm font-medium text-gray-300">
//                 Payment Date
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-400">
//                 {new Date(paymentDetails.payment_date).toLocaleDateString()}
//               </td>
//             </tr>
//             <tr>
//               <td className="px-6 py-4 text-sm font-medium text-gray-300">
//                 Renewal Date
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-400">
//                 {new Date(paymentDetails.renewal_date).toLocaleDateString()}
//               </td>
//             </tr>
//             <tr>
//               <td className="px-6 py-4 text-sm font-medium text-gray-300">
//                 Membership Plan
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-400 capitalize">
//                 {paymentDetails.membership_plan}
//               </td>
//             </tr>
//             <tr>
//               <td className="px-6 py-4 text-sm font-medium text-gray-300">
//                 Payment Status
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-400 capitalize">
//                 {paymentDetails.payment_status}
//               </td>
//             </tr>
//             <tr>
//               <td className="px-6 py-4 text-sm font-medium text-gray-300">
//                 Transaction ID
//               </td>
//               <td className="px-6 py-4 text-sm text-gray-400">
//                 {paymentDetails.transactionID}
//               </td>
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

interface PaymentDetails {
  full_name: string;
  email: string;
  amount_Paid: number;
  payment_date: string;
  renewal_date: string;
  membership_plan: string;
  payment_status: string;
  transactionID: string;
}

export default function PaymentHistory() {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve memberID from localStorage on the client side
    const memberID = localStorage.getItem("memberID");

    if (!memberID) {
      setError("Member ID is missing. Please log in again.");
      setLoading(false);
      return;
    }

    // Fetch payment details
    const fetchPaymentDetails = async () => {
      try {
        const response = await fetch(
          `https://userbackend-1.onrender.com/api/payment/payment-details/${memberID}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch payment details");
        }

        const data: PaymentDetails = await response.json();
        setPaymentDetails(data);
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError("Failed to fetch payment details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <Loader className="animate-spin h-12 w-12 text-red-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-500">
        {error}
      </div>
    );
  }

  if (!paymentDetails) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        No payment history found.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Payment History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden shadow-lg">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">
                Field
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-300 uppercase">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-300">
                Full Name
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {paymentDetails.full_name}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-300">
                Email
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {paymentDetails.email}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-300">
                Amount Paid
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                ₹{paymentDetails.amount_Paid}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-300">
                Payment Date
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {new Date(paymentDetails.payment_date).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-300">
                Renewal Date
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {new Date(paymentDetails.renewal_date).toLocaleDateString()}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-300">
                Membership Plan
              </td>
              <td className="px-6 py-4 text-sm text-gray-400 capitalize">
                {paymentDetails.membership_plan}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-300">
                Payment Status
              </td>
              <td className="px-6 py-4 text-sm text-gray-400 capitalize">
                {paymentDetails.payment_status}
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 text-sm font-medium text-gray-300">
                Transaction ID
              </td>
              <td className="px-6 py-4 text-sm text-gray-400">
                {paymentDetails.transactionID}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
