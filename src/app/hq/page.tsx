"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useDentAi } from "@/context/DentAiContext";
import { ExecutiveBiDashboard } from "@/components/hq/ExecutiveBiDashboard";
import { OnboardingEquipmentModule } from "@/components/hq/OnboardingEquipmentModule";
import { PropertyFinderModule } from "@/components/hq/PropertyFinderModule";
import { ComplianceMarketingModule } from "@/components/hq/ComplianceMarketingModule";
import { RoyaltyLedgerModule } from "@/components/hq/RoyaltyLedgerModule";
import { SupplyChainModule } from "@/components/shared/SupplyChainModule";

const TAB_TITLES = {
  bi: {
    title: "Executive BI & Profit Dashboard",
    subtitle: "Consolidated sales, net profit, expenses & top-performing clinics across India",
  },
  onboarding: {
    title: "Franchise Setup & Equipment Registry",
    subtitle: "10-step onboarding checklists and biomedical machinery warranties",
  },
  property: {
    title: "Clinic Locations & Property Finder",
    subtitle: "Evaluate commercial storefronts, rent, carpet area & footfall scores",
  },
  compliance: {
    title: "Brand Audits & Auto-Stamped Marketing",
    subtitle: "0–100% clinic compliance scorecards and instant branch QR posters",
  },
  royalty: {
    title: "Royalties & Split-Settlement Ledger",
    subtitle: "Automated HQ vs Franchisee payout splits for UPI, Card & 0% EMI",
  },
  supply: {
    title: "Supply Chain & B2B Inventory",
    subtitle: "Central wholesale brand ordering, PO fulfillment & daily clinic stock",
  },
} as const;

export default function HqFranchisorPage() {
  const { branches, hqTab } = useDentAi();
  const meta = TAB_TITLES[hqTab];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">{meta.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{meta.subtitle}</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-200 text-xs font-semibold self-start">
          <Sparkles className="h-4 w-4 text-[#4F46E5]" />
          <span>{branches.length} Clinics Live • FY 2026–27</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={hqTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16 }}
        >
          {hqTab === "bi" && <ExecutiveBiDashboard />}
          {hqTab === "onboarding" && <OnboardingEquipmentModule />}
          {hqTab === "property" && <PropertyFinderModule />}
          {hqTab === "compliance" && <ComplianceMarketingModule />}
          {hqTab === "royalty" && <RoyaltyLedgerModule />}
          {hqTab === "supply" && <SupplyChainModule role="hq" />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
