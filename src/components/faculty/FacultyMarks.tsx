import React, { useState } from 'react';
import { Award, Save, Download, Check, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { EXAM_MARKS, USERS } from '../../data/mockData';
import { api } from '../../services/api';

export const FacultyMarks: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState('AD3302');
  const [marksState, setMarksState] = useState(
    USERS.filter((u) => u.role === 'student').map((s, idx) => ({
      studentId: s.id,
      name: s.name,
      regNo: s.registerNumber || `71152220502${idx + 1}`,
      ia1: 38 + (idx % 8),
      ia2: 32 + (idx % 12),
      model: 74 + (idx % 18),
    }))
  );

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleMarkChange = (studentId: string, field: 'ia1' | 'ia2' | 'model', val: number) => {
    setMarksState((prev) =>
      prev.map((item) => (item.studentId === studentId ? { ...item, [field]: val } : item))
    );
  };

  // Calculate live summary stats
  const totalStudents = marksState.length;
  const avgIa1 = (marksState.reduce((a, b) => a + Number(b.ia1), 0) / totalStudents).toFixed(1);
  const avgIa2 = (marksState.reduce((a, b) => a + Number(b.ia2), 0) / totalStudents).toFixed(1);
  const avgModel = (marksState.reduce((a, b) => a + Number(b.model), 0) / totalStudents).toFixed(1);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      for (const row of marksState) {
        await api.updateMarks({
          studentId: row.studentId,
          courseId: selectedCourse,
          ia1: row.ia1,
          ia2: row.ia2,
          model: row.model,
        });
      }
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      setIsSaving(false);
    }
  };

  return (
    <div id="faculty-marks-view" className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            Continuous Internal Assessment (CIA) Register
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Internal Marks Entry Spreadsheet</h1>
          <p className="text-xs text-gray-500 mt-1">
            Input Internal Assessment 1 (50), IA 2 (50), and Model Exam (100) scores for automated COE submission.
          </p>
        </div>

        {/* Aggregate Stats Cards */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-center min-w-[85px]">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Avg IA-1</p>
            <p className="text-lg font-black text-gray-900">{avgIa1}/50</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-center min-w-[85px]">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Avg IA-2</p>
            <p className="text-lg font-black text-[#B71C1C]">{avgIa2}/50</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-2.5 text-center min-w-[85px]">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Avg Model</p>
            <p className="text-lg font-black text-emerald-700">{avgModel}/100</p>
          </div>
        </div>
      </div>

      {/* Select Course & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-700">Select Subject:</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="py-1.5 px-3 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:outline-hidden"
          >
            <option value="AD3302">AD3302 - Database Management Systems (Section A)</option>
            <option value="CS3301">CS3301 - Data Structures & Algorithms (Section A)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4" /> Marks Submitted to COE!
            </span>
          )}

          <button
            id="btn-save-marks"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Submitting...' : 'Save & Submit Marks'}</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">Register No.</th>
              <th className="px-5 py-3">Student Name</th>
              <th className="px-4 py-3 text-center">IA-1 (Max 50)</th>
              <th className="px-4 py-3 text-center">IA-2 (Max 50)</th>
              <th className="px-4 py-3 text-center">Model Exam (Max 100)</th>
              <th className="px-4 py-3 text-center">Internal Wtg (20%)</th>
              <th className="px-5 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {marksState.map((row) => {
              // Internal weightage formula: (IA1 + IA2)/2 * 0.2
              const internalWeighted = Math.round(((Number(row.ia1) + Number(row.ia2)) / 2) * 0.2);
              const isLow = row.ia2 < 30;

              return (
                <tr key={row.studentId} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-gray-900">{row.regNo}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{row.name}</td>
                  <td className="px-4 py-3.5 text-center">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={row.ia1}
                      onChange={(e) => handleMarkChange(row.studentId, 'ia1', Number(e.target.value))}
                      className="w-16 text-center py-1 rounded border border-gray-200 bg-gray-50 font-bold focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                    />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={row.ia2}
                      onChange={(e) => handleMarkChange(row.studentId, 'ia2', Number(e.target.value))}
                      className={`w-16 text-center py-1 rounded border font-bold focus:bg-white focus:outline-hidden ${
                        isLow
                          ? 'border-red-300 bg-red-50 text-[#B71C1C]'
                          : 'border-gray-200 bg-gray-50 focus:border-[#B71C1C]'
                      }`}
                    />
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={row.model}
                      onChange={(e) => handleMarkChange(row.studentId, 'model', Number(e.target.value))}
                      className="w-20 text-center py-1 rounded border border-gray-200 bg-gray-50 font-bold focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                    />
                  </td>
                  <td className="px-4 py-3.5 text-center font-black text-gray-900">
                    {internalWeighted} / 10
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    {isLow ? (
                      <span className="text-[10px] font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        Remedial Needed
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
