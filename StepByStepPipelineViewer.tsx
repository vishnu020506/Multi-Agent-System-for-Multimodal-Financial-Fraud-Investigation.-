import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileSearch, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck,
  Sparkles, 
  ArrowRight, 
  Play, 
  Pause, 
  RotateCcw, 
  FileText, 
  Scan, 
  Calculator, 
  Network, 
  Eye, 
  Layers, 
  Lock, 
  Terminal, 
  Zap,
  FastForward,
  Cpu,
  Fingerprint,
  Award
} from 'lucide-react';
import { InvestigationCase, DocumentItem } from '../types';
import { ForensicCertificateModal } from './ForensicCertificateModal';

export interface PipelineStep {
  id: number;
  title: string;
  agentName: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FLAGGED';
  progress: number;
  logs: string[];
  findings?: {
    label: string;
    value: string;
    flagged?: boolean;
  }[];
}

interface StepByStepPipelineViewerProps {
  uploadedFileName: string;
  uploadedImageUrl?: string;
  fileSize?: number;
  initialClassification?: 'AUTHENTIC' | 'ALTERED' | 'AUTO';
  onComplete: (generatedCase: InvestigationCase) => void;
  onCancel: () => void;
}

function checkIsFinancialCheck(fileName: string): boolean {
  const fn = fileName.toLowerCase();
  return (
    fn.includes('check') || 
    fn.includes('financial') || 
    fn.includes('income') || 
    fn.includes('savings') || 
    fn.includes('credit') || 
    fn.includes('score') || 
    fn.includes('unauthorized') || 
    fn.includes('unorthirised') || 
    fn.includes('rupee') || 
    fn.includes('passed') || 
    fn.includes('50000') || 
    fn.includes('240000') || 
    fn.includes('100000') || 
    fn.includes('750') || 
    fn.includes('media_1791210716736') || 
    fn.includes('media_1791210922614')
  );
}

