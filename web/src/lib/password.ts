import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 12;

/** Password rules: min 8, letter + (digit or special), not equal to email. */
export function validatePassword(
  password: string,
  email?: string,
): { ok: true } | { ok: false; code: string; message: string } {
  if (password.length < 8) {
    return {
      ok: false,
      code: "password_too_short",
      message: "Password must be at least 8 characters",
    };
  }
  if (!/[A-Za-z]/.test(password)) {
    return {
      ok: false,
      code: "password_needs_letter",
      message: "Password must include a letter",
    };
  }
  if (!/[0-9\W_]/.test(password)) {
    return {
      ok: false,
      code: "password_needs_digit_or_special",
      message: "Password must include a digit or special character",
    };
  }
  if (email && password.toLowerCase() === email.toLowerCase()) {
    return {
      ok: false,
      code: "password_equals_email",
      message: "Password must not equal email",
    };
  }
  return { ok: true };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
