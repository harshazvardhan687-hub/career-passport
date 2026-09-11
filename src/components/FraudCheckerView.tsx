import React, { useState } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileBadge,
  Building,
  User,
  Hash,
  Calendar,
  Link as LinkIcon,
  Sparkles,
  Loader2,
  Plus,
} from "lucide-react";
import { FraudVerificationResult } from "../types";

interface FraudCheckerViewProps {
  onAddVerifiedToPassport: (result: FraudVerificationResult) => void;
}

export const FraudCheckerView: React.FC<FraudCheckerViewProps> = ({
  onAddVerifiedToPassport,
}) => {
  const [certTitle, setCertTitle] = useState<string>("AWS Certified Solutions Architect – Associate");
  const [issuer, setIssuer] = useState<string>("Amazon Web Services");
  const [recipient, setRecipient] = useState<string>("Rahul Sharma");
  const [certId, setCertId] = useState<string>("AWS-PSA-8842190");
  const [issueDate, setIssueDate] = useState<string>("2024-03-12");
  const [verifyUrl, setVerifyUrl] = useState<string>("https://aws.amazon.com/verification/AWS-PSA-8842190");
  const [certText, setCertText] = useState<string>(
    "Amazon Web Services Training and Certification certifies that Rahul Sharma has successfully demonstrated the AWS Certified Solutions Architect - Associate certification covering distributed cloud infrastructure, IAM security, and auto-scaling architectures."
  );
  const [fileName, setFileName] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FraudVerificationResult | null>(null);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [errorText, setErrorText] = useState<string | null>(null);

  const presets = [
    {
      label: "Real AWS Cert (Authentic)",
      type: "authentic",
      data: {
        title: "AWS Certified Solutions Architect – Associate",
        issuer: "Amazon Web Services",
        recipient: "Rahul Sharma",
        certId: "AWS-PSA-8842190",
        issueDate: "2024-03-12",
        verifyUrl: "https://aws.amazon.com/verification/AWS-PSA-8842190",
        text: "Demonstrated skills in highly available, fault-tolerant, scalable architectures on AWS. Verified cryptographically via Credly / AWS cert registry.",
      },
    },
    {
      label: "Suspicious Boot Camp (Warning)",
      type: "suspicious",
      data: {
        title: "Master AI Prompt & Fullstack Engineer Certificate",
        issuer: "QuickSkillz Academy Online",
        recipient: "Rahul Sharma",
        certId: "QS-2024-TMP",
        issueDate: "2024-05-01",
        verifyUrl: "https://quickskillz-temp.xyz/verify/1",
        text: "Awarded for 4-hour online webinar completion without proctored examination or institutional accreditation.",
      },
    },
    {
      label: "Fake Diploma Mill (Fraud)",
      type: "fraud",
      data: {
        title: "Executive Master in Computer Science",
        issuer: "Universal International Global Open University",
        recipient: "John Doe",
        certId: "MILL-990-FAKE",
        issueDate: "2023-11-20",
        verifyUrl: "http://buy-degree-now.com/valid/990",
        text: "Life experience degree issued within 24 hours without academic faculty, transcript, or state regulatory licensure.",
      },
    },
  ];

  const handleLoadPreset = (preset: (typeof presets)[0]) => {
    setCertTitle(preset.data.title);
    setIssuer(preset.data.issuer);
    setRecipient(preset.data.recipient);
    setCertId(preset.data.certId);
    setIssueDate(preset.data.issueDate);
    setVerifyUrl(preset.data.verifyUrl);
    setCertText(preset.data.text);
    setFileName(`${preset.type}_sample_document.png`);
    setResult(null);
    setIsAdded(false);
    setErrorText(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setErrorText(null);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleRunFraudCheck = async () => {
    if (!certTitle.trim() || !issuer.trim()) {
      setErrorText("Please fill in at least the Certificate Title and Issuing Organization.");
      return;
    }

    setIsLoading(true);
    setStatusText("Initiating registry handshake and checksum validation...");
    setErrorText(null);
    setIsAdded(false);

    try {
      await new Promise((r) => setTimeout(r, 400));
      setStatusText("Scanning against diploma mill databases & examining security seals...");

      const response = await fetch("/api/verify-certificate-fraud", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: certTitle,
          organization: issuer,
          recipient: recipient,
          certificateId: certId,
          issueDate: issueDate,
          verificationUrl: verifyUrl,
          detailsText: certText,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const resJson = await response.json();
      if (resJson.success && resJson.data) {
        setResult(resJson.data);
      } else {
        throw new Error(resJson.error || "Fraud check analysis failed.");
      }
    } catch (err: any) {
      console.error("Fraud check error:", err);
      setErrorText(err.message || "Failed to inspect certificate. Please try again.");
    } finally {
      setIsLoading(false);
      setStatusText("");
    }
  };

  const handleAddToPassport = () => {
    if (result) {
      onAddVerifiedToPassport(result);
      setIsAdded(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Problem 1: Fake & Unverified Credentials</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              AI Certificate Authenticity & Fraud Inspector
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mt-1 leading-relaxed">
              Employers lose billions to diploma mills and fabricated certifications.
              Our engine audits issuing domain registries, cryptographic seals, and
              tamper signals before converting certificates into verified Career Credits.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Test Realistic Scenarios:
            </span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleLoadPreset(preset)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition cursor-pointer border ${
                  preset.type === "authentic"
                    ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200"
                    : preset.type === "suspicious"
                    ? "bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200"
                    : "bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Document Upload */}
        <div className="lg:col-span-6 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Certificate Credentials to Inspect
          </h3>

          {/* Upload area */}
          <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-2xl p-4 text-center transition bg-slate-50/60">
            <input
              type="file"
              id="cert-file"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <label htmlFor="cert-file" className="cursor-pointer block">
              <UploadCloud className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-700">
                Click to upload certificate document or scan
              </p>
              <p className="text-[11px] text-slate-400">
                PNG, JPG, PDF up to 10MB
              </p>
              {fileName && (
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium">
                  <span>Selected: {fileName}</span>
                </div>
              )}
            </label>
          </div>

          {filePreview && (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 max-h-32 bg-slate-900/5">
              <img
                src={filePreview}
                alt="Certificate preview"
                className="w-full h-28 object-contain"
              />
            </div>
          )}

          {errorText && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorText}</span>
            </div>
          )}

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <FileBadge className="w-3.5 h-3.5 text-blue-600" />
                <span>Certificate Name / Title</span>
              </label>
              <input
                type="text"
                value={certTitle}
                onChange={(e) => setCertTitle(e.target.value)}
                placeholder="e.g. AWS Certified Solutions Architect"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-blue-600" />
                  <span>Issuing Organization</span>
                </label>
                <input
                  type="text"
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Candidate Name</span>
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-blue-600" />
                  <span>Certificate ID / Serial</span>
                </label>
                <input
                  type="text"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  placeholder="e.g. AWS-8842190"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span>Issue Date</span>
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                <span>Issuer Verification Endpoint</span>
              </label>
              <input
                type="url"
                value={verifyUrl}
                onChange={(e) => setVerifyUrl(e.target.value)}
                placeholder="https://issuer.com/verify/..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Extracted Certificate Text / Details
              </label>
              <textarea
                rows={2}
                value={certText}
                onChange={(e) => setCertText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white"
              />
            </div>
          </div>

          <button
            onClick={handleRunFraudCheck}
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Inspecting Authenticity & Checksums...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Run AI Authenticity & Fraud Check</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Verification Results */}
        <div className="lg:col-span-6 space-y-4">
          {!result && !isLoading && (
            <div className="h-full min-h-[380px] bg-white rounded-3xl border border-slate-200 p-8 flex flex-col items-center justify-center text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4 text-blue-600">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-2">
                Ready to Verify Certificate
              </h4>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed mb-6">
                Upload your certificate file or select a preset to inspect issuer
                accreditation, checksum pattern, registry endpoints, and tamper signals.
              </p>
              <div className="grid grid-cols-2 gap-3 max-w-xs w-full text-left text-xs text-slate-700">
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Registry Validation</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Anti-Tamper Scan</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Diploma Mill Filter</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Credit Conversion</span>
                </div>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="h-full min-h-[380px] bg-white rounded-3xl border border-blue-200 p-8 flex flex-col items-center justify-center text-center shadow-xs">
              <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
                <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
              </div>
              <h4 className="text-base font-bold text-slate-900 mb-1">
                Scanning Certificate Signatures
              </h4>
              <p className="text-xs text-slate-500">
                {statusText || "Handshaking with issuer registries & evaluating fraud vectors..."}
              </p>
            </div>
          )}

          {result && !isLoading && (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              {/* Verdict Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between gap-4 ${
                  result.verdict === "AUTHENTIC"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : result.verdict === "SUSPICIOUS"
                    ? "bg-amber-50 border-amber-200 text-amber-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      result.verdict === "AUTHENTIC"
                        ? "bg-emerald-100 text-emerald-700"
                        : result.verdict === "SUSPICIOUS"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {result.verdict === "AUTHENTIC" && (
                      <ShieldCheck className="w-6 h-6" />
                    )}
                    {result.verdict === "SUSPICIOUS" && (
                      <ShieldAlert className="w-6 h-6" />
                    )}
                    {result.verdict === "FRAUDULENT" && (
                      <ShieldX className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        AI Verdict:
                      </span>
                      <span className="text-sm font-extrabold uppercase px-2 py-0.5 rounded-md bg-white border border-current">
                        {result.verdict === "AUTHENTIC"
                          ? "Verified Authentic"
                          : result.verdict === "SUSPICIOUS"
                          ? "Suspicious Review"
                          : "Fraudulent / Fake"}
                      </span>
                    </div>
                    <p className="text-xs mt-0.5 text-slate-600">
                      Confidence Level:{" "}
                      <span className="font-semibold text-slate-900">
                        {result.confidenceLevel}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black font-mono tracking-tight text-slate-900">
                    {result.trustScore}%
                  </div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">
                    Trust Score (Risk: {result.fraudRiskScore}%)
                  </div>
                </div>
              </div>

              {/* Auditor Verdict Summary */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">
                  Auditor Verdict:{" "}
                </span>
                {result.summary}
              </div>

              {/* Security Checks List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Verification Security Checks:
                </div>
                <div className="space-y-1.5">
                  {result.securityChecks.map((check, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        {check.status === "PASS" && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        {check.status === "WARN" && (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        {check.status === "FAIL" && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="font-bold text-slate-900">
                            {check.name}
                          </div>
                          <div className="text-slate-500 text-[11px]">
                            {check.details}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          check.status === "PASS"
                            ? "bg-emerald-100 text-emerald-800"
                            : check.status === "WARN"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {check.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hash and Credits Conversion */}
              <div className="p-3 bg-slate-900 rounded-2xl text-white text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Recommended Career Credits:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    +{result.recommendedCredits} Credits
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Standardized Competency:</span>
                  <span className="font-semibold text-blue-300">
                    {result.standardizedSkill}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Cryptographic Seal:</span>
                  <span className="font-mono text-[10px] text-slate-300 truncate max-w-[200px]">
                    {result.verificationHash}
                  </span>
                </div>
              </div>

              {/* Add to Passport CTA */}
              {result.verdict === "AUTHENTIC" && (
                <div>
                  {isAdded ? (
                    <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Added to Your Career Passport Ledger!</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleAddToPassport}
                      className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>
                        Add Verified Certificate to Passport Ledger (+
                        {result.recommendedCredits} cr)
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
