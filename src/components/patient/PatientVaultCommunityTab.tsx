"use client";

import React, { useState } from "react";
import {
  FolderLock,
  Users,
  FileText,
  Eye,
  Heart,
  MessageCircle,
  CheckCircle2,
  X,
  Send,
  Shield,
} from "lucide-react";
import { useDentAi } from "@/context/DentAiContext";
import { formatINR, cn } from "@/lib/utils";
import type { Patient } from "@/types/dentai";

interface VaultDoc {
  id: string;
  category: "Prescription" | "Diagnostic Report" | "Financed Invoice" | "Insurance Policy";
  title: string;
  date: string;
  subtitle: string;
  body: string;
}

export function PatientVaultCommunityTab({ patient }: { patient: Patient }) {
  const {
    prescriptions,
    purchasedPolicies,
    emiApplications,
    communityPosts,
    toggleLikeCommunityPost,
    addCommunityComment,
    askCommunityQuestion,
  } = useDentAi();

  const [subTab, setSubTab] = useState<"vault" | "community">("vault");
  const [previewDoc, setPreviewDoc] = useState<VaultDoc | null>(null);

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {}
  );
  const [newQTitle, setNewQTitle] = useState("");
  const [newQBody, setNewQBody] = useState("");

  const rx = prescriptions[patient.id];
  const latestEmi = emiApplications.find((e) => e.patientId === patient.id);

  const vaultDocs: VaultDoc[] = [
    ...(rx
      ? [
          {
            id: rx.id,
            category: "Prescription" as const,
            title: "Digital Rx & D2C Care Kit",
            date: rx.generatedAt,
            subtitle: `${rx.medicines.length} Medicines • Dr. Meera Deshmukh`,
            body:
              rx.medicines
                .map((m) => `• ${m.name} (${m.dosage} × ${m.duration})`)
                .join("\n") +
              `\n\nD2C Care Kit: ${rx.d2cSelfCareKit.join(", ")}\nAdvice: ${rx.advice}`,
          },
        ]
      : []),
    {
      id: "doc-opg-36",
      category: "Diagnostic Report",
      title: "AI OPG & RVG Radiograph Screening (#36 & #14)",
      date: "2026-11-22 10:18 IST",
      subtitle: "DentAI Vision v4.2 • 97.4% Confidence",
      body: "AI Findings:\n1. Tooth #36: Periapical radiolucency (3.2mm) — single-sitting rotary RCT + Zirconia Crown recommended.\n2. Tooth #14: Early interproximal enamel caries — Nano-Hybrid composite filling advised.",
    },
    {
      id: "doc-inv-100k",
      category: "Financed Invoice",
      title: "Tax Invoice — Root Canal + Zirconia Crown",
      date: "2026-11-25",
      subtitle: `${formatINR(100000)} • Status: ${
        patient.outstandingBalance === 0
          ? `0% EMI Disbursed (${latestEmi?.lender ?? "Bajaj Finserv"})`
          : "EMI Ready"
      }`,
      body: `Patient: ${patient.name}\nClinic: ${patient.branchName}\nProcedure: Single-Sitting Rotary RCT + Monolithic Zirconia Crown (#36)\nTotal: ${formatINR(
        100000
      )}\nPayment Status: ${
        patient.outstandingBalance === 0
          ? "Settled via 0% No-Cost EMI"
          : "Pending Checkout"
      }`,
    },
    ...purchasedPolicies.map((pol) => ({
      id: pol.id,
      category: "Insurance Policy" as const,
      title: `${pol.planName} (${pol.policyNumber})`,
      date: `Valid till ${pol.validUntil}`,
      subtitle: `${pol.insurer} • Cover ${formatINR(pol.coverageAmount)}`,
      body: `Policy Number: ${pol.policyNumber}\nInsurer: ${pol.insurer}\nAnnual Cover: ${formatINR(
        pol.coverageAmount
      )}\nCashless Valid Across: All 104 DentAI Pro Clinics`,
    })),
  ];

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQTitle.trim() || !newQBody.trim()) return;
    askCommunityQuestion(patient.name, newQTitle, newQBody);
    setNewQTitle("");
    setNewQBody("");
  };

  return (
    <div className="space-y-4">
      {/* Sub-Tabs */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-1 flex gap-1 shadow-2xs">
        <button
          onClick={() => setSubTab("vault")}
          className={cn(
            "flex-1 py-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer",
            subTab === "vault"
              ? "bg-[#2563EB] text-white"
              : "text-slate-600 hover:text-[#0F172A]"
          )}
        >
          <FolderLock className="h-3.5 w-3.5" />
          Digital Vault ({vaultDocs.length})
        </button>
        <button
          onClick={() => setSubTab("community")}
          className={cn(
            "flex-1 py-2 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer",
            subTab === "community"
              ? "bg-[#2563EB] text-white"
              : "text-slate-600 hover:text-[#0F172A]"
          )}
        >
          <Users className="h-3.5 w-3.5" />
          Community Hub ({communityPosts.length})
        </button>
      </div>

      {/* VAULT */}
      {subTab === "vault" && (
        <div className="space-y-2.5">
          {vaultDocs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-3.5 shadow-2xs flex items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  {doc.category === "Insurance Policy" ? (
                    <Shield className="h-4 w-4" />
                  ) : (
                    <FileText className="h-4 w-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-semibold text-[#2563EB]">
                    {doc.category} • {doc.date}
                  </div>
                  <div className="text-xs font-bold text-[#0F172A] truncate">
                    {doc.title}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {doc.subtitle}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(doc)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] hover:bg-[#EFF6FF] hover:text-[#2563EB] text-[11px] font-semibold shrink-0 cursor-pointer"
              >
                <Eye className="h-3 w-3" />
                Preview
              </button>
            </div>
          ))}
        </div>
      )}

      {/* COMMUNITY HUB */}
      {subTab === "community" && (
        <div className="space-y-4">
          {/* Ask a Dentist Q&A Form */}
          <form
            onSubmit={handleAskQuestion}
            className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-3.5 shadow-2xs space-y-2.5 text-xs"
          >
            <div className="font-bold text-[#0F172A]">
              Ask a Verified MDS Dentist
            </div>
            <input
              type="text"
              value={newQTitle}
              onChange={(e) => setNewQTitle(e.target.value)}
              placeholder="Question title (e.g., Cold sensitivity after crown?)"
              className="w-full px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
            />
            <div className="flex gap-2">
              <input
                type="text"
                value={newQBody}
                onChange={(e) => setNewQBody(e.target.value)}
                placeholder="Describe your dental question..."
                className="flex-1 px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-[#2563EB] text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Send className="h-3 w-3" />
                Post
              </button>
            </div>
          </form>

          {/* Feed */}
          {communityPosts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-4 shadow-2xs space-y-2.5 text-xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-bold text-[#0F172A] flex items-center gap-1">
                    {post.author}
                    {post.verifiedDoctor && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#2563EB]" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {post.roleBadge} • {post.timestamp}
                  </div>
                </div>
              </div>

              <div className="font-semibold text-[#0F172A]">{post.title}</div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                {post.body}
              </p>

              <div className="flex items-center gap-4 pt-1 border-t border-slate-100">
                <button
                  onClick={() => toggleLikeCommunityPost(post.id)}
                  className={cn(
                    "inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer",
                    post.likedByUser ? "text-[#F43F5E]" : "text-slate-500"
                  )}
                >
                  <Heart
                    className={cn(
                      "h-3.5 w-3.5",
                      post.likedByUser && "fill-[#F43F5E]"
                    )}
                  />
                  {post.likes}
                </button>
                <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                  <MessageCircle className="h-3.5 w-3.5" />
                  {post.comments.length} Replies
                </span>
              </div>

              {/* Comments & Add Reply */}
              {post.comments.length > 0 && (
                <div className="space-y-1.5 bg-[#F8FAFC] rounded-xl p-2.5">
                  {post.comments.map((c) => (
                    <div key={c.id} className="text-[11px]">
                      <span className="font-semibold text-[#0F172A]">
                        {c.author}:{" "}
                      </span>
                      <span className="text-slate-600">{c.text}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={commentInputs[post.id] ?? ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                  placeholder="Write a comment..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[11px]"
                />
                <button
                  onClick={() => {
                    const txt = commentInputs[post.id] ?? "";
                    if (!txt.trim()) return;
                    addCommunityComment(post.id, patient.name, txt);
                    setCommentInputs((prev) => ({ ...prev, [post.id]: "" }));
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-[11px] font-semibold cursor-pointer"
                >
                  Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Vault Document Preview Bottom Sheet */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-t-3xl border-t border-x border-[#E2E8F0] shadow-2xl overflow-hidden pb-2">
            <div className="flex justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-300" />
            </div>
            <div className="px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
              <div>
                <div className="text-[10px] font-semibold text-[#2563EB]">
                  {previewDoc.category}
                </div>
                <div className="text-sm font-bold text-[#0F172A]">
                  {previewDoc.title}
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1 text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 text-xs text-slate-700 whitespace-pre-line leading-relaxed">
              {previewDoc.body}
            </div>
            <div className="px-4 py-3 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
