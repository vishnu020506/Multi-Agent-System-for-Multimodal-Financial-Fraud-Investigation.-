import React, { useState } from 'react';
import { 
  Cpu, 
  Database, 
  BarChart3, 
  Layers, 
  Sparkles, 
  FileText, 
  Share2, 
  Headphones, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  Sliders,
  Hash,
  Activity
} from 'lucide-react';
import { InvestigationCase, BenfordDigitStat } from '../types';

interface PreprocessingAgentViewProps {
  currentCase: InvestigationCase;
  onProceedToAgents: () => void;
}

export const PreprocessingAgentView: React.FC<PreprocessingAgentViewProps> = ({
  currentCase,
  onProceedToAgents,
}) => {
  const [isRecomputing, setIsRecomputing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'BENFORD' | 'DOCUMENT_FEATURES' | 'NLP_FEATURES' | 'GRAPH_FEATURES' | 'AUDIO_FEATURES' | 'TENSOR_EMBEDDING'>('BENFORD');
  const [normalizationMethod, setNormalizationMethod] = useState<'Z_SCORE' | 'MIN_MAX' | 'ROBUST_SCALER'>('ROBUST_SCALER');
  const [recomputeSuccess, setRecomputeSuccess] = useState<string | null>(null);

  // Benford's Law 1st Digit Distribution Data
  // In structured cases (Apex Logistics / Nexus), digit 9 has massive anomalous spike!
  const benfordData: BenfordDigitStat[] = [
    { digit: 1, actualPct: 12.5, theoreticalPct: 30.1, isAnomaly: false },
    { digit: 2, actualPct: 8.3, theoreticalPct: 17.6, isAnomaly: false },
    { digit: 3, actualPct: 4.2, theoreticalPct: 12.5, isAnomaly: false },
    { digit: 4, actualPct: 4.1, theoreticalPct: 9.7, isAnomaly: false },
    { digit: 5, actualPct: 6.2, theoreticalPct: 7.9, isAnomaly: false },
    { digit: 6, actualPct: 2.1, theoreticalPct: 6.7, isAnomaly: false },
    { digit: 7, actualPct: 3.0, theoreticalPct: 5.8, isAnomaly: false },
    { digit: 8, actualPct: 5.1, theoreticalPct: 5.1, isAnomaly: false },
    { digit: 9, actualPct: 54.5, theoreticalPct: 4.6, isAnomaly: true }, // 54.5% due to $9,900, $9,850, etc!
  ];

  // Simulated 128-dimensional embedding vector sample
  const sampleTensorHead = [
    0.842, -0.419, 0.912, 0.104, -0.781, 0.655, 0.312, -0.098, 0.991, 0.723, -0.541, 0.884,
    0.219, -0.634, 0.447, 0.832, -0.192, 0.671, 0.509, -0.873, 0.945, 0.128, -0.366, 0.718
  ];

  const handleRecompute = () => {
    setIsRecomputing(true);
    setTimeout(() => {
      setIsRecomputing(false);
      setRecomputeSuccess('Multi-modal feature tensors normalized across 5 modalities (P-value < 0.0001).');
      setTimeout(() => setRecomputeSuccess(null), 4000);
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] uppercase font-bold border border-cyan-500/30">
                Pipeline Stages 2 & 3
              </span>
              <span className="text-xs text-slate-400">Target Entity:</span>
              <span className="text-xs font-bold text-slate-200">{currentCase.targetEntity}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-cyan-400" />
              Data Preprocessing & Feature Extraction Studio
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Mathematical normalization, statistical Benford's Law anomaly modeling, OCR despeckling, NLP tokenization, graph topology centrality, and 128-dimensional multimodal tensor fusion.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRecompute}
              disabled={isRecomputing}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium transition cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRecomputing ? 'animate-spin' : ''}`} />
              <span>{isRecomputing ? 'Extracting Features...' : 'Re-Extract Features'}</span>
            </button>

            <button
              onClick={onProceedToAgents}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              <span>Feed to 5 AI Agents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {recomputeSuccess && (
          <div className="mt-4 p-3 bg-cyan-950/60 border border-cyan-500/40 rounded-xl text-xs text-cyan-300 flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>{recomputeSuccess}</span>
          </div>
        )}
      </div>

      {/* Feature Domain Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-2 pb-1">
        <button
          onClick={() => setActiveSubTab('BENFORD')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeSubTab === 'BENFORD'
              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Benford's Law (1st-Digit Structuring)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('DOCUMENT_FEATURES')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeSubTab === 'DOCUMENT_FEATURES'
              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>OCR & Visual Extraction</span>
        </button>

        <button
          onClick={() => setActiveSubTab('NLP_FEATURES')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeSubTab === 'NLP_FEATURES'
              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>NLP Tokens & Coercive Intent</span>
        </button>

        <button
          onClick={() => setActiveSubTab('GRAPH_FEATURES')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeSubTab === 'GRAPH_FEATURES'
              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Topology & Centrality Matrix</span>
        </button>

        <button
          onClick={() => setActiveSubTab('AUDIO_FEATURES')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeSubTab === 'AUDIO_FEATURES'
              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Acoustic MFCC & Vocal Jitter</span>
        </button>

        <button
          onClick={() => setActiveSubTab('TENSOR_EMBEDDING')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeSubTab === 'TENSOR_EMBEDDING'
              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Hash className="w-4 h-4" />
          <span>128-D Multi-Modal Tensor</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        {/* Sub-tab 1: Benford's Law */}
        {activeSubTab === 'BENFORD' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  Benford's Law 1st-Digit Frequency Distribution
                </h3>
                <p className="text-xs text-slate-400">
                  Natural financial transactions follow a logarithmic digit distribution. Massive spikes at digit 9 indicate intentional evasion of the $10,000 BSA reporting threshold.
                </p>
              </div>

              <div className="px-3 py-1 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Chi-Square Discrepancy: p &lt; 0.0001 (CRITICAL)</span>
              </div>
            </div>

            {/* Benford Bar Chart Comparison */}
            <div className="space-y-3 p-4 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-amber-500 rounded" />
                    <span>Observed Transaction Digit Frequency (%)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-3 h-3 bg-slate-600 rounded" />
                    <span>Theoretical Benford Standard (%)</span>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-400">Digit 9 Spike: +49.9% Variance</span>
              </div>

              <div className="grid grid-cols-9 gap-2 items-end h-56 pt-4 border-b border-slate-800 pb-2">
                {benfordData.map((item) => (
                  <div key={item.digit} className="flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="text-[10px] font-mono text-slate-400 group-hover:text-amber-300 transition">
                      {item.actualPct}%
                    </div>

                    <div className="w-full flex items-end justify-center gap-1 h-44">
                      {/* Observed bar */}
                      <div
                        className={`w-1/2 rounded-t transition-all ${
                          item.isAnomaly
                            ? 'bg-rose-500 group-hover:bg-rose-400 shadow-lg shadow-rose-500/20'
                            : 'bg-amber-500 group-hover:bg-amber-400'
                        }`}
                        style={{ height: `${(item.actualPct / 60) * 100}%` }}
                        title={`Observed: ${item.actualPct}%`}
                      />
                      {/* Theoretical bar */}
                      <div
                        className="w-1/2 bg-slate-700 rounded-t group-hover:bg-slate-600 transition-all"
                        style={{ height: `${(item.theoreticalPct / 60) * 100}%` }}
                        title={`Theoretical: ${item.theoreticalPct}%`}
                      />
                    </div>

                    <div className={`text-xs font-bold font-mono mt-1 ${
                      item.isAnomaly ? 'text-rose-400 ring-1 ring-rose-500 px-1.5 rounded' : 'text-slate-300'
                    }`}>
                      d = {item.digit}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-200">
                <span className="font-bold">Automated Forensic Finding:</span> The observed distribution exhibits a non-random clustering in digit 9 (54.5% vs. theoretical 4.6%). This conclusively proves deliberate artificial structuring around the $9,500 – $9,999 corridor.
              </div>
            </div>
          </div>
        )}

        {/* Sub-tab 2: Document OCR Features */}
        {activeSubTab === 'DOCUMENT_FEATURES' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              Document OCR Preprocessing & Font Entropy Telemetry
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs text-slate-400">Mean OCR Confidence</div>
                <div className="text-xl font-bold text-emerald-400 font-mono">96.8%</div>
                <div className="text-[10px] text-slate-500">Tesseract layout segmentation</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs text-slate-400">Mathematical Discrepancy</div>
                <div className="text-xl font-bold text-rose-400 font-mono">+$70,900.00</div>
                <div className="text-[10px] text-slate-500">Stated total vs. line items sum</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs text-slate-400">Font Substitution Count</div>
                <div className="text-xl font-bold text-amber-400 font-mono">4 Glyphs Mismatched</div>
                <div className="text-[10px] text-slate-500">Helvetica vs. Arial PostScript</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-slate-200">Preprocessing Pipeline Stages Executed:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                <div className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Adaptive Otsu Image Binarization (128 threshold)</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hough Transform Skew Correction (-0.84 deg)</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>EXIF Photoshop CS6 Stream Signature Extraction</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Entity Alignment with Corporate Tax Registries</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-tab 3: NLP Features */}
        {activeSubTab === 'NLP_FEATURES' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              NLP Tokenization & Coercive Intent Vectors
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs text-slate-400">Sentiment Polarity</div>
                <div className="text-xl font-bold text-rose-400 font-mono">-0.88 (Evasive)</div>
                <div className="text-[10px] text-slate-500">Scale: -1.0 (hostile) to +1.0</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs text-slate-400">Coercive Intent Index</div>
                <div className="text-xl font-bold text-amber-400 font-mono">0.94 / 1.00</div>
                <div className="text-[10px] text-slate-500">Urgency & hierarchical pressure</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs text-slate-400">Evasion Keywords Density</div>
                <div className="text-xl font-bold text-amber-300 font-mono">8.4 occurrences/k</div>
                <div className="text-[10px] text-slate-500">CTR, split, threshold, off-book</div>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-bold text-slate-200">Named Entity Recognition (NER) Spans:</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                  PERSON: David Vance (VP)
                </span>
                <span className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  ORG: Apex Global Logistics Ltd (BVI)
                </span>
                <span className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs">
                  MONEY: $9,900.00 USD
                </span>
                <span className="px-2 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs">
                  JURISDICTION: Tortola, British Virgin Islands
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Sub-tab 4: Graph Features */}
        {activeSubTab === 'GRAPH_FEATURES' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-amber-400" />
              Graph Topology & Centrality Matrix
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400">Network Nodes</div>
                <div className="text-lg font-bold text-slate-100 font-mono">
                  {currentCase.graphAnalysis.nodes.length} Entities
                </div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400">Directed Edges</div>
                <div className="text-lg font-bold text-slate-100 font-mono">
                  {currentCase.graphAnalysis.edges.length} Wire Flows
                </div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400">Tarjan SCC Cycles</div>
                <div className="text-lg font-bold text-rose-400 font-mono">1 Closed Loop</div>
              </div>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                <div className="text-[11px] text-slate-400">Hub Centrality</div>
                <div className="text-lg font-bold text-amber-400 font-mono">Apex Offshore Sub</div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-tab 5: Audio Acoustic Features */}
        {activeSubTab === 'AUDIO_FEATURES' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Headphones className="w-4 h-4 text-amber-400" />
              Acoustic Mel-Frequency Cepstral Coefficients (MFCC) & Pitch Telemetry
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs text-slate-400">Mean Fundamental Pitch (F0)</div>
                <div className="text-xl font-bold text-amber-300 font-mono">184 Hz (Elevated)</div>
                <div className="text-[10px] text-slate-500">Baseline resting pitch: 122 Hz</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs text-slate-400">Vocal Micro-Jitter</div>
                <div className="text-xl font-bold text-rose-400 font-mono">2.84% (High Stress)</div>
                <div className="text-[10px] text-slate-500">Normal range: &lt; 1.04%</div>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs text-slate-400">Spectral Flux Discontinuity</div>
                <div className="text-xl font-bold text-cyan-300 font-mono">0.038 dB/ms</div>
                <div className="text-[10px] text-slate-500">Coercion acoustic pattern confirmed</div>
              </div>
            </div>
          </div>
        )}

        {/* Sub-tab 6: Tensor Embedding */}
        {activeSubTab === 'TENSOR_EMBEDDING' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-cyan-400" />
                  128-Dimensional Multimodal Feature Vector Tensor
                </h3>
                <p className="text-xs text-slate-400">
                  Fused representation concatenating transaction, OCR, NLP, graph, and audio embeddings.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Scaler:</span>
                <select
                  value={normalizationMethod}
                  onChange={(e) => setNormalizationMethod(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200"
                >
                  <option value="ROBUST_SCALER">RobustScaler (Median / IQR)</option>
                  <option value="Z_SCORE">StandardScaler (Z-Score)</option>
                  <option value="MIN_MAX">MinMaxScaler [0, 1]</option>
                </select>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Vector Head [0..23 of 128 dimensions]:</span>
                <span className="text-cyan-400">PCA Variance: 91.4%</span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 font-mono text-[11px]">
                {sampleTensorHead.map((val, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded border text-center ${
                      val > 0.7
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                        : val < -0.4
                        ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-[9px] text-slate-500">dim_{idx}</div>
                    <div>{val.toFixed(3)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
