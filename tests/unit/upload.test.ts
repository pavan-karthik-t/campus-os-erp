import { validateFileUpload, sanitizeFilename } from "@/lib/security/upload";

describe("File Upload Validation", () => {
  it("accepts valid image files", () => {
    const file = new File(["test"], "photo.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 1024 });
    expect(validateFileUpload(file).valid).toBe(true);
  });

  it("rejects oversized files", () => {
    const file = new File(["x"], "big.jpg", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 10 * 1024 * 1024 });
    expect(validateFileUpload(file).valid).toBe(false);
  });

  it("rejects dangerous extensions", () => {
    const file = new File(["x"], "malware.exe", { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 100 });
    expect(validateFileUpload(file).valid).toBe(false);
  });

  it("sanitizes filenames", () => {
    expect(sanitizeFilename("my file (1).jpg")).toBe("my_file__1_.jpg");
  });
});
