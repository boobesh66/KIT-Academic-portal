import React, { useState } from 'react';
import { Award, Download, TrendingUp, CheckCircle2, AlertTriangle, FileSpreadsheet } from 'lucide-react';
import { ExamMark, User } from '../../types';
import { STUDENT_SEMESTER_HISTORY } from '../../data/mockData';

interface StudentResultsProps {
  marks: ExamMark[];
  user: User;
}

export const StudentResults: React.FC<StudentResultsProps> = ({ marks, user }) => {
  const [selectedSemester, setSelectedSemester] = useState<number>(5);

  const calculateTotalCredits = () => 23; // Sem 5 credits
  const currentSGPA = 7.85;

  return (
    <div id="student-results-view" className="space-y-6">
      {/* Header with SGPA / CGPA Badges */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            Grade & Marks Statement
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Academic Results & SGPA</h1>
          <p className="text-xs text-gray-500 mt-1">
            Provisional Grade Sheet • Regulation 2021/2024 Autonomous System.
          </p>
        </div>

        {/* GPA Summary Highlights */}
        <div className="flex items-center gap-4">
          <div className="rounded-xl border border-red-200 bg-red-50/60 p-3.5 text-center min-w-[110px]">
            <p className="text-[10px] font-bold text-[#B71C1C] uppercase">Sem 5 SGPA</p>
            <p className="text-2xl font-black text-[#B71C1C]">{currentSGPA.toFixed(2)}</p>
            <p className="text-[10px] text-gray-500 font-semibold">First Class</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-center min-w-[110px]">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Overall CGPA</p>
            <p className="text-2xl font-black text-gray-900">{user.cgpa?.toFixed(2) || '8.21'}</p>
            <p className="text-[10px] text-gray-500 font-semibold">0 Standing Arrears</p>
          </div>

          <button
            onClick={() => alert(`Official Provisional Marksheet for Semester ${selectedSemester} downloaded.`)}
            className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-4 py-3.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download Marksheet</span>
          </button>
        </div>
      </div>

      {/* Semester Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {[1, 2, 3, 4, 5].map((sem) => (
          <button
            key={sem}
            onClick={() => setSelectedSemester(sem)}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition-all ${
              selectedSemester === sem
                ? 'bg-[#B71C1C] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            Semester {sem} {sem === 5 && '(Current)'}
          </button>
        ))}
      </div>

      {/* Marksheet Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/70 px-5 py-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Course Assessment Scorecard</h2>
          <span className="text-xs text-gray-500">Grading scale: O (10), A+ (9), A (8), B+ (7), B (6), RA (0)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Course Code & Title</th>
                <th className="px-3 py-3 text-center">IA-1 (50)</th>
                <th className="px-3 py-3 text-center">IA-2 (50)</th>
                <th className="px-3 py-3 text-center">Model (100)</th>
                <th className="px-3 py-3 text-center">End-Sem (100)</th>
                <th className="px-3 py-3 text-center">Total (100)</th>
                <th className="px-3 py-3 text-center">Grade</th>
                <th className="px-5 py-3 text-center">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {marks.map((m) => {
                const isWarning = m.grade === 'B' || m.totalMarks < 75;

                return (
                  <tr key={m.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="font-mono font-bold text-[#B71C1C] mr-2">{m.courseCode}</span>
                        <span className="text-gray-900 font-semibold">{m.courseName}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3.5 text-center font-semibold">{m.internalAssessment1}</td>
                    <td className="px-3 py-3.5 text-center font-semibold">
                      <span className={m.internalAssessment2 < 35 ? 'text-[#B71C1C] font-bold' : ''}>
                        {m.internalAssessment2}
                      </span>
                    </td>
                    <td className="px-3 py-3.5 text-center font-semibold">{m.modelExam}</td>
                    <td className="px-3 py-3.5 text-center font-semibold">{m.externalMarks || '—'}</td>
                    <td className="px-3 py-3.5 text-center font-black text-gray-900">{m.totalMarks}</td>
                    <td className="px-3 py-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded font-black text-xs ${
                          m.grade === 'O'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.grade === 'A+'
                            ? 'bg-blue-100 text-blue-800'
                            : m.grade === 'A'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {m.grade}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        PASS
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grade Scale Reference Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-xs text-gray-600">
        <p className="font-bold text-gray-800 mb-2">Anna University Autonomous Grade Point Conversion</p>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-center text-[11px]">
          <div className="p-2 rounded bg-white border border-gray-200">
            <span className="font-bold text-emerald-700">O (91 - 100)</span>
            <p className="text-gray-400">10 Points</p>
          </div>
          <div className="p-2 rounded bg-white border border-gray-200">
            <span className="font-bold text-blue-700">A+ (81 - 90)</span>
            <p className="text-gray-400">9 Points</p>
          </div>
          <div className="p-2 rounded bg-white border border-gray-200">
            <span className="font-bold text-purple-700">A (71 - 80)</span>
            <p className="text-gray-400">8 Points</p>
          </div>
          <div className="p-2 rounded bg-white border border-gray-200">
            <span className="font-bold text-amber-700">B+ (61 - 70)</span>
            <p className="text-gray-400">7 Points</p>
          </div>
          <div className="p-2 rounded bg-white border border-gray-200">
            <span className="font-bold text-orange-700">B (50 - 60)</span>
            <p className="text-gray-400">6 Points</p>
          </div>
          <div className="p-2 rounded bg-white border border-gray-200">
            <span className="font-bold text-red-700">RA (&lt; 50)</span>
            <p className="text-gray-400">Re-appear</p>
          </div>
        </div>
      </div>
    </div>
  );
};
