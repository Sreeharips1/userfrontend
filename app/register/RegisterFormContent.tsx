'use client';

import { useSearchParams } from 'next/navigation';

interface RegisterFormContentProps {
  formData: {
    email: string;
  };
  setFormData: (data: any) => void;
}

export default function RegisterFormContent({ formData, setFormData }: RegisterFormContentProps) {
  const searchParams = useSearchParams();
  const email = searchParams?.get('email') || '';

  // Update the form data with the email from query params
  if (email && formData.email !== email) {
    setFormData((prev: any) => ({ ...prev, email }));
  }

  return null; // This component doesn't render anything
}