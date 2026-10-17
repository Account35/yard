# Visual refresh audit

The refresh applies the shared ledger-style components to the dashboard, rooms, money
and reports, utilities, payment review, reminders, tenant details and the public tenant
page. It preserves existing navigation, actions, data rules and wording.

## Screenshots

Before-and-after screenshots should be captured from the same demo account and viewport
before release. The repository does not contain authenticated demo-account data, so
screenshots are intentionally not fabricated or committed from a placeholder state.

| Screen | Before | After |
| --- | --- | --- |
| Home dashboard | Capture from the pre-refresh build | Capture the month summary, quick actions, setup steps and tenant groups |
| Rooms | Capture from the pre-refresh build | Capture active, vacant and inactive room rows |
| Tenant detail | Capture from the pre-refresh build | Capture balance, actions and statement |
| Reports and payments | Capture from the pre-refresh build | Capture monthly ledger, pending row and payment detail |
| Public tenant page | Capture from the pre-refresh build | Capture balance, charges, receipts and contact actions |

## Interaction and accessibility checks

- The Record payment quick action opens a tenant picker and navigates to the existing
  tenant-scoped payment form.
- Remind late is disabled when no tenant is late.
- Setup progress reflects rooms, tenants and a confirmed payment; the Paid group starts
  collapsed and can be expanded.
- List rows retain accessible summaries when visual labels are hidden, and the dashboard
  components are checked with axe.
- Initials and progress widths have unit coverage, including progress values outside the
  0–100% range.

## Review notes

- Use the same viewport and representative data for before/after captures. Check at
  360px and 200% zoom, including a screen with long names and large amounts.
- Confirm status tags retain readable text labels and colour contrast.
- Keep screenshots free of real tenant contact details and payment information.