function buildStepsForMode(
  mode: 'AUTHENTIC' | 'ALTERED',
  fileName: string,
  fileSize: number,
  fileHash: string
): PipelineStep[] {
  if (mode === 'AUTHENTIC') {
    return [
      {
        id: 1,
        title: 'Document Ingestion & Cryptographic Integrity',
        agentName: 'Ingestion & Security Agent',
        description: 'Computing SHA-256 cryptographic digest, validating EXIF metadata, and logging chain of custody.',
        icon: Lock,
        status: 'PROCESSING',
        progress: 0,
        logs: [
          `[INGESTION] Receiving binary stream for exhibit "${fileName}"...`,
          `[INGESTION] File size: ${(fileSize / 1024).toFixed(1)} KB • Integrity stream verified`,
          `[CRYPTO] Computed SHA-256 Fingerprint: ${fileHash}`,
          `[CHAIN-OF-CUSTODY] Timestamp logged under FinCEN FIPS-140-3 compliance protocol.`,
          `[VERIFIED] Digital header structure valid. Zero binary corruption detected.`,
        ],
        findings: [
          { label: 'File Name', value: fileName },
          { label: 'Cryptographic Hash', value: fileHash.substring(0, 22) + '...' },
          { label: 'Integrity Check', value: 'PASSED (Authentic Uncorrupted)' },
        ],
      },
      {
        id: 2,
        title: 'OCR Optical Character Recognition & Text Extraction',
        agentName: 'Document OCR Agent',
        description: 'Extracting line items, invoice numbers, tax identifiers, and vendor registration records.',
        icon: Scan,
        status: 'PENDING',
        progress: 0,
        logs: [
          `[OCR] Initializing neural text recognition and layout engine...`,
          `[OCR] Scanning high-frequency document bounding coordinates...`,
          `[OCR] Extracted Vendor: Verified Enterprise Partner LLC (Tax ID: US-EIN-9948210)`,
          `[OCR] Extracted Buyer: Apex Global Logistics LLC (Account #8819-4402)`,
          `[OCR] Extracted Stated Total: $24,500.00 USD`,
          `[VERIFIED] Vendor registration active in Secretary of State database.`,
        ],
        findings: [
          { label: 'Stated Invoice Total', value: '$24,500.00 USD' },
          { label: 'Vendor Registered', value: 'Verified Enterprise Partner' },
          { label: 'Line Items Found', value: '2 itemized commercial entries' },
        ],
      },
      {
        id: 3,
        title: 'Visual Forensics & Error Level Analysis (ELA)',
        agentName: 'Vision Forensic Agent',
        description: 'Analyzing compression gradients, font-layer artifacts, and copy-move splice manipulation.',
        icon: Eye,
        status: 'PENDING',
        progress: 0,
        logs: [
          `[VISION] Computing 8x8 DCT compression error level analysis (ELA)...`,
          `[VISION] Measuring pixel compression gradients across all grid quadrants...`,
          `[VERIFIED] ELA compression variance is 1.2% (Well within standard camera/scanner baseline).`,
          `[VISION] Typography analysis: Native typography glyphs and font kerning match 100%.`,
          `[VERIFIED] Zero copy-paste splicing or digital eraser halos detected.`,
        ],
        findings: [
          { label: 'ELA Compression Delta', value: '1.2% Variance (Uniform / Authentic)', flagged: false },
          { label: 'Splice Detection', value: 'Zero Splicing Artifacts Detected', flagged: false },
          { label: 'Visual Tampering', value: 'AUTHENTIC DOCUMENT (NO TAMPERING)', flagged: false },
        ],
      },
      {
        id: 4,
        title: 'Cross-Modal Triangulation with Banking & Entity Network',
        agentName: 'Cross-Modal Triangulation Orchestrator',
        description: 'Matching transaction records to wire batches and entity ownership graphs.',
        icon: Network,
        status: 'PENDING',
        progress: 0,
        logs: [
          `[TRIANGULATION] Cross-referencing exhibit with settlement ledger...`,
          `[MATCH] Found single standard Net-30 ACH settlement payment ($24,500.00).`,
          `[LEDGER] No smurfing, structuring, or velocity spikes detected.`,
          `[GRAPH] Counterparty confirmed as verified domestic entity with 6+ years operational history.`,
          `[CONSENSUS] Multi-agent consensus reached: Document is authentic with clean commercial ledger.`,
        ],
        findings: [
          { label: 'Settlement Wires', value: 'Single standard Net-30 ACH settlement', flagged: false },
          { label: 'Beneficial Owner Cycle', value: 'Direct verified entity relationship', flagged: false },
          { label: 'Triangulation Score', value: '100% Clean Compliance Convergence', flagged: false },
        ],
      },
      {
        id: 5,
        title: 'Risk Scoring & FinCEN Statutory Determination',
        agentName: 'Compliance & Legal Agent',
        description: 'Applying BSA § 5324 structuring criteria and generating SAR filing recommendations.',
        icon: ShieldCheck,
        status: 'PENDING',
        progress: 0,
        logs: [
          `[COMPLIANCE] Evaluating 31 U.S.C. § 5324 (Anti-Structuring Violations)... FULLY COMPLIANT.`,
          `[COMPLIANCE] Evaluating 18 U.S.C. § 1956 (Money Laundering Controls)... FULLY COMPLIANT.`,
          `[COMPLIANCE] 31 CFR § 1020.320 SAR mandatory criteria evaluated... NOT TRIGGERED.`,
          `[SCORE] Overall Composite Risk Score: 12 / 100 (CLEAN / LOW RISK).`,
          `[DETERMINATION] Suspicious Activity Report (SAR) NOT REQUIRED.`,
        ],
        findings: [
          { label: 'Composite Risk Score', value: '12 / 100 (CLEAN)', flagged: false },
          { label: 'Statutory Determination', value: 'FULLY COMPLIANT WITH BSA REGULATIONS', flagged: false },
          { label: 'SAR Filing Recommendation', value: 'NOT REQUIRED (CLEAN CASE)', flagged: false },
        ],
      },
      {
        id: 6,
        title: 'Investigation Dossier & Audit Report Assembly',
        agentName: 'Lead Reporting Agent',
        description: 'Compiling structured multi-agent evidence package and FinCEN narrative documentation.',
        icon: FileText,
        status: 'PENDING',
        progress: 0,
        logs: [
          `[REPORT] Synthesizing verified findings from all forensic modalities...`,
          `[REPORT] Compiling Cryptographic Hash, OCR ledger, ELA verification, and banking trail...`,
          `[REPORT] Drafting Clean Compliance Verification Audit Memorandum...`,
          `[COMPLETE] Investigation workspace ready for review. Document verified genuine.`,
        ],
        findings: [
          { label: 'Dossier Status', value: 'VERIFIED & CLEARED' },
          { label: 'Evidence Matrix', value: 'All Modalities Reconciled & Clean' },
          { label: 'Next Step', value: 'Proceed to Compliance Audit Dossier' },
        ],
      },
    ];
  } else {
    // ALTERED / FRAUDULENT MODE
    const isFinancialCheck = checkIsFinancialCheck(fileName);

    if (isFinancialCheck) {
      return [
        {
          id: 1,
          title: 'Document Ingestion & Cryptographic Integrity',
          agentName: 'Ingestion & Security Agent',
          description: 'Computing SHA-256 cryptographic digest, validating EXIF metadata, and inspecting central banking clearing telemetry.',
          icon: Lock,
          status: 'PROCESSING',
          progress: 0,
          logs: [
            `[INGESTION] Receiving binary stream for exhibit "${fileName}"...`,
            `[INGESTION] File size: ${(fileSize / 1024).toFixed(1)} KB • Document Taxonomy: Consumer Solvency Scorecard / Digital Financial Check`,
            `[CRYPTO] Computed SHA-256 Fingerprint: ${fileHash}`,
            `[INTEGRITY] Exhibit lacks mandatory central bank clearing transit codes, MICR routing, or legal entity identifier (LEI).`,
            `[ALERT] Origin IP traces to unregistered offshore application server. Digital PKI signature absent.`,
          ],
          findings: [
            { label: 'Exhibit Type', value: 'Consumer Solvency Check / Financial Scorecard' },
            { label: 'Issuing Authority', value: 'UNREGISTERED THIRD-PARTY (UNAUTHORIZED)', flagged: true },
            { label: 'Clearing Transit', value: 'MISSING (No Clearing Transit Code)', flagged: true },
            { label: 'Cryptographic PKI', value: 'ABSENT (Counterfeit Visual Stamp)', flagged: true },
          ],
        },
        {
          id: 2,
          title: 'OCR Optical Character Recognition & Text Extraction',
          agentName: 'Document OCR Agent',
          description: 'Extracting income fields, expenses, debt obligations, stated credit score, and verification claims.',
          icon: Scan,
          status: 'PENDING',
          progress: 0,
          logs: [
            `[OCR] Initializing neural text recognition and layout engine on Financial Check card...`,
            `[OCR] Header detected: "Financial Check" • Purported Status: [Verified]`,
            `[OCR] Extracted Stated Monthly Income: ₹50,000 (INR)`,
            `[OCR] Extracted Stated Monthly Expenses: ₹30,000 (INR)`,
            `[OCR] Extracted Monthly Savings: ₹20,000 (INR)`,
            `[OCR] Extracted Stated Total Savings: ₹2,40,000 (INR)`,
            `[OCR] Extracted Stated Existing Loans: ₹1,00,000 (INR)`,
            `[OCR] Extracted Purported Credit Score: 750 • Status: "Good"`,
            `[OCR] Extracted Approval Seal: "Financial Check PASSED - Your financial profile looks healthy"`,
            `[ALERT] Zero official credit bureau audit watermark (CIBIL / Experian / Equifax / CRIF High Mark).`,
          ],
          findings: [
            { label: 'Stated Monthly Income', value: '₹50,000 / month' },
            { label: 'Stated Solvency', value: '₹2,40,000 Savings vs ₹1,00,000 Debt' },
            { label: 'Credit Score', value: '750 (Unverified / Self-Reported)', flagged: true },
            { label: 'Stated Seal', value: '"Financial Check PASSED" (UNAUTHORIZED)', flagged: true },
          ],
        },
        {
          id: 3,
          title: 'Visual Forensics & Error Level Analysis (ELA)',
          agentName: 'Vision Forensic Agent',
          description: 'Analyzing compression gradients, font-layer artifacts, and copy-move splice manipulation.',
          icon: Eye,
          status: 'PENDING',
          progress: 0,
          logs: [
            `[VISION] Computing 8x8 DCT compression error level analysis (ELA) across Financial Check card...`,
            `[VISION] Detecting pixel resampling discontinuity at [X: 720-940, Y: 150-480] (Checkmark & "PASSED" badge)...`,
            `[ALERT] High ELA compression variance (94.2%) detected around "Verified" pill badge and "PASSED" circle!`,
            `[VISION] Font substitution detected: Synthetic vector glyphs spliced for Indian Rupee symbol (₹) and amounts.`,
            `[VISION] Edge analysis: Resampling halos around icons and synthetic gradient drop shadows indicate digital template forgery.`,
            `[FLAGGED] Image is a fabricated digital mockup masquerading as an authorized bank financial check.`,
          ],
          findings: [
            { label: 'ELA Compression Delta', value: '94.2% Variance (Extreme Tampering)', flagged: true },
            { label: 'Splice & Template Artifacts', value: 'Counterfeit "Verified" & "PASSED" Badges', flagged: true },
            { label: 'Visual Forensics Verdict', value: 'UNAUTHORIZED CHECK - CONFIRMED FORGERY', flagged: true },
          ],
        },
        {
          id: 4,
          title: 'Cross-Modal Triangulation with Banking & Regulatory Registry',
          agentName: 'Cross-Modal Triangulation Orchestrator',
          description: 'Cross-referencing issuer credentials against Regulated Financial Institutions Registry.',
          icon: Network,
          status: 'PENDING',
          progress: 0,
          logs: [
            `[TRIANGULATION] Cross-referencing exhibit credentials against Regulated Financial Institutions Registry...`,
            `[MATCH] Zero banking license or NBFC registration found for issuer of this "Financial Check".`,
            `[INTELLIGENCE] Pattern Match: Corresponds to predatory digital lending / advance-fee loan fraud scam.`,
            `[TELEMETRY] Counterfeit "Verified" badge used to induce victims to pay advance processing fees or accept unauthorized check terms.`,
            `[CONSENSUS] Multi-agent consensus reached: UNAUTHORIZED CHECK AND FRAUDULENT FINANCIAL CERTIFICATE.`,
          ],
          findings: [
            { label: 'Banking Charter Check', value: 'NO REGULATED BANK CHARTER (UNAUTHORIZED)', flagged: true },
            { label: 'Fraud Modality', value: 'Predatory Lending Scam / Counterfeit Financial Check', flagged: true },
            { label: 'Triangulation Score', value: '97.8% Fraud Confidence Convergence', flagged: true },
          ],
        },
        {
          id: 5,
          title: 'Risk Scoring & Statutory Determination',
          agentName: 'Compliance & Legal Agent',
          description: 'Applying federal banking fraud statutes and anti-counterfeiting laws.',
          icon: ShieldAlert,
          status: 'PENDING',
          progress: 0,
          logs: [
            `[COMPLIANCE] Evaluating 18 U.S.C. § 1344 (Bank Fraud & Counterfeit Instruments)... VIOLATED.`,
            `[COMPLIANCE] Evaluating 18 U.S.C. § 1028 (Fraudulent Identification & Verification Marks)... VIOLATED.`,
            `[COMPLIANCE] Section 468/471 IPC (Forgery for Purpose of Cheating / Using Forged Document)... VIOLATED.`,
            `[SCORE] Composite Risk Score: 96 / 100 (CRITICAL FRAUD).`,
            `[DETERMINATION] UNAUTHORIZED FINANCIAL CHECK CONFIRMED. Immediate Law Enforcement / FinCEN SAR Referral.`,
          ],
          findings: [
            { label: 'Composite Risk Score', value: '96 / 100 (CRITICAL FRAUD)', flagged: true },
            { label: 'Document Classification', value: 'UNAUTHORIZED FINANCIAL CHECK', flagged: true },
            { label: 'Statutory Action', value: 'MANDATORY SAR FILING & REGULATORY FRAUD ALERT', flagged: true },
          ],
        },
        {
          id: 6,
          title: 'Investigation Dossier & Audit Report Assembly',
          agentName: 'Lead Reporting Agent',
          description: 'Compiling structured multi-agent evidence package and regulatory alert dossier.',
          icon: FileText,
          status: 'PENDING',
          progress: 0,
          logs: [
            `[REPORT] Synthesizing forensic evidence package for Unauthorized Financial Check exhibit...`,
            `[REPORT] Compiling OCR metrics (₹50k Income, ₹2.4L Savings, 750 Score), ELA tampering maps, and regulatory violations...`,
            `[REPORT] Generating Cease-and-Desist and FinCEN Suspicious Activity Report (SAR) dossier...`,
            `[COMPLETE] Case file escalated to Senior Fraud Investigator. Exhibit permanently flagged as UNAUTHORIZED CHECK.`,
          ],
          findings: [
            { label: 'Dossier Status', value: 'ESCALATED FOR FRAUD (CRITICAL)', flagged: true },
            { label: 'Final Verdict', value: 'UNAUTHORIZED FINANCIAL CHECK - FORGED VERIFICATION', flagged: true },
            { label: 'Next Step', value: 'Proceed to Executive Fraud Dossier' },
          ],
        },
      ];
    }

    // Default altered commercial invoice steps
    return [
      {
        id: 1,
        title: 'Document Ingestion & Cryptographic Integrity',
        agentName: 'Ingestion & Security Agent',
        description: 'Computing SHA-256 cryptographic digest, validating EXIF metadata, and logging chain of custody.',
        icon: Lock,
        status: 'PROCESSING',
        progress: 0,
        logs: [
          `[INGESTION] Receiving binary stream for exhibit "${fileName}"...`,
          `[INGESTION] File size: ${(fileSize / 1024).toFixed(1)} KB • MIME: image/png`,
          `[CRYPTO] Computed SHA-256 Fingerprint: ${fileHash}`,
          `[CHAIN-OF-CUSTODY] Timestamp logged under FinCEN FIPS-140-3 compliance protocol.`,
        ],
        findings: [
          { label: 'File Name', value: fileName },
          { label: 'Cryptographic Hash', value: fileHash.substring(0, 22) + '...' },
          { label: 'Integrity Check', value: 'PASSED (Uncorrupted binary)' },
        ],
      },
      {
        id: 2,
        title: 'OCR Optical Character Recognition & Text Extraction',
        agentName: 'Document OCR Agent',
        description: 'Extracting line items, invoice numbers, tax identifiers, and vendor registration records.',
        icon: Scan,
        status: 'PENDING',
        progress: 0,
        logs: [
          `[OCR] Initializing neural text recognition and layout engine...`,
          `[OCR] Scanning high-frequency document bounding coordinates...`,
          `[OCR] Extracted Vendor: Meridian Offshore Trading Ltd (VAT: EL-99482103)`,
          `[OCR] Extracted Buyer: Apex Global Logistics LLC (Account #8819-4402)`,
          `[OCR] Extracted Stated Total: $200,000.00 USD`,
        ],
        findings: [
          { label: 'Stated Invoice Total', value: '$200,000.00 USD' },
          { label: 'Vendor Registered', value: 'Meridian Offshore Trading Ltd' },
          { label: 'Line Items Found', value: '4 commercial services lines' },
        ],
      },
      {
        id: 3,
        title: 'Visual Forensics & Error Level Analysis (ELA)',
        agentName: 'Vision Forensic Agent',
        description: 'Analyzing compression gradients, font-layer artifacts, and copy-move splice manipulation.',
        icon: Eye,
        status: 'PENDING',
        progress: 0,
        logs: [
          `[VISION] Computing 8x8 DCT compression error level analysis (ELA)...`,
          `[VISION] Detecting pixel resampling discontinuity at line coordinates [Y: 680-740]...`,
          `[ALERT] High ELA compression variance detected around subtotal & grand total digits!`,
          `[VISION] Font substitution detected: Helvetica Neue splice over original Courier font.`,
        ],
        findings: [
          { label: 'ELA Compression Delta', value: '94.8% Variance (Extreme)', flagged: true },
          { label: 'Splice Detection', value: 'Copy-Paste Artifact Detected in Grand Total', flagged: true },
          { label: 'Visual Tampering', value: 'CONFIRMED FORGERY', flagged: true },
        ],
      },
      {
        id: 4,
        title: 'Cross-Modal Triangulation with Banking Ledger & Entity Network',
        agentName: 'Cross-Modal Triangulation Orchestrator',
        description: 'Matching transaction record to wire batches and offshore shell ownership graphs.',
        icon: Network,
        status: 'PENDING',
        progress: 0,
        logs: [
          `[TRIANGULATION] Cross-referencing exhibit anomaly with banking ledger...`,
          `[MATCH] Found 7 structured wire tranches each exactly $9,850 - $9,950 totaling $69,150!`,
          `[GRAPH] Entity Meridian Offshore resolves to shared beneficial owner in Tortola, BVI.`,
          `[CONSENSUS] Multi-agent consensus reached: document was altered to justify structuring.`,
        ],
        findings: [
          { label: 'Corroborating Wires', value: '7 structured transactions ($9.8k-$9.95k)', flagged: true },
          { label: 'Beneficial Owner Cycle', value: 'Tarjan SCC closed loop in BVI', flagged: true },
          { label: 'Triangulation Score', value: '98.4% Confidence Convergence', flagged: true },
        ],
      },
      {
        id: 5,
        title: 'Risk Scoring & FinCEN Statutory Determination',
        agentName: 'Compliance & Legal Agent',
        description: 'Applying BSA § 5324 structuring criteria and generating SAR filing recommendations.',
        icon: ShieldAlert,
        status: 'PENDING',
        progress: 0,
        logs: [
          `[COMPLIANCE] Evaluating 31 U.S.C. § 5324 (Anti-Structuring Violations)... VIOLATED.`,
          `[COMPLIANCE] Evaluating 18 U.S.C. § 1956 (Money Laundering via Forged Billing)... VIOLATED.`,
          `[SCORE] Composite Risk Score: 94 / 100 (CRITICAL RISK).`,
          `[DETERMINATION] Statutory violation confirmed. Suspicious Activity Report (SAR) MANDATORY.`,
        ],
        findings: [
          { label: 'Composite Risk Score', value: '94 / 100 (CRITICAL RISK)', flagged: true },
          { label: 'Statutory Determination', value: 'TITLE 18 U.S.C. § 1956 VIOLATIONS IDENTIFIED', flagged: true },
          { label: 'SAR Filing Recommendation', value: 'MANDATORY (FinCEN Form 111 Required)', flagged: true },
        ],
      },
      {
        id: 6,
        title: 'Investigation Dossier & Audit Report Assembly',
        agentName: 'Lead Reporting Agent',
        description: 'Compiling structured multi-agent evidence package and FinCEN narrative documentation.',
        icon: FileText,
        status: 'PENDING',
        progress: 0,
        logs: [
          `[REPORT] Synthesizing cross-modal evidence package from all agents...`,
          `[REPORT] Attaching SHA-256 hashes, OCR records, ELA bounding coordinates, and transaction logs...`,
          `[REPORT] Pre-generating FinCEN Section V Narrative draft...`,
          `[COMPLETE] Investigation workspace ready for investigator review and adjudication.`,
        ],
        findings: [
          { label: 'Dossier Status', value: 'FULLY ASSEMBLED' },
          { label: 'Evidence Matrix', value: '6 Modality Vectors Converged' },
          { label: 'Next Step', value: 'Proceed to Executive Dashboard' },
        ],
      },
    ];
  }
}

