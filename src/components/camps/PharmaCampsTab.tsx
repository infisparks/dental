"use client";

import React, { useMemo, useState } from "react";
import {
  Building2,
  Calendar,
  UserPlus,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Ticket,
  Sparkles,
} from "lucide-react";
import { useDentAi } from "@/context/DentAiContext";
import { cn } from "@/lib/utils";
import type { CampCampaign, City } from "@/types/dentai";

const DENTAL_ISSUES = [
  "Molar Toothache / RCT Eval",
  "Missing Tooth / Implant Consult",
  "Scaling & Gum Bleeding",
  "Clear Aligner / Braces Check",
  "Preventive AI Oral Screening",
];

export function PharmaCampsTab() {
  const { branches, camps, campLeads, registerCampAttendee, launchCamp } =
    useDentAi();

  const [selectedCampId, setSelectedCampId] = useState(camps[0].id);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [dentalIssue, setDentalIssue] = useState(DENTAL_ISSUES[0]);
  const [dpdpConsent, setDpdpConsent] = useState(true);

  const [newCampOpen, setNewCampOpen] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState("");
  const [newPharma, setNewPharma] = useState("Lupin Oral Care");
  const [newCity, setNewCity] = useState<City>("Mumbai");
  const [newChannel, setNewChannel] =
    useState<CampCampaign["channel"]>("WhatsApp");

  const activeCamp = camps.find((c) => c.id === selectedCampId) ?? camps[0];

  const autoAssignedBranch = useMemo(() => {
    const match = branches.find((b) => b.city === activeCamp.city);
    return match?.name ?? branches[0].name;
  }, [branches, activeCamp.city]);

  const handleRegisterAttendee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !dpdpConsent) return;
    registerCampAttendee({
      campId: activeCamp.id,
      name: name.trim(),
      phone: phone.trim(),
      dentalIssue,
      assignedBranch: autoAssignedBranch,
      dpdpConsentGranted: dpdpConsent,
    });
    setName("");
    setPhone("+91 ");
  };

  const handleLaunchNewCamp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle.trim()) return;
    launchCamp({
      title: newCampTitle.trim(),
      partnerPharma: newPharma,
      city: newCity,
      channel: newChannel,
    });
    setNewCampTitle("");
    setNewCampOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Camps Grid */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-[#0F172A]">
              Co-Branded Pharma &amp; Corporate Dental Camps ({camps.length})
            </h2>
            <p className="text-xs text-slate-500">
              Click any camp to target lead capture or launch a new screening
              drive
            </p>
          </div>
          <button
            onClick={() => setNewCampOpen((v) => !v)}
            className="px-3.5 py-2 rounded-lg bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-blue-200 text-xs font-semibold cursor-pointer transition-colors self-start"
          >
            + New Pharma Camp
          </button>
        </div>

        {newCampOpen && (
          <form
            onSubmit={handleLaunchNewCamp}
            className="p-4 rounded-xl border border-blue-200 bg-[#EFF6FF]/50 grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs"
          >
            <input
              type="text"
              required
              value={newCampTitle}
              onChange={(e) => setNewCampTitle(e.target.value)}
              placeholder="Camp Title (e.g. TCS Smile Drive)"
              className="sm:col-span-2 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white"
            />
            <input
              type="text"
              value={newPharma}
              onChange={(e) => setNewPharma(e.target.value)}
              placeholder="Pharma Partner"
              className="px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white"
            />
            <div className="flex gap-2">
              <select
                value={newCity}
                onChange={(e) => setNewCity(e.target.value as City)}
                className="flex-1 px-2.5 py-2 rounded-lg border border-[#E2E8F0] bg-white"
              >
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
              <select
                value={newChannel}
                onChange={(e) =>
                  setNewChannel(e.target.value as CampCampaign["channel"])
                }
                className="px-2 py-2 rounded-lg border border-[#E2E8F0] bg-white"
              >
                <option value="WhatsApp">WA</option>
                <option value="SMS">SMS</option>
                <option value="Email">Email</option>
              </select>
              <button
                type="submit"
                className="px-3 py-2 rounded-lg bg-[#2563EB] text-white font-semibold cursor-pointer"
              >
                Launch
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {camps.map((camp) => {
            const isSelected = camp.id === activeCamp.id;
            return (
              <div
                key={camp.id}
                onClick={() => setSelectedCampId(camp.id)}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer transition-all space-y-2.5",
                  isSelected
                    ? "border-[#2563EB] bg-[#EFF6FF]/60 shadow-xs"
                    : "border-[#E2E8F0] bg-[#F8FAFC] hover:border-slate-300"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#2563EB]">
                    {camp.partnerPharma}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                      camp.status === "Active"
                        ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                        : camp.status === "Scheduled"
                        ? "bg-amber-50 text-[#F59E0B] border-amber-200"
                        : "bg-white text-slate-600 border-[#E2E8F0]"
                    )}
                  >
                    {camp.status}
                  </span>
                </div>

                <div className="text-sm font-semibold text-[#0F172A]">
                  {camp.title}
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    {camp.city}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {camp.date}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200/80 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">
                      Leads Captured
                    </div>
                    <div className="font-bold text-[#0F172A]">
                      {camp.registrations}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">
                      Converted Visits
                    </div>
                    <div className="font-bold text-[#10B981]">
                      {camp.conversions}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Split: Mobile-Friendly Register Attendee Form + Branch CRM Table */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Register Camp Attendee Form */}
        <form
          onSubmit={handleRegisterAttendee}
          className="xl:col-span-5 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-3.5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-[#2563EB]" />
                Register Camp Attendee
              </h3>
              <p className="text-[11px] text-slate-500">
                Active Camp: {activeCamp.title}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
              Mobile Ready
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Attendee Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Rajeshwari Joshi"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                WhatsApp Mobile Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 12345"
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] focus:bg-white focus:outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Primary Dental Issue *
              </label>
              <select
                value={dentalIssue}
                onChange={(e) => setDentalIssue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
              >
                {DENTAL_ISSUES.map((iss) => (
                  <option key={iss} value={iss}>
                    {iss}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 rounded-xl bg-[#EFF6FF] border border-blue-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="h-4 w-4 text-[#2563EB] shrink-0" />
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-[#2563EB]">
                    Nearest Branch Auto-Assigned
                  </div>
                  <div className="text-xs font-bold text-[#0F172A] truncate">
                    {autoAssignedBranch}
                  </div>
                </div>
              </div>
              <Sparkles className="h-4 w-4 text-[#4F46E5] shrink-0" />
            </div>

            <label className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] cursor-pointer">
              <input
                type="checkbox"
                required
                checked={dpdpConsent}
                onChange={(e) => setDpdpConsent(e.target.checked)}
                className="mt-0.5 accent-[#2563EB]"
              />
              <span className="text-[11px] text-slate-600 leading-snug">
                <strong className="text-[#0F172A]">
                  Mandatory DPDP Act 2023 Consent:
                </strong>{" "}
                I consent to {activeCamp.partnerPharma} &amp; DentAI Pro storing
                my screening record and sending a WhatsApp checkup voucher.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={!dpdpConsent}
            className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
          >
            <Ticket className="h-4 w-4" />
            Register Attendee &amp; Send Welcome Voucher
          </button>
        </form>

        {/* Branch CRM Leads Table */}
        <div className="xl:col-span-7 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#0F172A]">
                Branch CRM Camp Leads ({campLeads.length})
              </h3>
              <p className="text-xs text-slate-500">
                Real-time camp captures routed to branch front desks with DPDP
                verification
              </p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#10B981] border border-emerald-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              DPDP Verified
            </span>
          </div>

          <div className="overflow-x-auto max-h-[380px]">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Attendee</th>
                  <th className="py-2.5 px-3">Dental Issue &amp; Camp</th>
                  <th className="py-2.5 px-3">Assigned Branch</th>
                  <th className="py-2.5 px-3">Voucher &amp; Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {campLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-[#0F172A]">
                        {lead.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {lead.phone}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-[#0F172A]">
                        {lead.dentalIssue}
                      </div>
                      <div className="text-[11px] text-[#2563EB]">
                        {lead.partnerPharma}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700">
                      {lead.assignedBranch}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-mono text-[11px] font-semibold text-[#4F46E5]">
                        {lead.voucherCode}
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border mt-0.5",
                          lead.status === "Converted"
                            ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                            : "bg-[#EFF6FF] text-[#2563EB] border-blue-200"
                        )}
                      >
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        {lead.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
