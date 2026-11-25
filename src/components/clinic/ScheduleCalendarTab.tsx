"use client";

import React, { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  RefreshCw,
  UserCheck,
  X,
  Stethoscope,
} from "lucide-react";
import { useDentAi } from "@/context/DentAiContext";
import { formatINR, cn } from "@/lib/utils";
import type { Visit } from "@/types/dentai";

interface ScheduleCalendarTabProps {
  branchId: string;
  onOpenPatientEdr: (patientId: string) => void;
}

const TIME_SLOTS = [
  "09:30 AM",
  "10:30 AM",
  "11:15 AM",
  "12:00 PM",
  "02:30 PM",
  "04:00 PM",
  "05:15 PM",
];

const WEEK_DAYS = [
  { date: "2026-11-25", label: "Wed, Nov 25 (Today)" },
  { date: "2026-11-26", label: "Thu, Nov 26" },
  { date: "2026-11-27", label: "Fri, Nov 27" },
  { date: "2026-11-28", label: "Sat, Nov 28" },
  { date: "2026-11-29", label: "Sun, Nov 29" },
];

const PROCEDURES = [
  { name: "Root Canal + Zirconia Crown", cost: 100000 },
  { name: "Straumann Titanium Implant", cost: 145000 },
  { name: "Invisalign Aligner Scan", cost: 65000 },
  { name: "Laser Whitening & Prophylaxis", cost: 18500 },
  { name: "Nano-Hybrid Composite Filling", cost: 4500 },
];

const STATUS_BADGE: Record<Visit["status"], string> = {
  Scheduled: "bg-[#EFF6FF] text-[#2563EB] border-blue-200",
  "Checked-In": "bg-amber-50 text-[#F59E0B] border-amber-200",
  "In-Chair": "bg-indigo-50 text-[#4F46E5] border-indigo-200",
  "AI Scan Ready": "bg-indigo-50 text-[#4F46E5] border-indigo-200",
  Completed: "bg-emerald-50 text-[#10B981] border-emerald-200",
};

