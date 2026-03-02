"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useBrand } from "@/app/contexts/BrandContext";
import { getBrandCardClasses, getBrandTextClasses, getBrandAccentClasses } from "@/app/utils/brandStyles";
import { EmbeddedFormFlowDiagram } from "@/app/embedded-form/EmbeddedFormFlowDiagram";
import { EmbeddedForm2FlowDiagram } from "@/app/embedded-form-2/EmbeddedForm2FlowDiagram";
import { PaymentElementFlowDiagram } from "@/app/payment-element/PaymentElementFlowDiagram";

type DocLink = { label: string; url: string; internal?: boolean };

type Feature = {
  href: string;
  title: string;
  description: string;
  docLinks?: DocLink[];
  diagram?: ReactNode;
  diagramLabel?: string;
  pills?: string[];
};

const FEATURES: Feature[] = [
  {
    href: "/embedded-form",
    title: "Embedded Form",
    description:
      "A low-code, prebuilt payment page embedded directly into your website. Customers pay through the embedded form without leaving your site.",
    docLinks: [
      { label: "Implementation guide", url: "/implementation-embedded-form", internal: true },
      { label: "Stripe hosted UIs", url: "https://docs.stripe.com/payments/checkout" },
      { label: "Embedded form quickstart", url: "https://docs.stripe.com/checkout/embedded/quickstart" },
    ],
    diagram: <EmbeddedFormFlowDiagram />,
    diagramLabel: "Embedded Form Flow",
    pills: ["Checkout Sessions API"],
  },
  {
    href: "/embedded-form-2",
    title: "Embedded Form 2",
    description:
      "End-to-end checkout in a single iframe with 100+ payment methods, express wallets, and built-in address collection. Supports saved payment methods, adaptive pricing, tax, appearance customisation, and localization.",
    docLinks: [
      { label: "Implementation guide", url: "/implementation-embedded-form-2", internal: true },
    ],
    diagram: <EmbeddedForm2FlowDiagram />,
    diagramLabel: "Embedded Form 2 Flow",
    pills: ["Checkout Sessions API", "Appearance API"],
  },
  {
    href: "/payment-element",
    title: "Payment Element",
    description:
      "A UI component that accepts 100+ payment methods with built-in input validation and error handling. Uses the Checkout Sessions API to create a fully customised payments integration.",
    docLinks: [
      { label: "Implementation guide", url: "/implementation-payment-element", internal: true },
      { label: "Payment Element", url: "https://docs.stripe.com/payments/payment-element" },
      { label: "Advanced integration", url: "https://docs.stripe.com/payments/advanced" },
    ],
    diagram: <PaymentElementFlowDiagram />,
    diagramLabel: "Payment Element Flow",
    pills: ["Checkout Sessions API", "Payment Intent API", "Appearance API"],
  },
];

function FlowDiagramModal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-gray-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-800 hover:text-white"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

type Props = {
  firstName?: string | null;
  username?: string | null;
};

/**
 * Renders personalized welcome and feature card grid for authenticated users.
 */
export function HomePageClient({ firstName, username }: Props) {
  const { brand } = useBrand();
  const titleClass = getBrandTextClasses(brand);
  const cardClass = getBrandCardClasses(brand);
  const linkClass = getBrandAccentClasses(brand);
  const [openDiagram, setOpenDiagram] = useState<number | null>(null);

  const greeting = firstName ?? username ?? "there";

  return (
    <section className="border-t border-gray-200 pt-10 dark:border-gray-700">
      <h2 className={`mb-6 text-2xl font-semibold ${titleClass}`}>
        Hello, {greeting}
      </h2>
      <p className="mb-8 text-gray-600 dark:text-gray-400">
        Choose a payment surface to try:
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ href, title, description, docLinks, diagram, diagramLabel, pills }, idx) =>
          docLinks ? (
            <div
              key={href}
              className={`flex flex-col rounded-lg p-6 transition-colors ${cardClass}`}
            >
              <Link href={href}>
                <h3 className={`mb-2 font-semibold ${titleClass}`}>{title}</h3>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
              {pills && pills.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {pills.map((pill) => (
                    <span
                      key={pill}
                      className="rounded-full bg-gray-200 px-3 py-0.5 text-xs font-medium text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-auto pt-8 flex flex-col gap-1 text-sm">
                <Link href={href} className={linkClass}>
                  Try it &rarr;
                </Link>
                {diagram && (
                  <button
                    onClick={() => setOpenDiagram(idx)}
                    className={`inline-flex items-center gap-1 text-left ${linkClass}`}
                  >
                    View flow diagram
                  </button>
                )}
                {docLinks.filter((d) => d.internal).map((doc) => (
                  <Link
                    key={doc.url}
                    href={doc.url}
                    className={`inline-flex items-center gap-1 ${linkClass}`}
                  >
                    {doc.label}
                  </Link>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-1 text-sm min-h-[2.75rem]">
                {docLinks.filter((d) => !d.internal).map((doc) => (
                  <a
                    key={doc.url}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 ${linkClass}`}
                  >
                    {doc.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="h-3.5 w-3.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.25 5.5a.75.75 0 0 0-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 0 0 .75-.75v-4a.75.75 0 0 1 1.5 0v4A2.25 2.25 0 0 1 12.75 17h-8.5A2.25 2.25 0 0 1 2 14.75v-8.5A2.25 2.25 0 0 1 4.25 4h5a.75.75 0 0 1 0 1.5h-5Zm7.25-.75a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V6.56l-5.22 5.22a.75.75 0 1 1-1.06-1.06l5.22-5.22H12.25a.75.75 0 0 1-.75-.75Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <Link
              key={href}
              href={href}
              className={`rounded-lg p-6 transition-colors ${cardClass}`}
            >
              <h3 className={`mb-2 font-semibold ${titleClass}`}>{title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {description}
              </p>
            </Link>
          )
        )}
      </div>

      {openDiagram !== null && FEATURES[openDiagram].diagram && (
        <FlowDiagramModal
          title={FEATURES[openDiagram].diagramLabel ?? FEATURES[openDiagram].title}
          onClose={() => setOpenDiagram(null)}
        >
          {FEATURES[openDiagram].diagram}
        </FlowDiagramModal>
      )}
    </section>
  );
}
