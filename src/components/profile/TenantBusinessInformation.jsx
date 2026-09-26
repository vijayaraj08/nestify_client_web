import { useState, useRef } from 'react';
import { Building2, Plus, Trash2, MapPin, Phone, Mail, FileText, Image as ImageIcon } from 'lucide-react';
import { uploadProfilePhoto } from '../../services/profileService';

export default function TenantBusinessInformation({
  data,
  isEditing = false,
  onChange,
}) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const photoInputRef = useRef(null);

  const business = data?.business || {};
  const businessAddress = business.address || {};
  const photos = business.photos || [];

  const handleFieldChange = (field, value) => {
    onChange?.('business', field, value);
  };

  const handleAddressChange = (field, value) => {
    onChange?.('businessAddress', field, value);
  };

  const handleAddPhoto = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoError('');
    setUploadingPhoto(true);

    try {
      const dataUrl = await uploadProfilePhoto(file);
      const updatedPhotos = [...photos, dataUrl];
      onChange?.('businessPhotos', 'photos', updatedPhotos);
    } catch (err) {
      setPhotoError(err.message || 'Failed to upload business photo.');
    } finally {
      setUploadingPhoto(false);
      if (photoInputRef.current) photoInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (indexToRemove) => {
    const updatedPhotos = photos.filter((_, idx) => idx !== indexToRemove);
    onChange?.('businessPhotos', 'photos', updatedPhotos);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 size={18} className="text-emerald-600" />
            Hostel & Business Entity
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Commercial details, registered address, and property gallery.
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
          Tenant Scope
        </span>
      </div>

      {isEditing ? (
        /* ── Edit Mode Form ── */
        <div className="space-y-5">
          {/* Row 1: Business Name & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business / Property Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={business.businessName || ''}
                onChange={(e) => handleFieldChange('businessName', e.target.value)}
                placeholder="e.g. Sunshine Grand Hostels"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Entity Type
              </label>
              <input
                type="text"
                value={business.businessType || ''}
                onChange={(e) => handleFieldChange('businessType', e.target.value)}
                placeholder="e.g. Co-Living / PG Management"
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Row 2: Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={business.businessEmail || ''}
                  onChange={(e) => handleFieldChange('businessEmail', e.target.value)}
                  placeholder="contact@hostel.com"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Business Phone
              </label>
              <div className="relative">
                <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={business.businessPhone || ''}
                  onChange={(e) => handleFieldChange('businessPhone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Registration / GSTIN No.
              </label>
              <div className="relative">
                <FileText size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={business.registrationNo || ''}
                  onChange={(e) => handleFieldChange('registrationNo', e.target.value)}
                  placeholder="GSTIN / Trade License"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Commercial Address */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 mb-3 flex items-center gap-1.5">
              <MapPin size={14} className="text-emerald-600" />
              Commercial Property Address
            </h4>

            <div className="space-y-3">
              <input
                type="text"
                value={businessAddress.line1 || ''}
                onChange={(e) => handleAddressChange('line1', e.target.value)}
                placeholder="Plot/Building No, Road Name"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white"
              />
              <input
                type="text"
                value={businessAddress.line2 || ''}
                onChange={(e) => handleAddressChange('line2', e.target.value)}
                placeholder="Area, Landmark"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <input
                  type="text"
                  value={businessAddress.city || ''}
                  onChange={(e) => handleAddressChange('city', e.target.value)}
                  placeholder="City"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="text"
                  value={businessAddress.state || ''}
                  onChange={(e) => handleAddressChange('state', e.target.value)}
                  placeholder="State"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="text"
                  value={businessAddress.postalCode || ''}
                  onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                  placeholder="Postal Code"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
                <input
                  type="text"
                  value={businessAddress.country || 'India'}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  placeholder="Country"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
          </div>

          {/* Row 4: Property & Business Photos Gallery */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-emerald-600" />
                  Business & Hostel Photos
                </h4>
                <p className="text-[11px] text-slate-400">
                  Upload images of hostel rooms, façade, reception, and amenities.
                </p>
              </div>

              <div>
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAddPhoto}
                  className="hidden"
                  disabled={uploadingPhoto}
                />
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Plus size={14} />
                  <span>Add Photo</span>
                </button>
              </div>
            </div>

            {photoError && <p className="text-xs text-rose-500 mb-2">{photoError}</p>}

            {photos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((url, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                    <img src={url} alt={`Business ${idx + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(idx)}
                      className="absolute top-1.5 right-1.5 p-1 bg-slate-900/70 hover:bg-rose-600 text-white rounded-md transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      aria-label="Remove photo"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center bg-slate-50/50">
                <ImageIcon size={24} className="mx-auto text-slate-400 mb-1" />
                <p className="text-xs text-slate-500">No property photos uploaded yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ── View Mode Display ── */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            <div>
              <span className="text-xs font-medium text-slate-400 block">Business Name</span>
              <span className="font-semibold text-slate-800 mt-1 block">
                {business.businessName || 'Sunshine Grand Hostels'}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 block">Entity Type</span>
              <span className="font-semibold text-slate-800 mt-1 block">
                {business.businessType || 'Co-Living Management'}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 block">GSTIN / Registration</span>
              <span className="font-semibold text-slate-800 mt-1 block font-mono text-xs">
                {business.registrationNo || 'GSTIN29AABCT1332F1Z6'}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 block">Business Email</span>
              <span className="font-semibold text-slate-800 mt-1 block font-mono text-xs">
                {business.businessEmail || 'contact@sunshinehostels.com'}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 block">Business Phone</span>
              <span className="font-semibold text-slate-800 mt-1 block">
                {business.businessPhone || '+91 98765 43210'}
              </span>
            </div>

            <div>
              <span className="text-xs font-medium text-slate-400 block">Commercial Address</span>
              <span className="font-semibold text-slate-800 mt-1 block leading-relaxed text-xs">
                {businessAddress.line1
                  ? `${businessAddress.line1}, ${businessAddress.city}, ${businessAddress.state}`
                  : 'Plot 45, Sarjapur Main Road, Bengaluru, KA'}
              </span>
            </div>
          </div>

          {/* Photo gallery preview */}
          {photos.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-700 block mb-3">
                Property Showcase ({photos.length} Photos)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {photos.map((url, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                    <img src={url} alt={`Business ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
