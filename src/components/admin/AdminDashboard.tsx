import React from 'react';
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Server,
  ShieldCheck,
  Sparkles,
  Settings,
  ArrowRight,
  Database,
  Award,
  AlertTriangle
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { User } from '../../types';
import { StatCard } from '../common/StatCard';
import { DEPARTMENTS } from '../../data/mockData';

interface AdminDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onNavigate }) => {
  const deptPerformanceData = [
    { name: 'AI & DS', students: 240, avgGpa: 8.35, passRate: 94.2 },
    { name: 'CSE', students: 480, avgGpa: 8.18, passRate: 92.5 },
    { name: 'IT', students: 240, avgGpa: 8.05, passRate: 90.1 },
    { name: 'ECE', students: 360, avgGpa: 7.92, passRate: 88.4 },
    { name: 'EEE', students: 180, avgGpa: 7.84, passRate: 86.8 },
    { name: 'Mech', students: 180, avgGpa: 7.75, passRate: 85.2 },
  ];

  return (
    <div id="admin-dashboard-view" className="space-y-6">
      {/* 1. Admin Header */}
      <div className="rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 via-white to-red-50/30 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B71C1C] text-xl font-bold text-white shadow-md shrink-0">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">
                  Welcome, {user.name}
                </h1>
                <span className="rounded-md bg-gray-900 px-2 py-0.5 text-[11px] font-bold text-white">
                  CENTRAL ERP ADMINISTRATOR
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Kalaignar Karunanidhi Institute of Technology • Central Campus Administration
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0"
            >
              <Settings className="w-4 h-4" />
              <span>ERP System Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Campus Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-admin-students"
          title="Total Student Body"
          value="2,400"
          subtitle="Across 6 Departments"
          icon={Users}
          accentColor="red"
          onClick={() => onNavigate('students')}
        />

        <StatCard
          id="stat-admin-faculty"
          title="Academic Faculty"
          value="120 Faculty"
          subtitle="98% Qualification Met"
          icon={GraduationCap}
          accentColor="blue"
          onClick={() => onNavigate('faculty')}
        />

        <StatCard
          id="stat-admin-departments"
          title="Academic Departments"
          value="6 Programs"
          subtitle="AI&DS, CSE, IT, ECE, EEE, Mech"
          icon={Building2}
          accentColor="green"
          onClick={() => onNavigate('departments')}
        />

        <StatCard
          id="stat-admin-server-health"
          title="System & AI Server"
          value="99.98% Up"
          subtitle="Gemini API Connected"
          icon={Server}
          accentColor="purple"
        />
      </div>

      {/* 3. Department Comparison Bar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Department Academic Pass Rates</h2>
              <p className="text-xs text-gray-500">Autonomous Semester Examination Outcomes</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              Odd Sem 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptPerformanceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[70, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="passRate" name="Pass Rate %" fill="#B71C1C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Logs & Quick Admin Actions */}
        <div className="lg:col-span-4 rounded-xl border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Central System Status
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Database Cluster</span>
                <span className="font-bold text-emerald-700">Active (Healthy)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">Gemini AI Model</span>
                <span className="font-bold text-emerald-700">Gemini 3.7 Online</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-50">
                <span className="text-gray-500">COE Marks Synchronization</span>
                <span className="font-bold text-blue-700">In Sync (Live)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-gray-500">SMS Notification Gateway</span>
                <span className="font-bold text-emerald-700">Operational</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full mt-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors"
          >
            Manage Global ERP Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
