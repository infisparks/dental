"use client";

import React, { useState } from "react";
import {
  MapPin,
  Building,
  IndianRupee,
  TrendingUp,
  Calendar,
  CheckCircle2,
  XCircle,
  BookmarkCheck,
  Camera,
} from "lucide-react";
import { useDentAi } from "@/context/DentAiContext";
import { formatINR, cn } from "@/lib/utils";
import type { PropertyListing } from "@/types/dentai";

const STATUS_BADGE: Record<PropertyListing["status"], string> = {
  "Under Review": "bg-slate-100 text-slate-700 border-slate-200",
  Shortlisted: "bg-amber-50 text-[#F59E0B] border-amber-200",
  "Site Visit Scheduled": "bg-[#EFF6FF] text-[#2563EB] border-blue-200",
  Approved: "bg-emerald-50 text-[#10B981] border-emerald-200",
  Rejected: "bg-rose-50 text-[#F43F5E] border-rose-200",
};

export function PropertyFinderModule() {
  const { properties, updatePropertyStatus } = useDentAi();
  const [cityFilter, setCityFilter] = useState<string>("All");

  const cities = ["All", "Mumbai", "Bengaluru", "Delhi", "Pune", "Ahmedabad"];
  const filtered =
    cityFilter === "All"
      ? properties
      : properties.filter((p) => p.city === cityFilter);

  return (
    <div className="space-y-6">
      {/* Header & City Filter */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#0F172A]">
            Commercial Property &amp; Micro-Market Location Finder
          </h2>
          <p className="text-xs text-slate-500">
            Evaluate high-street retail units using AI catchment footfall scores
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg self-start">
          {cities.map((c) => (
            <button
              key={c}
              onClick={() => setCityFilter(c)}
              className={cn(
                "px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors",
                cityFilter === c
                  ? "bg-[#2563EB] text-white"
                  : "text-slate-600 hover:text-[#0F172A]"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((prop) => (
          <div
            key={prop.id}
            className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            {/* Storefront Photo + Map Pin Tag */}
            <div className="relative h-52 bg-slate-900 overflow-hidden p-4 flex flex-col justify-between text-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={prop.imageUrl}
                alt={prop.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-slate-950/45" />
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-900/65 backdrop-blur-xs border border-white/25">
                  <MapPin className="h-3 w-3 text-blue-200" />
                  {prop.mapPinTag}
                </span>
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shadow-xs",
                    STATUS_BADGE[prop.status]
                  )}
                >
                  {prop.status}
                </span>
              </div>

              <div className="relative z-10 flex items-end justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] text-blue-100">
                    <Camera className="h-3 w-3" />
                    {prop.photoLabel}
                  </div>
                  <div className="text-base font-semibold mt-0.5 drop-shadow-xs">
                    {prop.title}
                  </div>
                </div>
                <div className="text-right bg-slate-900/70 backdrop-blur-xs rounded-lg px-2.5 py-1.5 border border-white/20 shrink-0">
                  <div className="text-[10px] text-blue-100">Footfall</div>
                  <div className="text-sm font-bold text-white">
                    {prop.footfallScore}/100
                  </div>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <p className="text-xs text-slate-600">{prop.address}</p>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Building className="h-3 w-3" />
                      Carpet Area
                    </div>
                    <div className="text-xs font-semibold text-[#0F172A] mt-0.5">
                      {prop.carpetAreaSqFt.toLocaleString("en-IN")} sq.ft
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <IndianRupee className="h-3 w-3" />
                      Monthly Rent
                    </div>
                    <div className="text-xs font-semibold text-[#0F172A] mt-0.5">
                      {formatINR(prop.monthlyRent)}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Catchment
                    </div>
                    <div className="text-xs font-semibold text-[#2563EB] mt-0.5">
                      {prop.city}
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  Anchor:{" "}
                  <span className="text-slate-700">{prop.nearbyAnchor}</span>
                  {prop.siteVisitDate &&
                    prop.status === "Site Visit Scheduled" && (
                      <span className="ml-2 text-[#2563EB] font-medium">
                        • Visit: {prop.siteVisitDate}
                      </span>
                    )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                <button
                  onClick={() => updatePropertyStatus(prop.id, "Shortlisted")}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors",
                    prop.status === "Shortlisted"
                      ? "bg-[#F59E0B] text-white border-[#F59E0B]"
                      : "bg-white text-slate-700 border-[#E2E8F0] hover:bg-slate-50"
                  )}
                >
                  <BookmarkCheck className="h-3.5 w-3.5" />
                  Shortlist
                </button>
                <button
                  onClick={() =>
                    updatePropertyStatus(
                      prop.id,
                      "Site Visit Scheduled",
                      "2026-12-01"
                    )
                  }
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors",
                    prop.status === "Site Visit Scheduled"
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "bg-white text-slate-700 border-[#E2E8F0] hover:bg-slate-50"
                  )}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  Schedule Site Visit
                </button>
                <button
                  onClick={() => updatePropertyStatus(prop.id, "Approved")}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors",
                    prop.status === "Approved"
                      ? "bg-[#10B981] text-white border-[#10B981]"
                      : "bg-emerald-50 text-[#10B981] border-emerald-200 hover:bg-[#10B981] hover:text-white"
                  )}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Approve Location
                </button>
                <button
                  onClick={() => updatePropertyStatus(prop.id, "Rejected")}
                  className={cn(
                    "inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border cursor-pointer transition-colors",
                    prop.status === "Rejected"
                      ? "bg-[#F43F5E] text-white border-[#F43F5E]"
                      : "bg-white text-[#F43F5E] border-rose-200 hover:bg-rose-50"
                  )}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
