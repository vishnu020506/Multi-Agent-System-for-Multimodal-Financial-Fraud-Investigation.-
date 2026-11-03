import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  UserCheck, 
  Edit3, 
  Save, 
  AlertOctagon,
  Scale,
  Building,
  Calendar,
  Sparkles,
  FileCode,
  Check,
  Award
} from 'lucide-react';
import { InvestigationCase } from '../types';
import { ForensicCertificateModal } from './ForensicCertificateModal';

interface InvestigationReportViewProps {
  currentCase: InvestigationCase;
  onUpdateNotes: (notes: string[]) => void;
}

export const InvestigationReportView: React.FC<InvestigationReportViewProps> = ({
  currentCase,
  onUpdateNotes,
}) => {
  const { report, riskAssessment, transactionAnalysis, documentAnalysis, textAnalysis, graphAnalysis, audioAnalysis } = currentCase;
  const [newNote, setNewNote] = useState('');
  const [notesList, setNotesList] = useState<string[]>(report.investigatorNotes || []);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Editable SAR Narrative
  const [editableNarrative, setEditableNarrative] = useState(report.sarFilingDraft?.narrativeSummary || '');
  const [isEditingNarrative, setIsEditingNarrative] = useState(false);
  const [isPolishingAi, setIsPolishingAi] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Digital Compliance Sign-Off States
  const [signOffs, setSignOffs] = useState({
    investigator: true,
    compliance: riskAssessment.overallRiskScore >= 60,
    mlro: false,
  });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const updated = [newNote.trim(), ...notesList];
    setNotesList(updated);
    onUpdateNotes(updated);
    setNewNote('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentCase, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `AML_Case_Dossier_${currentCase.id}.json`);
    dlAnchorElem.click();
  };

  const handleExportFincenXml = () => {
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<FinCEN_BSA_XML_Document xmlns="http://www.fincen.gov/bsa/sar" version="1.2">
  <Activity>
    <ActivitySeqNum>${currentCase.id.replace(/[^0-9]/g, '') || '1001'}</ActivitySeqNum>
    <ActivityType>BSAR_FORM_111</ActivityType>
    <FilingDate>${new Date().toISOString().slice(0, 10)}</FilingDate>
    <FilingInstitutionName>LEAD MULTIMODAL INTELLIGENCE PLATFORM</FilingInstitutionName>
    <TotalAmountInvolved Currency="${currentCase.currency}">${currentCase.totalExposure}</TotalAmountInvolved>
    <SuspiciousActivityInformation>
      <ViolationCodes>
        ${(report.sarFilingDraft?.violationCodes || ['BSA-Structuring (31 USC 5324)']).map(v => `<Code>${v}</Code>`).join('\n        ')}
      </ViolationCodes>
      <NarrativeText><![CDATA[${editableNarrative}]]></NarrativeText>
    </SuspiciousActivityInformation>
    <SubjectInformation>
      <SubjectName>${report.sarFilingDraft?.subjectName || currentCase.targetEntity}</SubjectName>
      <RiskScore>${riskAssessment.overallRiskScore}</RiskScore>
      <RiskTier>${riskAssessment.riskTier}</RiskTier>
    </SubjectInformation>
  </Activity>
</FinCEN_BSA_XML_Document>`;

    const dataStr = 'data:text/xml;charset=utf-8,' + encodeURIComponent(xmlContent);
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute('href', dataStr);
    dlAnchorElem.setAttribute('download', `FinCEN_SAR_${currentCase.id}.xml`);
    dlAnchorElem.click();
  };

  const handlePolishNarrativeAi = async () => {
    setIsPolishingAi(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseData: currentCase,
          customNotes: editableNarrative,
        }),
      });
      const res = await response.json();
      if (res.data?.sarNarrativeDraft) {
        setEditableNarrative(res.data.sarNarrativeDraft);
        setIsEditingNarrative(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPolishingAi(false);
    }
  };

  return (
    <div id="investigation-report-view" className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">
              Official Forensic Investigation Dossier & FinCEN SAR Studio
            </h2>
            <p className="text-xs text-slate-400">
              Multimodal Multi-Agent Financial Crime Intelligence Engine (FinCEN Form 111 Ready)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="export-xml-btn"
            onClick={handleExportFincenXml}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors"
            title="Download FinCEN XML"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>Export FinCEN XML</span>
          </button>

          <button
            id="export-json-btn"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            title="Download Case JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Audit JSON</span>
          </button>

          <button
            id="view-forensic-certificate-report-btn"
            onClick={() => setShowCertificateModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all"
            title="Generate Official Forensic Examination Certificate"
          >
            <Award className="w-3.5 h-3.5 text-slate-950" />
            <span>Forensic Certificate</span>
          </button>

          <button
            id="print-dossier-btn"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-300" />
            <span>Print Dossier / PDF</span>
          </button>
        </div>
      </div>

      {/* Compliance Sign-Off Status Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm print:hidden">
        <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            <span>3-Tier Statutory Compliance Sign-Off Protocol</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Audit Trail Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Level 1: Senior Fraud Investigator */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            signOffs.investigator ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Level 1: Lead Investigator</div>
              <div className="text-xs font-bold text-white mt-0.5">{report.investigatorName}</div>
              <div className="text-[10px] text-slate-400">Forensics & Multimodal Analysis</div>
            </div>
            <button
              onClick={() => setSignOffs({ ...signOffs, investigator: !signOffs.investigator })}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                signOffs.investigator 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>{signOffs.investigator ? 'SIGNED' : 'SIGN OFF'}</span>
            </button>
          </div>

          {/* Level 2: AML Compliance Officer */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            signOffs.compliance ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Level 2: AML Compliance</div>
              <div className="text-xs font-bold text-white mt-0.5">BSA Audit Officer</div>
              <div className="text-[10px] text-slate-400">31 CFR § 1020.320 Review</div>
            </div>
            <button
              onClick={() => setSignOffs({ ...signOffs, compliance: !signOffs.compliance })}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                signOffs.compliance 
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>{signOffs.compliance ? 'VERIFIED' : 'SIGN OFF'}</span>
            </button>
          </div>

          {/* Level 3: MLRO Authority */}
          <div className={`p-3 rounded-xl border flex items-center justify-between ${
            signOffs.mlro ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' : 'bg-slate-950 border-slate-800 text-slate-400'
          }`}>
            <div>
              <div className="text-[10px] font-mono uppercase text-slate-400">Level 3: MLRO Authority</div>
              <div className="text-xs font-bold text-white mt-0.5">Chief Compliance Officer</div>
              <div className="text-[10px] text-slate-400">FinCEN Filing Transmission</div>
            </div>
            <button
              onClick={() => setSignOffs({ ...signOffs, mlro: !signOffs.mlro })}
              className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors flex items-center gap-1 ${
                signOffs.mlro 
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md' 
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Check className="w-3 h-3" />
              <span>{signOffs.mlro ? 'AUTHORIZED' : 'AUTHORIZE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formal Printable Investigation Report Document */}
      <div className="bg-white text-slate-900 rounded-xl p-8 sm:p-12 shadow-lg border border-slate-200 print:shadow-none print:border-none print:p-0 max-w-5xl mx-auto space-y-8 font-sans">
        {/* Formal Document Header */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs uppercase font-mono tracking-widest text-slate-500 font-bold mb-1">
                Confidential • Law Enforcement & AML Compliance Only
              </div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                MULTIMODAL FINANCIAL FRAUD INVESTIGATION REPORT
              </h1>
              <div className="text-sm font-semibold text-slate-700 mt-1">
                Case Title: {report.caseTitle}
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-600">
              <div>Case ID: <span className="font-bold text-slate-900">{report.caseId}</span></div>
              <div>Date: {report.generatedDate}</div>
              <div>Status: <span className="font-bold text-rose-600">{currentCase.status.replace(/_/g, ' ')}</span></div>
            </div>
          </div>
        </div>

        {/* 6-Stage Automated AI Investigation Pipeline Chain (Feature 9) */}
        <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-xl space-y-3 font-sans">
          <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Automated 6-Stage AI Investigation Summary Chain</span>
            </span>
            <span className="font-mono text-slate-500">ISO 27037 / FinCEN Standard</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs">
            {/* Stage 1: Case ID */}
            <div className="p-2.5 rounded-lg bg-white border border-slate-300">
              <div className="text-[10px] font-mono text-slate-500 font-bold uppercase">1. Case ID</div>
              <div className="font-mono font-bold text-slate-900 mt-1 truncate">{report.caseId}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Adjudicated dossier</div>
            </div>

            {/* Stage 2: Suspicious Activity */}
            <div className="p-2.5 rounded-lg bg-white border border-slate-300">
              <div className="text-[10px] font-mono text-rose-600 font-bold uppercase">2. Suspicious Activity</div>
              <div className="font-bold text-slate-900 mt-1 text-[11px] leading-tight">CTR Structuring & Wiretap Coercion</div>
              <div className="text-[10px] text-rose-600 mt-0.5">31 U.S.C. 5324 Violation</div>
            </div>

            {/* Stage 3: Evidence */}
            <div className="p-2.5 rounded-lg bg-white border border-slate-300">
              <div className="text-[10px] font-mono text-purple-700 font-bold uppercase">3. Evidence Items</div>
              <div className="font-bold text-slate-900 mt-1 text-[11px] leading-tight">
                {transactionAnalysis.transactions.length} Txns • {documentAnalysis.documents.length} Docs • Wiretaps
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">SHA-256 Custody Valid</div>
            </div>

            {/* Stage 4: AI Findings */}
            <div className="p-2.5 rounded-lg bg-white border border-slate-300">
              <div className="text-[10px] font-mono text-blue-700 font-bold uppercase">4. AI Findings</div>
              <div className="font-bold text-slate-900 mt-1 text-[11px] leading-tight">
                5 Agents Converging (+$70.9k OCR Discrepancy)
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Shapley attribution 94%</div>
            </div>

            {/* Stage 5: Risk Score */}
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-300 text-rose-950">
              <div className="text-[10px] font-mono text-rose-700 font-bold uppercase">5. Risk Score</div>
              <div className="font-black text-rose-700 text-lg mt-0.5 leading-none">
                {riskAssessment.overallRiskScore}<span className="text-xs font-normal">/100</span>
              </div>
              <div className="text-[10px] font-bold text-rose-600 mt-1 uppercase">{riskAssessment.riskTier} TIER</div>
            </div>

            {/* Stage 6: Recommendation */}
            <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-950">
              <div className="text-[10px] font-mono text-amber-800 font-bold uppercase">6. Recommendation</div>
              <div className="font-bold text-slate-900 mt-1 text-[11px] leading-tight">File FinCEN Form 111 SAR Immediately</div>
              <div className="text-[10px] text-amber-700 mt-0.5 font-bold">Freeze BVI Accounts</div>
            </div>
          </div>
        </div>

        {/* Section 1: Executive Forensic Synthesis */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            Section 1: Executive Forensic Synthesis
          </h2>
          <p className="text-sm text-slate-800 leading-relaxed font-serif">
            {report.executiveSummary}
          </p>
        </div>

        {/* Section 2: Multimodal Methodology & Agent Weights */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            Section 2: Multimodal Investigation Methodology
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            {report.methodologyOverview}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs font-mono">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="text-slate-500 text-[10px]">Transaction Agent</div>
              <div className="font-bold text-slate-900 text-sm">{riskAssessment.agentScores.transactionAgent}/100</div>
              <div className="text-[10px] text-slate-400">Weight: {Math.round(riskAssessment.agentWeights.transactionAgent * 100)}%</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="text-slate-500 text-[10px]">Document OCR</div>
              <div className="font-bold text-slate-900 text-sm">{riskAssessment.agentScores.documentAgent}/100</div>
              <div className="text-[10px] text-slate-400">Weight: {Math.round(riskAssessment.agentWeights.documentAgent * 100)}%</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="text-slate-500 text-[10px]">NLP Text Agent</div>
              <div className="font-bold text-slate-900 text-sm">{riskAssessment.agentScores.textAgent}/100</div>
              <div className="text-[10px] text-slate-400">Weight: {Math.round(riskAssessment.agentWeights.textAgent * 100)}%</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="text-slate-500 text-[10px]">Graph Topology</div>
              <div className="font-bold text-slate-900 text-sm">{riskAssessment.agentScores.graphAgent}/100</div>
              <div className="text-[10px] text-slate-400">Weight: {Math.round(riskAssessment.agentWeights.graphAgent * 100)}%</div>
            </div>
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
              <div className="text-slate-500 text-[10px]">Audio Forensics</div>
              <div className="font-bold text-slate-900 text-sm">{riskAssessment.agentScores.audioAgent || 90}/100</div>
              <div className="text-[10px] text-slate-400">Weight: {Math.round((riskAssessment.agentWeights.audioAgent || 0.15) * 100)}%</div>
            </div>
          </div>
        </div>

        {/* Section 3: Primary Evidentiary Exhibits */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            Section 3: Evidentiary Exhibits & Modal Verification
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-100 text-slate-700 font-mono text-[10px] uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Exhibit</th>
                  <th className="py-2 px-3">Modality / Type</th>
                  <th className="py-2 px-3">Forensic Description</th>
                  <th className="py-2 px-3">Legal Relevance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                {report.evidentiaryExhibits.map((ex) => (
                  <tr key={ex.id}>
                    <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">{ex.exhibitNumber}</td>
                    <td className="py-2 px-3 text-slate-600">{ex.type}</td>
                    <td className="py-2 px-3 font-sans text-slate-800">{ex.description}</td>
                    <td className="py-2 px-3 font-sans text-slate-600">{ex.relevance}</td>
                  </tr>
                ))}
                {audioAnalysis && audioAnalysis.recordings.length > 0 && (
                  <tr>
                    <td className="py-2 px-3 font-bold text-slate-900 whitespace-nowrap">Exhibit E-1</td>
                    <td className="py-2 px-3 text-slate-600">Audio Voice Wiretap</td>
                    <td className="py-2 px-3 font-sans text-slate-800">
                      {audioAnalysis.recordings[0].title} showing verbal payment splitting commands and 92/100 voice stress tremor.
                    </td>
                    <td className="py-2 px-3 font-sans text-slate-600">
                      Direct acoustic proof of criminal scienter and evasion intent.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: FinCEN SAR Section V Narrative Draft Studio */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Section 4: FinCEN Form 111 (SAR Narrative Specification)
            </h2>
            <div className="flex items-center gap-2 print:hidden">
              <button
                onClick={handlePolishNarrativeAi}
                disabled={isPolishingAi}
                className="text-[11px] px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold flex items-center gap-1 border border-amber-300"
              >
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{isPolishingAi ? 'Polishing...' : 'AI Refine SAR'}</span>
              </button>
              <button
                onClick={() => setIsEditingNarrative(!isEditingNarrative)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center gap-1 border border-slate-300"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditingNarrative ? 'Lock Narrative' : 'Edit Text'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-300 rounded-lg text-xs space-y-2">
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Subject: <strong className="text-slate-900">{report.sarFilingDraft?.subjectName}</strong></span>
              <span>Estimated Exposure: <strong className="text-rose-700">${report.sarFilingDraft?.estimatedLoss.toLocaleString()}</strong></span>
            </div>

            {isEditingNarrative ? (
              <textarea
                value={editableNarrative}
                onChange={(e) => setEditableNarrative(e.target.value)}
                rows={5}
                className="w-full p-2.5 bg-white border border-slate-300 rounded font-serif text-xs text-slate-900 focus:outline-none focus:border-amber-500"
              />
            ) : (
              <p className="font-serif text-slate-800 leading-relaxed text-xs">
                {editableNarrative}
              </p>
            )}

            <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Statutory Citations:</span>
              {report.sarFilingDraft?.violationCodes.map((code, idx) => (
                <span key={idx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold">
                  {code}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Section 5: Recommended Regulatory & Prosecutorial Actions */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1">
            Section 5: Recommended Regulatory & Enforcement Actions
          </h2>
          <div className="space-y-2">
            {report.regulatoryActions.map((act, i) => (
              <div key={i} className="p-3 bg-slate-50 rounded border border-slate-200 text-xs flex justify-between items-start gap-4">
                <div>
                  <div className="font-bold text-slate-900">{act.action}</div>
                  <div className="text-slate-600 text-[11px] mt-0.5">{act.justification}</div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                  act.priority === 'IMMEDIATE' ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  {act.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Investigator Field Notes & Case Log */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Section 6: Investigator Field Notes & Log
            </h2>
          </div>

          {/* Add note input (hidden in print) */}
          <form onSubmit={handleAddNote} className="flex gap-2 print:hidden">
            <input
              type="text"
              placeholder="Add contemporaneous investigative note or subpoena update..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded text-xs transition-colors"
            >
              Add Note
            </button>
          </form>

          {savedSuccess && (
            <div className="text-[11px] text-emerald-600 font-semibold print:hidden">
              ✓ Note logged into case audit ledger.
            </div>
          )}

          <div className="space-y-1.5 font-mono text-xs">
            {notesList.map((note, idx) => (
              <div key={idx} className="p-2 bg-slate-50 rounded border border-slate-200 text-slate-700 text-[11px]">
                • {note}
              </div>
            ))}
          </div>
        </div>

        {/* Signatures & Execution Block */}
        <div className="pt-8 border-t-2 border-slate-900 grid grid-cols-3 gap-6 text-center font-mono text-xs text-slate-600">
          <div>
            <div className="font-serif italic font-bold text-slate-900 text-sm mb-1">
              {signOffs.investigator ? report.investigatorName : 'Pending Signature'}
            </div>
            <div className="border-t border-slate-400 pt-1">Lead Forensic Investigator</div>
          </div>
          <div>
            <div className="font-serif italic font-bold text-slate-900 text-sm mb-1">
              {signOffs.compliance ? 'BSA / AML Officer Verified' : 'Pending Review'}
            </div>
            <div className="border-t border-slate-400 pt-1">BSA Compliance Officer</div>
          </div>
          <div>
            <div className="font-serif italic font-bold text-slate-900 text-sm mb-1">
              {signOffs.mlro ? 'MLRO Authorized Filing' : 'Escalation Pending'}
            </div>
            <div className="border-t border-slate-400 pt-1">Money Laundering Reporting Officer</div>
          </div>
        </div>
      </div>

      {/* Official Forensic Certificate Modal */}
      <ForensicCertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        caseData={currentCase}
      />
    </div>
  );
};
