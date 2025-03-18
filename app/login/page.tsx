// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';

// const LoginPage = () => {
//     const router = useRouter();
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const script = document.createElement('script');
//         script.id = 'otpless-sdk';
//         script.type = 'text/javascript';
//         script.dataset.appid = process.env.NEXT_PUBLIC_OTPLESS_APP_ID; // Use environment variable
//         script.src = 'https://otpless.com/v4/auth.js';
//         document.head.appendChild(script);

//         // OTPLESS callback function
//         window.otpless = async (otplessUser: any) => {
//             console.log('OTPless Response:', otplessUser);

//             let email = '';

//             // Extract email from OTPless response
//             if (otplessUser.identities && otplessUser.identities.length > 0) {
//                 email = otplessUser.identities[0].identityValue;
//             }

//             // If email is missing, prompt user to enter manually
//             if (!email) {
//                 email = prompt("Please enter your email:");
//                 if (!email) {
//                     alert("Email is required to continue.");
//                     return;
//                 }
//             }

//             console.log("Final Email:", email);

//             setLoading(true);
//             try {
//                 const response = await fetch('http://localhost:5000/api/auth/handlelogin', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ email }),
//                 });

//                 const data = await response.json();
                
//                 if (response.ok) {
//                     if (data.newUser) {
//                         router.push(`/register?email=${encodeURIComponent(email)}`);
//                     } else {
//                         localStorage.setItem('authToken', data.token);
//                         router.push('/dashboard');
//                     }
//                 } else {
//                     alert(data.error || 'Login failed. Please try again.');
//                 }
//             } catch (error) {
//                 console.error('Error during authentication:', error);
//                 alert('Login failed. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         return () => {
//             if (document.getElementById('otpless-sdk')) {
//                 document.head.removeChild(document.getElementById('otpless-sdk')!);
//             }
//             // @ts-ignore
//             delete window.otpless;
//         };
//     }, [router]);

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 p-4">
//             <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border-2 border-red-800 max-w-md w-full">
//                 {/* <h2 className="text-3xl font-bold text-white text-center mb-6">Login</h2>
//                 <p className="text-gray-300 text-center mb-6">Log in to access your gym membership details</p> */}
                
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
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react'; // Import icons

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
        interface OtplessUser {
            token: string; // Expected structure
        }

        window.otpless = async (otplessUser: OtplessUser) => {
            console.log('OTPless Response:', otplessUser);

            let email = '';

            // Extract email from the token or prompt the user
            if (otplessUser.token) {
                // Decode the token or extract email (if applicable)
                email = otplessUser.token; // Replace with actual logic to extract email
            } else {
                const userInput = prompt("Please enter your email:");
                if (!userInput) {
                    alert("Email is required to continue.");
                    return;
                }
                email = userInput; // Assign the non-null value to email
            }

            console.log("Final Email:", email);

            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/api/auth/handlelogin', {
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
            // @ts-expect-error - Deleting a property from window
            delete window.otpless;
        };
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 p-4">
            <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border-2 border-red-800 max-w-md w-full relative">
                {/* Left Arrow - Homepage */}
                <Link href="/" className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full p-2 text-red-600 hover:text-red-800 transition-all">
                    <ArrowLeft className="w-6 h-6" />
                </Link>

                {/* Right Arrow - Registration Page */}
                <Link href="/register" className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full p-2 text-red-600 hover:text-red-800 transition-all">
                    <ArrowRight className="w-6 h-6" />
                </Link>

                {/* Loading Spinner or OTPLESS Login */}
                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800"></div>
                    </div>
                ) : (
                    <div id="otpless-login-page" className="flex justify-center"></div>
                )}
            </div>
        </div>
    );
};

export default LoginPage;
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';
// import { ArrowLeft, ArrowRight } from 'lucide-react'; // Import icons

// const LoginPage = () => {
//     const router = useRouter();
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const script = document.createElement('script');
//         script.id = 'otpless-sdk';
//         script.type = 'text/javascript';
//         script.dataset.appid = process.env.NEXT_PUBLIC_OTPLESS_APP_ID; // Use environment variable
//         script.src = 'https://otpless.com/v4/auth.js';
//         document.head.appendChild(script);

//         // OTPLESS callback function
//         interface OtplessUser {
//             identities?: { identityValue: string }[];
//         }

//         window.otpless = async (otplessUser: OtplessUser) => {
//             console.log('OTPless Response:', otplessUser);

//             let email = '';

//             // Extract email from OTPless response
//             if (otplessUser.identities && otplessUser.identities.length > 0) {
//                 email = otplessUser.identities[0].identityValue;
//             }

//             // If email is missing, prompt user to enter manually
//             if (!email) {
//                 email = prompt("Please enter your email:");
//                 if (!email) {
//                     alert("Email is required to continue.");
//                     return;
//                 }
//             }

//             console.log("Final Email:", email);

//             setLoading(true);
//             try {
//                 const response = await fetch('http://localhost:5000/api/auth/handlelogin', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ email }),
//                 });

//                 const data = await response.json();
                
//                 if (response.ok) {
//                     if (data.newUser) {
//                         router.push(`/register?email=${encodeURIComponent(email)}`);
//                     } else {
//                         localStorage.setItem('authToken', data.token);
//                         router.push('/dashboard');
//                     }
//                 } else {
//                     alert(data.error || 'Login failed. Please try again.');
//                 }
//             } catch (error) {
//                 console.error('Error during authentication:', error);
//                 alert('Login failed. Please try again.');
//             } finally {
//                 setLoading(false);
//             }
//         };

//         return () => {
//             if (document.getElementById('otpless-sdk')) {
//                 document.head.removeChild(document.getElementById('otpless-sdk')!);
//             }
//             // @ts-expect-error - Deleting a property from window
//             delete window.otpless;
//         };
//     }, [router]);

//     return (
//         <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-800 p-4">
//             <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border-2 border-red-800 max-w-md w-full relative">
//                 {/* Left Arrow - Homepage */}
//                 <Link href="/" className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full p-2 text-red-600 hover:text-red-800 transition-all">
//                     <ArrowLeft className="w-6 h-6" />
//                 </Link>

//                 {/* Right Arrow - Registration Page */}
//                 <Link href="/register" className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full p-2 text-red-600 hover:text-red-800 transition-all">
//                     <ArrowRight className="w-6 h-6" />
//                 </Link>

//                 {/* Loading Spinner or OTPLESS Login */}
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

