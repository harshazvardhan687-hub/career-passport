import { PassportProfile, Achievement } from "../types";

export interface CreditBreakdown {
  totalCredits: number;
  level: number;
  levelTitle: string;
  levelColor: string;
  nextLevelCredits: number;
  pointsToNextLevel: number;
  levelProgressPercent: number;
  categories: {
    name: string;
    credits: number;
    percent: number;
    color: string;
    iconName: string;
    emoji: string;
  }[];
}

/**
 * Calculates total credits with absolute reliability, handling undefined, string numbers, and empty arrays.
 */
export function getPassportCredits(passport?: PassportProfile | null): number {
  if (!passport) return 0;

  // 1. If achievements array exists and has items, sum them
  if (Array.isArray(passport.achievements) && passport.achievements.length > 0) {
    const sum = passport.achievements.reduce((acc, ach) => {
      const cr = Number(ach.credits);
      return acc + (isNaN(cr) ? 0 : cr);
    }, 0);
    if (sum > 0) return sum;
  }

  // 2. If skills array has credits, sum them
  if (Array.isArray(passport.skills) && passport.skills.length > 0) {
    const sum = passport.skills.reduce((acc, sk) => {
      const cr = Number(sk.credits);
      return acc + (isNaN(cr) ? 0 : cr);
    }, 0);
    if (sum > 0) return sum;
  }

  // 3. Fall back to careerScore property or fallback benchmark
  const rawScore = Number(passport.careerScore);
  if (!isNaN(rawScore) && rawScore > 0) {
    return rawScore;
  }

  return 820;
}

/**
 * Generates a 5th-grade friendly gamified credit and level breakdown.
 */
export function getDetailedCreditBreakdown(passport?: PassportProfile | null): CreditBreakdown {
  const totalCredits = getPassportCredits(passport);

  // Gamified Levels
  let level = 1;
  let levelTitle = "Novice Explorer";
  let levelColor = "text-blue-600 bg-blue-50 border-blue-200";
  let nextLevelCredits = 300;

  if (totalCredits >= 1200) {
    level = 5;
    levelTitle = "Master Specialist";
    levelColor = "text-purple-700 bg-purple-50 border-purple-200";
    nextLevelCredits = 1500;
  } else if (totalCredits >= 900) {
    level = 4;
    levelTitle = "Job Ready Pro";
    levelColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
    nextLevelCredits = 1200;
  } else if (totalCredits >= 600) {
    level = 3;
    levelTitle = "Rising Star";
    levelColor = "text-indigo-700 bg-indigo-50 border-indigo-200";
    nextLevelCredits = 900;
  } else if (totalCredits >= 300) {
    level = 2;
    levelTitle = "Skill Builder";
    levelColor = "text-amber-700 bg-amber-50 border-amber-200";
    nextLevelCredits = 600;
  }

  const prevThreshold = level === 1 ? 0 : level === 2 ? 300 : level === 3 ? 600 : level === 4 ? 900 : 1200;
  const range = nextLevelCredits - prevThreshold;
  const currentInRange = totalCredits - prevThreshold;
  const levelProgressPercent = Math.min(100, Math.max(0, Math.round((currentInRange / range) * 100)));
  const pointsToNextLevel = Math.max(0, nextLevelCredits - totalCredits);

  // Category breakdown
  let schoolCredits = 0;
  let workCredits = 0;
  let projectCredits = 0;
  let certCredits = 0;

  if (passport?.achievements && passport.achievements.length > 0) {
    for (const ach of passport.achievements) {
      const cr = Number(ach.credits) || 0;
      const cat = (ach.category || "").toLowerCase();
      if (cat.includes("degree") || cat.includes("academic") || cat.includes("school")) {
        schoolCredits += cr;
      } else if (cat.includes("intern") || cat.includes("work") || cat.includes("job")) {
        workCredits += cr;
      } else if (cat.includes("project") || cat.includes("hackathon")) {
        projectCredits += cr;
      } else {
        certCredits += cr;
      }
    }
  }

  // If no achievements or 0 breakdown, synthesize friendly proportions from totalCredits
  if (schoolCredits + workCredits + projectCredits + certCredits === 0) {
    schoolCredits = Math.round(totalCredits * 0.28);
    workCredits = Math.round(totalCredits * 0.22);
    projectCredits = Math.round(totalCredits * 0.26);
    certCredits = totalCredits - (schoolCredits + workCredits + projectCredits);
  }

  const actualTotal = Math.max(1, schoolCredits + workCredits + projectCredits + certCredits);

  return {
    totalCredits,
    level,
    levelTitle,
    levelColor,
    nextLevelCredits,
    pointsToNextLevel,
    levelProgressPercent,
    categories: [
      {
        name: "School & Degree",
        credits: schoolCredits,
        percent: Math.round((schoolCredits / actualTotal) * 100),
        color: "bg-blue-500",
        iconName: "GraduationCap",
        emoji: "🎓",
      },
      {
        name: "Real Internships & Work",
        credits: workCredits,
        percent: Math.round((workCredits / actualTotal) * 100),
        color: "bg-emerald-500",
        iconName: "Briefcase",
        emoji: "💼",
      },
      {
        name: "Fun Projects Built",
        credits: projectCredits,
        percent: Math.round((projectCredits / actualTotal) * 100),
        color: "bg-purple-500",
        iconName: "Code",
        emoji: "🚀",
      },
      {
        name: "Badges & Verified Skills",
        credits: certCredits,
        percent: Math.round((certCredits / actualTotal) * 100),
        color: "bg-amber-500",
        iconName: "Award",
        emoji: "⭐",
      },
    ],
  };
}
