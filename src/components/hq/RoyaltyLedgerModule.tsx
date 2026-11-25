"use client";

import React, { useMemo, useState } from "react";
import {
  Landmark,
  IndianRupee,
  Split,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useDentAi } from "@/context/DentAiContext";
import { formatINR, cn } from "@/lib/utils";
import type { RoyaltyTransaction } from "@/types/dentai";

export function RoyaltyLedgerModule() {
  const { royaltyTransactions, settleRoyaltyTransaction } = useDentAi();
  const [modeFilter, setModeFilter] = useState<
    "All" | RoyaltyTransaction["paymentMode"]
  >("All");

  const filtered = useMemo(() => {
    if (modeFilter === "All") return royaltyTransactions;
    return royaltyTransactions.filter((r) => r.paymentMode === modeFilter);
  }, [royaltyTransactions, modeFilter]);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, r) => {
        acc.gross += r.grossAmount;
        acc.hq += r.hqShare;
        acc.franchisee += r.franchiseeShare;
        if (r.settlementStatus !== "Settled") {
          acc.pending += r.franchiseeShare + r.hqShare;
        }
        return acc;
      },
      { gross: 0, hq: 0, franchisee: 0, pending: 0 }
    );
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* KPI Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Processed Gross Volume</span>
            <IndianRupee className="h-4 w-4 text-[#2563EB]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">
            {formatINR(totals.gross)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Razorpay Route Auto-Split
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>HQ Royalty Share (10–12%)</span>
            <Landmark className="h-4 w-4 text-[#2563EB]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#2563EB]">
            {formatINR(totals.hq)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Brand + AI Licensing Fee
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Franchisee Net Payout</span>
            <Split className="h-4 w-4 text-[#10B981]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#10B981]">
            {formatINR(totals.franchisee)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            After Gateway &amp; Royalty
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Awaiting Settlement</span>
            <Clock className="h-4 w-4 text-[#F59E0B]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">
            {formatINR(totals.pending)}
          </div>
          <div className="mt-1 text-[11px] text-[#F59E0B] font-medium">
            T+1 Escrow Clearing
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A]">
              Automated Royalty &amp; Split-Settlement Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Real-time UPI, Card &amp; 0% EMI split payouts between Dr. Bajaj
              HQ and Franchisees
            </p>
          </div>

          <div className="inline-flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg self-start">
            {(["All", "UPI", "Card", "0% EMI"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors",
                  modeFilter === mode
                    ? "bg-[#2563EB] text-white"
                    : "text-slate-600 hover:text-[#0F172A]"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase">
              <tr>
                <th className="py-2.5 px-3">Txn Ref &amp; Timestamp</th>
                <th className="py-2.5 px-3">Branch &amp; Patient</th>
                <th className="py-2.5 px-3">Mode</th>
                <th className="py-2.5 px-3 text-right">Gross</th>
                <th className="py-2.5 px-3 text-right">Royalty %</th>
                <th className="py-2.5 px-3 text-right">HQ Share</th>
                <th className="py-2.5 px-3 text-right">Franchisee Share</th>
                <th className="py-2.5 px-3">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filtered.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-3">
                    <div className="font-mono font-semibold text-[#0F172A]">
                      {txn.txnRef}
                    </div>
                    <div className="text-[11px] text-slate-400">{txn.date}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-[#0F172A]">
                      {txn.branchName}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {txn.patientName} • {txn.treatment}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#EFF6FF] text-[#2563EB]">
                      {txn.paymentMode}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-[#0F172A]">
                    {formatINR(txn.grossAmount)}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600">
                    {txn.royaltyPercent}%
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-[#2563EB]">
                    {formatINR(txn.hqShare)}
                  </td>
                  <td className="py-3 px-3 text-right font-semibold text-[#10B981]">
                    {formatINR(txn.franchiseeShare)}
                  </td>
                  <td className="py-3 px-3">
                    {txn.settlementStatus === "Settled" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#10B981] border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Settled
                      </span>
                    ) : (
                      <button
                        onClick={() => settleRoyaltyTransaction(txn.id)}
                        className="px-2.5 py-1 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-medium cursor-pointer transition-colors"
                      >
                        Settle Split ({txn.settlementStatus})
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
