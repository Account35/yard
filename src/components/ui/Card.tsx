import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

/** A single-level card. Cards never nest. */
export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-md border border-line bg-surface p-4", className)} {...rest} />
  );
}
