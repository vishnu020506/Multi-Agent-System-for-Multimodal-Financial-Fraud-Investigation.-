import React, { useState } from 'react';
import { 
  MessageSquare, 
  AlertTriangle, 
  Flame, 
  ShieldAlert, 
  Send, 
  Search, 
  User, 
  Clock,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { TextAnalysis, TextCommunicationItem } from '../types';

interface TextAgentViewProps {
  analysis: TextAnalysis;
}

export const TextAgentView: React.FC<TextAgentViewProps> = ({ analysis }) => {
  const [selectedMessageId, setSelectedMessageId] = useState<string>(
    analysis.communications[0]?.id || ''
  );
  const [filterChannel, setFilterChannel] = useState<'ALL' | 'EMAIL' | 'INTERNAL_CHAT'>('ALL');

  const filteredCommunications = analysis.communications.filter((msg) => {
    if (filterChannel === 'ALL') return true;
    return msg.channel === filterChannel;
  });

  const activeMsg = 
    analysis.communications.find((m) => m.id === selectedMessageId) || 
    analysis.communications[0];

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'AGGRESSIVE':
        return 'bg-rose-950 text-rose-300 border-rose-800';
      case 'URGENT':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      case 'EVASIVE':
        return 'bg-yellow-950 text-yellow-300 border-yellow-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  // Highlights keywords inside body text
  const renderHighlightedBody = (body: string, keywords: string[]) => {
    if (!keywords || keywords.length === 0) return body;
    let parts: { text: string; isHighlight: boolean }[] = [{ text: body, isHighlight: false }];

    keywords.forEach((keyword) => {
      const newParts: { text: string; isHighlight: boolean }[] = [];
      parts.forEach((part) => {
        if (part.isHighlight) {
          newParts.push(part);
          return;
        }
        const regex = new RegExp(`(${keyword})`, 'gi');
        const splits = part.text.split(regex);
        splits.forEach((split) => {
          if (split.toLowerCase() === keyword.toLowerCase()) {
            newParts.push({ text: split, isHighlight: true });
          } else if (split.length > 0) {
            newParts.push({ text: split, isHighlight: false });
          }
        });
      });
      parts = newParts;
    });

    return parts.map((p, idx) =>
      p.isHighlight ? (
        <mark
          key={idx}
          className="bg-amber-400/30 text-amber-200 border-b-2 border-amber-400 px-1 py-0.5 rounded font-semibold"
        >
          {p.text}
        </mark>
      ) : (
        <span key={idx}>{p.text}</span>
      )
    );
  };

  return (
    <div id="text-agent-view" className="space-y-6">
      {/* Top Banner: Agent Intelligence Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Text AI Agent (NLP Forensics)</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                  Agent Status: {analysis.agentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Performs semantic text classification, coercion detection, kickback keyword extraction, and sentiment scoring.
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

        {/* Metric Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Coercion / Urgency Score</div>
            <div className={`text-base font-bold font-mono ${analysis.urgencyScore >= 70 ? 'text-rose-400' : 'text-slate-200'}`}>
              {analysis.urgencyScore}/100
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Suspicious Triggers Found</div>
            <div className="text-base font-bold text-amber-400 font-mono">
              {analysis.suspiciousKeywordsCount} keyword matches
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Collusion Indicators</div>
            <div className="text-base font-bold text-purple-400 font-mono">
              {analysis.collusionIndicators.length} Signature(s)
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Communication Logs</div>
            <div className="text-base font-bold text-slate-200 font-mono">
              {analysis.communications.length} Messages
            </div>
          </div>
        </div>
      </div>

      {/* NLP Summary & Collusion Markers */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <span>NLP Semantic Intelligence Synthesis</span>
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-800">
          {analysis.nlpSummary}
        </p>

        {analysis.collusionIndicators.length > 0 && (
          <div className="mt-3">
            <div className="text-[11px] font-bold uppercase text-slate-400 mb-1.5">
              Key Collusion Signatures:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {analysis.collusionIndicators.map((col, idx) => (
                <div key={idx} className="p-2.5 rounded bg-rose-950/30 border border-rose-800/60 text-[11px] text-rose-200">
                  <span className="font-mono text-rose-400 font-bold mr-1.5">#{idx + 1}</span>
                  {col}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace: Communications List + Detail Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Message Feed Sidebar */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Communication Transcripts
            </h3>
            <div className="flex rounded bg-slate-950 p-0.5 border border-slate-800 text-[11px]">
              <button
                id="filter-chat-all"
                onClick={() => setFilterChannel('ALL')}
                className={`px-2 py-0.5 rounded ${filterChannel === 'ALL' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              >
                All
              </button>
              <button
                id="filter-chat-chat"
                onClick={() => setFilterChannel('INTERNAL_CHAT')}
                className={`px-2 py-0.5 rounded ${filterChannel === 'INTERNAL_CHAT' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              >
                Chat
              </button>
              <button
                id="filter-chat-email"
                onClick={() => setFilterChannel('EMAIL')}
                className={`px-2 py-0.5 rounded ${filterChannel === 'EMAIL' ? 'bg-slate-800 text-white' : 'text-slate-400'}`}
              >
                Email
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {filteredCommunications.map((msg) => {
              const isSelected = msg.id === activeMsg.id;
              return (
                <button
                  key={msg.id}
                  id={`msg-select-${msg.id}`}
                  onClick={() => setSelectedMessageId(msg.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-purple-400/80 shadow-md ring-1 ring-purple-400/30 text-white'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300">
                      {msg.channel.replace('_', ' ')}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${getSentimentBadge(msg.nlpFlags.sentiment)}`}>
                      {msg.nlpFlags.sentiment}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-white mb-0.5 line-clamp-1">
                    {msg.from} → {msg.to}
                  </div>
                  {msg.subject && (
                    <div className="text-[11px] text-amber-300 font-medium line-clamp-1 mb-1">
                      {msg.subject}
                    </div>
                  )}
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {msg.body}
                  </p>

                  <div className="mt-2 pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{msg.timestamp}</span>
                    {msg.nlpFlags.coercionDetected && (
                      <span className="text-rose-400 font-bold uppercase flex items-center gap-0.5">
                        <Flame className="w-3 h-3" /> Coercion
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Message Deep NLP View */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-xs font-mono text-slate-400">Transcript Record #{activeMsg.id}</span>
                <h4 className="text-sm font-bold text-white">
                  {activeMsg.subject || 'Direct Messaging Session'}
                </h4>
              </div>

              <div className="flex items-center gap-2">
                <span className={`text-xs px-2.5 py-1 rounded font-bold uppercase border ${getSentimentBadge(activeMsg.nlpFlags.sentiment)}`}>
                  Sentiment: {activeMsg.nlpFlags.sentiment}
                </span>
              </div>
            </div>

            {/* Metadata Header */}
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1.5 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-400">From:</span>
                <span className="font-semibold text-white">{activeMsg.from}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">To:</span>
                <span className="font-semibold text-white">{activeMsg.to}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="font-mono text-slate-300">{activeMsg.timestamp}</span>
              </div>
            </div>

            {/* Full Body with NLP Highlighting */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs leading-relaxed text-slate-200 whitespace-pre-wrap font-sans">
              {renderHighlightedBody(activeMsg.body, activeMsg.highlightedKeywords)}
            </div>

            {/* NLP Discovered Triggers Callout */}
            {activeMsg.highlightedKeywords.length > 0 && (
              <div className="mt-4 p-3 bg-amber-950/30 border border-amber-800/60 rounded-lg text-xs">
                <div className="font-bold text-amber-300 uppercase tracking-wider mb-1.5 text-[11px] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>NLP Extracted Regulatory Evasion Triggers</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {activeMsg.highlightedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-700/80 font-mono text-[11px]"
                    >
                      "{kw}"
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
