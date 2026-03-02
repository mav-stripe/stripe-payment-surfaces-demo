"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useBrand } from "@/app/contexts/BrandContext";
import {
  getBrandAccentClasses,
  getBrandCardClasses,
  getBrandTextClasses,
  getBrandSecondaryTextClasses,
} from "@/app/utils/brandStyles";
import { PaymentElementFlowDiagram } from "../PaymentElementFlowDiagram";

type StatusState =
  | { type: "loading" }
  | { type: "complete"; session: Record<string, unknown> }
  | { type: "open"; session: Record<string, unknown> }
  | { type: "error"; message: string }
  | { type: "no-session" };

/**
 * Renders a JSON value as a styled, collapsible tree.
 * Scalars are inline; objects/arrays are expandable sections.
 */
function JsonTree({
  data,
  depth = 0,
  defaultOpen,
}: {
  data: unknown;
  depth?: number;
  defaultOpen?: boolean;
}) {
  const isOpen = defaultOpen ?? depth < 2;
  if (data === null || data === undefined) {
    return <span className="text-gray-400 italic">null</span>;
  }
  if (typeof data === "boolean") {
    return (
      <span className="text-amber-600 dark:text-amber-400">
        {data ? "true" : "false"}
      </span>
    );
  }
  if (typeof data === "number") {
    return (
      <span className="text-blue-600 dark:text-blue-400">{data}</span>
    );
  }
  if (typeof data === "string") {
    return (
      <span className="text-emerald-700 dark:text-emerald-400 break-all">
        &quot;{data}&quot;
      </span>
    );
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return <span className="text-gray-400">[]</span>;
    }
    return (
      <details open={isOpen} className="ml-4">
        <summary className="cursor-pointer text-gray-500 dark:text-gray-400 select-none">
          Array ({data.length})
        </summary>
        <ul className="border-l border-gray-300 dark:border-gray-600 ml-1 pl-3">
          {data.map((item, i) => (
            <li key={i} className="py-0.5">
              <span className="text-gray-400 mr-1 text-xs">{i}:</span>
              <JsonTree data={item} depth={depth + 1} />
            </li>
          ))}
        </ul>
      </details>
    );
  }

  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) {
      return <span className="text-gray-400">{"{}"}</span>;
    }
    return (
      <details open={isOpen} className="ml-4">
        <summary className="cursor-pointer text-gray-500 dark:text-gray-400 select-none">
          Object ({entries.length} keys)
        </summary>
        <dl className="border-l border-gray-300 dark:border-gray-600 ml-1 pl-3">
          {entries.map(([key, value]) => (
            <div key={key} className="py-0.5">
              <dt className="inline font-mono text-sm text-purple-700 dark:text-purple-400">
                {key}:
              </dt>{" "}
              <dd className="inline">
                <JsonTree data={value} depth={depth + 1} />
              </dd>
            </div>
          ))}
        </dl>
      </details>
    );
  }

  return <span>{String(data)}</span>;
}

/**
 * Inner client component that uses useSearchParams. Wrapped in Suspense by the page.
 */
function ReturnContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { brand } = useBrand();
  const [state, setState] = useState<StatusState>({ type: "loading" });

  const titleClass = getBrandTextClasses(brand);
  const secondaryClass = getBrandSecondaryTextClasses(brand);
  const linkClass = getBrandAccentClasses(brand);
  const cardClass = getBrandCardClasses(brand);

  const fetchStatus = useCallback(async () => {
    if (!sessionId) {
      setState({ type: "no-session" });
      return;
    }
    try {
      const res = await fetch(
        `/api/checkout-session-status?session_id=${encodeURIComponent(sessionId)}`
      );
      const data = (await res.json()) as {
        session?: Record<string, unknown>;
        error?: string;
      };
      if (!res.ok) {
        setState({
          type: "error",
          message: data.error ?? "Failed to load session status",
        });
        return;
      }
      const session = data.session ?? {};
      if (session.status === "complete") {
        setState({ type: "complete", session });
      } else {
        setState({ type: "open", session });
      }
    } catch (err) {
      setState({
        type: "error",
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, [sessionId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const navLinks = (
    <p className="mt-6">
      <Link href="/payment-element" className={linkClass}>
        Buy again
      </Link>
      {" · "}
      <Link href="/" className={linkClass}>
        Back to home
      </Link>
    </p>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className={`mb-4 text-2xl font-bold ${titleClass}`}>
          Payment Element — Return
        </h1>

        {state.type === "loading" && (
          <p className={secondaryClass}>Checking your payment…</p>
        )}

        {state.type === "no-session" && (
          <>
            <p className={secondaryClass}>
              No session ID provided. You may have reached this page by mistake.
            </p>
            {navLinks}
          </>
        )}

        {(state.type === "complete" || state.type === "open") &&
          (() => {
            const pi = state.session?.payment_intent as
              | Record<string, unknown>
              | string
              | null
              | undefined;
            const piId =
              typeof pi === "string" ? pi : typeof pi === "object" && pi ? (pi.id as string) : null;
            const acct = process.env.NEXT_PUBLIC_STRIPE_ACCOUNT;
            const dashboardUrl =
              piId && acct
                ? `https://dashboard.stripe.com/${acct}/test/payments/${piId}`
                : null;
            return dashboardUrl ? (
              <a
                href={dashboardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`mb-4 inline-flex items-center gap-1.5 text-sm font-medium ${linkClass}`}
              >
                View in Stripe Dashboard
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm7.25-.75a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 1 1-1.06-1.06l5.22-5.22H12.25a.75.75 0 0 1-.75-.75Z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            ) : null;
          })()}

        {state.type === "complete" && (
          <>
            <p className={`mb-6 ${secondaryClass}`}>
              Thank you for your purchase. Your payment was successful.
            </p>
            <div
              className={`rounded-lg p-4 overflow-x-auto text-sm font-mono ${cardClass}`}
            >
              <h2 className={`mb-3 text-base font-semibold font-sans ${titleClass}`}>
                Checkout Session Object
              </h2>
              <JsonTree data={state.session} defaultOpen={false} />
            </div>
            <details className="mt-6">
              <summary className={`cursor-pointer select-none font-medium ${secondaryClass}`}>
                Payment Element Flow Diagram
              </summary>
              <div className="mt-3">
                <PaymentElementFlowDiagram />
              </div>
            </details>
            {navLinks}
          </>
        )}

        {state.type === "open" && (
          <>
            <p className={`mb-6 ${secondaryClass}`}>
              Payment was not completed.
            </p>
            <div
              className={`rounded-lg p-4 overflow-x-auto text-sm font-mono ${cardClass}`}
            >
              <h2 className={`mb-3 text-base font-semibold font-sans ${titleClass}`}>
                Checkout Session Object
              </h2>
              <JsonTree data={state.session} defaultOpen={false} />
            </div>
            <details className="mt-6">
              <summary className={`cursor-pointer select-none font-medium ${secondaryClass}`}>
                Payment Element Flow Diagram
              </summary>
              <div className="mt-3">
                <PaymentElementFlowDiagram />
              </div>
            </details>
            {navLinks}
          </>
        )}

        {state.type === "error" && (
          <>
            <p className={secondaryClass}>
              Something went wrong: {state.message}
            </p>
            {navLinks}
          </>
        )}
      </main>
    </div>
  );
}

/**
 * Return page for Payment Element checkout.
 * Fetches the full Checkout Session and renders it as a formatted tree.
 */
export default function PaymentElementReturnPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <main className="mx-auto max-w-4xl px-4 py-8">
            <p className="text-gray-600 dark:text-gray-400">
              Checking your payment…
            </p>
          </main>
        </div>
      }
    >
      <ReturnContent />
    </Suspense>
  );
}
