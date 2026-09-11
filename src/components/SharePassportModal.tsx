import React, { useState } from "react";
import {
  X,
  QrCode,
  Copy,
  Check,
  Download,
  Share2,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { PassportProfile } from "../types";

interface SharePassportModalProps {
  passport?: PassportProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const SharePassportModal: React.FC<SharePassportModalProps> = ({
  passport,
  isOpen,
  onClose,
}) => {
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isEmbedCopied, setIsEmbedCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const passportNumber = passport?.passportNumber || "CP-0000";
  const fullName = passport?.fullName || "Candidate";
  const headline = passport?.headline || "Verified Professional";
  const careerScore = passport?.careerScore ?? 0;

  const shareUrl = `https://careerpassport.id/verify/${passportNumber.toLowerCase()}`;
  const embedCode = `<iframe src="${shareUrl}/badge" width="320" height="180" frameborder="0"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard?.writeText(embedCode);
    setIsEmbedCopied(true);
    setTimeout(() => setIsEmbedCopied(false), 2500);
  };

  const handleDownloadJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(passport || {}, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute(
      "download",
      `${passportNumber}_ledger.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
              <Share2 className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Share Career Passport
              </h3>
              <p className="text-xs text-slate-500">
                Direct cryptographic proof link for recruiters and admissions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code and Identity Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {/* Simulated QR Code */}
          <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs shrink-0 flex flex-col items-center justify-center">
            <QrCode className="w-20 h-20 text-slate-900" />
          </div>

          <div className="space-y-1 min-w-0">
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 text-[10px] font-mono font-bold">
              {passportNumber}
            </span>
            <h4 className="font-bold text-slate-900 text-sm truncate">
              {fullName}
            </h4>
            <p className="text-xs text-slate-600 truncate">{headline}</p>
            <div className="text-xs text-blue-700 font-mono font-bold">
              {careerScore} Verified Credits
            </div>
          </div>
        </div>

        {/* Share Link Box */}
        <div className="space-y-1.5 text-xs">
          <label className="block font-semibold text-slate-700">
            Public Verification Ledger URL:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 select-all"
            />
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
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

        {/* Embed Widget */}
        <div className="space-y-1.5 text-xs">
          <label className="block font-semibold text-slate-700">
            Embed Badge on Portfolio / GitHub README:
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={embedCode}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 truncate"
            />
            <button
              onClick={handleCopyEmbed}
              className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1 shrink-0 transition cursor-pointer"
            >
              {isEmbedCopied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
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

        {/* Export JSON / PDF actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleDownloadJson}
            className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Ledger JSON</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
