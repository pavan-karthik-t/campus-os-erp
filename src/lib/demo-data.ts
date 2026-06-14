import type {
  Attendance,
  AuditLog,
  FeeStatus,
  Mark,
  Notice,
  ReclaimItem,
  Student,
  Timetable,
  UserProfile,
} from "@/types";

export const DEMO_PASSWORD = "password123";

export const demoUsers: UserProfile[] = [
  {
    id: "user-admin",
    email: "admin@campusos.local",
    full_name: "Aarav Mehta",
    role: "administrator",
    is_active: true,
    two_factor_enabled: false,
    created_at: "2026-01-01T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "user-faculty",
    email: "faculty@campusos.local",
    full_name: "Dr. Nisha Rao",
    role: "faculty",
    is_active: true,
    two_factor_enabled: false,
    created_at: "2026-01-08T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
  },
  {
    id: "user-student",
    email: "student@campusos.local",
    full_name: "Kabir Shah",
    role: "student",
    is_active: true,
    two_factor_enabled: false,
    created_at: "2026-01-15T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
  },
];

export const demoStudents = [
  {
    id: "student-1",
    user_id: "user-student",
    enrollment_number: "CSE2026001",
    department: "Computer Science",
    semester: 4,
    batch_year: 2024,
    created_at: "2026-01-15T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
    users: { full_name: "Kabir Shah", email: "student@campusos.local", avatar_url: "" },
  },
  {
    id: "student-2",
    user_id: "user-student-2",
    enrollment_number: "CSE2026002",
    department: "Computer Science",
    semester: 4,
    batch_year: 2024,
    created_at: "2026-01-16T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
    users: { full_name: "Ananya Iyer", email: "ananya@campusos.local", avatar_url: "" },
  },
  {
    id: "student-3",
    user_id: "user-student-3",
    enrollment_number: "ECE2026011",
    department: "Electronics",
    semester: 2,
    batch_year: 2025,
    created_at: "2026-02-01T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
    users: { full_name: "Riya Fernandes", email: "riya@campusos.local", avatar_url: "" },
  },
] satisfies Array<Student & { users: { full_name: string; email: string; avatar_url: string } }>;

export const demoAttendance = [
  {
    id: "att-1",
    student_id: "student-1",
    subject_id: "subject-1",
    faculty_id: "faculty-1",
    date: "2026-06-01",
    status: "present",
    created_at: "2026-06-01T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
    students: { enrollment_number: "CSE2026001", users: { full_name: "Kabir Shah" } },
    subjects: { name: "Data Structures", code: "CS204" },
  },
  {
    id: "att-2",
    student_id: "student-2",
    subject_id: "subject-2",
    faculty_id: "faculty-1",
    date: "2026-06-01",
    status: "late",
    created_at: "2026-06-01T09:10:00.000Z",
    updated_at: "2026-06-01T09:10:00.000Z",
    students: { enrollment_number: "CSE2026002", users: { full_name: "Ananya Iyer" } },
    subjects: { name: "Database Systems", code: "CS212" },
  },
  {
    id: "att-3",
    student_id: "student-3",
    subject_id: "subject-3",
    faculty_id: "faculty-1",
    date: "2026-05-31",
    status: "absent",
    created_at: "2026-05-31T09:00:00.000Z",
    updated_at: "2026-05-31T09:00:00.000Z",
    students: { enrollment_number: "ECE2026011", users: { full_name: "Riya Fernandes" } },
    subjects: { name: "Signals", code: "EC102" },
  },
] satisfies Array<Attendance & { students: unknown; subjects: unknown }>;

export const demoMarks = [
  {
    id: "mark-1",
    student_id: "student-1",
    subject_id: "subject-1",
    exam_type: "Midterm",
    marks_obtained: 86,
    max_marks: 100,
    semester: 4,
    academic_year: "2025-26",
    created_at: "2026-05-20T09:00:00.000Z",
    updated_at: "2026-05-20T09:00:00.000Z",
    subjects: { name: "Data Structures", code: "CS204" },
    students: { enrollment_number: "CSE2026001" },
  },
  {
    id: "mark-2",
    student_id: "student-1",
    subject_id: "subject-2",
    exam_type: "Midterm",
    marks_obtained: 91,
    max_marks: 100,
    semester: 4,
    academic_year: "2025-26",
    created_at: "2026-05-20T09:00:00.000Z",
    updated_at: "2026-05-20T09:00:00.000Z",
    subjects: { name: "Database Systems", code: "CS212" },
    students: { enrollment_number: "CSE2026001" },
  },
] satisfies Array<Mark & { subjects: unknown; students: unknown }>;

