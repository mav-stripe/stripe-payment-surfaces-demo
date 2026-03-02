"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CheckoutProvider,
  PaymentElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useBrand } from "@/app/contexts/BrandContext";
import {
  getBrandAccentClasses,
  getBrandButtonClasses,
  getBrandTextClasses,
  getBrandSecondaryTextClasses,
} from "@/app/utils/brandStyles";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

async function fetchClientSecret(brand: string): Promise<string> {
  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brand, surface: "payment element" }),
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
}

/**
 * Inner form: Payment Element + Pay button. Uses useCheckout to confirm.
 * Automatically sets the email from Clerk auth on checkout.
 */
function PaymentForm() {
  const { brand } = useBrand();
  const { user } = useUser();
  const linkClass = getBrandAccentClasses(brand);
  const buttonClass = getBrandButtonClasses(brand);
  const [confirming, setConfirming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const emailSyncedRef = useRef(false);

  const result = useCheckout();

  // Sync the authenticated user's email to the checkout session once
  useEffect(() => {
    if (
      result.type !== "success" ||
      emailSyncedRef.current ||
      !user?.primaryEmailAddress?.emailAddress
    )
      return;
    emailSyncedRef.current = true;
    result.checkout.updateEmail(user.primaryEmailAddress.emailAddress);
  }, [result, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (result.type !== "success") return;
    const { checkout } = result;
    setErrorMessage(null);
    setConfirming(true);
    try {
      // return_url is set when creating the Checkout Session; do not pass returnUrl to confirm()
      const confirmResult = await checkout.confirm();
      if (confirmResult.type === "error") {
        setErrorMessage(confirmResult.error.message);
      }
    } finally {
      setConfirming(false);
    }
  };

  if (result.type === "loading") {
    return (
      <p className="text-gray-600 dark:text-gray-400">Loading checkout…</p>
    );
  }
  if (result.type === "error") {
    return (
      <p className="text-red-600 dark:text-red-400">
        Error: {result.error.message}
      </p>
    );
  }

  const { checkout } = result;

  // Only disable while confirming; allow Pay click so Stripe can return validation errors if form incomplete
  const isSubmitDisabled = confirming;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && (
        <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className={`rounded px-4 py-2 font-medium ${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {confirming ? "Processing…" : "Pay A$4.99"}
      </button>
      <p className="text-sm">
        <Link href="/" className={linkClass}>
          Back to home
        </Link>
      </p>
    </form>
  );
}

/**
 * Client wrapper for Stripe Payment Element with Checkout Sessions (custom UI).
 * Uses CheckoutProvider + PaymentElement + useCheckout to confirm.
 * Only mounts CheckoutProvider after client hydration so fetch runs in the browser.
 */
export function PaymentElementCheckout() {
  const { brand } = useBrand();
  const titleClass = getBrandTextClasses(brand);
  const secondaryClass = getBrandSecondaryTextClasses(brand);
  const [clientSecretPromise, setClientSecretPromise] = useState<
    Promise<string> | null
  >(null);

  useEffect(() => {
    setClientSecretPromise(fetchClientSecret(brand));
  }, [brand]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className={`mb-4 text-2xl font-bold ${titleClass}`}>
        Payment Element
      </h1>
      <p className={`mb-6 ${secondaryClass}`}>
        Complete your purchase of <strong>Logo design+</strong> (A$4.99) using the
        form below.
      </p>
      <div className="min-h-[300px]">
        {clientSecretPromise ? (
          <CheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret: clientSecretPromise }}
          >
            <PaymentForm />
          </CheckoutProvider>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">Loading checkout…</p>
        )}
      </div>
    </div>
  );
}
