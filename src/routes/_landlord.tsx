import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/AppShell";

// Pathless layout: landlord pages with the bottom nav. Phase 1 adds the auth gate.
export const Route = createFileRoute("/_landlord")({
  component: AppShell,
});
