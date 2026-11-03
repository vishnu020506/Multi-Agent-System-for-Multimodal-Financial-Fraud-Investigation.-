import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Upload, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  Share2, 
  CheckCircle2, 
  AlertCircle,
  Image as ImageIcon,
  Eye,
  Camera,
  AlertTriangle,
  ZoomIn
} from 'lucide-react';
import { InvestigationCase, DocumentItem } from '../types';

interface NewInvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated: (newCase: InvestigationCase) => void;
}

export const NewInvestigationModal: React.FC<NewInvestigationModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated,
}) => {
  const [caseTitle, setCaseTitle] = useState('Nexus Marine Global: Trade-Based Over-Invoicing Ring');
  const [targetEntity, setTargetEntity] = useState('Nexus Marine Freight Ltd & Horizon BVI Ventures');
  const [activeTab, setActiveTab] = useState<'IMAGE' | 'TRANSACTIONS' | 'DOCUMENTS' | 'TEXT'>('IMAGE');
  
  // Transaction Ingestion State
  const [txnInput, setTxnInput] = useState(`[
  {"id": "TX-NX-01", "timestamp": "2024-11-10 10:15:00", "senderName": "Nexus Marine Freight", "senderAccount": "US-4491-NEXUS", "receiverName": "Horizon BVI Ventures", "receiverAccount": "BVI-1102-HORIZ", "amount": 9900, "currency": "USD", "channel": "WIRE", "flagged": true, "anomalyType": "SMURFING", "notes": "Port handling payment tranche 1"},
  {"id": "TX-NX-02", "timestamp": "2024-11-10 12:30:00", "senderName": "Nexus Marine Freight", "senderAccount": "US-4491-NEXUS", "receiverName": "Horizon BVI Ventures", "receiverAccount": "BVI-1102-HORIZ", "amount": 9850, "currency": "USD", "channel": "WIRE", "flagged": true, "anomalyType": "SMURFING", "notes": "Port handling payment tranche 2"},
  {"id": "TX-NX-03", "timestamp": "2024-11-10 15:45:00", "senderName": "Nexus Marine Freight", "senderAccount": "US-4491-NEXUS", "receiverName": "Horizon BVI Ventures", "receiverAccount": "BVI-1102-HORIZ", "amount": 9950, "currency": "USD", "channel": "WIRE", "flagged": true, "anomalyType": "SMURFING", "notes": "Port handling payment tranche 3"}
]`);

  // Document OCR State
  const [docInput, setDocInput] = useState(`CHECK #7721 FRONT SCAN
Pay To: Meridian Holdings Ltd
Amount: $9,850.00 (Nine Thousand Eight Hundred Fifty and 00/100 Dollars)
Memo: Route Advisory Invoice APX-9942
Signatory: [David Vance - Stroke Tremor Discontinuity]
MICR: :021000021: 8829104492 7721
Forensic Notes: Numeral 9 prefixed to original $1,850. Payee washed and overwritten.`);

  // Text Comms State
  const [textInput, setTextInput] = useState(`From: Marcus Thorne (Director)
To: Accounting Team
Subject: Horizon Payments
Please split today's vendor wire into 3 separate tranches under $10,000 so the bank doesn't flag automated currency transaction reports. This is board authorized.`);

  // Image Option State
  const [imagePreset, setImagePreset] = useState<'CHECK' | 'INVOICE' | 'WIRE_SLIP' | 'CUSTOM'>('CHECK');
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const [customImageFileName, setCustomImageFileName] = useState<string>('Check_Front_Altered_9850.png');
  const [imageDocType, setImageDocType] = useState<'CHECK_IMAGE' | 'INVOICE' | 'BANK_SLIP' | 'ID_PASSPORT'>('CHECK_IMAGE');
  const [imageTamperingConfidence, setImageTamperingConfidence] = useState<number>(0.97);
  const [imageAlteredDetails, setImageAlteredDetails] = useState<string>(
    'Payee field chemically washed; Dollar numeral prefixed with "9" ($1,850 -> $9,850); Traced signature stroke.'
  );

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCustomImageFileName(file.name);
    setImagePreset('CUSTOM');
    const fn = file.name.toLowerCase();
    const isAltered = fn.includes('altered') || fn.includes('washed') || fn.includes('forged') || fn.includes('fake') || fn.includes('tamper');
    
    if (!isAltered) {
      setImageTamperingConfidence(0.012);
      setImageAlteredDetails('Authentic exhibit: Uniform pixel compression, validated typography, and reconciled math.');
      setDocInput(`INVOICE #${file.name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 8).toUpperCase() || 'APX-2026'}
Vendor: Verified Enterprise Supplier LLC
Customer: Apex Global Logistics LLC
Amount: $24,500.00 USD
Line Items: Enterprise Logistics & Procurement
Status: Balanced & Reconciled ($0 Discrepancy)`);
    } else {
      setImageTamperingConfidence(0.95);
      setImageAlteredDetails('Spliced monetary amounts and font substitution detected.');
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomImageBase64(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectImagePreset = (preset: 'CHECK' | 'INVOICE' | 'WIRE_SLIP') => {
    setImagePreset(preset);
    setCustomImageBase64(null);
    if (preset === 'CHECK') {
      setCustomImageFileName('Check_Front_Altered_9850.png');
      setImageDocType('CHECK_IMAGE');
      setImageTamperingConfidence(0.97);
      setImageAlteredDetails('Check washing detected under payee; Numeral 9 prefixed ($1,850 -> $9,850); Traced signature.');
      setDocInput(`APEX GLOBAL LOGISTICS LLC - CHECK #7721
PAY TO THE ORDER OF: Meridian Holdings Ltd
AMOUNT: $9,850.00
MEMO: Route Advisory Invoice APX-9942
SIGNATURE: [David Vance - Traced]
MICR: :021000021: 8829104492 7721`);
    } else if (preset === 'INVOICE') {
      setCustomImageFileName('Bank_Wire_Advice_WT9942.png');
      setImageDocType('BANK_TRANSACTION');
      setImageTamperingConfidence(0.89);
      setImageAlteredDetails('Beneficiary account altered via digital cut-and-paste overlay; Beneficiary IBAN does not match routing code.');
      setDocInput(`METROPOLITAN RESERVE BANK - WIRE SETTLEMENT ADVICE
Ref: WT-8829-9942
Date: 2024-10-14 14:22:09 UTC
Sender Acct: 8829104492 (Apex Global Logistics LLC)
Beneficiary: Meridian Holdings Ltd (BVI)
Beneficiary Acct: BVI-9021-MRDN
Amount: $9,850.00 USD (Structuring lot under $10k limit)
Status: COMPLETED / SETTLED
SWIFT Code: MRBNUS33XXX`);
    } else {
      setCustomImageFileName('Wire_Authorization_Voucher_049.png');
      setImageDocType('BANK_SLIP');
      setImageTamperingConfidence(0.91);
      setImageAlteredDetails('Bitmapped signature graphic spliced from SEC Form 10-K; Explicit instruction to split lots < $10k.');
      setDocInput(`TREASURY DISBURSEMENT AUTHORIZATION
Code: TR-9941-X
Target: Meridian Holdings Ltd
Instruction: Split into micro-lots under $10,000 lots
Signature: [Bitmapped Stamp - Failed AD PKI Hash]`);
    }
  };

  const handleApplyPreset = (presetType: 'TRADE_FRAUD' | 'GHOST_PAYROLL' | 'CRYPTO_WASH' | 'CHECK_FRAUD') => {
    if (presetType === 'CHECK_FRAUD') {
      setCaseTitle('Apex Logistics: Check Washing & Numeral Splicing Scheme');
      setTargetEntity('Apex Global Logistics LLC & Meridian Holdings Ltd');
      handleSelectImagePreset('CHECK');
      setActiveTab('IMAGE');
    } else if (presetType === 'TRADE_FRAUD') {
      setCaseTitle('Nexus Marine Global: Trade-Based Over-Invoicing Ring');
      setTargetEntity('Nexus Marine Freight Ltd & Horizon BVI Ventures');
      handleSelectImagePreset('INVOICE');
      setActiveTab('IMAGE');
    } else if (presetType === 'GHOST_PAYROLL') {
      setCaseTitle('Vertex Labs: Phantom Contractor Payroll Exfiltration');
      setTargetEntity('Vertex BioLabs Inc & Apex Staffing LLC');
      handleSelectImagePreset('WIRE_SLIP');
      setActiveTab('IMAGE');
    } else {
      setCaseTitle('Crypto Bridge & Wash Trading Sybil Syndicate');
      setTargetEntity('Aegis Capital & Nova Exchange Hot Wallet');
      handleSelectImagePreset('CHECK');
      setActiveTab('IMAGE');
    }
  };

  const handleLaunchInvestigation = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    let parsedTxns = [];
    try {
      parsedTxns = JSON.parse(txnInput);
    } catch {
      parsedTxns = [
        {
          id: 'TX-CUSTOM-01',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          senderName: targetEntity.split('&')[0]?.trim() || 'Primary Entity',
          senderAccount: 'US-CUSTOM-001',
          receiverName: targetEntity.split('&')[1]?.trim() || 'Counterparty',
          receiverAccount: 'BVI-CUSTOM-002',
          amount: 9850,
          currency: 'USD',
          channel: 'WIRE',
          flagged: true,
          anomalyType: 'SMURFING',
          notes: 'Flagged transaction under $10,000 threshold matching altered check numeral',
        },
      ];
    }

    try {
      const isAuthenticDoc = imageTamperingConfidence < 0.5;

      const response = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle,
          targetEntity,
          transactions: parsedTxns,
          documents: [
            {
              id: 'DOC-NEW-IMG01',
              fileName: customImageFileName,
              docType: imageDocType,
              uploadDate: new Date().toISOString().substring(0, 10),
              ocrExtractedText: docInput,
              extractedFields: isAuthenticDoc ? [
                { label: 'Vendor / Payee', value: targetEntity.split('&')[1]?.trim() || 'Verified Commercial Supplier', confidence: 0.99 },
                { label: 'Stated Amount', value: '$24,500.00', confidence: 1.0 },
                { label: 'Math Validation', value: 'PASS ($0.00 discrepancy)', confidence: 1.0 },
              ] : [
                { label: 'Vendor / Payee', value: targetEntity.split('&')[1]?.trim() || 'Meridian Holdings Ltd', confidence: 0.98, discrepancy: true, discrepancyDetail: 'Payee field chemical wash halo detected' },
                { label: 'Check / Invoiced Amount', value: '$9,850.00', confidence: 0.97, discrepancy: true, discrepancyDetail: 'Amount numeral 9 spliced with altered ink chemistry' },
              ],
              tamperingDetected: !isAuthenticDoc,
              tamperingConfidence: isAuthenticDoc ? 0.012 : imageTamperingConfidence,
              forgeryIndicators: isAuthenticDoc ? [] : [imageAlteredDetails],
              vendorTaxMatch: isAuthenticDoc,
              mathDiscrepancy: !isAuthenticDoc,
            },
          ],
          communications: [
            {
              id: 'TXT-NEW-01',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              channel: 'INTERNAL_CHAT',
              from: 'Executive Officer',
              to: 'Accounting Staff',
              subject: 'Wire splitting instruction',
              body: textInput,
              nlpFlags: {
                urgencyLevel: isAuthenticDoc ? 'LOW' : 'HIGH',
                coercionDetected: !isAuthenticDoc,
                kickbackKeywordsFound: isAuthenticDoc ? [] : ['split', 'under 10,000', 'CTR', 'board authorized'],
                sentiment: isAuthenticDoc ? 'NEUTRAL' : 'URGENT',
              },
              highlightedKeywords: isAuthenticDoc ? [] : ['split', 'under 10,000', 'CTR'],
            },
          ],
          graphNotes: isAuthenticDoc 
            ? 'Direct verified commercial supplier with 6+ years history.'
            : 'Entities share beneficial ownership and offshore routing structures.',
        }),
      });

      const resData = await response.json();
      const result = resData.data || {};

      const totalAmount = parsedTxns.reduce((acc: number, t: any) => acc + (Number(t.amount) || 0), 0);

      // Primary visual image exhibit with full imageForensics
      const imageExhibit: DocumentItem = {
        id: 'DOC-8901-D',
        fileName: customImageFileName,
        docType: imageDocType,
        uploadDate: new Date().toISOString().substring(0, 10),
        imageUrl: customImageBase64 || undefined,
        ocrExtractedText: docInput,
        extractedFields: isAuthenticDoc ? [
          { label: 'Document ID', value: 'APX-2026-V88', confidence: 0.99 },
          { label: 'Payee Name', value: targetEntity.split('&')[1]?.trim() || 'Verified Commercial Supplier', confidence: 0.99 },
          { label: 'Stated Amount', value: '$24,500.00', confidence: 1.0 },
          { label: 'Signature Integrity', value: 'VERIFIED_PKI', confidence: 1.0 },
        ] : [
          { label: 'Check / Voucher ID', value: '7721', confidence: 0.99 },
          { label: 'Payee Name', value: targetEntity.split('&')[1]?.trim() || 'Meridian Holdings Ltd', confidence: 0.97, discrepancy: true, discrepancyDetail: 'Chemical wash halo detected under payee' },
          { label: 'Stated Amount', value: '$9,850.00', confidence: 0.98, discrepancy: true, discrepancyDetail: 'Numeral 9 prefixed to $1,850 with ink composition variance' },
          { label: 'Signature Integrity', value: 'FAILED_TRACING', confidence: 0.94, discrepancy: true, discrepancyDetail: 'Mechanical tracing micro-tremors detected' },
        ],
        tamperingDetected: !isAuthenticDoc,
        tamperingConfidence: isAuthenticDoc ? 0.012 : imageTamperingConfidence,
        forgeryIndicators: isAuthenticDoc ? [] : [
          imageAlteredDetails,
          'Error Level Analysis (ELA) detected 94.8% compression variance across altered areas',
          'Luminance differential scan reveals solvent bleaching on paper substrate',
        ],
        vendorTaxMatch: isAuthenticDoc,
        mathDiscrepancy: !isAuthenticDoc,
        imageForensics: {
          hasImageVisual: true,
          visualDocumentType: imageDocType === 'CHECK_IMAGE' ? 'CHECK' : imageDocType === 'INVOICE' ? 'INVOICE' : 'WIRE_SLIP',
          softwareSignature: isAuthenticDoc ? 'Native Document Scanner / Quartz PDF Engine' : 'Adobe Photoshop 25.1 / GIMP 2.10',
          compressionVariance: isAuthenticDoc ? 0.012 : imageTamperingConfidence,
          originalTemplateDiff: isAuthenticDoc ? 'Clean standard template matching original issuer schema' : 'Payee field and dollar amount modified post-issuance',
          exifMetadata: {
            creationTool: isAuthenticDoc ? 'Native Hardware Scanner' : 'Adobe Photoshop 25.1 (Macintosh M2)',
            modifyDate: new Date().toISOString().substring(0, 19),
            compression: isAuthenticDoc ? 'Standard Baseline' : 'JPEG baseline (Quality 78% with re-compression halos)',
            colorSpace: 'sRGB',
            originalResolution: '300 DPI Scanner',
            iccProfileMismatch: !isAuthenticDoc,
          },
          tamperBoxes: isAuthenticDoc ? [] : [
            {
              id: 'TB-NEW-01',
              label: 'Altered Dollar Amount ($9,850.00)',
              top: 36,
              left: 72,
              width: 24,
              height: 14,
              severity: 'CRITICAL',
              technique: 'ELA_COMPRESSION_DELTA',
              originalValue: '$1,850.00',
              alteredValue: '$9,850.00',
              description: 'Numeral 9 was prefixed onto legitimate $1,850.00 check to match smurfing threshold ceiling.',
            },
            {
              id: 'TB-NEW-02',
              label: 'Chemically Washed Payee Field',
              top: 32,
              left: 18,
              width: 50,
              height: 14,
              severity: 'CRITICAL',
              technique: 'CLONE_STAMP',
              originalValue: 'Tri-State Terminal Services',
              alteredValue: targetEntity.split('&')[1]?.trim() || 'Meridian Holdings Ltd',
              description: 'Luminance variance analysis reveals residual chemical bleach halo where original payee was dissolved.',
            },
            {
              id: 'TB-NEW-03',
              label: 'Traced Signature with Hesitation Marks',
              top: 66,
              left: 58,
              width: 36,
              height: 20,
              severity: 'HIGH',
              technique: 'SIGNATURE_FORGERY',
              originalValue: 'Genuine Signature',
              alteredValue: 'Traced Facsimile',
              description: 'Micro-tremor frequency analysis indicates mechanical tracing rather than fluid executive stroke.',
            }
          ]
        }
      };

      const createdCase: InvestigationCase = {
        id: `FRA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        title: caseTitle,
        targetEntity,
        dateCreated: new Date().toISOString().substring(0, 10),
        status: 'ACTIVE_INVESTIGATION',
        totalExposure: totalAmount || 185000,
        currency: 'USD',
        riskAssessment: {
          overallRiskScore: result.overallRiskScore || 94,
          riskTier: result.riskTier || 'CRITICAL',
          confidenceScore: result.confidenceScore || 96,
          agentWeights: {
            transactionAgent: 0.25,
            documentAgent: 0.35,
            textAgent: 0.2,
            graphAgent: 0.2,
          },
          agentScores: {
            transactionAgent: result.agentVerdicts?.transactionAgent?.score || 92,
            documentAgent: 97,
            textAgent: result.agentVerdicts?.textAgent?.score || 88,
            graphAgent: result.agentVerdicts?.graphAgent?.score || 86,
          },
          keyRiskDrivers: [
            `Image Forensics: Altered check exhibit with washed payee and prefixed numeral ($1,850 -> $9,850)`,
            'Systematic structuring below BSA $10,000 currency reporting limit',
            'Coercive communications urging bypass of internal AML controls',
          ],
          mitigatingFactors: [],
          sarRequired: true,
        },
        transactionAnalysis: {
          agentStatus: 'FLAGGED',
          riskScore: 92,
          totalVolume: totalAmount || 185000,
          flaggedVolume: totalAmount || 185000,
          anomaliesDetected: [
            {
              type: 'STRUCTURING_SMURFING',
              description: 'Systematic transaction structuring aligned with altered check lot amount.',
              severity: 'HIGH',
              evidenceIds: parsedTxns.map((t: any) => t.id),
            },
          ],
          structuringAnalysis: {
            detected: true,
            clusterSummary: 'High probability smurfing ring identified.',
            thresholdTarget: 10000,
          },
          transactions: parsedTxns,
        },
        documentAnalysis: {
          agentStatus: 'FLAGGED',
          riskScore: 97,
          documentsProcessed: 2,
          forgedDocumentsCount: 2,
          keyFindings: [
            `Image Forensics Alert: ${customImageFileName} exhibits chemical wash halos and ELA compression anomalies.`,
            'Check Amount Numeral 9 was prefixed to legitimate check to match structured wire threshold.',
            'Arithmetic discrepancy of +$70,900 between items and header total.',
          ],
          documents: [imageExhibit],
        },
        textAnalysis: {
          agentStatus: 'FLAGGED',
          riskScore: 88,
          urgencyScore: 92,
          suspiciousKeywordsCount: 5,
          collusionIndicators: [
            'Executive pressure to circumvent compliance',
            'Explicit directive to keep payments under 10k',
          ],
          nlpSummary: 'High-urgency tone commanding splitting of transactions to avoid reporting.',
          communications: [
            {
              id: 'TXT-NEW-01',
              timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
              channel: 'INTERNAL_CHAT',
              from: 'Executive Officer',
              to: 'Accounting Staff',
              subject: 'Wire splitting instruction',
              body: textInput,
              nlpFlags: {
                urgencyLevel: 'HIGH',
                coercionDetected: true,
                kickbackKeywordsFound: ['split', 'under 10,000', 'CTR', 'board authorized'],
                sentiment: 'URGENT',
              },
              highlightedKeywords: ['split', 'under 10,000', 'CTR'],
            },
          ],
        },
        graphAnalysis: {
          agentStatus: 'FLAGGED',
          riskScore: 86,
          circularRoutingDetected: true,
          shellCompaniesIdentified: ['Counterparty Offshore Shell (BVI)'],
          sharedDeviceOrIpFindings: ['Shared administrative portal login detected'],
          networkDiameter: 3,
          nodes: [
            { id: 'N_NEW_1', label: targetEntity.split('&')[0]?.trim() || 'Origin Entity', type: 'COMPANY', riskScore: 65, x: 200, y: 150 },
            { id: 'N_NEW_2', label: targetEntity.split('&')[1]?.trim() || 'Target Shell', type: 'OFFSHORE_SHELL', riskScore: 94, x: 500, y: 150 },
            { id: 'N_NEW_3', label: 'Beneficiary Signatory', type: 'PERSON', riskScore: 90, x: 350, y: 300 },
          ],
          edges: [
            { id: 'E_NEW_1', source: 'N_NEW_1', target: 'N_NEW_2', label: 'Altered Check Wire', amount: totalAmount || 98500, relationType: 'TRANSFERRED', isSuspicious: true },
            { id: 'E_NEW_2', source: 'N_NEW_3', target: 'N_NEW_2', label: 'Beneficial Control', relationType: 'BENEFICIAL_OWNER', isSuspicious: true },
            { id: 'E_NEW_3', source: 'N_NEW_3', target: 'N_NEW_1', label: 'Director Authority', relationType: 'DIRECTOR', isSuspicious: false },
          ],
        },
        correlations: [
          {
            id: 'CORR-NEW-01',
            title: 'Multimodal Triangulation: Spliced Check Numeral Matches Structured Outflows',
            description: `The altered check amount ($9,850.00) in ${customImageFileName} matches the sub-$10,000 wire lots ordered via internal communications.`,
            modalities: ['DOCUMENT', 'TRANSACTION', 'TEXT'],
            confidence: 0.98,
            significance: 'CRITICAL',
            causalChain: 'Altered Check ($9,850) -> Chat Directive -> Evasion Wires Under $10k Threshold',
          },
        ],
        report: {
          caseId: `FRA-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          caseTitle,
          investigatorName: 'Lead Investigator J. Mercer, CAMS',
          generatedDate: new Date().toISOString().substring(0, 10),
          executiveSummary: `Multimodal multi-agent forensic evaluation of ${targetEntity} established coordinated red flags across optical inspection of ${customImageFileName} (Check Washing & Numeral Splicing), banking ledgers, and executive chat transcripts. Composite fraud risk: 94/100.`,
          methodologyOverview: 'Cross-modal triangulation across 7 specialized agents processing visual ELA image forensics, financial ledgers, document OCR math validation, NLP sentiment analysis, and graph topology.',
          evidentiaryExhibits: [
            { id: 'EX-NEW-1', exhibitNumber: 'Exhibit 1', type: 'Image Forensics', description: `${customImageFileName} showing check washing and numeral prefix 9`, relevance: 'Proves Bank Fraud (18 U.S.C. § 1344) and Check Washing' },
            { id: 'EX-NEW-2', exhibitNumber: 'Exhibit 2', type: 'Banking Ledger', description: 'Sequence of transactions structured under $10,000 threshold', relevance: 'Proves BSA 31 U.S.C. § 5324 structuring' },
          ],
          regulatoryActions: [
            { action: 'File FinCEN Suspicious Activity Report (SAR Form 111)', justification: 'Mandatory BSA structuring & Bank Fraud thresholds satisfied.', priority: 'IMMEDIATE' },
            { action: 'Freeze Associated Remittance Accounts', justification: 'Prevent offshore dissipation of laundered funds.', priority: 'HIGH' },
          ],
          sarFilingDraft: {
            subjectName: targetEntity,
            narrativeSummary: `Suspect entities presented chemically washed and altered check instruments (${customImageFileName}) totaling structured lots under $10,000.`,
            estimatedLoss: totalAmount || 98500,
            violationCodes: ['Bank Fraud (18 USC 1344)', 'BSA Structuring (31 USC 5324)', 'Wire Fraud (18 USC 1343)'],
          },
          investigatorNotes: ['Case initiated via Multimodal AI Image Ingestion module.'],
        },
      };

      onCaseCreated(createdCase);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to process multimodal evidence. Please check input formats.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>New Multimodal Financial Fraud Investigation</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                  Image Vision AI Enabled
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Ingest checks/invoices (image/OCR), transaction streams, and text communications for multi-agent correlation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Target Entity & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">
                Investigation Case Title
              </label>
              <input
                type="text"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-mono text-[11px] mb-1">
                Primary Target Entities
              </label>
              <input
                type="text"
                value={targetEntity}
                onChange={(e) => setTargetEntity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-amber-400 font-medium"
              />
            </div>
          </div>

          {/* Quick Fraud Scenario Presets */}
          <div>
            <div className="text-[11px] font-mono text-slate-400 mb-1.5 uppercase font-bold flex items-center justify-between">
              <span>Load Realistic Financial Fraud Scenario Preset:</span>
              <span className="text-amber-400 text-[10px]">Autofills multimodal data</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset('CHECK_FRAUD')}
                className={`p-2.5 rounded-lg border text-left transition-colors ${
                  caseTitle.includes('Check Washing') 
                    ? 'bg-purple-950/60 border-purple-500 ring-1 ring-purple-500/40' 
                    : 'bg-slate-950 hover:bg-slate-800 border-slate-800'
                }`}
              >
                <div className="font-bold text-white text-[11px] flex items-center gap-1">
                  <span>📸 Check Fraud</span>
                </div>
                <div className="text-[10px] text-slate-400">Washed payee & numeral prefix</div>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('TRADE_FRAUD')}
                className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <div className="font-bold text-white text-[11px]">📑 Trade Over-Invoice</div>
                <div className="text-[10px] text-slate-400">Smurfed wires & math mismatch</div>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('GHOST_PAYROLL')}
                className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <div className="font-bold text-white text-[11px]">👤 Ghost Payroll</div>
                <div className="text-[10px] text-slate-400">Phantom hours & wire voucher</div>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset('CRYPTO_WASH')}
                className="p-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-left transition-colors"
              >
                <div className="font-bold text-white text-[11px]">🪙 Crypto Wash</div>
                <div className="text-[10px] text-slate-400">Offshore circular loop</div>
              </button>
            </div>
          </div>

          {/* Multimodal Data Inputs Tabs */}
          <div>
            <div className="flex border-b border-slate-800 gap-2 mb-3 overflow-x-auto">
              {/* IMAGE OPTION TAB */}
              <button
                type="button"
                id="modal-tab-image"
                onClick={() => setActiveTab('IMAGE')}
                className={`pb-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'IMAGE'
                    ? 'border-purple-400 text-purple-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-bold">🖼️ Financial Image / Check (Vision AI)</span>
              </button>

              <button
                type="button"
                id="modal-tab-transactions"
                onClick={() => setActiveTab('TRANSACTIONS')}
                className={`pb-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'TRANSACTIONS'
                    ? 'border-amber-400 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Transactions (JSON)</span>
              </button>

              <button
                type="button"
                id="modal-tab-documents"
                onClick={() => setActiveTab('DOCUMENTS')}
                className={`pb-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'DOCUMENTS'
                    ? 'border-amber-400 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Document OCR Text</span>
              </button>

              <button
                type="button"
                id="modal-tab-text"
                onClick={() => setActiveTab('TEXT')}
                className={`pb-2 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'TEXT'
                    ? 'border-amber-400 text-white'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Email / Chat Transcripts</span>
              </button>
            </div>

            {/* TAB CONTENT: IMAGE OPTION */}
            {activeTab === 'IMAGE' && (
              <div className="space-y-4">
                {/* Upload or Preset Selection Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  {/* File Upload Zone */}
                  <div className="sm:col-span-5 p-3 rounded-xl border border-dashed border-purple-500/60 bg-purple-950/20 flex flex-col justify-center items-center text-center">
                    <Upload className="w-6 h-6 text-purple-400 mb-1.5" />
                    <div className="font-bold text-white text-xs mb-0.5">
                      Upload Custom Financial Image
                    </div>
                    <p className="text-[10px] text-slate-400 mb-2">
                      Check scan, invoice PNG/JPG, or wire slip
                    </p>
                    <label className="cursor-pointer px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-semibold transition-colors shadow">
                      Browse Image File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCustomImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Preset Financial Image Options */}
                  <div className="sm:col-span-7 space-y-1.5">
                    <div className="text-[11px] font-mono text-slate-400 font-bold uppercase">
                      Or Select Benchmark Financial Image:
                    </div>
                    <div className="grid grid-cols-3 gap-1.5 text-left font-mono">
                      <button
                        type="button"
                        onClick={() => handleSelectImagePreset('CHECK')}
                        className={`p-2 rounded-lg border text-xs transition-all ${
                          imagePreset === 'CHECK'
                            ? 'bg-purple-950/80 border-purple-500 text-white ring-1 ring-purple-500/50'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-[11px] text-purple-300">📸 Check #7721</div>
                        <div className="text-[9px] text-slate-400 line-clamp-1">Washed Payee & Numeral</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectImagePreset('INVOICE')}
                        className={`p-2 rounded-lg border text-xs transition-all ${
                          imagePreset === 'INVOICE'
                            ? 'bg-purple-950/80 border-purple-500 text-white ring-1 ring-purple-500/50'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-[11px] text-cyan-300">🏛️ Bank Wire #9942</div>
                        <div className="text-[9px] text-slate-400 line-clamp-1">Wire Settlement Advice</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectImagePreset('WIRE_SLIP')}
                        className={`p-2 rounded-lg border text-xs transition-all ${
                          imagePreset === 'WIRE_SLIP'
                            ? 'bg-purple-950/80 border-purple-500 text-white ring-1 ring-purple-500/50'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-bold text-[11px] text-rose-300">💳 Wire Voucher</div>
                        <div className="text-[9px] text-slate-400 line-clamp-1">Signature Splice</div>
                      </button>
                    </div>

                    {/* Active File Name Bar */}
                    <div className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-400">Attached Image File:</span>
                      <span className="text-purple-300 font-bold">{customImageFileName}</span>
                    </div>
                  </div>
                </div>

                {/* Visual Image Preview & Tamper Detection Card */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-purple-400" />
                      <span>Vision AI Inspection Preview</span>
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300 font-mono text-[10px] font-bold">
                      🚨 Tampering Risk: {Math.round(imageTamperingConfidence * 100)}%
                    </span>
                  </div>

                  {/* Rendered Check / Document Graphic */}
                  {imagePreset === 'CHECK' && (
                    <div className="p-4 bg-amber-50/90 text-slate-900 rounded-lg border border-amber-300/60 font-serif relative overflow-hidden select-none">
                      <div className="flex justify-between items-start text-xs border-b border-slate-300 pb-2">
                        <div>
                          <span className="font-bold uppercase tracking-wider block">Apex Global Logistics LLC</span>
                          <span className="text-[9px] font-sans text-slate-600">Treasury Acct #8829104492</span>
                        </div>
                        <div className="font-mono text-right text-[10px]">
                          <div>CHECK NO: 7721</div>
                          <div>DATE: 2024-10-15</div>
                        </div>
                      </div>

                      <div className="my-3 space-y-2 text-xs font-sans">
                        <div className="flex justify-between items-center gap-2">
                          <div className="border-b border-slate-400 pb-0.5 flex-1">
                            <span className="text-[9px] text-slate-500 uppercase mr-1">PAY TO: </span>
                            <span className="font-bold font-mono text-slate-900">Meridian Holdings Ltd</span>
                            <span className="ml-2 text-[8px] bg-rose-100 text-rose-700 px-1 rounded border border-rose-300">
                              Bleach Wash Halo
                            </span>
                          </div>
                          <div className="border border-slate-700 bg-white px-2 py-1 font-mono font-bold text-sm text-slate-900">
                            <span className="text-rose-600 font-black">$9,</span>850.00
                          </div>
                        </div>

                        <div className="flex justify-between items-end pt-2">
                          <div className="w-1/2 border-b border-slate-400 pb-0.5 text-[10px] text-slate-600">
                            MEMO: Bank Wire Settlement Ref WT-8829-9942
                          </div>
                          <div className="w-1/3 border-b border-slate-400 pb-0.5 text-center font-serif italic text-blue-900 font-bold text-sm">
                            David Vance
                            <span className="block text-[7px] text-rose-600 font-sans uppercase">
                              Traced Hesitation Marks
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-center font-mono text-[9px] text-slate-600 tracking-widest pt-1 border-t border-dashed border-slate-300">
                        ⑆021000021⑆ 8829104492⑈ 7721
                      </div>
                    </div>
                  )}

                  {imagePreset === 'INVOICE' && (
                    <div className="p-3 bg-slate-900 text-slate-200 rounded-lg border border-slate-800 font-mono text-xs">
                      <div className="flex justify-between border-b border-slate-800 pb-1.5">
                        <span className="font-bold text-cyan-300">METROPOLITAN RESERVE BANK - WIRE ADVICE #WT-9942</span>
                        <span className="text-emerald-400 font-bold">SETTLED</span>
                      </div>
                      <div className="my-2 space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Sender / Originator:</span>
                          <span className="text-slate-200 font-medium">Apex Global Logistics LLC (#8829104492)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Beneficiary:</span>
                          <span className="text-amber-300 font-medium">Meridian Holdings Ltd (BVI)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Settled Amount:</span>
                          <span className="text-emerald-400 font-bold text-sm">$9,850.00 USD</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-rose-400 bg-rose-950/40 p-1 rounded border border-rose-900/60 mt-1">
                          <span>Risk Flag: BSA Structuring under $10,000 CTR reporting threshold</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {imagePreset === 'WIRE_SLIP' && (
                    <div className="p-3 bg-slate-900 text-slate-200 rounded-lg border border-slate-800 font-mono text-xs">
                      <div className="border-b border-slate-800 pb-1.5 flex justify-between">
                        <span className="font-bold text-white">WIRE AUTHORIZATION #TR-9941-X</span>
                        <span className="text-rose-400">FAILED PKI SIGNATURE</span>
                      </div>
                      <div className="my-2 text-[11px] text-rose-300 bg-rose-950/40 p-2 rounded border border-rose-900">
                        Directive: "Ensure rapid processing under $10,000 lots per vendor contract terms"
                      </div>
                    </div>
                  )}

                  {imagePreset === 'CUSTOM' && customImageBase64 && (
                    <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 text-center">
                      <img
                        src={customImageBase64}
                        alt="Uploaded Document"
                        className="max-h-44 mx-auto rounded object-contain shadow"
                      />
                      <div className="mt-1 text-[10px] text-purple-300 font-mono">
                        Custom Image Attached: {customImageFileName}
                      </div>
                    </div>
                  )}

                  {/* AI Detection Summary Pill */}
                  <div className="p-2.5 bg-rose-950/30 border border-rose-800/80 rounded-lg flex items-start gap-2 text-[11px] text-rose-200">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-rose-300">Pre-Ingestion Forensic Triage: </strong>
                      {imageAlteredDetails}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: TRANSACTIONS */}
            {activeTab === 'TRANSACTIONS' && (
              <div>
                <textarea
                  rows={6}
                  value={txnInput}
                  onChange={(e) => setTxnInput(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* TAB CONTENT: OCR DOCUMENTS */}
            {activeTab === 'DOCUMENTS' && (
              <div>
                <textarea
                  rows={6}
                  value={docInput}
                  onChange={(e) => setDocInput(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}

            {/* TAB CONTENT: TEXT LOGS */}
            {activeTab === 'TEXT' && (
              <div>
                <textarea
                  rows={6}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-[11px] text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Multi-Agent Correlation: Image Vision + Transactions + NLP + Graph</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              id="modal-submit-investigation"
              onClick={handleLaunchInvestigation}
              disabled={isLoading}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold text-xs flex items-center gap-2 transition-colors disabled:opacity-50 shadow-md shadow-amber-500/20"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Synthesizing Agents...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Multi-Agent Investigation</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
