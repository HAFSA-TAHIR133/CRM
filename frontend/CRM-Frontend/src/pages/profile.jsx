// src/components/UploadAvatar.jsx
import React, { useState } from 'react';
import { toast } from 'sonner';
import api from '@/lib/axios';

export function UploadAvatar({ userId, onAvatarUpdate }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!selected.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an image');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file); // same field name as backend expects

      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

      // Call the new avatar endpoint
      const res = await api.put(
        `/users/${userId}/avatar`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedUser = res.data?.user || res.data?.data || res.data;

      toast.success('Avatar updated successfully');
      onAvatarUpdate?.(updatedUser);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {preview && (
        <img
          src={preview}
          alt="Avatar preview"
          className="w-20 h-20 rounded-full object-cover border border-slate-200"
        />
      )}

      <div>
        <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#b2d8d8]/20 text-[#006666] text-xs font-semibold cursor-pointer hover:bg-[#b2d8d8]/30 transition-colors">
          📷 Choose Image
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="w-full px-3 py-2 rounded-xl bg-[#008080] text-white text-sm font-bold disabled:opacity-50 hover:bg-[#006666] transition-colors"
      >
        {uploading ? 'Uploading...' : 'Upload Avatar'}
      </button>
    </div>
  );
}