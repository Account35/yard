import { Outlet } from "@tanstack/react-router";

import { BottomNav } from "@/components/ui/BottomNav";

export function AppShell() {
  return (
    <div className="pt-safe min-h-dvh">
      {/* Bottom padding keeps content clear of the nav (56px) plus the safe area. */}
      <main className="mx-auto max-w-2xl px-gutter pb-[calc(56px+16px+env(safe-area-inset-bottom))]">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
