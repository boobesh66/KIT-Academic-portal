import React from 'react';
import { TrendingUp, Award, BookOpen, CheckCircle2, Star, Sparkles } from 'lucide-react';
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { STUDENT_SEMESTER_HISTORY } from '../../data/mockData';

export const StudentProgress: React.FC = () => {
  // Semester GPA Progression
  const gpaData = STUDENT_SEMESTER_HISTORY.map((s) => ({
    sem: `Sem ${s.semester}`,
    SGPA: s.sgpa,
    CGPA: s.cgpa,
  }));

  // Skills / Domain Mastery Radar
  const radarData = [
    { subject: 'Algorithms & DSA', score: 88, fullMark: 100 },
    { subject: 'Database Systems', score: 72, fullMark: 100 },
    { subject: 'Mathematics & Stats', score: 82, fullMark: 100 },
    { subject: 'Python & AI Labs', score: 95, fullMark: 100 },
    { subject: 'Software Engg', score: 86, fullMark: 100 },
    { subject: 'Computer Networks', score: 79, fullMark: 100 },
  ];

  return (
    <div id="student-progress-view" className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            Cumulative Academic Audit
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Multi-Semester Academic Progress</h1>
          <p className="text-xs text-gray-500 mt-1">
            Tracking GPA trajectories, credit milestones, and core engineering competency radar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-center">
            <p className="text-[10px] font-bold text-emerald-800 uppercase">Degree Completion</p>
            <p className="text-xl font-black text-emerald-700">58.2%</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* GPA Trajectory Line Chart */}
        <div className="lg:col-span-7 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-1">SGPA / CGPA Longitudinal Curve</h2>
          <p className="text-xs text-gray-500 mb-4">Historical performance from Semester 1 to 5</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gpaData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="sem" stroke="#94a3b8" fontSize={11} />
                <YAxis domain={[6.0, 10.0]} stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="SGPA" stroke="#B71C1C" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="CGPA" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Competency Mastery Radar */}
        <div className="lg:col-span-5 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <h2 className="text-sm font-bold text-gray-900 mb-1">Competency Mastery Radar</h2>
          <p className="text-xs text-gray-500 mb-4">Relative mastery index across 6 core domains</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" stroke="#64748b" fontSize={10} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={9} />
                <Radar name="Student Proficiency" dataKey="score" stroke="#B71C1C" fill="#B71C1C" fillOpacity={0.4} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '11px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Multi-Semester Table History */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/70 px-5 py-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Official Semester Records</h2>
          <span className="text-xs text-gray-500">All Semesters Cleared with First Class</span>
        </div>

        <table className="w-full text-left text-xs text-gray-700">
          <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">Semester</th>
              <th className="px-4 py-3 text-center">Registered Credits</th>
              <th className="px-4 py-3 text-center">Earned Credits</th>
              <th className="px-4 py-3 text-center">SGPA</th>
              <th className="px-4 py-3 text-center">Cumulative CGPA</th>
              <th className="px-5 py-3 text-right">Standing Arrears</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {STUDENT_SEMESTER_HISTORY.map((item) => (
              <tr key={item.semester} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-5 py-3.5 font-bold text-gray-900">
                  Semester {item.semester}
                </td>
                <td className="px-4 py-3.5 text-center">{item.creditsRegistered}</td>
                <td className="px-4 py-3.5 text-center font-bold text-emerald-700">{item.creditsEarned}</td>
                <td className="px-4 py-3.5 text-center font-black text-[#B71C1C]">{item.sgpa.toFixed(2)}</td>
                <td className="px-4 py-3.5 text-center font-bold text-gray-900">{item.cgpa.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    NIL (All Cleared)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
