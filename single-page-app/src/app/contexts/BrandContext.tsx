"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "brand-theme";

export type Brand = "generic" | "hipages" | "mavworkshop";

type BrandContextValue = {
  brand: Brand;
  setBrand: (brand: Brand) => void;
};

const BrandContext = createContext<BrandContextValue | null>(null);

function readStoredBrand(): Brand {
  if (typeof window === "undefined") return "generic";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "hipages" || stored === "generic" || stored === "mavworkshop") return stored;
  } catch {
    // ignore
  }
  return "generic";
}

/**
 * Provides brand theme state (generic | hipages | mavworkshop) with localStorage persistence.
 * Use useBrand() in children to read/set brand.
 */
export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrandState] = useState<Brand>("generic");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setBrandState(readStoredBrand());
    setMounted(true);
  }, []);

  const setBrand = useCallback((value: Brand) => {
    setBrandState(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => (mounted ? { brand, setBrand } : { brand: "generic" as Brand, setBrand }),
    [mounted, brand, setBrand]
  );

  return (
    <BrandContext.Provider value={value}>{children}</BrandContext.Provider>
  );
}

export function useBrand(): BrandContextValue {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be used within BrandProvider");
  return ctx;
}
