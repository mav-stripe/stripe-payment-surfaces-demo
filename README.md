# Stripe Payment Surfaces Demo (SPA)

Next.js single-page app demonstrating Stripe payment surfaces (Payment Element, Embedded Form, Embedded Form 2). Uses Clerk for auth.

## Setup

```bash
cd single-page-app
npm install
```

Copy `.env.example` to `.env.local` and fill in the values. Do not commit `.env.local`.

### Environment variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key (client) |
| `STRIPE_SECRET_KEY` | Stripe secret key (server) |
| `NEXT_PUBLIC_STRIPE_ACCOUNT` | Stripe account ID for dashboard links |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (client) |
| `CLERK_SECRET_KEY` | Clerk secret key (server) |

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Features

- **Homepage:** Public intro + protected section with feature cards (Payment Element, Embedded Form, Embedded Form 2).
- **Auth:** Clerk; only `/` is public.
- **Theming:** Dark/light/system theme and brand switcher (generic / hipages / Mav's Digital Workshop) with Tailwind.

## Why Migrate from Card Element to the Optimised Checkout Suite?

If you're using Stripe's legacy Card Element, consider upgrading to the Optimised Checkout Suite (OCS). OCS surfaces — Payment Element, Embedded Checkout, and Express Checkout Element — deliver higher conversion rates out of the box, support 100+ payment methods via Dashboard toggles (no code changes), and let you consolidate PayPal onto Stripe, eliminating the need for a second PSP. Features like Adaptive Pricing, built-in Link autofill, and improved Radar fraud detection are only available on OCS.

See the full guide: [Why You Should Migrate from Legacy Card Element to the Optimised Checkout Suite](single-page-app/why-upgrade-to-OCS.md)

## Stripe documentation

### Link in payment element

https://docs.stripe.com/payments/link/payment-element-link

### Stripe Payment Element

https://docs.stripe.com/payments/payment-element
