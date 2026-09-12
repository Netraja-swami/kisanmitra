/**
 * KisanMitra Client-Side Security Suite
 * Provides Web Crypto SHA-256 password hashing with cryptographic salt,
 * brute-force rate-limiting, XSS sanitization, and input validation.
 */

const BRUTE_FORCE_KEY = 'kisanmitra_brute_force_state_v1';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

/**
 * Generate cryptographic random salt (hex string)
 */
export function generateSalt(length = 16) {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generate secure random session token
 */
export function generateSessionToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash password with salt using Web Crypto API (SHA-256)
 * @param {string} password
 * @param {string} salt
 * @returns {Promise<string>} Hex hash
 */
export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt + '::kisanmitra_secure_salt::');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Sanitize string to prevent Cross-Site Scripting (XSS)
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>]/g, '') // remove HTML tag brackets
    .replace(/javascript:/gi, '') // remove javascript pseudo-protocol
    .replace(/on\w+=/gi, '') // remove event handlers like onclick=
    .trim();
}

/**
 * Validate 10-digit Indian mobile number
 * Starts with 6, 7, 8, or 9
 */
export function validateMobileNumber(mobile) {
  const cleaned = mobile.replace(/\D/g, '');
  const isValid = /^[6-9]\d{9}$/.test(cleaned);
  return {
    isValid,
    cleaned,
    error: isValid ? null : 'कृपया मान्य 10-अंकों का मोबाइल नंबर दर्ज करें (शुरुआत 6,7,8,9 से हो)'
  };
}

/**
 * Check password strength
 */
export function checkPasswordStrength(password) {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      score: 1,
      label: 'कमजोर (Too Weak)',
      color: 'bg-rose-500',
      error: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।'
    };
  }

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[a-zA-Z]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  if (score <= 2) {
    return {
      isValid: true,
      score,
      label: 'साधारण (Fair)',
      color: 'bg-amber-500',
      error: null
    };
  } else if (score <= 4) {
    return {
      isValid: true,
      score,
      label: 'मजबूत (Strong)',
      color: 'bg-emerald-500',
      error: null
    };
  } else {
    return {
      isValid: true,
      score,
      label: 'अत्यंत सुरक्षित (Very Strong)',
      color: 'bg-emerald-700',
      error: null
    };
  }
}

/**
 * Brute Force / Rate Limiting Manager
 */
export const BruteForceManager = {
  getState() {
    try {
      const stored = localStorage.getItem(BRUTE_FORCE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse brute force state', e);
    }
    return { failedAttempts: 0, lockedUntil: 0 };
  },

  isLocked() {
    const state = this.getState();
    const now = Date.now();
    if (state.lockedUntil && state.lockedUntil > now) {
      return {
        locked: true,
        remainingSeconds: Math.ceil((state.lockedUntil - now) / 1000)
      };
    }
    return { locked: false, remainingSeconds: 0 };
  },

  recordFailedAttempt() {
    const state = this.getState();
    const attempts = state.failedAttempts + 1;
    const now = Date.now();

    if (attempts >= MAX_FAILED_ATTEMPTS) {
      const updated = {
        failedAttempts: attempts,
        lockedUntil: now + LOCKOUT_DURATION_MS
      };
      localStorage.setItem(BRUTE_FORCE_KEY, JSON.stringify(updated));
      return {
        locked: true,
        remainingSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000),
        attempts
      };
    } else {
      const updated = {
        failedAttempts: attempts,
        lockedUntil: 0
      };
      localStorage.setItem(BRUTE_FORCE_KEY, JSON.stringify(updated));
      return {
        locked: false,
        remainingAttempts: MAX_FAILED_ATTEMPTS - attempts,
        attempts
      };
    }
  },

  reset() {
    localStorage.removeItem(BRUTE_FORCE_KEY);
  }
};
