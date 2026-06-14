import { NextRequest, NextResponse } from "next/server";
import { validateFileUpload, sanitizeFilename } from "@/lib/security/upload";
import { validateCsrfToken } from "@/lib/security/csrf";
import { rateLimit } from "@/lib/security/rate-limit";
import { getUserProfile } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const { success } = rateLimit(`upload:${ip}`);
  if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  const csrfToken = request.headers.get("x-csrf-token");
  if (!csrfToken || !validateCsrfToken(csrfToken)) {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const user = await getUserProfile();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const bucket = (formData.get("bucket") as string) || "documents";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const validation = validateFileUpload(file);
  if (!validation.valid) return NextResponse.json({ error: validation.error }, { status: 400 });

  const filename = `${user.id}/${Date.now()}-${sanitizeFilename(file.name)}`;
  return NextResponse.json({ path: `${bucket}/${filename}`, url: `/demo-upload/${filename}` });
}
