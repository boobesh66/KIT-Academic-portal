import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  ShieldCheck,
  Bell,
  Database,
  Sparkles,
  Check,
  Download,
  ShieldAlert,
  Lock,
  Unlock,
  RefreshCw,
  AlertTriangle,
  FileText,
  UserX,
  UserCheck,
  Activity
} from 'lucide-react';
import { api } from '../../services/api';
import { User } from '../../types';

export const AdminSettings: React.FC = () => {
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [semesterType, setSemesterType] = useState('Even Semester');
  const [attendanceThreshold, setAttendanceThreshold] = useState(75);
  const [enableSmsAlerts, setEnableSmsAlerts] = useState(true);
  const [enableAiInsights, setEnableAiInsights] = useState(true);
  const [aiModel, setAiModel] = useState('gemini-2.5-flash');
  const [isSaved, setIsSaved] = useState(false);

  // Blocked users management state
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
  const [isLoadingBlocked, setIsLoadingBlocked] = useState(false);
  const [unblockingId, setUnblockingId] = useState<string | null>(null);
  const [securityStatusMessage, setSecurityStatusMessage] = useState<string | null>(null);

  const fetchBlockedUsers = async () => {
    setIsLoadingBlocked(true);
    try {
      const users = await api.getBlockedUsers();
      if (Array.isArray(users)) {
        setBlockedUsers(users);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingBlocked(false);
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const handleUnblockUser = async (userId: string) => {
    setUnblockingId(userId);
    try {
      const res = await api.unblockUser(userId);
      if (res.success) {
        setBlockedUsers((prev) => prev.filter((u) => u.id !== userId));
        setSecurityStatusMessage(`Account ${userId} unlocked and access restored successfully!`);
        setTimeout(() => setSecurityStatusMessage(null), 3000);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setUnblockingId(null);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div id="admin-settings-view" className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            System Governance
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">ERP & AI Platform Settings</h1>
          <p className="text-xs text-gray-500 mt-1">
            Configure Anna University autonomous regulation parameters, AI prediction models, and cybersecurity defense rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>Save System Parameters</span>
        </button>
      </div>

      {isSaved && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" /> System parameters updated and broadcasted across campus node network.
        </div>
      )}

      {securityStatusMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <UserCheck className="w-4 h-4 text-emerald-600" /> {securityStatusMessage}
        </div>
      )}

      {/* Cybersecurity & Blocked Accounts Center */}
      <div className="rounded-2xl border-2 border-red-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900">
                Institutional Cybersecurity & Account Suspension Console
              </h2>
              <p className="text-xs text-gray-500">
                Monitors real-time Gemini AI vision audits, payload vulnerability alerts, and allows administrative overrides.
              </p>
            </div>
          </div>

          <button
            onClick={fetchBlockedUsers}
            disabled={isLoadingBlocked}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBlocked ? 'animate-spin' : ''}`} />
            Refresh Audit List
          </button>
        </div>

        {blockedUsers.length === 0 ? (
          <div className="p-6 rounded-xl bg-emerald-50/60 border border-emerald-200 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              All User Accounts Operating Securely
            </div>
            <p className="text-[11px] text-emerald-700">
              Zero active security lockouts. Uploaded profile media and system requests have passed automated Gemini vulnerability checks.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-red-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {blockedUsers.length} Suspended Account{blockedUsers.length > 1 ? 's' : ''} Requiring Review
              </span>
              <span className="text-[11px] font-mono text-gray-400">Security Gate ISO 27001</span>
            </div>

            <div className="divide-y divide-gray-100 rounded-xl border border-red-200 overflow-hidden bg-red-50/20">
              {blockedUsers.map((bUser) => (
                <div
                  key={bUser.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white hover:bg-red-50/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white font-black text-sm">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-gray-900">{bUser.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 uppercase">
                          {bUser.role}
                        </span>
                        <span className="text-xs text-gray-500 font-mono">
                          {bUser.registerNumber || bUser.employeeCode || bUser.email}
                        </span>
                      </div>

                      <p className="text-xs text-red-900 font-medium">
                        <strong>Reason:</strong> {bUser.blockedReason || 'Vulnerable image payload detected'}
                      </p>

                      {bUser.securityThreatDetails && (
                        <div className="text-[11px] text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200">
                          <span className="font-bold text-gray-700">Audit Diagnosis: </span>
                          <span>{bUser.securityThreatDetails.flaggedPayloadSummary}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleUnblockUser(bUser.id)}
                    disabled={unblockingId === bUser.id}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-2xs transition-colors shrink-0 disabled:opacity-50"
                  >
                    {unblockingId === bUser.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Restoring...</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Unlock & Restore Access</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Settings Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Academic Rules */}
        <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#B71C1C]" />
            Academic & Condonation Rules
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Active Academic Year</label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Current Academic Cycle</label>
              <select
                value={semesterType}
                onChange={(e) => setSemesterType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
              >
                <option value="Odd Semester">Odd Semester (Sem 1, 3, 5, 7)</option>
                <option value="Even Semester">Even Semester (Sem 2, 4, 6, 8)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">
                Minimum Exam Attendance Eligibility Threshold (%)
              </label>
              <input
                type="number"
                min="60"
                max="90"
                value={attendanceThreshold}
                onChange={(e) => setAttendanceThreshold(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden font-bold"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                Students below this threshold are automatically flagged for HOD condonation review.
              </p>
            </div>
          </div>
        </div>

        {/* AI & Automation Triggers */}
        <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#B71C1C]" />
            AI Academic Diagnostic & Security Engine
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Gemini AI Model Engine</label>
              <select
                value={aiModel}
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
              >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash (Vision & Security Auditing)</option>
                <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep diagnostic reasoning)</option>
              </select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableAiInsights}
                  onChange={(e) => setEnableAiInsights(e.target.checked)}
                  className="rounded text-[#B71C1C] focus:ring-[#B71C1C] h-4 w-4"
                />
                <div>
                  <span className="font-bold text-gray-800">Enable Real-Time Student Risk Diagnostics</span>
                  <p className="text-[11px] text-gray-500">
                    Runs multi-variate continuous assessments correlation to predict SGPA and subject risk.
                  </p>
                </div>
              </label>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableSmsAlerts}
                  onChange={(e) => setEnableSmsAlerts(e.target.checked)}
                  className="rounded text-[#B71C1C] focus:ring-[#B71C1C] h-4 w-4"
                />
                <div>
                  <span className="font-bold text-gray-800">Automated Parent SMS Notification Gateway</span>
                  <p className="text-[11px] text-gray-500">
                    Dispatches instant SMS when daily lecture attendance or IA score falls below threshold.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
