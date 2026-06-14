const MAX_SIZE = parseInt(process.env.MAX_FILE_SIZE_MB || "5", 10) * 1024 * 1024;
const ALLOWED_TYPES = (process.env.ALLOWED_IMAGE_TYPES || "image/jpeg,image/png,image/webp").split(",");

export interface UploadValidation {
  valid: boolean;
  error?: string;
}

export function validateFileUpload(file: File): UploadValidation {
  if (file.size > MAX_SIZE) {
    return { valid: false, error: `File size exceeds ${MAX_SIZE / 1024 / 1024}MB limit` };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Invalid file type. Allowed: JPEG, PNG, WebP" };
  }
  const dangerousExtensions = [".exe", ".bat", ".sh", ".php", ".js", ".html"];
  const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
  if (dangerousExtensions.includes(ext)) {
    return { valid: false, error: "Dangerous file extension detected" };
  }
  return { valid: true };
}

export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 100);
}
