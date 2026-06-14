import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateGPA(marks: { marks_obtained: number; max_marks: number }[]): number {
  if (marks.length === 0) return 0;
  const total = marks.reduce((sum, m) => sum + (m.marks_obtained / m.max_marks) * 10, 0);
  return Math.round((total / marks.length) * 100) / 100;
}

export function calculateAttendancePercentage(
  records: { status: string }[]
): number {
  if (records.length === 0) return 0;
  const present = records.filter((r) => r.status === "present").length;
  return Math.round((present / records.length) * 100);
}
