"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Stethoscope,
  Smartphone,
  MessageSquareHeart,
  ShieldCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  Menu,
  X,
  Sparkles,
  BarChart3,
  ClipboardCheck,
  MapPin,
  Landmark,
  Package,
  Calendar,
  Share2,
  Users,
  Globe,
  Layers,
  ArrowLeft,
  ArrowRight,
  PanelLeftOpen,
  Info,
} from "lucide-react";
import { ROLES } from "@/data/seed";
import { useDentAi } from "@/context/DentAiContext";
import { cn } from "@/lib/utils";
import type { RoleId } from "@/types/dentai";
import { PageInfoDrawer } from "@/components/shared/PageInfoDrawer";

const ROLE_ICONS: Record<RoleId, React.ComponentType<{ className?: string }>> = {
  hq: Building2,
  clinic: Stethoscope,
  patient: Smartphone,
  camps: MessageSquareHeart,
  dpdp: ShieldCheck,
  pharma: Briefcase,
};

interface SubNavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    resetDemoData,
    branches,
    purchaseOrders,
    emiApplications,
    onboardingList,
    properties,
    royaltyTransactions,
    visits,
    referrals,
    automationLogs,
    camps,
    campLeads,
    dpdpTickets,
    mobileAppMode,
    setMobileAppMode,
    hqTab,
    setHqTab,
    clinicTab,
    setClinicTab,
    campsTab,
    setCampsTab,
    pharmaTab,
    setPharmaTab,
  } = useDentAi();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const activeRole =
    ROLES.find((r) => pathname.startsWith(r.href)) ?? ROLES[0];

  const isPatientRoute = pathname.startsWith("/patient");
  const isStandaloneMobileApp = isPatientRoute && mobileAppMode;

  const webPortals = ROLES.filter((r) => r.id !== "patient");

  const pendingApprovals =
    purchaseOrders.filter((p) => p.status === "Ordered").length +
    emiApplications.filter((e) => e.status === "Pending").length;

  const getSubNavForRole = (
    roleId: RoleId
  ): {
    items: SubNavItem[];
    activeId: string;
    onSelect: (id: string) => void;
  } => {
    if (roleId === "hq") {
      return {
        activeId: hqTab,
        onSelect: (id) => setHqTab(id as typeof hqTab),
        items: [
          { id: "bi", label: "Executive BI & Profit", icon: BarChart3 },
          {
            id: "onboarding",
            label: "Franchise Setup & Gear",
            icon: ClipboardCheck,
            badge: onboardingList.length,
          },
          {
            id: "property",
            label: "Clinic Locations",
            icon: MapPin,
            badge: properties.filter((p) => p.status !== "Rejected").length,
          },
          { id: "compliance", label: "Audits & QR Posters", icon: ShieldCheck },
          {
            id: "royalty",
            label: "Royalties & Payouts",
            icon: Landmark,
            badge:
              royaltyTransactions.filter(
                (r) => r.settlementStatus !== "Settled"
              ).length || undefined,
          },
          {
            id: "supply",
            label: "Supply Chain & Stock",
            icon: Package,
            badge:
              purchaseOrders.filter((p) => p.status !== "Delivered").length ||
              undefined,
          },
        ],
      };
    }
    if (roleId === "clinic") {
      return {
        activeId: clinicTab,
        onSelect: (id) => setClinicTab(id as typeof clinicTab),
        items: [
          {
            id: "schedule",
            label: "Appointment Calendar",
            icon: Calendar,
            badge: visits.filter((v) => v.status !== "Completed").length,
          },
          { id: "edr", label: "Patient Chart & AI X-Ray", icon: Stethoscope },
          {
            id: "referrals",
            label: "Specialist Referrals",
            icon: Share2,
            badge:
              referrals.filter((r) => r.status !== "Completed").length ||
              undefined,
          },
          { id: "supply", label: "Clinic Stock & Orders", icon: Package },
        ],
      };
    }
    if (roleId === "camps") {
      return {
        activeId: campsTab,
        onSelect: (id) => setCampsTab(id as typeof campsTab),
        items: [
          {
            id: "simulator",
            label: "WhatsApp AI Bot",
            icon: MessageSquareHeart,
            badge: automationLogs.length,
          },
          { id: "segmentation", label: "Patient Segments & LTV", icon: Users },
          {
            id: "pharma",
            label: "Pharma Health Camps",
            icon: Building2,
            badge: camps.length + campLeads.length,
          },
        ],
      };
    }
    if (roleId === "dpdp") {
      return {
        activeId: "overview",
        onSelect: () => {},
        items: [
          {
            id: "overview",
            label: "Consent & Audit Ledger",
            icon: ShieldCheck,
            badge:
              dpdpTickets.filter((t) => t.status !== "Resolved").length ||
              undefined,
          },
        ],
      };
    }
    if (roleId === "pharma") {
      return {
        activeId: pharmaTab,
        onSelect: (id) => setPharmaTab(id as typeof pharmaTab),
        items: [
          { id: "onboarding", label: "Doctor Site Builder", icon: Globe },
          { id: "hierarchy", label: "5-Tier Dashboards", icon: Layers },
          { id: "ai-content", label: "AI Poster & Video Gen", icon: Sparkles },
        ],
      };
    }
    return { activeId: "", onSelect: () => {}, items: [] };
  };

  const activeSubNav = getSubNavForRole(activeRole.id);
  const activeSubItem = activeSubNav.items.find(
    (s) => s.id === activeSubNav.activeId
  );

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#0F172A]">
      {/* SINGLE COMPACT SIDEBAR WITH NESTED SUB-SIDEBAR ITEMS */}
      {!isStandaloneMobileApp && (
        <aside
          className={cn(
            "hidden lg:flex flex-col bg-[#FFFFFF] text-[#0F172A] shrink-0 transition-all duration-200 border-r border-[#E2E8F0] sticky top-0 h-screen z-30",
            collapsed ? "w-[76px]" : "w-[272px]"
          )}
        >
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#E2E8F0]">
            <Link
              href="/hq"
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="h-9 w-9 rounded-xl bg-[#2563EB] flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              {!collapsed && (
                <div className="min-w-0">
                  <div className="font-bold text-base tracking-tight text-[#0F172A] truncate">
                    DentAI Pro
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    Dr. Bajaj Network
                  </div>
                </div>
              )}
            </Link>
            <button
              onClick={() => setCollapsed((c) => !c)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="p-1.5 rounded-md text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          </div>

          {/* Web Portals + Nested Sub-Sidebar */}
          <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
            {!collapsed && (
              <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Web Portals
              </div>
            )}

            {webPortals.map((role) => {
              const Icon = ROLE_ICONS[role.id] ?? Sparkles;
              const isActive = activeRole.id === role.id;
              const subNav = getSubNavForRole(role.id);

              return (
                <div key={role.id} className="space-y-1">
                  <Link
                    href={role.href}
                    title={collapsed ? role.label : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive
                        ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                        : "text-slate-600 hover:text-[#0F172A] hover:bg-slate-50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        isActive ? "text-[#2563EB]" : "text-slate-400"
                      )}
                    />
                    {!collapsed && (
                      <span className="truncate flex-1">{role.label}</span>
                    )}
                    {!collapsed && role.id === "hq" && pendingApprovals > 0 && (
                      <span
                        className={cn(
                          "px-1.5 py-0.5 text-[10px] font-bold rounded-full",
                          isActive
                            ? "bg-[#2563EB] text-white"
                            : "bg-amber-50 text-[#F59E0B] border border-amber-200"
                        )}
                      >
                        {pendingApprovals}
                      </span>
                    )}
                    {!collapsed && subNav.items.length > 0 && (
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 shrink-0 transition-transform",
                          isActive
                            ? "rotate-0 text-[#2563EB]"
                            : "-rotate-90 text-slate-400"
                        )}
                      />
                    )}
                  </Link>

                  {/* Nested Sub-Sidebar Inside Primary Sidebar */}
                  {!collapsed && isActive && subNav.items.length > 0 && (
                    <div className="ml-5 pl-3 border-l-2 border-blue-200 space-y-1 py-1">
                      {subNav.items.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = sub.id === subNav.activeId;
                        return (
                          <button
                            key={sub.id}
                            onClick={() => subNav.onSelect(sub.id)}
                            className={cn(
                              "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-[13px] transition-colors cursor-pointer text-left",
                              isSubActive
                                ? "bg-[#2563EB] text-white font-semibold shadow-2xs"
                                : "text-slate-600 hover:text-[#0F172A] hover:bg-slate-100/80 font-medium"
                            )}
                          >
                            <SubIcon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate flex-1">{sub.label}</span>
                            {sub.badge !== undefined && (
                              <span
                                className={cn(
                                  "px-1.5 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                                  isSubActive
                                    ? "bg-white/20 text-white"
                                    : "bg-slate-200/80 text-slate-700"
                                )}
                              >
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* LAST ITEM: Switch to Patient Mobile App */}
          <div className="p-3 border-t border-[#E2E8F0] space-y-2.5 bg-[#F8FAFC]/60">
            {!collapsed && (
              <div className="px-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Mobile App
              </div>
            )}
            <button
              onClick={() => {
                setMobileAppMode(true);
                router.push("/patient");
              }}
              title="Switch to Patient App"
              className={cn(
                "w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-xs",
                isPatientRoute
                  ? "bg-[#2563EB] text-white"
                  : "bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-blue-200"
              )}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <Smartphone className="h-4 w-4 shrink-0" />
                {!collapsed && (
                  <span className="truncate">Switch to Patient App</span>
                )}
              </span>
              {!collapsed && <ArrowRight className="h-4 w-4 shrink-0" />}
            </button>

            {!collapsed && (
              <div className="px-1 text-xs text-slate-500 truncate">
                {branches.length} Clinics • {activeRole.persona.split(" (")[0]}
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-[280px] bg-[#FFFFFF] text-[#0F172A] border-r border-[#E2E8F0] flex flex-col h-full z-10"
            >
              <div className="h-16 flex items-center justify-between px-4 border-b border-[#E2E8F0]">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-[#2563EB] flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#0F172A]">
                      DentAI Pro
                    </div>
                    <div className="text-xs text-slate-500">
                      Dr. Bajaj Network
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-[#0F172A]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
                {webPortals.map((role) => {
                  const Icon = ROLE_ICONS[role.id] ?? Sparkles;
                  const isActive = activeRole.id === role.id;
                  const subNav = getSubNavForRole(role.id);
                  return (
                    <div key={role.id} className="space-y-1">
                      <Link
                        href={role.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                          isActive
                            ? "bg-[#EFF6FF] text-[#2563EB] font-semibold"
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{role.label}</span>
                      </Link>
                      {isActive && subNav.items.length > 0 && (
                        <div className="ml-5 pl-3 border-l-2 border-blue-200 space-y-1">
                          {subNav.items.map((sub) => {
                            const SubIcon = sub.icon;
                            const isSubActive = sub.id === subNav.activeId;
                            return (
                              <button
                                key={sub.id}
                                onClick={() => {
                                  subNav.onSelect(sub.id);
                                  setMobileOpen(false);
                                }}
                                className={cn(
                                  "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-left",
                                  isSubActive
                                    ? "bg-[#2563EB] text-white font-semibold"
                                    : "text-slate-600"
                                )}
                              >
                                <SubIcon className="h-3.5 w-3.5" />
                                <span className="truncate">{sub.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>

              <div className="p-3 border-t border-[#E2E8F0]">
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setMobileAppMode(true);
                    router.push("/patient");
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold"
                >
                  <span className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Switch to Patient App
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Main Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Top Bar */}
        <header className="sticky top-0 z-10 bg-[#FFFFFF] border-b border-[#E2E8F0]">
          <div className="h-16 px-4 lg:px-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {!isStandaloneMobileApp && (
                <button
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden p-2 rounded-lg border border-[#E2E8F0] text-slate-600 hover:bg-slate-50"
                  aria-label="Open navigation"
                >
                  <Menu className="h-4 w-4" />
                </button>
              )}
              {isStandaloneMobileApp && (
                <div className="h-9 w-9 rounded-xl bg-[#2563EB] flex items-center justify-center shrink-0">
                  <Sparkles className="h-4.5 w-4.5 text-white" />
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base font-bold text-[#0F172A] truncate">
                    {activeRole.label}
                  </span>
                  {activeSubItem && !isPatientRoute && (
                    <span className="hidden sm:inline-flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                      <span>/</span>
                      <span className="text-[#2563EB] font-semibold">
                        {activeSubItem.label}
                      </span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate hidden md:block">
                  {activeRole.persona} — {activeRole.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setInfoOpen(true)}
                title="Page Guide & Examples"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-indigo-200 bg-indigo-50 hover:bg-[#4F46E5] text-[#4F46E5] hover:text-white transition-colors cursor-pointer"
              >
                <Info className="h-4 w-4" />
                <span className="hidden sm:inline">Guide</span>
              </button>

              {isPatientRoute ? (
                <>
                  {isStandaloneMobileApp && (
                    <button
                      onClick={() => setMobileAppMode(false)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-[#E2E8F0] bg-white text-[#0F172A] hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <PanelLeftOpen className="h-4 w-4 text-[#2563EB]" />
                      <span className="hidden sm:inline">Show Sidebar</span>
                    </button>
                  )}
                  <button
                    onClick={() => router.push("/hq")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-colors cursor-pointer shadow-xs"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Admin Portals</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setMobileAppMode(true);
                    router.push("/patient");
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-blue-200 transition-colors cursor-pointer"
                >
                  <Smartphone className="h-4 w-4" />
                  <span>Switch to Patient App</span>
                </button>
              )}

              <button
                onClick={resetDemoData}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium border border-[#E2E8F0] bg-white text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
              >
                <RotateCcw className="h-4 w-4 text-[#2563EB]" />
                <span className="hidden sm:inline">Reset Demo</span>
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Sub-Nav Pill Strip (< lg) */}
          {!isStandaloneMobileApp && activeSubNav.items.length > 1 && (
            <div className="lg:hidden px-4 py-2 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center gap-1.5 overflow-x-auto">
              {activeSubNav.items.map((item) => {
                const Icon = item.icon;
                const isActive = item.id === activeSubNav.activeId;
                return (
                  <button
                    key={item.id}
                    onClick={() => activeSubNav.onSelect(item.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer",
                      isActive
                        ? "bg-[#2563EB] text-white"
                        : "bg-white text-slate-600 border border-[#E2E8F0]"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </header>

        {/* Spacious Page Content */}
        <main className="flex-1 p-5 lg:p-7 max-w-[1600px] w-full mx-auto">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Contextual Page Info & Examples Right Sidebar */}
      <PageInfoDrawer
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        guideKey={
          activeRole.id === "dpdp"
            ? "dpdp"
            : activeRole.id === "patient"
            ? "patient"
            : `${activeRole.id}:${activeSubNav.activeId}`
        }
      />
    </div>
  );
}
