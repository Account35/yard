export function naturalRoomSort<T extends { name: string }>(rooms: T[]): T[] {
  return [...rooms].sort((a, b) => compareRoomNames(a.name, b.name));
}

export function compareRoomNames(left: string, right: string): number {
  const leftParts = left.trim().match(/\d+|\D+/g) ?? [left.trim()];
  const rightParts = right.trim().match(/\d+|\D+/g) ?? [right.trim()];
  const max = Math.max(leftParts.length, rightParts.length);

  for (let i = 0; i < max; i += 1) {
    const l = leftParts[i] ?? "";
    const r = rightParts[i] ?? "";
    const lIsNumber = /^\d+$/.test(l);
    const rIsNumber = /^\d+$/.test(r);

    if (lIsNumber && rIsNumber) {
      const diff = Number(l) - Number(r);
      if (diff !== 0) return diff;
      continue;
    }

    if (lIsNumber !== rIsNumber) return lIsNumber ? -1 : 1;

    const diff = l.localeCompare(r, undefined, { numeric: true, sensitivity: "base" });
    if (diff !== 0) return diff;
  }

  return left.localeCompare(right, undefined, { numeric: true, sensitivity: "base" });
}

export function hasDuplicateRoomName(names: string[]): boolean {
  const normalised = new Set<string>();
  for (const name of names) {
    const key = name.trim().toLowerCase().replace(/\s+/g, " ");
    if (!key) continue;
    if (normalised.has(key)) return true;
    normalised.add(key);
  }
  return false;
}
