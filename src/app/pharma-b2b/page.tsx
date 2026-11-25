"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Globe, Sparkles, CheckCircle2, ExternalLink, Copy, Users, Calendar, TrendingUp, Video, MessageSquare } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { toast } from "sonner";
import { useDentAi } from "@/context/DentAiContext";
import { formatINR, cn } from "@/lib/utils";

type HierarchyTier =
  | "Top Management"
  | "Department Head"
  | "Regional Head"
  | "MR"
  | "Doctor";

const HIERARCHY_METRICS: Record<
  HierarchyTier,
  {
    subtitle: string;
    cards: Array<{ label: string; value: string; hint: string }>;
    rows: Array<{ name: string; region: string; onboarded: number; completion: string; status: string }>;
  }
> = {
  "Top Management": {
    subtitle: "Macro ROI across 24,800+ onboarded doctors (₹1,200/doctor/yr bulk SaaS)",
    cards: [
      { label: "Total Network Doctors", value: "24,850", hint: "Across 18 Pharma Clients" },
      { label: "Published Microsites", value: "21,420", hint: "86.2% Zero-Touch Live" },
      { label: "Annual Bulk ARR", value: "₹2.98 Cr", hint: "₹1,200/doctor/year avg" },
      { label: "Monthly Patient Views", value: "1.84 M", hint: "Avg 74 visits/doctor/mo" },
    ],
    rows: [
      { name: "Cipla Cardio-Metabolic Div", region: "Pan-India", onboarded: 8400, completion: "91%", status: "Active Bulk" },
      { name: "Sun Pharma Dental & Pain", region: "Pan-India", onboarded: 6950, completion: "88%", status: "Active Bulk" },
      { name: "Dr. Reddy's Chronic Care", region: "South & West", onboarded: 5200, completion: "84%", status: "Expanding" },
    ],
  },
  "Department Head": {
    subtitle: "Specialty department adoption & MR activation funnel",
    cards: [
      { label: "Cardiology & Dental Dept", value: "6,950", hint: "Doctors Enrolled" },
      { label: "AI Video Adoption", value: "78%", hint: "Using 1-click AI posters" },
      { label: "Avg Profile Score", value: "88%", hint: "Auto-tracked by MR app" },
      { label: "Active MRs in Dept", value: "420", hint: "Zero tech-team touch" },
    ],
    rows: [
      { name: "West Zone Dental Team", region: "Maharashtra & Gujarat", onboarded: 2450, completion: "92%", status: "Top Dept" },
      { name: "North Zone Ortho Team", region: "Delhi NCR & UP", onboarded: 2100, completion: "85%", status: "On Track" },
      { name: "South Zone Implant Team", region: "Karnataka & TN", onboarded: 2400, completion: "89%", status: "On Track" },
    ],
  },
  "Regional Head": {
    subtitle: "Regional MR productivity & doctor microsite launch velocity",
    cards: [
      { label: "Mumbai & Pune Region", value: "1,480", hint: "Doctors Live" },
      { label: "Active MRs", value: "68", hint: "Avg 21 doctors/MR" },
      { label: "Weekly Launches", value: "114", hint: "Instant subdomains" },
      { label: "MR Revisit Compliance", value: "94%", hint: "Scheduled follow-ups" },
    ],
    rows: [
      { name: "Rohan Deshmukh (MR)", region: "Mumbai West", onboarded: 34, completion: "96%", status: "Star MR" },
      { name: "Sneha Kulkarni (MR)", region: "Pune Central", onboarded: 29, completion: "91%", status: "Active" },
      { name: "Amit Joshi (MR)", region: "Thane & Navi Mumbai", onboarded: 22, completion: "78%", status: "Needs Revisit" },
    ],
  },
  MR: {
    subtitle: "Field Rep guided onboarding, completion tracking & doctor revisits",
    cards: [
      { label: "My Doctors Onboarded", value: "34", hint: "Target: 40 this quarter" },
      { label: "Avg Completion %", value: "96%", hint: "31 Published Live" },
      { label: "Pending Revisit Items", value: "3", hint: "Photos / Timings pending" },
      { label: "Next Scheduled Revisit", value: "Today 4 PM", hint: "Dr. Rajesh Kulkarni" },
    ],
    rows: [
      { name: "Dr. Rajesh Kulkarni", region: "drrajesh.cliniccare.com", onboarded: 1, completion: "100%", status: "Published" },
      { name: "Dr. Sunita Deshmukh", region: "drsunita.cliniccare.com", onboarded: 1, completion: "80%", status: "Revisit Due" },
      { name: "Dr. Arvind Nair", region: "drarvind.cliniccare.com", onboarded: 1, completion: "60%", status: "Pending Logo" },
    ],
  },
  Doctor: {
    subtitle: "Doctor's live microsite analytics, patient inquiries & AI tools",
    cards: [
      { label: "Live Subdomain", value: "1,420", hint: "Monthly profile views" },
      { label: "WhatsApp Bookings", value: "48", hint: "Direct patient leads" },
      { label: "AI Education Shares", value: "19", hint: "Posters & videos sent" },
      { label: "Annual License", value: "₹0", hint: "Sponsored by Cipla" },
    ],
    rows: [
      { name: "drrajesh.cliniccare.com", region: "Active Subdomain", onboarded: 1420, completion: "100%", status: "SSL Live" },
    ],
  },
};

