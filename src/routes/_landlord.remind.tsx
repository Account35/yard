import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/_landlord/remind")({
  head: () => ({
    meta: [
      { title: "Remind late tenants · Yard" },
      { name: "description", content: "Review rent reminders for late tenants." },
    ],
  }),
  component: lazyRouteComponent(() => import("@/pages/landlord/RemindLate")),
});
