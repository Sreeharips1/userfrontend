// globals.d.ts
interface OtplessUser {
  token: string;
}

declare global {
  interface Window {
    otpless?: (otplessUser: OtplessUser) => void;
  }
}