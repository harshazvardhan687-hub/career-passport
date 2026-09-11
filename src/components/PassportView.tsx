import React, { useState } from "react";
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Share2,
  Lock,
  QrCode,
  GraduationCap,
  Briefcase,
  Code2,
  FileBadge,
  Trophy,
  Zap,
  Edit3,
} from "lucide-react";
import { PassportProfile, Achievement } from "../types";

interface PassportViewProps {
  passport?: PassportProfile;
  onViewEvidence?: () => void;
  onViewProofClick?: () => void;
  onOpenShareModal?: () => void;
  onOpenShare?: () => void;
  onNavigateToQuickAdd?: () => void;
  onAddSkillClick?: () => void;
  onNavigateToFraudChecker?: () => void;
  onOpenEditProfile?: () => void;
}

export const PassportView: React.FC<PassportViewProps> = ({
  passport,
  onViewEvidence,
  onViewProofClick,
  onOpenShareModal,
  onOpenShare,
  onNavigateToQuickAdd,
  onAddSkillClick,
  onNavigateToFraudChecker,
  onOpenEditProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleViewEvidence = onViewEvidence || onViewProofClick || (() => {});
  const handleOpenShare = onOpenShareModal || onOpenShare || (() => {});
  const handleQuickAdd = onNavigateToQuickAdd || onAddSkillClick || (() => {});
  const handleFraud = onNavigateToFraudChecker || (() => {});

  const safeScore = passport?.careerScore ?? 0;
  const maxCreditsBenchmark = 1000;
  const progressPercent = Math.min(
    100,
    Math.round((safeScore / maxCreditsBenchmark) * 100)
  );

  const categories = [
    "All",
    "Degree",
    "Internship",
    "Projects",
    "Certifications",
    "Verified skills",
    "Hackathon",
  ];

  const achievementsList = passport?.achievements || [];
  const filteredAchievements = achievementsList.filter((ach: Achievement) => {
    const matchesCategory =
      selectedCategory === "All" || ach.category === selectedCategory;
    const matchesQuery =
      ach.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ach.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ach.notes && ach.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Degree":
        return <GraduationCap className="w-4 h-4 text-blue-600" />;
      case "Internship":
      case "Work experience":
        return <Briefcase className="w-4 h-4 text-teal-600" />;
      case "Projects":
        return <Code2 className="w-4 h-4 text-purple-600" />;
      case "Certifications":
        return <FileBadge className="w-4 h-4 text-amber-600" />;
      case "Hackathon":
        return <Trophy className="w-4 h-4 text-yellow-600" />;
      default:
        return <Award className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Official Passport Card Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Avatar & Identity Details */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={passport?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={passport?.fullName || "Candidate"}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-white shadow-md ring-2 ring-slate-100"
              />
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs"
                title="Cryptographically Verified Passport"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
              </div>
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 truncate">
                  {passport?.fullName || "Career Member"}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-mono font-bold">
                  {passport?.passportNumber || "CP-0000"}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                  Verified Identity
                </span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-slate-700">
                {passport?.headline || "Verified Professional"}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                <span>📍 {passport?.location || "Global"}</span>
                <span>•</span>
                <span>🎯 Target: {passport?.targetRole || "Software Engineering"}</span>
                <span>•</span>
                <span className="font-mono text-[11px]">
                  Anchored: {passport?.verifiedAt || "Recent"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Career Score & Quick Share CTA */}
          <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-auto gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
            <div className="text-left lg:text-right">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Total Verified Credits
              </div>
              <div className="flex items-baseline gap-1.5 lg:justify-end">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-blue-700">
                  {safeScore}
                </span>
                <span className="text-xs font-semibold text-slate-500 font-sans">
                  / 1,000 cr
                </span>
              </div>
              <div className="w-36 h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1 hidden sm:block">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {onOpenEditProfile && (
                <button
                  onClick={onOpenEditProfile}
                  className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
                  title="Edit Profile"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Edit Profile</span>
                </button>
              )}
              <button
                onClick={handleOpenShare}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-blue-300" />
                <span>Share & QR</span>
              </button>
              <button
                onClick={handleViewEvidence}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Evidence Locker</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bio statement */}
        <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-600 leading-relaxed max-w-4xl">
          <span className="font-bold text-slate-800">Verified Dossier: </span>
          {passport?.bio || "Verified candidate credential dossier and cryptographic career ledger."}
        </div>
      </div>

      {/* Credit Ledger Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Career Credit Ledger
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Every row is backed by code, official transcripts, or employer attestations.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search credits or issuer..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Achievement & Organization</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Verification Proof</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Career Credits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredAchievements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No achievements match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredAchievements.map((ach) => (
                  <tr
                    key={ach.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-900 text-sm">
                        {ach.title}
                      </div>
                      <div className="text-slate-500 text-xs">
                        {ach.organization}
                      </div>
                      {ach.notes && (
                        <div className="text-[11px] text-slate-500 italic mt-0.5 max-w-md">
                          {ach.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200">
                        {getCategoryIcon(ach.category)}
                        {ach.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified Proof
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-500 text-xs">
                      {ach.date}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="inline-block px-2.5 py-1 rounded-xl bg-blue-50 border border-blue-200 font-mono font-bold text-blue-700 text-xs">
                        +{ach.credits} cr
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Ledger Bottom Summary Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              100% of credits in this ledger are cryptographically anchored and audited.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleQuickAdd}
              className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Quick Add Milestone</span>
            </button>
            <span>•</span>
            <button
              onClick={handleFraud}
              className="text-slate-600 font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Check Cert Authenticity</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