export const demoNotices = [
  {
    id: "notice-1",
    title: "Internal assessment schedule published",
    content: "Departments have published internal assessment dates for the current semester.",
    author_id: "user-admin",
    target_audience: "all",
    status: "published",
    published_at: "2026-06-02T09:00:00.000Z",
    created_at: "2026-06-02T09:00:00.000Z",
    updated_at: "2026-06-02T09:00:00.000Z",
    users: { full_name: "Aarav Mehta" },
  },
  {
    id: "notice-2",
    title: "Library extended hours",
    content: "The central library will remain open until 9 PM during exam week.",
    author_id: "user-faculty",
    target_audience: "students",
    status: "published",
    published_at: "2026-06-03T09:00:00.000Z",
    created_at: "2026-06-03T09:00:00.000Z",
    updated_at: "2026-06-03T09:00:00.000Z",
    users: { full_name: "Dr. Nisha Rao" },
  },
] satisfies Array<Notice & { users: { full_name: string } }>;

export const demoReclaimItems: ReclaimItem[] = [
  {
    id: "reclaim-1",
    reporter_id: "user-faculty",
    category: "Phone",
    location_found: "Library second floor",
    date_found: "2026-06-01",
    hidden_identifiers: "Blue case, last four digits 0421",
    status: "found",
    description: "Smartphone found near the reading tables.",
    created_at: "2026-06-01T11:00:00.000Z",
    updated_at: "2026-06-01T11:00:00.000Z",
  },
  {
    id: "reclaim-2",
    reporter_id: "user-admin",
    category: "ID Card",
    location_found: "Cafeteria",
    date_found: "2026-05-30",
    hidden_identifiers: "Name starts with A",
    status: "under_review",
    description: "Student ID card handed to admin office.",
    created_at: "2026-05-30T11:00:00.000Z",
    updated_at: "2026-06-01T11:00:00.000Z",
  },
];

export const demoFees = [
  {
    id: "fee-1",
    student_id: "student-1",
    academic_year: "2025-26",
    total_fee: 120000,
    paid_amount: 90000,
    due_amount: 30000,
    due_date: "2026-06-30",
    status: "partial",
    payment_history: [{ amount: 90000, date: "2026-04-12", method: "UPI" }],
    created_at: "2026-04-12T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
    students: { enrollment_number: "CSE2026001", users: { full_name: "Kabir Shah" } },
  },
  {
    id: "fee-2",
    student_id: "student-2",
    academic_year: "2025-26",
    total_fee: 120000,
    paid_amount: 120000,
    due_amount: 0,
    status: "paid",
    payment_history: [{ amount: 120000, date: "2026-04-08", method: "Card" }],
    created_at: "2026-04-08T09:00:00.000Z",
    updated_at: "2026-06-01T09:00:00.000Z",
    students: { enrollment_number: "CSE2026002", users: { full_name: "Ananya Iyer" } },
  },
] satisfies Array<FeeStatus & { students: unknown }>;

export const demoTimetables = [
  {
    id: "tt-1",
    subject_id: "subject-1",
    faculty_id: "faculty-1",
    day_of_week: 1,
    start_time: "09:00",
    end_time: "10:00",
    room: "CS-204",
    semester: 4,
    department: "Computer Science",
    created_at: "2026-06-01T09:00:00.000Z",
    subjects: { name: "Data Structures", code: "CS204" },
    faculty: { users: { full_name: "Dr. Nisha Rao" } },
  },
  {
    id: "tt-2",
    subject_id: "subject-2",
    faculty_id: "faculty-1",
    day_of_week: 3,
    start_time: "11:00",
    end_time: "12:00",
    room: "Lab-2",
    semester: 4,
    department: "Computer Science",
    created_at: "2026-06-01T09:00:00.000Z",
    subjects: { name: "Database Systems", code: "CS212" },
    faculty: { users: { full_name: "Dr. Nisha Rao" } },
  },
] satisfies Array<Timetable & { subjects: unknown; faculty: unknown }>;

export const demoAuditLogs = [
  {
    id: "audit-1",
    user_id: "user-admin",
    action: "login",
    resource: "auth",
    ip_address: "127.0.0.1",
    user_agent: "Local demo",
    metadata: {},
    created_at: "2026-06-06T06:45:00.000Z",
    users: { full_name: "Aarav Mehta", email: "admin@campusos.local" },
  },
  {
    id: "audit-2",
    user_id: "user-faculty",
    action: "reclaim_report",
    resource: "reclaim_items",
    resource_id: "reclaim-1",
    ip_address: "127.0.0.1",
    user_agent: "Local demo",
    metadata: {},
    created_at: "2026-06-05T10:30:00.000Z",
    users: { full_name: "Dr. Nisha Rao", email: "faculty@campusos.local" },
  },
] satisfies Array<AuditLog & { users: { full_name: string; email: string } }>;

export function findDemoUserByEmail(email: string) {
  return demoUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function findDemoUserByRole(role?: string) {
  return demoUsers.find((user) => user.role === role) || null;
}
