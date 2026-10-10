import { Outlet } from "@tanstack/react-router";

import { BottomNav } from "@/components/ui/BottomNav";

export function AppShell() {
  return (
    <div className="min-h-dvh pt-safe">
      {/* Bottom padding keeps content clear of the nav (56px) plus the safe area. */}
      <main className="mx-auto max-w-2xl px-gutter pb-[calc(56px+16px+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
