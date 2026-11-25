"use client";

import React, { useMemo, useState } from "react";
import {
  Building2,
  IndianRupee,
  TrendingUp,
  Wallet,
  Users,
  CreditCard,
  Trophy,
  CheckCircle2,
  XCircle,
  Filter,
  BarChart3,
  AreaChart as AreaChartIcon,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useDentAi } from "@/context/DentAiContext";
import {
  HQ_MONTHLY_BI_SERIES,
  TREATMENT_REVENUE_BREAKDOWN,
} from "@/data/seed";
import { formatCompactINR, formatINR, cn } from "@/lib/utils";
import type { IndianState } from "@/types/dentai";

type ScopeMode = "All India" | "By State" | "Specific Branch";
type DateRange = "Current Month (Nov 2026)" | "Last Quarter (3M)" | "YTD (8M)";

const STATES: IndianState[] = [
  "Maharashtra",
  "Delhi NCR",
  "Karnataka",
  "Gujarat",
];

const RANGE_MULTIPLIERS: Record<DateRange, number> = {
  "Current Month (Nov 2026)": 1,
  "Last Quarter (3M)": 2.88,
  "YTD (8M)": 7.45,
};

export function ExecutiveBiDashboard() {
  const {
    branches,
    purchaseOrders,
    emiApplications,
    approvePurchaseOrder,
    approveEmi,
    declineEmi,
  } = useDentAi();

  const [scopeMode, setScopeMode] = useState<ScopeMode>("All India");
  const [selectedState, setSelectedState] =
    useState<IndianState>("Maharashtra");
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    branches[0]?.id ?? "br-001"
  );
  const [dateRange, setDateRange] = useState<DateRange>(
    "Current Month (Nov 2026)"
  );
  const [chartType, setChartType] = useState<"area" | "bar">("area");

  const mult = RANGE_MULTIPLIERS[dateRange];

  const scopedBranches = useMemo(() => {
    if (scopeMode === "By State") {
      return branches.filter((b) => b.state === selectedState);
    }
    if (scopeMode === "Specific Branch") {
      return branches.filter((b) => b.id === selectedBranchId);
    }
    return branches;
  }, [branches, scopeMode, selectedState, selectedBranchId]);

  const kpis = useMemo(() => {
    const gross = scopedBranches.reduce((s, b) => s + b.monthlyRevenue, 0);
    const expenses = scopedBranches.reduce((s, b) => s + b.expenses, 0);
    const profit = scopedBranches.reduce((s, b) => s + b.netProfit, 0);
    const footfall = scopedBranches.reduce((s, b) => s + b.patientCount, 0);
    const emi = scopedBranches.reduce((s, b) => s + b.emiVolume, 0);

    return {
      branchCount: scopedBranches.length,
      grossSales: Math.round(gross * mult),
      netProfit: Math.round(profit * mult),
      expenses: Math.round(expenses * mult),
      footfall: Math.round(footfall * mult),
      emiVolume: Math.round(emi * mult),
      profitMargin: gross > 0 ? ((profit / gross) * 100).toFixed(1) : "0.0",
    };
  }, [scopedBranches, mult]);

  const chartSeries = useMemo(() => {
    const shareRatio =
      branches.length > 0
        ? scopedBranches.reduce((s, b) => s + b.monthlyRevenue, 0) /
          branches.reduce((s, b) => s + b.monthlyRevenue, 0)
        : 1;

    return HQ_MONTHLY_BI_SERIES.map((pt) => ({
      month: pt.month,
      sales: Number((pt.sales * shareRatio).toFixed(2)),
      expenses: Number((pt.expenses * shareRatio).toFixed(2)),
      profit: Number((pt.profit * shareRatio).toFixed(2)),
    }));
  }, [branches, scopedBranches]);

  const treatmentData = useMemo(() => {
    const shareRatio =
      branches.length > 0
        ? (scopedBranches.reduce((s, b) => s + b.monthlyRevenue, 0) /
            branches.reduce((s, b) => s + b.monthlyRevenue, 0)) *
          mult
        : 1;

    return TREATMENT_REVENUE_BREAKDOWN.map((item) => ({
      ...item,
      value: Number((item.value * shareRatio).toFixed(2)),
    }));
  }, [branches, scopedBranches, mult]);

  const leaderboard = useMemo(() => {
    return [...scopedBranches]
      .sort((a, b) => b.netProfit - a.netProfit)
      .slice(0, 8);
  }, [scopedBranches]);

  const pendingPos = purchaseOrders.filter(
    (p) => p.status === "Ordered"
  );
  const pendingEmis = emiApplications.filter((e) => e.status === "Pending");

  return (
    <div className="space-y-6">
      {/* Top Filters Bar */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] mr-1">
            <Filter className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>BI Scope:</span>
          </div>

          <div className="inline-flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg">
            {(["All India", "By State", "Specific Branch"] as ScopeMode[]).map(
              (mode) => (
                <button
                  key={mode}
                  onClick={() => setScopeMode(mode)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
                    scopeMode === mode
                      ? "bg-[#2563EB] text-white"
                      : "text-slate-600 hover:text-[#0F172A]"
                  )}
                >
                  {mode}
                </button>
              )
            )}
          </div>

          {scopeMode === "By State" && (
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value as IndianState)}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              {STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          )}

          {scopeMode === "Specific Branch" && (
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-medium text-[#0F172A] max-w-[260px] focus:outline-none focus:border-[#2563EB]"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Period:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
          >
            <option value="Current Month (Nov 2026)">
              Current Month (Nov 2026)
            </option>
            <option value="Last Quarter (3M)">Last Quarter (3M)</option>
            <option value="YTD (8M)">YTD (8M)</option>
          </select>
        </div>
      </div>

      {/* 6 Executive KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Branches</span>
            <Building2 className="h-4 w-4 text-[#2563EB]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">
            {kpis.branchCount}
          </div>
          <div className="mt-1 text-[11px] text-[#2563EB] font-medium">
            {scopeMode === "All India" ? "Pan-India Network" : "Filtered View"}
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Gross Sales</span>
            <IndianRupee className="h-4 w-4 text-[#2563EB]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">
            {formatCompactINR(kpis.grossSales)}
          </div>
          <div className="mt-1 text-[11px] text-[#10B981] font-medium flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +12.4% MoM
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Net Profit</span>
            <TrendingUp className="h-4 w-4 text-[#10B981]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">
            {formatCompactINR(kpis.netProfit)}
          </div>
          <div className="mt-1 text-[11px] text-[#10B981] font-medium">
            {kpis.profitMargin}% EBITDA Margin
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Op. Expenses</span>
            <Wallet className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">
            {formatCompactINR(kpis.expenses)}
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Labs, Payroll &amp; Rent
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Patient Footfall</span>
            <Users className="h-4 w-4 text-[#4F46E5]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">
            {kpis.footfall.toLocaleString("en-IN")}
          </div>
          <div className="mt-1 text-[11px] text-[#4F46E5] font-medium">
            31% New Patient Mix
          </div>
        </div>

        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>EMI Volume</span>
            <CreditCard className="h-4 w-4 text-[#2563EB]" />
          </div>
          <div className="mt-2 text-2xl font-bold text-[#0F172A]">
            {formatCompactINR(kpis.emiVolume)}
          </div>
          <div className="mt-1 text-[11px] text-[#2563EB] font-medium">
            23.2% Zero-Cost EMI Share
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Monthly Sales vs Profit vs Expenses */}
        <div className="xl:col-span-2 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">
                Monthly Sales vs. Net Profit vs. Expenses (₹ Crores)
              </h2>
              <p className="text-xs text-slate-500">
                Consolidated unit economics across selected scope
              </p>
            </div>
            <div className="inline-flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg self-start">
              <button
                onClick={() => setChartType("area")}
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer",
                  chartType === "area"
                    ? "bg-[#2563EB] text-white"
                    : "text-slate-600"
                )}
              >
                <AreaChartIcon className="h-3.5 w-3.5" />
                Area
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={cn(
                  "inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer",
                  chartType === "bar"
                    ? "bg-[#2563EB] text-white"
                    : "text-slate-600"
                )}
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Bar
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "area" ? (
                <AreaChart data={chartSeries}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#2563EB"
                        stopOpacity={0.22}
                      />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor="#10B981"
                        stopOpacity={0.24}
                      />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#64748B" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    unit=" Cr"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      borderColor: "#E2E8F0",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    name="Gross Sales (₹ Cr)"
                    stroke="#2563EB"
                    strokeWidth={2.5}
                    fill="url(#salesGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses (₹ Cr)"
                    stroke="#94A3B8"
                    strokeWidth={1.75}
                    strokeDasharray="4 4"
                    fill="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    name="Net Profit (₹ Cr)"
                    stroke="#10B981"
                    strokeWidth={2.25}
                    fill="url(#profitGrad)"
                  />
                </AreaChart>
              ) : (
                <BarChart data={chartSeries}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#64748B" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    unit=" Cr"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "10px",
                      borderColor: "#E2E8F0",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    dataKey="sales"
                    name="Gross Sales (₹ Cr)"
                    fill="#2563EB"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="expenses"
                    name="Expenses (₹ Cr)"
                    fill="#94A3B8"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="profit"
                    name="Net Profit (₹ Cr)"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Treatment-Wise Revenue & Profitability Donut */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A]">
              Treatment Revenue &amp; Margin Mix
            </h2>
            <p className="text-xs text-slate-500">
              High-ticket specialty contribution (₹ Cr)
            </p>
          </div>

          <div className="h-[200px] w-full my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={treatmentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {treatmentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val) => [`₹${val} Cr`, "Revenue"]}
                  contentStyle={{
                    borderRadius: "10px",
                    borderColor: "#E2E8F0",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {treatmentData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-slate-700 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-semibold text-[#0F172A]">
                    ₹{item.value} Cr
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[#10B981] text-[10px] font-semibold">
                    {item.margin}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard + Live HQ Approval Queues */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Top Performing Branches Leaderboard */}
        <div className="xl:col-span-2 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-[#2563EB]" />
              <h2 className="text-base font-semibold text-[#0F172A]">
                Top Performing Branches Leaderboard
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              Ranked by Monthly Net Profit
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Rank &amp; Clinic</th>
                  <th className="py-2.5 px-3">State / City</th>
                  <th className="py-2.5 px-3 text-right">Footfall</th>
                  <th className="py-2.5 px-3 text-right">Gross Sales</th>
                  <th className="py-2.5 px-3 text-right">Net Profit</th>
                  <th className="py-2.5 px-3 text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {leaderboard.map((branch, idx) => (
                  <tr key={branch.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={cn(
                            "h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                            idx < 3
                              ? "bg-[#2563EB] text-white"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="font-medium text-[#0F172A] truncate">
                            {branch.name}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {branch.leadDentist} • {branch.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {branch.city}, {branch.state}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {branch.patientCount}
                    </td>
                    <td className="py-2.5 px-3 text-right font-medium text-[#0F172A]">
                      {formatINR(branch.monthlyRevenue)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-[#10B981]">
                      {formatINR(branch.netProfit)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-blue-200">
                        {branch.complianceScore}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Cross-Module Approvals (POs & 0% EMIs) */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Live HQ Approvals
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-[#F59E0B] border border-amber-200">
              {pendingPos.length + pendingEmis.length} Pending
            </span>
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Branch Purchase Orders
            </div>
            <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1">
              {purchaseOrders.slice(0, 4).map((po) => (
                <div
                  key={po.id}
                  className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#0F172A] truncate">
                      {po.poNumber} • {formatINR(po.totalAmount)}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {po.branchName}
                    </div>
                  </div>
                  {po.status === "Ordered" ? (
                    <button
                      onClick={() => approvePurchaseOrder(po.id)}
                      className="px-2.5 py-1 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-medium shrink-0 cursor-pointer transition-colors"
                    >
                      Pack Order
                    </button>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#10B981] border border-emerald-200 shrink-0">
                      {po.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              0% EMI Financing Queue
            </div>
            <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1">
              {emiApplications.slice(0, 4).map((emi) => (
                <div
                  key={emi.id}
                  className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#0F172A] truncate">
                      {emi.patientName} • {formatINR(emi.amount)}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {emi.lender} • Score {emi.creditScore}
                    </div>
                  </div>
                  {emi.status === "Pending" ? (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => approveEmi(emi.id)}
                        title="Approve EMI"
                        className="p-1.5 rounded-md bg-[#10B981] hover:bg-emerald-600 text-white cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => declineEmi(emi.id)}
                        title="Decline EMI"
                        className="p-1.5 rounded-md bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-[#F43F5E] cursor-pointer"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 border",
                        emi.status === "Approved"
                          ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                          : "bg-rose-50 text-[#F43F5E] border-rose-200"
                      )}
                    >
                      {emi.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
