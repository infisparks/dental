"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Smartphone,
  Monitor,
  Award,
  Home,
  CreditCard,
  ShoppingBag,
  FolderLock,
  ShieldCheck,
  Download,
  X,
  Wifi,
  BatteryCharging,
  Signal,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useDentAi } from "@/context/DentAiContext";
import { cn } from "@/lib/utils";
import { PatientHomeTab } from "@/components/patient/PatientHomeTab";
import { PatientFinanceTab } from "@/components/patient/PatientFinanceTab";
import { PatientStoreTab } from "@/components/patient/PatientStoreTab";
import { PatientVaultCommunityTab } from "@/components/patient/PatientVaultCommunityTab";
import { PatientPrivacyTab } from "@/components/patient/PatientPrivacyTab";

type PwaTab = "home" | "finance" | "store" | "vault" | "privacy";

const FAMILY_PROFILES = [
  { id: "self", label: "Aarav (Self)", badge: "VIP" },
  { id: "spouse", label: "Riya (Spouse)", badge: "Member" },
  { id: "minor", label: "Vivaan (Son)", badge: "Minor DPDP" },
];

export default function PatientSuperAppPage() {
  const { patients, mobileAppMode, setMobileAppMode } = useDentAi();
  const [activeTab, setActiveTab] = useState<PwaTab>("home");
  const [showPwaBanner, setShowPwaBanner] = useState(true);
  const [familyProfile, setFamilyProfile] = useState("self");

  const patient = patients[0]; // Aarav Sharma
  const activeFamily =
    FAMILY_PROFILES.find((f) => f.id === familyProfile) ?? FAMILY_PROFILES[0];

  const navItems: Array<{
    id: PwaTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "home", label: "Home", icon: Home },
    { id: "finance", label: "Finance", icon: CreditCard },
    { id: "store", label: "Store", icon: ShoppingBag },
    { id: "vault", label: "Vault", icon: FolderLock },
    { id: "privacy", label: "Privacy", icon: ShieldCheck },
  ];

  const handleInstallPwa = () => {
    setShowPwaBanner(false);
    toast.success("DentAI Pro PWA Installed", {
      description: "Added to Home Screen with offline Vault & EMI alerts.",
    });
  };

  const pwaInner = (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Dismissible Install App to Home Screen (PWA) Banner */}
      {showPwaBanner && (
        <div className="px-3.5 py-2 bg-[#EFF6FF] border-b border-blue-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0">
              <Download className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-[#0F172A] truncate">
                Install App to Home Screen (PWA)
              </div>
              <div className="text-[10px] text-slate-500 truncate">
                No App Store needed • Offline Rx Vault
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleInstallPwa}
              className="px-2.5 py-1 rounded-md bg-[#2563EB] text-white text-[10px] font-semibold cursor-pointer"
            >
              Install
            </button>
            <button
              onClick={() => setShowPwaBanner(false)}
              className="p-1 text-slate-400 hover:text-[#0F172A] cursor-pointer"
              aria-label="Dismiss install banner"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Executive App Header + Family Profile Switcher */}
      <div className="px-4 pt-3.5 pb-3 bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#4F46E5] text-white shrink-0 space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[10px] text-blue-100 font-medium">
              DentAI Pro • Dr. Bajaj Dental Network
            </div>
            <div className="text-sm font-bold">
              Good Evening, {activeFamily.label.split(" ")[0]}
            </div>
          </div>
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 border border-white/25 text-white text-[11px] font-semibold backdrop-blur-xs">
            <Award className="h-3.5 w-3.5 text-amber-300" />
            {patient.loyaltyPoints} pts
          </div>
        </div>

        {/* Family Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <Users className="h-3 w-3 text-blue-200 shrink-0" />
          {FAMILY_PROFILES.map((fp) => (
            <button
              key={fp.id}
              onClick={() => {
                setFamilyProfile(fp.id);
                toast.info(`Switched profile to ${fp.label}`);
              }}
              className={cn(
                "px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap cursor-pointer transition-colors",
                familyProfile === fp.id
                  ? "bg-white text-[#2563EB]"
                  : "bg-white/15 text-blue-50 hover:bg-white/25"
              )}
            >
              {fp.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Active Tab Content */}
      <div className="flex-1 overflow-y-auto p-3.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
          >
            {activeTab === "home" && (
              <PatientHomeTab patient={patient} onNavigateTab={setActiveTab} />
            )}
            {activeTab === "finance" && <PatientFinanceTab patient={patient} />}
            {activeTab === "store" && <PatientStoreTab />}
            {activeTab === "vault" && (
              <PatientVaultCommunityTab patient={patient} />
            )}
            {activeTab === "privacy" && (
              <PatientPrivacyTab patient={patient} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Mobile Navigation Bar */}
      <nav className="bg-[#FFFFFF] border-t border-[#E2E8F0] px-2 py-1.5 grid grid-cols-5 gap-1 shrink-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center py-1 rounded-xl text-[10px] font-medium cursor-pointer transition-all",
                isActive
                  ? "text-[#2563EB] bg-[#EFF6FF] font-semibold"
                  : "text-slate-500 hover:text-[#0F172A]"
              )}
            >
              <Icon className="h-4 w-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Presenter Header + Standalone Mobile (Hide Sidebar) vs Full-Width Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-semibold text-[#0F172A]">
            Patient Super-App (PWA)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {mobileAppMode
              ? "Standalone Mobile App Mode (Sidebar Hidden) — 390px iOS Frame"
              : "Full-Width Responsive Web PWA Mode"}
          </p>
        </div>

        <div className="inline-flex items-center bg-[#FFFFFF] border border-[#E2E8F0] p-1 rounded-xl self-start shadow-2xs">
          <button
            onClick={() => setMobileAppMode(true)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors",
              mobileAppMode
                ? "bg-[#2563EB] text-white"
                : "text-slate-600 hover:text-[#0F172A]"
            )}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Mobile App (Hide Sidebar)
          </button>
          <button
            onClick={() => setMobileAppMode(false)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors",
              !mobileAppMode
                ? "bg-[#2563EB] text-white"
                : "text-slate-600 hover:text-[#0F172A]"
            )}
          >
            <Monitor className="h-3.5 w-3.5" />
            Full-Width Mode
          </button>
        </div>
      </div>

      {/* Container */}
      {mobileAppMode ? (
        <div className="flex justify-center py-1">
          <div className="w-[390px] max-w-full h-[780px] rounded-[46px] border-[11px] border-slate-900 bg-[#F8FAFC] shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-slate-300">
            {/* Realistic iOS Status Bar + Dynamic Island */}
            <div className="h-8 bg-[#1D4ED8] text-white px-5 flex items-center justify-between text-[11px] font-semibold shrink-0 relative">
              <span>9:41</span>
              <div className="w-24 h-5 rounded-full bg-slate-950 absolute left-1/2 -translate-x-1/2 top-1.5 flex items-center justify-end pr-2">
                <span className="h-2 w-2 rounded-full bg-indigo-950 border border-slate-700" />
              </div>
              <div className="flex items-center gap-1.5">
                <Signal className="h-3 w-3" />
                <Wifi className="h-3 w-3" />
                <BatteryCharging className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="flex-1 min-h-0 flex flex-col">{pwaInner}</div>

            {/* iOS Home Indicator */}
            <div className="h-4 bg-[#FFFFFF] flex items-center justify-center shrink-0">
              <div className="w-28 h-1 rounded-full bg-slate-300" />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] shadow-sm overflow-hidden min-h-[680px] flex flex-col">
          {pwaInner}
        </div>
      )}
    </div>
  );
}
