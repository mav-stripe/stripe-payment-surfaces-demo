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

export default function ImplementationEmbeddedForm2Page() {
  const { brand } = useBrand();
  const titleClass = getBrandTextClasses(brand);
  const secondaryClass = getBrandSecondaryTextClasses(brand);
  const linkClass = getBrandAccentClasses(brand);
  const cardClass = getBrandCardClasses(brand);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className={`mb-2 text-3xl font-bold ${titleClass}`}>
          Embedded Form 2 — Implementation Guide
        </h1>
        <p className={`mb-8 ${secondaryClass}`}>
          A walkthrough of the key code that powers the{" "}
          <Link href="/embedded-form-2" className={linkClass}>
            /embedded-form-2
          </Link>{" "}
          route, using Stripe&apos;s <code className="text-sm">PaymentFormElement</code>{" "}
          with the Checkout Sessions API
          (<code className="text-sm">ui_mode: &quot;custom&quot;</code>).
        </p>

        {/* ── Overview ────────────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            Overview
          </h2>
          <p className={`mb-4 ${secondaryClass}`}>
            Embedded Form 2 uses Stripe&apos;s <strong>PaymentFormElement</strong> — an
            embeddable payment form that renders the complete checkout UI
            (payment fields, express wallets, address collection, and a submit
            button) inside a single component. Unlike Embedded Checkout, it uses{" "}
            <code className="text-sm">ui_mode: &quot;custom&quot;</code> and gives you
            control over the confirmation flow.
          </p>
          <p className={`mb-4 ${secondaryClass}`}>
            The integration has three parts:
          </p>
          <ol className={`list-inside list-decimal space-y-1 ${secondaryClass}`}>
            <li>
              <strong>Server — Create a Checkout Session</strong> (shared API route,{" "}
              <code className="text-sm">ui_mode: &quot;custom&quot;</code>)
            </li>
            <li>
              <strong>Client — Mount PaymentFormElement</strong> with{" "}
              <code className="text-sm">CheckoutProvider</code> and a beta flag
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
            Embedded Form 2 shares the same API route as Payment Element at{" "}
            <code className="text-sm">/api/create-checkout-session</code>. The
            key difference is the client passes{" "}
            <code className="text-sm">returnPath: &quot;/embedded-form-2&quot;</code> so
            the server builds the correct return URL.
          </p>
          <CodeBlock
            title="api/create-checkout-session/route.ts"
            code={`import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const body = await request.json().catch(() => ({}));
  const brand = body.brand || "generic";
  const surface = body.surface || "payment element";
  const returnPathSegment = body.returnPath || "/payment-element";

  const returnUrl = \`\${baseUrl}\${returnPathSegment}/return?session_id={CHECKOUT_SESSION_ID}\`;

  const session = await stripe.checkout.sessions.create({
    ui_mode: "custom",              // ← same as Payment Element
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
              <strong>Key point:</strong> This is the same API route used by
              Payment Element. The <code className="text-sm">ui_mode</code> is{" "}
              <code className="text-sm">&quot;custom&quot;</code> (not{" "}
              <code className="text-sm">&quot;embedded&quot;</code>), which returns a{" "}
              <code className="text-sm">client_secret</code> for use with{" "}
              <code className="text-sm">CheckoutProvider</code>. The{" "}
              <code className="text-sm">returnPath</code> parameter makes the
              route reusable across different surfaces.
            </p>
          </div>
        </section>

        {/* ── Step 2: Client ─────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            2. Mount PaymentFormElement (Client)
          </h2>
          <p className={`mb-3 ${secondaryClass}`}>
            The client uses{" "}
            <code className="text-sm">CheckoutProvider</code> +{" "}
            <code className="text-sm">PaymentFormElement</code> from{" "}
            <code className="text-sm">@stripe/react-stripe-js/checkout</code>.
            Unlike Embedded Checkout, this approach requires a beta flag and
            gives you an <code className="text-sm">onConfirm</code> callback for
            handling submission.
          </p>

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            a. Load Stripe with the beta flag
          </h3>
          <p className={`mb-3 ${secondaryClass}`}>
            The beta flag{" "}
            <code className="text-sm">custom_checkout_payment_form_1</code>{" "}
            enables the PaymentFormElement feature.
          </p>
          <CodeBlock
            title="EmbeddedForm2Checkout.tsx — Stripe initialisation"
            code={`import { loadStripe } from "@stripe/stripe-js";
import {
  CheckoutProvider,
  PaymentFormElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout";
import type { StripePaymentFormElementConfirmEvent } from "@stripe/stripe-js";

// Beta flag enables PaymentFormElement
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  { betas: ["custom_checkout_payment_form_1"] }
);`}
          />

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            b. Fetch the client secret
          </h3>
          <p className={`mb-3 ${secondaryClass}`}>
            The fetch function calls the shared{" "}
            <code className="text-sm">/api/create-checkout-session</code> route,
            passing <code className="text-sm">returnPath</code> and{" "}
            <code className="text-sm">surface</code> to identify this surface.
          </p>
          <CodeBlock
            title="EmbeddedForm2Checkout.tsx — fetchClientSecret"
            code={`async function fetchClientSecret(brand: string): Promise<string> {
  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      brand,
      surface: "embedded form 2",
      returnPath: "/embedded-form-2",   // ← route-specific return path
    }),
  });

  const data = await res.json();
  return data.clientSecret;
}`}
          />

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            c. The checkout form with onConfirm
          </h3>
          <p className={`mb-3 ${secondaryClass}`}>
            Unlike Payment Element (where you build your own Pay button),{" "}
            <code className="text-sm">PaymentFormElement</code> renders the
            submit button itself. When the buyer clicks it, the{" "}
            <code className="text-sm">onConfirm</code> callback fires. You then
            call <code className="text-sm">checkout.confirm()</code> with the
            event to complete the payment.
          </p>
          <CodeBlock
            title="EmbeddedForm2Checkout.tsx — CheckoutForm"
            code={`function CheckoutForm() {
  const { user } = useUser();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const emailSyncedRef = useRef(false);

  const result = useCheckout();

  // Sync Clerk user email into the Stripe checkout
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

  const handleConfirm = async (
    event: StripePaymentFormElementConfirmEvent
  ) => {
    setErrorMessage(null);
    const confirmResult = await checkout.confirm({
      paymentFormConfirmEvent: event,   // ← pass the event to confirm
    });
    if (confirmResult.type === "error") {
      setErrorMessage(confirmResult.error.message);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6">
      <PaymentFormElement onConfirm={handleConfirm} />
    </div>
  );
}`}
          />
          <div className={`rounded-lg p-4 ${cardClass}`}>
            <p className={`text-sm ${secondaryClass}`}>
              <strong>Key point:</strong> The{" "}
              <code className="text-sm">PaymentFormElement</code> manages the
              entire form UI including the submit button. You don&apos;t write a Pay
              button — instead you handle the{" "}
              <code className="text-sm">onConfirm</code> callback and pass the
              event to{" "}
              <code className="text-sm">checkout.confirm({`{paymentFormConfirmEvent}`})</code>.
              The white background wrapper ensures the Stripe form (which uses
              light theme) is readable on dark page backgrounds.
            </p>
          </div>

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            d. Wire it up with CheckoutProvider
          </h3>
          <p className={`mb-3 ${secondaryClass}`}>
            The outer component fetches the client secret after hydration and
            passes it to <code className="text-sm">CheckoutProvider</code>.
          </p>
          <CodeBlock
            title="EmbeddedForm2Checkout.tsx — Provider wrapper"
            code={`export function EmbeddedForm2Checkout() {
  const { brand } = useBrand();
  const [clientSecretPromise, setClientSecretPromise] =
    useState<Promise<string> | null>(null);

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
          <CheckoutForm />
        </CheckoutProvider>
      ) : (
        <p>Loading checkout…</p>
      )}
    </div>
  );
}`}
          />
          <div className={`rounded-lg p-4 ${cardClass}`}>
            <p className={`text-sm ${secondaryClass}`}>
              <strong>Key point:</strong>{" "}
              <code className="text-sm">CheckoutProvider</code> accepts a{" "}
              <code className="text-sm">clientSecret</code> option (a Promise
              that resolves to the secret string). This is different from
              Embedded Checkout&apos;s{" "}
              <code className="text-sm">EmbeddedCheckoutProvider</code>, which
              takes a <code className="text-sm">fetchClientSecret</code>{" "}
              function instead.
            </p>
          </div>
        </section>

        {/* ── Step 3: Return page ────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            3. Return Page — Retrieve Session Status
          </h2>
          <p className={`mb-3 ${secondaryClass}`}>
            After the buyer completes payment, Stripe redirects to the{" "}
            <code className="text-sm">return_url</code> with the session ID.
            The return page uses the same shared API route as the other surfaces.
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
              <code className="text-sm">payment_intent</code> objects (not just
              IDs) for detailed display on the return page.
            </p>
          </div>

          <h3 className={`mb-2 mt-6 text-lg font-medium ${titleClass}`}>
            b. Client — fetch and display status
          </h3>
          <p className={`mb-3 ${secondaryClass}`}>
            The return page reads{" "}
            <code className="text-sm">session_id</code> from the URL, calls
            the API, and renders a success or incomplete message alongside the
            full session object.
          </p>
          <CodeBlock
            title="embedded-form-2/return/page.tsx — fetch session"
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

  // Render success/incomplete message, JsonTree, dashboard link, etc.
}`}
          />
        </section>

        {/* ── Comparison ─────────────────────────────── */}
        <section className="mb-10">
          <h2 className={`mb-3 text-xl font-semibold ${titleClass}`}>
            Embedded Form 2 vs Embedded Form
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className={`border-b border-gray-300 dark:border-gray-600 ${secondaryClass}`}>
                  <th className="py-2 pr-4 font-medium"></th>
                  <th className="py-2 pr-4 font-medium">Embedded Form</th>
                  <th className="py-2 font-medium">Embedded Form 2</th>
                </tr>
              </thead>
              <tbody className={secondaryClass}>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">UI mode</td>
                  <td className="py-2 pr-4"><code className="text-sm">embedded</code></td>
                  <td className="py-2"><code className="text-sm">custom</code></td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">Provider</td>
                  <td className="py-2 pr-4"><code className="text-sm">EmbeddedCheckoutProvider</code></td>
                  <td className="py-2"><code className="text-sm">CheckoutProvider</code></td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">Component</td>
                  <td className="py-2 pr-4"><code className="text-sm">EmbeddedCheckout</code></td>
                  <td className="py-2"><code className="text-sm">PaymentFormElement</code></td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">Submit button</td>
                  <td className="py-2 pr-4">Stripe-rendered (inside iframe)</td>
                  <td className="py-2">Stripe-rendered (via component)</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">Confirmation</td>
                  <td className="py-2 pr-4">Handled by Stripe iframe</td>
                  <td className="py-2"><code className="text-sm">onConfirm</code> callback</td>
                </tr>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-2 pr-4 font-medium">Appearance API</td>
                  <td className="py-2 pr-4">No</td>
                  <td className="py-2">Yes</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium">Beta flag</td>
                  <td className="py-2 pr-4">Not required</td>
                  <td className="py-2"><code className="text-sm">custom_checkout_payment_form_1</code></td>
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
                        # Shared with Payment Element; accepts returnPath
    checkout-session-status/
      route.ts          # GET: retrieves session by ID (shared across surfaces)
  embedded-form-2/
    page.tsx            # Server component — renders EmbeddedForm2Checkout
    EmbeddedForm2Checkout.tsx  # Client component — CheckoutProvider + PaymentFormElement
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
                Embedded Form implementation guide (for comparison)
              </Link>
            </li>
          </ul>
        </section>

        <p className="mt-6 text-sm">
          <Link href="/embedded-form-2" className={linkClass}>
            Try Embedded Form 2 &rarr;
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
