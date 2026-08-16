import React, { useState } from 'react';
import {
  ClipboardCheck,
  Upload,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  Download,
  X,
  ExternalLink
} from 'lucide-react';
import { Assignment, AssignmentSubmission } from '../../types';

interface StudentAssignmentsProps {
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  onSubmitAssignment: (payload: { assignmentId: string; submissionText: string; fileUrl?: string }) => void;
}

export const StudentAssignments: React.FC<StudentAssignmentsProps> = ({
  assignments,
  submissions,
  onSubmitAssignment,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'evaluated'>('all');
  const [activeSubmitModal, setActiveSubmitModal] = useState<Assignment | null>(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const getSubmissionForAssignment = (assignmentId: string) => {
    return submissions.find((s) => s.assignmentId === assignmentId);
  };

  const filteredAssignments = assignments.filter((asg) => {
    const sub = getSubmissionForAssignment(asg.id);
    if (filter === 'pending') return !sub || sub.status === 'Pending';
    if (filter === 'submitted') return sub && sub.status === 'Submitted';
    if (filter === 'evaluated') return sub && sub.status === 'Evaluated';
    return true;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmitModal) return;
    setIsSubmitting(true);

    setTimeout(() => {
      onSubmitAssignment({
        assignmentId: activeSubmitModal.id,
        submissionText,
        fileUrl: fileName ? `https://kit-academic.ac.in/uploads/${fileName}` : undefined,
      });
      setIsSubmitting(false);
      setSubmitSuccess(true);

      setTimeout(() => {
        setSubmitSuccess(false);
        setActiveSubmitModal(null);
        setSubmissionText('');
        setFileName('');
      }, 1200);
    }, 500);
  };

  return (
    <div id="student-assignments-view" className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            Continuous Assessment
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Coursework & Assignments</h1>
          <p className="text-xs text-gray-500 mt-1">
            Submit coursework assignments, view rubrics evaluations, and access faculty feedback.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 border border-gray-200">
          {(['all', 'pending', 'submitted', 'evaluated'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold capitalize transition-all ${
                filter === tab
                  ? 'bg-white text-[#B71C1C] shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAssignments.map((asg) => {
          const sub = getSubmissionForAssignment(asg.id);
          const isPending = !sub || sub.status === 'Pending';
          const isEvaluated = sub?.status === 'Evaluated';
          const isPastDue = new Date(asg.deadline) < new Date();

          return (
            <div
              key={asg.id}
              className={`flex flex-col justify-between rounded-xl border p-5 transition-all ${
                isPending
                  ? 'border-gray-200 bg-white shadow-2xs hover:border-red-200'
                  : isEvaluated
                  ? 'border-emerald-200 bg-emerald-50/20 shadow-2xs'
                  : 'border-blue-200 bg-blue-50/20 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded bg-red-50 px-2.5 py-1 text-xs font-bold text-[#B71C1C] border border-red-100">
                    {asg.courseCode}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      isEvaluated
                        ? 'bg-emerald-100 text-emerald-800'
                        : sub?.status === 'Submitted'
                        ? 'bg-blue-100 text-blue-800'
                        : isPastDue
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {isEvaluated
                      ? 'Evaluated'
                      : sub?.status === 'Submitted'
                      ? 'Submitted (Under Review)'
                      : isPastDue
                      ? 'Late Submission'
                      : 'Pending'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 leading-snug">{asg.title}</h3>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">{asg.description}</p>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      Deadline:
                    </span>
                    <strong className="text-gray-800">{new Date(asg.deadline).toLocaleDateString()}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Weightage:</span>
                    <strong className="text-gray-800">{asg.totalMarks} Marks</strong>
                  </div>
                </div>

                {/* Evaluated Score & Feedback Display */}
                {isEvaluated && (
                  <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-900">Score Awarded:</span>
                      <span className="text-sm font-black text-emerald-800">
                        {sub?.marksObtained} / {asg.totalMarks}
                      </span>
                    </div>
                    {sub?.feedback && (
                      <p className="text-xs text-emerald-800 mt-1 italic">
                        &ldquo;{sub.feedback}&rdquo;
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                {asg.fileUrl ? (
                  <a
                    href={asg.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Problem Sheet PDF
                  </a>
                ) : (
                  <span className="text-[11px] text-gray-400">PDF Guide attached</span>
                )}

                {isPending && (
                  <button
                    onClick={() => setActiveSubmitModal(asg)}
                    className="flex items-center gap-1.5 rounded-lg bg-[#B71C1C] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Submit Solution
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {activeSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-[#B71C1C] uppercase">
                  {activeSubmitModal.courseCode}
                </span>
                <h3 className="text-base font-bold text-gray-900 leading-tight">
                  {activeSubmitModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveSubmitModal(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-900">Assignment Uploaded Successfully!</p>
                <p className="text-xs text-gray-500 mt-1">
                  Your submission has been archived and sent to the faculty reviewer.
                </p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Text Solution / GitHub Repo URL / Comments
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={submissionText}
                    onChange={(e) => setSubmissionText(e.target.value)}
                    placeholder="Enter your algorithm implementation, SQL queries, or repository link..."
                    className="w-full p-2.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                  />
                </div>

                {/* File Attachment Upload */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Attach Assignment Document (PDF / ZIP)
                  </label>
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 bg-gray-50 hover:bg-white transition-colors cursor-pointer">
                    <label className="flex flex-col items-center cursor-pointer w-full">
                      <Upload className="w-6 h-6 text-gray-400 mb-1" />
                      <span className="text-xs font-semibold text-gray-700">
                        {fileName ? fileName : 'Click to select file or drag & drop'}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Max size 25MB (PDF, DOCX, ZIP)</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFileName(e.target.files[0].name);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setActiveSubmitModal(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#B71C1C] hover:bg-[#D32F2F] rounded-lg shadow-xs disabled:opacity-50"
                  >
                    {isSubmitting ? 'Uploading...' : 'Confirm Submission'}
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
