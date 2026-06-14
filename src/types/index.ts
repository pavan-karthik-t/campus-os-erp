export type UserRole = "administrator" | "faculty" | "student";

export type Permission =
  | "students:read"
  | "students:write"
  | "students:delete"
  | "attendance:read"
  | "attendance:write"
  | "marks:read"
  | "marks:write"
  | "timetable:read"
  | "timetable:write"
  | "notices:read"
  | "notices:write"
  | "fees:read"
  | "fees:write"
  | "reclaim:read"
  | "reclaim:write"
  | "reclaim:admin"
  | "audit:read"
  | "users:manage";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Student {
  id: string;
  user_id: string;
  enrollment_number: string;
  department: string;
  semester: number;
  batch_year: number;
  photo_url?: string;
  date_of_birth?: string;
  address?: string;
  guardian_name?: string;
  guardian_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Faculty {
  id: string;
  user_id: string;
  employee_id: string;
  department: string;
  designation: string;
  photo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  subject_id: string;
  faculty_id: string;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  remarks?: string;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: number;
  credits: number;
  faculty_id?: string;
  created_at: string;
}

export interface Mark {
  id: string;
  student_id: string;
  subject_id: string;
  exam_type: string;
  marks_obtained: number;
  max_marks: number;
  semester: number;
  academic_year: string;
  created_at: string;
  updated_at: string;
}

export interface Timetable {
  id: string;
  subject_id: string;
  faculty_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string;
  semester: number;
  department: string;
  created_at: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  author_id: string;
  target_audience: "all" | "students" | "faculty";
  status: "draft" | "published" | "archived";
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface FeeStatus {
  id: string;
  student_id: string;
  academic_year: string;
  total_fee: number;
  paid_amount: number;
  due_amount: number;
  due_date?: string;
  status: "paid" | "partial" | "pending" | "overdue";
  payment_history: PaymentRecord[];
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  amount: number;
  date: string;
  method: string;
  reference?: string;
}

export type ReclaimStatus =
  | "found"
  | "claimed"
  | "under_review"
  | "approved"
  | "rejected"
  | "returned";

export interface ReclaimItem {
  id: string;
  reporter_id: string;
  category: string;
  location_found: string;
  date_found: string;
  photo_url?: string;
  hidden_identifiers: string;
  status: ReclaimStatus;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface ReclaimClaim {
  id: string;
  item_id: string;
  claimant_id: string;
  ownership_proof_url?: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  status: ReclaimStatus;
  admin_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ReclaimHandoverLog {
  id: string;
  item_id: string;
  claim_id: string;
  handed_over_by: string;
  received_by: string;
  handover_date: string;
  notes?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id?: string;
  action: string;
  resource: string;
  resource_id?: string;
  ip_address?: string;
  user_agent?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalFaculty: number;
  attendanceRate: number;
  feeCollection: number;
  activeNotices: number;
  reclaimCases: number;
}
