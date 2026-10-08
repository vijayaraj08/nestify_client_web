/**
 * Room Layout Engine - Version 2 (Coordinate-Based)
 *
 * Architecture principles:
 *   - ALL positions use { position: { x, y } } + { size: { width, height } }
 *   - The canvas coordinate system is independent of screen size
 *   - Grid is for snapping assistance only - NOT the positioning model
 *   - Bed occupancy data NEVER lives in layout elements
 *   - Elements link to beds[] via: element.bedNumber === bed.bedNumber
 *
 * Backward compat:
 *   - normalizeLayout() converts any legacy V1 grid layout or old flat-coordinate
 *     format (el.x, el.y) into canonical V2 format transparently
 */

// ─── Constants ────────────────────────────────────────────────────────────────

export const CANVAS_WIDTH = 900;
export const CANVAS_HEIGHT = 600;
export const WALL_THICKNESS = 20;
export const GRID_SIZE = 10;

/** @deprecated Use CANVAS_WIDTH / CANVAS_HEIGHT - kept for renderer backward compat */
export const DEFAULT_ROOM_DIMENSIONS = {
  width: CANVAS_WIDTH,
  height: CANVAS_HEIGHT,
  wallThickness: WALL_THICKNESS,
};

// ─── Bed Type Catalog ─────────────────────────────────────────────────────────

export const BED_TYPES = {
  single: {
    id: 'single',
    name: 'Single Bed',
    width: 90,
    height: 200,
    label: 'Single (90 × 200 cm)',
  },
  small_single: {
    id: 'small_single',
    name: 'Small Single Bed',
    width: 80,
    height: 190,
    label: 'Small Single (80 × 190 cm)',
  },
  twin: {
    id: 'twin',
    name: 'Twin / Large Single',
    width: 100,
    height: 200,
    label: 'Twin / Large (100 × 200 cm)',
  },
  double: {
    id: 'double',
    name: 'Double Bed',
    width: 135,
    height: 200,
    label: 'Double (135 × 200 cm)',
  },
  queen: {
    id: 'queen',
    name: 'Queen Bed',
    width: 150,
    height: 200,
    label: 'Queen (150 × 200 cm)',
  },
  king: {
    id: 'king',
    name: 'King Bed',
    width: 180,
    height: 200,
    label: 'King (180 × 200 cm)',
  },
  bunk: {
    id: 'bunk',
    name: 'Bunk Bed (2-Tier)',
    width: 90,
    height: 200,
    label: 'Bunk Bed (90 × 200 cm)',
  },
  custom: {
    id: 'custom',
    name: 'Custom Bed',
    width: 90,
    height: 180,
    label: 'Custom Dimensions',
  },
};

// ─── Supported Element Types & Categories ─────────────────────────────────────

export const ELEMENT_TYPES = ['bed', 'furniture', 'facility', 'fixture', 'opening'];
export const ELEMENT_CATEGORIES = [
  'bed', 'bunk_bed', 'ac', 'tv', 'door', 'window',
  'washroom', 'cupboard', 'table', 'chair',
  'balcony', 'geyser', 'locker', 'other',
];

// ─── Utility Helpers ─────────────────────────────────────────────────────────

/** Snap a value to the nearest grid increment */
export const snapToGrid = (val, gridSize = GRID_SIZE) =>
  Math.round(Number(val) / gridSize) * gridSize;

/** Safe numeric parse with fallback */
const safeNum = (val, fallback = 0) => {
  const n = Number(val);
  return isNaN(n) || !isFinite(n) ? fallback : n;
};

// ─── V2 Element Factory ───────────────────────────────────────────────────────

/**
 * Creates a canonical V2 layout element.
 * All layout elements produced anywhere in this file must go through this.
 */
export function makeLayoutElement({
  id,
  type,
  category,
  bedNumber = null,
  label = '',
  x,
  y,
  width,
  height,
  rotation = 0,
  zIndex = 5,
  locked = false,
  properties = {},
}) {
  return {
    id,
    type,
    category,
    bedNumber: bedNumber || null,
    label,
    position: {
      x: snapToGrid(safeNum(x, 0)),
      y: snapToGrid(safeNum(y, 0)),
    },
    size: {
      width: snapToGrid(Math.max(10, safeNum(width, 80))),
      height: snapToGrid(Math.max(10, safeNum(height, 80))),
    },
    rotation: safeNum(rotation, 0),
    zIndex: safeNum(zIndex, 5),
    locked: Boolean(locked),
    properties: properties || {},
  };
}

