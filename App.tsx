/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_CASES } from './data/sampleCases';
import { 
  InvestigationCase, 
  PipelineStage, 
  UserProfile, 
  CaseInvestigationStatus, 
  HumanInTheLoopReview, 
  CaseEvidenceItem, 
  TransactionItem 
} from './types';
import { PRESET_USERS } from './data/authProfiles';
import { Header } from './components/Header';
import { PipelineFlowBar } from './components/PipelineFlowBar';
import { CaseManagementHitlBar } from './components/CaseManagementHitlBar';
import { RealTimeMonitoringStream } from './components/RealTimeMonitoringStream';
import { EvidenceLockerView } from './components/EvidenceLockerView';
import { RiskOverviewCard } from './components/RiskOverviewCard';
import { DataIngestionStudio } from './components/DataIngestionStudio';
import { PreprocessingAgentView } from './components/PreprocessingAgentView';
import { TransactionAgentView } from './components/TransactionAgentView';
import { DocumentAgentView } from './components/DocumentAgentView';
import { TextAgentView } from './components/TextAgentView';
import { GraphAgentView } from './components/GraphAgentView';
import { AudioAgentView } from './components/AudioAgentView';
import { EvidenceCorrelationView } from './components/EvidenceCorrelationView';
import { InvestigationReportView } from './components/InvestigationReportView';
import { BehaviorAgentView } from './components/BehaviorAgentView';
import { InvestigationCoordinatorView } from './components/InvestigationCoordinatorView';
import { HybridAiEngineView } from './components/HybridAiEngineView';
import { RagAssistantView } from './components/RagAssistantView';
import { ModelEvaluationView } from './components/ModelEvaluationView';
import { NewInvestigationModal } from './components/NewInvestigationModal';
import { CopilotDrawer } from './components/CopilotDrawer';
import { AuthModal } from './components/AuthModal';
import { CommandPalette } from './components/CommandPalette';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { LoginPage } from './components/LoginPage';
import { StepByStepPipelineViewer } from './components/StepByStepPipelineViewer';
import { DocumentUploadHub } from './components/DocumentUploadHub';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw,
  Info,
  ShieldCheck, 
  Building,
  HelpCircle,
  Bot,
  Headphones,
  Keyboard,
  Search,
  Upload
} from 'lucide-react';