export function ScheduleCalendarTab({
  branchId,
  onOpenPatientEdr,
}: ScheduleCalendarTabProps) {
  const {
    branches,
    patients,
    visits,
    createAppointment,
    rescheduleAppointment,
    advanceVisitStatus,
  } = useDentAi();

  const [viewMode, setViewMode] = useState<"day" | "week">("day");
  const [selectedDate, setSelectedDate] = useState("2026-11-25");

  // New Appointment Modal
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [newPatientId, setNewPatientId] = useState(patients[0].id);
  const [newTime, setNewTime] = useState("04:00 PM");
  const [newDate, setNewDate] = useState("2026-11-25");
  const [newChair, setNewChair] = useState("Chair 1");
  const [newProcIdx, setNewProcIdx] = useState(0);

  // Reschedule Modal
  const [rescheduleTarget, setRescheduleTarget] = useState<Visit | null>(null);
  const [reschedDate, setReschedDate] = useState("2026-11-26");
  const [reschedTime, setReschedTime] = useState("04:00 PM");

  const activeBranch =
    branches.find((b) => b.id === branchId) ?? branches[0];

  const dayVisits = useMemo(
    () => visits.filter((v) => v.date === selectedDate),
    [visits, selectedDate]
  );

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const proc = PROCEDURES[newProcIdx];
    createAppointment({
      patientId: newPatientId,
      branchId: activeBranch.id,
      doctorName: activeBranch.leadDentist,
      date: newDate,
      time: newTime,
      chair: newChair,
      treatment: proc.name,
      estimatedAmount: proc.cost,
    });
    setNewModalOpen(false);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rescheduleTarget) return;
    rescheduleAppointment(rescheduleTarget.id, reschedDate, reschedTime);
    setRescheduleTarget(null);
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg">
            <button
              onClick={() => setViewMode("day")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors",
                viewMode === "day"
                  ? "bg-[#2563EB] text-white"
                  : "text-slate-600 hover:text-[#0F172A]"
              )}
            >
              Day Slots
            </button>
            <button
              onClick={() => setViewMode("week")}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors",
                viewMode === "week"
                  ? "bg-[#2563EB] text-white"
                  : "text-slate-600 hover:text-[#0F172A]"
              )}
            >
              Week Overview
            </button>
          </div>

          {viewMode === "day" && (
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            >
              {WEEK_DAYS.map((d) => (
                <option key={d.date} value={d.date}>
                  {d.label}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          onClick={() => {
            setNewDate(selectedDate);
            setNewModalOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          New Appointment
        </button>
      </div>

      {/* Day View Slot Calendar */}
      {viewMode === "day" && (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
              <CalendarIcon className="h-4 w-4 text-[#2563EB]" />
              Doctor Chair Schedule — {selectedDate}
            </h2>
            <span className="text-xs text-slate-500">
              {dayVisits.length} booked •{" "}
              {Math.max(0, TIME_SLOTS.length - dayVisits.length)} open slots
            </span>
          </div>

          <div className="space-y-2.5">
            {TIME_SLOTS.map((slot) => {
              const slotVisits = dayVisits.filter((v) => v.time === slot);
              if (slotVisits.length === 0) {
                return (
                  <div
                    key={slot}
                    className="p-3.5 rounded-xl border border-dashed border-[#E2E8F0] bg-[#F8FAFC]/60 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500 w-20">
                        {slot}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#10B981] border border-emerald-200">
                        Available Slot
                      </span>
                      <span className="text-xs text-slate-400 hidden sm:inline">
                        Chair open for consultation or AI scan
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setNewDate(selectedDate);
                        setNewTime(slot);
                        setNewModalOpen(true);
                      }}
                      className="px-3 py-1 rounded-lg border border-blue-200 bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      + Book Slot
                    </button>
                  </div>
                );
              }

              return slotVisits.map((visit) => (
                <div
                  key={visit.id}
                  className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] hover:border-blue-200 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <div className="px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold shrink-0 text-center min-w-[78px]">
                      {visit.time}
                      <div className="text-[10px] font-normal text-slate-500">
                        {visit.chair}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => onOpenPatientEdr(visit.patientId)}
                          className="text-sm font-semibold text-[#0F172A] hover:text-[#2563EB] underline-offset-2 hover:underline cursor-pointer text-left"
                        >
                          {visit.patientName}
                        </button>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                            STATUS_BADGE[visit.status]
                          )}
                        >
                          {visit.status}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {visit.treatment} •{" "}
                        <span className="font-semibold text-[#0F172A]">
                          {formatINR(visit.estimatedAmount)}
                        </span>{" "}
                        • {visit.doctorName}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {visit.status === "Scheduled" && (
                      <button
                        onClick={() =>
                          advanceVisitStatus(visit.id, "Checked-In")
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-amber-200 bg-amber-50 hover:bg-[#F59E0B] text-[#F59E0B] hover:text-white text-xs font-medium cursor-pointer transition-colors"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        Check-In
                      </button>
                    )}
                    {visit.status !== "Completed" && (
                      <button
                        onClick={() => {
                          setRescheduleTarget(visit);
                          setReschedDate(visit.date);
                          setReschedTime(visit.time);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3" />
                        Reschedule
                      </button>
                    )}
                    <button
                      onClick={() => onOpenPatientEdr(visit.patientId)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      <Stethoscope className="h-3.5 w-3.5" />
                      Open EDR
                    </button>
                  </div>
                </div>
              ));
            })}
          </div>
        </div>
      )}

      {/* Week Overview Grid */}
      {viewMode === "week" && (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
          {WEEK_DAYS.map((d) => {
            const list = visits.filter((v) => v.date === d.date);
            return (
              <div
                key={d.date}
                className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-semibold text-[#0F172A]">
                    {d.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#EFF6FF] text-[#2563EB]">
                    {list.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {list.length === 0 ? (
                    <button
                      onClick={() => {
                        setNewDate(d.date);
                        setNewModalOpen(true);
                      }}
                      className="w-full py-6 rounded-lg border border-dashed border-[#E2E8F0] text-xs text-slate-400 hover:border-[#2563EB] hover:text-[#2563EB] cursor-pointer transition-colors"
                    >
                      + All Slots Open
                    </button>
                  ) : (
                    list.map((v) => (
                      <div
                        key={v.id}
                        onClick={() => onOpenPatientEdr(v.patientId)}
                        className="p-2.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#2563EB] cursor-pointer space-y-1 transition-colors"
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-[#2563EB] flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" />
                            {v.time}
                          </span>
                          <span className="text-slate-400">{v.status}</span>
                        </div>
                        <div className="text-xs font-semibold text-[#0F172A]">
                          {v.patientName}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {v.treatment}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Appointment Right Sidebar */}
      {newModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/35 backdrop-blur-xs">
          <form
            onSubmit={handleCreateAppointment}
            className="bg-[#FFFFFF] w-full max-w-md h-full border-l border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#2563EB]">
                  {activeBranch.name}
                </div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  Book New Appointment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setNewModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1 overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Patient *
                </label>
                <select
                  value={newPatientId}
                  onChange={(e) => setNewPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs bg-[#F8FAFC]"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Date *
                  </label>
                  <select
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs bg-[#F8FAFC]"
                  >
                    {WEEK_DAYS.map((d) => (
                      <option key={d.date} value={d.date}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Time Slot *
                  </label>
                  <select
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs bg-[#F8FAFC]"
                  >
                    {TIME_SLOTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Chair
                  </label>
                  <select
                    value={newChair}
                    onChange={(e) => setNewChair(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs bg-[#F8FAFC]"
                  >
                    <option value="Chair 1">Chair 1 (Endo Suite)</option>
                    <option value="Chair 2">Chair 2 (Restorative)</option>
                    <option value="Chair 3">Chair 3 (Implant OT)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Procedure *
                  </label>
                  <select
                    value={newProcIdx}
                    onChange={(e) => setNewProcIdx(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs bg-[#F8FAFC]"
                  >
                    {PROCEDURES.map((pr, idx) => (
                      <option key={pr.name} value={idx}>
                        {pr.name} ({formatINR(pr.cost)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reschedule Right Sidebar */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/35 backdrop-blur-xs">
          <form
            onSubmit={handleConfirmReschedule}
            className="bg-[#FFFFFF] w-full max-w-md h-full border-l border-[#E2E8F0] shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-[#2563EB]">
                  Reschedule Appointment
                </div>
                <h3 className="text-base font-semibold text-[#0F172A]">
                  {rescheduleTarget.patientName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 flex-1">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  New Date
                </label>
                <select
                  value={reschedDate}
                  onChange={(e) => setReschedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs bg-[#F8FAFC]"
                >
                  {WEEK_DAYS.map((d) => (
                    <option key={d.date} value={d.date}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  New Time Slot
                </label>
                <select
                  value={reschedTime}
                  onChange={(e) => setReschedTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] text-xs bg-[#F8FAFC]"
                >
                  {TIME_SLOTS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                className="px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
              >
                Save Reschedule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
