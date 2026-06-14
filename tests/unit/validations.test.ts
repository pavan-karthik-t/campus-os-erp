import { loginSchema, resetPasswordSchema } from "@/lib/validations/auth";
import { reportItemSchema, claimItemSchema } from "@/lib/validations/reclaim";

describe("Validations", () => {
  describe("loginSchema", () => {
    it("validates correct login data", () => {
      const result = loginSchema.safeParse({ email: "test@edu.com", password: "password123" });
      expect(result.success).toBe(true);
    });

    it("rejects invalid email", () => {
      const result = loginSchema.safeParse({ email: "invalid", password: "password123" });
      expect(result.success).toBe(false);
    });
  });

  describe("resetPasswordSchema", () => {
    it("requires matching passwords", () => {
      const result = resetPasswordSchema.safeParse({
        password: "Password1",
        confirmPassword: "Password2",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("reclaim schemas", () => {
    it("validates report item", () => {
      const result = reportItemSchema.safeParse({
        category: "Wallet",
        location_found: "Library",
        date_found: "2026-01-01",
        hidden_identifiers: "ID card inside",
      });
      expect(result.success).toBe(true);
    });

    it("validates claim item", () => {
      const result = claimItemSchema.safeParse({
        item_id: "550e8400-e29b-41d4-a716-446655440000",
        description: "This is my wallet with ID inside",
        contact_email: "student@edu.com",
        contact_phone: "9876543210",
      });
      expect(result.success).toBe(true);
    });
  });
});
