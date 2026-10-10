import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { ListRow } from "@/components/ui/ListRow";
import { useLandlord } from "@/features/auth/hooks";
import { useAuth } from "@/features/auth/useAuth";
import { parseSAPhone } from "@/lib/phone";

export default function Settings() {
  const landlord = useLandlord();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const phone = landlord.data?.phone ?? "";
  const parsed = parseSAPhone(phone);

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
