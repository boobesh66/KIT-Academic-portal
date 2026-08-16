import React from 'react';
import { Clock, MapPin, Calendar, FileText, CheckCircle2, Download, AlertCircle } from 'lucide-react';
import { Examination, User } from '../../types';

interface StudentExaminationsProps {
  examinations: Examination[];
  user: User;
}

export const StudentExaminations: React.FC<StudentExaminationsProps> = ({ examinations, user }) => {
  return (
    <div id="student-examinations-view" className="space-y-6">
      {/* Header with Hall Ticket Download */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            Office of Controller of Examinations (COE)
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Examination Schedules & Hall Tickets</h1>
          <p className="text-xs text-gray-500 mt-1">
            Official timetable for Internal Assessment 1 (IA-1), Model Exams, and End-Semester Theory/Practical assessments.
          </p>
        </div>

        <button
          onClick={() => alert(`Generated Official Hall Ticket for ${user.name} (${user.registerNumber}). Seating: Exam Hall B-204.`)}
          className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Download Hall Ticket PDF</span>
        </button>
      </div>

      {/* Hall Ticket Summary Preview Card */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-5 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Register Number</p>
            <p className="font-mono font-bold text-gray-900 mt-0.5">{user.registerNumber || '711522205023'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Examination Center</p>
            <p className="font-bold text-gray-900 mt-0.5">KIT Coimbatore (Autonomous)</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Allocated Hall</p>
            <p className="font-bold text-[#B71C1C] mt-0.5">Exam Block B • Hall 204</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase">Seating Desk</p>
            <p className="font-bold text-gray-900 mt-0.5">Row 3 • Desk B-14</p>
          </div>
        </div>
      </div>

      {/* Exam Timetable Cards */}
      <div className="space-y-3">
        {examinations.map((exam) => {
          const isToday = new Date(exam.date).toDateString() === new Date().toDateString();

          return (
            <div
              key={exam.id}
              className={`flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl border transition-all ${
                isToday
                  ? 'border-red-300 bg-red-50/40 shadow-xs'
                  : 'border-gray-200 bg-white hover:border-red-200'
              }`}
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="flex flex-col items-center justify-center h-14 w-14 rounded-xl bg-red-50 border border-red-100 text-center shrink-0">
                  <span className="text-[10px] font-bold text-[#B71C1C] uppercase">
                    {new Date(exam.date).toLocaleString('default', { month: 'short' })}
                  </span>
                  <span className="text-lg font-black text-gray-900 leading-none">
                    {new Date(exam.date).getDate()}
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#B71C1C] px-2 py-0.5 rounded bg-red-50 border border-red-100">
                      {exam.courseCode}
                    </span>
                    <span className="text-sm font-bold text-gray-900">{exam.courseName}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                      {exam.name}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {exam.time} ({exam.duration})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {exam.venue}
                    </span>
                    <span>•</span>
                    <span>Max Marks: {exam.maxMarks}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 sm:mt-0 flex items-center justify-end gap-2">
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Eligibility Verified
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rules Notice */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#B71C1C] shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-gray-800">Anna University Examination Guidelines</p>
          <p className="mt-0.5 leading-relaxed text-gray-500">
            Candidates must enter the examination hall 15 minutes before commencement. Possession of smartwatches, programmable calculators, or mobile devices in the hall is strictly prohibited.
          </p>
        </div>
      </div>
    </div>
  );
};
