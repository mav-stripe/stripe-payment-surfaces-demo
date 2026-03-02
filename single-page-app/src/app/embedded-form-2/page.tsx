import { EmbeddedForm2Checkout } from "./EmbeddedForm2Checkout";

/**
 * Embedded Form 2 page: Stripe PaymentFormElement (habanero) for "Logo design+" ($4.99).
 * Protected by Clerk; checkout UI is in EmbeddedForm2Checkout client component.
 */
export default function EmbeddedForm2Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main>
        <EmbeddedForm2Checkout />
      </main>
    </div>
  );
}
