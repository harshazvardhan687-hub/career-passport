import React from "react";
import { GraduationCap, CheckCircle2, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { ProgressionYear, PassportProfile } from "../types";

interface ProgressionRoadmapProps {
  passport?: PassportProfile;
  progression?: ProgressionYear[];
  careerScore?: number;
  onActionClick?: () => void;
}

export const ProgressionRoadmap: React.FC<ProgressionRoadmapProps> = ({
  passport,
  progression,
  careerScore,
  onActionClick,
}) => {
  const score = careerScore ?? passport?.careerScore ?? 0;
  
  // Use provided progression, or passport's progression, or synthesize from achievements
  let roadmapItems: ProgressionYear[] = progression || passport?.studentProgression || [];

  if (roadmapItems.length === 0 && passport?.achievements && passport.achievements.length > 0) {
    // Generate a structured roadmap from existing achievements
    roadmapItems = [
      {
        year: "Phase 1",
        credits: Math.min(250, score),
        title: "Foundational & Academic Credentials",
        achievements: passport.achievements
          .slice(0, 3)
          .map((a) => `${a.title} (${a.organization})`),
      },
      {
        year: "Phase 2",
        credits: score,
        title: "Applied Practice & Verification",
        achievements: passport.achievements
          .slice(3, 7)
          .map((a) => `${a.title} (+${a.credits} cr)`),
      },
    ].filter((item) => item.achievements.length > 0);
  }

  if (roadmapItems.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-slate-900">
            No Roadmap Milestones Logged Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Start logging your degrees, hackathons, and certifications to track your annual progression.
          </p>
        </div>
        {onActionClick && (
          <button
            onClick={onActionClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Milestones & Jobs</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <GraduationCap className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Student Progression Roadmap
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Continuous verifiable credit accumulation year over year.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Cumulative: {score} Credits</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {roadmapItems.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 bg-indigo-100/70 px-2 py-0.5 rounded-lg">
                  {item.year}
                </span>
                <span className="font-mono text-xs font-bold text-indigo-700">
                  +{item.credits} cr
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-2">
                {item.title}
              </h4>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
              {item.achievements.map((ach, aIdx) => (
                <div key={aIdx} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{ach}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
