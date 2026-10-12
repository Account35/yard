import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ListRow } from "@/components/ui/ListRow";
import { Select } from "@/components/ui/Select";
import { useLandlord, useUpdateLandlordPreferences } from "@/features/auth/hooks";
import { useAuth } from "@/features/auth/useAuth";
import { parseSAPhone } from "@/lib/phone";
import { LANGUAGE_LABELS, type Language, type ReminderTone } from "@/types/domain";

export default function Settings() {
  const landlord = useLandlord();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);
  const [saved, setSaved] = useState<"language" | "wording" | null>(null);
  const [preferenceError, setPreferenceError] = useState("");
  const updatePreferences = useUpdateLandlordPreferences();

  const phone = landlord.data?.phone ?? "";
  const parsed = parseSAPhone(phone);

  async function savePreference(key: "language" | "reminder_tone", value: Language | ReminderTone) {
    setSaved(null);
    setPreferenceError("");
    try {
      await updatePreferences.mutateAsync({ [key]: value });
      setSaved(key === "language" ? "language" : "wording");
    } catch {
      setPreferenceError("Your message preference could not be saved. Try again.");
    }
  }

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      void navigate({ to: "/sign-in", replace: true });
    }
  }

  return (
    <>
      <PageHeader title="Settings" />
      <ul className="divide-y divide-line border-y border-line">
        <ListRow
          primary="Name"
          trailing={<span className="text-ink">{landlord.data?.name}</span>}
        />
        <ListRow
          primary="Mobile number"
          trailing={<span className="text-ink">{parsed.ok ? parsed.phone.display : phone}</span>}
        />
      </ul>
      {landlord.data && (
        <section className="mt-6 space-y-4">
          <Select
            label="Reminder wording"
            helper="Used when you remind a tenant who is late."
            value={landlord.data.reminder_tone}
            onChange={(event) =>
              void savePreference("reminder_tone", event.target.value as ReminderTone)
            }
            options={[
              { value: "friendly", label: "Friendly" },
              { value: "firm", label: "Firm" },
            ]}
          />
          {saved === "wording" && (
            <p role="status" className="text-secondary text-ink">
              Saved
            </p>
          )}
          <Select
            label="Language"
            helper="Used for new tenants and as the default for messages."
            value={landlord.data.language}
            onChange={(event) => void savePreference("language", event.target.value as Language)}
            options={Object.entries(LANGUAGE_LABELS).map(([value, label]) => ({ value, label }))}
          />
          {saved === "language" && (
            <p role="status" className="text-secondary text-ink">
              Saved
            </p>
          )}
        </section>
      )}
      {preferenceError && (
        <p role="alert" className="mt-4 text-secondary text-ink">
          {preferenceError}
        </p>
      )}
      <div className="mt-8">
        <Button
          variant="secondary"
          onClick={() => void handleSignOut()}
          loading={signingOut}
          loadingLabel="Signing out"
        >
          Sign out
        </Button>
      </div>
    </>
  );
}
