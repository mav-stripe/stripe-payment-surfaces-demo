"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { BrandSwitcher } from "@/app/components/BrandSwitcher";

const NAV_ITEMS = [
  "Products",
  "Services",
  "Portfolio",
  "About",
] as const;

/**
 * Single top nav for Mav's Digital Workshop brand: dark header, white text, text wordmark,
 * dropdown-style nav items with chevrons, brand switcher, auth. Dark mode only; no theme toggle.
 */
export function MavWorkshopNav() {
  return (
    <header className="sticky top-0 z-40 min-h-[64px] border-b border-gray-800 bg-mavworkshop-bg">
      <nav className="mx-auto flex min-h-[64px] max-w-6xl items-center justify-between px-6 sm:px-8">
        <div className="flex items-center gap-4 sm:gap-12">
          <Link href="/" className="flex shrink-0 items-center gap-2 text-white" aria-label="Mav's Digital Workshop home">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-7 w-7 text-mavworkshop-indigo">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
            </svg>
            <span className="text-lg font-bold tracking-tight">Mav&apos;s Digital Workshop</span>
          </Link>
          <ul className="hidden items-center gap-1 sm:flex sm:gap-8">
            {NAV_ITEMS.map((label) => (
              <li key={label}>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded px-3 py-2 text-xs text-white hover:bg-white/10"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {label}
                  <ChevronDownIcon className="h-3 w-3 shrink-0" />
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-2">
          <BrandSwitcher />
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded bg-mavworkshop-indigo px-3 py-1.5 text-sm text-white hover:bg-mavworkshop-warm"
              >
                Sign in
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}
