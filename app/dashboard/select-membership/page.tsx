"use client";
// import { useState } from "react";
// import { CreditCard } from "lucide-react";

// export default function SelectMembership() {
//   const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

//   const membershipPlans = [
//     { type: "monthly", price: 1200, description: "Perfect for short-term fitness goals" },
//     { type: "quarterly", price: 4000, description: "Ideal for consistent training over 3 months" },
//     { type: "annually", price: 11200, description: "Best value for long-term commitment" },
//   ];

//   const handlePayment = () => {
//     if (selectedPlan) {
//       alert(`Proceeding to payment for ${selectedPlan} plan`);
//       // Add payment logic here
//     } else {
//       alert("Please select a membership plan");
//     }
//   };

//   return (
//     <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
//       <h1 className="text-3xl font-bold mb-6">Select Membership Plan</h1>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {membershipPlans.map((plan) => (
//           <div
//             key={plan.type}
//             className={`p-6 rounded-lg border ${
//               selectedPlan === plan.type
//                 ? "border-red-600 bg-red-600/10"
//                 : "border-gray-700 bg-gray-800 hover:bg-gray-700"
//             } transition-all cursor-pointer`}
//             onClick={() => setSelectedPlan(plan.type)}
//           >
//             <h2 className="text-xl font-semibold capitalize mb-2">{plan.type}</h2>
//             <p className="text-2xl font-bold text-red-500 mb-2">₹{plan.price}</p>
//             <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
//             <button
//               className={`w-full py-2 rounded-lg ${
//                 selectedPlan === plan.type
//                   ? "bg-red-600 hover:bg-red-700"
//                   : "bg-gray-700 hover:bg-gray-600"
//               } text-white font-medium transition-all`}
//               onClick={handlePayment}
//             >
//               Select Plan
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Payment Button */}
//       <div className="mt-8 flex justify-center">
//         <button
//           onClick={handlePayment}
//           className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
//         >
//           <CreditCard className="h-5 w-5 mr-2" /> Proceed to Payment
//         </button>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { CreditCard } from "lucide-react";

export default function SelectMembership() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const memberID = localStorage.getItem('memberID'); // Retrieve memberID from localStorage

  const membershipPlans = [
    { type: "monthly", price: 1200, description: "Perfect for short-term fitness goals" },
    { type: "quarterly", price: 4000, description: "Ideal for consistent training over 3 months" },
    { type: "annually", price: 11200, description: "Best value for long-term commitment" },
  ];

  const handlePayment = async (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent event propagation

    if (!memberID) {
      alert("Member ID is missing. Please log in again.");
      return;
    }

    if (!selectedPlan) {
      alert("Please select a membership plan");
      return;
    }

    const plan = membershipPlans.find(p => p.type === selectedPlan);
    if (!plan) {
      alert("Invalid membership plan selected");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const response = await fetch('http://localhost:5000/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          membershipID: memberID,
          amount: plan.price,
          membership_plan: plan.type,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const data = await response.json();
      window.location.href = data.url; // Redirect to payment URL
    } catch (err) {
      console.error("Error creating payment order:", err);
      alert("Failed to create payment order. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Select Membership Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {membershipPlans.map((plan) => (
          <div
            key={plan.type}
            className={`p-6 rounded-lg border ${
              selectedPlan === plan.type
                ? "border-red-600 bg-red-600/10"
                : "border-gray-700 bg-gray-800 hover:bg-gray-700"
            } transition-all cursor-pointer`}
            onClick={() => setSelectedPlan(plan.type)}
          >
            <h2 className="text-xl font-semibold capitalize mb-2">{plan.type}</h2>
            <p className="text-2xl font-bold text-red-500 mb-2">₹{plan.price}</p>
            <p className="text-gray-400 text-sm mb-4">{plan.description}</p>
            <button
              className={`w-full py-2 rounded-lg ${
                selectedPlan === plan.type
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-gray-700 hover:bg-gray-600"
              } text-white font-medium transition-all`}
              onClick={(e) => {
                e.stopPropagation(); // Prevent event propagation
                handlePayment(e);
              }}
              disabled={isLoading} // Disable button while loading
            >
              {isLoading ? "Processing..." : "Select Plan"}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={handlePayment}
          className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
          disabled={isLoading} // Disable button while loading
        >
          <CreditCard className="h-5 w-5 mr-2" /> 
          {isLoading ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
