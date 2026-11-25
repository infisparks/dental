"use client";

import React, { useState } from "react";
import {
  MessageSquare,
  Mail,
  Smartphone,
  Sparkles,
  FileText,
  Send,
  CheckCheck,
  Calendar,
  ShoppingBag,
  HelpCircle,
  FileCheck2,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";
import { useDentAi } from "@/context/DentAiContext";
import { formatINR, cn } from "@/lib/utils";
import type { AutomationLog } from "@/types/dentai";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  attachments?: Array<{ name: string; size: string }>;
  actionChips?: Array<{ label: string; action: string }>;
}

const INITIAL_RULES: Array<{
  id: string;
  name: AutomationLog["ruleName"];
  channel: AutomationLog["channel"];
  trigger: string;
  enabled: boolean;
}> = [
  {
    id: "r1",
    name: "Booking Confirmation",
    channel: "WhatsApp",
    trigger: "Instant on Clinic Slot Booked",
    enabled: true,
  },
  {
    id: "r2",
    name: "24h Reminder",
    channel: "SMS",
    trigger: "T-24 hrs before Chair Time",
    enabled: true,
  },
  {
    id: "r3",
    name: "No-Show Recovery",
    channel: "Email",
    trigger: "15 mins after missed check-in",
    enabled: true,
  },
  {
    id: "r4",
    name: "Post-Visit Auto-PDF Delivery",
    channel: "WhatsApp",
    trigger: "On 'Complete Visit & Finalize Bill'",
    enabled: true,
  },
];

