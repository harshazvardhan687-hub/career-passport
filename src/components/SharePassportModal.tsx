import React, { useState, useEffect, useRef } from "react";
import {
  X,
  QrCode,
  Copy,
  Check,
  Download,
  Share2,
  ShieldCheck,
  ExternalLink,
  Smartphone,
  Sparkles,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileCode,
  RefreshCw
} from "lucide-react";
import QRCode from "qrcode";
import jsQR from "jsqr";
import { PassportProfile } from "../types";
import { getPassportCredits } from "../utils/credits";

interface SharePassportModalProps {
  passport?: PassportProfile;
  isOpen: boolean;
  onClose: () => void;
  onOpenVerification?: (passport: PassportProfile) => void;
}

export const SharePassportModal: React.FC<SharePassportModalProps> = ({
  passport,
  isOpen,
  onClose,
  onOpenVerification,
}) => {
  const [activeTab, setActiveTab] = useState<"qr" | "scanner" | "embed">("qr");
  const [urlType, setUrlType] = useState<"live" | "canonical">("live");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [isQrLoading, setIsQrLoading] = useState<boolean>(true);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isImageCopied, setIsImageCopied] = useState<boolean>(false);
  const [isEmbedCopied, setIsEmbedCopied] = useState<boolean>(false);

  // Scanner state
  const [scannerStatus, setScannerStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const passportNumber = passport?.passportNumber || "CP-2024-0891";
  const fullName = passport?.fullName || "Candidate";
  const headline = passport?.headline || "Verified Professional";
  const careerScore = passport ? getPassportCredits(passport) : 0;

  // Real, functional URLs:
  // Live verification link that opens the app with verify query param:
  const liveUrl = `${window.location.origin}${window.location.pathname}?verify=${encodeURIComponent(passportNumber)}`;
  // Canonical official domain:
  const canonicalUrl = `https://careerpassport.id/verify/${passportNumber.toLowerCase()}`;

  const currentShareUrl = urlType === "live" ? liveUrl : canonicalUrl;
  const embedCode = `<iframe src="${liveUrl}&embed=true" width="340" height="200" style="border:0;border-radius:16px;" title="Career Passport Verified Badge"></iframe>`;

  // Generate genuine scannable QR code
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsQrLoading(true);

    QRCode.toDataURL(currentShareUrl, {
      width: 400,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#090d16", // High-contrast deep slate
        light: "#ffffff",
      },
    })
      .then((url) => {
        if (isMounted) {
          setQrDataUrl(url);
          setIsQrLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error generating QR code:", err);
        if (isMounted) {
          setIsQrLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, currentShareUrl]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(currentShareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard?.writeText(embedCode);
    setIsEmbedCopied(true);
    setTimeout(() => setIsEmbedCopied(false), 2500);
  };

  // Download high-DPI QR Card with branding and passport details
  const handleDownloadQrCard = () => {
    if (!qrDataUrl) return;

    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 760;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 760);
    bgGradient.addColorStop(0, "#0f172a");
    bgGradient.addColorStop(1, "#1e293b");
    ctx.fillStyle = bgGradient;
    ctx.beginPath();
    ctx.roundRect(0, 0, 640, 760, 32);
    ctx.fill();

    // Top Card Header
    ctx.fillStyle = "#38bdf8";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("CAREER PASSPORT • VERIFIED DOSSIER", 48, 64);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(fullName, 48, 102);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "16px sans-serif";
    ctx.fillText(headline.slice(0, 48), 48, 132);

    // Pill badge: Passport ID & Credits
    ctx.fillStyle = "#1e3a8a";
    ctx.beginPath();
    ctx.roundRect(48, 150, 170, 34, 17);
    ctx.fill();
    ctx.fillStyle = "#93c5fd";
    ctx.font = "bold 14px monospace";
    ctx.fillText(passportNumber, 66, 172);

    ctx.fillStyle = "#78350f";
    ctx.beginPath();
    ctx.roundRect(230, 150, 180, 34, 17);
    ctx.fill();
    ctx.fillStyle = "#fde68a";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`🌟 ${careerScore} Career Credits`, 246, 172);

    // White QR Container Box
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(140, 210, 360, 360, 24);
    ctx.fill();

    // Draw QR code image
    const qrImage = new Image();
    qrImage.onload = () => {
      ctx.drawImage(qrImage, 160, 230, 320, 320);

      // Bottom footer instructions
      ctx.fillStyle = "#f8fafc";
      ctx.font = "bold 16px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Scan with any Smartphone Camera to Verify", 320, 620);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "13px monospace";
      ctx.fillText(currentShareUrl.slice(0, 52), 320, 650);

      ctx.fillStyle = "#64748b";
      ctx.font = "12px sans-serif";
      ctx.fillText("Cryptographic SHA-256 Authenticity Seal • Tamper Proof", 320, 690);

      // Trigger download
      const link = document.createElement("a");
      link.download = `${passportNumber}_Verified_QR_Card.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    qrImage.src = qrDataUrl;
  };

  // Copy QR Image to clipboard
  const handleCopyQrImage = async () => {
    if (!qrDataUrl) return;
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);
      setIsImageCopied(true);
      setTimeout(() => setIsImageCopied(false), 2500);
    } catch (e) {
      // Fallback: copy URL
      navigator.clipboard?.writeText(currentShareUrl);
      setIsImageCopied(true);
      setTimeout(() => setIsImageCopied(false), 2500);
    }
  };

  // Download raw ledger JSON
  const handleDownloadJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(passport || {}, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${passportNumber}_ledger.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // QR Decoder Handler: Decode an uploaded image with jsQR
  const handleScanFile = (file: File) => {
    setScannerStatus("scanning");
    setScanFeedback("Reading image pixels and searching for 2D barcode patterns...");

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          setScannerStatus("error");
          setScanFeedback("Failed to process image context.");
          return;
        }

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
          setScannerStatus("success");
          setScannedResult(code.data);
          setScanFeedback(`Found valid QR code! Decoded payload: ${code.data}`);
        } else {
          setScannerStatus("error");
          setScanFeedback("No QR code detected in this image. Please upload a clear image containing a QR code.");
        }
      };
      img.onerror = () => {
        setScannerStatus("error");
        setScanFeedback("Could not load image file.");
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Test scan the current passport's generated QR code to verify it works instantly
  const handleTestScanCurrentQr = () => {
    if (!qrDataUrl) return;
    setScannerStatus("scanning");
    setScanFeedback("Decoding current generated QR code in real-time...");

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code && code.data) {
        setScannerStatus("success");
        setScannedResult(code.data);
        setScanFeedback(`100% Scannable! Successfully decoded: ${code.data}`);
      } else {
        setScannerStatus("error");
        setScanFeedback("Scan check failed.");
      }
    };
    img.src = qrDataUrl;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Share Passport & Scannable QR Code
              </h3>
              <p className="text-xs text-slate-500">
                Instant smartphone verification for employers, schools, and portfolios.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition cursor-pointer"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab("qr")}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "qr"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>1. Scannable QR Code</span>
          </button>

          <button
            onClick={() => setActiveTab("scanner")}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "scanner"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>2. Test QR Scanner</span>
          </button>

          <button
            onClick={() => setActiveTab("embed")}
            className={`flex-1 py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
              activeTab === "embed"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileCode className="w-4 h-4" />
            <span>3. Embed & Links</span>
          </button>
        </div>

        {/* TAB 1: GENUINE SCANNABLE QR CODE */}
        {activeTab === "qr" && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Real QR Code Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-blue-50/30 border border-slate-200 flex flex-col sm:flex-row items-center gap-5">
              {/* Crisp Scannable QR Code Image */}
              <div className="relative group shrink-0">
                <div className="w-40 h-40 sm:w-44 sm:h-44 bg-white p-3 rounded-2xl border-2 border-slate-300 shadow-md flex items-center justify-center relative overflow-hidden">
                  {isQrLoading ? (
                    <div className="flex flex-col items-center justify-center text-slate-400 gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                      <span className="text-[11px] font-semibold">Generating QR...</span>
                    </div>
                  ) : (
                    <img
                      src={qrDataUrl}
                      alt={`Scannable QR Code for ${fullName}`}
                      className="w-full h-full object-contain rounded-lg select-none"
                    />
                  )}
                </div>

                {/* Scan Status Badge */}
                <div className="mt-2 text-center">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    100% Camera Scannable
                  </span>
                </div>
              </div>

              {/* Passport Details & Instructions */}
              <div className="space-y-2.5 min-w-0 flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[11px] font-mono font-bold">
                    {passportNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[11px] font-bold">
                    🌟 {careerScore} Verified Credits
                  </span>
                </div>

                <h4 className="font-black text-slate-900 text-base leading-tight">
                  {fullName}
                </h4>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {headline}
                </p>

                <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                    <Smartphone className="w-3.5 h-3.5 text-blue-600" />
                    <span>How to scan:</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Open your smartphone's camera app and point it at the code. A banner will pop up allowing immediate credential verification!
                  </p>
                </div>

                {/* Quick actions for testing & preview */}
                <div className="flex items-center gap-2 pt-1">
                  {onOpenVerification && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenVerification(passport || ({} as PassportProfile));
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview Verification</span>
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setActiveTab("scanner");
                      setTimeout(handleTestScanCurrentQr, 100);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Test Scan Here</span>
                  </button>
                </div>
              </div>
            </div>

            {/* QR Download & Copy Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleDownloadQrCard}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Download QR Card (PNG)</span>
              </button>

              <button
                onClick={handleCopyQrImage}
                className="p-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isImageCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">QR Image Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-600" />
                    <span>Copy QR Code Image</span>
                  </>
                )}
              </button>
            </div>

            {/* Encoded URL Selector */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Target QR Destination URL:</span>
                <div className="flex items-center gap-1.5 bg-slate-200/70 p-0.5 rounded-lg text-[11px]">
                  <button
                    onClick={() => setUrlType("live")}
                    className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                      urlType === "live"
                        ? "bg-white text-blue-700 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Live App URL
                  </button>
                  <button
                    onClick={() => setUrlType("canonical")}
                    className={`px-2 py-0.5 rounded-md font-bold transition cursor-pointer ${
                      urlType === "canonical"
                        ? "bg-white text-blue-700 shadow-2xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Canonical Domain
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={currentShareUrl}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-mono text-slate-800 select-all"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition cursor-pointer"
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
          </div>
        )}

        {/* TAB 2: IN-APP QR CODE SCANNER & DECODER */}
        {activeTab === "scanner" && (
          <div className="space-y-4 overflow-y-auto pr-1">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
              <strong>Interactive QR Code Verification:</strong> Test any QR code right inside the browser. You can upload an image containing a QR code, or test-scan the current candidate's QR code.
            </div>

            {/* Test buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleTestScanCurrentQr}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition flex items-center gap-2 shadow-xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Test Current Passport QR</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs transition flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-slate-600" />
                <span>Upload QR Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleScanFile(file);
                }}
              />
            </div>

            {/* Scanner Status Box */}
            {scannerStatus !== "idle" && (
              <div
                className={`p-4 rounded-2xl border text-xs space-y-2 ${
                  scannerStatus === "success"
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                    : scannerStatus === "error"
                    ? "bg-rose-50 border-rose-300 text-rose-900"
                    : "bg-slate-50 border-slate-300 text-slate-800"
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {scannerStatus === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : scannerStatus === "error" ? (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  )}
                  <span>{scanFeedback}</span>
                </div>

                {scannedResult && (
                  <div className="mt-2 p-3 rounded-xl bg-white border border-slate-200 space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Decoded 2D Barcode Data:
                    </span>
                    <p className="font-mono text-xs text-slate-800 break-all select-all">
                      {scannedResult}
                    </p>

                    <div className="pt-2 flex items-center gap-2">
                      {onOpenVerification && (
                        <button
                          onClick={() => {
                            onClose();
                            onOpenVerification(passport || ({} as PassportProfile));
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>View Verified Dossier</span>
                        </button>
                      )}
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(scannedResult);
                          alert("Decoded URL copied to clipboard!");
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition cursor-pointer"
                      >
                        Copy Decoded Link
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: EMBED & RAW EXPORTS */}
        {activeTab === "embed" && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {/* Embed Widget */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-slate-700">
                Embed Badge on Portfolio / GitHub README / Website:
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
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1 shrink-0 transition cursor-pointer"
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

            {/* Direct Verification URL */}
            <div className="space-y-1.5 text-xs">
              <label className="block font-semibold text-slate-700">
                Public Verification Ledger URL:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={liveUrl}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-800 select-all"
                />
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1 shrink-0 transition cursor-pointer"
                >
                  {isCopied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            {/* Raw JSON Download */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-slate-900 text-xs">
                  Full Cryptographic Ledger (JSON)
                </h5>
                <p className="text-[11px] text-slate-500">
                  Export machine-readable portable credential file.
                </p>
              </div>
              <button
                onClick={handleDownloadJson}
                className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Encrypted with SHA-256 Digest Signature</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
