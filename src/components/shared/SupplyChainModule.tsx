"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ShoppingCart,
  Package,
  AlertTriangle,
  Truck,
  Plus,
  Minus,
  Trash2,
  X,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Clock,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useDentAi } from "@/context/DentAiContext";
import { formatINR, cn } from "@/lib/utils";
import type { CatalogProduct, PurchaseOrder } from "@/types/dentai";

interface SupplyChainModuleProps {
  role: "hq" | "clinic";
  branchId?: string;
}

type SupplyTab = "catalog" | "ledger" | "alerts";

const PO_STEPS: PurchaseOrder["status"][] = [
  "Ordered",
  "Packed",
  "Shipped",
  "Delivered",
];

// Reference demo date matching metadata (2026-11-25)
const DEMO_TODAY_MS = new Date("2026-11-25T00:00:00Z").getTime();

function getDaysUntilExpiry(expiryDate: string): number {
  const expMs = new Date(`${expiryDate}T00:00:00Z`).getTime();
  return Math.ceil((expMs - DEMO_TODAY_MS) / (1000 * 60 * 60 * 24));
}

export function SupplyChainModule({ role, branchId }: SupplyChainModuleProps) {
  const {
    branches,
    b2bCatalog,
    consumables,
    purchaseOrders,
    submitCartPurchaseOrder,
    advancePoStatus,
    adjustConsumableStock,
    reorderConsumableFromHq,
  } = useDentAi();

  const [activeSubTab, setActiveSubTab] = useState<SupplyTab>("catalog");
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    branchId ?? branches[0]?.id ?? "br-001"
  );
  const [catalogFilter, setCatalogFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [alertFilter, setAlertFilter] = useState<
    "all" | "low_stock" | "expiring"
  >("all");

  // Slide-over PO Cart Drawer state
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<
    Array<{ product: CatalogProduct; qty: number }>
  >([]);

  const effectiveBranchId = branchId ?? selectedBranchId;
  const activeBranch =
    branches.find((b) => b.id === effectiveBranchId) ?? branches[0];

  // Compute low-stock (< MOQ) & expiring (<= 30 days) alerts
  const alertItems = useMemo(() => {
    return consumables
      .map((item) => {
        const daysLeft = getDaysUntilExpiry(item.expiryDate);
        const isLowStock = item.stock < item.moq;
        const isExpiringSoon = daysLeft <= 30;
        return {
          ...item,
          daysLeft,
          isLowStock,
          isExpiringSoon,
        };
      })
      .filter((item) => item.isLowStock || item.isExpiringSoon);
  }, [consumables]);

  const filteredAlerts = useMemo(() => {
    if (alertFilter === "low_stock") {
      return alertItems.filter((a) => a.isLowStock);
    }
    if (alertFilter === "expiring") {
      return alertItems.filter((a) => a.isExpiringSoon);
    }
    return alertItems;
  }, [alertItems, alertFilter]);

  const filteredCatalog = useMemo(() => {
    return b2bCatalog.filter((prod) => {
      const matchesCat =
        catalogFilter === "All" ||
        (catalogFilter === "Dr. Bajaj Proprietary"
          ? prod.brandLine === "Dr. Bajaj Proprietary"
          : prod.category === catalogFilter);
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        prod.name.toLowerCase().includes(q) ||
        prod.sku.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [b2bCatalog, catalogFilter, searchQuery]);

  const visiblePos = useMemo(() => {
    if (role === "hq") return purchaseOrders;
    // Clinic sees its branch POs first, or all if demo branch has few
    const branchPos = purchaseOrders.filter(
      (p) => p.branchId === activeBranch.id
    );
    return branchPos.length > 0 ? branchPos : purchaseOrders;
  }, [purchaseOrders, role, activeBranch.id]);

  const addToCart = (product: CatalogProduct) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 2 }];
    });
    toast.success(`Added to PO Cart`, {
      description: `${product.name} (${formatINR(product.wholesalePrice)})`,
    });
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId
            ? { ...i, qty: Math.max(0, i.qty + delta) }
            : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce(
    (s, i) => s + i.product.wholesalePrice * i.qty,
    0
  );

  const handleSubmitPo = () => {
    if (cart.length === 0) return;
    submitCartPurchaseOrder({
      branchId: activeBranch.id,
      items: cart,
      requestedBy:
        role === "hq"
          ? `HQ Procurement (${activeBranch.name})`
          : activeBranch.leadDentist,
    });
    setCart([]);
    setCartOpen(false);
  };

  const nextActionLabel = (status: PurchaseOrder["status"]) => {
    if (status === "Ordered") return "Pack Order";
    if (status === "Packed") return "Ship Order";
    if (status === "Shipped") return "Mark Delivered";
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Automated Low-Stock & Expiry Alert Banner */}
      {alertItems.length > 0 && (
        <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-[#F43F5E] text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-[#0F172A]">
                Automated Inventory Alert: {alertItems.length} Items Require
                Immediate Action
              </div>
              <div className="text-xs text-slate-600 mt-0.5">
                {alertItems.filter((a) => a.isLowStock).length} items below MOQ
                • {alertItems.filter((a) => a.isExpiringSoon).length} batches
                expiring within 30 days
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveSubTab("alerts")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F43F5E] hover:bg-rose-600 text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors self-start sm:self-auto"
          >
            Review Alerts ({alertItems.length})
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Header & Role-Adaptive Bar */}
      <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Sub-Tabs */}
        <div className="inline-flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg overflow-x-auto self-start max-w-full">
          <button
            onClick={() => setActiveSubTab("catalog")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors",
              activeSubTab === "catalog"
                ? "bg-[#2563EB] text-white"
                : "text-slate-600 hover:text-[#0F172A]"
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            B2B Brand Portal &amp; PO Tracker
          </button>
          <button
            onClick={() => setActiveSubTab("ledger")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors",
              activeSubTab === "ledger"
                ? "bg-[#2563EB] text-white"
                : "text-slate-600 hover:text-[#0F172A]"
            )}
          >
            <Package className="h-3.5 w-3.5" />
            Daily Consumables Ledger ({consumables.length})
          </button>
          <button
            onClick={() => setActiveSubTab("alerts")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors",
              activeSubTab === "alerts"
                ? "bg-[#2563EB] text-white"
                : "text-slate-600 hover:text-[#0F172A]"
            )}
          >
            <AlertTriangle className="h-3.5 w-3.5" />
            Low-Stock &amp; Expiry Alerts
            {alertItems.length > 0 && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-semibold",
                  activeSubTab === "alerts"
                    ? "bg-white/20 text-white"
                    : "bg-rose-100 text-[#F43F5E]"
                )}
              >
                {alertItems.length}
              </span>
            )}
          </button>
        </div>

        {/* Right Controls: Branch Selector (if HQ) + PO Cart Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          {role === "hq" && (
            <select
              value={selectedBranchId}
              onChange={(e) => setSelectedBranchId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs font-medium text-[#0F172A] max-w-[230px] focus:outline-none focus:border-[#2563EB]"
            >
              {branches.slice(0, 15).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          )}

          <button
            onClick={() => setCartOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>PO Cart ({cartCount})</span>
            {cartTotal > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-white/20 text-[11px]">
                {formatINR(cartTotal)}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: B2B Brand Ordering Portal & Live PO Tracker */}
      {activeSubTab === "catalog" && (
        <div className="space-y-6">
          {/* Catalog Filter Bar */}
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-4 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-[#0F172A]">
                  Centralized B2B Brand Ordering Portal
                </h2>
                <p className="text-xs text-slate-500">
                  Dr. Bajaj&apos;s proprietary formulations &amp; certified
                  clinic supplies at network wholesale rates • Ordering for{" "}
                  <span className="font-semibold text-[#2563EB]">
                    {activeBranch.name}
                  </span>
                </p>
              </div>

              <div className="relative">
                <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search SKU or product..."
                  className="pl-8 pr-3 py-1.5 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-xs focus:bg-white focus:outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  "All",
                  "Dr. Bajaj Proprietary",
                  "Restorative",
                  "Endodontics",
                  "Disposables",
                  "Sterilization",
                  "Implantology",
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCatalogFilter(cat)}
                  className={cn(
                    "px-2.5 py-1 rounded-md text-xs font-medium border cursor-pointer transition-colors",
                    catalogFilter === cat
                      ? "bg-[#2563EB] text-white border-[#2563EB]"
                      : "bg-[#F8FAFC] text-slate-600 border-[#E2E8F0] hover:text-[#0F172A]"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
              {filteredCatalog.map((prod) => {
                const savingsPct = Math.round(
                  ((prod.mrp - prod.wholesalePrice) / prod.mrp) * 100
                );
                return (
                  <div
                    key={prod.id}
                    className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 flex flex-col justify-between gap-3 hover:border-blue-200 transition-colors"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-1.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                            prod.brandLine === "Dr. Bajaj Proprietary"
                              ? "bg-indigo-50 text-[#4F46E5] border-indigo-200"
                              : "bg-white text-slate-600 border-[#E2E8F0]"
                          )}
                        >
                          {prod.brandLine === "Dr. Bajaj Proprietary" && (
                            <Sparkles className="h-2.5 w-2.5" />
                          )}
                          {prod.brandLine}
                        </span>
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                            prod.stockBadge === "In Stock"
                              ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                              : prod.stockBadge === "High Demand"
                              ? "bg-[#EFF6FF] text-[#2563EB] border-blue-200"
                              : "bg-amber-50 text-[#F59E0B] border-amber-200"
                          )}
                        >
                          {prod.stockBadge}
                        </span>
                      </div>

                      <div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {prod.sku} • {prod.category}
                        </div>
                        <div className="text-xs font-semibold text-[#0F172A] mt-0.5 line-clamp-2">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Pack: {prod.packSize} • HQ Stock: {prod.hqStock}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E2E8F0] space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-sm font-bold text-[#0F172A]">
                            {formatINR(prod.wholesalePrice)}
                          </span>
                          <span className="ml-1.5 text-[11px] text-slate-400 line-through">
                            {formatINR(prod.mrp)}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-[#10B981]">
                          Save {savingsPct}%
                        </span>
                      </div>

                      <button
                        onClick={() => addToCart(prod)}
                        className="w-full py-2 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live PO Tracker Table */}
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#2563EB]" />
                  Live Purchase Order (PO) Tracker
                </h2>
                <p className="text-xs text-slate-500">
                  {role === "hq"
                    ? "HQ Fulfillment Desk: Advance branch orders across Ordered → Packed → Shipped → Delivered"
                    : "Track real-time dispatch milestones from Dr. Bajaj Central Depot"}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-blue-200 self-start">
                {visiblePos.length} Active Orders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">PO # &amp; Date</th>
                    <th className="py-2.5 px-3">Branch &amp; Items</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3">Fulfillment Progression</th>
                    {role === "hq" && (
                      <th className="py-2.5 px-3 text-right">HQ Action</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {visiblePos.map((po) => {
                    const stepIdx = PO_STEPS.indexOf(po.status);
                    const btnLabel = nextActionLabel(po.status);
                    return (
                      <tr key={po.id} className="hover:bg-slate-50/70">
                        <td className="py-3 px-3">
                          <div className="font-mono font-semibold text-[#0F172A]">
                            {po.poNumber}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {po.createdAt}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-[#0F172A]">
                            {po.branchName}
                          </div>
                          <div className="text-[11px] text-slate-500 max-w-[260px] truncate">
                            {po.itemName}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-[#0F172A]">
                          {formatINR(po.totalAmount)}
                        </td>
                        <td className="py-3 px-3 min-w-[260px]">
                          <div className="flex items-center gap-1">
                            {PO_STEPS.map((st, i) => {
                              const completed = i <= stepIdx;
                              const isCurrent = i === stepIdx;
                              return (
                                <React.Fragment key={st}>
                                  <span
                                    className={cn(
                                      "px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap",
                                      po.status === "Delivered" && completed
                                        ? "bg-emerald-50 text-[#10B981] border-emerald-200"
                                        : isCurrent
                                        ? "bg-[#2563EB] text-white border-[#2563EB]"
                                        : completed
                                        ? "bg-[#EFF6FF] text-[#2563EB] border-blue-200"
                                        : "bg-slate-50 text-slate-400 border-slate-200"
                                    )}
                                  >
                                    {st}
                                  </span>
                                  {i < PO_STEPS.length - 1 && (
                                    <span
                                      className={cn(
                                        "h-0.5 w-3 rounded",
                                        i < stepIdx
                                          ? "bg-[#2563EB]"
                                          : "bg-slate-200"
                                      )}
                                    />
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </td>
                        {role === "hq" && (
                          <td className="py-3 px-3 text-right">
                            {btnLabel ? (
                              <button
                                onClick={() => advancePoStatus(po.id)}
                                className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-semibold cursor-pointer transition-colors"
                              >
                                {btnLabel}
                              </button>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#10B981]">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Completed
                              </span>
                            )}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Branch Daily Consumables Ledger */}
      {activeSubTab === "ledger" && (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A]">
                Branch Daily Consumables Ledger — {activeBranch.name}
              </h2>
              <p className="text-xs text-slate-500">
                Simulate daily chairside consumption with &ldquo;+ Stock In&rdquo;
                and &ldquo;- Use Stock&rdquo; controls
              </p>
            </div>
            <span className="text-xs text-slate-500">
              {consumables.length} Tracked SKUs
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase">
                <tr>
                  <th className="py-2.5 px-3">Item &amp; SKU</th>
                  <th className="py-2.5 px-3">Batch #</th>
                  <th className="py-2.5 px-3">Expiry Date</th>
                  <th className="py-2.5 px-3 text-center">Current Stock</th>
                  <th className="py-2.5 px-3 text-center">MOQ</th>
                  <th className="py-2.5 px-3 text-right">Daily Controls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {consumables.map((item) => {
                  const daysLeft = getDaysUntilExpiry(item.expiryDate);
                  const isLow = item.stock < item.moq;
                  const isExpiring = daysLeft <= 30;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#0F172A]">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.sku} • {item.category} •{" "}
                          {formatINR(item.unitPrice)}/{item.unit.slice(0, -1)}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                        {item.batchNumber}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "font-medium",
                              isExpiring ? "text-[#F43F5E]" : "text-slate-700"
                            )}
                          >
                            {item.expiryDate}
                          </span>
                          {isExpiring && (
                            <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-[#F43F5E] border border-rose-200">
                              {daysLeft}d left
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-bold border",
                            isLow
                              ? "bg-amber-50 text-[#F59E0B] border-amber-200"
                              : "bg-emerald-50 text-[#10B981] border-emerald-200"
                          )}
                        >
                          {item.stock} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600 font-medium">
                        {item.moq} {item.unit}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => adjustConsumableStock(item.id, -1)}
                            disabled={item.stock === 0}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#E2E8F0] bg-white hover:bg-rose-50 hover:text-[#F43F5E] hover:border-rose-200 text-[11px] font-medium text-slate-700 disabled:opacity-40 cursor-pointer transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                            Use Stock
                          </button>
                          <button
                            onClick={() => adjustConsumableStock(item.id, 5)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-blue-200 bg-[#EFF6FF] hover:bg-[#2563EB] hover:text-white text-[11px] font-semibold text-[#2563EB] cursor-pointer transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                            Stock In
                          </button>
                          {(isLow || isExpiring) && (
                            <button
                              onClick={() =>
                                reorderConsumableFromHq(
                                  item.id,
                                  activeBranch.id
                                )
                              }
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] font-semibold cursor-pointer transition-colors"
                            >
                              <RefreshCw className="h-3 w-3" />
                              Reorder
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Automated Low-Stock & Expiry Alerts */}
      {activeSubTab === "alerts" && (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#E2E8F0] p-5 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-[#0F172A] flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-[#F43F5E]" />
                Automated Low-Stock &amp; Expiry Alerts
              </h2>
              <p className="text-xs text-slate-500">
                Items below Minimum Order Quantity (MOQ) or expiring within 30
                days — 1-click Reorder sends a PO directly to HQ
              </p>
            </div>

            <div className="inline-flex bg-[#F8FAFC] border border-[#E2E8F0] p-1 rounded-lg self-start">
              {(
                [
                  ["all", `All Alerts (${alertItems.length})`],
                  [
                    "low_stock",
                    `Below MOQ (${alertItems.filter((a) => a.isLowStock).length})`,
                  ],
                  [
                    "expiring",
                    `Expiring ≤ 30d (${
                      alertItems.filter((a) => a.isExpiringSoon).length
                    })`,
                  ],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setAlertFilter(key)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors",
                    alertFilter === key
                      ? "bg-[#2563EB] text-white"
                      : "text-slate-600 hover:text-[#0F172A]"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-[#10B981] mx-auto" />
              <div className="text-sm font-semibold text-[#0F172A]">
                All Clear — No Stock or Expiry Alerts
              </div>
              <p className="text-xs text-slate-500">
                All clinic consumables are above MOQ and well within shelf life.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8FAFC] border-y border-[#E2E8F0] text-[11px] font-semibold text-slate-500 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Consumable &amp; Batch</th>
                    <th className="py-2.5 px-3">Alert Reason</th>
                    <th className="py-2.5 px-3 text-center">Stock vs MOQ</th>
                    <th className="py-2.5 px-3">Expiry</th>
                    <th className="py-2.5 px-3 text-right">
                      1-Click Fulfillment
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredAlerts.map((item) => (
                    <tr key={item.id} className="hover:bg-rose-50/30">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#0F172A]">
                          {item.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.sku} • Batch {item.batchNumber}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1.5">
                          {item.isLowStock && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-[#F59E0B] border border-amber-200">
                              Below MOQ
                            </span>
                          )}
                          {item.isExpiringSoon && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-[#F43F5E] border border-rose-200">
                              <Clock className="h-2.5 w-2.5" />
                              Expires in {item.daysLeft}d
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-[#0F172A]">
                          {item.stock}
                        </span>{" "}
                        / {item.moq} {item.unit}
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">
                        {item.expiryDate}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() =>
                            reorderConsumableFromHq(item.id, activeBranch.id)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold cursor-pointer transition-colors"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Reorder from HQ
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Slide-Over Purchase Order (PO) Cart Drawer */}
      <AnimatePresence>
        {cartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-slate-900/35 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#FFFFFF] border-l border-[#E2E8F0] shadow-2xl h-full flex flex-col z-10"
            >
              <div className="px-5 py-4 border-b border-[#E2E8F0] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#2563EB]">
                    B2B Purchase Order Cart
                  </div>
                  <h3 className="text-base font-semibold text-[#0F172A]">
                    {activeBranch.name}
                  </h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 cursor-pointer"
                  aria-label="Close PO Cart"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {cart.length === 0 ? (
                  <div className="py-16 text-center space-y-2">
                    <ShoppingCart className="h-10 w-10 text-slate-300 mx-auto" />
                    <div className="text-sm font-semibold text-[#0F172A]">
                      Your PO Cart is Empty
                    </div>
                    <p className="text-xs text-slate-500">
                      Add proprietary formulations or clinic consumables from
                      the B2B Brand Portal.
                    </p>
                  </div>
                ) : (
                  cart.map(({ product, qty }) => (
                    <div
                      key={product.id}
                      className="p-3.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="text-[10px] font-mono text-slate-400">
                            {product.sku}
                          </div>
                          <div className="text-xs font-semibold text-[#0F172A]">
                            {product.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {formatINR(product.wholesalePrice)} /{" "}
                            {product.packSize}
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 rounded text-slate-400 hover:text-[#F43F5E] cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
                        <div className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateCartQty(product.id, -1)}
                            className="p-0.5 text-slate-600 hover:text-[#0F172A] cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-semibold w-5 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateCartQty(product.id, 1)}
                            className="p-0.5 text-slate-600 hover:text-[#0F172A] cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-[#0F172A]">
                          {formatINR(product.wholesalePrice * qty)}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-5 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Total Packs</span>
                  <span className="font-semibold text-[#0F172A]">
                    {cartCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-[#0F172A]">
                  <span>PO Wholesale Total</span>
                  <span className="text-[#2563EB]">{formatINR(cartTotal)}</span>
                </div>
                <button
                  onClick={handleSubmitPo}
                  disabled={cart.length === 0}
                  className="w-full py-2.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-40 text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  Submit Purchase Order to HQ
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
