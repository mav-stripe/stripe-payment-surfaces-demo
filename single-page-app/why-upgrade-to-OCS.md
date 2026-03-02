# Why You Should Migrate from Legacy Card Element to the Optimised Checkout Suite

---

## Current State

If you currently use the **legacy Card Element** (Level 2 integration), you may have:
- A multi-step checkout flow (subscription charge → second form with saved payment method)
- A separate PSP for PayPal (e.g. Braintree)
- Custom A/B testing system for checkout experiments
- Manual integrations for third-party services

## What is the Optimised Checkout Suite (OCS)?

The OCS encompasses Stripe's modern payment surfaces — **Checkout Sessions, Payment Element, Express Checkout Element, and Embedded Checkout** — that provide out-of-the-box optimisations, broader payment method support, and reduced maintenance burden compared to legacy Card Element integrations.

---

## Reasons to Upgrade

### 1. Higher Conversion Rates — Out of the Box

The legacy Card Element (L2) provides **limited out-of-the-box optimisations**. OCS surfaces are continuously optimised by Stripe's checkout team for conversion, including:

- **Smart payment method ordering** — dynamically ranks and displays payment methods based on buyer location, device, and behaviour
- **Link integration** — autofills returning customers' payment details in one click, significantly reducing checkout friction and cart abandonment
- **Optimised input fields** — real-time validation, auto-formatting, smart error messaging, and locale-aware field ordering
- **Express Checkout Element** — surfaces Apple Pay, Google Pay, and Link as one-click buttons above the fold for instant checkout

> For growth teams running A/B tests, OCS gives you a higher conversion baseline to test from.

### 2. Consolidate PayPal onto Stripe — Eliminate Braintree

If you run **a separate PSP** solely for PayPal (e.g. Braintree), OCS lets you consolidate:

- **PayPal is natively supported** in the Payment Element and Express Checkout Element
- **Single integration, single dashboard** — no need to maintain a second PSP, reconcile across two systems, or manage separate fraud rules
- **Reduced operational overhead** — one set of reporting, disputes, refunds, and payouts
- **Cost savings** — eliminate Braintree platform fees and the engineering cost of maintaining a multi-PSP integration

> This directly addresses multi-PSP complexity that many merchants face.

### 3. Dynamic Payment Methods — No Code Changes

With the Card Element, adding a new payment method (BECS Direct Debit, Afterpay, Klarna, etc.) requires code changes and a new deployment. With OCS:

- **Enable/disable payment methods from the Stripe Dashboard** — no code changes, no deploys
- **A/B test payment methods** natively — turn on a payment method for a percentage of traffic and measure impact on conversion rate and average order value
- **Automatic regional optimisation** — Stripe shows the right payment methods for each buyer's location
- **Future-proof** — as Stripe adds new payment methods, they become available without integration work

> This can replace or complement custom A/B testing systems for payment method experimentation.

### 4. Adaptive Pricing — Localised Currency Presentment

For merchants serving customers worldwide, OCS (specifically Checkout Sessions) enables:

- **Adaptive Pricing** lets customers pay in their local currency across 150+ countries
- Customers pay a small FX fee — **no additional Stripe fees** for the merchant
- Proven to increase international conversion rates by reducing currency confusion and unexpected FX charges at the bank level

> This is only available on Checkout Sessions (L4+) — not on the legacy Card Element.

### 5. Simplified Subscription + One-off Payment Flows

If you currently use a multi-step checkout (subscription charge → second form), Checkout Sessions can simplify this:

- **Native subscription support** — Checkout Sessions handle subscription creation, trial periods, and recurring billing natively
- **Saved payment methods** are managed automatically via the Customer object
- **Reduce to a single checkout step** — the Payment Element or Embedded Checkout can handle both subscription setup and one-off charges in a unified flow
- **Customer portal** — built-in hosted page for customers to manage subscriptions, update payment methods, and view invoices

### 6. Lower Integration and Maintenance Effort

| | Card Element (L2) | Payment Element / Embedded Checkout (L3/L4) |
|---|---|---|
| **Adding payment methods** | Code changes + deploy | Dashboard toggle |
| **UI optimisations** | Manual implementation | Automatic from Stripe |
| **PCI scope** | SAQ-A (same) | SAQ-A (same) |
| **Maintenance burden** | High — manual updates | Low — Stripe manages UI updates |
| **New Stripe features** | Requires integration work | Available automatically |

> For growth teams with limited engineering bandwidth, this means more time building product and less time maintaining payment plumbing.

### 7. Better Fraud Protection

Moving to Checkout Sessions (L4+) gives Stripe **deeper insight into the payment context**:

- Stripe knows more about what the merchant is selling, enabling better **Radar fraud detection**
- Enhanced data signals improve machine learning models for fraud scoring
- Built-in **3D Secure** handling with smart authentication (only challenges high-risk transactions)

### 8. Embedded Checkout — Full Control, Full Benefits

If losing control over the checkout experience is a concern, **Embedded Checkout** and the **Payment Element** offer the best of both worlds:

- **Embedded Checkout** — a Stripe-hosted form that embeds directly into your page via an iframe. Looks native, but Stripe manages the UI. Minimal code.
- **Payment Element** — a drop-in component with extensive CSS-level customisation. Fits into any existing page layout and can match your brand exactly.
- **Embedded Payment Form (new)** — the latest surface combining Payment Element flexibility with Checkout Session backend power (L4)

> These options mean you do **not** need to redirect customers to a Stripe-hosted page.

### 9. Integration Path Options

| Surface | Level | Control | Effort | Best For |
|---|---|---|---|---|
| **Checkout (redirect)** | L5 | Low | Lowest | Fastest path, maximum optimisations |
| **Embedded Checkout** | L5 | Medium | Low | Keep users on-site, Stripe manages form |
| **Elements with Checkout Sessions** | L4 | High | Medium | Full CSS control + Checkout Session backend |
| **Payment Element + PaymentIntents** | L3 | High | Medium | Full control, good optimisations |

> Recommendation: **Elements with Checkout Sessions (L4)** — gives your team full CSS control while unlocking Adaptive Pricing and dynamic payment methods via the Checkout Sessions API.

### 10. Stripe Investment and Roadmap

The Card Element is a **legacy surface**. Stripe's product investment is concentrated on OCS:

- New features (Adaptive Pricing, Express Checkout, enhanced Link) are built for OCS first or exclusively
- The Card Element will receive maintenance updates but not new capabilities
- Migrating now positions you to benefit from future Stripe innovations without additional integration work

---

## Addressing Potential Concerns

| Concern | Response |
|---|---|
| **Migration effort** | Payment Element is a drop-in replacement. Stripe provides migration guides and SA support. Multi-step flows can be simplified. |
| **Custom A/B testing** | OCS supports native A/B testing of payment methods via Dashboard. Custom logic can still wrap OCS components. |
| **Branding / UX control** | Payment Element supports extensive CSS customisation. Embedded Checkout can be styled to match your brand. |
| **Subscription handling** | Checkout Sessions natively support subscriptions, removing the need for a multi-step flow. |
| **Existing saved cards** | Saved payment methods on Customer objects carry over — no customer re-entry required. |

---

## Key Resources

- [Stripe OCS Demo Site](https://checkout.stripe.dev)
- [Payment Element Documentation](https://docs.stripe.com/payments/elements)
- [Embedded Checkout Guide](https://docs.stripe.com/checkout/embedded/quickstart)
- [Adaptive Pricing](https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing)
- [Dynamic Payment Methods](https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods)
- [Express Checkout Element](https://docs.stripe.com/elements/express-checkout-element)

---

#ocs #migration #sales
