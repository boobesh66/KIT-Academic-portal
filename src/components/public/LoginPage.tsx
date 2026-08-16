import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  KeyRound,
  CheckCircle2,
  Building2,
  Lock
} from 'lucide-react';
import { Role, User } from '../../types';
import { USERS } from '../../data/mockData';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onNavigateHome }) => {
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [identifier, setIdentifier] = useState('711522205023');
  const [password, setPassword] = useState('kit@2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Preset Click
  const handleSelectPreset = (presetRole: Role) => {
    setSelectedRole(presetRole);
    setErrorMessage('');
    switch (presetRole) {
      case 'student':
        setIdentifier('711522205023');
        setPassword('student@kit');
        break;
      case 'faculty':
        setIdentifier('ramanathan.s@kit.ac.in');
        setPassword('faculty@kit');
        break;
      case 'hod':
        setIdentifier('hod.aids@kit.ac.in');
        setPassword('hod@kit');
        break;
      case 'admin':
        setIdentifier('admin.academic@kit.ac.in');
        setPassword('admin@kit');
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    setTimeout(() => {
      let matchedUser = USERS.find(
        (u) =>
          u.role === selectedRole &&
          (u.email.toLowerCase() === identifier.toLowerCase() ||
            u.registerNumber?.toLowerCase() === identifier.toLowerCase() ||
            u.id.toLowerCase() === identifier.toLowerCase())
      );

      // If user typed anything else, default to the chosen role template
      if (!matchedUser) {
        matchedUser = USERS.find((u) => u.role === selectedRole) || USERS[0];
      }

      setIsLoading(false);
      onLogin(matchedUser);
    }, 450);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6 bg-gray-50/70">
      <div className="w-full max-w-5xl rounded-2xl border border-gray-200 bg-white shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
        {/* Left Side: Branded Red & White Canvas */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#B71C1C] via-[#D32F2F] to-[#991B1B] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Background Geometric Accents */}
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-black/10 blur-xl pointer-events-none" />

          {/* Top Logo */}
          <div className="relative z-10">
            <div
              onClick={onNavigateHome}
              className="inline-flex items-center gap-3 cursor-pointer group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#B71C1C] shadow-md group-hover:scale-105 transition-transform">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-black tracking-tight leading-none text-white">KIT</h1>
                <p className="text-[10px] font-semibold tracking-wider text-red-100 uppercase mt-0.5">
                  Academic Portal
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" />
                AI-Powered Academic Intelligence
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                Smart Academic Management
              </h2>
              <p className="text-xs text-red-100 leading-relaxed max-w-sm pt-1">
                Kalaignar Karunanidhi Institute of Technology, Coimbatore. Integrated attendance, assessments, curriculum workflows, and real-time risk diagnostic intelligence.
              </p>
            </div>
          </div>

          {/* Middle Features bullets */}
          <div className="relative z-10 my-8 space-y-3">
            {[
              'Comprehensive Attendance & Timetable tracking',
              'AI Academic Risk & Weak Subject Detection',
              'Examinations, Marks & Automated SGPA/CGPA',
              'Multi-role access for Students, Faculty, HOD & Admin',
            ].map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-red-50 font-medium">
                <CheckCircle2 className="w-4 h-4 text-red-200 shrink-0" />
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Institutional Trust Footer */}
          <div className="relative z-10 border-t border-white/20 pt-4 text-[11px] text-red-100 flex items-center justify-between">
            <span>Autonomous • NAAC &apos;A+&apos;</span>
            <span>Anna University Affiliated</span>
          </div>
        </div>

        {/* Right Side: Authentication Form & Quick Presets */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Welcome Back</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Sign in to access your KIT academic portal dashboard.
                </p>
              </div>
              <button
                onClick={onNavigateHome}
                className="text-xs font-semibold text-[#B71C1C] hover:underline"
              >
                ← Back to Home
              </button>
            </div>

            {/* Quick Demo Role Selector Pills */}
            <div className="mb-6 rounded-xl border border-red-100 bg-red-50/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  Quick Demo 1-Click Role Login
                </p>
                <span className="text-[10px] bg-red-100 text-[#B71C1C] font-semibold px-2 py-0.5 rounded-full">
                  Click to Auto-fill
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['student', 'faculty', 'hod', 'admin'] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleSelectPreset(r)}
                    className={`px-3 py-2 text-xs rounded-lg font-bold capitalize transition-all ${
                      selectedRole === r
                        ? 'bg-[#B71C1C] text-white shadow-xs'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-red-300'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Radio Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Select User Role
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'student', label: 'Student' },
                    { id: 'faculty', label: 'Faculty' },
                    { id: 'hod', label: 'HOD' },
                    { id: 'admin', label: 'Administrator' },
                  ].map((roleOpt) => (
                    <label
                      key={roleOpt.id}
                      className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                        selectedRole === roleOpt.id
                          ? 'border-[#B71C1C] bg-red-50 text-[#B71C1C]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="userRole"
                        value={roleOpt.id}
                        checked={selectedRole === roleOpt.id}
                        onChange={() => handleSelectPreset(roleOpt.id as Role)}
                        className="sr-only"
                      />
                      <span>{roleOpt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Identifier Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {selectedRole === 'student' ? 'Register Number / Email' : 'Official Email / Staff ID'}
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={
                      selectedRole === 'student'
                        ? 'e.g. 711522205023'
                        : 'e.g. ramanathan.s@kit.ac.in'
                    }
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">Password</label>
                  <a href="#forgot" onClick={(e) => e.preventDefault()} className="text-[11px] text-[#B71C1C] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your portal password"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:border-[#B71C1C] focus:ring-1 focus:ring-[#B71C1C] focus:outline-hidden"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                id="btn-submit-login"
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#B71C1C] py-3 text-xs font-bold text-white shadow-md hover:bg-[#D32F2F] active:scale-[0.99] transition-all disabled:opacity-70 cursor-pointer"
              >
                {isLoading ? (
                  <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <span>LOGIN TO {selectedRole.toUpperCase()} PORTAL</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Security note */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-2 text-xs text-gray-400">
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span>256-Bit Encrypted Academic Network • KIT Coimbatore</span>
          </div>
        </div>
      </div>
    </div>
  );
};
