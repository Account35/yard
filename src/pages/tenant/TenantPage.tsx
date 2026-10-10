import { PageHeader } from "@/components/layout/PageHeader";

export default function TenantPage() {
  return (
    <>
      <PageHeader title="Your rent" />
      <p className="text-body text-ink-muted">
        Your rent, payments and receipts from your landlord will appear here.
      </p>
    </>
  );
}