export function WhatsappSimulatorTab() {
  const {
    patients,
    d2cProducts,
    emiApplications,
    automationLogs,
    addAutomationLog,
    createAppointment,
    placeD2cOrder,
  } = useDentAi();

  const [rules, setRules] = useState(INITIAL_RULES);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m1",
      sender: "bot",
      text: "Namaste Aarav! I'm Riya AI from DentAI Pro — Dr. Bajaj Dental Network. How can I help with your dental care today?",
      time: "10:30 AM",
    },
  ]);

  const patient = patients[0]; // Aarav Sharma

  const toggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
    toast.info("Automation Rule Updated");
  };

  const pushChatTurn = (
    userText: string,
    botText: string,
    attachments?: ChatMessage["attachments"],
    actionChips?: ChatMessage["actionChips"]
  ) => {
    const now = "Just now";
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: "user", text: userText, time: now },
      {
        id: `b-${Date.now() + 1}`,
        sender: "bot",
        text: botText,
        time: now,
        attachments,
        actionChips,
      },
    ]);
  };

  const handlePostVisitDelivery = () => {
    pushChatTurn(
      "Trigger Post-Visit Auto-Delivery",
      "Thank you for visiting DentAI Pro — Bandra West! Here are your encrypted digital records for Tooth #36 (Root Canal + Zirconia Crown):",
      [
        { name: "Prescription_Aarav_Sharma.pdf", size: "184 KB" },
        { name: "Tax_Invoice_INR_100000.pdf", size: "240 KB" },
        { name: "Post_RCT_7Day_Care_Guide.pdf", size: "410 KB" },
      ]
    );
    addAutomationLog({
      ruleName: "Post-Visit Auto-PDF Delivery",
      channel: "WhatsApp",
      recipient: `${patient.name} (${patient.phone})`,
      summary: "Delivered Prescription PDF, ₹1,00,000 Invoice PDF & Care Guide",
      status: "Delivered",
    });
    toast.success("Post-Visit Auto-Delivery Sent on WhatsApp");
  };

  const handleAskFaqPrompt = (question?: string) => {
    const q = question ?? "Is root canal painful? Also do you have EMI for ₹1L treatment?";
    const reply = q.toLowerCase().includes("emi")
      ? "Yes! Our ₹1,00,000 Root Canal + Zirconia Crown package qualifies for 0% No-Cost EMI starting at ₹8,333/month (12 mos) via Bajaj Finserv Health & HDFC Ergo with instant Aadhaar e-KYC."
      : "Not at all! At DentAI Pro we use digital apex locators & computerized local anesthesia — single-sitting rotary RCT is virtually painless and takes 40 minutes. Plus you get 0% EMI starting ₹8,333/mo for ₹1L plans.";
    pushChatTurn(q, reply);
  };

  const handleBookViaWhatsapp = () => {
    pushChatTurn(
      "I want to book a follow-up appointment",
      "Sure Aarav! Dr. Meera Deshmukh has open slots at DentAI Pro — Bandra West. Tap a slot below to confirm instantly:",
      undefined,
      [
        { label: "Confirm Today 04:00 PM", action: "book_today" },
        { label: "Confirm Tomorrow 11:15 AM", action: "book_tomorrow" },
      ]
    );
  };

  const handleReorderToothpaste = () => {
    const paste = d2cProducts[0];
    pushChatTurn(
      "Reorder my prescribed sensitivity toothpaste",
      `Found your Rx item: ${paste.name} (${formatINR(
        paste.price
      )}). Tap below to confirm instant UPI order to Bandra West:`,
      undefined,
      [{ label: `Pay ${formatINR(paste.price)} via UPI`, action: "order_paste" }]
    );
  };

  const handleCheckEmiStatus = () => {
    const emi = emiApplications.find((e) => e.patientId === patient.id) ?? emiApplications[0];
    const reply =
      patient.outstandingBalance === 0
        ? `Great news Aarav! Your ₹1,00,000 0% EMI via ${emi?.lender ?? "Bajaj Finserv Health"} is APPROVED & DISBURSED to DentAI Pro Bandra West. Your clinic balance is ₹0.`
        : `Your 0% EMI application (${formatINR(emi?.amount ?? 100000)} • ${emi?.tenureMonths ?? 12} mos via ${emi?.lender ?? "Bajaj Finserv Health"}) is currently: ${emi?.status ?? "Pending"}.`;
    pushChatTurn("Check my 0% EMI approval status", reply);
    toast.info("WhatsApp EMI Status Checked");
  };

  const handleChipAction = (action: string) => {
    if (action === "book_today" || action === "book_tomorrow") {
      const date = action === "book_today" ? "2026-11-25" : "2026-11-26";
      const time = action === "book_today" ? "04:00 PM" : "11:15 AM";
      createAppointment({
        patientId: patient.id,
        branchId: "br-001",
        doctorName: "Dr. Meera Deshmukh",
        date,
        time,
        chair: "Chair 1",
        treatment: "WhatsApp Booked Follow-Up",
        estimatedAmount: 1500,
      });
      addAutomationLog({
        ruleName: "Booking Confirmation",
        channel: "WhatsApp",
        recipient: `${patient.name} (${patient.phone})`,
        summary: `Booked ${date} ${time} at Bandra West via Riya AI Chat`,
        status: "Delivered",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: `Confirmed! Your slot on ${date} at ${time} (DentAI Pro — Bandra West) is locked in Clinic ERP.`,
          time: "Just now",
        },
      ]);
    } else if (action === "order_paste") {
      const paste = d2cProducts[0];
      const ord = placeD2cOrder({
        items: [{ product: paste, qty: 1 }],
        address: "1402 Pali Hill Residency, Bandra West, Mumbai",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: `Order ${ord.orderNumber} confirmed! ${paste.name} will be delivered within 24 hours.`,
          time: "Just now",
        },
      ]);
    }
  };

  const handleSendText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    handleAskFaqPrompt(chatInput.trim());
    setChatInput("");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      {/* Left 6 Cols: Automation Rules & Logs */}
      <div className="xl:col-span-6 space-y-6">
        {/* Automation Rules */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Omnichannel Automation Rules
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
              Riya AI Engine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {rules.map((r) => (
              <div
                key={r.id}
                className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    {r.channel === "WhatsApp" ? (
                      <MessageSquare className="h-3.5 w-3.5 text-[#10B981]" />
                    ) : r.channel === "SMS" ? (
                      <Smartphone className="h-3.5 w-3.5 text-[#2563EB]" />
                    ) : (
                      <Mail className="h-3.5 w-3.5 text-[#4F46E5]" />
                    )}
                    <span className="text-xs font-semibold text-[#0F172A] truncate">
                      {r.name}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {r.trigger}
                  </div>
                </div>
                <button
                  onClick={() => toggleRule(r.id)}
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-semibold border cursor-pointer shrink-0",
                    r.enabled
                      ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  )}
                >
                  {r.enabled ? "Active" : "Paused"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Triggered Automation Logs */}
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#0F172A]">
              Live Omnichannel Dispatch Logs ({automationLogs.length})
            </h2>
            <span className="text-xs text-slate-500">WhatsApp • SMS • Email</span>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {automationLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] flex items-start justify-between gap-3 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] text-[10px] font-semibold">
                      {log.channel}
                    </span>
                    <span className="font-semibold text-[#0F172A]">
                      {log.ruleName}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-700">
                    To: <strong>{log.recipient}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {log.summary}
                  </div>
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold border inline-block",
                      log.status === "Suppressed (DPDP)"
                        ? "bg-amber-50 text-[#F59E0B] border-amber-200"
                        : "bg-emerald-50 text-[#10B981] border-emerald-200"
                    )}
                  >
                    {log.status}
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {log.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right 6 Cols: Interactive WhatsApp Simulator */}
      <div className="xl:col-span-6 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden flex flex-col h-[660px]">
        {/* WhatsApp Top Bar */}
        <div className="px-4 py-3 bg-[#075E54] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-white/15 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-emerald-200" />
            </div>
            <div>
              <div className="text-sm font-semibold">
                Riya AI • DentAI Pro WhatsApp
              </div>
              <div className="text-[11px] text-emerald-200">
                Official Business Account • Online
              </div>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/15">
            Live Simulator
          </span>
        </div>

        {/* Clickable Simulator Quick-Action Buttons */}
        <div className="px-3 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] flex flex-wrap gap-1.5">
          <button
            onClick={handlePostVisitDelivery}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-semibold cursor-pointer transition-colors"
          >
            <FileCheck2 className="h-3 w-3" />
            Trigger Post-Visit Auto-Delivery
          </button>
          <button
            onClick={() => handleAskFaqPrompt()}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-[#4F46E5] text-[#4F46E5] hover:text-white border border-indigo-200 text-[11px] font-semibold cursor-pointer transition-colors"
          >
            <HelpCircle className="h-3 w-3" />
            Ask AI FAQ
          </button>
          <button
            onClick={handleBookViaWhatsapp}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#EFF6FF] text-[#0F172A] hover:text-[#2563EB] border border-[#E2E8F0] text-[11px] font-semibold cursor-pointer transition-colors"
          >
            <Calendar className="h-3 w-3" />
            Book Appointment
          </button>
          <button
            onClick={handleReorderToothpaste}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-[#0F172A] hover:text-[#10B981] border border-[#E2E8F0] text-[11px] font-semibold cursor-pointer transition-colors"
          >
            <ShoppingBag className="h-3 w-3" />
            Reorder Toothpaste
          </button>
          <button
            onClick={handleCheckEmiStatus}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#EFF6FF] text-[#0F172A] hover:text-[#2563EB] border border-[#E2E8F0] text-[11px] font-semibold cursor-pointer transition-colors"
          >
            <CreditCard className="h-3 w-3" />
            Check EMI Status
          </button>
        </div>

        {/* Chat Messages Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#EFEAE2]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex",
                m.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-xl px-3.5 py-2.5 shadow-2xs text-xs space-y-2",
                  m.sender === "user"
                    ? "bg-[#D9FDD3] text-[#0F172A]"
                    : "bg-white text-[#0F172A]"
                )}
              >
                <p className="leading-relaxed">{m.text}</p>

                {m.attachments && (
                  <div className="space-y-1.5 pt-1">
                    {m.attachments.map((att) => (
                      <div
                        key={att.name}
                        className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center gap-2"
                      >
                        <FileText className="h-4 w-4 text-[#F43F5E] shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-semibold text-[#0F172A] truncate">
                            {att.name}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            PDF • {att.size}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {m.actionChips && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {m.actionChips.map((chip) => (
                      <button
                        key={chip.label}
                        onClick={() => handleChipAction(chip.action)}
                        className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-blue-200 text-[11px] font-semibold cursor-pointer transition-colors"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                )}

                <div className="text-[10px] text-slate-400 flex items-center justify-end gap-1">
                  <span>{m.time}</span>
                  {m.sender === "user" && (
                    <CheckCheck className="h-3 w-3 text-[#2563EB]" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendText}
          className="p-3 bg-[#F0F2F5] border-t border-[#E2E8F0] flex items-center gap-2"
        >
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a patient question (e.g., Is root canal painful?)..."
            className="flex-1 px-3.5 py-2 rounded-full border border-[#E2E8F0] bg-white text-xs focus:outline-none focus:border-[#2563EB]"
          />
          <button
            type="submit"
            className="h-9 w-9 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center cursor-pointer shrink-0"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
