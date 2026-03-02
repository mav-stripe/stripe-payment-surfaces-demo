import type { Brand } from "@/app/contexts/BrandContext";

/**
 * Brand-aware Tailwind class helpers for buttons, accents, cards, etc.
 * Generic: blue accent with dark mode variants. Hipages: orange, light only.
 * Mav's Digital Workshop: dark-only, white text, indigo/warm gradient accents.
 */

export function getBrandButtonClasses(brand: Brand): string {
  if (brand === "hipages")
    return "bg-hipages-orange hover:bg-hipages-orange-dark text-white";
  if (brand === "mavworkshop")
    return "bg-mavworkshop-indigo hover:bg-mavworkshop-warm text-white";
  return "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white";
}

export function getBrandAccentClasses(brand: Brand): string {
  if (brand === "hipages")
    return "text-hipages-orange hover:text-hipages-orange-dark";
  if (brand === "mavworkshop")
    return "text-white hover:text-mavworkshop-indigo";
  return "text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300";
}

export function getBrandGradientClasses(brand: Brand): string {
  if (brand === "hipages")
    return "from-hipages-orange to-hipages-orange-dark";
  if (brand === "mavworkshop")
    return "from-mavworkshop-indigo to-mavworkshop-warm";
  return "from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600";
}

export function getBrandIconClasses(brand: Brand): string {
  if (brand === "hipages") return "text-hipages-orange";
  if (brand === "mavworkshop") return "text-white";
  return "text-blue-600 dark:text-blue-400";
}

export function getBrandCardClasses(brand: Brand): string {
  if (brand === "hipages")
    return "bg-white border border-gray-200 shadow-sm hover:border-hipages-orange-light";
  if (brand === "mavworkshop")
    return "bg-mavworkshop-bg/80 border border-gray-700 shadow-sm hover:border-mavworkshop-indigo";
  return "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:border-blue-500 dark:hover:border-blue-400";
}

export function getBrandTextClasses(brand: Brand): string {
  if (brand === "hipages") return "text-gray-900";
  if (brand === "mavworkshop") return "text-white";
  return "text-gray-900 dark:text-gray-100";
}

export function getBrandSecondaryTextClasses(brand: Brand): string {
  if (brand === "hipages") return "text-gray-600";
  if (brand === "mavworkshop") return "text-gray-300";
  return "text-gray-600 dark:text-gray-400";
}
