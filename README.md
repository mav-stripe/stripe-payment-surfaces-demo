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

## Stripe documentation

### Link in payment element

https://docs.stripe.com/payments/link/payment-element-link

### Stripe Payment Element

https://docs.stripe.com/payments/payment-element
