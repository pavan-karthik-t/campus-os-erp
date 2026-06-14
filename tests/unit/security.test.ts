import { generateCsrfToken, validateCsrfToken } from "@/lib/security/csrf";
import { escapeHtml, stripTags } from "@/lib/security/sanitize";

describe("Security", () => {
  describe("CSRF", () => {
    it("generates and validates tokens", () => {
      const token = generateCsrfToken();
      expect(validateCsrfToken(token)).toBe(true);
    });

    it("rejects invalid tokens", () => {
      expect(validateCsrfToken("invalid")).toBe(false);
      expect(validateCsrfToken("")).toBe(false);
    });
  });

  describe("XSS Sanitization", () => {
    it("escapes HTML entities", () => {
      expect(escapeHtml("<script>alert('xss')</script>")).not.toContain("<script>");
    });

    it("strips HTML tags", () => {
      expect(stripTags("<b>Hello</b>")).toBe("Hello");
    });
  });
});
