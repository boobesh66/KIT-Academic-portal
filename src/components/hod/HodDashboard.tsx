import React from 'react';
import {
  Users,
  GraduationCap,
  BookOpen,
  UserCheck,
  Award,
  Sparkles,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  BarChart3,
  Building2,
  ArrowRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { User } from '../../types';
import { StatCard } from '../common/StatCard';

interface HodDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const HodDashboard: React.FC<HodDashboardProps> = ({ user, onNavigate }) => {
  const sectionVarianceData = [
    { section: 'Year II - Sec A', attendance: 88.2, passRate: 94.0, avgGpa: 8.35 },
    { section: 'Year II - Sec B', attendance: 85.0, passRate: 89.5, avgGpa: 7.92 },
    { section: 'Year III - Sec A', attendance: 86.4, passRate: 91.2, avgGpa: 8.12 },
    { section: 'Year III - Sec B', attendance: 82.1, passRate: 85.0, avgGpa: 7.64 },
    { section: 'Year IV - Sec A', attendance: 91.5, passRate: 96.8, avgGpa: 8.62 },
  ];

  return (
    <div id="hod-dashboard-view" className="space-y-6">
      {/* 1. HOD Header */}
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
                <span className="rounded-md bg-purple-700 px-2 py-0.5 text-[11px] font-bold text-white">
                  HEAD OF DEPARTMENT
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Department of Artificial Intelligence & Data Science • KIT Autonomous System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('reports')}
              className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Department Audit Reports</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Department Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-hod-students"
          title="Total Students"
          value="240"
          subtitle="Across Years II, III & IV"
          icon={Users}
          accentColor="red"
          onClick={() => onNavigate('students')}
        />

        <StatCard
          id="stat-hod-faculty"
          title="Department Faculty"
          value="16 Members"
          subtitle="9 Ph.D Holders"
          icon={GraduationCap}
          accentColor="blue"
          onClick={() => onNavigate('faculty')}
        />

        <StatCard
          id="stat-hod-dept-att"
          title="Department Attendance"
          value="86.8%"
          subtitle="Target >= 85%"
          icon={UserCheck}
          trend={{ value: '1.4%', isPositive: true }}
          accentColor="green"
        />

        <StatCard
          id="stat-hod-risk"
          title="At-Risk Interventions"
          value="14 Students"
          subtitle="Flagged by AI Predictive Model"
          icon={AlertTriangle}
          accentColor="amber"
          onClick={() => onNavigate('students')}
        />
      </div>

      {/* 3. AI Department-Wide Risk Matrix Alert */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-900">DEPARTMENT AI GOVERNANCE ADVISORY</p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                <strong>Year III Section B</strong> has a <strong>4.3% lower average in Database Systems (AD3302)</strong> compared to Section A. 3 students are at severe condonation risk (&lt;75% attendance). Special tutorial hours allocated for Saturdays.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('students')}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-[#B71C1C] border border-red-200 shadow-2xs hover:bg-red-50 shrink-0"
          >
            <span>Audit Section B</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Section Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Section-Wise Performance Comparison</h2>
              <p className="text-xs text-gray-500">Attendance % vs Assessment Pass Rates</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              Odd Sem 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionVarianceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="section" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="attendance" name="Attendance %" fill="#B71C1C" radius={[4, 4, 0, 0]} />
                <Bar dataKey="passRate" name="Pass Rate %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick HOD Actions */}
        <div className="lg:col-span-4 rounded-xl border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-3">
              Department Management
            </h2>
            <div className="space-y-2.5">
              <button
                onClick={() => onNavigate('students')}
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-red-50 hover:border-red-200 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-gray-900">Student Attendance Audits</p>
                  <p className="text-[10px] text-gray-500">14 Students with attendance &lt; 75%</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => onNavigate('faculty')}
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-red-50 hover:border-red-200 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-gray-900">Faculty Workload Matrix</p>
                  <p className="text-[10px] text-gray-500">Review 16 faculty teaching hours</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => onNavigate('reports')}
                className="w-full p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-red-50 hover:border-red-200 text-left transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-gray-900">NAAC / NBA Accreditation Export</p>
                  <p className="text-[10px] text-gray-500">Criteria 2 & 3 Course Outcome files</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
