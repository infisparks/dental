"use client";

import React, { useMemo, useState } from "react";
import {
  ShieldCheck,
  Megaphone,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  Phone,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { useDentAi } from "@/context/DentAiContext";
import { cn } from "@/lib/utils";

function QrPatternSvg({ code }: { code: string }) {
  const cells: boolean[] = [];
  for (let i = 0; i < 49; i++) {
    const ch = code.charCodeAt(i % code.length);
    cells.push((ch + i * 7) % 3 !== 0);
  }
  return (
    <svg
      viewBox="0 0 70 70"
      className="w-16 h-16 bg-white p-1.5 rounded-lg border border-[#E2E8F0] shrink-0"
      aria-label={`QR Code for ${code}`}
    >
      {cells.map((on, idx) => {
        const x = (idx % 7) * 10;
        const y = Math.floor(idx / 7) * 10;
        const isCorner =
          (x < 20 && y < 20) || (x >= 50 && y < 20) || (x < 20 && y >= 50);
        return (
          <rect
            key={idx}
            x={x + 1}
            y={y + 1}
            width="8"
            height="8"
            rx="1"
            fill={isCorner || on ? "#0F172A" : "#F8FAFC"}
          />
        );
      })}
    </svg>
  );
}

export function ComplianceMarketingModule() {
  const { branches, marketingTemplates, toggleBranchComplianceItem } =
    useDentAi();

  const [subView, setSubView] = useState<"compliance" | "marketing">(
    "compliance"
  );
  const [auditBranchId, setAuditBranchId] = useState<string | null>(null);
  const [sortLowestFirst, setSortLowestFirst] = useState(true);

  const [selectedTemplateId, setSelectedTemplateId] = useState(
    marketingTemplates[0].id
  );
  const [stampBranchId, setStampBranchId] = useState(branches[0].id);

  const sortedBranches = useMemo(() => {
    const copy = [...branches];
    copy.sort((a, b) =>
      sortLowestFirst
        ? a.complianceScore - b.complianceScore
        : b.complianceScore - a.complianceScore
    );
    return copy.slice(0, 18);
  }, [branches, sortLowestFirst]);

  const auditBranch = branches.find((b) => b.id === auditBranchId);
  const activeTemplate =
    marketingTemplates.find((t) => t.id === selectedTemplateId) ??
    marketingTemplates[0];
  const stampedBranch =
    branches.find((b) => b.id === stampBranchId) ?? branches[0];

  const handleDownloadPoster = () => {
    const headerHex =
      activeTemplate.accentTone === "navy"
        ? "#4F46E5"
        : activeTemplate.accentTone === "emerald"
        ? "#10B981"
        : "#2563EB";

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520">
      <rect width="800" height="520" fill="#F8FAFC"/>
      <rect x="28" y="28" width="744" height="464" rx="20" fill="#FFFFFF" stroke="#E2E8F0"/>
      <rect x="28" y="28" width="744" height="110" rx="20" fill="${headerHex}"/>
      <text x="56" y="76" font-family="Poppins, sans-serif" font-size="22" font-weight="700" fill="#FFFFFF">DentAI Pro — Dr. Bajaj Dental Network</text>
      <text x="56" y="108" font-family="Poppins, sans-serif" font-size="14" fill="#EFF6FF">${activeTemplate.offerBadge}</text>
      <text x="56" y="200" font-family="Poppins, sans-serif" font-size="24" font-weight="700" fill="#0F172A">${activeTemplate.headline}</text>
      <text x="56" y="240" font-family="Poppins, sans-serif" font-size="15" fill="#475569">${activeTemplate.subheadline}</text>
      <rect x="56" y="320" width="688" height="136" rx="14" fill="#F8FAFC" stroke="#E2E8F0"/>
      <text x="80" y="362" font-family="Poppins, sans-serif" font-size="18" font-weight="700" fill="#0F172A">${stampedBranch.name} (${stampedBranch.code})</text>
      <text x="80" y="394" font-family="Poppins, sans-serif" font-size="13" fill="#475569">${stampedBranch.address}</text>
      <text x="80" y="424" font-family="Poppins, sans-serif" font-size="15" font-weight="600" fill="#2563EB">Book Appointment: ${stampedBranch.phone}</text>
    </svg>`;

    const blob = new Blob([svgContent], {
      type: "image/svg+xml;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stampedBranch.code}-${activeTemplate.id}.svg`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Auto-Stamped Creative Downloaded", {
      description: `${activeTemplate.title} stamped for ${stampedBranch.name}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg self-start">
          <button
            onClick={() => setSubView("compliance")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors",
              subView === "compliance"
                ? "bg-[#2563EB] text-white"
                : "text-slate-600 hover:text-[#0F172A]"
            )}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Branch Compliance Scorecards
          </button>
          <button
            onClick={() => setSubView("marketing")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors",
              subView === "marketing"
                ? "bg-[#2563EB] text-white"
                : "text-slate-600 hover:text-[#0F172A]"
            )}
          >
            <Megaphone className="h-3.5 w-3.5" />
            Marketing Support Hub (Auto-Stamp)
          </button>
        </div>

        {subView === "compliance" && (
          <button
            onClick={() => setSortLowestFirst((v) => !v)}
            className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-xs font-medium text-[#0F172A] hover:bg-slate-50 cursor-pointer self-start"
          >
            Sort:{" "}
            {sortLowestFirst ? "Needs Attention First" : "Highest Score First"}
          </button>
        )}
      </div>

      {/* Compliance Scorecards */}
      {subView === "compliance" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedBranches.map((branch) => {
            const passed = branch.complianceChecklist.filter(
              (c) => c.passed
            ).length;
            const total = branch.complianceChecklist.length;
            const isPerfect = branch.complianceScore === 100;
            return (
              <div
                key={branch.id}
                className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#0F172A] truncate">
                        {branch.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {branch.code} • {branch.leadDentist}
                      </div>
                    </div>
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold border shrink-0",
                        isPerfect
                          ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                          : "bg-amber-50 text-[#F59E0B] border-amber-200"
                      )}
                    >
                      {branch.complianceScore}%
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        isPerfect ? "bg-[#10B981]" : "bg-[#F59E0B]"
                      )}
                      style={{ width: `${branch.complianceScore}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-600 flex items-center justify-between">
                    <span>Clinical SOPs, Hygiene &amp; AERB</span>
                    <span className="font-semibold">
                      {passed}/{total} Passed
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setAuditBranchId(branch.id)}
                  className="w-full py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium cursor-pointer transition-colors"
                >
                  Open Audit Checklist
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Marketing Support Hub with Branch Auto-Stamp */}
      {subView === "marketing" && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Controls */}
          <div className="xl:col-span-5 space-y-4">
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 space-y-4 shadow-2xs">
              <h2 className="text-base font-semibold text-[#0F172A]">
                1. Choose HQ-Approved Creative
              </h2>
              <div className="space-y-2.5">
                {marketingTemplates.map((tpl) => (
                  <button
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer",
                      selectedTemplateId === tpl.id
                        ? "border-[#2563EB] bg-[#EFF6FF]/60"
                        : "border-[#E2E8F0] hover:border-slate-300"
                    )}
                  >
                    <div className="text-[11px] font-semibold text-[#2563EB]">
                      {tpl.campaignType}
                    </div>
                    <div className="text-xs font-semibold text-[#0F172A] mt-0.5">
                      {tpl.title}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 space-y-3 shadow-2xs">
              <h2 className="text-base font-semibold text-[#0F172A]">
                2. Branch Auto-Stamp Selector
              </h2>
              <p className="text-xs text-slate-500">
                Select any of the {branches.length} branches to dynamically stamp
                its address, phone &amp; booking QR code
              </p>
              <select
                value={stampBranchId}
                onChange={(e) => setStampBranchId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.city}) — {b.code}
                  </option>
                ))}
              </select>

              <button
                onClick={handleDownloadPoster}
                className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Download className="h-4 w-4" />
                Download Stamped Creative (SVG)
              </button>
            </div>
          </div>

          {/* Right Live Poster Canvas */}
          <div className="xl:col-span-7 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Live Auto-Stamped Poster Preview
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-blue-200">
                Print &amp; WhatsApp Ready
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-md bg-white">
              {/* Poster Header */}
              <div
                className={cn(
                  "p-6 text-white",
                  activeTemplate.accentTone === "navy"
                    ? "bg-gradient-to-r from-[#4F46E5] to-[#2563EB]"
                    : activeTemplate.accentTone === "emerald"
                    ? "bg-gradient-to-r from-[#10B981] to-emerald-700"
                    : "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide uppercase">
                    <Sparkles className="h-4 w-4" />
                    DentAI Pro — Dr. Bajaj Dental Network
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-[#2563EB]">
                    {activeTemplate.offerBadge}
                  </span>
                </div>
                <h3 className="mt-4 text-xl lg:text-2xl font-bold leading-snug">
                  {activeTemplate.headline}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-white/90">
                  {activeTemplate.subheadline}
                </p>
              </div>

              {/* Dynamic Branch Auto-Stamp Footer */}
              <div className="p-5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-[#2563EB]">
                    Auto-Stamped Branch Details • {stampedBranch.code}
                  </div>
                  <div className="text-sm font-bold text-[#0F172A]">
                    {stampedBranch.name}
                  </div>
                  <div className="text-xs text-slate-600 flex items-start gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span>{stampedBranch.address}</span>
                  </div>
                  <div className="text-xs font-semibold text-[#0F172A] flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-[#2563EB]" />
                    <span>{stampedBranch.phone}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] font-semibold text-slate-500">
                      Scan for
                    </div>
                    <div className="text-xs font-bold text-[#0F172A]">
                      Instant Slot
                    </div>
                  </div>
                  <QrPatternSvg code={stampedBranch.code} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Audit Checklist Right Sidebar */}
      {auditBranch && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/35 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] w-full max-w-xl h-full border-l border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-5 py-4 bg-[#FFFFFF] border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <div className="text-xs text-[#2563EB] font-semibold">
                  Brand &amp; Clinical Compliance Scorecard
                </div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  {auditBranch.name}
                </h3>
                <div className="text-xs text-slate-500">
                  {auditBranch.code} • Lead: {auditBranch.leadDentist}
                </div>
              </div>
              <button
                onClick={() => setAuditBranchId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600">
                Live Audit Score
              </span>
              <span
                className={cn(
                  "text-base font-bold",
                  auditBranch.complianceScore === 100
                    ? "text-[#10B981]"
                    : "text-[#F59E0B]"
                )}
              >
                {auditBranch.complianceScore}%
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
              {auditBranch.complianceChecklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    toggleBranchComplianceItem(auditBranch.id, item.id)
                  }
                  className={cn(
                    "w-full text-left p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors",
                    item.passed
                      ? "bg-emerald-50/40 border-emerald-200"
                      : "bg-rose-50/40 border-rose-200"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.passed ? (
                      <CheckCircle2 className="h-5 w-5 text-[#10B981] shrink-0" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-[#F43F5E] shrink-0" />
                    )}
                    <div>
                      <div className="text-xs font-semibold text-[#0F172A]">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0",
                      item.passed
                        ? "bg-emerald-100 text-[#10B981]"
                        : "bg-rose-100 text-[#F43F5E]"
                    )}
                  >
                    {item.passed ? "Compliant" : "Action Needed"}
                  </span>
                </button>
              ))}
            </div>

            <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                onClick={() => setAuditBranchId(null)}
                className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
