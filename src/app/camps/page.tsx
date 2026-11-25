"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useDentAi } from "@/context/DentAiContext";
import { WhatsappSimulatorTab } from "@/components/camps/WhatsappSimulatorTab";
import { PatientSegmentationTab } from "@/components/camps/PatientSegmentationTab";
import { PharmaCampsTab } from "@/components/camps/PharmaCampsTab";

const CAMPS_META = {
  simulator: {
    title: "WhatsApp AI Receptionist & Logs",
    subtitle:
      "Simulate post-visit PDF delivery, AI FAQs, slot booking & toothpaste reorders",
  },
  segmentation: {
    title: "Patient Segments & Automated Care Plans",
    subtitle:
      "Identify highest-LTV treatments and launch targeted follow-up drips",
  },
  pharma: {
    title: "Pharma Health Camps & Lead Capture",
    subtitle:
      "Co-branded corporate/pharma dental camps with DPDP-compliant lead capture",
  },
} as const;

export default function AiReceptionistCampsPage() {
  const { campsTab } = useDentAi();
  const meta = CAMPS_META[campsTab];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">{meta.title}</h1>
          <p className="text-sm text-slate-500 mt-1">{meta.subtitle}</p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-200 text-xs font-semibold self-start">
          <Sparkles className="h-4 w-4" />
          <span>DPDP-Compliant Growth Engine</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={campsTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16 }}
        >
          {campsTab === "simulator" && <WhatsappSimulatorTab />}
          {campsTab === "segmentation" && <PatientSegmentationTab />}
          {campsTab === "pharma" && <PharmaCampsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
