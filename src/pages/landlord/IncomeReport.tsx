import { PageHeader } from "@/components/layout/PageHeader";
import { buildMonthlyIncomeRows, buildOutstandingRows } from "@/features/reports/aggregate";
import { MonthTable } from "@/features/reports/components/MonthTable";
import { OutstandingList } from "@/features/reports/components/OutstandingList";
import { useIncomeReport } from "@/features/reports/hooks";
import { formatMoney } from "@/lib/money";
import { todayInSA } from "@/lib/dates";

const EMPTY_MESSAGE =
  "Nothing to report yet. Income appears here once rent is charged and payments are recorded.";

export default function IncomeReport() {
  const report = useIncomeReport();
  const data = report.data;

  return (
    <>
      <PageHeader title="Monthly income" backTo="/money" />
      {report.isPending ? (
        <p className="py-6 text-body text-ink-muted">Loading</p>
      ) : report.isError || !data ? (
        <div className="space-y-3 py-6">
          <p role="alert" className="text-body text-ink">
            Could not load this. Check your connection.
          </p>
          <button
            type="button"
            className="min-h-11 underline"
            onClick={() => void report.refetch()}
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {(() => {
            const rows = buildMonthlyIncomeRows(
              data.months[0] ?? todayInSA().slice(0, 7),
              data.charges,
              data.payments,
            );
            const outstanding = buildOutstandingRows(
              data.balances,
              data.tenants,
              data.rooms,
              todayInSA(),
            );
            const currentOwed = outstanding
              .filter((row) => row.isCurrent)
              .reduce((total, row) => total + row.balanceCents, 0);
            const movedOutOwed = outstanding
              .filter((row) => !row.isCurrent)
              .reduce((total, row) => total + row.balanceCents, 0);
            const hasHistory = rows.some((row) => row.chargedCents > 0 || row.receivedCents > 0);
            return !hasHistory ? (
              <p className="py-6 text-body text-ink">{EMPTY_MESSAGE}</p>
            ) : (
              <>
                <section className="space-y-1">
                  <p className="text-body text-ink">
                    Still owed to you: {formatMoney(currentOwed)}
                  </p>
                  {movedOutOwed > 0 && (
                    <p className="text-body text-ink">
                      From tenants who moved out: {formatMoney(movedOutOwed)}
                    </p>
                  )}
                </section>
                <MonthTable rows={rows} />
                <section className="space-y-3">
                  <h2 className="text-body font-semibold text-ink">Who owes you</h2>
                  <OutstandingList rows={outstanding} />
                </section>
              </>
            );
          })()}
        </div>
      )}
    </>
  );
}
