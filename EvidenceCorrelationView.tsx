import React from 'react';
import { 
  Network, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  TrendingUp, 
  FileSearch, 
  MessageSquare, 
  Share2,
  Headphones 
} from 'lucide-react';
import { EvidenceCorrelationLink } from '../types';

interface EvidenceCorrelationViewProps {
  correlations: EvidenceCorrelationLink[];
}

export const EvidenceCorrelationView: React.FC<EvidenceCorrelationViewProps> = ({
  correlations,
}) => {
  const getModalityIcon = (mod: 'TRANSACTION' | 'DOCUMENT' | 'TEXT' | 'GRAPH' | 'AUDIO') => {
    switch (mod) {
      case 'TRANSACTION':
        return <TrendingUp className="w-3.5 h-3.5 text-blue-400" />;
      case 'DOCUMENT':
        return <FileSearch className="w-3.5 h-3.5 text-amber-400" />;
      case 'TEXT':
        return <MessageSquare className="w-3.5 h-3.5 text-purple-400" />;
      case 'GRAPH':
        return <Share2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'AUDIO':
        return <Headphones className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const getModalityBadge = (mod: 'TRANSACTION' | 'DOCUMENT' | 'TEXT' | 'GRAPH' | 'AUDIO') => {
    switch (mod) {
      case 'TRANSACTION':
        return 'bg-blue-950/60 text-blue-300 border-blue-800';
      case 'DOCUMENT':
        return 'bg-amber-950/60 text-amber-300 border-amber-800';
      case 'TEXT':
        return 'bg-purple-950/60 text-purple-300 border-purple-800';
      case 'GRAPH':
        return 'bg-emerald-950/60 text-emerald-300 border-emerald-800';
      case 'AUDIO':
        return 'bg-cyan-950/60 text-cyan-300 border-cyan-800';
    }
  };

  return (
    <div id="evidence-correlation-view" className="space-y-6">
      {/* Top Banner: Correlation Engine Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Cross-Modal Evidence Correlation Engine</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  Engine Status: Active Synchronized
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Fuses multimodal data from 5 specialized agents to establish chronological causality, resolve contradictions, and prove intent.
              </p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400">Correlated Chains</div>
            <div className="text-2xl font-bold font-mono text-amber-400">
              {correlations.length} Multimodal Triangulations
            </div>
          </div>
        </div>

        {/* 5 Pillars Triangulation Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded bg-blue-500/10 border border-blue-500/30">
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="font-bold text-white">Transactions</div>
              <div className="text-[10px] text-slate-400">Ledger Velocity</div>
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded bg-amber-500/10 border border-amber-500/30">
              <FileSearch className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-white">Document OCR</div>
              <div className="text-[10px] text-slate-400">Visual Artifacts</div>
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded bg-purple-500/10 border border-purple-500/30">
              <MessageSquare className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="font-bold text-white">NLP Text</div>
              <div className="text-[10px] text-slate-400">Evasion Chat</div>
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/30">
              <Share2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-white">Graph Topology</div>
              <div className="text-[10px] text-slate-400">Shell Loops</div>
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-3">
            <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/30">
              <Headphones className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="font-bold text-white">Voice Wiretaps</div>
              <div className="text-[10px] text-slate-400">Acoustic Stress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Correlated Evidence Cards with Causal Chains */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Synthesized Fraud Causal Chains</span>
        </h3>

        <div className="space-y-4">
          {correlations.map((corr, idx) => (
            <div
              key={corr.id}
              id={`corr-card-${corr.id}`}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-slate-800 text-amber-400 font-mono text-xs font-bold flex items-center justify-center border border-slate-700">
                    {idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white">{corr.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    corr.significance === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-amber-950 text-amber-300 border-amber-800'
                  }`}>
                    {corr.significance} SIGNIFICANCE
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Confidence: <span className="text-white font-bold">{Math.round(corr.confidence * 100)}%</span>
                  </span>
                </div>
              </div>

              {/* Fused Modalities Chips */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 text-[11px] font-mono">Cross-Modal Triangulation:</span>
                <div className="flex flex-wrap gap-1.5">
                  {corr.modalities.map((m) => (
                    <span
                      key={m}
                      className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getModalityBadge(m)}`}
                    >
                      {getModalityIcon(m)}
                      <span>{m}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Description Body */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                {corr.description}
              </p>

              {/* Visual Causal Chain Flow */}
              <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg">
                <div className="text-[10px] font-mono uppercase font-bold text-amber-400 mb-1.5 flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-amber-400" />
                  <span>Verified Forensic Causal Sequence</span>
                </div>
                <div className="font-mono text-xs text-amber-200 bg-slate-950 p-2.5 rounded border border-slate-800">
                  {corr.causalChain}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
