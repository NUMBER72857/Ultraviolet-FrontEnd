# NUMBER / Ultraviolet Frontend

Next.js App Router frontend for Ultraviolet merchant payment operations and public Stellar USDC checkout.

This repo owns user interaction only. It does not own payment truth. The UI may request invoices, build checkout screens, ask Freighter to sign, submit signed material to the backend, and poll backend status. It must never mark invoices `paid`, `settled`, or `failed`.

## Frontend Design Prompt Kit

PDF:

```text
docs/prompts/ultraviolet_frontend_design_prompt_kit.pdf
```

Editable source:

```text
docs/prompts/ultraviolet_frontend_design_prompt_kit.html
```

The prompt kit uses AstroPay as a UX reference only. Do not copy AstroPay branding, assets, text, or protected trade dress. The implementation must remain Ultraviolet-specific: education intake, backend-verified Stellar payments, admin workflow, auth, identity, and auditability.

## Responsibilities

- Merchant dashboard shell.
- Invoice creation UI.
- Invoice list/status UI.
- Public `/pay/[publicId]` checkout page.
- Freighter wallet interaction.
- Backend status polling and display.

## Non-Negotiables

- No client-side fake success.
- No frontend-owned invoice state transitions.
- No secrets in `NEXT_PUBLIC_*`.
- No hardcoded mainnet USDC issuer values.
- Display backend state as-is.
- Treat signed wallet submissions as unverified until backend reconciliation confirms them.

## Project Structure

```text
app/
  dashboard/
  pay/[publicId]/
components/
  PayWithFreighter.tsx
  StatusBadge.tsx
lib/
  api.ts
  money.ts
  types.ts
```

## Environment

```bash
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8080
```

Only public, non-secret configuration belongs in this repo.

## Local Development

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Open:

```text
http://127.0.0.1:3000
```

## Verification

```bash
npm run typecheck
npm run build
```

## License

Open source under the MIT License. See [LICENSE](./LICENSE).

## Production Gaps

- Authenticated merchant sessions are not complete in this frontend split.
- Payment XDR build/submit endpoints must exist in the backend before Freighter checkout is end-to-end.
- Real checkout polling should be added once backend reconciliation endpoints are final.
- Accessibility, loading/error states, and empty states need a full product pass before launch.
