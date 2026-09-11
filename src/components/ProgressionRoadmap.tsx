import React, { useState } from "react";
import {
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
  Briefcase,
  Code,
  ShieldCheck,
  Target,
  ChevronRight,
  HelpCircle,
  X,
  RotateCcw,
  Check,
  Star,
  Compass,
  BarChart3,
  Search,
  BookOpen
} from "lucide-react";
import { ProgressionYear, PassportProfile, SkillProof } from "../types";
import { getPassportCredits, getDetailedCreditBreakdown } from "../utils/credits";

interface ProgressionRoadmapProps {
  passport?: PassportProfile;
  progression?: ProgressionYear[];
  careerScore?: number;
  onActionClick?: () => void;
  onAddMilestoneClick?: () => void;
  onSkillVerifiedAndAdded?: (
    skillName: string,
    creditsAwarded: number,
    proof: SkillProof
  ) => void;
}

// Preset target careers for easy 1-click selection
const TARGET_CAREERS = [
  {
    id: "software-dev",
    name: "Software Developer",
    icon: "💻",
    tagline: "Build apps, websites & games",
    requiredSkills: [
      { name: "React & TypeScript", credits: 80, easyDesc: "Building modern interactive screens & web pages." },
      { name: "Algorithms & Logic", credits: 80, easyDesc: "Solving tricky puzzle problems with smart code." },
      { name: "APIs & Databases", credits: 75, easyDesc: "Storing user data and connecting to internet servers." },
      { name: "Git & Teamwork", credits: 65, easyDesc: "Saving code history and working together with friends." },
    ],
    bonusSkills: [
      { name: "Cloud & Docker", credits: 60, easyDesc: "Putting apps on servers so anyone around the world can play." },
      { name: "Automated Testing", credits: 50, easyDesc: "Writing robot tests that catch bugs before users see them." },
    ],
  },
  {
    id: "ai-engineer",
    name: "AI & Robot Engineer",
    icon: "🤖",
    tagline: "Train smart computers to think",
    requiredSkills: [
      { name: "Python Coding", credits: 85, easyDesc: "The world's most popular language for smart machines." },
      { name: "Math & Statistics", credits: 80, easyDesc: "Understanding numbers, patterns, and probabilities." },
      { name: "Machine Learning Basics", credits: 80, easyDesc: "Teaching computers how to recognize photos and words." },
      { name: "Prompt & Model Crafting", credits: 70, easyDesc: "Directing large AI models to generate answers safely." },
    ],
    bonusSkills: [
      { name: "Data Pipelines", credits: 60, easyDesc: "Cleaning up messy information so AI learns accurately." },
      { name: "Neural Networks", credits: 65, easyDesc: "Building brain-like digital networks inside computers." },
    ],
  },
  {
    id: "cloud-devops",
    name: "Cloud Architect",
    icon: "☁️",
    tagline: "Run supercomputers in the sky",
    requiredSkills: [
      { name: "Linux Powers", credits: 80, easyDesc: "Mastering the operating system that runs the internet." },
      { name: "Cloud Systems (AWS/GCP)", credits: 85, easyDesc: "Renting and managing virtual supercomputers." },
      { name: "Docker Containers", credits: 75, easyDesc: "Packaging programs into tiny boxes that run anywhere." },
      { name: "Security & Firewalls", credits: 70, easyDesc: "Keeping bad hackers out and protecting user secrets." },
    ],
    bonusSkills: [
      { name: "Kubernetes Captain", credits: 65, easyDesc: "Orchestrating hundreds of app containers together." },
      { name: "Automated Pipelines", credits: 55, easyDesc: "Shipping new app updates with zero human clicks." },
    ],
  },
  {
    id: "auto-tech",
    name: "Smart Vehicle Specialist",
    icon: "🚗",
    tagline: "Fix electronic & hybrid supercars",
    requiredSkills: [
      { name: "OBD-II Diagnostics", credits: 80, easyDesc: "Plugging computer scan tools into car computers." },
      { name: "Electrical Wiring & Sensors", credits: 75, easyDesc: "Tracing electronic signals with digital meters." },
      { name: "Engine & Brakes Safety", credits: 70, easyDesc: "Keeping mechanical systems running like clockwork." },
      { name: "Shop Safety Protocols", credits: 65, easyDesc: "Safe workshop habits to protect yourself and team." },
    ],
    bonusSkills: [
      { name: "Hybrid High-Voltage Battery", credits: 70, easyDesc: "Handling powerful electric vehicle battery packs safely." },
      { name: "Oscilloscope Waveforms", credits: 60, easyDesc: "Reading live electrical waves on computer screens." },
    ],
  },
  {
    id: "healthcare-nurse",
    name: "Healthcare Care Hero",
    icon: "🏥",
    tagline: "Heal patients & save lives",
    requiredSkills: [
      { name: "Patient Assessment & Triage", credits: 85, easyDesc: "Quickly checking who needs emergency doctor care first." },
      { name: "Medication & Safety 5-Rights", credits: 80, easyDesc: "Giving the exact right medicine to the right person." },
      { name: "Vital Signs & Heart Monitoring", credits: 75, easyDesc: "Reading blood pressure, pulse, and oxygen sensors." },
      { name: "Sterile & Clean Care", credits: 70, easyDesc: "Stopping germs and keeping hospital rooms clean." },
    ],
    bonusSkills: [
      { name: "Cardiac Life Support (ACLS)", credits: 65, easyDesc: "Special life-saving heart recovery techniques." },
      { name: "Pediatric Friendly Care", credits: 55, easyDesc: "Helping sick kids feel comfortable and brave." },
    ],
  },
];

