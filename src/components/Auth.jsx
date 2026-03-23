import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, LogOut } from 'lucide-react';
import { signIn, signUp, signOut, getCurrentUser } from '../supabase.js';
import { haptics } from '../utils/haptics.js';

export default function Auth({ user, onAuthChange }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load saved email if remember me was checked
  React.useEffect(() => {
    const savedEmail = localStorage.getItem('tappd_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(false);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match');
      haptics.error();
      return;
    }

    try {
      haptics.buttonPress();
      setLoading(true);

      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
        haptics.error();
      } else {
        // Save email if remember me is checked
        if (rememberMe) {
          localStorage.setItem('tappd_email', email);
        } else {
          localStorage.removeItem('tappd_email');
        }
        
        haptics.success();
        // Auth state change will be handled by the listener
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      haptics.error();
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      haptics.buttonPress();
      await signOut();
      localStorage.removeItem('tappd_email');
      haptics.success();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen safe-area-top flex items-center justify-center p-6">
        <div className="glass-card max-w-md w-full slide-up">
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 floating">
              <User size={48} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
            <p className="text-white/80">{user.email}</p>
          </div>
          
          <div className="text-center py-6">
            <p className="text-white/70 mb-6">
              You're all set! Start scanning receipts to track your spending.
            </p>
            
            <button
              onClick={handleSignOut}
              className="glass-button w-full flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen safe-area-top flex items-center justify-center p-6">
      <div className="glass-card max-w-md w-full slide-up liquid-fill">
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 floating">
            <span className="text-white text-5xl font-bold">T</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Tappd</h1>
          <p className="text-white/80">AI-powered receipt scanner</p>
        </div>

        <div className="flex items-center justify-center mb-8 bg-white/10 rounded-2xl p-1 backdrop-blur">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              haptics.tabSwitch();
            }}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
              !isSignUp 
                ? 'bg-white/20 text-white' 
                : 'text-white/60'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              haptics.tabSwitch();
            }}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
              isSignUp 
                ? 'bg-white/20 text-white' 
                : 'text-white/60'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => haptics.inputFocus()}
                className="glass-input pl-12"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => haptics.inputFocus()}
                className="glass-input pl-12 pr-12"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => {
                  setShowPassword(!showPassword);
                  haptics.buttonPress();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => haptics.inputFocus()}
                  className="glass-input pl-12"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => {
                setRememberMe(e.target.checked);
                haptics.selection();
              }}
              className="h-4 w-4 bg-white/20 border-white/30 rounded focus:ring-2 focus:ring-white/50"
            />
            <label htmlFor="remember" className="ml-2 block text-sm text-white/80">
              Remember me
            </label>
          </div>

          {error && (
            <div className="bg-red-500/20 backdrop-blur border border-red-500/30 text-red-200 p-3 rounded-xl text-sm haptic-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:scale-100"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Please wait...
              </div>
            ) : (
              isSignUp ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              haptics.tabSwitch();
            }}
            className="text-white/80 text-sm font-medium hover:text-white transition-colors"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>

        <div className="mt-4 text-xs text-white/60 text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </div>
      </div>
    </div>
  );
}
