import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Sliders, 
  Sparkles, 
  TrendingUp, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Scale, 
  Clock, 
  ShieldCheck,
  RefreshCw,
  Zap
} from 'lucide-react';
import { HybridAiEvaluation, InvestigationCase } from '../types';

interface HybridAiEngineViewProps {
  currentCase: InvestigationCase;
}

export const HybridAiEngineView: React.FC<HybridAiEngineViewProps> = ({ currentCase }) => {
  // Configurable ensemble weights
  const [weights, setWeights] = useState({
    ruleEngine: 20,
    isolationForest: 25,
    randomForest: 25,
    graphAnalysis: 15,
    llmAgent: 15,
  });

  const [scores] = useState({
    ruleEngine: 95,
    isolationForest: 88,
    randomForest: 92,
    graphAnalysis: 90,
    llmAgent: 94,
  });

  const totalWeight: number = (Object.values(weights) as number[]).reduce((a: number, b: number) => a + b, 0) || 100;

  const calculateCompositeScore = () => {
    const raw = (
      scores.ruleEngine * weights.ruleEngine +
      scores.isolationForest * weights.isolationForest +
      scores.randomForest * weights.randomForest +
      scores.graphAnalysis * weights.graphAnalysis +
      scores.llmAgent * weights.llmAgent
    ) / totalWeight;
    return Math.round(raw * 10) / 10;
  };

  const composite = calculateCompositeScore();

  const handleResetWeights = () => {
    setWeights({
      ruleEngine: 20,
      isolationForest: 25,
      randomForest: 25,
      graphAnalysis: 15,
      llmAgent: 15,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl text-blue-400">
              <Layers className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] uppercase font-bold border border-blue-500/30">
                  Hybrid AI Engine
                </span>
                <span className="text-xs text-slate-400">5-Layer Ensemble Methodology</span>
              </div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Hybrid AI Multi-Model Fraud Detection Engine
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                Combines deterministic compliance rules, unsupervised Isolation Forests, supervised Random Forests, Graph Centrality algorithms, and LLM reasoning to ensure robust, defense-grade fraud adjudication.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-950 border border-blue-500/40 rounded-xl text-right">
              <div className="text-[10px] text-slate-400 font-mono">Ensemble Composite</div>
              <div className="text-2xl font-black text-rose-400 font-mono">
                {composite}<span className="text-xs font-normal text-slate-500">/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Detection Layers Architecture Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Layer 1: Rule Engine */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-100">1. Rule Engine</span>
            <span className="text-xs font-mono font-bold text-rose-400">{scores.ruleEngine}/100</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Hard compliance constraints (BSA $10k structuring threshold, OFAC sanctions filter, rapid velocity bounds).
          </p>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-800">
            <Clock className="w-3 h-3" />
            <span>3 ms latency</span>
          </div>
        </div>

        {/* Layer 2: Isolation Forest */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-100">2. Isolation Forest</span>
            <span className="text-xs font-mono font-bold text-amber-400">{scores.isolationForest}/100</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Unsupervised tree isolation scoring anomalous outlier multidimensional data points with 100 estimators.
          </p>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-800">
            <Clock className="w-3 h-3" />
            <span>12 ms latency</span>
          </div>
        </div>

        {/* Layer 3: Random Forest */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-100">3. Random Forest</span>
            <span className="text-xs font-mono font-bold text-rose-400">{scores.randomForest}/100</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Supervised binary classifier trained on 24 feature tensors (Benford metrics, z-scores, velocity, amount delta).
          </p>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-800">
            <Clock className="w-3 h-3" />
            <span>16 ms latency</span>
          </div>
        </div>

        {/* Layer 4: Graph Analysis */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-100">4. Graph Analysis</span>
            <span className="text-xs font-mono font-bold text-purple-400">{scores.graphAnalysis}/100</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Betweenness centrality, PageRank, and Tarjan's strongly connected components detecting circular loops.
          </p>
          <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 pt-1 border-t border-slate-800">
            <Clock className="w-3 h-3" />
            <span>24 ms latency</span>
          </div>
        </div>

        {/* Layer 5: LLM Reasoning */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-100">5. LLM Reasoning</span>
            <span className="text-xs font-mono font-bold text-cyan-400">{scores.llmAgent}/100</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Gemini Multimodal reasoning correlating invoice math errors, email coercion, and wiretap transcripts.
          </p>
          <div className="text-[10px] font-mono text-amber-400 flex items-center gap-1 pt-1 border-t border-slate-800">
            <Clock className="w-3 h-3" />
            <span>320 ms latency</span>
          </div>
        </div>
      </div>

      {/* Interactive Model Weights Tuning Console */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              Interactive Ensemble Weights Calibration Console
            </h3>
            <p className="text-xs text-slate-400">
              Adjust layer weighting percentages to test Bayesian ensemble sensitivity and model consensus robustness.
            </p>
          </div>
          <button
            onClick={handleResetWeights}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Default Weights</span>
          </button>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Rule Engine</span>
              <span className="font-mono font-bold text-amber-400">{weights.ruleEngine}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={weights.ruleEngine}
              onChange={(e) => setWeights({ ...weights, ruleEngine: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Isolation Forest</span>
              <span className="font-mono font-bold text-amber-400">{weights.isolationForest}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={weights.isolationForest}
              onChange={(e) => setWeights({ ...weights, isolationForest: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Random Forest</span>
              <span className="font-mono font-bold text-amber-400">{weights.randomForest}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={weights.randomForest}
              onChange={(e) => setWeights({ ...weights, randomForest: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Graph Analysis</span>
              <span className="font-mono font-bold text-amber-400">{weights.graphAnalysis}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={weights.graphAnalysis}
              onChange={(e) => setWeights({ ...weights, graphAnalysis: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>LLM Multi-Agent</span>
              <span className="font-mono font-bold text-amber-400">{weights.llmAgent}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={weights.llmAgent}
              onChange={(e) => setWeights({ ...weights, llmAgent: Number(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Mathematical Formula Preview */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <span className="text-slate-500 font-bold">Ensemble Equation: </span>
            <span className="text-slate-200">
              S = ({scores.ruleEngine} × {weights.ruleEngine}% + {scores.isolationForest} × {weights.isolationForest}% + {scores.randomForest} × {weights.randomForest}% + {scores.graphAnalysis} × {weights.graphAnalysis}% + {scores.llmAgent} × {weights.llmAgent}%)
            </span>
          </div>
          <div className="text-rose-400 font-bold whitespace-nowrap">
            = {composite} / 100 (CRITICAL TIER)
          </div>
        </div>
      </div>
    </div>
  );
};