// Simple, fun quiz bank for instant skill unlocking
const QUIZ_BANK: Record<
  string,
  {
    skillName: string;
    credits: number;
    questions: {
      prompt: string;
      options: string[];
      correctIndex: number;
      kidExplanation: string;
    }[];
  }
> = {
  default: {
    skillName: "General Superpower",
    credits: 75,
    questions: [
      {
        prompt: "What is the very first step when a program or project has a problem?",
        options: [
          "Delete everything and cry.",
          "Check the clues (error messages) and test one piece at a time.",
          "Blame your computer and buy a new one.",
          "Ignore it and pretend it never happened."
        ],
        correctIndex: 1,
        kidExplanation: "Engineers are like detectives: read the clues and test one piece at a time!"
      },
      {
        prompt: "Why is working together and saving your work often (like in Git) so helpful?",
        options: [
          "So nobody else can see what you are doing.",
          "If you make a mistake, you can easily go back to when it worked!",
          "Computers run out of memory if you don't save every 2 seconds.",
          "It makes your keyboard glow in the dark."
        ],
        correctIndex: 1,
        kidExplanation: "Version history lets you travel back in time if you ever break something!"
      },
      {
        prompt: "What does it mean to have 'Verified Career Credits'?",
        options: [
          "A video game coin you spend on virtual hats.",
          "Real, trustworthy proof that you built projects and actually know your stuff!",
          "A secret password for the cafeteria.",
          "A sticker that washes off in the rain."
        ],
        correctIndex: 1,
        kidExplanation: "Career Credits prove to real schools and employers what you can really do!"
      }
    ]
  },
  "Docker & Containers": {
    skillName: "Docker & Containers",
    credits: 60,
    questions: [
      {
        prompt: "What is a 'Docker Container' most like in real life?",
        options: [
          "A lunchbox that packs your lunch AND the fork and plate so it works anywhere!",
          "A literal cardboard box you put under your bed.",
          "A giant magnet that attracts metals.",
          "A virus that slows down your computer."
        ],
        correctIndex: 0,
        kidExplanation: "A container packages your app plus everything it needs so it runs smoothly on any computer!"
      },
      {
        prompt: "Why do developers love containers?",
        options: [
          "Because it stops the annoying 'It worked on my machine, but not yours!' problem.",
          "Because it turns code into chocolate.",
          "Because they only work on weekends.",
          "Because it deletes all tests automatically."
        ],
        correctIndex: 0,
        kidExplanation: "Containers guarantee that your program runs the exact same way everywhere!"
      },
      {
        prompt: "What is a 'Dockerfile'?",
        options: [
          "A cooking recipe with instructions on how to build your container box.",
          "A picture of a boat.",
          "A list of friends on social media.",
          "A spreadsheet of expenses."
        ],
        correctIndex: 0,
        kidExplanation: "A Dockerfile is just a list of steps to assemble your app container!"
      }
    ]
  },
  "Cloud & Docker": {
    skillName: "Cloud & Docker",
    credits: 60,
    questions: [
      {
        prompt: "What does 'The Cloud' actually mean?",
        options: [
          "Water vapor floating up in the blue sky.",
          "Computers and servers located in big secure data centers that you use over the internet.",
          "A secret magical spaceship.",
          "A brand of headphones."
        ],
        correctIndex: 1,
        kidExplanation: "The Cloud is simply powerful computers connected to the internet that run your apps 24/7!"
      },
      {
        prompt: "Why put your website or game on the cloud?",
        options: [
          "So your friends and anyone in the world can play it anytime without keeping your home laptop on.",
          "So it can rain code onto your lawn.",
          "Because computers in the sky don't use electricity.",
          "To make the internet slower."
        ],
        correctIndex: 0,
        kidExplanation: "Cloud hosting means your creations are always alive on the internet for people to use!"
      },
      {
        prompt: "What is a container like Docker?",
        options: [
          "A neat package that carries your code and tools so it never breaks on another computer.",
          "A glass jar for cookies.",
          "A pencil case.",
          "A video game controller."
        ],
        correctIndex: 0,
        kidExplanation: "Containers keep your software neat, tidy, and ready to launch anywhere!"
      }
    ]
  },
  "Automated Testing": {
    skillName: "Automated Testing",
    credits: 50,
    questions: [
      {
        prompt: "What is an 'Automated Test' in computer programming?",
        options: [
          "A tiny friendly robot program that checks if your code does what it promised.",
          "A teacher giving you a surprise paper quiz.",
          "A program that randomly changes your font size.",
          "A button that shuts down your computer."
        ],
        correctIndex: 0,
        kidExplanation: "Automated tests run automatically to catch mistakes before real users ever see them!"
      },
      {
        prompt: "When should tests be run?",
        options: [
          "Every time you change or add new code to make sure nothing got broken!",
          "Only once every five years.",
          "Never, because my code is always 100% perfect.",
          "Only when the computer is turned off."
        ],
        correctIndex: 0,
        kidExplanation: "Running tests often protects your project from accidental bugs."
      },
      {
        prompt: "What does a 'Green Checkmark' mean in test results?",
        options: [
          "Everything passed and works as expected! 🎉",
          "Your computer is out of battery.",
          "You must rewrite the whole app.",
          "It means stop working."
        ],
        correctIndex: 0,
        kidExplanation: "Green means all tests passed and your software is healthy!"
      }
    ]
  },
  "Prompt & Model Crafting": {
    skillName: "Prompt & Model Crafting",
    credits: 70,
    questions: [
      {
        prompt: "What makes a good 'Prompt' when talking to an AI assistant?",
        options: [
          "Clear, specific instructions with helpful examples and guidelines.",
          "Typing random letters like 'asdfghjkl'.",
          "Asking 50 completely opposite things in one sentence.",
          "Yelling in all capital letters."
        ],
        correctIndex: 0,
        kidExplanation: "The clearer and more detailed your instructions, the better the AI can help you!"
      },
      {
        prompt: "Why should you always double-check facts given by an AI?",
        options: [
          "Because AI can sometimes make mistakes or imagine things (called hallucinations).",
          "Because AIs are shy.",
          "Because reading is bad for you.",
          "You should never check, AI is never wrong."
        ],
        correctIndex: 0,
        kidExplanation: "Smart builders always verify AI outputs with real facts and test results!"
      },
      {
        prompt: "What is 'System Role' in an AI conversation?",
        options: [
          "Telling the AI what character or job it should perform (e.g. 'You are a helpful science tutor').",
          "The computer's serial number.",
          "A video game character.",
          "The volume knob."
        ],
        correctIndex: 0,
        kidExplanation: "A System Role sets the personality and rules for the AI model!"
      }
    ]
  }
};

