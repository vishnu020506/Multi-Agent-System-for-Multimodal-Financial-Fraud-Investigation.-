import React, { useState, useRef, useEffect } from 'react';
import { 
  Share2, 
  AlertTriangle, 
  Repeat, 
  Building2, 
  User, 
  Globe, 
  Laptop, 
  Info,
  ShieldAlert, 
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Filter,
  DollarSign,
  Activity
} from 'lucide-react';
import { GraphAnalysis, GraphNode, GraphEdge } from '../types';

interface GraphAgentViewProps {
  analysis: GraphAnalysis;
}

export const GraphAgentView: React.FC<GraphAgentViewProps> = ({ analysis }) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(analysis.nodes[0]?.id || '');
  const [highlightLoops, setHighlightLoops] = useState<boolean>(true);
  const [isSimulatingFlow, setIsSimulatingFlow] = useState<boolean>(false);
  const [activeSimulationHop, setActiveSimulationHop] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [entityFilter, setEntityFilter] = useState<'ALL' | 'OFFSHORE_SHELL' | 'COMPANY' | 'PERSON' | 'IP_ADDRESS'>('ALL');

  // Draggable Node Positions State
  const initialPositions = React.useMemo(() => {
    const pos: Record<string, { x: number; y: number }> = {};
    analysis.nodes.forEach((n, idx) => {
      pos[n.id] = {
        x: n.x || 150 + (idx % 3) * 200,
        y: n.y || 120 + Math.floor(idx / 3) * 140,
      };
    });
    return pos;
  }, [analysis.nodes]);

  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(initialPositions);
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  // Sync positions if analysis nodes change
  useEffect(() => {
    setPositions(initialPositions);
    setSelectedNodeId(analysis.nodes[0]?.id || '');
  }, [initialPositions, analysis.nodes]);

  // Animated Flow Simulation Loop
  const suspiciousEdges = analysis.edges.filter((e) => e.isSuspicious);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSimulatingFlow && suspiciousEdges.length > 0) {
      interval = setInterval(() => {
        setActiveSimulationHop((prev) => (prev + 1) % suspiciousEdges.length);
      }, 1400);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulatingFlow, suspiciousEdges.length]);

  // Drag handlers
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
    setSelectedNodeId(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingNodeId || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const viewBoxWidth = 740;
    const viewBoxHeight = 400;

    const scaleX = viewBoxWidth / rect.width;
    const scaleY = viewBoxHeight / rect.height;

    const rawX = (e.clientX - rect.left) * scaleX;
    const rawY = (e.clientY - rect.top) * scaleY;

    // Clamp inside canvas bounds
    const clampedX = Math.max(35, Math.min(viewBoxWidth - 35, rawX));
    const clampedY = Math.max(35, Math.min(viewBoxHeight - 35, rawY));

    setPositions((prev) => ({
      ...prev,
      [draggingNodeId]: { x: Math.round(clampedX), y: Math.round(clampedY) },
    }));
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleResetPositions = () => {
    setPositions(initialPositions);
    setZoomLevel(1);
  };

  const activeNode = analysis.nodes.find((n) => n.id === selectedNodeId) || analysis.nodes[0];

  const getNodeColor = (risk: number, type: GraphNode['type']) => {
    if (type === 'OFFSHORE_SHELL' || risk >= 90) return { fill: '#4c0519', stroke: '#f43f5e', text: '#fecdd3' };
    if (risk >= 75) return { fill: '#451a03', stroke: '#f59e0b', text: '#fde68a' };
    if (type === 'IP_ADDRESS') return { fill: '#1e1b4b', stroke: '#6366f1', text: '#e0e7ff' };
    return { fill: '#022c22', stroke: '#10b981', text: '#a7f3d0' };
  };

  // Connected edges for the active node
  const connectedEdges = analysis.edges.filter(
    (e) => e.source === activeNode?.id || e.target === activeNode?.id
  );

  const filteredNodes = analysis.nodes.filter((node) => {
    if (entityFilter === 'ALL') return true;
    return node.type === entityFilter;
  });

  const activeSimEdge = suspiciousEdges[activeSimulationHop];
  const simSourceNode = activeSimEdge ? analysis.nodes.find((n) => n.id === activeSimEdge.source) : null;
  const simTargetNode = activeSimEdge ? analysis.nodes.find((n) => n.id === activeSimEdge.target) : null;

  return (
    <div id="graph-agent-view" className="space-y-6">
      {/* Top Banner: Agent Intelligence Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Graph AI Agent (Network Topology & Layering)</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
                  Agent Status: {analysis.agentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Examines hidden entity networks, circular laundering cycles, shell company clusters, and shared digital identifiers.
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

        {/* Circular Routing Warning Banner */}
        {analysis.circularRoutingDetected && (
          <div className="mt-5 p-4 rounded-lg bg-rose-950/40 border border-rose-800/80 flex items-start gap-3">
            <Repeat className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5 animate-spin" />
            <div className="text-xs">
              <div className="font-bold text-rose-300 uppercase tracking-wide">
                Closed Circular Routing Loop Identified
              </div>
              <p className="text-rose-200 mt-1 leading-relaxed">
                Graph cycle detection algorithms confirmed an economic round-trip wash cycle: funds departing the operating accounts are layered across offshore jurisdictions and repatriated to the beneficial owner with minimal net asset transfer.
              </p>
            </div>
          </div>
        )}

        {/* Metric Strips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Entities in Network</div>
            <div className="text-base font-bold text-white font-mono">{analysis.nodes.length} Nodes</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Transaction & Owner Links</div>
            <div className="text-base font-bold text-slate-200 font-mono">{analysis.edges.length} Edges</div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Shell Entities Identified</div>
            <div className="text-base font-bold text-rose-400 font-mono">
              {analysis.shellCompaniesIdentified.length} Shell(s)
            </div>
          </div>
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div className="text-slate-400 mb-1">Digital Identifier Link</div>
            <div className="text-base font-bold text-amber-400 font-mono">
              {analysis.sharedDeviceOrIpFindings.length > 0 ? 'Shared IP Found' : 'No Overlap'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Workspace: SVG Network Canvas + Node Intelligence Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive SVG Network Graph Canvas */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Multi-Hop Entity Relationship Graph</span>
                <span className="text-[10px] text-emerald-400 font-normal border border-emerald-800/80 bg-emerald-950/60 px-1.5 py-0.2 rounded">
                  Drag Nodes to Reposition
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Click any node to inspect beneficial ownership & financial flows. Drag nodes freely across canvas.
              </p>
            </div>

            {/* Action Tools & Simulation Button */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                id="simulate-flow-btn"
                onClick={() => setIsSimulatingFlow(!isSimulatingFlow)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold transition-all border ${
                  isSimulatingFlow 
                    ? 'bg-rose-600 text-white border-rose-500 shadow-md animate-pulse' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 border-emerald-400'
                }`}
              >
                {isSimulatingFlow ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-white" />
                    <span>Pause Flow Sim</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>Simulate Laundering Flow</span>
                  </>
                )}
              </button>

              <button
                onClick={handleResetPositions}
                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                title="Reset Node Positions"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center bg-slate-950 rounded border border-slate-800 p-0.5">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.15))}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3 h-3" />
                </button>
                <span className="px-1.5 text-[10px] font-mono text-slate-400">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
                  className="p-1 text-slate-400 hover:text-white"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3 h-3" />
                </button>
              </div>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none ml-1">
                <input
                  type="checkbox"
                  checked={highlightLoops}
                  onChange={(e) => setHighlightLoops(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0 cursor-pointer"
                />
                <span className="text-[11px]">Loops</span>
              </label>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 text-[11px]">
            <span className="text-slate-400 mr-1 text-[10px] uppercase font-bold flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter:
            </span>
            {(['ALL', 'OFFSHORE_SHELL', 'COMPANY', 'PERSON', 'IP_ADDRESS'] as const).map((ft) => (
              <button
                key={ft}
                onClick={() => setEntityFilter(ft)}
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors border ${
                  entityFilter === ft
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {ft.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Real-time Flow Simulation Telemetry Banner */}
          {isSimulatingFlow && activeSimEdge && (
            <div className="p-2.5 rounded-lg bg-rose-950/70 border border-rose-500/80 flex items-center justify-between text-xs text-rose-200 animate-pulse">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-400 animate-bounce" />
                <span className="font-bold">Active Layering Hop #{activeSimulationHop + 1}:</span>
                <span className="text-white font-semibold">
                  {simSourceNode?.label} ➔ {simTargetNode?.label}
                </span>
                <span className="text-[11px] font-mono text-amber-300 font-bold bg-amber-950/80 border border-amber-700/60 px-2 py-0.5 rounded">
                  {activeSimEdge.label}
                </span>
              </div>
              <span className="text-[10px] font-mono text-rose-300">
                Hop {activeSimulationHop + 1} of {suspiciousEdges.length}
              </span>
            </div>
          )}

          {/* SVG Diagram Canvas */}
          <div 
            className="relative w-full h-96 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden select-none flex items-center justify-center cursor-crosshair"
            onMouseUp={handleMouseUp}
          >
            <svg
              ref={svgRef}
              className="w-full h-full transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
              viewBox="0 0 740 400"
              preserveAspectRatio="xMidYMid meet"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
            >
              <defs>
                <marker
                  id="arrow"
                  viewBox="0 0 10 10"
                  refX="26"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#64748b" />
                </marker>
                <marker
                  id="arrow-suspicious"
                  viewBox="0 0 10 10"
                  refX="26"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>
                <linearGradient id="flow-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Render Edges */}
              {analysis.edges.map((edge) => {
                const sPos = positions[edge.source];
                const tPos = positions[edge.target];
                if (!sPos || !tPos) return null;

                const sx = sPos.x;
                const sy = sPos.y;
                const tx = tPos.x;
                const ty = tPos.y;

                const isSuspicious = edge.isSuspicious && highlightLoops;
                const strokeColor = isSuspicious ? '#f43f5e' : '#475569';
                const strokeDash = edge.relationType === 'SHARED_IP' ? '4,4' : 'none';

                const midX = (sx + tx) / 2;
                const midY = (sy + ty) / 2;

                const isEdgeSimulating = isSimulatingFlow && activeSimEdge?.id === edge.id;

                return (
                  <g key={edge.id} className="cursor-pointer">
                    <line
                      x1={sx}
                      y1={sy}
                      x2={tx}
                      y2={ty}
                      stroke={isEdgeSimulating ? '#f59e0b' : strokeColor}
                      strokeWidth={isEdgeSimulating ? 4 : isSuspicious ? 2.5 : 1.5}
                      strokeDasharray={strokeDash}
                      markerEnd={isSuspicious ? 'url(#arrow-suspicious)' : 'url(#arrow)'}
                      className={isEdgeSimulating ? 'animate-pulse' : ''}
                    />

                    {/* Animated Flow Pulse Particle */}
                    {isEdgeSimulating && (
                      <circle
                        cx={midX}
                        cy={midY}
                        r={7}
                        fill="#f59e0b"
                        className="animate-ping"
                      />
                    )}

                    {/* Edge Label Pill */}
                    <rect
                      x={midX - 52}
                      y={midY - 9}
                      width={104}
                      height={18}
                      rx={4}
                      fill="#090d16"
                      stroke={isEdgeSimulating ? '#f59e0b' : strokeColor}
                      strokeWidth={isEdgeSimulating ? 1.5 : 1}
                      opacity={0.92}
                    />
                    <text
                      x={midX}
                      y={midY + 3.5}
                      fill={isEdgeSimulating ? '#fde68a' : isSuspicious ? '#fecdd3' : '#94a3b8'}
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {edge.label.length > 18 ? edge.label.substring(0, 18) + '...' : edge.label}
                    </text>
                  </g>
                );
              })}

              {/* Render Nodes */}
              {filteredNodes.map((node) => {
                const pos = positions[node.id] || { x: 200, y: 200 };
                const nx = pos.x;
                const ny = pos.y;
                const isSelected = node.id === activeNode?.id;
                const colors = getNodeColor(node.riskScore, node.type);
                const isBeingDragged = draggingNodeId === node.id;

                return (
                  <g
                    key={node.id}
                    id={`graph-node-${node.id}`}
                    onMouseDown={(e) => handleMouseDown(node.id, e)}
                    className="cursor-grab active:cursor-grabbing transition-transform"
                  >
                    {/* Pulsing ring for high risk or selected */}
                    {isSelected && (
                      <circle
                        cx={nx}
                        cy={ny}
                        r={32}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth={2.5}
                        strokeDasharray="4,2"
                        className="animate-spin"
                      />
                    )}

                    {/* Main Node Circle */}
                    <circle
                      cx={nx}
                      cy={ny}
                      r={isBeingDragged ? 28 : 24}
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth={isSelected ? 3 : 2}
                      className="shadow-lg transition-all"
                    />

                    {/* Type Badge inside circle */}
                    <text
                      x={nx}
                      y={ny + 4}
                      fill={colors.text}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                      textAnchor="middle"
                    >
                      {node.type.substring(0, 3)}
                    </text>

                    {/* Node Label Text */}
                    <text
                      x={nx}
                      y={ny + 38}
                      fill="#f1f5f9"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="middle"
                      className="shadow-sm"
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Multi-Hop Fraud Relationship Path Tracer (Feature 6) */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">
                  Multi-Hop Laundering Path Tracing: Account A ➔ Account B ➔ Account C ➔ Suspicious Transaction
                </span>
              </div>
              <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800">
                Layering Sequence Confirmed
              </span>
            </div>

            {/* Path Sequence Stepper Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              {/* Hop 1 */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 relative group hover:border-amber-500/50 transition">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-mono text-amber-400 font-bold">Step 1: Origin</span>
                  <span>US Domestic</span>
                </div>
                <div className="font-bold text-slate-100 text-[11px] truncate">
                  Account A: Apex Logistics
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  Outbound: $98,500.00
                </div>
              </div>

              {/* Hop 2 */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-500/40 relative group hover:border-amber-500 transition shadow-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-mono text-amber-400 font-bold">Step 2: Hop #1</span>
                  <span className="text-rose-400">BVI Secrecy</span>
                </div>
                <div className="font-bold text-amber-300 text-[11px] truncate">
                  Account B: Horizon BVI
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  Split into 4 tranches
                </div>
              </div>

              {/* Hop 3 */}
              <div className="p-2.5 rounded-lg bg-slate-900 border border-purple-500/40 relative group hover:border-purple-500 transition shadow-xs">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-mono text-purple-400 font-bold">Step 3: Hop #2</span>
                  <span className="text-purple-400">Shell Entity</span>
                </div>
                <div className="font-bold text-purple-300 text-[11px] truncate">
                  Account C: Titan Offshore
                </div>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  Layering wash cycle
                </div>
              </div>

              {/* Hop 4: Suspicious Transaction */}
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-500/60 relative group hover:border-rose-400 transition shadow-sm">
                <div className="flex items-center justify-between text-[10px] text-rose-300 mb-1">
                  <span className="font-mono font-bold text-rose-400">Step 4: Target</span>
                  <span className="font-bold">FLAGGED</span>
                </div>
                <div className="font-bold text-rose-200 text-[11px] truncate">
                  Suspicious Tx: TX-8901-04
                </div>
                <div className="text-[10px] font-mono text-amber-300 font-bold mt-1">
                  $9,940 Structured Wire
                </div>
              </div>
            </div>
          </div>

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-950 border border-rose-500"></span>
                <span>Offshore Shell / High Risk</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-950 border border-emerald-500"></span>
                <span>Operating Entity</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-950 border border-indigo-500"></span>
                <span>Digital Identifier / IP</span>
              </span>
            </div>
            <span className="font-mono text-amber-400">
              Red arrows = Flagged Money Laundering Links
            </span>
          </div>
        </div>

        {/* Selected Node Dossier Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-mono text-slate-400">Node ID: {activeNode?.id}</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                  activeNode?.riskScore >= 75 ? 'bg-rose-950 text-rose-300 border-rose-800' : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  Risk {activeNode?.riskScore}/100
                </span>
              </div>
              <h4 className="text-base font-bold text-white leading-snug">{activeNode?.label}</h4>
              <div className="text-xs font-mono text-amber-400 mt-0.5 flex items-center justify-between">
                <span>{activeNode?.type.replace('_', ' ')}</span>
                <span className="text-slate-400 text-[10px]">
                  Pos: ({positions[activeNode?.id]?.x || 0}, {positions[activeNode?.id]?.y || 0})
                </span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-2">
              <div className="text-slate-400 text-[11px] font-semibold">Intelligence Profile & FATF Jurisdiction:</div>
              <p className="text-slate-200 leading-relaxed font-sans">
                {activeNode?.details || 'Target entity in active investigation network topology.'}
              </p>
              {activeNode?.type === 'OFFSHORE_SHELL' && (
                <div className="text-[10px] text-rose-300 font-mono bg-rose-950/60 p-2 rounded border border-rose-800/60">
                  ⚠️ High-secrecy offshore registration lacking physical operations, substance, or employees.
                </div>
              )}
            </div>

            {/* Connected Relationships list */}
            <div>
              <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Network Links ({connectedEdges.length})</span>
                <span className="text-[10px] text-slate-400">Inbound & Outbound</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {connectedEdges.map((edge) => {
                  const isSource = edge.source === activeNode?.id;
                  const otherNodeId = isSource ? edge.target : edge.source;
                  const otherNode = analysis.nodes.find((n) => n.id === otherNodeId);

                  return (
                    <div
                      key={edge.id}
                      className="p-2.5 bg-slate-950 rounded border border-slate-800 text-xs flex flex-col gap-1 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-semibold font-mono ${isSource ? 'text-amber-400' : 'text-cyan-400'}`}>
                          {isSource ? 'OUTBOUND →' : '← INBOUND'}
                        </span>
                        <span className="text-slate-300 font-bold">{edge.relationType}</span>
                      </div>
                      <div className="text-white font-medium">{otherNode?.label || otherNodeId}</div>
                      <div className="text-slate-400 text-[11px] font-mono">{edge.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shell Entities list */}
            {analysis.shellCompaniesIdentified.length > 0 && (
              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Shell Company Syndicate</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  {analysis.shellCompaniesIdentified.map((shell, i) => (
                    <li key={i} className="text-[11px] font-mono text-rose-200">
                      • {shell}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
