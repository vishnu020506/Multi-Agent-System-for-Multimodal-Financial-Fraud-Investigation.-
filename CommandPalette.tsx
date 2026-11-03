import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Command, 
  ArrowRight, 
  ShieldAlert, 
  FileText, 
  Network, 
  CreditCard, 
  FileSearch, 
  MessageSquare, 
  Headphones, 
  Activity, 
  Bot, 
  Radio, 
  FolderLock, 
  Scale, 
  Zap, 
  Layers, 
  CheckCircle2, 
  Sparkles,
  X,
  Keyboard
} from 'lucide-react';
import { InvestigationCase, UserProfile } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  cases: InvestigationCase[];
  currentCase: InvestigationCase;
  onSelectCase: (caseId: string) => void;
  onSelectTab: (tabId: string) => void;
  onRunAiAgents: () => void;
  onOpenNewCaseModal: () => void;
  onExportReport: () => void;
  onOpenAuthModal: () => void;
  currentUser?: UserProfile | null;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  cases,
  currentCase,
  onSelectCase,
  onSelectTab,
  onRunAiAgents,
  onOpenNewCaseModal,
  onExportReport,
  onOpenAuthModal,
  currentUser,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Tab navigation actions
  const navigationItems = [
    { id: 'overview', title: 'Executive Dossier & Overview', category: 'Views', icon: ShieldAlert, shortcut: 'G O' },
    { id: 'transaction', title: 'Transaction Forensics (BSA § 5324)', category: 'Modalities', icon: CreditCard, shortcut: 'G T' },
    { id: 'document', title: 'Document & OCR Forensics', category: 'Modalities', icon: FileSearch, shortcut: 'G D' },
    { id: 'text', title: 'Communications & NLP Analysis', category: 'Modalities', icon: MessageSquare, shortcut: 'G C' },
    { id: 'graph', title: 'Entity Resolution Network Graph', category: 'Modalities', icon: Network, shortcut: 'G G' },
    { id: 'audio', title: 'Audio & Wiretap Acoustic Forensics', category: 'Modalities', icon: Headphones, shortcut: 'G A' },
    { id: 'behavior', title: 'Behavioral Profiling & Anomaly Baseline', category: 'Modalities', icon: Activity, shortcut: 'G B' },
    { id: 'coordinator', title: 'Multi-Agent Consensus Orchestrator', category: 'Intelligence', icon: Bot, shortcut: 'G M' },
    { id: 'hybrid_ai', title: 'Hybrid AI Detection Engine', category: 'Intelligence', icon: Zap, shortcut: 'G H' },
    { id: 'rag_search', title: 'RAG Legal & Precedent Library', category: 'Intelligence', icon: Scale, shortcut: 'G R' },
    { id: 'correlation', title: 'Cross-Modal Evidence Matrix', category: 'Dossier', icon: Layers, shortcut: 'G X' },
    { id: 'evidence', title: 'Cryptographic Evidence Vault', category: 'Dossier', icon: FolderLock, shortcut: 'G E' },
    { id: 'realtime', title: 'Real-Time Surveillance Telemetry', category: 'Operations', icon: Radio, shortcut: 'G L' },
    { id: 'report', title: 'FinCEN SAR Form 111 Narrative & Filing', category: 'Operations', icon: FileText, shortcut: 'G S' },
    { id: 'viva_eval', title: 'Model Performance Benchmark & Eval', category: 'Operations', icon: CheckCircle2, shortcut: 'G V' },
  ];

  // System command actions
  const actionItems = [
    {
      id: 'act-run-agents',
      title: 'Execute Multi-Agent Triangulation Pipeline',
      category: 'Actions',
      icon: Sparkles,
      action: () => {
        onRunAiAgents();
        onClose();
      },
    },
    {
      id: 'act-export-sar',
      title: 'Generate Printable SAR Filing Dossier',
      category: 'Actions',
      icon: FileText,
      action: () => {
        onExportReport();
        onClose();
      },
    },
    {
      id: 'act-new-case',
      title: 'Ingest New Case or Financial Evidence',
      category: 'Actions',
      icon: Zap,
      action: () => {
        onOpenNewCaseModal();
        onClose();
      },
    },
    {
      id: 'act-auth',
      title: 'Switch Investigator Profile / Security Clearance',
      category: 'Security',
      icon: ShieldAlert,
      action: () => {
        onOpenAuthModal();
        onClose();
      },
    },
  ];

  // Case items
  const caseItems = cases.map((c) => ({
    id: `case-${c.id}`,
    title: `${c.id}: ${c.title}`,
    subtitle: `Target: ${c.targetEntity} • Risk: ${c.riskAssessment.riskTier} (${c.riskAssessment.overallRiskScore}/100)`,
    category: 'Cases',
    icon: ShieldAlert,
    action: () => {
      onSelectCase(c.id);
      onClose();
    },
  }));

  // Filter items based on query
  const filteredNavigation = navigationItems.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase()) ||
    i.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = actionItems.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCases = caseItems.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase()) ||
    i.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  // Flatten for keyboard index
  const allFiltered = [
    ...filteredNavigation.map((item) => ({
      type: 'nav' as const,
      data: item,
      run: () => {
        onSelectTab(item.id);
        onClose();
      },
    })),
    ...filteredCases.map((item) => ({
      type: 'case' as const,
      data: item,
      run: item.action,
    })),
    ...filteredActions.map((item) => ({
      type: 'action' as const,
      data: item,
      run: item.action,
    })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allFiltered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allFiltered.length) % Math.max(1, allFiltered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allFiltered[selectedIndex]) {
        allFiltered[selectedIndex].run();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90">
          <Search className="w-5 h-5 text-slate-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, case name, or modality (e.g., 'wire', 'audio', 'sar')..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 shrink-0">
            <span>ESC to exit</span>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {allFiltered.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No matching commands or cases found for "{query}".
            </div>
          ) : (
            <div>
              {/* Navigation Items */}
              {filteredNavigation.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-1.5 text-[11px] font-mono uppercase font-bold text-slate-400">
                    Forensic Views & Modalities
                  </div>
                  {filteredNavigation.map((item) => {
                    const globalIdx = allFiltered.findIndex((x) => x.type === 'nav' && x.data.id === item.id);
                    const isSelected = selectedIndex === globalIdx;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectTab(item.id);
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40'
                            : 'text-slate-300 hover:bg-slate-800/70 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-medium text-slate-200">{item.title}</span>
                            <span className="text-[10px] text-slate-500 ml-2 font-mono">[{item.category}]</span>
                          </div>
                        </div>
                        {item.shortcut && (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Case Items */}
              {filteredCases.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-1.5 text-[11px] font-mono uppercase font-bold text-slate-400">
                    Investigation Dossiers
                  </div>
                  {filteredCases.map((item) => {
                    const globalIdx = allFiltered.findIndex((x) => x.type === 'case' && x.data.id === item.id);
                    const isSelected = selectedIndex === globalIdx;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40'
                            : 'text-slate-300 hover:bg-slate-800/70 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                            <ShieldAlert className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200">{item.title}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.subtitle}</div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Action Items */}
              {filteredActions.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-[11px] font-mono uppercase font-bold text-slate-400">
                    System Actions
                  </div>
                  {filteredActions.map((item) => {
                    const globalIdx = allFiltered.findIndex((x) => x.type === 'action' && x.data.id === item.id);
                    const isSelected = selectedIndex === globalIdx;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(globalIdx)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-amber-500/15 text-amber-200 border border-amber-500/40'
                            : 'text-slate-300 hover:bg-slate-800/70 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-slate-200">{item.title}</span>
                        </div>
                        <span className="text-[10px] font-mono text-amber-400/80">Press ↵</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-4">
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 font-mono">↓</kbd> navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700 text-slate-300 font-mono">↵</kbd> select</span>
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Active: {currentCase.id} • {currentUser?.name.split(',')[0] || 'Investigator'}
          </div>
        </div>
      </div>
    </div>
  );
};
