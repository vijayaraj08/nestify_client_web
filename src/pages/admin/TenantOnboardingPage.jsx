import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  User,
  MapPin,
  Clock,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  Wifi,
  Utensils,
  Wind,
  Zap,
  Shirt,
  Video,
  Fingerprint,
  Calendar,
  AlertCircle,
  Bed,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Sliders,
  DollarSign,
  DoorOpen,
} from 'lucide-react';
import { timeStringToMs, msToTimeString } from '../../utils/timeUtils';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import tenantService from '../../services/tenantService';

// Default initial room generator helper
const generateDefaultRooms = (floorNum, count = 5, defaultSharing = 2) => {
  const rooms = [];
  for (let i = 1; i <= count; i++) {
    const roomNumStr = `${floorNum}${i < 10 ? '0' + i : i}`;
    let roomType = 'double';
    if (defaultSharing === 1) roomType = 'single';
    else if (defaultSharing === 3) roomType = 'triple';
    else if (defaultSharing === 4) roomType = 'four_sharing';

    rooms.push({
      id: `rm_${floorNum}_${i}_${Date.now()}`,
      roomNumber: roomNumStr,
      roomType,
      capacity: defaultSharing,
      hasAc: i % 2 === 1,
      washroomType: 'attached',
      monthlyRent: 8500,
    });
  }
  return rooms;
};

