"use client";

import React, { useState } from "react";
import {
  ClipboardCheck,
  Wrench,
  CheckCircle2,
  Circle,
  X,
  LayoutGrid,
  List,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { useDentAi } from "@/context/DentAiContext";
import { formatCompactINR, cn } from "@/lib/utils";
import type { EquipmentItem, OnboardingFranchisee } from "@/types/dentai";

const STAGES: OnboardingFranchisee["stage"][] = [
  "Agreement",
  "Fit-Out",
  "Equipment & Training",
  "Ready for Go-Live",
  "Live",
];

export function OnboardingEquipmentModule() {
  const {
    onboardingList,
    equipmentList,
    toggleOnboardingStep,
    cycleEquipmentStatus,
  } = useDentAi();

  const [subView, setSubView] = useState<"onboarding" | "equipment">(
    "onboarding"
  );
  const [layoutMode, setLayoutMode] = useState<"table" | "kanban">("table");
  const [activeChecklistId, setActiveChecklistId] = useState<string | null>(
    null
  );
  const [equipFilter, setEquipFilter] = useState<
    "All" | EquipmentItem["type"]
  >("All");

  const activeFranchisee = onboardingList.find(
    (f) => f.id === activeChecklistId
  );

  const filteredEquipment =
    equipFilter === "All"
      ? equipmentList
      : equipmentList.filter((e) => e.type === equipFilter);

  const getReadiness = (f: OnboardingFranchisee) => {
    const done = f.checklist.filter((c) => c.completed).length;
    return {
      done,
      total: f.checklist.length,
      pct: Math.round((done / f.checklist.length) * 100),
    };
  };

  return (
    <div className="space-y-6">
      {/* Sub-view switcher */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="inline-flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg self-start">
          <button
            onClick={() => setSubView("onboarding")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors",
              subView === "onboarding"
                ? "bg-[#2563EB] text-white"
                : "text-slate-600 hover:text-[#0F172A]"
            )}
          >
            <ClipboardCheck className="h-3.5 w-3.5" />
            Franchise Onboarding ({onboardingList.length})
          </button>
          <button
            onClick={() => setSubView("equipment")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors",
              subView === "equipment"
                ? "bg-[#2563EB] text-white"
                : "text-slate-600 hover:text-[#0F172A]"
            )}
          >
            <Wrench className="h-3.5 w-3.5" />
            Equipment &amp; Machinery Registry ({equipmentList.length})
          </button>
        </div>

        {subView === "onboarding" ? (
          <div className="inline-flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg self-start">
            <button
              onClick={() => setLayoutMode("table")}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer",
                layoutMode === "table"
                  ? "bg-white text-[#2563EB] shadow-2xs"
                  : "text-slate-600"
              )}
            >
              <List className="h-3.5 w-3.5" />
              Table
            </button>
            <button
              onClick={() => setLayoutMode("kanban")}
              className={cn(
                "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer",
                layoutMode === "kanban"
                  ? "bg-white text-[#2563EB] shadow-2xs"
                  : "text-slate-600"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Kanban
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                "All",
                "Dental Chair",
                "RVG X-Ray",
                "Class-B Autoclave",
                "CBCT Scanner",
              ] as const
            ).map((t) => (
              <button
                key={t}
                onClick={() => setEquipFilter(t)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer transition-colors",
                  equipFilter === t
                    ? "bg-[#2563EB] text-white border-[#2563EB]"
                    : "bg-white text-slate-600 border-[#E2E8F0] hover:text-[#0F172A]"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Onboarding Pipeline View */}
      {subView === "onboarding" && layoutMode === "table" && (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#0F172A]">
              New Franchisee Onboarding Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Click &ldquo;10-Step Checklist&rdquo; on any franchisee to toggle
              milestones and recalculate launch readiness live
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Franchisee Dentist</th>
                  <th className="py-2.5 px-3">Proposed Clinic</th>
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3">Capex</th>
                  <th className="py-2.5 px-3">Readiness %</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {onboardingList.map((f) => {
                  const r = getReadiness(f);
                  return (
                    <tr key={f.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#0F172A]">
                          {f.applicantName}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Target: {f.targetLaunchDate}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-medium text-[#0F172A]">
                          {f.proposedBranch}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {f.city}, {f.state}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[11px] font-semibold border",
                            f.stage === "Live" || f.stage === "Ready for Go-Live"
                              ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                              : "bg-[#EFF6FF] text-[#2563EB] border-blue-200"
                          )}
                        >
                          {f.stage}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-[#0F172A]">
                        {formatCompactINR(f.investmentCommitted)}
                      </td>
                      <td className="py-3 px-3 min-w-[160px]">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-[#0F172A]">
                            {r.pct}%
                          </span>
                          <span className="text-slate-400">
                            {r.done}/{r.total} steps
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={cn(
                              "h-full transition-all duration-300",
                              r.pct === 100 ? "bg-[#10B981]" : "bg-[#2563EB]"
                            )}
                            style={{ width: `${r.pct}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setActiveChecklistId(f.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-medium cursor-pointer transition-colors"
                        >
                          10-Step Checklist
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Kanban View */}
      {subView === "onboarding" && layoutMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {STAGES.map((stage) => {
            const items = onboardingList.filter((f) => f.stage === stage);
            return (
              <div
                key={stage}
                className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-3.5 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-semibold text-[#0F172A]">
                    {stage}
                  </span>
                  <span className="h-5 w-5 rounded-full bg-[#EFF6FF] text-[11px] font-semibold text-[#2563EB] flex items-center justify-center">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2.5">
                  {items.length === 0 ? (
                    <div className="text-[11px] text-slate-400 py-6 text-center">
                      No clinics in stage
                    </div>
                  ) : (
                    items.map((f) => {
                      const r = getReadiness(f);
                      return (
                        <div
                          key={f.id}
                          onClick={() => setActiveChecklistId(f.id)}
                          className="p-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] cursor-pointer space-y-2 transition-colors"
                        >
                          <div className="text-xs font-semibold text-[#0F172A]">
                            {f.proposedBranch}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {f.applicantName}
                          </div>
                          <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className={cn(
                                "h-full",
                                r.pct === 100 ? "bg-[#10B981]" : "bg-[#2563EB]"
                              )}
                              style={{ width: `${r.pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-500">
                            <span>{r.pct}% Ready</span>
                            <span className="text-[#2563EB] font-medium">
                              Open Checklist →
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Equipment & Machinery Registry */}
      {subView === "equipment" && (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
          <div className="mb-4">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Pan-India Biomedical Equipment &amp; Asset Registry
            </h2>
            <p className="text-xs text-slate-500">
              Track Dental Chairs, RVG X-Rays, Autoclaves &amp; CBCT warranties
              and calibration status
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Equipment &amp; Model</th>
                  <th className="py-2.5 px-3">Branch</th>
                  <th className="py-2.5 px-3">Serial Number</th>
                  <th className="py-2.5 px-3">Warranty Expiry</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredEquipment.map((eq) => (
                  <tr key={eq.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#0F172A]">
                        {eq.model}
                      </div>
                      <div className="text-[11px] text-[#2563EB] font-medium">
                        {eq.type}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-[#0F172A]">{eq.branchName}</div>
                      <div className="text-[11px] text-slate-400">
                        {eq.city}
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                      {eq.serialNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {eq.warrantyExpiry}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                          eq.maintenanceStatus === "Operational"
                            ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                            : eq.maintenanceStatus === "Due Soon"
                            ? "bg-amber-50 text-[#F59E0B] border-amber-200"
                            : "bg-rose-50 text-[#F43F5E] border-rose-200"
                        )}
                      >
                        {eq.maintenanceStatus === "Under Service" && (
                          <ShieldAlert className="h-3 w-3" />
                        )}
                        {eq.maintenanceStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => cycleEquipmentStatus(eq.id)}
                        className="px-2.5 py-1 rounded-md border border-[#E2E8F0] bg-white hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-blue-200 text-xs font-medium text-[#0F172A] cursor-pointer transition-colors"
                      >
                        Update Service
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10-Step Onboarding Checklist Right Sidebar */}
      {activeFranchisee && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/35 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] w-full max-w-xl h-full border-l border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden">
            <div className="px-5 py-4 bg-[#FFFFFF] border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <div className="text-xs text-[#2563EB] font-semibold">
                  10-Step Franchise Setup Checklist
                </div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  {activeFranchisee.proposedBranch}
                </h3>
                <div className="text-xs text-slate-500">
                  {activeFranchisee.applicantName} • Stage:{" "}
                  {activeFranchisee.stage}
                </div>
              </div>
              <button
                onClick={() => setActiveChecklistId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between gap-4">
              <div className="text-xs font-medium text-slate-600">
                Overall Go-Live Readiness
              </div>
              <div className="flex items-center gap-3 flex-1 max-w-xs">
                <div className="flex-1 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-300",
                      getReadiness(activeFranchisee).pct === 100
                        ? "bg-[#10B981]"
                        : "bg-[#2563EB]"
                    )}
                    style={{
                      width: `${getReadiness(activeFranchisee).pct}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-bold text-[#2563EB]">
                  {getReadiness(activeFranchisee).pct}%
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
              {activeFranchisee.checklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    toggleOnboardingStep(activeFranchisee.id, item.id)
                  }
                  className={cn(
                    "w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer",
                    item.completed
                      ? "bg-[#EFF6FF]/60 border-blue-200"
                      : "bg-white border-[#E2E8F0] hover:border-slate-300"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {item.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-[#10B981] shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-300 shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div
                        className={cn(
                          "text-xs font-semibold",
                          item.completed
                            ? "text-[#0F172A]"
                            : "text-slate-700"
                        )}
                      >
                        Step {item.step}: {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0",
                      item.completed
                        ? "bg-emerald-50 text-[#10B981]"
                        : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {item.completed ? "Done" : "Pending"}
                  </span>
                </button>
              ))}
            </div>

            <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                onClick={() => setActiveChecklistId(null)}
                className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Save &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
