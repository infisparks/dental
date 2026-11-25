import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { DentAiProvider } from "@/context/DentAiContext";
import { AppShell } from "@/components/AppShell";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DentAI Pro — Dr. Bajaj Dental Network",
  description:
    "AI-Enabled Dental Franchise & Clinic Ecosystem Prototype (HQ Franchisor, Clinic ERP, Patient Super-App, AI Receptionist & DPDP Compliance)",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full font-sans bg-[#F8FAFC] text-[#0F172A]">
        <DentAiProvider>
          <AppShell>{children}</AppShell>
          <Toaster richColors position="bottom-right" />
        </DentAiProvider>
      </body>
    </html>
  );
}
