import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Save, Check } from 'lucide-react';
import { getCurrencySelectOptions } from '../currency.js';
import { getUserSettings, updateUserSettings } from '../supabase.js';

export default function Settings({ user }) {
  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserSettings();
    }
  }, [user]);

  const loadUserSettings = async () => {
    try {
      const { data } = await getUserSettings(user.id);
      if (data) {
        setHomeCurrency(data.home_currency || 'USD');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    setSaved(false);

    try {
      await updateUserSettings(user.id, {
        home_currency: homeCurrency
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <SettingsIcon className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold mb-2">Sign in required</h3>
          <p className="text-gray-600">Please sign in to access settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
        >
          {saved ? (
            <>
              <Check size={20} />
              Saved
            </>
          ) : (
            <>
              <Save size={20} />
              {loading ? 'Saving...' : 'Save'}
            </>
          )}
        </button>
      </div>

      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Globe size={20} className="text-primary-600" />
            <h3 className="text-lg font-semibold">Currency Preferences</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Home Currency
            </label>
            <p className="text-xs text-gray-500 mb-2">
              This will be used for all conversions and displayed amounts
            </p>
            <select
              value={homeCurrency}
              onChange={(e) => setHomeCurrency(e.target.value)}
              className="input-field"
            >
              {getCurrencySelectOptions().map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-1">How this affects your app:</div>
              <ul className="space-y-1 text-xs">
                <li>• All receipt amounts will be converted to this currency</li>
                <li>• Overview and Log tabs will show totals in this currency</li>
                <li>• Budget tracking will use this currency</li>
                <li>• Export files will use this currency</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">User ID</div>
              <div className="font-medium text-xs text-gray-500">{user.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Account Created</div>
              <div className="font-medium">
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">About Tappd</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Version 1.0.0</p>
            <p>AI-powered receipt scanning and spending tracker</p>
            <p>Data is stored locally and synced to your account</p>
          </div>
        </div>
      </div>
    </div>
  );
}
