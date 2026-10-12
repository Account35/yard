import { PageHeader } from "@/components/layout/PageHeader";
import { Link } from "@tanstack/react-router";
import { paths } from "@/router/paths";

export default function Money() {
  return (
    <>
      <PageHeader title="Money" />
      <ul className="divide-y divide-line border-y border-line">
        <li>
          <Link
            to={paths.incomeReport}
            className="flex min-h-14 items-center justify-between text-body text-ink underline"
          >
            Monthly income
            <span aria-hidden="true">›</span>
          </Link>
        </li>
        <li>
          <Link
            to={paths.utilityList}
            className="flex min-h-14 items-center justify-between text-body text-ink underline"
          >
            Utilities
            <span aria-hidden="true">›</span>
          </Link>
        </li>
      </ul>
    </>
  );
}
