import { API_BASE_URL } from './authService';
import cacheService, { CACHE_KEYS } from './cacheService';
import { generateArchitecturalLayout } from '../utils/roomLayoutEngine';

const ROOMS_CACHE_KEY = 'nestify_rooms_cache_';
const PROPERTIES_CACHE_KEY = 'nestify_properties_cache';

/**
 * Helper to build standard authenticated request options with credentials and diagnostics
 */
function getAuthHeaders(options = {}) {
  const token = cacheService.get(CACHE_KEYS.AUTH_TOKEN) || cacheService.get('token');
  return {
    headers: {
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: 'include', // Ensures HTTP-only auth cookies are transmitted
  };
}

/**
 * Fetch all properties for current user / admin
 */
export async function getProperties() {
  const url = `${API_BASE_URL}/api/v1/tenant/my-hostels`;
  console.info('[PropertyService:API] GET', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      ...getAuthHeaders(),
    });

    console.info('[PropertyService:API] Response Status:', response.status, url);

    if (response.ok) {
      const json = await response.json();
      const list = json.data?.hostels || json.data || json;
      if (Array.isArray(list)) {
        localStorage.setItem(PROPERTIES_CACHE_KEY, JSON.stringify(list));
        return list;
      }
    } else if (response.status === 401) {
      console.warn('[PropertyService:API 401 Unauthorized]', url);
    }
  } catch (err) {
    console.warn('[PropertyService] Backend unreachable for properties:', err);
  }

  // Fallback to local storage if available, otherwise empty array
  const cached = localStorage.getItem(PROPERTIES_CACHE_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }

  return [];
}

/**
 * Fetch a single property by ID
 */
