import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  PlusCircle, 
  Radio, 
  Zap, 
  Clock, 
  ArrowUpRight,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { TransactionItem } from '../types';
import { playAlertChime } from '../utils/audioChime';

interface RealTimeMonitoringStreamProps {
  onAttachTransactionToCase?: (tx: TransactionItem) => void;
  targetEntityName?: string;
}

interface StreamedTxn extends TransactionItem {
  receivedAt: string;
  anomalyScore: number;
}

const POOL_SENDERS = [
  'Apex Global Logistics Ltd (BVI)',
  'Horizon Marine Freight BVI',
  'Valence Biotech Research Inc',
  'Starling Capital Offshore Cayman',
  'Meridian Trade Solutions LLC',
  'Omega Shipping Holdings Panama',
  'Nova Liquid Bridge Custody',
  'Standard Retail Customer 881',
  'Pacific Commercial Importers',
  'Atlas Energy Brokerage Geneva',
];

const POOL_RECEIVERS = [
  'Horizon BVI Ventures Account #8812',
  'Titan Consulting Shell Entity BVI',
  'Dr. Arthur Hayes Escrow Legal',
  'Nova Hot Wallet Bridge 0x99a',
  'Acme Supplies Net-30 Verified',
  'Apex Staffing Payroll Direct',
  'Zurich Private Banking Hop #02',
  'Tortola Corporate Services Trust',
];

