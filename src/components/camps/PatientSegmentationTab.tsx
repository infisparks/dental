"use client";

import React, { useMemo, useState } from "react";
import { Crown, Send, Sparkles, X, TrendingUp } from "lucide-react";
import { useDentAi } from "@/context/DentAiContext";
import { formatINR, cn } from "@/lib/utils";
import type { CampCampaign, TreatmentSegmentCategory } from "@/types/dentai";

function classifyTreatment(activeTreatment: string): TreatmentSegmentCategory {
  const lower = activeTreatment.toLowerCase();
  if (lower.includes("root canal") || lower.includes("rct")) return "Root Canal";
  if (lower.includes("implant")) return "Implants";
  if (lower.includes("aligner") || lower.includes("brace")) return "Braces";
  return "Scaling";
}

export function PatientSegmentationTab() {
  const { patients, launchSegmentCampaign } = useDentAi();
  const [segmentFilter, setSegmentFilter] = useState<
    "All" | TreatmentSegmentCategory
  >("All");

  // Modal state
  const [campaignOpen, setCampaignOpen] = useState(false);
  const [targetSegment, setTargetSegment] =
    useState<TreatmentSegmentCategory>("Root Canal");
  const [channel, setChannel] = useState<CampCampaign["channel"]>("WhatsApp");
  const [dripMessage, setDripMessage] = useState(
    "Namaste! Your complimentary 6-month AI Post-RCT Crown Checkup & Bite Scan is now unlocked at DentAI Pro. Reply YES to claim your priority slot."
  );

  const enrichedPatients = useMemo(() => {
    const withMetrics = patients.map((p) => {
      const cat = classifyTreatment(p.activeTreatment);
      const pastSpend = p.visitHistory.reduce((s, v) => s + v.amount, 0);
      const totalSpend = pastSpend + p.outstandingBalance;
      const ltv = Math.round(totalSpend * (cat === "Implants" || cat === "Root Canal" ? 1.65 : 1.35));
      return {
        ...p,
        treatmentCategory: cat,
        totalSpend,
        ltv,
      };
    });

    withMetrics.sort((a, b) => b.ltv - a.ltv);
    return withMetrics.map((item, idx) => ({
      ...item,
      profitabilityRank: idx + 1,
    }));
  }, [patients]);

  const filtered = useMemo(() => {
    if (segmentFilter === "All") return enrichedPatients;
    return enrichedPatients.filter(
      (p) => p.treatmentCategory === segmentFilter
    );
  }, [enrichedPatients, segmentFilter]);

  const handleLaunchCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    const count = enrichedPatients.filter(
      (p) => p.treatmentCategory === targetSegment && p.dpdpConsent.marketing
    ).length;
    launchSegmentCampaign({
      segment: targetSegment,
      channel,
      recipientCount: Math.max(1, count),
      message: dripMessage,
    });
    setCampaignOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Highest-Value Patient Segment Highlight */}
      <div className="rounded-xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white p-5 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold">
            <Crown className="h-3.5 w-3.5 text-amber-300" />
            Highest-Value Patient Segment
          </div>
          <h2 className="text-lg font-bold">
            Root Canal + Zirconia Crown &amp; Implant Cohort (Avg LTV ₹1,95,000+)
          </h2>
          <p className="text-xs text-blue-100">
            Accounts for 67% of network EBITDA margin • Ideal for 6-month
            prophylaxis recall &amp; family referral drips
          </p>
        </div>

        <button
          onClick={() => setCampaignOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-bold cursor-pointer shrink-0 self-start lg:self-auto transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Launch Follow-Up / Free Checkup Campaign
        </button>
      </div>

      {/* Filterable Patient Segmentation Table */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-[#0F172A]">
              Treatment-Wise Patient Segmentation &amp; LTV Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Ranked by Lifetime Value (LTV) &amp; treatment profitability
            </p>
          </div>

          <div className="inline-flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg overflow-x-auto self-start">
            {(
              ["All", "Root Canal", "Implants", "Braces", "Scaling"] as const
            ).map((cat) => (
              <button
                key={cat}
                onClick={() => setSegmentFilter(cat)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors",
                  segmentFilter === cat
                    ? "bg-[#2563EB] text-white"
                    : "text-slate-600 hover:text-[#0F172A]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase">
              <tr>
                <th className="py-2.5 px-3">Profit Rank</th>
                <th className="py-2.5 px-3">Patient &amp; Branch</th>
                <th className="py-2.5 px-3">Treatment Segment</th>
                <th className="py-2.5 px-3 text-right">Total Spend</th>
                <th className="py-2.5 px-3 text-right">Projected LTV</th>
                <th className="py-2.5 px-3">DPDP Drip Eligible</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((p) => {
                const isTopTier = p.profitabilityRank <= 2;
                return (
                  <tr
                    key={p.id}
                    className={cn(
                      "hover:bg-slate-50/70",
                      isTopTier && "bg-[#EFF6FF]/35"
                    )}
                  >
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold",
                          isTopTier
                            ? "bg-[#2563EB] text-white"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        #{p.profitabilityRank}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#0F172A]">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {p.branchName}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                        {p.treatmentCategory}
                      </span>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate max-w-[220px]">
                        {p.activeTreatment}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-[#0F172A]">
                      {formatINR(p.totalSpend)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-[#10B981]">
                      <span className="inline-flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {formatINR(p.ltv)}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                          p.dpdpConsent.marketing
                            ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                            : "bg-amber-50 text-[#F59E0B] border-amber-200"
                        )}
                      >
                        {p.dpdpConsent.marketing
                          ? "Consented"
                          : "Opted Out (DPDP)"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Launch Follow-Up / Free Checkup Campaign Right Sidebar */}
      {campaignOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/35 backdrop-blur-xs">
          <form
            onSubmit={handleLaunchCampaign}
            className="bg-[#FFFFFF] w-full max-w-md h-full border-l border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#4F46E5]">
                  Automated Care-Plan Drip Builder
                </div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Launch Follow-Up / Free Checkup Campaign
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCampaignOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Treatment Segment
                  </label>
                  <select
                    value={targetSegment}
                    onChange={(e) =>
                      setTargetSegment(
                        e.target.value as TreatmentSegmentCategory
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                  >
                    <option value="Root Canal">Root Canal</option>
                    <option value="Implants">Implants</option>
                    <option value="Braces">Braces / Aligners</option>
                    <option value="Scaling">Scaling &amp; Preventive</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Channel
                  </label>
                  <select
                    value={channel}
                    onChange={(e) =>
                      setChannel(e.target.value as CampCampaign["channel"])
                    }
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="SMS">SMS</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
              </div>

              <div className="text-xs">
                <label className="block font-medium text-slate-700 mb-1">
                  Care-Plan Drip Message
                </label>
                <textarea
                  rows={3}
                  required
                  value={dripMessage}
                  onChange={(e) => setDripMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                />
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setCampaignOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Send Drip Campaign
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
