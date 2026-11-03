import React from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  FileSearch, 
  MessageSquare, 
  Share2, 
  Headphones, 
  ArrowUpRight, 
  CheckCircle2, 
  Lock, 
  Building2, 
  DollarSign,
  Activity,
  Bot,
  FileCheck2,
  Layers,
  Radio
} from 'lucide-react';
import { InvestigationCase } from '../types';
import { ExplainableAiDiagnostic } from './ExplainableAiDiagnostic';

interface RiskOverviewCardProps {
  currentCase: InvestigationCase;
  onNavigateTab: (tabId: string) => void;
}

export const RiskOverviewCard: React.FC<RiskOverviewCardProps> = ({
  currentCase,
  onNavigateTab,
}) => {
  const { riskAssessment, transactionAnalysis, documentAnalysis, textAnalysis, graphAnalysis, audioAnalysis } = currentCase;
  const score = riskAssessment.overallRiskScore;

  const getScoreColor = (val: number) => {
    if (val >= 85) return 'text-rose-800 border-rose-200 bg-rose-50';
    if (val >= 65) return 'text-amber-800 border-amber-200 bg-amber-50';
    if (val >= 40) return 'text-yellow-800 border-yellow-200 bg-yellow-50';
    return 'text-emerald-800 border-emerald-200 bg-emerald-50';
  };

  const getGaugeStroke = (val: number) => {
    if (val >= 85) return '#be123c'; // rose-700
    if (val >= 65) return '#b45309'; // amber-700
    if (val >= 40) return '#a16207'; // yellow-700
    return '#15803d'; // emerald-700
  };

  const circumference = 2 * Math.PI * 44;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div id="risk-overview-container" className="space-y-6">
      {/* Executive Global Investigation KPIs (Feature 5) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* KPI 1: Total Transactions */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-semibold">
            <span>Total Transactions</span>
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          </div>
          <div className="text-xl font-black text-slate-900 font-mono">3,842</div>
          <div className="text-[10px] text-emerald-700 font-mono flex items-center gap-1 mt-0.5 font-semibold">
            <Radio className="w-2.5 h-2.5 animate-pulse" />
            <span>Live Intercepts</span>
          </div>
        </div>

        {/* KPI 2: Suspicious Transactions */}
        <div className="p-3.5 bg-rose-50/50 border border-rose-200 rounded-xl shadow-xs">
          <div className="flex items-center justify-between text-[10px] text-rose-800 mb-1 font-bold">
            <span>Suspicious Txns</span>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
          </div>
          <div className="text-xl font-black text-rose-800 font-mono">29 Flagged</div>
          <div className="text-[10px] text-rose-700 font-mono mt-0.5 font-semibold">
            {transactionAnalysis.transactions.filter(t => t.flagged).length} in this case
          </div>
        </div>

        {/* KPI 3: Fraud Cases */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[10px] text-slate-500 mb-1 font-semibold">Active Fraud Cases</div>
          <div className="text-xl font-black text-slate-900 font-mono">4 Dossiers</div>
          <div className="text-[10px] text-slate-500 mt-0.5">FinCEN Registry</div>
        </div>

        {/* KPI 4: Risk Level */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[10px] text-slate-500 mb-1 font-semibold">Risk Tiers</div>
          <div className="text-sm font-bold font-mono mt-1">
            <span className="text-rose-700 font-bold">1 Crit</span> • <span className="text-amber-700">2 High</span> • <span className="text-emerald-700">1 Clean</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Bayesian Distribution</div>
        </div>

        {/* KPI 5: Agent Findings */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[10px] text-slate-500 mb-1 font-semibold">Agent Findings</div>
          <div className="text-xl font-black text-slate-900 font-mono">5/5 Converged</div>
          <div className="text-[10px] text-slate-600 mt-0.5 font-medium">Cross-modal consensus</div>
        </div>

        {/* KPI 6: Graph Relationships */}
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[10px] text-slate-500 mb-1 font-semibold">Graph Relationships</div>
          <div className="text-xl font-black text-slate-900 font-mono">
            {graphAnalysis.nodes.length}N • {graphAnalysis.edges.length}E
          </div>
          <div className="text-[10px] text-slate-600 mt-0.5 font-medium">
            {graphAnalysis.circularRoutingDetected ? '1 Cycle Loop' : 'Direct Flows'}
          </div>
        </div>
      </div>
      {/* Top Banner: Case Profile & Scorecard */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs text-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Main Dial & Risk Score */}
          <div className="lg:col-span-4 flex items-center gap-6 border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0 lg:pr-6">
            <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  className="stroke-slate-100"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke={getGaugeStroke(score)}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black tracking-tight text-slate-900">{score}</span>
                <span className="text-[10px] uppercase font-mono text-slate-500">/ 100</span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono uppercase text-slate-500 font-semibold">Composite Risk</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase border ${getScoreColor(score)}`}>
                  {riskAssessment.riskTier}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 leading-tight mb-1">
                {score >= 65 ? 'High Probability Fraud' : score >= 40 ? 'Moderate Anomaly Risk' : 'Standard Baseline Risk'}
              </h2>
              <div className="text-xs text-slate-500">
                Model Confidence: <span className="text-slate-900 font-bold">{riskAssessment.confidenceScore}%</span>
              </div>
              {riskAssessment.sarRequired && (
                <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                  <AlertTriangle className="w-3 h-3 text-rose-700" />
                  <span>Mandatory SAR Filing Required</span>
                </div>
              )}
            </div>
          </div>

          {/* Case Details & Exposure */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-slate-500 font-semibold">Case Reference #{currentCase.id}</span>
                <h3 className="text-lg font-bold text-slate-900">{currentCase.title}</h3>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 font-semibold">Total Suspect Exposure</div>
                <div className="text-xl font-bold text-slate-900 font-mono">
                  ${currentCase.totalExposure.toLocaleString()} {currentCase.currency}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 mb-0.5 font-semibold">Primary Target Entity</div>
                <div className="font-bold text-slate-900 line-clamp-1">{currentCase.targetEntity}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 mb-0.5 font-semibold">Investigation Status</div>
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>{currentCase.status.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-slate-500 mb-0.5 font-semibold">Multimodal Evidence Count</div>
                <div className="font-semibold text-slate-800">
                  {transactionAnalysis.transactions.length} Txns • {documentAnalysis.documents.length} Docs • {textAnalysis.communications.length} Chats • {audioAnalysis?.recordings.length || 0} Wiretaps
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Specialized AI Agents Telemetry Cards */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Specialized Multimodal AI Agents Findings</span>
            <span className="text-xs font-normal text-slate-500 font-mono">(5 Active Agents)</span>
          </h3>
          <span className="text-xs text-slate-500">Click any card to inspect agent data</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* 1. Transaction Agent */}
          <div
            id="card-transaction-agent"
            onClick={() => onNavigateTab('transaction')}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 cursor-pointer transition-all hover:translate-y-[-2px] group shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Transaction Agent</div>
                  <div className="text-[10px] text-slate-500">Velocity & Smurfing</div>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreColor(transactionAnalysis.riskScore)}`}>
                {transactionAnalysis.riskScore}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Flagged Volume:</span>
                <span className="font-mono text-slate-900 font-bold">
                  ${transactionAnalysis.flaggedVolume.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Structuring Detected:</span>
                <span className={`font-semibold ${transactionAnalysis.structuringAnalysis.detected ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}`}>
                  {transactionAnalysis.structuringAnalysis.detected ? 'YES (<$10k)' : 'No'}
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700">
                {transactionAnalysis.anomaliesDetected[0]?.description || 'Normal velocity baseline observed.'}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-blue-700 group-hover:text-blue-800 font-bold">
              <span>View Ledger Analysis</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 2. Document Agent */}
          <div
            id="card-document-agent"
            onClick={() => onNavigateTab('document')}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 cursor-pointer transition-all hover:translate-y-[-2px] group shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                  <FileSearch className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Document Agent</div>
                  <div className="text-[10px] text-slate-500">OCR & Image Forgery</div>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreColor(documentAnalysis.riskScore)}`}>
                {documentAnalysis.riskScore}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Documents Audited:</span>
                <span className="font-mono text-slate-900 font-bold">{documentAnalysis.documentsProcessed} files</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tampered / Forged:</span>
                <span className={`font-semibold ${documentAnalysis.forgedDocumentsCount > 0 ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}`}>
                  {documentAnalysis.forgedDocumentsCount} document(s)
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700">
                {documentAnalysis.keyFindings[0] || 'All OCR fields and totals verify.'}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-amber-800 group-hover:text-amber-900 font-bold">
              <span>View OCR Scans</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 3. Text Agent */}
          <div
            id="card-text-agent"
            onClick={() => onNavigateTab('text')}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 cursor-pointer transition-all hover:translate-y-[-2px] group shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Text Agent</div>
                  <div className="text-[10px] text-slate-500">NLP & Chat Forensics</div>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreColor(textAnalysis.riskScore)}`}>
                {textAnalysis.riskScore}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Urgency / Pressure:</span>
                <span className={`font-semibold ${textAnalysis.urgencyScore > 70 ? 'text-rose-700 font-bold' : 'text-slate-800'}`}>
                  {textAnalysis.urgencyScore}/100
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Suspicious Keywords:</span>
                <span className="font-mono text-slate-900 font-bold">{textAnalysis.suspiciousKeywordsCount} triggers</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700">
                {textAnalysis.collusionIndicators[0] || 'Standard business tone detected.'}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-purple-700 group-hover:text-purple-800 font-bold">
              <span>View Chat Transcripts</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 4. Graph Agent */}
          <div
            id="card-graph-agent"
            onClick={() => onNavigateTab('graph')}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 cursor-pointer transition-all hover:translate-y-[-2px] group shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Graph Agent</div>
                  <div className="text-[10px] text-slate-500">Entity Topology & Loops</div>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreColor(graphAnalysis.riskScore)}`}>
                {graphAnalysis.riskScore}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Circular Wash Cycle:</span>
                <span className={`font-semibold ${graphAnalysis.circularRoutingDetected ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'}`}>
                  {graphAnalysis.circularRoutingDetected ? 'DETECTED' : 'None'}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shell Entities:</span>
                <span className="font-mono text-slate-900 font-bold">{graphAnalysis.shellCompaniesIdentified.length}</span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700">
                {graphAnalysis.shellCompaniesIdentified[0] || 'No shell company clusters identified.'}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-emerald-700 group-hover:text-emerald-800 font-bold">
              <span>View Network Graph</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* 5. Audio Agent */}
          <div
            id="card-audio-agent"
            onClick={() => onNavigateTab('audio')}
            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-4 cursor-pointer transition-all hover:translate-y-[-2px] group shadow-xs"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200 text-cyan-700">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Audio Agent</div>
                  <div className="text-[10px] text-slate-500">Voice & Wiretaps</div>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${getScoreColor(audioAnalysis?.riskScore || 15)}`}>
                {audioAnalysis?.riskScore || 15}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Intercepts Audited:</span>
                <span className="font-mono text-slate-900 font-bold">
                  {audioAnalysis?.recordingsProcessed || 0} recording(s)
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Vocal Stress Index:</span>
                <span className={`font-semibold ${
                  (audioAnalysis?.averageStressScore || 0) >= 75 ? 'text-rose-700 font-bold' : 'text-emerald-700 font-bold'
                }`}>
                  {audioAnalysis?.averageStressScore || 0}/100
                </span>
              </div>
              <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700">
                {audioAnalysis?.voiceBiometricAnomalies[0] || 'Nominal acoustic parameters observed.'}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-cyan-700 group-hover:text-cyan-800 font-bold">
              <span>View Wiretap Forensics</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Risk Drivers & Explainable Reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Drivers */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Explainable Findings: Primary Risk Drivers</span>
          </h4>
          <ul className="space-y-2.5">
            {riskAssessment.keyRiskDrivers.map((driver, index) => (
              <li key={index} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800">
                <span className="flex-shrink-0 w-5 h-5 rounded bg-rose-100 text-rose-800 border border-rose-200 flex items-center justify-center font-mono text-[11px] font-bold">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cross-Modal Evidence Synthesis Quick Box */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-slate-700" />
              <span>Evidence Correlation Engine</span>
            </h4>
            <p className="text-xs text-slate-600 mb-3 leading-relaxed">
              Multimodal triangulation connects isolated indicators into a legally actionable fraud narrative:
            </p>
            <div className="space-y-2">
              {currentCase.correlations.slice(0, 2).map((corr) => (
                <div key={corr.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="font-bold text-slate-900 mb-1">{corr.title}</div>
                  <div className="text-slate-600 text-[11px] leading-normal line-clamp-2">{corr.description}</div>
                  <div className="mt-2 text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block font-semibold">
                    {corr.causalChain}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            id="view-all-correlations-btn"
            onClick={() => onNavigateTab('correlation')}
            className="mt-4 w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <span>Inspect Full Evidence Correlation Matrix</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4-Pillar Explainable AI Root-Cause Diagnostic Matrix (Feature 4) */}
      <ExplainableAiDiagnostic currentCase={currentCase} />
    </div>
  );
};
