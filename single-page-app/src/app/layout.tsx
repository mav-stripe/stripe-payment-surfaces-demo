import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { FallbackNav } from "@/app/components/FallbackNav";
import { Navbar } from "@/app/components/Navbar";
import { Providers } from "@/app/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stripe Payment Surfaces Demo",
  description: "Demo of Stripe payment surfaces: Payment Element, Embedded Form, Embedded Form 2.",
};

const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const hasClerkKey =
  clerkPublishableKey &&
  clerkPublishableKey !== "pk_test_xxx" &&
  clerkPublishableKey !== "pk_test_placeholder";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {hasClerkKey ? <Navbar /> : <FallbackNav />}
          {children}
        </Providers>
      </body>
    </html>
  );

  if (!hasClerkKey) {
    return content;
  }

  return <ClerkProvider publishableKey={clerkPublishableKey}>{content}</ClerkProvider>;
}
