import React, { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { toast } from 'sonner';

const Settings = () => {
  const [settings, setSettings] = useState({
    systemName: "",
    allowRegistration: false,
    maintenanceMode: false,
    notificationEmail: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data.data);
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      toast.success("System settings saved successfully");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading settings...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">System Control Settings</h1>
        <p className="text-sm text-gray-500">Configure core global application environments</p>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 divide-y divide-gray-100">
        {/* General Configurations */}
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">General Properties</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Global Application Title</label>
            <input 
              type="text" 
              value={settings.systemName}
              onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-indigo-500" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">System Administration Email</label>
            <input 
              type="email" 
              value={settings.notificationEmail}
              onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-indigo-500" 
            />
          </div>
        </div>

        {/* Feature Security Toggles */}
        <div className="p-6 space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Security & Environment Flags</h3>
          
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium text-gray-800">Allow Employee Self-Registration</h4>
              <p className="text-xs text-gray-400">Enables dynamic sign-ups via registration paths</p>
            </div>
            <button 
              onClick={() => handleToggle('allowRegistration')}
              className={`w-11 h-6 rounded-full transition-colors relative ${settings.allowRegistration ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.allowRegistration ? 'translate-x-5' : ''}`} />
            </button>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div>
              <h4 className="text-sm font-medium text-gray-800">System Maintenance Freeze</h4>
              <p className="text-xs text-gray-400">Locks data changes globally across non-admin views</p>
            </div>
            <button 
              onClick={() => handleToggle('maintenanceMode')}
              className={`w-11 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'}`}
            >
              <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.maintenanceMode ? 'translate-x-5' : ''}`} />
            </button>
          </div>
        </div>

        {/* Save Controls Footer */}
        <div className="p-4 bg-gray-50 flex justify-end text-sm rounded-b-lg">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition-colors font-medium shadow-sm disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save System Configurations"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;