/**
 * Timing & Milliseconds Utility Helpers (timeUtils.js)
 * ──────────────────────────────────────────────────
 * Ensures all timing values across backend and frontend are strictly maintained
 * and stored in milliseconds (ms).
 *
 * Provides conversions for:
 * - Time of day (milliseconds from midnight <-> "HH:mm" / "hh:mm A")
 * - Durations (milliseconds <-> "15m", "30m", "1h", etc.)
 * - Epoch timestamps (milliseconds <-> ISO / formatted date)
 */

const MS_PER_MINUTE = 60 * 1000;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;

/**
 * Converts a 24-hour time string ("HH:mm" e.g. "22:30", "09:15") to milliseconds from midnight.
 * @param {string|number} timeString 
 * @returns {number} Milliseconds from midnight (0 to 86399999)
 */
export function timeStringToMs(timeString) {
  if (typeof timeString === 'number') {
    return Math.max(0, Math.min(timeString, MS_PER_DAY - 1));
  }
  if (!timeString || typeof timeString !== 'string') {
    return 0;
  }

  const parts = timeString.trim().split(':');
  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const seconds = parseInt(parts[2], 10) || 0;

  return (hours * MS_PER_HOUR) + (minutes * MS_PER_MINUTE) + (seconds * 1000);
}

/**
 * Converts milliseconds from midnight to a 24-hour "HH:mm" format string for <input type="time" />.
 * @param {number|string} ms 
 * @returns {string} e.g. "22:30", "09:00"
 */
export function msToTimeString(ms) {
  if (typeof ms === 'string') {
    if (ms.includes(':')) return ms; // already a time string
    ms = Number(ms);
  }

  if (typeof ms !== 'number' || isNaN(ms)) {
    return '22:30'; // fallback default
  }

  const totalMinutes = Math.floor((ms % MS_PER_DAY) / MS_PER_MINUTE);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hh = String(hours).padStart(2, '0');
  const mm = String(minutes).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Formats milliseconds from midnight into a human-readable 12-hour string (e.g. "10:30 PM", "9:00 AM").
 * @param {number|string} ms 
 * @returns {string}
 */
export function formatMsToHumanTime(ms) {
  const timeStr = msToTimeString(ms);
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const m = mStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

/**
 * Converts a duration string (e.g. "15m", "30m", "1h", "4h", "2d") to milliseconds.
 * @param {string|number} duration 
 * @returns {number}
 */
export function durationStringToMs(duration) {
  if (typeof duration === 'number') return duration;
  if (!duration || typeof duration !== 'string') return 30 * MS_PER_MINUTE;

  const trimmed = duration.trim().toLowerCase();
  if (trimmed === 'never' || trimmed === '0') return 0;

  const match = trimmed.match(/^(\d+)([smhd])$/);
  if (!match) {
    const num = Number(trimmed);
    return isNaN(num) ? 30 * MS_PER_MINUTE : num;
  }

  const val = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's': return val * 1000;
    case 'm': return val * MS_PER_MINUTE;
    case 'h': return val * MS_PER_HOUR;
    case 'd': return val * MS_PER_DAY;
    default: return val * MS_PER_MINUTE;
  }
}

/**
 * Converts duration milliseconds to short format (e.g. "30m", "1h", "4h").
 * @param {number} ms 
 * @returns {string}
 */
export function msToDurationString(ms) {
  if (typeof ms !== 'number' || ms <= 0) return 'never';

  if (ms >= MS_PER_DAY && ms % MS_PER_DAY === 0) {
    return `${ms / MS_PER_DAY}d`;
  }
  if (ms >= MS_PER_HOUR && ms % MS_PER_HOUR === 0) {
    return `${ms / MS_PER_HOUR}h`;
  }
  if (ms >= MS_PER_MINUTE && ms % MS_PER_MINUTE === 0) {
    return `${ms / MS_PER_MINUTE}m`;
  }
  return `${Math.round(ms / MS_PER_MINUTE)}m`;
}

/**
 * Formats epoch milliseconds or ISO timestamp to human date.
 * @param {number|string|Date} timestamp 
 * @returns {string} e.g. "Jan 15, 2026"
 */
export function formatTimestamp(timestamp) {
  if (!timestamp) return '—';
  try {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default {
  timeStringToMs,
  msToTimeString,
  formatMsToHumanTime,
  durationStringToMs,
  msToDurationString,
  formatTimestamp,
};
