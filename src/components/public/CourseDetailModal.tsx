import React from 'react';
import { X, BookOpen, Clock, MapPin, User, CheckCircle2, Award, Calendar, FileText } from 'lucide-react';
import { Course } from '../../types';

interface CourseDetailModalProps {
  course: Course | null;
  onClose: () => void;
  onEnrollOrLogin: (course: Course) => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({
  course,
  onClose,
  onEnrollOrLogin,
}) => {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {/* Header with Red Accent */}
        <div className="relative border-b border-gray-200 bg-gradient-to-r from-red-50 to-white p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-white/80"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="rounded bg-[#B71C1C] px-2.5 py-0.5 text-xs font-bold text-white tracking-wide">
              {course.code}
            </span>
            <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-semibold text-[#B71C1C]">
              {course.departmentName}
            </span>
            <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
              Semester {course.semester}
            </span>
            <span className="rounded bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
              {course.credits} Credits • {course.type}
            </span>
          </div>

          <h2 className="text-xl font-black text-gray-900 leading-tight">{course.name}</h2>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed max-w-2xl">{course.description}</p>
        </div>

        {/* Course Info Cards */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50/70">
              <div className="p-2 rounded-lg bg-red-50 text-[#B71C1C]">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Course Faculty</p>
                <p className="text-xs font-bold text-gray-900">{course.facultyName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50/70">
              <div className="p-2 rounded-lg bg-red-50 text-[#B71C1C]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Schedule</p>
                <p className="text-xs font-bold text-gray-900">{course.schedule}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50/70">
              <div className="p-2 rounded-lg bg-red-50 text-[#B71C1C]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">Classroom Venue</p>
                <p className="text-xs font-bold text-gray-900">{course.room}</p>
              </div>
            </div>
          </div>

          {/* Detailed Syllabus */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
              <BookOpen className="w-4 h-4 text-[#B71C1C]" />
              Official Curriculum Units & Syllabus
            </h3>
            <div className="space-y-2">
              {(course.syllabus || []).map((unit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-50 text-[11px] font-bold text-[#B71C1C] shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{unit}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Academic Assessment Weightage */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-3">
              <Award className="w-4 h-4 text-[#B71C1C]" />
              Grading & Evaluation Scheme
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                <p className="text-lg font-black text-[#B71C1C]">20%</p>
                <p className="text-[11px] font-semibold text-gray-600">Internal Assessment 1</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                <p className="text-lg font-black text-[#B71C1C]">20%</p>
                <p className="text-[11px] font-semibold text-gray-600">Internal Assessment 2</p>
              </div>
              <div className="p-3 rounded-lg border border-gray-100 bg-gray-50">
                <p className="text-lg font-black text-[#B71C1C]">10%</p>
                <p className="text-[11px] font-semibold text-gray-600">Assignments & Mini Projects</p>
              </div>
              <div className="p-3 rounded-lg border border-red-200 bg-red-50/50">
                <p className="text-lg font-black text-[#B71C1C]">50%</p>
                <p className="text-[11px] font-bold text-[#B71C1C]">Semester Final Exam</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 p-4 bg-gray-50">
          <p className="text-xs text-gray-500">
            Enrolled: <span className="font-bold text-gray-900">{course.enrolledStudentsCount} Students</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-200"
            >
              Close
            </button>
            <button
              onClick={() => onEnrollOrLogin(course)}
              className="rounded-lg bg-[#B71C1C] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-all"
            >
              Access in Student Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
