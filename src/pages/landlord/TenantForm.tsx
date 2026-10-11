import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { paths } from "@/router/paths";

const roomOptions = [
  { value: "room-1", label: "Room 1" },
  { value: "room-2", label: "Room 2" },
  { value: "room-3", label: "Room 3" },
];

export default function TenantForm() {
  return (
    <>
      <PageHeader title="Tenant details" backTo={paths.rooms} />
      <form className="space-y-4">
        <Input label="Name" name="name" placeholder="Ava Khumalo" />
        <Input label="WhatsApp number" name="phone" placeholder="082 123 4567" />
        <Select
          label="Room"
          name="roomId"
          options={[{ value: "", label: "Choose a room" }, ...roomOptions]}
        />
        <Input label="Move-in date" name="moveInDate" type="date" />
        <Input label="Deposit" name="deposit" prefix="R" placeholder="0" />
        <Button fullWidth type="submit">
          Save
        </Button>
      </form>
    </>
  );
}
