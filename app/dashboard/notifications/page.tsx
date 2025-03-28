"use client";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";

interface PaymentDetails {
  renewal_date: string;
}

export default function Notification() {
  const [renewalDate, setRenewalDate] = useState<string | null>(null);
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

    // Fetch renewal date
    const fetchRenewalDate = async () => {
      try {
        const response = await fetch(
          `https://userbackend-1.onrender.com/api/payment/payment-details/${memberID}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch renewal date");
        }

        const data: PaymentDetails = await response.json();
        setRenewalDate(data.renewal_date);
      } catch (err) {
        console.error("Error fetching renewal date:", err);
        setError("Failed to fetch renewal date. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRenewalDate();
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

  if (!renewalDate) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        No renewal date found.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-900 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Renewal Date</h2>
        <p className="text-gray-400">
          Your membership needs to be renewed on:{" "}
          <span className="text-red-500 font-medium">
            {new Date(renewalDate).toLocaleDateString()}
          </span>
        </p>
      </div>
    </div>
  );
}
