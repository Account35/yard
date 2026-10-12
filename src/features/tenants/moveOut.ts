/** Returns an error message for a move-out date, or null when it is valid. Dates are YYYY-MM-DD. */
export function moveOutDateError(date: string, moveInDate: string, today: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return "Choose the move-out date.";
  if (date < moveInDate) return "The move-out date cannot be before the move-in date.";
  if (date > today) return "The move-out date cannot be in the future.";
  return null;
}
