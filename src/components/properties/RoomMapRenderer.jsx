import React, { useState } from 'react';
import {
  normalizeLayout,
  DEFAULT_ROOM_DIMENSIONS,
  getElementBounds,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  WALL_THICKNESS,
} from '../../utils/roomLayoutEngine';

/**
 * High-Fidelity 2D Architectural Room Map Renderer
 * Renders an exact top-down architectural floor plan matching the user's reference diagram.
 */
export default function RoomMapRenderer({
  room,
  layoutData,
  selectedBedId = null,
  onBedClick = null,
  onElementClick = null,
  interactive = true,
  showLegend = true,
  showLabels = true,
  customScale = 1,
  className = '',
}) {
  const [hoveredElementId, setHoveredElementId] = useState(null);

  const roomBeds = room?.beds || [];
  const roomFacilities = room?.facilities || {
    hasAc: Boolean(room?.hasAc !== undefined ? room.hasAc : true),
    hasAttachedWashroom: Boolean(
      room?.washroomType ? room.washroomType !== 'common' : true
    ),
    hasTv: true,
    hasWindow: true,
    hasCupboard: true,
    hasStudyTable: false,
  };

  // Resolve layout structure with full normalization and validation
  const activeLayout = normalizeLayout(layoutData || room?.layout, {
    roomNumber: room?.roomNumber || '101',
    capacity: room?.capacity || (roomBeds.length > 0 ? roomBeds.length : 4),
    facilities: roomFacilities,
  });

  // Support both V2 canvas object and legacy dimensions object
  const canvas = activeLayout.canvas || activeLayout.dimensions || DEFAULT_ROOM_DIMENSIONS;
  const width = Number(canvas.width) || CANVAS_WIDTH;
  const height = Number(canvas.height) || CANVAS_HEIGHT;
  const wallThickness = Number(canvas.wallThickness || WALL_THICKNESS);
  const elements = activeLayout.elements || [];

  // Match bed data by bed number or ID
  const getBedInfo = (el) => {
    if (el.type !== 'bed') return null;
    const match =
      roomBeds.find(
        (b) => b.bedNumber === el.bedNumber || b._id === el.id || b.bedNumber === el.label
      ) || {
        bedNumber: el.bedNumber || el.label || 'Bed',
        isOccupied: false,
        status: 'available',
        monthlyRent: room?.monthlyRent || 8500,
      };

    const isOccupied = Boolean(match.isOccupied || match.status === 'occupied');
    const isMaintenance = match.status === 'maintenance';
    const isReserved = match.status === 'reserved';
    const isAvailable = !isOccupied && !isMaintenance && !isReserved;

    return {
      ...match,
      isOccupied,
      isMaintenance,
      isReserved,
      isAvailable,
      residentName: match.residentId?.name || match.residentName || '',
    };
  };

  return (
    <div className={`relative w-full flex flex-col items-center select-none ${className}`}>
      {/* SVG Canvas Map Container */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 shadow-md">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto block"
          style={{ maxHeight: '720px' }}
        >
          {/* SVG Definitions for realistic architectural textures & gradients */}
          <defs>
            {/* Tile Floor Grid Pattern */}
            <pattern
              id="floor-tile-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <rect width="40" height="40" fill="#f5f1e8" stroke="#e8e2d5" strokeWidth="0.8" />
            </pattern>

            {/* Bathroom Floor Tiles */}
            <pattern
              id="bath-tile-pattern"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <rect width="24" height="24" fill="#75828a" stroke="#637078" strokeWidth="0.8" />
            </pattern>

            {/* Dark Wall Outer Gradient */}
            <linearGradient id="wall-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2b2d30" />
              <stop offset="100%" stopColor="#1e2022" />
            </linearGradient>

            {/* Wood Grain Gradient for Lockers */}
            <linearGradient id="wood-cabinet-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c5a882" />
              <stop offset="50%" stopColor="#b4936b" />
              <stop offset="100%" stopColor="#9e7e57" />
            </linearGradient>

            {/* Bed Mattress Gradient */}
            <linearGradient id="mattress-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="85%" stopColor="#f8f9fa" />
              <stop offset="100%" stopColor="#e9ecef" />
            </linearGradient>

            {/* Drop Shadow for Beds and Objects */}
            <filter id="object-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="2" dy="5" stdDeviation="4" floodColor="#000000" floodOpacity="0.22" />
            </filter>

            {/* Soft Wall Inner Shadow */}
            <filter id="wall-shadow" x="-5%" y="-5%" width="110%" height="110%">
              <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#000000" floodOpacity="0.3" />
            </filter>

            {/* Active Bed Selection Glow */}
            <filter id="selection-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#0ea5e9" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* 1. ROOM MAIN TILE FLOOR */}
          <rect
            x={wallThickness}
            y={wallThickness}
            width={width - wallThickness * 2}
            height={height - wallThickness * 2}
            fill="url(#floor-tile-pattern)"
          />

          {/* 2. RENDER ROOM ELEMENTS (sorted by zIndex) */}
          {[...elements]
            .sort((a, b) => (a.zIndex || 5) - (b.zIndex || 5))
            .map((el) => {
            const isHovered = hoveredElementId === el.id;
            const isSelected = selectedBedId === el.id || selectedBedId === el.bedNumber;

            // Unified bounds accessor - works with V2 (position/size) and legacy (x/y/width/height)
            const bounds = getElementBounds(el);
            const elW = Math.max(10, bounds.width);
            const elH = Math.max(10, bounds.height);
            const elX = bounds.x;
            const elY = bounds.y;
            const elRot = Number(el.rotation) || 0;

            // Normalize element category for type checks
            // V2 uses el.category; legacy uses el.type
            const elCat = el.category || el.type || 'other';

            // -------------------------------------------------------------
            // A. LOCKERS / WARDROBES (Top-Left Architectural Cabinet)
            // -------------------------------------------------------------
            if (elCat === 'locker' || el.type === 'lockers' || el.type === 'wardrobe') {
              const doors = Math.max(1, Number(el.properties?.doors ?? el.doors) || 4);
              const doorWidth = elW / doors;
              return (
                <g
                  key={el.id}
                  transform={`translate(${elX}, ${elY}) rotate(${elRot})`}
                  filter="url(#object-shadow)"
                  className="cursor-pointer"
                  onClick={() => onElementClick && onElementClick(el)}
                  onMouseEnter={() => setHoveredElementId(el.id)}
                  onMouseLeave={() => setHoveredElementId(null)}
                >
                  {/* Cabinet Base Box */}
                  <rect
                    width={elW}
                    height={elH}
                    fill="url(#wood-cabinet-gradient)"
                    stroke="#5a422d"
                    strokeWidth="1.5"
                    rx="3"
                  />
                  {/* Door Divider Lines and Handles */}
                  {Array.from({ length: doors }).map((_, i) => (
                    <g key={i}>
                      {i > 0 && (
                        <line
                          x1={i * doorWidth}
                          y1={0}
                          x2={i * doorWidth}
                          y2={elH}
                          stroke="#6b4f35"
                          strokeWidth="1.2"
                        />
                      )}
                      {/* Top locker vent / slot */}
                      <rect
                        x={i * doorWidth + doorWidth * 0.25}
                        y={elH * 0.18}
                        width={doorWidth * 0.5}
                        height={2}
                        fill="#523a26"
                        rx="1"
                      />
                      {/* Metal Handle */}
                      <rect
                        x={i * doorWidth + doorWidth * 0.44}
                        y={elH * 0.45}
                        width={3.5}
                        height={elH * 0.25}
                        fill="#2c241c"
                        rx="1"
                      />
                    </g>
                  ))}
                  {/* Outer Bevel Shadow */}
                  <line
                    x1="0"
                    y1={elH}
                    x2={elW}
                    y2={elH}
                    stroke="#422f1f"
                    strokeWidth="2.5"
                  />
                </g>
              );
            }

            // -------------------------------------------------------------
            // B. ATTACHED BATHROOM (Top-Right Enclosed Compartment)
            // -------------------------------------------------------------
            if (elCat === 'washroom' || el.type === 'bathroom' || el.type === 'washroom') {
              const bathW = elW;
              const bathH = elH;
              return (
                <g
                  key={el.id}
                  transform={`translate(${elX}, ${elY})`}
                  className="cursor-pointer"
                  onClick={() => onElementClick && onElementClick(el)}
                  onMouseEnter={() => setHoveredElementId(el.id)}
                  onMouseLeave={() => setHoveredElementId(null)}
                >
                  {/* Bathroom Tiled Floor */}
                  <rect
                    width={bathW}
                    height={bathH}
                    fill="url(#bath-tile-pattern)"
                    stroke="#1e2022"
                    strokeWidth="8"
                  />

                  {/* 1. Toilet Commode */}
                  <g transform={`translate(${bathW * 0.12}, ${bathH * 0.12})`}>
                    {/* Water Cistern Tank */}
                    <rect
                      x="0"
                      y="0"
                      width="42"
                      height="16"
                      fill="#ffffff"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                      rx="3"
                    />
                    {/* Flush Button */}
                    <circle cx="21" cy="8" r="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.8" />
                    {/* Oval Toilet Seat Bowl */}
                    <ellipse
                      cx="21"
                      cy="30"
                      rx="16"
                      ry="18"
                      fill="#ffffff"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                    />
                    <ellipse
                      cx="21"
                      cy="30"
                      rx="10"
                      ry="12"
                      fill="#e2e8f0"
                      stroke="#cbd5e1"
                      strokeWidth="1"
                    />
                  </g>

                  {/* 2. Overhead Shower & Floor Drain */}
                  <g transform={`translate(${bathW * 0.72}, ${bathH * 0.18})`}>
                    {/* Circular Shower Floor Drain */}
                    <circle cx="0" cy="40" r="7" fill="#475569" stroke="#334155" strokeWidth="1" />
                    <circle cx="0" cy="40" r="3" fill="#1e293b" />
                    {/* Overhead Chrome Shower Arm & Head */}
                    <rect x="-2" y="0" width="4" height="18" fill="#cbd5e1" rx="1" />
                    <ellipse cx="0" cy="18" rx="10" ry="5" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
                  </g>

                  {/* 3. Washbasin & Tap Sink */}
                  <g transform={`translate(${bathW * 0.62}, ${bathH * 0.52})`}>
                    <rect
                      x="0"
                      y="0"
                      width="38"
                      height="32"
                      fill="#ffffff"
                      stroke="#9ca3af"
                      strokeWidth="1.5"
                      rx="4"
                    />
                    <ellipse cx="19" cy="17" rx="13" ry="10" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="1" />
                    {/* Chrome Mixer Tap */}
                    <circle cx="19" cy="5" r="3" fill="#64748b" />
                    <rect x="17.5" y="5" width="3" height="8" fill="#94a3b8" rx="1" />
                  </g>

                  {/* 4. Bathroom Door with Swing Arc */}
                  <g transform={`translate(${bathW * 0.05}, ${bathH - 8})`}>
                    {/* Swing Trajectory Arc */}
                    <path
                      d="M 0 0 A 42 42 0 0 1 42 -42"
                      fill="none"
                      stroke="#cbd5e1"
                      strokeWidth="1.2"
                      strokeDasharray="3 3"
                    />
                    {/* Door Leaf */}
                    <rect
                      x="0"
                      y="-42"
                      width="42"
                      height="7"
                      fill="#c5a882"
                      stroke="#6b4f35"
                      strokeWidth="1"
                      rx="1"
                      transform="rotate(45, 0, 0)"
                    />
                  </g>

                  {/* Interior Partition Wall Border */}
                  <rect
                    width={bathW}
                    height={bathH}
                    fill="none"
                    stroke="#2b2d30"
                    strokeWidth="10"
                  />
                </g>
              );
            }

            // -------------------------------------------------------------
            // C. AIR CONDITIONER (AC) (Top Wall Split Unit)
            // -------------------------------------------------------------
            if (elCat === 'ac' || el.type === 'ac') {
              return (
                <g
                  key={el.id}
                  transform={`translate(${elX}, ${elY}) rotate(${elRot})`}
                  filter="url(#object-shadow)"
                  className="cursor-pointer"
                  onClick={() => onElementClick && onElementClick(el)}
                  onMouseEnter={() => setHoveredElementId(el.id)}
                  onMouseLeave={() => setHoveredElementId(null)}
                >
                  {/* Outer White Housing */}
                  <rect
                    width={elW}
                    height={elH}
                    fill="#fdfdfd"
                    stroke="#94a3b8"
                    strokeWidth="1.2"
                    rx="3"
                  />
                  {/* Front Air Discharge Louvers */}
                  <line
                    x1="8"
                    y1={elH * 0.65}
                    x2={elW - 8}
                    y2={elH * 0.65}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                  />
                  <line
                    x1="8"
                    y1={elH * 0.8}
                    x2={elW - 8}
                    y2={elH * 0.8}
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                  {/* Cooling Indicator LED */}
                  <circle cx={elW - 12} cy="8" r="2" fill="#0284c7" />
                </g>
              );
            }

            // -------------------------------------------------------------
            // D. SMART TV (Wall-Mounted Screen Panel)
            // -------------------------------------------------------------
            if (elCat === 'tv' || el.type === 'tv') {
              return (
                <g
                  key={el.id}
                  transform={`translate(${elX}, ${elY}) rotate(${elRot})`}
                  filter="url(#object-shadow)"
                  className="cursor-pointer"
                  onClick={() => onElementClick && onElementClick(el)}
                  onMouseEnter={() => setHoveredElementId(el.id)}
                  onMouseLeave={() => setHoveredElementId(null)}
                >
                  {/* Wall Mount Bracket */}
                  <rect
                    x={elW * 0.35}
                    y="-5"
                    width={elW * 0.3}
                    height="6"
                    fill="#334155"
                    rx="1"
                  />
                  {/* Slim Black Glass Display Panel */}
                  <rect
                    width={elW}
                    height={elH}
                    fill="#111827"
                    stroke="#374151"
                    strokeWidth="1.5"
                    rx="2"
                  />
                  <rect
                    x="2"
                    y="2"
                    width={Math.max(4, elW - 4)}
                    height={Math.max(4, elH - 4)}
                    fill="#1f2937"
                    rx="1"
                  />
                  {/* Screen Gloss Glare Line */}
                  <line
                    x1="8"
                    y1="3"
                    x2={elW * 0.65}
                    y2="3"
                    stroke="#4b5563"
                    strokeWidth="1"
                  />
                </g>
              );
            }

            // -------------------------------------------------------------
            // E. WINDOW (Bottom Wall Sliding Double Pane)
            // -------------------------------------------------------------
            if (elCat === 'window' || el.type === 'window') {
              return (
                <g
                  key={el.id}
                  transform={`translate(${elX}, ${elY}) rotate(${elRot})`}
                  className="cursor-pointer"
                >
                  {/* Window Wall Cutout / Sill */}
                  <rect
                    width={elW}
                    height={elH}
                    fill="#e2e8f0"
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                  {/* Double Sliding Glass Tracks */}
                  <line
                    x1="4"
                    y1={elH * 0.35}
                    x2={elW * 0.55}
                    y2={elH * 0.35}
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1={elW * 0.45}
                    y1={elH * 0.65}
                    x2={elW - 4}
                    y2={elH * 0.65}
                    stroke="#38bdf8"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </g>
              );
            }

            // -------------------------------------------------------------
            // F. ENTRY DOOR (Bottom-Right Door with Swing Arc)
            // -------------------------------------------------------------
            if (elCat === 'door' || el.type === 'door') {
              return (
                <g key={el.id} transform={`translate(${elX}, ${elY})`}>
                  {/* Quarter-circle Opening Trajectory */}
                  <path
                    d="M 0 0 A 70 70 0 0 0 70 -70"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  {/* Wooden Door Leaf */}
                  <rect
                    x="0"
                    y="-70"
                    width="10"
                    height="70"
                    fill="#c5a882"
                    stroke="#6b4f35"
                    strokeWidth="1.2"
                    rx="1"
                    transform="rotate(35, 0, 0)"
                  />
                  {/* Door Hinge Pivot Point */}
                  <circle cx="0" cy="0" r="4" fill="#334155" />
                </g>
              );
            }

            // -------------------------------------------------------------
            // G. STUDY DESK & CHAIR
            // -------------------------------------------------------------
            if (elCat === 'table' || el.type === 'studyDesk') {
              return (
                <g
                  key={el.id}
                  transform={`translate(${elX}, ${elY}) rotate(${elRot})`}
                  filter="url(#object-shadow)"
                  className="cursor-pointer"
                  onClick={() => onElementClick && onElementClick(el)}
                >
                  {/* Wooden Desk Surface */}
                  <rect
                    width={elW}
                    height={elH}
                    fill="#d7c4a7"
                    stroke="#785938"
                    strokeWidth="1.5"
                    rx="2"
                  />
                  {/* Laptop / Notebook */}
                  <rect
                    x={elW * 0.3}
                    y={elH * 0.2}
                    width={elW * 0.4}
                    height={elH * 0.4}
                    fill="#334155"
                    rx="1"
                  />
                  {/* Ergonomic Chair */}
                  <circle
                    cx={elW * 0.5}
                    cy={elH + 14}
                    r="10"
                    fill="#475569"
                    stroke="#1e293b"
                    strokeWidth="1"
                  />
                </g>
              );
            }

            // -------------------------------------------------------------
            // H. BEDS (Top-Down Vector Bed with Headboard, Pillow & Runner)
            // -------------------------------------------------------------
            if (el.type === 'bed' || elCat === 'bed') {
              const bedW = elW;
              const bedH = elH;
              const bedX = elX;
              const bedY = elY;
              const bedRot = elRot;
              const bedInfo = getBedInfo(el);
              const isOccupied = bedInfo?.isOccupied;
              const isMaintenance = bedInfo?.isMaintenance;
              const isReserved = bedInfo?.isReserved;
              const isAvailable = bedInfo?.isAvailable;

              // Color Theme according to Occupancy state
              const frameStroke = isSelected
                ? '#0ea5e9'
                : isOccupied
                ? '#e11d48'
                : isAvailable
                ? '#10b981'
                : isReserved
                ? '#f59e0b'
                : '#64748b';

              const runnerColor = isOccupied ? '#f43f5e' : isAvailable ? '#8694a0' : '#a1a1aa';

              return (
                <g
                  key={el.id}
                  transform={`translate(${bedX}, ${bedY}) rotate(${bedRot})`}
                  filter={isSelected ? 'url(#selection-glow)' : 'url(#object-shadow)'}
                  className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-all`}
                  onClick={() => {
                    if (!interactive) return;
                    if (onBedClick) onBedClick(bedInfo, el, room);
                  }}
                  onMouseEnter={() => setHoveredElementId(el.id)}
                  onMouseLeave={() => setHoveredElementId(null)}
                >
                  {/* 1. Solid Wooden Bed Frame & Outer Border */}
                  <rect
                    x="-2"
                    y="-2"
                    width={bedW + 4}
                    height={bedH + 4}
                    fill="#5c3d2e"
                    stroke={frameStroke}
                    strokeWidth={isSelected ? 3 : 1.5}
                    rx="5"
                  />

                  {/* 2. Top Wooden Headboard Panel */}
                  <rect
                    x="0"
                    y="0"
                    width={bedW}
                    height="14"
                    fill="#452c20"
                    rx="3"
                  />

                  {/* 3. Soft White Linen Mattress */}
                  <rect
                    x="2"
                    y="12"
                    width={Math.max(10, bedW - 4)}
                    height={Math.max(10, bedH - 16)}
                    fill="url(#mattress-gradient)"
                    rx="4"
                  />

                  {/* 4. Puffy Pillow with Contour Stitching */}
                  <g transform={`translate(${bedW * 0.12}, 18)`}>
                    <rect
                      width={Math.max(8, bedW * 0.76)}
                      height="30"
                      fill="#ffffff"
                      stroke="#cbd5e1"
                      strokeWidth="1.2"
                      rx="6"
                    />
                    {/* Pillow center indentation / shadow */}
                    <ellipse
                      cx={(bedW * 0.76) / 2}
                      cy="15"
                      rx={bedW * 0.22}
                      ry="6"
                      fill="#f1f5f9"
                    />
                  </g>

                  {/* 5. Folded Accent Bed Runner (Foot of the Bed) */}
                  <rect
                    x="2"
                    y={bedH - 46}
                    width={Math.max(10, bedW - 4)}
                    height="28"
                    fill={runnerColor}
                    opacity="0.85"
                    rx="1"
                  />

                  {/* 6. Bed Label / Identification */}
                  {showLabels && (
                    <text
                      x={bedW / 2}
                      y={bedH * 0.52}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-sans font-bold text-[13px] fill-neutral-800 dark:fill-neutral-900 pointer-events-none"
                    >
                      {el.label || bedInfo?.bedNumber || 'Bed'}
                    </text>
                  )}

                  {/* 7. Occupancy Status Badge & Resident Name */}
                  <g transform={`translate(${bedW / 2}, ${bedH * 0.66})`}>
                    <rect
                      x="-32"
                      y="-8"
                      width="64"
                      height="16"
                      rx="8"
                      fill={
                        isOccupied
                          ? '#ffe4e6'
                          : isAvailable
                          ? '#d1fae5'
                          : isReserved
                          ? '#fef3c7'
                          : '#f1f5f9'
                      }
                      stroke={
                        isOccupied
                          ? '#f43f5e'
                          : isAvailable
                          ? '#10b981'
                          : isReserved
                          ? '#f59e0b'
                          : '#94a3b8'
                      }
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[8.5px] font-black uppercase tracking-wider ${
                        isOccupied
                          ? 'fill-rose-700'
                          : isAvailable
                          ? 'fill-emerald-800'
                          : isReserved
                          ? 'fill-amber-800'
                          : 'fill-slate-700'
                      }`}
                    >
                      {isOccupied ? 'Occupied' : isAvailable ? 'Available' : bedInfo?.status || 'Available'}
                    </text>
                  </g>

                  {/* Occupant Name if Occupied */}
                  {isOccupied && bedInfo?.residentName && (
                    <text
                      x={bedW / 2}
                      y={bedH - 54}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-[9.5px] font-semibold fill-rose-900 font-sans pointer-events-none truncate"
                    >
                      {bedInfo.residentName.split(' ')[0]}
                    </text>
                  )}
                </g>
              );
            }

            return null;
          })}

          {/* 3. SOLID PERIMETER ARCHITECTURAL WALLS */}
          {/* Top Wall */}
          <rect x="0" y="0" width={width} height={wallThickness} fill="url(#wall-gradient)" />
          {/* Bottom Wall */}
          <rect x="0" y={height - wallThickness} width={width} height={wallThickness} fill="url(#wall-gradient)" />
          {/* Left Wall */}
          <rect x="0" y="0" width={wallThickness} height={height} fill="url(#wall-gradient)" />
          {/* Right Wall */}
          <rect x={width - wallThickness} y="0" width={wallThickness} height={height} fill="url(#wall-gradient)" />

          {/* 4. COMPASS ROSE / BLUEPRINT EMBLEM IN CORNER */}
          <g transform={`translate(${width - 120}, ${height - 110})`} opacity="0.8">
            <circle cx="28" cy="28" r="24" fill="none" stroke="#64748b" strokeWidth="1" />
            <line x1="28" y1="0" x2="28" y2="56" stroke="#64748b" strokeWidth="1" />
            <line x1="0" y1="28" x2="56" y2="28" stroke="#64748b" strokeWidth="1" />
            {/* North Indicator Needle */}
            <polygon points="28,6 23,28 33,28" fill="#334155" />
            <polygon points="28,50 23,28 33,28" fill="#94a3b8" />
            <text x="28" y="-4" textAnchor="middle" className="text-[10px] font-bold fill-slate-600 font-mono">
              N
            </text>
            <text x="65" y="24" className="text-[9px] font-semibold fill-slate-500 tracking-tight">
              Top View
            </text>
            <text x="65" y="36" className="text-[8px] fill-slate-400 font-sans">
              (Architectural Plan)
            </text>
          </g>

          {/* Room Title Tag in Top-Left Corner */}
          <text
            x={wallThickness + 14}
            y={wallThickness - 6}
            className="text-[11px] font-mono font-bold uppercase tracking-wider fill-slate-400"
          >
            Room {room?.roomNumber || '101'} Floor Plan
          </text>
        </svg>
      </div>

      {/* Interactive Legend Bar & Architectural Item Reference matching Reference Image */}
      {showLegend && (
        <div className="w-full mt-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Live Bed Occupancy Status Badges */}
          <div className="flex items-center gap-4 font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" />
              Available
            </span>
            <span className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400">
              <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />
              Occupied
            </span>
            <span className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <span className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-500/20" />
              Reserved
            </span>
            <span className="flex items-center gap-1.5 text-slate-500">
              <span className="w-3 h-3 rounded-full bg-slate-400" />
              Maintenance
            </span>
          </div>

          {/* Quick Facilities Summary */}
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <span className="font-medium text-slate-700 dark:text-slate-300">Room Facilities:</span>
            {roomFacilities.hasAc && <span className="bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded">❄️ AC</span>}
            {roomFacilities.hasTv && <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded">📺 TV</span>}
            {roomFacilities.hasAttachedWashroom && <span className="bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 px-2 py-0.5 rounded">🚿 Attached Bath</span>}
            {roomFacilities.hasCupboard && <span className="bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded">🚪 Lockers</span>}
            {roomFacilities.hasWindow && <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">🪟 Window</span>}
          </div>
        </div>
      )}
    </div>
  );
}
