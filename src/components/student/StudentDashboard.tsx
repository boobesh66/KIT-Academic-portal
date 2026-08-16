import React from 'react';
import {
  UserCheck,
  Award,
  ClipboardCheck,
  Clock,
  Sparkles,
  Calendar,
  ArrowRight,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Trophy,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { User, StudentAttendanceSummary, Assignment, Examination, ExamMark } from '../../types';
import { StatCard } from '../common/StatCard';
import { STUDENT_SEMESTER_HISTORY } from '../../data/mockData';

interface StudentDashboardProps {
  user: User;
  attendanceSummary: StudentAttendanceSummary[];
  assignments: Assignment[];
  examinations: Examination[];
  examMarks: ExamMark[];
  onNavigate: (view: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  attendanceSummary,
  assignments,
  examinations,
  examMarks,
  onNavigate,
}) => {
  // Calculate aggregate metrics
  const totalPresent = (attendanceSummary || []).reduce((acc, curr) => acc + curr.present, 0);
  const totalClasses = (attendanceSummary || []).reduce((acc, curr) => acc + curr.total, 0);
  const overallAttendance = totalClasses > 0 ? ((totalPresent / totalClasses) * 100).toFixed(1) : '87.2';

  const pendingAssignmentsCount = 2;
  const upcomingExamsCount = (examinations || []).length;

  // Chart data 1: Multi-semester SGPA progression
  const sgpaChartData = (STUDENT_SEMESTER_HISTORY || []).map((s) => ({
    semester: `Sem ${s.semester}`,
    SGPA: s.sgpa,
    CGPA: s.cgpa,
  }));

  // Chart data 2: Subject-wise attendance
  const attendanceChartData = (attendanceSummary || []).map((s) => ({
    code: s.courseCode,
    name: s.courseName,
    percentage: s.percentage,
    present: s.present,
    total: s.total,
  }));

  // Chart data 3: Marks breakdown
  const marksChartData = (examMarks || []).map((m) => ({
    code: m.courseCode,
    name: m.courseName,
    IA1: m.internalAssessment1,
    IA2: m.internalAssessment2,
    Total: m.totalMarks,
  }));

  return (
    <div id="student-dashboard-view" className="space-y-6">
      {/* 1. Student Identity Header Banner */}
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
                  STUDENT PORTAL
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
                <span className="font-semibold text-gray-900">
                  Reg No: <span className="font-mono text-[#B71C1C]">{user.registerNumber || '711522205023'}</span>
                </span>
                <span>•</span>
                <span>{user.departmentName}</span>
                <span>•</span>
                <span>Year III • Semester {user.semester || 5} • Section {user.section || 'A'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-view-hackathons"
              onClick={() => onNavigate('hackathons')}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:from-amber-700 hover:to-amber-800 transition-colors shrink-0"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-200" />
              <span>Hackathons & Certificates</span>
            </button>

            <button
              id="btn-view-ai-coach"
              onClick={() => onNavigate('ai-coach')}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-purple-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-purple-800 transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Study Coach & Docs</span>
            </button>

            <button
              id="btn-give-feedback"
              onClick={() => onNavigate('feedback')}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-white border border-red-200 px-3.5 py-2 text-xs font-bold text-[#B71C1C] shadow-xs hover:bg-red-50 transition-colors shrink-0"
            >
              <span>Teacher Feedback</span>
            </button>

            <button
              id="btn-view-ai-report"
              onClick={() => onNavigate('ai-insights')}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-[#B71C1C] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0"
            >
              <span>AI Risk & Insights</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          id="stat-attendance"
          title="Overall Attendance"
          value={`${overallAttendance}%`}
          subtitle="Above 75% threshold"
          icon={UserCheck}
          trend={{ value: '1.2%', isPositive: false }}
          accentColor={Number(overallAttendance) >= 80 ? 'green' : 'amber'}
          onClick={() => onNavigate('attendance')}
        />

        <StatCard
          id="stat-cgpa"
          title="Cumulative GPA"
          value={user.cgpa?.toFixed(2) || '7.85'}
          subtitle="Provisional Sem 5"
          icon={Award}
          trend={{ value: '0.89', isPositive: false }}
          accentColor="red"
          onClick={() => onNavigate('results')}
        />

        <StatCard
          id="stat-assignments"
          title="Pending Assignments"
          value={pendingAssignmentsCount}
          subtitle="Due within 5 days"
          icon={ClipboardCheck}
          accentColor="amber"
          onClick={() => onNavigate('assignments')}
        />

        <StatCard
          id="stat-exams"
          title="Upcoming Exams"
          value={upcomingExamsCount}
          subtitle="Internal Assessment 1"
          icon={Clock}
          accentColor="blue"
          onClick={() => onNavigate('examinations')}
        />
      </div>

      {/* 3. AI Risk Diagnostic Alert Banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-amber-900">AI ACADEMIC ALERT: MEDIUM RISK DETECTED</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900">
                  94.8% Confidence
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Attendance in <strong>DBMS (77.5%)</strong> has decreased and IA-2 marks dropped. Recommended focus: <em>Normalization (BCNF)</em> and attending next 6 consecutive lectures.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('ai-insights')}
            className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-[#B71C1C] border border-red-200 shadow-2xs hover:bg-red-50 shrink-0 transition-colors"
          >
            <span>View Remedial Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart A: Multi-Semester SGPA Progression */}
        <div className="lg:col-span-7 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Academic Progression Trajectory</h2>
              <p className="text-xs text-gray-500">Semester-wise SGPA and CGPA trends</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-red-50 text-[#B71C1C] border border-red-100">
              Target: 8.50
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sgpaChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="semester" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[6.0, 10.0]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <ReferenceLine y={7.5} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Distinction Line (7.5)', position: 'insideTopLeft', fontSize: 10, fill: '#f59e0b' }} />
                <Line type="monotone" dataKey="SGPA" stroke="#B71C1C" strokeWidth={2.5} dot={{ r: 4, fill: '#B71C1C' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="CGPA" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Subject-wise Attendance Breakdown */}
        <div className="lg:col-span-5 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-gray-900">Subject-wise Attendance</h2>
              <p className="text-xs text-gray-500">Current Semester V percentage</p>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
              75% Min. Req
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="code" stroke="#94a3b8" fontSize={10} />
                <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  formatter={(value: any) => [`${value}%`, 'Attendance']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="3 3" label={{ value: '75%', position: 'insideTopRight', fontSize: 10, fill: '#ef4444' }} />
                <Bar dataKey="percentage" fill="#B71C1C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 5. Bottom Two Columns: Today's Schedule + Active Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Today's Classes */}
        <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#B71C1C]" />
              <h2 className="text-sm font-bold text-gray-900">Today&apos;s Lecture Schedule</h2>
            </div>
            <button
              onClick={() => onNavigate('timetable')}
              className="text-xs font-semibold text-[#B71C1C] hover:underline"
            >
              Full Timetable →
            </button>
          </div>

          <div className="space-y-2.5">
            {[
              { time: '09:00 - 10:00 AM', code: 'CS3301', name: 'Data Structures & Algorithms', faculty: 'Dr. S. Ramanathan', room: 'LH-302' },
              { time: '10:00 - 11:00 AM', code: 'AD3302', name: 'Database Management Systems', faculty: 'Dr. S. Ramanathan', room: 'LH-302', alert: true },
              { time: '11:15 - 12:15 PM', code: 'MA3354', name: 'Discrete Mathematics', faculty: 'Dr. S. Ramanathan', room: 'LH-302' },
              { time: '01:45 - 04:00 PM', code: 'AD3351', name: 'Python for Data Science Lab', faculty: 'Prof. Anitha K', room: 'AI Lab 2' },
            ].map((slot, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  slot.alert
                    ? 'border-red-200 bg-red-50/40'
                    : 'border-gray-100 bg-gray-50/50 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-center px-2 py-1 rounded bg-white border border-gray-200 shrink-0">
                    <p className="text-[10px] font-bold text-gray-500">{slot.time.split(' - ')[0]}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-gray-900">{slot.name}</p>
                      <span className="text-[10px] font-mono font-semibold px-1 rounded bg-gray-200 text-gray-700">
                        {slot.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500">{slot.faculty} • {slot.room}</p>
                  </div>
                </div>

                {slot.alert && (
                  <span className="text-[10px] font-bold text-[#B71C1C] bg-red-100 px-2 py-0.5 rounded-full">
                    Attendance Critical
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Active Assignments List */}
        <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-[#B71C1C]" />
              <h2 className="text-sm font-bold text-gray-900">Pending Assignment Deadlines</h2>
            </div>
            <button
              onClick={() => onNavigate('assignments')}
              className="text-xs font-semibold text-[#B71C1C] hover:underline"
            >
              All Assignments →
            </button>
          </div>

          <div className="space-y-2.5">
            {(assignments || []).slice(0, 3).map((asg) => (
              <div
                key={asg.id}
                onClick={() => onNavigate('assignments')}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:border-red-200 hover:bg-red-50/30 cursor-pointer transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#B71C1C] bg-red-50 px-1.5 py-0.5 rounded border border-red-100">
                      {asg.courseCode}
                    </span>
                    <p className="text-xs font-bold text-gray-900 truncate max-w-[240px]">{asg.title}</p>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Deadline: <span className="font-semibold text-gray-700">{new Date(asg.deadline).toLocaleDateString()}</span> • Max: {asg.totalMarks} Marks
                  </p>
                </div>
                <span className="text-xs font-bold text-[#B71C1C] hover:underline">Submit →</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
