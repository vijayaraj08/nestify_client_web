import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import {
  BED_TYPES,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  WALL_THICKNESS,
  GRID_SIZE,
  generateArchitecturalLayout,
  normalizeLayout,
  clampElementWithinBounds,
  getElementBounds,
  updateElementPosition,
  updateElementSize,
  makeLayoutElement,
  snapToGrid,
} from '../../utils/roomLayoutEngine';
import {
  RotateCw,
  Trash2,
  Layers,
  Sparkles,
  Bed,
  Tv,
  Wind,
  Box,
  Bath,
  DoorOpen,
  AppWindow,
  Lock,
  Unlock,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Move,
  ChevronUp,
  ChevronDown,
  Table2,
} from 'lucide-react';

/**
 * Interactive 2D Room Map Layout Editor - Version 2
 *
 * Features:
 *   - Zoom & Pan (react-zoom-pan-pinch)
 *   - Drag elements to update position.x / position.y
 *   - Resize selected element (resize handles on corners & edges)
 *   - Rotate 90° increments
 *   - Bed size picker
 *   - Locker doors picker
 *   - Lock / unlock elements
 *   - z-index control (move forward / backward)
 *   - Grid snap
 *   - Boundary clamping
 *   - Element deletion
 *   - Auto-arrange reset
 *   - Separate layout save button (calls onSaveLayout)
 */
