"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  RefreshCw,
  CreditCard,
  ShoppingBag,
  Sparkles,
  CheckCircle2,
  Circle,
  X,
  Plus,
  Send,
  Flame,
  Video,
  PhoneCall,
  HeartPulse,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useDentAi } from "@/context/DentAiContext";
import { cn } from "@/lib/utils";
import type { Patient } from "@/types/dentai";

interface PatientHomeTabProps {
  patient: Patient;
  onNavigateTab: (
    tab: "home" | "finance" | "store" | "vault" | "privacy"
  ) => void;
}

const CARE_TIPS = [
  {
    id: "tip-1",
    day: "Day 1",
    text: "Bite gently on gauze for 30 mins; soft cold diet only",
  },
  {
    id: "tip-2",
    day: "Day 2",
    text: "Start lukewarm saltwater rinses 3x daily after meals",
  },
  {
    id: "tip-3",
    day: "Day 3",
    text: "Brush gently with BajajDent Nano-Hydroxyapatite paste",
  },
  {
    id: "tip-4",
    day: "Day 4",
    text: "Avoid nuts/hard crunch on lower left (#36) temporary seal",
  },
  {
    id: "tip-5",
    day: "Day 5",
    text: "Complete 5-day Clindamycin course without skipping doses",
  },
  {
    id: "tip-6",
    day: "Day 6",
    text: "Zero throbbing? Confirm Zirconia crown scan appointment",
  },
  {
    id: "tip-7",
    day: "Day 7",
    text: "Final Zirconia Crown cementation & bite check at Bandra West",
  },
];

