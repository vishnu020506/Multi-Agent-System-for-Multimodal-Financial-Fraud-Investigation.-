import React from 'react';
import { X, Keyboard, Command, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const shortcutGroups = [
    {
      title: 'Global Navigation & Command Center',
      shortcuts: [
        { key: '⌘ K / Ctrl + K', description: 'Open Command Palette & Global Search' },
        { key: '?', description: 'Toggle Keyboard Shortcuts Modal' },
        { key: 'Esc', description: 'Close any active modal, drawer, or dialog' },
        { key: '⌘ P / Ctrl + P', description: 'Open Printable SAR Form 111 Dossier' },
      ],
    },
    {
      title: 'Forensic Case & Pipeline Controls',
      shortcuts: [
        { key: '[ / ]', description: 'Previous / Next Investigation Dossier' },
        { key: 'R', description: 'Trigger Multimodal Multi-Agent Investigation' },
        { key: 'C', description: 'Toggle Forensic AI Copilot Drawer' },
        { key: 'N', description: 'Open Data Ingestion & New Case Studio' },
      ],
    },
    {
      title: 'Direct Modality Jumps',
      shortcuts: [
        { key: '1', description: 'Jump to Executive Dashboard Dossier' },
        { key: '2', description: 'Jump to Transactions (BSA § 5324)' },
        { key: '3', description: 'Jump to Image & Document OCR Forensics' },
        { key: '4', description: 'Jump to Entity Resolution Graph Network' },
        { key: '5', description: 'Jump to Audio & Wiretap Forensics' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Forensic Platform Keyboard Shortcuts</h3>
              <p className="text-xs text-slate-400">Developer-grade navigation and telemetry hotkeys</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {shortcutGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-[11px] font-mono uppercase font-bold text-amber-400 tracking-wider mb-2.5">
                {group.title}
              </h4>
              <div className="space-y-2">
                {group.shortcuts.map((sc) => (
                  <div
                    key={sc.key}
                    className="flex items-center justify-between py-1.5 px-3 rounded-lg bg-slate-950/50 border border-slate-800/80 text-xs"
                  >
                    <span className="text-slate-300">{sc.description}</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-amber-300 font-mono text-[11px] font-semibold shadow-xs">
                      {sc.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-200 font-mono">?</kbd> at any time to reopen</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
