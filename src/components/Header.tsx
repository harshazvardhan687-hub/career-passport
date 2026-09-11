import React, { useState, useRef, useEffect } from "react";
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
  GraduationCap,
  ChevronDown,
  User,
  Users,
  Check,
  ExternalLink,
  Plus,
  Sparkles
} from "lucide-react";
import { PassportProfile } from "../types";

interface HeaderProps {
  activeTab?: string;
  activePassport?: PassportProfile;
  passport?: PassportProfile;
  passports?: PassportProfile[];
  activePassportId?: string;
  onSelectPassport?: (id: string) => void;
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
  passports = [],
  activePassportId,
  onSelectPassport,
  onOpenSidebar = () => {},
  onSelectTab = (_tab: string) => {},
  onOpenShareModal,
  onOpenShare,
  onOpenManagePersonas,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPassport = activePassport || passport;
  const careerScore = currentPassport?.careerScore ?? 0;
  const handleOpenShare = onOpenShareModal || onOpenShare || (() => {});
  const handleOpenManage = onOpenManagePersonas || (() => {});

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    if (isProfileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileMenuOpen]);

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
          subtitle: "Extract Degrees, Experience & Skills into Verified Credits",
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
          subtitle: "Target Role Benchmarks & 1-Click Assessment Unlocks",
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
            className="lg:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
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

        {/* Right: Credits Counter, Quick Actions & Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Credits Counter Badge */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono font-bold text-emerald-700 text-xs">
              {careerScore}
            </span>
            <span className="text-emerald-700 text-[10px] hidden md:inline font-semibold">
              Credits
            </span>
          </div>

          {/* Quick Action: Upload Resume */}
          <button
            onClick={() => onSelectTab("resume-parser")}
            className={`hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              activeTab === "resume-parser" || activeTab === "parser"
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            title="Upload or Paste Resume"
          >
            <FileText className="w-3.5 h-3.5 text-blue-600" />
            <span>Upload Resume</span>
          </button>

          {/* Share Modal Trigger */}
          <button
            onClick={handleOpenShare}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
            title="Share Passport or View QR"
            aria-label="Share Passport"
          >
            <Share2 className="w-4 h-4 text-slate-700" />
          </button>

          {/* Profile Pill & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white transition cursor-pointer"
              title="View profile & switch member"
              aria-label="User Profile"
              aria-expanded={isProfileMenuOpen}
            >
              <div className="relative shrink-0">
                <img
                  src={
                    currentPassport?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  }
                  alt={currentPassport?.fullName || "Profile"}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-slate-200"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="text-left hidden sm:block max-w-[120px]">
                <div className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {(currentPassport?.fullName || "Candidate").split(",")[0]}
                </div>
                <div className="text-[10px] text-blue-600 font-mono truncate leading-none mt-0.5">
                  {currentPassport?.passportNumber || "CP-0000"}
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {/* Profile Dropdown Popover */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white border border-slate-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Profile Brief Banner */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                  <img
                    src={
                      currentPassport?.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    }
                    alt={currentPassport?.fullName || "Profile"}
                    className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {currentPassport?.fullName || "Candidate"}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold shrink-0">
                        {currentPassport?.passportNumber || "CP-0000"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {currentPassport?.headline || "Verified Professional"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        {careerScore} Career Credits
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {currentPassport?.location || "Global"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Direct Tab Actions */}
                <div className="px-2 py-1.5 border-b border-slate-100 space-y-0.5">
                  <button
                    onClick={() => {
                      onSelectTab("passport");
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      activeTab === "passport"
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>View My Full Passport</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab("roadmap");
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      activeTab === "roadmap"
                        ? "bg-purple-50 text-purple-700 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span>Progression Roadmap</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab("evidence");
                      setIsProfileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                      activeTab === "evidence" || activeTab === "locker"
                        ? "bg-slate-100 text-slate-900 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <FileCheck className="w-4 h-4 text-slate-600" />
                    <span>Evidence Locker & Proofs</span>
                  </button>
                </div>

                {/* Personas Switcher List */}
                {passports && passports.length > 0 && (
                  <div className="px-2 py-2 border-b border-slate-100">
                    <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Switch Member Profile</span>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleOpenManage();
                        }}
                        className="text-blue-600 hover:underline cursor-pointer lowercase first-letter:uppercase"
                      >
                        Manage
                      </button>
                    </div>

                    <div className="max-h-44 overflow-y-auto space-y-1 mt-1">
                      {passports.map((p) => {
                        const isSelected = p.id === (currentPassport?.id || activePassportId);
                        return (
                          <button
                            key={p.id}
                            onClick={() => {
                              if (onSelectPassport) {
                                onSelectPassport(p.id);
                              }
                              setIsProfileMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between gap-2 p-2 rounded-xl text-xs text-left transition cursor-pointer ${
                              isSelected
                                ? "bg-blue-50 text-blue-900 font-bold border border-blue-200"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img
                                src={p.avatar}
                                alt={p.fullName}
                                className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                              <div className="truncate">
                                <div className="truncate font-medium">{p.fullName}</div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {p.careerScore} credits • {p.targetRole || "Specialist"}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <Check className="w-4 h-4 text-blue-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Modal Triggers */}
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleOpenManage();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-3.5 h-3.5 text-blue-600" />
                      <span>Manage All Profiles / Add Custom</span>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleOpenShare();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Share2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Share Passport & QR Code</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
