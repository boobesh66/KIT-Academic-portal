import React, { useState } from 'react';
import { UserCheck, CheckCircle2, XCircle, Clock, Save, Calendar, Check, Users } from 'lucide-react';
import { USERS } from '../../data/mockData';
import { api } from '../../services/api';

export const FacultyAttendance: React.FC = () => {
  const students = USERS.filter((u) => u.role === 'student');

  const [selectedCourse, setSelectedCourse] = useState('AD3302');
  const [selectedDate, setSelectedDate] = useState('2026-03-24');
  const [selectedPeriod, setSelectedPeriod] = useState(2);
  const [attendanceMap, setAttendanceMap] = useState<Record<string, 'Present' | 'Absent' | 'OnDuty'>>({
    'stu-001': 'Present',
    'stu-002': 'Present',
    'stu-003': 'Present',
    'stu-004': 'Absent',
    'stu-005': 'Present',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleToggle = (studentId: string, status: 'Present' | 'Absent' | 'OnDuty') => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const handleMarkAll = (status: 'Present' | 'Absent') => {
    const updated: Record<string, 'Present' | 'Absent' | 'OnDuty'> = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  const totalStudents = students.length;
  const presentCount = Object.values(attendanceMap).filter((s) => s === 'Present').length;
  const absentCount = Object.values(attendanceMap).filter((s) => s === 'Absent').length;
  const onDutyCount = Object.values(attendanceMap).filter((s) => s === 'OnDuty').length;
  const percentage = totalStudents > 0 ? ((presentCount / totalStudents) * 100).toFixed(1) : '100';

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    const entries = students.map((s) => ({
      studentId: s.id,
      status: attendanceMap[s.id] || 'Present',
    }));

    try {
      await api.markAttendance({
        courseId: selectedCourse,
        date: selectedDate,
        period: selectedPeriod,
        entries,
      });
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (e) {
      setIsSaving(false);
    }
  };

  return (
    <div id="faculty-attendance-view" className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            Daily Biometric & Lecture Register
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Mark Lecture Attendance</h1>
          <p className="text-xs text-gray-500 mt-1">
            Department of AI & DS • Period-wise attendance logging with instant SMS alerts.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-3.5 py-2 text-center">
            <p className="text-[10px] font-bold text-emerald-800 uppercase">Present</p>
            <p className="text-xl font-black text-emerald-700">{presentCount}</p>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50/60 px-3.5 py-2 text-center">
            <p className="text-[10px] font-bold text-red-800 uppercase">Absent</p>
            <p className="text-xl font-black text-[#B71C1C]">{absentCount}</p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-center">
            <p className="text-[10px] font-bold text-gray-500 uppercase">Attendance %</p>
            <p className="text-xl font-black text-gray-900">{percentage}%</p>
          </div>
        </div>
      </div>

      {/* Control Bar: Subject, Date, Period Selectors */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Select Subject</label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:outline-hidden"
            >
              <option value="AD3302">AD3302 - Database Management Systems (Sem V)</option>
              <option value="CS3301">CS3301 - Data Structures & Algorithms (Sem III)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Period Hour</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="w-full p-2 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-800 focus:outline-hidden"
            >
              <option value={1}>Period 1 (09:00 - 10:00 AM)</option>
              <option value={2}>Period 2 (10:00 - 11:00 AM)</option>
              <option value={3}>Period 3 (11:15 - 12:15 PM)</option>
              <option value={4}>Period 4 (12:15 - 01:15 PM)</option>
              <option value={5}>Period 5 (01:45 - 02:45 PM)</option>
              <option value={6}>Period 6 (02:45 - 03:45 PM)</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={() => handleMarkAll('Present')}
              className="flex-1 py-2 text-xs font-bold rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            >
              Mark All Present
            </button>
            <button
              onClick={() => handleMarkAll('Absent')}
              className="py-2 px-3 text-xs font-bold rounded-lg border border-red-200 bg-red-50 text-[#B71C1C] hover:bg-red-100"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Student Attendance Marking Roster Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase text-gray-500">
            <tr>
              <th className="px-5 py-3">Register No.</th>
              <th className="px-5 py-3">Student Name</th>
              <th className="px-4 py-3 text-center">Semester CGPA</th>
              <th className="px-5 py-3 text-center">Mark Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {students.map((student) => {
              const currentStatus = attendanceMap[student.id] || 'Present';

              return (
                <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-gray-900">
                    {student.registerNumber || '711522205023'}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-gray-900">{student.name}</p>
                    <p className="text-[10px] text-gray-400">Section A • {student.email}</p>
                  </td>
                  <td className="px-4 py-3.5 text-center font-bold text-[#B71C1C]">
                    {student.cgpa?.toFixed(2) || '7.85'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleToggle(student.id, 'Present')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === 'Present'
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        Present
                      </button>

                      <button
                        onClick={() => handleToggle(student.id, 'Absent')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === 'Absent'
                            ? 'bg-[#B71C1C] text-white shadow-2xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-700'
                        }`}
                      >
                        Absent
                      </button>

                      <button
                        onClick={() => handleToggle(student.id, 'OnDuty')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          currentStatus === 'OnDuty'
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                        }`}
                      >
                        On Duty (OD)
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Save Button Bar */}
      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
        <p className="text-xs text-gray-500">
          Attendance will be submitted to the Central ERP and synced with student portals.
        </p>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
              <Check className="w-4 h-4" /> Attendance Recorded Successfully!
            </span>
          )}

          <button
            id="btn-save-attendance"
            onClick={handleSaveAttendance}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#D32F2F] transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Submitting...' : 'Save & Publish Attendance'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
