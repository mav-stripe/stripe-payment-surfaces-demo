import { EmbeddedFormCheckout } from "./EmbeddedFormCheckout";

/**
 * Embedded Form page: Stripe Embedded Checkout for "Logo design+" ($4.99).
 * Protected by Clerk; checkout UI is in EmbeddedFormCheckout client component.
 */
export default function EmbeddedFormPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main>
        <EmbeddedFormCheckout />
      </main>
    </div>
  );
}
