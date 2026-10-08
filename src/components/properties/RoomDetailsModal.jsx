import React, { useState } from 'react';
import {
  X,
  DoorOpen,
  Wind,
  Bath,
  Tv,
  Sun,
  Box,
  Layers,
  Bed,
  User,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
} from 'lucide-react';
import Button from '../ui/Button';
import RoomVisualizer from './RoomVisualizer';

/**
 * Modal to Inspect Room & Interact with RedBus Layout Engine
 */
export default function RoomDetailsModal({
  isOpen,
  onClose,
  room,
  onSelectBed,
  onEditRoom,
  onDeleteRoom,
}) {
  if (!isOpen || !room) return null;

  const roomBeds = room.beds || [];
  const occupiedCount = roomBeds.filter((b) => b.isOccupied).length;
  const availableCount = Math.max(0, roomBeds.length - occupiedCount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center font-mono font-bold text-sm">
              {room.roomNumber}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Room {room.roomNumber} Overview
                </h2>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300">
                  {room.roomType?.replace('_', ' ') || 'Double Sharing'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {room.floorName || `Floor ${room.floorNumber}`} • ₹{room.monthlyRent || 8500} / Bed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onEditRoom && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  onEditRoom(room);
                }}
                className="text-xs flex items-center gap-1.5"
              >
                <Edit2 size={13} />
                Edit Layout
              </Button>
            )}

            {onDeleteRoom && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (window.confirm(`Delete Room ${room.roomNumber}?`)) {
                    onDeleteRoom(room._id);
                    onClose();
                  }
                }}
                className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 p-2"
              >
                <Trash2 size={15} />
              </Button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive RedBus Visualizer Canvas (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Sparkles size={14} className="text-primary-600" />
                Interactive Room Map (Click bed to manage)
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {availableCount} Available / {occupiedCount} Occupied
              </span>
            </div>

            <RoomVisualizer
              room={room}
              onSelectBed={(bed) => {
                if (onSelectBed) onSelectBed(bed, room);
              }}
              showLegend={true}
            />
          </div>

          {/* Right Column: Bed Inventory Roster & Facilities (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Beds List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                Bed Inventory ({roomBeds.length})
              </span>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {roomBeds.map((b, idx) => {
                  const isOcc = Boolean(b.isOccupied);
                  return (
                    <div
                      key={b.bedNumber || idx}
                      onClick={() => {
                        if (onSelectBed) onSelectBed(b, room);
                      }}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                        isOcc
                          ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 hover:border-rose-300'
                          : 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                            isOcc
                              ? 'bg-rose-500 text-white'
                              : 'bg-emerald-500 text-white'
                          }`}
                        >
                          <Bed size={15} />
                        </div>
                        <div>
                          <span className="text-xs font-black text-slate-900 dark:text-white block">
                            Bed {b.bedNumber}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400">
                            {isOcc
                              ? b.residentId?.name || b.residentName || 'Active Resident'
                              : 'Available for Allocation'}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${
                          isOcc
                            ? 'bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300'
                            : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {isOcc ? 'Occupied' : 'Allocate'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Room Facilities List */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                Included Room Facilities
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {room.facilities?.hasAc && (
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    <Wind size={13} className="text-sky-500" /> Air Conditioning
                  </span>
                )}
                {room.facilities?.hasTv && (
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    <Tv size={13} className="text-indigo-500" /> Smart TV
                  </span>
                )}
                {room.facilities?.hasAttachedWashroom && (
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    <Bath size={13} className="text-teal-500" /> Attached Bath
                  </span>
                )}
                {room.facilities?.hasWindow && (
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    <Sun size={13} className="text-amber-500" /> Glass Window
                  </span>
                )}
                {room.facilities?.hasCupboard && (
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    <Box size={13} className="text-purple-500" /> Wardrobe
                  </span>
                )}
                {room.facilities?.hasStudyTable && (
                  <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                    <Layers size={13} className="text-emerald-500" /> Study Desk
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end bg-slate-50/50 dark:bg-slate-900/50">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
