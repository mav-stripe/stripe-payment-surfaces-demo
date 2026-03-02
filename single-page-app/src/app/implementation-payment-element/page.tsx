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

export default function ImplementationPaymentElementPage() {
  const { brand } = useBrand();
  const titleClass = getBrandTextClasses(brand);
  const secondaryClass = getBrandSecondaryTextClasses(brand);
  const linkClass = getBrandAccentClasses(brand);
  const cardClass = getBrandCardClasses(brand);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className={`mb-2 text-3xl font-bold ${titleClass}`}>
          Payment Element — Implementation Guide
        </h1>
        <p className={`mb-8 ${secondaryClass}`}>
          A walkthrough of the key code that powers the{" "}
          <Link href="/payment-element" className={linkClass}>
            /payment-element
          </Link>{" "}
          route, using Stripe&apos;s{" "}
          <code className="text-sm">PaymentElement</code> with the Checkout
          Sessions API (
          <code className="text-sm">ui_mode: &quot;custom&quot;</code>).
        </p>

        {/* ── Overview ────────────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            Overview
          </h2>
          <p className={`mb-4 ${secondaryClass}`}>
            Payment Element gives you the most control over the checkout
            experience. Stripe renders the payment fields via{" "}
            <code className="text-sm">PaymentElement</code>, but you build your
            own form, Pay button, and handle submission yourself using{" "}
            <code className="text-sm">useCheckout</code>. This is a fully
            custom integration with{" "}
            <code className="text-sm">ui_mode: &quot;custom&quot;</code>.
          </p>
          <p className={`mb-4 ${secondaryClass}`}>
            The integration has three parts:
          </p>
          <ol
            className={`list-inside list-decimal space-y-1 ${secondaryClass}`}
          >
            <li>
              <strong>Server — Create a Checkout Session</strong> (
              <code className="text-sm">ui_mode: &quot;custom&quot;</code>)
            </li>
            <li>
              <strong>Client — Mount PaymentElement</strong> with{" "}
              <code className="text-sm">CheckoutProvider</code>, your own form,
              and a custom Pay button
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
            <code className="text-sm">/api/create-checkout-session</code>{" "}
            creates a Stripe Checkout Session with{" "}
            <code className="text-sm">ui_mode: &quot;custom&quot;</code>. This returns a{" "}
            <code className="text-sm">client_secret</code> used by{" "}
            <code className="text-sm">CheckoutProvider</code> on the client.
          </p>
          <CodeBlock
            title="api/create-checkout-session/route.ts"
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
  const surface = body.surface || "payment element";
  const returnPathSegment = body.returnPath || "/payment-element";

  const returnUrl = \`\${baseUrl}\${returnPathSegment}/return?session_id={CHECKOUT_SESSION_ID}\`;

  const session = await stripe.checkout.sessions.create({
    ui_mode: "custom",              // ← enables custom checkout UI
    mode: "payment",
    return_url: returnUrl,
    payment_intent_data: {
      description: \`payment surfaces demo/\${brand}/\${surface}\`,
    },
    line_items: [
      {
        price_data: {
          currency: "usd",
          unit_amount: 499,           // $4.99
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
              <code className="text-sm">ui_mode: &quot;custom&quot;</code> tells Stripe
              you&apos;ll build your own checkout UI. The session returns a{" "}
              <code className="text-sm">client_secret</code> (not a hosted URL)
              that the front end passes to{" "}
              <code className="text-sm">CheckoutProvider</code>. The{" "}
              <code className="text-sm">return_url</code> includes the{" "}
              <code className="text-sm">{"{CHECKOUT_SESSION_ID}"}</code>{" "}
              template — Stripe replaces it with the actual session ID on
              redirect.
            </p>
          </div>
        </section>

        {/* ── Step 2: Client ─────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            2. Mount PaymentElement (Client)
          </h2>
          <p className={`mb-3 ${secondaryClass}`}>
            The client uses{" "}
            <code className="text-sm">CheckoutProvider</code>,{" "}
            <code className="text-sm">PaymentElement</code>, and{" "}
            <code className="text-sm">useCheckout</code> from{" "}
            <code className="text-sm">@stripe/react-stripe-js/checkout</code>.
            You build your own <code className="text-sm">&lt;form&gt;</code>{" "}
            and Pay button — Stripe only renders the payment fields.
          </p>

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            a. Load Stripe outside the component
          </h3>
          <CodeBlock
            title="PaymentElementCheckout.tsx — Stripe initialisation"
            code={`import { loadStripe } from "@stripe/stripe-js";
import {
  CheckoutProvider,
  PaymentElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout";

// Load once, outside the component to avoid re-creating on every render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);`}
          />
          <div className={`rounded-lg p-4 ${cardClass}`}>
            <p className={`text-sm ${secondaryClass}`}>
              <strong>Key point:</strong> No beta flag is needed — unlike
              Embedded Form 2, Payment Element is a stable feature. The imports
              come from{" "}
              <code className="text-sm">
                @stripe/react-stripe-js/checkout
              </code>{" "}
              (the Checkout-specific entry point), not the top-level package.
            </p>
          </div>

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            b. Fetch the client secret
          </h3>
          <CodeBlock
            title="PaymentElementCheckout.tsx — fetchClientSecret"
            code={`async function fetchClientSecret(brand: string): Promise<string> {
  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ brand, surface: "payment element" }),
  });

  const data = await res.json();
  return data.clientSecret;
}`}
          />

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            c. The PaymentForm with custom submit
          </h3>
          <p className={`mb-3 ${secondaryClass}`}>
            This is where Payment Element differs most from the other surfaces.
            You write your own{" "}
            <code className="text-sm">&lt;form&gt;</code> and Pay button. The{" "}
            <code className="text-sm">useCheckout</code> hook gives you a{" "}
            <code className="text-sm">checkout</code> object to call{" "}
            <code className="text-sm">confirm()</code> on submission.
          </p>
          <CodeBlock
            title="PaymentElementCheckout.tsx — PaymentForm"
            code={`function PaymentForm() {
  const { user } = useUser();
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
    ) return;
    emailSyncedRef.current = true;
    result.checkout.updateEmail(user.primaryEmailAddress.emailAddress);
  }, [result, user]);

  if (result.type === "loading") return <p>Loading checkout…</p>;
  if (result.type === "error") return <p>Error: {result.error.message}</p>;

  const { checkout } = result;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setConfirming(true);
    try {
      // return_url is already set server-side; don't pass returnUrl here
      const confirmResult = await checkout.confirm();
      if (confirmResult.type === "error") {
        setErrorMessage(confirmResult.error.message);
      }
    } finally {
      setConfirming(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
      <button
        type="submit"
        disabled={confirming}
        className="rounded px-4 py-2 font-medium ..."
      >
        {confirming ? "Processing…" : "Pay $4.99"}
      </button>
    </form>
  );
}`}
          />
          <div className={`rounded-lg p-4 ${cardClass}`}>
            <p className={`text-sm ${secondaryClass}`}>
              <strong>Key points:</strong>
            </p>
            <ul
              className={`mt-2 list-inside list-disc space-y-1 text-sm ${secondaryClass}`}
            >
              <li>
                <strong>You build the form and button</strong> —{" "}
                <code className="text-sm">PaymentElement</code> only renders the
                payment fields (card, wallets, etc.).
              </li>
              <li>
                <strong>
                  <code className="text-sm">checkout.confirm()</code>
                </strong>{" "}
                is called without arguments — the{" "}
                <code className="text-sm">return_url</code> was already set
                server-side. Passing <code className="text-sm">returnUrl</code>{" "}
                here would cause an error.
              </li>
              <li>
                <strong>Email sync</strong> — the Clerk user&apos;s email is pushed
                to the Stripe checkout via{" "}
                <code className="text-sm">checkout.updateEmail()</code> once
                after load.
              </li>
              <li>
                <strong>The button stays enabled</strong> until the user clicks
                it — Stripe returns validation errors if the form is incomplete,
                rather than silently blocking.
              </li>
            </ul>
          </div>

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            d. Wire it up with CheckoutProvider
          </h3>
          <CodeBlock
            title="PaymentElementCheckout.tsx — Provider wrapper"
            code={`export function PaymentElementCheckout() {
  const { brand } = useBrand();
  const [clientSecretPromise, setClientSecretPromise] =
    useState<Promise<string> | null>(null);

  // Fetch after client hydration to avoid SSR issues
  useEffect(() => {
    setClientSecretPromise(fetchClientSecret(brand));
  }, [brand]);

  return (
    <div className="min-h-[300px]">
      {clientSecretPromise ? (
        <CheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret: clientSecretPromise }}
        >
          <PaymentForm />
        </CheckoutProvider>
      ) : (
        <p>Loading checkout…</p>
      )}
    </div>
  );
}`}
          />
        </section>

        {/* ── Step 3: Return page ────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            3. Return Page — Retrieve Session Status
          </h2>
          <p className={`mb-3 ${secondaryClass}`}>
            After <code className="text-sm">checkout.confirm()</code> succeeds,
            Stripe redirects to the{" "}
            <code className="text-sm">return_url</code> with the session ID.
            The return page fetches the full session object from Stripe.
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
              <strong>Key point:</strong> This route is shared across all three
              payment surfaces. The{" "}
              <code className="text-sm">expand</code> parameter includes the
              full <code className="text-sm">line_items</code> and{" "}
              <code className="text-sm">payment_intent</code> objects for
              detailed display on the return page.
            </p>
          </div>

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            b. Client — fetch and display status
          </h3>
          <p className={`mb-3 ${secondaryClass}`}>
            The return page reads the{" "}
            <code className="text-sm">session_id</code> from the URL, calls the
            API, and renders a success or incomplete message alongside the full
            session object and a Stripe Dashboard link.
          </p>
          <CodeBlock
            title="payment-element/return/page.tsx — fetch session"
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

  // Render: dashboard link, success/incomplete message, JsonTree, flow diagram
}`}
          />
        </section>

        {/* ── Comparison ─────────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            Payment Element vs Other Surfaces
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr
                  className={`border-b border-gray-300 dark:border-gray-600 ${secondaryClass}`}
                >
                  <th className="py-2 pr-4 font-medium"></th>
                  <th className="py-2 pr-4 font-medium">Embedded Form</th>
                  <th className="py-2 pr-4 font-medium">Embedded Form 2</th>
                  <th className="py-2 font-medium">Payment Element</th>
                </tr>
              </thead>
              <tbody className={secondaryClass}>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">UI mode</td>
                  <td className="py-2 pr-4">
                    <code className="text-sm">embedded</code>
                  </td>
                  <td className="py-2 pr-4">
                    <code className="text-sm">custom</code>
                  </td>
                  <td className="py-2">
                    <code className="text-sm">custom</code>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">Provider</td>
                  <td className="py-2 pr-4">
                    <code className="text-sm">EmbeddedCheckoutProvider</code>
                  </td>
                  <td className="py-2 pr-4">
                    <code className="text-sm">CheckoutProvider</code>
                  </td>
                  <td className="py-2">
                    <code className="text-sm">CheckoutProvider</code>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">Component</td>
                  <td className="py-2 pr-4">
                    <code className="text-sm">EmbeddedCheckout</code>
                  </td>
                  <td className="py-2 pr-4">
                    <code className="text-sm">PaymentFormElement</code>
                  </td>
                  <td className="py-2">
                    <code className="text-sm">PaymentElement</code>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">Submit button</td>
                  <td className="py-2 pr-4">Stripe-rendered (iframe)</td>
                  <td className="py-2 pr-4">Stripe-rendered (component)</td>
                  <td className="py-2">
                    <strong>You build it</strong>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">Confirmation</td>
                  <td className="py-2 pr-4">Handled by Stripe iframe</td>
                  <td className="py-2 pr-4">
                    <code className="text-sm">
                      onConfirm → checkout.confirm(event)
                    </code>
                  </td>
                  <td className="py-2">
                    <code className="text-sm">checkout.confirm()</code>
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">Customisation</td>
                  <td className="py-2 pr-4">Minimal (Stripe controls UI)</td>
                  <td className="py-2 pr-4">
                    Moderate (Appearance API, layout around form)
                  </td>
                  <td className="py-2">
                    Full (own form, button, layout)
                  </td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">Appearance API</td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2 pr-4">Yes</td>
                  <td className="py-2">Yes</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Beta flag</td>
                  <td className="py-2 pr-4">Not required</td>
                  <td className="py-2 pr-4">
                    <code className="text-sm">
                      custom_checkout_payment_form_1
                    </code>
                  </td>
                  <td className="py-2">Not required</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ── File structure ─────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            File Structure
          </h2>
          <CodeBlock
            code={`src/app/
  api/
    create-checkout-session/
      route.ts          # POST: creates Checkout Session (ui_mode: "custom")
                        # Shared with Embedded Form 2; accepts returnPath
    checkout-session-status/
      route.ts          # GET: retrieves session by ID (shared across surfaces)
  payment-element/
    page.tsx            # Server component — renders PaymentElementCheckout
    PaymentElementCheckout.tsx  # Client component — CheckoutProvider + PaymentElement + useCheckout
    return/
      page.tsx          # Return page — fetches session, shows result`}
          />
        </section>

        {/* ── Links ──────────────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            Resources
          </h2>
          <ul
            className={`list-inside list-disc space-y-1 ${secondaryClass}`}
          >
            <li>
              <a
                href="https://docs.stripe.com/payments/payment-element"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Payment Element (Stripe docs)
              </a>
            </li>
            <li>
              <a
                href="https://docs.stripe.com/payments/advanced"
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Advanced Integration Guide
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
            <li>
              <Link
                href="/implementation-embedded-form"
                className={linkClass}
              >
                Embedded Form implementation guide
              </Link>
            </li>
            <li>
              <Link
                href="/implementation-embedded-form-2"
                className={linkClass}
              >
                Embedded Form 2 implementation guide
              </Link>
            </li>
          </ul>
        </section>

        <p className="mt-6 text-sm">
          <Link href="/payment-element" className={linkClass}>
            Try Payment Element &rarr;
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
