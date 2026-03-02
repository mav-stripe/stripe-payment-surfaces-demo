"use client";

import { useBrand } from "@/app/contexts/BrandContext";
import { MavWorkshopNav } from "@/app/components/MavWorkshopNav";
import { GenericNav } from "@/app/components/GenericNav";
import { HipagesNav } from "@/app/components/HipagesNav";

/**
 * Renders brand-appropriate navigation (generic: single bar + theme toggle; hipages: dual bar, light only; Mav's Digital Workshop: dark bar, dropdown nav).
 */
export function Navbar() {
  const { brand } = useBrand();
  if (brand === "hipages") return <HipagesNav />;
  if (brand === "mavworkshop") return <MavWorkshopNav />;
  return <GenericNav />;
}
