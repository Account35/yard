/** App-level types shared across features. */
import type { Database } from "@/types/database";

type Tables = Database["public"]["Tables"];

export type PaymentStatus = "paid" | "part_paid" | "late" | "not_due";

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
export type RoomWithTenant = Room & {
  currentTenant: Pick<Tenant, "id" | "name" | "phone"> | null;
};

export type OnboardingRoomInput = {
  name: string;
  monthly_rent_cents: number;
  due_day: number;
};
