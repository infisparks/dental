"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, X, Lightbulb, MousePointerClick, CheckCircle2 } from "lucide-react";

export interface PageGuideSection {
  title: string;
  whyItMatters: string;
  whatYouCanDo: Array<{
    element: string;
    explanation: string;
    example: string;
  }>;
}

const GUIDE_CONTENT: Record<string, PageGuideSection> = {
  "hq:bi": {
    title: "HQ Command — Executive BI & Profit Dashboard",
    whyItMatters:
      "Gives Dr. Ajay Bajaj a real-time pan-India view of all 104 dental clinics—tracking gross sales (₹4.82 Cr), net profit (₹1.64 Cr), expenses (₹3.18 Cr), patient footfall, and 0% EMI financing in one place.",
    whatYouCanDo: [
      {
        element: "BI Scope & Period Filters (Top Bar)",
        explanation:
          "Slice all KPIs, charts, and the clinic leaderboard by All India, State, Specific Branch, or Date Range.",
        example:
          "Click 'By State' → select 'Maharashtra' → watch Gross Sales, Net Profit, and Donut chart recalculate instantly.",
      },
      {
        element: "Area / Bar Chart & Treatment Donut",
        explanation:
          "Compare monthly Sales vs. Expenses vs. Profit and see which dental procedures drive the highest margin.",
        example:
          "Click 'Bar' toggle on the chart, or hover over 'Root Canal + Crown (42% margin)' on the Donut.",
      },
      {
        element: "Live HQ Approvals Card (Bottom Right)",
        explanation:
          "Approve branch Purchase Orders and patient 0% EMI requests created in Clinic ERP or Patient App.",
        example:
          "Click 'Pack Order' on a PO or the green Check icon on an EMI request—watch the status & branch EMI volume update live.",
      },
    ],
  },
  "hq:onboarding": {
    title: "HQ Command — Franchise Setup & Equipment Registry",
    whyItMatters:
      "Standardizes opening new franchise clinics from 10 to 100+ branches—tracking legal, interior, machinery, and AI readiness before Go-Live.",
    whatYouCanDo: [
      {
        element: "Table / Kanban Toggle & 10-Step Checklist",
        explanation:
          "Inspect each new franchisee dentist's setup progress and open their 10-step launch checklist in a right sidebar.",
        example:
          "Click '10-Step Checklist' on Dr. Siddharth Deshpande → check Step 10 → watch readiness jump to 100% and stage move to 'Live'.",
      },
      {
        element: "Equipment & Machinery Registry Tab",
        explanation:
          "Track Dental Chairs, RVG X-Rays, Class-B Autoclaves, and CBCT Scanners with serial numbers and warranty dates.",
        example:
          "Click 'Class-B Autoclave' filter → click 'Update Service' on any unit to cycle Operational → Due Soon → Under Service.",
      },
    ],
  },
  "hq:property": {
    title: "HQ Command — Clinic Locations & Property Finder",
    whyItMatters:
      "Helps the expansion team evaluate commercial storefronts using carpet area, monthly rent, and AI catchment footfall scores before signing a lease.",
    whatYouCanDo: [
      {
        element: "City Filter & Property Cards",
        explanation:
          "Filter evaluated high-street locations by city and review rent, sq.ft, and footfall score (out of 100).",
        example:
          "Click 'Shortlist', 'Schedule Site Visit', 'Approve Location', or 'Reject' on any property card to update pipeline status live.",
      },
    ],
  },
  "hq:compliance": {
    title: "HQ Command — Brand Audits & Auto-Stamped QR Posters",
    whyItMatters:
      "Ensures every franchise follows clinical SOPs, hygiene, and AERB radiation rules, while giving branches instant HQ-approved local marketing posters.",
    whatYouCanDo: [
      {
        element: "Branch Compliance Scorecards (0–100%)",
        explanation:
          "Click 'Open Audit Checklist' on any branch card to inspect and toggle Clinical SOPs, Hygiene, and Statutory Licenses.",
        example:
          "Open a 75% branch → mark the missing Autoclave Spore Test as Compliant → watch its score jump to 88% or 100%.",
      },
      {
        element: "Marketing Support Hub (Branch Auto-Stamp)",
        explanation:
          "Select an HQ campaign poster and any of the 104 clinics to auto-stamp its address, phone, and booking QR code.",
        example:
          "Select 'DentAI Pro — Indiranagar' in the dropdown → see the poster footer & QR code update → click 'Download Stamped Creative (SVG)'.",
      },
    ],
  },
  "hq:royalty": {
    title: "HQ Command — Royalties & Split-Settlement Ledger",
    whyItMatters:
      "Automates 10–12% franchise royalty calculation and instant payment splitting between HQ and the clinic owner on UPI, Card, and 0% EMI payments.",
    whatYouCanDo: [
      {
        element: "Mode Filter & Settle Split Button",
        explanation:
          "Filter transactions by UPI, Card, or 0% EMI and execute pending T+1 escrow split payouts.",
        example:
          "Click 'Settle Split (Pending Split)' on TXN-UPI-994021 → settles ₹10,000 to HQ and ₹88,800 to Bandra West.",
      },
    ],
  },
  "hq:supply": {
    title: "HQ Command — Supply Chain & B2B Inventory",
    whyItMatters:
      "Centralizes Dr. Bajaj's proprietary dental product distribution to all 104 clinics while monitoring daily consumables and expiry alerts.",
    whatYouCanDo: [
      {
        element: "B2B Brand Catalog & PO Cart Drawer",
        explanation:
          "Order proprietary composites, rotary files, and disposables at wholesale ₹ prices using the slide-over PO Cart.",
        example:
          "Click 'Add to Cart' on 2 items → click 'PO Cart' → submit PO → see it appear in the Live PO Tracker below.",
      },
      {
        element: "HQ Fulfillment Progression (Ordered → Delivered)",
        explanation:
          "In HQ view, advance branch Purchase Orders step-by-step from Ordered → Packed → Shipped → Delivered.",
        example:
          "Click 'Pack Order' or 'Ship Order' on PO-2026-8841 to update the status stepper live.",
      },
      {
        element: "Daily Consumables & Expiry Alerts",
        explanation:
          "Monitor stock vs. MOQ and batches expiring within 30 days, with '+ Stock In', '- Use Stock', and 1-click 'Reorder from HQ'.",
        example:
          "Click '- Use Stock' until a product drops below MOQ → switch to 'Low-Stock & Expiry Alerts' → click 'Reorder from HQ'.",
      },
    ],
  },
  "clinic:schedule": {
    title: "Clinic ERP — Appointment Calendar & Slots",
    whyItMatters:
      "Manages daily chair capacity, patient check-ins, and rescheduling for the branch dentist and front desk.",
    whatYouCanDo: [
      {
        element: "Day Slots / Week Overview & New Appointment",
        explanation:
          "Switch between Day and Week views, click '+ Book Slot' on any open time, or click 'New Appointment' in the top right.",
        example:
          "Click '+ Book Slot' at 04:00 PM → choose a patient & Root Canal → confirm to lock the slot.",
      },
      {
        element: "Check-In, Reschedule & Open EDR",
        explanation:
          "Update patient arrival status, reschedule via the right sidebar, or jump straight into their dental chart.",
        example:
          "Click 'Open EDR' on Aarav Sharma to open his full tooth chart, AI X-ray, and billing.",
      },
    ],
  },
  "clinic:edr": {
    title: "Clinic ERP — Patient Record (EDR) & AI Doctor",
    whyItMatters:
      "Combines an interactive 32-tooth FDI dental chart, AI X-ray pre-screening, Voice-to-Prescription, and automated WhatsApp/Email/PWA bill delivery.",
    whatYouCanDo: [
      {
        element: "Interactive FDI Dental Chart",
        explanation:
          "Click any tooth (#18–#48) and mark it Healthy, Cavity (+₹4,500), Root Canal Needed (+₹1,00,000), Crown (+₹35,000), or Extracted.",
        example:
          "Click Tooth #15 → select 'Root Canal Needed' → watch 'Single-Sitting Rotary Root Canal + Zirconia Crown' (₹1,00,000) auto-add to the Treatment Plan.",
      },
      {
        element: "Run AI Pre-Screening Toggle (X-Ray Viewer)",
        explanation:
          "Overlays animated AI bounding boxes on the OPG radiograph with a plain-English explanation to show the patient.",
        example:
          "Toggle 'Run AI Pre-Screening' ON → see #14 Cavity (94.8%) and #36 RCT Zone (97.4%) highlighted.",
      },
      {
        element: "AI Doctor Assistant (Right Panel)",
        explanation:
          "Shows a 3-bullet summary, allergy warnings, Voice-to-Prescription dictation, and clinical quick-prompts.",
        example:
          "Click 'Voice-to-Prescription (Simulate)' → auto-generates allergy-safe medicines + Dr. Bajaj D2C Self-Care Kit.",
      },
      {
        element: "Complete Visit & Finalize Bill",
        explanation:
          "Marks the visit done, updates clinic revenue, credits SmilePoints, and opens the Tax Invoice & Auto-Delivery preview.",
        example:
          "Click green 'Complete Visit & Finalize Bill' → view the invoice & WhatsApp/Email/PWA Vault delivery confirmation.",
      },
    ],
  },
  "clinic:referrals": {
    title: "Clinic ERP — Specialist Referral Network",
    whyItMatters:
      "Allows franchise dentists to refer complex Endodontic, Oral Surgery, or Orthodontic cases to MDS specialists inside the chain while earning a 12–15% referral share.",
    whatYouCanDo: [
      {
        element: "New Specialist Referral & Advance Stage",
        explanation:
          "Attach OPG/CBCT X-rays, pick a network specialist, and track case progress (Referred → Accepted → Consultation Done → Completed).",
        example:
          "Click 'New Specialist Referral' → submit → click 'Advance' on any row to move it toward settlement.",
      },
    ],
  },
  "clinic:supply": {
    title: "Clinic ERP — Branch Stock & HQ Ordering",
    whyItMatters:
      "Lets branch staff log daily consumption of cotton rolls, thinners, gloves, and composites and reorder from HQ before running out.",
    whatYouCanDo: [
      {
        element: "+ Stock In / - Use Stock & B2B Cart",
        explanation:
          "Adjust daily stock levels, review expiry alerts (≤30 days), and submit multi-item POs to HQ.",
        example:
          "Go to 'Low-Stock & Expiry Alerts' → click 'Reorder from HQ' to generate a live PO.",
      },
    ],
  },
  "camps:simulator": {
    title: "AI Receptionist — WhatsApp Bot & Omnichannel Logs",
    whyItMatters:
      "Automates front-desk follow-ups, 24h reminders, no-show recovery, and post-visit PDF delivery across WhatsApp, SMS, and Email—respecting DPDP opt-outs.",
    whatYouCanDo: [
      {
        element: "Interactive WhatsApp Simulator (Right Window)",
        explanation:
          "Test 4 real patient journeys directly inside WhatsApp without opening any other app.",
        example:
          "Click 'Trigger Post-Visit Auto-Delivery' (sends 3 PDFs), 'Check EMI Status', 'Book Appointment', or 'Reorder Toothpaste'.",
      },
      {
        element: "Automation Rules & Dispatch Logs (Left)",
        explanation:
          "Toggle rules Active/Paused and see live logs—including DPDP-suppressed messages for opted-out patients.",
        example:
          "Click 'Active' on '24h Reminder' to pause it, or trigger a WhatsApp action to watch a new log appear.",
      },
    ],
  },
  "camps:segmentation": {
    title: "AI Receptionist — Treatment Segmentation & LTV",
    whyItMatters:
      "Identifies which treatment cohorts (Root Canal + Crown, Implants) generate the highest Lifetime Value (LTV) and lets you launch targeted care drips.",
    whatYouCanDo: [
      {
        element: "Treatment Filter & Launch Drip Campaign",
        explanation:
          "Filter patients by Root Canal, Implants, Braces, or Scaling, inspect their LTV rank, and send care-plan drips.",
        example:
          "Click 'Launch Follow-Up / Free Checkup Campaign' → pick 'Root Canal' + 'WhatsApp' → send drip.",
      },
    ],
  },
  "camps:pharma": {
    title: "AI Receptionist — Pharma Health Camps & Leads",
    whyItMatters:
      "Drives low-cost patient acquisition via co-branded camps with Cipla, Sun Pharma, and Dr. Reddy's, routing leads straight to the nearest branch.",
    whatYouCanDo: [
      {
        element: "Register Camp Attendee Form",
        explanation:
          "Captures attendee name, phone, dental issue, auto-assigns the nearest clinic, and requires DPDP consent.",
        example:
          "Enter a name & phone → click 'Register Attendee & Send Welcome Voucher' → adds to Branch CRM & sends a free AI RVG voucher.",
      },
    ],
  },
  dpdp: {
    title: "DPDP Act 2023 Compliance & Modular SaaS/SDK",
    whyItMatters:
      "Protects the network from up to ₹250 Cr penalties before the May 13, 2027 statutory deadline—and serves as a standalone SDK pitch for Muthoot Finance & MCGM Hospitals.",
    whatYouCanDo: [
      {
        element: "Granular Consent Ledger & Export CSV/JSON",
        explanation:
          "Search patient consents, toggle Active/Withdrawn status (synced with Patient PWA), and export audit files.",
        example:
          "Click 'Withdrawn' on any row to grant/revoke, or click 'Export JSON' to download the tamper-proof audit file.",
      },
      {
        element: "Minor (<18) Guardian Workflow & 72-Hr Breach Simulator",
        explanation:
          "Test DPDP Sec 9 parental OTP blocking for minors (<18) and simulate a 72-hour Data Protection Board breach filing.",
        example:
          "Click 'Minor (<18) Guardian Workflow' → see DOB 2012-05-14 block standard onboarding until Guardian OTP is verified.",
      },
    ],
  },
  "pharma:onboarding": {
    title: "Pharma B2B — Doctor Site Builder & Auto-Subdomain",
    whyItMatters:
      "Zero-touch B2B SaaS for pharma companies (10,000–25,000+ doctors at ₹500–₹5,000/yr): MRs onboard doctors in minutes and publish instant clinic websites.",
    whatYouCanDo: [
      {
        element: "MR Guided Onboarding & Publish Button",
        explanation:
          "Edit doctor details to watch completion % update dynamically, pick layout/color, and publish to an auto-subdomain.",
        example:
          "Change Doctor Name to 'Dr. Ananya Rao' → watch URL change to 'drananyarao.cliniccare.com' → click 'Publish Microsite Now'.",
      },
    ],
  },
  "pharma:hierarchy": {
    title: "Pharma B2B — 5-Tier Hierarchy Dashboards",
    whyItMatters:
      "Gives every level of a pharmaceutical organization—from Doctor and MR up to Top Management—its own live adoption and ROI dashboard.",
    whatYouCanDo: [
      {
        element: "Hierarchy Role Switcher",
        explanation:
          "Switch between Doctor, MR, Regional Head, Department Head, and Top Management.",
        example:
          "Click 'Top Management' to view 24,850 doctors and ₹2.98 Cr bulk ARR; click 'MR' to see field revisit tasks.",
      },
    ],
  },
  "pharma:ai-content": {
    title: "Pharma B2B — AI Medical Content & Marketing Gen",
    whyItMatters:
      "Value-add AI tool for MRs to generate branded patient-education video scripts, WhatsApp posters, and festival greetings for doctors in 1 click.",
    whatYouCanDo: [
      {
        element: "Format Selector & Generate Button",
        explanation:
          "Pick WhatsApp Poster, Video Script, or Festival Greeting and generate doctor-branded creatives instantly.",
        example:
          "Select 'Patient Education Video Script' → click 'Generate Branded Asset in 1 Click' → copy or share via WhatsApp.",
      },
    ],
  },
  patient: {
    title: "Patient Super-App (PWA) — Mobile Experience",
    whyItMatters:
      "Zero-download Progressive Web App for patients: self-rescheduling, 0% EMI with 3-step Digital KYC, dental insurance claims, D2C store, Vault, and DPDP privacy.",
    whatYouCanDo: [
      {
        element: "Home & Family Switcher",
        explanation:
          "Switch family profiles, track SmileHealth Score (92), log AM/PM brushing streaks, reschedule visits, or join Tele-Dentist.",
        example:
          "Tap 'Reschedule' on the upcoming visit card or check off Day 3 in the 7-Day Care Plan.",
      },
      {
        element: "Finance Tab (0% EMI KYC & Dental Insurance)",
        explanation:
          "Convert the ₹1,00,000 Root Canal + Crown bill into 3–24 month 0% EMI with PAN/Aadhaar OTP + e-Mandate, or buy/claim dental insurance.",
        example:
          "Tap 'Finance' → 'Convert to Easy 0% EMI' → verify OTP → setup e-Mandate to disburse directly to the clinic.",
      },
      {
        element: "Store, Vault & Privacy Tabs",
        explanation:
          "1-click buy Dr. Sharma's prescribed kit via UPI, preview encrypted Rx/Invoices in Vault, or toggle DPDP privacy & download your data.",
        example:
          "Tap 'Store' → '1-Click Buy Prescribed Kit' → pay via UPI and track delivery; or tap 'Privacy' → 'Download My Data'.",
      },
    ],
  },
};

