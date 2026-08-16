import React, { useState, useRef } from 'react';
import {
  Sparkles,
  BrainCircuit,
  BookOpen,
  FileText,
  Upload,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Award,
  ArrowRight,
  RefreshCw,
  Send,
  User as UserIcon,
  Bot,
  Zap,
  TrendingUp,
  Flame,
  Layers,
  ChevronRight,
  Eye,
  RotateCw
} from 'lucide-react';
import { User, StudentAIInsight, AIDocumentAnalysis } from '../../types';

interface PersonalizedAIStudentCoachProps {
  user: User;
  insight: StudentAIInsight;
}

export const PersonalizedAIStudentCoach: React.FC<PersonalizedAIStudentCoachProps> = ({
  user,
  insight,
}) => {
  const [activeTab, setActiveTab] = useState<'diagnostic' | 'document' | 'quiz' | 'chat'>('diagnostic');

  // Document Analyzer state
  const [docFile, setDocFile] = useState<{ name: string; size: string; content?: string } | null>(null);
  const [docSubject, setDocSubject] = useState('Database Management Systems (AD3302)');
  const [docNotesText, setDocNotesText] = useState('');
  const [isAnalyzingDoc, setIsAnalyzingDoc] = useState(false);
  const [docAnalysisResult, setDocAnalysisResult] = useState<AIDocumentAnalysis | null>(null);
  const [activeFlashcardIndex, setActiveFlashcardIndex] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);

  const docInputRef = useRef<HTMLInputElement | null>(null);

  // Quiz state
  const [quizTopic, setQuizTopic] = useState('Database Normalization & BCNF');
  const [quizQuestions, setQuizQuestions] = useState<any[]>([
    {
      id: 'q1',
      question: 'If relation R(A, B, C) has functional dependency A -> B and B -> C, and A is the candidate key, what is the highest normal form of R?',
      options: ['1NF', '2NF', '3NF', 'BCNF'],
      correctIndex: 1,
      explanation: 'R is in 2NF because all non-prime attributes are fully functionally dependent on candidate key A. However, B -> C is a transitive dependency between non-prime attributes, violating 3NF.',
      conceptTag: 'Transitive Dependency',
    },
    {
      id: 'q2',
      question: 'Which property is guaranteed by BCNF decomposition without exception?',
      options: ['Dependency Preservation', 'Lossless Join', 'Both Dependency & Lossless Join', 'Zero Redundancy in Multi-Valued Attributes'],
      correctIndex: 1,
      explanation: 'BCNF decomposition is always guaranteed to be Lossless Join, but it may not always preserve all functional dependencies.',
      conceptTag: 'BCNF Properties',
    },
  ]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  // Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: `Hello ${user.name}! I am your KIT AI Academic Study Coach. I've analyzed your Semester 5 performance (Current CGPA: ${user.cgpa || '7.85'}). I can help you master complex proofs, analyze uploaded lecture notes, generate Anna University practice questions, and clarify tough concepts. How can I help you excel today?`,
      time: 'Just now',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);
  const [highThinkingMode, setHighThinkingMode] = useState(true);

  // Handle Document Upload
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setDocFile({
        name: file.name,
        size: `${sizeMb} MB`,
        content: content.slice(0, 10000), // snippet for API
      });
    };
    reader.readAsText(file);
  };

  // Run AI Document Analysis
  const handleAnalyzeDocument = async () => {
    setIsAnalyzingDoc(true);
    try {
      const res = await fetch('/api/ai/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: docFile?.name || 'Uploaded_Notes.txt',
          contentText: docNotesText || docFile?.content || 'Database Normalization and BCNF algorithms with lossless join verification.',
          subject: docSubject,
        }),
      });
      const data = await res.json();
      if (data.analysis) {
        setDocAnalysisResult(data.analysis);
        setActiveFlashcardIndex(0);
        setIsCardFlipped(false);
      }
    } catch (err) {
      console.error('Document analysis failed:', err);
    } finally {
      setIsAnalyzingDoc(false);
    }
  };

  // Generate Interactive Practice Quiz
  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: quizTopic,
          subject: docSubject,
          difficulty: 'Medium',
        }),
      });
      const data = await res.json();
      if (data.quiz && data.quiz.length > 0) {
        setQuizQuestions(data.quiz);
        setSelectedAnswers({});
      }
    } catch (err) {
      console.error('Quiz generation failed:', err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  // Send Chat Message to Gemini
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatSending) return;

    const userText = chatInput.trim();
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [...prev, { role: 'user', text: userText, time: timeNow }]);
    setChatInput('');
    setIsChatSending(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          role: 'student',
          studentContext: {
            name: user.name,
            cgpa: user.cgpa,
            semester: user.semester,
            department: user.departmentName,
            weakTopics: (insight?.priorityRecoveryPlan || []).map((p) => p.topic),
          },
          useHighThinking: highThinkingMode,
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || "I've reviewed the concept. Let me break down the step-by-step mathematical reasoning according to Anna University engineering criteria.";
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', text: aiReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    } catch (err) {
      console.error('AI chat failed:', err);
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Here is the step-by-step breakdown: First calculate attribute closures F+, determine candidate keys by checking minimal superkeys, and verify whether every determinant is a superkey (BCNF) or prime attribute (3NF).',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsChatSending(false);
    }
  };

  return (
    <div id="personalized-student-coach-view" className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
              Personalized AI Academic Improvement Suite
            </span>
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#B71C1C]">
              <Sparkles className="w-3 h-3" /> Powered by Gemini
            </span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 mt-1">
            AI Academic Improvement & Study Tutor
          </h1>
          <p className="text-xs text-gray-500 mt-1 max-w-2xl">
            Custom diagnostics tailored to your marks, document intelligence to convert notes into model exam questions, and 24/7 high-reasoning concept coaching.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 border border-gray-200">
          {[
            { id: 'diagnostic', label: 'Improvement Plan', icon: TrendingUp },
            { id: 'document', label: 'Document Analyzer', icon: FileText },
            { id: 'quiz', label: 'Practice Quiz', icon: Award },
            { id: 'chat', label: 'AI Advisor', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-[#B71C1C] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: DIAGNOSTIC & IMPROVEMENT ROADMAP */}
      {activeTab === 'diagnostic' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Target Score & Trajectory Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-xs">
              <p className="text-[11px] font-bold text-gray-400 uppercase">Current Standing CGPA</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#B71C1C]">{user.cgpa || 7.85}</span>
                <span className="text-xs font-bold text-gray-500">/ 10.0</span>
              </div>
              <p className="text-[10px] text-gray-500 mt-1">First Class with Distinction Path</p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5 shadow-xs">
              <p className="text-[11px] font-bold text-emerald-800 uppercase">Target Semester 5 CGPA</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black text-emerald-700">8.50+</span>
                <span className="text-xs font-bold text-emerald-800">Target</span>
              </div>
              <p className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Requires +12 Marks in Internal Assessment 2
              </p>
            </div>

            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5 shadow-xs">
              <p className="text-[11px] font-bold text-purple-800 uppercase">Daily Practice Target</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black text-purple-900">45 Mins</span>
              </div>
              <p className="text-[10px] text-purple-700 font-semibold mt-1">
                Focus on Normalization & Tree Rotations
              </p>
            </div>
          </div>

          {/* Remedial Recovery Milestone Cards */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#B71C1C]" />
                <h2 className="text-sm font-bold text-gray-900">
                  AI Dynamic 7-Day Remedial Action Milestones
                </h2>
              </div>
              <span className="text-xs font-bold text-[#B71C1C] bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                Active Study Sprint
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(insight?.priorityRecoveryPlan || [
                {
                  courseCode: 'AD3302',
                  courseName: 'Database Management Systems',
                  topic: 'Boyce-Codd Normal Form (BCNF) Decomposition Proofs',
                  recommendedAction: 'Practice 4 closure calculations and lossless join verification problems.',
                  targetDate: '2 Days Left',
                  estimatedStudyMinutes: 45,
                },
                {
                  courseCode: 'CS3301',
                  courseName: 'Data Structures & Algorithms',
                  topic: 'AVL Tree Double Rotations (LR & RL)',
                  recommendedAction: 'Trace 5 insertion cases on paper and code balance factor checks.',
                  targetDate: '4 Days Left',
                  estimatedStudyMinutes: 60,
                },
                {
                  courseCode: 'CS3401',
                  courseName: 'Computer Networks',
                  topic: 'CIDR Subnetting & IP Route Aggregation',
                  recommendedAction: 'Solve 6 subnet masking word problems from previous Anna University papers.',
                  targetDate: '6 Days Left',
                  estimatedStudyMinutes: 40,
                },
              ]).map((plan, idx) => (
                <div key={idx} className="rounded-xl border border-gray-200 bg-gray-50/50 p-4 space-y-2.5 hover:bg-white hover:border-[#B71C1C] transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white border border-gray-200 text-[#B71C1C]">
                      {plan.courseCode}
                    </span>
                    <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {plan.targetDate}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-gray-900 line-clamp-1">{plan.topic}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed bg-white p-2.5 rounded-lg border border-gray-100">
                    {plan.recommendedAction}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">Target: {plan.estimatedStudyMinutes} mins</span>
                    <button
                      onClick={() => {
                        setQuizTopic(plan.topic);
                        setActiveTab('quiz');
                      }}
                      className="text-xs font-bold text-[#B71C1C] hover:underline flex items-center gap-1"
                    >
                      Practice Quiz <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENT & NOTES ANALYZER */}
      {activeTab === 'document' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Upload and Configuration Form */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#B71C1C]" />
              Upload Lecture Notes, Syllabus, or Question Paper for Instant AI Revision Kit
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subject / Course</label>
                <select
                  value={docSubject}
                  onChange={(e) => setDocSubject(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                >
                  <option>Database Management Systems (AD3302)</option>
                  <option>Data Structures & Algorithms (CS3301)</option>
                  <option>Computer Networks (CS3401)</option>
                  <option>Discrete Mathematics (MA3354)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Upload PDF / TXT / DOCX File</label>
                <div
                  onClick={() => docInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 hover:border-[#B71C1C] p-2.5 rounded-xl text-center cursor-pointer bg-gray-50 hover:bg-white transition-colors"
                >
                  <span className="text-xs font-bold text-gray-700">
                    {docFile ? docFile.name : 'Click to select lecture notes document'}
                  </span>
                  <input
                    ref={docInputRef}
                    type="file"
                    accept=".txt,.pdf,.docx,.doc"
                    onChange={handleDocUpload}
                    className="sr-only"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Or Paste Lecture Text / Syllabus Topics Directly
                </label>
                <textarea
                  rows={3}
                  value={docNotesText}
                  onChange={(e) => setDocNotesText(e.target.value)}
                  placeholder="Paste lecture notes extract, formula list, or question paper syllabus text..."
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-[#B71C1C] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleAnalyzeDocument}
                disabled={isAnalyzingDoc}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#B71C1C] hover:bg-[#8E0000] text-white text-xs font-bold shadow-md transition-all disabled:opacity-50"
              >
                {isAnalyzingDoc ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Extracting & Synthesizing Revision Kit...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze & Generate Study Kit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis Results Display */}
          {docAnalysisResult && (
            <div className="space-y-6 animate-in slide-in-from-bottom-3">
              {/* Summary Card */}
              <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50/50 via-white to-white p-6 shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-red-100">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Executive Summary of Uploaded Material
                  </h3>
                  <span className="text-[11px] font-semibold text-gray-500">
                    {docAnalysisResult.documentName}
                  </span>
                </div>
                <p className="text-xs text-gray-700 mt-3 leading-relaxed">
                  {docAnalysisResult.summary}
                </p>
              </div>

              {/* Key Formulas & Theorems */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#B71C1C]" />
                  Key Formulas, Conditions & Theorems
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(docAnalysisResult.keyFormulasAndConcepts || []).map((f, i) => (
                    <div key={i} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          f.importance === 'Crucial'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {f.importance}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 mt-1">{f.title}</h4>
                      <p className="text-[11px] text-gray-600 leading-relaxed">{f.explanation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* High-Yield Predicted Questions */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-3">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#B71C1C]" />
                  Predicted Anna University Exam Questions & Model Answer Keys
                </h3>
                <div className="space-y-3">
                  {(docAnalysisResult.practiceQuestions || []).map((q, i) => (
                    <div key={i} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#B71C1C]">
                          Question #{i + 1} ({q.marks} Marks)
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                          {q.bloomLevel}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-gray-900">{q.question}</p>
                      <div className="p-3 rounded-lg bg-white border border-gray-200 text-xs text-gray-700 leading-relaxed">
                        <strong className="text-emerald-800 text-[11px] block mb-0.5">Model Answer & Marking Points:</strong>
                        {q.modelAnswer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Recall Flashcards */}
              {docAnalysisResult.flashcards && docAnalysisResult.flashcards.length > 0 && (
                <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-purple-700" />
                      <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                        Active Recall Flashcards ({activeFlashcardIndex + 1} of {docAnalysisResult.flashcards.length})
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-purple-800">
                      Click Card to Flip
                    </span>
                  </div>

                  {/* Interactive Flip Card */}
                  <div
                    onClick={() => setIsCardFlipped(!isCardFlipped)}
                    className="min-h-[160px] rounded-2xl border-2 border-purple-300 bg-white p-6 shadow-md flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 mb-2">
                      {isCardFlipped ? 'Answer / Concept Details' : 'Question / Term'}
                    </span>
                    <p className="text-sm font-bold text-gray-900 max-w-lg">
                      {isCardFlipped
                        ? docAnalysisResult.flashcards[activeFlashcardIndex].back
                        : docAnalysisResult.flashcards[activeFlashcardIndex].front}
                    </p>
                    <span className="text-[10px] text-gray-400 mt-4 flex items-center gap-1">
                      <RotateCw className="w-3 h-3" /> Tap to flip card
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      disabled={activeFlashcardIndex === 0}
                      onClick={() => {
                        setActiveFlashcardIndex((prev) => Math.max(0, prev - 1));
                        setIsCardFlipped(false);
                      }}
                      className="px-4 py-2 text-xs font-bold rounded-lg border border-purple-200 bg-white text-purple-900 disabled:opacity-40"
                    >
                      Previous Card
                    </button>
                    <button
                      type="button"
                      disabled={activeFlashcardIndex >= docAnalysisResult.flashcards.length - 1}
                      onClick={() => {
                        setActiveFlashcardIndex((prev) => prev + 1);
                        setIsCardFlipped(false);
                      }}
                      className="px-4 py-2 text-xs font-bold rounded-lg bg-purple-700 text-white hover:bg-purple-800 disabled:opacity-40"
                    >
                      Next Card
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: INTERACTIVE PRACTICE QUIZ */}
      {activeTab === 'quiz' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#B71C1C]" />
                  AI Diagnostic Concept Quiz: {quizTopic}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Test your understanding with instant reasoning feedback and scoring
                </p>
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={isGeneratingQuiz}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingQuiz ? 'animate-spin' : ''}`} />
                Generate New Questions
              </button>
            </div>

            {/* Questions List */}
            <div className="space-y-5">
              {quizQuestions.map((q, qIndex) => {
                const userSelected = selectedAnswers[q.id];
                const hasAnswered = userSelected !== undefined;
                const isCorrect = userSelected === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#B71C1C]">
                        Question {qIndex + 1}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                        {q.conceptTag || 'Concept Test'}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-gray-900 leading-relaxed">{q.question}</p>

                    {/* Choices */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {(q.options || []).map((opt: string, optIndex: number) => {
                        let btnStyle = 'border-gray-200 bg-white hover:border-gray-300 text-gray-800';

                        if (hasAnswered) {
                          if (optIndex === q.correctIndex) {
                            btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                          } else if (optIndex === userSelected) {
                            btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                          }
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => setSelectedAnswers({ ...selectedAnswers, [q.id]: optIndex })}
                            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{String.fromCharCode(65 + optIndex)}. {opt}</span>
                            {hasAnswered && optIndex === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation Box */}
                    {hasAnswered && (
                      <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                        isCorrect
                          ? 'bg-emerald-50/80 border border-emerald-200 text-emerald-900'
                          : 'bg-rose-50/80 border border-rose-200 text-rose-900'
                      }`}>
                        <strong>{isCorrect ? 'Correct!' : 'Incorrect.'} </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: MULTI-TURN AI ADVISOR CHATBOT */}
      {activeTab === 'chat' && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-xs flex flex-col h-[560px] animate-in fade-in overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#B71C1C] text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-gray-900">KIT AI Academic Advisor</h2>
                <p className="text-[10px] text-gray-500">
                  Anna University & Autonomous Regulation Expert
                </p>
              </div>
            </div>

            {/* High Thinking Toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
              <input
                type="checkbox"
                checked={highThinkingMode}
                onChange={(e) => setHighThinkingMode(e.target.checked)}
                className="w-4 h-4 rounded text-[#B71C1C] focus:ring-[#B71C1C]"
              />
              <span className="font-semibold text-gray-700 flex items-center gap-1">
                <BrainCircuit className="w-3.5 h-3.5 text-[#B71C1C]" />
                High Thinking Mode
              </span>
            </label>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gray-50/30">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#B71C1C] text-white shrink-0 mt-1">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-xl rounded-2xl p-3.5 text-xs leading-relaxed shadow-2xs ${
                    msg.role === 'user'
                      ? 'bg-[#B71C1C] text-white rounded-tr-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <span className={`block text-[9px] mt-1.5 ${msg.role === 'user' ? 'text-red-200' : 'text-gray-400'}`}>
                    {msg.time}
                  </span>
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-800 text-white shrink-0 mt-1">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isChatSending && (
              <div className="flex gap-3 items-center text-xs text-gray-500">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#B71C1C] text-white shrink-0">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-white border border-gray-200 p-3 rounded-2xl shadow-2xs">
                  <span className="italic">Thinking with pedagogical reasoning...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="p-2 border-t border-gray-100 bg-white flex items-center gap-2 overflow-x-auto text-[11px]">
            {[
              'Explain BCNF with a 5-minute real-world analogy',
              'Give 2-mark Anna University questions for Unit 3',
              'How to decompose relation into 3NF step-by-step?',
            ].map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setChatInput(prompt)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-[#B71C1C] font-semibold transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendChat} className="p-3 border-t border-gray-200 bg-white flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask anything about database normalization, algorithm complexity, exam strategies..."
              className="flex-1 p-2.5 text-xs rounded-xl border border-gray-200 focus:border-[#B71C1C] focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isChatSending}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#B71C1C] hover:bg-[#8E0000] text-white text-xs font-bold shadow-xs disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
