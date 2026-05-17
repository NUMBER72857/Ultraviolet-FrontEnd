import { PayWithFreighter } from "../../../components/PayWithFreighter";
import { StatusBadge } from "../../../components/StatusBadge";
import { apiGet } from "../../../lib/api";
import { formatAtomic } from "../../../lib/money";
import type { Invoice } from "../../../lib/types";

export const dynamic = "force-dynamic";

export default async function PayPage({ params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const invoice = await apiGet<Invoice>(`/v1/public/invoices/${encodeURIComponent(publicId)}`);

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{invoice.description}</h1>
          <p className="muted">Invoice {invoice.invoice_number}</p>
        </div>
        <StatusBadge state={invoice.state} />
      </div>

      <div className="split">
        <section className="panel">
          <dl className="kv">
            <div>
              <dt>Amount</dt>
              <dd>{formatAtomic(invoice.gross_amount_atomic)} USDC</dd>
            </div>
            <div>
              <dt>Memo</dt>
              <dd className="mono">{invoice.payment_memo}</dd>
            </div>
            <div>
              <dt>Treasury</dt>
              <dd className="mono">{invoice.treasury_account}</dd>
            </div>
            <div>
              <dt>Network</dt>
              <dd>{invoice.network_passphrase}</dd>
            </div>
            <div>
              <dt>Expires</dt>
              <dd>{new Date(invoice.expires_at).toLocaleString()}</dd>
            </div>
          </dl>
        </section>

        <PayWithFreighter publicId={invoice.public_id} networkPassphrase={invoice.network_passphrase} />
      </div>
    </section>
  );
}
