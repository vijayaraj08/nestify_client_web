import React, { useState } from 'react';
import RoomMapRenderer from './RoomMapRenderer';
import {
  Bed,
  User,
  CheckCircle2,
  DollarSign,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

/**
 * Interactive RedBus & Architectural Top-Down Visual Room Layout Component
 */
export default function RoomVisualizer({
  room,
  onSelectBed,
  onAllocateBed,
  readOnly = false,
  showLegend = true,
  compact = false,
}) {
  const [selectedBed, setSelectedBed] = useState(null);

  if (!room) {
    return (
      <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-400">
        No room data available for visual representation.
      </div>
    );
  }

  const handleBedClick = (bedInfo, el) => {
    setSelectedBed(bedInfo);
    if (readOnly) return;
    if (onSelectBed) {
      onSelectBed(bedInfo, room);
    } else if (bedInfo.isAvailable && onAllocateBed) {
      onAllocateBed(bedInfo, room);
    }
  };

  return (
    <div className="w-full space-y-3.5 select-none animate-fade-in">
      {/* Top-Down Architectural Vector Room Map */}
      <RoomMapRenderer
        room={room}
        selectedBedId={selectedBed?.bedNumber}
        onBedClick={handleBedClick}
        interactive={!readOnly}
        showLegend={showLegend}
        showLabels={true}
      />

      {/* Selected Bed Quick Action Drawer (if bed is clicked) */}
      {selectedBed && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-primary-200 dark:border-primary-900/50 shadow-xs flex flex-wrap items-center justify-between gap-3 animate-fade-in text-xs">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-xs ${
                selectedBed.isOccupied
                  ? 'bg-rose-500'
                  : selectedBed.isAvailable
                  ? 'bg-emerald-500'
                  : 'bg-slate-500'
              }`}
            >
              <Bed size={18} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  {selectedBed.bedNumber}
                </span>
                <span
                  className={`text-[9.5px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    selectedBed.isOccupied
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : selectedBed.isAvailable
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {selectedBed.isOccupied ? 'Occupied' : selectedBed.isAvailable ? 'Available' : selectedBed.status}
                </span>
              </div>

              {selectedBed.isOccupied ? (
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 mt-0.5">
                  <User size={12} className="text-primary-500" />
                  <span>Resident: <strong>{selectedBed.residentName || selectedBed.residentId?.name || 'Occupied'}</strong></span>
                </div>
              ) : (
                <div className="text-slate-500 mt-0.5">
                  Monthly Rent: <strong className="text-emerald-600 dark:text-emerald-400">₹{selectedBed.monthlyRent || room.monthlyRent || 8500}</strong>
                </div>
              )}
            </div>
          </div>

          {/* Quick Action Button */}
          {!readOnly && (
            <div className="flex items-center gap-2">
              {selectedBed.isAvailable && onAllocateBed && (
                <button
                  type="button"
                  onClick={() => onAllocateBed(selectedBed, room)}
                  className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 size={14} /> Allocate Resident
                </button>
              )}
              {onSelectBed && (
                <button
                  type="button"
                  onClick={() => onSelectBed(selectedBed, room)}
                  className="px-3.5 py-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-bold shadow-xs transition-all flex items-center gap-1.5"
                >
                  Manage Bed <ArrowUpRight size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