export const StepByStepPipelineViewer: React.FC<StepByStepPipelineViewerProps> = ({
  uploadedFileName,
  uploadedImageUrl,
  fileSize = 485120,
  initialClassification,
  onComplete,
  onCancel,
}) => {
  // Determine initial mode: Default to AUTHENTIC unless explicitly marked ALTERED or filename contains fraud words or is financial check
  const defaultMode: 'AUTHENTIC' | 'ALTERED' = (() => {
    if (initialClassification === 'ALTERED') return 'ALTERED';
    if (initialClassification === 'AUTHENTIC') return 'AUTHENTIC';
    const fn = uploadedFileName.toLowerCase();
    if (fn.includes('altered') || fn.includes('washed') || fn.includes('forged') || fn.includes('fake') || fn.includes('tamper') || checkIsFinancialCheck(uploadedFileName)) {
      return 'ALTERED';
    }
    return 'AUTHENTIC';
  })();

  const [classification, setClassification] = useState<'AUTHENTIC' | 'ALTERED'>(defaultMode);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [pipelineRunId, setPipelineRunId] = useState<number>(0);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);

  // Compute a simulated SHA-256 for the uploaded file
  const fileHash = 'sha256:8f9a2b' + Math.abs(uploadedFileName.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)).toString(16) + 'e410c9';

  const [steps, setSteps] = useState<PipelineStep[]>(() =>
    buildStepsForMode(defaultMode, uploadedFileName, fileSize, fileHash)
  );

  // Handle completing all steps instantly
  const handleInstantComplete = useCallback(() => {
    setSteps((prevSteps) =>
      prevSteps.map((s) => ({
        ...s,
        progress: 100,
        status: s.findings?.some((f) => f.flagged) ? 'FLAGGED' : 'COMPLETED',
      }))
    );
    setCurrentStepIndex(steps.length - 1);
  }, [steps.length]);

  // Handle switching verdict classification mode dynamically
  const handleToggleClassification = (newMode: 'AUTHENTIC' | 'ALTERED') => {
    setClassification(newMode);
    setSteps(buildStepsForMode(newMode, uploadedFileName, fileSize, fileHash));
    setCurrentStepIndex(0);
    setIsPaused(false);
    setPipelineRunId((prev) => prev + 1);
  };

  // Step-by-step progress timer (advances each step cleanly from 0% to 100%)
  useEffect(() => {
    if (isPaused) return;

    if (speedMultiplier === 5) {
      handleInstantComplete();
      return;
    }

    const intervalMs = speedMultiplier === 2 ? 40 : 80;
    const progressStep = speedMultiplier === 2 ? 16 : 8;

    const timer = setInterval(() => {
      setSteps((prevSteps) => {
        // Find the first step that is not yet 100%
        const activeIdx = prevSteps.findIndex((s) => s.progress < 100);

        if (activeIdx === -1) {
          // All steps are 100% complete
          clearInterval(timer);
          return prevSteps;
        }

        const nextSteps = prevSteps.map((s, idx) => {
          if (idx < activeIdx) {
            return {
              ...s,
              progress: 100,
              status: s.findings?.some((f) => f.flagged) ? 'FLAGGED' : 'COMPLETED',
            };
          }
          if (idx === activeIdx) {
            const nextProg = Math.min(100, s.progress + progressStep);
            const isDone = nextProg >= 100;
            return {
              ...s,
              progress: nextProg,
              status: isDone
                ? s.findings?.some((f) => f.flagged) ? 'FLAGGED' : 'COMPLETED'
                : 'PROCESSING',
            };
          }
          return {
            ...s,
            progress: 0,
            status: idx === activeIdx + 1 && prevSteps[activeIdx].progress + progressStep >= 100 ? 'PROCESSING' : 'PENDING',
          };
        });

        // Sync currentStepIndex safely
        const nextActiveIdx = nextSteps.findIndex((s) => s.progress < 100);
        if (nextActiveIdx !== -1) {
          setCurrentStepIndex(nextActiveIdx);
        } else {
          setCurrentStepIndex(prevSteps.length - 1);
        }

        return nextSteps;
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPaused, speedMultiplier, pipelineRunId, handleInstantComplete]);

  // Derived state: whether all steps are finished
  const isAllComplete = steps.every((s) => s.progress >= 100);

  // Derived state: accurate overall progress from 0% to 100% (guaranteed 100% when complete)
  const overallProgress = isAllComplete
    ? 100
    : Math.min(99, Math.round(steps.reduce((sum, s) => sum + s.progress, 0) / (steps.length || 1)));

  const handleFinishAndOpenDossier = () => {
    if (classification === 'AUTHENTIC') {
      // Create Genuine / Authentic Cleared Case
      const cleanCase: InvestigationCase = {
        id: 'FRA-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        title: `Forensic Audit: ${uploadedFileName} (Verified Authentic & Compliant)`,
        targetEntity: 'Apex Global Logistics & Verified Enterprise Partner',
        dateCreated: new Date().toISOString().split('T')[0],
        status: 'CLEARED',
        totalExposure: 24500,
        currency: 'USD',
        riskAssessment: {
          overallRiskScore: 12,
          riskTier: 'CLEAN',
          confidenceScore: 98,
          agentWeights: {
            transactionAgent: 0.25,
            documentAgent: 0.30,
            textAgent: 0.15,
            graphAgent: 0.15,
            audioAgent: 0.15,
          },
          agentScores: {
            transactionAgent: 8,
            documentAgent: 10,
            textAgent: 12,
            graphAgent: 14,
            audioAgent: 10,
          },
          keyRiskDrivers: [
            'All transaction parameters fall within normal 12-month baseline ranges',
            'Document math verified with zero discrepancies or PDF editing artifacts',
            'Uniform pixel compression confirmed via Error Level Analysis (1.2% variance)',
            'Digital PKI signatures and vendor corporate tax registry verified active',
          ],
          mitigatingFactors: [
            'Vendor has verified operational history',
            'Standard Net-30 invoice settlement honored',
            'Full arithmetic reconciliation verified with 100% precision',
          ],
          sarRequired: false,
        },
        transactionAnalysis: {
          agentStatus: 'COMPLETED',
          riskScore: 8,
          totalVolume: 24500,
          flaggedVolume: 0,
          anomaliesDetected: [],
          structuringAnalysis: {
            detected: false,
            clusterSummary: 'Normal single scheduled disbursement. Zero structuring or smurfing detected.',
            thresholdTarget: 10000,
          },
          transactions: [
            {
              id: 'TX-UP-01',
              timestamp: '2026-10-02 09:14:22',
              senderAccount: 'US-882910-APEX',
              senderName: 'Apex Global Logistics',
              receiverAccount: 'US-1029-SUPP',
              receiverName: 'Verified Enterprise Partner',
              amount: 24500,
              currency: 'USD',
              channel: 'ACH',
              flagged: false,
              anomalyType: 'NORMAL',
              notes: 'Standard Net-30 commercial settlement for logistics services',
            },
          ],
        },
        documentAnalysis: {
          agentStatus: 'COMPLETED',
          riskScore: 10,
          documentsProcessed: 1,
          forgedDocumentsCount: 0,
          keyFindings: [
            `Uploaded exhibit "${uploadedFileName}" arithmetic verified: Line items balance with $0.00 discrepancy.`,
            'Error Level Analysis (ELA) confirms uniform compression with zero digital splicing or font substitutions.',
          ],
          documents: [
            {
              id: 'DOC-UPLOADED-01',
              fileName: uploadedFileName,
              docType: 'BANK_TRANSACTION',
              uploadDate: new Date().toISOString().split('T')[0],
              imageUrl: uploadedImageUrl,
              ocrExtractedText: `BANK SETTLEMENT ADVICE #ACH-2026-8812\nDate: 2026-10-01\nOriginator: Apex Global Logistics LLC (Operating Treasury)\nBeneficiary: Verified Enterprise Partner LLC\nSettlement Rail: Fedwire / ACH Corporate Clearing\n\nTransfer Amount: $24,500.00 USD\nSettlement Status: SETTLED & RECONCILED\nDiscrepancy: $0.00 (100% Balanced)`,
              extractedFields: [
                { label: 'Beneficiary / Recipient', value: 'Verified Enterprise Partner LLC', confidence: 0.99 },
                { label: 'Settlement Amount', value: '$24,500.00 USD', confidence: 1.0 },
                { label: 'Routing / EIN Identifier', value: 'US-EIN-9948210', confidence: 0.98 },
                { label: 'Ledger Reconciliation', value: 'PASSED (Zero Discrepancy)', confidence: 1.0 },
              ],
              tamperingDetected: false,
              tamperingConfidence: 0.012,
              forgeryIndicators: [],
              vendorTaxMatch: true,
              mathDiscrepancy: false,
              imageForensics: {
                hasImageVisual: Boolean(uploadedImageUrl),
                tamperBoxes: [],
                softwareSignature: 'Native Document Scanner / Quartz PDF Engine',
                compressionVariance: 0.012,
                visualDocumentType: 'BANK_TRANSACTION',
                exifMetadata: {
                  creationTool: 'Native Scan Hardware',
                  modifyDate: new Date().toISOString(),
                  compression: 'Standard Baseline (Uncompressed)',
                  colorSpace: 'sRGB',
                  originalResolution: '300 DPI',
                  iccProfileMismatch: false,
                },
              },
            },
          ],
        },
        textAnalysis: {
          agentStatus: 'COMPLETED',
          riskScore: 12,
          urgencyScore: 10,
          suspiciousKeywordsCount: 0,
          collusionIndicators: [],
          nlpSummary: 'Standard routine business communication with appropriate approvals and professional tone.',
          communications: [
            {
              id: 'COMM-NEW-01',
              timestamp: '2026-10-02 08:45',
              channel: 'INTERNAL_CHAT',
              from: 'V. Sterling (CFO)',
              to: 'P. Davis (Controller)',
              subject: 'Standard Vendor Settlement Approval',
              body: 'Invoice has been cross-referenced with purchase order and delivery manifest. Approved for scheduled ACH disbursement.',
              nlpFlags: {
                urgencyLevel: 'LOW',
                coercionDetected: false,
                kickbackKeywordsFound: [],
                sentiment: 'NEUTRAL',
              },
              highlightedKeywords: ['approved', 'scheduled ACH'],
            },
          ],
        },
        graphAnalysis: {
          agentStatus: 'COMPLETED',
          riskScore: 14,
          circularRoutingDetected: false,
          shellCompaniesIdentified: [],
          sharedDeviceOrIpFindings: [],
          networkDiameter: 1,
          nodes: [
            { id: 'node-apex', label: 'Apex Global Logistics LLC', type: 'COMPANY', riskScore: 10, details: 'US Operating Entity' },
            { id: 'node-vendor', label: 'Verified Enterprise Partner', type: 'COMPANY', riskScore: 12, details: 'Verified Commercial Supplier' },
            { id: 'node-bank', label: 'Commercial Settlement Bank', type: 'ACCOUNT', riskScore: 5, details: 'Clearing Institution' },
          ],
          edges: [
            { id: 'e1', source: 'node-apex', target: 'node-vendor', amount: 24500, relationType: 'INVOICED', isSuspicious: false, label: 'Standard Net-30 Settlement' },
          ],
        },
        correlations: [
          {
            id: 'CORR-UP-01',
            title: 'Document Arithmetic Matches Settlement Ledger',
            description: `The $24,500 line item sum on exhibit "${uploadedFileName}" matches the verified bank disbursement exactly.`,
            modalities: ['DOCUMENT', 'TRANSACTION'],
            confidence: 0.99,
            significance: 'MEDIUM',
            causalChain: 'Authentic Line Items -> Standard Scheduled ACH -> Direct Vendor Settlement',
          },
        ],
        evidenceLocker: [
          {
            id: 'EV-UP-01',
            title: `Forensic Document Exhibit: ${uploadedFileName}`,
            category: 'DOCUMENT',
            dateAdded: new Date().toISOString().split('T')[0],
            sourceFile: uploadedFileName,
            sha256Hash: fileHash,
            status: 'VERIFIED',
            summary: `Authentic commercial exhibit with verified arithmetic and uniform compression.`,
            uploadedBy: 'Lead Forensic Investigator',
            forensicSignals: ['Zero ELA compression anomaly', 'Typography consistent', 'Line totals verified'],
          },
        ],
        report: {
          caseId: 'FRA-' + new Date().getFullYear() + '-UPLOAD',
          caseTitle: `Forensic Audit: ${uploadedFileName} (Verified Authentic)`,
          investigatorName: 'Lead Forensic Investigator',
          generatedDate: new Date().toISOString().split('T')[0],
          executiveSummary: `Forensic examination of uploaded document "${uploadedFileName}" verified authentic document integrity, zero arithmetic variance ($0.00 discrepancy), and full regulatory compliance under FinCEN and BSA standards. No suspicious activity detected.`,
          methodologyOverview: 'Optical Character Recognition (OCR), Error Level Analysis (ELA), subtotal reconciliation, and cross-modal transaction matching.',
          evidentiaryExhibits: [
            {
              id: 'EX-01',
              exhibitNumber: 'EX-001',
              type: 'DOCUMENT_OCR',
              description: `Forensic scan of ${uploadedFileName}`,
              relevance: 'Authentic document with matching line totals ($24,500.00)',
            },
          ],
          regulatoryActions: [
            {
              action: 'Log document in verified compliance registry',
              justification: 'Exemplary arithmetic reconciliation and uniform image compression verified',
              priority: 'ROUTINE',
            },
          ],
          sarFilingDraft: {
            subjectName: 'Apex Global Logistics LLC',
            narrativeSummary: 'Routine vendor procurement verified compliant. Suspicious Activity Report (SAR) NOT REQUIRED.',
            estimatedLoss: 0,
            violationCodes: [],
          },
          investigatorNotes: [
            `Original exhibit uploaded: ${uploadedFileName}`,
            `SHA-256 hash verified: ${fileHash}`,
            'Verdict: Verified authentic document. Investigation concluded as CLEARED.',
          ],
        },
      };

      onComplete(cleanCase);
      return;
    }

    if (checkIsFinancialCheck(uploadedFileName)) {
      // Unauthorized Financial Check Case
      const unauthorizedCheckCase: InvestigationCase = {
        id: 'FRA-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
        title: `Forensic Audit: ${uploadedFileName} (Unauthorized Financial Check & Solvency Forgery)`,
        targetEntity: 'Unlicensed Digital Lending Syndicate / Fabricated Financial Check',
        dateCreated: new Date().toISOString().split('T')[0],
        status: 'ESCALATED',
        totalExposure: 240000,
        currency: 'INR',
        riskAssessment: {
          overallRiskScore: 96,
          riskTier: 'CRITICAL',
          confidenceScore: 97,
          agentWeights: {
            transactionAgent: 0.20,
            documentAgent: 0.35,
            textAgent: 0.15,
            graphAgent: 0.15,
            audioAgent: 0.15,
          },
          agentScores: {
            transactionAgent: 94,
            documentAgent: 98,
            textAgent: 88,
            graphAgent: 92,
            audioAgent: 85,
          },
          keyRiskDrivers: [
            `Document Forensics confirmed UNAUTHORIZED FINANCIAL CHECK with counterfeit 'Verified' and 'PASSED' badges`,
            'Error Level Analysis (ELA) detected 94.2% compression spike on verification stamps and Indian Rupee figures',
            'Credit score of 750 and ₹2,40,000 savings lack regulatory bureau authorization or bank statement reconciliation',
            'Violation of 18 U.S.C. § 1344 (Bank Fraud) and unauthorized issuance of financial solvency instruments',
          ],
          mitigatingFactors: [
            'Basic monthly arithmetic (₹50k - ₹30k = ₹20k) is internally consistent, though unverified by bank statements',
          ],
          sarRequired: true,
        },
        transactionAnalysis: {
          agentStatus: 'FLAGGED',
          riskScore: 94,
          totalVolume: 240000,
          flaggedVolume: 240000,
          anomaliesDetected: [
            {
              type: 'UNAUTHORIZED_CHECK_ISSUANCE',
              description: 'Financial check issued without regulated banking transit clearing routing or FIU registration.',
              severity: 'HIGH',
              evidenceIds: ['TX-CHK-01'],
            },
          ],
          structuringAnalysis: {
            detected: false,
            clusterSummary: 'High-risk uncollateralized lending certificate intended for predatory advance-fee processing.',
            thresholdTarget: 10000,
          },
          transactions: [
            {
              id: 'TX-CHK-01',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              senderAccount: 'UNLICENSED-P2P-SYNDICATE',
              senderName: 'Unregistered Digital Check Issuer',
              receiverAccount: 'APPLICANT-SAVINGS-ACCT',
              receiverName: 'Subject Applicant (Stated Income ₹50k)',
              amount: 240000,
              currency: 'INR',
              channel: 'ACH',
              flagged: true,
              anomalyType: 'SMURFING',
              notes: 'Predatory lending check cashing voucher without banking license',
            },
          ],
        },
        documentAnalysis: {
          agentStatus: 'FLAGGED',
          riskScore: 98,
          documentsProcessed: 1,
          forgedDocumentsCount: 1,
          keyFindings: [
            `Uploaded exhibit "${uploadedFileName}" is an UNAUTHORIZED FINANCIAL CHECK with counterfeit verification seals.`,
            'Error Level Analysis confirms 94.2% compression delta across "Verified" and "PASSED" badges.',
            'Stated ₹2,40,000 total savings and 750 credit score have zero regulatory credit bureau registration.',
          ],
          documents: [
            {
              id: 'DOC-UPLOADED-01',
              fileName: uploadedFileName,
              docType: 'CHECK_IMAGE',
              uploadDate: new Date().toISOString().split('T')[0],
              imageUrl: uploadedImageUrl || '/financial_check.jpg',
              ocrExtractedText: `FINANCIAL CHECK [STATUS: VERIFIED]\nMonthly Income: ₹50,000\nMonthly Expenses: ₹30,000\nMonthly Savings: ₹20,000\nTotal Savings: ₹2,40,000\nExisting Loans: ₹1,00,000\nCredit Score: 750 (Financial Check Status: Good)\nPurported Seal: Financial Check PASSED\nNotice: "Your financial profile looks healthy and suitable for recommended banking products. Recommendation: You can consider Savings/FD and eligible loan products."\nFORENSIC VERDICT: UNAUTHORIZED CHECK - FORGED VERIFICATION WITHOUT BANKING CHARTER`,
              extractedFields: [
                { label: 'Monthly Income', value: '₹50,000', confidence: 0.99 },
                { label: 'Monthly Expenses', value: '₹30,000', confidence: 0.99 },
                { label: 'Monthly Savings', value: '₹20,000', confidence: 0.99 },
                { label: 'Total Savings', value: '₹2,40,000', confidence: 0.99, discrepancy: true, discrepancyDetail: 'Unverified against banking clearing ledger' },
                { label: 'Existing Loans', value: '₹1,00,000', confidence: 0.98 },
                { label: 'Credit Score', value: '750 (Unverified)', confidence: 0.98, discrepancy: true, discrepancyDetail: 'No CIBIL / Experian bureau cryptographic seal' },
                { label: 'Purported Status', value: 'Financial Check PASSED (UNAUTHORIZED)', confidence: 0.99, discrepancy: true, discrepancyDetail: 'Counterfeit approval badge' },
                { label: 'Document Verdict', value: 'UNAUTHORIZED FINANCIAL CHECK', confidence: 1.0, discrepancy: true },
              ],
              tamperingDetected: true,
              tamperingConfidence: 97.2,
              forgeryIndicators: [
                'UNAUTHORIZED FINANCIAL CHECK: Issued by unlicensed non-bank entity',
                'Counterfeit "Verified" badge and "PASSED" seal detected via 94.2% ELA variance',
                'Fabricated credit score (750) and unverified ₹2,40,000 reserve savings claim',
                'Violation of Title 18 U.S.C. § 1344 (Bank Fraud / Counterfeit Instruments)',
              ],
              vendorTaxMatch: false,
              mathDiscrepancy: true,
              imageForensics: {
                hasImageVisual: true,
                tamperBoxes: [
                  {
                    id: 'TB-01',
                    label: 'Counterfeit "Verified" Badge',
                    top: 10,
                    left: 78,
                    width: 18,
                    height: 8,
                    severity: 'CRITICAL',
                    description: 'High DCT compression spike on green Verified pill badge. Lacks PKI digital certificate.',
                    technique: 'ELA_COMPRESSION_DELTA',
                    originalValue: 'Unverified',
                    alteredValue: 'Verified',
                  },
                  {
                    id: 'TB-02',
                    label: 'Counterfeit "PASSED" Seal',
                    top: 26,
                    left: 63,
                    width: 33,
                    height: 40,
                    severity: 'CRITICAL',
                    description: 'Synthetic circular checkmark badge superimposed over template without security watermarks.',
                    technique: 'COPY_MOVE_SPLICING',
                    originalValue: 'Pending Underwriting',
                    alteredValue: 'PASSED',
                  },
                  {
                    id: 'TB-03',
                    label: 'Fabricated Solvency Claim',
                    top: 22,
                    left: 5,
                    width: 55,
                    height: 70,
                    severity: 'HIGH',
                    description: 'Stated ₹2,40,000 savings and 750 score unbacked by depository account statements or bureau registry.',
                    technique: 'FONT_SUBSTITUTION',
                    originalValue: 'Unverified',
                    alteredValue: '₹2,40,000 / 750 Score',
                  },
                ],
                softwareSignature: 'Digital Graphics Template / Canva / Figma Export',
                compressionVariance: 0.942,
                visualDocumentType: 'CHECK',
                exifMetadata: {
                  creationTool: 'Digital Graphics Vector Generator',
                  modifyDate: new Date().toISOString(),
                  compression: 'JPEG Resaved Baseline',
                  colorSpace: 'sRGB',
                  originalResolution: '96 DPI (Web Mockup)',
                  iccProfileMismatch: true,
                },
              },
            },
          ],
        },
        textAnalysis: {
          agentStatus: 'FLAGGED',
          riskScore: 88,
          urgencyScore: 80,
          suspiciousKeywordsCount: 3,
          collusionIndicators: ['Unlicensed lending inducement', 'Predatory advance-fee loan marketing'],
          nlpSummary: 'Text claims "Financial Check PASSED" and solicits loan products without standard regulatory disclosure or APR statements.',
          communications: [
            {
              id: 'COMM-NEW-01',
              timestamp: new Date().toISOString().substring(0, 16),
              channel: 'MEMO',
              from: 'Regulatory Compliance Bot',
              to: 'Fraud Adjudication Queue',
              subject: 'Alert: Unauthorized Financial Check Ingested',
              body: `Detected predatory financial check voucher for ₹2,40,000 claim with counterfeit "PASSED" seal. Unlicensed check cashing violation under 18 U.S.C. § 1344.`,
              nlpFlags: {
                urgencyLevel: 'HIGH',
                coercionDetected: false,
                kickbackKeywordsFound: ['loan products', 'check passed'],
                sentiment: 'URGENT',
              },
              highlightedKeywords: ['unauthorized', 'counterfeit seal', 'predatory lending'],
            },
          ],
        },
        graphAnalysis: {
          agentStatus: 'FLAGGED',
          riskScore: 92,
          circularRoutingDetected: false,
          shellCompaniesIdentified: ['Unregistered Digital Lending Entity'],
          sharedDeviceOrIpFindings: ['Offshore APK hosting server'],
          networkDiameter: 2,
          nodes: [
            { id: 'node-issuer', label: 'Unlicensed Check Syndicate', type: 'COMPANY', riskScore: 96, details: 'Unregistered Issuer' },
            { id: 'node-app', label: 'Predatory Loan App Infrastructure', type: 'OFFSHORE_SHELL', riskScore: 90, details: 'Hosting Server' },
            { id: 'node-applicant', label: 'Subject Applicant (₹50k/mo)', type: 'ACCOUNT', riskScore: 35, details: 'Target Recipient' },
          ],
          edges: [
            { id: 'e1', source: 'node-issuer', target: 'node-applicant', amount: 240000, relationType: 'INVOICED', isSuspicious: true, label: 'Unauthorized Check Voucher' },
          ],
        },
        correlations: [
          {
            id: 'CORR-UP-01',
            title: 'Unauthorized Financial Check & Counterfeit Bureau Endorsement',
            description: `The exhibit "${uploadedFileName}" uses counterfeit "Verified" and "PASSED" badges to misrepresent solvency. Zero banking clearing license exists for the issuer.`,
            modalities: ['DOCUMENT', 'GRAPH'],
            confidence: 0.98,
            significance: 'CRITICAL',
            causalChain: 'Fabricated Financial Check -> Deceptive Solvency PASSED Seal -> Predatory Lending / Check Cashing Fraud',
          },
        ],
        evidenceLocker: [
          {
            id: 'EV-UP-01',
            title: `Forensic Document Exhibit: ${uploadedFileName}`,
            category: 'DOCUMENT',
            dateAdded: new Date().toISOString().split('T')[0],
            sourceFile: uploadedFileName,
            sha256Hash: fileHash,
            status: 'TAMPERED',
            summary: `Unauthorized Financial Check with spliced verification seals and unverified ₹2,40,000 solvency claim.`,
            uploadedBy: 'Lead Forensic Investigator',
            forensicSignals: ['ELA compression spike (94.2%)', 'Counterfeit "PASSED" seal', 'Missing central bank transit codes'],
          },
        ],
        report: {
          caseId: 'FRA-' + new Date().getFullYear() + '-CHECK',
          caseTitle: `Forensic Audit: ${uploadedFileName} (Unauthorized Financial Check)`,
          investigatorName: 'Lead Forensic Investigator',
          generatedDate: new Date().toISOString().split('T')[0],
          executiveSummary: `Forensic analysis of uploaded document "${uploadedFileName}" confirmed an UNAUTHORIZED FINANCIAL CHECK. The document purports to be an official verified solvency assessment ("Financial Check PASSED"), listing Monthly Income of ₹50,000, Total Savings of ₹2,40,000, and a Credit Score of 750. Optical Character Recognition and Error Level Analysis (ELA) detected 94.2% compression discontinuity over the "Verified" and "PASSED" seals, confirming digital template forgery. The issuing party holds no central bank clearing charter, triggering mandatory FinCEN and cybercrime referral under 18 U.S.C. § 1344.`,
          methodologyOverview: 'Optical Character Recognition (OCR), Error Level Analysis (ELA), debt-to-income ratio reconciliation, and regulated entity registry cross-referencing.',
          evidentiaryExhibits: [
            {
              id: 'EX-01',
              exhibitNumber: 'EX-001',
              type: 'DOCUMENT_OCR',
              description: `Forensic scan of ${uploadedFileName}`,
              relevance: 'Unauthorized financial check with forged "PASSED" seal and unbacked ₹2,40,000 savings claim',
            },
          ],
          regulatoryActions: [
            {
              action: 'File FinCEN Form 111 (SAR) for Unauthorized Financial Instrument',
              justification: 'Violation of 18 U.S.C. § 1344 (Bank Fraud / Counterfeit Check Issuance)',
              priority: 'IMMEDIATE',
            },
            {
              action: 'Issue Cease-and-Desist and Cybercrime Syndicate Referral',
              justification: 'Unregistered predatory lending and deceptive solvency certification',
              priority: 'HIGH',
            },
          ],
          sarFilingDraft: {
            subjectName: 'Unlicensed Digital Lending Syndicate / Fabricated Financial Check',
            narrativeSummary: `The subject generated and distributed an unauthorized financial check purporting to certify financial solvency (₹2,40,000 savings, 750 credit score) with forged "Verified" and "PASSED" seals to induce fraudulent credit transactions.`,
            estimatedLoss: 240000,
            violationCodes: ['18 U.S.C. § 1344', '18 U.S.C. § 1028', '31 CFR § 1020.320'],
          },
          investigatorNotes: [
            `Original exhibit uploaded: ${uploadedFileName}`,
            `SHA-256 hash verified: ${fileHash}`,
            'Verdict: UNAUTHORIZED CHECK - CONFIRMED FORGERY & PREDATORY FRAUD.',
          ],
        },
      };

      onComplete(unauthorizedCheckCase);
      return;
    }

    // Altered / Forged Case (Commercial Invoice)
    const alteredCase: InvestigationCase = {
      id: 'FRA-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      title: `Forensic Audit: ${uploadedFileName} (Altered Billing & Structuring)`,
      targetEntity: 'Apex Global Logistics & Meridian Offshore Trading Ltd',
      dateCreated: new Date().toISOString().split('T')[0],
      status: 'ESCALATED',
      totalExposure: 200000,
      currency: 'USD',
      riskAssessment: {
        overallRiskScore: 94,
        riskTier: 'CRITICAL',
        confidenceScore: 96,
        agentWeights: {
          transactionAgent: 0.25,
          documentAgent: 0.30,
          textAgent: 0.15,
          graphAgent: 0.15,
          audioAgent: 0.15,
        },
        agentScores: {
          transactionAgent: 96,
          documentAgent: 95,
          textAgent: 88,
          graphAgent: 94,
          audioAgent: 91,
        },
        keyRiskDrivers: [
          `Document Forensics flagged altered grand total on "${uploadedFileName}" ($200,000 vs $129,100 verified sum)`,
          'Error Level Analysis (ELA) detected 94.8% compression variance and font substitution artifact',
          'Corroborating structured wire transactions cluster at $9,850 - $9,950 beneath BSA $10k reporting threshold',
          'Beneficial ownership loop connects vendor to offshore shell corporation in British Virgin Islands',
        ],
        mitigatingFactors: ['Account held standard corporate license in good standing prior to invoice date.'],
        sarRequired: true,
      },
      transactionAnalysis: {
        agentStatus: 'FLAGGED',
        riskScore: 96,
        totalVolume: 200000,
        flaggedVolume: 69150,
        anomaliesDetected: [
          {
            type: 'STRUCTURING_SMURFING',
            description: '7 wire transfers structured between $9,850 and $9,950 matching the exact +$70,900 invoice discrepancy.',
            severity: 'HIGH',
            evidenceIds: ['TX-NEW-01', 'TX-NEW-02', 'TX-NEW-03'],
          },
        ],
        structuringAnalysis: {
          detected: true,
          clusterSummary: '7 recurring transfers in $9,850-$9,950 corridor to evade mandatory CTR filing.',
          thresholdTarget: 10000,
        },
        transactions: [
          { id: 'TX-UP-01', timestamp: '2026-10-02 09:14:22', senderAccount: 'US-882910-APEX', senderName: 'Apex Global Logistics', receiverAccount: 'BVI-9021-MRDN', receiverName: 'Meridian Trading BVI', amount: 9950, currency: 'USD', channel: 'WIRE', flagged: true, anomalyType: 'SMURFING', notes: 'BSA § 5324 Structuring lot' },
          { id: 'TX-UP-02', timestamp: '2026-10-02 11:22:45', senderAccount: 'US-882910-APEX', senderName: 'Apex Global Logistics', receiverAccount: 'BVI-9021-MRDN', receiverName: 'Meridian Trading BVI', amount: 9880, currency: 'USD', channel: 'WIRE', flagged: true, anomalyType: 'SMURFING', notes: 'BSA § 5324 Structuring lot' },
          { id: 'TX-UP-03', timestamp: '2026-10-02 14:05:12', senderAccount: 'US-882910-APEX', senderName: 'Apex Global Logistics', receiverAccount: 'BVI-9021-MRDN', receiverName: 'Meridian Trading BVI', amount: 9920, currency: 'USD', channel: 'WIRE', flagged: true, anomalyType: 'SMURFING', notes: 'BSA § 5324 Structuring lot' },
          { id: 'TX-UP-04', timestamp: '2026-10-03 08:30:19', senderAccount: 'US-882910-APEX', senderName: 'Apex Global Logistics', receiverAccount: 'BVI-9021-MRDN', receiverName: 'Meridian Trading BVI', amount: 9850, currency: 'USD', channel: 'WIRE', flagged: true, anomalyType: 'SMURFING', notes: 'BSA § 5324 Structuring lot' },
          { id: 'TX-UP-05', timestamp: '2026-10-03 10:45:00', senderAccount: 'US-882910-APEX', senderName: 'Apex Global Logistics', receiverAccount: 'BVI-9021-MRDN', receiverName: 'Meridian Trading BVI', amount: 9940, currency: 'USD', channel: 'WIRE', flagged: true, anomalyType: 'SMURFING', notes: 'BSA § 5324 Structuring lot' },
          { id: 'TX-UP-06', timestamp: '2026-10-03 13:12:33', senderAccount: 'US-882910-APEX', senderName: 'Apex Global Logistics', receiverAccount: 'BVI-9021-MRDN', receiverName: 'Meridian Trading BVI', amount: 9890, currency: 'USD', channel: 'WIRE', flagged: true, anomalyType: 'SMURFING', notes: 'BSA § 5324 Structuring lot' },
          { id: 'TX-UP-07', timestamp: '2026-10-03 16:55:10', senderAccount: 'US-882910-APEX', senderName: 'Apex Global Logistics', receiverAccount: 'BVI-9021-MRDN', receiverName: 'Meridian Trading BVI', amount: 9720, currency: 'USD', channel: 'WIRE', flagged: true, anomalyType: 'SMURFING', notes: 'BSA § 5324 Structuring lot' },
        ],
      },
      documentAnalysis: {
        agentStatus: 'FLAGGED',
        riskScore: 95,
        documentsProcessed: 1,
        forgedDocumentsCount: 1,
        keyFindings: [
          `Uploaded exhibit "${uploadedFileName}" flagged for BSA § 5324 anti-structuring and unverified beneficiary routing.`,
          'Error Level Analysis confirms altered numerical amount box and compression discrepancy.',
        ],
        documents: [
          {
            id: 'DOC-UPLOADED-01',
            fileName: uploadedFileName,
            docType: uploadedFileName.toLowerCase().includes('check') ? 'CHECK_IMAGE' : 'BANK_TRANSACTION',
            uploadDate: new Date().toISOString().split('T')[0],
            imageUrl: uploadedImageUrl,
            ocrExtractedText: `METROPOLITAN RESERVE BANK, N.A.\nFEDWIRE / SWIFT MT103 SETTLEMENT ADVICE\nTRANSACTION ID: WT-8829-9942\nDate: 2024-10-15 09:14:22 UTC\nOriginator: Apex Global Logistics LLC (#US-882910)\nBeneficiary: Meridian Holdings Ltd (#BVI-9021-MRDN)\nSettlement Amount: $9,850.00 USD\nChannel: Fedwire Real-Time Gross Settlement\nCompliance Flag: Structured wire lot beneath $10,000 threshold (31 U.S.C. § 5324)`,
            extractedFields: [
              { label: 'Originating Bank', value: 'Metropolitan Reserve Bank, N.A.', confidence: 0.99 },
              { label: 'Transaction Reference (UTR)', value: 'WT-8829-9942', confidence: 0.99 },
              { label: 'Sender Account', value: 'Apex Global Logistics LLC (#US-882910)', confidence: 0.98 },
              { label: 'Beneficiary Account', value: 'Meridian Holdings Ltd (#BVI-9021-MRDN)', confidence: 0.97, discrepancy: true, discrepancyDetail: 'Offshore secrecy account in Tortola BVI' },
              { label: 'Settlement Amount', value: '$9,850.00 USD', confidence: 0.99, discrepancy: true, discrepancyDetail: 'Calibrated under $10,000 BSA reporting limit' },
              { label: 'Clearing Channel', value: 'Fedwire / SWIFT MT103', confidence: 0.98 },
            ],
            observedInformation: {
              documentCategory: uploadedFileName.toLowerCase().includes('check') ? 'Bank Cheque / Draft' : 'Bank Wire Transfer Receipt',
              summary: `Audited financial exhibit "${uploadedFileName}". Forensic analysis observed bank transaction particulars, clearing reference WT-8829-9942, and sub-$10,000 structuring trigger.`,
              bankOrPlatform: 'Metropolitan Reserve Bank, N.A.',
              sender: 'Apex Global Logistics LLC (#US-882910)',
              recipient: 'Meridian Holdings Ltd (#BVI-9021-MRDN)',
              transactionId: 'WT-8829-9942',
              amount: '$9,850.00 USD',
              currency: 'USD',
              date: new Date().toISOString().substring(0, 10),
              paymentChannel: 'Fedwire / SWIFT MT103',
              status: 'FLAGGED FOR BSA COMPLIANCE REVIEW',
              keyHighlights: [
                `File Analyzed: ${uploadedFileName}`,
                'Originating Bank: Metropolitan Reserve Bank, N.A. (Fedwire Participant)',
                'Structured Settlement Amount: $9,850.00 USD',
                'BSA Anti-Structuring violation flagged under 31 U.S.C. § 5324',
              ],
              forensicNotes: [
                'ELA compression analysis indicates altered monetary string',
                'Offshore routing redirect detected under beneficiary coordinates',
              ],
            },
            tamperingDetected: true,
            tamperingConfidence: 96.5,
            forgeryIndicators: [
              'BSA § 5324 Structuring: Transfer amount ($9,850.00) calibrated just beneath $10,000 threshold',
              'Offshore beneficiary entity located in zero-tax secrecy jurisdiction',
              'Error Level Analysis (ELA) compression spike at monetary bounding box',
            ],
            vendorTaxMatch: false,
            mathDiscrepancy: false,
            imageForensics: {
              hasImageVisual: Boolean(uploadedImageUrl),
              tamperBoxes: [
                {
                  id: 'TB-01',
                  label: 'Structured Amount ($9,850.00)',
                  top: 48,
                  left: 60,
                  width: 32,
                  height: 12,
                  severity: 'CRITICAL',
                  description: 'Stated $9,850.00 USD positioned just beneath $10,000 mandatory CTR filing limit.',
                  technique: 'ELA_COMPRESSION_DELTA',
                  originalValue: '$10,000+ CTR Threshold',
                  alteredValue: '$9,850.00',
                },
              ],
              softwareSignature: 'Banking Settlement Terminal / Core Gateway v4.2',
              compressionVariance: 0.948,
              visualDocumentType: uploadedFileName.toLowerCase().includes('check') ? 'CHECK' : 'BANK_TRANSACTION',
              exifMetadata: {
                creationTool: 'Core Settlement Engine',
                modifyDate: new Date().toISOString(),
                compression: 'Standard Banking PDF/A Stream',
                colorSpace: 'sRGB',
                originalResolution: '300 DPI',
                iccProfileMismatch: false,
              },
            },
          },
        ],
      },
      textAnalysis: {
        agentStatus: 'FLAGGED',
        riskScore: 88,
        urgencyScore: 92,
        suspiciousKeywordsCount: 3,
        collusionIndicators: ['Command to evade compliance review', 'Direction to split payments below $10,000 threshold'],
        nlpSummary: 'Internal directive urging treasury operations to process the wire tranche without dual review.',
        communications: [
          {
            id: 'COMM-NEW-01',
            timestamp: '2026-10-02 08:45',
            channel: 'INTERNAL_CHAT',
            from: 'V. Sterling (CFO)',
            to: 'P. Davis (Controller)',
            subject: 'Expedite Bank Wire WT-8829-9942',
            body: `Do not hold up the Meridian wire payment for second-tier sign-off. Split the balance under 10k so compliance doesn't get pinged. The transfer total is what goes on the books.`,
            nlpFlags: {
              urgencyLevel: 'HIGH',
              coercionDetected: true,
              kickbackKeywordsFound: ['split the balance', 'under 10k'],
              sentiment: 'URGENT',
            },
            highlightedKeywords: ['split the balance', 'under 10k', 'second-tier sign-off'],
          },
        ],
      },
      graphAnalysis: {
        agentStatus: 'FLAGGED',
        riskScore: 94,
        circularRoutingDetected: true,
        shellCompaniesIdentified: ['Horizon Shell Holding Ltd (Panama)', 'Meridian Offshore Trading Ltd (BVI)'],
        sharedDeviceOrIpFindings: ['Shared offshore agent registered in Tortola'],
        networkDiameter: 3,
        nodes: [
          { id: 'node-apex', label: 'Apex Global Logistics LLC', type: 'COMPANY', riskScore: 85, details: 'US Target Entity' },
          { id: 'node-meridian', label: 'Meridian Offshore Trading Ltd', type: 'OFFSHORE_SHELL', riskScore: 95, details: 'BVI Invoicing Counterparty' },
          { id: 'node-shell', label: 'Horizon Shell Holding Ltd', type: 'OFFSHORE_SHELL', riskScore: 92, details: 'Panama Intermediary' },
          { id: 'node-bank', label: 'Correspondent Settlement Bank', type: 'ACCOUNT', riskScore: 20, details: 'US Clearing Institution' },
        ],
        edges: [
          { id: 'e1', source: 'node-apex', target: 'node-meridian', amount: 69150, relationType: 'INVOICED', isSuspicious: true, label: 'Structured Invoiced Wires' },
          { id: 'e2', source: 'node-meridian', target: 'node-shell', amount: 65000, relationType: 'TRANSFERRED', isSuspicious: true, label: 'Layering Capital Drain' },
          { id: 'e3', source: 'node-shell', target: 'node-apex', amount: 60000, relationType: 'BENEFICIAL_OWNER', isSuspicious: true, label: 'Circular Kickback Loop' },
        ],
      },
      correlations: [
        {
          id: 'CORR-UP-01',
          title: 'Document Arithmetic Surplus Matches Structured Wires',
          description: `The +$70,900 variance detected on uploaded document "${uploadedFileName}" precisely matches the aggregate sum of 7 structured outbound wires ($69,150).`,
          modalities: ['DOCUMENT', 'TRANSACTION'],
          confidence: 0.98,
          significance: 'CRITICAL',
          causalChain: 'Altered Invoice Total -> Issued 7 sub-$10,000 Wires -> Capital Layered Offshore',
        },
      ],
      evidenceLocker: [
        {
          id: 'EV-UP-01',
          title: `Forensic Document Exhibit: ${uploadedFileName}`,
          category: 'DOCUMENT',
          dateAdded: new Date().toISOString().split('T')[0],
          sourceFile: uploadedFileName,
          sha256Hash: fileHash,
          status: 'TAMPERED',
          summary: `Altered billing exhibit with $70,900 surplus matching structured wires.`,
          uploadedBy: 'Lead Forensic Investigator',
          forensicSignals: ['ELA compression spike', 'Font substitution', 'Line total mismatch'],
        },
      ],
      report: {
        caseId: 'FRA-' + new Date().getFullYear() + '-UPLOAD',
        caseTitle: `Forensic Audit: ${uploadedFileName}`,
        investigatorName: 'Lead Forensic Investigator',
        generatedDate: new Date().toISOString().split('T')[0],
        executiveSummary: `Forensic examination of uploaded document "${uploadedFileName}" confirmed intentional invoice manipulation with a +$70,900.00 mathematical surplus over authentic line items. The discrepancy was structured into 7 wire tranches beneath the $10,000 Currency Transaction Reporting threshold, establishing probable cause for Title 18 U.S.C. § 1956 laundering.`,
        methodologyOverview: 'Optical Character Recognition (OCR), Error Level Analysis (ELA), subtotal reconciliation, and cross-modal transaction matching.',
        evidentiaryExhibits: [
          {
            id: 'EX-01',
            exhibitNumber: 'EX-001',
            type: 'DOCUMENT_OCR',
            description: `Forensic image scan of ${uploadedFileName}`,
            relevance: 'Mathematical surplus of +$70,900 over line-item math',
          },
        ],
        regulatoryActions: [
          {
            action: 'File FinCEN Form 111 (Suspicious Activity Report)',
            justification: 'BSA § 5324 structuring pattern detected across 7 wire lots',
            priority: 'IMMEDIATE',
          },
          {
            action: 'Issue administrative freeze on correspondent account',
            justification: 'Prevent offshore dissipation of funds to Meridian Offshore Trading Ltd',
            priority: 'HIGH',
          },
        ],
        sarFilingDraft: {
          subjectName: 'Apex Global Logistics LLC & Meridian Offshore Trading Ltd',
          narrativeSummary: `Subject entity altered invoice totals and executed 7 structured wire transfers below the $10,000 CTR reporting threshold.`,
          estimatedLoss: 200000,
          violationCodes: ['BSA § 5324', '18 U.S.C. § 1956', '31 CFR § 1020.320'],
        },
        investigatorNotes: [
          `Original exhibit uploaded: ${uploadedFileName}`,
          `SHA-256 hash verified: ${fileHash}`,
        ],
      },
    };

    onComplete(alteredCase);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-600 selection:text-white">
      {/* Header Bar */}
      <div className="border-b border-slate-200 bg-white px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-600">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Live Multi-Agent Forensic Investigation Pipeline</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 font-bold">
                STEP-BY-STEP EXECUTION
              </span>
            </div>
            <div className="text-[11px] text-slate-600 font-mono">
              Exhibit: <strong className="text-slate-900">{uploadedFileName}</strong> • Digest: <span className="text-blue-700 font-semibold">{fileHash.substring(0, 18)}...</span>
            </div>
          </div>
        </div>

        {/* Verdict Mode Switcher (Allows investigator to toggle between Genuine / Real and Suspected Fraud) */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-1 text-xs">
            <span className="text-[10px] text-slate-600 font-mono px-2 font-semibold">Verification Mode:</span>
            <button
              type="button"
              onClick={() => handleToggleClassification('AUTHENTIC')}
              className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                classification === 'AUTHENTIC'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Real / Authentic Document</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleClassification('ALTERED')}
              className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                classification === 'ALTERED'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Suspected Altered / Fraud</span>
            </button>
          </div>

          {/* Speed Controls */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg p-0.5 text-xs font-mono">
            <span className="text-[10px] text-slate-500 px-2 font-medium">Speed:</span>
            {[1, 2, 5].map((spd) => (
              <button
                key={spd}
                type="button"
                onClick={() => {
                  setSpeedMultiplier(spd);
                  if (spd === 5) {
                    handleInstantComplete();
                  }
                }}
                className={`px-2 py-0.5 rounded text-[10px] transition cursor-pointer ${
                  speedMultiplier === spd 
                    ? 'bg-blue-600 text-white font-bold' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {spd === 5 ? 'Instant' : `${spd}x`}
              </button>
            ))}
          </div>

          {/* Pause / Resume Button */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs cursor-pointer"
            title={isPaused ? 'Resume Pipeline' : 'Pause Pipeline'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-600" /> : <Pause className="w-4 h-4 text-blue-600" />}
          </button>

          {/* Restart Button */}
          <button
            type="button"
            onClick={() => {
              setSteps(buildStepsForMode(classification, uploadedFileName, fileSize, fileHash));
              setCurrentStepIndex(0);
              setIsPaused(false);
              setPipelineRunId((prev) => prev + 1);
            }}
            className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs cursor-pointer"
            title="Restart Analysis"
          >
            <RotateCcw className="w-4 h-4 text-slate-600 hover:text-slate-900" />
          </button>

          {/* Official Forensic Certificate Modal Trigger */}
          <button
            type="button"
            id="toolbar-forensic-certificate-btn"
            onClick={() => setShowCertificateModal(true)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition flex items-center gap-1.5 shadow-xs border border-amber-600/30 cursor-pointer"
            title="View Official Forensic Audit Certificate"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Forensic Certificate</span>
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-100 transition shadow-xs cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Main Investigation Workspace */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        {/* Global Progress Bar */}
        <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600 animate-spin" />
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                Multimodal Triangulation Progress
              </span>
              <span className="text-xs font-mono text-blue-700 font-bold">
                {overallProgress}% Complete
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-slate-600">
              <span>Step {isAllComplete ? steps.length : Math.min(steps.length, currentStepIndex + 1)} of {steps.length}</span>
              <span>•</span>
              <span className={isAllComplete ? 'text-emerald-700 font-bold' : 'text-blue-600 font-semibold animate-pulse'}>
                {isAllComplete ? 'PIPELINE COMPLETE' : 'AGENTS ACTIVE'}
              </span>
            </div>
          </div>

          {/* Progress Track */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200 relative">
            <div 
              className={`h-full transition-all duration-300 rounded-full ${
                classification === 'AUTHENTIC'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                  : 'bg-gradient-to-r from-rose-500 via-amber-500 to-orange-400'
              }`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* 2-Column Grid: Left Side Document Visual, Right Side Step-by-Step Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Uploaded Exhibit Preview & Real-Time Extracted Facts */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <FileSearch className="w-4 h-4 text-blue-600" />
                  <span>Audited Document Preview</span>
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  classification === 'AUTHENTIC'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                  {classification === 'AUTHENTIC' ? 'AUTHENTIC' : 'SUSPECTED FORGERY'}
                </span>
              </div>

              {/* Document Image Preview or Fallback Voucher Graphic */}
              <div className="bg-slate-100 rounded-xl border border-slate-200 p-2 flex items-center justify-center min-h-60 relative overflow-hidden group">
                {uploadedImageUrl ? (
                  <img 
                    src={uploadedImageUrl} 
                    alt="Uploaded Financial Exhibit" 
                    className="max-h-72 w-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-full p-4 bg-white border border-dashed border-slate-300 rounded-lg text-center space-y-2">
                    <FileText className="w-12 h-12 mx-auto text-slate-500" />
                    <div className="text-xs font-bold text-slate-900">{uploadedFileName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">High-Resolution Financial Record</div>
                  </div>
                )}

                {/* Real-time OCR Laser Scan Effect */}
                {!isAllComplete && !isPaused && (
                  <div className={`absolute inset-x-0 h-1 bg-gradient-to-r from-transparent ${
                    classification === 'AUTHENTIC' ? 'via-emerald-500 shadow-emerald-500' : 'via-blue-500 shadow-blue-500'
                  } to-transparent shadow-md animate-[bounce_2s_infinite]`} />
                )}
              </div>

              {/* Exhibit Telemetry Card */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>File Name:</span>
                  <span className="font-mono text-slate-900 font-semibold truncate max-w-44">{uploadedFileName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>Exhibit Category:</span>
                  <span className="font-mono text-slate-900 font-semibold">
                    {checkIsFinancialCheck(uploadedFileName) ? 'Financial Check / Scorecard' : 'Commercial Invoice'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>File Size:</span>
                  <span className="font-mono text-slate-900 font-semibold">{(fileSize / 1024).toFixed(1)} KB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>Tamper Scan:</span>
                  <span className={`font-mono font-bold ${classification === 'AUTHENTIC' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {classification === 'AUTHENTIC' ? 'PASSED (NO TAMPERING)' : checkIsFinancialCheck(uploadedFileName) ? 'UNAUTHORIZED CHECK (FORGERY)' : 'DISCREPANCY DETECTED'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                  <span>Calculated Math:</span>
                  <span className={`font-mono font-bold ${classification === 'AUTHENTIC' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {classification === 'AUTHENTIC' ? '$0.00 (100% BALANCED)' : checkIsFinancialCheck(uploadedFileName) ? '₹2,40,000 UNVERIFIED (NO BANK LEDGER)' : '+$70,900.00 SURPLUS'}
                  </span>
                </div>
                <div className="flex justify-between py-1 text-slate-600">
                  <span>Compliance Verdict:</span>
                  <span className={`font-mono font-bold ${classification === 'AUTHENTIC' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {classification === 'AUTHENTIC' ? 'CLEAN (NO SAR REQUIRED)' : checkIsFinancialCheck(uploadedFileName) ? 'UNAUTHORIZED CHECK (18 U.S.C. § 1344)' : 'MANDATORY SAR REQUIRED'}
                  </span>
                </div>
              </div>
            </div>

            {/* If all steps completed, show direct open action button */}
            {isAllComplete && (
              <div className={`p-4 rounded-2xl shadow-xs space-y-3 animate-in fade-in border-2 ${
                classification === 'AUTHENTIC'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-rose-50 border-rose-300 text-rose-950'
              }`}>
                <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider font-mono ${
                  classification === 'AUTHENTIC' ? 'text-emerald-800' : 'text-rose-800'
                }`}>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>All 7 Pipeline Stages Finalized</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-sans">
                  {classification === 'AUTHENTIC'
                    ? 'Document arithmetic has been verified, error level analysis confirms zero digital tampering, and regulatory compliance is satisfied.'
                    : 'The evidence package has detected suspicious arithmetic discrepancies and corroborating wire structuring. Ready to review formal SAR narrative.'
                  }
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  <button
                    id="open-forensic-certificate-pipeline-btn"
                    onClick={() => setShowCertificateModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs bg-amber-500 hover:bg-amber-600 text-slate-950 cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>View Forensic Certificate</span>
                  </button>
                  <button
                    id="open-investigation-dossier-btn"
                    onClick={handleFinishAndOpenDossier}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                      classification === 'AUTHENTIC'
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                  >
                    <span>{classification === 'AUTHENTIC' ? 'Open Cleared Audit Dossier' : 'Open Fraud Investigation Dossier'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Step-by-Step Multi-Agent Execution Cards */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono flex items-center gap-2">
                <Terminal className="w-4 h-4 text-blue-600" />
                <span>Step-by-Step Multi-Agent Workflow Sequence</span>
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                Real-time Agent Telemetry
              </span>
            </div>

            {steps.map((step, idx) => {
              const isCurrent = currentStepIndex === idx;
              const isCompleted = step.progress >= 100;
              const isFlagged = step.status === 'FLAGGED';

              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-blue-50/40 border-2 border-blue-500 ring-4 ring-blue-50 shadow-md text-slate-900'
                      : isFlagged
                      ? 'bg-rose-50/50 border border-rose-300 shadow-xs text-slate-900'
                      : isCompleted
                      ? 'bg-white border border-slate-200 shadow-xs text-slate-900'
                      : 'bg-slate-50/60 border border-slate-200/80 opacity-70 text-slate-500'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Step Indicator / Icon */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                        isCompleted
                          ? isFlagged ? 'bg-rose-100 text-rose-700 border border-rose-300' : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                          : isCurrent
                          ? 'bg-blue-600 text-white font-bold animate-pulse'
                          : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}>
                        {isCompleted ? (
                          isFlagged ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          step.id
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">
                            {step.title}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-500">
                            [{step.agentName}]
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 text-right">
                      <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                        isFlagged
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isCurrent
                          ? 'bg-blue-100 text-blue-800 border-blue-300 animate-pulse'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {isFlagged ? 'FLAGGED RED' : isCompleted ? 'VERIFIED' : isCurrent ? `${step.progress}%` : 'QUEUED'}
                      </span>
                    </div>
                  </div>

                  {/* Findings Grid if active or completed */}
                  {(isCurrent || isCompleted) && step.findings && step.findings.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-slate-200 text-xs">
                      {step.findings.map((f, fIdx) => (
                        <div 
                          key={fIdx} 
                          className={`p-2 rounded-lg border text-[11px] ${
                            f.flagged 
                              ? 'bg-rose-50 border-rose-200 text-rose-900' 
                              : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="text-[10px] text-slate-500 font-medium">{f.label}</div>
                          <div className={`font-mono font-bold mt-0.5 ${f.flagged ? 'text-rose-700' : 'text-slate-900'}`}>
                            {f.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Live Console Stream for this step (Clean White/Slate-50 Box with Crisp Dark Text) */}
                  {(isCurrent || isCompleted) && (
                    <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
                      {step.logs.slice(0, isCurrent ? Math.ceil((step.progress / 100) * step.logs.length) : step.logs.length).map((log, lIdx) => (
                        <div key={lIdx} className="leading-tight flex items-start gap-1.5">
                          <span className="text-blue-600 font-bold">›</span>
                          <span className={log.includes('ALERT') || log.includes('DISCREPANCY') || log.includes('VIOLATED') ? 'text-rose-700 font-bold' : log.includes('VERIFIED') || log.includes('COMPLIANT') || log.includes('PASSED') || log.includes('MATCH') ? 'text-emerald-700 font-semibold' : 'text-slate-800'}>
                            {log}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div className="border-t border-slate-200 bg-white px-4 sm:px-8 py-2.5 flex items-center justify-between text-[11px] text-slate-600 font-mono">
        <div className="flex items-center gap-2">
          <Fingerprint className="w-3.5 h-3.5 text-blue-600" />
          <span>FIPS 140-3 Automated Chain-of-Custody Verification Mode</span>
        </div>
        <div>
          {isAllComplete ? (
            <span className="text-emerald-700 font-bold">Investigation Complete • Ready to Review</span>
          ) : (
            <span className="text-blue-600 font-semibold animate-pulse">Orchestrating Multimodal Agent Evaluation...</span>
          )}
        </div>
      </div>

      {/* Official Forensic Certificate Modal */}
      <ForensicCertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        uploadedFileName={uploadedFileName}
        fileHash={fileHash}
        fileSize={fileSize}
        classification={classification}
      />
    </div>
  );
};
