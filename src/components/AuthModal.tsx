import React, { useState } from 'react';
import { User } from '../types';
import { DEMO_USERS } from '../data/users';
import { 
  X, 
  UserCheck, 
  Lock, 
  Mail, 
  User as UserIcon, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regCity, setRegCity] = useState('Mumbai');
  const [regZipCode, setRegZipCode] = useState('400001');

  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Check existing demo users
    const matched = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (matched) {
      onLoginSuccess(matched);
      onClose();
      return;
    }

    // Default dynamic user if email isn't demo
    const dynamicUser: User = {
      id: 'user-' + Date.now(),
      name: email.split('@')[0] || 'Registered User',
      email: email,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      city: 'Mumbai',
      zipCode: '400001',
    };

    onLoginSuccess(dynamicUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) return;

    const newUser: User = {
      id: 'user-' + Date.now(),
      name: regName,
      email: regEmail,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      city: regCity,
      zipCode: regZipCode,
    };

    onLoginSuccess(newUser);
    onClose();
  };

  const handleQuickDemoLogin = (demoUser: User) => {
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-extrabold">Account Sign In & Access</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 dark:border-gray-800 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => { setActiveTab('login'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'login'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMessage(''); }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              activeTab === 'register'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/40 dark:bg-blue-950/20'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          
          {/* Quick Demo Login Preset Buttons */}
          <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-2">
            <p className="text-[11px] font-extrabold uppercase text-blue-900 dark:text-blue-200 tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 1-Click Demo Accounts:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(DEMO_USERS[0])}
                className="p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:scale-105 transition-all text-left flex items-center gap-2 shadow-sm"
              >
                <img src={DEMO_USERS[0].avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="font-extrabold truncate text-[11px]">Customer</p>
                  <p className="text-[9px] text-gray-400 truncate">Rajesh Sharma</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin(DEMO_USERS[1])}
                className="p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:scale-105 transition-all text-left flex items-center gap-2 shadow-sm"
              >
                <img src={DEMO_USERS[1].avatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                <div className="min-w-0">
                  <p className="font-extrabold truncate text-[11px] text-indigo-600 dark:text-indigo-400">Seller Admin</p>
                  <p className="text-[9px] text-gray-400 truncate">Admin Account</p>
                </div>
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rajesh.sharma@example.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-500 font-semibold">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <span>Sign In to ElectroCompare</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ananya Roy"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="ananya@example.in"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Create password..."
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={regCity}
                    onChange={(e) => setRegCity(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">PIN Code</label>
                  <input
                    type="text"
                    required
                    value={regZipCode}
                    onChange={(e) => setRegZipCode(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Register & Access Portal</span>
              </button>
            </form>
          )}

          {/* Social OAuth Mock Buttons */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800 text-center">
            <p className="text-[11px] text-gray-400 mb-2 font-medium">Or quick sign in with social account:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(DEMO_USERS[0])}
                className="py-2 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin(DEMO_USERS[1])}
                className="py-2 px-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>GitHub</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
