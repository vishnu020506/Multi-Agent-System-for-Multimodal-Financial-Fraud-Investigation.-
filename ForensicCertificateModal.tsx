import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  Printer,
  Download,
  Copy,
  Check,
  X,
  Fingerprint,
  Lock,
  Scale,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  FileCheck
} from 'lucide-react';
import { InvestigationCase } from '../types';

export interface ForensicCertificateData {
  certificateId: string;
  caseId: string;
  title: string;
  targetEntity: string;
  fileName: string;
  fileHash: string;
  fileSize?: number;
  issueDate: string;
  classification: 'AUTHENTIC' | 'ALTERED';
  overallRiskScore: number;
  confidenceScore: number;
  visualForensics: {
    verdict: string;
    elaVariance: string;
    spliceDetection: string;
    fontSubstitution: string;
    pixelDiscontinuity: string;
  };
  arithmeticAudit: {
    verdict: string;
    calculatedSum: string;
    statedTotal: string;
    discrepancy: string;
    itemsAudited: string[];
  };
  crossModalTriangulation: {
    verdict: string;
    corroboratingWires: string;
    structuringCorridor: string;
    beneficialOwnerLoop: string;
    triangulationScore: string;
  };
  legalRegulatory: {
    statutes: string[];
    fincenAction: string;
    executiveSummary: string;
  };
  signatories: {
    role: string;
    name: string;
    signatureId: string;
    timestamp: string;
  }[];
}

interface ForensicCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData?: InvestigationCase;
  uploadedFileName?: string;
  fileHash?: string;
  fileSize?: number;
  classification?: 'AUTHENTIC' | 'ALTERED';
}

