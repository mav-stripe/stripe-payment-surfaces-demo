"use client";

import React, { useCallback, useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import Link from "next/link";
import { useBrand } from "@/app/contexts/BrandContext";
import {
  getBrandAccentClasses,
  getBrandTextClasses,
  getBrandSecondaryTextClasses,
} from "@/app/utils/brandStyles";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

/**
 * Client wrapper for Stripe Embedded Checkout (ui_mode: "embedded").
 * Stripe manages the entire checkout UI; we just mount EmbeddedCheckout.
 * Only initialises the provider after client hydration so fetch runs in the browser.
 */
export function EmbeddedFormCheckout() {
  const { brand } = useBrand();
  const titleClass = getBrandTextClasses(brand);
  const secondaryClass = getBrandSecondaryTextClasses(brand);
  const linkClass = getBrandAccentClasses(brand);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const fetchClientSecret = useCallback(async () => {
    const res = await fetch("/api/create-embedded-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brand, surface: "embedded form" }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? "Failed to create checkout session");
    }
    const data = (await res.json()) as { clientSecret?: string };
    if (!data.clientSecret) {
      throw new Error("No client secret returned");
    }
    return data.clientSecret;
  }, [brand]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className={`mb-4 text-2xl font-bold ${titleClass}`}>
        Embedded Form
      </h1>
      <p className={`mb-6 ${secondaryClass}`}>
        Complete your purchase of <strong>Logo design+</strong> (A$4.99) using
        Stripe&apos;s Embedded Checkout below.
      </p>
      <div className="min-h-[300px]">
        {ready ? (
          <EmbeddedCheckoutProvider
            stripe={stripePromise}
            options={{ fetchClientSecret }}
          >
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Loading checkout…
          </p>
        )}
      </div>
      <p className="mt-6 text-sm">
        <Link href="/" className={linkClass}>
          Back to home
        </Link>
      </p>
    </div>
  );
}
