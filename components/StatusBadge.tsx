import type { InvoiceState } from "../lib/types";

const labels: Record<InvoiceState, string> = {
  pending: "Pending",
  paid: "Paid",
  expired: "Expired",
  settled: "Settled",
  failed: "Failed",
};

export function StatusBadge({ state }: { state: InvoiceState }) {
  return <span className={`status status-${state}`}>{labels[state]}</span>;
}
