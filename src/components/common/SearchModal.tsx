import React, { useState, useEffect, useRef } from 'react';
import { Search, X, BookOpen, User, Calendar, Award, Sparkles, ArrowRight } from 'lucide-react';
import { COURSES, USERS, EXAMINATIONS, ASSIGNMENTS } from '../../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string, detailId?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : undefined;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedCourses = COURSES.filter(
    (c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.facultyName.toLowerCase().includes(q)
  );

  const matchedUsers = USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.registerNumber?.toLowerCase().includes(q) ||
      u.departmentName.toLowerCase().includes(q)
  );

  const matchedExams = EXAMINATIONS.filter(
    (e) => e.name.toLowerCase().includes(q) || e.courseName.toLowerCase().includes(q) || e.courseCode.toLowerCase().includes(q)
  );

  const matchedAssignments = ASSIGNMENTS.filter(
    (a) => a.title.toLowerCase().includes(q) || a.courseName.toLowerCase().includes(q)
  );

  const hasResults =
    q.length > 0 &&
    (matchedCourses.length > 0 || matchedUsers.length > 0 || matchedExams.length > 0 || matchedAssignments.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 sm:pt-24 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-gray-200 px-4 py-3 bg-gray-50/50">
          <Search className="w-5 h-5 text-gray-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses, professors, students, exams, assignments..."
            className="w-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-hidden"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 rounded-lg bg-gray-200/70 px-2 py-1 text-[11px] font-bold text-gray-600 hover:bg-gray-300"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {query.length === 0 ? (
            <div className="py-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-[#B71C1C] mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-700">Quick Global Search</p>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Type course codes like <span className="font-mono text-[#B71C1C]">CS3301</span>, professor names like <span className="font-mono text-[#B71C1C]">Ramanathan</span>, or student register numbers.
              </p>
            </div>
          ) : !hasResults ? (
            <div className="py-8 text-center">
              <p className="text-sm font-medium text-gray-600">No matching academic records found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-gray-400 mt-1">Try searching by department name or subject keyword</p>
            </div>
          ) : (
            <>
              {/* Courses */}
              {matchedCourses.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">Courses & Subjects</p>
                  <div className="space-y-1.5">
                    {matchedCourses.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onNavigate('courses', c.id);
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white hover:border-red-200 hover:bg-red-50/40 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-red-50 text-[#B71C1C]">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{c.name}</p>
                            <p className="text-[11px] text-gray-500">{c.code} • {c.facultyName} • Sem {c.semester}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* People */}
              {matchedUsers.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">Students & Faculty</p>
                  <div className="space-y-1.5">
                    {matchedUsers.map((u) => (
                      <div
                        key={u.id}
                        onClick={() => {
                          onNavigate('profile');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white hover:border-red-200 hover:bg-red-50/40 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-gray-100 text-gray-700">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="text-xs font-bold text-gray-900">{u.name}</p>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-600 font-medium capitalize">
                                {u.role}
                              </span>
                            </div>
                            <p className="text-[11px] text-gray-500">{u.departmentName} {u.registerNumber ? `• Reg: ${u.registerNumber}` : ''}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Examinations */}
              {matchedExams.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">Examinations</p>
                  <div className="space-y-1.5">
                    {matchedExams.map((e) => (
                      <div
                        key={e.id}
                        onClick={() => {
                          onNavigate('examinations');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white hover:border-red-200 hover:bg-red-50/40 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-amber-50 text-amber-700">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{e.name}</p>
                            <p className="text-[11px] text-gray-500">{e.courseName} • {e.date} • {e.venue}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Assignments */}
              {matchedAssignments.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-2">Assignments</p>
                  <div className="space-y-1.5">
                    {matchedAssignments.map((a) => (
                      <div
                        key={a.id}
                        onClick={() => {
                          onNavigate('assignments');
                          onClose();
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-white hover:border-red-200 hover:bg-red-50/40 cursor-pointer transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-md bg-purple-50 text-purple-700">
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900">{a.title}</p>
                            <p className="text-[11px] text-gray-500">{a.courseName} • Due: {new Date(a.deadline).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
