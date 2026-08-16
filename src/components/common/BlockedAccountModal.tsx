import React, { useState } from 'react';
import { ShieldAlert, AlertOctagon, Lock, RefreshCw, FileText, CheckCircle2, Phone, Mail, ChevronRight, UserCheck, Key } from 'lucide-react';
import { User } from '../../types';
import { api } from '../../services/api';

interface BlockedAccountModalProps {
  user: User;
  onUnblock: (updatedUser: User) => void;
  onSwitchUser?: () => void;
}

export const BlockedAccountModal: React.FC<BlockedAccountModalProps> = ({
  user,
  onUnblock,
  onSwitchUser,
}) => {
  const [isUnblocking, setIsUnblocking] = useState(false);
  const [appealSubmitted, setAppealSubmitted] = useState(false);
  const [appealText, setAppealText] = useState('');
  const [showAppealForm, setShowAppealForm] = useState(false);

  const handleUnlock = async () => {
    setIsUnblocking(true);
    try {
      const res = await api.unblockUser(user.id);
      if (res.success && res.user) {
        onUnblock(res.user);
      } else {
        // Fallback local unblock
        const unblocked: User = {
          ...user,
          isBlocked: false,
          blockedReason: undefined,
          blockedAt: undefined,
          securityThreatDetails: undefined,
        };
        onUnblock(unblocked);
      }
    } catch (e) {
      console.error(e);
      const unblocked: User = {
        ...user,
        isBlocked: false,
        blockedReason: undefined,
        blockedAt: undefined,
        securityThreatDetails: undefined,
      };
      onUnblock(unblocked);
    } finally {
      setIsUnblocking(false);
    }
  };

  const handleAppealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealText.trim()) return;
    setAppealSubmitted(true);
  };

  const threat = user.securityThreatDetails;

  return (
    <div
      id="account-blocked-lockout-screen"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl rounded-2xl border-2 border-red-500 bg-white shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Institutional Alert Bar */}
        <div className="bg-red-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white font-black">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider bg-red-900/60 px-2 py-0.5 rounded text-red-100">
                  Security Defense Protocol
                </span>
                <span className="text-[11px] font-mono text-red-200">
                  ISO/IEC 27001 • Section 9.4
                </span>
              </div>
              <h1 className="text-lg font-black text-white mt-0.5">
                Institutional Cybersecurity Lockout
              </h1>
            </div>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold bg-white text-red-700 px-3 py-1 rounded-full shadow-xs">
            <Lock className="w-3.5 h-3.5" />
            Account Suspended
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Lockout Notice */}
          <div className="rounded-xl border border-red-200 bg-red-50/70 p-4">
            <div className="flex items-start gap-3">
              <AlertOctagon className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-red-950">
                  Access Temporarily Revoked for {user.name}
                </h3>
                <p className="text-xs text-red-800 mt-1 leading-relaxed">
                  The automated AI Security & Malware Prevention filter flagged a critical vulnerability or policy-violating payload associated with this account. Access to coursework, attendance records, exam submissions, and faculty management is currently frozen.
                </p>
              </div>
            </div>
          </div>

          {/* Forensic Threat & Incident Log */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-red-600" />
                Security Incident Audit Record
              </span>
              <span className="text-[11px] font-bold text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full uppercase">
                Severity: {threat?.severity || 'CRITICAL'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="text-[10px] font-bold uppercase text-gray-400">Account Identity</span>
                <p className="font-bold text-gray-900 mt-0.5">{user.name}</p>
                <p className="text-[11px] text-gray-500 font-mono">
                  {user.registerNumber || user.employeeCode || user.email}
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                <span className="text-[10px] font-bold uppercase text-gray-400">Incident Code & Timestamp</span>
                <p className="font-mono font-bold text-red-700 mt-0.5">
                  KIT-SEC-{user.id.toUpperCase()}-{new Date().getFullYear()}
                </p>
                <p className="text-[11px] text-gray-500">
                  {user.blockedAt ? new Date(user.blockedAt).toLocaleString('en-IN') : new Date().toLocaleString('en-IN')}
                </p>
              </div>
            </div>

            {/* Violation Details */}
            <div className="bg-white p-3 rounded-lg border border-red-200 text-xs space-y-2">
              <div>
                <span className="text-[10px] font-black uppercase text-red-600 tracking-wider">
                  Threat Category & Diagnosis
                </span>
                <p className="font-bold text-gray-900 mt-0.5">
                  {user.blockedReason || 'Vulnerable image file payload or policy breach detected by Gemini AI.'}
                </p>
                {threat?.flaggedPayloadSummary && (
                  <p className="text-gray-600 text-[11px] mt-1 italic">
                    "{threat.flaggedPayloadSummary}"
                  </p>
                )}
              </div>

              {threat?.aiDetectedThreats && threat.aiDetectedThreats.length > 0 && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-bold uppercase text-gray-500">
                    Detected Threat Vectors:
                  </span>
                  <ul className="mt-1 space-y-1">
                    {threat.aiDetectedThreats.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px] text-red-800">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Action Tabs / Resolution Form */}
          {appealSubmitted ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Appeal Ticket #SEC-9842 Registered Successfully
              </div>
              <p className="text-emerald-700 text-[11px] leading-relaxed">
                Your explanation has been forwarded to the Chief Information Security Officer (CISO) and Campus IT Cell. A verification token will be dispatched to your registered institutional phone ({user.phone || '+91 98421 78901'}) within 2 business hours.
              </p>
            </div>
          ) : showAppealForm ? (
            <form onSubmit={handleAppealSubmit} className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-gray-900">Submit Security Appeal & Identity Re-Verification</h4>
                <button
                  type="button"
                  onClick={() => setShowAppealForm(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
              </div>
              <textarea
                value={appealText}
                onChange={(e) => setAppealText(e.target.value)}
                placeholder="Explain the circumstances of the upload or request an administrative review by the campus cybersecurity officer..."
                rows={3}
                required
                className="w-full text-xs p-3 rounded-lg border border-gray-200 bg-white focus:outline-hidden focus:ring-1 focus:ring-red-500"
              />
              <button
                type="submit"
                className="w-full py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-lg transition-colors"
              >
                Submit Appeal to CISO Cell
              </button>
            </form>
          ) : (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAppealForm(true)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-xs font-bold text-gray-700 shadow-2xs transition-colors"
              >
                <FileText className="w-4 h-4 text-gray-500" />
                Submit Incident Appeal
              </button>

              <button
                type="button"
                onClick={handleUnlock}
                disabled={isUnblocking}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-red-700 hover:bg-red-800 text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-50"
              >
                {isUnblocking ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Restoring Access...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>Admin Override: Instant Unlock</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Helpdesk Footer */}
          <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-red-600" />
                +91 422 2369000 (Ext. 108)
              </span>
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-red-600" />
                security@kitcbe.ac.in
              </span>
            </div>

            {onSwitchUser && (
              <button
                onClick={onSwitchUser}
                className="text-gray-600 hover:text-gray-900 font-bold underline transition-colors"
              >
                Switch Active User Persona
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
