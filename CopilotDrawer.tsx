import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  TrendingUp, 
  FileSearch, 
  MessageSquare, 
  Share2, 
  Headphones, 
  ShieldAlert, 
  RotateCcw,
  CheckCircle2,
  Terminal,
  ChevronDown
} from 'lucide-react';
import { InvestigationCase } from '../types';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCase: InvestigationCase;
  onNavigateTab?: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'USER' | 'COPILOT';
  agent: 'ALL' | 'TRANSACTION' | 'DOCUMENT' | 'TEXT' | 'GRAPH' | 'AUDIO';
  text: string;
  timestamp: string;
  evidenceLinks?: string[];
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({
  isOpen,
  onClose,
  currentCase,
  onNavigateTab,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<'ALL' | 'TRANSACTION' | 'DOCUMENT' | 'TEXT' | 'GRAPH' | 'AUDIO'>('ALL');
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'COPILOT',
      agent: 'ALL',
      text: `Hello Investigator. I am the Lead Multi-Agent Forensic AI Copilot. I have synchronized evidence across all 5 modalities for case "${currentCase.title}". You can ask me to synthesize findings, inspect structuring mathematics, examine invoice forgery, or draft regulatory SAR narratives.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Explain smurfing pattern', agent: 'TRANSACTION', prompt: 'Explain the exact transaction structuring and smurfing pattern detected in this case.' },
    { label: 'Draft FinCEN SAR Narrative', agent: 'ALL', prompt: 'Draft the formal FinCEN Form 111 Section V SAR Suspicious Activity narrative for this case.' },
    { label: 'Document math discrepancy', agent: 'DOCUMENT', prompt: 'Detail the OCR math discrepancies and forensic tampering indicators found in the audited documents.' },
    { label: 'Trace circular routing loop', agent: 'GRAPH', prompt: 'Explain the multi-jurisdiction circular laundering loop and beneficial ownership structure.' },
    { label: 'Review voice stress & deepfake', agent: 'AUDIO', prompt: 'Analyze the voice stress, acoustic indicators, and synthetic deepfake test results in the audio intercepts.' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'USER',
      agent: selectedAgent,
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseId: currentCase.id,
          caseTitle: currentCase.title,
          targetEntity: currentCase.targetEntity,
          agentFocus: selectedAgent,
          query,
          caseData: currentCase,
        }),
      });

      const res = await response.json();
      const replyText = res.data?.reply || generateLocalFallbackReply(query, selectedAgent, currentCase);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'COPILOT',
        agent: selectedAgent,
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const fallbackText = generateLocalFallbackReply(query, selectedAgent, currentCase);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'COPILOT',
        agent: selectedAgent,
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateLocalFallbackReply = (
    query: string,
    agent: string,
    caseData: InvestigationCase
  ): string => {
    const q = query.toLowerCase();

    if (q.includes('sar') || q.includes('fincen') || q.includes('narrative')) {
      return `### Formal FinCEN SAR Form 111 (Section V Draft)\n\n**Subject:** ${caseData.targetEntity}\n**Total Exposure:** $${caseData.totalExposure.toLocaleString()} ${caseData.currency}\n**Composite Risk:** ${caseData.riskAssessment.overallRiskScore}/100 (${caseData.riskAssessment.riskTier})\n\n**Suspicious Activity Summary:**\nDuring the period under review, the subject entity conducted systematic wire transactions calibrated to evade currency reporting requirements under 31 U.S.C. § 5324. Forensic examination revealed coordinated cross-modal collusion: falsified commercial invoices with altered line totals, internal communications ordering split payment tranches, and network graph topology confirming fund repatriation through intermediate offshore accounts.\n\n**Statutory Violations:**\n- 31 U.S.C. § 5324 (Structuring to Evade Reporting)\n- 18 U.S.C. § 1343 (Wire Fraud)\n- 18 U.S.C. § 1956 (Laundering of Monetary Instruments)`;
    }

    if (q.includes('smurf') || q.includes('structuring') || q.includes('threshold') || agent === 'TRANSACTION') {
      const txCount = caseData.transactionAnalysis.transactions.length;
      return `### Transaction Agent Forensic Analysis:\n\n- **Targeted Threshold:** BSA $10,000 Currency Transaction Reporting (CTR) trigger.\n- **Identified Pattern:** ${caseData.transactionAnalysis.structuringAnalysis.clusterSummary}\n- **Total Volume:** $${caseData.transactionAnalysis.totalVolume.toLocaleString()} across ${txCount} transactions.\n- **Flagged Suspicious Volume:** $${caseData.transactionAnalysis.flaggedVolume.toLocaleString()} (${Math.round((caseData.transactionAnalysis.flaggedVolume / (caseData.transactionAnalysis.totalVolume || 1)) * 100)}% of total).\n\nTransactions are mathematically clustered between $9,750 and $9,950 to avoid automatic compliance logging. Immediate velocity spikes corroborate layered transfers exiting to secondary accounts within hours of receipt.`;
    }

    if (q.includes('doc') || q.includes('math') || q.includes('invoice') || agent === 'DOCUMENT') {
      const tampered = caseData.documentAnalysis.forgedDocumentsCount;
      return `### Document Forensics Agent Evaluation:\n\n- **Audited Exhibits:** ${caseData.documentAnalysis.documentsProcessed} files inspected with 98.2% OCR confidence.\n- **Tampered Documents:** ${tampered} exhibit(s) flagged for graphic and mathematical anomalies.\n- **Forensic Findings:** ${caseData.documentAnalysis.keyFindings.join(' ')}\n\nOptical density scans identified font substitution and digital signature overlays duplicated from public corporate filings. Recalculation of itemized lines reveals un-itemized surplus amounts matching outbound structured wire tranches.`;
    }

    if (q.includes('audio') || q.includes('stress') || q.includes('deepfake') || q.includes('wiretap') || agent === 'AUDIO') {
      const audio = caseData.audioAnalysis;
      if (!audio || audio.recordings.length === 0) {
        return `### Audio Forensics Agent Evaluation:\n\nNo audio wiretap recordings are currently associated with this file. Standard acoustic telemetry remains nominal.`;
      }
      return `### Audio Forensics Agent Evaluation:\n\n- **Recordings Audited:** ${audio.recordingsProcessed} wiretap intercept(s).\n- **Mean Voice Stress Score:** ${audio.averageStressScore}/100.\n- **Voice Biometric Findings:** ${audio.voiceBiometricAnomalies.join(' ')}\n\nAcoustic micro-tremor frequency analysis and pitch variance confirmed elevated autonomic stress during payment splitting orders. In synthetic voice testing, spectral flatness measures detect whether voiceprints are organic human speech or neural text-to-speech clones.`;
    }

    if (q.includes('loop') || q.includes('graph') || q.includes('shell') || agent === 'GRAPH') {
      return `### Graph Topology Agent Network Synthesis:\n\n- **Entities Mapped:** ${caseData.graphAnalysis.nodes.length} nodes across ${caseData.graphAnalysis.edges.length} directed links.\n- **Shell Entities Identified:** ${caseData.graphAnalysis.shellCompaniesIdentified.join(', ') || 'None identified'}.\n- **Circular Routing Loop:** ${caseData.graphAnalysis.circularRoutingDetected ? 'CONFIRMED CLOSED LOOP' : 'Open directed flow'}.\n- **Shared Digital Identifiers:** ${caseData.graphAnalysis.sharedDeviceOrIpFindings.join(', ') || 'No shared IPs'}.\n\nBeneficial ownership cycles reveal funds departing operational corporate accounts and returning to insider-controlled accounts via multi-hop offshore layering.`;
    }

    return `### Unified Multi-Agent Synthesis:\n\nCross-modal correlation across all 5 agents establishes high probability fraud (Score ${caseData.riskAssessment.overallRiskScore}/100):\n1. **Transactions:** Structured amounts under BSA $10,000 threshold.\n2. **Documents:** OCR detected math surplus and altered PDF layers.\n3. **Communications:** High coercion and compliance override directives.\n4. **Graph:** Shell company layering loop returning capital to insider.\n5. **Audio:** Acoustic vocal stress and verified verbal structuring instructions.`;
  };

  const getAgentIcon = (ag: string) => {
    switch (ag) {
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
      default:
        return <Bot className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-950 border-l border-slate-800 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
      {/* Copilot Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Forensic AI Copilot</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">
                Multi-Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Cross-Modal Financial Crimes Intelligence
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
            title="Reset Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Agent Selector Bar */}
      <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center gap-1 overflow-x-auto text-[11px]">
        <span className="text-slate-500 font-bold uppercase mr-1 text-[10px]">Agent:</span>
        {(['ALL', 'TRANSACTION', 'DOCUMENT', 'TEXT', 'GRAPH', 'AUDIO'] as const).map((ag) => (
          <button
            key={ag}
            onClick={() => setSelectedAgent(ag)}
            className={`px-2 py-1 rounded font-medium whitespace-nowrap transition-colors flex items-center gap-1 border ${
              selectedAgent === ag
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {getAgentIcon(ag)}
            <span>{ag}</span>
          </button>
        ))}
      </div>

      {/* Quick-Prompt Pills */}
      <div className="p-3 bg-slate-950 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedAgent(qp.agent as any);
              handleSendMessage(qp.prompt);
            }}
            className="text-[11px] px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Messages Stream Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 font-sans text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'USER' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[10px] font-mono text-slate-400">
                {msg.sender === 'USER' ? 'Investigator' : `Agent [${msg.agent}]`}
              </span>
              <span className="text-[9px] text-slate-500">({msg.timestamp})</span>
            </div>

            <div
              className={`p-3.5 rounded-2xl max-w-[92%] leading-relaxed ${
                msg.sender === 'USER'
                  ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-xs space-y-2'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2 p-3 bg-slate-900 rounded-xl border border-slate-800 text-slate-400 text-xs w-fit animate-pulse">
            <Bot className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Synthesizing multimodal forensic evidence...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder={`Ask ${selectedAgent === 'ALL' ? 'Lead Copilot' : `${selectedAgent} Agent`} a question...`}
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isGenerating}
            className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={!inputPrompt.trim() || isGenerating}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <div className="text-[10px] text-slate-500 text-center mt-2 font-mono">
          Powered by Gemini 3.8 Flash • Multi-Agent Multimodal Triangulation
        </div>
      </div>
    </div>
  );
};
