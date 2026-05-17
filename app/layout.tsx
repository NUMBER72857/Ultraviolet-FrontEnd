import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ultraviolet Payments",
  description: "USDC invoice operations for Ultraviolet education services.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <a className="brand" href="/">
              Ultraviolet
            </a>
            <nav className="nav">
              <a href="/dashboard">Dashboard</a>
              <a href="/dashboard/invoices/new">New invoice</a>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
