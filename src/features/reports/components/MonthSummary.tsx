import { formatMoney } from "@/lib/money";
import {
  PAYMENT_METHOD_LABELS,
  UTILITY_LABELS,
  type ChargeType,
  type MonthDetail,
  type PaymentMethod,
} from "@/types/domain";

const CHARGE_LABELS: Record<ChargeType, string> = {
  rent: "Rent",
  electricity: UTILITY_LABELS.electricity,
  water: UTILITY_LABELS.water,
  other: "Other",
};

function Breakdown<T extends string>({
  title,
  entries,
}: {
  title: string;
  entries: Array<[T, number, string]>;
}) {
  return (
    <section className="space-y-2">
      <h2 className="text-body font-semibold text-ink">{title}</h2>
      <ul className="divide-y divide-line border-y border-line">
        {entries.map(([key, amount, label]) => (
          <li key={key} className="flex min-h-11 items-center justify-between gap-3 text-body">
            <span>{label}</span>
            <span className="text-right money text-ink">{formatMoney(amount)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function MonthSummary({ detail }: { detail: MonthDetail }) {
  const charged = (Object.entries(detail.chargedByType) as Array<[ChargeType, number]>).map(
    ([type, amount]) => [type, amount, CHARGE_LABELS[type]] as [ChargeType, number, string],
  );
  const received = (Object.entries(detail.receivedByMethod) as Array<[PaymentMethod, number]>).map(
    ([method, amount]) =>
      [method, amount, PAYMENT_METHOD_LABELS[method]] as [PaymentMethod, number, string],
  );
  return (
    <div className="space-y-5">
      <Breakdown title="Charged" entries={charged} />
      <Breakdown title="Received" entries={received} />
    </div>
  );
}