const MONTHLY_ONBOARDING_CHART = [
  { month: "Jul", doctors: 14200 },
  { month: "Aug", doctors: 16800 },
  { month: "Sep", doctors: 19400 },
  { month: "Oct", doctors: 22100 },
  { month: "Nov", doctors: 24850 },
];

export default function PharmaB2bEcosystemPage() {
  const { pharmaTab: activeTab } = useDentAi();

  // Tab 1: MR-Led Doctor Onboarding & Subdomain Publisher
  const [doctorName, setDoctorName] = useState("Dr. Rajesh Kulkarni");
  const [specialty, setSpecialty] = useState("MDS Endodontist & Implantologist");
  const [clinicName, setClinicName] = useState("Kulkarni Smile & Dental Studio");
  const [city, setCity] = useState("Mumbai");
  const [timings, setTimings] = useState("10:00 AM – 8:00 PM");
  const [whatsapp, setWhatsapp] = useState("+91 98204 11890");
  const [layout, setLayout] = useState<"Clinical Modern" | "Executive Care">(
    "Clinical Modern"
  );
  const [accent, setAccent] = useState<"Cobalt" | "Indigo" | "Emerald">(
    "Cobalt"
  );
  const [published, setPublished] = useState(false);

  // Tab 2: Hierarchy Tier
  const [tier, setTier] = useState<HierarchyTier>("MR");

  // Tab 3: AI Content Generator
  const [contentType, setContentType] = useState<
    "Patient Education Video Script" | "WhatsApp Awareness Poster" | "Festival Greeting"
  >("WhatsApp Awareness Poster");
  const [topic, setTopic] = useState("World Oral Health & Pain-Free RCT");
  const [generatedContent, setGeneratedContent] = useState(
    "🦷 *Pain-Free Single-Sitting Root Canal Care*\nBy Dr. Rajesh Kulkarni (MDS Endodontist)\n\nDon't ignore tooth sensitivity! Digital AI RVG scans detect root decay early—saving your natural tooth in 1 visit.\n\n📍 Kulkarni Smile & Dental Studio, Mumbai\n📲 Book Slot: +91 98204 11890\n_Powered by Cipla Health Doctor Connect_"
  );

  const completionPct = useMemo(() => {
    const fields = [doctorName, specialty, clinicName, city, timings, whatsapp];
    const filled = fields.filter((f) => f.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [doctorName, specialty, clinicName, city, timings, whatsapp]);

  const subdomain = useMemo(() => {
    const slug = doctorName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 14);
    return `${slug || "drrajesh"}.cliniccare.com`;
  }, [doctorName]);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setPublished(true);
    toast.success(`Microsite Published Live!`, {
      description: `https://${subdomain} is live with zero tech-team involvement.`,
    });
  };

  const handleGenerateAiContent = () => {
    if (contentType === "Patient Education Video Script") {
      setGeneratedContent(
        `[60-Sec AI Reel Script for ${doctorName}]\nHook (0–5s): "Think Root Canals hurt? Watch how AI precision makes it painless in 40 mins."\nBody (5–45s): Show OPG scan highlighting tooth #36, explain rotary cleaning & Zirconia crown strength.\nCTA (45–60s): "Visit ${clinicName}, ${city} or message ${whatsapp} to book."`
      );
    } else if (contentType === "Festival Greeting") {
      setGeneratedContent(
        `✨ Warm Festive Wishes from ${doctorName} & ${clinicName}!\nMay your family celebrate with bright, healthy smiles. Book your complimentary annual dental checkup at ${subdomain}.\n— Sponsored by Sun Pharma & Cipla Doctor Network`
      );
    } else {
      setGeneratedContent(
        `🦷 *${topic}*\nBy ${doctorName} (${specialty})\n\nEarly screening prevents 90% of complex dental procedures. Get your digital checkup at ${clinicName}, ${city}.\n\n🌐 ${subdomain} | 📲 ${whatsapp}`
      );
    }
    toast.success(`Generated ${contentType} in 1 Click`);
  };

  const tierData = HIERARCHY_METRICS[tier];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">
            {activeTab === "onboarding"
              ? "Doctor Microsite Builder & Auto-Subdomain"
              : activeTab === "hierarchy"
              ? "5-Tier Pharma Hierarchy Dashboards"
              : "AI Medical Content & Marketing Generator"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Zero-touch MR-led onboarding for 10,000–25,000+ doctors • ₹500 to
            ₹5,000/user/yr bulk SaaS model
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 text-[#4F46E5] border border-indigo-200 text-xs font-semibold self-start">
          <Briefcase className="h-4 w-4" />
          Zero-Touch Bulk SaaS
        </span>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "onboarding" && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="grid grid-cols-1 xl:grid-cols-12 gap-6"
          >
            {/* Left: MR Guided Profile Form with Dynamic Completion % */}
            <form
              onSubmit={handlePublish}
              className="xl:col-span-6 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-[#0F172A]">
                    MR-Led Guided Doctor Onboarding
                  </h2>
                  <p className="text-xs text-slate-500">
                    Completion % updates dynamically as MR enters clinic details
                  </p>
                </div>
                <span className="text-sm font-bold text-[#2563EB]">
                  {completionPct}%
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    completionPct === 100 ? "bg-[#10B981]" : "bg-[#2563EB]"
                  )}
                  style={{ width: `${completionPct}%` }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Doctor Name *
                  </label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Specialty *
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Clinic Name *
                  </label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Clinic Timings
                  </label>
                  <input
                    type="text"
                    value={timings}
                    onChange={(e) => setTimings(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>
              </div>

              {/* Layout & Color Theme */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Layout Template
                  </label>
                  <div className="flex gap-1.5">
                    {(["Clinical Modern", "Executive Care"] as const).map(
                      (l) => (
                        <button
                          type="button"
                          key={l}
                          onClick={() => setLayout(l)}
                          className={cn(
                            "flex-1 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer",
                            layout === l
                              ? "bg-[#2563EB] text-white border-[#2563EB]"
                              : "bg-[#F8FAFC] text-slate-600 border-[#E2E8F0]"
                          )}
                        >
                          {l}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Color Theme
                  </label>
                  <div className="flex gap-1.5">
                    {(["Cobalt", "Indigo", "Emerald"] as const).map((c) => (
                      <button
                        type="button"
                        key={c}
                        onClick={() => setAccent(c)}
                        className={cn(
                          "flex-1 py-1.5 rounded-lg border text-[11px] font-medium cursor-pointer",
                          accent === c
                            ? "bg-[#2563EB] text-white border-[#2563EB]"
                            : "bg-[#F8FAFC] text-slate-600 border-[#E2E8F0]"
                        )}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer transition-colors"
              >
                Publish Microsite Now → https://{subdomain}
              </button>
            </form>

            {/* Right: Instant Auto-Subdomain Live Preview */}
            <div className="xl:col-span-6 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs font-mono text-[#2563EB]">
                  <Globe className="h-3.5 w-3.5" />
                  https://{subdomain}
                </div>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border",
                    published
                      ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                      : "bg-amber-50 text-[#F59E0B] border-amber-200"
                  )}
                >
                  {published ? "Live on Subdomain" : "Draft Preview"}
                </span>
              </div>

              {/* Microsite Card */}
              <div className="rounded-2xl border border-[#E2E8F0] overflow-hidden shadow-md bg-white">
                <div
                  className={cn(
                    "p-6 text-white",
                    accent === "Indigo"
                      ? "bg-gradient-to-r from-[#4F46E5] to-[#2563EB]"
                      : accent === "Emerald"
                      ? "bg-gradient-to-r from-[#10B981] to-emerald-700"
                      : "bg-gradient-to-r from-[#2563EB] to-[#1D4ED8]"
                  )}
                >
                  <div className="text-[11px] uppercase tracking-wider text-white/80 font-semibold">
                    {layout} • Verified Practice
                  </div>
                  <h3 className="text-xl font-bold mt-1">
                    {doctorName || "Doctor Name"}
                  </h3>
                  <div className="text-xs text-white/90">{specialty}</div>
                </div>

                <div className="p-5 space-y-3 text-xs">
                  <div className="font-bold text-sm text-[#0F172A]">
                    {clinicName} ({city})
                  </div>
                  <div className="text-slate-600">Timings: {timings}</div>
                  <div className="text-[#2563EB] font-semibold">
                    WhatsApp Appointments: {whatsapp}
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button
                      onClick={() =>
                        toast.success(`Copied https://${subdomain}`)
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] font-semibold cursor-pointer"
                    >
                      <Copy className="h-3 w-3" />
                      Copy Link
                    </button>
                    <button
                      onClick={() =>
                        toast.info(`Opening https://${subdomain}`)
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-slate-700 font-medium cursor-pointer"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Visit Live Site
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "hierarchy" && (
          <motion.div
            key="hierarchy"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="space-y-6"
          >
            {/* 5-Tier Hierarchy Role Selector */}
            <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-[#0F172A]">
                  {tier} Dashboard
                </div>
                <div className="text-xs text-slate-500">
                  {tierData.subtitle}
                </div>
              </div>

              <div className="inline-flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg overflow-x-auto self-start">
                {(
                  [
                    "Doctor",
                    "MR",
                    "Regional Head",
                    "Department Head",
                    "Top Management",
                  ] as HierarchyTier[]
                ).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTier(t)}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer",
                      tier === t
                        ? "bg-[#2563EB] text-white"
                        : "text-slate-600 hover:text-[#0F172A]"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {tierData.cards.map((c) => (
                <div
                  key={c.label}
                  className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs"
                >
                  <div className="text-xs text-slate-500">{c.label}</div>
                  <div className="mt-1.5 text-2xl font-bold text-[#0F172A]">
                    {c.value}
                  </div>
                  <div className="mt-1 text-[11px] text-[#2563EB] font-medium">
                    {c.hint}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart + Table */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
                <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-[#2563EB]" />
                  Doctor Network Scale (10k–25k+)
                </h3>
                <div className="h-[220px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={MONTHLY_ONBOARDING_CHART}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 11, fill: "#64748B" }}
                      />
                      <YAxis tick={{ fontSize: 11, fill: "#64748B" }} />
                      <Tooltip />
                      <Bar
                        dataKey="doctors"
                        name="Doctors Onboarded"
                        fill="#2563EB"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="xl:col-span-2 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
                <h3 className="text-sm font-semibold text-[#0F172A] mb-3 flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-[#2563EB]" />
                  {tier} Telemetry Breakdown
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase">
                      <tr>
                        <th className="py-2.5 px-3">Entity / Rep</th>
                        <th className="py-2.5 px-3">Region / Subdomain</th>
                        <th className="py-2.5 px-3 text-right">Volume</th>
                        <th className="py-2.5 px-3 text-right">Completion</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tierData.rows.map((r) => (
                        <tr key={r.name} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-3 font-semibold text-[#0F172A]">
                            {r.name}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {r.region}
                          </td>
                          <td className="py-2.5 px-3 text-right font-semibold">
                            {r.onboarded.toLocaleString("en-IN")}
                          </td>
                          <td className="py-2.5 px-3 text-right text-[#2563EB] font-semibold">
                            {r.completion}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-[#10B981] border border-emerald-200">
                              {r.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "ai-content" && (
          <motion.div
            key="ai-content"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.16 }}
            className="grid grid-cols-1 xl:grid-cols-12 gap-6"
          >
            <div className="xl:col-span-5 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
              <div>
                <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[#4F46E5]" />
                  AI Medical Content &amp; Marketing Generator
                </h2>
                <p className="text-xs text-slate-500">
                  Value-Add Bulk Product (₹500–₹2,000/doctor/yr) • Zero-touch
                  MR-to-Doctor creative generator
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Content Format
                  </label>
                  <div className="space-y-1.5">
                    {(
                      [
                        [
                          "WhatsApp Awareness Poster",
                          MessageSquare,
                        ],
                        ["Patient Education Video Script", Video],
                        ["Festival Greeting", Calendar],
                      ] as const
                    ).map(([fmt, Icon]) => (
                      <button
                        key={fmt}
                        onClick={() => setContentType(fmt)}
                        className={cn(
                          "w-full p-2.5 rounded-xl border text-left flex items-center gap-2 cursor-pointer",
                          contentType === fmt
                            ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB] font-semibold"
                            : "border-[#E2E8F0] bg-[#F8FAFC] text-slate-700"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {fmt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Clinical Topic / Campaign
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                  />
                </div>

                <button
                  onClick={handleGenerateAiContent}
                  className="w-full py-2.5 rounded-xl bg-[#4F46E5] hover:bg-indigo-700 text-white font-semibold cursor-pointer transition-colors"
                >
                  Generate Branded Asset in 1 Click
                </button>
              </div>
            </div>

            <div className="xl:col-span-7 bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0F172A]">
                  Ready-to-Share Doctor Asset ({contentType})
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-[#10B981] border border-emerald-200">
                  {formatINR(1200)}/yr Bulk Tier
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] whitespace-pre-line text-xs text-[#0F172A] leading-relaxed">
                {generatedContent}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() =>
                    toast.success(`Sent to ${doctorName} via WhatsApp`)
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Share with Doctor on WhatsApp
                </button>
                <button
                  onClick={() => toast.success("Copied to Clipboard")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-medium cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy Content
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
