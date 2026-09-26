import { useState, useRef } from 'react';
import {
  Camera,
  Trash2,
  Loader2,
  Shield,
  CheckCircle2,
  Edit3,
  Save,
  X,
  Mail,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import { uploadProfilePhoto, deleteProfilePhoto } from '../../services/profileService';

export default function ProfilePhoto({
  photoUrl,
  userName = 'User',
  email = '',
  role = 'SUPER_ADMIN',
  roleTitle = 'Administrator',
  userId = 'usr-901',
  isEditing = false,
  saving = false,
  onPhotoChange,
  onStartEdit,
  onCancel,
  onSave,
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploading(true);

    try {
      const dataUrl = await uploadProfilePhoto(file);
      onPhotoChange?.(dataUrl);
    } catch (err) {
      setError(err.message || 'Failed to upload photo (Max 5MB JPG/PNG/WEBP).');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    setError('');
    setUploading(true);
    try {
      await deleteProfilePhoto();
      onPhotoChange?.(null);
    } catch (err) {
      setError(err.message || 'Failed to remove photo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col items-center text-center">
      {/* ── Avatar Photo with Status Badge ── */}
      <div className="relative mb-3.5 group">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-slate-200 shadow-xs bg-slate-100 flex items-center justify-center">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={userName}
              className="w-full h-full object-cover"
            />
          ) : (
            <Avatar name={userName} size="xl" />
          )}
        </div>

        {/* Uploading progress spinner overlay */}
        {uploading && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center text-white text-xs">
            <Loader2 size={22} className="animate-spin mb-1" />
            <span>Uploading...</span>
          </div>
        )}

        {/* Online Status Pill */}
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-xs" />
      </div>

      {/* ── User Name & Role Pill ── */}
      <h2 className="text-lg font-bold text-slate-900 leading-tight">
        {userName || 'User'}
      </h2>
      <div className="mt-1 flex items-center justify-center gap-1.5 flex-wrap">
        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-50 text-primary-700 border border-primary-100">
          {roleTitle}
        </span>
      </div>

      {/* Email */}
      <p className="text-xs text-slate-500 mt-2 flex items-center justify-center gap-1 font-mono truncate max-w-full">
        <Mail size={12} className="text-slate-400 shrink-0" />
        <span className="truncate">{email}</span>
      </p>

      {/* ── Photo Action Controls (when Editing) ── */}
      {isEditing && (
        <div className="w-full mt-4 pt-3 border-t border-slate-100 space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
            id="profile-photo-input"
            disabled={uploading}
          />
          <div className="flex items-center gap-2 justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <Camera size={13} />
              <span>Change Photo</span>
            </button>

            {photoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                disabled={uploading}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                title="Remove photo"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
          {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
        </div>
      )}

      {/* ── Primary Action Button (Edit / Save / Cancel) ── */}
      <div className="w-full mt-4 pt-4 border-t border-slate-100">
        {isEditing ? (
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              <X size={14} />
              <span>Cancel</span>
            </button>

            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onStartEdit}
            className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Edit3 size={15} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* ── Compact System Account Info Block ── */}
      <div className="w-full mt-4 pt-3.5 border-t border-slate-100 text-left text-[11px] text-slate-500 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-400">
            <Shield size={12} className="text-primary-600" /> Account ID:
          </span>
          <span className="font-mono text-slate-700 font-semibold truncate max-w-[120px]" title={userId}>
            {userId}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Security:</span>
          <span className="text-emerald-700 font-semibold flex items-center gap-1">
            <CheckCircle2 size={11} /> TLS 1.3 Active
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Role Authority:</span>
          <span className="font-mono text-slate-700 font-semibold">{role}</span>
        </div>
      </div>
    </div>
  );
}
