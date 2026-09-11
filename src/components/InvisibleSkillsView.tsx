import React, { useState } from "react";
import {
  Wrench,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Plus,
  ShieldCheck,
  FileSpreadsheet,
  FileCheck2,
  Loader2,
} from "lucide-react";
import { PassportProfile, ExtractedInformalSkill } from "../types";

interface InvisibleSkillsViewProps {
  passport?: PassportProfile;
  onAddExtractedSkill: (skill: {
    name: string;
    credits: number;
    category: string;
    proofType: string;
    details: string;
  }) => void;
}

export const InvisibleSkillsView: React.FC<InvisibleSkillsViewProps> = ({
  passport,
  onAddExtractedSkill,
}) => {
  const [roleTitle, setRoleTitle] = useState<string>(
    "Senior Automotive Diagnostician & Independent Mechanic"
  );
  const [experienceDuration, setExperienceDuration] = useState<string>(
    "5 Years Hands-On Shop Experience"
  );
  const [experienceDescription, setExperienceDescription] = useState<string>(
    "Diagnosed and overhauled over 400 internal combustion engines, resolved complex CAN-bus electrical short-to-grounds with digital oscilloscopes, performed precision brake calibrations, and mentored junior technicians on shop floor safety protocols."
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [extractedSkills, setExtractedSkills] = useState<
    ExtractedInformalSkill[] | null
  >(null);
  const [addedSkills, setAddedSkills] = useState<Record<string, boolean>>({});

  const candidateFirstName = (passport?.fullName || "Candidate").split(" ")[0];
  const candidateScore = passport?.careerScore ?? 0;

  const handleExtract = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/extract-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: roleTitle,
          yearsOrHours: experienceDuration,
          description: experienceDescription,
          category: "Vocational / Informal Work",
        }),
      });
      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setExtractedSkills(resJson.data);
      }
    } catch (err) {
      console.error("Failed to extract skills:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkillToLedger = (skill: ExtractedInformalSkill) => {
    onAddExtractedSkill({
      name: skill.name,
      credits: skill.credits,
      category: skill.category || "Vocational",
      proofType: skill.proofTypes?.[0] || "Work Log",
      details:
        skill.practicalEvidenceSummary ||
        `Extracted and verified through ${experienceDuration} in ${roleTitle}.`,
    });
    setAddedSkills((prev) => ({ ...prev, [skill.name]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Wrench className="w-4 h-4 text-amber-600" />
              <span>Problem 2: Invisible Skills</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Turning Real Experience Into Verified Career Credits
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl mt-1">
              Millions of skilled workers—mechanics, gig workers, artisans,
              technicians, and self-taught coders—lack a 4-year degree. Normally,
              their skills are invisible. Career Passport extracts verifiable
              competencies from real work logs and supervisor sign-offs.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-right shrink-0">
            <div className="text-[10px] uppercase font-bold text-slate-500">
              {candidateFirstName}’s Score
            </div>
            <div className="text-3xl font-black text-amber-700 font-mono">
              {candidateScore}{" "}
              <span className="text-xs text-slate-500 font-sans">Credits</span>
            </div>
            <div className="text-[10px] text-emerald-700 font-bold">
              No Degree Needed
            </div>
          </div>
        </div>

        {/* 4-Step Transformation Flow */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 text-center sm:text-left">
            The Invisible Skills Transformation Flow:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center text-center">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-amber-700 font-bold text-xs block mb-1">
                1. Hands-On Work
              </span>
              <p className="text-[11px] text-slate-600">
                Shop work logs, repair orders, client tickets
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-blue-700 font-bold text-xs block mb-1">
                2. AI Deconstruction
              </span>
              <p className="text-[11px] text-slate-600">
                Maps practical tasks to occupational industry standards
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-purple-700 font-bold text-xs block mb-1">
                3. Supervisor Attestation
              </span>
              <p className="text-[11px] text-slate-600">
                Witnessed verification hash signed by shop lead
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
              <span className="text-emerald-700 font-bold text-xs block mb-1">
                4. Verified Credits
              </span>
              <p className="text-[11px] text-slate-600">
                Portable credits recognized by corporate employers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Extractor Input Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Experience Deconstruction Engine
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Field of Work / Job Title
            </label>
            <input
              type="text"
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Years / Hours of Experience
            </label>
            <input
              type="text"
              value={experienceDuration}
              onChange={(e) => setExperienceDuration(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-slate-700 font-semibold mb-1">
              Practical Work Orders, Tools & Repaired Equipment
            </label>
            <textarea
              rows={3}
              value={experienceDescription}
              onChange={(e) => setExperienceDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleExtract}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deconstructing Practical Experience...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Deconstruct & Convert to Career Credits</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Extracted Skills List */}
      {extractedSkills && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Extracted Verifiable Competencies
              </h3>
              <p className="text-xs text-slate-500">
                Mapped to National Occupational Standards with attached work log
                proof templates.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold font-mono">
              {extractedSkills.length} Competencies Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {extractedSkills.map((sk, idx) => {
              const isAdded = addedSkills[sk.name];
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                        {sk.category}
                      </span>
                      <span className="font-mono font-bold text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200">
                        +{sk.credits} cr
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 mt-2">
                      {sk.name}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {sk.practicalEvidenceSummary}
                    </p>

                    <div className="mt-2 text-[11px] text-slate-500">
                      <strong>Verification Proof: </strong>
                      {sk.proofTypes?.join(" • ") || "Work Log"}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-semibold">
                      {sk.suggestedAction}
                    </span>
                    {isAdded ? (
                      <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Added to Ledger</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddSkillToLedger(sk)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Ledger</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
