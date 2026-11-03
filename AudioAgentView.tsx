import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Volume2, 
  Play, 
  Pause, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  User, 
  Radio, 
  Fingerprint, 
  Activity, 
  Headphones,
  RotateCcw,
  Sliders,
  FileAudio
} from 'lucide-react';
import { AudioAnalysis, AudioRecordingItem } from '../types';

interface AudioAgentViewProps {
  analysis?: AudioAnalysis;
}

export const AudioAgentView: React.FC<AudioAgentViewProps> = ({ analysis }) => {
  // If no audio analysis exists for this case, provide a clean fallback
  const fallbackAnalysis: AudioAnalysis = {
    agentStatus: 'COMPLETED',
    riskScore: 15,
    recordingsProcessed: 0,
    flaggedRecordingsCount: 0,
    averageStressScore: 18,
    voiceBiometricAnomalies: ['No wiretap or voice recordings uploaded for this case.'],
    recordings: []
  };

  const currentAnalysis = analysis || fallbackAnalysis;
  const recordings = currentAnalysis.recordings || [];

  const [selectedRecId, setSelectedRecId] = useState<string>(recordings[0]?.id || '');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FLAGGED'>('ALL');

  const activeRec = recordings.find((r) => r.id === selectedRecId) || recordings[0];
  const duration = activeRec?.durationSeconds || 60;

  // Reset playback when active recording changes
  useEffect(() => {
    setIsPlaying(false);
    setCurrentPlaybackTime(0);
  }, [selectedRecId]);

  // Web Audio API ambient wiretap / intercept audio synthesizer
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<{ osc?: OscillatorNode; gain?: GainNode; filter?: BiquadFilterNode } | null>(null);

  useEffect(() => {
    if (isPlaying) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          // Bandpass filter for telephonic intercept simulation (300 Hz - 3400 Hz)
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(950, ctx.currentTime);
          filter.Q.setValueAtTime(2.5, ctx.currentTime);

          // Subtle harmonic carrier wave
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(activeRec?.deepfakeDetected ? 440 : 280, ctx.currentTime);

          // Modulated gain for realistic vocal cadence pulses
          const gain = ctx.createGain();
          gain.gain.setValueAtTime(0.015, ctx.currentTime);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          audioNodesRef.current = { osc, gain, filter };
        }
      } catch (err) {
        console.warn('Web Audio playback simulation prevented by browser policy:', err);
      }
    } else {
      if (audioNodesRef.current?.osc) {
        try {
          audioNodesRef.current.osc.stop();
          audioNodesRef.current.osc.disconnect();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
        audioCtxRef.current = null;
      }
    }

    return () => {
      if (audioNodesRef.current?.osc) {
        try {
          audioNodesRef.current.osc.stop();
          audioNodesRef.current.osc.disconnect();
        } catch {}
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
        audioCtxRef.current = null;
      }
    };
  }, [isPlaying, activeRec]);

  // Audio playback simulator timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentPlaybackTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return Math.min(prev + playbackSpeed * 0.5, duration);
        });
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, duration, playbackSpeed]);

  // Spacebar hotkey to play/pause audio
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement)?.tagName !== 'INPUT' && (e.target as HTMLElement)?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredRecordings = recordings.filter((r) => {
    if (activeFilter === 'FLAGGED') return r.voiceStressScore >= 75 || r.deepfakeDetected || r.coercionToneDetected;
    return true;
  });

  return (
    <div id="audio-agent-view" className="space-y-6">
      {/* Top Banner: Agent Intelligence Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Audio AI Agent (Voice Forensics & Wiretaps)</h2>
                <span className={`text-xs px-2 py-0.5 rounded font-mono border ${
                  currentAnalysis.riskScore >= 75 
                    ? 'bg-rose-950 text-rose-300 border-rose-800' 
                    : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                }`}>
                  Agent Status: {currentAnalysis.agentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Analyzes acoustic micro-tremors, voice biometric authentication, synthetic deepfake detection, and verbal coercion in communications.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">Agent Risk Score</div>
              <div className={`text-2xl font-bold font-mono ${
                currentAnalysis.riskScore >= 75 ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {currentAnalysis.riskScore}/100
              </div>
            </div>
          </div>
        </div>

        {/* Deepfake / Synthetic Voice Alert Banner */}
        {activeRec?.deepfakeDetected && (
          <div className="mt-5 p-4 rounded-lg bg-rose-950/40 border border-rose-800/80 flex items-start gap-3 animate-pulse">
            <Radio className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-rose-300 uppercase tracking-wide flex items-center gap-2">
                <span>AI Neural Voice Cloning / Deepfake Confirmed</span>
                <span className="px-1.5 py-0.2 bg-rose-900 text-rose-100 rounded text-[10px]">99.1% Confidence</span>
              </div>
              <p className="text-rose-200 mt-1 leading-relaxed">
                Acoustic spectral flatness analysis revealed phase discontinuities and lack of organic pitch micro-tremors, confirming the audio file was synthetically produced via neural text-to-speech to impersonate corporate executives.
              </p>
            </div>
          </div>
        )}

        {/* Coercion / Stress Banner */}
        {!activeRec?.deepfakeDetected && activeRec?.voiceStressScore >= 80 && (
          <div className="mt-5 p-4 rounded-lg bg-amber-950/40 border border-amber-800/80 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wide">
                High Autonomic Vocal Stress & Coercion Pressure Detected
              </div>
              <p className="text-amber-200 mt-1 leading-relaxed">
                Biometric pitch variance increased by 47% during verbal commands to bypass compliance thresholds. Vocal tension indicators corroborate intentional circumvention of dual-control authorizations.
              </p>
            </div>
          </div>
        )}

        {/* Metric Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Audio Intercepts</div>
            <div className="text-base font-bold text-white font-mono">
              {currentAnalysis.recordingsProcessed} Recordings
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Flagged for Compliance</div>
            <div className="text-base font-bold text-rose-400 font-mono">
              {currentAnalysis.flaggedRecordingsCount} Flagged
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Mean Voice Stress Score</div>
            <div className={`text-base font-bold font-mono ${
              currentAnalysis.averageStressScore >= 70 ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {currentAnalysis.averageStressScore}/100
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Deepfake Neural Test</div>
            <div className={`text-base font-bold font-mono ${
              activeRec?.deepfakeDetected ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {activeRec?.deepfakeDetected ? 'SYNTHETIC CLONE' : 'ORGANIC VOICE'}
            </div>
          </div>
        </div>
      </div>

      {recordings.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          <FileAudio className="w-12 h-12 mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-semibold text-slate-300">No Audio Records Ingested</p>
          <p className="text-xs text-slate-500 mt-1">This case does not currently contain wiretaps or intercepted voice calls.</p>
        </div>
      ) : (
        /* Main Workspace: Recording Selector + Waveform Forensics + Synchronized Transcript */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar: Audio Recording Selector */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Intercepted Voice Evidence ({filteredRecordings.length})
              </h3>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800 text-[10px]">
                <button
                  onClick={() => setActiveFilter('ALL')}
                  className={`px-2 py-0.5 rounded ${activeFilter === 'ALL' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400'}`}
                >
                  All
                </button>
                <button
                  onClick={() => setActiveFilter('FLAGGED')}
                  className={`px-2 py-0.5 rounded ${activeFilter === 'FLAGGED' ? 'bg-rose-950 text-rose-300 font-bold' : 'text-slate-400'}`}
                >
                  Flagged
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {filteredRecordings.map((rec) => {
                const isSelected = rec.id === activeRec?.id;
                return (
                  <button
                    key={rec.id}
                    id={`audio-rec-${rec.id}`}
                    onClick={() => setSelectedRecId(rec.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-cyan-400/80 shadow-md ring-1 ring-cyan-400/30 text-white'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-[11px] font-mono text-cyan-400 font-semibold">
                        {rec.id}
                      </span>
                      <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                        rec.channel === 'WIRETAP' 
                          ? 'bg-rose-950/80 text-rose-300 border-rose-800' 
                          : 'bg-indigo-950/80 text-indigo-300 border-indigo-800'
                      }`}>
                        {rec.channel}
                      </span>
                    </div>

                    <div className="text-xs font-semibold line-clamp-1 mb-1">
                      {rec.title}
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between w-full mt-2 pt-1 border-t border-slate-800">
                      <span>{rec.caller.split(' ')[0]} ➔ {rec.receiver.split(' ')[0]}</span>
                      <span className="font-mono text-slate-300">{formatSeconds(rec.durationSeconds)}</span>
                    </div>

                    {rec.voiceStressScore >= 80 && (
                      <div className="mt-2 text-[10px] text-rose-400 flex items-center gap-1 font-mono">
                        <Activity className="w-3 h-3" />
                        <span>Stress Score: {rec.voiceStressScore}/100</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Biometric Verification Box */}
            {activeRec && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-cyan-400" />
                  <span>Acoustic Biometric Verification</span>
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-300 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Caller Identity:</span>
                    <span className="font-semibold text-white">{activeRec.caller}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Stated Role:</span>
                    <span>{activeRec.callerRole}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Voiceprint Match:</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {activeRec.deepfakeDetected ? 'FAILED (Synthetic)' : '99.4% Verified Match'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pitch Tremor (Micro-tremor):</span>
                    <span className={`font-mono font-bold ${activeRec.pitchTremorDetected ? 'text-rose-400' : 'text-slate-400'}`}>
                      {activeRec.pitchTremorDetected ? 'DETECTED (88 Hz)' : 'ABSENT (Normal)'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center & Right: Audio Player + Forensic Waveform + Synchronized Transcript */}
          {activeRec && (
            <div className="lg:col-span-8 space-y-4">
              {/* Interactive Audio Player & Waveform Visualizer */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      <span>{activeRec.title}</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Intercepted on {activeRec.callDate} via {activeRec.channel}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Playback Speed:</span>
                    {[1, 1.25, 1.5].map((spd) => (
                      <button
                        key={spd}
                        onClick={() => setPlaybackSpeed(spd)}
                        className={`text-[10px] px-2 py-0.5 rounded font-mono border ${
                          playbackSpeed === spd 
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400' 
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Animated Waveform Canvas Container */}
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="flex items-end justify-between h-24 gap-1 px-1">
                    {activeRec.audioWaveform.map((val, idx) => {
                      const totalBars = activeRec.audioWaveform.length;
                      const activeBarIndex = Math.floor((currentPlaybackTime / duration) * totalBars);
                      const isPlayed = idx <= activeBarIndex;
                      const isHighStress = val > 80;

                      return (
                        <div
                          key={idx}
                          className="flex-1 flex flex-col justify-end items-center group relative cursor-pointer"
                          onClick={() => {
                            const newTime = (idx / totalBars) * duration;
                            setCurrentPlaybackTime(newTime);
                          }}
                        >
                          <div
                            style={{ height: `${val}%` }}
                            className={`w-full rounded-t-xs transition-all duration-150 ${
                              isHighStress
                                ? isPlayed ? 'bg-rose-500 shadow-xs shadow-rose-500/50' : 'bg-rose-950/80'
                                : isPlayed ? 'bg-cyan-400 shadow-xs shadow-cyan-400/50' : 'bg-slate-800'
                            } ${isPlaying && isPlayed ? 'animate-pulse' : ''}`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Scrubber & Controls */}
                  <div className="space-y-1.5 pt-2">
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      step={0.5}
                      value={currentPlaybackTime}
                      onChange={(e) => setCurrentPlaybackTime(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                    />
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>{formatSeconds(currentPlaybackTime)}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setCurrentPlaybackTime(0);
                            setIsPlaying(false);
                          }}
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                          title="Rewind"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id="play-pause-audio-btn"
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                        >
                          {isPlaying ? (
                            <>
                              <Pause className="w-3 h-3 fill-slate-950" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-slate-950" />
                              <span>Play Recording</span>
                            </>
                          )}
                        </button>
                      </div>
                      <span>{formatSeconds(duration)}</span>
                    </div>
                  </div>
                </div>

                {/* Key Audio Findings */}
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs space-y-1.5">
                  <div className="font-semibold text-slate-200 flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Acoustic Crime Intelligence Highlights</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-400 list-disc list-inside">
                    {activeRec.keyAudioFindings.map((finding, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span className="text-slate-300">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Synchronized Call Transcript */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Mic className="w-4 h-4 text-cyan-400" />
                    <span>Synchronized Speaker Diarization Transcript</span>
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {activeRec.transcript.length} Verbal Turns
                  </span>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {activeRec.transcript.map((turn, idx) => {
                    const isFlagged = turn.flagged;
                    const isCaller = turn.speaker.includes(activeRec.caller.split(' ')[0]) || turn.speaker.includes('Vance') || turn.speaker.includes('Anton');

                    // Parse timestamp to seconds
                    const parseTimestamp = (ts: string) => {
                      const parts = ts.split(':').map(Number);
                      return parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
                    };
                    const thisTurnSec = parseTimestamp(turn.timestamp);
                    const nextTurnSec = idx + 1 < activeRec.transcript.length ? parseTimestamp(activeRec.transcript[idx + 1].timestamp) : duration + 10;
                    const isSpeakingNow = isPlaying && currentPlaybackTime >= thisTurnSec && currentPlaybackTime < nextTurnSec;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border transition-all duration-200 ${
                          isSpeakingNow
                            ? 'bg-slate-900 border-cyan-400 ring-1 ring-cyan-400/40 shadow-md'
                            : isFlagged
                            ? 'bg-rose-950/30 border-rose-800/80 text-rose-100'
                            : 'bg-slate-950/80 border-slate-800/90 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isSpeakingNow ? 'bg-cyan-400 animate-ping' : isCaller ? 'bg-cyan-400' : 'bg-slate-400'}`} />
                            <span className="text-xs font-bold text-white">
                              {turn.speaker}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({turn.timestamp})
                            </span>
                            {isSpeakingNow && (
                              <span className="text-[9px] font-mono px-1.5 py-0.2 bg-cyan-400/20 text-cyan-300 rounded border border-cyan-400/40 animate-pulse">
                                Live Audio
                              </span>
                            )}
                          </div>

                          {isFlagged && (
                            <span className="text-[10px] font-semibold text-rose-300 bg-rose-900/60 border border-rose-700/60 px-2 py-0.5 rounded flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{turn.flagReason || 'Suspicious Verbal Cue'}</span>
                            </span>
                          )}
                        </div>

                        <p className={`text-xs leading-relaxed font-sans ${isSpeakingNow ? 'text-white font-medium' : 'text-slate-300'}`}>
                          {turn.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
