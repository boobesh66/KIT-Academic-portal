import React, { useState } from 'react';
import {
  BrainCircuit,
  Award,
  TrendingUp,
  Star,
  Users,
  Building2,
  Sparkles,
  Download,
  CheckCircle2,
  FileText,
  AlertCircle,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { TEACHER_FEEDBACKS, DEMO_AI_FEEDBACK_ANALYSIS, USERS, COURSES } from '../../data/mockData';

export const HodFeedbackAnalytics: React.FC = () => {
  const facultyList = USERS.filter((u) => u.role === 'faculty');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(facultyList[0]?.id || 'fac-001');

  const facultyData = [
    { name: 'Dr. S. Ramanathan', course: 'AD3302 DBMS', rating: 4.62, submissions: 48, clarity: 4.8, lab: 4.5 },
    { name: 'Prof. Anitha K', course: 'CS3401 Networks', rating: 4.45, submissions: 44, clarity: 4.6, lab: 4.3 },
    { name: 'Dr. Rajesh Kumar', course: 'AD3501 Deep Learning', rating: 4.58, submissions: 46, clarity: 4.7, lab: 4.6 },
    { name: 'Dr. Priya S', course: 'MA3354 Discrete Maths', rating: 4.38, submissions: 42, clarity: 4.4, lab: 4.1 },
  ];

  return (
    <div id="hod-feedback-analytics-view" className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
              Department Academic Quality Assurance & BoS
            </span>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#B71C1C]">
              HOD Oversight
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Department Faculty Feedback & AI Audit</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            Department-wide analytics on student satisfaction indices, OBE curriculum pacing, and AI-recommended faculty development programs.
          </p>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50/60 p-3 text-center min-w-[130px]">
          <p className="text-[10px] font-bold text-[#B71C1C] uppercase">Dept Satisfaction</p>
          <p className="text-2xl font-black text-[#B71C1C]">4.51 / 5.0</p>
          <p className="text-[10px] text-gray-500">180 Total Responses</p>
        </div>
      </div>

      {/* Faculty Comparison Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {facultyData.map((f, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs hover:border-[#B71C1C] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-[#B71C1C]">
                {f.course.split(' ')[0]}
              </span>
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-xs font-black text-gray-900">{f.rating}</span>
              </div>
            </div>
            <h3 className="text-xs font-bold text-gray-900 mt-2">{f.name}</h3>
            <p className="text-[11px] text-gray-500">{f.course}</p>

            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-600">
              <span>{f.submissions} Reviews</span>
              <span className="font-semibold text-emerald-700">Clarity {f.clarity}/5</span>
            </div>
          </div>
        ))}
      </div>

      {/* Faculty Rating Comparison Bar Chart */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
          <h2 className="text-xs font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#B71C1C]" />
            Faculty Overall Rating Index vs Subject Benchmark
          </h2>
          <span className="text-[11px] font-semibold text-gray-500">Department Average: 4.51</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={facultyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
              <Tooltip
                formatter={(value: any) => [`${value} / 5.0`, 'Overall Score']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
              />
              <Bar dataKey="rating" fill="#B71C1C" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Departmental Quality Recommendations */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50/60 to-white p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-red-100">
          <BrainCircuit className="w-5 h-5 text-[#B71C1C]" />
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              AI Academic Quality Audit & Board of Studies (BoS) Directive
            </h2>
            <p className="text-[11px] text-gray-500">
              Synthesis of 180 department-wide student feedbacks and continuous assessment marks
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
            <span className="font-bold text-[#B71C1C] uppercase text-[10px]">1. Laboratory Hands-On Ratio</span>
            <h4 className="font-bold text-gray-900">Enhance SQL & Network Packet Tracing</h4>
            <p className="text-gray-600 leading-relaxed">
              Student feedback indicates a request for more compiler optimization and live database indexing profiling during lab hours.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
            <span className="font-bold text-[#B71C1C] uppercase text-[10px]">2. Unit 3 Revision Workshops</span>
            <h4 className="font-bold text-gray-900">Pre-Exam Problem-Solving Tutorials</h4>
            <p className="text-gray-600 leading-relaxed">
              Organize 2-hour remedial sessions on BCNF decomposition and AVL rotations prior to Internal Assessment 2.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-2">
            <span className="font-bold text-[#B71C1C] uppercase text-[10px]">3. Continuous Assessment Rubrics</span>
            <h4 className="font-bold text-gray-900">Transparent Model Answer Keys</h4>
            <p className="text-gray-600 leading-relaxed">
              Ensure all faculty publish answer keys within 48 hours of test evaluation to maintain high student confidence.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
