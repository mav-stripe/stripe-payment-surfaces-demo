import { PaymentElementCheckout } from "./PaymentElementCheckout";

/**
 * Payment Element page: Stripe Embedded Checkout for "Logo design+" ($4.99).
 * Protected by Clerk; checkout UI is in PaymentElementCheckout client component.
 */
export default function PaymentElementPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main>
        <PaymentElementCheckout />
      </main>
    </div>
  );
}
