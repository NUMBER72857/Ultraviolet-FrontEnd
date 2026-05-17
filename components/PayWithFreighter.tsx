"use client";

import { useState } from "react";
import * as freighter from "@stellar/freighter-api";

type FreighterApi = {
  isConnected: () => Promise<boolean | { isConnected: boolean }>;
  requestAccess: () => Promise<string | { address?: string; publicKey?: string }>;
  signTransaction: (
    xdr: string,
    options: { networkPassphrase: string },
  ) => Promise<string | { signedTxXdr?: string; signedXdr?: string }>;
};

function connectedValue(value: boolean | { isConnected: boolean }) {
  return typeof value === "boolean" ? value : value.isConnected;
}

function accessValue(value: string | { address?: string; publicKey?: string }) {
  return typeof value === "string" ? value : value.address ?? value.publicKey ?? "";
}

function signedValue(value: string | { signedTxXdr?: string; signedXdr?: string }) {
  return typeof value === "string" ? value : value.signedTxXdr ?? value.signedXdr ?? "";
}

export function PayWithFreighter({
  publicId,
  networkPassphrase,
}: {
  publicId: string;
  networkPassphrase: string;
}) {
  const api = freighter as unknown as FreighterApi;
  const [account, setAccount] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function connect() {
    setMessage("");
    const connected = connectedValue(await api.isConnected());
    if (!connected) {
      setMessage("Freighter is not available.");
      return "";
    }

    const publicKey = accessValue(await api.requestAccess());
    setAccount(publicKey);
    return publicKey;
  }

  async function signAndSubmit() {
    setBusy(true);
    setMessage("");

    try {
      const sourcePublicKey = account || (await connect());
      if (!sourcePublicKey) {
        return;
      }

      const xdrResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8080"}/v1/public/invoices/${publicId}/payment-xdr`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ source_public_key: sourcePublicKey }),
        },
      );
      const xdrPayload = (await xdrResponse.json()) as { xdr?: string; message?: string };
      if (!xdrResponse.ok || !xdrPayload.xdr) {
        throw new Error(xdrPayload.message ?? "Could not build payment transaction");
      }

      const signedXdr = signedValue(
        await api.signTransaction(xdrPayload.xdr, {
          networkPassphrase,
        }),
      );
      if (!signedXdr) {
        throw new Error("Freighter did not return a signed transaction");
      }

      const submitResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8080"}/v1/public/invoices/${publicId}/payment-submissions`,
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ signed_xdr: signedXdr }),
        },
      );
      const submitPayload = (await submitResponse.json()) as { transaction_hash?: string; message?: string };
      if (!submitResponse.ok || !submitPayload.transaction_hash) {
        throw new Error(submitPayload.message ?? "Payment submission failed");
      }

      setMessage(`Submitted ${submitPayload.transaction_hash.slice(0, 12)}... awaiting backend reconciliation.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel">
      <button className="button" type="button" onClick={signAndSubmit} disabled={busy}>
        {busy ? "Submitting" : "Pay with Freighter"}
      </button>
      {account ? <p className="mono muted">{account}</p> : null}
      {message ? <p className="notice">{message}</p> : null}
    </section>
  );
}
