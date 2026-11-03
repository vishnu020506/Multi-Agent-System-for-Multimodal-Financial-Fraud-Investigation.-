import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Fingerprint, 
  ArrowRight, 
  CheckCircle2, 
  CreditCard, 
  Radio, 
  Server, 
  Terminal, 
  AlertTriangle,
  BadgeCheck
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { PRESET_USERS } from '../data/authProfiles';
import { playAlertChime } from '../utils/audioChime';

interface LoginPageProps {
  onLogin: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile>(PRESET_USERS[0]);
  const [authMode, setAuthMode] = useState<'PERSONAS' | 'CREDENTIALS' | 'SMARTCARD'>('PERSONAS');
  const [emailInput, setEmailInput] = useState(PRESET_USERS[0].email);
  const [passwordInput, setPasswordInput] = useState('••••••••••••••••');
  const [mfaCode, setMfaCode] = useState('849 201');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStage, setVerificationStage] = useState('');
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const handleSelectPreset = (user: UserProfile) => {
    setSelectedUser(user);
    setEmailInput(user.email);
  };

  const handleAuthenticate = () => {
    setIsVerifying(true);
    setVerificationStage('Verifying 256-Bit Cryptographic TLS Handshake...');

    setTimeout(() => {
      setVerificationStage(`Validating ${selectedUser.clearanceLevel.replace(/_/g, ' ')} Security Clearance...`);
    }, 400);

    setTimeout(() => {
      setVerificationStage('Synchronizing Multi-Agent Telemetry Enclave...');
    }, 800);

    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedSuccess(true);
      playAlertChime();
      setTimeout(() => {
        onLogin(selectedUser);
      }, 600);
    }, 1200);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'MLRO':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'SENIOR_INVESTIGATOR':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'LEAD_AUDITOR':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'COMPLIANCE_OFFICER':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-slate-200 selection:text-slate-900">
      {/* Institutional Top Bar - Clean White Background */}
      <div className="border-b border-slate-200 bg-white sticky top-0 z-20 px-4 sm:px-8 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700">
            <ShieldAlert className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 tracking-tight">FinCEN Sentinel</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-bold">
                FEDRAMP HIGH
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-mono">
              Federal Financial Crimes Surveillance & Multi-Agent Intelligence Enclave
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-emerald-700 font-semibold">ENCLAVE SECURE</span>
          </div>
          <span className="text-slate-300">•</span>
          <span>FIPS 140-3 COMPLIANT</span>
          <span className="text-slate-300">•</span>
          <span>TLS 1.3 AES-256</span>
        </div>
      </div>

      {/* Main Authentication Card - Clean White Background & Dulled Professional Colors */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10 my-6">
        <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Classification Header Banner - Light Dulled Tone */}
          <div className="bg-slate-100 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-slate-700 font-bold text-xs tracking-wider uppercase">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-500" />
              <span>Restricted FinCEN Law Enforcement Gateway • Authorized Personnel Only</span>
            </div>
            <span className="hidden sm:inline font-mono text-slate-500">FIN-NET TERMINAL #8819</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Column: System Dossier & Notice */}
            <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between space-y-6 text-slate-800">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-mono shadow-xs">
                  <Terminal className="w-3.5 h-3.5 text-slate-600" />
                  <span>SECURE ACCESS GATEWAY</span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                  Multimodal Fraud & AML Intelligence Platform
                </h1>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Real-time cross-modal forensic triangulation across high-frequency ledgers, altered PDF invoices, coercive communication logs, entity network cycles, and intercepted voice wiretaps.
                </p>

                {/* System Specs List */}
                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>6 Specialized Forensic Modality Agents</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Automated FinCEN Form 111 SAR Generation</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Cryptographic Evidence Chain of Custody</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Human-in-the-Loop Review & Clearance Gates</span>
                  </div>
                </div>
              </div>

              {/* Legal Warning Notice */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-600 space-y-1 shadow-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>18 U.S.C. § 1030 ADVISORY</span>
                </div>
                <p className="leading-relaxed text-[10px] text-slate-600">
                  Access to this system is restricted to authorized financial crimes investigators. All transactions, queries, and evidence modifications are cryptographically signed and audited.
                </p>
              </div>
            </div>

            {/* Right Column: Authentication Console */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white text-slate-900">
              {/* Auth Mode Tabs */}
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-slate-700" />
                    <span>Analyst Credential Verification</span>
                  </h2>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
                    <button
                      onClick={() => setAuthMode('PERSONAS')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                        authMode === 'PERSONAS' 
                          ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Dossier Profiles
                    </button>
                    <button
                      onClick={() => setAuthMode('CREDENTIALS')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                        authMode === 'CREDENTIALS' 
                          ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Password & 2FA
                    </button>
                    <button
                      onClick={() => setAuthMode('SMARTCARD')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                        authMode === 'SMARTCARD' 
                          ? 'bg-white text-slate-900 font-bold shadow-xs border border-slate-200' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      CAC / PIV
                    </button>
                  </div>
                </div>

                {/* Mode 1: Preset Investigator Personas */}
                {authMode === 'PERSONAS' && (
                  <div className="space-y-3">
                    <div className="text-[11px] text-slate-600 mb-2">
                      Select an authorized investigator clearance profile to initialize your active surveillance session:
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {PRESET_USERS.map((user) => {
                        const isSelected = selectedUser.id === user.id;
                        return (
                          <button
                            key={user.id}
                            onClick={() => handleSelectPreset(user)}
                            className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-slate-50 border-2 border-slate-800 shadow-xs ring-1 ring-slate-400'
                                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-1">
                              <span className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.5 rounded border ${getRoleBadge(user.role)}`}>
                                {user.role.replace(/_/g, ' ')}
                              </span>
                              <span className="text-[10px] font-mono text-slate-500 font-medium">
                                {user.clearanceLevel === 'LEVEL_4_TOP_SECRET' ? 'TS/SCI' : 'SECRET'}
                              </span>
                            </div>

                            <div className="font-bold text-slate-900 text-xs mt-1">
                              {user.name}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate mt-0.5">
                              {user.roleTitle}
                            </div>

                            <div className="text-[9px] font-mono text-slate-500 mt-2 pt-1 border-t border-slate-100 flex items-center justify-between">
                              <span>Badge: {user.badgeNumber}</span>
                              {isSelected && <BadgeCheck className="w-3.5 h-3.5 text-slate-900" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mode 2: Manual Credentials Form */}
                {authMode === 'CREDENTIALS' && (
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                        Government / Agency Email
                      </label>
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-mono shadow-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-mono text-slate-600 mb-1 font-semibold">
                        Encrypted Security Passphrase
                      </label>
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-mono shadow-xs"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-mono text-slate-600 font-semibold">
                          Two-Factor Hardware Token (TOTP)
                        </label>
                        <span className="text-[10px] text-emerald-700 font-mono font-bold">SYNCED</span>
                      </div>
                      <input
                        type="text"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono tracking-widest focus:outline-none focus:border-slate-500 font-bold shadow-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Mode 3: Smartcard / CAC */}
                {authMode === 'SMARTCARD' && (
                  <div className="py-6 text-center space-y-4 bg-slate-50 rounded-xl border border-slate-200 p-4">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 shadow-xs">
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">CAC / PIV Smart Card Detected</h4>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Cryptographic certificate: <span className="font-mono text-slate-800 font-bold">DOD-ID-8829-JENKINS-S</span>
                      </p>
                      <p className="text-[10px] text-emerald-700 font-mono font-semibold mt-0.5">
                        Pin Verified • Certificate Revocation List (CRL) Valid
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Active Profile Summary */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                    {selectedUser.avatarInitials}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{selectedUser.name}</div>
                    <div className="text-[10px] text-slate-500">{selectedUser.department.split('(')[0]}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono font-bold text-slate-800">
                    {selectedUser.clearanceLevel === 'LEVEL_4_TOP_SECRET' ? 'TOP SECRET // SCI' : 'SECRET'}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono">MFA ACTIVE</div>
                </div>
              </div>

              {/* Verification Progress Message */}
              {isVerifying && (
                <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-800 flex items-center gap-2 font-mono">
                  <Radio className="w-4 h-4 text-slate-600 animate-spin" />
                  <span>{verificationStage}</span>
                </div>
              )}

              {/* Success Banner */}
              {verifiedSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-mono">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Authentication Successful. Initializing Investigation Workspace...</span>
                </div>
              )}

              {/* Main Action Submit Button - Dull Muted Slate Color */}
              <button
                id="submit-login-btn"
                onClick={handleAuthenticate}
                disabled={isVerifying || verifiedSuccess}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                  verifiedSuccess
                    ? 'bg-emerald-700 text-white'
                    : isVerifying
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed border border-slate-300'
                    : 'bg-slate-900 hover:bg-slate-800 text-white border border-slate-900'
                }`}
              >
                {verifiedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Clearance Granted • Entering Platform</span>
                  </>
                ) : isVerifying ? (
                  <>
                    <Server className="w-4 h-4 animate-spin text-slate-500" />
                    <span>Verifying Cryptographic Tokens...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authenticate & Access Investigation Terminal</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Bottom Bar */}
      <div className="border-t border-slate-200 bg-white px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-mono relative z-10 gap-2">
        <div className="flex items-center gap-2">
          <span>FinCEN Joint Task Force • Enforcement Division</span>
          <span>•</span>
          <span>Build: commit 8f3b2a1</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Security Contact: soc@fincen-intel.gov</span>
          <span>•</span>
          <span>System Status: ALL NODES OPERATIONAL</span>
        </div>
      </div>
    </div>
  );
};