export default function TenantOnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Active floor tab for Step 4 floor customization
  const [activeFloorIndex, setActiveFloorIndex] = useState(0);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Owner Profile (No separate businessName required)
    name: '',
    email: '',
    phone: '',
    password: 'Password@123',
    businessType: 'proprietorship',
    panNumber: '',
    gstin: '',

    // Step 2: Property & Location
    hostelName: '',
    hostelType: 'co_living',
    contactEmail: '',
    contactPhone: '',
    street: '',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '',
    landmark: '',

    // Step 3: Rules & Amenities
    curfewTimeMs: 81000000, // 10:30 PM (22.5 * 3600 * 1000)
    noticePeriodDays: 30,
    securityDepositMonths: 1,
    amenities: {
      hasWifi: true,
      hasMess: true,
      hasAc: false,
      hasPowerBackup: true,
      hasLaundry: true,
      hasCctv: true,
      hasBiometric: false,
      hasLift: false,
      hasCleaning: true,
    },

    // Step 4: Floor & Room Customization Structure
    floors: [
      {
        id: 'flr_1',
        floorNumber: 1,
        floorName: 'Ground Floor (Floor 1)',
        rooms: generateDefaultRooms(1, 5, 2),
      },
      {
        id: 'flr_2',
        floorNumber: 2,
        floorName: '1st Floor (Floor 2)',
        rooms: generateDefaultRooms(2, 6, 2),
      },
      {
        id: 'flr_3',
        floorNumber: 3,
        floorName: '2nd Floor (Floor 3)',
        rooms: generateDefaultRooms(3, 4, 3),
      },
    ],
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleAmenityToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [key]: !prev.amenities[key],
      },
    }));
  };

  // Floor Customization Handlers
  const handleAddFloor = () => {
    const nextFloorNum = formData.floors.length + 1;
    const newFloor = {
      id: `flr_${Date.now()}`,
      floorNumber: nextFloorNum,
      floorName: `Floor ${nextFloorNum}`,
      rooms: generateDefaultRooms(nextFloorNum, 4, 2),
    };

    setFormData((prev) => ({
      ...prev,
      floors: [...prev.floors, newFloor],
    }));
    setActiveFloorIndex(formData.floors.length);
  };

  const handleRemoveFloor = (indexToRemove) => {
    if (formData.floors.length <= 1) {
      setErrorMsg('At least one floor must be configured for the hostel.');
      return;
    }

    const updated = formData.floors
      .filter((_, idx) => idx !== indexToRemove)
      .map((flr, idx) => ({
        ...flr,
        floorNumber: idx + 1,
      }));

    setFormData((prev) => ({ ...prev, floors: updated }));
    setActiveFloorIndex((prev) => Math.min(prev, updated.length - 1));
  };

  const handleFloorNameChange = (index, newName) => {
    setFormData((prev) => {
      const updated = [...prev.floors];
      updated[index] = { ...updated[index], floorName: newName };
      return { ...prev, floors: updated };
    });
  };

  const handleAddRoom = (floorIndex) => {
    setFormData((prev) => {
      const updatedFloors = [...prev.floors];
      const targetFloor = { ...updatedFloors[floorIndex] };
      const currentRooms = targetFloor.rooms || [];
      const nextIndex = currentRooms.length + 1;
      const roomNumber = `${targetFloor.floorNumber}${nextIndex < 10 ? '0' + nextIndex : nextIndex}`;

      const newRoom = {
        id: `rm_${Date.now()}`,
        roomNumber,
        roomType: 'double',
        capacity: 2,
        hasAc: false,
        washroomType: 'attached',
        monthlyRent: 8000,
      };

      targetFloor.rooms = [...currentRooms, newRoom];
      updatedFloors[floorIndex] = targetFloor;
      return { ...prev, floors: updatedFloors };
    });
  };

  const handleRemoveRoom = (floorIndex, roomIndex) => {
    setFormData((prev) => {
      const updatedFloors = [...prev.floors];
      const targetFloor = { ...updatedFloors[floorIndex] };
      targetFloor.rooms = targetFloor.rooms.filter((_, idx) => idx !== roomIndex);
      updatedFloors[floorIndex] = targetFloor;
      return { ...prev, floors: updatedFloors };
    });
  };

  const handleRoomFieldChange = (floorIndex, roomIndex, field, value) => {
    setFormData((prev) => {
      const updatedFloors = [...prev.floors];
      const targetFloor = { ...updatedFloors[floorIndex] };
      const updatedRooms = [...targetFloor.rooms];

      let capacity = updatedRooms[roomIndex].capacity;
      if (field === 'roomType') {
        if (value === 'single') capacity = 1;
        else if (value === 'double') capacity = 2;
        else if (value === 'triple') capacity = 3;
        else if (value === 'four_sharing') capacity = 4;
        else if (value === 'five_sharing') capacity = 5;
        else if (value === 'dormitory') capacity = 6;
      } else if (field === 'capacity') {
        capacity = Number(value) || 1;
      }

      updatedRooms[roomIndex] = {
        ...updatedRooms[roomIndex],
        [field]: value,
        capacity,
      };

      targetFloor.rooms = updatedRooms;
      updatedFloors[floorIndex] = targetFloor;
      return { ...prev, floors: updatedFloors };
    });
  };

  // Calculations for live metrics
  const totalFloorsCount = formData.floors.length;
  const totalRoomsCount = formData.floors.reduce((acc, f) => acc + (f.rooms?.length || 0), 0);
  const totalBedsCount = formData.floors.reduce(
    (acc, f) => acc + (f.rooms?.reduce((rAcc, r) => rAcc + Number(r.capacity || 2), 0) || 0),
    0
  );

  const validateStep = (step) => {
    if (step === 1) {
      if (!formData.name.trim()) return 'Please enter the owner/manager full name.';
      if (!formData.email.trim() || !formData.email.includes('@')) return 'Please enter a valid business email address.';
    }
    if (step === 2) {
      if (!formData.hostelName.trim()) return 'Please enter the hostel/property name.';
      if (!formData.city.trim()) return 'Please specify the property city.';
    }
    if (step === 4) {
      if (formData.floors.length === 0) return 'Please add at least one floor.';
      if (totalRoomsCount === 0) return 'Please configure at least one room across your floors.';
    }
    return null;
  };

  const handleNext = () => {
    const error = validateStep(currentStep);
    if (error) {
      setErrorMsg(error);
      return;
    }
    setErrorMsg('');
    setCurrentStep((prev) => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setErrorMsg('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    navigate('/admin/tenants');
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const error = validateStep(currentStep);
    if (error) {
      setErrorMsg(error);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password || 'Password@123',
        businessName: formData.hostelName.trim(), // Defaults to Hostel Name
        businessType: formData.businessType,
        panNumber: formData.panNumber.trim().toUpperCase(),
        gstin: formData.gstin.trim().toUpperCase(),

        hostelName: formData.hostelName.trim(),
        hostelType: formData.hostelType,
        contactEmail: formData.contactEmail.trim().toLowerCase() || formData.email.trim().toLowerCase(),
        contactPhone: formData.contactPhone.trim() || formData.phone.trim(),
        address: {
          street: formData.street.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          landmark: formData.landmark.trim(),
        },
        rules: {
          curfewTimeMs: formData.curfewTimeMs,
          noticePeriodDays: Number(formData.noticePeriodDays),
          securityDepositMonths: Number(formData.securityDepositMonths),
        },
        amenities: formData.amenities,
        floors: formData.floors,
        trialDays: 14, // Automatically assign 14-day trial
      };

      await tenantService.onboardTenant(payload);
      navigate('/admin/tenants');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, label: 'Business Profile', desc: 'Operator & Entity Details', icon: User },
    { num: 2, label: 'First Property', desc: 'Hostel Name & Location', icon: Building2 },
    { num: 3, label: 'Operations & Rules', desc: 'Curfew, Notice & Amenities', icon: Clock },
    { num: 4, label: 'Floor Customization', desc: 'Floors, Rooms & Sharing Layout', icon: Layers },
  ];

  const currentFloor = formData.floors[activeFloorIndex] || formData.floors[0] || {};

  return (
    <div className="w-full space-y-4 pb-8 animate-fade-in">
      {/* Top Breadcrumb & Page Header */}
      <div className="space-y-1.5">
        <Link
          to="/admin/tenants"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <ArrowLeft size={13} />
          Back to Tenants Directory
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <Building2 className="text-primary-600 dark:text-primary-400" size={24} />
              Onboard New Property Tenant
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set up operator account, property details, operational rules, and custom floor layouts.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-semibold text-slate-400">Step {currentStep} of 4</span>
            <span className="block text-xs font-bold text-primary-600 dark:text-primary-400">
              {steps[currentStep - 1].label}
            </span>
          </div>
        </div>
      </div>

      {/* Full-Width Horizontal Stepper */}
      <Card className="w-full p-3 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
          {steps.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div
                key={s.num}
                onClick={() => {
                  if (isCompleted) {
                    setCurrentStep(s.num);
                    setErrorMsg('');
                  }
                }}
                className={`flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl transition-all ${
                  isCompleted ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60' : ''
                } ${isCurrent ? 'bg-primary-50/80 dark:bg-primary-950/40 border border-primary-200/80 dark:border-primary-800/60 shadow-2xs' : ''}`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-primary-600 text-white shadow-xs ring-3 ring-primary-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/80 dark:border-slate-700/60'
                  }`}
                >
                  {isCompleted ? <Check size={16} className="stroke-[2.5]" /> : s.num}
                </div>

                <div className="min-w-0 flex-1">
                  <span
                    className={`text-xs font-bold block truncate ${
                      isCurrent
                        ? 'text-primary-900 dark:text-primary-200'
                        : isCompleted
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {s.label}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate">
                    {s.desc}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Error Alert Banner */}
      {errorMsg && (
        <div className="w-full p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-3 text-xs text-red-700 dark:text-red-300 animate-fade-in shadow-xs">
          <AlertCircle size={16} className="shrink-0 text-red-500" />
          <span className="font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Main Step Form Card (Full Width) */}
      <Card className="w-full p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
        {/* ========================================================================= */}
        {/* STEP 1: BUSINESS PROFILE (NO BUSINESS NAME FIELD)                        */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <User size={18} className="text-primary-600 dark:text-primary-400" />
                Step 1: Business Profile & Primary Operator Details
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Set up the primary login credentials and legal entity for the property operator.
              </p>
            </div>

            {/* Row 1: Name & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Owner / Manager Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sarah Jenkins"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Business Account Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. owner@grandoakstays.in"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>

            {/* Row 2: Phone & Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Primary Contact Phone
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Initial Login Password
                </label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm font-mono bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>

            {/* Row 3: Entity Type, PAN, GSTIN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Business Entity Structure
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => handleChange('businessType', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all cursor-pointer"
                >
                  <option value="proprietorship">Sole Proprietorship</option>
                  <option value="partnership">Partnership Firm</option>
                  <option value="llp">LLP (Limited Liability Partnership)</option>
                  <option value="private_limited">Private Limited Company</option>
                  <option value="individual">Individual Operator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Business PAN Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  value={formData.panNumber}
                  onChange={(e) => handleChange('panNumber', e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 text-sm font-mono uppercase bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  GSTIN Tax Registration (Optional)
                </label>
                <input
                  type="text"
                  placeholder="29ABCDE1234F1Z5"
                  maxLength={15}
                  value={formData.gstin}
                  onChange={(e) => handleChange('gstin', e.target.value.toUpperCase())}
                  className="w-full px-4 py-2.5 text-sm font-mono uppercase bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: FIRST PROPERTY & LOCATION SETUP                                  */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 size={18} className="text-primary-600 dark:text-primary-400" />
                Step 2: First Property & Location
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Setup the initial hostel name, address details, and category.
              </p>
            </div>

            {/* Row 1: Property Name & Gender Category */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Hostel / Property Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grand Oak Executive Coliving & Suites"
                  value={formData.hostelName}
                  onChange={(e) => handleChange('hostelName', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Gender Category
                </label>
                <select
                  value={formData.hostelType}
                  onChange={(e) => handleChange('hostelType', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all cursor-pointer"
                >
                  <option value="co_living">Co-Living (Unisex)</option>
                  <option value="boys">Boys Only</option>
                  <option value="girls">Girls Only</option>
                </select>
              </div>
            </div>

            {/* Row 2: Street Address & City */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Street Address & Area
                </label>
                <input
                  type="text"
                  placeholder="e.g. #42, 5th Cross, Koramangala 4th Block"
                  value={formData.street}
                  onChange={(e) => handleChange('street', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>

            {/* Row 3: State, Pincode, Nearby Landmark */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  placeholder="e.g. Karnataka"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Pincode
                </label>
                <input
                  type="text"
                  placeholder="560034"
                  maxLength={6}
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Nearby Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Sony Signal"
                  value={formData.landmark}
                  onChange={(e) => handleChange('landmark', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: OPERATIONS & RULES                                                */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock size={18} className="text-primary-600 dark:text-primary-400" />
                Step 3: Operational Policies & Facilities
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure curfew timings (stored in milliseconds), notice policies, and amenity offerings.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock size={14} className="text-amber-500" />
                  Curfew Timing (ms)
                </label>
                <input
                  type="time"
                  value={msToTimeString(formData.curfewTimeMs)}
                  onChange={(e) => handleChange('curfewTimeMs', timeStringToMs(e.target.value))}
                  className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Night gate closing: {formData.curfewTimeMs} ms from midnight
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar size={14} className="text-indigo-500" />
                  Notice Period (Days)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.noticePeriodDays}
                  onChange={(e) => handleChange('noticePeriodDays', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Mandatory move-out notice window
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  Security Deposit (Months)
                </label>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={formData.securityDepositMonths}
                  onChange={(e) => handleChange('securityDepositMonths', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Refundable advance hold amount
                </span>
              </div>
            </div>

            {/* Included Amenities Grid */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Select Included Property Amenities
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { key: 'hasWifi', label: 'High-Speed Wi-Fi', icon: Wifi, desc: 'Enterprise mesh networking' },
                  { key: 'hasMess', label: 'Daily Food & Mess', icon: Utensils, desc: 'Breakfast, Lunch & Dinner' },
                  { key: 'hasAc', label: 'Air Conditioning', icon: Wind, desc: 'Central / Split AC units' },
                  { key: 'hasPowerBackup', label: '24/7 Power Backup', icon: Zap, desc: 'Silent diesel generator' },
                  { key: 'hasLaundry', label: 'Laundry Machines', icon: Shirt, desc: 'Self-service washers' },
                  { key: 'hasCctv', label: 'CCTV Security', icon: Video, desc: 'Full premise coverage' },
                  { key: 'hasBiometric', label: 'Biometric Access', icon: Fingerprint, desc: 'Smart gate check-in' },
                  { key: 'hasLift', label: 'Elevator / Lift', icon: Building2, desc: 'All floor accessibility' },
                  { key: 'hasCleaning', label: 'Housekeeping', icon: CheckCircle2, desc: 'Daily room & washroom cleaning' },
                ].map((amenity) => {
                  const Icon = amenity.icon;
                  const isSelected = formData.amenities[amenity.key];
                  return (
                    <button
                      key={amenity.key}
                      type="button"
                      onClick={() => handleAmenityToggle(amenity.key)}
                      className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary-50/70 dark:bg-primary-950/40 border-primary-300 dark:border-primary-800 shadow-xs'
                          : 'bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-700/60 hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-primary-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500'
                        }`}
                      >
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`text-xs font-bold block truncate ${
                            isSelected
                              ? 'text-primary-950 dark:text-primary-100'
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {amenity.label}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate mt-0.5">
                          {amenity.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: FLOOR & ROOM CUSTOMIZATION (NEW DEDICATED 4TH TAB)               */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Layers size={18} className="text-primary-600 dark:text-primary-400" />
                  Step 4: Floor & Room Customization
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure rooms, sharing arrangements, and bed capacity independently for each floor.
                </p>
              </div>

              {/* Dynamic Live Capacity Badge */}
              <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/80 p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Total: <strong className="text-slate-900 dark:text-white">{totalFloorsCount}</strong> Floors ·{' '}
                  <strong className="text-slate-900 dark:text-white">{totalRoomsCount}</strong> Rooms ·{' '}
                  <strong className="text-primary-600 dark:text-primary-400">{totalBedsCount}</strong> Beds
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 uppercase">
                  14-Day Trial Included
                </span>
              </div>
            </div>

            {/* Floor Selector Tabs & Add Floor Button */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-3">
              {formData.floors.map((floor, idx) => {
                const isActive = activeFloorIndex === idx;
                const floorRoomsCount = floor.rooms?.length || 0;
                const floorBedsCount = floor.rooms?.reduce((acc, r) => acc + Number(r.capacity || 2), 0) || 0;

                return (
                  <button
                    key={floor.id || idx}
                    type="button"
                    onClick={() => setActiveFloorIndex(idx)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span>{floor.floorName || `Floor ${floor.floorNumber}`}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {floorRoomsCount} Rooms / {floorBedsCount} Beds
                    </span>
                  </button>
                );
              })}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddFloor}
                className="flex items-center gap-1.5 text-xs font-bold border-dashed border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/40"
              >
                <Plus size={14} />
                Add New Floor
              </Button>
            </div>

            {/* Active Floor Configuration Area */}
            {currentFloor && (
              <div className="space-y-4">
                {/* Floor Header Bar */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 max-w-md">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      Floor Name:
                    </label>
                    <input
                      type="text"
                      value={currentFloor.floorName || ''}
                      onChange={(e) => handleFloorNameChange(activeFloorIndex, e.target.value)}
                      className="w-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                      placeholder="e.g. Ground Floor, 1st Floor - Boys Wing"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddRoom(activeFloorIndex)}
                      className="flex items-center gap-1.5 text-xs bg-primary-600 hover:bg-primary-700 text-white"
                    >
                      <Plus size={14} />
                      Add Room to this Floor
                    </Button>

                    {formData.floors.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFloor(activeFloorIndex)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        Delete Floor
                      </Button>
                    )}
                  </div>
                </div>

                {/* Rooms Grid / Matrix for this Floor */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Configured Rooms ({currentFloor.rooms?.length || 0})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Floor Beds: {currentFloor.rooms?.reduce((acc, r) => acc + Number(r.capacity || 2), 0) || 0} Beds
                    </span>
                  </div>

                  {(!currentFloor.rooms || currentFloor.rooms.length === 0) ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                      <DoorOpen size={32} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        No rooms configured on this floor yet.
                      </p>
                      <Button
                        type="button"
                        variant="primary"
                        size="sm"
                        onClick={() => handleAddRoom(activeFloorIndex)}
                        className="mt-3 text-xs inline-flex items-center gap-1"
                      >
                        <Plus size={13} />
                        Add First Room
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {currentFloor.rooms.map((room, roomIdx) => (
                        <div
                          key={room.id || roomIdx}
                          className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200/90 dark:border-slate-700 shadow-2xs space-y-3 relative group"
                        >
                          {/* Room Header & Room Number Input */}
                          <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2">
                            <div className="flex items-center gap-1.5 flex-1">
                              <DoorOpen size={15} className="text-primary-600 shrink-0" />
                              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Room:</span>
                              <input
                                type="text"
                                value={room.roomNumber}
                                onChange={(e) =>
                                  handleRoomFieldChange(activeFloorIndex, roomIdx, 'roomNumber', e.target.value)
                                }
                                className="w-20 px-2 py-1 text-xs font-mono font-bold bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white text-center"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveRoom(activeFloorIndex, roomIdx)}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                              title="Delete room"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>

                          {/* Sharing Capacity & Room Type Selector */}
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                                Sharing Type
                              </label>
                              <select
                                value={room.roomType}
                                onChange={(e) =>
                                  handleRoomFieldChange(activeFloorIndex, roomIdx, 'roomType', e.target.value)
                                }
                                className="w-full px-2 py-1 text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                              >
                                <option value="single">1-Sharing (Single)</option>
                                <option value="double">2-Sharing (Double)</option>
                                <option value="triple">3-Sharing (Triple)</option>
                                <option value="four_sharing">4-Sharing</option>
                                <option value="five_sharing">5-Sharing</option>
                                <option value="dormitory">Dormitory</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-slate-400 mb-1">
                                Beds Count
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={20}
                                value={room.capacity}
                                onChange={(e) =>
                                  handleRoomFieldChange(activeFloorIndex, roomIdx, 'capacity', e.target.value)
                                }
                                className="w-full px-2 py-1 text-xs font-bold text-center bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-primary-600 dark:text-primary-400"
                              />
                            </div>
                          </div>

                          {/* AC & Washroom Toggles */}
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700/60">
                            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-medium text-slate-600 dark:text-slate-300">
                              <input
                                type="checkbox"
                                checked={room.hasAc}
                                onChange={(e) =>
                                  handleRoomFieldChange(activeFloorIndex, roomIdx, 'hasAc', e.target.checked)
                                }
                                className="rounded text-primary-600 focus:ring-primary-500"
                              />
                              <Wind size={12} className={room.hasAc ? 'text-primary-600' : 'text-slate-400'} />
                              <span>AC Room</span>
                            </label>

                            <select
                              value={room.washroomType}
                              onChange={(e) =>
                                handleRoomFieldChange(activeFloorIndex, roomIdx, 'washroomType', e.target.value)
                              }
                              className="px-2 py-0.5 text-[10px] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300"
                            >
                              <option value="attached">Attached Bath</option>
                              <option value="common">Common Bath</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Action Bar (Full Width, directly below Form Card) */}
      <Card className="w-full p-4 sm:p-4.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleBack}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 font-semibold cursor-pointer"
            >
              <ChevronLeft size={16} />
              Back
            </Button>
          ) : (
            <div />
          )}
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            Cancel
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              className="flex items-center gap-2 font-bold px-6 bg-primary-600 hover:bg-primary-700 text-white shadow-xs cursor-pointer"
            >
              Continue
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleSubmit}
              loading={isSubmitting}
              className="flex items-center gap-2 font-bold px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs cursor-pointer"
            >
              <CheckCircle2 size={16} />
              Complete Onboarding & Save Layout
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
