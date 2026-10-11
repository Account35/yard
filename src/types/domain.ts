/** App-level types shared across features. */
import type { Database } from "@/types/database";

type Tables = Database["public"]["Tables"];

export type PaymentStatus = "paid" | "part_paid" | "late" | "not_due";
export type RentStatus = PaymentStatus;

export type ChargeType = "rent" | "electricity" | "water" | "other";
export type PaymentMethod = "cash" | "eft" | "ewallet" | "other";
export type PaymentRecordStatus = "confirmed" | "pending_confirmation" | "declined";
export type PaymentCreatedBy = "landlord" | "tenant";

export type Language = "en" | "zu" | "xh" | "st";
export type ReminderTone = "friendly" | "firm";

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  zu: "isiZulu",
  xh: "isiXhosa",
  st: "Sesotho",
};

export type Landlord = Omit<Tables["landlords"]["Row"], "language" | "reminder_tone"> & {
  language: Language;
  reminder_tone: ReminderTone;
};
export type Property = Tables["properties"]["Row"];
export type Room = Tables["rooms"]["Row"];
export type Tenant = Omit<Tables["tenants"]["Row"], "language"> & {
  language: Language;
};
export type Charge = Omit<Tables["charges"]["Row"], "type"> & {
  type: ChargeType;
};
export type Payment = Omit<Tables["payments"]["Row"], "method" | "status" | "created_by"> & {
  method: PaymentMethod;
  status: PaymentRecordStatus;
  created_by: PaymentCreatedBy;
};
export type TenantBalance = {
  tenantId: string;
  roomId: string;
  chargedCents: number;
  paidCents: number;
  balanceCents: number;
  overdueCents: number;
  paidThisMonthCents: number;
  oldestUnpaidDueDate: string | null;
};
export type StatementLine = {
  id: string;
  kind: "charge" | "payment";
  date: string;
  description: string;
  note: string | null;
  amountCents: number;
  runningBalanceCents: number;
  isPending: boolean;
};
export type RoomWithTenant = Room & {
  currentTenant: Pick<Tenant, "id" | "name" | "phone"> | null;
};

export type OnboardingRoomInput = {
  name: string;
  monthly_rent_cents: number;
  due_day: number;
};
