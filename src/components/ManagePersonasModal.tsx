import React, { useState } from "react";
import {
  X,
  Users,
  Plus,
  RotateCcw,
  Check,
  User,
  MapPin,
  Target,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import { PassportProfile } from "../types";

interface ManagePersonasModalProps {
  passports: PassportProfile[];
  activePassportId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectPassport: (id: string) => void;
  onAddCustomPassport: (newProfile: PassportProfile) => void;
  onResetToDefault: () => void;
  onDeletePassport?: (id: string) => void;
}

export const ManagePersonasModal: React.FC<ManagePersonasModalProps> = ({
  passports,
  activePassportId,
  isOpen,
  onClose,
  onSelectPassport,
  onAddCustomPassport,
  onResetToDefault,
  onDeletePassport,
}) => {
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const [isConfirmingReset, setIsConfirmingReset] = useState<boolean>(false);
  const [fullName, setFullName] = useState<string>("");
  const [headline, setHeadline] = useState<string>("");
  const [targetRole, setTargetRole] = useState<string>("");
  const [location, setLocation] = useState<string>("New York, USA");
  const [avatarUrl, setAvatarUrl] = useState<string>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  );
  const [bio, setBio] = useState<string>(
    "Dedicated professional with verified skills, ready to prove competencies to global employers."
  );

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    const newPassport: PassportProfile = {
      id: "usr-" + Date.now(),
      passportNumber: `CP-CUSTOM-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName.trim(),
      headline: headline.trim() || "Independent Professional",
      personaType: "custom",
      avatar:
        avatarUrl.trim() ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      location: location.trim() || "Global Remote",
      targetRole: targetRole.trim() || "Professional Specialist",
      careerScore: 200,
      bio: bio.trim(),
      verifiedAt: new Date().toISOString().split("T")[0],
      achievements: [
        {
          id: "ach-init-" + Date.now(),
          category: "Verified skills",
          title: "Foundational Career Passport Verification",
          organization: "Career Passport Global Trust Ledger",
          credits: 200,
          date: new Date().toISOString().split("T")[0],
          verified: true,
          notes: "Initial member registration and identity verification.",
        },
      ],
      skills: [
        {
          id: "sk-init-" + Date.now(),
          name: "Professional Communication",
          category: "Soft",
          credits: 200,
          level: "Proficient",
          proofList: [
            {
              id: "prf-init-" + Date.now(),
              type: "Assessment",
              title: "Workplace Collaboration Diagnostic",
              issuerOrEntity: "Career Passport Trust Engine",
              date: new Date().toISOString().split("T")[0],
              verificationStatus: "Verified",
              verificationHash: "sha256_" + Math.random().toString(36).substring(2, 12),
              details: "Verified foundational workplace collaboration skills.",
            },
          ],
        },
      ],
    };

    onAddCustomPassport(newPassport);
    setIsAddingNew(false);
    setFullName("");
    setHeadline("");
    setTargetRole("");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-50 text-blue-600">
              <Users className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Manage Member Profiles
              </h3>
              <p className="text-xs text-slate-500">
                Switch profiles, create custom passports, or reset demo state.
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

        {/* Existing Passports List */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Available Passports ({passports.length})
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {passports.map((p) => {
              const isSelected = p.id === activePassportId;
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    onSelectPassport(p.id);
                  }}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition ${
                    isSelected
                      ? "bg-blue-50 border-blue-400 shadow-2xs"
                      : "bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.avatar}
                      alt={p.fullName}
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs truncate">
                          {p.fullName}
                        </span>
                        <span className="font-mono text-[10px] text-blue-700 bg-blue-100/60 px-1.5 py-0.2 rounded">
                          {p.careerScore} cr
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {p.headline}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <span className="p-1 rounded-full bg-blue-600 text-white">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                    {onDeletePassport && passports.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePassport(p.id);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition"
                        title="Delete Profile"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Custom Profile Drawer / Toggle */}
        {!isAddingNew ? (
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setIsAddingNew(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Member Profile</span>
            </button>

            {!isConfirmingReset ? (
              <button
                onClick={() => setIsConfirmingReset(true)}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-rose-600 font-semibold">Confirm reset?</span>
                <button
                  onClick={() => {
                    onResetToDefault();
                    setIsConfirmingReset(false);
                    onClose();
                  }}
                  className="px-2 py-1 rounded-lg bg-rose-600 text-white font-bold text-[11px] hover:bg-rose-700 transition cursor-pointer"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setIsConfirmingReset(false)}
                  className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 text-[11px] hover:bg-slate-300 transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : (
          <form
            onSubmit={handleCreate}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
          >
            <div className="font-bold text-slate-900 text-xs">
              Create New Verified Member
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Patel"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Headline
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. AI Prompt Engineer & Researcher"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Target Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Machine Learning Engineer"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
