import { useState } from "react";

import { Button } from "@/components/ui/Button";
import type { MonthlyStatementData, TenantStatementData } from "@/types/domain";

type DownloadInput =
  | { kind: "monthly"; data: MonthlyStatementData; fileSuffix: string; label?: string }
  | { kind: "tenant"; data: TenantStatementData; fileSuffix: string; label?: string };

export function DownloadStatementButton({
  kind,
  data,
  fileSuffix,
  label = "Download statement",
}: DownloadInput) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState("");

  async function download() {
    setIsDownloading(true);
    setError("");
    try {
      const { createMonthlyStatementPdf, createTenantStatementPdf, statementFileName } =
        await import("@/features/reports/statementPdf");
      let blob: Blob;
      if (kind === "monthly") {
        blob = await createMonthlyStatementPdf(data);
      } else {
        blob = await createTenantStatementPdf(data);
      }
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = statementFileName(
        kind === "monthly" ? "monthly-statement" : "tenant-statement",
        fileSuffix,
      );
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("The statement could not be downloaded. Try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button variant="secondary" loading={isDownloading} onClick={() => void download()}>
        {label}
      </Button>
      {error && (
        <p role="alert" className="text-secondary text-ink">
          {error}
        </p>
      )}
    </div>
  );
}
