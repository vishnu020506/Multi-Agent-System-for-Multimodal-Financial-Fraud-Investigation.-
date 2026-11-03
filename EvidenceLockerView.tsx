import React, { useState } from 'react';
import { 
  FolderLock, 
  FileText, 
  Database, 
  MessageSquare, 
  Headphones, 
  Share2, 
  PlusCircle, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  FileDown, 
  ExternalLink,
  History,
  Sparkles,
  Upload,
  X
} from 'lucide-react';
import { CaseEvidenceItem, InvestigationCase } from '../types';

interface EvidenceLockerViewProps {
  currentCase: InvestigationCase;
  onAddEvidenceItem?: (item: CaseEvidenceItem) => void;
}

export const EvidenceLockerView: React.FC<EvidenceLockerViewProps> = ({
  currentCase,
  onAddEvidenceItem,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'TRANSACTION' | 'DOCUMENT' | 'COMMUNICATION' | 'GRAPH' | 'AUDIO'>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // New Evidence Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<CaseEvidenceItem['category']>('DOCUMENT');
  const [newSourceFile, setNewSourceFile] = useState('CUSTOM_EXHIBIT_SCAN.pdf');
  const [newSummary, setNewSummary] = useState('');

  // Default evidence items generated from current case if not populated
  const defaultItems: CaseEvidenceItem[] = currentCase.evidenceLocker || [
    {
      id: 'EV-01',
      title: 'Commercial Billing Invoice #INV-2024-8841',
      category: 'DOCUMENT',
      dateAdded: '2024-11-10 11:30 UTC',
      sourceFile: 'Apex_Invoice_8841_Scanned.pdf',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      status: 'TAMPERED',
      summary: 'Stated grand total of $98,500.00 contains a +$70,900.00 mathematical surplus over itemized services.',
      uploadedBy: 'Inv. Sarah Jenkins (FinCEN Task Force)',
      forensicSignals: ['Math Discrepancy +$70.9k', 'Font Substitution', 'CS6 Stream Signature'],
    },
    {
      id: 'EV-02',
      title: 'SWIFT MT103 Clearing Slips (Tranche 1-4)',
      category: 'TRANSACTION',
      dateAdded: '2024-11-10 12:45 UTC',
      sourceFile: 'SWIFT_FEED_BATCH_8901.json',
      sha256Hash: '84d89877f0d4041efb6bf91a16f0248f2fd573e6af05c19f96bedb9f882f7882',
      status: 'VERIFIED',
      summary: 'Four structured wire transfers of $9,900, $9,850, $9,950, and $9,750 systematically structured below $10,000.',
      uploadedBy: 'Automated Clearing House Telemetry',
      forensicSignals: ['BSA Danger Corridor', 'Velocity Burst (4h)', 'BVI Beneficiary'],
    },
    {
      id: 'EV-03',
      title: 'Internal Executive Communications Thread',
      category: 'COMMUNICATION',
      dateAdded: '2024-11-10 13:10 UTC',
      sourceFile: 'Email_Archive_Vance_Accounting.eml',
      sha256Hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
      status: 'VERIFIED',
      summary: 'Executive instruction from David Vance explicitly directing staff to split wire transfers under $10,000.',
      uploadedBy: 'Subpoena Production Team',
      forensicSignals: ['Coercive Intent 0.94', 'CTR Evasion Mention', 'Off-book directive'],
    },
    {
      id: 'EV-04',
      title: 'Offshore Corporate Registry Graph Dossier',
      category: 'GRAPH',
      dateAdded: '2024-11-10 14:00 UTC',
      sourceFile: 'Network_Topology_BVI_Layering.json',
      sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      status: 'VERIFIED',
      summary: 'Tarjan SCC topological cycle demonstrating circular fund looping between Apex Logistics and Horizon BVI.',
      uploadedBy: 'Forensic Graph Engine v2.4',
      forensicSignals: ['Circular Loop', 'Shell Entity Hub', 'Tortola Secrecy'],
    },
    {
      id: 'EV-05',
      title: 'Title III Judicial Wiretap Intercept REC-8901-01',
      category: 'AUDIO',
      dateAdded: '2024-11-10 15:30 UTC',
      sourceFile: 'WIRETAP_AUDIO_8901_01.wav',
      sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      status: 'VERIFIED',
      summary: 'Acoustic telephone intercept capturing verbal instructions: "Nine nine hundred, nine eight fifty... Keep each under the ten thousand threshold".',
      uploadedBy: 'Federal Wiretap Intercept Unit',
      forensicSignals: ['Voice Stress 89/100', 'Vocal Jitter 2.84%', 'Biometric Match 94.6%'],
    },
  ];

  const [evidenceList, setEvidenceList] = useState<CaseEvidenceItem[]>(defaultItems);

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2500);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: CaseEvidenceItem = {
      id: `EV-0${evidenceList.length + 1}`,
      title: newTitle,
      category: newCategory,
      dateAdded: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      sourceFile: newSourceFile,
      sha256Hash: Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
      status: 'VERIFIED',
      summary: newSummary || 'Ad-hoc forensic evidentiary artifact logged into case custody record.',
      uploadedBy: 'Active Special Investigator',
      forensicSignals: ['User Submitted', 'Chain-of-Custody Logged'],
    };

    setEvidenceList([newItem, ...evidenceList]);
    if (onAddEvidenceItem) onAddEvidenceItem(newItem);

    setNewTitle('');
    setNewSummary('');
    setIsAddModalOpen(false);
  };

  const filteredItems = evidenceList.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] uppercase font-bold border border-purple-500/30">
                Evidentiary Chain-of-Custody
              </span>
              <span className="text-xs text-slate-400">Case ID:</span>
              <span className="text-xs font-bold text-slate-200">{currentCase.id}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <FolderLock className="w-6 h-6 text-purple-400" />
              Evidence Management Vault & Forensic Locker
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Cryptographically verified repository of all case artifacts: documents, transaction ledger batches, email communications, graph network snapshots, and acoustic wiretap surveillance recordings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-500/20 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log New Evidence Artifact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['ALL', 'TRANSACTION', 'DOCUMENT', 'COMMUNICATION', 'GRAPH', 'AUDIO'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              selectedCategory === cat
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 ring-1 ring-purple-500/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {cat === 'ALL' ? 'All Artifacts' : cat}
          </button>
        ))}
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg space-y-3 relative group hover:border-slate-700 transition"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-purple-400 shrink-0">
                  {item.category === 'TRANSACTION' && <Database className="w-5 h-5 text-amber-400" />}
                  {item.category === 'DOCUMENT' && <FileText className="w-5 h-5 text-cyan-400" />}
                  {item.category === 'COMMUNICATION' && <MessageSquare className="w-5 h-5 text-rose-400" />}
                  {item.category === 'GRAPH' && <Share2 className="w-5 h-5 text-purple-400" />}
                  {item.category === 'AUDIO' && <Headphones className="w-5 h-5 text-emerald-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-800">
                      {item.id}
                    </span>
                    <h3 className="text-xs font-bold text-slate-100">{item.title}</h3>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                    Source: {item.sourceFile} • Added {item.dateAdded}
                  </div>
                </div>
              </div>

              <span className={`text-[10px] px-2 py-0.5 rounded font-bold font-mono border shrink-0 ${
                item.status === 'TAMPERED'
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-emerald-950 text-emerald-300 border-emerald-800'
              }`}>
                {item.status}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/60">
              {item.summary}
            </p>

            {/* Cryptographic SHA-256 Hash */}
            <div className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-[10px] font-mono">
              <div className="flex items-center gap-1.5 text-slate-400 truncate max-w-xs">
                <span className="text-slate-500">SHA-256:</span>
                <span className="truncate text-slate-300">{item.sha256Hash}</span>
              </div>
              <button
                onClick={() => handleCopyHash(item.sha256Hash)}
                className="text-purple-400 hover:text-purple-300 ml-2 p-1"
                title="Copy SHA-256 hash"
              >
                {copiedHash === item.sha256Hash ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Forensic Signals */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.forensicSignals.map((sig, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-mono"
                >
                  {sig}
                </span>
              ))}
            </div>

            <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800 flex items-center justify-between">
              <span>Custody: {item.uploadedBy}</span>
              <span className="text-emerald-400 font-mono">Admissible in Court</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Evidence Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-750 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FolderLock className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-slate-100">Log New Evidence Artifact</h3>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Artifact Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Scanned Customs Declaration #CD-8812"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="DOCUMENT">Document (OCR)</option>
                    <option value="TRANSACTION">Transaction Ledger</option>
                    <option value="COMMUNICATION">Comms / Email</option>
                    <option value="GRAPH">Graph Topology</option>
                    <option value="AUDIO">Audio Wiretap</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Source Filename:</label>
                  <input
                    type="text"
                    value={newSourceFile}
                    onChange={(e) => setNewSourceFile(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Investigator Summary & Forensic Observations:
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe forensic relevance, tamper indications, or transaction linkage..."
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition"
                >
                  Secure into Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
