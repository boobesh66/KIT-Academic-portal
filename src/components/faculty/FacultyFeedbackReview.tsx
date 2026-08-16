import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Star,
  BrainCircuit,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  FileText,
  TrendingUp,
  RefreshCw,
  Award,
  BookOpen,
  CheckCircle2,
  Download,
  Filter,
  Users
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Course, TeacherFeedback, AIFeedbackAnalysis, User } from '../../types';
import { TEACHER_FEEDBACKS, DEMO_AI_FEEDBACK_ANALYSIS } from '../../data/mockData';

interface FacultyFeedbackReviewProps {
  facultyUser: User;
  courses: Course[];
}

export const FacultyFeedbackReview: React.FC<FacultyFeedbackReviewProps> = ({
  facultyUser,
  courses,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'course-dbms');
  const [feedbacks, setFeedbacks] = useState<TeacherFeedback[]>(TEACHER_FEEDBACKS);
  const [aiAnalysis, setAiAnalysis] = useState<AIFeedbackAnalysis>(DEMO_AI_FEEDBACK_ANALYSIS);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [sentimentFilter, setSentimentFilter] = useState<'All' | 'Positive' | 'Constructive'>('All');

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Fetch or trigger live AI review
  const handleGenerateAiReview = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/review-feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facultyId: facultyUser.id,
          courseId: selectedCourse?.id,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setAiAnalysis(data.analysis);
      }
    } catch (err) {
      console.error('Failed to generate AI review:', err);
    } finally {
      setIsLoadingAi(false);
    }
  };

  const filteredFeedbacks = feedbacks.filter((f) => {
    if (f.facultyId !== facultyUser.id && f.courseId !== selectedCourse?.id) return false;
    if (sentimentFilter === 'All') return true;
    return f.sentiment === sentimentFilter;
  });

  // Chart data for metric averages
  const metricChartData = [
    { name: 'Clarity', score: aiAnalysis.metricAverages.teachingClarity },
    { name: 'Syllabus', score: aiAnalysis.metricAverages.syllabusCoverage },
    { name: 'Lab Guide', score: aiAnalysis.metricAverages.labGuidance },
    { name: 'Doubt Help', score: aiAnalysis.metricAverages.doubtPatience },
    { name: 'Evaluation', score: aiAnalysis.metricAverages.evaluationFairness },
  ];

  const sentimentData = [
    { name: 'Positive', value: aiAnalysis.sentimentBreakdown.positivePct, color: '#16A34A' },
    { name: 'Neutral', value: aiAnalysis.sentimentBreakdown.neutralPct, color: '#64748B' },
    { name: 'Constructive', value: aiAnalysis.sentimentBreakdown.constructivePct, color: '#E11D48' },
  ];

  return (
    <div id="faculty-feedback-review-view" className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
              Student Voice & Pedagogical Quality Audit
            </span>
            <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#B71C1C]">
              OBE Compliant
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Course Feedback & AI Recommendations</h1>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            Review aggregated student ratings, qualitative feedback, and AI-driven pedagogical action plans to optimize classroom pace and lab outcomes.
          </p>
        </div>

        <button
          onClick={handleGenerateAiReview}
          disabled={isLoadingAi}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B71C1C] hover:bg-[#8E0000] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
        >
          {isLoadingAi ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Synthesizing Reviews...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate Live AI Teaching Review
            </>
          )}
        </button>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Overall Course Rating</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{aiAnalysis.averageScore}</span>
            <span className="text-xs font-bold text-gray-500">/ 5.0</span>
          </div>
          <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Top 5% in AI&DS Dept
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Total Submissions</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gray-900">{aiAnalysis.totalFeedbacks}</span>
            <span className="text-xs font-bold text-gray-500">Students</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">92% Response Rate</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Positive Sentiment</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-600">
              {aiAnalysis.sentimentBreakdown.positivePct}%
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">
            {aiAnalysis.sentimentBreakdown.constructivePct}% Constructive Suggestions
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase">Syllabus Pacing Score</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-3xl font-black text-[#B71C1C]">
              {aiAnalysis.metricAverages.syllabusCoverage} / 5.0
            </span>
          </div>
          <p className="text-[10px] text-gray-500 mt-1">Disciplined Unit Distribution</p>
        </div>
      </div>

      {/* Analytics Visualizers: Metric Breakdown & Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Metric Bar Chart */}
        <div className="lg:col-span-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-[#B71C1C]" />
              Pedagogical Criteria Breakdown (Average Score / 5.0)
            </h2>
            <span className="text-[11px] font-semibold text-gray-500">Course: {selectedCourse?.code}</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metricChartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={{ stroke: '#e2e8f0' }} />
                <Tooltip
                  formatter={(value: any) => [`${value} / 5.0`, 'Rating Score']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Bar dataKey="score" fill="#B71C1C" radius={[6, 6, 0, 0]} barSize={36}>
                  {metricChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 1 ? '#B71C1C' : '#D32F2F'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sentiment Breakdown */}
        <div className="lg:col-span-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-xs font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-[#B71C1C]" />
              AI Sentiment Distribution
            </h2>

            <div className="h-44 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sentimentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-gray-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" /> Positive Praise
              </span>
              <strong className="text-gray-900">{aiAnalysis.sentimentBreakdown.positivePct}%</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-gray-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" /> Constructive Remarks
              </span>
              <strong className="text-gray-900">{aiAnalysis.sentimentBreakdown.constructivePct}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* AI Pedagogical Recommendations & Growth Plan */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-br from-red-50/50 via-white to-white p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-red-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-red-100 text-[#B71C1C]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-gray-900">
                AI Pedagogical Growth Recommendations for {facultyUser.name}
              </h2>
              <p className="text-xs text-gray-500">
                Generated from {aiAnalysis.totalFeedbacks} student reviews using NBA OBE rubrics
              </p>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-[#B71C1C] border border-red-200">
            Next Term Action Plan
          </span>
        </div>

        {/* 3 AI Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiAnalysis.aiPedagogicalRecommendations.map((rec, idx) => (
            <div key={idx} className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B71C1C] text-white text-[10px] font-bold shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wide">
                  {rec.category}
                </span>
              </div>
              <h3 className="text-xs font-bold text-gray-900">{rec.recommendation}</h3>
              <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                <strong>Action Plan: </strong>
                {rec.actionPlan}
              </p>
            </div>
          ))}
        </div>

        {/* HOD Executive Summary Preview */}
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
          <Award className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold uppercase tracking-wider text-[11px] text-amber-800">
              Department Academic Executive Summary
            </p>
            <p className="mt-1 leading-relaxed text-amber-950 font-medium">
              {aiAnalysis.hodExecutiveSummary}
            </p>
          </div>
        </div>
      </div>

      {/* Individual Student Feedback Feed */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#B71C1C]" />
            <h2 className="text-sm font-bold text-gray-900">
              Individual Student Feedback Submissions ({filteredFeedbacks.length})
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {(['All', 'Positive', 'Constructive'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSentimentFilter(tab)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  sentimentFilter === tab
                    ? 'bg-[#B71C1C] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredFeedbacks.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-all space-y-2.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-900">
                    {item.isAnonymous ? 'Anonymous Student' : item.studentName || 'Student'}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                    {item.courseCode}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    item.sentiment === 'Positive'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.sentiment}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(item.ratings.overallRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-gray-200 text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-gray-700 ml-1">
                    {item.ratings.overallRating} / 5.0
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                  <span className="font-bold text-emerald-800 text-[11px] block">Strengths & Positives:</span>
                  <p className="text-gray-700 mt-0.5">{item.comments.strengths}</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                  <span className="font-bold text-rose-800 text-[11px] block">Areas for Slower Pace / Attention:</span>
                  <p className="text-gray-700 mt-0.5">{item.comments.areasForImprovement}</p>
                </div>
              </div>

              {item.comments.suggestions && (
                <div className="text-xs text-gray-600 bg-gray-100/70 p-2 rounded-lg">
                  <strong>Classroom Suggestion: </strong> {item.comments.suggestions}
                </div>
              )}

              {item.attachmentName && (
                <div className="flex items-center gap-2 text-xs text-[#B71C1C] font-semibold pt-1">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span>Student Attached: {item.attachmentName}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
