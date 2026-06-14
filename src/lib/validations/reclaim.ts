import { z } from "zod";

export const reportItemSchema = z.object({
  category: z.string().min(1, "Category is required"),
  location_found: z.string().min(1, "Location is required"),
  date_found: z.string().min(1, "Date is required"),
  hidden_identifiers: z.string().min(3, "Hidden identifiers required for verification"),
  description: z.string().optional(),
});

export const claimItemSchema = z.object({
  item_id: z.string().uuid(),
  description: z.string().min(10, "Please provide detailed description"),
  contact_email: z.string().email(),
  contact_phone: z.string().min(10, "Valid phone number required"),
});

export const reviewClaimSchema = z.object({
  claim_id: z.string().uuid(),
  decision: z.enum(["approved", "rejected"]),
  admin_notes: z.string().optional(),
});

export type ReportItemInput = z.infer<typeof reportItemSchema>;
export type ClaimItemInput = z.infer<typeof claimItemSchema>;
export type ReviewClaimInput = z.infer<typeof reviewClaimSchema>;
