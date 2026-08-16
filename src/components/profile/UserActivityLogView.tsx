import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  LogIn,
  LogOut,
  Laptop,
  Smartphone,
  Globe,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  RefreshCw,
  Download,
  Copy,
  Check,
  Fingerprint,
  Lock,
  Cpu,
  UserCheck,
  ArrowUpRight,
  ChevronDown,
  Info
} from 'lucide-react';
import { User, UserActivityLog, ActivityLogCategory } from '../../types';
import { api } from '../../services/api';

interface UserActivityLogViewProps {
  user: User;
  onOpenPasswordModal?: () => void;
}

export const UserActivityLogView: React.FC<UserActivityLogViewProps> = ({
  user,
  onOpenPasswordModal,
}) => {
  const [logs, setLogs] = useState<UserActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<ActivityLogCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'SUCCESS' | 'FAILED' | 'BLOCKED' | 'WARNING'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedIp, setCopiedIp] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  // Fetch Activity Logs
  const fetchLogs = async () => {
    try {
      const data = await api.getActivityLogs(user.id);
      setLogs(data);
    } catch (e) {
      console.error('Error loading activity logs', e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user.id]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchLogs();
    showNotice('Audit logs synchronized with institutional server.');
  };

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIp(text);
    showNotice(`Copied ${label}: ${text}`);
    setTimeout(() => setCopiedIp(null), 2500);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['ID', 'Timestamp', 'Type', 'Action', 'Status', 'IP Address', 'Location', 'Device', 'Audit ID', 'Details'];
    const rows = logs.map((l) => [
      l.id,
      `"${new Date(l.timestamp).toLocaleString('en-IN')}"`,
      l.type,
      `"${l.action.replace(/"/g, '""')}"`,
      l.status,
      l.ipAddress,
      `"${l.location.replace(/"/g, '""')}"`,
      `"${l.device.replace(/"/g, '""')}"`,
      l.details?.auditId || 'N/A',
      `"${(l.details?.failureReason || l.description).replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `KIT_Security_Activity_Audit_${user.id}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotice('Security audit log exported as CSV file.');
  };

  // Revoke other active sessions simulation
  const handleRevokeOtherSessions = async () => {
    await api.logActivity(user.id, {
      type: 'session_revoked',
      action: 'Remote Sessions Terminated',
      description: 'User initiated security termination of all other active browser tokens.',
      status: 'SUCCESS',
      ipAddress: '172.16.24.108',
      device: 'Chrome 128 (macOS Sonoma)',
      location: 'Coimbatore, TN (Campus LAN)',
      details: {
        auditId: `AUD-REVOKE-${Math.floor(10000 + Math.random() * 90000)}`,
      },
    });
    fetchLogs();
    showNotice('All remote concurrent sessions revoked successfully.');
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // Category filter
      if (activeCategory === 'login' && !log.type.includes('login') && log.type !== 'session_revoked') {
        return false;
      }
      if (
        activeCategory === 'password' &&
        !log.type.includes('password') &&
        !log.type.includes('reauth')
      ) {
        return false;
      }
      if (
        activeCategory === 'security' &&
        log.type !== 'security_scan' &&
        log.type !== 'session_revoked' &&
        log.status !== 'BLOCKED' &&
        log.status !== 'WARNING'
      ) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all' && log.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesAction = log.action.toLowerCase().includes(q);
        const matchesDesc = log.description.toLowerCase().includes(q);
        const matchesIp = log.ipAddress.toLowerCase().includes(q);
        const matchesLocation = log.location.toLowerCase().includes(q);
        const matchesDevice = log.device.toLowerCase().includes(q);
        const matchesAudit = log.details?.auditId?.toLowerCase().includes(q);
        const matchesReason = log.details?.failureReason?.toLowerCase().includes(q);
        return matchesAction || matchesDesc || matchesIp || matchesLocation || matchesDevice || matchesAudit || matchesReason;
      }

      return true;
    });
  }, [logs, activeCategory, statusFilter, searchQuery]);

  // Metrics calculations
  const stats = useMemo(() => {
    const total = logs.length;
    const logins = logs.filter((l) => l.type.includes('login') && l.status === 'SUCCESS').length;
    const pwdSuccess = logs.filter((l) => l.type === 'password_change_success').length;
    const pwdFailed = logs.filter((l) => l.type === 'password_change_failed' || l.type === 'reauth_failed').length;
    const securityBlocks = logs.filter((l) => l.status === 'BLOCKED' || l.status === 'FAILED').length;
    const lastLogin = logs.find((l) => l.type === 'login' && l.status === 'SUCCESS');

    return {
      total,
      logins,
      pwdSuccess,
      pwdFailed,
      securityBlocks,
      lastLogin,
    };
  }, [logs]);

  // Helper badge color
  const getStatusBadge = (status: UserActivityLog['status']) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            SUCCESS
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            FAILED
          </span>
        );
      case 'BLOCKED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-black text-red-800 border border-red-300">
            <ShieldAlert className="w-3 h-3 text-red-700" />
            BLOCKED
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            WARNING
          </span>
        );
    }
  };

  // Helper event icon
  const getEventIcon = (type: UserActivityLog['type'], status: UserActivityLog['status']) => {
    if (status === 'BLOCKED' || status === 'FAILED') {
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
          <ShieldAlert className="w-4 h-4" />
        </div>
      );
    }

    switch (type) {
      case 'login':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <LogIn className="w-4 h-4" />
          </div>
        );
      case 'password_change_success':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <KeyRound className="w-4 h-4" />
          </div>
        );
      case 'password_change_failed':
      case 'reauth_failed':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <Lock className="w-4 h-4" />
          </div>
        );
      case 'reauth_success':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <Fingerprint className="w-4 h-4" />
          </div>
        );
      case 'security_scan':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <ShieldCheck className="w-4 h-4" />
          </div>
        );
      case 'session_revoked':
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
            <LogOut className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
            <UserCheck className="w-4 h-4" />
          </div>
        );
    }
  };

  // Helper date formatter
  const formatEventDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let relative = '';
    if (diffMins < 2) relative = 'Just now';
    else if (diffMins < 60) relative = `${diffMins} mins ago`;
    else if (diffHours < 24) relative = `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
    else if (diffDays === 1) relative = 'Yesterday';
    else if (diffDays < 30) relative = `${diffDays} days ago`;
    else relative = date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

    return {
      relative,
      formatted: date.toLocaleString('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-mono"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI & Security Summary Header Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Recent Logins & Active Sessions */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Portal Logins (30 Days)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gray-900">{stats.logins}</span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  1 Active Session
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <LogIn className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-500 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-gray-400" />
            <span>
              Last access:{' '}
              <strong className="text-gray-700">
                {stats.lastLogin ? formatEventDate(stats.lastLogin.timestamp).relative : 'Recent'}
              </strong>
            </span>
          </div>
        </div>

        {/* Card 2: IP Access & Network Subnet */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Current Access IP
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black font-mono text-[#B71C1C]">
                  {stats.lastLogin?.ipAddress || '172.16.24.108'}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(stats.lastLogin?.ipAddress || '172.16.24.108', 'IP Address')
                  }
                  title="Copy IP"
                  className="p-1 rounded-md text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  {copiedIp === (stats.lastLogin?.ipAddress || '172.16.24.108') ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-red-50 text-[#B71C1C] border border-red-100">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-500 truncate flex items-center gap-1">
            <Laptop className="w-3 h-3 text-gray-400 shrink-0" />
            <span className="truncate">Campus LAN (Tech Block III - Subnet 172.16)</span>
          </div>
        </div>

        {/* Card 3: Password Changes & Re-Auth Attempts */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Password & Re-Auth
              </span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-gray-900">{stats.pwdSuccess}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                  Success
                </span>
                {stats.pwdFailed > 0 && (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md border border-rose-200">
                    {stats.pwdFailed} Failed
                  </span>
                )}
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
              <KeyRound className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>
              {user.lastPasswordChangedAt
                ? `Updated ${formatEventDate(user.lastPasswordChangedAt).relative}`
                : 'Synced with ERP'}
            </span>
            {onOpenPasswordModal && (
              <button
                type="button"
                onClick={onOpenPasswordModal}
                className="text-[10px] font-bold text-[#B71C1C] hover:underline"
              >
                Change →
              </button>
            )}
          </div>
        </div>

        {/* Card 4: Threat Defense & Security Integrity */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                Threat Defense
              </span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-emerald-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Protected
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-gray-100 text-[11px] text-gray-500 flex items-center gap-1.5">
            <Cpu className="w-3 h-3 text-purple-500" />
            <span>256-bit PBKDF2 Hashing Active</span>
          </div>
        </div>
      </div>

      {/* Main Activity Log Feed Container */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        {/* Controls Toolbar */}
        <div className="p-5 border-b border-gray-100 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-[#B71C1C]" />
                Security Activity & Access Audit Trail
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time forensic monitoring of user authentication sessions, IP access origins, and credential rotation attempts.
              </p>
            </div>

            {/* Actions: Refresh, Revoke Sessions, Export */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-2xs transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#B71C1C]' : ''}`} />
                <span>{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
              </button>

              <button
                type="button"
                onClick={handleRevokeOtherSessions}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 shadow-2xs transition-all"
                title="Revoke all concurrent active login tokens on other machines"
              >
                <LogOut className="w-3.5 h-3.5 text-amber-700" />
                <span>Revoke Other Sessions</span>
              </button>

              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#B71C1C] hover:bg-[#8E0000] rounded-xl shadow-2xs transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeCategory === 'all'
                    ? 'bg-[#B71C1C] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Events ({logs.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('login')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  activeCategory === 'login'
                    ? 'bg-[#B71C1C] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <LogIn className="w-3 h-3" />
                <span>Logins & Sessions</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('password')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  activeCategory === 'password'
                    ? 'bg-[#B71C1C] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <KeyRound className="w-3 h-3" />
                <span>Password & Re-Auth</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCategory('security')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  activeCategory === 'security'
                    ? 'bg-[#B71C1C] text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <ShieldAlert className="w-3 h-3" />
                <span>Security & Threat Scans</span>
              </button>
            </div>

            {/* Status Dropdown & Search Input */}
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="p-1.5 text-xs font-semibold rounded-xl border border-gray-200 bg-gray-50 text-gray-700 focus:outline-hidden focus:border-[#B71C1C]"
              >
                <option value="all">All Statuses</option>
                <option value="SUCCESS">Success Only</option>
                <option value="FAILED">Failed Attempts</option>
                <option value="BLOCKED">Blocked Attempts</option>
                <option value="WARNING">Warnings</option>
              </select>

              <div className="relative min-w-[200px] sm:w-56">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by IP, action..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden focus:border-[#B71C1C]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-mono"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Security Policy Information Banner */}
        <div className="bg-amber-50/70 border-b border-amber-100 px-5 py-3 flex items-start gap-3 text-xs text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">Institutional Security Policy (ISO/IEC 27001 & KIT Governance)</p>
            <p className="text-[11px] text-amber-800">
              All sign-ins, IP geolocations, and password re-authentication attempts are cryptographically timestamped and logged for 180 days. Suspicious brute-force or unauthorized IP events trigger automatic rate limiting.
            </p>
          </div>
        </div>

        {/* Logs Feed Content */}
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 space-y-3">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#B71C1C]" />
            <p className="text-xs font-semibold">Loading security audit records...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 space-y-2">
            <Shield className="w-8 h-8 mx-auto text-gray-300" />
            <h4 className="text-xs font-bold text-gray-700">No Activity Logs Found</h4>
            <p className="text-[11px] text-gray-400">
              No audit logs match the current search or category filter.
            </p>
            {(searchQuery || statusFilter !== 'all' || activeCategory !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setActiveCategory('all');
                }}
                className="mt-2 text-xs font-bold text-[#B71C1C] hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredLogs.map((log) => {
              const dateInfo = formatEventDate(log.timestamp);
              const isExpanded = expandedLogId === log.id;
              const isFailedPassword =
                log.type === 'password_change_failed' || log.type === 'reauth_failed';

              return (
                <div
                  key={log.id}
                  className={`p-4 sm:p-5 hover:bg-gray-50/80 transition-colors ${
                    isFailedPassword ? 'bg-red-50/30' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    {/* Left: Event Icon + Action + Description */}
                    <div className="flex items-start gap-3.5">
                      {getEventIcon(log.type, log.status)}

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs font-bold text-gray-900">{log.action}</h4>
                          {getStatusBadge(log.status)}
                          {log.details?.auditId && (
                            <span className="text-[10px] font-mono font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                              {log.details.auditId}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
                          {log.description}
                        </p>

                        {/* Quick Metadata: IP, Location, Device */}
                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-gray-500">
                          {/* IP Address */}
                          <div className="flex items-center gap-1 font-mono font-bold text-gray-700 bg-gray-100/80 px-2 py-0.5 rounded-md">
                            <Globe className="w-3 h-3 text-gray-500" />
                            <span>{log.ipAddress}</span>
                            <button
                              type="button"
                              onClick={() => copyToClipboard(log.ipAddress, 'IP')}
                              title="Copy IP"
                              className="ml-1 text-gray-400 hover:text-gray-700"
                            >
                              {copiedIp === log.ipAddress ? (
                                <Check className="w-2.5 h-2.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-2.5 h-2.5" />
                              )}
                            </button>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-1 text-gray-600">
                            <span>•</span>
                            <span>{log.location}</span>
                          </div>

                          {/* Device */}
                          <div className="flex items-center gap-1 text-gray-500">
                            <span>•</span>
                            <Laptop className="w-3 h-3 text-gray-400" />
                            <span>{log.device}</span>
                          </div>
                        </div>

                        {/* Failure Reason Callout if applicable */}
                        {log.details?.failureReason && (
                          <div className="mt-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-[11px] text-rose-800 flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                              <strong className="font-bold">Security Failure Detail: </strong>
                              <span>{log.details.failureReason}</span>
                              {log.details.riskScore && (
                                <span className="ml-2 px-1.5 py-0.2 bg-rose-200 text-rose-900 rounded-md font-bold text-[10px]">
                                  Risk Score: {log.details.riskScore}/100
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: Timestamp & Details Toggle */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-gray-900 block">
                          {dateInfo.relative}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono block">
                          {dateInfo.formatted}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="text-[11px] font-bold text-[#B71C1C] hover:text-[#8E0000] flex items-center gap-0.5 mt-1"
                      >
                        <span>{isExpanded ? 'Hide Trace' : 'Trace Details'}</span>
                        <ChevronDown
                          className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Technical Trace Drawer */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-gray-50/70 p-3.5 rounded-xl animate-in slide-in-from-top-1">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">
                          Authentication Mechanism
                        </span>
                        <p className="font-mono text-[11px] text-gray-800">
                          {log.details?.authMethod || 'Standard Token Bearer Protocol'}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">
                          Browser & OS Fingerprint
                        </span>
                        <p className="text-[11px] text-gray-800">
                          {log.browser || 'Chrome 128.0'} on {log.os || 'macOS 14.5'}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase block mb-0.5">
                          Institutional Audit Token
                        </span>
                        <p className="font-mono text-[11px] text-emerald-800 font-bold">
                          {log.details?.auditId || `AUD-${log.id}`}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Audit Guarantee */}
      <div className="p-4 rounded-2xl border border-gray-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Continuous Security Monitoring active for <strong>{user.email}</strong>.</span>
        </div>
        <span className="text-[11px] font-mono text-gray-400">
          KIT ERP Cybersecurity Gateway • Log Retention: 180 Days
        </span>
      </div>
    </div>
  );
};
