import { Outlet } from "@tanstack/react-router";

export function TenantShell() {
  return (
    <div className="pt-safe min-h-dvh">
      <header className="border-b border-line">
        <div className="mx-auto flex min-h-14 max-w-2xl items-center px-gutter">
          <span className="text-body font-semibold text-ink">Yard</span>
        </div>
      </header>
      <main className="pb-safe mx-auto max-w-2xl px-gutter">
        <Outlet />
      </main>
    </div>
  );
}
