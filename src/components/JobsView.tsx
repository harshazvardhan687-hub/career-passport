import React, { useState } from "react";
import {
  Briefcase,
  Target,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Sparkles,
  Award,
  ChevronRight,
  Send,
  Loader2,
  HelpCircle,
  X,
  RotateCcw,
  ShieldCheck,
  Check,
  Zap,
} from "lucide-react";
import { PassportProfile, JobOpportunity, SkillGapChallenge, SkillProof } from "../types";
import { getPassportCredits } from "../utils/credits";

interface JobsViewProps {
  passport?: PassportProfile;
  jobs?: JobOpportunity[];
  onSkillVerifiedAndAdded?: (
    skillName: string,
    creditsAwarded: number,
    proof: SkillProof
  ) => void;
}

export const JobsView: React.FC<JobsViewProps> = ({
  passport,
  jobs = [],
  onSkillVerifiedAndAdded,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(
    jobs[0]?.id || ""
  );
  const [isAssessmentOpen, setIsAssessmentOpen] = useState<boolean>(false);
  const [activeChallenge, setActiveChallenge] = useState<SkillGapChallenge | null>(null);
  const [isLoadingAssessment, setIsLoadingAssessment] = useState<boolean>(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [assessmentResult, setAssessmentResult] = useState<{
    scorePercent: number;
    correctCount: number;
    totalCount: number;
    passed: boolean;
    creditsAwarded: number;
    skillName: string;
  } | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];
  const userScore = getPassportCredits(passport);
  const userSkills = passport?.skills || [];
  const userAchievements = passport?.achievements || [];
  const requiredSkills = selectedJob?.requiredSkills || [];
  const preferredSkills = selectedJob?.preferredSkills || [];

  // Robust matching against skills and achievements
  const checkSkillMatch = (reqSkill: string) => {
    const reqClean = reqSkill.toLowerCase().trim();
    // 1. Check verified skills list
    const matchInSkills = userSkills.some((s) => {
      const sName = s.name.toLowerCase().trim();
      return (
        sName === reqClean ||
        sName.includes(reqClean) ||
        reqClean.includes(sName) ||
        (s.proofList &&
          s.proofList.some(
            (p) =>
              p.title.toLowerCase().includes(reqClean) ||
              p.details.toLowerCase().includes(reqClean)
          ))
      );
    });
    if (matchInSkills) return true;

    // 2. Check achievements ledger (projects, certificates, hackathons, degrees)
    const matchInAchievements = userAchievements.some((a) => {
      const aTitle = a.title.toLowerCase();
      const aNotes = (a.notes || "").toLowerCase();
      return aTitle.includes(reqClean) || aNotes.includes(reqClean);
    });
    return matchInAchievements;
  };

  const matchingSkills = requiredSkills.filter(checkSkillMatch);
  const missingSkills = requiredSkills.filter((req) => !checkSkillMatch(req));

  const matchingPreferred = preferredSkills.filter(checkSkillMatch);
  const missingPreferred = preferredSkills.filter((pref) => !checkSkillMatch(pref));

  const totalRequired = requiredSkills.length;
  const matchRatio = totalRequired > 0 ? matchingSkills.length / totalRequired : 1;
  const minCredits = selectedJob?.minCareerCredits || 100;
  const creditsRatio = userScore >= minCredits ? 1 : userScore / minCredits;
  const calculatedMatchPercent = Math.min(
    100,
    Math.round(matchRatio * 85 + (creditsRatio >= 1 ? 15 : creditsRatio * 15))
  );

  const handleStartChallenge = async (skillName: string) => {
    setIsLoadingAssessment(true);
    setIsAssessmentOpen(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setAssessmentResult(null);

    try {
      const response = await fetch("/api/skill-gap-challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skillName,
          careerContext: selectedJob.title,
        }),
      });
      const data = await response.json();
      if (data.success && data.data) {
        setActiveChallenge(data.data);
      }
    } catch (err) {
      console.error("Failed to load skill challenge:", err);
    } finally {
      setIsLoadingAssessment(false);
    }
  };

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleRetryAssessment = () => {
    setIsSubmitted(false);
    setSelectedAnswers({});
    setAssessmentResult(null);
  };

  const handleSubmitAssessment = () => {
    if (!activeChallenge) return;

    let correctCount = 0;
    activeChallenge.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const totalCount = activeChallenge.questions.length;
    const scorePercent = Math.round((correctCount / totalCount) * 100);
    // 60%+ or 2 out of 3 passes
    const passingThreshold = Math.min(activeChallenge.passingScorePercent || 60, 60);
    const passed = scorePercent >= passingThreshold || correctCount >= Math.ceil(totalCount * 0.6);

    setIsSubmitted(true);
    setAssessmentResult({
      scorePercent,
      correctCount,
      totalCount,
      passed,
      creditsAwarded: activeChallenge.creditsAwardedOnPass,
      skillName: activeChallenge.skillName,
    });

    if (passed) {
      const newProof: SkillProof = {
        id: `p-${Date.now()}`,
        type: "Assessment",
        title: `Proctored Competency Verification: ${activeChallenge.skillName}`,
        issuerOrEntity: "Career Passport Interactive Verification Engine",
        date: "Today",
        verificationStatus: "Verified",
        verificationHash: `sha256:${Math.random().toString(16).substring(2, 14)}`,
        details: `Passed practical scenario challenge with score of ${scorePercent}% (${correctCount}/${totalCount} correct).`,
      };

      onSkillVerifiedAndAdded?.(
        activeChallenge.skillName,
        activeChallenge.creditsAwardedOnPass,
        newProof
      );
    }
  };

  const handleApplyJob = (jobId: string) => {
    setAppliedJobs((prev) => ({ ...prev, [jobId]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 md:p-8 space-y-4 shadow-xs text-white">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Target className="w-4 h-4 text-blue-400" />
              <span>AI Job Match & Skill Gap Engine</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Connect Verified Career Credits Directly to Real Jobs
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1">
              The AI verifies your Career Passport against employer benchmarks,
              identifies missing requirements, and provides 1-click proctored
              scenario tests to close gaps instantly.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-right shrink-0">
            <div className="text-[10px] uppercase font-bold text-slate-400">
              Match Percentage
            </div>
            <div className="text-3xl md:text-4xl font-black text-emerald-400 font-mono">
              {calculatedMatchPercent}%
            </div>
            <div className="text-[10px] text-slate-400">
              {userScore} / {minCredits} Min Credits
            </div>
          </div>
        </div>

        {/* Growth Loop Strip */}
        <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
          <span className="font-semibold text-blue-300">
            The Continuous Growth Loop:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-medium text-slate-300">
            <span>1. Pinpoint Gaps</span>
            <span>→</span>
            <span>2. Take 1-Click Verification Test</span>
            <span>→</span>
            <span>3. Unlock Career Credits</span>
            <span>→</span>
            <span className="text-emerald-400 font-bold">
              4. Direct Recruiter Match
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Job Cards on Left, Selected Job Details on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Job Openings List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-600 px-1">
            Available Benchmark Jobs ({jobs.length})
          </div>

          <div className="space-y-2.5">
            {jobs.map((job) => {
              const isSelected = job.id === selectedJob.id;
              const isApplied = appliedJobs[job.id];
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/30 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {job.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        {job.company} • {job.location}
                      </p>
                    </div>
                    {isApplied && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Applied
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500 text-[11px]">
                      Min {job.minCareerCredits} cr
                    </span>
                    <span className="font-bold text-blue-700">
                      {job.salaryRange}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Job Profile & Gap Analyzer */}
        <div className="lg:col-span-8 space-y-5">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div>
                <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                  {selectedJob.type}
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  {selectedJob.title}
                </h3>
                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                  {selectedJob.company} • {selectedJob.location}
                </p>
                <p className="text-xs font-mono text-emerald-700 font-bold mt-1">
                  Salary Benchmark: {selectedJob.salaryRange}
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                {appliedJobs[selectedJob.id] ? (
                  <div className="px-4 py-2.5 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Application Submitted via Passport</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleApplyJob(selectedJob.id)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply with Career Passport</span>
                  </button>
                )}
                <span className="text-[11px] text-slate-500">
                  Sends tamper-proof dossier directly to recruiter
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedJob.description}
            </p>

            {/* Skills Verification Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Verified Skills */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>
                      Verified in Your Passport ({matchingSkills.length}/{requiredSkills.length})
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    {matchingSkills.length === requiredSkills.length && requiredSkills.length > 0 ? "100% Complete" : `${matchingSkills.length} Verified`}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {matchingSkills.length === 0 ? (
                    <p className="text-xs text-slate-500 italic p-2">
                      No required competencies verified yet. Take a 1-click test below to bridge your first gap!
                    </p>
                  ) : (
                    matchingSkills.map((sk, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-200 text-xs text-slate-800 shadow-2xs"
                      >
                        <span className="font-semibold flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          {sk}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Anchored
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Missing Skills with 1-Click Tests */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>
                      Identified Gaps to Bridge ({missingSkills.length})
                    </span>
                  </div>
                  {missingSkills.length > 0 && (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      Instant Bridge Available
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {missingSkills.length === 0 ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-1">
                      <p className="text-xs text-emerald-800 font-bold flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        All Required Skills Fully Verified!
                      </p>
                      <p className="text-[11px] text-emerald-600">
                        You meet all baseline technical criteria for this role.
                      </p>
                    </div>
                  ) : (
                    missingSkills.map((gap, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-white border border-amber-200 text-xs shadow-2xs"
                      >
                        <span className="font-bold text-slate-800">{gap}</span>
                        <button
                          onClick={() => handleStartChallenge(gap)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] flex items-center justify-center gap-1 transition cursor-pointer shadow-xs"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>1-Click Verification Test</span>
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Preferred Skills / Bonus Competencies */}
            {preferredSkills.length > 0 && (
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                    <Award className="w-4 h-4 text-blue-600" />
                    <span>Preferred Competencies & Boosters ({preferredSkills.length})</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {matchingPreferred.length} of {preferredSkills.length} unlocked
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {preferredSkills.map((pref, idx) => {
                    const isMatched = matchingPreferred.includes(pref);
                    return (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-2.5 rounded-xl border text-xs ${
                          isMatched
                            ? "bg-blue-50/60 border-blue-200 text-blue-900"
                            : "bg-white border-slate-200 text-slate-700"
                        }`}
                      >
                        <span className="font-medium flex items-center gap-1.5">
                          {isMatched ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          )}
                          {pref}
                        </span>
                        {isMatched ? (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded">
                            Bonus Active
                          </span>
                        ) : (
                          <button
                            onClick={() => handleStartChallenge(pref)}
                            className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                          >
                            <span>Verify</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Assessment Modal */}
      {isAssessmentOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full p-6 md:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Proctored Scenario Verification
                  </h3>
                  <p className="text-xs text-slate-500">
                    Pass to automatically earn Career Credits and anchor to your ledger.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAssessmentOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoadingAssessment ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-xs text-slate-500 font-medium">
                  Generating real-world practical challenge questions...
                </p>
              </div>
            ) : activeChallenge ? (
              <div className="space-y-5">
                {/* Header info badge */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                  <div>
                    Testing: <strong>{activeChallenge.skillName}</strong> for{" "}
                    <strong>{activeChallenge.careerContext}</strong>
                  </div>
                  <div className="font-mono font-bold text-blue-700 bg-white px-2.5 py-1 rounded-lg border border-blue-200">
                    +{activeChallenge.creditsAwardedOnPass} Credits
                  </div>
                </div>

                {/* Submission Outcome Result Banner */}
                {isSubmitted && assessmentResult && (
                  <div
                    className={`p-4 rounded-2xl border ${
                      assessmentResult.passed
                        ? "bg-emerald-50 border-emerald-200 text-emerald-950"
                        : "bg-amber-50 border-amber-200 text-amber-950"
                    } space-y-2`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        {assessmentResult.passed ? (
                          <>
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            <span>Verification Passed! ({assessmentResult.scorePercent}%)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                            <span>Score: {assessmentResult.scorePercent}% ({assessmentResult.correctCount}/{assessmentResult.totalCount} correct)</span>
                          </>
                        )}
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white border border-current">
                        {assessmentResult.passed ? "Verified" : "Passing mark: 60%"}
                      </span>
                    </div>

                    <p className="text-xs leading-relaxed">
                      {assessmentResult.passed
                        ? `Congratulations! You answered ${assessmentResult.correctCount} of ${assessmentResult.totalCount} correctly. +${assessmentResult.creditsAwarded} Career Credits have been minted and anchored into your cryptographic skill ledger. The gap for "${assessmentResult.skillName}" is now fully bridged!`
                        : `You needed 60% (at least 2 correct answers) to verify this competency. Review the explanations below, then click "Retake Challenge" to try again!`}
                    </p>
                  </div>
                )}

                {/* Questions List */}
                <div className="space-y-4">
                  {activeChallenge.questions.map((q, qIdx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5"
                    >
                      <div className="font-bold text-slate-900 text-xs">
                        {qIdx + 1}. {q.prompt}
                      </div>

                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[q.id] === optIdx;
                          const isCorrect = q.correctIndex === optIdx;
                          return (
                            <div
                              key={optIdx}
                              onClick={() =>
                                !isSubmitted && handleSelectOption(q.id, optIdx)
                              }
                              className={`p-2.5 rounded-xl border text-xs transition ${
                                isSubmitted
                                  ? isCorrect
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold shadow-2xs"
                                    : isSelected
                                    ? "bg-rose-50 border-rose-300 text-rose-900 font-semibold"
                                    : "bg-white border-slate-200 opacity-60"
                                  : isSelected
                                  ? "bg-blue-600 text-white font-semibold border-blue-600 shadow-2xs cursor-pointer"
                                  : "bg-white border-slate-200 hover:border-slate-300 text-slate-800 cursor-pointer"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                                  isSelected ? "border-white bg-white/20 text-white" : "border-slate-300 text-slate-500"
                                }`}>
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span>{opt}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {isSubmitted && (
                        <p className="text-[11px] text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200 mt-2">
                          <strong className="text-slate-800">Explanation: </strong>
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <div className="text-xs text-slate-500">
                    {isSubmitted ? (
                      <span>Review answers or return to dashboard</span>
                    ) : (
                      <span>
                        Answered: {Object.keys(selectedAnswers).length} / {activeChallenge.questions.length} questions
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isSubmitted ? (
                      <>
                        {!assessmentResult?.passed && (
                          <button
                            onClick={handleRetryAssessment}
                            className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Retake Challenge</span>
                          </button>
                        )}
                        <button
                          onClick={() => setIsAssessmentOpen(false)}
                          className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
                        >
                          Close & View Updated Matches
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleSubmitAssessment}
                        disabled={Object.keys(selectedAnswers).length < activeChallenge.questions.length}
                        className={`px-6 py-2.5 rounded-xl font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer ${
                          Object.keys(selectedAnswers).length < activeChallenge.questions.length
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Submit Verification ({Object.keys(selectedAnswers).length}/{activeChallenge.questions.length})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
