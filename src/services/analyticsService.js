/**
 * Analytics & Reports Data Service
 * ────────────────────────────────────────────────────────────────────────────
 * Provides comprehensive time-series analytics, occupancy metrics, financial
 * breakdowns, operational SLA stats, and export utilities for Super Admin and
 * Property Managers / Tenants.
 */

export const TIMEFRAMES = {
  SEVEN_DAYS: '7d',
  THIRTY_DAYS: '30d',
  NINETY_DAYS: '90d',
  ONE_YEAR: '1y',
};

// ── Super Admin Mock Analytics Dataset ──────────────────────────────────────
const superAdminData = {
  [TIMEFRAMES.SEVEN_DAYS]: {
    kpis: {
      totalRevenue: 342000,
      revenueGrowth: 14.2,
      occupancyRate: 88.4,
      occupancyGrowth: 2.1,
      activeHostels: 142,
      hostelGrowth: 5.6,
      pendingDues: 28500,
      dueRate: -3.8,
      activeBeds: 4120,
      totalBeds: 4660,
    },
    revenueTrends: [
      { date: 'Mon', grossRevenue: 48000, netCollected: 45000, pendingDues: 3000, refunds: 500 },
      { date: 'Tue', grossRevenue: 52000, netCollected: 49500, pendingDues: 2500, refunds: 0 },
      { date: 'Wed', grossRevenue: 41000, netCollected: 38000, pendingDues: 3000, refunds: 800 },
      { date: 'Thu', grossRevenue: 59000, netCollected: 56000, pendingDues: 3000, refunds: 200 },
      { date: 'Fri', grossRevenue: 64000, netCollected: 61000, pendingDues: 3000, refunds: 1200 },
      { date: 'Sat', grossRevenue: 39000, netCollected: 36000, pendingDues: 3000, refunds: 400 },
      { date: 'Sun', grossRevenue: 39000, netCollected: 37500, pendingDues: 1500, refunds: 100 },
    ],
    occupancyTrends: [
      { name: 'Mon', occupied: 4080, total: 4660, rate: 87.5 },
      { name: 'Tue', occupied: 4100, total: 4660, rate: 87.9 },
      { name: 'Wed', occupied: 4110, total: 4660, rate: 88.1 },
      { name: 'Thu', occupied: 4115, total: 4660, rate: 88.3 },
      { name: 'Fri', occupied: 4120, total: 4660, rate: 88.4 },
      { name: 'Sat', occupied: 4125, total: 4660, rate: 88.5 },
      { name: 'Sun', occupied: 4120, total: 4660, rate: 88.4 },
    ],
    expenseBreakdown: [
      { name: 'Electricity & Power', value: 84000, color: '#6366f1' },
      { name: 'Food & Groceries', value: 112000, color: '#06b6d4' },
      { name: 'Staff Salaries', value: 78000, color: '#10b981' },
      { name: 'Maintenance & Repairs', value: 34000, color: '#f59e0b' },
      { name: 'Water & Waste Mgmt', value: 18000, color: '#8b5cf6' },
      { name: 'High-Speed Internet', value: 16000, color: '#ec4899' },
    ],
    residentDynamics: [
      { period: 'Mon', moveIns: 18, moveOuts: 4, netGrowth: 14 },
      { period: 'Tue', moveIns: 12, moveOuts: 2, netGrowth: 10 },
      { period: 'Wed', moveIns: 15, moveOuts: 5, netGrowth: 10 },
      { period: 'Thu', moveIns: 9, moveOuts: 4, netGrowth: 5 },
      { period: 'Fri', moveIns: 22, moveOuts: 6, netGrowth: 16 },
      { period: 'Sat', moveIns: 14, moveOuts: 3, netGrowth: 11 },
      { period: 'Sun', moveIns: 8, moveOuts: 2, netGrowth: 6 },
    ],
    roomCategoryYield: [
      { category: 'Single Private', beds: 820, occupied: 780, rate: 95.1, adr: 14500 },
      { category: '2-Sharing Deluxe', beds: 1840, occupied: 1680, rate: 91.3, adr: 9800 },
      { category: '3-Sharing Classic', beds: 1400, occupied: 1210, rate: 86.4, adr: 7200 },
      { category: '4-Sharing Dorm', beds: 600, occupied: 450, rate: 75.0, adr: 5400 },
    ],
    complaintSla: [
      { category: 'WiFi & Network', total: 42, resolved: 39, avgHours: 2.1, slaTarget: 4 },
      { category: 'Plumbing', total: 31, resolved: 28, avgHours: 3.8, slaTarget: 6 },
      { category: 'Electrical', total: 24, resolved: 23, avgHours: 1.9, slaTarget: 3 },
      { category: 'Food & Mess', total: 19, resolved: 18, avgHours: 4.2, slaTarget: 8 },
      { category: 'Cleaning / Maid', total: 36, resolved: 35, avgHours: 1.5, slaTarget: 2 },
      { category: 'Security / Access', total: 8, resolved: 8, avgHours: 0.8, slaTarget: 2 },
    ],
    foodRatings: [
      { day: 'Mon', breakfast: 4.4, lunch: 4.1, dinner: 4.3, overall: 4.26 },
      { day: 'Tue', breakfast: 4.6, lunch: 4.2, dinner: 4.5, overall: 4.43 },
      { day: 'Wed', breakfast: 4.3, lunch: 4.0, dinner: 4.1, overall: 4.13 },
      { day: 'Thu', breakfast: 4.5, lunch: 4.4, dinner: 4.6, overall: 4.50 },
      { day: 'Fri', breakfast: 4.7, lunch: 4.5, dinner: 4.8, overall: 4.66 },
      { day: 'Sat', breakfast: 4.8, lunch: 4.6, dinner: 4.7, overall: 4.70 },
      { day: 'Sun', breakfast: 4.9, lunch: 4.7, dinner: 4.8, overall: 4.80 },
    ],
    paymentMethods: [
      { name: 'UPI (GPay / PhonePe)', value: 58, color: '#6366f1' },
      { name: 'Net Banking', value: 22, color: '#06b6d4' },
      { name: 'Debit / Credit Card', value: 12, color: '#10b981' },
      { name: 'Auto-Debit NACH', value: 6, color: '#f59e0b' },
      { name: 'Cash / Cheque', value: 2, color: '#94a3b8' },
    ],
  },
  [TIMEFRAMES.THIRTY_DAYS]: {
    kpis: {
      totalRevenue: 1485000,
      revenueGrowth: 18.5,
      occupancyRate: 91.2,
      occupancyGrowth: 4.3,
      activeHostels: 142,
      hostelGrowth: 8.2,
      pendingDues: 64200,
      dueRate: -11.4,
      activeBeds: 4250,
      totalBeds: 4660,
    },
    revenueTrends: [
      { date: 'Week 1', grossRevenue: 340000, netCollected: 325000, pendingDues: 15000, refunds: 2000 },
      { date: 'Week 2', grossRevenue: 385000, netCollected: 370000, pendingDues: 15000, refunds: 3200 },
      { date: 'Week 3', grossRevenue: 395000, netCollected: 382000, pendingDues: 13000, refunds: 1800 },
      { date: 'Week 4', grossRevenue: 365000, netCollected: 348000, pendingDues: 17000, refunds: 2400 },
    ],
    occupancyTrends: [
      { name: 'Week 1', occupied: 4050, total: 4660, rate: 86.9 },
      { name: 'Week 2', occupied: 4180, total: 4660, rate: 89.6 },
      { name: 'Week 3', occupied: 4220, total: 4660, rate: 90.5 },
      { name: 'Week 4', occupied: 4250, total: 4660, rate: 91.2 },
    ],
    expenseBreakdown: [
      { name: 'Electricity & Power', value: 340000, color: '#6366f1' },
      { name: 'Food & Groceries', value: 460000, color: '#06b6d4' },
      { name: 'Staff Salaries', value: 310000, color: '#10b981' },
      { name: 'Maintenance & Repairs', value: 145000, color: '#f59e0b' },
      { name: 'Water & Waste Mgmt', value: 72000, color: '#8b5cf6' },
      { name: 'High-Speed Internet', value: 64000, color: '#ec4899' },
    ],
    residentDynamics: [
      { period: 'Week 1', moveIns: 84, moveOuts: 18, netGrowth: 66 },
      { period: 'Week 2', moveIns: 92, moveOuts: 12, netGrowth: 80 },
      { period: 'Week 3', moveIns: 68, moveOuts: 22, netGrowth: 46 },
      { period: 'Week 4', moveIns: 75, moveOuts: 15, netGrowth: 60 },
    ],
    roomCategoryYield: [
      { category: 'Single Private', beds: 820, occupied: 795, rate: 96.9, adr: 14500 },
      { category: '2-Sharing Deluxe', beds: 1840, occupied: 1720, rate: 93.4, adr: 9800 },
      { category: '3-Sharing Classic', beds: 1400, occupied: 1260, rate: 90.0, adr: 7200 },
      { category: '4-Sharing Dorm', beds: 600, occupied: 475, rate: 79.1, adr: 5400 },
    ],
    complaintSla: [
      { category: 'WiFi & Network', total: 168, resolved: 162, avgHours: 2.3, slaTarget: 4 },
      { category: 'Plumbing', total: 114, resolved: 109, avgHours: 3.4, slaTarget: 6 },
      { category: 'Electrical', total: 92, resolved: 89, avgHours: 1.8, slaTarget: 3 },
      { category: 'Food & Mess', total: 76, resolved: 72, avgHours: 3.9, slaTarget: 8 },
      { category: 'Cleaning / Maid', total: 142, resolved: 139, avgHours: 1.4, slaTarget: 2 },
      { category: 'Security / Access', total: 32, resolved: 32, avgHours: 0.9, slaTarget: 2 },
    ],
    foodRatings: [
      { day: 'Wk 1', breakfast: 4.3, lunch: 4.1, dinner: 4.2, overall: 4.20 },
      { day: 'Wk 2', breakfast: 4.5, lunch: 4.3, dinner: 4.4, overall: 4.40 },
      { day: 'Wk 3', breakfast: 4.6, lunch: 4.4, dinner: 4.5, overall: 4.50 },
      { day: 'Wk 4', breakfast: 4.7, lunch: 4.6, dinner: 4.7, overall: 4.66 },
    ],
    paymentMethods: [
      { name: 'UPI (GPay / PhonePe)', value: 62, color: '#6366f1' },
      { name: 'Net Banking', value: 19, color: '#06b6d4' },
      { name: 'Debit / Credit Card', value: 11, color: '#10b981' },
      { name: 'Auto-Debit NACH', value: 6, color: '#f59e0b' },
      { name: 'Cash / Cheque', value: 2, color: '#94a3b8' },
    ],
  },
  [TIMEFRAMES.NINETY_DAYS]: {
    kpis: {
      totalRevenue: 4320000,
      revenueGrowth: 22.4,
      occupancyRate: 89.8,
      occupancyGrowth: 6.7,
      activeHostels: 142,
      hostelGrowth: 14.1,
      pendingDues: 112000,
      dueRate: -18.2,
      activeBeds: 4185,
      totalBeds: 4660,
    },
    revenueTrends: [
      { date: 'Month 1', grossRevenue: 1380000, netCollected: 1320000, pendingDues: 60000, refunds: 8000 },
      { date: 'Month 2', grossRevenue: 1450000, netCollected: 1410000, pendingDues: 40000, refunds: 9500 },
      { date: 'Month 3', grossRevenue: 1490000, netCollected: 1460000, pendingDues: 30000, refunds: 6200 },
    ],
    occupancyTrends: [
      { name: 'Month 1', occupied: 4020, total: 4660, rate: 86.2 },
      { name: 'Month 2', occupied: 4140, total: 4660, rate: 88.8 },
      { name: 'Month 3', occupied: 4250, total: 4660, rate: 91.2 },
    ],
    expenseBreakdown: [
      { name: 'Electricity & Power', value: 980000, color: '#6366f1' },
      { name: 'Food & Groceries', value: 1350000, color: '#06b6d4' },
      { name: 'Staff Salaries', value: 910000, color: '#10b981' },
      { name: 'Maintenance & Repairs', value: 410000, color: '#f59e0b' },
      { name: 'Water & Waste Mgmt', value: 210000, color: '#8b5cf6' },
      { name: 'High-Speed Internet', value: 185000, color: '#ec4899' },
    ],
    residentDynamics: [
      { period: 'Month 1', moveIns: 240, moveOuts: 65, netGrowth: 175 },
      { period: 'Month 2', moveIns: 275, moveOuts: 58, netGrowth: 217 },
      { period: 'Month 3', moveIns: 310, moveOuts: 70, netGrowth: 240 },
    ],
    roomCategoryYield: [
      { category: 'Single Private', beds: 820, occupied: 790, rate: 96.3, adr: 14500 },
      { category: '2-Sharing Deluxe', beds: 1840, occupied: 1700, rate: 92.3, adr: 9800 },
      { category: '3-Sharing Classic', beds: 1400, occupied: 1240, rate: 88.5, adr: 7200 },
      { category: '4-Sharing Dorm', beds: 600, occupied: 455, rate: 75.8, adr: 5400 },
    ],
    complaintSla: [
      { category: 'WiFi & Network', total: 480, resolved: 468, avgHours: 2.4, slaTarget: 4 },
      { category: 'Plumbing', total: 330, resolved: 318, avgHours: 3.6, slaTarget: 6 },
      { category: 'Electrical', total: 265, resolved: 259, avgHours: 1.9, slaTarget: 3 },
      { category: 'Food & Mess', total: 215, resolved: 205, avgHours: 4.1, slaTarget: 8 },
      { category: 'Cleaning / Maid', total: 390, resolved: 382, avgHours: 1.5, slaTarget: 2 },
      { category: 'Security / Access', total: 95, resolved: 94, avgHours: 0.9, slaTarget: 2 },
    ],
    foodRatings: [
      { day: 'Month 1', breakfast: 4.2, lunch: 4.0, dinner: 4.1, overall: 4.10 },
      { day: 'Month 2', breakfast: 4.4, lunch: 4.2, dinner: 4.3, overall: 4.30 },
      { day: 'Month 3', breakfast: 4.7, lunch: 4.5, dinner: 4.6, overall: 4.60 },
    ],
    paymentMethods: [
      { name: 'UPI (GPay / PhonePe)', value: 65, color: '#6366f1' },
      { name: 'Net Banking', value: 18, color: '#06b6d4' },
      { name: 'Debit / Credit Card', value: 10, color: '#10b981' },
      { name: 'Auto-Debit NACH', value: 5, color: '#f59e0b' },
      { name: 'Cash / Cheque', value: 2, color: '#94a3b8' },
    ],
  },
  [TIMEFRAMES.ONE_YEAR]: {
    kpis: {
      totalRevenue: 17400000,
      revenueGrowth: 34.8,
      occupancyRate: 92.5,
      occupancyGrowth: 11.2,
      activeHostels: 142,
      hostelGrowth: 28.5,
      pendingDues: 185000,
      dueRate: -24.5,
      activeBeds: 4310,
      totalBeds: 4660,
    },
    revenueTrends: [
      { date: 'Jan', grossRevenue: 1250000, netCollected: 1200000, pendingDues: 50000, refunds: 12000 },
      { date: 'Feb', grossRevenue: 1300000, netCollected: 1250000, pendingDues: 50000, refunds: 9000 },
      { date: 'Mar', grossRevenue: 1380000, netCollected: 1330000, pendingDues: 50000, refunds: 11000 },
      { date: 'Apr', grossRevenue: 1410000, netCollected: 1370000, pendingDues: 40000, refunds: 8000 },
      { date: 'May', grossRevenue: 1450000, netCollected: 1400000, pendingDues: 50000, refunds: 9500 },
      { date: 'Jun', grossRevenue: 1490000, netCollected: 1445000, pendingDues: 45000, refunds: 10000 },
      { date: 'Jul', grossRevenue: 1520000, netCollected: 1480000, pendingDues: 40000, refunds: 7000 },
      { date: 'Aug', grossRevenue: 1560000, netCollected: 1520000, pendingDues: 40000, refunds: 8500 },
      { date: 'Sep', grossRevenue: 1610000, netCollected: 1570000, pendingDues: 40000, refunds: 6000 },
      { date: 'Oct', grossRevenue: 1650000, netCollected: 1615000, pendingDues: 35000, refunds: 7500 },
      { date: 'Nov', grossRevenue: 1680000, netCollected: 1645000, pendingDues: 35000, refunds: 5000 },
      { date: 'Dec', grossRevenue: 1720000, netCollected: 1690000, pendingDues: 30000, refunds: 6500 },
    ],
    occupancyTrends: [
      { name: 'Jan', occupied: 3850, total: 4660, rate: 82.6 },
      { name: 'Feb', occupied: 3910, total: 4660, rate: 83.9 },
      { name: 'Mar', occupied: 3990, total: 4660, rate: 85.6 },
      { name: 'Apr', occupied: 4050, total: 4660, rate: 86.9 },
      { name: 'May', occupied: 4120, total: 4660, rate: 88.4 },
      { name: 'Jun', occupied: 4180, total: 4660, rate: 89.6 },
      { name: 'Jul', occupied: 4210, total: 4660, rate: 90.3 },
      { name: 'Aug', occupied: 4250, total: 4660, rate: 91.2 },
      { name: 'Sep', occupied: 4280, total: 4660, rate: 91.8 },
      { name: 'Oct', occupied: 4300, total: 4660, rate: 92.2 },
      { name: 'Nov', occupied: 4310, total: 4660, rate: 92.5 },
      { name: 'Dec', occupied: 4325, total: 4660, rate: 92.8 },
    ],
    expenseBreakdown: [
      { name: 'Electricity & Power', value: 3900000, color: '#6366f1' },
      { name: 'Food & Groceries', value: 5400000, color: '#06b6d4' },
      { name: 'Staff Salaries', value: 3600000, color: '#10b981' },
      { name: 'Maintenance & Repairs', value: 1650000, color: '#f59e0b' },
      { name: 'Water & Waste Mgmt', value: 840000, color: '#8b5cf6' },
      { name: 'High-Speed Internet', value: 740000, color: '#ec4899' },
    ],
    residentDynamics: [
      { period: 'Q1', moveIns: 720, moveOuts: 180, netGrowth: 540 },
      { period: 'Q2', moveIns: 810, moveOuts: 210, netGrowth: 600 },
      { period: 'Q3', moveIns: 920, moveOuts: 195, netGrowth: 725 },
      { period: 'Q4', moveIns: 880, moveOuts: 160, netGrowth: 720 },
    ],
    roomCategoryYield: [
      { category: 'Single Private', beds: 820, occupied: 805, rate: 98.1, adr: 14500 },
      { category: '2-Sharing Deluxe', beds: 1840, occupied: 1750, rate: 95.1, adr: 9800 },
      { category: '3-Sharing Classic', beds: 1400, occupied: 1280, rate: 91.4, adr: 7200 },
      { category: '4-Sharing Dorm', beds: 600, occupied: 490, rate: 81.6, adr: 5400 },
    ],
    complaintSla: [
      { category: 'WiFi & Network', total: 1850, resolved: 1820, avgHours: 2.1, slaTarget: 4 },
      { category: 'Plumbing', total: 1290, resolved: 1260, avgHours: 3.2, slaTarget: 6 },
      { category: 'Electrical', total: 1040, resolved: 1025, avgHours: 1.7, slaTarget: 3 },
      { category: 'Food & Mess', total: 840, resolved: 810, avgHours: 3.8, slaTarget: 8 },
      { category: 'Cleaning / Maid', total: 1540, resolved: 1520, avgHours: 1.3, slaTarget: 2 },
      { category: 'Security / Access', total: 360, resolved: 358, avgHours: 0.8, slaTarget: 2 },
    ],
    foodRatings: [
      { day: 'Q1', breakfast: 4.1, lunch: 3.9, dinner: 4.0, overall: 4.00 },
      { day: 'Q2', breakfast: 4.3, lunch: 4.1, dinner: 4.2, overall: 4.20 },
      { day: 'Q3', breakfast: 4.5, lunch: 4.4, dinner: 4.5, overall: 4.46 },
      { day: 'Q4', breakfast: 4.8, lunch: 4.6, dinner: 4.7, overall: 4.70 },
    ],
    paymentMethods: [
      { name: 'UPI (GPay / PhonePe)', value: 68, color: '#6366f1' },
      { name: 'Net Banking', value: 16, color: '#06b6d4' },
      { name: 'Debit / Credit Card', value: 9, color: '#10b981' },
      { name: 'Auto-Debit NACH', value: 5, color: '#f59e0b' },
      { name: 'Cash / Cheque', value: 2, color: '#94a3b8' },
    ],
  },
};

