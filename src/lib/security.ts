/**
 * Security & API Authorization Helper
 * Implements input validation, password hashing, role authorization,
 * rate limiting, and Razorpay HMAC signature verification.
 */

// 1. Password Hashing (SHA-256 Digest)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// 2. Input Sanitization & Format Validation
export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validateIndianPinCode(zip: string): boolean {
  return /^[1-9][0-9]{5}$/.test(zip.trim());
}

export function validatePhoneNumber(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone.trim().replace(/\D/g, ''));
}

export function sanitizeInput(str: string): string {
  return str.replace(/[<>]/g, '').trim();
}

// 3. Role-Based Authorization Checks
export function authorizeRole(
  userRole: 'customer' | 'seller' | 'admin' | undefined,
  requiredRole: 'admin' | 'seller'
): boolean {
  if (!userRole) return false;
  if (requiredRole === 'admin') return userRole === 'admin';
  if (requiredRole === 'seller') return userRole === 'seller' || userRole === 'admin';
  return true;
}

// 4. In-Memory Client Rate Limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, limit = 10, windowMs = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}

// Payment verification must only happen on the trusted Express server.
// This client helper intentionally fails closed; never mark an order paid in the browser.
export function verifyRazorpayPayment(
  _razorpayOrderId: string,
  _razorpayPaymentId: string,
  _razorpaySignature: string
): { success: boolean; status: string } {
  return { success: false, status: 'Server-side verification required' };
}
