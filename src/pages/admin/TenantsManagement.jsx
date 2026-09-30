import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Users,
  Sparkles,
  ShieldCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  ExternalLink,
  Layers,
  Bed,
  RefreshCw,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import TenantDetailModal from '../../components/tenants/TenantDetailModal';
import tenantService from '../../services/tenantService';

export default function TenantsManagement() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Load tenants
  const fetchTenants = async () => {
    setLoading(true);
    try {
      const data = await tenantService.getTenants();
      setTenants(data || []);
    } catch (err) {
      console.error('Failed to load tenants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  // Handle Onboard Success
  const handleOnboardSuccess = async (payload) => {
    await tenantService.onboardTenant(payload);
    await fetchTenants();
  };

  // Handle Status Update
  const handleStatusUpdate = async (tenantId, statusData) => {
    const updated = await tenantService.updateTenantStatus(tenantId, statusData);
    if (updated) {
      setSelectedTenant(updated);
      await fetchTenants();
    }
  };

  // Filtered list
  const filteredTenants = tenants.filter((tenant) => {
    const nameMatch =
      tenant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.ownerProfile?.businessName?.toLowerCase().includes(searchQuery.toLowerCase());

    if (!nameMatch) return false;

    if (statusFilter === 'ACTIVE') return tenant.status === 'active';
    if (statusFilter === 'TRIAL') {
      const isTrial =
        tenant.ownerProfile?.licenseStatus === 'trial' ||
        tenant.ownerProfile?.activeLicenseId?.isTrial ||
        tenant.ownerProfile?.activeLicenseId?.status === 'trial';
      return isTrial;
    }
    if (statusFilter === 'PENDING_KYC') return tenant.ownerProfile?.approvalStatus === 'pending';

    return true;
  });

  // Calculate Aggregates
  const totalTenantsCount = tenants.length;
  const trialTenantsCount = tenants.filter(
    (t) =>
      t.ownerProfile?.licenseStatus === 'trial' ||
      t.ownerProfile?.activeLicenseId?.isTrial ||
      t.ownerProfile?.activeLicenseId?.status === 'trial'
  ).length;
  const totalHostelsCount = tenants.reduce((acc, t) => acc + (t.hostels?.length || t.hostelCount || 0), 0);
  const totalBedsCount = tenants.reduce((acc, t) => acc + (t.stats?.totalBeds || 0), 0);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Top Header & Onboarding CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="text-primary-600 dark:text-primary-400" size={28} />
            Tenants & Hostel Operators
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Directory of property businesses, active SaaS trial licenses, and assigned hostels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTenants}
            className="flex items-center gap-1.5"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/tenants/new')}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 shadow-sm cursor-pointer"
          >
            <Plus size={16} />
            Onboard New Tenant
          </Button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
            <Users size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Operators
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {totalTenantsCount}
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Sparkles size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Active Trials (14-Day)
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {trialTenantsCount}
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Building2 size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Managed Hostels
            </span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
              {totalHostelsCount}
            </span>
          </div>
        </Card>

        <Card className="p-5 flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Bed size={24} />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Platform Capacity
            </span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {totalBedsCount} <span className="text-sm font-normal text-slate-400">Beds</span>
            </span>
          </div>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by business, owner or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {[
            { key: 'ALL', label: 'All Tenants' },
            { key: 'TRIAL', label: 'Trial Licenses' },
            { key: 'ACTIVE', label: 'Active' },
            { key: 'PENDING_KYC', label: 'Pending KYC' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setStatusFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.key
                  ? 'bg-primary-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tenants Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-medium">Loading tenants directory...</p>
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Building2 size={36} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Tenants Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No operators match "${searchQuery}". Try changing your search query.`
              : 'No tenants onboarded under this filter.'}
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/admin/tenants/new')}
            className="mt-4 inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus size={14} />
            Onboard First Tenant
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredTenants.map((tenant) => {
            const ownerProfile = tenant.ownerProfile || {};
            const license = ownerProfile.activeLicenseId || {};
            const primaryHostel = tenant.hostels?.[0];
            const isTrial = license.isTrial || license.status === 'trial';

            return (
              <div
                key={tenant._id}
                onClick={() => {
                  setSelectedTenant(tenant);
                  setIsDetailOpen(true);
                }}
                className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                        {ownerProfile.businessName?.[0] || tenant.name?.[0] || 'T'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                            {ownerProfile.businessName || tenant.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {tenant.name} · {tenant.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {isTrial && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 uppercase tracking-wider">
                          14-Day Trial
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          ownerProfile.approvalStatus === 'approved'
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {ownerProfile.approvalStatus === 'approved' ? 'KYC Verified' : 'KYC Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Primary Hostel Pill */}
                  {primaryHostel && (
                    <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <Building2 size={14} className="text-primary-600 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {primaryHostel.name}
                        </span>
                        <span className="text-slate-400 truncate">
                          · {primaryHostel.address?.city || 'Bangalore'}
                        </span>
                      </div>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium shrink-0">
                        {primaryHostel.stats?.totalBeds || 45} Beds
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Footer Metrics */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>
                      <strong className="text-slate-800 dark:text-slate-200">{tenant.hostelCount || 1}</strong> Property
                    </span>
                    <span>
                      <strong className="text-slate-800 dark:text-slate-200">{tenant.stats?.totalBeds || 45}</strong> Total Beds
                    </span>
                  </div>

                  <span className="text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Inspect Details
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inspection Detail Modal */}
      <TenantDetailModal
        isOpen={isDetailOpen}
        tenant={selectedTenant}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedTenant(null);
        }}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}