export const RealTimeMonitoringStream: React.FC<RealTimeMonitoringStreamProps> = ({
  onAttachTransactionToCase,
  targetEntityName = 'Apex Global Logistics Ltd',
}) => {
  const [isRunning, setIsRunning] = useState(true);
  const [streamSpeedMs, setStreamSpeedMs] = useState(2500);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [filterMode, setFilterMode] = useState<'ALL' | 'FLAGGED_ONLY' | 'STRUCTURING'>('ALL');
  const [transactions, setTransactions] = useState<StreamedTxn[]>([
    {
      id: `TX-RT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date(Date.now() - 6000).toLocaleTimeString(),
      receivedAt: 'Just now',
      senderName: 'Apex Global Logistics Ltd (BVI)',
      senderAccount: 'US-8821-APEX',
      receiverName: 'Horizon BVI Ventures Account #8812',
      receiverAccount: 'BVI-4491-HORIZ',
      amount: 9940,
      currency: 'USD',
      channel: 'WIRE',
      flagged: true,
      anomalyType: 'SMURFING',
      anomalyScore: 94,
      notes: 'BSA Threshold evasion: $9,940 wire tranche to offshore jurisdiction',
    },
    {
      id: `TX-RT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date(Date.now() - 12000).toLocaleTimeString(),
      receivedAt: '12s ago',
      senderName: 'Pacific Commercial Importers',
      senderAccount: 'US-9912-PAC',
      receiverName: 'Acme Supplies Net-30 Verified',
      receiverAccount: 'US-1120-ACME',
      amount: 1420,
      currency: 'USD',
      channel: 'ACH',
      flagged: false,
      anomalyScore: 12,
      notes: 'Standard verified supplier invoice settlement',
    },
    {
      id: `TX-RT-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date(Date.now() - 18000).toLocaleTimeString(),
      receivedAt: '18s ago',
      senderName: 'Apex Global Logistics Ltd (BVI)',
      senderAccount: 'US-8821-APEX',
      receiverName: 'Titan Consulting Shell Entity BVI',
      receiverAccount: 'BVI-9921-TITAN',
      amount: 9880,
      currency: 'USD',
      channel: 'WIRE',
      flagged: true,
      anomalyType: 'SMURFING',
      anomalyScore: 92,
      notes: 'Rapid subsequent wire tranche under $10,000 threshold within 1 hour',
    },
  ]);

  const [totalMonitored, setTotalMonitored] = useState(3842);
  const [totalFlagged, setTotalFlagged] = useState(29);
  const [recentlyAttachedId, setRecentlyAttachedId] = useState<string | null>(null);

  // Interval generator
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // 35% chance of generating a suspicious structuring or off-hours transaction
      const isSuspicious = Math.random() < 0.35;
      const isStructuring = isSuspicious && Math.random() < 0.7;

      let amount = 0;
      let anomalyType: StreamedTxn['anomalyType'] = 'NORMAL';
      let anomalyScore = Math.floor(8 + Math.random() * 15);
      let notes = 'Standard commercial payment';
      let sender = POOL_SENDERS[Math.floor(Math.random() * POOL_SENDERS.length)];
      let receiver = POOL_RECEIVERS[Math.floor(Math.random() * POOL_RECEIVERS.length)];

      if (isStructuring) {
        // Danger corridor: $9,500 - $9,990
        amount = Math.floor(9500 + Math.random() * 490);
        anomalyType = 'SMURFING';
        anomalyScore = Math.floor(88 + Math.random() * 11);
        notes = `CTR Evasion: $${amount.toLocaleString()} structured wire tranche`;
        sender = targetEntityName || POOL_SENDERS[0];
      } else if (isSuspicious) {
        amount = Math.floor(50000 + Math.random() * 200000);
        anomalyType = Math.random() < 0.5 ? 'CROSS_BORDER' : 'VELOCITY_SPIKE';
        anomalyScore = Math.floor(78 + Math.random() * 18);
        notes = 'Off-hours high-velocity cross-border settlement';
      } else {
        amount = Math.floor(250 + Math.random() * 4500);
      }

      const newTx: StreamedTxn = {
        id: `TX-RT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toLocaleTimeString(),
        receivedAt: 'Just now',
        senderName: sender,
        senderAccount: `ACC-${Math.floor(1000 + Math.random() * 9000)}`,
        receiverName: receiver,
        receiverAccount: `BVI-${Math.floor(1000 + Math.random() * 9000)}`,
        amount,
        currency: 'USD',
        channel: isSuspicious ? 'WIRE' : 'ACH',
        flagged: isSuspicious,
        anomalyType: isSuspicious ? anomalyType : undefined,
        anomalyScore,
        notes,
      };

      if (isSuspicious && soundEnabled) {
        playAlertChime();
      }

      setTransactions((prev) => [newTx, ...prev.slice(0, 39)]);
      setTotalMonitored((prev) => prev + 1);
      if (isSuspicious) {
        setTotalFlagged((prev) => prev + 1);
      }
    }, streamSpeedMs);

    return () => clearInterval(interval);
  }, [isRunning, streamSpeedMs, soundEnabled, targetEntityName]);

  const handleAttach = (tx: StreamedTxn) => {
    if (onAttachTransactionToCase) {
      onAttachTransactionToCase(tx);
      setRecentlyAttachedId(tx.id);
      setTimeout(() => setRecentlyAttachedId(null), 3000);
    }
  };

  const filteredTxns = transactions.filter((tx) => {
    if (filterMode === 'FLAGGED_ONLY') return tx.flagged;
    if (filterMode === 'STRUCTURING') return tx.amount >= 9500 && tx.amount < 10000;
    return true;
  });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      {/* Stream Header & Telemetry */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              <Activity className={`w-6 h-6 ${isRunning ? 'animate-pulse' : ''}`} />
            </div>
            {isRunning && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-ping" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Real-Time Transaction Surveillance Engine
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                {isRunning ? 'LIVE FEED ACTIVE' : 'PAUSED'}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Continuously intercepting incoming SWIFT MT103, Fedwire, and ACH clearing streams with sub-50ms heuristic flagging.
            </p>
          </div>
        </div>

        {/* Real-time KPI Stats */}
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-left">
            <div className="text-[10px] text-slate-400">Monitored Ingest</div>
            <div className="text-sm font-bold text-slate-100 font-mono">
              {totalMonitored.toLocaleString()}
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-rose-900/50 text-left">
            <div className="text-[10px] text-rose-400 font-semibold">Immediate Flags</div>
            <div className="text-sm font-bold text-rose-300 font-mono">
              {totalFlagged} ({((totalFlagged / totalMonitored) * 100).toFixed(2)}%)
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-left hidden sm:block">
            <div className="text-[10px] text-slate-400">Detection Latency</div>
            <div className="text-sm font-bold text-emerald-400 font-mono">38 ms</div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          {/* Play/Pause */}
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              isRunning
                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40 hover:bg-amber-500/20'
                : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md font-bold'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Live Stream</span>
              </>
            )}
          </button>

          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-[11px]">
            <span className="text-slate-400 px-1">Speed:</span>
            <button
              onClick={() => setStreamSpeedMs(1200)}
              className={`px-2 py-0.5 rounded ${
                streamSpeedMs === 1200 ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              1.2s Fast
            </button>
            <button
              onClick={() => setStreamSpeedMs(2500)}
              className={`px-2 py-0.5 rounded ${
                streamSpeedMs === 2500 ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2.5s Standard
            </button>
            <button
              onClick={() => setStreamSpeedMs(5000)}
              className={`px-2 py-0.5 rounded ${
                streamSpeedMs === 5000 ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              5.0s Slow
            </button>
          </div>

          {/* Audio Chime Toggle */}
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            className={`p-2 rounded-lg border text-xs transition ${
              soundEnabled
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title={soundEnabled ? 'Alert chime enabled' : 'Alert chime muted'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium ${
              filterMode === 'ALL'
                ? 'bg-slate-800 text-white font-bold border border-slate-700'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            All Streamed
          </button>
          <button
            onClick={() => setFilterMode('FLAGGED_ONLY')}
            className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium ${
              filterMode === 'FLAGGED_ONLY'
                ? 'bg-rose-950 text-rose-300 border border-rose-800 font-bold'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Flagged Suspicious Only
          </button>
          <button
            onClick={() => setFilterMode('STRUCTURING')}
            className={`px-2.5 py-1 rounded-lg transition text-[11px] font-medium ${
              filterMode === 'STRUCTURING'
                ? 'bg-amber-950 text-amber-300 border border-amber-800 font-bold'
                : 'text-slate-400 hover:text-slate-300'
            }`}
          >
            Structuring Danger Zone ($9k–$10k)
          </button>
        </div>
      </div>

      {recentlyAttachedId && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Transaction <strong>{recentlyAttachedId}</strong> attached to active investigation case evidence dossier!</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">Evidence Linked</span>
        </div>
      )}

      {/* Stream Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
        <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-800/60">
          {filteredTxns.map((tx) => {
            const isStructuring = tx.amount >= 9500 && tx.amount < 10000;
            return (
              <div
                key={tx.id}
                className={`p-3 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 transition-colors ${
                  tx.flagged
                    ? 'bg-rose-950/20 hover:bg-rose-950/30'
                    : 'hover:bg-slate-900/40'
                }`}
              >
                {/* Left: Tx ID & Entities */}
                <div className="flex items-center gap-3 min-w-[280px]">
                  <div className={`p-2 rounded-lg shrink-0 ${
                    tx.flagged
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                    {tx.flagged ? (
                      <ShieldAlert className="w-4 h-4 animate-pulse" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="font-bold text-slate-200">{tx.id}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400">{tx.timestamp}</span>
                      <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] text-slate-400">
                        {tx.channel}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 truncate max-w-sm">
                      <span className="text-slate-400">{tx.senderName}</span>
                      <span className="text-amber-400 mx-1.5">➔</span>
                      <span className="text-slate-300 font-semibold">{tx.receiverName}</span>
                    </div>
                  </div>
                </div>

                {/* Center: Amount & Anomaly Badge */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`text-sm font-bold font-mono ${
                      isStructuring
                        ? 'text-amber-300 underline decoration-amber-500'
                        : tx.flagged
                        ? 'text-rose-400'
                        : 'text-slate-200'
                    }`}>
                      ${tx.amount.toLocaleString()} {tx.currency}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      Risk Score: {tx.anomalyScore}/100
                    </div>
                  </div>

                  {tx.flagged ? (
                    <span className="px-2 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold font-mono whitespace-nowrap">
                      {tx.anomalyType || 'FLAGGED'}
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono whitespace-nowrap">
                      CLEARED
                    </span>
                  )}
                </div>

                {/* Right: Notes & Attach Button */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-[11px] text-slate-400 truncate max-w-xs hidden lg:block">
                    {tx.notes}
                  </div>

                  {tx.flagged && onAttachTransactionToCase && (
                    <button
                      onClick={() => handleAttach(tx)}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-[10px] font-bold transition flex items-center gap-1 shrink-0 shadow-sm"
                      title="Attach suspicious transaction to current investigation case"
                    >
                      <PlusCircle className="w-3 h-3" />
                      <span>Attach to Case</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