export const PROPERTIES_LIST = [
  { id: 'all', name: 'All Properties (Aggregated)', beds: 4660, city: 'National Network' },
  { id: 'prop-1', name: 'Grand Stay Hostel - Block A', beds: 350, city: 'Bangalore' },
  { id: 'prop-2', name: 'Nestify Luxury PG - Koramangala', beds: 180, city: 'Bangalore' },
  { id: 'prop-3', name: 'GreenView Girls Residency', beds: 220, city: 'Pune' },
  { id: 'prop-4', name: 'TechHaven Executive Living', beds: 410, city: 'Hyderabad' },
  { id: 'prop-5', name: 'St. Jude Scholars Hostel', beds: 160, city: 'Chennai' },
];

/**
 * Fetch analytics data based on timeframe, property filter, and user role.
 */
export async function getAnalyticsData(timeframe = TIMEFRAMES.THIRTY_DAYS, propertyId = 'all') {
  // Simulate rapid API response
  await new Promise((resolve) => setTimeout(resolve, 80));

  const base = superAdminData[timeframe] || superAdminData[TIMEFRAMES.THIRTY_DAYS];

  // If specific property selected, scale numbers down proportionally for realistic demonstration
  if (propertyId !== 'all') {
    const scale = 0.08; // 8% of total network
    return {
      kpis: {
        totalRevenue: Math.round(base.kpis.totalRevenue * scale),
        revenueGrowth: base.kpis.revenueGrowth + 1.2,
        occupancyRate: Math.min(97.5, base.kpis.occupancyRate + 3.2),
        occupancyGrowth: base.kpis.occupancyGrowth + 0.8,
        activeHostels: 1,
        hostelGrowth: 0,
        pendingDues: Math.round(base.kpis.pendingDues * scale),
        dueRate: base.kpis.dueRate,
        activeBeds: Math.round(base.kpis.activeBeds * scale),
        totalBeds: Math.round(base.kpis.totalBeds * scale),
      },
      revenueTrends: base.revenueTrends.map((t) => ({
        ...t,
        grossRevenue: Math.round(t.grossRevenue * scale),
        netCollected: Math.round(t.netCollected * scale),
        pendingDues: Math.round(t.pendingDues * scale),
        refunds: Math.round(t.refunds * scale),
      })),
      occupancyTrends: base.occupancyTrends.map((o) => ({
        ...o,
        occupied: Math.round(o.occupied * scale),
        total: Math.round(o.total * scale),
        rate: Math.min(98, o.rate + 2.5),
      })),
      expenseBreakdown: base.expenseBreakdown.map((e) => ({
        ...e,
        value: Math.round(e.value * scale),
      })),
      residentDynamics: base.residentDynamics.map((r) => ({
        ...r,
        moveIns: Math.max(1, Math.round(r.moveIns * scale * 2)),
        moveOuts: Math.max(0, Math.round(r.moveOuts * scale * 2)),
        netGrowth: Math.max(0, Math.round(r.netGrowth * scale * 2)),
      })),
      roomCategoryYield: base.roomCategoryYield.map((c) => ({
        ...c,
        beds: Math.round(c.beds * scale),
        occupied: Math.round(c.occupied * scale),
      })),
      complaintSla: base.complaintSla.map((s) => ({
        ...s,
        total: Math.max(2, Math.round(s.total * scale * 2)),
        resolved: Math.max(2, Math.round(s.resolved * scale * 2)),
      })),
      foodRatings: base.foodRatings,
      paymentMethods: base.paymentMethods,
    };
  }

  return base;
}

