"use client";

import { FormEvent, useState } from "react";
import { StatusBadge } from "../../components/StatusBadge";
import { apiGet } from "../../lib/api";
import { formatAtomic } from "../../lib/money";
import type { Invoice } from "../../lib/types";

export default function DashboardPage() {
  const [merchantId, setMerchantId] = useState("");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function loadInvoices(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const rows = await apiGet<Invoice[]>(`/v1/invoices?merchant_id=${encodeURIComponent(merchantId)}`);
      setInvoices(rows);
      if (rows.length === 0) {
        setMessage("No invoices returned for this merchant.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not load invoices");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="muted">Invoice and settlement state from PostgreSQL-backed API projections.</p>
        </div>
        <a className="button" href="/dashboard/invoices/new">
          New invoice
        </a>
      </div>

      <div className="dashboard-grid">
        <form className="panel form-grid" onSubmit={loadInvoices}>
          <label className="field">
            <span>Merchant ID</span>
            <input
              className="input"
              required
              value={merchantId}
              onChange={(event) => setMerchantId(event.target.value)}
              placeholder="mer_..."
            />
          </label>
          <button className="button" disabled={busy} type="submit">
            {busy ? "Loading" : "Load invoices"}
          </button>
          {message ? <p className="notice">{message}</p> : null}
        </form>

        <section className="panel">
          <table className="table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Status</th>
                <th>Gross</th>
                <th>Checkout</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>
                    <strong>{invoice.invoice_number}</strong>
                    <div className="muted">{invoice.description}</div>
                  </td>
                  <td>
                    <StatusBadge state={invoice.state} />
                  </td>
                  <td>{formatAtomic(invoice.gross_amount_atomic)} USDC</td>
                  <td>
                    <a className="button secondary" href={`/pay/${invoice.public_id}`}>
                      Open
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </section>
  );
}
