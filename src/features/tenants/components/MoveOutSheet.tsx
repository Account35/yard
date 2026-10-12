import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Sheet } from "@/components/ui/Sheet";
import { todayInSA } from "@/lib/dates";
import { formatMoney } from "@/lib/money";

import { moveOutDateError } from "../moveOut";

interface MoveOutSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tenantName: string;
  moveInDate: string;
  balanceCents: number;
  onConfirm: (moveOutDate: string) => Promise<void>;
}

export function MoveOutSheet({
  open,
  onOpenChange,
  tenantName,
  moveInDate,
  balanceCents,
  onConfirm,
}: MoveOutSheetProps) {
  const today = todayInSA();
  const [date, setDate] = useState(today);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setDate(todayInSA());
      setError("");
      setSubmitError("");
    }
  }, [open]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = moveOutDateError(date, moveInDate, today);
    if (message) {
      setError(message);
      return;
    }
    setSaving(true);
    setSubmitError("");
    try {
      await onConfirm(date);
      onOpenChange(false);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "The tenant could not be moved out.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={`Move ${tenantName} out`}
      description="The room becomes vacant and no new rent is charged after this date."
    >
      <form className="space-y-4" onSubmit={(event) => void submit(event)}>
        <Input
          label="Move-out date"
          type="date"
          min={moveInDate}
          max={today}
          value={date}
          onChange={(event) => {
            setDate(event.target.value);
            setError("");
          }}
          error={error || undefined}
        />
        {balanceCents > 0 && (
          <p className="text-secondary font-semibold text-ink">
            There is an outstanding balance of {formatMoney(balanceCents)}.
          </p>
        )}
        {submitError && (
          <p role="alert" className="text-secondary font-semibold text-ink">
            {submitError}
          </p>
        )}
        <Button fullWidth type="submit" loading={saving} loadingLabel="Saving">
          Move out
        </Button>
      </form>
    </Sheet>
  );
}
