import { useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { CodeStep } from "@/features/auth/components/CodeStep";
import { Loading } from "@/features/auth/components/Loading";
import { PhoneStep } from "@/features/auth/components/PhoneStep";
import { safeRedirect } from "@/features/auth/schema";
import { useAuth } from "@/features/auth/useAuth";
import type { SAPhone } from "@/lib/phone";
import { paths } from "@/router/paths";

export default function SignIn({ redirect }: { redirect?: string }) {
  const { session, isLoading } = useAuth();
  const router = useRouter();
  const [phone, setPhone] = useState<SAPhone | null>(null);
  const [typed, setTyped] = useState("");

  const target = safeRedirect(redirect) ?? paths.home;

  useEffect(() => {
    if (session) router.history.replace(target);
  }, [session, router, target]);

  if (isLoading || session) return <Loading />;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col gap-6 px-gutter pt-16 pb-safe">
      <p className="text-body font-semibold text-brand">Yard</p>
      <h1 className="text-title font-semibold text-ink">Sign in</h1>
      {phone ? (
        <CodeStep
          phone={phone}
          onVerified={() => router.history.replace(target)}
          onChangeNumber={() => setPhone(null)}
        />
      ) : (
        <>
          <p className="text-body text-ink-muted">We will send a 6-digit code to your phone.</p>
          <PhoneStep
            initial={typed}
            onSent={(p, t) => {
              setTyped(t);
              setPhone(p);
            }}
          />
        </>
      )}
    </main>
  );
}