export default function RoomMapEditor({
  initialLayout,
  roomNumber = '101',
  capacity = 2,
  facilities = {},
  onChange,
  onSaveLayout,
  hostelId,
  roomId,
}) {
  const [layout, setLayout] = useState(() =>
    normalizeLayout(initialLayout, { roomNumber, capacity, facilities })
  );

  useEffect(() => {
    if (initialLayout) {
      setLayout(normalizeLayout(initialLayout, { roomNumber, capacity, facilities }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialLayout, roomNumber]);

  const [selectedId, setSelectedId] = useState(null);
  const [draggingId, setDraggingId] = useState(null);
  const [resizingId, setResizingId] = useState(null);
  const [resizeHandle, setResizeHandle] = useState(null); // 'se' | 'sw' | 'ne' | 'nw' | 'e' | 'w' | 's' | 'n'

  const [gridSnap, setGridSnap] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'success' | 'error' | null

  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const resizeStartRef = useRef({ x: 0, y: 0, w: 0, h: 0, origX: 0, origY: 0 });
  const svgRef = useRef(null);
  const transformRef = useRef(null);

  const canvas = layout.canvas || { width: CANVAS_WIDTH, height: CANVAS_HEIGHT };
  const cW = canvas.width;
  const cH = canvas.height;
  const wall = WALL_THICKNESS;

  const selectedEl = layout.elements?.find((el) => el.id === selectedId) || null;

  const updateState = useCallback((newLayout) => {
    setLayout(newLayout);
    if (onChange) onChange(newLayout);
  }, [onChange]);

  // ─── SVG Coordinate Conversion ───────────────────────────────────────────

  const getSvgPoint = (e) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX ?? (e.touches?.[0]?.clientX ?? 0);
    pt.y = e.clientY ?? (e.touches?.[0]?.clientY ?? 0);
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  };

  // ─── Drag Handlers ───────────────────────────────────────────────────────

  const handlePointerDown = (e, el) => {
    if (el.locked) {
      setSelectedId(el.id);
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    setSelectedId(el.id);
    setDraggingId(el.id);

    const pt = getSvgPoint(e);
    const bounds = getElementBounds(el);
    dragOffsetRef.current = { x: pt.x - bounds.x, y: pt.y - bounds.y };

    // Capture pointer for smooth drag even outside SVG
    svgRef.current?.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const pt = getSvgPoint(e);

    if (draggingId) {
      const rawX = pt.x - dragOffsetRef.current.x;
      const rawY = pt.y - dragOffsetRef.current.y;
      const snapped = gridSnap
        ? { x: snapToGrid(rawX), y: snapToGrid(rawY) }
        : { x: Math.round(rawX), y: Math.round(rawY) };

      const updated = layout.elements.map((el) => {
        if (el.id !== draggingId) return el;
        const moved = updateElementPosition(el, snapped.x, snapped.y);
        return clampElementWithinBounds(moved, canvas, wall);
      });
      updateState({ ...layout, elements: updated });
    }

    if (resizingId && resizeHandle) {
      const { x: startX, y: startY, w: startW, h: startH, origX, origY } = resizeStartRef.current;
      const dx = pt.x - startX;
      const dy = pt.y - startY;
      let newW = startW;
      let newH = startH;
      let newX = origX;
      let newY = origY;

      // Handle-based resize math
      if (resizeHandle.includes('e')) newW = Math.max(30, startW + dx);
      if (resizeHandle.includes('s')) newH = Math.max(30, startH + dy);
      if (resizeHandle.includes('w')) { newW = Math.max(30, startW - dx); newX = origX + startW - newW; }
      if (resizeHandle.includes('n')) { newH = Math.max(30, startH - dy); newY = origY + startH - newH; }

      if (gridSnap) { newW = snapToGrid(newW); newH = snapToGrid(newH); newX = snapToGrid(newX); newY = snapToGrid(newY); }

      const updated = layout.elements.map((el) => {
        if (el.id !== resizingId) return el;
        const resized = updateElementSize(el, newW, newH);
        return clampElementWithinBounds(
          updateElementPosition(resized, newX, newY),
          canvas, wall
        );
      });
      updateState({ ...layout, elements: updated });
    }
  };

  const handlePointerUp = (e) => {
    svgRef.current?.releasePointerCapture?.(e.pointerId);
    setDraggingId(null);
    setResizingId(null);
    setResizeHandle(null);
  };

  // ─── Resize Handle Pointer Down ──────────────────────────────────────────

  const handleResizeStart = (e, el, handle) => {
    e.stopPropagation();
    e.preventDefault();
    const pt = getSvgPoint(e);
    const bounds = getElementBounds(el);
    resizeStartRef.current = {
      x: pt.x, y: pt.y,
      w: bounds.width, h: bounds.height,
      origX: bounds.x, origY: bounds.y,
    };
    setResizingId(el.id);
    setResizeHandle(handle);
    svgRef.current?.setPointerCapture?.(e.pointerId);
  };

  // ─── Element Actions ─────────────────────────────────────────────────────

  const handleRotate = () => {
    if (!selectedEl || selectedEl.locked) return;
    const updated = layout.elements.map((el) =>
      el.id === selectedId
        ? { ...el, rotation: ((Number(el.rotation) || 0) + 90) % 360 }
        : el
    );
    updateState({ ...layout, elements: updated });
  };

  const handleDelete = () => {
    if (!selectedEl) return;
    const filtered = layout.elements.filter((el) => el.id !== selectedId);
    setSelectedId(null);
    updateState({ ...layout, elements: filtered });
  };

  const handleToggleLock = () => {
    if (!selectedEl) return;
    const updated = layout.elements.map((el) =>
      el.id === selectedId ? { ...el, locked: !el.locked } : el
    );
    updateState({ ...layout, elements: updated });
  };

  const handleZIndexChange = (dir) => {
    if (!selectedEl) return;
    const updated = layout.elements.map((el) =>
      el.id === selectedId
        ? { ...el, zIndex: Math.max(1, (el.zIndex || 5) + (dir === 'up' ? 1 : -1)) }
        : el
    );
    updateState({ ...layout, elements: updated });
  };

  const handleBedTypeChange = (bedTypeId) => {
    if (!selectedEl) return;
    const bedDef = BED_TYPES[bedTypeId] || BED_TYPES.single;
    const updated = layout.elements.map((el) => {
      if (el.id !== selectedId) return el;
      const resized = updateElementSize(el, bedDef.width, bedDef.height);
      return clampElementWithinBounds(
        { ...resized, properties: { ...el.properties, bedType: bedTypeId } },
        canvas, wall
      );
    });
    updateState({ ...layout, elements: updated });
  };

  const handleLockerDoorsChange = (doors) => {
    if (!selectedEl) return;
    const d = Math.max(1, Number(doors) || 4);
    const updated = layout.elements.map((el) =>
      el.id === selectedId
        ? { ...el, properties: { ...el.properties, doors: d, sublabel: `${d} Compartments` } }
        : el
    );
    updateState({ ...layout, elements: updated });
  };

  // ─── Add New Element ─────────────────────────────────────────────────────

  const handleAddElement = (type) => {
    const existCount = (layout.elements || []).filter((e) => e.category === type || (e.type === 'bed' && type === 'bed')).length;
    const letter = String.fromCharCode(65 + existCount);
    const suffix = existCount > 0 ? `_${existCount + 1}` : '';

    const defaults = {
      bed: () => {
        const bedDef = BED_TYPES.single;
        const nextBed = (layout.elements || []).filter((e) => e.type === 'bed').length;
        const bedLetter = String.fromCharCode(65 + nextBed);
        return makeLayoutElement({
          id: `el_bed_${roomNumber}_${bedLetter}`,
          type: 'bed', category: 'bed',
          bedNumber: `${roomNumber}-${bedLetter}`,
          label: `Bed ${nextBed + 1} (${roomNumber}-${bedLetter})`,
          x: Math.round(cW * 0.35), y: Math.round(cH * 0.35),
          width: bedDef.width, height: bedDef.height,
          zIndex: 10,
          properties: { bedType: 'single', bedIndex: nextBed + 1 },
        });
      },
      locker: () => makeLayoutElement({
        id: `el_locker_${roomNumber}${suffix}`,
        type: 'furniture', category: 'locker',
        label: existCount === 0 ? 'Lockers' : `Lockers ${existCount + 1}`,
        x: wall + 20 + existCount * 150, y: wall + 20,
        width: 140, height: 80,
        zIndex: 5,
        properties: { doors: 4, sublabel: '4 Compartments' },
      }),
      table: () => makeLayoutElement({
        id: `el_desk_${roomNumber}${suffix}`,
        type: 'furniture', category: 'table',
        label: existCount === 0 ? 'Study Desk' : `Study Desk ${existCount + 1}`,
        x: wall + 20 + existCount * 80, y: cH - wall - 70,
        width: 70, height: 50,
        zIndex: 5,
        properties: { hasChair: true, sublabel: 'Workstation' },
      }),
      tv: () => makeLayoutElement({
        id: `el_tv_${roomNumber}${suffix}`,
        type: 'facility', category: 'tv',
        label: existCount === 0 ? 'Smart TV' : `TV ${existCount + 1}`,
        x: Math.round(cW * 0.45), y: wall + 40,
        width: 90, height: 18,
        zIndex: 5,
        properties: { sublabel: '50" Smart' },
      }),
      ac: () => makeLayoutElement({
        id: `el_ac_${roomNumber}${suffix}`,
        type: 'facility', category: 'ac',
        label: existCount === 0 ? 'Split AC' : `AC ${existCount + 1}`,
        x: Math.round(cW * 0.42), y: wall + 6,
        width: 110, height: 28,
        zIndex: 5,
        properties: { sublabel: '1.5T Inverter' },
      }),
      window: () => makeLayoutElement({
        id: `el_window_${roomNumber}${suffix}`,
        type: 'opening', category: 'window',
        label: 'Window',
        x: Math.round(cW * 0.3), y: cH - wall - 10,
        width: 160, height: 16,
        zIndex: 3,
        properties: { sublabel: 'Sliding Glass' },
      }),
      door: () => makeLayoutElement({
        id: `el_door_${roomNumber}${suffix}`,
        type: 'opening', category: 'door',
        label: 'Door',
        x: cW - wall - 90, y: cH - wall - 10,
        width: 70, height: 70,
        zIndex: 3,
        properties: { openDirection: 'inward_right' },
      }),
      washroom: () => makeLayoutElement({
        id: `el_washroom_${roomNumber}${suffix}`,
        type: 'facility', category: 'washroom',
        label: 'Bathroom',
        x: cW - wall - 170, y: wall + 10,
        width: 160, height: 170,
        zIndex: 5,
        properties: { fixtures: ['commode', 'shower', 'sink'] },
      }),
    };

    const factory = defaults[type];
    if (!factory) return;
    const newEl = factory();
    const clamped = clampElementWithinBounds(newEl, canvas, wall);
    setSelectedId(newEl.id);
    updateState({ ...layout, elements: [...layout.elements, clamped] });
  };

  // ─── Auto-Arrange ────────────────────────────────────────────────────────

  const handleAutoArrange = () => {
    const fresh = generateArchitecturalLayout({ roomNumber, capacity, facilities, canvas });
    setSelectedId(null);
    updateState(fresh);
  };

  // ─── Save Layout ─────────────────────────────────────────────────────────

  const handleSaveLayout = async () => {
    if (!onSaveLayout) return;
    setIsSaving(true);
    setSaveStatus(null);
    try {
      const result = await onSaveLayout(layout);
      setSaveStatus(result?.success === false ? 'error' : 'success');
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  // ─── Render Resize Handles ───────────────────────────────────────────────

  const renderResizeHandles = (el) => {
    const bounds = getElementBounds(el);
    const { width: w, height: h } = bounds;
    const hs = 8; // handle size
    const handles = [
      { id: 'nw', cx: 0, cy: 0 },
      { id: 'n', cx: w / 2, cy: 0 },
      { id: 'ne', cx: w, cy: 0 },
      { id: 'e', cx: w, cy: h / 2 },
      { id: 'se', cx: w, cy: h },
      { id: 's', cx: w / 2, cy: h },
      { id: 'sw', cx: 0, cy: h },
      { id: 'w', cx: 0, cy: h / 2 },
    ];
    const cursors = { nw: 'nw-resize', n: 'n-resize', ne: 'ne-resize', e: 'e-resize', se: 'se-resize', s: 's-resize', sw: 'sw-resize', w: 'w-resize' };

    return handles.map((hndl) => (
      <rect
        key={hndl.id}
        x={hndl.cx - hs / 2}
        y={hndl.cy - hs / 2}
        width={hs}
        height={hs}
        fill="#0ea5e9"
        stroke="#fff"
        strokeWidth="1"
        rx="1.5"
        style={{ cursor: cursors[hndl.id] }}
        onPointerDown={(e) => !el.locked && handleResizeStart(e, el, hndl.id)}
      />
    ));
  };

  // ─── Render Element SVG ───────────────────────────────────────────────────

  const renderElement = (el) => {
    const bounds = getElementBounds(el);
    const { x: elX, y: elY, width: elW, height: elH } = bounds;
    const elRot = Number(el.rotation) || 0;
    const isSelected = selectedId === el.id;
    const isDragging = draggingId === el.id;
    const cat = el.category || el.type;

    const fill = {
      bed: '#3d1f10',
      locker: '#c5a882',
      washroom: '#75828a',
      ac: '#ffffff',
      tv: '#111827',
      table: '#d7c4a7',
      window: '#e2e8f0',
      door: 'transparent',
    }[cat] || '#6b7280';

    return (
      <g
        key={el.id}
        transform={`translate(${elX}, ${elY}) rotate(${elRot}, ${elW / 2}, ${elH / 2})`}
        style={{ cursor: el.locked ? 'default' : isDragging ? 'grabbing' : 'grab', opacity: isDragging ? 0.85 : 1 }}
        onPointerDown={(e) => handlePointerDown(e, el)}
        onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
      >
        {/* Main element shape */}
        {cat === 'bed' ? (
          <>
            <rect x={-2} y={-2} width={elW + 4} height={elH + 4} fill="#5c3d2e" rx="5"
              stroke={isSelected ? '#0ea5e9' : '#10b981'}
              strokeWidth={isSelected ? 3 : 1.5}
              strokeDasharray={isSelected ? '5 2' : 'none'} />
            <rect x={0} y={0} width={elW} height={14} fill="#452c20" rx="3" />
            <rect x={2} y={12} width={Math.max(10, elW - 4)} height={Math.max(10, elH - 16)} fill="#fff" rx="4" />
            <rect x={elW * 0.12} y={18} width={Math.max(8, elW * 0.76)} height={28} fill="#f1f5f9" stroke="#cbd5e1" rx="5" />
            <rect x={2} y={elH - 42} width={Math.max(10, elW - 4)} height={26} fill="#828d99" rx="1" />
            <text x={elW / 2} y={elH * 0.52} textAnchor="middle" style={{ fontSize: 12, fontWeight: 'bold', fill: '#1e293b', pointerEvents: 'none', userSelect: 'none' }}>
              {el.label || el.bedNumber || 'Bed'}
            </text>
          </>
        ) : cat === 'locker' || el.type === 'furniture' ? (
          <>
            <rect width={elW} height={elH} fill="url(#editor-wood-gradient)"
              stroke={isSelected ? '#0ea5e9' : '#5a422d'}
              strokeWidth={isSelected ? 3 : 1.5} rx="3" />
            {/* Locker compartment dividers */}
            {el.properties?.doors > 1 && Array.from({ length: el.properties.doors - 1 }).map((_, i) => (
              <line key={i}
                x1={elW * ((i + 1) / el.properties.doors)} y1={4}
                x2={elW * ((i + 1) / el.properties.doors)} y2={elH - 4}
                stroke="#7a5533" strokeWidth="1.5" />
            ))}
            <text x={elW / 2} y={elH / 2 + 4} textAnchor="middle"
              style={{ fontSize: 11, fontWeight: 'bold', fill: '#3b1f08', pointerEvents: 'none', userSelect: 'none' }}>
              {el.label || 'Lockers'}
            </text>
          </>
        ) : cat === 'washroom' ? (
          <>
            <rect width={elW} height={elH} fill="url(#editor-bath-pattern)" stroke={isSelected ? '#0ea5e9' : '#2b2d30'} strokeWidth={isSelected ? 4 : 6} />
            <rect x={12} y={12} width={Math.min(36, elW * 0.3)} height={14} fill="#fff" stroke="#9ca3af" rx="2" />
            <ellipse cx={Math.min(30, elW * 0.25)} cy={36} rx={14} ry={16} fill="#fff" stroke="#9ca3af" />
            <circle cx={elW - 36} cy={36} r={6} fill="#475569" />
            <rect x={elW - 46} y={elH - 46} width={34} height={28} fill="#fff" stroke="#9ca3af" rx="3" />
            <text x={elW / 2} y={elH / 2 + 10} textAnchor="middle"
              style={{ fontSize: 12, fontWeight: 'bold', fill: '#fff', pointerEvents: 'none', userSelect: 'none' }}>
              Bathroom
            </text>
          </>
        ) : cat === 'ac' ? (
          <>
            <rect width={elW} height={elH} fill="#fff" stroke={isSelected ? '#0ea5e9' : '#94a3b8'} strokeWidth={isSelected ? 2.5 : 1} rx="3" />
            <line x1={8} y1={18} x2={elW - 8} y2={18} stroke="#cbd5e1" strokeWidth={2} />
            <text x={elW / 2} y={14} textAnchor="middle" style={{ fontSize: 10, fontWeight: 'bold', fill: '#0c4a6e', pointerEvents: 'none', userSelect: 'none' }}>
              Split AC
            </text>
          </>
        ) : cat === 'tv' ? (
          <>
            <rect width={elW} height={elH} fill="#111827" stroke={isSelected ? '#0ea5e9' : '#374151'} strokeWidth={isSelected ? 2.5 : 1} rx="2" />
            <text x={elW / 2} y={13} textAnchor="middle" style={{ fontSize: 9, fontWeight: 'bold', fill: '#a5b4fc', pointerEvents: 'none', userSelect: 'none' }}>
              Smart TV
            </text>
          </>
        ) : cat === 'table' ? (
          <>
            <rect width={elW} height={elH} fill="#d7c4a7" stroke={isSelected ? '#0ea5e9' : '#785938'} strokeWidth={isSelected ? 2.5 : 1} rx="2" />
            {el.properties?.hasChair && <circle cx={elW / 2} cy={elH + 12} r={8} fill="#475569" />}
            <text x={elW / 2} y={elH / 2 + 4} textAnchor="middle" style={{ fontSize: 10, fontWeight: 'bold', fill: '#431a03', pointerEvents: 'none', userSelect: 'none' }}>
              {el.label || 'Desk'}
            </text>
          </>
        ) : cat === 'window' ? (
          <>
            <rect width={elW} height={elH} fill="#bfdbfe" stroke={isSelected ? '#0ea5e9' : '#64748b'} strokeWidth={isSelected ? 3 : 1.5} />
            <line x1={4} y1={6} x2={elW - 4} y2={6} stroke="#38bdf8" strokeWidth={3} />
          </>
        ) : cat === 'door' ? (
          <>
            <path d={`M 0 0 A ${elW * 0.9} ${elW * 0.9} 0 0 0 ${elW * 0.9} ${-elW * 0.9}`} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
            <rect x="0" y={-elH * 0.9} width="8" height={elH * 0.9} fill="#c5a882" stroke="#6b4f35" strokeWidth="1" transform={`rotate(35, 0, 0)`} />
            <circle cx="0" cy="0" r="4" fill="#334155" />
            {isSelected && <text x={10} y={-10} style={{ fontSize: 9, fill: '#0ea5e9', fontWeight: 'bold', pointerEvents: 'none' }}>Door</text>}
          </>
        ) : (
          <rect width={elW} height={elH} fill={fill} stroke={isSelected ? '#0ea5e9' : '#64748b'} strokeWidth={isSelected ? 2.5 : 1} rx="3" />
        )}

        {/* Lock indicator */}
        {el.locked && (
          <text x={elW - 12} y={12} style={{ fontSize: 10, fill: '#fbbf24', pointerEvents: 'none' }}>🔒</text>
        )}

        {/* Selection outline + resize handles */}
        {isSelected && (
          <g>
            <rect
              x={-5} y={-5}
              width={elW + 10} height={elH + 10}
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="1.5"
              strokeDasharray="5 3"
            />
            <text x={0} y={-8} style={{ fontSize: 9, fontFamily: 'monospace', fill: '#0369a1', fontWeight: 'bold', pointerEvents: 'none' }}>
              {el.label || el.category} ({Math.round(elX)}, {Math.round(elY)}) {elW}×{elH}
            </text>
            {!el.locked && renderResizeHandles(el)}
          </g>
        )}
      </g>
    );
  };

  // ─── JSX ─────────────────────────────────────────────────────────────────

  return (
    <div className="w-full space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-900 text-white shadow-md">
        {/* Add Elements */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Add:</span>
          {[
            { type: 'bed', icon: <Bed size={12} />, label: 'Bed', color: 'emerald' },
            { type: 'table', icon: <Table2 size={12} />, label: 'Desk', color: 'blue' },
            { type: 'locker', icon: <Box size={12} />, label: 'Locker', color: 'amber' },
            { type: 'tv', icon: <Tv size={12} />, label: 'TV', color: 'indigo' },
            { type: 'ac', icon: <Wind size={12} />, label: 'AC', color: 'sky' },
            { type: 'washroom', icon: <Bath size={12} />, label: 'Bath', color: 'teal' },
            { type: 'window', icon: <AppWindow size={12} />, label: 'Window', color: 'cyan' },
            { type: 'door', icon: <DoorOpen size={12} />, label: 'Door', color: 'rose' },
          ].map(({ type, icon, label, color }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleAddElement(type)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-${color}-600/25 hover:bg-${color}-600/45 text-${color}-300 border border-${color}-500/40 text-[10px] font-semibold transition-all`}
            >
              {icon} +{label}
            </button>
          ))}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Grid snap toggle */}
          <button
            type="button"
            onClick={() => setGridSnap((v) => !v)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border transition-all ${
              gridSnap
                ? 'bg-primary-600/30 border-primary-500/50 text-primary-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Layers size={11} /> Grid Snap {gridSnap ? 'ON' : 'OFF'}
          </button>

          {/* Zoom controls */}
          <button type="button" title="Zoom In" onClick={() => transformRef.current?.zoomIn()}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all">
            <ZoomIn size={13} />
          </button>
          <button type="button" title="Zoom Out" onClick={() => transformRef.current?.zoomOut()}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all">
            <ZoomOut size={13} />
          </button>
          <button type="button" title="Reset View" onClick={() => transformRef.current?.resetTransform()}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all">
            <Maximize2 size={13} />
          </button>

          {/* Auto-arrange */}
          <button
            type="button"
            onClick={handleAutoArrange}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-[10px] font-bold shadow-sm transition-all"
          >
            <Sparkles size={12} /> Auto-Arrange
          </button>

          {/* Save Layout (only if onSaveLayout provided) */}
          {onSaveLayout && (
            <button
              type="button"
              onClick={handleSaveLayout}
              disabled={isSaving}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold shadow-sm transition-all ${
                saveStatus === 'success' ? 'bg-emerald-600 text-white' :
                saveStatus === 'error' ? 'bg-rose-600 text-white' :
                'bg-slate-700 hover:bg-slate-600 text-white'
              } disabled:opacity-60`}
            >
              {isSaving ? '…Saving' : saveStatus === 'success' ? '✓ Saved!' : saveStatus === 'error' ? '✗ Failed' : '💾 Save Layout'}
            </button>
          )}
        </div>
      </div>

      {/* Canvas with Zoom/Pan */}
      <div
        className="relative w-full rounded-2xl bg-neutral-950 border-2 border-slate-800 shadow-inner overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        <TransformWrapper
          ref={transformRef}
          disabled={Boolean(draggingId || resizingId)}
          minScale={0.3}
          maxScale={4}
          limitToBounds={false}
          panning={{ velocityDisabled: true }}
        >
          <TransformComponent
            wrapperStyle={{ width: '100%', maxHeight: '70vh', overflow: 'hidden' }}
            contentStyle={{ width: '100%' }}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${cW} ${cH}`}
              className="w-full h-auto block select-none"
              style={{ touchAction: 'none' }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={() => setSelectedId(null)}
            >
              <defs>
                <pattern id="editor-tile-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                  <rect width="30" height="30" fill="#f5f1e8" stroke="#e8e2d5" strokeWidth="0.6" />
                </pattern>
                <pattern id="editor-grid-pattern" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                  <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#d1ccc0" strokeWidth="0.3" />
                </pattern>
                <pattern id="editor-bath-pattern" width="24" height="24" patternUnits="userSpaceOnUse">
                  <rect width="24" height="24" fill="#75828a" stroke="#637078" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="editor-wood-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c5a882" />
                  <stop offset="100%" stopColor="#9e7e57" />
                </linearGradient>
              </defs>

              {/* Floor tile */}
              <rect x={wall} y={wall} width={cW - wall * 2} height={cH - wall * 2} fill="url(#editor-tile-pattern)" />

              {/* Grid overlay (when snap is on) */}
              {gridSnap && (
                <rect x={wall} y={wall} width={cW - wall * 2} height={cH - wall * 2} fill="url(#editor-grid-pattern)" opacity={0.6} />
              )}

              {/* Room boundary indicator */}
              <rect x={wall} y={wall} width={cW - wall * 2} height={cH - wall * 2}
                fill="none" stroke="#4b5563" strokeWidth="1" strokeDasharray="8 4" opacity={0.4} />

              {/* Elements sorted by zIndex */}
              {[...(layout.elements || [])]
                .sort((a, b) => (a.zIndex || 5) - (b.zIndex || 5))
                .map((el) => renderElement(el))}

              {/* Perimeter Walls */}
              <rect x={0} y={0} width={cW} height={wall} fill="#1e2029" />
              <rect x={0} y={cH - wall} width={cW} height={wall} fill="#1e2029" />
              <rect x={0} y={0} width={wall} height={cH} fill="#1e2029" />
              <rect x={cW - wall} y={0} width={wall} height={cH} fill="#1e2029" />

              {/* Canvas dimensions label */}
              <text x={cW - wall - 4} y={cH - wall - 4} textAnchor="end"
                style={{ fontSize: 9, fill: '#6b7280', fontFamily: 'monospace' }}>
                {cW}×{cH} cm
              </text>
            </svg>
          </TransformComponent>
        </TransformWrapper>
      </div>

      {/* Inspector Panel */}
      {selectedEl ? (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
          {/* Info */}
          <div className="flex items-center gap-3">
            <span className="font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              <span className="text-primary-600 dark:text-primary-400">{selectedEl.label || selectedEl.category}</span>
            </span>
            <span className="text-slate-400 font-mono">
              X:{Math.round(getElementBounds(selectedEl).x)} Y:{Math.round(getElementBounds(selectedEl).y)}
            </span>
            <span className="text-slate-400 font-mono">
              {Math.round(getElementBounds(selectedEl).width)}×{Math.round(getElementBounds(selectedEl).height)} cm
            </span>
            <span className="text-slate-400">Rot:{selectedEl.rotation || 0}° | z:{selectedEl.zIndex || 5}</span>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Bed size picker */}
            {selectedEl.type === 'bed' && (
              <select
                value={selectedEl.properties?.bedType || 'single'}
                onChange={(e) => handleBedTypeChange(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold"
              >
                {Object.values(BED_TYPES).map((bt) => (
                  <option key={bt.id} value={bt.id}>{bt.name} ({bt.width}×{bt.height})</option>
                ))}
              </select>
            )}

            {/* Locker doors */}
            {selectedEl.category === 'locker' && (
              <select
                value={selectedEl.properties?.doors || 4}
                onChange={(e) => handleLockerDoorsChange(e.target.value)}
                className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold"
              >
                {[1, 2, 3, 4, 5, 6, 8].map((n) => (
                  <option key={n} value={n}>{n} Compartments</option>
                ))}
              </select>
            )}

            {/* Z-index */}
            <button type="button" onClick={() => handleZIndexChange('up')}
              title="Bring Forward"
              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300">
              <ChevronUp size={13} />
            </button>
            <button type="button" onClick={() => handleZIndexChange('down')}
              title="Send Backward"
              className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300">
              <ChevronDown size={13} />
            </button>

            {/* Rotate */}
            <button type="button" onClick={handleRotate}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200 font-semibold transition-all">
              <RotateCw size={12} /> Rotate 90°
            </button>

            {/* Lock */}
            <button type="button" onClick={handleToggleLock}
              title={selectedEl.locked ? 'Unlock element' : 'Lock element'}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-semibold transition-all ${
                selectedEl.locked
                  ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                  : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-200'
              }`}>
              {selectedEl.locked ? <><Lock size={12} /> Locked</> : <><Unlock size={12} /> Lock</>}
            </button>

            {/* Delete */}
            <button type="button" onClick={handleDelete}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/60 font-semibold transition-all">
              <Trash2 size={12} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <Move size={13} className="text-primary-500" />
          Click to select an element. Drag to move. Use corner handles to resize. Scroll or pinch to zoom.
        </div>
      )}
    </div>
  );
}
