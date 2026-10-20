import React, { useState } from 'react';
import { Landmark } from '../types/game';
import { sound } from '../services/soundEngine';
import { MapPin, Target, Eye, Navigation, Shield, Building2, Cpu, Zap, Trees, Wrench, Radio } from 'lucide-react';

interface CyberayaGrid3DProps {
  gridSize?: number; // default 8 (0 to 8)
  landmarks?: Landmark[];
  activeLandmarkId?: string | null;
  selectedCoordinate?: [number, number] | null;
  highlightAxis?: 'paksi-x' | 'paksi-y' | 'asalan' | null;
  animatedTarget?: [number, number] | null;
  showRulerSteps?: boolean;
  onSelectCoordinate?: (coord: [number, number]) => void;
  onSelectAxis?: (axis: 'paksi-x' | 'paksi-y' | 'asalan') => void;
  isInteractive?: boolean;
  gridOverlayText?: string;
}

export const CyberayaGrid3D: React.FC<CyberayaGrid3DProps> = ({
  gridSize = 8,
  landmarks = [],
  activeLandmarkId = null,
  selectedCoordinate = null,
  highlightAxis = null,
  animatedTarget = null,
  showRulerSteps = false,
  onSelectCoordinate,
  onSelectAxis,
  isInteractive = true,
  gridOverlayText,
}) => {
  const [hoveredCoord, setHoveredCoord] = useState<[number, number] | null>(null);
  const [is3DView, setIs3DView] = useState<boolean>(true);

  // Render correct icon for landmarks
  const renderLandmarkIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-3.5 h-3.5 text-cyan-300" />;
      case 'Building2': return <Building2 className="w-3.5 h-3.5 text-blue-300" />;
      case 'Cpu': return <Cpu className="w-3.5 h-3.5 text-purple-300" />;
      case 'Zap': return <Zap className="w-3.5 h-3.5 text-rose-300" />;
      case 'Trees': return <Trees className="w-3.5 h-3.5 text-emerald-300" />;
      case 'Wrench': return <Wrench className="w-3.5 h-3.5 text-amber-300" />;
      case 'Radio': return <Radio className="w-3.5 h-3.5 text-sky-300" />;
      default: return <MapPin className="w-3.5 h-3.5 text-cyan-300" />;
    }
  };

  const handleCellClick = (x: number, y: number) => {
    if (!isInteractive) return;
    sound.playLockCoordinate();
    if (onSelectCoordinate) {
      onSelectCoordinate([x, y]);
    }
  };

  const handleAxisClick = (axis: 'paksi-x' | 'paksi-y' | 'asalan') => {
    if (onSelectAxis) {
      sound.playAxisActive();
      onSelectAxis(axis);
    }
  };

  return (
    <div className="relative flex flex-col items-center w-full max-w-2xl mx-auto select-none">
      {/* Top HUD Toolbar for Grid Controls */}
      <div className="w-full flex items-center justify-between px-2 py-1 mb-1.5 text-xs font-mono text-cyan-400">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <span>KEDUDUKAN:</span>
            <span className="text-white font-bold">
              {hoveredCoord ? `(${hoveredCoord[0]}, ${hoveredCoord[1]})` : selectedCoordinate ? `(${selectedCoordinate[0]}, ${selectedCoordinate[1]})` : 'Sedia'}
            </span>
          </span>
        </div>

        {/* 3D / 2D Perspective Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            setIs3DView(!is3DView);
          }}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 transition text-[11px] cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{is3DView ? 'PANDANGAN 3D HOLOGRAFIK' : 'PANDANGAN 2D TEPAT'}</span>
        </button>
      </div>

      {/* Grid Container with 3D Perspective */}
      <div
        className={`relative w-full aspect-square max-w-[460px] p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-950/90 via-slate-900/90 to-blue-950/80 border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)] transition-transform duration-500 ${
          is3DView ? 'transform perspective-[900px] rotateX-[14deg]' : ''
        }`}
      >
        {/* Holographic background cyber scanner texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none rounded-2xl" />

        {/* Grid HUD frame decorations */}
        <div className="absolute top-2 left-2 text-[9px] font-mono text-cyan-500/60 tracking-widest pointer-events-none">
          SYS.CARTESIAN.v5 // CYBERAYA GRID
        </div>
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[9px] font-mono text-cyan-400/80 pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>IRIS CONNECTED</span>
        </div>

        {/* The Coordinate Plane Area */}
        <div className="relative w-full h-full">
          {/* PAKSI-Y (Vertical Axis - Mencancang / Menegak) */}
          <div
            onClick={() => handleAxisClick('paksi-y')}
            className={`absolute left-0 bottom-0 top-0 w-2.5 z-20 cursor-pointer transition-all duration-300 flex flex-col justify-between items-center ${
              highlightAxis === 'paksi-y'
                ? 'bg-emerald-400 shadow-[0_0_20px_#10b981] animate-pulse'
                : 'bg-emerald-500/70 hover:bg-emerald-400'
            }`}
            title="Klik Paksi-Y (Paksi Menegak / Mencancang)"
          >
            {/* Arrowhead on top of Y */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-emerald-400" />
            <span className="absolute -top-6 -left-3 text-xs font-black text-emerald-400 font-mono tracking-wider bg-slate-950/90 px-1 rounded border border-emerald-500/40">
              Y (Menegak)
            </span>
          </div>

          {/* PAKSI-X (Horizontal Axis - Mengufuk / Mendatar) */}
          <div
            onClick={() => handleAxisClick('paksi-x')}
            className={`absolute left-0 bottom-0 right-0 h-2.5 z-20 cursor-pointer transition-all duration-300 flex items-center justify-between ${
              highlightAxis === 'paksi-x'
                ? 'bg-cyan-400 shadow-[0_0_20px_#06b6d4] animate-pulse'
                : 'bg-cyan-500/70 hover:bg-cyan-400'
            }`}
            title="Klik Paksi-X (Paksi Mendatar / Mengufuk)"
          >
            {/* Arrowhead on right of X */}
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-cyan-400" />
            <span className="absolute -right-6 -bottom-5 text-xs font-black text-cyan-400 font-mono tracking-wider bg-slate-950/90 px-1 rounded border border-cyan-500/40">
              X (Mendatar)
            </span>
          </div>

          {/* TITIK ASALAN (0, 0) */}
          <button
            onClick={() => handleAxisClick('asalan')}
            className={`absolute -left-3 -bottom-3 w-7 h-7 rounded-full z-30 flex items-center justify-center transition-all cursor-pointer ${
              highlightAxis === 'asalan'
                ? 'bg-yellow-400 ring-4 ring-yellow-400/50 shadow-[0_0_25px_#facc15] animate-bounce'
                : 'bg-yellow-500 hover:bg-yellow-400 ring-2 ring-yellow-500/40'
            }`}
            title="Titik Asalan (0,0) - Pertemuan Paksi"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />
            <span className="absolute -bottom-5 -left-1 text-[10px] font-black font-mono text-yellow-300 whitespace-nowrap bg-slate-950/90 px-1 rounded border border-yellow-500/50">
              Asalan (0,0)
            </span>
          </button>

          {/* Coordinate Grid Cells & Lines */}
          <div className="absolute inset-0">
            {/* Horizontal & Vertical Grid Lines */}
            {Array.from({ length: gridSize + 1 }).map((_, i) => {
              const pct = (i / gridSize) * 100;
              return (
                <React.Fragment key={`lines-${i}`}>
                  {/* Horizontal Line at Y = i */}
                  <div
                    className="absolute left-0 right-0 border-b border-cyan-500/20 pointer-events-none"
                    style={{ bottom: `${pct}%` }}
                  />
                  {/* Y Axis number label */}
                  {i > 0 && (
                    <span
                      className="absolute -left-5 text-[11px] font-bold font-mono text-emerald-400 -translate-y-1/2 pointer-events-none"
                      style={{ bottom: `${pct}%` }}
                    >
                      {i}
                    </span>
                  )}

                  {/* Vertical Line at X = i */}
                  <div
                    className="absolute top-0 bottom-0 border-r border-cyan-500/20 pointer-events-none"
                    style={{ left: `${pct}%` }}
                  />
                  {/* X Axis number label */}
                  {i > 0 && (
                    <span
                      className="absolute -bottom-5 text-[11px] font-bold font-mono text-cyan-400 -translate-x-1/2 pointer-events-none"
                      style={{ left: `${pct}%` }}
                    >
                      {i}
                    </span>
                  )}
                </React.Fragment>
              );
            })}

            {/* Interactive Intersections / Grid Nodes */}
            {Array.from({ length: gridSize + 1 }).map((_, y) => {
              return Array.from({ length: gridSize + 1 }).map((__, x) => {
                const posX = (x / gridSize) * 100;
                const posY = (y / gridSize) * 100;
                const isSelected = selectedCoordinate && selectedCoordinate[0] === x && selectedCoordinate[1] === y;
                const isAnimatedTarget = animatedTarget && animatedTarget[0] === x && animatedTarget[1] === y;

                return (
                  <div
                    key={`node-${x}-${y}`}
                    onClick={() => handleCellClick(x, y)}
                    onMouseEnter={() => setHoveredCoord([x, y])}
                    onMouseLeave={() => setHoveredCoord(null)}
                    className="absolute -translate-x-1/2 translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer group z-10"
                    style={{ left: `${posX}%`, bottom: `${posY}%` }}
                  >
                    {/* Hover Target Crosshair */}
                    <div className="w-2 h-2 rounded-full bg-cyan-400/40 group-hover:bg-cyan-300 group-hover:scale-150 transition-all" />

                    {/* Selected Coordinate Marker */}
                    {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-7 h-7 rounded-full border-2 border-amber-400 animate-ping absolute" />
                        <Target className="w-6 h-6 text-amber-400 animate-pulse drop-shadow-[0_0_8px_#f59e0b]" />
                        <span className="absolute -top-5 bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded font-mono shadow">
                          ({x}, {y})
                        </span>
                      </div>
                    )}

                    {/* Animated Target Beacon */}
                    {isAnimatedTarget && !isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-8 h-8 rounded-full border-2 border-rose-500 animate-ping" />
                        <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_12px_#f43f5e]" />
                      </div>
                    )}
                  </div>
                );
              });
            })}

            {/* Step-by-Step Ruler Trajectory Animation (X first, then Y) */}
            {showRulerSteps && animatedTarget && (
              <>
                {/* Horizontal Path along Paksi-X from (0,0) to (targetX, 0) */}
                <div
                  className="absolute bottom-0 h-1 bg-gradient-to-r from-yellow-400 via-cyan-400 to-cyan-300 z-15 shadow-[0_0_12px_#06b6d4] animate-pulse"
                  style={{
                    left: '0%',
                    width: `${(animatedTarget[0] / gridSize) * 100}%`,
                  }}
                >
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-cyan-900/90 border border-cyan-400 text-cyan-200 text-[9px] font-mono px-1 rounded whitespace-nowrap">
                    Langkah 1: Nilai X = {animatedTarget[0]}
                  </div>
                </div>

                {/* Vertical Path along Paksi-Y from (targetX, 0) to (targetX, targetY) */}
                <div
                  className="absolute border-l-2 border-dashed border-emerald-400 z-15 shadow-[0_0_12px_#10b981]"
                  style={{
                    left: `${(animatedTarget[0] / gridSize) * 100}%`,
                    bottom: '0%',
                    height: `${(animatedTarget[1] / gridSize) * 100}%`,
                  }}
                >
                  <div className="absolute top-1/2 -left-12 -translate-y-1/2 bg-emerald-900/90 border border-emerald-400 text-emerald-200 text-[9px] font-mono px-1 rounded whitespace-nowrap">
                    Langkah 2: Nilai Y = {animatedTarget[1]}
                  </div>
                </div>
              </>
            )}

            {/* Landmark Markers on Grid */}
            {landmarks.map((lm) => {
              const [lx, ly] = lm.coordinate;
              const posX = (lx / gridSize) * 100;
              const posY = (ly / gridSize) * 100;
              const isActive = activeLandmarkId === lm.id;

              return (
                <div
                  key={lm.id}
                  onClick={() => handleCellClick(lx, ly)}
                  className={`absolute -translate-x-1/2 translate-y-1/2 z-25 cursor-pointer group flex flex-col items-center`}
                  style={{ left: `${posX}%`, bottom: `${posY}%` }}
                >
                  {/* Pin Orb */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center p-1 transition-all duration-300 border ${
                      isActive
                        ? 'bg-rose-600 border-white ring-4 ring-rose-400/50 scale-125 shadow-[0_0_20px_#ef4444]'
                        : 'bg-slate-900/90 border-cyan-400/60 hover:scale-110 hover:border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                    }`}
                  >
                    {renderLandmarkIcon(lm.iconName)}
                  </div>

                  {/* Tooltip on hover / active */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-950/95 border border-cyan-400/80 px-2 py-0.5 rounded shadow-xl text-[10px] font-bold text-white whitespace-nowrap pointer-events-none z-30">
                    {lm.name} ({lx}, {ly})
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grid Overlay Banner if any */}
        {gridOverlayText && (
          <div className="absolute inset-x-4 bottom-2 bg-slate-950/90 border border-cyan-500/40 py-1 px-2.5 rounded-lg text-center text-xs font-mono text-cyan-300 shadow">
            {gridOverlayText}
          </div>
        )}
      </div>

      {/* Axis Helper Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-xs font-mono">
        <div className="flex items-center gap-1.5 bg-slate-900/70 px-2.5 py-1 rounded-full border border-cyan-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#06b6d4]" />
          <span className="text-cyan-300 font-bold">Paksi-X:</span>
          <span className="text-slate-300">Mengufuk (Mendatar)</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/70 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          <span className="text-emerald-300 font-bold">Paksi-Y:</span>
          <span className="text-slate-300">Mencancang (Menegak)</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-900/70 px-2.5 py-1 rounded-full border border-yellow-500/30">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_6px_#facc15]" />
          <span className="text-yellow-300 font-bold">Asalan:</span>
          <span className="text-slate-300">(0, 0)</span>
        </div>
      </div>
    </div>
  );
};
