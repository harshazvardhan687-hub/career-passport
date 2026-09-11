import React from "react";
import {
  Menu,
  Award,
  FileText,
  Zap,
  ShieldCheck,
  FileCheck,
  Briefcase,
  Globe,
  Wrench,
  Search,
  Share2,
  GraduationCap
} from "lucide-react";
import { PassportProfile } from "../types";

interface HeaderProps {
  activeTab?: string;
  activePassport?: PassportProfile;
  passport?: PassportProfile;
  onOpenSidebar?: () => void;
  onSelectTab?: (tab: string) => void;
  onOpenShareModal?: () => void;
  onOpenShare?: () => void;
  onOpenManagePersonas?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab = "passport",
  activePassport,
  passport,
  onOpenSidebar = () => {},
  onSelectTab = (_tab: string) => {},
  onOpenShareModal,
  onOpenShare,
}) => {
  const currentPassport = activePassport || passport;
  const careerScore = currentPassport?.careerScore ?? 0;
  const handleOpenShare = onOpenShareModal || onOpenShare || (() => {});

  const getTabHeaderInfo = () => {
    switch (activeTab) {
      case "passport":
        return {
          title: "Career Passport",
          subtitle: "Cryptographic Credential & Credit Ledger",
          icon: Award,
        };
      case "roadmap":
        return {
          title: "Student Progression Roadmap",
          subtitle: "Continuous Cumulative Milestone & Credit Accumulation",
          icon: GraduationCap,
        };
      case "parser":
      case "resume-parser":
        return {
          title: "Resume & Transcript Parser",
          subtitle:
            "Extract Degrees, Experience & Skills into Verified Credits",
          icon: FileText,
        };
      case "quickadd":
      case "quick-add":
        return {
          title: "Student Quick-Add Hub",
          subtitle: "Instant 1-Click Portfolio & Evidence Presets",
          icon: Zap,
        };
      case "fraud":
      case "fraud-checker":
        return {
          title: "AI Certificate Fraud Inspector",
          subtitle: "Accreditation, Schema & Anti-Tamper Verification",
          icon: ShieldCheck,
        };
      case "locker":
      case "evidence":
        return {
          title: "Evidence Locker",
          subtitle: "Cryptographically Verified Artifacts & Hashes",
          icon: FileCheck,
        };
      case "jobs":
        return {
          title: "Job Match & Skill Gaps",
          subtitle:
            "Target Role Benchmarks & 1-Click Assessment Unlocks",
          icon: Briefcase,
        };
      case "global":
      case "recognition":
        return {
          title: "Global Qualification Pathways",
          subtitle: "Cross-Border Foreign Credential Bridging",
          icon: Globe,
        };
      case "invisible":
      case "extractor":
        return {
          title: "Invisible Skills Extractor",
          subtitle: "Formalize Gig, Trades & Informal Experience",
          icon: Wrench,
        };
      case "recruiter":
        return {
          title: "Recruiter & Employer Search",
          subtitle: "Search Talent by Verified Real-World Evidence",
          icon: Search,
        };
      default:
        return {
          title: "Career Passport",
          subtitle: "Standardized Portable Proof of Skills",
          icon: Award,
        };
    }
  };

  const headerInfo = getTabHeaderInfo();
  const Icon = headerInfo.icon;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition"
            aria-label="Open navigation sidebar"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>

          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 hidden sm:flex">
              <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="truncate">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-tight truncate">
                {headerInfo.title}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium truncate hidden sm:block">
                {headerInfo.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Credits Counter, Upload Resume quick button, Share Modal button */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono font-bold text-emerald-700 text-xs">
              {careerScore}
            </span>
            <span className="text-emerald-700 text-[10px] hidden sm:inline font-semibold">
              Credits
            </span>
          </div>

          <button
            onClick={() => onSelectTab("resume-parser")}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              activeTab === "resume-parser" || activeTab === "parser"
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            title="Upload or Paste Resume"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Upload Resume</span>
          </button>

          <button
            onClick={handleOpenShare}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
            title="Share Passport or View QR"
          >
            <Share2 className="w-4 h-4 text-slate-700" />
          </button>
        </div>
      </div>
    </header>
  );
};
