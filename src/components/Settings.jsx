import React, { useState, useEffect } from 'react';
import { User, Globe, Bell, Shield, LogOut, ChevronRight, Eye, EyeOff, Key, Smartphone, HelpCircle, FileText, Mail } from 'lucide-react';
import { getUserSettings, updateUserSettings } from '../supabase.js';
import { signOut } from '../supabase.js';
import { haptics } from '../utils/haptics.js';

export default function Settings({ user }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    username: '',
    country: '',
    home_currency: 'USD',
    notifications_enabled: true,
    budget_warnings: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data } = await getUserSettings(user.id);
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      haptics.save();
      await updateUserSettings(user.id, settings);
      
      // Show success feedback
      const button = document.getElementById('save-button');
      if (button) {
        button.textContent = 'Saved!';
        button.classList.add('bg-green-500');
        setTimeout(() => {
          button.textContent = 'Save Changes';
          button.classList.remove('bg-green-500');
        }, 2000);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        haptics.buttonPress();
        await signOut();
        window.location.reload();
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  };

  const countries = [
    { code: 'US', name: 'United States', currency: 'USD' },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
    { code: 'CA', name: 'Canada', currency: 'CAD' },
    { code: 'AU', name: 'Australia', currency: 'AUD' },
    { code: 'DE', name: 'Germany', currency: 'EUR' },
    { code: 'FR', name: 'France', currency: 'EUR' },
    { code: 'IT', name: 'Italy', currency: 'EUR' },
    { code: 'ES', name: 'Spain', currency: 'EUR' },
    { code: 'JP', name: 'Japan', currency: 'JPY' },
    { code: 'CN', name: 'China', currency: 'CNY' },
    { code: 'IN', name: 'India', currency: 'INR' },
    { code: 'BR', name: 'Brazil', currency: 'BRL' },
    { code: 'MX', name: 'Mexico', currency: 'MXN' },
    { code: 'KR', name: 'South Korea', currency: 'KRW' },
    { code: 'SG', name: 'Singapore', currency: 'SGD' },
    { code: 'CH', name: 'Switzerland', currency: 'CHF' },
    { code: 'SE', name: 'Sweden', currency: 'SEK' },
    { code: 'NO', name: 'Norway', currency: 'NOK' },
    { code: 'DK', name: 'Denmark', currency: 'DKK' },
    { code: 'NL', name: 'Netherlands', currency: 'EUR' },
    { code: 'BE', name: 'Belgium', currency: 'EUR' },
    { code: 'AT', name: 'Austria', currency: 'EUR' },
    { code: 'IE', name: 'Ireland', currency: 'EUR' },
    { code: 'PT', name: 'Portugal', currency: 'EUR' },
    { code: 'FI', name: 'Finland', currency: 'EUR' },
    { code: 'GR', name: 'Greece', currency: 'EUR' },
    { code: 'NZ', name: 'New Zealand', currency: 'NZD' },
    { code: 'ZA', name: 'South Africa', currency: 'ZAR' },
    { code: 'RU', name: 'Russia', currency: 'RUB' },
    { code: 'TR', name: 'Turkey', currency: 'TRY' },
    { code: 'IL', name: 'Israel', currency: 'ILS' },
    { code: 'AE', name: 'United Arab Emirates', currency: 'AED' },
    { code: 'SA', name: 'Saudi Arabia', currency: 'SAR' },
    { code: 'EG', name: 'Egypt', currency: 'EGP' },
    { code: 'NG', name: 'Nigeria', currency: 'NGN' },
    { code: 'KE', name: 'Kenya', currency: 'KES' },
    { code: 'TH', name: 'Thailand', currency: 'THB' },
    { code: 'VN', name: 'Vietnam', currency: 'VND' },
    { code: 'PH', name: 'Philippines', currency: 'PHP' },
    { code: 'MY', name: 'Malaysia', currency: 'MYR' },
    { code: 'ID', name: 'Indonesia', currency: 'IDR' },
    { code: 'PK', name: 'Pakistan', currency: 'PKR' },
    { code: 'BD', name: 'Bangladesh', currency: 'BDT' },
    { code: 'LK', name: 'Sri Lanka', currency: 'LKR' },
    { code: 'NP', name: 'Nepal', currency: 'NPR' }
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
    { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
    { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
    { code: 'DKK', name: 'Danish Krone', symbol: 'kr' },
    { code: 'PLN', name: 'Polish Zloty', symbol: 'zł' },
    { code: 'CZK', name: 'Czech Koruna', symbol: 'Kč' },
    { code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft' },
    { code: 'RON', name: 'Romanian Leu', symbol: 'lei' },
    { code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв' },
    { code: 'HRK', name: 'Croatian Kuna', symbol: 'kn' },
    { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
    { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب' },
    { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع' },
    { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا' },
    { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'ج.م' },
    { code: 'MAD', name: 'Moroccan Dirham', symbol: 'د.م' },
    { code: 'TND', name: 'Tunisian Dinar', symbol: 'د.ت' },
    { code: 'DZD', name: 'Algerian Dinar', symbol: 'د.ج' },
    { code: 'LYD', name: 'Libyan Dinar', symbol: 'د.ل' },
    { code: 'SDG', name: 'Sudanese Pound', symbol: 'ج.س' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
    { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵' },
    { code: 'XOF', name: 'West African CFA', symbol: 'CFA' },
    { code: 'XAF', name: 'Central African CFA', symbol: 'FCFA' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'BWP', name: 'Botswana Pula', symbol: 'P' },
    { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$' },
    { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'E' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'Ksh' },
    { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh' },
    { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh' },
    { code: 'RWF', name: 'Rwandan Franc', symbol: 'Rw' },
    { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu' },
    { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨' },
    { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨' },
    { code: 'KMF', name: 'Comorian Franc', symbol: 'KMF' },
    { code: 'MGA', name: 'Malagasy Ariary', symbol: 'Ar' },
    { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK' },
    { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK' },
    { code: 'BWP', name: 'Botswana Pula', symbol: 'P' },
    { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$' },
    { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'E' },
    { code: 'LSL', name: 'Lesotho Loti', symbol: 'L' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz' },
    { code: 'XAF', name: 'Central African CFA', symbol: 'FCFA' },
    { code: 'XOF', name: 'West African CFA', symbol: 'CFA' },
    { code: 'XPF', name: 'CFP Franc', symbol: '₣' },
    { code: 'VUV', name: 'Vanuatu Vatu', symbol: 'VT' },
    { code: 'WST', name: 'Samoan Tala', symbol: 'WS$' },
    { code: 'TOP', name: 'Tongan Paʻanga', symbol: 'T$' },
    { code: 'SBD', name: 'Solomon Islands Dollar', symbol: 'SI$' },
    { code: 'FJD', name: 'Fiji Dollar', symbol: 'FJ$' },
    { code: 'PGK', name: 'Papua New Guinea Kina', symbol: 'K' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'THB', name: 'Thai Baht', symbol: '฿' },
    { code: 'LAK', name: 'Lao Kip', symbol: '₭' },
    { code: 'KHR', name: 'Cambodian Riel', symbol: '៛' },
    { code: 'VND', name: 'Vietnamese Dong', symbol: '₫' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'BND', name: 'Brunei Dollar', symbol: 'B$' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'PHP', name: 'Philippine Peso', symbol: '₱' },
    { code: 'TWD', name: 'New Taiwan Dollar', symbol: 'NT$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
    { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
    { code: 'KPW', name: 'North Korean Won', symbol: '₩' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'MNT', name: 'Mongolian Tögrög', symbol: '₮' },
    { code: 'NPR', name: 'Nepalese Rupee', symbol: '₨' },
    { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu.' },
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'LKR', name: 'Sri Lankan Rupee', symbol: 'රු' },
    { code: 'MVR', name: 'Maldivian Rufiyaa', symbol: 'Rf' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' },
    { code: 'AFN', name: 'Afghan Afghani', symbol: '؋' },
    { code: 'IRR', name: 'Iranian Rial', symbol: '﷼' },
    { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د' },
    { code: 'SYP', name: 'Syrian Pound', symbol: '£S' },
    { code: 'JOD', name: 'Jordanian Dinar', symbol: 'د.ا' },
    { code: 'LBP', name: 'Lebanese Pound', symbol: 'ل.ل' },
    { code: 'ILS', name: 'Israeli Shekel', symbol: '₪' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
    { code: 'YER', name: 'Yemeni Rial', symbol: '﷼' },
    { code: 'OMR', name: 'Omani Rial', symbol: 'ر.ع' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' }
  ];

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'about', label: 'About', icon: HelpCircle },
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-white/80">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="glass-card mb-6">
        <h2 className="text-2xl font-bold mb-2">Settings</h2>
        <p className="text-white/80">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 hidden md:block">
          <div className="glass-card">
            <div className="space-y-2">
              {sections.map(section => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      haptics.tabSwitch();
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/60 hover:text-white/80 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="glass-card">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <User size={40} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{settings.username || 'User'}</h3>
                    <p className="text-white/60">{user.email}</p>
                    <p className="text-white/60 text-sm">Member since {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
                  <input
                    type="text"
                    value={settings.username}
                    onChange={(e) => setSettings({...settings, username: e.target.value})}
                    className="glass-input"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Country</label>
                  <select
                    value={settings.country}
                    onChange={(e) => setSettings({...settings, country: e.target.value})}
                    className="glass-input"
                  >
                    <option value="">Select your country</option>
                    {countries.map(country => (
                      <option key={country.code} value={country.code}>{country.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">User ID</label>
                  <input
                    type="text"
                    value={user.id}
                    readOnly
                    className="glass-input bg-white/5"
                  />
                </div>
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Home Currency</label>
                  <select
                    value={settings.home_currency}
                    onChange={(e) => setSettings({...settings, home_currency: e.target.value})}
                    className="glass-input"
                  >
                    {currencies.map(currency => (
                      <option key={currency.code} value={currency.code}>
                        {currency.name} ({currency.symbol})
                      </option>
                    ))}
                  </select>
                  <p className="text-white/60 text-sm mt-2">
                    This will be used as your default currency for all receipts and spending reports.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Language</label>
                  <select
                    defaultValue="en"
                    className="glass-input"
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="it">Italiano</option>
                    <option value="pt">Português</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="zh">中文</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Date Format</label>
                  <select
                    defaultValue="MM/DD/YYYY"
                    className="glass-input"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Time Zone</label>
                  <select
                    defaultValue="UTC"
                    className="glass-input"
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time (EST)</option>
                    <option value="CST">Central Time (CST)</option>
                    <option value="MST">Mountain Time (MST)</option>
                    <option value="PST">Pacific Time (PST)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-white/60 text-sm">Receive notifications about your spending</p>
                  </div>
                  <button
                    onClick={() => {
                      setSettings({...settings, notifications_enabled: !settings.notifications_enabled});
                      haptics.selection();
                    }}
                    className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                      settings.notifications_enabled ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        settings.notifications_enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Budget Warnings</h4>
                    <p className="text-white/60 text-sm">Get alerts when you're close to budget limits</p>
                  </div>
                  <button
                    onClick={() => {
                      setSettings({...settings, budget_warnings: !settings.budget_warnings});
                      haptics.selection();
                    }}
                    className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                      settings.budget_warnings ? 'bg-purple-500' : 'bg-white/20'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                        settings.budget_warnings ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <h4 className="font-medium mb-4">Notification Types</h4>
                  <div className="space-y-3">
                    {['Daily Summary', 'Weekly Report', 'Monthly Overview', 'Budget Alerts', 'New Features'].map(type => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-white/80">{type}</span>
                        <button
                          onClick={() => haptics.selection()}
                          className="w-12 h-6 rounded-full bg-purple-500"
                        >
                          <div className="w-5 h-5 bg-white rounded-full translate-x-6" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Change Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="glass-input pl-12 pr-12"
                      placeholder="Enter new password"
                    />
                    <button
                      onClick={() => {
                        setShowPassword(!showPassword);
                        haptics.buttonPress();
                      }}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Two-Factor Authentication</label>
                  <div className="glass-card bg-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Enable 2FA</h4>
                        <p className="text-white/60 text-sm">Add an extra layer of security to your account</p>
                      </div>
                      <button
                        onClick={() => haptics.selection()}
                        className="glass-button px-4 py-2"
                      >
                        Setup
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Active Sessions</label>
                  <div className="space-y-3">
                    <div className="glass-card bg-white/5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone size={20} className="text-white/60" />
                          <div>
                            <h4 className="font-medium">Current Device</h4>
                            <p className="text-white/60 text-sm">iPhone 14 Pro • Safari</p>
                          </div>
                        </div>
                        <span className="text-green-400 text-sm">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/20">
                  <button
                    onClick={handleSignOut}
                    className="glass-button w-full flex items-center justify-center gap-2 text-red-300 hover:text-red-200"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </div>
              </div>
            )}

            {/* About Section */}
            {activeSection === 'about' && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-4xl font-bold">T</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Tappd</h3>
                  <p className="text-white/60">Version 1.0.0</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Features</h4>
                  <ul className="space-y-2 text-white/80">
                    <li>• AI-powered receipt scanning</li>
                    <li>• Automatic expense categorization</li>
                    <li>• Multi-currency support</li>
                    <li>• Spending analytics and insights</li>
                    <li>• Budget tracking and alerts</li>
                    <li>• Export to CSV</li>
                    <li>• Cross-device synchronization</li>
                    <li>• PWA support for offline use</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Support</h4>
                  <div className="space-y-3">
                    <button
                      onClick={() => haptics.buttonPress()}
                      className="glass-button w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <HelpCircle size={20} />
                        <span>Help Center</span>
                      </div>
                      <ChevronRight size={20} />
                    </button>

                    <button
                      onClick={() => haptics.buttonPress()}
                      className="glass-button w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Mail size={20} />
                        <span>Contact Support</span>
                      </div>
                      <ChevronRight size={20} />
                    </button>

                    <button
                      onClick={() => haptics.buttonPress()}
                      className="glass-button w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <FileText size={20} />
                        <span>Terms of Service</span>
                      </div>
                      <ChevronRight size={20} />
                    </button>

                    <button
                      onClick={() => haptics.buttonPress()}
                      className="glass-button w-full flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Shield size={20} />
                        <span>Privacy Policy</span>
                      </div>
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="text-center text-white/60 text-sm">
                  <p>© 2024 Tappd. All rights reserved.</p>
                  <p>Made with ❤️ for smart expense tracking</p>
                </div>
              </div>
            )}
          </div>

          {/* Save Button */}
          {activeSection !== 'about' && (
            <div className="mt-6">
              <button
                id="save-button"
                onClick={handleSave}
                disabled={saving}
                className="btn-primary w-full"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
