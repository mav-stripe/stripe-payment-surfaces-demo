"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { BrandSwitcher } from "@/app/components/BrandSwitcher";
import { getBrandIconClasses } from "@/app/utils/brandStyles";

/**
 * Dual navigation for Hipages brand: utility bar + main nav. Orange theme, no dark mode toggle.
 */
export function HipagesNav() {
  return (
    <>
      <header className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-end gap-6 px-4">
          <span>Help</span>
          <span>Contact</span>
          <BrandSwitcher />
        </div>
      </header>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className={`font-semibold ${getBrandIconClasses("hipages")}`}
          >
            Payment Surfaces Demo
          </Link>
          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="rounded bg-hipages-orange px-3 py-1.5 text-sm text-white hover:bg-hipages-orange-dark"
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
    </>
  );
}
