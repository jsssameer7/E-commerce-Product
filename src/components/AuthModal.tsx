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
  CheckCircle2,
  Compass
} from 'lucide-react';

interface StoredAccount extends User {
  password?: string;
}

function getStoredUsers(): StoredAccount[] {
  try {
    const data = localStorage.getItem('electro_registered_users');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredAccount[]) {
  try {
    localStorage.setItem('electro_registered_users', JSON.stringify(users));
  } catch (e) {
    console.error('Failed to save user:', e);
  }
}

interface AuthContentProps {
  onLoginSuccess: (user: User) => void;
  isModal?: boolean;
  onClose?: () => void;
  onContinueAsGuest?: () => void;
}

export const AuthContent: React.FC<AuthContentProps> = ({
  onLoginSuccess,
  isModal = false,
  onClose,
  onContinueAsGuest,
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
  const [regRole, setRegRole] = useState<'customer' | 'admin'>('customer');
  const [regCity, setRegCity] = useState('Mumbai');
  const [regZipCode, setRegZipCode] = useState('400001');

  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check existing demo users
    const demoMatch = DEMO_USERS.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );
    if (demoMatch) {
      onLoginSuccess(demoMatch);
      if (onClose) onClose();
      return;
    }

    // 2. Check registered accounts in localStorage
    const storedUsers = getStoredUsers();
    const storedMatch = storedUsers.find(
      (u) => u.email.toLowerCase() === cleanEmail
    );

    if (storedMatch) {
      if (storedMatch.password && storedMatch.password !== password) {
        setErrorMessage('Incorrect password. Please try again or use a 1-Click Demo account.');
        return;
      }
      onLoginSuccess(storedMatch);
      if (onClose) onClose();
      return;
    }

    // 3. If new email, automatically create account and sign in
    const isAdmin = cleanEmail.includes('admin') || cleanEmail.includes('seller');
    const newDynamicUser: StoredAccount = {
      id: 'user-' + cleanEmail.replace(/[^a-z0-9]/g, '-'),
      name: email.split('@')[0] || 'Registered User',
      email: email.trim(),
      role: isAdmin ? 'admin' : 'customer',
      avatar: isAdmin
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      city: 'Mumbai',
      zipCode: '400001',
      password: password,
    };

    saveStoredUsers([...storedUsers, newDynamicUser]);
    onLoginSuccess(newDynamicUser);
    if (onClose) onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!regName.trim() || !regEmail.trim() || !regPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    const cleanEmail = regEmail.trim().toLowerCase();
    const storedUsers = getStoredUsers();

    if (storedUsers.some((u) => u.email.toLowerCase() === cleanEmail) || DEMO_USERS.some((u) => u.email.toLowerCase() === cleanEmail)) {
      setErrorMessage('An account with this email already exists. Please Sign In.');
      return;
    }

    const newUser: StoredAccount = {
      id: 'user-' + cleanEmail.replace(/[^a-z0-9]/g, '-'),
      name: regName.trim(),
      email: regEmail.trim(),
      role: regRole,
      avatar: regRole === 'admin'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      city: regCity.trim() || 'Mumbai',
      zipCode: regZipCode.trim() || '400001',
      password: regPassword,
    };

    saveStoredUsers([...storedUsers, newUser]);
    onLoginSuccess(newUser);
    if (onClose) onClose();
  };

  const handleQuickDemoLogin = (demoUser: User) => {
    onLoginSuccess(demoUser);
    if (onClose) onClose();
  };

  return (
    <div className="bg-white dark:bg-gray-900 w-full rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-400" />
          <h2 className="text-base font-extrabold">Account Sign In & Access</h2>
        </div>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
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
      <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
        
        {/* Quick Demo Login Preset Buttons */}
        <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900 space-y-2">
          <p className="text-[11px] font-extrabold uppercase text-blue-900 dark:text-blue-200 tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> 1-Click Instant Demo Login:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin(DEMO_USERS[0])}
              className="p-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:scale-[1.02] transition-all text-left flex items-center gap-2 shadow-sm"
            >
              <img src={DEMO_USERS[0].avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
              <div className="min-w-0">
                <p className="font-extrabold truncate text-xs text-blue-600 dark:text-blue-400">Customer</p>
                <p className="text-[10px] text-gray-400 truncate">Rajesh Sharma</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin(DEMO_USERS[1])}
              className="p-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-xs font-bold border border-gray-200 dark:border-gray-700 hover:border-indigo-500 hover:scale-[1.02] transition-all text-left flex items-center gap-2 shadow-sm"
            >
              <img src={DEMO_USERS[1].avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
              <div className="min-w-0">
                <p className="font-extrabold truncate text-xs text-indigo-600 dark:text-indigo-400">Seller Admin</p>
                <p className="text-[10px] text-gray-400 truncate">Admin Account</p>
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
                  placeholder="Enter password..."
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
                  placeholder="e.g. Sameer"
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
                  placeholder="your.email@example.com"
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
                  placeholder="Create your password..."
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">Account Role</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as 'customer' | 'admin')}
                  className="w-full px-2.5 py-2 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="customer">Customer Buyer</option>
                  <option value="admin">Seller Admin</option>
                </select>
              </div>
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
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">PIN Code (India)</label>
              <input
                type="text"
                required
                value={regZipCode}
                onChange={(e) => setRegZipCode(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 text-xs rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-500 font-semibold">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 rounded-xl text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Create Account & Start Shopping</span>
            </button>
          </form>
        )}

        {/* Continue as Guest option */}
        {onContinueAsGuest && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800 text-center">
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center gap-2 transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Continue as Guest (Explore Store Directly)</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <AuthContent onLoginSuccess={onLoginSuccess} isModal={true} onClose={onClose} />
      </div>
    </div>
  );
};