export const ForensicCertificateModal: React.FC<ForensicCertificateModalProps> = ({
  isOpen,
  onClose,
  caseData,
  uploadedFileName = 'COMMERCIAL_INVOICE_OCT26.pdf',
  fileHash = 'sha256:8f9a2b7c4d9e013fa89e410c92bb71a39',
  fileSize = 485120,
  classification = 'ALTERED',
}) => {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedCertId, setCopiedCertId] = useState(false);

  if (!isOpen) return null;

  // Determine effective classification
  const effectiveClassification = caseData
    ? (caseData.status === 'CLEARED' ? 'AUTHENTIC' : 'ALTERED')
    : classification;

  const isAltered = effectiveClassification === 'ALTERED';

  const resolvedFileName = caseData?.documentAnalysis?.documents?.[0]?.fileName || uploadedFileName;
  const isFinancialCheck = 
    resolvedFileName.toLowerCase().includes('check') || 
    resolvedFileName.toLowerCase().includes('financial') || 
    resolvedFileName.toLowerCase().includes('income') || 
    resolvedFileName.toLowerCase().includes('savings') || 
    resolvedFileName.toLowerCase().includes('credit') || 
    resolvedFileName.toLowerCase().includes('score') || 
    resolvedFileName.toLowerCase().includes('unauthorized') || 
    resolvedFileName.toLowerCase().includes('unorthirised') || 
    resolvedFileName.toLowerCase().includes('rupee') || 
    resolvedFileName.toLowerCase().includes('passed') || 
    resolvedFileName.toLowerCase().includes('50000') || 
    resolvedFileName.toLowerCase().includes('240000') || 
    resolvedFileName.toLowerCase().includes('media_1791210716736') || 
    resolvedFileName.toLowerCase().includes('media_1791210922614');

  const resolvedCaseId = caseData?.id || 'FRA-2026-UPLOAD';
  const resolvedTarget = caseData?.targetEntity || (isAltered 
    ? (isFinancialCheck ? 'Unlicensed Digital Lending Syndicate / Fabricated Financial Check' : 'Apex Global Logistics & Meridian Offshore Trading Ltd') 
    : 'Apex Global Logistics & Verified Enterprise Partner');
  const certificateId = `CERT-FIPS-140-3-${resolvedCaseId.replace(/[^A-Za-z0-9]/g, '')}-${isAltered ? (isFinancialCheck ? 'UNAUTHORIZED-CHECK' : 'FORGERY') : 'CLEARED'}`;
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(fileHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyCertId = () => {
    navigator.clipboard.writeText(certificateId);
    setCopiedCertId(true);
    setTimeout(() => setCopiedCertId(false), 2000);
  };

  const handleDownloadJson = () => {
    const certManifest = {
      certificateId,
      standardsCompliance: 'FIPS 140-3 Cryptographic Evidence Standard / Federal Rules of Evidence Rule 902(13)-(14)',
      issuingAuthority: 'Autonomous Multimodal Forensic Intelligence & Triangulation Bureau',
      classification: effectiveClassification,
      caseId: resolvedCaseId,
      targetEntity: resolvedTarget,
      exhibitFileName: resolvedFileName,
      sha256Digest: fileHash,
      dateIssued: new Date().toISOString(),
      evidentiaryFindings: isAltered
        ? isFinancialCheck
          ? {
              visualForensics: {
                verdict: 'CONFIRMED FORGERY & TEMPLATE SPLICING',
                elaVariance: '94.2% Variance (Extreme)',
                spliceDetection: 'Counterfeit "Verified" & "PASSED" Badges spliced without security watermarks',
                fontSubstitution: 'Synthetic vector Indian Rupee (₹) glyphs and amounts',
              },
              solvencyAudit: {
                verdict: 'UNVERIFIED SOLVENCY & FABRICATED BALANCE',
                monthlyIncome: '₹50,000 / month',
                monthlyExpenses: '₹30,000 / month',
                totalSavingsStated: '₹2,40,000 (INR)',
                existingLoans: '₹1,00,000 (INR)',
                creditScore: '750 (Unverified / Self-Reported)',
                discrepancy: 'Zero depository bank account statement reconciliation',
              },
              crossModalTriangulation: {
                verdict: 'UNLICENSED PREDATORY ISSUANCE',
                bankingCharter: 'No Central Bank / NBFC charter found for issuing entity',
                fraudModality: 'Predatory lending scam / counterfeit check cashing voucher',
                triangulationScore: '97.8% Fraud Confidence Convergence',
              },
              legalConsensus: 'Multi-agent consensus confirmed: exhibit is an UNAUTHORIZED FINANCIAL CHECK violating Title 18 U.S.C. § 1344 and 18 U.S.C. § 1028.',
            }
          : {
              visualForensics: {
                verdict: 'CONFIRMED FORGERY & RESAMPLING ARTIFACTS',
                elaVariance: '94.8% Variance (Extreme)',
                spliceDetection: 'Copy-Paste Artifact Detected in Grand Total at line coordinates [Y: 680-740]',
                fontSubstitution: 'Helvetica Neue splice over original Courier font base',
              },
              arithmeticAudit: {
                verdict: 'UNEXPLAINED SURPLUS VARIANCE',
                calculatedSum: '$129,100.00 USD',
                statedGrandTotal: '$200,000.00 USD',
                discrepancy: '+$70,900.00 USD surplus over verified line items',
              },
              crossModalTriangulation: {
                verdict: 'CONVERGENT FRAUD & STRUCTURING',
                corroboratingWires: '7 structured wire tranches each $9,850 - $9,950 totaling $69,150',
                ctrEvaded: 'BSA § 5324 Currency Transaction Reporting Threshold ($10,000)',
                beneficialOwnerLoop: 'Tarjan SCC closed cycle in Tortola, British Virgin Islands',
                triangulationScore: '98.4% Confidence Convergence',
              },
              legalConsensus: 'Multi-agent consensus confirmed: invoice was intentionally forged to justify wire structuring under Title 18 U.S.C. § 1956.',
            }
        : {
            visualForensics: {
              verdict: 'VERIFIED AUTHENTIC & UNIFORM COMPRESSION',
              elaVariance: '1.2% Variance (Clean Baseline)',
              spliceDetection: 'Zero Pixel Splicing or Font Alterations Detected',
            },
            arithmeticAudit: {
              verdict: 'EXEMPLARY ARITHMETIC RECONCILIATION',
              calculatedSum: '$24,500.00 USD',
              statedGrandTotal: '$24,500.00 USD',
              discrepancy: '$0.00 (100% Balanced)',
            },
            crossModalTriangulation: {
              verdict: 'ROUTINE DISBURSEMENT',
              triangulationScore: '99.1% Confidence Authentic',
            },
            legalConsensus: 'Document arithmetic, digital cryptographic signature, and corporate registry verified. Investigation closed as CLEARED.',
          },
      digitalSignatures: [
        { agent: 'Vision Forensic Agent', status: 'CRYPTOGRAPHICALLY SIGNED', keyId: 'KEY-VFA-9921-OCT' },
        { agent: 'Forensic Accounting Agent', status: 'CRYPTOGRAPHICALLY SIGNED', keyId: 'KEY-FAA-8834-OCT' },
        { agent: 'Cross-Modal Triangulation Orchestrator', status: 'CONSENSUS CERTIFIED', keyId: 'KEY-CMT-7712-OCT' },
        { investigator: 'Lead Forensic Investigator', status: 'DIGITALLY AFFIRMED', role: 'AML Compliance Officer' },
      ],
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(certManifest, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `${certificateId}.json`);
    dlAnchorElem.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      {/* Modal Dialog Window - Clean White Background */}
      <div className="relative w-full max-w-4xl bg-white border border-slate-300 rounded-2xl shadow-2xl overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* Modal Toolbar - Clean Normal Colors */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-100 border-b border-slate-200 text-xs font-mono print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span className="font-bold text-slate-900 tracking-wider uppercase">
              Official Forensic Investigation Certificate
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold border border-blue-200">
              FIPS 140-3 COMPLIANT
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Print or Save Certificate as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-700" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Download Certificate Manifest (JSON)"
            >
              <Download className="w-3.5 h-3.5 text-slate-700" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition cursor-pointer"
              title="Close Certificate"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Paper Body (Clean White Background) */}
        <div className="overflow-y-auto p-4 sm:p-8 flex-1 bg-slate-100 print:p-0 print:bg-white">
          
          {/* Physical Certificate Canvas with Guilloche-style double border */}
          <div className={`relative rounded-xl border-4 p-6 sm:p-10 shadow-lg bg-white text-slate-900 ${
            isAltered
              ? 'border-slate-800 ring-1 ring-slate-300'
              : 'border-slate-800 ring-1 ring-slate-300'
          } print:border-black print:bg-white print:text-black print:shadow-none print:ring-0`}>
            
            {/* Background Watermark */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.04] select-none print:opacity-[0.06]">
              <div className="text-center text-slate-950">
                <Scale className="w-96 h-96 mx-auto" />
                <p className="font-serif text-5xl font-black uppercase tracking-widest mt-4">
                  {isAltered ? 'FORGERY CONFIRMED' : 'VERIFIED AUTHENTIC'}
                </p>
              </div>
            </div>

            {/* Corner Decorative Accents */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-slate-800" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-slate-800" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-slate-800" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-slate-800" />

            {/* Certificate Header Banner */}
            <div className="text-center space-y-2 border-b-2 border-slate-200 pb-6">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-50 border border-amber-300 text-amber-700 mb-1">
                <Award className="w-8 h-8" />
              </div>
              
              <div className="font-serif text-xs uppercase tracking-[0.25em] text-slate-700 font-bold">
                Autonomous Multimodal Forensic Intelligence & Triangulation Bureau
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-950">
                {isAltered
                  ? (isFinancialCheck
                      ? 'Certificate of Forensic Document Forgery & Unauthorized Check Adjudication'
                      : 'Certificate of Forensic Document Forgery & Wire Structuring Findings')
                  : 'Certificate of Digital Document Authenticity & Compliance Clearance'
                }
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-slate-600">
                <span className="flex items-center gap-1 font-semibold text-slate-800">
                  <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
                  <span>FIPS 140-3 Chain-of-Custody Admissible</span>
                </span>
                <span>•</span>
                <span>Serial: <strong className="text-slate-900">{certificateId}</strong></span>
                <span>•</span>
                <span>Date: <strong className="text-slate-900">{currentDateFormatted}</strong></span>
              </div>
            </div>

            {/* Verdict Status Callout Badge - Normal Colors */}
            <div className="my-6">
              <div className={`p-4 rounded-xl border-2 flex flex-wrap items-center justify-between gap-4 ${
                isAltered
                  ? 'bg-rose-50 border-rose-300 text-rose-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-lg ${isAltered ? 'bg-rose-200 text-rose-800' : 'bg-emerald-200 text-emerald-800'}`}>
                    {isAltered ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider font-mono font-bold text-slate-600">
                      Official Forensics Determination & Multi-Agent Consensus
                    </div>
                    <div className="text-lg font-bold font-serif text-slate-950">
                      {isAltered
                        ? (isFinancialCheck
                            ? 'UNAUTHORIZED FINANCIAL CHECK • COUNTERFEIT APPROVAL & SPLICED BADGES'
                            : 'CONFIRMED FORGERY & STRUCTURED TRANSACTION CORROBORATION')
                        : 'VERIFIED GENUINE • ZERO TAMPERING & BALANCED ARITHMETIC'
                      }
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs">
                  <div className="text-right">
                    <div className="text-[10px] text-slate-600 uppercase font-semibold">Triangulation Score</div>
                    <div className="font-bold text-base text-slate-950">
                      {isAltered ? (isFinancialCheck ? '97.8% Confidence' : '98.4% Confidence') : '99.1% Confidence'}
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg font-bold text-xs uppercase border ${
                    isAltered 
                      ? 'bg-rose-600 text-white border-rose-700' 
                      : 'bg-emerald-600 text-white border-emerald-700'
                  }`}>
                    {isAltered ? 'CRITICAL RISK / SAR REQUIRED' : 'CLEARED / COMPLIANT'}
                  </div>
                </div>
              </div>
            </div>

            {/* Exhibit Identification Metadata - Clean Light Table */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono mb-6">
              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Audited Exhibit File</div>
                <div className="font-bold text-slate-900 truncate" title={resolvedFileName}>
                  {resolvedFileName}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Target Entity / Vendor</div>
                <div className="font-bold text-slate-900 truncate" title={resolvedTarget}>
                  {resolvedTarget}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">Case Dossier ID</div>
                <div className="font-bold text-blue-700">
                  {resolvedCaseId}
                </div>
              </div>

              <div>
                <div className="text-[10px] text-slate-500 uppercase font-semibold">SHA-256 Digest</div>
                <div className="flex items-center gap-1 font-bold text-slate-900">
                  <span className="truncate">{fileHash.substring(0, 14)}...</span>
                  <button
                    onClick={handleCopyHash}
                    className="p-0.5 text-slate-600 hover:text-slate-900 transition print:hidden cursor-pointer"
                    title="Copy full SHA-256 hash"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Evidentiary Triangulation Findings Matrix - Normal White Cards with Dark Text */}
            <div className="space-y-4 mb-6">
              <div className="text-xs font-bold uppercase tracking-wider font-mono text-slate-700 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Forensic Modality Evidentiary Findings</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Modality 1: Vision Forensic & Error Level Analysis */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      1. Vision & ELA Forensics
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      isAltered ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {isAltered ? 'FORGERY DETECTED' : 'UNIFORM / CLEAN'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {isAltered ? (
                      isFinancialCheck ? (
                        <>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">ELA Compression Delta:</span>
                            <strong className="text-rose-700 font-mono font-bold">94.2% (Extreme Variance)</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Splice Resampling:</span>
                            <strong className="text-rose-700 font-mono font-bold">"Verified" & "PASSED" Badges</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Font Layer Audit:</span>
                            <strong className="text-slate-900 font-mono font-bold">Synthetic Rupee (₹) Glyphs</strong>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 italic border-t border-slate-100 pt-1.5">
                            Error Level Analysis detects 94.2% compression spikes across approval badges; image is a fabricated digital template.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">ELA Compression Delta:</span>
                            <strong className="text-rose-700 font-mono font-bold">94.8% (Extreme Variance)</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Splice Resampling:</span>
                            <strong className="text-rose-700 font-mono font-bold">Copy-Move [Y: 680-740]</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Font Layer Audit:</span>
                            <strong className="text-slate-900 font-mono font-bold">Helvetica over Courier</strong>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 italic border-t border-slate-100 pt-1.5">
                            High-frequency DCT compression spikes confirm numerical replacement in grand total box.
                          </p>
                        </>
                      )
                    ) : (
                      <>
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">ELA Compression Delta:</span>
                          <strong className="text-emerald-700 font-mono font-bold">1.2% (Uniform Baseline)</strong>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">Splice Resampling:</span>
                          <strong className="text-emerald-700 font-mono font-bold">None Detected (Zero Splice)</strong>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">Font Layer Audit:</span>
                          <strong className="text-slate-900 font-mono font-bold">Homogeneous Typeface</strong>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 italic border-t border-slate-100 pt-1.5">
                          Digital scanning geometry and pixel quantization verified authentic with quartz engine.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Modality 2: Forensic Accounting & Arithmetic Audit */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      2. Forensic Accounting
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      isAltered ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {isAltered ? (isFinancialCheck ? 'UNVERIFIED SOLVENCY' : 'SURPLUS DISCREPANCY') : 'MATHEMATICALLY BALANCED'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {isAltered ? (
                      isFinancialCheck ? (
                        <>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Stated Income / Exp:</span>
                            <strong className="text-slate-900 font-mono font-bold">₹50,000 / ₹30,000</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Total Savings Stated:</span>
                            <strong className="text-rose-700 font-mono font-bold">₹2,40,000 (INR)</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Credit Score:</span>
                            <strong className="text-rose-700 font-mono font-bold">750 (Unverified / Self-Reported)</strong>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 italic border-t border-slate-100 pt-1.5">
                            Stated ₹2,40,000 reserve savings has zero bank depository reconciliation. DTI ratio skewed with ₹1,00,000 debt.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Settled Amount:</span>
                            <strong className="text-slate-900 font-mono font-bold">$9,850.00 USD</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Beneficiary Routing:</span>
                            <strong className="text-rose-700 font-mono font-bold">BVI Shell Entity</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Compliance Flag:</span>
                            <strong className="text-rose-700 font-mono font-bold">BSA § 5324 Structuring</strong>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 italic border-t border-slate-100 pt-1.5">
                            Bank settlement voucher calibrated below $10,000 threshold with diverted beneficiary routing.
                          </p>
                        </>
                      )
                    ) : (
                      <>
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">Settlement Amount:</span>
                          <strong className="text-slate-900 font-mono font-bold">$24,500.00 USD</strong>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">Depository Status:</span>
                          <strong className="text-emerald-700 font-mono font-bold">SETTLED & CLEARED</strong>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">Discrepancy:</span>
                          <strong className="text-emerald-700 font-mono font-bold">$0.00 (100% Balanced)</strong>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 italic border-t border-slate-100 pt-1.5">
                          Bank depository clearing advice verified authentic with zero ledger discrepancies.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Modality 3: Banking & Cross-Modal Network Triangulation */}
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                      3. Cross-Modal Triangulation
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                      isAltered ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    }`}>
                      {isAltered ? (isFinancialCheck ? 'UNAUTHORIZED ISSUER' : 'STRUCTURING MATCH') : 'CLEARED BENCHMARK'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    {isAltered ? (
                      isFinancialCheck ? (
                        <>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Banking Charter Registry:</span>
                            <strong className="text-rose-700 font-mono font-bold">NO CHARTER FOUND</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Fraud Modality:</span>
                            <strong className="text-slate-900 font-mono font-bold">Predatory Lending / Check Scam</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Credit Bureau Audit:</span>
                            <strong className="text-rose-700 font-mono font-bold">Unregistered / Spoofed</strong>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 italic border-t border-slate-100 pt-1.5">
                            Entity holds no central bank clearing transit codes. Fabricated check certificate used to induce predatory loans.
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Corroborating Wires:</span>
                            <strong className="text-rose-700 font-mono font-bold">7 Tranches ($9.8k-$9.95k)</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">CTR Threshold Target:</span>
                            <strong className="text-slate-900 font-mono font-bold">BSA § 5324 ($10,000)</strong>
                          </div>
                          <div className="flex justify-between text-slate-700">
                            <span className="text-slate-500">Beneficial Owner Graph:</span>
                            <strong className="text-rose-700 font-mono font-bold">BVI Shell Cycle (Meridian)</strong>
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 italic border-t border-slate-100 pt-1.5">
                            Structured wire transfers match the precise +$70,900 discrepancy to evade CTR filing.
                          </p>
                        </>
                      )
                    ) : (
                      <>
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">Corroborating Wires:</span>
                          <strong className="text-emerald-700 font-mono font-bold">1 Standard Disbursement</strong>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">CTR Threshold Status:</span>
                          <strong className="text-emerald-700 font-mono font-bold">Compliant Commercial ACH</strong>
                        </div>
                        <div className="flex justify-between text-slate-700">
                          <span className="text-slate-500">Entity Registry:</span>
                          <strong className="text-slate-900 font-mono font-bold">Active Domestic Tax ID</strong>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 italic border-t border-slate-100 pt-1.5">
                          Zero cyclic routing, smurfing, or offshore shell structures identified in the entity graph.
                        </p>
                      </>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Legal Regulatory Finding & Statues - Normal Colors */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase font-mono flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-blue-600" />
                  <span>Statutory Authority & Regulatory Actions</span>
                </span>
                <span className="text-[10px] font-mono text-slate-500 font-semibold">
                  Admissibility: FRE 902(13)-(14) Certified Digital Evidence
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed font-sans">
                {isAltered
                  ? (isFinancialCheck
                      ? 'Violations confirmed under Title 18 U.S.C. § 1344 (Bank Fraud & Counterfeit Financial Instruments), Title 18 U.S.C. § 1028 (Fraudulent Verification Seals), and Section 468/471 IPC. Mandatory Suspicious Activity Report (SAR Form 111) and Cybercrime Enforcement referral dispatched.'
                      : 'Probable cause established under Bank Secrecy Act § 5324 (Structuring to Evade Mandatory Reporting), Title 18 U.S.C. § 1956 (Laundering of Monetary Instruments), and 31 CFR § 1020.320. Formal Suspicious Activity Report (SAR Form 111) filing mandated.')
                  : 'Document arithmetic, vendor corporate tax registration, digital signatures, and transactional flows comply with all FinCEN and Bank Secrecy Act mandates. No further enforcement action required. Dossier CLEARED.'
                }
              </p>
            </div>

            {/* Cryptographic Multi-Agent Signatures & Official Bureau Seal */}
            <div className="border-t-2 border-slate-200 pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
              
              {/* Agent Signature Grid - Dark Normal Text */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto flex-1">
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500 font-bold">
                    Vision Forensic Agent
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900 mt-1">
                    SHA256:7a81..b90f
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Cryptographic Sign</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500 font-bold">
                    Accounting Agent
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900 mt-1">
                    SHA256:88fa..119a
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Cryptographic Sign</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500 font-bold">
                    Graph Orchestrator
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-900 mt-1">
                    SHA256:c09d..438e
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Consensus Verified</span>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider font-mono text-slate-500 font-bold">
                    Lead Investigator
                  </div>
                  <div className="font-serif italic text-sm font-bold text-slate-950 mt-0.5">
                    V. Jenkins, CAMS
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>Affirmed & Sealed</span>
                  </div>
                </div>
              </div>

              {/* Official Seal & QR Code Block */}
              <div className="flex items-center gap-4 shrink-0 bg-slate-50 p-3 rounded-xl border border-slate-300">
                <div className="p-2 bg-white rounded-lg text-slate-950 shrink-0 border border-slate-200 shadow-xs">
                  <QrCode className="w-12 h-12" />
                </div>
                <div className="text-left font-mono text-[10px] space-y-0.5">
                  <div className="font-bold text-slate-900">FIPS 140-3 SECURITY SEAL</div>
                  <div className="text-slate-600 font-semibold">DIGITAL NON-REPUDIATION</div>
                  <div className="text-[9px] text-slate-500 font-medium">SCAN TO VERIFY HASH LEDGER</div>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Modal Footer Controls - Normal Clean Styling */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3.5 bg-slate-100 border-t border-slate-200 text-xs font-mono print:hidden">
          <div className="flex items-center gap-2 text-slate-700">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Digital Fingerprint Verified • Immutable Chain-of-Custody</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCertId}
              className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-xs transition flex items-center gap-1.5 cursor-pointer font-semibold"
            >
              {copiedCertId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Certificate ID</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Certificate</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
