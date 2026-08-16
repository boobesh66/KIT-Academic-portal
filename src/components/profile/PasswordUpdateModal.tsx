import React, { useState } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  X,
  AlertTriangle,
  RefreshCw,
  Smartphone,
  Check,
  Fingerprint,
  Info
} from 'lucide-react';
import { User } from '../../types';
import { api } from '../../services/api';

interface PasswordUpdateModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: User, successMessage: string) => void;
}

export const PasswordUpdateModal: React.FC<PasswordUpdateModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2FA / OTP Re-auth optional state
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // Processing & Error states
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [reAuthVerified, setReAuthVerified] = useState(false);

  if (!isOpen) return null;

  // Strength Check Calculations
  const hasMinLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword);
  const isDifferentFromCurrent = currentPassword.length > 0 && newPassword !== currentPassword;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const score = [hasMinLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;
  const strengthPercentage = (score / 5) * 100;

  const getStrengthLabel = () => {
    if (newPassword.length === 0) return { label: 'Enter Password', color: 'bg-gray-200', text: 'text-gray-400' };
    if (score <= 2) return { label: 'Weak (Vulnerable)', color: 'bg-red-500', text: 'text-red-600' };
    if (score === 3 || score === 4) return { label: 'Moderate (Fair)', color: 'bg-amber-500', text: 'text-amber-600' };
    return { label: 'Strong (Institutional Grade)', color: 'bg-emerald-500', text: 'text-emerald-600' };
  };

  const strength = getStrengthLabel();

  // Preset password quick tester
  const handleUsePreset = (preset: string) => {
    setCurrentPassword(preset);
    setErrorMessage(null);
  };

  // Trigger Mock OTP for Dual-Factor Re-auth
  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpCode('829104');
    setOtpTimer(60);
  };

  // Perform Re-Authentication and Password Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentPassword) {
      setErrorMessage('Re-authentication required: Please enter your current password.');
      return;
    }

    if (score < 5) {
      setErrorMessage('New password does not meet institutional cybersecurity criteria.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('New password and confirmation password do not match.');
      return;
    }

    if (newPassword === currentPassword) {
      setErrorMessage('New password cannot be identical to your current password.');
      return;
    }

    setIsVerifying(true);

    try {
      const response = await api.updatePassword({
        userId: user.id,
        currentPassword,
        newPassword,
        confirmPassword,
        otp: otpCode,
      });

      if (!response.success) {
        setAttemptCount((prev) => prev + 1);
        setErrorMessage(response.error || 'Re-authentication failed: Current password is incorrect.');
        setIsVerifying(false);
        return;
      }

      // Success
      setIsVerifying(false);
      const updatedUser: User = response.user || {
        ...user,
        lastPasswordChangedAt: response.lastPasswordChangedAt || new Date().toISOString(),
      };

      onSuccess(
        updatedUser,
        `Institutional password updated successfully on ${new Date().toLocaleTimeString()}. Re-authentication audit logged.`
      );
      onClose();
    } catch (err: any) {
      setAttemptCount((prev) => prev + 1);
      setErrorMessage(err?.message || 'Re-authentication failed. Please verify your current credentials.');
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 my-8 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-[#B71C1C]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Update Institutional Password
              </h2>
              <p className="text-xs text-gray-500">
                Requires mandatory credential re-authentication before saving.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Re-Auth Notice */}
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs text-amber-900 flex items-start gap-2.5">
          <Fingerprint className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-950 block">
              Identity Re-Authentication Enforced
            </span>
            <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
              To protect your academic and personal records, KIT Cybersecurity Policy mandates verifying your current password before committing new credentials to the server.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800 flex items-start gap-2 animate-shake">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">Authentication Notice</span>
              <p className="text-[11px] text-red-700 mt-0.5">{errorMessage}</p>
              {attemptCount >= 2 && (
                <p className="text-[10px] text-red-600 font-bold mt-1">
                  ⚠️ Note: Repeated failed attempts will trigger an automated account security lockout.
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Step 1: Re-Authentication Gate (Current Password) */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#B71C1C]" />
                1. Re-Authenticate: Current Password <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-gray-500 font-semibold">
                User: <span className="font-mono text-gray-700">{user.email}</span>
              </span>
            </div>

            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="Enter your existing active password"
                className="w-full py-2.5 pl-3 pr-10 text-xs rounded-xl border border-gray-300 bg-white focus:border-[#B71C1C] focus:ring-2 focus:ring-red-500/20 focus:outline-hidden font-mono"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Helper Preset Chips */}
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <span className="text-[10px] text-gray-500">Quick Fill Default:</span>
              <button
                type="button"
                onClick={() => handleUsePreset(`${user.role}@kit`)}
                className="text-[10px] px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-mono font-bold"
              >
                {user.role}@kit
              </button>
              <button
                type="button"
                onClick={() => handleUsePreset('kit@2026')}
                className="text-[10px] px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-mono font-bold"
              >
                kit@2026
              </button>
            </div>
          </div>

          {/* Step 2: New Password Specification */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                2. Enter New Institutional Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create a strong, new password"
                  className="w-full py-2.5 pl-3 pr-10 text-xs rounded-xl border border-gray-300 bg-white focus:border-[#B71C1C] focus:ring-2 focus:ring-red-500/20 focus:outline-hidden font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Meter Bar */}
              <div className="mt-2 space-y-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-gray-500">Cybersecurity Strength:</span>
                  <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strength.color}`}
                    style={{ width: `${strengthPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-xs font-bold text-gray-800 mb-1">
                3. Confirm New Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your new password"
                  className={`w-full py-2.5 pl-3 pr-10 text-xs rounded-xl border font-mono focus:outline-hidden ${
                    confirmPassword.length > 0
                      ? passwordsMatch
                        ? 'border-emerald-500 bg-emerald-50/20 focus:border-emerald-600'
                        : 'border-red-400 bg-red-50/20 focus:border-red-500'
                      : 'border-gray-300 bg-white focus:border-[#B71C1C]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword.length > 0 && (
                <p className={`text-[10px] font-bold mt-1 flex items-center gap-1 ${passwordsMatch ? 'text-emerald-700' : 'text-red-600'}`}>
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Passwords match
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-red-500" /> Passwords do not match
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Checklist of Security Criteria */}
            <div className="rounded-xl bg-gray-50 border border-gray-200 p-3 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                Password Policy Checklist:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                <div className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                  {hasMinLength ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 flex items-center justify-center text-gray-400">•</span>}
                  <span>8+ Characters Minimum</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                  {hasUpper ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 flex items-center justify-center text-gray-400">•</span>}
                  <span>Uppercase Letter (A-Z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasLower ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                  {hasLower ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 flex items-center justify-center text-gray-400">•</span>}
                  <span>Lowercase Letter (a-z)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                  {hasNumber ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 flex items-center justify-center text-gray-400">•</span>}
                  <span>Number (0-9)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                  {hasSpecial ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 flex items-center justify-center text-gray-400">•</span>}
                  <span>Special Symbol (@$!%*#)</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isDifferentFromCurrent ? 'text-emerald-700 font-semibold' : 'text-gray-500'}`}>
                  {isDifferentFromCurrent ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <span className="w-3.5 h-3.5 flex items-center justify-center text-gray-400">•</span>}
                  <span>Distinct from Current</span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isVerifying}
              className="px-4 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isVerifying || score < 5 || !passwordsMatch || !currentPassword}
              className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-[#B71C1C] hover:bg-[#8E0000] rounded-xl shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Re-Authenticating & Saving...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Identity & Update Password</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
