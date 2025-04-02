"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "react-hot-toast";

interface Trainer {
  trainerID: string;
  trainer_name: string;
  specialization: string;
  phone_number: string;
  availability: string | { [day: string]: boolean };
  passport_photo: string | null;
  assigned_Members?: number;
}

// Helper function to parse availability
const parseAvailability = (availability: string | { [day: string]: boolean }) => {
  if (typeof availability === 'string') {
    try {
      return JSON.parse(availability);
    } catch (e) {
      console.error("Error parsing availability", e);
      return {};
    }
  }
  return availability;
};

// Helper function to check if trainer is currently available
const isTrainerAvailable = (availability: string | { [day: string]: boolean }) => {
  const availabilityObj = parseAvailability(availability);
  const today = new Date().toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
  return availabilityObj[today] === true;
};

export default function AssignedTrainerPage() {
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const membershipID = localStorage.getItem("memberID");
        if (!membershipID) {
          throw new Error("Membership ID not found in localStorage");
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin/trainers/${membershipID}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.error === "No trainer assigned to this member") {
          setTrainer(null);
          toast.error("No trainer assigned to this member");
        } else if (response.data.error) {
          throw new Error(response.data.error);
        } else {
          setTrainer(response.data);
        }
      } catch (err) {
        const error = err as AxiosError<{ error?: string }>;
        console.error("Error fetching trainer:", error);
        
        if (error.response?.status === 404) {
          setTrainer(null);
          if (error.response.data?.error === "Member not found") {
            toast.error("Member not found");
          } else {
            toast.error("No trainer assigned");
          }
        } else {
          const errorMessage = error.response?.data?.error || 
                              error.message ||
                              "Failed to fetch trainer details";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTrainer();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading trainer details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-white-100">Assigned Trainer</h1>
        <div className="bg-white rounded-lg shadow-md p-6 border border-red-200">
          <h2 className="text-lg font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-300">Assigned Trainer</h1>

      {trainer ? (
        <div className="bg-grey-500 rounded-lg shadow-md overflow-hidden border border-red-500">
          <div className="md:flex">
            {trainer.passport_photo ? (
              <div className="md:w-1/3 p-6 bg-gray-50 flex items-center justify-center">
                <img
                  src={trainer.passport_photo}
                  alt={`${trainer.trainer_name}'s photo`}
                  className="w-full max-w-[250px] h-auto rounded-lg object-cover border border-red-500"
                />
              </div>
            ) : (
              <div className="md:w-1/3 p-6 bg-grey-500 flex items-center justify-center">
                <div className="w-full max-w-[250px] h-[250px] bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                  No Photo Available
                </div>
              </div>
            )}
            
            <div className="md:w-2/3 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-red-500">NAME :{trainer.trainer_name}</h2>
                <p className="text-sm text-red-500">ID: {trainer.trainerID}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Specialization</h3>
                  <p className="text-gray-600">{trainer.specialization}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Contact:</h3>
                  <p className="text-gray-600">{trainer.phone_number}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Availability:</h3>
                  <p className="text-gray-600">
                    {isTrainerAvailable(trainer.availability) ? 
                      <span className="text-green-500">Available Today</span> : 
                      <span className="text-red-500">Not Available Today</span>}
                  </p>
                  <details className="mt-2 text-sm text-gray-500">
                    <summary>Weekly Schedule</summary>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {Object.entries(parseAvailability(trainer.availability)).map(([day, isAvailable]) => (
                        <div key={day} className="flex items-center">
                          <span className="capitalize">{day}:</span>
                          <span className={`ml-2 ${isAvailable ? 'text-green-500' : 'text-red-500'}`}>
                            {isAvailable ? '✓' : '✗'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">Assigned Members:</h3>
                  <p className="text-gray-600">
                    {trainer.assigned_Members || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Trainer Assigned</h3>
            <p className="mt-1 text-sm text-gray-500">
              You currently don't have a trainer assigned to you.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// // Define the Trainer type
// interface Trainer {
//   name: string;
//   email: string;
//   phone: string;
// }

// export default function AssignedTrainerPage() {
//   const [trainer, setTrainer] = useState<Trainer | null>(null);

//   useEffect(() => {
//     const fetchTrainer = async () => {
//       try {
//         const { data } = await axios.get<Trainer>(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/trainers/assigned-trainer`);
//         setTrainer(data);
//       } catch  {
//         toast.error("Failed to fetch trainer details");
//       }
//     };

//     fetchTrainer();
//   }, []);

//   return (
//     <div>
//       <h1 className="text-2xl font-semibold">Assigned Trainer</h1>

//       {trainer ? (
//         <div className="mt-4 p-4 border border-gray-600 rounded-lg">
//           <p>Name: {trainer.name}</p>
//           <p>Email: {trainer.email}</p>
//           <p>Phone: {trainer.phone}</p>
//         </div>
//       ) : (
//         <p className="mt-4 text-gray-400">No trainer assigned.</p>
//       )}
//     </div>
//   );
// }
