import { useNavigate, useParams } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { paths } from "@/router/paths";

export default function TenantDetail() {
  const { tenantId } = useParams({ strict: false });
  const navigate = useNavigate();

  return (
    <>
      <PageHeader title="Tenant" backTo={paths.rooms} />
      <div className="space-y-4">
        <p className="text-body text-ink">Tenant ID: {tenantId}</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => navigate({ to: paths.rooms })}>
            Back
          </Button>
          <Button
            variant="secondary"
            onClick={() => navigate({ to: paths.tenantEdit.replace("$tenantId", tenantId ?? "") })}
          >
            Edit
          </Button>
          <Button variant="secondary" onClick={() => navigate({ to: paths.tenantNew })}>
            Add tenant
          </Button>
        </div>
      </div>
    </>
  );
}
