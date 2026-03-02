"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { BrandSwitcher } from "@/app/components/BrandSwitcher";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { getBrandAccentClasses } from "@/app/utils/brandStyles";
import { useBrand } from "@/app/contexts/BrandContext";

/**
 * Single top navigation bar for generic brand: logo, theme toggle, brand switcher, auth.
 */
export function GenericNav() {
  const { brand } = useBrand();
  const accent = getBrandAccentClasses(brand);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className={`font-semibold ${accent}`}>
          Payment Surfaces Demo
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <BrandSwitcher />
          <SignedOut>
            <SignInButton mode="modal">
              <button
                type="button"
                className="rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
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
