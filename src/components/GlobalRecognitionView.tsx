import React, { useState } from "react";
import {
  Globe,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  Sparkles,
  Loader2,
} from "lucide-react";
import { PassportProfile, ForeignRecognition } from "../types";

interface GlobalRecognitionViewProps {
  passport?: PassportProfile;
}

export const GlobalRecognitionView: React.FC<GlobalRecognitionViewProps> = ({
  passport,
}) => {
  const defaultRecognition: ForeignRecognition = passport?.foreignRecognition || {
    originCountry: "Nigeria",
    targetCountry: "United Kingdom",
    originQualification: "B.Sc Nursing Science (5 Years) + Registered Nurse License",
    yearsOfExperience: 6,
    targetEquivalentRole: "NHS Band 5 Registered General Nurse (Adult)",
    overallEquivalencePercentage: 86,
    standardizedCreditTotal: 700,
    creditBreakdown: [
      {
        skill: "Clinical Care & Emergency Triage",
        originCredits: 300,
        targetEquivalentRequirement: 300,
        status: "Recognized",
      },
      {
        skill: "Healthcare Systems Experience",
        originCredits: 250,
        targetEquivalentRequirement: 250,
        status: "Recognized",
      },
      {
        skill: "Patient Communication & Team Delivery",
        originCredits: 150,
        targetEquivalentRequirement: 150,
        status: "Recognized",
      },
      {
        skill: "Local Jurisprudence & UK NMC Code Protocol",
        originCredits: 0,
        targetEquivalentRequirement: 80,
        status: "Missing Bridging Requirement",
      },
    ],
    missingBridgingRequirements: [
      {
        code: "BRIDGE-UK-01",
        requirement:
          "NMC Test of Competence: Computer-Based Test (CBT Adult Nursing)",
        estimatedHours: 40,
        passportAction:
          "Complete proctored NMC CBT mock module on Career Passport to earn 40 credits",
      },
      {
        code: "BRIDGE-UK-02",
        requirement:
          "UK NHS Statutory Safeguarding & Medicines Act Orientation",
        estimatedHours: 25,
        passportAction: "Complete verified clinical compliance training module",
      },
    ],
    pathwaySteps: [
      {
        step: 1,
        title: "Credential Digitization & NMCN Verification",
        status: "Completed",
        note: "Authenticity verified with official issuing council stamp.",
      },
      {
        step: 2,
        title: "Equivalency Skill Credit Translation",
        status: "Completed",
        note: "700 Career Credits mapped directly to UK National Occupational Standards.",
      },
      {
        step: 3,
        title: "Bridge Missing Jurisdiction Modules",
        status: "In Progress",
        note: "Preparing for CBT theory exam; 85% ready.",
      },
      {
        step: 4,
        title: "Accelerated NHS Trust Fast-Track",
        status: "Next",
        note: "Direct match with healthcare trusts accepting verified Career Passport portfolios.",
      },
    ],
    standardizedRepresentationStatement:
      "Our goal is to create a standardized, portable representation of verified skills that can be understood across employers, institutions and countries.",
  };

  const [originCountry, setOriginCountry] = useState<string>(
    defaultRecognition.originCountry
  );
  const [targetCountry, setTargetCountry] = useState<string>(
    defaultRecognition.targetCountry
  );
  const [profession, setProfession] = useState<string>("Registered Nurse");
  const [qualification, setQualification] = useState<string>(
    defaultRecognition.originQualification
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recognitionData, setRecognitionData] =
    useState<ForeignRecognition>(defaultRecognition);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleEvaluate = async () => {
    setIsLoading(true);
    setSuccessToast(null);

    try {
      const response = await fetch("/api/cross-border-recognition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originCountry,
          targetCountry,
          profession,
          qualification,
          yearsExperience: "6",
        }),
      });
      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setRecognitionData(resJson.data);
        setSuccessToast(
          `Successfully mapped ${profession} credentials from ${originCountry} to ${targetCountry}!`
        );
      }
    } catch (err) {
      console.error("Error evaluating cross border:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-4 shadow-xs text-white">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>International Recognition Engine</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Translating Qualifications & Experience Across Borders
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
              When a skilled doctor, nurse, or engineer moves across borders,
              their degrees are often trapped in bureaucratic delays. Career
              Passport maps qualifications directly to local standards,
              identifying exact bridging gaps.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-right shrink-0">
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Cross-Border Equivalence
            </div>
            <div className="text-3xl md:text-4xl font-black text-emerald-400 font-mono">
              {recognitionData.overallEquivalencePercentage}%
            </div>
            <div className="text-[10px] text-slate-400">
              {recognitionData.standardizedCreditTotal} Standardized Credits
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Translation Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Cross-Border Equivalency Evaluator
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Origin Country
            </label>
            <input
              type="text"
              value={originCountry}
              onChange={(e) => setOriginCountry(e.target.value)}
              placeholder="e.g. Nigeria, India"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Target Destination Country
            </label>
            <input
              type="text"
              value={targetCountry}
              onChange={(e) => setTargetCountry(e.target.value)}
              placeholder="e.g. United Kingdom, USA"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Field of Practice / Role
            </label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g. Registered Nurse"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Origin Degree / Certification
            </label>
            <input
              type="text"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              placeholder="e.g. B.Sc Nursing + Hospital Care"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {successToast ? (
            <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successToast}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500">
              Evaluates international qualification frameworks (EQF, UK NOS,
              ABET).
            </div>
          )}

          <button
            onClick={handleEvaluate}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Translating Standards...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Evaluate Cross-Border Equivalence</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Equivalence Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Credit Mapping Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Target Role Benchmark
              </span>
              <h3 className="text-lg font-black text-slate-900">
                {recognitionData.targetEquivalentRole}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-xs">
              {recognitionData.standardizedCreditTotal} Standardized cr
            </span>
          </div>

          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Core Competency Equivalence Mapping:
            </div>

            {recognitionData.creditBreakdown.map((item, idx) => {
              const isRecognized = item.status === "Recognized";
              return (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
                    isRecognized
                      ? "bg-slate-50/70 border-slate-200 text-slate-800"
                      : "bg-amber-50/70 border-amber-200 text-amber-900"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isRecognized ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-slate-900">{item.skill}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {isRecognized
                          ? `Full credit recognition (${item.originCredits} / ${item.targetEquivalentRequirement} cr)`
                          : `Requires bridging module (${item.targetEquivalentRequirement} cr)`}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                      isRecognized
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Missing Bridging Requirements */}
          <div className="pt-3 border-t border-slate-100 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Identified Bridging Requirements to Practice:</span>
            </div>

            {recognitionData.missingBridgingRequirements.map((bridge, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span>
                    {bridge.code}: {bridge.requirement}
                  </span>
                  <span className="text-slate-500 font-normal">
                    ~{bridge.estimatedHours} Hours
                  </span>
                </div>
                <p className="text-slate-700 text-[11px]">
                  <strong>Career Passport Action: </strong>
                  {bridge.passportAction}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 4 Pathway Steps Timeline */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Four-Step Accelerated Recognition Pathway:
          </div>

          <div className="space-y-3">
            {recognitionData.pathwaySteps.map((step) => {
              const isCompleted = step.status === "Completed";
              const isInProgress = step.status === "In Progress";
              return (
                <div
                  key={step.step}
                  className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
                    isCompleted
                      ? "bg-emerald-50/40 border-emerald-200 text-emerald-950"
                      : isInProgress
                      ? "bg-blue-50/40 border-blue-200 text-blue-950"
                      : "bg-slate-50 border-slate-200 text-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Step {step.step}: {step.title}
                    </span>
                    <span
                      className={`px-2 py-0.2 rounded font-mono text-[10px] font-bold ${
                        isCompleted
                          ? "bg-emerald-100 text-emerald-800"
                          : isInProgress
                          ? "bg-blue-100 text-blue-800"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {step.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600">{step.note}</p>
                </div>
              );
            })}
          </div>

          {/* Standardized portable representation statement */}
          <div className="p-3.5 bg-slate-900 rounded-2xl text-white text-xs leading-relaxed space-y-1">
            <span className="font-bold text-amber-400">
              Standardized Portable Credential:
            </span>
            <p className="text-slate-300 text-[11px]">
              "{recognitionData.standardizedRepresentationStatement}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
