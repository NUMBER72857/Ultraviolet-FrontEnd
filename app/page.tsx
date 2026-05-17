export default function HomePage() {
  return (
    <section className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payment Operations</h1>
          <p className="muted">Create invoices, inspect payment status, and keep settlement state server-owned.</p>
        </div>
        <a className="button" href="/dashboard/invoices/new">
          New invoice
        </a>
      </div>

      <div className="split">
        <section className="panel">
          <h2>Merchant workbench</h2>
          <p className="muted">
            The dashboard reads invoice state from the Rust API. Status changes come from reconciliation, not wallet UI.
          </p>
          <a className="button secondary" href="/dashboard">
            Open dashboard
          </a>
        </section>
        <section className="panel">
          <h2>Checkout path</h2>
          <p className="muted">
            Public payment pages display treasury destination, memo, amount, and backend status for each invoice.
          </p>
        </section>
      </div>
    </section>
  );
}
