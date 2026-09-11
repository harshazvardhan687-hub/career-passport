import React, { useState } from "react";
import {
  FileText,
  UploadCloud,
  FileCheck2,
  Sparkles,
  Loader2,
  CheckCircle2,
  Award,
  GraduationCap,
  Briefcase,
  Code2,
  FileBadge,
  AlertCircle,
} from "lucide-react";
import { PassportProfile, ParsedResumeData } from "../types";
import { sampleResumes } from "../data/initialData";

interface ResumeParserViewProps {
  activePassport?: PassportProfile;
  onApplyParsedDataToPassport?: (data: ParsedResumeData) => void;
  onAddParsedToPassport?: (data: ParsedResumeData) => void;
}

export const ResumeParserView: React.FC<ResumeParserViewProps> = ({
  activePassport,
  onApplyParsedDataToPassport,
  onAddParsedToPassport,
}) => {
  const [activeInputMode, setActiveInputMode] = useState<"upload" | "paste">("upload");
  const [resumeText, setResumeText] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [parsedResult, setParsedResult] = useState<ParsedResumeData | null>(null);
  const [isApplied, setIsApplied] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content && content.length > 20) {
        setResumeText(content);
      } else {
        setResumeText(
          `Candidate Resume from file: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB`
        );
      }
    };
    reader.onerror = () => {
      setErrorMessage(
        "Failed to read file. Please paste your resume text in the text tab."
      );
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      setErrorMessage(null);
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content && content.length > 20) {
          setResumeText(content);
        } else {
          setResumeText(
            `Candidate Resume from file: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB`
          );
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSample = (sampleKey: keyof typeof sampleResumes) => {
    const sample = sampleResumes[sampleKey];
    setResumeText(sample);
    setFileName(`${sampleKey}_resume_sample.txt`);
    setActiveInputMode("paste");
    setErrorMessage(null);
  };

  const handleParseResume = async () => {
    if (!resumeText || resumeText.trim().length < 15) {
      setErrorMessage(
        "Please provide your resume text or upload a valid resume file first."
      );
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setIsApplied(false);

    try {
      setStatusMessage("1/3: Reading resume milestones and academic transcripts...");
      await new Promise((r) => setTimeout(r, 450));
      setStatusMessage("2/3: Validating work experiences, projects & accredited credentials...");

      const response = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: resumeText.trim(),
          fileName: fileName || "candidate_resume.txt",
          candidateNameHint: activePassport?.fullName || "",
        }),
      });

      setStatusMessage(
        "3/3: Calculating verified Career Credits & cryptographically standardizing..."
      );

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setParsedResult(resJson.data);
      } else {
        throw new Error(resJson.error || "Failed to extract resume data.");
      }
    } catch (err: any) {
      console.error("Resume parse error:", err);
      setErrorMessage(
        err.message ||
          "Error processing resume. Please verify your connection or try again."
      );
    } finally {
      setIsLoading(false);
      setStatusMessage("");
    }
  };

  const handleApplyToPassport = () => {
    if (parsedResult) {
      const applyFn = onApplyParsedDataToPassport || onAddParsedToPassport;
      if (applyFn) {
        applyFn(parsedResult);
      }
      setIsApplied(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Universal Resume & Transcript Parser</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Add Your Resume & Generate Career Credits
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
              Upload your PDF, Word doc, or paste your resume text. The Career
              Passport verification engine automatically extracts degrees,
              internships, coding projects, and skills into verified Career
              Credits.
            </p>
          </div>

          {/* Quick test sample pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500">
              Quick Test Samples:
            </span>
            <button
              onClick={() => handleLoadSample("software")}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
            >
              Software Engineer
            </button>
            <button
              onClick={() => handleLoadSample("nurse")}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
            >
              Registered Nurse
            </button>
            <button
              onClick={() => handleLoadSample("trade")}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition cursor-pointer"
            >
              Diagnostic Tech
            </button>
          </div>
        </div>
      </div>

      {/* Input / Upload Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveInputMode("upload")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeInputMode === "upload"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Resume File</span>
          </button>
          <button
            onClick={() => setActiveInputMode("paste")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
              activeInputMode === "paste"
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Paste Resume Text</span>
          </button>
        </div>

        {activeInputMode === "upload" ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center transition bg-slate-50/50 cursor-pointer"
          >
            <input
              type="file"
              id="resume-file-input"
              accept=".pdf,.docx,.doc,.txt,.json,.rtf"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="resume-file-input" className="cursor-pointer block">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Click to Upload or Drag & Drop Resume
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports PDF, DOCX, TXT transcripts and files up to 10MB
              </p>
              {fileName && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-full text-xs font-semibold">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Selected: {fileName}</span>
                </div>
              )}
            </label>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700">
              Paste Complete Resume / Transcript Text:
            </label>
            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste complete resume with Education, Work Experience, Projects, Certifications and Technical Skills..."
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-xs font-mono text-slate-800 focus:outline-none focus:border-blue-500 focus:bg-white transition"
            />
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            AI checks for accredited institutions, verified skills, and awards
            credits automatically.
          </div>
          <button
            onClick={handleParseResume}
            disabled={isLoading || !resumeText}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-xs cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{statusMessage || "Processing Resume..."}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Parse Resume & Generate Career Credits</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Parsed Result Display */}
      {parsedResult && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Resume Successfully Parsed</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                {parsedResult.candidate.fullName}
              </h3>
              <p className="text-sm font-medium text-blue-700 mt-0.5">
                {parsedResult.candidate.headline} • {parsedResult.candidate.location}
              </p>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                {parsedResult.candidate.summary}
              </p>
            </div>

            <div className="flex flex-col items-end shrink-0">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">
                    Calculated Credits
                  </div>
                  <div className="text-2xl font-black font-mono text-emerald-400">
                    +{parsedResult.calculatedTotalCredits} cr
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/60 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                <span>Education & Degrees ({parsedResult.education.length})</span>
              </div>
              <div className="space-y-2.5">
                {parsedResult.education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-3 border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{edu.title}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 font-mono font-bold">
                        +{edu.credits} cr
                      </span>
                    </div>
                    <div className="text-slate-600">
                      {edu.organization} • {edu.date}
                    </div>
                    {edu.gpa && (
                      <div className="text-slate-500 font-medium">GPA: {edu.gpa}</div>
                    )}
                    {edu.notes && (
                      <div className="text-slate-500 italic text-[11px]">{edu.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/60 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>
                  Work Experience & Internships (
                  {parsedResult.workExperiences.length})
                </span>
              </div>
              <div className="space-y-2.5">
                {parsedResult.workExperiences.map((exp, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-3 border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{exp.title}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-bold">
                        +{exp.credits} cr
                      </span>
                    </div>
                    <div className="text-slate-600">
                      {exp.organization} • {exp.date}
                    </div>
                    {exp.achievements && exp.achievements.length > 0 && (
                      <ul className="list-disc list-inside text-slate-600 text-[11px] pt-1 space-y-0.5">
                        {exp.achievements.map((ach, aIdx) => (
                          <li key={aIdx} className="truncate">
                            {ach}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Projects */}
            <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/60 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Code2 className="w-4 h-4 text-indigo-600" />
                <span>Engineering Projects ({parsedResult.projects.length})</span>
              </div>
              <div className="space-y-2.5">
                {parsedResult.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-3 border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{proj.title}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold">
                        +{proj.credits} cr
                      </span>
                    </div>
                    <div className="text-slate-600">
                      {proj.organization} • {proj.date}
                    </div>
                    {proj.description && (
                      <p className="text-[11px] text-slate-600 pt-0.5">
                        {proj.description}
                      </p>
                    )}
                    {proj.techStack && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.techStack.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-700 font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Certs */}
            <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/60 space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <FileBadge className="w-4 h-4 text-amber-600" />
                <span>
                  Certifications & Verified Skills (
                  {parsedResult.certifications.length + parsedResult.skills.length})
                </span>
              </div>
              <div className="space-y-2.5">
                {parsedResult.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-xl p-3 border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{cert.title}</span>
                      <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-700 font-mono font-bold">
                        +{cert.credits} cr
                      </span>
                    </div>
                    <div className="text-slate-600">
                      {cert.organization} • {cert.date}
                    </div>
                  </div>
                ))}

                <div className="pt-2 border-t border-slate-200/60">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Extracted Competencies:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {parsedResult.skills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs"
                      >
                        <span>{sk.name}</span>
                        <span className="text-blue-600 font-mono text-[11px]">
                          +{sk.credits}cr
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Applying will add these verifiable milestones directly into{" "}
              <strong>{activePassport?.fullName || "Candidate"}’s</strong> ledger and raise the
              Career Score.
            </div>

            {isApplied ? (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Applied to Passport Ledger!</span>
              </div>
            ) : (
              <button
                onClick={handleApplyToPassport}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Apply Extracted Credits to My Passport</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
