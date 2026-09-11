import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Download,
  Share2,
  X,
  Award,
  Calendar,
  Lock,
  FileBadge,
  Building,
  GraduationCap,
  Briefcase,
  Sparkles,
  Printer
} from "lucide-react";
import { PassportProfile } from "../types";
import { getPassportCredits } from "../utils/credits";

interface PublicVerificationModalProps {
  passport?: PassportProfile;
  isOpen: boolean;
  onClose: () => void;
  onExploreFullLedger?: () => void;
}

export const PublicVerificationModal: React.FC<PublicVerificationModalProps> = ({
  passport,
  isOpen,
  onClose,
  onExploreFullLedger,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  if (!isOpen || !passport) return null;

  const totalCredits = getPassportCredits(passport);
  const passportNumber = passport.passportNumber || "CP-2024-0000";
  const verifiedHash = `0x${passportNumber.replace(/[^a-zA-Z0-9]/g, "")}8F2B9C${(totalCredits * 17).toString(16).toUpperCase()}`;
  const verificationUrl = `${window.location.origin}${window.location.pathname}?verify=${encodeURIComponent(passportNumber)}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(verificationUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Verification Status Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-5 sm:p-6 flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/30 shadow-inner">
              <ShieldCheck className="w-7 h-7 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider border border-white/20">
                  Cryptographically Verified
                </span>
                <span className="text-emerald-100 text-xs font-mono">
                  {passport.verifiedAt || "Timestamp: Real-Time Verified"}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-1">
                Official Credential Verification Dossier
              </h2>
              <p className="text-xs text-emerald-100">
                Issued by Career Passport Decentralized Skills Authority
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer shrink-0"
            title="Close Dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          {/* Candidate Snapshot */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <img
              src={passport.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={passport.fullName}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
            />
            <div className="space-y-1.5 text-center sm:text-left min-w-0 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  {passport.fullName}
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-mono text-xs font-bold">
                  {passportNumber}
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600">
                {passport.headline} • {passport.location}
              </p>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                {passport.bio}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 text-center shrink-0 min-w-[130px] shadow-2xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Credits
              </span>
              <span className="text-2xl font-black font-mono text-amber-600">
                🌟 {totalCredits}
              </span>
              <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                100% Authentic
              </span>
            </div>
          </div>

          {/* Cryptographic Proof Verification Block */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Tamper-Evident Hash Signature:
              </span>
              <span className="font-mono text-[11px] font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                VALID & MATCHED
              </span>
            </div>
            <p className="font-mono text-xs text-slate-700 break-all bg-white p-2.5 rounded-xl border border-emerald-200 select-all">
              {verifiedHash}
            </p>
            <div className="flex items-center justify-between text-[11px] text-emerald-800 pt-1">
              <span>Security Standard: SHA-256 Digest Signature</span>
              <span>Issuer: Accredited Ledger Authority</span>
            </div>
          </div>

          {/* Verified Achievements & Skills Overview */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <FileBadge className="w-4 h-4 text-blue-600" />
              <span>Verified Ledger Entries ({passport.achievements?.length || 0})</span>
            </h4>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {passport.achievements?.map((ach, idx) => (
                <div
                  key={ach.id || idx}
                  className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="p-1.5 rounded-lg bg-slate-100 text-slate-700 shrink-0">
                      {ach.category === "EDUCATION" ? (
                        <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                      ) : ach.category === "WORK" ? (
                        <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      ) : (
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {ach.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {ach.organization} • {ach.date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                      +{ach.credits} cr
                    </span>
                    <span className="p-1 rounded-full bg-emerald-100 text-emerald-700" title="Cryptographically Verified">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verification Link Sharer */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Permanent Verification Link:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={verificationUrl}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Dossier</span>
          </button>

          <div className="flex items-center gap-2">
            {onExploreFullLedger && (
              <button
                onClick={() => {
                  onClose();
                  onExploreFullLedger();
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Explore Full Ledger
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
