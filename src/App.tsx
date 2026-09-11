import React, { useState, useEffect } from "react";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { HeroBanner } from "./components/HeroBanner";
import { PassportView } from "./components/PassportView";
import { ProgressionRoadmap } from "./components/ProgressionRoadmap";
import { ResumeParserView } from "./components/ResumeParserView";
import { QuickAddView } from "./components/QuickAddView";
import { FraudCheckerView } from "./components/FraudCheckerView";
import { EvidenceLockerView } from "./components/EvidenceLockerView";
import { JobsView } from "./components/JobsView";
import { GlobalRecognitionView } from "./components/GlobalRecognitionView";
import { InvisibleSkillsView } from "./components/InvisibleSkillsView";
import { RecruiterSearchView } from "./components/RecruiterSearchView";
import { SharePassportModal } from "./components/SharePassportModal";
import { PublicVerificationModal } from "./components/PublicVerificationModal";
import { ManagePersonasModal } from "./components/ManagePersonasModal";
import { EditProfileModal } from "./components/EditProfileModal";
import { INITIAL_PASSPORTS, INITIAL_JOBS } from "./data/initialData";
import { getPassportCredits } from "./utils/credits";
import {
  TabType,
  PassportProfile,
  Skill,
  Achievement,
  FraudVerificationResult,
  SkillProof,
} from "./types";

const LOCAL_STORAGE_KEY = "career_passports_v2";

