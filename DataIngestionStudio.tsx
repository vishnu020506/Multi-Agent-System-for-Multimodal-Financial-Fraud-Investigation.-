import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Database, 
  MessageSquare, 
  Headphones, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Trash2, 
  Plus, 
  Eye, 
  ArrowRight,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { InvestigationCase, TransactionItem } from '../types';

interface DataIngestionStudioProps {
  currentCase: InvestigationCase;
  onProceedToPreprocessing: () => void;
  onUpdateCaseData?: (updated: Partial<InvestigationCase>) => void;
}

export const DataIngestionStudio: React.FC<DataIngestionStudioProps> = ({
  currentCase,
  onProceedToPreprocessing,
  onUpdateCaseData,
}) => {
  const [activeChannel, setActiveChannel] = useState<'TRANSACTIONS' | 'DOCUMENTS' | 'TEXT' | 'AUDIO'>('TRANSACTIONS');
  
  // Transaction Ingestion State
  const [txnJsonText, setTxnJsonText] = useState(
    JSON.stringify(currentCase.transactionAnalysis.transactions.slice(0, 5), null, 2)
  );
  const [uploadedTxnCount, setUploadedTxnCount] = useState(currentCase.transactionAnalysis.transactions.length);
  const [txnUploadSuccess, setTxnUploadSuccess] = useState<string | null>(null);

  // Document/Image Ingestion State
  const [selectedDocTitle, setSelectedDocTitle] = useState('Commercial Invoice #INV-2024-8841');
  const [docImagePreview, setDocImagePreview] = useState<string | null>(
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80'
  );
  const [docOcrText, setDocOcrText] = useState(
    `INVOICE #INV-2024-8841\nDate: 2024-11-10\nVendor: Apex Global Logistics Ltd (BVI)\nCustomer: Horizon Freight Corp\nAmount: $98,500.00 USD\nLine Items: Logistics Brokerage Services (Tranche 1-4)\nAuthorized: David Vance (VP Operations)\nTax ID: BVI-9941-REVOKED`
  );
  const [isHighContrast, setIsHighContrast] = useState(false);

  // Text/Comms Ingestion State
  const [commsInput, setCommsInput] = useState(
    `From: David Vance <d.vance@apex-logistics.com>\nTo: Operations Desk <ops@apex-logistics.com>\nSubject: URGENT: Wire Tranche Instructions\nDate: Nov 10, 2024 09:15 EST\n\nSplit the Horizon transfer into increments just below 10k across today and tomorrow. Do not log this in the standard NetSuite ERP until the wire settles.`
  );

  // Audio Ingestion State
  const [audioFilename, setAudioFilename] = useState('INTERCEPT_WIRETAP_8901_01.wav');
  const [audioBitrate, setAudioBitrate] = useState('16-bit PCM @ 44.1 kHz Mono');
  const [audioTranscript, setAudioTranscript] = useState(
    `"David Vance: Just get it through in four separate pieces, okay? Nine nine hundred, nine eight fifty... Keep each under the ten thousand threshold so compliance automated trigger doesn't ping."`
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [pipelineLoadedMessage, setPipelineLoadedMessage] = useState<string | null>(null);

  // File upload simulation handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'TRANSACTIONS' | 'DOCUMENTS' | 'TEXT' | 'AUDIO') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    if (type === 'TRANSACTIONS') {
      reader.onload = (event) => {
        const text = event.target?.result as string;
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            setTxnJsonText(JSON.stringify(parsed, null, 2));
            setUploadedTxnCount(parsed.length);
            setTxnUploadSuccess(`Loaded ${parsed.length} transactions from ${file.name}`);
            setTimeout(() => setTxnUploadSuccess(null), 3500);
          }
        } catch {
          // If CSV, parse rows
          const lines = text.split('\n').filter(Boolean);
          setUploadedTxnCount(lines.length - 1);
          setTxnUploadSuccess(`Parsed CSV ledger: ${lines.length - 1} records from ${file.name}`);
          setTimeout(() => setTxnUploadSuccess(null), 3500);
        }
      };
      reader.readAsText(file);
    } else if (type === 'DOCUMENTS') {
      reader.onload = (event) => {
        setDocImagePreview(event.target?.result as string);
        setSelectedDocTitle(file.name);
        setDocOcrText(`[AUTO-OCR EXTRACTED FROM ${file.name}]\nDocument Type: Commercial Billing Record\nStated Total: $98,500.00\nChecksum: 0x992baf10c\nStatus: Pending Layout Despeckling & Font Forensics`);
      };
      reader.readAsDataURL(file);
    } else if (type === 'TEXT') {
      reader.onload = (event) => {
        setCommsInput(event.target?.result as string);
      };
      reader.readAsText(file);
    } else if (type === 'AUDIO') {
      setAudioFilename(file.name);
      setAudioBitrate(`${(file.size / 1024 / 1024).toFixed(2)} MB • Broadcast WAV`);
    }
  };

  const handleIngestAndProceed = () => {
    setIsProcessing(true);
    setPipelineLoadedMessage('Ingesting multimodal evidence into unified memory buffer...');

    setTimeout(() => {
      setIsProcessing(false);
      setPipelineLoadedMessage('Evidence ingested! Directing to Preprocessing & Feature Extraction...');
      setTimeout(() => {
        setPipelineLoadedMessage(null);
        onProceedToPreprocessing();
      }, 1000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] uppercase font-bold border border-amber-500/30">
                Pipeline Stage 1
              </span>
              <span className="text-xs text-slate-400">Target Entity:</span>
              <span className="text-xs font-bold text-slate-200">{currentCase.targetEntity}</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-6 h-6 text-amber-400" />
              Multimodal Data Ingestion Studio
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Ingest raw multi-channel evidentiary artifacts: financial transaction streams, scanned invoices & checks, corporate communications, and intercepted acoustic wiretaps.
            </p>
          </div>

          <button
            onClick={handleIngestAndProceed}
            disabled={isProcessing}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-60"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                <span>Buffering Raw Inputs...</span>
              </>
            ) : (
              <>
                <span>Commit & Proceed to Preprocessing</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {pipelineLoadedMessage && (
          <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/40 rounded-xl text-xs text-amber-300 flex items-center gap-2 animate-pulse">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{pipelineLoadedMessage}</span>
          </div>
        )}
      </div>

      {/* Channel Switcher Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveChannel('TRANSACTIONS')}
          className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${
            activeChannel === 'TRANSACTIONS'
              ? 'bg-amber-500/10 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-slate-800/80 text-amber-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">1. Transactions</div>
            <div className="text-[10px] text-slate-400">CSV, JSON Ledgers ({uploadedTxnCount} loaded)</div>
          </div>
        </button>

        <button
          onClick={() => setActiveChannel('DOCUMENTS')}
          className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${
            activeChannel === 'DOCUMENTS'
              ? 'bg-amber-500/10 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-slate-800/80 text-amber-400">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">2. Documents & Images</div>
            <div className="text-[10px] text-slate-400">Invoices, Checks (PDF / PNG)</div>
          </div>
        </button>

        <button
          onClick={() => setActiveChannel('TEXT')}
          className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${
            activeChannel === 'TEXT'
              ? 'bg-amber-500/10 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-slate-800/80 text-amber-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">3. Text & Comms</div>
            <div className="text-[10px] text-slate-400">Emails, Chat Logs (.eml, .txt)</div>
          </div>
        </button>

        <button
          onClick={() => setActiveChannel('AUDIO')}
          className={`p-4 rounded-xl border text-left transition flex items-center gap-3 ${
            activeChannel === 'AUDIO'
              ? 'bg-amber-500/10 border-amber-400 text-amber-300 ring-1 ring-amber-400/50'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
          }`}
        >
          <div className="p-2.5 rounded-lg bg-slate-800/80 text-amber-400">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">4. Audio Wiretaps</div>
            <div className="text-[10px] text-slate-400">Acoustic Intercepts (.wav, .mp3)</div>
          </div>
        </button>
      </div>

      {/* Main Channel Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Channel 1: Transactions */}
        {activeChannel === 'TRANSACTIONS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-amber-400" />
                  Transaction Ledger Stream Ingestion
                </h3>
                <p className="text-xs text-slate-400">
                  Accepts banking statements, SWIFT MT103 records, Fedwire messages, and crypto hot wallet transactions.
                </p>
              </div>

              {/* Upload Dropzone Button */}
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload CSV / JSON Ledger</span>
                <input
                  type="file"
                  accept=".csv,.json"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'TRANSACTIONS')}
                />
              </label>
            </div>

            {txnUploadSuccess && (
              <div className="p-2.5 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{txnUploadSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span>Raw Transaction Schema (JSON/CSV):</span>
                  <span className="text-[11px] font-mono text-amber-400">Structured Buffer</span>
                </div>
                <textarea
                  value={txnJsonText}
                  onChange={(e) => setTxnJsonText(e.target.value)}
                  rows={14}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-3">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Parsed In-Memory Ledger Preview:</span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {currentCase.transactionAnalysis.transactions.length} Active Records
                  </span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden max-h-[310px] overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 text-[10px] uppercase font-mono sticky top-0">
                      <tr>
                        <th className="p-2.5">Tx ID</th>
                        <th className="p-2.5">Amount</th>
                        <th className="p-2.5">Channel</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {currentCase.transactionAnalysis.transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-slate-900/40">
                          <td className="p-2.5 text-amber-300">{tx.id}</td>
                          <td className="p-2.5 text-slate-100 font-bold">
                            ${tx.amount.toLocaleString()} {tx.currency}
                          </td>
                          <td className="p-2.5 text-slate-400">{tx.channel}</td>
                          <td className="p-2.5">
                            {tx.flagged ? (
                              <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px]">
                                {tx.anomalyType || 'FLAGGED'}
                              </span>
                            ) : (
                              <span className="text-emerald-400 text-[10px]">NORMAL</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Channel 2: Documents & Images */}
        {activeChannel === 'DOCUMENTS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  Document & Image OCR Ingestion
                </h3>
                <p className="text-xs text-slate-400">
                  Ingests commercial invoices, bills of lading, corporate checks, and tax documentation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsHighContrast((prev) => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs border transition ${
                    isHighContrast
                      ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {isHighContrast ? 'Inverted High-Contrast' : 'Standard Contrast'}
                </button>

                <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium cursor-pointer transition">
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>Upload Image / PDF</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'DOCUMENTS')}
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Document Image Visualizer */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold text-slate-200">{selectedDocTitle}</span>
                  <span className="text-[10px] font-mono text-amber-400">300 DPI High-Res</span>
                </div>
                <div className={`relative h-64 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center bg-slate-900 ${
                  isHighContrast ? 'invert contrast-125' : ''
                }`}>
                  {docImagePreview ? (
                    <img
                      src={docImagePreview}
                      alt="Uploaded Document"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-500 text-xs">No document loaded</div>
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-1 bg-slate-950/80 rounded border border-slate-700 text-[10px] text-amber-300 font-mono">
                    OCR Confidence: 96.4%
                  </div>
                </div>
              </div>

              {/* OCR Text Extracted */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Extracted OCR Tokens:</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Tesseract / Gemini Vision</span>
                </div>
                <textarea
                  value={docOcrText}
                  onChange={(e) => setDocOcrText(e.target.value)}
                  rows={11}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* Channel 3: Text & Comms */}
        {activeChannel === 'TEXT' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  Communications & Email Ingestion
                </h3>
                <p className="text-xs text-slate-400">
                  Ingests corporate email threads (.eml), encrypted Slack/Signal chat transcripts, and wire routing instructions.
                </p>
              </div>

              <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload Comms File (.eml, .txt)</span>
                <input
                  type="file"
                  accept=".txt,.eml,.json"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'TEXT')}
                />
              </label>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Raw Communication Transcript:</span>
                <span className="text-[11px] font-mono text-amber-400">Entity Disguise Filter Active</span>
              </div>
              <textarea
                value={commsInput}
                onChange={(e) => setCommsInput(e.target.value)}
                rows={10}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-400 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Channel 4: Audio Wiretaps */}
        {activeChannel === 'AUDIO' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-amber-400" />
                  Acoustic Surveillance & Wiretap Ingestion
                </h3>
                <p className="text-xs text-slate-400">
                  Ingests Title III judicial wiretap recordings, VoIP telephone intercepts, and executive voicemails.
                </p>
              </div>

              <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium cursor-pointer transition">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>Upload Audio (.wav, .mp3)</span>
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'AUDIO')}
                />
              </label>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Headphones className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-slate-200">{audioFilename}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{audioBitrate}</span>
              </div>

              {/* Waveform graphic placeholder */}
              <div className="h-16 bg-slate-900 rounded-lg border border-slate-800 p-2 flex items-center justify-between gap-1 overflow-hidden">
                {Array.from({ length: 48 }).map((_, i) => {
                  const h = Math.sin(i * 0.4) * 20 + 26;
                  return (
                    <div
                      key={i}
                      className="w-1.5 rounded-full bg-amber-500/70"
                      style={{ height: `${h}px` }}
                    />
                  );
                })}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Synchronized Transcription Log:
                </label>
                <textarea
                  value={audioTranscript}
                  onChange={(e) => setAudioTranscript(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
