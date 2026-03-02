"use client";

import { useEffect } from "react";
import { BrandProvider, useBrand } from "@/app/contexts/BrandContext";
import { ThemeProvider } from "@/app/contexts/ThemeContext";

function BrandClassManager({ children }: { children: React.ReactNode }) {
  const { brand } = useBrand();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("brand-mavworkshop", brand === "mavworkshop");
    root.classList.toggle("brand-hipages", brand === "hipages");
  }, [brand]);

  return <>{children}</>;
}

function ThemeProviderWithBrand({ children }: { children: React.ReactNode }) {
  const { brand } = useBrand();
  return (
    <ThemeProvider
      forceLight={brand === "hipages"}
      forceDark={brand === "mavworkshop"}
    >
      <BrandClassManager>{children}</BrandClassManager>
    </ThemeProvider>
  );
}

/**
 * Wraps app with BrandProvider and ThemeProvider.
 * Theme is forced to light when brand is hipages, dark when brand is Mav's Digital Workshop.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BrandProvider>
      <ThemeProviderWithBrand>{children}</ThemeProviderWithBrand>
    </BrandProvider>
  );
}
