"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  CheckoutProvider,
  PaymentFormElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout";
import { loadStripe } from "@stripe/stripe-js";
import type { StripePaymentFormElementConfirmEvent } from "@stripe/stripe-js";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useBrand } from "@/app/contexts/BrandContext";
import {
  getBrandAccentClasses,
  getBrandTextClasses,
  getBrandSecondaryTextClasses,
} from "@/app/utils/brandStyles";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  { betas: ["custom_checkout_payment_form_1"] }
);

async function fetchClientSecret(brand: string): Promise<string> {
  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brand, surface: "embedded form 2", returnPath: "/embedded-form-2" }),
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
 * Inner checkout form using PaymentFormElement.
 * Stripe renders the full payment form including the submit button.
 * Confirmation is handled via the onConfirm callback.
 */
function CheckoutForm() {
  const { brand } = useBrand();
  const { user } = useUser();
  const linkClass = getBrandAccentClasses(brand);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const emailSyncedRef = useRef(false);

  const result = useCheckout();

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

  const handleConfirm = async (
    event: StripePaymentFormElementConfirmEvent
  ) => {
    setErrorMessage(null);
    const confirmResult = await checkout.confirm({
      paymentFormConfirmEvent: event,
    });
    if (confirmResult.type === "error") {
      setErrorMessage(confirmResult.error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6">
        <PaymentFormElement onConfirm={handleConfirm} />
      </div>
      {errorMessage && (
        <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
      )}
      <p className="text-sm">
        <Link href="/" className={linkClass}>
          Back to home
        </Link>
      </p>
    </div>
  );
}

/**
 * Client wrapper for the embeddable PaymentFormElement (habanero).
 * Uses CheckoutProvider with ui_mode: 'custom' and the beta flag.
 * Stripe renders the full checkout form including submit button.
 */
export function EmbeddedForm2Checkout() {
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
        Embedded Form 2
      </h1>
      <p className={`mb-6 ${secondaryClass}`}>
        Complete your purchase of <strong>Logo design+</strong> (A$4.99) using
        Stripe&apos;s embeddable payment form below.
      </p>
      <div className="min-h-[300px]">
        {clientSecretPromise ? (
          <CheckoutProvider
            stripe={stripePromise}
            options={{ clientSecret: clientSecretPromise }}
          >
            <CheckoutForm />
          </CheckoutProvider>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Loading checkout…
          </p>
        )}
      </div>
    </div>
  );
}
