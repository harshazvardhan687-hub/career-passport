import React, { useState } from "react";
import {
  Search,
  Building,
  CheckCircle2,
  Filter,
  ShieldCheck,
  ExternalLink,
  Code2,
  FileCheck,
  UserCheck,
  Sparkles,
} from "lucide-react";
import { PassportProfile } from "../types";

interface RecruiterSearchViewProps {
  passports: PassportProfile[];
  onSelectCandidate: (passportId: string) => void;
}

export const RecruiterSearchView: React.FC<RecruiterSearchViewProps> = ({
  passports,
  onSelectCandidate,
}) => {
  const [skillQuery, setSkillQuery] = useState<string>("Java, SQL, Python");
  const [minCredits, setMinCredits] = useState<number>(700);
  const [requireProjectProof, setRequireProjectProof] = useState<boolean>(true);
  const [requireAssessmentProof, setRequireAssessmentProof] =
    useState<boolean>(false);
  const [requireSupervisorProof, setRequireSupervisorProof] =
    useState<boolean>(false);
  const [contactedCandidates, setContactedCandidates] = useState<
    Record<string, boolean>
  >({});

  const exampleQueries = [
    { label: "Java + SQL + min 700 credits", query: "Java, SQL", minCr: 700 },
    {
      label: "Clinical Care + Patient Safety + min 650 credits",
      query: "Clinical Care, Healthcare",
      minCr: 650,
    },
    {
      label: "Engine Repair + Diagnostics + min 600 credits",
      query: "Engine Repair, Troubleshooting",
      minCr: 600,
    },
  ];

  const handleApplyPreset = (item: (typeof exampleQueries)[0]) => {
    setSkillQuery(item.query);
    setMinCredits(item.minCr);
  };

  const queryTerms = skillQuery
    .split(",")
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);

  const matchedResults = passports
    .map((candidate) => {
      const candidateSkills = candidate.skills.map((s) => s.name.toLowerCase());
      const matchedTerms = queryTerms.filter((term) =>
        candidateSkills.some(
          (sk) => sk.includes(term) || term.includes(sk)
        )
      );

      const matchPercent =
        queryTerms.length > 0
          ? Math.round((matchedTerms.length / queryTerms.length) * 100)
          : 100;

      const meetsCredits = candidate.careerScore >= minCredits;

      let meetsProofs = true;
      const allProofTypes = candidate.skills.flatMap((s) =>
        s.proofList.map((p) => p.type)
      );

      if (requireProjectProof && !allProofTypes.includes("Project")) {
        meetsProofs = false;
      }
      if (requireAssessmentProof && !allProofTypes.includes("Assessment")) {
        meetsProofs = false;
      }
      if (
        requireSupervisorProof &&
        !allProofTypes.includes("Supervisor Sign-off")
      ) {
        meetsProofs = false;
      }

      return {
        passport: candidate,
        matchedTerms,
        matchPercent,
        meetsCredits,
        meetsProofs,
      };
    })
    .sort((a, b) => b.passport.careerScore - a.passport.careerScore);

  const handleContact = (id: string) => {
    setContactedCandidates((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-4 shadow-xs text-white">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Building className="w-4 h-4 text-blue-400" />
              <span>Company Talent Search Engine</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Hire Faster: Search Verified Skills, Not Unverified Resumes
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
              Companies don’t have to depend on resume self-reporting. Query the
              ledger for candidates with specific verified skills and minimum
              Career Credits.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-right shrink-0">
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Total Verified Pool
            </div>
            <div className="text-3xl font-black text-emerald-400 font-mono">
              {passports.length} Passports
            </div>
            <div className="text-[10px] text-slate-400 font-semibold">
              100% Cryptographic Audit Trail
            </div>
          </div>
        </div>

        {/* Quick Example Recruiter Queries */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">
            Example Recruiter Queries:
          </span>
          {exampleQueries.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleApplyPreset(item)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:border-blue-400 text-slate-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>“{item.label}”</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Query Controls */}
      <div className="p-5 rounded-3xl border border-slate-200 bg-white shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-6 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Required Verified Competencies (comma separated)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={skillQuery}
                onChange={(e) => setSkillQuery(e.target.value)}
                placeholder="e.g. React, TypeScript, Cloud, Docker..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Minimum Career Credits:{" "}
              <span className="font-mono text-blue-700 font-bold">
                {minCredits} cr
              </span>
            </label>
            <input
              type="range"
              min={200}
              max={950}
              step={25}
              value={minCredits}
              onChange={(e) => setMinCredits(Number(e.target.value))}
              className="w-full cursor-pointer accent-blue-600"
            />
          </div>

          <div className="md:col-span-3 text-right">
            <span className="text-xs font-semibold text-slate-500">
              Showing {matchedResults.length} Verified Candidates
            </span>
          </div>
        </div>

        {/* Proof Requirement Checkboxes */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-700">
          <span className="font-semibold text-slate-500">Proof Standards:</span>
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={requireProjectProof}
              onChange={(e) => setRequireProjectProof(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="flex items-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Project Artifacts</span>
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={requireAssessmentProof}
              onChange={(e) => setRequireAssessmentProof(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Proctored Assessments</span>
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={requireSupervisorProof}
              onChange={(e) => setRequireSupervisorProof(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>Supervisor Attestations</span>
            </span>
          </label>
        </div>
      </div>

      {/* Candidates List */}
      <div className="space-y-3">
        {matchedResults.map((item) => {
          const p = item.passport;
          const isContacted = contactedCandidates[p.id];
          return (
            <div
              key={p.id}
              className={`p-5 sm:p-6 rounded-3xl border bg-white shadow-xs transition-all duration-200 ${
                item.meetsCredits && item.meetsProofs
                  ? "border-slate-200 hover:border-blue-400"
                  : "border-slate-200 opacity-60 bg-slate-50/50"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3.5">
                  <img
                    src={p.avatar}
                    alt={p.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-black text-slate-900 text-base sm:text-lg">
                        {p.fullName}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-mono text-[10px] font-bold">
                        {p.passportNumber}
                      </span>
                      {item.meetsCredits && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                          Meets Benchmark
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 mt-0.5">{p.headline}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      📍 {p.location} • Target: {p.targetRole}
                    </p>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                  <div className="text-left sm:text-right">
                    <div className="text-2xl font-black font-mono text-blue-700">
                      {p.careerScore}{" "}
                      <span className="text-xs font-sans text-slate-500 font-semibold">
                        Credits
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">
                      Skill Match: {item.matchPercent}%
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectCandidate(p.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
                    >
                      View Passport
                    </button>

                    {isContacted ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Audit Requested</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleContact(p.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Request Verified Audit</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills and Proof Tags */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-bold text-slate-400 mr-1">
                  Verified Skills:
                </span>
                {p.skills.map((sk) => {
                  const isMatch = item.matchedTerms.some(
                    (t) =>
                      sk.name.toLowerCase().includes(t) ||
                      t.includes(sk.name.toLowerCase())
                  );
                  return (
                    <span
                      key={sk.id}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        isMatch
                          ? "bg-emerald-50 text-emerald-900 border-emerald-300 font-semibold"
                          : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      <span>{sk.name}</span>
                      <span className="font-mono text-[10px] text-blue-700">
                        ({sk.credits}cr)
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
