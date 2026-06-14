import { calculateGPA, calculateAttendancePercentage, formatCurrency } from "@/lib/utils";

describe("Utils", () => {
  describe("calculateGPA", () => {
    it("calculates GPA from marks", () => {
      const gpa = calculateGPA([
        { marks_obtained: 80, max_marks: 100 },
        { marks_obtained: 90, max_marks: 100 },
      ]);
      expect(gpa).toBe(8.5);
    });

    it("returns 0 for empty marks", () => {
      expect(calculateGPA([])).toBe(0);
    });
  });

  describe("calculateAttendancePercentage", () => {
    it("calculates attendance percentage", () => {
      const pct = calculateAttendancePercentage([
        { status: "present" },
        { status: "present" },
        { status: "absent" },
        { status: "present" },
      ]);
      expect(pct).toBe(75);
    });
  });

  describe("formatCurrency", () => {
    it("formats INR currency", () => {
      expect(formatCurrency(50000)).toContain("50");
    });
  });
});
