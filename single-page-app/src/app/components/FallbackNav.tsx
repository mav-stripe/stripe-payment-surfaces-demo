import Link from "next/link";

/**
 * Minimal nav when Clerk is not configured (e.g. placeholder keys). No auth UI.
 */
export function FallbackNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-900/95">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Payment Surfaces Demo
        </Link>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Configure Clerk in .env.local for sign-in
        </p>
      </nav>
    </header>
  );
}
