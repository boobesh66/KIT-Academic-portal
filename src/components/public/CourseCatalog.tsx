import React, { useState, useMemo } from 'react';
import { Search, Filter, BookOpen, Clock, User, ArrowRight, Sparkles } from 'lucide-react';
import { Course, Department } from '../../types';
import { COURSES, DEPARTMENTS } from '../../data/mockData';
import { CourseDetailModal } from './CourseDetailModal';

interface CourseCatalogProps {
  onNavigateToLogin: () => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({ onNavigateToLogin }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    return COURSES.filter((c) => {
      const matchSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.facultyName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDept = selectedDept === 'all' || c.departmentId === selectedDept;
      const matchSem = selectedSemester === 'all' || c.semester === Number(selectedSemester);
      const matchType = selectedType === 'all' || c.type === selectedType;

      return matchSearch && matchDept && matchSem && matchType;
    });
  }, [searchQuery, selectedDept, selectedSemester, selectedType]);

  return (
    <div id="course-catalog-view" className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header Banner */}
      <div className="rounded-2xl border border-red-100 bg-gradient-to-r from-red-50 via-white to-red-50/40 p-6 sm:p-8 mb-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-[#B71C1C] text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Autonomous Curriculum 2024-2028
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Academic Course & Syllabus Directory
          </h1>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">
            Explore Anna University and KIT autonomous syllabus structures, credit allocations, faculty schedules, and AI-mapped core engineering modules.
          </p>
        </div>
      </div>

      {/* Filters & Search Control */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course title or code (e.g. CS3301)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden text-gray-700"
            >
              <option value="all">All Departments (6)</option>
              {DEPARTMENTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Filter */}
          <div>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden text-gray-700"
            >
              <option value="all">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden text-gray-700"
            >
              <option value="all">All Course Types</option>
              <option value="Theory">Theory Courses</option>
              <option value="Practical">Practical / Labs</option>
              <option value="Integrated">Integrated Theory + Lab</option>
              <option value="Elective">Professional Elective</option>
            </select>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing <strong className="text-gray-900">{filteredCourses.length}</strong> of {COURSES.length} courses
          </span>
          {(searchQuery || selectedDept !== 'all' || selectedSemester !== 'all' || selectedType !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedDept('all');
                setSelectedSemester('all');
                setSelectedType('all');
              }}
              className="text-[#B71C1C] font-semibold hover:underline"
            >
              Reset all filters
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="group flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:border-red-300 hover:shadow-md transition-all"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="rounded bg-red-50 px-2.5 py-1 text-xs font-bold text-[#B71C1C] border border-red-100">
                  {course.code}
                </span>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                  {course.credits} Credits • Sem {course.semester}
                </span>
              </div>

              {/* Title & Desc */}
              <h3 className="text-base font-bold text-gray-900 group-hover:text-[#B71C1C] transition-colors leading-snug">
                {course.name}
              </h3>
              <p className="mt-2 text-xs text-gray-500 line-clamp-3 leading-relaxed">
                {course.description}
              </p>

              {/* Meta */}
              <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{course.facultyName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{course.schedule}</span>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] font-medium text-gray-400">{course.room}</span>
              <button
                onClick={() => setSelectedCourse(course)}
                className="flex items-center gap-1 text-xs font-bold text-[#B71C1C] group-hover:translate-x-0.5 transition-transform"
              >
                View Syllabus & Details
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Detail Modal */}
      <CourseDetailModal
        course={selectedCourse}
        onClose={() => setSelectedCourse(null)}
        onEnrollOrLogin={() => {
          setSelectedCourse(null);
          onNavigateToLogin();
        }}
      />
    </div>
  );
};
