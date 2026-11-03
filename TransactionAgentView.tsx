import React, { useState } from 'react';
import { 
  TrendingUp, 
  AlertOctagon, 
  Filter, 
  Search, 
  ArrowDownRight, 
  ArrowUpRight, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  Building,
  Info,
  Download,
  FileCode,
  Layers,
  Sparkles,
  BarChart3,
  X
} from 'lucide-react';
import { TransactionAnalysis, TransactionItem } from '../types';

interface TransactionAgentViewProps {
  analysis: TransactionAnalysis;
}

export const TransactionAgentView: React.FC<TransactionAgentViewProps> = ({ analysis }) => {
  const [filterType, setFilterType] = useState<'ALL' | 'FLAGGED' | 'SMURFING'>('ALL');
  const [selectedChannel, setSelectedChannel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<TransactionItem | null>(null);
  const [showWireInspector, setShowWireInspector] = useState(false);
  const [inspectorTab, setInspectorTab] = useState<'SUMMARY' | 'SWIFT_MT103'>('SUMMARY');

  const filteredTransactions = analysis.transactions.filter((tx) => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterType === 'FLAGGED' && !tx.flagged) return false;
    if (filterType === 'SMURFING' && tx.anomalyType !== 'SMURFING') return false;
    if (selectedChannel !== 'ALL' && tx.channel !== selectedChannel) return false;
    return true;
  });

  const handleExportCsv = () => {
    const headers = ['ID', 'Timestamp', 'Sender Account', 'Sender Name', 'Receiver Account', 'Receiver Name', 'Amount', 'Currency', 'Channel', 'Flagged', 'Anomaly Type', 'Notes'];
    const rows = analysis.transactions.map((t) => [
      t.id,
      t.timestamp,
      t.senderAccount,
      `"${t.senderName}"`,
      t.receiverAccount,
      `"${t.receiverName}"`,
      t.amount,
      t.currency,
      t.channel,
      t.flagged ? 'YES' : 'NO',
      t.anomalyType || 'NORMAL',
      `"${t.notes || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AML_Transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateSwiftMt103 = (t: TransactionItem) => {
    const dateFormatted = t.timestamp.slice(2, 10).replace(/-/g, '');
    return `{1:F01${t.senderAccount.replace(/[^A-Z0-9]/g, '').padEnd(12, 'X')}}
{2:I103${t.receiverAccount.replace(/[^A-Z0-9]/g, '').padEnd(12, 'X')}N}
{3:{108:${t.id}}}
{4:
:20:${t.id}
:23B:CRED
:32A:${dateFormatted}${t.currency}${t.amount.toFixed(2).replace('.', ',')}
:50K:/${t.senderAccount}
${t.senderName.toUpperCase()}
:59:/${t.receiverAccount}
${t.receiverName.toUpperCase()}
:70:${(t.notes || 'COMMERCIAL PAYMENT').toUpperCase()}
:71A:OUR
-}`;
  };

  // Compute stats for the Smurfing Cluster Chart
  const smurfingThreshold = 10000;
  const smurfedTxns = analysis.transactions.filter(
    (t) => t.amount >= 9500 && t.amount < 10000
  );

  return (
    <div id="transaction-agent-view" className="space-y-6">
      {/* Top Banner: Agent Intelligence Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Transaction AI Agent</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
                  Agent Status: {analysis.agentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Specialized in detecting velocity anomalies, structuring/smurfing, circular routing, and threshold evasion.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">Agent Risk Score</div>
              <div className={`text-2xl font-bold font-mono ${analysis.riskScore >= 75 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {analysis.riskScore}/100
              </div>
            </div>
          </div>
        </div>

        {/* Structuring / Smurfing Visual Warning Banner */}
        {analysis.structuringAnalysis.detected && (
          <div className="mt-5 p-4 rounded-lg bg-rose-950/40 border border-rose-800/80 flex items-start gap-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-rose-300 uppercase tracking-wide">
                BSA 31 U.S.C. § 5324 Structuring / Smurfing Ring Detected
              </div>
              <p className="text-rose-200 mt-1 leading-relaxed">
                {analysis.structuringAnalysis.clusterSummary} Multiple wires are mathematically clustered between $9,750 and $9,980 (variance &lt; 2.5%) specifically calibrated to bypass mandatory $10,000 Currency Transaction Reporting (CTR) triggers.
              </p>
            </div>
          </div>
        )}

        {/* Metric Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Total Transaction Volume</div>
            <div className="text-base font-bold text-white font-mono">
              ${analysis.totalVolume.toLocaleString()}
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Flagged Suspicious Volume</div>
            <div className="text-base font-bold text-rose-400 font-mono">
              ${analysis.flaggedVolume.toLocaleString()}
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Anomalies Classified</div>
            <div className="text-base font-bold text-amber-400 font-mono">
              {analysis.anomaliesDetected.length} Pattern(s)
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Total Records Audited</div>
            <div className="text-base font-bold text-slate-200 font-mono">
              {analysis.transactions.length} Ledger Rows
            </div>
          </div>
        </div>
      </div>

      {/* BSA $10,000 Threshold Evading Cluster Scatter Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>BSA $10,000 Regulatory Threshold Cluster Analysis</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Visualizes transaction dollar clustering directly underneath the $10,000 CTR statutory reporting threshold.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-400">Smurfing Cluster:</span>
            <span className="font-mono font-bold text-rose-400 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded">
              {smurfedTxns.length} Wires ($9,500 - $9,999)
            </span>
          </div>
        </div>

        {/* SVG Scatter Chart */}
        <div className="relative w-full h-48 bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-hidden flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 800 160" preserveAspectRatio="none">
            {/* Grid Lines */}
            <line x1="40" y1="130" x2="780" y2="130" stroke="#1e293b" strokeWidth="1" />
            <line x1="40" y1="85" x2="780" y2="85" stroke="#1e293b" strokeWidth="1" />
            <line x1="40" y1="40" x2="780" y2="40" stroke="#1e293b" strokeWidth="1" />

            {/* Danger Corridor Shading ($9,000 to $10,000) */}
            <rect
              x="40"
              y="32"
              width="740"
              height="28"
              fill="#f43f5e"
              opacity="0.12"
            />

            {/* Threshold Line at $10,000 */}
            <line
              x1="40"
              y1="32"
              x2="780"
              y2="32"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeDasharray="6,4"
            />
            <text
              x="50"
              y="26"
              fill="#fb7185"
              fontSize="10"
              fontWeight="bold"
              fontFamily="monospace"
            >
              ▲ BSA $10,000 MANDATORY CTR REPORTING TRIGGER LINE
            </text>

            <text
              x="770"
              y="48"
              fill="#fda4af"
              fontSize="9"
              fontFamily="monospace"
              textAnchor="end"
            >
              SMURFING CORRIDOR ($9,500 - $9,999)
            </text>

            {/* Y-axis labels */}
            <text x="32" y="36" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">$10k</text>
            <text x="32" y="88" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">$5k</text>
            <text x="32" y="133" fill="#64748b" fontSize="9" textAnchor="end" fontFamily="monospace">$0</text>

            {/* Render Transaction Dots */}
            {analysis.transactions.map((tx, idx) => {
              const total = analysis.transactions.length;
              const cx = 60 + (idx / Math.max(1, total - 1)) * 700;
              // Map amount: $10,000 is y=32, $0 is y=130
              const normalizedAmt = Math.min(tx.amount, 12000);
              const cy = 130 - (normalizedAmt / 10000) * (130 - 32);
              const isSmurfed = tx.amount >= 9500 && tx.amount < 10000;
              const isSelected = selectedTxn?.id === tx.id;

              return (
                <g 
                  key={tx.id} 
                  className="cursor-pointer group"
                  onClick={() => {
                    setSelectedTxn(tx);
                    setShowWireInspector(true);
                  }}
                >
                  {/* Outer glowing halo for smurfed */}
                  {isSmurfed && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 10 : 7}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth={1.5}
                      className="animate-pulse"
                    />
                  )}

                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6 : isSmurfed ? 4.5 : 3.5}
                    fill={isSmurfed ? '#f43f5e' : tx.flagged ? '#f59e0b' : '#38bdf8'}
                    stroke="#020617"
                    strokeWidth={1}
                  />

                  {/* Tooltip on hover */}
                  <title>{`${tx.id}: $${tx.amount.toLocaleString()} - ${tx.notes || tx.senderName}`}</title>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Click any point on the scatter plot to inspect wire telegram parameters.</span>
          <span className="text-amber-400">Total {analysis.transactions.length} Transactions Audited</span>
        </div>
      </div>

      {/* Anomalies Classification Cards */}
      {analysis.anomaliesDetected.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Identified Transaction Anomaly Signatures</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {analysis.anomaliesDetected.map((anomaly, idx) => (
              <div key={idx} className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-200 uppercase font-mono text-[11px]">
                      {anomaly.type.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      anomaly.severity === 'HIGH' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-2">
                    {anomaly.description}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-blue-400">
                  Referenced IDs: {anomaly.evidenceIds.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interactive Transactions Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {/* Table Filters & Search */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">Audited Financial Transactions</span>
            <span className="text-xs text-slate-400 font-mono">({filteredTransactions.length} of {analysis.transactions.length})</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 text-xs">
              <button
                id="filter-txn-all"
                onClick={() => setFilterType('ALL')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filterType === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All
              </button>
              <button
                id="filter-txn-flagged"
                onClick={() => setFilterType('FLAGGED')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filterType === 'FLAGGED' ? 'bg-rose-900 text-rose-200' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Flagged
              </button>
              <button
                id="filter-txn-smurfing"
                onClick={() => setFilterType('SMURFING')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  filterType === 'SMURFING' ? 'bg-amber-900 text-amber-200' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Structuring Only
              </button>
            </div>

            {/* Channel Filter */}
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 py-1 px-2 focus:outline-none"
            >
              <option value="ALL">All Channels</option>
              <option value="WIRE">WIRE</option>
              <option value="ACH">ACH</option>
              <option value="CRYPTO">CRYPTO</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                id="search-transactions-input"
                type="text"
                placeholder="Search account, name, notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Export CSV button */}
            <button
              onClick={handleExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
              title="Download CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Txn ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Sender / Source</th>
                <th className="py-2.5 px-3">Receiver / Target</th>
                <th className="py-2.5 px-3">Channel</th>
                <th className="py-2.5 px-3 text-right">Amount (USD)</th>
                <th className="py-2.5 px-3">Anomaly Classification</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTransactions.map((tx) => (
                <tr 
                  key={tx.id} 
                  className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                    tx.flagged ? 'bg-rose-950/10' : ''
                  } ${selectedTxn?.id === tx.id ? 'ring-1 ring-amber-400/50 bg-slate-800/50' : ''}`}
                  onClick={() => {
                    setSelectedTxn(tx);
                    setShowWireInspector(true);
                  }}
                >
                  <td className="py-2.5 px-3 font-semibold text-slate-200">{tx.id}</td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">{tx.timestamp}</td>
                  <td className="py-2.5 px-3">
                    <div className="font-sans font-medium text-slate-200 text-xs">{tx.senderName}</div>
                    <div className="text-[10px] text-slate-400">{tx.senderAccount}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <div className="font-sans font-medium text-slate-200 text-xs">{tx.receiverName}</div>
                    <div className="text-[10px] text-slate-400">{tx.receiverAccount}</div>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                      {tx.channel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-white text-xs">
                    ${tx.amount.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-sans">
                    {tx.flagged ? (
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        tx.anomalyType === 'SMURFING'
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}>
                        <ShieldAlert className="w-3 h-3" />
                        <span>{tx.anomalyType || 'FLAGGED'}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-900/60 font-medium">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Normal</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTxn(tx);
                        setShowWireInspector(true);
                      }}
                      className="text-[10px] text-amber-400 hover:text-amber-300 underline font-sans"
                    >
                      Audit Wire
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SWIFT / Fedwire Message Inspector Modal */}
      {showWireInspector && selectedTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl space-y-4 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">
                  Wire Transfer Forensic Audit: {selectedTxn.id}
                </h3>
              </div>
              <button
                onClick={() => setShowWireInspector(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inspector Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setInspectorTab('SUMMARY')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  inspectorTab === 'SUMMARY'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ledger Summary
              </button>
              <button
                onClick={() => setInspectorTab('SWIFT_MT103')}
                className={`px-3 py-1 rounded text-xs font-semibold ${
                  inspectorTab === 'SWIFT_MT103'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Raw SWIFT MT103 Telegram
              </button>
            </div>

            {inspectorTab === 'SUMMARY' ? (
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-400 mb-1">Ordering Customer (Sender)</div>
                    <div className="font-bold text-white">{selectedTxn.senderName}</div>
                    <div className="font-mono text-slate-400 text-[11px]">{selectedTxn.senderAccount}</div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-400 mb-1">Beneficiary Customer (Receiver)</div>
                    <div className="font-bold text-white">{selectedTxn.receiverName}</div>
                    <div className="font-mono text-slate-400 text-[11px]">{selectedTxn.receiverAccount}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-400 mb-1">Settlement Amount</div>
                    <div className="font-mono font-bold text-amber-400 text-base">
                      ${selectedTxn.amount.toLocaleString()} {selectedTxn.currency}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-400 mb-1">Execution Channel</div>
                    <div className="font-mono font-bold text-white text-base">
                      {selectedTxn.channel}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <div className="text-slate-400 mb-1">Execution Timestamp</div>
                    <div className="font-mono text-slate-300 text-[11px]">
                      {selectedTxn.timestamp}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <div className="text-slate-400">Forensic Investigation Notes:</div>
                  <p className="text-slate-200 leading-relaxed">
                    {selectedTxn.notes || 'No specific anomalous notes logged for this entry.'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-xs text-slate-400">
                  Standard SWIFT Interbank Payment Message (FIN MT 103 Single Customer Credit Transfer):
                </div>
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-400 overflow-x-auto leading-relaxed select-all">
                  {generateSwiftMt103(selectedTxn)}
                </pre>
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowWireInspector(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
