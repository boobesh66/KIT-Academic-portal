import React, { useState } from 'react';
import { Users, Search, Filter, AlertTriangle, CheckCircle2, User, Sparkles, Mail, Phone, X, Award } from 'lucide-react';
import { USERS, STUDENT_ATTENDANCE_SUMMARY } from '../../data/mockData';
import { User as UserType } from '../../types';

export const FacultyStudents: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | 'Low' | 'Medium' | 'High'>('all');
  const [selectedStudent, setSelectedStudent] = useState<UserType | null>(null);
  const [remedialNoteSent, setRemedialNoteSent] = useState(false);

  const students = USERS.filter((u) => u.role === 'student').map((s, idx) => ({
    ...s,
    attendance: idx === 0 ? 77.5 : idx === 3 ? 68.0 : 88.0 + (idx % 8),
    riskLevel: idx === 3 ? 'High' : idx === 0 ? 'Medium' : 'Low',
    ia1Marks: 38 + (idx % 10),
    ia2Marks: idx === 0 ? 32 : idx === 3 ? 24 : 44,
  }));

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.registerNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRisk = riskFilter === 'all' || s.riskLevel === riskFilter;
    return matchSearch && matchRisk;
  });

  return (
    <div id="faculty-students-view" className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            Class Roster • AI & Data Science
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Student Performance & Risk Roster</h1>
          <p className="text-xs text-gray-500 mt-1">
            Section A • 64 Enrolled Students • Multi-variate Academic Diagnostic Matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 text-[#B71C1C] border border-red-200">
            {students.filter((s) => s.riskLevel === 'High' || s.riskLevel === 'Medium').length} Attention Required
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student by name or register number..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Risk Filter:</span>
          {(['all', 'High', 'Medium', 'Low'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setRiskFilter(lvl)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg capitalize transition-all ${
                riskFilter === lvl
                  ? 'bg-[#B71C1C] text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lvl === 'all' ? 'All (64)' : `${lvl} Risk`}
            </button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">Student Name & Reg No.</th>
              <th className="px-4 py-3 text-center">DBMS Attendance</th>
              <th className="px-4 py-3 text-center">IA-1 / IA-2</th>
              <th className="px-4 py-3 text-center">Standing CGPA</th>
              <th className="px-4 py-3 text-center">AI Risk Level</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50/70 transition-colors">
                <td className="px-5 py-3.5">
                  <p className="font-bold text-gray-900">{s.name}</p>
                  <p className="font-mono text-[11px] text-gray-400">{s.registerNumber}</p>
                </td>
                <td className="px-4 py-3.5 text-center font-bold">
                  <span
                    className={
                      s.attendance < 75
                        ? 'text-red-600 font-black'
                        : s.attendance < 80
                        ? 'text-amber-600'
                        : 'text-emerald-700'
                    }
                  >
                    {s.attendance.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span className="font-semibold text-gray-800">{s.ia1Marks}</span> /{' '}
                  <span className={s.ia2Marks < 30 ? 'text-[#B71C1C] font-bold' : 'text-gray-800'}>
                    {s.ia2Marks}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-center font-bold text-gray-900">
                  {s.cgpa?.toFixed(2) || '7.85'}
                </td>
                <td className="px-4 py-3.5 text-center">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      s.riskLevel === 'High'
                        ? 'bg-red-100 text-red-800'
                        : s.riskLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {s.riskLevel === 'High' && <AlertTriangle className="w-3 h-3" />}
                    {s.riskLevel} Risk
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <button
                    onClick={() => setSelectedStudent(s)}
                    className="px-3 py-1.5 bg-red-50 text-[#B71C1C] hover:bg-red-100 font-bold rounded-lg text-xs transition-colors"
                  >
                    View Drilldown
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Student Drilldown Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#B71C1C] text-white font-bold">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-xs text-gray-500 font-mono">{selectedStudent.registerNumber}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedStudent(null);
                  setRemedialNoteSent(false);
                }}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Attendance</p>
                  <p className="text-base font-bold text-gray-900 mt-0.5">77.5%</p>
                </div>
                <div className="p-2.5 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">CGPA</p>
                  <p className="text-base font-bold text-gray-900 mt-0.5">{selectedStudent.cgpa?.toFixed(2)}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-[10px] font-bold text-amber-800 uppercase">Risk Level</p>
                  <p className="text-base font-bold text-amber-900 mt-0.5">Medium</p>
                </div>
              </div>

              {/* AI Diagnostic Notes */}
              <div className="p-3 rounded-xl border border-red-100 bg-red-50/40">
                <p className="font-bold text-[#B71C1C] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Academic Diagnosis:
                </p>
                <p className="text-gray-700 mt-1 leading-relaxed">
                  Student scored 32/50 in IA-2 due to conceptual errors in <em>BCNF Normalization and Multivalued Dependencies</em>. Attendance has dropped 3% in past 2 weeks.
                </p>
              </div>

              {/* Send Remedial Action */}
              <div className="pt-3 border-t border-gray-100">
                {remedialNoteSent ? (
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 font-bold rounded-lg text-center flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Remedial Notification Sent to Student & Parent Portal!
                  </div>
                ) : (
                  <button
                    onClick={() => setRemedialNoteSent(true)}
                    className="w-full py-2.5 bg-[#B71C1C] hover:bg-[#D32F2F] text-white font-bold rounded-xl shadow-xs transition-colors"
                  >
                    Send Remedial Study Material & Attendance Alert
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
