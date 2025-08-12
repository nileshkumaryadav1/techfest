// Temporary in-memory OTP store with auto-clear
export const otpStore = {};

/**
 * Save OTP in memory and schedule auto-clear after expiry
 * @param {string} identifier - Email or phone
 * @param {string} otp - The OTP value
 * @param {number} expiresInMs - Time to expire in milliseconds
 */
export function saveOtp(identifier, otp, expiresInMs = 5 * 60 * 1000) {
  otpStore[identifier] = {
    otp,
    expires: Date.now() + expiresInMs
  };

  // Auto-delete after expiry
  setTimeout(() => {
    delete otpStore[identifier];
  }, expiresInMs);
}
