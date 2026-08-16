import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  BrainCircuit,
  Send,
  BookOpen,
  Calendar,
  Layers,
  ArrowRight,
  RefreshCw,
  Sliders,
  Award,
  Zap
} from 'lucide-react';
import { AIInsightReport, User } from '../../types';
import { api } from '../../services/api';
import { DEMO_AI_STUDENT_INSIGHT } from '../../data/mockData';

interface StudentAIInsightsProps {
  user: User;
}

export const StudentAIInsights: React.FC<StudentAIInsightsProps> = ({ user }) => {
  const [insight, setInsight] = useState<AIInsightReport>(DEMO_AI_STUDENT_INSIGHT);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello ${user.name}! I have analyzed your Semester V records. You are doing great in Python (95%) and DSA (88%), but your DBMS attendance (77.5%) and recent IA-2 score require immediate attention. How can I help you improve?`,
      time: '10:00 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);

  // What-If Simulator State
  const [simulatedIa2, setSimulatedIa2] = useState<number>(42);
  const [simulatedModel, setSimulatedModel] = useState<number>(85);

  const fetchLiveInsight = async () => {
    setLoadingAnalysis(true);
    try {
      const res = await api.getStudentAIInsight(user.id);
      if (res.insight) {
        setInsight(res.insight);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleSendChat = async (messageToSend?: string) => {
    const text = messageToSend || chatInput;
    if (!text.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!messageToSend) setChatInput('');
    setIsChatSending(true);

    try {
      const reply = await api.sendAIChat(text, {
        name: user.name,
        cgpa: user.cgpa,
        weakSubject: 'Database Management Systems (AD3302)',
        attendance: '77.5%',
      });

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (e) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: 'I recommend focusing on BCNF decomposition and Functional Dependencies. Solve the past 3 years university question bank problems on Unit 3.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  // Calculate simulated SGPA based on slider values
  const simulatedTotalDbms = Math.round(38 * 0.2 + simulatedIa2 * 0.2 + simulatedModel * 0.6);
  const simulatedSgpa = ((7.85 * 5 + (simulatedTotalDbms >= 85 ? 9 : simulatedTotalDbms >= 75 ? 8 : 7)) / 6).toFixed(2);

  return (
    <div id="student-ai-insights-view" className="space-y-6">
      {/* Header with Regenerate Button */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50/40 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B71C1C] text-white text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              KIT Academic Intelligence Engine • Powered by Gemini AI
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              AI Academic Risk & Performance Diagnostic
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-2xl">
              Real-time multi-variate analysis correlating continuous assessments, attendance velocity, and topic difficulty weightage.
            </p>
          </div>

          <button
            onClick={fetchLiveInsight}
            disabled={loadingAnalysis}
            className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loadingAnalysis ? 'animate-spin' : ''}`} />
            <span>{loadingAnalysis ? 'Analyzing Data...' : 'Re-Run AI Diagnosis'}</span>
          </button>
        </div>
      </div>

      {/* 1. Risk Level & Explainability Breakdown Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Level Badge & Score Card */}
        <div className="lg:col-span-4 rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
                Current Risk Classification
              </span>
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
            </div>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-black text-amber-900">{insight?.riskLevel || 'MEDIUM'} RISK</span>
              <span className="text-xs font-bold text-amber-800">
                Health Score: {insight?.overallScore ?? 71}/100
              </span>
            </div>

            <p className="text-xs text-amber-800 mt-2 leading-relaxed">
              Target intervention required in <strong>1 Subject</strong> to prevent grade slippage.
            </p>

            <div className="mt-4 pt-3 border-t border-amber-200/60 space-y-2">
              <p className="text-[11px] font-bold text-amber-900 uppercase">Primary Risk Triggers:</p>
              {(insight?.mainFactors || []).map((factor, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-900">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-white p-3 border border-amber-200 text-[11px] text-gray-600">
            <span className="font-bold text-gray-900">Confidence Rating: </span>
            <span>{insight?.confidenceScore ?? 94.8}% statistical certainty based on past cohorts.</span>
          </div>
        </div>

        {/* Transparent AI Explainability Analysis */}
        <div className="lg:col-span-8 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit className="w-5 h-5 text-[#B71C1C]" />
            <h2 className="text-sm font-bold text-gray-900">Explainable AI Diagnostic Summary</h2>
          </div>

          <p className="text-xs text-gray-700 leading-relaxed bg-gray-50/70 p-4 rounded-xl border border-gray-100">
            {insight?.summary || 'Comprehensive academic profile evaluated with cross-semester historical correlation.'}
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-gray-100 bg-white">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Current CGPA</p>
              <p className="text-lg font-black text-gray-900 mt-0.5">{user.cgpa || 7.85} / 10.0</p>
              <p className="text-[10px] text-gray-500">Cumulative index</p>
            </div>

            <div className="p-3 rounded-lg border border-gray-100 bg-white">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Optimized Target SGPA</p>
              <p className="text-lg font-black text-emerald-700 mt-0.5">8.45 / 10.0</p>
              <p className="text-[10px] text-emerald-600">With 7-day study plan</p>
            </div>

            <div className="p-3 rounded-lg border border-gray-100 bg-white">
              <p className="text-[10px] font-bold text-gray-400 uppercase">Attendance Velocity</p>
              <p className="text-lg font-black text-[#B71C1C] mt-0.5">+4.2%</p>
              <p className="text-[10px] text-gray-500">Attending next 6 lectures</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Weak Subject & Discrete Topic Remediation */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
        <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#B71C1C]" />
          Weak Topic Detection & Root Cause Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(insight?.weakSubjects || []).map((sub, idx) => (
            <div key={idx} className="rounded-xl border border-red-100 bg-red-50/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-[#B71C1C] bg-white px-2 py-0.5 rounded border border-red-200">
                  {sub.courseCode}
                </span>
                <span className="text-xs font-bold text-gray-900">{sub.courseName}</span>
              </div>

              <div className="mt-3 space-y-2">
                <p className="text-[11px] font-bold text-gray-700 uppercase">Identified Concept Gaps:</p>
                <div className="flex flex-wrap gap-1.5">
                  {(sub.difficultTopics || []).map((t, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-[#B71C1C] border border-red-200 shadow-2xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-red-100">
                  <p className="text-xs text-gray-700">
                    <strong>Remedial Strategy: </strong>
                    {sub.remediationAction}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Personalized 7-Day Action Plan & Interactive What-If Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Plan */}
        <div className="lg:col-span-7 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#B71C1C]" />
              <h2 className="text-sm font-bold text-gray-900">Personalized 7-Day Remedial Roadmap</h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              High Impact
            </span>
          </div>

          <div className="space-y-3">
            {(insight?.studyRoadmap7Days || []).map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B71C1C] text-white text-[11px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-900">{item.day}: {item.focusSubject}</p>
                    <span className="text-[10px] font-semibold text-gray-500">{item.durationMinutes} mins</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(item.topics || []).map((tp, ti) => (
                      <span key={ti} className="text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-700">
                        {tp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-500 uppercase mb-2">Priority AI Recommendations:</p>
            <div className="space-y-2">
              {(insight?.recommendations || []).map((rec, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-gray-50 border border-gray-100 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#B71C1C]" />
                      {rec.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-[#B71C1C]">
                      {rec.priority} Priority
                    </span>
                  </div>
                  <p className="text-gray-600 text-[11px]">{rec.reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive "What-If" SGPA Simulator */}
        <div className="lg:col-span-5 rounded-xl border border-red-200 bg-gradient-to-b from-white to-red-50/30 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sliders className="w-4 h-4 text-[#B71C1C]" />
            <h2 className="text-sm font-bold text-gray-900">&ldquo;What-If&rdquo; SGPA Simulator</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            Simulate your expected Internal Assessment 2 & Model Exam scores to see projected final semester grade.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                <span>IA-2 Projected Score (Out of 50)</span>
                <span className="text-[#B71C1C] font-mono">{simulatedIa2} / 50</span>
              </div>
              <input
                type="range"
                min="20"
                max="50"
                value={simulatedIa2}
                onChange={(e) => setSimulatedIa2(Number(e.target.value))}
                className="w-full accent-[#B71C1C]"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                <span>Model Exam Projected Score (Out of 100)</span>
                <span className="text-[#B71C1C] font-mono">{simulatedModel} / 100</span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                value={simulatedModel}
                onChange={(e) => setSimulatedModel(Number(e.target.value))}
                className="w-full accent-[#B71C1C]"
              />
            </div>

            <div className="rounded-xl border border-red-200 bg-white p-4 text-center shadow-2xs">
              <p className="text-[11px] font-bold text-gray-400 uppercase">Simulated Outcome</p>
              <div className="mt-1 flex items-baseline justify-center gap-2">
                <span className="text-3xl font-black text-[#B71C1C]">{simulatedSgpa}</span>
                <span className="text-xs text-gray-500 font-bold">/ 10.0 SGPA</span>
              </div>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                {Number(simulatedSgpa) >= 8.0 ? '🎉 Qualifies for Distinction' : 'First Class Projected'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Interactive AI Academic Study Tutor (Gemini Powered) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#B71C1C] text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900">KIT AI Academic Study Companion</h2>
              <p className="text-[11px] text-gray-500">Ask questions regarding your syllabus, revision strategy, or concept doubts.</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            ● Gemini 3.7 Online
          </span>
        </div>

        {/* Quick prompt suggestions */}
        <div className="flex flex-wrap gap-2 mb-3">
          {[
            'Explain BCNF Decomposition simply with a 3NF comparison',
            'Give me a 3-day revision timetable for DBMS IA-2',
            'How can I recover my 77.5% attendance to 85%?',
          ].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendChat(prompt)}
              className="text-[11px] font-medium bg-red-50 text-[#B71C1C] border border-red-100 hover:bg-red-100 px-2.5 py-1 rounded-full transition-colors text-left"
            >
              &ldquo;{prompt}&rdquo;
            </button>
          ))}
        </div>

        {/* Chat message history */}
        <div className="h-64 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3 mb-3">
          {chatMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#B71C1C] text-white rounded-br-none shadow-2xs'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-2xs'
                }`}
              >
                <p>{msg.text}</p>
                <span
                  className={`text-[9px] block mt-1 ${
                    msg.sender === 'user' ? 'text-red-100' : 'text-gray-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          {isChatSending && (
            <div className="flex justify-start">
              <div className="rounded-xl bg-white border border-gray-200 p-3 text-xs text-gray-500 shadow-2xs flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#B71C1C] animate-spin" />
                <span>AI Tutor is formulating your answer...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat input box */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendChat();
            }}
            placeholder="Ask a question about your courses, formulas, or academic planning..."
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
          />
          <button
            onClick={() => handleSendChat()}
            disabled={isChatSending || !chatInput.trim()}
            className="flex items-center justify-center rounded-xl bg-[#B71C1C] p-2.5 text-white hover:bg-[#D32F2F] disabled:opacity-50 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