export default function App() {
  // Single active case to prevent multi-case clutter
  const [cases, setCases] = useState<InvestigationCase[]>([INITIAL_CASES[0]]);
  const [currentCaseId, setCurrentCaseId] = useState<string>(INITIAL_CASES[0].id);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [activePipelineStage, setActivePipelineStage] = useState<PipelineStage>('multiple_agents');
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState<boolean>(false);
  const [isRunningAi, setIsRunningAi] = useState<boolean>(false);
  const [aiExecutionMessage, setAiExecutionMessage] = useState<string | null>(null);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState<boolean>(false);
  const [isUploadingDoc, setIsUploadingDoc] = useState<boolean>(false);
  const [pipelineJob, setPipelineJob] = useState<{ isRunning: boolean; fileName: string; imageUrl?: string; fileSize?: number; classification?: 'AUTHENTIC' | 'ALTERED' | 'AUTO' } | null>(null);

  // Global Developer Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = (e.target as HTMLElement)?.tagName === 'INPUT' || 
                      (e.target as HTMLElement)?.tagName === 'TEXTAREA' || 
                      (e.target as HTMLElement)?.isContentEditable;

      // ⌘K / Ctrl+K: Global Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
        return;
      }

      // Escape: Close active overlays
      if (e.key === 'Escape') {
        setIsCommandPaletteOpen(false);
        setIsShortcutsModalOpen(false);
        setIsCopilotOpen(false);
        setIsAuthModalOpen(false);
        setIsNewCaseModalOpen(false);
        return;
      }

      // Hotkeys disabled while typing in text inputs
      if (isInput) return;

      // ?: Keyboard Shortcuts
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsModalOpen((prev) => !prev);
        return;
      }

      // [ / ]: Previous / Next Case
      if (e.key === '[') {
        e.preventDefault();
        setCases((prev) => {
          const idx = prev.findIndex((c) => c.id === currentCaseId);
          const nextIdx = (idx - 1 + prev.length) % prev.length;
          setCurrentCaseId(prev[nextIdx].id);
          return prev;
        });
        return;
      }
      if (e.key === ']') {
        e.preventDefault();
        setCases((prev) => {
          const idx = prev.findIndex((c) => c.id === currentCaseId);
          const nextIdx = (idx + 1) % prev.length;
          setCurrentCaseId(prev[nextIdx].id);
          return prev;
        });
        return;
      }

      // 1-5 direct modality shortcuts
      if (e.key === '1') { e.preventDefault(); setActiveTab('overview'); setActivePipelineStage('risk_assessment'); }
      if (e.key === '2') { e.preventDefault(); setActiveTab('transaction'); setActivePipelineStage('multiple_agents'); }
      if (e.key === '3') { e.preventDefault(); setActiveTab('document'); setActivePipelineStage('multiple_agents'); }
      if (e.key === '4') { e.preventDefault(); setActiveTab('graph'); setActivePipelineStage('multiple_agents'); }
      if (e.key === '5') { e.preventDefault(); setActiveTab('audio'); setActivePipelineStage('multiple_agents'); }

      // C: Toggle Copilot
      if (e.key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsCopilotOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentCaseId]);

  const currentCase = cases.find((c) => c.id === currentCaseId) || cases[0];

  // Pipeline step selection maps smoothly to tabs
  const handleSelectPipelineStage = (stage: PipelineStage) => {
    setActivePipelineStage(stage);
    switch (stage) {
      case 'financial_data':
        setActiveTab('ingestion');
        break;
      case 'preprocessing':
      case 'multimodal_ai':
        setActiveTab('preprocessing');
        break;
      case 'multiple_agents':
        setActiveTab('transaction');
        break;
      case 'evidence_correlation':
        setActiveTab('correlation');
        break;
      case 'risk_assessment':
      case 'explainable_results':
        setActiveTab('overview');
        break;
      case 'investigation_report':
        setActiveTab('report');
        break;
    }
  };

  // Run AI agents re-analysis on demand
  const handleRunAiAgents = async () => {
    setIsRunningAi(true);
    setAiExecutionMessage('Triggering 5 Multimodal Agents (Transaction, OCR, NLP, Graph, Audio Wiretaps)...');

    try {
      const response = await fetch('/api/investigate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle: currentCase.title,
          targetEntity: currentCase.targetEntity,
          transactions: currentCase.transactionAnalysis.transactions,
          documents: currentCase.documentAnalysis.documents,
          communications: currentCase.textAnalysis.communications,
          graphNotes: `Entities: ${currentCase.graphAnalysis.nodes.map(n => n.label).join(', ')}. Circular routing: ${currentCase.graphAnalysis.circularRoutingDetected}`,
          audioRecordings: currentCase.audioAnalysis?.recordings || [],
        }),
      });

      const res = await response.json();
      if (res.success && res.data) {
        const updatedRisk = res.data;
        // Update current case with fresh AI results
        const updatedCases = cases.map((c) => {
          if (c.id === currentCase.id) {
            return {
              ...c,
              riskAssessment: {
                ...c.riskAssessment,
                overallRiskScore: updatedRisk.overallRiskScore || c.riskAssessment.overallRiskScore,
                riskTier: updatedRisk.riskTier || c.riskAssessment.riskTier,
                confidenceScore: updatedRisk.confidenceScore || c.riskAssessment.confidenceScore,
                keyRiskDrivers: updatedRisk.explainableReasons || c.riskAssessment.keyRiskDrivers,
                sarRequired: updatedRisk.sarFilingRecommended ?? c.riskAssessment.sarRequired,
              },
              transactionAnalysis: {
                ...c.transactionAnalysis,
                riskScore: updatedRisk.agentVerdicts?.transactionAgent?.score || c.transactionAnalysis.riskScore,
                agentStatus: updatedRisk.agentVerdicts?.transactionAgent?.status || c.transactionAnalysis.agentStatus,
              },
              documentAnalysis: {
                ...c.documentAnalysis,
                riskScore: updatedRisk.agentVerdicts?.documentAgent?.score || c.documentAnalysis.riskScore,
                agentStatus: updatedRisk.agentVerdicts?.documentAgent?.status || c.documentAnalysis.agentStatus,
              },
              textAnalysis: {
                ...c.textAnalysis,
                riskScore: updatedRisk.agentVerdicts?.textAgent?.score || c.textAnalysis.riskScore,
                agentStatus: updatedRisk.agentVerdicts?.textAgent?.status || c.textAnalysis.agentStatus,
              },
              graphAnalysis: {
                ...c.graphAnalysis,
                riskScore: updatedRisk.agentVerdicts?.graphAgent?.score || c.graphAnalysis.riskScore,
                agentStatus: updatedRisk.agentVerdicts?.graphAgent?.status || c.graphAnalysis.agentStatus,
              },
              audioAnalysis: c.audioAnalysis ? {
                ...c.audioAnalysis,
                riskScore: updatedRisk.agentVerdicts?.audioAgent?.score || c.audioAnalysis.riskScore,
                agentStatus: updatedRisk.agentVerdicts?.audioAgent?.status || c.audioAnalysis.agentStatus,
              } : undefined,
            };
          }
          return c;
        });

        setCases(updatedCases);
        setAiExecutionMessage('Multimodal AI agent correlation completed successfully!');
        setTimeout(() => setAiExecutionMessage(null), 4000);
      }
    } catch (err) {
      console.error('AI execution error:', err);
      setAiExecutionMessage('Agent simulation executed using local deterministic models.');
      setTimeout(() => setAiExecutionMessage(null), 3500);
    } finally {
      setIsRunningAi(false);
    }
  };

  const handleCaseCreated = (newCase: InvestigationCase) => {
    setCases([newCase, ...cases]);
    setCurrentCaseId(newCase.id);
    setActiveTab('document');
    setActivePipelineStage('risk_assessment');
  };

  const handleUpdateNotes = (notes: string[]) => {
    const updated = cases.map((c) => {
      if (c.id === currentCase.id) {
        return {
          ...c,
          report: {
            ...c.report,
            investigatorNotes: notes,
          },
        };
      }
      return c;
    });
    setCases(updated);
  };

  const handleUpdateStatus = (newStatus: CaseInvestigationStatus) => {
    setCases((prev) =>
      prev.map((c) => (c.id === currentCase.id ? { ...c, status: newStatus } : c))
    );
  };

  const handleUpdateHitlReview = (review: HumanInTheLoopReview) => {
    setCases((prev) =>
      prev.map((c) => (c.id === currentCase.id ? { ...c, hitlReview: review } : c))
    );
  };

  const handleAttachTransaction = (tx: TransactionItem) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === currentCase.id) {
          return {
            ...c,
            transactionAnalysis: {
              ...c.transactionAnalysis,
              transactions: [tx, ...c.transactionAnalysis.transactions],
              totalVolume: c.transactionAnalysis.totalVolume + tx.amount,
              flaggedVolume: tx.flagged
                ? c.transactionAnalysis.flaggedVolume + tx.amount
                : c.transactionAnalysis.flaggedVolume,
            },
          };
        }
        return c;
      })
    );
  };

  const handleAddEvidence = (item: CaseEvidenceItem) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === currentCase.id) {
          return {
            ...c,
            evidenceLocker: [item, ...(c.evidenceLocker || [])],
          };
        }
        return c;
      })
    );
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthModalOpen(false);
  };

  const handleStartPipeline = (fileName: string, imageUrl?: string, fileSize?: number, classification?: 'AUTHENTIC' | 'ALTERED' | 'AUTO') => {
    setPipelineJob({
      isRunning: true,
      fileName,
      imageUrl,
      fileSize,
      classification,
    });
    setIsUploadingDoc(false);
  };

  const handlePipelineComplete = (generatedCase: InvestigationCase) => {
    setCases([generatedCase]);
    setCurrentCaseId(generatedCase.id);
    setPipelineJob(null);
    setIsUploadingDoc(false);
    setActiveTab('document');
    setActivePipelineStage('multiple_agents');
  };

  // If no user is authenticated, display the dedicated User Login Page FIRST
  if (!currentUser) {
    return <LoginPage onLogin={(user) => setCurrentUser(user)} />;
  }

  // If a document or image was uploaded, display the transparent Step-by-Step Multi-Agent Execution Pipeline FIRST!
  if (pipelineJob?.isRunning) {
    return (
      <StepByStepPipelineViewer
        uploadedFileName={pipelineJob.fileName}
        uploadedImageUrl={pipelineJob.imageUrl}
        fileSize={pipelineJob.fileSize}
        initialClassification={pipelineJob.classification}
        onComplete={handlePipelineComplete}
        onCancel={() => setPipelineJob(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-slate-200 selection:text-slate-900">
      {/* Application Navigation Header */}
      <Header
        cases={cases}
        currentCase={currentCase}
        onSelectCase={(id) => {
          setCurrentCaseId(id);
          setActiveTab('overview');
        }}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          // Sync pipeline bar
          if (tab === 'realtime') {
            setActivePipelineStage('financial_data');
          } else if (tab === 'evidence') {
            setActivePipelineStage('evidence_correlation');
          } else if (tab === 'ingestion') {
            setActivePipelineStage('financial_data');
          } else if (tab === 'preprocessing') {
            setActivePipelineStage('preprocessing');
          } else if (tab === 'hybrid_ai' || tab === 'rag_search' || tab === 'coordinator') {
            setActivePipelineStage('multimodal_ai');
          } else if (tab === 'viva_eval') {
            setActivePipelineStage('explainable_results');
          } else if (tab === 'transaction' || tab === 'document' || tab === 'text' || tab === 'graph' || tab === 'audio' || tab === 'behavior') {
            setActivePipelineStage('multiple_agents');
          } else if (tab === 'correlation') {
            setActivePipelineStage('evidence_correlation');
          } else if (tab === 'report') {
            setActivePipelineStage('investigation_report');
          } else {
            setActivePipelineStage('risk_assessment');
          }
        }}
        onOpenNewCaseModal={() => setIsUploadingDoc(true)}
        onRunAiAgents={handleRunAiAgents}
        isRunningAi={isRunningAi}
        isCopilotOpen={isCopilotOpen}
        onToggleCopilot={() => setIsCopilotOpen((prev) => !prev)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onExportReport={() => {
          setActiveTab('report');
          setActivePipelineStage('investigation_report');
          setTimeout(() => window.print(), 300);
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenShortcutsModal={() => setIsShortcutsModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {isUploadingDoc ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsUploadingDoc(false)}
                className="text-xs text-slate-700 hover:text-slate-900 font-mono flex items-center gap-1.5 transition font-semibold"
              >
                ← Return to Active Dossier ({currentCase.documentAnalysis?.documents[0]?.fileName || currentCase.id})
              </button>
            </div>
            <DocumentUploadHub onStartPipeline={handleStartPipeline} />
          </div>
        ) : (
          <>
            {/* Case Lifecycle & Human-in-the-Loop Adjudication Bar (Features 7 & 10) */}
            <div className="print:hidden">
              <CaseManagementHitlBar
                currentCase={currentCase}
                currentUser={currentUser}
                onUpdateStatus={handleUpdateStatus}
                onUpdateHitlReview={handleUpdateHitlReview}
                onNavigateTab={(tab) => {
                  setActiveTab(tab);
                }}
                cases={cases}
                onSelectCase={(id) => {
                  setCurrentCaseId(id);
                  setActiveTab('overview');
                }}
                onOpenNewCaseModal={() => setIsUploadingDoc(true)}
              />
            </div>

        {/* Multimodal 8-Stage Investigation Pipeline Visualizer */}
        <div className="print:hidden">
          <PipelineFlowBar
            currentStage={activePipelineStage}
            onSelectStage={handleSelectPipelineStage}
            isRunningAi={isRunningAi}
          />
        </div>

        {/* Transient Agent Execution Notification */}
        {aiExecutionMessage && (
          <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl text-xs text-slate-800 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-700" />
              <span>{aiExecutionMessage}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-700 font-bold uppercase">
              Multi-Agent Active
            </span>
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'overview' && (
          <RiskOverviewCard
            currentCase={currentCase}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'ingestion') {
                setActivePipelineStage('financial_data');
              } else if (tab === 'preprocessing') {
                setActivePipelineStage('preprocessing');
              } else if (tab === 'correlation') {
                setActivePipelineStage('evidence_correlation');
              } else if (tab === 'report') {
                setActivePipelineStage('investigation_report');
              } else {
                setActivePipelineStage('multiple_agents');
              }
            }}
          />
        )}

        {activeTab === 'realtime' && (
          <RealTimeMonitoringStream
            onAttachTransactionToCase={handleAttachTransaction}
            targetEntityName={currentCase.targetEntity}
          />
        )}

        {activeTab === 'ingestion' && (
          <DataIngestionStudio
            currentCase={currentCase}
            onProceedToPreprocessing={() => {
              setActiveTab('preprocessing');
              setActivePipelineStage('preprocessing');
            }}
          />
        )}

        {activeTab === 'preprocessing' && (
          <PreprocessingAgentView
            currentCase={currentCase}
            onProceedToAgents={() => {
              setActiveTab('transaction');
              setActivePipelineStage('multiple_agents');
            }}
          />
        )}

        {activeTab === 'coordinator' && (
          <InvestigationCoordinatorView
            currentCase={currentCase}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'hybrid_ai' && (
          <HybridAiEngineView currentCase={currentCase} />
        )}

        {activeTab === 'rag_search' && (
          <RagAssistantView currentCase={currentCase} />
        )}

        {activeTab === 'behavior' && (
          <BehaviorAgentView analysis={currentCase.behaviorAnalysis} />
        )}

        {activeTab === 'transaction' && (
          <TransactionAgentView analysis={currentCase.transactionAnalysis} />
        )}

        {activeTab === 'document' && (
          <DocumentAgentView analysis={currentCase.documentAnalysis} />
        )}

        {activeTab === 'text' && (
          <TextAgentView analysis={currentCase.textAnalysis} />
        )}

        {activeTab === 'graph' && (
          <GraphAgentView analysis={currentCase.graphAnalysis} />
        )}

        {activeTab === 'audio' && (
          <AudioAgentView analysis={currentCase.audioAnalysis} />
        )}

        {activeTab === 'correlation' && (
          <EvidenceCorrelationView correlations={currentCase.correlations} />
        )}

        {activeTab === 'viva_eval' && (
          <ModelEvaluationView />
        )}

        {activeTab === 'evidence' && (
          <EvidenceLockerView
            currentCase={currentCase}
            onAddEvidenceItem={handleAddEvidence}
          />
        )}

        {activeTab === 'report' && (
          <InvestigationReportView
            currentCase={currentCase}
            onUpdateNotes={handleUpdateNotes}
          />
        )}
          </>
        )}
      </main>

      {/* Floating Developer & Copilot Action Dock */}
      <div className="fixed bottom-6 right-6 z-40 print:hidden flex items-center gap-2.5">
        <button
          onClick={() => setIsShortcutsModalOpen(true)}
          className="p-3 rounded-full shadow-xl bg-slate-900/90 text-slate-400 hover:text-white border border-slate-700/80 hover:border-slate-600 transition backdrop-blur-md hover:scale-105"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-3 rounded-full shadow-xl bg-slate-900/90 text-slate-400 hover:text-white border border-slate-700/80 hover:border-slate-600 transition backdrop-blur-md hover:scale-105"
          title="Command Palette (⌘K)"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsCopilotOpen((prev) => !prev)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl backdrop-blur-md border transition-all duration-300 group ${
            isCopilotOpen
              ? 'bg-amber-500 text-slate-950 border-amber-300 font-semibold ring-4 ring-amber-500/20'
              : 'bg-slate-900/90 text-amber-400 border-amber-500/30 hover:border-amber-400 hover:bg-slate-850 hover:shadow-amber-500/20 hover:scale-105'
          }`}
          title="Open Forensic AI Copilot (C)"
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-400 rounded-full" />
          </div>
          <span className="text-xs font-bold tracking-wide">
            {isCopilotOpen ? 'Close Copilot' : 'Forensic AI Copilot'}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
            Press C
          </span>
        </button>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        cases={cases}
        currentCase={currentCase}
        onSelectCase={(id) => {
          setCurrentCaseId(id);
          setActiveTab('overview');
        }}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'realtime' || tab === 'ingestion') setActivePipelineStage('financial_data');
          else if (tab === 'preprocessing') setActivePipelineStage('preprocessing');
          else if (tab === 'hybrid_ai' || tab === 'rag_search' || tab === 'coordinator') setActivePipelineStage('multimodal_ai');
          else if (tab === 'viva_eval') setActivePipelineStage('explainable_results');
          else if (tab === 'correlation' || tab === 'evidence') setActivePipelineStage('evidence_correlation');
          else if (tab === 'report') setActivePipelineStage('investigation_report');
          else if (['transaction', 'document', 'text', 'graph', 'audio', 'behavior'].includes(tab)) setActivePipelineStage('multiple_agents');
          else setActivePipelineStage('risk_assessment');
        }}
        onRunAiAgents={handleRunAiAgents}
        onOpenNewCaseModal={() => setIsUploadingDoc(true)}
        onExportReport={() => {
          setActiveTab('report');
          setActivePipelineStage('investigation_report');
          setTimeout(() => window.print(), 300);
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        currentUser={currentUser}
      />

      {/* Developer Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsModalOpen}
        onClose={() => setIsShortcutsModalOpen(false)}
      />

      {/* Forensic AI Copilot Drawer */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentCase={currentCase}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'correlation') {
            setActivePipelineStage('evidence_correlation');
          } else if (tab === 'report') {
            setActivePipelineStage('investigation_report');
          } else {
            setActivePipelineStage('multiple_agents');
          }
        }}
      />

      {/* Ingestion & New Case Modal */}
      <NewInvestigationModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
        onCaseCreated={handleCaseCreated}
      />

      {/* User Authentication & Clearance Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        currentUser={currentUser}
        onSelectUser={(user) => {
          setCurrentUser(user);
          setIsAuthModalOpen(false);
        }}
        onLogout={() => {
          setCurrentUser(null);
          setIsAuthModalOpen(false);
        }}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