interface PageInfoDrawerProps {
  open: boolean;
  onClose: () => void;
  guideKey: string;
}

export function PageInfoDrawer({
  open,
  onClose,
  guideKey,
}: PageInfoDrawerProps) {
  const guide = GUIDE_CONTENT[guideKey] ?? GUIDE_CONTENT["hq:bi"];

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative w-full max-w-lg bg-[#FFFFFF] border-l border-[#E2E8F0] shadow-2xl h-full flex flex-col z-10"
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#EFF6FF]/60 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Info className="h-4.5 w-4.5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB]">
                    Interactive Feature Guide
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] leading-snug">
                    {guide.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-white cursor-pointer"
                aria-label="Close guide"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Why it matters */}
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
                <div className="text-xs font-bold text-[#4F46E5] flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4" />
                  Why This Matters (Business Value)
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {guide.whyItMatters}
                </p>
              </div>

              {/* Interactive Controls & Examples */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MousePointerClick className="h-3.5 w-3.5 text-[#2563EB]" />
                  Buttons, Cards &amp; Live Examples to Try
                </div>

                {guide.whatYouCanDo.map((item) => (
                  <div
                    key={item.element}
                    className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2"
                  >
                    <div className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-[#2563EB] shrink-0" />
                      {item.element}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.explanation}
                    </p>
                    <div className="p-2.5 rounded-lg bg-[#FFFFFF] border border-blue-100 text-xs text-[#1D4ED8] leading-relaxed">
                      <strong className="font-semibold">Example: </strong>
                      {item.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3.5 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
              <span className="text-xs text-slate-500">
                All actions update live across portals
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer"
              >
                Got It
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
