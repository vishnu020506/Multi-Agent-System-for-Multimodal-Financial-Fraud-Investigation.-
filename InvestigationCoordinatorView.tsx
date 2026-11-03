import React, { useState } from 'react';
import { 
  Bot, 
  Users, 
  ShieldAlert, 
  CheckCircle2, 
  Scale, 
  Sparkles, 
  FileCheck2, 
  TrendingUp, 
  FileText, 
  MessageSquare, 
  Share2, 
  Headphones, 
  Activity, 
  Award,
  ArrowRight,
  Gavel
} from 'lucide-react';
import { InvestigationCase, InvestigationCoordinatorAnalysis } from '../types';

interface InvestigationCoordinatorViewProps {
  currentCase: InvestigationCase;
  onNavigateTab: (tabId: string) => void;
}

export const InvestigationCoordinatorView: React.FC<InvestigationCoordinatorViewProps> = ({
  currentCase,
  onNavigateTab,
}) => {
  const coordinatorData: InvestigationCoordinatorAnalysis = currentCase.coordinatorAnalysis || {
    coordinatorVerdict: 'CONFIRMED_FRAUD_RING',
    consensusConfidence: 96.4,
    convergingAgentsCount: 6,
    totalAgentsCount: 6,
    agentVotes: [
      {
        agentName: 'Transaction Agent',
        score: currentCase.transactionAnalysis.riskScore,
        status: 'FLAGGED',
        keyContribution: 'Four structured wires in $9,500–$9,950 danger corridor violating 31 U.S.C. 5324.',
      },
      {
        agentName: 'Document Agent (OCR)',
        score: currentCase.documentAnalysis.riskScore,
        status: 'FLAGGED',
        keyContribution: 'Invoice stated grand total contains unexplained surplus of +$70,900 over line items.',
      },
      {
        agentName: 'Text Agent (NLP)',
        score: currentCase.textAnalysis.riskScore,
        status: 'FLAGGED',
        keyContribution: 'Executive email directive coercing staff to split tranches to evade automated bank CTRs.',
      },
      {
        agentName: 'Graph Agent (Network)',
        score: currentCase.graphAnalysis.riskScore,
        status: 'FLAGGED',
        keyContribution: 'Tarjan SCC cycle confirmed: closed circular fund loop between Apex and Horizon BVI.',
      },
      {
        agentName: 'Behavior Agent (Baseline)',
        score: currentCase.behaviorAnalysis?.riskScore || 91,
        status: 'FLAGGED',
        keyContribution: '184-day dormant account sudden reactivation with nocturnal wire execution (01:14 AM).',
      },
      {
        agentName: 'Audio Agent (Wiretaps)',
        score: currentCase.audioAnalysis?.riskScore || 89,
        status: 'FLAGGED',
        keyContribution: 'Title III wiretap intercepts verbal structuring commands with voice stress index of 89/100.',
      },
    ],
    contradictionResolution:
      'The initial documentation claimed standard trade consulting, but mathematical line-item reconciliation revealed a 256% over-billing variance that precisely matched the aggregate volume of the structured wire transfers.',
    synthesisSummary:
      'The evidence across all 6 specialized intelligence vectors demonstrates a unified, deliberate trade-based money laundering scheme. The target entity utilized offshore shell corporations in the British Virgin Islands to layer funds via structured sub-$10,000 wire batches while forging commercial invoices.',
    statutoryViolations: [
      '31 U.S.C. § 5324: Structuring Transactions to Evade Currency Reporting Requirements',
      '18 U.S.C. § 1956: Laundering of Monetary Instruments via Commercial Billing Forgery',
      '18 U.S.C. § 1343: Federal Wire Fraud in Execution of Layering Schemes',
      'FinCEN Advisory FIN-2023-A001: Trade-Based Money Laundering Indicators',
    ],
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase font-bold border border-amber-500/30">
                  Lead Orchestration Engine
                </span>
                <span className="text-xs text-slate-400">Bayesian Multi-Agent Consensus & Contradiction Resolution</span>
              </div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Multi-Agent Intelligence Orchestrator
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                Synthesizes forensic verdicts from all 6 specialized intelligence vectors, resolves evidentiary discrepancies via Bayesian convergence, and produces formal statutory findings for FinCEN SAR adjudication.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-950 border border-amber-500/40 rounded-xl text-right">
              <div className="text-[10px] text-slate-400 font-mono">Consensus Confidence</div>
              <div className="text-2xl font-black text-amber-400 font-mono">
                {coordinatorData.consensusConfidence}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Supreme Coordinator Verdict Box */}
      <div className="p-5 bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/40 border border-rose-500/40 rounded-2xl shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 font-bold">
                Coordinator Final Adjudication
              </span>
              <h2 className="text-lg font-black text-slate-100 font-mono">
                {coordinatorData.coordinatorVerdict.replace(/_/g, ' ')}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <Users className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-bold">
              {coordinatorData.convergingAgentsCount} of {coordinatorData.totalAgentsCount} Specialized Agents in Agreement
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          {coordinatorData.synthesisSummary}
        </p>

        {/* Contradiction Resolution */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-amber-500/30 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px] uppercase">
            <Scale className="w-3.5 h-3.5" />
            <span>Contradiction Resolution Logic:</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            {coordinatorData.contradictionResolution}
          </p>
        </div>
      </div>

      {/* 6 Agents Consensus Voting Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" />
          <span>Multi-Agent Consensus Voting Breakdown (6 Voting Agents)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {coordinatorData.agentVotes.map((vote, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100">{vote.agentName}</span>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  {vote.score}/100
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {vote.keyContribution}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Vote Status: {vote.status}</span>
                <span className="text-emerald-400">Converged</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statutory Legal Violations */}
      <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Statutory Citations for Law Enforcement Referral (FinCEN / DOJ)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {coordinatorData.statutoryViolations.map((viol, i) => (
            <div
              key={i}
              className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs text-slate-300 font-mono text-[11px] flex items-start gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>{viol}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
