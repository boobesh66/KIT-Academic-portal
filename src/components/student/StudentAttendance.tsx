import React, { useState } from 'react';
import {
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  X,
  FileText,
  Filter
} from 'lucide-react';
import { StudentAttendanceSummary, AttendanceRecord } from '../../types';

interface StudentAttendanceProps {
  summary: StudentAttendanceSummary[];
  records: AttendanceRecord[];
}

export const StudentAttendance: React.FC<StudentAttendanceProps> = ({ summary, records }) => {
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState('OnDuty');
  const [leaveDate, setLeaveDate] = useState('2026-03-25');
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveSuccess, setLeaveSuccess] = useState(false);

  // Overall attendance calculations
  const totalAttended = summary.reduce((acc, curr) => acc + curr.present, 0);
  const totalHeld = summary.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = totalHeld > 0 ? ((totalAttended / totalHeld) * 100).toFixed(1) : '87.2';

  const filteredRecords = records.filter((r) => {
    const matchSubject = filterSubject === 'all' || r.courseCode === filterSubject;
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    return matchSubject && matchStatus;
  });

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    setLeaveSuccess(true);
    setTimeout(() => {
      setLeaveSuccess(false);
      setShowLeaveModal(false);
      setLeaveReason('');
    }, 1500);
  };

  return (
    <div id="student-attendance-view" className="space-y-6">
      {/* Header & Overall Metric Card */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            Semester V Attendance Record
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Attendance & Eligibility Tracker</h1>
          <p className="text-xs text-gray-500 mt-1">
            Anna University regulation mandates minimum <strong className="text-gray-900">75% attendance</strong> in every subject to write semester final examinations.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Cumulative Aggregate</p>
            <p className="text-3xl font-black text-[#B71C1C]">{overallPercentage}%</p>
            <p className="text-[11px] font-semibold text-emerald-600">
              {totalAttended} / {totalHeld} Hours Attended
            </p>
          </div>

          <button
            onClick={() => setShowLeaveModal(true)}
            className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-4 py-3 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Leave / OD</span>
          </button>
        </div>
      </div>

      {/* Subject-Wise Summary Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50/70 px-5 py-3.5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Subject-Wise Breakdown</h2>
          <span className="text-xs text-gray-500">6 Registered Courses</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Course Code & Name</th>
                <th className="px-4 py-3 text-center">Attended / Total</th>
                <th className="px-4 py-3 text-center">Percentage</th>
                <th className="px-4 py-3">Progress Bar</th>
                <th className="px-4 py-3 text-center">Exam Eligibility</th>
                <th className="px-5 py-3 text-right">Classes to 75%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {summary.map((sub) => {
                const isCritical = sub.percentage < 75;
                const isWarning = sub.percentage >= 75 && sub.percentage < 80;

                // calculate classes needed to reach 75% if below
                // (P + x) / (T + x) >= 0.75 => x >= 3T - 4P
                const classesNeeded = isCritical ? Math.max(0, 3 * sub.total - 4 * sub.present) : 0;

                return (
                  <tr key={sub.courseId} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-[#B71C1C]">{sub.courseCode}</span>
                        <span className="text-gray-900 font-semibold">{sub.courseName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center font-semibold">
                      {sub.present} / {sub.total}
                    </td>
                    <td className="px-4 py-3.5 text-center font-bold">
                      <span
                        className={
                          isCritical
                            ? 'text-red-600'
                            : isWarning
                            ? 'text-amber-600'
                            : 'text-emerald-700'
                        }
                      >
                        {sub.percentage}%
                      </span>
                    </td>
                    <td className="px-4 py-3.5 min-w-[140px]">
                      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCritical
                              ? 'bg-red-500'
                              : isWarning
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                          isCritical
                            ? 'bg-red-100 text-red-800'
                            : isWarning
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isCritical ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            Condonation Risk
                          </>
                        ) : isWarning ? (
                          <>
                            <AlertTriangle className="w-3 h-3" />
                            Borderline
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Eligible
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold">
                      {isCritical ? (
                        <span className="text-red-600 font-bold">Must attend {classesNeeded} hrs</span>
                      ) : (
                        <span className="text-gray-400">Safe ({sub.present - Math.ceil(0.75 * sub.total)} margin)</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Attendance History with Filters */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-xs p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Period-Wise Attendance History</h2>
            <p className="text-xs text-gray-500">Live timestamped biometric & faculty records</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-700 focus:outline-hidden"
            >
              <option value="all">All Subjects</option>
              {summary.map((s) => (
                <option key={s.courseCode} value={s.courseCode}>
                  {s.courseCode}
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="py-1.5 px-3 text-xs rounded-lg border border-gray-200 bg-gray-50 text-gray-700 focus:outline-hidden"
            >
              <option value="all">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="OnDuty">On Duty (OD)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-white border border-gray-200 text-center shrink-0">
                  <p className="text-[10px] font-bold text-gray-400">PERIOD</p>
                  <p className="text-xs font-black text-gray-900">{rec.period}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#B71C1C]">{rec.courseCode}</span>
                    <span className="text-xs font-bold text-gray-900">{rec.courseName}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 flex items-center gap-2 mt-0.5">
                    <span>{rec.date}</span>
                    <span>•</span>
                    <span>Faculty: {rec.facultyName}</span>
                  </p>
                </div>
              </div>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  rec.status === 'Present'
                    ? 'bg-emerald-100 text-emerald-800'
                    : rec.status === 'Absent'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {rec.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Apply Leave / OD Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Apply for Leave / On-Duty (OD)</h3>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {leaveSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-900">Application Submitted Successfully</p>
                <p className="text-xs text-gray-500 mt-1">
                  Forwarded to Class Advisor & HOD for electronic approval.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplyLeave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Request Category</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                  >
                    <option value="OnDuty">On Duty (Hackathon / Symposium / Sports)</option>
                    <option value="MedicalLeave">Medical Leave (Doctor Certificate Attached)</option>
                    <option value="PersonalLeave">Casual / Personal Leave</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={leaveDate}
                    onChange={(e) => setLeaveDate(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Detailed Reason</label>
                  <textarea
                    rows={3}
                    required
                    value={leaveReason}
                    onChange={(e) => setLeaveReason(e.target.value)}
                    placeholder="Enter reason (e.g. Attending Smart India Hackathon zonal round at PSG Tech)..."
                    className="w-full p-2.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowLeaveModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold text-white bg-[#B71C1C] hover:bg-[#D32F2F] rounded-lg shadow-xs"
                  >
                    Submit for Approval
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