export function App() {
  // Initialize state with local storage fallback
  const [passports, setPassports] = useState<PassportProfile[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p) => ({
            ...p,
            careerScore: getPassportCredits(p),
          }));
        }
      }
    } catch (e) {
      console.warn("Failed to load passports from localStorage:", e);
    }
    return INITIAL_PASSPORTS.map((p) => ({
      ...p,
      careerScore: getPassportCredits(p),
    }));
  });

  const [activePassportId, setActivePassportId] = useState<string>(() => {
    return passports[0]?.id || "p1";
  });

  const [activeTab, setActiveTab] = useState<TabType>("passport");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isPublicVerifyOpen, setIsPublicVerifyOpen] = useState<boolean>(false);
  const [verifiedPassportToDisplay, setVerifiedPassportToDisplay] = useState<PassportProfile | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [jobs, setJobs] = useState(INITIAL_JOBS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-detect ?verify= or ?passport= in URL (e.g., from smartphone camera QR scan)
  useEffect(() => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const verifyQuery = searchParams.get("verify") || searchParams.get("passport");
      if (verifyQuery) {
        const found = passports.find(
          (p) =>
            p.passportNumber.toLowerCase() === verifyQuery.toLowerCase() ||
            p.id.toLowerCase() === verifyQuery.toLowerCase()
        );
        if (found) {
          setActivePassportId(found.id);
          setVerifiedPassportToDisplay(found);
        } else {
          setVerifiedPassportToDisplay(passports[0] || INITIAL_PASSPORTS[0]);
        }
        setIsPublicVerifyOpen(true);
      }
    } catch (err) {
      console.warn("Could not check URL parameters for verification:", err);
    }
  }, []);

  // Synchronize with Local Storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(passports));
    } catch (e) {
      console.error("Failed to persist to localStorage:", e);
    }
  }, [passports]);

  const fallbackPassport: PassportProfile = INITIAL_PASSPORTS[0];
  const rawActivePassport =
    passports.find((p) => p.id === activePassportId) ||
    passports[0] ||
    fallbackPassport;

  const activePassport: PassportProfile = {
    ...rawActivePassport,
    careerScore: getPassportCredits(rawActivePassport),
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper: update active passport while recalculating total career credits
  const updateActivePassport = (updater: (prev: PassportProfile) => PassportProfile) => {
    setPassports((prevList) =>
      prevList.map((p) => {
        if (p.id !== activePassportId) return p;
        const updated = updater(p);
        const achCredits = getPassportCredits(updated);
        return {
          ...updated,
          careerScore: achCredits,
        };
      })
    );
  };

  const handleUpdateProfile = (updated: Partial<PassportProfile>) => {
    updateActivePassport((prev) => ({
      ...prev,
      ...updated,
    }));
    showToast(`Profile updated successfully.`);
  };

  // Handler: Add Milestone from QuickAdd
  const handleAddMilestone = (milestone: {
    category: Achievement["category"];
    title: string;
    organization: string;
    credits: number;
    notes: string;
    proofType?: string;
  }) => {
    const newAchievement: Achievement = {
      id: `ach-${Date.now()}`,
      category: milestone.category,
      title: milestone.title,
      organization: milestone.organization,
      credits: milestone.credits,
      date: new Date().toISOString().split("T")[0],
      verified: true,
      notes: milestone.notes,
    };

    updateActivePassport((p) => ({
      ...p,
      achievements: [newAchievement, ...p.achievements],
    }));

    showToast(`Added "+${milestone.credits} cr" for "${milestone.title}" to ledger!`);
    setActiveTab("passport");
  };

  // Handler: Add Verified Certificate from Fraud Checker
  const handleAddVerifiedFromFraud = (result: FraudVerificationResult) => {
    const newAchievement: Achievement = {
      id: `cert-audit-${Date.now()}`,
      category: "Verified skills",
      title: result.extractedInfo.title || "Verified Industry Certification",
      organization: result.extractedInfo.organization || "Accredited Authority",
      credits: result.recommendedCredits || 80,
      date: result.extractedInfo.issueDate || new Date().toISOString().split("T")[0],
      verified: true,
      notes: `Audited by AI Authenticity Engine. SHA-256 seal: ${result.verificationHash.slice(0, 16)}...`,
    };

    const newSkill: Skill = {
      id: `sk-fraud-${Date.now()}`,
      name: result.standardizedSkill || "Cloud Security & Architecture",
      category: "Technical",
      credits: result.recommendedCredits || 80,
      level: "Proficient",
      proofList: [
        {
          id: `prf-cert-${Date.now()}`,
          type: "Certificate",
          title: result.extractedInfo.title,
          issuerOrEntity: result.extractedInfo.organization,
          date: result.extractedInfo.issueDate || "Recent",
          verificationStatus: "Verified",
          verificationHash: result.verificationHash,
          evidenceUrl: result.extractedInfo.verificationUrl,
          details: `Trust score: ${result.trustScore}%. Verified against accredited educational registry.`,
        },
      ],
    };

    updateActivePassport((p) => ({
      ...p,
      achievements: [newAchievement, ...p.achievements],
      skills: [newSkill, ...p.skills],
    }));

    showToast(`Verified certificate added! Earned +${result.recommendedCredits} credits.`);
    setActiveTab("passport");
  };

  // Handler: Add Parsed Resume into Passport Ledger
  const handleAddParsedResumeToPassport = (data: any) => {
    const newAchievements: Achievement[] = [];
    const newSkills: Skill[] = [];

    // Add education
    data.education?.forEach((edu: any, idx: number) => {
      newAchievements.push({
        id: `parsed-edu-${Date.now()}-${idx}`,
        category: "Degrees & education",
        title: edu.title,
        organization: edu.organization,
        credits: edu.credits || 200,
        date: edu.date || "Recent",
        verified: true,
        notes: `${edu.notes || ""} ${edu.gpa ? `GPA: ${edu.gpa}` : ""}`.trim(),
      });
    });

    // Add work experiences
    data.workExperiences?.forEach((exp: any, idx: number) => {
      newAchievements.push({
        id: `parsed-exp-${Date.now()}-${idx}`,
        category: "Internships & work experience",
        title: exp.title,
        organization: exp.organization,
        credits: exp.credits || 150,
        date: exp.date || "Recent",
        verified: true,
        notes: exp.achievements?.join(" ") || "Verified professional role.",
      });
    });

    // Add skills
    data.skills?.forEach((sk: any, idx: number) => {
      newSkills.push({
        id: `parsed-sk-${Date.now()}-${idx}`,
        name: sk.name,
        category: (sk.category as any) || "Technical",
        credits: sk.credits || 80,
        level: "Proficient",
        proofList: [
          {
            id: `prf-psk-${Date.now()}-${idx}`,
            type: (sk.proofType as any) || "Project",
            title: `Extracted Proof for ${sk.name}`,
            issuerOrEntity: "Universal Resume Parser Engine",
            date: "Today",
            verificationStatus: "Verified",
            verificationHash: `sha256:${Math.random().toString(16).substring(2, 12)}`,
            details: sk.evidenceSnippet || "Parsed from validated transcript record.",
          },
        ],
      });
    });

    updateActivePassport((p) => ({
      ...p,
      fullName: data.candidate?.fullName || p.fullName,
      headline: data.candidate?.headline || p.headline,
      bio: data.candidate?.summary || p.bio,
      location: data.candidate?.location || p.location,
      achievements: [...newAchievements, ...p.achievements],
      skills: [...newSkills, ...p.skills],
    }));

    showToast(`Successfully parsed and converted resume into Career Passport Ledger!`);
    setActiveTab("passport");
  };

  // Handler: Bridged Skill from 1-Click Test in Jobs View
  const handleSkillVerifiedAndAdded = (
    skillName: string,
    creditsAwarded: number,
    proof: SkillProof
  ) => {
    const newSkill: Skill = {
      id: `sk-challenge-${Date.now()}`,
      name: skillName,
      category: "Technical",
      credits: creditsAwarded,
      level: "Proficient",
      proofList: [proof],
    };

    const newAchievement: Achievement = {
      id: `ach-challenge-${Date.now()}`,
      category: "Verified skills",
      title: `Verified Competency: ${skillName}`,
      organization: "Career Passport Proctored Benchmark",
      credits: creditsAwarded,
      date: "Today",
      verified: true,
      notes: proof.details || `Proctored scenario challenge passed. Verified competency in ${skillName}.`,
    };

    updateActivePassport((p) => {
      const otherSkills = p.skills.filter(
        (s) => s.name.toLowerCase() !== skillName.toLowerCase()
      );
      return {
        ...p,
        skills: [newSkill, ...otherSkills],
        achievements: [newAchievement, ...p.achievements],
      };
    });

    showToast(`Passed scenario challenge! Earned +${creditsAwarded} cr for "${skillName}"!`);
  };

  // Handler: Add Extracted Informal Skill
  const handleAddExtractedSkill = (skill: {
    name: string;
    credits: number;
    category: string;
    proofType: string;
    details: string;
  }) => {
    const newSkill: Skill = {
      id: `sk-informal-${Date.now()}`,
      name: skill.name,
      category: (skill.category as any) || "Vocational",
      credits: skill.credits,
      level: "Proficient",
      proofList: [
        {
          id: `prf-inf-${Date.now()}`,
          type: (skill.proofType as any) || "Work Log",
          title: `Hands-On Experience Verification: ${skill.name}`,
          issuerOrEntity: "Career Passport Experiential Ledger",
          date: "Verified",
          verificationStatus: "Verified",
          verificationHash: `sha256:${Math.random().toString(16).substring(2, 14)}`,
          details: skill.details,
        },
      ],
    };

    const newAchievement: Achievement = {
      id: `ach-informal-${Date.now()}`,
      category: "Verified skills",
      title: `Practical Competency: ${skill.name}`,
      organization: "Career Passport Experiential Ledger",
      credits: skill.credits,
      date: "Today",
      verified: true,
      notes: skill.details,
    };

    updateActivePassport((p) => ({
      ...p,
      skills: [newSkill, ...p.skills],
      achievements: [newAchievement, ...p.achievements],
    }));

    showToast(`Added "+${skill.credits} cr" for "${skill.name}" to your passport!`);
  };

  // Handler: Add Custom Member Profile
  const handleAddCustomPassport = (newProfile: PassportProfile) => {
    setPassports((prev) => [newProfile, ...prev]);
    setActivePassportId(newProfile.id);
    showToast(`Created Career Passport for ${newProfile.fullName}!`);
  };

  // Handler: Reset to Demo Defaults
  const handleResetToDefault = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setPassports(INITIAL_PASSPORTS);
    setActivePassportId(INITIAL_PASSPORTS[0].id);
    showToast("Reset all passports and ledger history to initial demo state.");
  };

  // Handler: Delete Custom Profile
  const handleDeletePassport = (id: string) => {
    setPassports((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length === 0) {
        setActivePassportId(INITIAL_PASSPORTS[0].id);
        return INITIAL_PASSPORTS;
      }
      if (activePassportId === id) {
        setActivePassportId(filtered[0].id);
      }
      return filtered;
    });
    showToast("Deleted passport profile.");
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        passports={passports}
        activePassport={activePassport}
        activePassportId={activePassportId}
        onSelectPassport={setActivePassportId}
        onOpenManagePersonas={() => setIsManageModalOpen(true)}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Main Content Area (offset on desktop by sidebar width) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Header */}
        <Header
          activeTab={activeTab}
          activePassport={activePassport}
          passport={activePassport}
          passports={passports}
          activePassportId={activePassportId}
          onSelectPassport={setActivePassportId}
          onOpenSidebar={() => setIsMobileSidebarOpen(true)}
          onSelectTab={(tab) => setActiveTab(tab as TabType)}
          onOpenShare={() => setIsShareModalOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
          onOpenManagePersonas={() => setIsManageModalOpen(true)}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
        />

        {/* Dynamic Main Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Hero Banner (Always visible to anchor candidate context) */}
          <HeroBanner
            passports={passports}
            passport={activePassport}
            activePassport={activePassport}
            activePersonaId={activePassportId}
            onSelectPersona={setActivePassportId}
            onOpenManageMembers={() => setIsManageModalOpen(true)}
            onOpenShare={() => setIsShareModalOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab as TabType)}
          />

          {/* Tab View Container */}
          <div className="transition-opacity duration-200">
            {activeTab === "passport" && (
              <PassportView
                passport={activePassport}
                onViewEvidence={() => setActiveTab("evidence")}
                onViewProofClick={() => setActiveTab("evidence")}
                onOpenShareModal={() => setIsShareModalOpen(true)}
                onOpenShare={() => setIsShareModalOpen(true)}
                onNavigateToQuickAdd={() => setActiveTab("quick-add")}
                onAddSkillClick={() => setActiveTab("quick-add")}
                onNavigateToFraudChecker={() => setActiveTab("fraud-checker")}
                onOpenEditProfile={() => setIsEditProfileOpen(true)}
              />
            )}

            {activeTab === "roadmap" && (
              <ProgressionRoadmap
                passport={activePassport}
                careerScore={getPassportCredits(activePassport)}
                onActionClick={() => setActiveTab("jobs")}
                onAddMilestoneClick={() => setActiveTab("quick-add")}
                onSkillVerifiedAndAdded={handleSkillVerifiedAndAdded}
              />
            )}

            {(activeTab === "resume-parser" || activeTab === "parser") && (
              <ResumeParserView
                activePassport={activePassport}
                onApplyParsedDataToPassport={handleAddParsedResumeToPassport}
                onAddParsedToPassport={handleAddParsedResumeToPassport}
              />
            )}

            {(activeTab === "quick-add" || activeTab === "quickadd") && (
              <QuickAddView
                passport={activePassport}
                onAddMilestone={handleAddMilestone}
                onAddAchievement={(ach) =>
                  handleAddMilestone({
                    category: ach.category,
                    title: ach.title,
                    organization: ach.organization,
                    credits: ach.credits,
                    notes: ach.notes || "",
                    proofType: "Certificate",
                  })
                }
                onNavigateToFraudChecker={() => setActiveTab("fraud-checker")}
              />
            )}

            {(activeTab === "fraud-checker" || activeTab === "fraud") && (
              <FraudCheckerView
                onAddVerifiedToPassport={handleAddVerifiedFromFraud}
              />
            )}

            {(activeTab === "evidence" || activeTab === "locker") && (
              <EvidenceLockerView
                passport={activePassport}
                onNavigateToQuickAdd={() => setActiveTab("quick-add")}
              />
            )}

            {activeTab === "jobs" && (
              <JobsView
                passport={activePassport}
                jobs={jobs}
                onSkillVerifiedAndAdded={handleSkillVerifiedAndAdded}
              />
            )}

            {(activeTab === "recognition" || activeTab === "global") && (
              <GlobalRecognitionView passport={activePassport} />
            )}

            {(activeTab === "extractor" || activeTab === "invisible") && (
              <InvisibleSkillsView
                passport={activePassport}
                onAddExtractedSkill={handleAddExtractedSkill}
              />
            )}

            {activeTab === "recruiter" && (
              <RecruiterSearchView
                passports={passports}
                onSelectCandidate={(id) => {
                  setActivePassportId(id);
                  setActiveTab("passport");
                }}
              />
            )}
          </div>
        </main>
      </div>

      {/* Share Passport QR & Embed Modal */}
      <SharePassportModal
        passport={activePassport}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onOpenVerification={(p) => {
          setVerifiedPassportToDisplay(p);
          setIsPublicVerifyOpen(true);
        }}
      />

      {/* Public Cryptographic Credential Verification Dossier */}
      <PublicVerificationModal
        passport={verifiedPassportToDisplay || activePassport}
        isOpen={isPublicVerifyOpen}
        onClose={() => setIsPublicVerifyOpen(false)}
        onExploreFullLedger={() => {
          setActiveTab("passport");
          setIsPublicVerifyOpen(false);
        }}
      />

      {/* Manage Personas Modal */}
      <ManagePersonasModal
        passports={passports}
        activePassportId={activePassportId}
        isOpen={isManageModalOpen}
        onClose={() => setIsManageModalOpen(false)}
        onSelectPassport={(id) => {
          setActivePassportId(id);
          setIsManageModalOpen(false);
        }}
        onAddCustomPassport={handleAddCustomPassport}
        onResetToDefault={handleResetToDefault}
        onDeletePassport={handleDeletePassport}
      />

      {/* Edit Profile Details Modal */}
      {isEditProfileOpen && (
        <EditProfileModal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          passport={activePassport}
          onSave={handleUpdateProfile}
        />
      )}
    </div>
  );
}

export default App;
