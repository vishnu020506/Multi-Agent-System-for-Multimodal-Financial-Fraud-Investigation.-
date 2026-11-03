import React, { useState } from 'react';
import { 
  UserCheck, 
  Activity, 
  Globe, 
  Laptop, 
  Moon, 
  TrendingUp, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Sparkles,
  Zap,
  MapPin
} from 'lucide-react';
import { BehaviorAnalysis } from '../types';

interface BehaviorAgentViewProps {
  analysis?: BehaviorAnalysis;
}

export const BehaviorAgentView: React.FC<BehaviorAgentViewProps> = ({ analysis }) => {
  const [activeTab, setActiveTab] = useState<'BASELINE' | 'GEOLOCATION' | 'DEVICE' | 'NOCTURNAL'>('BASELINE');

  // Realistic default data if analysis is not explicitly passed
  const data: BehaviorAnalysis = analysis || {
    agentStatus: 'FLAGGED',
    riskScore: 91,
    historicalBaselineMonthlyAvg: 18200,
    currentInvestigationVolume: 98500,
    volumeMultiplier: 5.41,
    dormancyDurationDays: 184,
    dormancySpikeDetected: true,
    nocturnalActivityRatio: 0.82,
    ipGeolocationHops: [
      { country: 'United States', city: 'Miami, FL', ipAddress: '198.51.100.44', timestamp: '2024-11-10 01:14 EST', isVpnOrProxy: false },
      { country: 'Panama', city: 'Panama City', ipAddress: '190.14.88.12', timestamp: '2024-11-10 02:22 EST', isVpnOrProxy: true },
      { country: 'British Virgin Islands', city: 'Road Town', ipAddress: '185.220.101.5', timestamp: '2024-11-10 03:05 EST', isVpnOrProxy: true },
    ],
    deviceFingerprints: [
      { deviceId: 'DEV-FINGERPRINT-MAC-8841', browser: 'Safari 17.2 / macOS Sonoma', os: 'macOS 14.1', firstSeen: '2023-04-12', isSuspiciousNewDevice: false },
      { deviceId: 'DEV-FINGERPRINT-UNKNOWN-9921', browser: 'Tor Browser / Firefox 115 ESR', os: 'Linux (Tails OS)', firstSeen: '2024-11-10 01:05 EST', isSuspiciousNewDevice: true },
    ],
    behavioralAnomalies: [
      'Account was dormant for 184 days prior to sudden $98,500 exfiltration burst.',
      '82% of transaction volume executed during nocturnal off-hours (01:00 AM – 04:30 AM EST).',
      'Rapid IP geolocation hopping across 3 sovereign jurisdictions in under 2 hours.',
      'Unrecognized Linux Tails device utilizing Tor circuit exit node for transaction dispatch.',
    ],
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] uppercase font-bold border border-rose-500/30">
                  Specialized Agent #5
                </span>
                <span className="text-xs text-slate-400">Behavioral Biometrics & Account Profiling</span>
              </div>
              <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                Behavior AI Agent (Historical Baseline & Geolocation Telemetry)
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                Continuously analyzes customer behavioral patterns against 12-month rolling baselines to detect dormancy reactivations, nocturnal velocity bursts, and VPN/Tor device anomalies.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-950 border border-rose-900/60 rounded-xl text-right">
              <div className="text-[10px] text-slate-400 font-mono">Behavior Risk Score</div>
              <div className="text-2xl font-black text-rose-400 font-mono">
                {data.riskScore}<span className="text-xs font-normal text-slate-500">/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 gap-2 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('BASELINE')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'BASELINE'
              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Velocity & Dormancy Burst</span>
        </button>

        <button
          onClick={() => setActiveTab('GEOLOCATION')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'GEOLOCATION'
              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>IP Geolocation Hopping</span>
        </button>

        <button
          onClick={() => setActiveTab('DEVICE')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'DEVICE'
              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Laptop className="w-4 h-4" />
          <span>Device Fingerprint Forensics</span>
        </button>

        <button
          onClick={() => setActiveTab('NOCTURNAL')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
            activeTab === 'NOCTURNAL'
              ? 'bg-rose-500/10 text-rose-300 border border-rose-500/40'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          <Moon className="w-4 h-4" />
          <span>Nocturnal Off-Hours Analysis</span>
        </button>
      </div>

      {/* Main Tab Views */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Sub-tab 1: Baseline & Dormancy */}
        {activeTab === 'BASELINE' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs text-slate-400">Monthly Rolling Baseline</div>
                <div className="text-xl font-bold text-slate-100 font-mono">
                  ${data.historicalBaselineMonthlyAvg.toLocaleString()} USD
                </div>
                <div className="text-[10px] text-slate-500">Normal 12-month operating median</div>
              </div>

              <div className="p-4 bg-slate-950 border border-rose-900/60 rounded-xl space-y-1">
                <div className="text-xs text-rose-400 font-semibold">Exfiltration Burst Volume</div>
                <div className="text-xl font-bold text-rose-300 font-mono">
                  ${data.currentInvestigationVolume.toLocaleString()} USD
                </div>
                <div className="text-[10px] text-rose-400 font-mono font-bold">
                  {data.volumeMultiplier}x Velocity Spike (CRITICAL)
                </div>
              </div>

              <div className="p-4 bg-slate-950 border border-amber-900/60 rounded-xl space-y-1">
                <div className="text-xs text-amber-400 font-semibold">Prior Dormancy Duration</div>
                <div className="text-xl font-bold text-amber-300 font-mono">
                  {data.dormancyDurationDays} Days Dormant
                </div>
                <div className="text-[10px] text-slate-400">Zero outgoing wires since May 2024</div>
              </div>
            </div>

            {/* Visual Velocity Burst Chart */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Account Monthly Volume Trajectory (Past 6 Months vs Current Incident)</span>
                <span className="text-rose-400 font-mono font-bold">+541% Anomaly</span>
              </div>

              <div className="h-40 flex items-end gap-3 pt-6 border-b border-slate-800 pb-2">
                {[
                  { month: 'Jun', val: 17500, flag: false },
                  { month: 'Jul', val: 19200, flag: false },
                  { month: 'Aug', val: 1200, flag: false },
                  { month: 'Sep', val: 0, flag: false },
                  { month: 'Oct', val: 0, flag: false },
                  { month: 'Nov (Current)', val: 98500, flag: true },
                ].map((pt, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-amber-300">
                      ${(pt.val / 1000).toFixed(1)}k
                    </span>
                    <div
                      className={`w-full rounded-t transition-all ${
                        pt.flag
                          ? 'bg-rose-500 group-hover:bg-rose-400 shadow-lg shadow-rose-500/20'
                          : 'bg-slate-700 group-hover:bg-slate-600'
                      }`}
                      style={{ height: `${Math.max(6, (pt.val / 100000) * 100)}%` }}
                    />
                    <span className={`text-[10px] font-bold ${pt.flag ? 'text-rose-400' : 'text-slate-400'}`}>
                      {pt.month}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-rose-950/40 border border-rose-800/60 rounded-lg text-xs text-rose-200">
                <strong>Heuristic Detection:</strong> Account remained inactive for 6+ months (classic sleep-and-wake mule profile) before dispatching structured wire tranches under the $10,000 threshold within a 4-hour window.
              </div>
            </div>
          </div>
        )}

        {/* Sub-tab 2: Geolocation Hopping */}
        {activeTab === 'GEOLOCATION' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Globe className="w-4 h-4 text-rose-400" />
              IP Geolocation Velocity & Cross-Border VPN Circuits
            </h3>

            <div className="space-y-3">
              {data.ipGeolocationHops.map((hop, index) => (
                <div
                  key={index}
                  className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 text-xs font-mono font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{hop.country}</span>
                        <span className="text-[10px] text-slate-400">({hop.city})</span>
                        {hop.isVpnOrProxy && (
                          <span className="px-2 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[9px] font-mono font-bold uppercase">
                            VPN / Proxy Hop
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        IP: {hop.ipAddress} • {hop.timestamp}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">
                    Velocity: Physically impossible transit time
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-tab 3: Device Fingerprints */}
        {activeTab === 'DEVICE' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Laptop className="w-4 h-4 text-rose-400" />
              Hardware Device Fingerprints & Canvas Hash Telemetry
            </h3>

            <div className="space-y-3">
              {data.deviceFingerprints.map((dev, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    dev.isSuspiciousNewDevice
                      ? 'bg-rose-950/20 border-rose-500/50'
                      : 'bg-slate-950 border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono text-slate-100">{dev.deviceId}</span>
                        {dev.isSuspiciousNewDevice ? (
                          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
                            NEW SUSPICIOUS DEVICE (Tor Exit)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                            Known Authorized Device
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-300 mt-1">
                        Client: {dev.browser} • OS: {dev.os}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                        First observed: {dev.firstSeen}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sub-tab 4: Nocturnal Hours */}
        {activeTab === 'NOCTURNAL' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" />
              Temporal Dispatch Timing: Nocturnal Off-Hours Analysis
            </h3>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span>Nocturnal Outbound Wire Ratio (01:00 – 05:00 AM)</span>
                <span className="text-rose-400 font-mono font-bold text-sm">82.0%</span>
              </div>

              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 via-rose-500 to-amber-500 rounded-full" style={{ width: '82%' }} />
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Legitimate trade operations take place during standard commercial banking hours (09:00 – 17:00 EST). Executing 4 consecutive high-value wires between 01:14 AM and 03:05 AM is a strong indicator of unauthorized exfiltration or automated bot scripting.
              </p>
            </div>
          </div>
        )}

        {/* Behavioral Anomalies Bullet List */}
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
          <div className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Behavior Agent Key Findings:</span>
          </div>
          <div className="space-y-1.5">
            {data.behavioralAnomalies.map((anom, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span>{anom}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
