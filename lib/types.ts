export type InvoiceState = "pending" | "paid" | "expired" | "settled" | "failed";

export type Invoice = {
  id: string;
  merchant_id: string;
  public_id: string;
  invoice_number: string;
  customer_email: string | null;
  description: string;
  state: InvoiceState;
  gross_amount_atomic: string;
  platform_fee_atomic: string;
  merchant_net_atomic: string;
  asset_code: string;
  asset_issuer: string;
  network_passphrase: string;
  treasury_account: string;
  payment_memo: string;
  expires_at: string;
  paid_at: string | null;
  settled_at: string | null;
  created_at: string;
  updated_at: string;
};
