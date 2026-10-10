import { PageHeader } from "@/components/layout/PageHeader";

export default function Home() {
  return (
    <>
      <PageHeader title="Home" />
      <p className="text-body text-ink-muted">
        This month's rent status for each room will appear here.
      </p>
    </>
  );
}
