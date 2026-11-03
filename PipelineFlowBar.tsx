import React from 'react';
import { 
  Database, 
  Cpu, 
  Bot, 
  Users, 
  Network, 
  ShieldAlert, 
  FileCheck, 
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { PipelineStage } from '../types';

interface PipelineFlowBarProps {
  currentStage: PipelineStage;
  onSelectStage: (stage: PipelineStage) => void;
  isRunningAi?: boolean;
}

interface StageDefinition {
  id: PipelineStage;
  title: string;
  shortDesc: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string;
}

const STAGES: StageDefinition[] = [
  {
    id: 'financial_data',
    title: 'Financial Data',
    shortDesc: 'Multimodal Ingestion',
    icon: Database,
    details: 'Ingestion of bank ledgers (CSV/JSON), scanned invoices & checks (PDF/PNG), internal chat logs, and corporate registries.',
  },
  {
    id: 'preprocessing',
    title: 'Preprocessing',
    shortDesc: 'Norm & Cleansing',
    icon: Cpu,
    details: 'Tokenization, currency normalization, metadata extraction, image contrast enhancement, and OCR layout segmentation.',
  },
  {
    id: 'multimodal_ai',
    title: 'Multimodal AI',
    shortDesc: 'Embeddings & Vision',
    icon: Bot,
    details: 'Gemini visual reasoning for document layout forensics, transformer NLP sentiment analysis, and graph embedding projections.',
  },
  {
    id: 'multiple_agents',
    title: 'Multiple AI Agents',
    shortDesc: '4 Specialized Agents',
    icon: Users,
    details: 'Parallel execution of Transaction Agent, Document Agent (OCR), Text Agent (NLP), and Graph Agent (Topology).',
  },
  {
    id: 'evidence_correlation',
    title: 'Evidence Correlation',
    shortDesc: 'Cross-Modal Fusion',
    icon: Network,
    details: 'Temporal alignment, contradiction resolution, and cross-agent triangulation linking invoice sums to smurfed wire batches.',
  },
  {
    id: 'risk_assessment',
    title: 'Risk Assessment',
    shortDesc: 'Score & Confidence',
    icon: ShieldAlert,
    details: 'Weighted Bayesian scoring model computing overall fraud risk score (0-100), risk tier, and statistical confidence.',
  },
  {
    id: 'explainable_results',
    title: 'Explainable Results',
    shortDesc: 'Root-Cause Reasons',
    icon: FileCheck,
    details: 'Human-interpretable causal reasoning chain explaining exactly which evidence items triggered the risk score.',
  },
  {
    id: 'investigation_report',
    title: 'Investigation Report',
    shortDesc: 'SAR / STR & Dossier',
    icon: FileText,
    details: 'FinCEN SAR filing draft, statutory violation citations, evidentiary exhibits table, and investigator sign-off package.',
  },
];

export const PipelineFlowBar: React.FC<PipelineFlowBarProps> = ({
  currentStage,
  onSelectStage,
  isRunningAi = false,
}) => {
  return (
    <div id="pipeline-flow-container" className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs text-slate-900">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider text-slate-800 uppercase">Architecture Flow</span>
          <span className="text-xs text-slate-500">| Multimodal Pipeline Execution</span>
        </div>
        {isRunningAi ? (
          <div className="flex items-center gap-2 text-xs text-amber-800 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
            <span>AI Agents Analyzing Multimodal Evidence...</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>Pipeline Synchronized</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = currentStage === stage.id;
          const isCompleted = true; // In active case, all stages are processed

          return (
            <button
              key={stage.id}
              id={`stage-button-${stage.id}`}
              onClick={() => onSelectStage(stage.id)}
              className={`text-left p-2.5 rounded-lg border transition-all relative flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'bg-slate-100 border-slate-700 shadow-xs ring-1 ring-slate-400 text-slate-950 font-bold'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className="text-[10px] font-mono text-slate-500 font-semibold">
                  0{idx + 1}
                </span>
                <div className="p-1 rounded bg-slate-100 border border-slate-200 text-slate-700">
                  <Icon className="w-3.5 h-3.5 text-slate-700" />
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold leading-snug line-clamp-1">{stage.title}</div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{stage.shortDesc}</div>
              </div>

              {isActive && (
                <div className="mt-2 pt-1.5 border-t border-slate-300 flex items-center justify-between text-[10px] text-slate-800 font-bold">
                  <span>Selected Stage</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-800"></span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic stage detail drawer / banner */}
      <div className="mt-3 pt-2.5 border-t border-slate-200 text-xs text-slate-700 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">
            {STAGES.find((s) => s.id === currentStage)?.title}:
          </span>
          <span className="text-slate-600">
            {STAGES.find((s) => s.id === currentStage)?.details}
          </span>
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Click any step to inspect agent telemetry & evidence modalities
        </div>
      </div>
    </div>
  );
};
