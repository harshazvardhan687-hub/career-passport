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
  Sparkles,
  Edit3,
  QrCode
} from "lucide-react";
import { PassportProfile } from "../types";
import { getPassportCredits } from "../utils/credits";

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
  onOpenEditProfile?: () => void;
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
  onOpenEditProfile,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPassport =
    activePassport ||
    passport ||
    (passports.find((p) => p.id === activePassportId)) ||
    passports[0];

  const careerScore = getPassportCredits(currentPassport);
  const handleOpenShare = onOpenShareModal || onOpenShare || (() => {});
  const handleOpenManage = onOpenManagePersonas || (() => {});
  const handleOpenEdit = onOpenEditProfile || (() => {});

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

  // Main Nav Items for the top horizontal bar
  const navItems = [
    { id: "passport", label: "My Passport", shortLabel: "Passport", icon: Award },
    { id: "roadmap", label: "Roadmap", shortLabel: "Roadmap", icon: GraduationCap },
    { id: "resume-parser", label: "Resume Parser", shortLabel: "Parser", icon: FileText },
    { id: "quick-add", label: "Quick Add", shortLabel: "Quick Add", icon: Zap },
    { id: "fraud-checker", label: "AI Fraud Guard", shortLabel: "Fraud Guard", icon: ShieldCheck },
    { id: "evidence", label: "Evidence Locker", shortLabel: "Evidence", icon: FileCheck },
    { id: "jobs", label: "Jobs & Gaps", shortLabel: "Jobs", icon: Briefcase },
    { id: "recognition", label: "Global Pathways", shortLabel: "Global", icon: Globe },
    { id: "extractor", label: "Invisible Skills", shortLabel: "Skills", icon: Wrench },
    { id: "recruiter", label: "Recruiter Search", shortLabel: "Recruiters", icon: Search },
  ];

  const isTabActive = (tabId: string) => {
    if (activeTab === tabId) return true;
    if (tabId === "resume-parser" && (activeTab === "parser" || activeTab === "resume-parser")) return true;
    if (tabId === "quick-add" && (activeTab === "quickadd" || activeTab === "quick-add")) return true;
    if (tabId === "fraud-checker" && (activeTab === "fraud" || activeTab === "fraud-checker")) return true;
    if (tabId === "evidence" && (activeTab === "locker" || activeTab === "evidence")) return true;
    if (tabId === "recognition" && (activeTab === "global" || activeTab === "recognition")) return true;
    if (tabId === "extractor" && (activeTab === "invisible" || activeTab === "extractor")) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
      {/* Top Main Row */}
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Mobile Toggle & Brand / Active Persona */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onOpenSidebar}
            className="lg:hidden p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
            aria-label="Open navigation sidebar"
            title="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>

          {/* Brand Logo & Name */}
          <button
            onClick={() => onSelectTab("passport")}
            className="flex items-center gap-2 text-left group cursor-pointer"
            title="Go to My Career Passport"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs group-hover:bg-blue-700 transition shrink-0">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight leading-none group-hover:text-blue-600 transition">
                  Career Passport
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-mono font-bold">
                  v2.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate hidden md:block">
                Portable Proof of Skills Ledger
              </p>
            </div>
          </button>
        </div>

        {/* Right Action Controls & Profile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Credits Counter Pill */}
          <button
            onClick={() => onSelectTab("roadmap")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold shadow-2xs transition cursor-pointer"
            title="View Career Credits & Roadmap Analytics"
          >
            <span className="text-sm">🌟</span>
            <span className="font-mono font-black text-amber-900 text-xs sm:text-sm">
              {careerScore}
            </span>
            <span className="text-amber-800 text-[11px] hidden sm:inline font-bold">
              Credits
            </span>
          </button>

          {/* Quick Add Shortcut */}
          <button
            onClick={() => onSelectTab("quick-add")}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-semibold transition cursor-pointer"
            title="Quick add degree, internship, or project"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden md:inline">Quick Add</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleOpenShare}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
            title="Share Passport & QR Code"
            aria-label="Share Passport"
          >
            <Share2 className="w-4 h-4 text-slate-700" />
          </button>

          {/* Profile Pill & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl border transition cursor-pointer ${
                isProfileMenuOpen
                  ? "border-blue-500 bg-blue-50/60 ring-2 ring-blue-100"
                  : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white"
              }`}
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
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover border border-slate-200 shadow-2xs"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <div className="text-left hidden sm:block max-w-[125px]">
                <div className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {(currentPassport?.fullName || "Candidate").split(",")[0]}
                </div>
                <div className="text-[10px] text-blue-600 font-mono truncate leading-none mt-0.5">
                  {currentPassport?.passportNumber || "CP-0000"}
                </div>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isProfileMenuOpen ? "rotate-180 text-blue-600" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Popover */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Profile Brief Card */}
                <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-3 bg-slate-50/60">
                  <img
                    src={
                      currentPassport?.avatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    }
                    alt={currentPassport?.fullName || "Profile"}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {currentPassport?.fullName || "Candidate"}
                      </h4>
                      <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 border border-blue-200 text-[9px] font-mono font-bold shrink-0">
                        {currentPassport?.passportNumber || "CP-0000"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {currentPassport?.headline || "Verified Professional"}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {careerScore} Career Credits
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        {currentPassport?.location || "Global"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Primary Profile Actions: View & Edit */}
                <div className="p-2 border-b border-slate-100 space-y-1">
                  <button
                    onClick={() => {
                      onSelectTab("passport");
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" />
                      <span>View Full Career Passport</span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-600 bg-white px-1.5 py-0.5 rounded border border-blue-200">
                      Active
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleOpenEdit();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-600" />
                      <span>Edit Profile Details</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Name, Bio, Avatar</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleOpenShare();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-600" />
                      <span>Share Passport & QR Code</span>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>

                {/* Quick Switch Member Profile */}
                {passports && passports.length > 0 && (
                  <div className="p-2 border-b border-slate-100">
                    <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Switch Member</span>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          handleOpenManage();
                        }}
                        className="text-blue-600 hover:underline cursor-pointer lowercase first-letter:uppercase font-medium"
                      >
                        Manage
                      </button>
                    </div>

                    <div className="max-h-48 overflow-y-auto space-y-1 mt-1 custom-scrollbar">
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
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={p.avatar}
                                alt={p.fullName}
                                className="w-7 h-7 rounded-lg object-cover border border-slate-200 shrink-0"
                              />
                              <div className="truncate">
                                <div className="truncate font-medium leading-tight">
                                  {p.fullName}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {p.careerScore} cr • {p.targetRole || "Specialist"}
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
                <div className="p-2">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      handleOpenManage();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span>Manage All Personas / Add Custom</span>
                    </div>
                    <Plus className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Second Row: Horizontal Navigation Bar Tabs */}
      <nav
        className="px-2 sm:px-6 border-t border-slate-100 bg-slate-50/80 overflow-x-auto flex items-center gap-1 sm:gap-1.5 py-1.5 scrollbar-none"
        aria-label="Navigation Tabs"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isTabActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-semibold transition cursor-pointer shrink-0 ${
                active
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/70"
              }`}
              title={item.label}
            >
              <Icon
                className={`w-3.5 h-3.5 ${
                  active ? "text-white" : "text-slate-400"
                }`}
              />
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.shortLabel}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