export function PatientHomeTab({
  patient,
  onNavigateTab,
}: PatientHomeTabProps) {
  const { visits, rescheduleAppointment, createAppointment } = useDentAi();

  const upcomingVisit =
    visits.find(
      (v) => v.patientId === patient.id && v.status !== "Completed"
    ) ??
    visits.find((v) => v.patientId === patient.id) ??
    visits[0];

  const [checkedTips, setCheckedTips] = useState<Record<string, boolean>>({
    "tip-1": true,
    "tip-2": true,
  });

  // Daily Oral Hygiene Streak state
  const [amBrush, setAmBrush] = useState(true);
  const [pmFloss, setPmFloss] = useState(false);

  // Modals
  const [reschedOpen, setReschedOpen] = useState(false);
  const [newDate, setNewDate] = useState(upcomingVisit?.date ?? "2026-11-26");
  const [newTime, setNewTime] = useState("04:00 PM");

  const [bookOpen, setBookOpen] = useState(false);
  const [bookProc, setBookProc] = useState("Follow-Up Crown Cementation");
  const [bookDate, setBookDate] = useState("2026-11-28");
  const [bookTime, setBookTime] = useState("11:15 AM");

  const [faqOpen, setFaqOpen] = useState(false);
  const [faqQ, setFaqQ] = useState("Can I eat normally after a Root Canal?");
  const [faqAns, setFaqAns] = useState(
    "Wait until numbness wears off (approx. 2 hours), then eat soft foods on the opposite side until your Zirconia crown is cemented."
  );

  const [videoOpen, setVideoOpen] = useState(false);

  const toggleTip = (id: string) => {
    setCheckedTips((prev) => {
      const next = !prev[id];
      if (next) toast.success("Daily care milestone logged (+10 SmilePoints)");
      return { ...prev, [id]: next };
    });
  };

  const completedTipCount = CARE_TIPS.filter((t) => checkedTips[t.id]).length;
  const streakDays = 14 + (amBrush && pmFloss ? 1 : 0);

  const handleRescheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (upcomingVisit) {
      rescheduleAppointment(upcomingVisit.id, newDate, newTime);
    }
    setReschedOpen(false);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAppointment({
      patientId: patient.id,
      branchId: patient.branchId,
      doctorName: "Dr. Meera Deshmukh",
      date: bookDate,
      time: bookTime,
      chair: "Chair 1",
      treatment: bookProc,
      estimatedAmount: 2500,
    });
    setBookOpen(false);
  };

  return (
    <div className="space-y-3.5">
      {/* Oral Health Score + Daily Hygiene Streak Hero Card */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-3.5 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-full bg-[#EFF6FF] border-2 border-[#2563EB] flex flex-col items-center justify-center shrink-0">
            <span className="text-sm font-bold text-[#2563EB] leading-none">
              92
            </span>
            <span className="text-[8px] font-semibold text-slate-500">
              SCORE
            </span>
          </div>
          <div>
            <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1">
              SmileHealth Index
              <HeartPulse className="h-3.5 w-3.5 text-[#10B981]" />
            </div>
            <div className="text-[10px] text-slate-500">
              Tooth #36 Crown Milling • 48h ETA
            </div>
          </div>
        </div>

        <div className="text-right shrink-0">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-[#F59E0B] border border-amber-200 text-[10px] font-bold">
            <Flame className="h-3 w-3" />
            {streakDays}d Streak
          </div>
          <div className="mt-1.5 flex items-center justify-end gap-1">
            <button
              onClick={() => {
                setAmBrush((v) => !v);
                toast.success("Morning Brush Check-In Updated");
              }}
              className={cn(
                "px-1.5 py-0.5 rounded text-[9px] font-semibold border cursor-pointer",
                amBrush
                  ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                  : "bg-slate-50 text-slate-400 border-slate-200"
              )}
            >
              AM ✓
            </button>
            <button
              onClick={() => {
                setPmFloss((v) => !v);
                toast.success("Night Brush & Floss Logged (+15 pts)");
              }}
              className={cn(
                "px-1.5 py-0.5 rounded text-[9px] font-semibold border cursor-pointer",
                pmFloss
                  ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                  : "bg-slate-50 text-slate-400 border-slate-200"
              )}
            >
              PM {pmFloss ? "✓" : "+"}
            </button>
          </div>
        </div>
      </div>

      {/* Active Treatment Progress Bar */}
      <div className="rounded-2xl bg-gradient-to-br from-[#EFF6FF] via-white to-indigo-50/70 border border-blue-200/80 p-3.5 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-[#0F172A]">
            Root Canal + Zirconia Crown (#36)
          </span>
          <span className="font-semibold text-[#2563EB]">Step 2 of 3</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-[9px] font-semibold text-center">
          <div className="py-1 rounded-md bg-[#10B981] text-white">
            1. AI Scan &amp; RCT ✓
          </div>
          <div className="py-1 rounded-md bg-[#2563EB] text-white">
            2. Crown Lab (48h)
          </div>
          <div className="py-1 rounded-md bg-white text-slate-400 border border-slate-200">
            3. Cementation
          </div>
        </div>
      </div>

      {/* Upcoming Appointment Card */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-3.5 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2563EB] flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Upcoming Visit
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-blue-200">
            {upcomingVisit.status}
          </span>
        </div>

        <div>
          <div className="text-xs font-bold text-[#0F172A]">
            {upcomingVisit.treatment}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {upcomingVisit.doctorName} • {patient.branchName}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#0F172A]">
            <Clock className="h-3.5 w-3.5 text-[#2563EB]" />
            <span>
              {upcomingVisit.date} • {upcomingVisit.time}
            </span>
          </div>
          <button
            onClick={() => setReschedOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-blue-200 bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white text-[10px] font-semibold cursor-pointer transition-colors"
          >
            <RefreshCw className="h-3 w-3" />
            Reschedule
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          onClick={() => setBookOpen(true)}
          className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#2563EB] text-left space-y-1 cursor-pointer transition-all shadow-2xs"
        >
          <div className="h-7 w-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
            <Plus className="h-4 w-4" />
          </div>
          <div className="text-xs font-semibold text-[#0F172A]">
            Book Appointment
          </div>
          <div className="text-[10px] text-slate-500">104 Clinics Live</div>
        </button>

        <button
          onClick={() => onNavigateTab("finance")}
          className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#10B981] text-left space-y-1 cursor-pointer transition-all shadow-2xs"
        >
          <div className="h-7 w-7 rounded-lg bg-emerald-50 text-[#10B981] flex items-center justify-center">
            <CreditCard className="h-4 w-4" />
          </div>
          <div className="text-xs font-semibold text-[#0F172A]">
            0% Treatment EMI
          </div>
          <div className="text-[10px] text-slate-500">₹8,333/mo Instant</div>
        </button>

        <button
          onClick={() => onNavigateTab("store")}
          className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#F59E0B] text-left space-y-1 cursor-pointer transition-all shadow-2xs"
        >
          <div className="h-7 w-7 rounded-lg bg-amber-50 text-[#F59E0B] flex items-center justify-center">
            <ShoppingBag className="h-4 w-4" />
          </div>
          <div className="text-xs font-semibold text-[#0F172A]">
            Order Care Kit
          </div>
          <div className="text-[10px] text-slate-500">Dr. Sharma Rx Kit</div>
        </button>

        <button
          onClick={() => setFaqOpen(true)}
          className="p-3 rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] hover:border-[#4F46E5] text-left space-y-1 cursor-pointer transition-all shadow-2xs"
        >
          <div className="h-7 w-7 rounded-lg bg-indigo-50 text-[#4F46E5] flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-xs font-semibold text-[#0F172A]">Ask AI FAQ</div>
          <div className="text-[10px] text-slate-500">24×7 Dental Guide</div>
        </button>
      </div>

      {/* Video Consult & SOS Banner */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setVideoOpen(true)}
          className="p-2.5 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white text-[11px] font-semibold flex items-center justify-between cursor-pointer transition-colors"
        >
          <span className="inline-flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5" />
            Tele-Dentist (₹0)
          </span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() =>
            toast.info("Emergency Dental Helpline Connected", {
              description:
                "On-call MDS Dentist at Bandra West: +91 22 4811 2117",
            })
          }
          className="p-2.5 rounded-xl bg-rose-50 hover:bg-[#F43F5E] text-[#F43F5E] hover:text-white border border-rose-200 text-[11px] font-semibold flex items-center justify-between cursor-pointer transition-colors"
        >
          <span className="inline-flex items-center gap-1.5">
            <PhoneCall className="h-3.5 w-3.5" />
            SOS Toothache
          </span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Active Care Plan: Post-Root Canal 7-Day Care Tips */}
      <div className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-3.5 shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#0F172A]">
              Post-Root Canal 7-Day Care Plan
            </div>
            <div className="text-[10px] text-slate-500">
              Tap daily tips to track your recovery
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#10B981] border border-emerald-200">
            {completedTipCount}/{CARE_TIPS.length}
          </span>
        </div>

        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full bg-[#10B981] transition-all duration-300"
            style={{
              width: `${(completedTipCount / CARE_TIPS.length) * 100}%`,
            }}
          />
        </div>

        <div className="space-y-1.5">
          {CARE_TIPS.map((tip) => {
            const done = !!checkedTips[tip.id];
            return (
              <button
                key={tip.id}
                onClick={() => toggleTip(tip.id)}
                className={cn(
                  "w-full text-left p-2 rounded-xl border flex items-start gap-2 cursor-pointer transition-colors",
                  done
                    ? "bg-emerald-50/50 border-emerald-200"
                    : "bg-[#F8FAFC] border-[#E2E8F0] hover:border-blue-200"
                )}
              >
                {done ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981] shrink-0 mt-0.5" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-slate-300 shrink-0 mt-0.5" />
                )}
                <div className="text-[11px] leading-snug">
                  <span className="font-semibold text-[#2563EB] mr-1">
                    {tip.day}:
                  </span>
                  <span
                    className={
                      done ? "text-slate-500 line-through" : "text-[#0F172A]"
                    }
                  >
                    {tip.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reschedule Slot Bottom Sheet */}
      {reschedOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleRescheduleSubmit}
            className="bg-white w-full max-w-md rounded-t-3xl border-t border-x border-[#E2E8F0] shadow-2xl overflow-hidden pb-2"
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="text-sm font-semibold text-[#0F172A]">
                Self-Reschedule Slot
              </span>
              <button
                type="button"
                onClick={() => setReschedOpen(false)}
                className="p-1 text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Preferred Date
                </label>
                <select
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                >
                  <option value="2026-11-25">Wed, 25 Nov 2026</option>
                  <option value="2026-11-26">Thu, 26 Nov 2026</option>
                  <option value="2026-11-27">Fri, 27 Nov 2026</option>
                  <option value="2026-11-28">Sat, 28 Nov 2026</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Available Time Slot
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                >
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="12:00 PM">12:00 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:15 PM">05:15 PM</option>
                </select>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setReschedOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
              >
                Confirm New Slot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Book Appointment Bottom Sheet */}
      {bookOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs">
          <form
            onSubmit={handleBookSubmit}
            className="bg-white w-full max-w-md rounded-t-3xl border-t border-x border-[#E2E8F0] shadow-2xl overflow-hidden pb-2"
          >
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="text-sm font-semibold text-[#0F172A]">
                Book Clinic Visit
              </span>
              <button
                type="button"
                onClick={() => setBookOpen(false)}
                className="p-1 text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-600 mb-1">
                  Reason / Service
                </label>
                <select
                  value={bookProc}
                  onChange={(e) => setBookProc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                >
                  <option value="Follow-Up Crown Cementation">
                    Follow-Up Crown Cementation
                  </option>
                  <option value="AI Preventive Dental Checkup">
                    AI Preventive Dental Checkup
                  </option>
                  <option value="Ultrasonic Scaling & Polishing">
                    Ultrasonic Scaling &amp; Polishing
                  </option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={bookDate}
                  onChange={(e) => setBookDate(e.target.value)}
                  className="px-2.5 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                >
                  <option value="2026-11-27">27 Nov</option>
                  <option value="2026-11-28">28 Nov</option>
                  <option value="2026-11-29">29 Nov</option>
                </select>
                <select
                  value={bookTime}
                  onChange={(e) => setBookTime(e.target.value)}
                  className="px-2.5 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                >
                  <option value="11:15 AM">11:15 AM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:15 PM">05:15 PM</option>
                </select>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBookOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-white text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
              >
                Book Slot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ask AI FAQ Bottom Sheet */}
      {faqOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-t-3xl border-t border-x border-[#E2E8F0] shadow-2xl overflow-hidden pb-3">
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
              <span className="text-sm font-semibold text-[#4F46E5] flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                DentAI Patient FAQ Assistant
              </span>
              <button
                onClick={() => setFaqOpen(false)}
                className="p-1 text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="flex flex-wrap gap-1.5">
                {[
                  [
                    "Can I eat normally after a Root Canal?",
                    "Wait until numbness wears off (approx. 2 hours), then eat soft foods on the opposite side until your Zirconia crown is cemented.",
                  ],
                  [
                    "Is 0% EMI truly interest-free?",
                    "Yes! DentAI Pro absorbs the subvention fee with Bajaj Finserv Health & HDFC Ergo for 3–24 month tenures.",
                  ],
                  [
                    "When is my Zirconia Crown ready?",
                    "CAD/CAM digital crowns are milled within 48 hours at our central lab and delivered to Bandra West.",
                  ],
                ].map(([q, a]) => (
                  <button
                    key={q}
                    onClick={() => {
                      setFaqQ(q);
                      setFaqAns(a);
                    }}
                    className="px-2.5 py-1 rounded-full bg-indigo-50 text-[#4F46E5] border border-indigo-200 text-[11px] font-medium cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5">
                <div className="font-semibold text-[#0F172A] flex items-center gap-1">
                  <Send className="h-3 w-3 text-[#4F46E5]" />
                  {faqQ}
                </div>
                <p className="text-slate-600 leading-relaxed">{faqAns}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tele-Dentist Video Consult Bottom Sheet */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-t-3xl border-t border-x border-[#E2E8F0] shadow-2xl overflow-hidden pb-3">
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <span className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <Video className="h-4 w-4 text-[#4F46E5]" />
                Instant Tele-Dentist (VIP Free)
              </span>
              <button
                onClick={() => setVideoOpen(false)}
                className="p-1 text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-3 text-xs">
              <div className="h-32 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-white p-4 flex flex-col justify-between">
                <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-semibold self-start">
                  ● Dr. Meera Deshmukh Online
                </span>
                <div>
                  <div className="font-bold text-sm">
                    10-Min Post-Op Video Check
                  </div>
                  <div className="text-[11px] text-blue-100">
                    Share intraoral camera photo or ask recovery questions
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setVideoOpen(false);
                  toast.success("Video Consult Room Joined", {
                    description:
                      "Dr. Meera Deshmukh will connect within 45 seconds.",
                  });
                }}
                className="w-full py-2.5 rounded-xl bg-[#2563EB] text-white font-semibold cursor-pointer"
              >
                Start HD Video Call Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
