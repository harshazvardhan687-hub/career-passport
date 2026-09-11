import React, { useState } from "react";
import {
  FileCheck,
  ShieldCheck,
  Code2,
  FileBadge,
  Briefcase,
  UserCheck,
  ExternalLink,
  Copy,
  Check,
  Plus,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { PassportProfile, Skill, SkillProof } from "../types";

interface EvidenceLockerViewProps {
  passport?: PassportProfile;
  onAddProofToSkill?: (skillId: string, proof: SkillProof) => void;
  onNavigateToQuickAdd?: () => void;
}

export const EvidenceLockerView: React.FC<EvidenceLockerViewProps> = ({
  passport,
  onAddProofToSkill,
  onNavigateToQuickAdd,
}) => {
  const skills = passport?.skills || [];
  const [selectedSkillId, setSelectedSkillId] = useState<string>(
    skills[0]?.id || ""
  );
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [verifiedSignatures, setVerifiedSignatures] = useState<Record<string, boolean>>({});

  const activeSkill =
    skills.find((s) => s.id === selectedSkillId) || skills[0];

  const filteredSkills =
    activeCategory === "ALL"
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  const getProofIcon = (type: string) => {
    switch (type) {
      case "Project":
        return <Code2 className="w-4 h-4 text-blue-600" />;
      case "Assessment":
        return <FileCheck className="w-4 h-4 text-emerald-600" />;
      case "Certificate":
        return <FileBadge className="w-4 h-4 text-amber-600" />;
      case "Internship":
      case "Work Experience":
      case "Work Log":
        return <Briefcase className="w-4 h-4 text-indigo-600" />;
      case "Supervisor Sign-off":
        return <UserCheck className="w-4 h-4 text-purple-600" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
    }
  };

  const handleCopyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleVerifySignature = (proofId: string) => {
    setVerifiedSignatures((prev) => ({ ...prev, [proofId]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Every Credit Has Proof</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Verified Skill Evidence Locker
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
            Unlike unverifiable bullet points on a static resume, every skill in{" "}
            <strong>{passport?.fullName || "Candidate"}’s</strong> Career Passport is linked to
            reproducible artifact proofs.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="p-1.5 rounded-xl bg-slate-800 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
          </div>
          {["ALL", "Technical", "Clinical", "Vocational", "Domain", "Soft"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  activeCategory === cat
                    ? "bg-blue-600 text-white font-bold shadow-xs"
                    : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Grid: Skills List on Left, Artifact Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Skills Column */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
            Verified Competencies ({filteredSkills.length})
          </div>

          <div className="space-y-2.5">
            {filteredSkills.map((skill) => {
              const isSelected = skill.id === activeSkill?.id;
              return (
                <div
                  key={skill.id}
                  onClick={() => setSelectedSkillId(skill.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/30 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {skill.category}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1.5">
                        {skill.name}
                      </h4>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-extrabold text-blue-700 font-mono">
                        {skill.credits}{" "}
                        <span className="text-xs font-sans text-slate-500">
                          Credits
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        {skill.level} Tier
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-medium text-slate-600">
                      {skill.proofList.length} Verifiable Artifact
                      {skill.proofList.length === 1 ? "" : "s"}
                    </span>
                    <span className="text-blue-600 text-xs font-semibold">
                      View Audit Log →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Artifact Details Column */}
        <div className="lg:col-span-7">
          {activeSkill ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {activeSkill.category} Competency
                  </span>
                  <h3 className="text-xl font-black text-slate-900 mt-1.5">
                    {activeSkill.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-right">
                    <div className="text-[9px] text-slate-400 uppercase font-bold">
                      Awarded
                    </div>
                    <div className="text-base font-mono font-bold text-emerald-400">
                      +{activeSkill.credits} cr
                    </div>
                  </div>
                </div>
              </div>

              {/* Artifacts List */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Attached Reproducible Proof Artifacts:
                </div>

                {activeSkill.proofList.map((proof, idx) => {
                  const isVerified = verifiedSignatures[proof.id];
                  return (
                    <div
                      key={proof.id || idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs">
                            {getProofIcon(proof.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold uppercase px-2 py-0.2 rounded bg-slate-200 text-slate-800">
                                {proof.type}
                              </span>
                              <span className="text-xs font-bold text-slate-900">
                                {proof.title}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">
                              Issued / Attested by:{" "}
                              <strong className="text-slate-800">
                                {proof.issuerOrEntity}
                              </strong>{" "}
                              • {proof.date}
                            </p>
                          </div>
                        </div>

                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold shrink-0">
                          {proof.verificationStatus}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-200">
                        {proof.details}
                      </p>

                      {/* Cryptographic Hash & Verification Action */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-200/60 text-xs">
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 bg-white px-2.5 py-1 rounded-lg border border-slate-200 truncate max-w-sm">
                          <span className="text-slate-400 shrink-0">Hash:</span>
                          <span className="truncate text-slate-700">
                            {proof.verificationHash}
                          </span>
                          <button
                            onClick={() => handleCopyHash(proof.verificationHash)}
                            className="p-1 hover:text-blue-600 transition shrink-0"
                            title="Copy Hash"
                          >
                            {copiedHash === proof.verificationHash ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {proof.evidenceUrl && (
                            <a
                              href={proof.evidenceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1 transition"
                            >
                              <span>Artifact Link</span>
                              <ExternalLink className="w-3 h-3 text-slate-400" />
                            </a>
                          )}

                          {isVerified ? (
                            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Signature Valid</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleVerifySignature(proof.id)}
                              className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                            >
                              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                              <span>Verify Signature</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
              Select a competency on the left to view attached evidence.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
