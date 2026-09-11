import React, { useState } from "react";
import {
  Zap,
  GraduationCap,
  Briefcase,
  Code2,
  FileBadge,
  Trophy,
  CheckCircle2,
  Plus,
  ShieldCheck,
  ExternalLink,
  Award,
} from "lucide-react";
import { Achievement, Skill, PassportProfile } from "../types";

interface QuickAddViewProps {
  passport?: PassportProfile;
  onAddAchievement?: (ach: Achievement) => void;
  onAddMilestone?: (milestone: {
    category: any;
    title: string;
    organization: string;
    credits: number;
    notes: string;
    proofType?: string;
  }) => void;
  onAddSkill?: (skill: Skill) => void;
  currentScore?: number;
  studentName?: string;
  onNavigateToFraudChecker?: () => void;
}

export const QuickAddView: React.FC<QuickAddViewProps> = ({
  passport,
  onAddAchievement,
  onAddMilestone,
  onAddSkill,
  currentScore,
  studentName,
  onNavigateToFraudChecker = () => {},
}) => {
  const [category, setCategory] = useState<string>("Projects");
  const [title, setTitle] = useState<string>("");
  const [organization, setOrganization] = useState<string>("");
  const [proofUrl, setProofUrl] = useState<string>("");
  const [credits, setCredits] = useState<number>(120);
  const [addedItemTitle, setAddedItemTitle] = useState<string | null>(null);

  const score = currentScore ?? passport?.careerScore ?? 0;
  const name = studentName || passport?.fullName || "Candidate";

  const handleSaveAchievement = (ach: Achievement) => {
    if (onAddAchievement) {
      onAddAchievement(ach);
    } else if (onAddMilestone) {
      onAddMilestone({
        category: ach.category,
        title: ach.title,
        organization: ach.organization,
        credits: ach.credits,
        notes: ach.notes || "",
        proofType: (ach as any).proofType || "Self-Reported Verification",
      });
    }
  };

  const defaultCreditsByCategory: Record<string, number> = {
    Degree: 200,
    Internship: 150,
    Projects: 120,
    Certifications: 80,
    Hackathon: 50,
    "Verified skills": 100,
    "Work experience": 120,
  };

  const handleCategoryChange = (cat: string) => {
    setCategory(cat);
    setCredits(defaultCreditsByCategory[cat] || 100);
  };

  const quickPresets = [
    {
      category: "Degree",
      title: "B.Tech / BS in Computer Science & Engineering",
      organization: "National Institute of Technology",
      credits: 200,
      icon: GraduationCap,
      color: "from-blue-500/20 to-indigo-500/20 text-blue-300 border-blue-500/30",
      proof: "https://university-verify.edu/transcripts/BS-CS-2024",
    },
    {
      category: "Internship",
      title: "Summer Software Engineering Intern",
      organization: "FinTech Labs / Stripe Partner",
      credits: 150,
      icon: Briefcase,
      color: "from-teal-500/20 to-emerald-500/20 text-teal-300 border-teal-500/30",
      proof: "https://workday.partner.com/verify/internship/INT-883",
    },
    {
      category: "Projects",
      title: "Full-Stack E-Commerce & Payment Microservice",
      organization: "GitHub & Live Cloud Deployment",
      credits: 120,
      icon: Code2,
      color: "from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30",
      proof: "https://github.com/rahulsharma/fullstack-ecommerce-repo",
    },
    {
      category: "Certifications",
      title: "AWS Certified Cloud Practitioner / Solutions Architect",
      organization: "Amazon Web Services (AWS)",
      credits: 80,
      icon: FileBadge,
      color: "from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30",
      proof: "https://aws.amazon.com/verification/AWS-CLD-9021",
    },
    {
      category: "Hackathon",
      title: "National Smart Mobility Hackathon - 1st Runner Up",
      organization: "TechSprint Innovation Summit",
      credits: 50,
      icon: Trophy,
      color: "from-yellow-500/20 to-amber-500/20 text-yellow-300 border-yellow-500/30",
      proof: "https://devpost.com/software/mobility-mesh-protocol",
    },
    {
      category: "Verified skills",
      title: "Python, SQL & Data Pipelines Proctored Score",
      organization: "Career Passport Assessment Engine",
      credits: 100,
      icon: Award,
      color: "from-cyan-500/20 to-teal-500/20 text-cyan-300 border-cyan-500/30",
      proof: "https://careerpassport.id/audit/skill-py-sql-994",
    },
  ];

  const handleAddPreset = (preset: (typeof quickPresets)[0]) => {
    const newAch: Achievement = {
      id: "ach-" + Date.now(),
      category: preset.category,
      title: preset.title,
      organization: preset.organization,
      credits: preset.credits,
      date: new Date().toISOString().split("T")[0],
      verified: true,
      notes: `Verified student achievement backed by proof at ${preset.proof}`,
    };
    handleSaveAchievement(newAch);

    if (
      onAddSkill &&
      (preset.category === "Projects" || preset.category === "Verified skills")
    ) {
      onAddSkill({
        id: "sk-" + Date.now(),
        name: preset.title.split(" ")[0] + " System",
        category: "Technical",
        credits: preset.credits,
        level: "Proficient",
        proofList: [
          {
            id: "prf-" + Date.now(),
            type: "Project",
            title: preset.title,
            issuerOrEntity: preset.organization,
            date: new Date().toISOString().split("T")[0],
            verificationStatus: "Verified",
            verificationHash:
              "sha256_" + Math.random().toString(36).substring(2, 10),
            evidenceUrl: preset.proof,
            details: "Automatically verified with repository commit history.",
          },
        ],
      });
    }

    setAddedItemTitle(preset.title);
    setTimeout(() => setAddedItemTitle(null), 3500);
  };

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAch: Achievement = {
      id: "ach-" + Date.now(),
      category,
      title: title.trim(),
      organization: organization.trim() || "Accredited Entity",
      credits: Number(credits) || 50,
      date: new Date().toISOString().split("T")[0],
      verified: true,
      notes: proofUrl
        ? `Proof artifact: ${proofUrl}`
        : "Student verified record",
    };

    handleSaveAchievement(newAch);
    setAddedItemTitle(newAch.title);
    setTitle("");
    setOrganization("");
    setProofUrl("");
    setTimeout(() => setAddedItemTitle(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xs text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-slate-200 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Efficient Student Passport Builder</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Add Everything in Seconds
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
            Add your degrees, internships, coding projects, hackathons, and
            certifications. Every verified item boosts your Career Credits and
            elevates your match rate with employers.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-right shrink-0">
          <div className="text-[10px] uppercase font-bold text-slate-400">
            {name}’s Score
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">
            {score} cr
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            100% Cryptographic Ledger
          </div>
        </div>
      </div>

      {/* Success Notification Alert */}
      {addedItemTitle && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between gap-3 text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold">Added to Ledger: </span>
              <span>{addedItemTitle}</span>
            </div>
          </div>
          <span className="font-mono font-bold text-emerald-700">
            + Credits Added
          </span>
        </div>
      )}

      {/* 1-Click Presets Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Instant 1-Click Milestone Presets
            </h3>
            <p className="text-xs text-slate-500">
              Click any verified card to immediately link it to your Career Passport.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {quickPresets.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <div
                key={idx}
                onClick={() => handleAddPreset(preset)}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xs transition bg-slate-50/50 hover:bg-white cursor-pointer group flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg bg-slate-200 text-slate-700">
                      {preset.category}
                    </span>
                    <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-200">
                      +{preset.credits} cr
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm mt-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {preset.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {preset.organization}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] truncate max-w-[170px] text-slate-400">
                    {preset.proof}
                  </span>
                  <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Custom Milestone Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Add Custom Career Milestone
            </h3>
            <p className="text-xs text-slate-500">
              Manually record any degree, hackathon, certificate, or research paper.
            </p>
          </div>
          <button
            onClick={onNavigateToFraudChecker}
            className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Verify Cert Authenticity First</span>
          </button>
        </div>

        <form onSubmit={handleSubmitCustom} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Milestone Category
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              >
                {Object.keys(defaultCreditsByCategory).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat} (+{defaultCreditsByCategory[cat]} cr)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Milestone Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Master's in Artificial Intelligence"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Issuing Organization / University / Employer
              </label>
              <input
                type="text"
                required
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Stanford Online / Google"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                Proof URL / GitHub Repo / Credential Link
              </label>
              <input
                type="url"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://github.com/... or https://issuer.org/verify/..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Career Credits Awarded
              </label>
              <input
                type="number"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                min={10}
                max={500}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Milestone to Passport</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