export const ProgressionRoadmap: React.FC<ProgressionRoadmapProps> = ({
  passport,
  careerScore,
  onActionClick,
  onAddMilestoneClick,
  onSkillVerifiedAndAdded,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"journey" | "analytics" | "gap">("journey");
  const [selectedCareerId, setSelectedCareerId] = useState<string>("software-dev");
  
  // Interactive mini-quiz modal state
  const [quizSkill, setQuizSkill] = useState<{ name: string; credits: number } | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);

  // Calculate guaranteed credits and gamified level breakdown
  const credits = careerScore ?? getPassportCredits(passport);
  const breakdown = getDetailedCreditBreakdown(passport);

  // Selected Career Object
  const currentCareer = TARGET_CAREERS.find((c) => c.id === selectedCareerId) || TARGET_CAREERS[0];

  // Check which skills the student already owns
  const userSkillsText = [
    ...(passport?.skills?.map((s) => s.name) || []),
    ...(passport?.achievements?.map((a) => `${a.title} ${a.notes || ""}`) || []),
  ]
    .join(" ")
    .toLowerCase();

  const isSkillUnlocked = (skillName: string) => {
    const clean = skillName.toLowerCase();
    const parts = clean.split(/[\s/&]+/);
    return parts.some((p) => p.length > 2 && userSkillsText.includes(p));
  };

  const unlockedRequiredCount = currentCareer.requiredSkills.filter((s) => isSkillUnlocked(s.name)).length;
  const totalSkillsInRole = currentCareer.requiredSkills.length + currentCareer.bonusSkills.length;
  const unlockedTotalCount =
    unlockedRequiredCount + currentCareer.bonusSkills.filter((s) => isSkillUnlocked(s.name)).length;
  const matchPercent = Math.min(100, Math.round((unlockedTotalCount / totalSkillsInRole) * 100));

  // Visual Journey Milestones
  const journeyMilestones = [
    {
      level: 1,
      title: "Step 1: Foundational Learning 🎒",
      subtitle: "School, Classes & Core Concepts",
      status: "COMPLETED",
      points: breakdown.categories[0].credits || 200,
      description: "You learned core math, science, and foundational computer principles at an accredited school.",
      badge: "Foundation Unlocked",
      color: "bg-blue-50 border-blue-200 text-blue-800",
      accent: "bg-blue-600",
    },
    {
      level: 2,
      title: "Step 2: Hands-on Projects 🛠️",
      subtitle: "Apps, Websites & Inventions",
      status: "COMPLETED",
      points: breakdown.categories[2].credits || 220,
      description: "You took what you learned and built real, working projects that people can test and touch!",
      badge: "Creator Badge",
      color: "bg-purple-50 border-purple-200 text-purple-800",
      accent: "bg-purple-600",
    },
    {
      level: 3,
      title: "Step 3: Real-World Experience 🏢",
      subtitle: "Internships & Team Collaborations",
      status: "COMPLETED",
      points: breakdown.categories[1].credits || 150,
      description: "You worked with real teams, solved customer challenges, and delivered verified work.",
      badge: "Team Player",
      color: "bg-emerald-50 border-emerald-200 text-emerald-800",
      accent: "bg-emerald-600",
    },
    {
      level: 4,
      title: "Step 4: Superpower Badges ⚡",
      subtitle: "Certifications & Proctored Quizzes",
      status: "IN_PROGRESS",
      points: breakdown.categories[3].credits || 250,
      description: "You earned verified badges proving you have specialized skills like Cloud, Security, and Code Quality.",
      badge: "Level 4 Rising",
      color: "bg-amber-50 border-amber-200 text-amber-800",
      accent: "bg-amber-600",
    },
    {
      level: 5,
      title: `Step 5: Dream Career: ${currentCareer.name} 🎯`,
      subtitle: "100% Job Ready & Verified",
      status: matchPercent >= 75 ? "READY" : "NEXT_GOAL",
      points: 1000,
      description: `Targeting ${currentCareer.name}. Close your remaining skill gaps to unlock full employer fast-track!`,
      badge: matchPercent >= 75 ? "Job Ready!" : `${matchPercent}% Ready`,
      color: matchPercent >= 75 ? "bg-emerald-50 border-emerald-300 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-700",
      accent: matchPercent >= 75 ? "bg-emerald-600" : "bg-slate-400",
    },
  ];

  // Start quiz for a skill
  const handleStartQuiz = (skillName: string, credits: number) => {
    setQuizSkill({ name: skillName, credits });
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
  };

  const getQuizData = (skillName: string) => {
    return QUIZ_BANK[skillName] || QUIZ_BANK.default;
  };

  const handleSubmitQuiz = () => {
    if (!quizSkill) return;
    const currentQ = getQuizData(quizSkill.name);
    let correct = 0;
    currentQ.questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctIndex) {
        correct++;
      }
    });

    const passed = correct >= 2;
    setQuizSubmitted(true);
    setQuizPassed(passed);

    if (passed && onSkillVerifiedAndAdded) {
      const proof: SkillProof = {
        id: `prf-quiz-${Date.now()}`,
        type: "Assessment",
        title: `Proctored Quiz: ${quizSkill.name}`,
        issuerOrEntity: "Career Passport Skills Engine",
        date: "Today",
        verificationStatus: "Verified",
        verificationHash: `0xQZ${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
        details: `Scored ${correct} of ${currentQ.questions.length} questions correctly. 5th-grade verified competency.`,
      };
      onSkillVerifiedAndAdded(quizSkill.name, quizSkill.credits, proof);
    }
  };

  return (
    <div className="space-y-6">
      {/* 🌟 1. HERO GAMIFIED CREDITS & LEVEL BANNER (Crystal clear for a 5th grader) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Player Profile & Level */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={passport?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                alt={passport?.fullName || "Student"}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/80 shadow-md ring-4 ring-white/10"
              />
              <span className="absolute -bottom-1 -right-1 p-1 bg-amber-400 rounded-full text-slate-950 font-black text-[10px] shadow-xs">
                ⭐ {breakdown.level}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {passport?.fullName || "Student Champion"}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-amber-300 border border-white/20 text-xs font-black">
                  Level {breakdown.level}: {breakdown.levelTitle}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100 font-medium max-w-md leading-relaxed">
                Every project, school class, and quiz you finish earns you real{" "}
                <span className="text-white font-bold underline decoration-amber-400">Career Credits</span>!
              </p>
            </div>
          </div>

          {/* Right: Big Score Card & Battery Meter */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 shrink-0 min-w-[280px]">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                Your Career Credits
              </span>
              <span className="text-xs font-bold text-amber-300">
                Next Level in {breakdown.pointsToNextLevel} pts 🚀
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white drop-shadow-sm">
                🌟 {credits}
              </span>
              <span className="text-sm font-semibold text-blue-200">
                / {breakdown.nextLevelCredits} pts
              </span>
            </div>

            {/* Battery / Progress bar */}
            <div className="mt-3">
              <div className="h-3 w-full bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/20">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${breakdown.levelProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold text-blue-200 mt-1.5">
                <span>Level {breakdown.level}</span>
                <span>{breakdown.levelProgressPercent}% Complete</span>
                <span>Level {breakdown.level + 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative background glows */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 🧭 2. THREE INTUITIVE VIEWS (Super friendly tabs) */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveSubTab("journey")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === "journey"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. Level Roadmap Map 🗺️</span>
          </button>

          <button
            onClick={() => setActiveSubTab("analytics")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === "analytics"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>2. Credit Analytics 📊</span>
          </button>

          <button
            onClick={() => setActiveSubTab("gap")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer shrink-0 ${
              activeSubTab === "gap"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Target className="w-4 h-4" />
            <span>3. Skill Gap Detective 🎯</span>
          </button>
        </div>

        {onAddMilestoneClick && (
          <button
            onClick={onAddMilestoneClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New School / Project</span>
          </button>
        )}
      </div>

      {/* 🗺️ SUB-TAB 1: STEP-BY-STEP LEVEL MAP */}
      {activeSubTab === "journey" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-2">
                <Compass className="w-3.5 h-3.5" />
                <span>Your Career Adventure</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Step-by-Step Level Map 🚀
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Just like a video game, you level up by completing real steps: Schooling, Projects, Work, and Badges.
              </p>
            </div>

            {/* Visual Pathway Cards */}
            <div className="mt-8 relative space-y-4">
              {journeyMilestones.map((step, idx) => {
                const isDone = step.status === "COMPLETED";
                const isReady = step.status === "READY";
                const isInProgress = step.status === "IN_PROGRESS";

                return (
                  <div
                    key={idx}
                    className={`relative p-5 sm:p-6 rounded-2xl border transition-all ${
                      isDone
                        ? "bg-slate-50/70 border-slate-200 hover:border-slate-300"
                        : isInProgress
                        ? "bg-amber-50/50 border-amber-300 ring-2 ring-amber-100"
                        : isReady
                        ? "bg-emerald-50/60 border-emerald-300 shadow-sm"
                        : "bg-white border-dashed border-slate-300 opacity-90"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Step indicator and text */}
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-xs ${step.accent}`}
                        >
                          {isDone ? (
                            <Check className="w-6 h-6 stroke-[3]" />
                          ) : isInProgress ? (
                            <Zap className="w-6 h-6 text-white" />
                          ) : (
                            <span>{step.level}</span>
                          )}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base sm:text-lg font-bold text-slate-900">
                              {step.title}
                            </h4>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${step.color}`}>
                              {step.badge}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-500">
                            {step.subtitle}
                          </p>
                          <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: Points Badge & CTA */}
                      <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Points Earned
                          </span>
                          <span className="font-mono text-base sm:text-lg font-black text-slate-900">
                            +{step.points} cr
                          </span>
                        </div>

                        {isInProgress && (
                          <button
                            onClick={() => setActiveSubTab("gap")}
                            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition shadow-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>Level Up!</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 📊 SUB-TAB 2: CREDIT ANALYTICS (Analytics Way) */}
      {activeSubTab === "analytics" && (
        <div className="space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {breakdown.categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{cat.emoji}</span>
                    <span className="font-mono font-black text-lg text-slate-900">
                      {cat.credits} <span className="text-xs text-slate-400 font-normal">cr</span>
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm mt-3">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {cat.percent}% of all your career credits
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${cat.color} rounded-full`}
                      style={{ width: `${Math.max(5, cat.percent)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Where Your Points Came From (Distribution) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
                  <BarChart3 className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Where Your Points Came From 🍰
                  </h4>
                  <p className="text-xs text-slate-500">
                    A balanced mix of school, real jobs, and fun projects makes employers trust you!
                  </p>
                </div>
              </div>

              {/* Stacked Visual Bar */}
              <div className="space-y-3 pt-2">
                <div className="h-5 w-full bg-slate-100 rounded-xl overflow-hidden flex shadow-inner">
                  {breakdown.categories.map((cat, idx) => (
                    <div
                      key={idx}
                      className={`${cat.color} h-full transition-all`}
                      style={{ width: `${cat.percent}%` }}
                      title={`${cat.name}: ${cat.credits} cr (${cat.percent}%)`}
                    />
                  ))}
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {breakdown.categories.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                      <span className={`w-3 h-3 rounded-full ${cat.color} shrink-0`} />
                      <span className="font-semibold text-slate-700 truncate">{cat.name}</span>
                      <span className="font-mono font-bold text-slate-900 ml-auto">{cat.credits}cr</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs leading-relaxed mt-4">
                <strong>🌟 High Trust Profile:</strong> You have strong evidence in both theory (degree) and practice (projects and real internship). This gives you an <strong>A+ Trust Rating</strong>.
              </div>
            </div>

            {/* Right: Skill Superpower Meters (Simple radar bars for a 5th grader) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Your Superpower Meters ⚡
                  </h4>
                  <p className="text-xs text-slate-500">
                    How you rate across the 4 key things every hiring team looks for:
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>💻 Building & Coding</span>
                    <span className="text-blue-600 font-mono">88% Super Strong</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "88%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>🧠 Problem Solving & Logic</span>
                    <span className="text-indigo-600 font-mono">92% Genius Level</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: "92%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>🤝 Teamwork & Communication</span>
                    <span className="text-emerald-600 font-mono">82% Verified</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: "82%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-800 mb-1">
                    <span>🛠️ Modern Tools & Quality</span>
                    <span className="text-amber-600 font-mono">79% Ready to Level Up</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "79%" }} />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Want to raise your tools score?</span>
                <button
                  onClick={() => setActiveSubTab("gap")}
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Take a quick quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎯 SUB-TAB 3: SKILL GAP DETECTIVE (1-click role picker & interactive quiz) */}
      {activeSubTab === "gap" && (
        <div className="space-y-6">
          {/* Target Role Selector */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold mb-2">
                <Target className="w-3.5 h-3.5" />
                <span>Choose Your Dream Career</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Skill Gap Detective 🎯
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Pick the dream job you want. We will show you what you already have in <span className="text-emerald-600 font-bold">Green</span>, and what you can unlock right now in <span className="text-amber-600 font-bold">Yellow</span>!
              </p>
            </div>

            {/* Big Career Picker Buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
              {TARGET_CAREERS.map((c) => {
                const isSelected = c.id === selectedCareerId;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCareerId(c.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-md scale-102"
                        : "bg-slate-50/80 hover:bg-slate-100 border-slate-200 text-slate-800"
                    }`}
                  >
                    <div>
                      <span className="text-2xl block mb-1.5">{c.icon}</span>
                      <h4 className={`text-xs sm:text-sm font-bold leading-tight ${isSelected ? "text-white" : "text-slate-900"}`}>
                        {c.name}
                      </h4>
                    </div>
                    <span className={`text-[10px] mt-2 block ${isSelected ? "text-blue-100" : "text-slate-500"}`}>
                      {c.tagline}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Match Score & Action Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Dream Job Match For
                </span>
                <h4 className="text-xl font-black text-slate-900 flex items-center gap-2 mt-0.5">
                  <span>{currentCareer.icon}</span>
                  <span>{currentCareer.name}</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  You have unlocked <strong>{unlockedTotalCount} of {totalSkillsInRole} skills</strong> required for this role.
                </p>
              </div>

              {/* Big circular match speed meter */}
              <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 shrink-0">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-black font-mono text-blue-600">
                    {matchPercent}%
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Match Score
                  </div>
                </div>
                <div className="text-xs">
                  <span className={`font-bold px-2 py-0.5 rounded-full ${
                    matchPercent >= 75 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {matchPercent >= 75 ? "🎉 Ready for Work!" : "🚀 Almost Ready!"}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {matchPercent >= 75
                      ? "Your credits exceed requirements!"
                      : `Unlock 1 more skill to reach 100%!`}
                  </p>
                </div>
              </div>
            </div>

            {/* Two Side-by-Side Lists: What You Have vs What You Can Unlock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              {/* Green Column: Skills You Have */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Skills You Already Have ({unlockedTotalCount})</span>
                </div>

                <div className="space-y-2.5">
                  {[...currentCareer.requiredSkills, ...currentCareer.bonusSkills]
                    .filter((s) => isSkillUnlocked(s.name))
                    .map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start justify-between gap-3"
                      >
                        <div className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <h5 className="text-xs font-bold text-slate-900">
                              {s.name}
                            </h5>
                            <p className="text-[11px] text-slate-600 mt-0.5">
                              {s.easyDesc}
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shrink-0">
                          +{s.credits} cr
                        </span>
                      </div>
                    ))}

                  {unlockedTotalCount === 0 && (
                    <div className="p-4 rounded-2xl border border-dashed border-slate-300 text-center text-xs text-slate-500">
                      No skills unlocked in this category yet. Click the yellow skills on the right to start!
                    </div>
                  )}
                </div>
              </div>

              {/* Yellow Column: Skills to Unlock (With 1-click Quiz button!) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                  <Zap className="w-4 h-4 text-amber-600" />
                  <span>Skills You Can Unlock Right Now</span>
                </div>

                <div className="space-y-2.5">
                  {[...currentCareer.requiredSkills, ...currentCareer.bonusSkills]
                    .filter((s) => !isSkillUnlocked(s.name))
                    .map((s, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h5 className="text-xs font-bold text-slate-900">
                              {s.name}
                            </h5>
                            <span className="font-mono text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                              +{s.credits} pts reward
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600">
                            {s.easyDesc}
                          </p>
                        </div>

                        <button
                          onClick={() => handleStartQuiz(s.name, s.credits)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0 self-start sm:self-center"
                        >
                          <Zap className="w-3.5 h-3.5 text-amber-300" />
                          <span>Take 3-Q Quiz</span>
                        </button>
                      </div>
                    ))}

                  {[...currentCareer.requiredSkills, ...currentCareer.bonusSkills].filter((s) => !isSkillUnlocked(s.name)).length === 0 && (
                    <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-2">
                      <div className="text-3xl">🎉</div>
                      <h5 className="text-sm font-bold text-emerald-900">
                        All Skills Unlocked!
                      </h5>
                      <p className="text-xs text-emerald-700">
                        You have complete verified competency for {currentCareer.name}!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📝 FUN MINI-QUIZ MODAL (Instant Credits & Level Up!) */}
      {quizSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center">
                  <Zap className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold leading-tight">
                    Unlock: {quizSkill.name}
                  </h3>
                  <p className="text-xs text-blue-100">
                    Earn +{quizSkill.credits} Career Credits • 3 Quick Questions
                  </p>
                </div>
              </div>

              <button
                onClick={() => setQuizSkill(null)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar">
              {!quizSubmitted ? (
                <>
                  <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                    Answer 2 or more questions correctly to immediately verify this skill and add <strong>+{quizSkill.credits} points</strong> to your Career Passport!
                  </div>

                  {getQuizData(quizSkill.name).questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                        Question {qIdx + 1}: {q.prompt}
                      </h4>

                      <div className="space-y-1.5 pt-1">
                        {q.options.map((opt, oIdx) => {
                          const isSelected = quizAnswers[qIdx] === oIdx;
                          return (
                            <button
                              key={oIdx}
                              onClick={() =>
                                setQuizAnswers((prev) => ({
                                  ...prev,
                                  [qIdx]: oIdx,
                                }))
                              }
                              className={`w-full p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? "bg-blue-600 text-white font-bold border-blue-600 shadow-xs"
                                  : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                              }`}
                            >
                              <span>{opt}</span>
                              {isSelected && <Check className="w-4 h-4 text-white shrink-0 ml-2" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <div className="text-center py-6 space-y-4">
                  {quizPassed ? (
                    <>
                      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
                        🎉
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-slate-900">
                          Congratulations! Skill Unlocked!
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                          You scored passing marks! We just credited{" "}
                          <strong className="text-emerald-600 font-bold">+{quizSkill.credits} Career Credits</strong>{" "}
                          directly to your Career Passport!
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 text-left space-y-2 max-w-md mx-auto">
                        <div className="font-bold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Key Takeaway:</span>
                        </div>
                        <p className="leading-relaxed">
                          {getQuizData(quizSkill.name).questions[0].kidExplanation}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl shadow-sm">
                        🌱
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xl font-black text-slate-900">
                          Almost There! Try Again!
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto">
                          You need at least 2 correct answers to unlock this badge. Review the hint and give it another try!
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/60">
              {!quizSubmitted ? (
                <>
                  <button
                    onClick={() => setQuizSkill(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < 2}
                    className={`px-5 py-2 rounded-xl text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 ${
                      Object.keys(quizAnswers).length < 2
                        ? "bg-slate-300 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Submit & Claim Points</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setQuizSkill(null)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