// ─── Clamp / Bounds ───────────────────────────────────────────────────────────

/**
 * Clamps an element's position so it stays inside the room boundary.
 * Works with V2 element format ({ position, size }) AND legacy flat format ({ x, y, width, height }).
 */
export function clampElementWithinBounds(element, canvas = {}, wall = WALL_THICKNESS) {
  const cW = safeNum(canvas.width, CANVAS_WIDTH);
  const cH = safeNum(canvas.height, CANVAS_HEIGHT);
  const w = safeNum(wall, WALL_THICKNESS);

  // Support both V2 ({ position, size }) and legacy flat ({ x, y, width, height })
  const isV2 = element.position !== undefined && element.size !== undefined;

  if (isV2) {
    const elW = safeNum(element.size.width, 60);
    const elH = safeNum(element.size.height, 60);
    const minX = w + 4;
    const minY = w + 4;
    const maxX = cW - w - elW - 4;
    const maxY = cH - w - elH - 4;
    return {
      ...element,
      position: {
        x: Math.max(minX, Math.min(maxX, safeNum(element.position.x, minX))),
        y: Math.max(minY, Math.min(maxY, safeNum(element.position.y, minY))),
      },
    };
  } else {
    // Legacy flat format
    const elW = safeNum(element.width, 60);
    const elH = safeNum(element.height, 60);
    const minX = w + 4;
    const minY = w + 4;
    const maxX = cW - w - elW - 4;
    const maxY = cH - w - elH - 4;
    return {
      ...element,
      x: Math.max(minX, Math.min(maxX, safeNum(element.x, minX))),
      y: Math.max(minY, Math.min(maxY, safeNum(element.y, minY))),
    };
  }
}

// ─── V2 Layout Generator ──────────────────────────────────────────────────────

/**
 * generateArchitecturalLayout({ roomNumber, capacity, bedType, facilities, canvas })
 *
 * Produces a complete Version 2 layout for a given room configuration.
 * Called when creating a new room or auto-arranging in the editor.
 */
