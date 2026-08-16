import React from 'react';
import {
  UserCheck,
  BookOpen,
  ClipboardCheck,
  Users,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Calendar,
  Award,
  CheckCircle2,
  Clock
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { User, FacultyAIClassInsight } from '../../types';
import { StatCard } from '../common/StatCard';
import { DEMO_FACULTY_AI_INSIGHT } from '../../data/mockData';

interface FacultyDashboardProps {
  user: User;
  onNavigate: (view: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ user, onNavigate }) => {
  // Chart data: Section Comparison
  const sectionData = [
    { section: 'Section A (AD3302)', attendance: 86.4, passRate: 91.2, avgIA: 41.5 },
    { section: 'Section B (AD3302)', attendance: 82.1, passRate: 85.0, avgIA: 38.2 },
    { section: 'Section A (CS3301)', attendance: 89.5, passRate: 94.0, avgIA: 44.0 },
  ];

  // Risk breakdown pie
  const riskPieData = [
    { name: 'Low Risk (Safe)', value: 48, color: '#10b981' },
    { name: 'Medium Risk (Warning)', value: 12, color: '#f59e0b' },
    { name: 'High Risk (Critical)', value: 4, color: '#ef4444' },
  ];

  return (
    <div id="faculty-dashboard-view" className="space-y-6">
      {/* 1. Faculty Welcome Banner */}
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
                <span className="rounded-md bg-[#B71C1C] px-2 py-0.5 text-[11px] font-bold text-white">
                  FACULTY PORTAL
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                <span className="font-semibold text-gray-900">{user.designation || 'Associate Professor'}</span>
                <span>•</span>
                <span>{user.departmentName}</span>
                <span>•</span>
                <span>Staff ID: KIT-FAC-1042</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0"
            >
              <UserCheck className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
            <button
              onClick={() => onNavigate('ai-insights')}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-[#B71C1C] hover:bg-red-50 transition-colors shrink-0"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Insights</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-faculty-classes"
          title="Assigned Classes"
          value="2 Courses"
          subtitle="DSA & DBMS (64 Students)"
          icon={BookOpen}
          accentColor="red"
          onClick={() => onNavigate('subjects')}
        />

        <StatCard
          id="stat-faculty-att-avg"
          title="Class Avg Attendance"
          value="86.4%"
          subtitle="Section A (DBMS)"
          icon={UserCheck}
          trend={{ value: '2.1%', isPositive: true }}
          accentColor="green"
          onClick={() => onNavigate('attendance')}
        />

        <StatCard
          id="stat-faculty-pending-grading"
          title="Pending Submissions"
          value="4 Submissions"
          subtitle="DBMS Assignment 2"
          icon={ClipboardCheck}
          accentColor="amber"
          onClick={() => onNavigate('assignments')}
        />

        <StatCard
          id="stat-faculty-at-risk"
          title="At-Risk Students"
          value="4 High Risk"
          subtitle="AI Flagged Attendance/Marks"
          icon={AlertTriangle}
          accentColor="red"
          onClick={() => onNavigate('students')}
        />
      </div>

      {/* 3. AI Teaching Bottleneck Alert */}
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#B71C1C] text-white shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#B71C1C]">AI CLASS DIAGNOSTIC ALERT</p>
              <p className="text-xs text-gray-800 mt-1 leading-relaxed">
                <strong>42% of students</strong> in <em>DBMS Section A</em> struggled with <strong>BCNF Normalization & Lossless Joins</strong> in IA-1. Suggested: Conduct a 1-hour live problem solving lab prior to IA-2.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('ai-insights')}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-[#B71C1C] border border-red-200 shadow-2xs hover:bg-red-50 shrink-0"
          >
            <span>View Remedial Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Charts Section: Section Comparison + Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Class Performance Benchmark</h2>
              <p className="text-xs text-gray-500">Attendance % vs Assessment Pass Rates</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
              Odd Sem 2026
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
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

        <div className="lg:col-span-5 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Student Risk Segmentation</h2>
          <p className="text-xs text-gray-500 mb-4">AI classified academic risk distribution</p>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={riskPieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} labelLine={false}>
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
            {riskPieData.map((item, idx) => (
              <div key={idx} className="p-1.5 rounded-md bg-gray-50 border border-gray-100">
                <span className="font-bold block" style={{ color: item.color }}>
                  {item.value} Students
                </span>
                <span className="text-[10px] text-gray-500">{item.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Today's Lectures & Quick Action Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#B71C1C]" />
              Today&apos;s Teaching Schedule
            </h2>
            <span className="text-xs text-gray-500">3 Hours Scheduled</span>
          </div>

          <div className="space-y-2.5">
            {[
              { time: '09:00 - 10:00 AM', course: 'CS3301', title: 'Data Structures & Algorithms', section: 'AI&DS - A', room: 'LH-302', marked: true },
              { time: '10:00 - 11:00 AM', course: 'AD3302', title: 'Database Management Systems', section: 'AI&DS - A', room: 'LH-302', marked: false },
              { time: '02:45 - 03:45 PM', course: 'AD3302', title: 'Database Management Systems', section: 'AI&DS - B', room: 'LH-304', marked: false },
            ].map((lec, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-900">{lec.time}</span>
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-50 text-[#B71C1C]">
                      {lec.course}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-0.5">{lec.title} • {lec.section} ({lec.room})</p>
                </div>

                {lec.marked ? (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Marked
                  </span>
                ) : (
                  <button
                    onClick={() => onNavigate('attendance')}
                    className="text-xs font-bold text-white bg-[#B71C1C] hover:bg-[#D32F2F] px-3 py-1.5 rounded-lg shadow-2xs"
                  >
                    Mark Now
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick Utilities */}
        <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-gray-900 mb-3 border-b border-gray-100 pb-3">
              Faculty Academic Tools
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('marks')}
                className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-red-300 hover:bg-red-50/30 text-left transition-all"
              >
                <Award className="w-5 h-5 text-[#B71C1C] mb-2" />
                <p className="text-xs font-bold text-gray-900">Enter Internal Marks</p>
                <p className="text-[10px] text-gray-500 mt-0.5">IA-1, IA-2, Model Exams spreadsheet</p>
              </button>

              <button
                onClick={() => onNavigate('assignments')}
                className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-red-300 hover:bg-red-50/30 text-left transition-all"
              >
                <ClipboardCheck className="w-5 h-5 text-[#B71C1C] mb-2" />
                <p className="text-xs font-bold text-gray-900">Grade Submissions</p>
                <p className="text-[10px] text-gray-500 mt-0.5">4 student files waiting for marks</p>
              </button>

              <button
                onClick={() => onNavigate('ai-insights')}
                className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 hover:bg-red-50 text-left transition-all"
              >
                <Sparkles className="w-5 h-5 text-[#B71C1C] mb-2" />
                <p className="text-xs font-bold text-[#B71C1C]">AI Question Generator</p>
                <p className="text-[10px] text-gray-600 mt-0.5">Create Bloom-taxonomy test questions</p>
              </button>

              <button
                onClick={() => onNavigate('students')}
                className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:border-red-300 hover:bg-red-50/30 text-left transition-all"
              >
                <Users className="w-5 h-5 text-[#B71C1C] mb-2" />
                <p className="text-xs font-bold text-gray-900">Class Roster (64)</p>
                <p className="text-[10px] text-gray-500 mt-0.5">View student performance logs</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
