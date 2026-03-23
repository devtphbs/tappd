import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Globe, Save, Check, User, MapPin, CreditCard, Bell, Shield, HelpCircle, LogOut } from 'lucide-react';
import { getCurrencySelectOptions } from '../currency.js';
import { getUserSettings, updateUserSettings } from '../supabase.js';
import { signOut } from '../supabase.js';

const COUNTRIES = [
  { code: 'US', name: 'United States', currency: 'USD' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'DE', name: 'Germany', currency: 'EUR' },
  { code: 'FR', name: 'France', currency: 'EUR' },
  { code: 'IT', name: 'Italy', currency: 'EUR' },
  { code: 'ES', name: 'Spain', currency: 'EUR' },
  { code: 'NL', name: 'Netherlands', currency: 'EUR' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'BR', name: 'Brazil', currency: 'BRL' },
  { code: 'MX', name: 'Mexico', currency: 'MXN' },
  { code: 'KR', name: 'South Korea', currency: 'KRW' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'SE', name: 'Sweden', currency: 'SEK' },
  { code: 'NO', name: 'Norway', currency: 'NOK' },
  { code: 'DK', name: 'Denmark', currency: 'DKK' },
  { code: 'CH', name: 'Switzerland', currency: 'CHF' },
  { code: 'RU', name: 'Russia', currency: 'RUB' },
  { code: 'TR', name: 'Turkey', currency: 'TRY' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
  { code: 'EG', name: 'Egypt', currency: 'EGP' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { code: 'KE', name: 'Kenya', currency: 'KES' },
  { code: 'AR', name: 'Argentina', currency: 'ARS' },
  { code: 'CL', name: 'Chile', currency: 'CLP' },
  { code: 'CO', name: 'Colombia', currency: 'COP' },
  { code: 'PE', name: 'Peru', currency: 'PEN' },
  { code: 'TH', name: 'Thailand', currency: 'THB' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR' },
  { code: 'PH', name: 'Philippines', currency: 'PHP' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR' },
  { code: 'VN', name: 'Vietnam', currency: 'VND' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT' },
  { code: 'NZ', name: 'New Zealand', currency: 'NZD' },
  { code: 'IL', name: 'Israel', currency: 'ILS' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
  { code: 'QA', name: 'Qatar', currency: 'QAR' },
  { code: 'KW', name: 'Kuwait', currency: 'KWD' },
  { code: 'BH', name: 'Bahrain', currency: 'BHD' },
  { code: 'OM', name: 'Oman', currency: 'OMR' },
].sort((a, b) => a.name.localeCompare(b.name));

export default function Settings({ user }) {
  const [homeCurrency, setHomeCurrency] = useState('USD');
  const [country, setCountry] = useState('US');
  const [username, setUsername] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

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
        setCountry(data.country || 'US');
        setUsername(data.username || '');
        setNotifications(data.notifications !== false);
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
        home_currency: homeCurrency,
        country: country,
        username: username,
        notifications: notifications,
        updated_at: new Date().toISOString()
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
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

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'about', label: 'About', icon: HelpCircle },
  ];

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

      {/* Settings Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {sections.map(section => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                isActive 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Icon size={16} />
              <span className="text-sm font-medium">{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Profile Section */}
      {activeSection === 'profile' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Profile Information</h3>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                <User size={32} className="text-primary-600" />
              </div>
              <div>
                <div className="font-semibold text-lg">{user.email}</div>
                <div className="text-sm text-gray-500">User ID: {user.id.slice(0, 8)}...</div>
                <div className="text-xs text-gray-400">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input-field"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Section */}
      {activeSection === 'preferences' && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Globe size={20} className="text-primary-600" />
              <h3 className="text-lg font-semibold">Currency & Region</h3>
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
        </div>
      )}

      {/* Notifications Section */}
      {activeSection === 'notifications' && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Bell size={20} className="text-primary-600" />
              <h3 className="text-lg font-semibold">Notifications</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Push Notifications</div>
                  <div className="text-sm text-gray-500">Get alerts for budget warnings and updates</div>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      notifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Section */}
      {activeSection === 'security' && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Shield size={20} className="text-primary-600" />
              <h3 className="text-lg font-semibold">Security</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Change Password</div>
                  <div className="text-sm text-gray-500">Update your account password</div>
                </div>
                <button className="btn-secondary text-sm">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-gray-500">Add an extra layer of security</div>
                </div>
                <button className="btn-secondary text-sm">
                  Enable
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleSignOut}
                className="w-full btn-secondary flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle size={20} className="text-primary-600" />
              <h3 className="text-lg font-semibold">About Tappd</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Version</span>
                <span className="font-medium">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Build</span>
                <span className="font-medium">Production</span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• AI-powered receipt scanning</li>
                <li>• Automatic currency conversion</li>
                <li>• Spending analytics</li>
                <li>• Budget tracking</li>
                <li>• Cross-device sync</li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-medium mb-2">Support</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="text-primary-600 block">Help Center</a>
                <a href="#" className="text-primary-600 block">Privacy Policy</a>
                <a href="#" className="text-primary-600 block">Terms of Service</a>
                <a href="#" className="text-primary-600 block">Contact Support</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
