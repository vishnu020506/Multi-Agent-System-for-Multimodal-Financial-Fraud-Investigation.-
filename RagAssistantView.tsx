import React, { useState } from 'react';
import { 
  Bot, 
  Search, 
  Send, 
  FileText, 
  Sparkles, 
  Database, 
  CheckCircle2, 
  ExternalLink, 
  Layers, 
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Headphones,
  Share2
} from 'lucide-react';
import { InvestigationCase, RagDocumentChunk } from '../types';

interface RagAssistantViewProps {
  currentCase: InvestigationCase;
}

interface ChatMessage {
  id: string;
  sender: 'INVESTIGATOR' | 'RAG_AI';
  text: string;
  timestamp: string;
  citedChunks?: RagDocumentChunk[];
}

export const RagAssistantView: React.FC<RagAssistantViewProps> = ({ currentCase }) => {
  // Pre-indexed RAG vector chunks for this case
  const defaultChunks: RagDocumentChunk[] = [
    {
      id: 'CHUNK-01',
      documentTitle: 'Commercial Billing Invoice #INV-2024-8841.pdf',
      sourceType: 'INVOICE',
      chunkText:
        'Line Items: Deep-Sea Freight Brokerage ($29,700.00). Subtotal: $29,700.00. Total Due: $98,500.00. Mathematical discrepancy of +$68,800 unexplained surplus over itemized billing. Stamped by David Vance (VP Operations).',
      tokenCount: 42,
      cosineSimilarity: 0.942,
      pageNumber: 1,
      metadataTags: ['INVOICE', 'MATH_DISCREPANCY', 'APEX_LOGISTICS'],
      relevanceScore: 94,
    },
    {
      id: 'CHUNK-02',
      documentTitle: 'SWIFT MT103 Wire Clearing Batch #8901.json',
      sourceType: 'STATEMENT',
      chunkText:
        'Batch of 4 outbound wires: TX-8901-01 ($9,900), TX-8901-02 ($9,850), TX-8901-03 ($9,950), TX-8901-04 ($9,750). All ordered within 4 hours to beneficiary Horizon BVI Ventures Account #BVI-4491-HORIZ.',
      tokenCount: 48,
      cosineSimilarity: 0.918,
      pageNumber: 1,
      metadataTags: ['SWIFT', 'STRUCTURING', 'CTR_EVASION'],
      relevanceScore: 92,
    },
    {
      id: 'CHUNK-03',
      documentTitle: 'Email Archive: David Vance to Ops Desk.eml',
      sourceType: 'COMMUNICATION',
      chunkText:
        '"Please split today\'s vendor wire into 4 separate tranches under $10,000 so the bank doesn\'t flag automated currency transaction reports. This is board authorized. Do not enter into NetSuite yet."',
      tokenCount: 39,
      cosineSimilarity: 0.895,
      pageNumber: 1,
      metadataTags: ['EMAIL', 'COERCIVE_INTENT', 'CTR_DISGUISE'],
      relevanceScore: 90,
    },
    {
      id: 'CHUNK-04',
      documentTitle: 'Title III Judicial Wiretap REC-8901-01.wav',
      sourceType: 'WIRETAP',
      chunkText:
        'Speaker Diarization [Turn 02]: "David Vance: Just get it through in four separate pieces, okay? Nine nine hundred, nine eight fifty... Keep each under the ten thousand threshold so compliance automated trigger doesn\'t ping."',
      tokenCount: 38,
      cosineSimilarity: 0.884,
      pageNumber: 1,
      metadataTags: ['WIRETAP', 'VOICE_STRESS_89', 'VERBAL_STRUCTURING'],
      relevanceScore: 88,
    },
    {
      id: 'CHUNK-05',
      documentTitle: 'BVI Corporate Registry Entity Filings #BVI-99214.pdf',
      sourceType: 'REGISTRY',
      chunkText:
        'Horizon BVI Ventures registered in Road Town, Tortola. Tax ID: BVI-99214-REVOKED. Registered agent is a nominee service with no active physical office or disclosed beneficial owners.',
      tokenCount: 34,
      cosineSimilarity: 0.862,
      pageNumber: 1,
      metadataTags: ['REGISTRY', 'SHELL_COMPANY', 'SECRECY_HAVEN'],
      relevanceScore: 86,
    },
  ];

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-01',
      sender: 'RAG_AI',
      text: `Hello Investigator. I am the RAG-Powered Forensic Investigation Assistant. I have indexed ${defaultChunks.length} evidentiary documents, banking slips, wiretap transcripts, and registry filings for case ${currentCase.id}. How can I assist your case inquiry?`,
      timestamp: '10:00 AM',
    },
  ]);

  const [isSearching, setIsSearching] = useState(false);

  const handleSend = (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'INVESTIGATOR',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsSearching(true);

    setTimeout(() => {
      let reply = '';
      let cited: RagDocumentChunk[] = [];
      const lower = q.toLowerCase();

      if (lower.includes('why') || lower.includes('high risk') || lower.includes('classified')) {
        reply = `Case ${currentCase.id} was classified as **Critical Fraud Risk (94/100)** because the target entity (${currentCase.targetEntity}) executed four structured wire transfers averaging $9,862.50 to intentionally evade the $10,000 BSA threshold, directly corroborated by a +$70,900 mathematical surplus on invoice #INV-2024-8841 and executive wiretap recordings confirming verbal structuring directives.`;
        cited = [defaultChunks[0], defaultChunks[1], defaultChunks[3]];
      } else if (lower.includes('evidence') || lower.includes('show')) {
        reply = `The evidentiary locker contains 5 cryptographically indexed artifacts spanning 4 modalities: (1) Tampered Invoice #INV-2024-8841 with altered font and math surplus, (2) SWIFT MT103 batch logs showing 4 structured wires, (3) Internal email threads ordering off-book structuring, and (4) Title III Wiretap REC-8901-01 capturing verbal structuring orders with an 89/100 voice stress index.`;
        cited = [defaultChunks[0], defaultChunks[1], defaultChunks[2], defaultChunks[3]];
      } else if (lower.includes('account') || lower.includes('connected') || lower.includes('network')) {
        reply = `The graph topology reveals an offshore layering syndicate connecting: **Account A: Apex Logistics (US-8821)** ➔ **Account B: Horizon BVI Ventures (BVI-4491)** ➔ **Account C: Titan Offshore Consulting (BVI-9921)** ➔ **Suspicious Wire TX-8901-04 ($9,940)**. The registry filing confirms Horizon BVI is an offshore shell with a revoked corporate license.`;
        cited = [defaultChunks[1], defaultChunks[4]];
      } else if (lower.includes('summarize') || lower.includes('report') || lower.includes('investigation')) {
        reply = `Executive Summary for **${currentCase.id}**: High-probability trade-based money laundering ring involving $98,500.00 USD in structured capital flight. Corroborated across OCR math audit, SWIFT velocity bursts, email intent analysis, and biometric voice analysis. Immediate mandatory FinCEN Form 111 SAR filing is recommended.`;
        cited = [defaultChunks[0], defaultChunks[1], defaultChunks[3]];
      } else {
        reply = `Based on semantic retrieval from the case vector index, the evidentiary items confirm deliberate currency transaction report avoidance under 31 U.S.C. § 5324. Four wire payments totaling $39,450 were structured within 4 hours to beneficiary Horizon BVI, supported by tampered commercial documentation.`;
        cited = [defaultChunks[0], defaultChunks[1]];
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'RAG_AI',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citedChunks: cited,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsSearching(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl text-purple-400">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] uppercase font-bold border border-purple-500/30">
                  RAG Vector Search
                </span>
                <span className="text-xs text-slate-400">Retrieval-Augmented Generation Evidence Assistant</span>
              </div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                RAG Evidence Search & AI Investigation Assistant
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                Indexes bank statements, invoices, email comms, and wiretap transcripts into dense vector embeddings. Investigators can query the case and receive answers backed by cited evidence chunks.
              </p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-purple-500/30 text-xs text-purple-300 font-mono">
            Cosine Similarity Threshold: &gt; 0.85
          </div>
        </div>
      </div>

      {/* RAG Pipeline Stepper Bar */}
      <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between overflow-x-auto text-[11px] font-mono text-slate-400 gap-2">
        <span className="text-slate-200 font-bold">RAG Architecture:</span>
        <span className="text-purple-400">1. Case Documents</span>
        <span>➔</span>
        <span className="text-purple-400">2. Text Extraction</span>
        <span>➔</span>
        <span className="text-purple-400">3. Semantic Chunking</span>
        <span>➔</span>
        <span className="text-purple-400">4. Dense Embeddings</span>
        <span>➔</span>
        <span className="text-purple-400">5. Vector DB Index</span>
        <span>➔</span>
        <span className="text-emerald-400 font-bold">6. Investigation Assistant</span>
      </div>

      {/* Chat & Evidence Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Chatbot Interface */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[560px]">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'INVESTIGATOR' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'RAG_AI' && (
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    m.sender === 'INVESTIGATOR'
                      ? 'bg-amber-500 text-slate-950 font-medium'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 space-y-2'
                  }`}
                >
                  <div className="font-sans">{m.text}</div>

                  {/* Render Cited RAG Chunks */}
                  {m.citedChunks && m.citedChunks.length > 0 && (
                    <div className="pt-2 border-t border-slate-800 space-y-1.5">
                      <div className="text-[10px] font-mono text-purple-400 font-bold uppercase flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Retrieved Evidentiary Citations ({m.citedChunks.length}):</span>
                      </div>
                      {m.citedChunks.map((chunk) => (
                        <div
                          key={chunk.id}
                          className="p-2 rounded bg-slate-900 border border-purple-900/50 text-[10px] font-mono text-slate-300 space-y-0.5"
                        >
                          <div className="flex items-center justify-between text-purple-300 font-bold">
                            <span>{chunk.documentTitle}</span>
                            <span className="text-emerald-400">Sim: {chunk.cosineSimilarity}</span>
                          </div>
                          <div className="text-slate-400 truncate">{chunk.chunkText}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className={`text-[9px] font-mono ${m.sender === 'INVESTIGATOR' ? 'text-slate-800' : 'text-slate-500'}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            ))}
            {isSearching && (
              <div className="flex items-center gap-2 text-xs text-purple-400 p-2">
                <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                <span>Searching vector index & synthesizing RAG response...</span>
              </div>
            )}
          </div>

          {/* Quick Prompt Pills */}
          <div className="py-2 flex items-center gap-1.5 overflow-x-auto text-[10px]">
            <span className="text-slate-400 font-bold shrink-0">Prompts:</span>
            {[
              'Why was this transaction classified as high risk?',
              'Show the evidence for this case',
              'Which accounts are connected?',
              'Summarize this investigation',
            ].map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 whitespace-nowrap transition"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="pt-2 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask anything about this case evidence, accounts, or OCR data..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-purple-400 font-sans"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || isSearching}
              className="p-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl transition disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Vector Index Chunks Browser */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Indexed Evidence Vector Chunks ({defaultChunks.length})
              </h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">FAISS / HNSW Ready</span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {defaultChunks.map((chunk) => (
              <div
                key={chunk.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 truncate">
                    {chunk.sourceType === 'INVOICE' && <FileText className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    {chunk.sourceType === 'STATEMENT' && <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    {chunk.sourceType === 'COMMUNICATION' && <FileText className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                    {chunk.sourceType === 'WIRETAP' && <Headphones className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    {chunk.sourceType === 'REGISTRY' && <Share2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />}
                    <span className="truncate">{chunk.documentTitle}</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-400 font-bold">
                    Sim: {chunk.cosineSimilarity}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sans line-clamp-3">
                  {chunk.chunkText}
                </p>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-500">
                  <span>Tokens: {chunk.tokenCount}</span>
                  <div className="flex gap-1">
                    {chunk.metadataTags.map((tag, i) => (
                      <span key={i} className="px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
