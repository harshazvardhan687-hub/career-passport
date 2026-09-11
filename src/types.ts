export type PersonaType = 'student' | 'international' | 'informal' | 'custom';

export type TabType =
  | 'passport'
  | 'roadmap'
  | 'parser'
  | 'resume-parser'
  | 'quickadd'
  | 'quick-add'
  | 'fraud'
  | 'fraud-checker'
  | 'locker'
  | 'evidence'
  | 'jobs'
  | 'global'
  | 'recognition'
  | 'invisible'
  | 'extractor'
  | 'recruiter';

export interface Achievement {
  id: string;
  category: string;
  title: string;
  organization: string;
  credits: number;
  date: string;
  verified: boolean;
  notes?: string;
}

export interface SkillProof {
  id: string;
  type: string;
  title: string;
  issuerOrEntity: string;
  date: string;
  verificationStatus: string;
  verificationHash: string;
  evidenceUrl?: string;
  details: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  credits: number;
  level: string;
  proofList: SkillProof[];
}

export interface ProgressionYear {
  year: string;
  credits: number;
  title: string;
  achievements: string[];
}

export interface ForeignRecognition {
  originCountry: string;
  targetCountry: string;
  originQualification: string;
  yearsOfExperience: number;
  targetEquivalentRole: string;
  overallEquivalencePercentage: number;
  standardizedCreditTotal: number;
  creditBreakdown: Array<{
    skill: string;
    originCredits: number;
    targetEquivalentRequirement: number;
    status: string;
  }>;
  missingBridgingRequirements: Array<{
    code: string;
    requirement: string;
    estimatedHours: number;
    passportAction: string;
  }>;
  pathwaySteps: Array<{
    step: number;
    title: string;
    status: 'Completed' | 'In Progress' | 'Next' | string;
    note: string;
  }>;
  standardizedRepresentationStatement?: string;
}

export interface PassportProfile {
  id: string;
  passportNumber: string;
  fullName: string;
  headline: string;
  personaType: PersonaType;
  avatar: string;
  location: string;
  targetRole: string;
  careerScore: number;
  bio: string;
  verifiedAt: string;
  countryOfOrigin?: string;
  targetCountry?: string;
  achievements: Achievement[];
  skills: Skill[];
  studentProgression?: ProgressionYear[];
  foreignRecognition?: ForeignRecognition;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  minCareerCredits: number;
  requiredSkills: string[];
  preferredSkills: string[];
  description: string;
  salaryRange: string;
}

export interface FraudSecurityCheck {
  name: string;
  status: 'PASS' | 'WARN' | 'FAIL';
  details: string;
}

export interface FraudVerificationResult {
  verdict: 'AUTHENTIC' | 'SUSPICIOUS' | 'FRAUDULENT';
  confidenceLevel: string;
  trustScore: number;
  fraudRiskScore: number;
  summary: string;
  securityChecks: FraudSecurityCheck[];
  recommendedCredits: number;
  standardizedSkill: string;
  verificationHash: string;
  extractedInfo?: {
    title?: string;
    organization?: string;
    recipient?: string;
    certificateId?: string;
    issueDate?: string;
    verificationUrl?: string;
  };
}

export interface ParsedResumeData {
  candidate: {
    fullName: string;
    headline: string;
    location: string;
    summary: string;
  };
  calculatedTotalCredits: number;
  education: Array<{
    title: string;
    credits: number;
    organization: string;
    date: string;
    gpa?: string;
    notes?: string;
  }>;
  workExperiences: Array<{
    title: string;
    credits: number;
    organization: string;
    date: string;
    achievements?: string[];
  }>;
  projects: Array<{
    title: string;
    credits: number;
    organization: string;
    date: string;
    description?: string;
    techStack?: string[];
  }>;
  certifications: Array<{
    title: string;
    credits: number;
    organization: string;
    date: string;
    credentialId?: string;
  }>;
  skills: Array<{
    name: string;
    credits: number;
    category: string;
    proofType: string;
    evidenceSnippet?: string;
    practicalEvidenceSummary?: string;
  }>;
}

export interface SkillGapChallengeQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SkillGapChallenge {
  skillName: string;
  careerContext: string;
  passingScorePercent: number;
  creditsAwardedOnPass: number;
  questions: SkillGapChallengeQuestion[];
}

export interface ExtractedInformalSkill {
  name: string;
  credits: number;
  category: string;
  proofTypes: string[];
  practicalEvidenceSummary: string;
  suggestedAction: string;
}