/**
 * Format Indian Rupee currency values nicely (e.g. ₹14.85L or ₹48,000)
 */
export function formatINR(val, compact = false) {
  if (val === undefined || val === null || isNaN(val)) return '₹0';
  if (compact) {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)}Cr`;
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(1)}L`;
    }
    if (val >= 1000) {
      return `₹${(val / 1000).toFixed(0)}k`;
    }
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(val);
}

/**
 * Export current analytics dataset as a structured CSV download
 */
export function exportAnalyticsCSV(data, timeframe, propertyId) {
  const lines = [];
  lines.push(`Nestify Analytics & Financial Report`);
  lines.push(`Generated On: ${new Date().toLocaleString()}`);
  lines.push(`Timeframe: ${timeframe}, Property: ${propertyId}`);
  lines.push(``);

  lines.push(`KPI Summary`);
  lines.push(`Total Revenue,${data.kpis.totalRevenue}`);
  lines.push(`Occupancy Rate,${data.kpis.occupancyRate}%`);
  lines.push(`Active Beds,${data.kpis.activeBeds}/${data.kpis.totalBeds}`);
  lines.push(`Pending Dues,${data.kpis.pendingDues}`);
  lines.push(``);

  lines.push(`Revenue Trends`);
  lines.push(`Period,Gross Revenue,Net Collected,Pending Dues,Refunds`);
  data.revenueTrends.forEach((r) => {
    lines.push(`${r.date},${r.grossRevenue},${r.netCollected},${r.pendingDues},${r.refunds}`);
  });
  lines.push(``);

  lines.push(`Bed Occupancy Trends`);
  lines.push(`Period,Occupied Beds,Total Beds,Occupancy Rate %`);
  data.occupancyTrends.forEach((o) => {
    lines.push(`${o.name},${o.occupied},${o.total},${o.rate}%`);
  });
  lines.push(``);

  lines.push(`Expenses Breakdown`);
  lines.push(`Expense Category,Amount (INR)`);
  data.expenseBreakdown.forEach((e) => {
    lines.push(`${e.name},${e.value}`);
  });

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `nestify-analytics-${timeframe}-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
