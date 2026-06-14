import { createHmac, randomBytes } from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || "campusos-csrf-dev-secret";

export function generateCsrfToken(): string {
  const nonce = randomBytes(16).toString("hex");
  const signature = createHmac("sha256", CSRF_SECRET).update(nonce).digest("hex");
  return `${nonce}.${signature}`;
}

export function validateCsrfToken(token: string): boolean {
  const [nonce, signature] = token.split(".");
  if (!nonce || !signature) return false;
  const expected = createHmac("sha256", CSRF_SECRET).update(nonce).digest("hex");
  return signature === expected;
}
