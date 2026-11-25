"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Plus,
  Minus,
  Trash2,
  X,
  MapPin,
  CheckCircle2,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import { useDentAi } from "@/context/DentAiContext";
import { formatINR, cn } from "@/lib/utils";
import type { D2COrder, D2CProduct } from "@/types/dentai";

const ORDER_STEPS: D2COrder["status"][] = [
  "Confirmed",
  "Packed",
  "Out for Delivery",
  "Delivered",
];

const ADDRESSES = [
  "Home: 1402 Pali Hill Residency, Bandra West, Mumbai 400050",
  "Office: 7th Floor, Maker Maxity, BKC, Mumbai 400051",
  "Clinic Pickup: DentAI Pro — Bandra West",
];

export function PatientStoreTab() {
  const { d2cProducts, d2cOrders, placeD2cOrder, advanceD2cOrderStatus } =
    useDentAi();

  const [category, setCategory] = useState<string>("All");
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Array<{ product: D2CProduct; qty: number }>>(
    []
  );
  const [selectedAddress, setSelectedAddress] = useState(ADDRESSES[0]);
  const [upiId, setUpiId] = useState("aarav.sharma@okaxis");

  const prescribedProducts = d2cProducts.filter((p) => p.isPrescribedKit);
  const prescribedTotal = prescribedProducts.reduce((s, p) => s + p.price, 0);

  const filtered =
    category === "All"
      ? d2cProducts
      : d2cProducts.filter((p) => p.category === category);

  const addItem = (product: D2CProduct) => {
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (found) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    toast.success(`Added ${product.name}`);
  };

  const handleOneClickPrescribedKit = () => {
    setCart(prescribedProducts.map((p) => ({ product: p, qty: 1 })));
    setCartOpen(true);
    toast.success("Dr. Sharma's Prescribed Kit Loaded", {
      description: `${prescribedProducts.length} items added (${formatINR(prescribedTotal)}).`,
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);

  const handleUpiCheckout = () => {
    if (cart.length === 0) return;
    placeD2cOrder({ items: cart, address: selectedAddress });
    setCart([]);
    setCartOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* Highlighted Prescribed Kit Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#4F46E5] text-white p-4 space-y-2.5 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-semibold">
            <Sparkles className="h-3 w-3" />
            Prescribed by Dr. Sharma
          </span>
          <span className="text-xs font-bold">
            {formatINR(prescribedTotal)}
          </span>
        </div>
        <div className="text-xs font-medium text-blue-100">
          Post-RCT Recovery Kit: Nano-Hydroxyapatite Paste + 0.2% Mouthwash +
          Surgical Bamboo Brush
        </div>
        <button
          onClick={handleOneClickPrescribedKit}
          className="w-full py-2 rounded-xl bg-white text-[#2563EB] hover:bg-blue-50 text-xs font-bold cursor-pointer transition-colors"
        >
          1-Click Buy Prescribed Kit
        </button>
      </div>

      {/* Category Filter + Cart Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {[
            "All",
            "Toothpaste",
            "Cleaning Kit",
            "Caring Kit",
            "Prescribed Pharma",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap border cursor-pointer",
                category === cat
                  ? "bg-[#2563EB] text-white border-[#2563EB]"
                  : "bg-white text-slate-600 border-[#E2E8F0]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={() => setCartOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] text-white text-xs font-semibold shrink-0 cursor-pointer"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {cartCount}
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((prod) => (
          <div
            key={prod.id}
            className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-3.5 shadow-2xs flex flex-col justify-between gap-2.5"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-semibold text-[#2563EB]">
                  {prod.category}
                </span>
                {prod.tag && (
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-indigo-50 text-[#4F46E5] border border-indigo-200">
                    {prod.tag}
                  </span>
                )}
              </div>
              <div className="text-xs font-bold text-[#0F172A] leading-snug">
                {prod.name}
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-2">
                {prod.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <div>
                <span className="text-sm font-bold text-[#0F172A]">
                  {formatINR(prod.price)}
                </span>
                <span className="ml-1 text-[10px] text-slate-400 line-through">
                  {formatINR(prod.mrp)}
                </span>
              </div>
              <button
                onClick={() => addItem(prod)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white text-[11px] font-semibold cursor-pointer transition-colors"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live D2C Order Tracking */}
      {d2cOrders.length > 0 && (
        <div className="space-y-2.5 pt-2">
          <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
            <Truck className="h-4 w-4 text-[#2563EB]" />
            Live D2C Order Tracking ({d2cOrders.length})
          </div>
          {d2cOrders.map((ord) => {
            const idx = ORDER_STEPS.indexOf(ord.status);
            return (
              <div
                key={ord.id}
                className="rounded-2xl bg-[#FFFFFF] border border-[#E2E8F0] p-3.5 space-y-2.5 text-xs shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#2563EB]">
                    {ord.orderNumber}
                  </span>
                  <span className="font-bold text-[#0F172A]">
                    {formatINR(ord.totalAmount)} (UPI)
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {ORDER_STEPS.map((st, sIdx) => (
                    <span
                      key={st}
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                        ord.status === "Delivered" && sIdx <= idx
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
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="truncate max-w-[200px]">{ord.address}</span>
                  {ord.status !== "Delivered" && (
                    <button
                      onClick={() => advanceD2cOrderStatus(ord.id)}
                      className="text-[#2563EB] font-semibold hover:underline cursor-pointer shrink-0"
                    >
                      Simulate Delivery →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cart Drawer Modal */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white h-full border-l border-[#E2E8F0] shadow-2xl flex flex-col">
            <div className="px-4 py-3.5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="text-sm font-bold text-[#0F172A] flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4 text-[#2563EB]" />
                Dental Care Cart ({cartCount})
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1 text-slate-400 hover:text-[#0F172A] cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length === 0 ? (
                <div className="py-16 text-center text-xs text-slate-400">
                  Your cart is empty. Add products or tap &ldquo;1-Click Buy
                  Prescribed Kit&rdquo;.
                </div>
              ) : (
                cart.map(({ product, qty }) => (
                  <div
                    key={product.id}
                    className="p-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-2 text-xs"
                  >
                    <div className="flex justify-between gap-2">
                      <span className="font-semibold text-[#0F172A]">
                        {product.name}
                      </span>
                      <button
                        onClick={() => updateQty(product.id, -qty)}
                        className="text-slate-400 hover:text-[#F43F5E] cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 bg-white border border-[#E2E8F0] rounded-lg px-2 py-0.5">
                        <button
                          onClick={() => updateQty(product.id, -1)}
                          className="cursor-pointer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="font-semibold">{qty}</span>
                        <button
                          onClick={() => updateQty(product.id, 1)}
                          className="cursor-pointer"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="font-bold text-[#0F172A]">
                        {formatINR(product.price * qty)}
                      </span>
                    </div>
                  </div>
                ))
              )}

              {cart.length > 0 && (
                <div className="space-y-3 pt-2 border-t border-[#E2E8F0] text-xs">
                  <div>
                    <label className="font-semibold text-[#0F172A] flex items-center gap-1 mb-1">
                      <MapPin className="h-3.5 w-3.5 text-[#2563EB]" />
                      Delivery Address
                    </label>
                    <select
                      value={selectedAddress}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]"
                    >
                      {ADDRESSES.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#0F172A] block mb-1">
                      UPI ID (Instant Checkout)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] space-y-2.5">
              <div className="flex justify-between text-sm font-bold text-[#0F172A]">
                <span>Total Payable</span>
                <span className="text-[#2563EB]">{formatINR(cartTotal)}</span>
              </div>
              <button
                onClick={handleUpiCheckout}
                disabled={cart.length === 0}
                className="w-full py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="h-4 w-4" />
                Pay {formatINR(cartTotal)} via UPI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
