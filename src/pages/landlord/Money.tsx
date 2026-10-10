import { PageHeader } from "@/components/layout/PageHeader";

export default function Money() {
  return (
    <>
      <PageHeader title="Money" />
      <p className="text-body text-ink-muted">
        Charges, payments received and what is still owed will appear here.
      </p>
    </>
  );
}
