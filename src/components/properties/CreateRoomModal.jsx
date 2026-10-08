import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  DoorOpen,
  Wind,
  Tv,
  Bath,
  Sun,
  Box,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Sliders,
  Move,
  MapPin,
} from 'lucide-react';
import Button from '../ui/Button';
import RoomMapRenderer from './RoomMapRenderer';
import RoomMapEditor from './RoomMapEditor';
import {
  generateArchitecturalLayout,
  normalizeLayout,
} from '../../utils/roomLayoutEngine';

/**
 * Modal to Create or Edit Room with 2D Floor Plan Blueprint Preview & Map Customizer
 */
export default function CreateRoomModal({
  isOpen,
  onClose,
  floors = [],
  activeFloorNumber = 1,
  hostelId,
  onSaveRoom,
  existingRoom = null,
  onSaveLayout,  // Optional: separate callback for layout-only saves (uses PUT /room/:id/layout)
}) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'custom_editor'

  const [formData, setFormData] = useState({
    floorNumber: activeFloorNumber || (floors[0]?.floorNumber ?? 1),
    roomNumber: '',
    roomType: 'four_sharing',
    capacity: 4,
    monthlyRent: 8000,
    facilities: {
      hasAc: true,
      hasTv: true,
      hasAttachedWashroom: true,
      hasBalcony: false,
      hasWindow: true,
      hasCupboard: true,
      hasStudyTable: false,
      hasGeyser: true,
      hasWifi: true,
    },
  });

  const [customLayout, setCustomLayout] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-fill if editing existing room
  useEffect(() => {
    if (existingRoom) {
      const initFacs = existingRoom.facilities || {
        hasAc: Boolean(existingRoom.hasAc),
        hasTv: true,
        hasAttachedWashroom: existingRoom.washroomType !== 'common',
        hasBalcony: false,
        hasWindow: true,
        hasCupboard: true,
        hasStudyTable: false,
        hasGeyser: true,
        hasWifi: true,
      };

      const roomCap = Number(existingRoom.capacity) || 4;
      const roomNum = existingRoom.roomNumber || '101';

      setFormData({
        floorNumber: existingRoom.floorNumber || 1,
        roomNumber: roomNum,
        roomType: existingRoom.roomType || 'four_sharing',
        capacity: roomCap,
        monthlyRent: existingRoom.monthlyRent || 8000,
        facilities: initFacs,
      });

      const validLayout = normalizeLayout(existingRoom.layout, {
        roomNumber: roomNum,
        capacity: roomCap,
        facilities: initFacs,
      });
      setCustomLayout(validLayout);
    } else {
      // Suggest room number based on floor
      const currentFloorRoomsCount =
        floors.find((f) => f.floorNumber === Number(formData.floorNumber))?.rooms?.length || 0;
      const nextIdx = currentFloorRoomsCount + 1;
      const suggestedNum = `${formData.floorNumber}${nextIdx < 10 ? '0' + nextIdx : nextIdx}`;
      setFormData((prev) => ({ ...prev, roomNumber: suggestedNum }));

      setCustomLayout(
        generateArchitecturalLayout({
          roomNumber: suggestedNum,
          capacity: formData.capacity,
          facilities: formData.facilities,
        })
      );
    }
  }, [existingRoom, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => {
      let updated = { ...prev, [field]: value };
      if (field === 'roomType') {
        if (value === 'single') updated.capacity = 1;
        else if (value === 'double') updated.capacity = 2;
        else if (value === 'triple') updated.capacity = 3;
        else if (value === 'four_sharing') updated.capacity = 4;
        else if (value === 'five_sharing') updated.capacity = 5;
        else if (value === 'dormitory') updated.capacity = 6;

        // regenerate auto layout
        setCustomLayout(
          generateArchitecturalLayout({
            roomNumber: updated.roomNumber || '101',
            capacity: updated.capacity,
            facilities: updated.facilities,
          })
        );
      }
      return updated;
    });
    if (errorMsg) setErrorMsg('');
  };

  const handleFacilityToggle = (key) => {
    setFormData((prev) => {
      const updatedFacs = {
        ...prev.facilities,
        [key]: !prev.facilities[key],
      };
      setCustomLayout(
        generateArchitecturalLayout({
          roomNumber: prev.roomNumber || '101',
          capacity: prev.capacity,
          facilities: updatedFacs,
        })
      );
      return {
        ...prev,
        facilities: updatedFacs,
      };
    });
  };

  // Preview mock room object
  const previewRoom = {
    roomNumber: formData.roomNumber || '101',
    floorNumber: formData.floorNumber,
    roomType: formData.roomType,
    capacity: formData.capacity,
    monthlyRent: formData.monthlyRent,
    facilities: formData.facilities,
    beds: Array.from({ length: formData.capacity }, (_, i) => ({
      bedNumber: `${formData.roomNumber || '101'}-${String.fromCharCode(65 + i)}`,
      isOccupied: false,
      status: 'available',
      monthlyRent: formData.monthlyRent,
    })),
    layout:
      customLayout ||
      generateArchitecturalLayout({
        roomNumber: formData.roomNumber || '101',
        capacity: formData.capacity,
        facilities: formData.facilities,
      }),
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.roomNumber.trim()) {
      setErrorMsg('Please enter a valid room number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const targetFloor = floors.find((f) => f.floorNumber === Number(formData.floorNumber));
      const payload = {
        hostelId,
        floorNumber: Number(formData.floorNumber),
        floorName: targetFloor?.floorName || `Floor ${formData.floorNumber}`,
        roomNumber: formData.roomNumber.trim(),
        roomType: formData.roomType,
        capacity: Number(formData.capacity),
        facilities: formData.facilities,
        hasAc: formData.facilities.hasAc,
        washroomType: formData.facilities.hasAttachedWashroom ? 'attached' : 'common',
        monthlyRent: Number(formData.monthlyRent),
        layout: previewRoom.layout,
      };

      await onSaveRoom(payload, existingRoom?._id);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save room layout.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-fade-in">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto animate-scale-up">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center">
              <DoorOpen size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {existingRoom ? `Edit Room ${existingRoom.roomNumber}` : 'Create Room & Map Floor Plan'}
              </h2>
              <p className="text-xs text-slate-400">
                Top-down architectural map builder with custom drag & drop bed layouts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
            <AlertCircle size={15} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Navigation Tabs (Preview Mode vs Interactive Drag-and-Drop Map Editor) */}
        <div className="px-6 pt-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all ${
                activeTab === 'preview'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-900 shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Sparkles size={14} /> 1. Floor Plan Configuration & Live Preview
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('custom_editor')}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all ${
                activeTab === 'custom_editor'
                  ? 'border-primary-600 text-primary-600 dark:text-primary-400 bg-white dark:bg-slate-900 shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <Move size={14} /> 2. Interactive Map Editor (Drag & Rotate Objects)
            </button>
          </div>

          <span className="text-[11px] font-semibold text-slate-400 hidden sm:inline">
            Top View Architectural Plan
          </span>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          {activeTab === 'preview' ? (
            <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Form Controls (6 cols) */}
              <div className="lg:col-span-5 space-y-4">
                {/* Row 1: Floor & Room Number */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Select Floor
                    </label>
                    <select
                      value={formData.floorNumber}
                      onChange={(e) => handleChange('floorNumber', Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    >
                      {floors.map((flr) => (
                        <option key={flr.floorNumber} value={flr.floorNumber}>
                          {flr.floorName || `Floor ${flr.floorNumber}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Room Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 101, 204"
                      value={formData.roomNumber}
                      onChange={(e) => handleChange('roomNumber', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Row 2: Sharing Type & Capacity */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sharing Capacity
                    </label>
                    <select
                      value={formData.roomType}
                      onChange={(e) => handleChange('roomType', e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold"
                    >
                      <option value="single">1-Sharing (Single Bed)</option>
                      <option value="double">2-Sharing (Double Twin)</option>
                      <option value="triple">3-Sharing (Triple Suite)</option>
                      <option value="four_sharing">4-Sharing (Quad in Row)</option>
                      <option value="five_sharing">5-Sharing (Penta Suite)</option>
                      <option value="dormitory">Dormitory (6-Bed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Monthly Rent (₹ / Bed)
                    </label>
                    <input
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => handleChange('monthlyRent', e.target.value)}
                      className="w-full px-3 py-2 text-xs font-bold font-mono bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-primary-600 dark:text-primary-400"
                    />
                  </div>
                </div>

                {/* Facilities Checklist Toggles */}
                <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Room Facilities & Fixtures
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'hasAc', label: 'Air Conditioner', icon: Wind },
                      { key: 'hasTv', label: 'Smart TV', icon: Tv },
                      { key: 'hasAttachedWashroom', label: 'Attached Bath', icon: Bath },
                      { key: 'hasWindow', label: 'Glass Window', icon: Sun },
                      { key: 'hasCupboard', label: 'Lockers / Wardrobe', icon: Box },
                      { key: 'hasStudyTable', label: 'Study Desk', icon: Layers },
                    ].map((f) => {
                      const Icon = f.icon;
                      const isChecked = formData.facilities[f.key];
                      return (
                        <button
                          key={f.key}
                          type="button"
                          onClick={() => handleFacilityToggle(f.key)}
                          className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isChecked
                              ? 'bg-primary-50/80 dark:bg-primary-950/40 border-primary-300 dark:border-primary-800 text-primary-900 dark:text-primary-100 shadow-2xs'
                              : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          <Icon size={14} className={isChecked ? 'text-primary-600' : 'text-slate-400'} />
                          <span className="text-[11px] font-semibold">{f.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 text-xs">
                  💡 <strong>Custom Layout tip:</strong> Switch to the <strong>Interactive Map Editor</strong> tab above to freely drag objects, rotate beds, or customize sizes.
                </div>
              </div>

              {/* Right Column: Architectural Vector Room Map Preview (7 cols) */}
              <div className="lg:col-span-7 space-y-2.5 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-primary-600" />
                    Top-Down 2D Architectural Blueprint Map
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                    Live Scaled
                  </span>
                </div>

                {/* Real-time Rendered Architectural Vector Map */}
                <div className="flex-1 flex items-center justify-center">
                  <RoomMapRenderer
                    room={previewRoom}
                    layoutData={customLayout}
                    interactive={false}
                    showLegend={true}
                    showLabels={true}
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Custom Interactive Map Editor Tab */
            <div className="p-5 sm:p-6 space-y-4">
              <RoomMapEditor
                initialLayout={customLayout}
                roomNumber={formData.roomNumber || '101'}
                capacity={formData.capacity}
                facilities={formData.facilities}
                onChange={(updatedLayout) => setCustomLayout(updatedLayout)}
                onSaveLayout={onSaveLayout && existingRoom?._id
                  ? (layout) => onSaveLayout(existingRoom._id, layout, hostelId)
                  : null
                }
                roomId={existingRoom?._id}
                hostelId={hostelId}
              />
            </div>
          )}

          {/* Modal Footer */}
          <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} className="text-xs text-slate-500">
              Cancel
            </Button>

            <div className="flex items-center gap-3">
              {activeTab === 'preview' && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('custom_editor')}
                  className="text-xs font-bold"
                >
                  <Move size={14} /> Customize Coordinates
                </Button>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isSubmitting}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-6 shadow-xs"
              >
                {existingRoom ? 'Save Room & Map Layout' : 'Create Room & Save Blueprint'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
