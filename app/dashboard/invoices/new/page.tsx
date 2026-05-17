"use client";

import { FormEvent, useState } from "react";
import { apiPost } from "../../../../lib/api";
import { parseAtomicInput } from "../../../../lib/money";
import type { Invoice } from "../../../../lib/types";

export default function NewInvoicePage() {
  const [merchantId, setMerchantId] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [description, setDescription] = useState("");
  const [grossAmount, setGrossAmount] = useState("100.00");
  const [platformFee, setPlatformFee] = useState("1.00");
  const [merchantNet, setMerchantNet] = useState("99.00");
  const [message, setMessage] = useState("");
  const [created, setCreated] = useState<Invoice | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setCreated(null);

    try {
      const invoice = await apiPost<Invoice>(
        "/v1/invoices",
        {
          merchant_id: merchantId,
          invoice_number: invoiceNumber,
          customer_email: customerEmail || null,
          description,
          gross_amount_atomic: parseAtomicInput(grossAmount),
          platform_fee_atomic: parseAtomicInput(platformFee),
          merchant_net_atomic: parseAtomicInput(merchantNet),
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
        },
        {
          "Idempotency-Key": crypto.randomUUID(),
        },
      );
      setCreated(invoice);
      setMessage("Invoice created.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invoice creation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">New Invoice</h1>
          <p className="muted">Amounts are submitted as exact Stellar atomic units after client-side formatting.</p>
        </div>
      </div>

      <div className="split">
        <form className="panel form-grid" onSubmit={submit}>
          <label className="field">
            <span>Merchant ID</span>
            <input className="input" required value={merchantId} onChange={(event) => setMerchantId(event.target.value)} />
          </label>
          <label className="field">
            <span>Invoice number</span>
            <input
              className="input"
              required
              value={invoiceNumber}
              onChange={(event) => setInvoiceNumber(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Customer email</span>
            <input
              className="input"
              type="email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
            />
          </label>
          <label className="field">
            <span>Description</span>
            <textarea
              className="textarea"
              required
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>
          <div className="split">
            <label className="field">
              <span>Gross USDC</span>
              <input className="input" required value={grossAmount} onChange={(event) => setGrossAmount(event.target.value)} />
            </label>
            <label className="field">
              <span>Platform fee</span>
              <input className="input" required value={platformFee} onChange={(event) => setPlatformFee(event.target.value)} />
            </label>
          </div>
          <label className="field">
            <span>Merchant net</span>
            <input className="input" required value={merchantNet} onChange={(event) => setMerchantNet(event.target.value)} />
          </label>
          <button className="button" disabled={busy} type="submit">
            {busy ? "Creating" : "Create invoice"}
          </button>
          {message ? <p className="notice">{message}</p> : null}
        </form>

        <section className="panel">
          {created ? (
            <dl className="kv">
              <div>
                <dt>Status</dt>
                <dd>{created.state}</dd>
              </div>
              <div>
                <dt>Public link</dt>
                <dd>
                  <a href={`/pay/${created.public_id}`}>/pay/{created.public_id}</a>
                </dd>
              </div>
              <div>
                <dt>Memo</dt>
                <dd className="mono">{created.payment_memo}</dd>
              </div>
              <div>
                <dt>Treasury</dt>
                <dd className="mono">{created.treasury_account}</dd>
              </div>
            </dl>
          ) : (
            <p className="muted">Created invoice details will appear here.</p>
          )}
        </section>
      </div>
    </section>
  );
}
