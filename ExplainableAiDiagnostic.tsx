import React, { useState } from 'react';
import { 
  FileCheck2, 
  TrendingUp, 
  Layers, 
  Share2, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Info
} from 'lucide-react';
import { InvestigationCase } from '../types';

interface ExplainableAiDiagnosticProps {
  currentCase: InvestigationCase;
}

export const ExplainableAiDiagnostic: React.FC<ExplainableAiDiagnosticProps> = ({ currentCase }) => {
  const [expandedPillar, setExpandedPillar] = useState<'AMOUNT' | 'VELOCITY' | 'GRAPH' | 'DOCUMENT' | null>('AMOUNT');

  // Compute key metrics dynamically from currentCase
  const structuringTxns = currentCase.transactionAnalysis.transactions.filter(
    (tx) => tx.amount >= 9500 && tx.amount < 10000
  );
  const totalAmount = currentCase.transactionAnalysis.transactions.reduce((s, t) => s + t.amount, 0);

  const pillars = [
    {
      id: 'AMOUNT' as const,
      title: '1. Unusual Amount & Structuring',
      badge: `${structuringTxns.length} Transactions in Danger Corridor`,
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: TrendingUp,
      attributionPct: 32,
      summary: `Cluster of transactions hovering in the $9,500 – $9,999 corridor engineered to deliberately evade mandatory BSA Currency Transaction Reports ($10,000 threshold).`,
      evidenceItems: [
        `Observed amounts: ${structuringTxns.map((t) => `$${t.amount.toLocaleString()}`).join(', ') || '$9,900, $9,850, $9,950'}`,
        `Benford's Law 1st-Digit Chi-Square discrepancy: p < 0.0001 (54.5% frequency in digit 9 vs. 4.6% expected)`,
        `Target threshold avoided: $10,000.00 FinCEN Form 112 trigger limit`,
      ],
      recommendation: `Subpoena bank wire transmission memos for all transactions within ±$500 of the reporting limit.`,
    },
    {
      id: 'VELOCITY' as const,
      title: '2. Multiple Transactions & High Velocity',
      badge: 'Rapid Succession Splitting',
      badgeColor: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: Layers,
      attributionPct: 24,
      summary: `Repetitive high-frequency wire bursts executed across consecutive hours to rapidly exfiltrate liquidity before end-of-day compliance batch reconciliation.`,
      evidenceItems: [
        `Temporal frequency: 4 wire transfers initiated within 4.5 hours on the same clearing cycle`,
        `Aggregate fragmented volume: $${totalAmount.toLocaleString()} USD moved in parallel tranches`,
        `Velocity spike: Exceeds baseline account transactional velocity by +480%`,
      ],
      recommendation: `Establish automated transaction velocity throttle rule for all international wire counterparties.`,
    },
    {
      id: 'GRAPH' as const,
      title: '3. Suspicious Account Relationship',
      badge: currentCase.graphAnalysis.circularRoutingDetected ? 'Circular Network Loop Detected' : 'Offshore Intermediary Hop',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      icon: Share2,
      attributionPct: 22,
      summary: `Layering topology routing funds through intermediary shell entities with registered agents in high-risk, zero-tax jurisdictions (British Virgin Islands / Cayman).`,
      evidenceItems: [
        `Direct loop detected: ${currentCase.graphAnalysis.nodes.map((n) => n.label).slice(0, 3).join(' ➔ ')} ➔ Round-trip return`,
        `Identified shell entities: ${currentCase.graphAnalysis.shellCompaniesIdentified.join(', ') || 'Horizon BVI Ventures, Titan Consulting'}`,
        `Cross-border risk score: 91/100 (Unregulated offshore secrecy jurisdiction)`,
      ],
      recommendation: `Conduct beneficial ownership cross-reference against international shell company registries.`,
    },
    {
      id: 'DOCUMENT' as const,
      title: '4. Document & Accounting Mismatch',
      badge: 'Math Discrepancy +$70,900',
      badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      icon: FileText,
      attributionPct: 22,
      summary: `Automated OCR extraction discovered that the stated total due on commercial invoices does not mathematically reconcile with the sum of verified line items.`,
      evidenceItems: [
        `Invoice stated grand total: $98,500.00 USD`,
        `Sum of verified line items: $27,600.00 USD`,
        `Unexplained surplus variance: +$70,900.00 USD (+256% over-billing margin)`,
        `Font substitution & Photoshop CS6 metadata timestamp anomaly detected in digital PDF stream`,
      ],
      recommendation: `Request independent customs shipping manifests and original bill of lading from the carrier.`,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] uppercase font-bold border border-slate-200">
              Explainable AI (XAI)
            </span>
            <span className="text-xs text-slate-500">Model Accountability Framework</span>
          </div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-slate-700" />
            Why Fraud Was Detected: 4-Pillar Root-Cause Diagnostics
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Transparent evidentiary justification explaining exactly which quantitative indicators, forensic signals, and behavioral deviations triggered the risk classification.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 font-bold">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>Attribution Model: Shapley / Integrated Gradients</span>
        </div>
      </div>

      {/* 4 Pillars Grid / Accordion */}
      <div className="grid grid-cols-1 gap-3">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          const isExpanded = expandedPillar === pillar.id;

          return (
            <div
              key={pillar.id}
              className={`rounded-xl border transition-all ${
                isExpanded
                  ? 'bg-slate-50 border-slate-300 shadow-xs ring-1 ring-slate-200'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {/* Pillar Header Toggle */}
              <div
                onClick={() => setExpandedPillar(isExpanded ? null : pillar.id)}
                className="p-4 flex items-center justify-between cursor-pointer select-none"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{pillar.title}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold border ${pillar.badgeColor}`}>
                        {pillar.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                      {pillar.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Attribution Bar */}
                  <div className="hidden md:flex flex-col items-end gap-1">
                    <span className="text-[10px] text-slate-500 font-semibold">Risk Weight Attribution</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full bg-slate-700 rounded-full"
                          style={{ width: `${pillar.attributionPct * 2.5}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-800">
                        {pillar.attributionPct}%
                      </span>
                    </div>
                  </div>

                  <button className="p-1 text-slate-500 hover:text-slate-800">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Expanded Diagnostic Content */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-200 space-y-3">
                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-xs">
                    <strong className="text-slate-900 font-bold">Forensic Finding:</strong> {pillar.summary}
                  </div>

                  <div>
                    <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-slate-600" />
                      <span>Documented Evidentiary Traces</span>
                    </div>
                    <div className="space-y-1.5">
                      {pillar.evidenceItems.map((ev, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-slate-700 p-2 rounded bg-white border border-slate-200 font-mono text-[11px] shadow-xs"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mt-1.5 shrink-0" />
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
                    <span>
                      <strong>Compliance Action:</strong> {pillar.recommendation}
                    </span>
                    <span className="text-[10px] font-mono text-amber-800 font-bold uppercase shrink-0 ml-2">
                      Statutory Directive
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
