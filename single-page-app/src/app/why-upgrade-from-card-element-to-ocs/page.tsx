"use client";

import { useState, useCallback, type ReactNode } from "react";
import Link from "next/link";
import { useBrand } from "@/app/contexts/BrandContext";
import {
  getBrandAccentClasses,
  getBrandButtonClasses,
  getBrandTextClasses,
  getBrandSecondaryTextClasses,
  getBrandCardClasses,
} from "@/app/utils/brandStyles";

function Callout({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <div
      className={`mt-4 rounded-lg border-l-4 border-indigo-500 py-3 pl-4 pr-3 text-sm italic ${className}`}
    >
      {children}
    </div>
  );
}

type Slide = {
  number: string;
  title: string;
  content: (ctx: SlideContext) => ReactNode;
};

type SlideContext = {
  titleClass: string;
  secondaryClass: string;
  linkClass: string;
  cardClass: string;
};

const SLIDES: Slide[] = [
  {
    number: "0",
    title: "Overview",
    content: ({ titleClass, secondaryClass, cardClass }) => (
      <>
        <div className={`mb-6 rounded-lg p-6 ${cardClass}`}>
          <h3 className={`mb-3 text-lg font-semibold ${titleClass}`}>
            Current State
          </h3>
          <p className={`mb-3 ${secondaryClass}`}>
            If you currently use the <strong>legacy Card Element</strong> (Level
            2 integration), you may have:
          </p>
          <ul className={`list-inside list-disc space-y-1 ${secondaryClass}`}>
            <li>
              A multi-step checkout flow (subscription charge &rarr; second form
              with saved payment method)
            </li>
            <li>A separate PSP for PayPal (e.g. Braintree)</li>
            <li>Custom A/B testing system for checkout experiments</li>
            <li>Manual integrations for third-party services</li>
          </ul>
        </div>
        <h3 className={`mb-3 text-lg font-semibold ${titleClass}`}>
          What is the Optimised Checkout Suite (OCS)?
        </h3>
        <p className={secondaryClass}>
          The OCS encompasses Stripe&apos;s modern payment surfaces —{" "}
          <strong>
            Checkout Sessions, Payment Element, Express Checkout Element, and
            Embedded Checkout
          </strong>{" "}
          — that provide out-of-the-box optimisations, broader payment method
          support, and reduced maintenance burden compared to legacy Card Element
          integrations.
        </p>
      </>
    ),
  },
  {
    number: "1",
    title: "Higher Conversion Rates — Out of the Box",
    content: ({ secondaryClass }) => (
      <>
        <p className={`mb-3 ${secondaryClass}`}>
          The legacy Card Element (L2) provides{" "}
          <strong>limited out-of-the-box optimisations</strong>. OCS surfaces are
          continuously optimised by Stripe&apos;s checkout team for conversion,
          including:
        </p>
        <ul className={`list-inside list-disc space-y-2 ${secondaryClass}`}>
          <li>
            <strong>Smart payment method ordering</strong> — dynamically ranks
            and displays payment methods based on buyer location, device, and
            behaviour
          </li>
          <li>
            <strong>Link integration</strong> — autofills returning
            customers&apos; payment details in one click, significantly reducing
            checkout friction and cart abandonment
          </li>
          <li>
            <strong>Optimised input fields</strong> — real-time validation,
            auto-formatting, smart error messaging, and locale-aware field
            ordering
          </li>
          <li>
            <strong>Express Checkout Element</strong> — surfaces Apple Pay,
            Google Pay, and Link as one-click buttons above the fold for instant
            checkout
          </li>
        </ul>
        <Callout className={secondaryClass}>
          For growth teams running A/B tests, OCS gives you a higher conversion
          baseline to test from.
        </Callout>
      </>
    ),
  },
  {
    number: "2",
    title: "Consolidate PayPal onto Stripe — Eliminate Braintree",
    content: ({ secondaryClass }) => (
      <>
        <p className={`mb-3 ${secondaryClass}`}>
          If you run <strong>a separate PSP</strong> solely for PayPal (e.g.
          Braintree), OCS lets you consolidate:
        </p>
        <ul className={`list-inside list-disc space-y-2 ${secondaryClass}`}>
          <li>
            <strong>PayPal is natively supported</strong> in the Payment Element
            and Express Checkout Element
          </li>
          <li>
            <strong>Single integration, single dashboard</strong> — no need to
            maintain a second PSP, reconcile across two systems, or manage
            separate fraud rules
          </li>
          <li>
            <strong>Reduced operational overhead</strong> — one set of reporting,
            disputes, refunds, and payouts
          </li>
          <li>
            <strong>Cost savings</strong> — eliminate Braintree platform fees and
            the engineering cost of maintaining a multi-PSP integration
          </li>
        </ul>
        <Callout className={secondaryClass}>
          This directly addresses multi-PSP complexity that many merchants face.
        </Callout>
      </>
    ),
  },
  {
    number: "3",
    title: "Dynamic Payment Methods — No Code Changes",
    content: ({ secondaryClass }) => (
      <>
        <p className={`mb-3 ${secondaryClass}`}>
          With the Card Element, adding a new payment method (BECS Direct Debit,
          Afterpay, Klarna, etc.) requires code changes and a new deployment.
          With OCS:
        </p>
        <ul className={`list-inside list-disc space-y-2 ${secondaryClass}`}>
          <li>
            <strong>
              Enable/disable payment methods from the Stripe Dashboard
            </strong>{" "}
            — no code changes, no deploys
          </li>
          <li>
            <strong>A/B test payment methods</strong> natively — turn on a
            payment method for a percentage of traffic and measure impact on
            conversion rate and average order value
          </li>
          <li>
            <strong>Automatic regional optimisation</strong> — Stripe shows the
            right payment methods for each buyer&apos;s location
          </li>
          <li>
            <strong>Future-proof</strong> — as Stripe adds new payment methods,
            they become available without integration work
          </li>
        </ul>
        <Callout className={secondaryClass}>
          This can replace or complement custom A/B testing systems for payment
          method experimentation.
        </Callout>
      </>
    ),
  },
  {
    number: "4",
    title: "Adaptive Pricing — Localised Currency Presentment",
    content: ({ secondaryClass }) => (
      <>
        <p className={`mb-3 ${secondaryClass}`}>
          For merchants serving customers worldwide, OCS (specifically Checkout
          Sessions) enables:
        </p>
        <ul className={`list-inside list-disc space-y-2 ${secondaryClass}`}>
          <li>
            <strong>Adaptive Pricing</strong> lets customers pay in their local
            currency across 150+ countries
          </li>
          <li>
            Customers pay a small FX fee —{" "}
            <strong>no additional Stripe fees</strong> for the merchant
          </li>
          <li>
            Proven to increase international conversion rates by reducing
            currency confusion and unexpected FX charges at the bank level
          </li>
        </ul>
        <Callout className={secondaryClass}>
          This is only available on Checkout Sessions (L4+) — not on the legacy
          Card Element.
        </Callout>
      </>
    ),
  },
  {
    number: "5",
    title: "Simplified Subscription + One-off Payment Flows",
    content: ({ secondaryClass }) => (
      <>
        <p className={`mb-3 ${secondaryClass}`}>
          If you currently use a multi-step checkout (subscription charge &rarr;
          second form), Checkout Sessions can simplify this:
        </p>
        <ul className={`list-inside list-disc space-y-2 ${secondaryClass}`}>
          <li>
            <strong>Native subscription support</strong> — Checkout Sessions
            handle subscription creation, trial periods, and recurring billing
            natively
          </li>
          <li>
            <strong>Saved payment methods</strong> are managed automatically via
            the Customer object
          </li>
          <li>
            <strong>Reduce to a single checkout step</strong> — the Payment
            Element or Embedded Checkout can handle both subscription setup and
            one-off charges in a unified flow
          </li>
          <li>
            <strong>Customer portal</strong> — built-in hosted page for customers
            to manage subscriptions, update payment methods, and view invoices
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "6",
    title: "Lower Integration and Maintenance Effort",
    content: ({ secondaryClass }) => (
      <>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr
                className={`border-b border-gray-300 dark:border-gray-600 ${secondaryClass}`}
              >
                <th className="py-2 pr-4 font-medium"></th>
                <th className="py-2 pr-4 font-medium">Card Element (L2)</th>
                <th className="py-2 font-medium">
                  Payment Element / Embedded Checkout (L3/L4)
                </th>
              </tr>
            </thead>
            <tbody className={secondaryClass}>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 pr-4 font-medium">
                  Adding payment methods
                </td>
                <td className="py-2 pr-4">Code changes + deploy</td>
                <td className="py-2">Dashboard toggle</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 pr-4 font-medium">UI optimisations</td>
                <td className="py-2 pr-4">Manual implementation</td>
                <td className="py-2">Automatic from Stripe</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 pr-4 font-medium">PCI scope</td>
                <td className="py-2 pr-4">SAQ-A (same)</td>
                <td className="py-2">SAQ-A (same)</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 pr-4 font-medium">Maintenance burden</td>
                <td className="py-2 pr-4">High — manual updates</td>
                <td className="py-2">Low — Stripe manages UI updates</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">New Stripe features</td>
                <td className="py-2 pr-4">Requires integration work</td>
                <td className="py-2">Available automatically</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout className={secondaryClass}>
          For growth teams with limited engineering bandwidth, this means more
          time building product and less time maintaining payment plumbing.
        </Callout>
      </>
    ),
  },
  {
    number: "7",
    title: "Better Fraud Protection",
    content: ({ secondaryClass }) => (
      <>
        <p className={`mb-3 ${secondaryClass}`}>
          Moving to Checkout Sessions (L4+) gives Stripe{" "}
          <strong>deeper insight into the payment context</strong>:
        </p>
        <ul className={`list-inside list-disc space-y-2 ${secondaryClass}`}>
          <li>
            Stripe knows more about what the merchant is selling, enabling better{" "}
            <strong>Radar fraud detection</strong>
          </li>
          <li>
            Enhanced data signals improve machine learning models for fraud
            scoring
          </li>
          <li>
            Built-in <strong>3D Secure</strong> handling with smart
            authentication (only challenges high-risk transactions)
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "8",
    title: "Embedded Checkout — Full Control, Full Benefits",
    content: ({ titleClass, secondaryClass, cardClass }) => (
      <>
        <p className={`mb-4 ${secondaryClass}`}>
          If losing control over the checkout experience is a concern,{" "}
          <strong>Embedded Checkout</strong> and the{" "}
          <strong>Payment Element</strong> offer the best of both worlds:
        </p>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className={`rounded-lg p-4 ${cardClass}`}>
            <h4 className={`mb-1 font-semibold ${titleClass}`}>
              Embedded Checkout
            </h4>
            <p className={`text-sm ${secondaryClass}`}>
              A Stripe-hosted form that embeds directly into your page via an
              iframe. Looks native, but Stripe manages the UI. Minimal code.
            </p>
          </div>
          <div className={`rounded-lg p-4 ${cardClass}`}>
            <h4 className={`mb-1 font-semibold ${titleClass}`}>
              Payment Element
            </h4>
            <p className={`text-sm ${secondaryClass}`}>
              A drop-in component with extensive CSS-level customisation. Fits
              into any existing page layout and can match your brand exactly.
            </p>
          </div>
          <div className={`rounded-lg p-4 ${cardClass}`}>
            <h4 className={`mb-1 font-semibold ${titleClass}`}>
              Embedded Payment Form
            </h4>
            <p className={`text-sm ${secondaryClass}`}>
              The latest surface combining Payment Element flexibility with
              Checkout Session backend power (L4).
            </p>
          </div>
        </div>
        <Callout className={secondaryClass}>
          These options mean you do <strong>not</strong> need to redirect
          customers to a Stripe-hosted page.
        </Callout>
      </>
    ),
  },
  {
    number: "9",
    title: "Integration Path Options",
    content: ({ secondaryClass }) => (
      <>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr
                className={`border-b border-gray-300 dark:border-gray-600 ${secondaryClass}`}
              >
                <th className="py-2 pr-4 font-medium">Surface</th>
                <th className="py-2 pr-4 font-medium">Level</th>
                <th className="py-2 pr-4 font-medium">Control</th>
                <th className="py-2 pr-4 font-medium">Effort</th>
                <th className="py-2 font-medium">Best For</th>
              </tr>
            </thead>
            <tbody className={secondaryClass}>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 pr-4 font-medium">Checkout (redirect)</td>
                <td className="py-2 pr-4">L5</td>
                <td className="py-2 pr-4">Low</td>
                <td className="py-2 pr-4">Lowest</td>
                <td className="py-2">Fastest path, maximum optimisations</td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 pr-4 font-medium">Embedded Checkout</td>
                <td className="py-2 pr-4">L5</td>
                <td className="py-2 pr-4">Medium</td>
                <td className="py-2 pr-4">Low</td>
                <td className="py-2">
                  Keep users on-site, Stripe manages form
                </td>
              </tr>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-2 pr-4 font-medium">
                  Elements with Checkout Sessions
                </td>
                <td className="py-2 pr-4">L4</td>
                <td className="py-2 pr-4">High</td>
                <td className="py-2 pr-4">Medium</td>
                <td className="py-2">
                  Full CSS control + Checkout Session backend
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">
                  Payment Element + PaymentIntents
                </td>
                <td className="py-2 pr-4">L3</td>
                <td className="py-2 pr-4">High</td>
                <td className="py-2 pr-4">Medium</td>
                <td className="py-2">Full control, good optimisations</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout className={secondaryClass}>
          Recommendation:{" "}
          <strong>Elements with Checkout Sessions (L4)</strong> — gives your team
          full CSS control while unlocking Adaptive Pricing and dynamic payment
          methods via the Checkout Sessions API.
        </Callout>
      </>
    ),
  },
  {
    number: "10",
    title: "Stripe Investment and Roadmap",
    content: ({ secondaryClass }) => (
      <>
        <p className={`mb-3 ${secondaryClass}`}>
          The Card Element is a <strong>legacy surface</strong>. Stripe&apos;s
          product investment is concentrated on OCS:
        </p>
        <ul className={`list-inside list-disc space-y-2 ${secondaryClass}`}>
          <li>
            New features (Adaptive Pricing, Express Checkout, enhanced Link) are
            built for OCS first or exclusively
          </li>
          <li>
            The Card Element will receive maintenance updates but not new
            capabilities
          </li>
          <li>
            Migrating now positions you to benefit from future Stripe innovations
            without additional integration work
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "11",
    title: "Addressing Potential Concerns",
    content: ({ titleClass, secondaryClass, cardClass, linkClass }) => (
      <>
        <div className="space-y-4">
          {[
            {
              concern: "Migration effort",
              response:
                "Payment Element is a drop-in replacement. Stripe provides migration guides and SA support. Multi-step flows can be simplified.",
            },
            {
              concern: "Custom A/B testing",
              response:
                "OCS supports native A/B testing of payment methods via Dashboard. Custom logic can still wrap OCS components.",
            },
            {
              concern: "Branding / UX control",
              response:
                "Payment Element supports extensive CSS customisation. Embedded Checkout can be styled to match your brand.",
            },
            {
              concern: "Subscription handling",
              response:
                "Checkout Sessions natively support subscriptions, removing the need for a multi-step flow.",
            },
            {
              concern: "Existing saved cards",
              response:
                "Saved payment methods on Customer objects carry over — no customer re-entry required.",
            },
          ].map(({ concern, response }) => (
            <div key={concern} className={`rounded-lg p-4 ${cardClass}`}>
              <h4 className={`mb-1 font-semibold ${titleClass}`}>{concern}</h4>
              <p className={`text-sm ${secondaryClass}`}>{response}</p>
            </div>
          ))}
        </div>

        <h3 className={`mb-3 mt-8 text-lg font-semibold ${titleClass}`}>
          Key Resources
        </h3>
        <ul className={`list-inside list-disc space-y-2 ${secondaryClass}`}>
          {[
            { label: "Stripe OCS Demo Site", url: "https://checkout.stripe.dev" },
            { label: "Payment Element Documentation", url: "https://docs.stripe.com/payments/elements" },
            { label: "Embedded Checkout Guide", url: "https://docs.stripe.com/checkout/embedded/quickstart" },
            { label: "Adaptive Pricing", url: "https://docs.stripe.com/payments/currencies/localize-prices/adaptive-pricing" },
            { label: "Dynamic Payment Methods", url: "https://docs.stripe.com/payments/payment-methods/dynamic-payment-methods" },
            { label: "Express Checkout Element", url: "https://docs.stripe.com/elements/express-checkout-element" },
          ].map(({ label, url }) => (
            <li key={url}>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </>
    ),
  },
];

export default function WhyUpgradePage() {
  const { brand } = useBrand();
  const titleClass = getBrandTextClasses(brand);
  const secondaryClass = getBrandSecondaryTextClasses(brand);
  const linkClass = getBrandAccentClasses(brand);
  const cardClass = getBrandCardClasses(brand);
  const buttonClass = getBrandButtonClasses(brand);

  const [step, setStep] = useState(0);
  const total = SLIDES.length;
  const slide = SLIDES[step];

  const goBack = useCallback(() => setStep((s) => Math.max(0, s - 1)), []);
  const goForward = useCallback(
    () => setStep((s) => Math.min(total - 1, s + 1)),
    [total]
  );

  const isFirst = step === 0;
  const isLast = step === total - 1;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <h1 className={`mb-2 text-3xl font-bold ${titleClass}`}>
          Why Migrate from Legacy Card Element to the Optimised Checkout Suite
        </h1>
        <p className={`mb-6 text-lg ${secondaryClass}`}>
          A guide to understanding the benefits of upgrading from the legacy Card
          Element (L2) to Stripe&apos;s modern payment surfaces.
        </p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className={secondaryClass}>
              Step {step + 1} of {total}
            </span>
            <span className={secondaryClass}>
              {Math.round(((step + 1) / total) * 100)}%
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full rounded-full bg-indigo-600 transition-all duration-300"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        {/* Step dots */}
        <div className="mb-8 flex flex-wrap gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              title={s.title}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i === step
                  ? "bg-indigo-600 text-white"
                  : i < step
                    ? "bg-indigo-200 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300"
                    : "bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
              }`}
              aria-label={`Go to step ${i + 1}: ${s.title}`}
            >
              {s.number === "0" ? "•" : s.number === "11" ? "?" : s.number}
            </button>
          ))}
        </div>

        {/* Slide content */}
        <div className="mb-8 min-h-[24rem]">
          <h2 className={`mb-4 text-xl font-semibold ${titleClass}`}>
            {slide.number !== "0" && slide.number !== "11" && (
              <span className="mr-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {slide.number}
              </span>
            )}
            {slide.title}
          </h2>
          {slide.content({ titleClass, secondaryClass, linkClass, cardClass })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700">
          <button
            onClick={goBack}
            disabled={isFirst}
            className={`rounded px-5 py-2 text-sm font-medium transition-colors ${
              isFirst
                ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
                : `${buttonClass}`
            }`}
          >
            &larr; Previous
          </button>

          <Link href="/" className={`text-sm ${linkClass}`}>
            Back to home
          </Link>

          <button
            onClick={goForward}
            disabled={isLast}
            className={`rounded px-5 py-2 text-sm font-medium transition-colors ${
              isLast
                ? "cursor-not-allowed text-gray-400 dark:text-gray-600"
                : `${buttonClass}`
            }`}
          >
            Next &rarr;
          </button>
        </div>
      </main>
    </div>
  );
}
