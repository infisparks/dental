"use client";

import React, { useState } from "react";
import {
  CreditCard,
  Shield,
  CheckCircle2,
  Sparkles,
  Landmark,
  FileText,
  ArrowRight,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useDentAi } from "@/context/DentAiContext";
import { formatINR, cn } from "@/lib/utils";
import type { EmiApplication, InsuranceClaim, Patient } from "@/types/dentai";

const TENURES = [3, 6, 9, 12, 24] as const;

const CLAIM_STEPS: InsuranceClaim["status"][] = [
  "Submitted",
  "Under Review",
  "Approved/Settled",
];

export function PatientFinanceTab({ patient }: { patient: Patient }) {
  const {
    insurancePlans,
    purchasedPolicies,
    insuranceClaims,
    disbursePatientEmi,
    purchaseInsurancePolicy,
    fileInsuranceClaim,
    advanceInsuranceClaim,
  } = useDentAi();

  const [financeMode, setFinanceMode] = useState<"emi" | "insurance">("emi");

  // EMI & KYC Engine state
  const [tenure, setTenure] = useState<number>(12);
  const [kycActive, setKycActive] = useState(false);
  const [kycStep, setKycStep] = useState<1 | 2 | 3>(1);
  const [pan, setPan] = useState("ABCDE1234F");
  const [aadhaar, setAadhaar] = useState("8421-9910-4821");
  const [otpVerified, setOtpVerified] = useState(false);
  const [selectedLender, setSelectedLender] = useState<
    EmiApplication["lender"]
  >("Bajaj Finserv Health");

  // Insurance Sub-tabs
  const [insSubTab, setInsSubTab] = useState<"buy" | "claim">("buy");
  const [selectedInvoiceIdx, setSelectedInvoiceIdx] = useState(0);

  const planAmount = 100000; // ₹1,00,000 Root Canal + Crown USP
  const isAlreadyDisbursed = patient.outstandingBalance === 0;
  const monthlyEmi = Math.round(planAmount / tenure);

  const handleVerifyOtp = () => {
    if (!pan.trim() || !aadhaar.trim()) return;
    setOtpVerified(true);
    toast.success("PAN & Aadhaar e-KYC Verified", {
      description: `CIBIL Score: 796 • Pre-approved for ₹2,50,000 0% Dental Line.`,
    });
  };

  const handleMandateAndDisburse = () => {
    disbursePatientEmi({
      patientId: patient.id,
      treatment: "Root Canal + Zirconia Crown (Tooth #36)",
      amount: planAmount,
      tenureMonths: tenure,
      lender: selectedLender,
    });
    setKycStep(3);
  };

  const claimableInvoices = patient.visitHistory.filter((v) => v.amount > 0);
  const chosenInvoice = claimableInvoices[selectedInvoiceIdx] ?? {
    id: "inv-36",
    date: "2026-11-25",
    procedure: "Root Canal + Zirconia Crown (#36)",
    amount: 100000,
  };

  return (
    <div className="space-y-4">
      {/* Top Switcher: 0% EMI & KYC vs Dental Insurance */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-1 flex gap-1 shadow-2xs">
        <button
          onClick={() => setFinanceMode("emi")}
          className={cn(
            "flex-1 py-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors",
            financeMode === "emi"
              ? "bg-[#2563EB] text-white"
              : "text-slate-600 hover:text-[#0F172A]"
          )}
        >
          <CreditCard className="h-3.5 w-3.5" />
          0% EMI &amp; KYC
        </button>
        <button
          onClick={() => setFinanceMode("insurance")}
          className={cn(
            "flex-1 py-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors",
            financeMode === "insurance"
              ? "bg-[#2563EB] text-white"
              : "text-slate-600 hover:text-[#0F172A]"
          )}
        >
          <Shield className="h-3.5 w-3.5" />
          Dental Insurance ({purchasedPolicies.length})
        </button>
      </div>

      {/* MODULE 2: Treatment Loan / EMI & Digital KYC Engine */}
      {financeMode === "emi" && (
        <div className="space-y-4">
          {/* Active ₹1,00,000 Treatment Plan Card */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4F46E5]">
                <Sparkles className="h-3.5 w-3.5" />
                Active Treatment Invoice
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                  isAlreadyDisbursed
                    ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                    : "bg-amber-50 text-[#F59E0B] border-amber-200"
                )}
              >
                {isAlreadyDisbursed ? "EMI Disbursed" : "Payment Due"}
              </span>
            </div>

            <div className="text-sm font-bold text-[#0F172A]">
              Root Canal + Zirconia Crown (Tooth #36)
            </div>

            <div className="flex items-baseline justify-between pt-2 border-t border-slate-100">
              <span className="text-xs text-slate-500">Treatment Total</span>
              <span className="text-xl font-bold text-[#0F172A]">
                {formatINR(planAmount)}
              </span>
            </div>

            {!kycActive && !isAlreadyDisbursed && (
              <button
                onClick={() => {
                  setKycActive(true);
                  setKycStep(1);
                }}
                className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                Convert to Easy 0% EMI
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Interactive EMI Calculator */}
          <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0F172A]">
                Interactive 0% EMI Calculator
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#10B981] border border-emerald-200">
                0% Interest • Zero Foreclosure
              </span>
            </div>

            {/* Tenure Tabs (3, 6, 9, 12, 24) */}
            <div className="grid grid-cols-5 gap-1.5">
              {TENURES.map((m) => (
                <button
                  key={m}
                  onClick={() => setTenure(m)}
                  className={cn(
                    "py-1.5 rounded-lg text-[11px] font-semibold border cursor-pointer transition-colors",
                    tenure === m
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "bg-[#F8FAFC] text-slate-600 border-[#E2E8F0]"
                  )}
                >
                  {m}M
                </button>
              ))}
            </div>

            {/* Slider */}
            <input
              type="range"
              min={0}
              max={TENURES.length - 1}
              step={1}
              value={TENURES.indexOf(tenure as (typeof TENURES)[number])}
              onChange={(e) => setTenure(TENURES[Number(e.target.value)])}
              className="w-full accent-[#2563EB] cursor-pointer"
            />

            <div className="p-3 rounded-xl bg-[#EFF6FF] border border-blue-200 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-600">
                  Monthly Installment ({tenure} mos)
                </div>
                <div className="text-[10px] text-[#2563EB] font-medium">
                  Auto-debit via UPI / e-Mandate
                </div>
              </div>
              <div className="text-lg font-bold text-[#2563EB]">
                {formatINR(monthlyEmi)}
                <span className="text-xs font-normal">/mo</span>
              </div>
            </div>
          </div>

          {/* 3-Step Clickable Digital KYC Flow */}
          {(kycActive || isAlreadyDisbursed) && (
            <div className="rounded-2xl bg-[#FFFFFF] border border-blue-200 p-4 shadow-2xs space-y-4">
              {/* Stepper Header */}
              <div className="flex items-center justify-between text-[11px] font-semibold">
                {[
                  [1, "1. PAN & Aadhaar"],
                  [2, "2. e-Mandate"],
                  [3, "3. Disbursed"],
                ].map(([num, label]) => {
                  const active = (isAlreadyDisbursed ? 3 : kycStep) >= Number(num);
                  return (
                    <span
                      key={num}
                      className={cn(
                        "px-2 py-1 rounded-md",
                        active
                          ? "bg-[#EFF6FF] text-[#2563EB]"
                          : "text-slate-400"
                      )}
                    >
                      {label}
                    </span>
                  );
                })}
              </div>

              {!isAlreadyDisbursed && kycStep === 1 && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">
                      PAN Card Number *
                    </label>
                    <input
                      type="text"
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-600 mb-1">
                      Aadhaar Number (UIDAI) *
                    </label>
                    <input
                      type="text"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] font-mono"
                    />
                  </div>

                  {!otpVerified ? (
                    <button
                      onClick={handleVerifyOtp}
                      className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold cursor-pointer"
                    >
                      Verify Aadhaar OTP
                    </button>
                  ) : (
                    <div className="space-y-2.5">
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[#10B981] font-semibold flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        e-KYC Verified • CIBIL 796 Approved
                      </div>
                      <button
                        onClick={() => setKycStep(2)}
                        className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold cursor-pointer"
                      >
                        Continue to Bank Offers →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {!isAlreadyDisbursed && kycStep === 2 && (
                <div className="space-y-3 text-xs">
                  <div className="font-semibold text-[#0F172A]">
                    Select Partner Bank / NBFC Sanction Offer
                  </div>
                  {(
                    [
                      ["Bajaj Finserv Health", "0% APR • Instant Approval"],
                      ["HDFC Ergo Care", "0% APR • Zero Processing Fee"],
                      ["SaveIN Dental", "0% APR • UPI AutoPay"],
                    ] as const
                  ).map(([bank, desc]) => (
                    <button
                      key={bank}
                      onClick={() => setSelectedLender(bank)}
                      className={cn(
                        "w-full p-3 rounded-xl border text-left flex items-center justify-between cursor-pointer",
                        selectedLender === bank
                          ? "border-[#2563EB] bg-[#EFF6FF]"
                          : "border-[#E2E8F0] bg-[#F8FAFC]"
                      )}
                    >
                      <div>
                        <div className="font-semibold text-[#0F172A] flex items-center gap-1.5">
                          <Landmark className="h-3.5 w-3.5 text-[#2563EB]" />
                          {bank}
                        </div>
                        <div className="text-[11px] text-slate-500">{desc}</div>
                      </div>
                      <span className="font-bold text-[#2563EB]">
                        {formatINR(monthlyEmi)}/mo
                      </span>
                    </button>
                  ))}

                  <button
                    onClick={handleMandateAndDisburse}
                    className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lock className="h-3.5 w-3.5" />
                    Setup e-Mandate &amp; Disburse to Clinic
                  </button>
                </div>
              )}

              {(kycStep === 3 || isAlreadyDisbursed) && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="h-9 w-9 text-[#10B981] mx-auto" />
                  <div className="text-sm font-bold text-[#0F172A]">
                    EMI Approved &amp; Disbursed to Clinic!
                  </div>
                  <p className="text-[11px] text-slate-600">
                    {formatINR(planAmount)} settled directly to{" "}
                    {patient.branchName} via {selectedLender}. Your invoice
                    balance is now ₹0.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* MODULE 3: Dental Insurance Distribution & Claim Processing */}
      {financeMode === "insurance" && (
        <div className="space-y-4">
          <div className="inline-flex bg-[#FFFFFF] border border-[#E2E8F0] p-1 rounded-xl w-full">
            <button
              onClick={() => setInsSubTab("buy")}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer",
                insSubTab === "buy"
                  ? "bg-[#2563EB] text-white"
                  : "text-slate-600"
              )}
            >
              Buy Cover ({insurancePlans.length})
            </button>
            <button
              onClick={() => setInsSubTab("claim")}
              className={cn(
                "flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer",
                insSubTab === "claim"
                  ? "bg-[#2563EB] text-white"
                  : "text-slate-600"
              )}
            >
              File &amp; Track Claim ({insuranceClaims.length})
            </button>
          </div>

          {insSubTab === "buy" ? (
            <div className="space-y-3">
              {insurancePlans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-semibold text-[#2563EB]">
                        {plan.insurer}
                      </div>
                      <div className="text-sm font-bold text-[#0F172A]">
                        {plan.planName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Cover: {formatINR(plan.coverageAmount)} •{" "}
                        {plan.waitingPeriod}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold text-[#0F172A]">
                        {formatINR(plan.annualPremium)}
                      </div>
                      <div className="text-[10px] text-slate-400">/year</div>
                    </div>
                  </div>

                  <ul className="space-y-1 text-[11px] text-slate-600">
                    {plan.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-[#10B981] shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => purchaseInsurancePolicy(plan.id)}
                    className="w-full py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Purchase Policy
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {/* File New Claim Card */}
              <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-4 shadow-2xs space-y-3 text-xs">
                <div className="font-bold text-[#0F172A] flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#2563EB]" />
                  File New Cashless / Reimbursement Claim
                </div>
                <select
                  value={selectedInvoiceIdx}
                  onChange={(e) =>
                    setSelectedInvoiceIdx(Number(e.target.value))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                >
                  {claimableInvoices.map((inv, idx) => (
                    <option key={inv.id} value={idx}>
                      {inv.date} — {inv.procedure} ({formatINR(inv.amount)})
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500">
                  Policy:{" "}
                  <span className="font-semibold text-[#0F172A]">
                    {purchasedPolicies[0]?.policyNumber ?? "DBN-INS-88412"}
                  </span>{" "}
                  • Auto-attaches Invoice PDF &amp; OPG X-Ray
                </div>
                <button
                  onClick={() =>
                    fileInsuranceClaim({
                      policyNumber:
                        purchasedPolicies[0]?.policyNumber ?? "DBN-INS-88412",
                      invoiceRef: `INV-${chosenInvoice.date.replace(/-/g, "")}`,
                      procedure: chosenInvoice.procedure,
                      claimAmount: chosenInvoice.amount,
                    })
                  }
                  className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold cursor-pointer"
                >
                  File Insurance Claim ({formatINR(chosenInvoice.amount)})
                </button>
              </div>

              {/* Claim Tracker */}
              <div className="space-y-3">
                {insuranceClaims.map((clm) => {
                  const idx = CLAIM_STEPS.indexOf(clm.status);
                  return (
                    <div
                      key={clm.id}
                      className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-4 shadow-2xs space-y-3 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-mono font-bold text-[#2563EB]">
                            {clm.claimNumber}
                          </div>
                          <div className="font-semibold text-[#0F172A]">
                            {clm.procedure}
                          </div>
                        </div>
                        <span className="font-bold text-[#0F172A]">
                          {formatINR(clm.claimAmount)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 flex-wrap">
                        {CLAIM_STEPS.map((st, sIdx) => (
                          <span
                            key={st}
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                              clm.status === "Approved/Settled" && sIdx <= idx
                                ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                                : sIdx === idx
                                ? "bg-[#2563EB] text-white border-[#2563EB]"
                                : sIdx < idx
                                ? "bg-[#EFF6FF] text-[#2563EB] border-blue-200"
                                : "bg-slate-50 text-slate-400 border-slate-200"
                            )}
                          >
                            {st}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span className="text-[10px] text-slate-400">
                          Attached: {clm.attachments.join(", ")}
                        </span>
                        {clm.status !== "Approved/Settled" && (
                          <button
                            onClick={() => advanceInsuranceClaim(clm.id)}
                            className="text-[11px] font-semibold text-[#2563EB] hover:underline cursor-pointer"
                          >
                            Advance Stage →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
