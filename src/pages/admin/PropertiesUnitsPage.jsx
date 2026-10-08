import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Plus,
  Search,
  CheckCircle2,
  Layers,
  Bed,
  DoorOpen,
  ArrowRight,
  Sparkles,
  Filter,
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import propertyService from '../../services/propertyService';

/**
 * Properties Directory Page
 * Displays rich building cards for all properties.
 * Clicking a property card navigates directly into the dedicated Property & Units Hub.
 */
export default function PropertiesUnitsPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    async function loadProperties() {
      setLoading(true);
      const list = await propertyService.getProperties();
      setProperties(list || []);
      setLoading(false);
    }
    loadProperties();
  }, []);

  const filteredProperties = properties.filter((p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCity = p.address?.city?.toLowerCase().includes(q);
      if (!matchName && !matchCity) return false;
    }
    if (typeFilter !== 'all' && p.hostelType !== typeFilter) return false;
    return true;
  });

  const totalBedsAcross = properties.reduce(
    (acc, p) => acc + (p.stats?.totalBeds || 0),
    0
  );
  const totalOccupiedAcross = properties.reduce(
    (acc, p) => acc + (p.stats?.occupiedBeds || 0),
    0
  );

  return (
    <div className="w-full space-y-6 pb-12 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="text-primary-600 dark:text-primary-400" size={24} />
            Properties Directory
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Select a property below to manage floor plans, interactive 2D room maps, units, and bed occupancy.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/admin/tenants/new">
            <Button
              type="button"
              variant="primary"
              size="md"
              className="flex items-center gap-2 text-xs font-bold bg-primary-600 hover:bg-primary-700 text-white shadow-xs"
            >
              <Plus size={15} />
              Onboard New Property / Tenant
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Hostels</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {properties.length}
            </span>
            <span className="text-[10px] font-bold text-slate-400">Properties</span>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Total Bed Capacity</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {totalBedsAcross}
            </span>
            <span className="text-[10px] font-bold text-indigo-500">Beds</span>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Occupied Beds</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-rose-600 dark:text-rose-400">
              {totalOccupiedAcross}
            </span>
            <span className="text-[10px] font-bold text-rose-500">Live</span>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-400 block">Vacant Beds</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              {Math.max(0, totalBedsAcross - totalOccupiedAcross)}
            </span>
            <span className="text-[10px] font-bold text-emerald-600">Available</span>
          </div>
        </Card>
      </div>

      {/* Search & Type Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search property name or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold cursor-pointer"
          >
            <option value="all">All Hostel Types</option>
            <option value="co_living">Co-Living</option>
            <option value="boys">Boys PG / Hostel</option>
            <option value="girls">Girls PG / Hostel</option>
          </select>
        </div>
      </div>

      {/* Properties Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-slate-400 space-y-3">
          <Building2 size={36} className="mx-auto text-primary-500 animate-bounce" />
          <p>Fetching properties from database...</p>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
          <Building2 size={36} className="mx-auto text-slate-400" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No properties found matching your search.
          </p>
          <Link to="/admin/tenants/new">
            <Button type="button" variant="primary" size="sm" className="text-xs">
              <Plus size={13} /> Onboard New Property
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => {
            const totalBeds = prop.stats?.totalBeds || 0;
            const occupiedBeds = prop.stats?.occupiedBeds || 0;
            const occRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;
            const targetPath = `/admin/properties/${prop._id}`;

            return (
              <Card
                key={prop._id}
                onClick={() => navigate(targetPath)}
                className="p-0 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:shadow-lg transition-all rounded-3xl overflow-hidden cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Property Cover Image or Graphic */}
                  <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
                    <img
                      src={
                        prop.photos?.[0]?.url ||
                        'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop&q=80'
                      }
                      alt={prop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Hostel Type Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs border border-white/20">
                        {prop.hostelType?.replace('_', ' ') || 'Co-Living'}
                      </span>
                    </div>

                    {/* Occupancy Indicator */}
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-500 text-white shadow-xs">
                        {occRate}% Occupied
                      </span>
                    </div>

                    {/* Title & Location on Image */}
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="text-base font-bold leading-tight drop-shadow-sm truncate">
                        {prop.name}
                      </h3>
                      <p className="text-[11px] text-slate-200 flex items-center gap-1 mt-0.5 drop-shadow-sm truncate">
                        <MapPin size={11} className="text-primary-400 shrink-0" />
                        {prop.address?.city || 'Bangalore'}, {prop.address?.state || 'Karnataka'}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 space-y-3.5 text-xs">
                    {/* Stat Badges Row */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Floors</span>
                        <span className="font-black text-slate-900 dark:text-white">
                          {prop.stats?.totalFloors || prop.floors?.length || 1}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Rooms</span>
                        <span className="font-black text-slate-900 dark:text-white">
                          {prop.stats?.totalRooms || 0}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-[10px] text-slate-400 block font-semibold">Total Beds</span>
                        <span className="font-black text-indigo-600 dark:text-indigo-400">
                          {totalBeds}
                        </span>
                      </div>
                    </div>

                    {/* Contact & Amenities */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>{prop.contactEmail || 'contact@hostel.in'}</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {prop.contactPhone || '+91 98765 00000'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 flex items-center justify-between text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:bg-primary-50/50 dark:group-hover:bg-primary-950/30 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Sparkles size={14} /> Open Floor Plans & Units Hub
                  </span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
