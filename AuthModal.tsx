import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Lock, 
  User, 
  CheckCircle2, 
  Fingerprint, 
  Sparkles, 
  X, 
  ChevronRight, 
  Building2, 
  FileCheck2,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { PRESET_USERS } from '../data/authProfiles';

interface AuthModalProps {
  isOpen: boolean;
  currentUser: UserProfile | null;
  onSelectUser: (user: UserProfile) => void;
  onLogout: () => void;
  onClose?: () => void;
  isMandatory?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  currentUser,
  onSelectUser,
  onLogout,
  onClose,
  isMandatory = false,
}) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile>(currentUser || PRESET_USERS[0]);
  const [emailInput, setEmailInput] = useState(currentUser?.email || PRESET_USERS[0].email);
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [mfaCode, setMfaCode] = useState('849 201');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'PROFILES' | 'CREDENTIALS'>('PROFILES');

  if (!isOpen) return null;

  const handlePickPreset = (user: UserProfile) => {
    setSelectedUser(user);
    setEmailInput(user.email);
  };

  const handleAuthenticate = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      setTimeout(() => {
        setVerifiedSuccess(false);
        onSelectUser(selectedUser);
        if (onClose) onClose();
      }, 700);
    }, 600);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'MLRO':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'SENIOR_INVESTIGATOR':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'LEAD_AUDITOR':
        return 'bg-cyan-950 text-cyan-300 border-cyan-800';
      case 'COMPLIANCE_OFFICER':
        return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Security Classification Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 px-4 py-1.5 flex items-center justify-between text-slate-950 font-bold text-[11px] tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Restricted Federal Financial Intelligence Network (FIN-NET Level 4)</span>
          </div>
          <span>256-Bit TLS MFA</span>
        </div>

        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Fingerprint className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Forensic Analyst Authentication & Clearance
              </h2>
              <p className="text-xs text-slate-400">
                Verify institutional identity and role-based cryptographic clearance
              </p>
            </div>
          </div>
          {!isMandatory && onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Switch Mode Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 pt-2">
          <button
            onClick={() => setActiveTab('PROFILES')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'PROFILES'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            One-Click Verified Roles (Instant Switch)
          </button>
          <button
            onClick={() => setActiveTab('CREDENTIALS')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition ${
              activeTab === 'CREDENTIALS'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-300'
            }`}
          >
            Manual Credentials & MFA Token
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {activeTab === 'PROFILES' ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>Select an authorized investigator profile for this session:</span>
                <span className="text-[11px] text-amber-400 font-mono">4 Verified Identities</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PRESET_USERS.map((user) => {
                  const isCurrent = selectedUser.id === user.id;
                  return (
                    <div
                      key={user.id}
                      onClick={() => handlePickPreset(user)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isCurrent
                          ? 'bg-amber-500/10 border-amber-400/80 shadow-lg shadow-amber-500/5 ring-1 ring-amber-400/50'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 font-bold flex items-center justify-center text-xs shadow-sm">
                            {user.avatarInitials}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-100">{user.name}</div>
                            <div className="text-[10px] text-slate-400">{user.email}</div>
                          </div>
                        </div>
                        {isCurrent && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap my-1.5">
                        <span className={`text-[9px] px-2 py-0.5 rounded font-semibold border ${getRoleBadge(user.role)}`}>
                          {user.roleTitle}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {user.badgeNumber}
                        </span>
                      </div>

                      <div className="text-[10px] text-slate-400 truncate mt-1">
                        {user.department}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Clearance Permissions Matrix */}
              <div className="mt-4 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Security Clearance: {selectedUser.clearanceLevel.replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400">MFA ENFORCED</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">SAR Filing</div>
                    <div className="font-bold text-slate-200 mt-0.5">
                      {selectedUser.role === 'MLRO' || selectedUser.role === 'SENIOR_INVESTIGATOR' ? 'Authorized (FinCEN 111)' : 'Read-Only'}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">AI Model Tuning</div>
                    <div className="font-bold text-slate-200 mt-0.5">
                      {selectedUser.role === 'LEAD_AUDITOR' || selectedUser.role === 'SENIOR_INVESTIGATOR' ? 'Full Control' : 'Standard'}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">Wiretap Forensics</div>
                    <div className="font-bold text-slate-200 mt-0.5">Title III Cleared</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-slate-400">Compliance Sign-off</div>
                    <div className="font-bold text-slate-200 mt-0.5">
                      {selectedUser.role === 'MLRO' ? 'Executive Tier 3' : selectedUser.role === 'SENIOR_INVESTIGATOR' ? 'Investigator Tier 1' : 'Review Tier 2'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Institutional Identity / Corporate Email
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                    placeholder="investigator@agency.gov"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Cryptographic Token / Access Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Rolling 2FA / Hardware YubiKey OTP
                  </label>
                  <button
                    onClick={() => setMfaCode(`${Math.floor(100 + Math.random() * 900)} ${Math.floor(100 + Math.random() * 900)}`)}
                    className="text-[10px] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    Generate Code
                  </button>
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={mfaCode}
                    onChange={(e) => setMfaCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-mono tracking-widest text-amber-300 focus:outline-none focus:border-amber-400"
                    placeholder="849 201"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          {currentUser && (
            <button
              onClick={onLogout}
              className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold transition"
            >
              Lock Terminal & Logout
            </button>
          )}

          <div className="flex items-center gap-3 ml-auto">
            {!isMandatory && onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleAuthenticate}
              disabled={isVerifying}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/10 transition-all disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : verifiedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Clearance Granted!</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Enter Investigation System</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
