"use client"; // Mark as a Client Component

import { useState, useEffect } from "react";
import { CreditCard } from "lucide-react";


interface MembershipPlan {
  Monthly: number;
  Quarterly: number;
  Annually: number;
}

export default function SelectMembership() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [memberID, setMemberID] = useState<string | null>(null);
  const [plans, setPlans] = useState<MembershipPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch memberID from localStorage and plans from backend
  useEffect(() => {
    const id = localStorage.getItem("memberID");
    setMemberID(id);
    
    const fetchPlans = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/membership/plans`);
        if (!response.ok) {
          throw new Error("Failed to fetch membership plans");
        }
        const data = await response.json();
        setPlans(data.plans);
      } catch (err) {
        console.error("Error fetching plans:", err);
        setError("Failed to load membership plans. Please try again later.");
      }
    };

    fetchPlans();
  }, []);

  const membershipPlans = [
    { 
      type: "Monthly", 
      price: plans?.Monthly || 0, 
      description: "Perfect for short-term fitness goals" 
    },
    { 
      type: "Quarterly", 
      price: plans?.Quarterly || 0, 
      description: "Ideal for consistent training over 3 months" 
    },
    { 
      type: "Annually", 
      price: plans?.Annually || 0, 
      description: "Best value for long-term commitment" 
    },
  ];

  const handlePayment = async (event: React.MouseEvent) => {
    event.stopPropagation();

    if (!memberID) {
      alert("Member ID is missing. Please log in again.");
      return;
    }

    if (!selectedPlan) {
      alert("Please select a membership plan");
      return;
    }

    const plan = membershipPlans.find((p) => p.type === selectedPlan);
    if (!plan) {
      alert("Invalid membership plan selected");
      return;
    }

    if (!plan.price || plan.price <= 0) {
      alert("Invalid price for selected plan. Please try again later.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/payment/create-order/${memberID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            membership_plan: plan.type,
            // Note: We don't need to send amount as it's fetched from backend in the controller
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment order");
      }

      const data = await response.json();
      
      // Redirect to payment gateway
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (err:any) {
      console.error("Payment error:", err);
      alert(err.message || "Failed to initiate payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6">Select Membership Plan</h1>
        <div className="text-red-500">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!plans) {
    return (
      <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
        <h1 className="text-3xl font-bold mb-6">Select Membership Plan</h1>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading membership plans...</span>
        </div>
      </div>
    );
  }

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
                e.stopPropagation();
                handlePayment(e);
              }}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Select Plan"}
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handlePayment}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg"
            disabled={isLoading}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      )}
    </div>
  );
}
