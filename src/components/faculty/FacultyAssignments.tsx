import React, { useState } from 'react';
import {
  ClipboardCheck,
  Plus,
  X,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Check,
  Eye,
  Award
} from 'lucide-react';
import { Assignment, AssignmentSubmission } from '../../types';
import { ASSIGNMENTS, SUBMISSIONS, COURSES } from '../../data/mockData';
import { api } from '../../services/api';

export const FacultyAssignments: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS);
  const [submissions, setSubmissions] = useState<AssignmentSubmission[]>(SUBMISSIONS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [evaluatingSub, setEvaluatingSub] = useState<AssignmentSubmission | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [courseId, setCourseId] = useState('course-1');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('2026-04-10');
  const [totalMarks, setTotalMarks] = useState(20);

  // Evaluation states
  const [marksGiven, setMarksGiven] = useState<number>(18);
  const [feedback, setFeedback] = useState('Good work on schema design. Minor syntax error in 3NF query.');
  const [isEvaluating, setIsEvaluating] = useState(false);

  const handleCreateAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    const course = COURSES.find((c) => c.id === courseId) || COURSES[0];
    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      facultyId: 'fac-001',
      facultyName: course.facultyName || 'Dr. S. Ramanathan',
      title,
      description,
      deadline,
      totalMarks: Number(totalMarks),
      section: 'A',
      createdAt: new Date().toISOString().split('T')[0],
    };

    try {
      await api.createAssignment(newAsg);
      setAssignments([newAsg, ...assignments]);
      setShowCreateModal(false);
      setTitle('');
      setDescription('');
    } catch (e) {
      console.warn(e);
    }
  };

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!evaluatingSub) return;
    setIsEvaluating(true);

    try {
      await api.evaluateSubmission({
        submissionId: evaluatingSub.id,
        marksObtained: Number(marksGiven),
        feedback,
      });

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === evaluatingSub.id
            ? { ...s, marksObtained: Number(marksGiven), feedback, status: 'Evaluated' as const }
            : s
        )
      );

      setIsEvaluating(false);
      setEvaluatingSub(null);
    } catch (e) {
      setIsEvaluating(false);
    }
  };

  return (
    <div id="faculty-assignments-view" className="space-y-6">
      {/* Header with Create Button */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            Continuous Internal Evaluation
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Course Assignments & Grading</h1>
          <p className="text-xs text-gray-500 mt-1">
            Create coursework, manage submission rubrics, and grade student submissions.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Assignment</span>
        </button>
      </div>

      {/* Assignments Created Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {assignments.map((asg) => {
          const asgSubmissions = submissions.filter((s) => s.assignmentId === asg.id);
          const evaluatedCount = asgSubmissions.filter((s) => s.status === 'Evaluated').length;

          return (
            <div
              key={asg.id}
              className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:border-red-200 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded bg-red-50 px-2.5 py-1 text-xs font-bold text-[#B71C1C] border border-red-100">
                    {asg.courseCode}
                  </span>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
                    Max {asg.totalMarks} Marks
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">{asg.title}</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">{asg.description}</p>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    Due: {new Date(asg.deadline).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-gray-800">
                    {evaluatedCount}/{asgSubmissions.length} Evaluated
                  </span>
                </div>
              </div>

              {/* Submissions Section */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">Student Submissions:</p>
                {asgSubmissions.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No submissions received yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {asgSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 border border-gray-100 text-xs"
                      >
                        <div>
                          <span className="font-bold text-gray-900">{sub.studentName}</span>
                          <span className="text-[10px] text-gray-400 ml-2 font-mono">{sub.studentId}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {sub.status === 'Evaluated' ? (
                            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                              {sub.marksObtained}/{asg.totalMarks} Marks
                            </span>
                          ) : (
                            <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                              Needs Grading
                            </span>
                          )}

                          <button
                            onClick={() => {
                              setEvaluatingSub(sub);
                              setMarksGiven(sub.marksObtained || 18);
                              setFeedback(sub.feedback || '');
                            }}
                            className="px-2 py-1 bg-white border border-gray-200 hover:border-red-300 rounded text-xs font-semibold text-[#B71C1C]"
                          >
                            {sub.status === 'Evaluated' ? 'Edit Marks' : 'Evaluate'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Assignment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Create New Course Assignment</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Select Course</label>
                <select
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
                >
                  {COURSES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Unit 3: Normalization & Query Optimization Problem Set"
                  className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Instructions & Problem Description</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the problem statements and submission requirements..."
                  className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Submission Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#B71C1C] hover:bg-[#D32F2F] rounded-lg shadow-xs"
                >
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Evaluate Submission Modal */}
      {evaluatingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-900">Evaluate Student Submission</h3>
                <p className="text-xs text-gray-500">
                  {evaluatingSub.studentName} ({evaluatingSub.studentId})
                </p>
              </div>
              <button
                onClick={() => setEvaluatingSub(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
              {/* Submission preview */}
              <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                <p className="font-bold text-gray-700">Submitted Response:</p>
                <p className="text-gray-800 italic bg-white p-2.5 rounded border border-gray-100">
                  &ldquo;{evaluatingSub.submissionText}&rdquo;
                </p>
                {evaluatingSub.fileUrl && (
                  <a
                    href={evaluatingSub.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[#B71C1C] font-semibold hover:underline"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Student File Attachment (PDF)
                  </a>
                )}
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Marks Awarded (Out of 20)
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  required
                  value={marksGiven}
                  onChange={(e) => setMarksGiven(Number(e.target.value))}
                  className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Faculty Evaluator Feedback & Remarks
                </label>
                <textarea
                  rows={3}
                  required
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide constructive feedback for student improvement..."
                  className="w-full p-2.5 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEvaluatingSub(null)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isEvaluating}
                  className="px-5 py-2 font-bold text-white bg-[#B71C1C] hover:bg-[#D32F2F] rounded-lg shadow-xs"
                >
                  {isEvaluating ? 'Saving...' : 'Confirm Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