export async function getPropertyById(propertyId) {
  if (!propertyId) return null;

  // Try direct endpoint if available
  const url = `${API_BASE_URL}/api/v1/tenant/hostel/${propertyId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      ...getAuthHeaders(),
    });
    if (response.ok) {
      const json = await response.json();
      return json.data?.hostel || json.data || json;
    }
  } catch (err) {
    console.warn('[PropertyService] Direct fetch hostel warning:', err);
  }

  // Fallback: look up in properties list
  const list = await getProperties();
  return list.find((p) => p._id === propertyId || p.id === propertyId) || null;
}

/**
 * Fetch all rooms with architectural layouts for a specific property
 */
export async function getPropertyRooms(hostelId) {
  if (!hostelId) return [];

  const url = `${API_BASE_URL}/api/v1/room?hostelId=${hostelId}`;
  console.info('[PropertyService:API] GET', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      ...getAuthHeaders(),
    });

    console.info('[PropertyService:API] Response Status:', response.status, url);

    if (response.ok) {
      const json = await response.json();
      const result = json.data?.rooms || json.data || json;
      if (Array.isArray(result)) {
        // Merge with local storage cache to preserve custom visual layout coordinates if backend doesn't store Mixed layout schema
        const cached = localStorage.getItem(ROOMS_CACHE_KEY + hostelId);
        let cachedRooms = [];
        try {
          if (cached) cachedRooms = JSON.parse(cached);
        } catch {}

        const merged = result.map((srv) => {
          const matchingCached = cachedRooms.find(
            (c) => c._id === srv._id || c.roomNumber === srv.roomNumber
          );
          return {
            ...srv,
            layout: srv.layout?.elements?.length > 0 ? srv.layout : matchingCached?.layout || srv.layout,
          };
        });

        localStorage.setItem(ROOMS_CACHE_KEY + hostelId, JSON.stringify(merged));
        return merged;
      }
    } else if (response.status === 401) {
      console.warn('[PropertyService:API 401 Unauthorized]', url);
    }
  } catch (err) {
    console.warn('[PropertyService] Fetch rooms fallback:', err);
  }

  // Local storage fallback
  const cached = localStorage.getItem(ROOMS_CACHE_KEY + hostelId);
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) return parsed;
    } catch {}
  }

  return [];
}

/**
 * Create a new room with visual layout
 */
export async function createRoom(payload) {
  const url = `${API_BASE_URL}/api/v1/room`;
  console.info('[PropertyService:API] POST', url, { roomNumber: payload.roomNumber, capacity: payload.capacity });

  try {
    const authConfig = getAuthHeaders();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authConfig.headers,
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    console.info('[PropertyService:API] Response Status:', response.status, url);

    if (response.ok) {
      const json = await response.json();
      const result = json.data || json;
      
      // Update local storage
      const hostelId = payload.hostelId;
      if (hostelId) {
        const current = await getPropertyRooms(hostelId);
        localStorage.setItem(ROOMS_CACHE_KEY + hostelId, JSON.stringify([...current, result]));
      }
      return result;
    } else if (response.status === 401) {
      console.warn('[PropertyService:API 401 Unauthorized]', url);
    }
  } catch (err) {
    console.warn('[PropertyService] Create room fallback:', err);
  }

  // Local creation fallback
  const hostelId = payload.hostelId || '';
  const currentRooms = hostelId ? await getPropertyRooms(hostelId) : [];
  const newRoom = {
    _id: `rm_${Date.now()}`,
    ...payload,
    beds:
      payload.beds ||
      Array.from({ length: payload.capacity || 2 }, (_, i) => ({
        bedNumber: `${payload.roomNumber}-${String.fromCharCode(65 + i)}`,
        isOccupied: false,
        status: 'available',
        monthlyRent: payload.monthlyRent || 8500,
      })),
    layout:
      payload.layout ||
      generateArchitecturalLayout({
        roomNumber: payload.roomNumber,
        capacity: payload.capacity,
        facilities: payload.facilities,
      }),
    status: 'active',
  };

  if (hostelId) {
    const updated = [...currentRooms, newRoom];
    localStorage.setItem(ROOMS_CACHE_KEY + hostelId, JSON.stringify(updated));
  }
  return newRoom;
}

/**
 * Update an existing room & layout coordinates
 */
export async function updateRoom(roomId, payload) {
  const url = `${API_BASE_URL}/api/v1/room/${roomId}`;
  console.info('[PropertyService:API] PUT', url, { roomId, hasLayout: Boolean(payload.layout) });

  let serverResult = null;
  try {
    const authConfig = getAuthHeaders();
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authConfig.headers,
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    console.info('[PropertyService:API] Response Status:', response.status, url);

    if (response.ok) {
      const json = await response.json();
      serverResult = json.data || json;
    } else if (response.status === 401) {
      console.warn('[PropertyService:API 401 Unauthorized]', url);
    }
  } catch (err) {
    console.warn('[PropertyService] Update room fallback:', err);
  }

  // Update local cache
  const hostelId = payload.hostelId;
  if (hostelId) {
    const cached = localStorage.getItem(ROOMS_CACHE_KEY + hostelId);
    let current = [];
    try {
      if (cached) current = JSON.parse(cached);
    } catch {}

    const updated = current.map((r) => {
      if (r._id === roomId || r.roomNumber === payload.roomNumber) {
        return {
          ...r,
          ...payload,
          layout: payload.layout || r.layout,
        };
      }
      return r;
    });

    localStorage.setItem(ROOMS_CACHE_KEY + hostelId, JSON.stringify(updated));
    const mergedResult = updated.find((r) => r._id === roomId || r.roomNumber === payload.roomNumber);
    return {
      ...(serverResult || {}),
      ...(mergedResult || {}),
      layout: payload.layout || mergedResult?.layout,
    };
  }

  return serverResult;
}

/**
 * Update ONLY the visual layout for a room (Version 2 coordinate layout).
 * Uses the dedicated PUT /api/v1/room/:roomId/layout endpoint.
 * Does NOT touch beds[], facilities, or any business data.
 */
export async function updateRoomLayout(roomId, layout, hostelId) {
  const url = `${API_BASE_URL}/api/v1/room/${roomId}/layout`;
  console.info('[PropertyService:API] PUT', url, { roomId, elementCount: layout?.elements?.length });

  try {
    const authConfig = getAuthHeaders();
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authConfig.headers,
      },
      credentials: 'include',
      body: JSON.stringify({ layout }),
    });

    console.info('[PropertyService:API] Response Status:', response.status, url);

    if (response.ok) {
      const json = await response.json();
      const serverLayout = json.data?.layout || layout;

      // Update local cache layout for this room
      if (hostelId) {
        const cached = localStorage.getItem(ROOMS_CACHE_KEY + hostelId);
        let current = [];
        try { if (cached) current = JSON.parse(cached); } catch {}
        const updated = current.map((r) =>
          r._id === roomId ? { ...r, layout: serverLayout } : r
        );
        localStorage.setItem(ROOMS_CACHE_KEY + hostelId, JSON.stringify(updated));
      }

      return { success: true, layout: serverLayout };
    }

    // Parse error response for validation errors
    const errJson = await response.json().catch(() => ({}));
    return {
      success: false,
      errors: errJson.errors || [errJson.message || 'Layout save failed'],
    };
  } catch (err) {
    console.warn('[PropertyService] updateRoomLayout error:', err);

    // Local-only fallback: update cache without server confirmation
    if (hostelId) {
      const cached = localStorage.getItem(ROOMS_CACHE_KEY + hostelId);
      let current = [];
      try { if (cached) current = JSON.parse(cached); } catch {}
      const updated = current.map((r) =>
        r._id === roomId ? { ...r, layout } : r
      );
      localStorage.setItem(ROOMS_CACHE_KEY + hostelId, JSON.stringify(updated));
    }

    return { success: true, layout, offline: true };
  }
}

/**
 * Delete a room
 */
export async function deleteRoom(roomId, hostelId) {
  const url = `${API_BASE_URL}/api/v1/room/${roomId}`;
  console.info('[PropertyService:API] DELETE', url);

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      ...getAuthHeaders(),
    });

    console.info('[PropertyService:API] Response Status:', response.status, url);

    if (response.ok) return true;
  } catch (err) {
    console.warn('[PropertyService] Delete room fallback:', err);
  }

  if (hostelId) {
    const current = await getPropertyRooms(hostelId);
    const filtered = current.filter((r) => r._id !== roomId);
    localStorage.setItem(ROOMS_CACHE_KEY + hostelId, JSON.stringify(filtered));
  }
  return true;
}

/**
 * Update bed occupancy (allocate resident / vacate / maintenance)
 */
export async function updateBedAllocation(hostelId, roomId, bedNumber, updateData) {
  const url = `${API_BASE_URL}/api/v1/room/${roomId}/beds/${bedNumber}`;
  console.info('[PropertyService:API] PATCH', url, updateData);

  try {
    const authConfig = getAuthHeaders();
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...authConfig.headers,
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    console.info('[PropertyService:API] Response Status:', response.status, url);

    if (response.ok) {
      const json = await response.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('[PropertyService] updateBed fallback:', err);
  }

  // Local fallback update
  if (hostelId) {
    const currentRooms = await getPropertyRooms(hostelId);
    const updatedRooms = currentRooms.map((r) => {
      if (r._id === roomId) {
        const updatedBeds = (r.beds || []).map((b) => {
          if (b.bedNumber === bedNumber) {
            return {
              ...b,
              ...updateData,
              residentName: updateData.residentName || (updateData.isOccupied ? b.residentName : ''),
            };
          }
          return b;
        });
        return { ...r, beds: updatedBeds };
      }
      return r;
    });

    localStorage.setItem(ROOMS_CACHE_KEY + hostelId, JSON.stringify(updatedRooms));
    return updatedRooms.find((r) => r._id === roomId);
  }

  return null;
}

export default {
  getProperties,
  getPropertyById,
  getPropertyRooms,
  createRoom,
  updateRoom,
  updateRoomLayout,
  deleteRoom,
  updateBedAllocation,
};
