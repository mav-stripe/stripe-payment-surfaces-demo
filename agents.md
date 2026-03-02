# AGENTS.md
## description
A nextjs single page app that demonstrates how Stripe payment surfaces work (payment element, embedded form, embedded form 2).

When creating or updating a new page update agents.md where appropriate.

Ask if anything is not clear.


## configuration
API keys should be in /.env.local file. Any other value that should be configurable should be stored there. When a new value is introduced, add the variable to the env file with an appropriate placeholder value.


### Environment Variables

**Stripe Configuration:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key for client-side
- `STRIPE_SECRET_KEY` - Stripe secret key for server-side API calls
- `NEXT_PUBLIC_STRIPE_ACCOUNT` - Stripe account ID for dashboard links (e.g., acct_xxx)
- `NEXT_PUBLIC_APP_URL` - Optional base URL for Stripe return redirect (e.g. http://localhost:3000). Used when creating Checkout Sessions; falls back to request origin if unset.

**Clerk Configuration:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk publishable key for client-side
- `CLERK_SECRET_KEY` - Clerk secret key for server-side API calls 

## Authentication 
The single page app uses Clerk for authentication. All routes except the homepage public section are protected by Clerk middleware. The middleware is configured in `middleware.ts` at the root of the project.

## UI
The app utilises tailwind css for all components and styling

### Dark Mode
- **Class-based dark mode** enabled in Tailwind config
- **Theme toggle** button in navigation bar (sun/moon icon)
- **localStorage persistence** - user preference is saved and restored
- **System preference detection** - defaults to OS preference if no saved preference
- All components support both light and dark themes with appropriate color schemes 

### Brand Theming
- **Multi-brand support** - App supports multiple brand themes (generic, hipages, Mav's Digital Workshop)
- **Brand selection** - Gear icon dropdown in navigation bar to switch between brands
- **localStorage persistence** - Selected brand is saved and restored across sessions
- **Brand-specific navigation** - Each brand has its own navigation style:
  - **Generic brand**: Single top navigation bar, blue color scheme, dark/light theme toggle
  - **Hipages brand**: Dual navigation (utility bar + main nav), orange color scheme (#FF6700), light mode only
  - **Mav's Digital Workshop brand**: Single top navigation bar, dark header (#1C1C1E), white text, text wordmark, nav items with dropdown chevrons (Products, Services, Portfolio, About), dark mode only
- **Brand-aware styling** - All UI components adapt to active brand theme using utility functions
- **Theme integration** - Brand selection affects dark/light mode behavior (hipages forces light mode; Mav's Digital Workshop forces dark mode)

**Brand Context** (`app/contexts/BrandContext.tsx`):
- Manages brand state ('generic' | 'hipages' | 'mavworkshop')
- Provides `useBrand()` hook for components
- Persists to localStorage under 'brand-theme' key

**Brand Utilities** (`app/utils/brandStyles.ts`):
- `getBrandButtonClasses(brand)` - Button styling
- `getBrandAccentClasses(brand)` - Link and accent colors
- `getBrandGradientClasses(brand)` - Gradient backgrounds
- `getBrandIconClasses(brand)` - Icon colors
- `getBrandCardClasses(brand)` - Card backgrounds
- `getBrandTextClasses(brand)` - Text colors
- `getBrandSecondaryTextClasses(brand)` - Secondary text colors

**Brand Colors** (Tailwind config):
- Generic: Blue (#2563EB / blue-600) with dark mode support
- Hipages: Orange (#FF6700 / hipages-orange), hover (#E55D00 / hipages-orange-dark), light (#FF8533 / hipages-orange-light)
- Mav's Digital Workshop: Header background (#1C1C1E / mavworkshop-bg), accent gradient indigo (#4f46e5 / mavworkshop-indigo) to warm (#c2410c / mavworkshop-warm), dark mode only


## project structure
```
single-page-app/
  .env.example          # Template for env vars (copy to .env.local)
  .env.local            # Local env (gitignored)
  middleware.ts         # Clerk auth (lives at src/middleware.ts)
  src/
    app/
      api/
        create-checkout-session/  # POST: create Checkout Session (custom UI) for payment-element & embedded-form-2
        create-embedded-checkout-session/  # POST: create Checkout Session (embedded UI) for embedded-form
        checkout-session-status/  # GET: retrieve session status for return pages
      components/      # Navbar, GenericNav, HipagesNav, MavWorkshopNav, ThemeToggle, BrandSwitcher, etc.
      contexts/        # BrandContext, ThemeContext
      utils/           # brandStyles.ts
      layout.tsx
      page.tsx         # Homepage
      payment-element/
        page.tsx        # Payment Element page (custom Checkout UI)
        PaymentElementCheckout.tsx  # Client component: CheckoutProvider + PaymentElement + useCheckout
        return/
          page.tsx      # Return page after checkout (success / try again)
      embedded-form/
        page.tsx        # Embedded Form page (Stripe-hosted embedded checkout)
        EmbeddedFormCheckout.tsx  # Client component: EmbeddedCheckoutProvider + EmbeddedCheckout
        EmbeddedFormFlowDiagram.tsx  # SVG sequence diagram for embedded form flow
        return/
          page.tsx      # Return page after checkout (success / try again)
      embedded-form-2/
        page.tsx        # Embedded Form 2 page (PaymentFormElement / habanero)
        EmbeddedForm2Checkout.tsx  # Client component: CheckoutProvider + PaymentFormElement + onConfirm
        EmbeddedForm2FlowDiagram.tsx  # SVG sequence diagram for embedded form 2 flow
        return/
          page.tsx      # Return page after checkout (success / try again)
      implementation-embedded-form/
        page.tsx        # Implementation guide for Embedded Form (code walkthrough)
      implementation-embedded-form-2/
        page.tsx        # Implementation guide for Embedded Form 2 (code walkthrough)
      implementation-payment-element/
        page.tsx        # Implementation guide for Payment Element (code walkthrough)
      why-upgrade-from-card-element-to-ocs/
        page.tsx        # Why upgrade from Card Element to OCS guide
```


## setup commands
```bash
cd single-page-app
npm install
```

Before running, ensure environment variables are configured in `.env.local` (copy from `.env.example`).


## run the app
```bash
cd single-page-app
npm run dev
```

The app will be available at `http://localhost:3000`


## Code style
- TypeScript strict mode
- Use functional patterns where possible
- Document code

## State Management
The app uses **React Context API + localStorage** for persistent state management across pages.

### Contexts

**BrandContext** (`app/contexts/BrandContext.tsx`)
- Manages brand theme state ('generic' | 'hipages' | 'mavworkshop')
- Persists brand selection to localStorage under 'brand-theme' key
- Provides `useBrand()` hook for easy access
- Functions: `setBrand(brand)`, exposes `brand`
- Default brand: 'generic'

**ThemeContext** (`app/contexts/ThemeContext.tsx`)
- Manages theme state (light/dark/system)
- Persists theme preference to localStorage
- Detects system color scheme preference
- Brand-aware: Forces light mode when hipages brand is active; forces dark mode when Mav's Digital Workshop brand is active
- Provides `useTheme()` hook for easy access
- Functions: `setTheme()`, exposes `theme` and `resolvedTheme`

**Authentication State**
- Managed by Clerk's built-in context
- Access via `useUser()` hook from `@clerk/nextjs`
- Provides user data, sign-in status, and auth methods


# routes
All routes should implement clerk authentication and only logged in users should have access.

## /
The homepage of the PoC. Displays a brief description of the app and Stripe payment surfaces to all visitors. 

**Public Section (all users):**
- Welcome message and app description
- Overview of technologies used
- Information about Stripe payment surfaces

**Protected Section (authenticated users only):**
- Personalized welcome message
- Card grid with links to available features

**Features:**
- Server-side rendered with Next.js App Router
- Uses `currentUser()` from Clerk to check authentication
- Responsive grid layout with hover effects
- Dark mode support

## /payment-element
Implements Stripe **Payment Element** with the Checkout Sessions API (`ui_mode: 'custom'`). The user purchases **Logo design+** for **$4.99**.

**Flow:**
- Page loads Stripe Checkout via `CheckoutProvider`, `PaymentElement`, and `useCheckout` from `@stripe/react-stripe-js/checkout`.
- Client calls `POST /api/create-checkout-session` to create a Checkout Session (custom UI mode); server returns `clientSecret`.
- User fills the Payment Element and clicks Pay; client calls `checkout.confirm({ returnUrl })` from `useCheckout()`.
- Stripe redirects to `/payment-element/return?session_id={CHECKOUT_SESSION_ID}`.
- Return page calls `GET /api/checkout-session-status?session_id=...` and shows success or "try again" with links back to payment-element or home.

**API routes:**
- `POST /api/create-checkout-session` — Creates Checkout Session with `ui_mode: 'custom'` (auth required). Returns `{ clientSecret }`.
- `GET /api/checkout-session-status?session_id=cs_xxx` — Returns `{ status, customer_email }` for the return page.

**Stripe documentation:**
- Stripe Payment element: https://docs.stripe.com/payments/payment-element
- Stripe checkout sessions API: https://docs.stripe.com/api/checkout/sessions

## /embedded-form
Implements Stripe **Embedded Checkout** (`ui_mode: 'embedded'`). Stripe controls the entire checkout UI. The user purchases **Logo design+** for **$4.99**.

**Flow:**
- Page loads Stripe Embedded Checkout via `EmbeddedCheckoutProvider` and `EmbeddedCheckout` from `@stripe/react-stripe-js`.
- Client calls `POST /api/create-embedded-checkout-session` to create a Checkout Session (embedded UI mode); server returns `clientSecret`.
- Stripe renders the full checkout form (payment fields, submit button, etc.).
- On completion, Stripe redirects to `/embedded-form/return?session_id={CHECKOUT_SESSION_ID}`.
- Return page calls `GET /api/checkout-session-status?session_id=...` and shows success or "try again" with links back to embedded-form or home.

**API routes:**
- `POST /api/create-embedded-checkout-session` — Creates Checkout Session with `ui_mode: 'embedded'` (auth required). Returns `{ clientSecret }`.
- `GET /api/checkout-session-status?session_id=cs_xxx` — Shared with payment-element. Returns full session object.

**Stripe documentation:**
- Stripe Embedded Checkout: https://docs.stripe.com/checkout/embedded/quickstart


## /embedded-form-2
Implements Stripe **PaymentFormElement** (internal codename habanero — not displayed to users) with the Checkout Sessions API (`ui_mode: 'custom'`). The user purchases **Logo design+** for **$4.99**.

**Flow:**
- Page loads Stripe via `CheckoutProvider` and `PaymentFormElement` from `@stripe/react-stripe-js/checkout`, with beta flag `custom_checkout_payment_form_1`.
- Client calls `POST /api/create-checkout-session` (shared with payment-element, passing `returnPath: "/embedded-form-2"`) to create a Checkout Session (custom UI mode); server returns `clientSecret`.
- Stripe renders the full payment form including its own submit button via `PaymentFormElement`.
- When the buyer authorizes payment, `onConfirm` fires and calls `checkout.confirm({ paymentFormConfirmEvent: event })`.
- Stripe redirects to `/embedded-form-2/return?session_id={CHECKOUT_SESSION_ID}`.
- Return page calls `GET /api/checkout-session-status?session_id=...` and shows success or "try again" with links back to embedded-form-2 or home.

**API routes:**
- `POST /api/create-checkout-session` — Shared with payment-element. Creates Checkout Session with `ui_mode: 'custom'` (auth required). Accepts `returnPath` to set route-specific return URL. Returns `{ clientSecret }`.
- `GET /api/checkout-session-status?session_id=cs_xxx` — Shared across all surfaces. Returns full session object.

## /implementation-embedded-form
A guide page that walks through the key code snippets powering the `/embedded-form` route. Covers:
- Server-side Checkout Session creation (`ui_mode: "embedded"`)
- Client-side `EmbeddedCheckoutProvider` + `EmbeddedCheckout` setup
- Return page session retrieval and status display
- File structure overview and links to Stripe documentation

Linked from the Embedded Form card on the homepage.

## /implementation-embedded-form-2
A guide page that walks through the key code snippets powering the `/embedded-form-2` route. Covers:
- Server-side Checkout Session creation (`ui_mode: "custom"`, shared API route)
- Client-side `CheckoutProvider` + `PaymentFormElement` + `useCheckout` setup with beta flag
- The `onConfirm` callback and `checkout.confirm({ paymentFormConfirmEvent })` flow
- Comparison table of Embedded Form vs Embedded Form 2
- Return page session retrieval and status display
- File structure overview and links to Stripe documentation

Linked from the Embedded Form 2 card on the homepage.

## /implementation-payment-element
A guide page that walks through the key code snippets powering the `/payment-element` route. Covers:
- Server-side Checkout Session creation (`ui_mode: "custom"`)
- Client-side `CheckoutProvider` + `PaymentElement` + `useCheckout` setup
- Custom form and Pay button with `checkout.confirm()` flow
- Email sync from Clerk authentication
- Comparison table of all three payment surfaces
- Return page session retrieval and status display
- File structure overview and links to Stripe documentation

Linked from the Payment Element card on the homepage.

## /why-upgrade-from-card-element-to-ocs
A guide page explaining 10 reasons to migrate from the legacy Card Element (L2) to the Optimised Checkout Suite. Covers:
- Higher conversion rates, PayPal consolidation, dynamic payment methods
- Adaptive pricing, simplified subscriptions, lower maintenance effort
- Better fraud protection, embedded checkout options, integration path options
- Stripe investment and roadmap
- Addressing potential concerns (migration effort, A/B testing, branding, subscriptions, saved cards)
- Key Stripe documentation resources

Linked from a dedicated card on the homepage (authenticated users only).

# Other 

## do not use in code anywhere anything that resembles PII data like a valid email address 