export function generateArchitecturalLayout({
  roomNumber = '101',
  capacity = 2,
  bedType = 'single',
  facilities = {},
  canvas = { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
}) {
  const cap = Math.max(1, safeNum(capacity, 2));
  const rn = String(roomNumber).trim();
  const cW = safeNum(canvas.width, CANVAS_WIDTH);
  const cH = safeNum(canvas.height, CANVAS_HEIGHT);
  const wall = WALL_THICKNESS;

  const hasAc          = Boolean(facilities.hasAc);
  const hasTv          = Boolean(facilities.hasTv);
  const hasWashroom    = facilities.hasAttachedWashroom !== undefined ? Boolean(facilities.hasAttachedWashroom) : true;
  const hasWindow      = facilities.hasWindow !== undefined ? Boolean(facilities.hasWindow) : true;
  const hasCupboard    = facilities.hasCupboard !== undefined ? Boolean(facilities.hasCupboard) : true;
  const hasStudyTable  = Boolean(facilities.hasStudyTable);

  const elements = [];

  // ── Lockers / Wardrobes (top-left) ──────────────────────────────────────
  if (hasCupboard) {
    const lW = cap > 4 ? 160 : 140;
    elements.push(makeLayoutElement({
      id: `el_locker_${rn}`,
      type: 'furniture',
      category: 'locker',
      label: 'Lockers',
      x: wall + 10, y: wall + 10,
      width: lW, height: 80,
      zIndex: 5,
      properties: {
        doors: Math.min(6, Math.max(2, cap)),
        sublabel: `${Math.min(6, Math.max(2, cap))} Compartments`,
      },
    }));
  }

  // ── Attached Bathroom (top-right) ────────────────────────────────────────
  const BATH_W = 160;
  const BATH_H = 170;
  if (hasWashroom) {
    elements.push(makeLayoutElement({
      id: `el_washroom_${rn}`,
      type: 'facility',
      category: 'washroom',
      label: 'Bathroom',
      x: cW - wall - BATH_W - 10, y: wall + 10,
      width: BATH_W, height: BATH_H,
      zIndex: 5,
      properties: { fixtures: ['commode', 'shower', 'sink'] },
    }));
  }

  // ── AC (top-center) ──────────────────────────────────────────────────────
  if (hasAc) {
    elements.push(makeLayoutElement({
      id: `el_ac_${rn}`,
      type: 'facility',
      category: 'ac',
      label: 'Split AC',
      x: cW * 0.4, y: wall + 6,
      width: 110, height: 28,
      zIndex: 5,
      properties: { sublabel: '1.5T Inverter' },
    }));
  }

  // ── TV ──────────────────────────────────────────────────────────────────
  if (hasTv) {
    elements.push(makeLayoutElement({
      id: `el_tv_${rn}`,
      type: 'facility',
      category: 'tv',
      label: 'Smart TV',
      x: cW * 0.4, y: wall + 40,
      width: 90, height: 18,
      zIndex: 5,
      properties: { sublabel: '50" Smart' },
    }));
  }

  // ── Window (bottom wall) ─────────────────────────────────────────────────
  if (hasWindow) {
    const wW = cap > 3 ? 220 : 160;
    elements.push(makeLayoutElement({
      id: `el_window_${rn}`,
      type: 'opening',
      category: 'window',
      label: 'Window',
      x: cW * 0.3, y: cH - wall - 16,
      width: wW, height: 16,
      zIndex: 3,
      properties: { sublabel: 'Sliding Glass' },
    }));
  }

  // ── Entry Door (bottom-right) ────────────────────────────────────────────
  elements.push(makeLayoutElement({
    id: `el_door_${rn}`,
    type: 'opening',
    category: 'door',
    label: 'Entry Door',
    x: cW - wall - 80, y: cH - wall - 70,
    width: 70, height: 70,
    zIndex: 3,
    locked: false,
    properties: { openDirection: 'inward_right' },
  }));

  // ── Beds ─────────────────────────────────────────────────────────────────
  const bedSizeKey = cap >= 5 ? 'small_single' : (bedType || 'single');
  const bedDef = BED_TYPES[bedSizeKey] || BED_TYPES.single;
  const bedW = bedDef.width;
  const bedH = bedDef.height;

  const startX = wall + (hasCupboard ? 160 : 40);
  const endX = hasWashroom ? cW - wall - BATH_W - 20 : cW - wall - 40;
  const usable = endX - startX;

  if (cap <= 4) {
    const gap = Math.max(10, (usable - cap * bedW) / (cap + 1));
    for (let i = 0; i < cap; i++) {
      const bx = startX + gap + i * (bedW + gap);
      const letter = String.fromCharCode(65 + i);
      elements.push(makeLayoutElement({
        id: `el_bed_${rn}_${letter}`,
        type: 'bed',
        category: 'bed',
        bedNumber: `${rn}-${letter}`,
        label: `Bed ${i + 1} (${rn}-${letter})`,
        x: bx, y: wall + 160,
        width: bedW, height: bedH,
        zIndex: 10,
        properties: { bedType: bedSizeKey, bedIndex: i + 1 },
      }));
    }
  } else if (cap === 5) {
    const cW5 = Math.min(bedW, 80);
    const gap = Math.max(8, (usable - 5 * cW5) / 6);
    for (let i = 0; i < 5; i++) {
      const bx = startX + gap + i * (cW5 + gap);
      const letter = String.fromCharCode(65 + i);
      elements.push(makeLayoutElement({
        id: `el_bed_${rn}_${letter}`,
        type: 'bed',
        category: 'bed',
        bedNumber: `${rn}-${letter}`,
        label: `Bed ${i + 1} (${rn}-${letter})`,
        x: bx, y: wall + 160,
        width: cW5, height: bedH,
        zIndex: 10,
        properties: { bedType: 'small_single', bedIndex: i + 1 },
      }));
    }
  } else {
    const bpr = Math.ceil(cap / 2);
    const cWD = Math.min(bedW, 80);
    const cHD = 150;
    const gap = Math.max(8, (usable - bpr * cWD) / (bpr + 1));
    for (let i = 0; i < cap; i++) {
      const isTop = i < bpr;
      const col = isTop ? i : i - bpr;
      const bx = startX + gap + col * (cWD + gap);
      const by = isTop ? wall + 90 : wall + 270;
      const letter = String.fromCharCode(65 + i);
      elements.push(makeLayoutElement({
        id: `el_bed_${rn}_${letter}`,
        type: 'bed',
        category: 'bed',
        bedNumber: `${rn}-${letter}`,
        label: `Bed ${i + 1} (${rn}-${letter})`,
        x: bx, y: by,
        width: cWD, height: cHD,
        rotation: isTop ? 180 : 0,
        zIndex: 10,
        properties: { bedType: 'small_single', bedIndex: i + 1 },
      }));
    }
  }

  // ── Study Desks (bottom-left) ────────────────────────────────────────────
  if (hasStudyTable) {
    elements.push(makeLayoutElement({
      id: `el_desk_${rn}`,
      type: 'furniture',
      category: 'table',
      label: 'Study Desk',
      x: wall + 10, y: cH - wall - 60,
      width: 70, height: 50,
      zIndex: 5,
      properties: { hasChair: true, sublabel: 'Workstation' },
    }));
  }

  return {
    version: 2,
    preset: 'standard',
    canvas: { width: cW, height: cH, unit: 'cm' },
    grid: { enabled: true, size: GRID_SIZE, snap: true },
    roomBoundary: { type: 'rectangle', x: 0, y: 0, width: cW, height: cH },
    elements,
  };
}

// ─── Layout Normalization ─────────────────────────────────────────────────────

/**
 * Checks if a layout is already a valid V2 coordinate layout.
 */
export function isValidV2Layout(layout) {
  if (!layout || typeof layout !== 'object') return false;
  if (layout.version !== 2) return false;
  if (!layout.canvas || !layout.canvas.width || !layout.canvas.height) return false;
  if (!Array.isArray(layout.elements) || layout.elements.length === 0) return false;
  // All elements must have position + size
  return layout.elements.every(
    (el) =>
      el.position &&
      typeof el.position.x === 'number' &&
      typeof el.position.y === 'number' &&
      el.size &&
      typeof el.size.width === 'number' &&
      el.size.width > 0 &&
      typeof el.size.height === 'number' &&
      el.size.height > 0
  );
}

/**
 * @deprecated Alias kept for RoomMapRenderer backward compat
 */
export function isValidArchitecturalLayout(layout) {
  return isValidV2Layout(layout);
}

/**
 * normalizeLayout(layout, fallbackParams)
 *
 * Converts ANY layout format (V1 grid, old flat-xy, V2) into canonical V2 format.
 * Used by both the renderer and editor so they always get clean data.
 *
 * Priority:
 *   1. Valid V2 layout -> return as-is (preserving saved coordinates)
 *   2. Old flat-coordinate format (el.x, el.y, el.width, el.height) -> wrap into V2
 *   3. V1 grid layout (el.row, el.col) -> convert
 *   4. No layout -> generate fresh default
 */
export function normalizeLayout(layout, fallbackParams = {}) {
  const rn = fallbackParams.roomNumber || '101';
  const cap = safeNum(fallbackParams.capacity, 2);
  const fac = fallbackParams.facilities || {};
  const canvas = fallbackParams.canvas || { width: CANVAS_WIDTH, height: CANVAS_HEIGHT };

  // ── Case 1: Already valid V2 ─────────────────────────────────────────────
  if (isValidV2Layout(layout)) {
    return layout;
  }

  // ── Case 2: Old flat-coordinate format (previously used by this codebase) ─
  // These have el.x, el.y, el.width, el.height but no el.position
  if (
    layout &&
    Array.isArray(layout.elements) &&
    layout.elements.length > 0 &&
    layout.elements.some(
      (el) =>
        typeof el.x === 'number' &&
        typeof el.y === 'number' &&
        typeof el.width === 'number' &&
        typeof el.height === 'number' &&
        !el.position
    )
  ) {
    const cW = safeNum(layout.dimensions?.width || layout.canvas?.width, CANVAS_WIDTH);
    const cH = safeNum(layout.dimensions?.height || layout.canvas?.height, CANVAS_HEIGHT);

    // Track sequential indices for multi-item placement defaults
    let bedIdx = 0;
    const hasBath = layout.elements.some((el) => el.type === 'bathroom' || el.type === 'washroom' || el.category === 'washroom');
    const startX = WALL_THICKNESS + 36;
    const endX = hasBath ? cW - WALL_THICKNESS - 190 : cW - WALL_THICKNESS - 100;
    const usable = endX - startX;
    const bedCount = layout.elements.filter((e) => e.type === 'bed').length || cap;

    const converted = layout.elements.map((el, idx) => {
      // Already has position? Wrap it
      const hasXY =
        typeof el.x === 'number' && !isNaN(el.x) &&
        typeof el.y === 'number' && !isNaN(el.y) &&
        typeof el.width === 'number' && el.width > 0 &&
        typeof el.height === 'number' && el.height > 0;

      // Map old type names → V2 type/category
      const typeMap = {
        lockers: { type: 'furniture', category: 'locker' },
        wardrobe: { type: 'furniture', category: 'locker' },
        bathroom: { type: 'facility', category: 'washroom' },
        washroom: { type: 'facility', category: 'washroom' },
        ac: { type: 'facility', category: 'ac' },
        tv: { type: 'facility', category: 'tv' },
        studyDesk: { type: 'furniture', category: 'table' },
        table: { type: 'furniture', category: 'table' },
        window: { type: 'opening', category: 'window' },
        door: { type: 'opening', category: 'door' },
        bed: { type: 'bed', category: 'bed' },
      };
      const mapped = typeMap[el.type] || { type: 'furniture', category: 'other' };

      let defX = safeNum(el.x, 50);
      let defY = safeNum(el.y, 50);
      let defW = safeNum(el.width, 80);
      let defH = safeNum(el.height, 80);

      // For bed elements - calculate default position if coordinates are bad
      if (el.type === 'bed' && (!hasXY || defW < 30)) {
        const bedDef = BED_TYPES.single;
        defW = bedDef.width;
        defH = bedDef.height;
        if (bedCount <= 4) {
          const gap = Math.max(10, (usable - bedCount * defW) / (bedCount + 1));
          defX = Math.round(startX + gap + bedIdx * (defW + gap));
          defY = WALL_THICKNESS + 160;
        }
        bedIdx++;
      }

      return makeLayoutElement({
        id: el.id || `el_migrated_${rn}_${idx}`,
        type: mapped.type,
        category: mapped.category,
        bedNumber: el.bedNumber || null,
        label: el.label || el.type || '',
        x: hasXY && defW > 30 ? el.x : defX,
        y: hasXY && defW > 30 ? el.y : defY,
        width: hasXY && defW > 30 ? el.width : defW,
        height: hasXY && defW > 30 ? el.height : defH,
        rotation: safeNum(el.rotation, 0),
        zIndex: mapped.type === 'bed' ? 10 : 5,
        locked: Boolean(el.locked),
        properties: {
          ...(el.properties || {}),
          // Preserve legacy-specific props
          ...(el.doors !== undefined ? { doors: el.doors } : {}),
          ...(el.bedType ? { bedType: el.bedType } : {}),
          ...(el.fixtures ? { fixtures: el.fixtures } : {}),
          ...(el.sublabel ? { sublabel: el.sublabel } : {}),
        },
      });
    });

    return {
      version: 2,
      preset: layout.preset || 'migrated',
      canvas: { width: cW, height: cH, unit: 'cm' },
      grid: { enabled: true, size: GRID_SIZE, snap: true },
      roomBoundary: { type: 'rectangle', x: 0, y: 0, width: cW, height: cH },
      elements: converted,
    };
  }

  // ── Case 3: V1 grid layout (row/col/colSpan/rowSpan) ─────────────────────
  if (
    layout &&
    Array.isArray(layout.elements) &&
    layout.elements.length > 0 &&
    layout.elements.some((el) => typeof el.row === 'number')
  ) {
    const CELL_W = CANVAS_WIDTH / 4;
    const CELL_H = CANVAS_HEIGHT / 5;
    const converted = layout.elements.map((el, idx) => {
      const row = safeNum(el.row, 0);
      const col = safeNum(el.col, 0);
      const cSpan = safeNum(el.colSpan, 1);
      const rSpan = safeNum(el.rowSpan, 1);
      const typeMap = {
        bed: { type: 'bed', category: 'bed' },
        facility: { type: 'facility', category: el.category || 'other' },
        fixture: { type: 'fixture', category: el.category || 'other' },
      };
      const mapped = typeMap[el.type] || { type: 'furniture', category: el.category || 'other' };
      return makeLayoutElement({
        id: el.id || `el_v1_${rn}_${idx}`,
        type: mapped.type,
        category: mapped.category,
        bedNumber: el.bedNumber || null,
        label: el.label || '',
        x: col * CELL_W + 10,
        y: row * CELL_H + 10,
        width: cSpan * CELL_W - 20,
        height: rSpan * CELL_H - 20,
        rotation: safeNum(el.rotation, 0),
        zIndex: mapped.type === 'bed' ? 10 : 5,
        properties: el.properties || {},
      });
    });

    return {
      version: 2,
      preset: 'migrated',
      canvas: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT, unit: 'cm' },
      grid: { enabled: true, size: GRID_SIZE, snap: true },
      roomBoundary: { type: 'rectangle', x: 0, y: 0, width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
      elements: converted,
    };
  }

  // ── Case 4: No usable layout → generate fresh default ────────────────────
  return generateArchitecturalLayout({
    roomNumber: rn,
    capacity: cap,
    facilities: fac,
    canvas,
  });
}

// ─── Editor Helpers ───────────────────────────────────────────────────────────

/**
 * getElementBounds(el)
 * Returns { x, y, width, height } regardless of V2 or legacy flat format.
 * Used by the editor and renderer for consistent bounding box access.
 */
export function getElementBounds(el) {
  if (el.position && el.size) {
    return {
      x: el.position.x,
      y: el.position.y,
      width: el.size.width,
      height: el.size.height,
    };
  }
  // Legacy flat format
  return {
    x: safeNum(el.x, 0),
    y: safeNum(el.y, 0),
    width: safeNum(el.width, 80),
    height: safeNum(el.height, 80),
  };
}

/**
 * updateElementPosition(el, x, y)
 * Returns element with updated position (V2 format).
 */
export function updateElementPosition(el, x, y) {
  const snappedX = snapToGrid(safeNum(x));
  const snappedY = snapToGrid(safeNum(y));
  if (el.position) {
    return { ...el, position: { x: snappedX, y: snappedY } };
  }
  return { ...el, x: snappedX, y: snappedY };
}

/**
 * updateElementSize(el, width, height)
 * Returns element with updated size (V2 format).
 */
export function updateElementSize(el, width, height) {
  const snappedW = snapToGrid(Math.max(10, safeNum(width)));
  const snappedH = snapToGrid(Math.max(10, safeNum(height)));
  if (el.size) {
    return { ...el, size: { width: snappedW, height: snappedH } };
  }
  return { ...el, width: snappedW, height: snappedH };
}

// ─── Backward Compat Aliases ──────────────────────────────────────────────────

/**
 * @deprecated Use generateArchitecturalLayout() - this alias is kept for existing callers
 */
export const generateDefaultLayout = (roomNumber = '101', capacity = 2, facilities = {}) => {
  return generateArchitecturalLayout({ roomNumber, capacity, facilities });
};

export default {
  BED_TYPES,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  WALL_THICKNESS,
  GRID_SIZE,
  DEFAULT_ROOM_DIMENSIONS,
  ELEMENT_TYPES,
  ELEMENT_CATEGORIES,
  snapToGrid,
  makeLayoutElement,
  clampElementWithinBounds,
  generateArchitecturalLayout,
  generateDefaultLayout,
  isValidV2Layout,
  isValidArchitecturalLayout,
  normalizeLayout,
  getElementBounds,
  updateElementPosition,
  updateElementSize,
};
