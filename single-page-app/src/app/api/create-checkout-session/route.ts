import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

/**
 * POST /api/create-checkout-session
 * Creates a Stripe Checkout Session (custom UI mode) for "Logo design+" $4.99.
 * Shared by payment-element and embedded-form-2; caller specifies returnPath.
 * Returns client_secret for mounting CheckoutProvider-based components.
 */
export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json(
      { error: "STRIPE_SECRET_KEY not configured" },
      { status: 500 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as {
    brand?: string;
    surface?: string;
    returnPath?: string;
  };
  const brand = body.brand || "generic";
  const surface = body.surface || "payment element";
  const description = `payment surfaces demo/${brand}/${surface}`;
  const returnPathSegment = body.returnPath || "/payment-element";

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    origin ||
    (host ? `${proto}://${host}` : "") ||
    (typeof request.url === "string" ? new URL(request.url).origin : "");
  if (!baseUrl) {
    return NextResponse.json(
      { error: "Could not determine return URL origin" },
      { status: 500 }
    );
  }

  const returnUrl = `${baseUrl}${returnPathSegment}/return?session_id={CHECKOUT_SESSION_ID}`;

  const stripe = new Stripe(secretKey);

  try {
    const session = await stripe.checkout.sessions.create({
      ui_mode: "custom",
      mode: "payment",
      return_url: returnUrl,
      payment_intent_data: {
        description,
      },
      line_items: [
        {
          price_data: {
            currency: "aud",
            unit_amount: 499,
            product_data: {
              name: "Logo design+",
            },
          },
          quantity: 1,
        },
      ],
    });

    return NextResponse.json({
      clientSecret: session.client_secret,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Checkout session creation failed", details: message },
      { status: 500 }
    );
  }
}
