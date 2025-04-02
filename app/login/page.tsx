'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const LoginPage = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.id = 'otpless-sdk';
        script.type = 'text/javascript';
        script.dataset.appid = process.env.NEXT_PUBLIC_OTPLESS_APP_ID; // Use environment variable
        script.src = 'https://otpless.com/v4/auth.js';
        document.head.appendChild(script);

        // OTPLESS callback function
        window.otpless = async (otplessUser: any) => {
            console.log('OTPless Response:', otplessUser);

            let email = '';

            // Extract email from OTPless response
            if (otplessUser.identities && otplessUser.identities.length > 0) {
                email = otplessUser.identities[0].identityValue;
            }

            console.log("Final Email:", email);

            setLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/handlelogin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                });

                const data = await response.json();
                
                if (response.ok) {
                    if (data.newUser) {
                        router.push(`/register?email=${encodeURIComponent(email)}`);
                    } else {
                        localStorage.setItem('authToken', data.token);
                        router.push('/dashboard');
                    }
                } else {
                    alert(data.error || 'Login failed. Please try again.');
                }
            } catch (error) {
                console.error('Error during authentication:', error);
                alert('Login failed. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        return () => {
            if (document.getElementById('otpless-sdk')) {
                document.head.removeChild(document.getElementById('otpless-sdk')!);
            }
            // @ts-expect-error- Deleting a property from window
            delete window.otpless;
        };
    }, [router]);

    return (
        <div 
            className="flex items-center justify-center min-h-screen p-4"
            style={{
                backgroundImage: "url('/assets/bbb.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className=" p-6 rounded-xl shadow-2xl max-w-md w-full relative backdrop-blur-sm">
                <Link href="/" className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full p-2 text-white hover:text-gray-300 transition-all">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <Link href="/register" className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full p-2 text-white hover:text-gray-300 transition-all">
                    <ArrowRight className="w-6 h-6" />
                </Link>
                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                ) : (
                    <div id="otpless-login-page" className="flex justify-center"></div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 p-4">
//             <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border-2 border-red-800 max-w-md w-full relative">
//                 {/* Left Arrow Button */}
//                 <button
//                     onClick={() => router.push('/')}
//                     className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-8 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-all"
//                 >
//                     <ArrowLeft className="h-6 w-6 text-white" />
//                 </button>

//                 {/* Right Arrow Button */}
//                 <button
//                     onClick={() => router.push('/register')}
//                     className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8 bg-gray-700 p-2 rounded-full hover:bg-gray-600 transition-all"
//                 >
//                     <ArrowRight className="h-6 w-6 text-white" />
//                 </button>

//                 {loading ? (
//                     <div className="flex justify-center">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
//                     </div>
//                 ) : (
//                     <div id="otpless-login-page" className="flex justify-center"></div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default LoginPage;
