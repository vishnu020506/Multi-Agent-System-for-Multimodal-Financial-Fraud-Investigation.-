import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  FileText, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  ArrowRight,
  FolderKanban,
  XCircle,
  HelpCircle,
  History,
  Lock,
  Snowflake,
  Send,
  Database,
  ArrowUpRight,
  FileCheck
} from 'lucide-react';
import { CaseInvestigationStatus, HumanInTheLoopReview, InvestigationCase, UserProfile } from '../types';

interface CaseManagementHitlBarProps {
  currentCase: InvestigationCase;
  currentUser?: UserProfile | null;
  onUpdateStatus: (newStatus: CaseInvestigationStatus) => void;
  onUpdateHitlReview: (review: HumanInTheLoopReview) => void;
  onNavigateTab?: (tab: string) => void;
  onSelectCase?: (caseId: string) => void;
  cases?: InvestigationCase[];
  onOpenNewCaseModal?: () => void;
}

export const CaseManagementHitlBar: React.FC<CaseManagementHitlBarProps> = ({
  currentCase,
  currentUser,
  onUpdateStatus,
  onUpdateHitlReview,
  onNavigateTab,
  onSelectCase,
  cases = [],
  onOpenNewCaseModal,
}) => {
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<HumanInTheLoopReview['decision']>('CONFIRMED_FRAUD');
  const [adjudicationScore, setAdjudicationScore] = useState<number>(
    currentCase.riskAssessment?.overallRiskScore || 94
  );
  const [rationaleText, setRationaleText] = useState('');
  const [recommendedAction, setRecommendedAction] = useState('Submit Form FinCEN 111 (Suspicious Activity Report) & Freeze Accounts');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);
  const [freezeActive, setFreezeActive] = useState<boolean>(!!currentCase.hitlReview?.accountsFrozen);
  const [freezeTicket, setFreezeTicket] = useState<string | null>(currentCase.hitlReview?.freezeTicketId || null);

  // 6-Step End-to-End Investigation Workflow Stages
  const workflowSteps = [
    { step: 1, title: 'Data Ingestion', desc: 'Ledgers, Checks & Chat logs', tab: 'realtime' },
    { step: 2, title: 'Vision OCR & ELA', desc: 'Layout & tampering scan', tab: 'document' },
    { step: 3, title: 'Multi-Agent AI', desc: '7 parallel forensic agents', tab: 'transaction' },
    { step: 4, title: 'Consensus & Triangulation', desc: 'Supreme coordinator', tab: 'coordinator' },
    { step: 5, title: 'Investigator Review', desc: 'HITL scoring & adjudication', tab: 'overview' },
    { step: 6, title: 'Store & Next Operations', desc: 'SAR, Freeze, Archive & Next Case', tab: 'report' },
  ];

  // Derive active workflow step based on review state
  const activeStep = currentCase.hitlReview ? 6 : currentCase.status === 'OPEN' ? 1 : 5;

  const statuses: { id: CaseInvestigationStatus; label: string; desc: string }[] = [
    { id: 'OPEN', label: '1. Open', desc: 'Case generated / intake' },
    { id: 'UNDER_INVESTIGATION', label: '2. Under Investigation', desc: 'Active multi-agent analysis' },
    { id: 'CONFIRMED', label: '3. Confirmed Fraud', desc: 'Evidentiary correlation verified' },
    { id: 'CLOSED', label: '4. Closed / Cleared', desc: 'SAR filed or cleared' },
  ];

  const currentStatusIndex = () => {
    switch (currentCase.status) {
      case 'OPEN':
        return 0;
      case 'UNDER_INVESTIGATION':
      case 'ACTIVE_INVESTIGATION':
        return 1;
      case 'CONFIRMED':
      case 'ESCALATED':
      case 'SAR_FILED':
        return 2;
      case 'CLOSED':
      case 'CLEARED':
        return 3;
      default:
        return 1;
    }
  };

  const handleOpenDecision = (decision: HumanInTheLoopReview['decision']) => {
    setPendingDecision(decision);
    if (decision === 'CONFIRMED_FRAUD') {
      setAdjudicationScore(96);
      setRationaleText(
        `Multi-agent consensus confirms deliberate structuring below the $10,000 BSA threshold, corroborated by wiretap audio coercion intercepts, check washing alterations ($1,850 -> $9,850), and +$70,900 invoice math variance.`
      );
      setRecommendedAction('Submit FinCEN Form 111 SAR and file emergency asset freeze injunction.');
    } else if (decision === 'FALSE_POSITIVE_REJECTED') {
      setAdjudicationScore(12);
      setRationaleText(
        `Discrepancy resolved through valid retroactive supplier credit memo. No structural money laundering detected.`
      );
      setRecommendedAction('Dismiss flags and close case dossier with cleared compliance certificate.');
    } else {
      setAdjudicationScore(68);
      setRationaleText(
        `Inconclusive cross-border hops require legal subpoena of British Virgin Islands registry beneficial ownership documents.`
      );
      setRecommendedAction('Escalate to Senior MLRO Committee for extended 30-day wire monitoring.');
    }
    setIsDecisionModalOpen(true);
  };

  const handleCommitDecision = () => {
    const actor = currentUser?.name || 'Sarah Jenkins, CAMS (Lead Investigator)';
    const role = currentUser?.roleTitle || 'Senior Special Investigator';
    const auditHash = `SHA256:${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}b4e`;

    const review: HumanInTheLoopReview = {
      decision: pendingDecision,
      reviewedBy: actor,
      reviewerRole: role,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      rationale: rationaleText,
      recommendedAction,
      adjudicationScore,
      auditHash,
      accountsFrozen: freezeActive,
      freezeTicketId: freezeTicket || undefined,
      decisionHistory: [
        ...(currentCase.hitlReview?.decisionHistory || []),
        {
          action: pendingDecision,
          actor,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
          notes: rationaleText,
        },
      ],
    };

    onUpdateHitlReview(review);

    // Update case status accordingly
    if (pendingDecision === 'CONFIRMED_FRAUD') {
      onUpdateStatus('CONFIRMED');
      setNotificationMsg('✅ Investigator Review Stored & Scored (Score: ' + adjudicationScore + '/100)! Case is now READY FOR NEXT OPERATIONS.');
    } else if (pendingDecision === 'FALSE_POSITIVE_REJECTED') {
      onUpdateStatus('CLOSED');
      setNotificationMsg('✅ Review Stored & Scored as False Positive (Score: ' + adjudicationScore + '/100). Case Closed.');
    } else {
      onUpdateStatus('UNDER_INVESTIGATION');
      setNotificationMsg('✅ Review Stored & Scored (Score: ' + adjudicationScore + '/100). Escalated to Senior MLRO Committee.');
    }

    setIsDecisionModalOpen(false);
    setTimeout(() => setNotificationMsg(null), 6000);
  };

  // Next Operation 1: Freeze Accounts
  const handleExecuteAccountFreeze = () => {
    const ticketId = `FRZ-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setFreezeActive(true);
    setFreezeTicket(ticketId);

    if (currentCase.hitlReview) {
      onUpdateHitlReview({
        ...currentCase.hitlReview,
        accountsFrozen: true,
        freezeTicketId: ticketId,
      });
    }

    setNotificationMsg(`❄️ Emergency Asset Freeze Enforced! Ticket #${ticketId} created. Off-ramp routes for BVI-9021-MRDN blocked ($${currentCase.totalExposure.toLocaleString()} held).`);
    setTimeout(() => setNotificationMsg(null), 6000);
  };

  // Next Operation 2: Go to SAR Report
  const handleGoToSarReport = () => {
    if (onNavigateTab) {
      onNavigateTab('report');
    }
  };

  // Next Operation 3: Go to Evidence Locker
  const handleGoToEvidenceVault = () => {
    if (onNavigateTab) {
      onNavigateTab('evidence');
    }
  };

  // Next Operation 4: Advance to Next Case
  const handleAdvanceToNextCase = () => {
    const nextCase = cases.find(c => c.id !== currentCase.id);
    if (nextCase && onSelectCase) {
      onSelectCase(nextCase.id);
      setNotificationMsg(`➡️ Switched to next investigation case: ${nextCase.id} (${nextCase.title})`);
      setTimeout(() => setNotificationMsg(null), 4000);
    } else if (onOpenNewCaseModal) {
      onOpenNewCaseModal();
    }
  };

  const activeIndex = currentStatusIndex();

  return (
    <div id="case-management-hitl-bar" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4 text-slate-900">
      {/* 1. Step-by-Step Investigation Process Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-bold">
              Step-by-Step Process
            </span>
            <span className="text-xs font-bold text-slate-900">
              End-to-End Investigation Lifecycle (Stage {activeStep} of 6)
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            {currentCase.hitlReview ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Review Stored & Scored • Ready for Next Operation
              </span>
            ) : (
              <span className="text-amber-800 font-semibold flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 animate-spin text-amber-600" />
                Pending Investigator Scoring & Adjudication
              </span>
            )}
          </div>
        </div>

        {/* 6 Step Interactive Workflow Stepper */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {workflowSteps.map((ws) => {
            const isCompleted = activeStep > ws.step || (activeStep === 6 && ws.step === 6 && currentCase.hitlReview);
            const isCurrent = activeStep === ws.step && !(ws.step === 6 && currentCase.hitlReview);
            return (
              <button
                key={ws.step}
                onClick={() => onNavigateTab && onNavigateTab(ws.tab)}
                className={`p-2.5 rounded-lg border text-left transition-all relative cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-50 border-amber-300 text-amber-900 ring-1 ring-amber-300 shadow-xs'
                    : isCompleted
                    ? 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                  <span className="font-bold">Step {ws.step}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping" />
                  ) : (
                    <Clock className="w-3 h-3 text-slate-400" />
                  )}
                </div>
                <div className="font-bold text-xs text-slate-900 line-clamp-1">{ws.title}</div>
                <div className="text-[10px] text-slate-500 line-clamp-1">{ws.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top Bar: Case ID & Status Stepper */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Case Info */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
            <FolderKanban className="w-5 h-5 text-amber-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {currentCase.id}
              </span>
              <span className="text-sm font-bold text-slate-900">{currentCase.title}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Target: <strong className="text-slate-800">{currentCase.targetEntity}</strong> • Exposure: <strong className="text-emerald-700 font-mono">${currentCase.totalExposure.toLocaleString()} {currentCase.currency}</strong>
            </div>
          </div>
        </div>

        {/* Right: Human-in-the-Loop Review Status */}
        <div className="flex items-center gap-2">
          {currentCase.hitlReview ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-slate-600">Review Stored: </span>
                <span className={`font-bold font-mono ${
                  currentCase.hitlReview.decision === 'CONFIRMED_FRAUD'
                    ? 'text-rose-700'
                    : currentCase.hitlReview.decision === 'FALSE_POSITIVE_REJECTED'
                    ? 'text-emerald-700'
                    : 'text-amber-800'
                }`}>
                  {currentCase.hitlReview.decision.replace(/_/g, ' ')}
                </span>
                <span className="text-[11px] text-amber-800 font-mono ml-1.5 font-bold">
                  (Score: {currentCase.hitlReview.adjudicationScore || 96}/100)
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              <Clock className="w-4 h-4 animate-spin text-amber-700" />
              <span>Awaiting Human Investigator Adjudication</span>
            </div>
          )}
        </div>
      </div>

      {/* Case Management Lifecycle Stepper */}
      <div className="pt-2 border-t border-slate-200">
        <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Case Lifecycle Progression</span>
          <span className="text-slate-400 text-[10px]">Click any stage to manually override case status</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {statuses.map((st, idx) => {
            const isCurrent = activeIndex === idx;
            const isPast = activeIndex > idx;

            return (
              <button
                key={st.id}
                onClick={() => onUpdateStatus(st.id)}
                className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-50 border-amber-300 shadow-xs ring-1 ring-amber-300'
                    : isPast
                    ? 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold ${isCurrent ? 'text-amber-900' : isPast ? 'text-slate-900' : 'text-slate-500'}`}>
                    {st.label}
                  </span>
                  {isCurrent ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
                  ) : isPast ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ) : null}
                </div>
                <div className="text-[10px] text-slate-500">{st.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Human-in-the-Loop Review Console */}
      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 shadow-xs">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">
              Human-in-the-Loop (HITL) Adjudication Console
            </div>
            <div className="text-[11px] text-slate-500">
              Review and assign final forensic score. Storing the review commits the audit trail and unlocks next operations.
            </div>
          </div>
        </div>

        {/* 3 Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            id="hitl-confirm-fraud-btn"
            onClick={() => handleOpenDecision('CONFIRMED_FRAUD')}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5 fill-current" />
            <span>Confirm Fraud & Score</span>
          </button>

          <button
            onClick={() => handleOpenDecision('MARKED_FOR_REVIEW')}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Mark for Review</span>
          </button>

          <button
            onClick={() => handleOpenDecision('FALSE_POSITIVE_REJECTED')}
            className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <XCircle className="w-3.5 h-3.5 text-slate-500" />
            <span>Dismiss / False Positive</span>
          </button>
        </div>
      </div>

      {/* Review Stored Dossier & "READY FOR NEXT OPERATION" HUB */}
      {currentCase.hitlReview && (
        <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-3.5 animate-in fade-in duration-300">
          {/* Stored Review Metadata Banner */}
          <div className="flex flex-wrap items-center justify-between border-b border-emerald-200 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-xs font-bold text-emerald-900">
                  Adjudication Review Stored & Sealed
                </span>
                <span className="text-[11px] text-slate-600 ml-2">
                  Signatory: <strong className="text-slate-900">{currentCase.hitlReview.reviewedBy}</strong> ({currentCase.hitlReview.reviewerRole})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="px-2 py-0.5 rounded bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold">
                SCORE: {currentCase.hitlReview.adjudicationScore || 96}/100
              </span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 text-[10px]">
                {currentCase.hitlReview.auditHash || 'SHA256:d89fb...42e'}
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-200 shadow-xs">
            <strong className="text-slate-900">Stored Rationale: </strong>
            <span>{currentCase.hitlReview.rationale}</span>
          </div>

          {/* NEXT OPERATIONAL ACTIONS SECTION */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Ready for Next Operation (Execute Below):</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Immediate Post-Investigation Workflows</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* Action 1: File SAR */}
              <button
                id="next-op-file-sar"
                onClick={handleGoToSarReport}
                className="p-3 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200 text-left transition-all flex flex-col justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>1. File FinCEN SAR</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div className="text-[10px] text-slate-600">
                  Generate Form 111 XML & statutory violation filing
                </div>
              </button>

              {/* Action 2: Freeze Accounts */}
              <button
                id="next-op-freeze-accounts"
                onClick={handleExecuteAccountFreeze}
                disabled={freezeActive}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer shadow-xs ${
                  freezeActive
                    ? 'bg-blue-50 border-blue-200 text-blue-900'
                    : 'bg-rose-50/80 hover:bg-rose-100/80 border-rose-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold flex items-center gap-1.5 text-rose-900">
                    <Snowflake className="w-3.5 h-3.5 text-blue-700" />
                    <span>2. Freeze Accounts</span>
                  </span>
                  {freezeActive ? (
                    <span className="text-[9px] font-mono bg-blue-100 border border-blue-300 text-blue-800 px-1 rounded font-bold">
                      FROZEN
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-rose-700" />
                  )}
                </div>
                <div className="text-[10px] text-slate-600">
                  {freezeActive ? `Held: Ticket #${freezeTicket}` : 'Block wire routes for BVI-9021-MRDN'}
                </div>
              </button>

              {/* Action 3: Archive to Evidence Vault */}
              <button
                id="next-op-evidence-vault"
                onClick={handleGoToEvidenceVault}
                className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all flex flex-col justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-purple-700" />
                    <span>3. Seal Evidence Vault</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-purple-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <div className="text-[10px] text-slate-600">
                  Seal custody hashes (Fed. R. Evid. 901/902)
                </div>
              </button>

              {/* Action 4: Advance to Next Case */}
              <button
                id="next-op-advance-case"
                onClick={handleAdvanceToNextCase}
                className="p-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left transition-all flex flex-col justify-between group cursor-pointer shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-emerald-700" />
                    <span>4. Next Investigation</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-700 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <div className="text-[10px] text-slate-600">
                  Load next pending target entity in queue
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {notificationMsg && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center gap-2 animate-in fade-in duration-200">
          <Sparkles className="w-4 h-4 text-amber-700" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Adjudication Decision Modal with Scoring Slider */}
      {isDecisionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4 text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-slate-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Human-in-the-Loop Adjudication & Scoring
                </h3>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                pendingDecision === 'CONFIRMED_FRAUD'
                  ? 'bg-rose-50 text-rose-800 border border-rose-200'
                  : pendingDecision === 'FALSE_POSITIVE_REJECTED'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                {pendingDecision.replace(/_/g, ' ')}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Review Score Slider */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-800">
                    Assigned Adjudication Risk Score:
                  </label>
                  <span className={`font-mono text-base font-bold ${
                    adjudicationScore >= 75 ? 'text-rose-700' : adjudicationScore >= 40 ? 'text-amber-700' : 'text-emerald-700'
                  }`}>
                    {adjudicationScore} / 100
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={adjudicationScore}
                  onChange={(e) => setAdjudicationScore(Number(e.target.value))}
                  className="w-full accent-slate-800"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>0 (Clean)</span>
                  <span>50 (Moderate)</span>
                  <span>100 (Critical Fraud)</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Investigator Legal Rationale & Adjudication Notes:
                </label>
                <textarea
                  value={rationaleText}
                  onChange={(e) => setRationaleText(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-sans"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Enforcement Directive / Statutory Action:
                </label>
                <input
                  type="text"
                  value={recommendedAction}
                  onChange={(e) => setRecommendedAction(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-slate-500 font-sans"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Investigator Signatory:</span>
                  <strong className="text-slate-900 font-mono">
                    {currentUser?.name || 'Sarah Jenkins, CAMS (Lead Investigator)'}
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span>Clearance Level:</span>
                  <strong className="text-slate-800 font-mono">
                    {currentUser?.clearanceLevel || 'LEVEL_4_TOP_SECRET'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setIsDecisionModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="hitl-modal-sign-btn"
                onClick={handleCommitDecision}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>Store Review & Unlock Next Operations</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
