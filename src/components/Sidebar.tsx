import React, { useState } from "react";
import {
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
  Users,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  GraduationCap,
  Edit3
} from "lucide-react";
import { PassportProfile } from "../types";

interface SidebarProps {
  passports: PassportProfile[];
  activePassport?: PassportProfile;
  activePassportId?: string;
  onSelectPassport: (id: string) => void;
  onRemovePassport?: (id: string) => void;
  onOpenManageMembers?: () => void;
  onOpenManagePersonas?: () => void;
  onOpenEditProfile?: () => void;
  activeTab: string;
  onSelectTab: (tab: any) => void;
  isOpen?: boolean;
  onClose?: () => void;
  onOpenShareModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  passports = [],
  activePassport,
  activePassportId,
  onSelectPassport,
  onRemovePassport,
  onOpenManageMembers,
  onOpenManagePersonas,
  onOpenEditProfile,
  activeTab,
  onSelectTab,
  isOpen = false,
  onClose,
  onOpenShareModal = () => {},
}) => {
  const [isMemberDropdownOpen, setIsMemberDropdownOpen] = useState(false);

  const currentPassport =
    activePassport ||
    passports.find((p) => p.id === activePassportId) ||
    passports[0] || {
      id: "demo",
      fullName: "Career Member",
      headline: "Verified Professional",
      careerScore: 0,
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      skills: [],
      achievements: [],
    };

  const handleOpenManage = onOpenManageMembers || onOpenManagePersonas || (() => {});

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    if (onClose) onClose();
  };

  const isTabActive = (itemTabId: string) => {
    if (activeTab === itemTabId) return true;
    if (itemTabId === "resume-parser" && (activeTab === "parser" || activeTab === "resume-parser")) return true;
    if (itemTabId === "quick-add" && (activeTab === "quickadd" || activeTab === "quick-add")) return true;
    if (itemTabId === "fraud-checker" && (activeTab === "fraud" || activeTab === "fraud-checker")) return true;
    if (itemTabId === "evidence" && (activeTab === "locker" || activeTab === "evidence")) return true;
    if (itemTabId === "recognition" && (activeTab === "global" || activeTab === "recognition")) return true;
    if (itemTabId === "extractor" && (activeTab === "invisible" || activeTab === "extractor")) return true;
    return false;
  };

  const navSections = [
    {
      title: "CORE PASSPORT",
      items: [
        {
          id: "passport",
          label: "My Passport",
          description: "Identity & Credits Ledger",
          icon: Award,
          badge: `${currentPassport.careerScore || 0} cr`,
          badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/30",
        },
        {
          id: "roadmap",
          label: "Student Roadmap",
          description: "4-Year Cumulative Milestones",
          icon: GraduationCap,
          badge: "Timeline",
          badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        },
        {
          id: "resume-parser",
          label: "Add Resume & Parse",
          description: "1-Click Career Credits",
          icon: FileText,
          badge: "NEW",
          badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        },
        {
          id: "quick-add",
          label: "Quick Add Everything",
          description: "Degrees, Repos & Internships",
          icon: Zap,
          badge: "Fast Add",
          badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
        },
        {
          id: "fraud-checker",
          label: "AI Fraud Checker",
          description: "Real vs Fake Cert Scanner",
          icon: ShieldCheck,
          badge: "AI Guard",
          badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-400/40",
        },
        {
          id: "evidence",
          label: "Evidence Locker",
          description: "Tamper-Proof Audit Files",
          icon: FileCheck,
          badge: `${currentPassport.skills ? currentPassport.skills.length : 0}`,
          badgeColor: "bg-slate-800 text-slate-300 border-slate-700",
        },
      ],
    },
    {
      title: "CAREER & PATHWAYS",
      items: [
        {
          id: "jobs",
          label: "Jobs & Skill Gap",
          description: "Target Benchmarks & 1-Click Tests",
          icon: Briefcase,
        },
        {
          id: "recognition",
          label: "Global Pathways",
          description: "Cross-Border Qualification Transfer",
          icon: Globe,
        },
        {
          id: "extractor",
          label: "Invisible Skills",
          description: "Extract Gig & Shop Experience",
          icon: Wrench,
        },
      ],
    },
    {
      title: "ENTERPRISE & RECRUITER",
      items: [
        {
          id: "recruiter",
          label: "Recruiter Search",
          description: "Verified Candidate Directory",
          icon: Search,
        },
      ],
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-950/95 border-r border-slate-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out backdrop-blur-xl lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="p-4 sm:p-5 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div
              onClick={() => handleTabClick("passport")}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-base tracking-tight font-sans">
                    Career Passport
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-mono font-semibold">
                    v2.4
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                  Proof-Backed Skills
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6 custom-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                {section.title}
              </h3>
              <div className="space-y-0.5 pt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = isTabActive(item.id);
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleTabClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition group cursor-pointer ${
                        isActive
                          ? "bg-blue-600 text-white shadow-sm font-semibold"
                          : "text-slate-300 hover:bg-slate-900 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? "text-white"
                              : "text-slate-400 group-hover:text-blue-400"
                          }`}
                        />
                        <div className="text-left truncate">
                          <div className="leading-tight truncate">{item.label}</div>
                          {item.description && (
                            <div
                              className={`text-[10px] truncate ${
                                isActive
                                  ? "text-blue-100"
                                  : "text-slate-500 group-hover:text-slate-400"
                              }`}
                            >
                              {item.description}
                            </div>
                          )}
                        </div>
                      </div>

                      {item.badge && (
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold shrink-0 border ml-2 ${
                            isActive
                              ? "bg-white/20 text-white border-white/30"
                              : item.badgeColor ||
                                "bg-slate-800 text-slate-400 border-slate-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Member Profile Switcher and Footer Actions */}
        <div className="p-3.5 border-t border-slate-800/80 space-y-2 bg-slate-950/60">
          {/* Dropdown for Personas */}
          {isMemberDropdownOpen && (
            <div className="p-2 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1 mb-2">
              <div className="flex items-center justify-between px-2 py-1 text-[11px] font-bold text-slate-400 uppercase">
                <span>Switch Member Profile</span>
                <button
                  onClick={handleOpenManage}
                  className="text-blue-400 hover:underline cursor-pointer"
                >
                  Manage
                </button>
              </div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {passports.map((p) => {
                  const isSelected = p.id === currentPassport.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectPassport(p.id);
                        setIsMemberDropdownOpen(false);
                      }}
                      className={`p-2 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition text-xs ${
                        isSelected
                          ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                          : "hover:bg-slate-800 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={p.avatar}
                          alt={p.fullName}
                          className="w-7 h-7 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div className="truncate">
                          <div className="font-semibold truncate">{p.fullName}</div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {p.careerScore} cr
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active profile bar */}
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-900/90 border border-slate-800">
            <div
              onClick={() => setIsMemberDropdownOpen(!isMemberDropdownOpen)}
              className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer hover:opacity-90 transition"
            >
              <div className="relative shrink-0">
                <img
                  src={currentPassport.avatar}
                  alt={currentPassport.fullName}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-700"
                />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-white text-xs truncate">
                    {currentPassport.fullName}
                  </span>
                  {isMemberDropdownOpen ? (
                    <ChevronUp className="w-3 h-3 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  )}
                </div>
                <div className="text-[10px] text-blue-400 font-mono font-semibold truncate">
                  {currentPassport.careerScore} Career Credits
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {onOpenEditProfile && (
                <button
                  onClick={onOpenEditProfile}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  title="Edit Profile Details"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleOpenManage}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Manage All Profiles & Add Custom Member"
              >
                <Users className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenShareModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Share Career Passport & QR Code"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
