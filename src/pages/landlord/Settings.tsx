import { PageHeader } from "@/components/layout/PageHeader";

export default function Settings() {
  return (
    <>
      <PageHeader title="Settings" />
      <p className="text-body text-ink-muted">
        Your account details and payment information for tenants will appear here.
      </p>
    </>
  );
}
