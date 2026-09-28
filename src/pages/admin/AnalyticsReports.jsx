import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Calendar,
  Building2,
  Download,
  RefreshCw,
  SlidersHorizontal,
  TrendingUp,
  PieChart,
  BedDouble,
  Receipt,
  UtensilsCrossed,
  MessageSquareWarning,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import {
  getAnalyticsData,
  TIMEFRAMES,
  PROPERTIES_LIST,
  exportAnalyticsCSV,
  formatINR,
} from '../../services/analyticsService';
import MetricKpiGrid from '../../components/analytics/MetricKpiGrid';
import RevenueFlowChart from '../../components/analytics/RevenueFlowChart';
import OccupancyTrendChart from '../../components/analytics/OccupancyTrendChart';
import ExpenseBreakdownChart from '../../components/analytics/ExpenseBreakdownChart';
import ResidentDynamicsChart from '../../components/analytics/ResidentDynamicsChart';
import RoomCategoryYieldChart from '../../components/analytics/RoomCategoryYieldChart';
import ComplaintsSlaChart from '../../components/analytics/ComplaintsSlaChart';
import FoodSatisfactionChart from '../../components/analytics/FoodSatisfactionChart';
import PaymentChannelsChart from '../../components/analytics/PaymentChannelsChart';

export default function AnalyticsReports() {
  const [timeframe, setTimeframe] = useState(TIMEFRAMES.THIRTY_DAYS);
  const [selectedProperty, setSelectedProperty] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getAnalyticsData(timeframe, selectedProperty);
      setData(res);
    } catch (err) {
      console.error('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [timeframe, selectedProperty]);

  const handleExport = () => {
    if (!data) return;
    exportAnalyticsCSV(data, timeframe, selectedProperty);
    setToastMessage('Analytics CSV report successfully generated and downloaded!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const tabs = [
    { id: 'overview', label: 'Executive Overview', icon: Sparkles },
    { id: 'revenue', label: 'Revenue & Cash Flow', icon: TrendingUp },
    { id: 'occupancy', label: 'Occupancy & Beds', icon: BedDouble },
    { id: 'expenses', label: 'Expenses & Utilities', icon: Receipt },
    { id: 'operations', label: 'SLA & Food Quality', icon: MessageSquareWarning },
  ];

  return (
    <div className="w-full space-y-6 pb-12">
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-emerald-500/50 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* ── Page Header with Filter Bar ── */}
      <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-primary-500/10 text-primary-600 dark:text-primary-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Analytics & Financial Intelligence
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Interactive real-time occupancy telemetry, cash collection trends, and operational breakdown
              </p>
            </div>
          </div>
        </div>

        {/* Global Controls: Property Selector & Timeframe & Export */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Property Dropdown */}
          <div className="relative">
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl pl-8 pr-8 py-2.5 focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-hidden transition cursor-pointer"
            >
              {PROPERTIES_LIST.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.beds} Beds)
                </option>
              ))}
            </select>
            <Building2 className="w-4 h-4 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Timeframe Pill Buttons */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800">
            {[
              { id: TIMEFRAMES.SEVEN_DAYS, label: '7D' },
              { id: TIMEFRAMES.THIRTY_DAYS, label: '30D' },
              { id: TIMEFRAMES.NINETY_DAYS, label: '90D' },
              { id: TIMEFRAMES.ONE_YEAR, label: '1Y' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeframe(t.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  timeframe === t.id
                    ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Refresh Action */}
          <button
            type="button"
            onClick={loadData}
            title="Refresh analytics data"
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary-500' : ''}`} />
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      {data && <MetricKpiGrid kpis={data.kpis} />}

      {/* ── Tabbed Category Navigation ── */}
      <div className="flex items-center gap-1.5 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400 bg-primary-50/30 dark:bg-primary-950/20 rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Chart Layouts based on Active Tab ── */}
      {data && (
        <div className="space-y-6">
          {/* TAB 1: EXECUTIVE OVERVIEW (Rich multi-chart dashboard) */}
          {activeTab === 'overview' && (
            <>
              {/* Row 1: Revenue Flow & Bed Occupancy */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueFlowChart data={data.revenueTrends} />
                <OccupancyTrendChart data={data.occupancyTrends} />
              </div>

              {/* Row 2: Expense Breakdown & Resident Admissions dynamics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpenseBreakdownChart data={data.expenseBreakdown} />
                <ResidentDynamicsChart data={data.residentDynamics} />
              </div>

              {/* Row 3: Room Category Yields & SLA Helpdesk */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RoomCategoryYieldChart data={data.roomCategoryYield} />
                <ComplaintsSlaChart data={data.complaintSla} />
              </div>

              {/* Row 4: Food Satisfaction & Payment Methods */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FoodSatisfactionChart data={data.foodRatings} />
                <PaymentChannelsChart data={data.paymentMethods} />
              </div>
            </>
          )}

          {/* TAB 2: REVENUE & CASH FLOW */}
          {activeTab === 'revenue' && (
            <div className="space-y-6">
              <RevenueFlowChart data={data.revenueTrends} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PaymentChannelsChart data={data.paymentMethods} />
                <ExpenseBreakdownChart data={data.expenseBreakdown} />
              </div>
            </div>
          )}

          {/* TAB 3: OCCUPANCY & BEDS */}
          {activeTab === 'occupancy' && (
            <div className="space-y-6">
              <OccupancyTrendChart data={data.occupancyTrends} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RoomCategoryYieldChart data={data.roomCategoryYield} />
                <ResidentDynamicsChart data={data.residentDynamics} />
              </div>
            </div>
          )}

          {/* TAB 4: EXPENSES & UTILITIES */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <ExpenseBreakdownChart data={data.expenseBreakdown} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RevenueFlowChart data={data.revenueTrends} />
                <PaymentChannelsChart data={data.paymentMethods} />
              </div>
            </div>
          )}

          {/* TAB 5: SLA & FOOD QUALITY */}
          {activeTab === 'operations' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ComplaintsSlaChart data={data.complaintSla} />
                <FoodSatisfactionChart data={data.foodRatings} />
              </div>
              <ResidentDynamicsChart data={data.residentDynamics} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
