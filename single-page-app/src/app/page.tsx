import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { HomePageClient } from "@/app/components/HomePageClient";

/**
 * Homepage: title, dashboard card, feature cards (auth), then explanatory text.
 */
export default async function HomePage() {
  const user = await currentUser();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="mx-auto max-w-4xl px-4 py-8">
        {user && (
          <HomePageClient
            firstName={user.firstName ?? undefined}
            username={user.username ?? undefined}
          />
        )}

        {user && (
          <section className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href={`https://dashboard.stripe.com/${process.env.NEXT_PUBLIC_STRIPE_ACCOUNT}/test/payments`}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400"
            >
              <span className="inline-flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                View transactions in Stripe dashboard
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
              </span>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Open the Stripe test dashboard to view all payment transactions.
              </p>
            </a>
            <Link
              href="/why-upgrade-from-card-element-to-ocs"
              className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-colors hover:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-blue-400"
            >
              <span className="font-semibold text-gray-900 dark:text-white">
                Why upgrade from Card Element to OCS?
              </span>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                10 reasons to migrate from the legacy Card Element to the
                Optimised Checkout Suite.
              </p>
            </Link>
          </section>
        )}

        <section className="mt-10 border-t border-gray-200 pt-10 dark:border-gray-700">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Stripe Payment Surfaces Demo
          </h1>
          <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
            This app demonstrates how Stripe payment surfaces work: Payment
            Element, Embedded Form, and Embedded Form 2.
          </p>
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Technologies
          </h2>
          <ul className="list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
            <li>Next.js (App Router)</li>
            <li>Stripe payment surfaces</li>
            <li>Clerk (authentication)</li>
          </ul>
          <h2 className="mb-2 mt-6 text-xl font-semibold text-gray-900 dark:text-white">
            Stripe payment surfaces
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Payment Element is Stripe&apos;s pre-built UI for collecting payment
            details. The Embedded Form lets you host Stripe&apos;s full checkout
            experience. Embedded Form 2 uses Stripe&apos;s embeddable payment form
            with a built-in submit button. Sign in to access the feature demos
            above.
          </p>
        </section>
      </main>
    </div>
  );
}
