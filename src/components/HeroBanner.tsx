import React from "react";
import { Award, Zap, ShieldCheck, Users } from "lucide-react";
import { PassportProfile } from "../types";

interface HeroBannerProps {
  passports?: PassportProfile[];
  passport?: PassportProfile;
  activePassport?: PassportProfile;
  activePersonaId?: string;
  onSelectPersona?: (id: string) => void;
  onOpenQuickAdd?: () => void;
  onOpenFraudChecker?: () => void;
  onOpenManageMembers?: () => void;
  onOpenShare?: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  passports = [],
  passport,
  activePassport,
  activePersonaId,
  onSelectPersona,
  onOpenQuickAdd,
  onOpenFraudChecker,
  onOpenManageMembers,
  onNavigateTab,
}) => {
  const currentPassport =
    activePassport ||
    passport ||
    (passports && passports.find((p) => p.id === activePersonaId)) ||
    (passports && passports[0]);

  const personaList =
    passports && passports.length > 0
      ? passports
      : currentPassport
      ? [currentPassport]
      : [];

  const handleQuickAdd =
    onOpenQuickAdd ||
    (onNavigateTab ? () => onNavigateTab("quickadd") : () => {});
  const handleFraud =
    onOpenFraudChecker ||
    (onNavigateTab ? () => onNavigateTab("fraud") : () => {});
  const handleManage = onOpenManageMembers || (() => {});
  const handleSelect = onSelectPersona || (() => {});
  return (
    <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs mb-6">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold tracking-wide uppercase">
              <Award className="w-3 h-3 text-blue-600" />
              Lifelong Career Passport
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              • Real Evidence • Anti-Fraud Verification
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
            Standardized Proof of Skills, Education & Achievements
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            Every degree, internship, software project, and certification earns verified{" "}
            <strong className="text-blue-700 font-semibold">Career Credits</strong>
            . Backed by real evidence and recognized across borders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={handleQuickAdd}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-white" />
            <span>Quick Add Everything</span>
          </button>
          <button
            onClick={handleFraud}
            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Fraud Checker</span>
          </button>
        </div>
      </div>

      {/* Persona quick switch strip */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider shrink-0">
            Active Persona:
          </span>
          <div className="flex items-center gap-1.5">
            {personaList.map((p) => {
              const isActive = p.id === activePersonaId;
              return (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-medium transition cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-blue-50 border border-blue-300 text-blue-800 font-bold shadow-2xs"
                      : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600"
                  }`}
                >
                  <img
                    src={p.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt={p.fullName || "Member"}
                    className="w-4 h-4 rounded-full object-cover"
                  />
                  <span>{(p.fullName || "Candidate").split(",")[0]}</span>
                  <span className="text-[10px] font-mono text-slate-500">
                    ({p.careerScore ?? 0} cr)
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleManage}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 shrink-0 transition cursor-pointer"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Manage Members</span>
        </button>
      </div>
    </section>
  );
};
