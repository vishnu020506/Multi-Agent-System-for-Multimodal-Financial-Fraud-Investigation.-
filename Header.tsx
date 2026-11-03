import React, { useRef, useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Bot, 
  PlusCircle, 
  FileDown, 
  RefreshCw, 
  Search, 
  Sparkles, 
  Layers, 
  ArrowRight,
  User,
  CreditCard,
  FileSearch,
  MessageSquare,
  Network,
  Headphones,
  Activity,
  Zap,
  Scale,
  FolderLock,
  Radio,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Keyboard,
  Command,
  SlidersHorizontal,
  Lock,
  LogOut,
  Upload
} from 'lucide-react';
import { InvestigationCase, RiskLevel, UserProfile } from '../types';

interface HeaderProps {
  cases: InvestigationCase[];
  currentCase: InvestigationCase;
  onSelectCase: (caseId: string) => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenNewCaseModal: () => void;
  onRunAiAgents: () => void;
  isRunningAi: boolean;
  onExportReport: () => void;
  isCopilotOpen?: boolean;
  onToggleCopilot: () => void;
  currentUser?: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout?: () => void;
  onOpenShortcutsModal?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cases,
  currentCase,
  onSelectCase,
  activeTab,
  onSelectTab,
  onOpenNewCaseModal,
  onRunAiAgents,
  isRunningAi,
  onExportReport,
  isCopilotOpen,
  onToggleCopilot,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenShortcutsModal,
  onOpenCommandPalette,
}) => {
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'ALL' | 'DOSSIER' | 'MODALITIES' | 'INTELLIGENCE' | 'OPERATIONS'>('ALL');

  const checkScroll = () => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsContainerRef.current) {
      const offset = direction === 'left' ? -240 : 240;
      tabsContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const getRiskBadge = (tier: RiskLevel) => {
    switch (tier) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
      case 'HIGH':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-800 border-yellow-300 font-bold';
      case 'CLEAN':
      case 'LOW':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    }
  };

  const allTabs = [
    { id: 'overview', label: 'Executive Dossier', icon: ShieldAlert, category: 'DOSSIER', badge: `${currentCase.riskAssessment.overallRiskScore}/100` },
    { id: 'correlation', label: 'Cross-Modal Matrix', icon: Layers, category: 'DOSSIER', badge: `${currentCase.correlations.length}` },
    { id: 'evidence', label: 'Evidence Vault', icon: FolderLock, category: 'DOSSIER' },
    { id: 'transaction', label: 'Transactions', icon: CreditCard, category: 'MODALITIES', badge: currentCase.transactionAnalysis.agentStatus === 'FLAGGED' ? 'FLAGGED' : 'CLEAN' },
    { id: 'document', label: 'Document & OCR', icon: FileSearch, category: 'MODALITIES', badge: currentCase.documentAnalysis.agentStatus === 'FLAGGED' ? 'FLAGGED' : 'CLEAN' },
    { id: 'text', label: 'Communications NLP', icon: MessageSquare, category: 'MODALITIES', badge: currentCase.textAnalysis.agentStatus === 'FLAGGED' ? 'FLAGGED' : 'CLEAN' },
    { id: 'graph', label: 'Entity Network Graph', icon: Network, category: 'MODALITIES', badge: `${currentCase.graphAnalysis.nodes.length}N` },
    { id: 'audio', label: 'Audio & Wiretaps', icon: Headphones, category: 'MODALITIES', badge: currentCase.audioAnalysis?.agentStatus === 'FLAGGED' ? 'FLAGGED' : 'CLEAN' },
    { id: 'behavior', label: 'Behavioral Profile', icon: Activity, category: 'MODALITIES' },
    { id: 'coordinator', label: 'Consensus Orchestrator', icon: Bot, category: 'INTELLIGENCE' },
    { id: 'hybrid_ai', label: 'Hybrid AI Rules & ML', icon: Zap, category: 'INTELLIGENCE' },
    { id: 'rag_search', label: 'Regulatory RAG', icon: Scale, category: 'INTELLIGENCE' },
    { id: 'realtime', label: 'Live Telemetry', icon: Radio, category: 'OPERATIONS', badge: 'LIVE' },
    { id: 'report', label: 'FinCEN SAR Filing', icon: FileText, category: 'OPERATIONS' },
    { id: 'viva_eval', label: 'Model Benchmark', icon: CheckCircle2, category: 'OPERATIONS' },
  ];

  const filteredTabs = activeCategory === 'ALL'
    ? allTabs
    : allTabs.filter(t => t.category === activeCategory);

  const activeTabMeta = allTabs.find(t => t.id === activeTab) || allTabs[0];

  return (
    <header id="app-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs text-slate-900">
      {/* Top Utility & Brand Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-800 shadow-xs">
            <ShieldAlert className="w-5 h-5 text-slate-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                FinCEN Sentinel
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300 font-normal">
                  v2.4 Enclave
                </span>
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-800 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                5/5 Agents Active
              </span>
            </div>
            <div className="text-[11px] text-slate-600 font-mono flex items-center gap-2">
              <span>Case: <strong className="text-slate-900">{currentCase.id}</strong></span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-700 font-medium truncate max-w-xs">{currentCase.targetEntity}</span>
            </div>
          </div>
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Global Command Palette Trigger */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs transition shadow-xs group cursor-pointer"
            title="Open Command Palette (Ctrl+K / ⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-800 transition-colors" />
            <span className="hidden sm:inline text-slate-600 font-medium">Jump to...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 text-[10px] font-mono text-slate-700">
              ⌘K
            </kbd>
          </button>

          {/* Active Case Exhibit Badge */}
          <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg p-0.5 px-2.5 shadow-xs">
            <span className="text-[10px] font-mono text-slate-500 uppercase mr-1.5 hidden sm:inline font-semibold">Active Exhibit:</span>
            <span className="text-xs font-semibold text-slate-900 truncate max-w-44 font-mono">
              {currentCase.documentAnalysis?.documents[0]?.fileName || currentCase.id}
            </span>
            <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ml-2 ${getRiskBadge(currentCase.riskAssessment.riskTier)}`}>
              {currentCase.riskAssessment.riskTier}
            </span>
          </div>

          {/* Upload Document / Image Trigger - Dull/Muted Navy Button */}
          <button
            id="upload-new-doc-btn"
            onClick={onOpenNewCaseModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white border border-slate-900 shadow-xs transition cursor-pointer"
            title="Upload a new document or image for multi-agent investigation"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Document</span>
          </button>

          {/* Run Multimodal Agents Pipeline */}
          <button
            id="run-ai-agents-btn"
            onClick={onRunAiAgents}
            disabled={isRunningAi}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-xs cursor-pointer ${
              isRunningAi
                ? 'bg-slate-200 border-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600'
            }`}
          >
            {isRunningAi ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Run Analysis</span>
              </>
            )}
          </button>

          {/* Forensic AI Copilot Toggle */}
          <button
            id="toggle-copilot-btn"
            onClick={onToggleCopilot}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border cursor-pointer ${
              isCopilotOpen
                ? 'bg-slate-800 text-white border-slate-800 font-semibold shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
            title="Toggle Forensic AI Copilot"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Copilot</span>
          </button>

          {/* New Case Button */}
          <button
            id="new-investigation-btn"
            onClick={onOpenNewCaseModal}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs cursor-pointer"
            title="Ingest new financial records or case"
          >
            <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Ingest</span>
          </button>

          {/* Print/Export SAR */}
          <button
            id="export-sar-report-btn"
            onClick={onExportReport}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition shadow-xs cursor-pointer"
            title="Print formal FinCEN SAR Form 111 dossier"
          >
            <FileDown className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">SAR Form</span>
          </button>

          {/* Developer Keyboard Shortcuts Trigger */}
          {onOpenShortcutsModal && (
            <button
              onClick={onOpenShortcutsModal}
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300 transition shadow-xs cursor-pointer"
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>
          )}

          {/* User Profile / Clearance Badge */}
          <button
            id="user-auth-badge-btn"
            onClick={onOpenAuthModal}
            className="inline-flex items-center gap-2 p-1 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs transition cursor-pointer"
            title="Security Clearance & Profile"
          >
            {currentUser ? (
              <>
                <div className="w-5 h-5 rounded-md bg-slate-800 text-white font-bold flex items-center justify-center text-[10px] shadow-xs">
                  {currentUser.avatarInitials}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-[11px] font-semibold text-slate-800 leading-tight">
                    {currentUser.name.split(',')[0]}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono leading-tight">
                    {currentUser.clearanceLevel === 'LEVEL_4_TOP_SECRET' ? 'TS / SCI' : 'LEVEL 3'}
                  </div>
                </div>
              </>
            ) : (
              <User className="w-3.5 h-3.5 text-slate-700" />
            )}
          </button>

          {/* Quick Lock / Sign Out Button */}
          {currentUser && onLogout && (
            <button
              id="header-logout-btn"
              onClick={onLogout}
              className="p-1.5 rounded-lg bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-300 hover:border-rose-300 transition shadow-xs cursor-pointer"
              title="Lock Terminal & Log Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Breadcrumb & Sub-Bar */}
      <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between text-[11px]">
        <div className="flex items-center gap-1.5 text-slate-600">
          <span>Surveillance Grid</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-800 font-mono font-semibold">{currentCase.id}</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-semibold flex items-center gap-1">
            <activeTabMeta.icon className="w-3 h-3 text-slate-700" />
            {activeTabMeta.label}
          </span>
        </div>

        {/* Category Filter Pills for Navigation */}
        <div className="hidden sm:flex items-center gap-1">
          <span className="text-[10px] font-mono text-slate-500 mr-1 font-semibold">Filter:</span>
          {(['ALL', 'DOSSIER', 'MODALITIES', 'INTELLIGENCE', 'OPERATIONS'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                activeCategory === cat
                  ? 'bg-slate-800 text-white font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs with Responsive Scroll Controls */}
      <div className="relative border-t border-slate-200 bg-white">
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scrollTabs('left')}
            className="absolute left-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-r from-white via-white/95 to-transparent flex items-center text-slate-600 hover:text-slate-900 cursor-pointer"
            title="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Tab Items Container */}
        <div
          ref={tabsContainerRef}
          onScroll={checkScroll}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 py-1.5 overflow-x-auto scrollbar-none"
        >
          {filteredTabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => onSelectTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-all border cursor-pointer ${
                  isActive
                    ? 'bg-slate-100 text-slate-950 font-bold border-slate-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                    tab.badge === 'FLAGGED' || tab.badge === 'CRITICAL'
                      ? 'bg-rose-50 text-rose-800 border border-rose-300'
                      : tab.badge === 'LIVE'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scrollTabs('right')}
            className="absolute right-0 top-0 bottom-0 z-10 px-2 bg-gradient-to-l from-white via-white/95 to-transparent flex items-center text-slate-600 hover:text-slate-900 cursor-pointer"
            title="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
};
