import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Layers,
  Bed as BedIcon,
  DoorOpen,
  Plus,
  Search,
  Filter,
  ArrowLeft,
  Sparkles,
  MapPin,
  Wind,
  Bath,
  Tv,
  CheckCircle2,
  AlertCircle,
  Clock,
  Phone,
  Mail,
  User,
  Eye,
  Edit2,
  Trash2,
  List,
  Grid,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import propertyService from '../../services/propertyService';
import RoomVisualizer from '../../components/properties/RoomVisualizer';
import CreateRoomModal from '../../components/properties/CreateRoomModal';
import RoomDetailsModal from '../../components/properties/RoomDetailsModal';
import BedAllocationModal from '../../components/properties/BedAllocationModal';

/**
 * Dedicated Property Management & Units Hub
 * Contains 3 Sub-Views:
 *  1. 🗺️ Visual Floor Matrix (RedBus Top-Down Layout Blueprints)
 *  2. 🏢 Property Card & Specification Overview
 *  3. 📋 Units Table
 */
export default function PropertyDetailsPage() {
  const { propertyId } = useParams();
  console.log(propertyId, ":jhwegfuygwefbb")
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active Sub-View Tab: 'matrix' | 'overview' | 'table'
  const [activeTab, setActiveTab] = useState('matrix');

  // Active Floor Tab in Floor Matrix
  const [activeFloorNumber, setActiveFloorNumber] = useState(1);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [occupancyFilter, setOccupancyFilter] = useState('all');

  // Modals
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(false);
  const [isBedAllocationOpen, setIsBedAllocationOpen] = useState(false);

  const [activeRoomForDetails, setActiveRoomForDetails] = useState(null);
  const [activeBedForAllocation, setActiveBedForAllocation] = useState(null);
  const [editingRoom, setEditingRoom] = useState(null);

  // Load Property and Rooms Data
  useEffect(() => {
    async function loadData() {
      if (!propertyId) return;
      setLoading(true);

      const propData = await propertyService.getPropertyById(propertyId);
      setProperty(propData);

      const roomList = await propertyService.getPropertyRooms(propertyId);
      setRooms(roomList || []);

      if (roomList && roomList.length > 0) {
        const firstFloor = roomList[0].floorNumber || 1;
        setActiveFloorNumber(firstFloor);
      }

      setLoading(false);
    }
    loadData();
  }, [propertyId]);

  // Extract unique floors
  const availableFloors = Array.from(
    new Set(rooms.map((r) => r.floorNumber || 1))
  )
    .sort((a, b) => a - b)
    .map((num) => {
      const match = rooms.find((r) => r.floorNumber === num);
      return {
        floorNumber: num,
        floorName: match?.floorName || `Floor ${num}`,
        rooms: rooms.filter((r) => r.floorNumber === num),
      };
    });

  // Calculate Metrics
  const totalRoomsCount = rooms.length;
  const totalBedsCount = rooms.reduce((acc, r) => acc + (r.beds?.length || 0), 0);
  const totalOccupiedBeds = rooms.reduce(
    (acc, r) => acc + (r.beds?.filter((b) => b.isOccupied).length || 0),
    0
  );
  const totalAvailableBeds = Math.max(0, totalBedsCount - totalOccupiedBeds);
  const occupancyRate = totalBedsCount > 0 ? Math.round((totalOccupiedBeds / totalBedsCount) * 100) : 0;

  // Filter rooms
  const filteredRooms = rooms.filter((r) => {
    if (activeTab === 'matrix' && r.floorNumber !== activeFloorNumber) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = r.roomNumber?.toLowerCase().includes(q);
      const matchResident = r.beds?.some((b) =>
        (b.residentId?.name || b.residentName || '').toLowerCase().includes(q)
      );
      if (!matchNum && !matchResident) return false;
    }

    if (typeFilter !== 'all' && r.roomType !== typeFilter) return false;

    if (occupancyFilter !== 'all') {
      const occ = r.beds?.filter((b) => b.isOccupied).length || 0;
      const cap = r.beds?.length || r.capacity || 1;
      if (occupancyFilter === 'vacant' && occ === cap) return false;
      if (occupancyFilter === 'full' && occ < cap) return false;
      if (occupancyFilter === 'empty' && occ > 0) return false;
    }

    return true;
  });

  // Handlers
  const handleSaveRoom = async (payload, roomId) => {
    let saved = null;
    if (roomId) {
      saved = await propertyService.updateRoom(roomId, { ...payload, hostelId: propertyId });
    } else {
      saved = await propertyService.createRoom({ ...payload, hostelId: propertyId });
    }
    const updated = await propertyService.getPropertyRooms(propertyId);
    setRooms(updated);

    if (activeRoomForDetails && (activeRoomForDetails._id === roomId || activeRoomForDetails.roomNumber === payload.roomNumber)) {
      const refreshed = updated.find((r) => r._id === roomId || r.roomNumber === payload.roomNumber) || saved;
      setActiveRoomForDetails(refreshed);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    await propertyService.deleteRoom(roomId, propertyId);
    const updated = await propertyService.getPropertyRooms(propertyId);
    setRooms(updated);
  };

  const handleSaveBedAllocation = async (roomId, bedNumber, updateData) => {
    await propertyService.updateBedAllocation(
      propertyId,
      roomId,
      bedNumber,
      updateData
    );
    const updated = await propertyService.getPropertyRooms(propertyId);
    setRooms(updated);

    if (activeRoomForDetails && activeRoomForDetails._id === roomId) {
      const refreshed = updated.find((r) => r._id === roomId);
      setActiveRoomForDetails(refreshed);
    }
  };

  /**
   * Save ONLY the visual layout for a room (coordinates, element positions).
   * Uses PUT /api/v1/room/:roomId/layout - does NOT update business data.
   */
  const handleSaveLayout = async (roomId, layout, hostelId) => {
    const result = await propertyService.updateRoomLayout(roomId, layout, hostelId || propertyId);
    if (result?.success) {
      // Update the rooms list with the new layout
      setRooms((prev) =>
        prev.map((r) => (r._id === roomId ? { ...r, layout: result.layout || layout } : r))
      );
    }
    return result;
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-slate-400 space-y-3">
        <Building2 size={36} className="mx-auto text-primary-500 animate-bounce" />
        <p>Loading property details & unit layout map...</p>
      </div>
    );
  }

  const propName = property?.name || 'Hostel Property';
  const propCity = property?.address?.city || 'Bangalore';
  const propStreet = property?.address?.street || '';

  return (
    <div className="w-full space-y-6 pb-12 animate-fade-in">
      {/* 1. Breadcrumbs & Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Properties Directory
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center font-bold">
              <Building2 size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {propName}
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-100 dark:bg-primary-900/60 text-primary-700 dark:text-primary-300 uppercase tracking-wider">
                  {property?.hostelType?.replace('_', ' ') || 'Co-Living'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                <MapPin size={12} className="text-primary-500" />
                {propStreet ? `${propStreet}, ` : ''}{propCity}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => {
              setEditingRoom(null);
              setIsCreateRoomOpen(true);
            }}
            className="flex items-center gap-2 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-xs"
          >
            <Plus size={15} />
            Add Room / Unit
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Floors</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {availableFloors.length || 1}
            </span>
            <span className="text-[10px] font-bold text-slate-400">Floors</span>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Units</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {totalRoomsCount}
            </span>
            <span className="text-[10px] font-bold text-slate-400">Rooms</span>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Bed Capacity</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {totalBedsCount}
            </span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
              {totalAvailableBeds} Vacant
            </span>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Occupancy Rate</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-primary-600 dark:text-primary-400">
              {occupancyRate}%
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {totalOccupiedBeds} Occupied
            </span>
          </div>
        </Card>
      </div>

      {/* 3. Sub-View Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'matrix'
                ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
          >
            <Sparkles size={14} /> 1. Floor & Room Layout Map
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
          >
            <Building2 size={14} /> 2. Property Overview Card
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'table'
                ? 'bg-white dark:bg-slate-900 text-primary-600 dark:text-primary-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
          >
            <List size={14} /> 3. Units Table
          </button>
        </div>

        {/* Search & Filter when in matrix or table view */}
        {(activeTab === 'matrix' || activeTab === 'table') && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search unit / resident..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white w-48 sm:w-60"
              />
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* SUB-VIEW 1: FLOOR & ROOM LAYOUT MATRIX (REDBUS BLUEPRINTS)               */}
      {/* ========================================================================= */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Floor Selection Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {availableFloors.map((flr) => {
              const isActive = activeFloorNumber === flr.floorNumber;
              const floorBeds = flr.rooms?.reduce((acc, r) => acc + (r.beds?.length || 0), 0) || 0;
              const floorOccupied = flr.rooms?.reduce(
                (acc, r) => acc + (r.beds?.filter((b) => b.isOccupied).length || 0),
                0
              ) || 0;

              return (
                <button
                  key={flr.floorNumber}
                  type="button"
                  onClick={() => setActiveFloorNumber(flr.floorNumber)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${isActive
                      ? 'bg-primary-600 text-white shadow-xs ring-2 ring-primary-500/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                >
                  <Layers size={14} className={isActive ? 'text-white' : 'text-primary-600'} />
                  <span>{flr.floorName}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md ${isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}
                  >
                    {floorOccupied}/{floorBeds} Beds
                  </span>
                </button>
              );
            })}
          </div>

          {/* Room Cards Grid */}
          {filteredRooms.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
              <DoorOpen size={36} className="mx-auto text-slate-400" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                No rooms configured on this floor yet.
              </p>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsCreateRoomOpen(true)}
                className="text-xs inline-flex items-center gap-1.5"
              >
                <Plus size={13} /> Add Room Unit
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredRooms.map((room) => {
                const roomBeds = room.beds || [];
                const occupiedBeds = roomBeds.filter((b) => b.isOccupied).length;
                const totalBeds = roomBeds.length || room.capacity || 2;
                const isFullyOccupied = occupiedBeds === totalBeds;

                return (
                  <Card
                    key={room._id}
                    className="p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-md transition-all space-y-3.5 relative group"
                  >
                    {/* Room Header */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-primary-50 dark:bg-primary-950/60 text-primary-600 flex items-center justify-center font-mono font-bold text-xs">
                          {room.roomNumber}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            Room {room.roomNumber}
                          </span>
                          <span className="text-[10px] text-slate-400 capitalize">
                            {room.roomType?.replace('_', ' ')} • ₹{room.monthlyRent || 8500}/mo
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveRoomForDetails(room);
                            setIsRoomDetailsOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-primary-600 transition-colors"
                          title="View Blueprint & Beds"
                        >
                          <Eye size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingRoom(room);
                            setIsCreateRoomOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 hover:text-primary-600 transition-colors"
                          title="Edit Coordinates & Layout"
                        >
                          <Edit2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Architectural 2D Vector Map Visualizer */}
                    <div className="w-full">
                      <RoomVisualizer
                        room={room}
                        onSelectBed={(bed) => {
                          setActiveRoomForDetails(room);
                          setActiveBedForAllocation(bed);
                          setIsBedAllocationOpen(true);
                        }}
                        onAllocateBed={(bed) => {
                          setActiveRoomForDetails(room);
                          setActiveBedForAllocation(bed);
                          setIsBedAllocationOpen(true);
                        }}
                        compact={true}
                        showLegend={false}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 2: PROPERTY OVERVIEW CARD & SPECIFICATIONS                      */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <Card className="lg:col-span-8 p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Property Specifications
              </h3>
              <p className="text-xs text-slate-400">
                Detailed building parameters, contact records, and policies
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-slate-400 font-semibold block">Contact Email</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {property?.contactEmail || 'contact@hostel.in'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-slate-400 font-semibold block">Contact Phone</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {property?.contactPhone || '+91 98765 00000'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-slate-400 font-semibold block">Notice Period</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {property?.rules?.noticePeriodDays || 30} Days
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1">
                <span className="text-slate-400 font-semibold block">Security Deposit</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {property?.rules?.securityDepositMonths || 1} Month Rent
                </span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                Enabled Amenities
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                {Object.entries(property?.amenities || { hasWifi: true, hasMess: true, hasAc: true, hasPowerBackup: true, hasLaundry: true, hasCctv: true }).map(([key, val]) => (
                  <div
                    key={key}
                    className={`p-2.5 rounded-xl border flex items-center gap-2 ${val
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-400'
                      }`}
                  >
                    <CheckCircle2 size={14} className={val ? 'text-emerald-600' : 'text-slate-400'} />
                    <span className="font-medium capitalize">{key.replace('has', '')}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Right Column: Building Summary */}
          <Card className="lg:col-span-4 p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Building Summary
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Hostel Type</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{property?.hostelType || 'Co-living'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Total Floors</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{availableFloors.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-slate-400">Total Rooms</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{totalRoomsCount}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-400">Total Beds</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{totalBedsCount}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-VIEW 3: UNITS TABLE                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'table' && (
        <Card className="p-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Room No.</th>
                  <th className="py-3.5 px-4">Floor</th>
                  <th className="py-3.5 px-4">Sharing Type</th>
                  <th className="py-3.5 px-4">Occupancy Status</th>
                  <th className="py-3.5 px-4">Monthly Rent</th>
                  <th className="py-3.5 px-4">Facilities</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rooms.map((r) => {
                  const roomBeds = r.beds || [];
                  const occ = roomBeds.filter((b) => b.isOccupied).length;
                  const total = roomBeds.length || r.capacity || 2;
                  const isFull = occ === total;

                  return (
                    <tr key={r._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-bold font-mono text-slate-900 dark:text-white">
                        {r.roomNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {r.floorName || `Floor ${r.floorNumber}`}
                      </td>
                      <td className="py-3 px-4 capitalize font-medium text-slate-700 dark:text-slate-300">
                        {r.roomType?.replace('_', ' ')}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-md uppercase ${isFull
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : occ > 0
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                        >
                          {occ}/{total} Beds Occupied
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                        ₹{r.monthlyRent || 8500}
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        <div className="flex items-center gap-1.5">
                          {r.facilities?.hasAc && <Wind size={13} className="text-sky-500" title="AC" />}
                          {r.facilities?.hasTv && <Tv size={13} className="text-indigo-500" title="TV" />}
                          {r.facilities?.hasAttachedWashroom && (
                            <Bath size={13} className="text-teal-500" title="Bath" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveRoomForDetails(r);
                              setIsRoomDetailsOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 hover:text-primary-600"
                            title="Open Blueprint Map"
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRoom(r);
                              setIsCreateRoomOpen(true);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 hover:text-primary-600"
                            title="Edit Room"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete Room ${r.roomNumber}?`)) {
                                handleDeleteRoom(r._id);
                              }
                            }}
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950 text-red-500"
                            title="Delete Room"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* ========================================================================= */}
      {/* MODALS                                                                    */}
      {/* ========================================================================= */}
      {isCreateRoomOpen && (
        <CreateRoomModal
          isOpen={isCreateRoomOpen}
          onClose={() => {
            setIsCreateRoomOpen(false);
            setEditingRoom(null);
          }}
          floors={availableFloors}
          activeFloorNumber={activeFloorNumber}
          hostelId={propertyId}
          onSaveRoom={handleSaveRoom}
          onSaveLayout={handleSaveLayout}
          existingRoom={editingRoom}
        />
      )}

      {isRoomDetailsOpen && activeRoomForDetails && (
        <RoomDetailsModal
          isOpen={isRoomDetailsOpen}
          onClose={() => {
            setIsRoomDetailsOpen(false);
            setActiveRoomForDetails(null);
          }}
          room={activeRoomForDetails}
          onSelectBed={(bed) => {
            setActiveBedForAllocation(bed);
            setIsBedAllocationOpen(true);
          }}
          onEditRoom={(r) => {
            setEditingRoom(r);
            setIsCreateRoomOpen(true);
          }}
          onDeleteRoom={handleDeleteRoom}
        />
      )}

      {isBedAllocationOpen && activeBedForAllocation && activeRoomForDetails && (
        <BedAllocationModal
          isOpen={isBedAllocationOpen}
          onClose={() => {
            setIsBedAllocationOpen(false);
            setActiveBedForAllocation(null);
          }}
          bed={activeBedForAllocation}
          room={activeRoomForDetails}
          onSaveAllocation={(roomId, bedNumber, updateData) =>
            handleSaveBedAllocation(roomId, bedNumber, updateData)
          }
        />
      )}
    </div>
  );
}
