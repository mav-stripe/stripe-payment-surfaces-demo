"use client";

import Link from "next/link";
import { useBrand } from "@/app/contexts/BrandContext";
import {
  getBrandAccentClasses,
  getBrandTextClasses,
  getBrandSecondaryTextClasses,
  getBrandCardClasses,
} from "@/app/utils/brandStyles";

function CodeBlock({ title, code }: { title?: string; code: string }) {
  return (
    <div className="my-4 overflow-x-auto rounded-lg bg-gray-900 text-sm">
      {title && (
        <div className="border-b border-gray-700 px-4 py-2 text-xs font-medium text-gray-400">
          {title}
        </div>
      )}
      <pre className="p-4 text-gray-200">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function ImplementationEmbeddedFormPage() {
  const { brand } = useBrand();
  const titleClass = getBrandTextClasses(brand);
  const secondaryClass = getBrandSecondaryTextClasses(brand);
  const linkClass = getBrandAccentClasses(brand);
  const cardClass = getBrandCardClasses(brand);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className={`mb-2 text-3xl font-bold ${titleClass}`}>
          Embedded Form — Implementation Guide
        </h1>
        <p className={`mb-8 ${secondaryClass}`}>
          A walkthrough of the key code that powers the{" "}
          <Link href="/embedded-form" className={linkClass}>
            /embedded-form
          </Link>{" "}
          route, using Stripe&apos;s Embedded Checkout with the Checkout Sessions API
          (<code className="text-sm">ui_mode: &quot;embedded&quot;</code>).
        </p>

        {/* ── Overview ────────────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            Overview
          </h2>
          <p className={`mb-4 ${secondaryClass}`}>
            The embedded form integration has three parts:
          </p>
          <ol className={`list-inside list-decimal space-y-1 ${secondaryClass}`}>
            <li>
              <strong>Server — Create a Checkout Session</strong> (API route)
            </li>
            <li>
              <strong>Client — Mount Stripe&apos;s Embedded Checkout</strong> (React
              component)
            </li>
            <li>
              <strong>Return page — Retrieve session status</strong> after
              redirect
            </li>
          </ol>
        </section>

        {/* ── Step 1: Server ─────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            1. Create a Checkout Session (Server)
          </h2>
          <p className={`mb-3 ${secondaryClass}`}>
            The API route at{" "}
            <code className="text-sm">/api/create-embedded-checkout-session</code>{" "}
            creates a Stripe Checkout Session with{" "}
            <code className="text-sm">ui_mode: &quot;embedded&quot;</code>. This tells
            Stripe to return a <code className="text-sm">client_secret</code>{" "}
            that the front end uses to mount the checkout iframe.
          </p>
          <CodeBlock
            title="api/create-embedded-checkout-session/route.ts"
            code={`import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  // Ensure the user is authenticated
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  // Parse brand & surface from request body for the description
  const body = await request.json().catch(() => ({}));
  const brand = body.brand || "generic";
  const surface = body.surface || "embedded form";

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",          // ← key: enables embedded checkout
    mode: "payment",
    return_url: \`\${baseUrl}/embedded-form/return?session_id={CHECKOUT_SESSION_ID}\`,
    payment_intent_data: {
      description: \`payment surfaces demo/\${brand}/\${surface}\`,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 499,         // $4.99
          product_data: { name: "Logo design+" },
        },
        quantity: 1,
      },
    ],
  });

  return NextResponse.json({ clientSecret: session.client_secret });
}`}
          />
          <div className={`rounded-lg p-4 ${cardClass}`}>
            <p className={`text-sm ${secondaryClass}`}>
              <strong>Key point:</strong>{" "}
              <code className="text-sm">ui_mode: &quot;embedded&quot;</code> is what
              differentiates this from a hosted checkout page or a custom UI.
              Stripe generates a <code className="text-sm">client_secret</code>{" "}
              that the front end passes to{" "}
              <code className="text-sm">EmbeddedCheckoutProvider</code>. The{" "}
              <code className="text-sm">return_url</code> includes the{" "}
              <code className="text-sm">{"{CHECKOUT_SESSION_ID}"}</code>{" "}
              template literal — Stripe replaces it with the actual session ID
              on redirect.
            </p>
          </div>
        </section>

        {/* ── Step 2: Client ─────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            2. Mount Embedded Checkout (Client)
          </h2>
          <p className={`mb-3 ${secondaryClass}`}>
            The client component loads Stripe.js and mounts the{" "}
            <code className="text-sm">EmbeddedCheckout</code> component inside
            an <code className="text-sm">EmbeddedCheckoutProvider</code>. Stripe
            controls the entire checkout UI — payment fields, submit button,
            validation, and redirect.
          </p>

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            a. Load Stripe outside the component
          </h3>
          <CodeBlock
            title="EmbeddedFormCheckout.tsx — Stripe initialisation"
            code={`import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";

// Load once, outside the component to avoid re-creating on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);`}
          />

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            b. Fetch the client secret
          </h3>
          <p className={`mb-3 ${secondaryClass}`}>
            The <code className="text-sm">fetchClientSecret</code> callback
            calls the API route and returns the secret. It&apos;s wrapped in{" "}
            <code className="text-sm">useCallback</code> so the provider
            doesn&apos;t re-fetch on every render.
          </p>
          <CodeBlock
            title="EmbeddedFormCheckout.tsx — fetchClientSecret"
            code={`const fetchClientSecret = useCallback(async () => {
  const res = await fetch("/api/create-embedded-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brand, surface: "embedded form" }),
  });

  const data = await res.json();
  return data.clientSecret;
}, [brand]);`}
          />

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            c. Render the provider and checkout
          </h3>
          <p className={`mb-3 ${secondaryClass}`}>
            The component waits for client-side hydration (via a{" "}
            <code className="text-sm">ready</code> state flag) before mounting
            the provider. This prevents SSR issues with the fetch call.
          </p>
          <CodeBlock
            title="EmbeddedFormCheckout.tsx — render"
            code={`export function EmbeddedFormCheckout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className="min-h-[300px]">
      {ready ? (
        <EmbeddedCheckoutProvider
          stripe={stripePromise}
          options={{ fetchClientSecret }}
        >
          <EmbeddedCheckout />
        </EmbeddedCheckoutProvider>
      ) : (
        <p>Loading checkout…</p>
      )}
    </div>
  );
}`}
          />
          <div className={`rounded-lg p-4 ${cardClass}`}>
            <p className={`text-sm ${secondaryClass}`}>
              <strong>Key point:</strong> The{" "}
              <code className="text-sm">EmbeddedCheckoutProvider</code> accepts
              a <code className="text-sm">fetchClientSecret</code> function
              (not the secret itself). Stripe calls it internally and manages
              the lifecycle. The{" "}
              <code className="text-sm">&lt;EmbeddedCheckout /&gt;</code>{" "}
              component renders the full checkout iframe — no custom form or
              Pay button is needed.
            </p>
          </div>
        </section>

        {/* ── Step 3: Return page ────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            3. Return Page — Retrieve Session Status
          </h2>
          <p className={`mb-3 ${secondaryClass}`}>
            After the customer completes (or cancels) payment, Stripe redirects
            to the <code className="text-sm">return_url</code> with the session
            ID in the query string. The return page fetches the full session
            object from Stripe.
          </p>

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            a. API route — retrieve the session
          </h3>
          <CodeBlock
            title="api/checkout-session-status/route.ts"
            code={`import Stripe from "stripe";

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items", "payment_intent"],
  });

  return NextResponse.json({ session });
}`}
          />
          <div className={`rounded-lg p-4 ${cardClass}`}>
            <p className={`text-sm ${secondaryClass}`}>
              <strong>Key point:</strong> The{" "}
              <code className="text-sm">expand</code> parameter tells Stripe to
              include the full <code className="text-sm">line_items</code> and{" "}
              <code className="text-sm">payment_intent</code> objects in the
              response, rather than just their IDs. This gives the return page
              rich data to display.
            </p>
          </div>

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            b. Client — fetch and display status
          </h3>
          <p className={`mb-3 ${secondaryClass}`}>
            The return page reads the{" "}
            <code className="text-sm">session_id</code> from the URL, calls the
            API, and shows the result.
          </p>
          <CodeBlock
            title="embedded-form/return/page.tsx — fetch session"
            code={`function ReturnContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState({ type: "loading" });

  const fetchStatus = useCallback(async () => {
    if (!sessionId) {
      setState({ type: "no-session" });
      return;
    }

    const res = await fetch(
      \`/api/checkout-session-status?session_id=\${encodeURIComponent(sessionId)}\`
    );
    const data = await res.json();
    const session = data.session ?? {};

    if (session.status === "complete") {
      setState({ type: "complete", session });
    } else {
      setState({ type: "open", session });
    }
  }, [sessionId]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Render success message, session details, dashboard link, etc.
}`}
          />
        </section>

        {/* ── File structure ─────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            File Structure
          </h2>
          <CodeBlock
            code={`src/app/
  api/
    create-embedded-checkout-session/
      route.ts          # POST: creates Checkout Session (ui_mode: "embedded")
    checkout-session-status/
      route.ts          # GET: retrieves session by ID (shared across surfaces)
  embedded-form/
    page.tsx            # Server component — renders EmbeddedFormCheckout
    EmbeddedFormCheckout.tsx  # Client component — EmbeddedCheckoutProvider + EmbeddedCheckout
    return/
      page.tsx          # Return page — fetches session, shows result`}
          />
        </section>

        {/* ── Links ──────────────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            Resources
          </h2>
          <ul className={`list-inside list-disc space-y-1 ${secondaryClass}`}>
            <li>
              <a
                href="https://docs.stripe.com/checkout/embedded/quickstart"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Stripe Embedded Checkout Quickstart
              </a>
            </li>
            <li>
              <a
                href="https://docs.stripe.com/payments/checkout"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Stripe Checkout Overview
              </a>
            </li>
            <li>
              <a
                href="https://docs.stripe.com/api/checkout/sessions"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Checkout Sessions API Reference
              </a>
            </li>
          </ul>
        </section>

        <p className="mt-6 text-sm">
          <Link href="/embedded-form" className={linkClass}>
            Try the Embedded Form &rarr;
          </Link>
          {" · "}
          <Link href="/" className={linkClass}>
            Back to home
          </Link>
        </p>
      </main>
    </div>
  );
}
