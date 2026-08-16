import React, { useState, useRef } from 'react';
import {
  MessageSquareHeart,
  Star,
  Sparkles,
  Send,
  CheckCircle2,
  FileText,
  Upload,
  X,
  AlertCircle,
  Eye,
  EyeOff,
  BookOpen,
  Award,
  Clock,
  ThumbsUp,
  BrainCircuit,
  MessageSquare
} from 'lucide-react';
import { Course, TeacherFeedback, User } from '../../types';

interface StudentFeedbackProps {
  user: User;
  courses: Course[];
  onFeedbackSubmitted?: (feedback: TeacherFeedback) => void;
}

export const StudentFeedback: React.FC<StudentFeedbackProps> = ({
  user,
  courses,
  onFeedbackSubmitted,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'course-dbms');
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  // Rating states (1 to 5)
  const [teachingClarity, setTeachingClarity] = useState<number>(5);
  const [syllabusCoverage, setSyllabusCoverage] = useState<number>(5);
  const [labGuidance, setLabGuidance] = useState<number>(4);
  const [doubtPatience, setDoubtPatience] = useState<number>(5);
  const [evaluationFairness, setEvaluationFairness] = useState<number>(4);

  // Text feedback
  const [strengths, setStrengths] = useState('');
  const [areasForImprovement, setAreasForImprovement] = useState('');
  const [suggestions, setSuggestions] = useState('');

  // Attachment upload
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string; dataUrl?: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedList, setSubmittedList] = useState<TeacherFeedback[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Calculate composite rating
  const overallRating = Number(
    ((teachingClarity + syllabusCoverage + labGuidance + doubtPatience + evaluationFairness) / 5).toFixed(1)
  );

  // Handle file selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedFile({
        name: file.name,
        size: `${sizeInMb} MB`,
        dataUrl: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Submit Feedback Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    setIsSubmitting(true);

    const payload = {
      courseId: selectedCourse.id,
      courseCode: selectedCourse.code,
      courseName: selectedCourse.name,
      facultyId: selectedCourse.facultyId,
      facultyName: selectedCourse.facultyName,
      studentId: user.id,
      studentName: isAnonymous ? 'Anonymous Student' : user.name,
      isAnonymous,
      ratings: {
        teachingClarity,
        syllabusCoverage,
        labGuidance,
        doubtPatience,
        evaluationFairness,
        overallRating,
      },
      comments: {
        strengths: strengths || 'Clear explanations and punctual coverage.',
        areasForImprovement: areasForImprovement || 'More live problem solving.',
        suggestions: suggestions || 'Share practice worksheets.',
      },
      attachmentName: attachedFile?.name,
      attachmentUrl: attachedFile?.dataUrl,
    };

    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.feedback) {
        setSubmittedList((prev) => [data.feedback, ...prev]);
        if (onFeedbackSubmitted) {
          onFeedbackSubmitted(data.feedback);
        }
      }

      setSubmitSuccess(true);
      // Reset form
      setStrengths('');
      setAreasForImprovement('');
      setSuggestions('');
      setAttachedFile(null);

      setTimeout(() => setSubmitSuccess(false), 3500);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarSelector = (
    label: string,
    value: number,
    setter: (val: number) => void,
    description: string
  ) => (
    <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-800">{label}</label>
        <span className="text-xs font-black text-[#B71C1C] bg-white px-2 py-0.5 rounded border border-red-100">
          {value} / 5
        </span>
      </div>
      <p className="text-[11px] text-gray-500">{description}</p>
      <div className="flex items-center gap-1 pt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setter(star)}
            className="p-1 hover:scale-110 transition-transform"
          >
            <Star
              className={`w-5 h-5 ${
                star <= value
                  ? 'fill-amber-400 text-amber-400'
                  : 'fill-gray-200 text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div id="student-feedback-view" className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
              Continuous Quality Improvement (OBE)
            </span>
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#B71C1C]">
              <Sparkles className="w-3 h-3" /> AI Reviewed
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Course & Faculty Feedback</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            Provide feedback on teaching clarity, lab demonstrations, and syllabus pace.
            Feedback is synthesized by AI to generate pedagogical recommendations for faculty and HOD.
          </p>
        </div>

        <div className="rounded-xl border border-red-100 bg-red-50/60 p-3 text-center min-w-[130px]">
          <p className="text-[10px] font-bold text-[#B71C1C] uppercase">Privacy Protocol</p>
          <p className="text-xs font-bold text-gray-900 mt-0.5">Anonymous Option</p>
          <p className="text-[10px] text-gray-500">Zero Academic Bias</p>
        </div>
      </div>

      {submitSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Feedback Submitted Successfully!</p>
            <p className="text-emerald-700 mt-0.5">
              Thank you for your valuable feedback. It has been queued for AI sentiment analysis and faculty recommendation generation.
            </p>
          </div>
        </div>
      )}

      {/* Main Grid: Feedback Form & Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Feedback Submission Form */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Course & Faculty Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-2">
                1. Select Enrolled Course & Course Faculty
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setSelectedCourseId(course.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedCourseId === course.id
                        ? 'border-[#B71C1C] bg-red-50/40 ring-1 ring-[#B71C1C]'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#B71C1C]">
                        {course.code}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                        Sem {course.semester}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-gray-900 mt-1 line-clamp-1">{course.name}</p>
                    <p className="text-[11px] text-gray-600 mt-0.5 flex items-center gap-1">
                      <span className="font-medium text-gray-500">Faculty:</span> {course.facultyName}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Star Rating Criteria */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900">
                  2. Detailed Pedagogical Assessment Criteria (1 - 5 Stars)
                </label>
                <div className="flex items-center gap-1.5 text-xs font-black text-[#B71C1C] bg-red-50 px-2.5 py-1 rounded-lg border border-red-100">
                  <span>Composite: {overallRating} / 5.0</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {renderStarSelector(
                  'Teaching Clarity & Concept Depth',
                  teachingClarity,
                  setTeachingClarity,
                  'Effectiveness in explaining core theorems and algorithms'
                )}
                {renderStarSelector(
                  'Syllabus Coverage & Pacing',
                  syllabusCoverage,
                  setSyllabusCoverage,
                  'Punctuality and structured distribution across all 5 units'
                )}
                {renderStarSelector(
                  'Lab & Practical Guidance',
                  labGuidance,
                  setLabGuidance,
                  'Hands-on assistance during compiler/SQL/network lab exercises'
                )}
                {renderStarSelector(
                  'Doubt Clearance & Approachability',
                  doubtPatience,
                  setDoubtPatience,
                  'Willingness to assist during office hours and tutorial slots'
                )}
                <div className="sm:col-span-2">
                  {renderStarSelector(
                    'Fairness in Evaluation & Continuous Assessment',
                    evaluationFairness,
                    setEvaluationFairness,
                    'Clarity of rubrics and constructive feedback on test papers'
                  )}
                </div>
              </div>
            </div>

            {/* Step 3: Open-Ended Constructive Comments */}
            <div className="space-y-3.5">
              <label className="block text-xs font-bold text-gray-900">
                3. Descriptive Qualitative Feedback
              </label>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Key Strengths & What Works Well in Class:
                </label>
                <textarea
                  rows={2}
                  value={strengths}
                  onChange={(e) => setStrengths(e.target.value)}
                  placeholder="e.g. Excellent real-world architectural examples; very clear whiteboard traces of algorithms..."
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Specific Topics / Concepts Needing Slower Pace or Extra Practice:
                </label>
                <textarea
                  rows={2}
                  value={areasForImprovement}
                  onChange={(e) => setAreasForImprovement(e.target.value)}
                  placeholder="e.g. Unit 3 Normalization proofs were covered very quickly; need step-by-step practice sheets..."
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Constructive Suggestions for Classroom / Lab Improvement:
                </label>
                <textarea
                  rows={2}
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="e.g. Conducting a 10-minute quiz at start of lecture or sharing lecture PDF slides beforehand..."
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                />
              </div>
            </div>

            {/* Step 4: Document / Doubt Attachment Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-900 mb-1.5">
                4. Optional Attachment (Notes, Doubt Sheet, Sample Question Paper)
              </label>

              {attachedFile ? (
                <div className="flex items-center justify-between p-3 rounded-xl border border-red-200 bg-red-50/50 text-xs">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#B71C1C]" />
                    <span className="font-bold text-gray-900">{attachedFile.name}</span>
                    <span className="text-[10px] text-gray-500 font-semibold">({attachedFile.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="p-1 rounded-full text-gray-400 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-[#B71C1C] rounded-xl p-4 bg-gray-50/60 hover:bg-white text-center cursor-pointer transition-colors"
                >
                  <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-gray-700">
                    Click to attach document or notes (PDF, DOCX, PNG, JPG)
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Maximum file size: 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </div>
              )}
            </div>

            {/* Step 5: Anonymous Toggle & Submit Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gray-100">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-[#B71C1C] focus:ring-[#B71C1C]"
                />
                <div className="flex items-center gap-1.5 text-xs text-gray-700">
                  {isAnonymous ? (
                    <EyeOff className="w-4 h-4 text-purple-600" />
                  ) : (
                    <Eye className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="font-semibold">
                    {isAnonymous ? 'Submit Anonymously (Name Hidden)' : `Submit with Register No (${user.registerNumber || '711522205023'})`}
                  </span>
                </div>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#B71C1C] hover:bg-[#8E0000] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Submitting & Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Faculty Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right 4 Cols: AI Quality Feedback Workflow & Recent Submissions */}
        <div className="lg:col-span-4 space-y-5">
          {/* AI Workflow Card */}
          <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50/80 to-white p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <BrainCircuit className="w-5 h-5 text-[#B71C1C]" />
              <h2 className="text-xs font-bold text-gray-900">How AI Feedback Works</h2>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Every student feedback is processed by our Gemini Academic Intelligence Engine to:
            </p>
            <ul className="mt-3 space-y-2 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 rounded-full bg-[#B71C1C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">1</span>
                <span>Aggregate ratings across pedagogical rubrics without exposing identity.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 rounded-full bg-[#B71C1C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">2</span>
                <span>Synthesize concept bottlenecks and identify topics requiring revision sessions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-4 w-4 rounded-full bg-[#B71C1C] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">3</span>
                <span>Generate automated classroom action plans for the faculty and Dean of Academics.</span>
              </li>
            </ul>
          </div>

          {/* Quick FAQ */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
            <h3 className="text-xs font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#B71C1C]" />
              Feedback Guidelines
            </h3>
            <div className="space-y-2.5 text-xs text-gray-600">
              <p>
                <strong>Constructive & Specific:</strong> Mention specific topics (e.g. BCNF, AVL Trees) rather than generic remarks.
              </p>
              <p>
                <strong>Fair Assessment:</strong> Evaluate based on overall semester performance, clarity of lecture notes, and mentorship.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
