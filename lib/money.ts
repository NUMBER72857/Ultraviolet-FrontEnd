const STELLAR_SCALE = BigInt(10_000_000);

export function parseAtomicInput(input: string): number {
  const trimmed = input.trim();
  if (!/^\d+(\.\d{0,7})?$/.test(trimmed)) {
    throw new Error("Amounts must be positive with at most 7 decimal places.");
  }

  const [whole, fraction = ""] = trimmed.split(".");
  const atomic = BigInt(whole) * STELLAR_SCALE + BigInt(fraction.padEnd(7, "0") || "0");
  if (atomic <= BigInt(0)) {
    throw new Error("Amount must be greater than zero.");
  }
  if (atomic > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("Amount exceeds the safe client-side limit.");
  }

  return Number(atomic);
}

export function formatAtomic(atomicValue: string): string {
  const atomic = BigInt(atomicValue);
  const whole = atomic / STELLAR_SCALE;
  const fraction = (atomic % STELLAR_SCALE).toString().padStart(7, "0");
  return `${whole}.${fraction}`;
}
