import React, { useState } from 'react';
import {
  Sparkles,
  BrainCircuit,
  AlertTriangle,
  BookOpen,
  Plus,
  Copy,
  Check,
  Download,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../../services/api';
import { DEMO_FACULTY_AI_INSIGHT } from '../../data/mockData';

export const FacultyAIInsights: React.FC = () => {
  const [insight, setInsight] = useState(DEMO_FACULTY_AI_INSIGHT);

  // Question Generator State
  const [topic, setTopic] = useState('Database Normalization & BCNF');
  const [difficulty, setDifficulty] = useState('Medium');
  const [count, setCount] = useState(3);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([
    {
      question: 'Consider a relation R(A, B, C, D, E) with FDs: A -> BC, CD -> E, B -> D, E -> A. Determine all candidate keys and verify if R is in BCNF.',
      type: 'Descriptive / Numerical',
      marks: 8,
      bloomLevel: 'Analyzing & Evaluating',
      sampleAnswer: 'Candidate keys are {A}, {E}, {CD}, {BC}. Non-trivial FD B->D violates BCNF since B is not a superkey. Decomposition required.',
    },
    {
      question: 'Explain the difference between 3NF and BCNF with a canonical example where dependency preservation is sacrificed in BCNF.',
      type: 'Theory & Proof',
      marks: 6,
      bloomLevel: 'Understanding',
      sampleAnswer: '3NF allows prime attributes on the RHS of an FD even if LHS is not a superkey. BCNF strictly requires LHS to be a superkey.',
    },
  ]);

  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const qList = await api.generateAIQuestions({ topic, difficulty, count });
      if (qList && qList.length > 0) {
        setGeneratedQuestions(qList);
      }
    } catch (e) {
      console.warn(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div id="faculty-ai-insights-view" className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50/40 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B71C1C] text-white text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            AI Teaching Intelligence & Test Synthesis
          </span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">
          Faculty AI Class Diagnostics & Exam Generator
        </h1>
        <p className="text-xs text-gray-600 mt-1 max-w-2xl">
          Identify teaching bottlenecks from assessment response vectors and generate customized Anna University standard assessment papers.
        </p>
      </div>

      {/* 1. Class Bottleneck Diagnostics & At-Risk Students */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-[#B71C1C]" />
              <h2 className="text-sm font-bold text-gray-900">Identified Concept Learning Bottlenecks</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-red-50 text-[#B71C1C] border border-red-100">
              {insight?.courseCode || 'CS3301'} - {insight?.courseName || 'Data Structures'}
            </span>
          </div>

          <div className="space-y-3">
            {(insight?.toughestTopics || []).map((topicItem, idx) => (
              <div key={idx} className="rounded-xl border border-red-100 bg-red-50/30 p-3.5 flex items-start gap-3">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#B71C1C] text-white text-[10px] font-bold shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">{topicItem}</h3>
                  <p className="text-[11px] text-gray-600 mt-0.5">
                    High error rate in recent Internal Assessment 2. Recommend providing step-by-step trace worksheets.
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-[11px] font-bold text-gray-500 uppercase mb-2">Recommended Teaching Interventions:</p>
            <div className="space-y-1.5">
              {(insight?.recommendedTeachingActions || []).map((act, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-gray-700 bg-gray-50 p-2 rounded">
                  <span className="text-[#B71C1C] font-bold">•</span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-sm font-bold text-gray-900">
                At-Risk Students Requiring Mentorship ({insight?.atRiskStudentsList?.length || 0})
              </h2>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Proactive Alert
            </span>
          </div>

          <div className="space-y-3">
            {(insight?.atRiskStudentsList || []).map((s, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-amber-200 bg-amber-50/40 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{s.name} ({s.registerNumber})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.predictedRisk === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {s.predictedRisk} Risk
                  </span>
                </div>
                <div className="mt-1.5 flex gap-4 text-[11px] text-gray-600">
                  <span>Attendance: <strong>{s.attendancePct}%</strong></span>
                  <span>Internal Avg: <strong>{s.internalMarkAvg}/50</strong></span>
                </div>
                <p className="mt-1.5 text-[11px] text-gray-700">{s.keyIssue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. AI Exam Question Generator (Powered by Gemini) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#B71C1C]" />
            <div>
              <h2 className="text-sm font-bold text-gray-900">AI Exam Question Generator</h2>
              <p className="text-xs text-gray-500">
                Generate Anna University model exam questions mapped to Bloom&apos;s Taxonomy levels.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
            Gemini 3.7 Flash Engine
          </span>
        </div>

        {/* Generator Controls */}
        <form onSubmit={handleGenerateQuestions} className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-6">
          <div className="sm:col-span-6">
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
              Curriculum Topic / Concept
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. BCNF Normalization, Red-Black Trees, Dynamic Programming..."
              className="w-full p-2.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
              Difficulty Tier
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full p-2.5 text-xs rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden text-gray-700"
            >
              <option value="Easy">Easy (Bloom L1/L2)</option>
              <option value="Medium">Medium (Bloom L3/L4)</option>
              <option value="Hard">Hard / Challenging (Bloom L5/L6)</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 p-2.5 text-xs font-bold text-white bg-[#B71C1C] hover:bg-[#D32F2F] rounded-lg shadow-xs transition-colors disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Questions'}</span>
            </button>
          </div>
        </form>

        {/* Generated Questions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-700 uppercase">
              Synthesized Question Bank ({generatedQuestions.length})
            </p>
            <button
              onClick={() => alert('Question bank exported as PDF for COE.')}
              className="flex items-center gap-1 text-xs font-semibold text-[#B71C1C] hover:underline"
            >
              <Download className="w-3.5 h-3.5" /> Export Question Paper PDF
            </button>
          </div>

          {generatedQuestions.map((q, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-red-100 text-[#B71C1C] font-bold text-xs shrink-0 mt-0.5">
                    Q{idx + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-relaxed">{q.question}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-semibold">
                      <span className="bg-red-50 text-[#B71C1C] border border-red-100 px-2 py-0.5 rounded">
                        {q.bloomLevel || 'Analyzing'}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {q.marks || 8} Marks
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {q.type || 'Descriptive'}
                      </span>
                    </div>

                    {q.sampleAnswer && (
                      <div className="mt-2.5 p-2.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-600">
                        <span className="font-bold text-gray-900">Model Answer Key: </span>
                        {q.sampleAnswer}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleCopy(q.question, idx)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 hover:text-gray-700 shrink-0"
                  title="Copy question text"
                >
                  {copiedIdx === idx ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
