import React from 'react';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  UserCheck,
  ClipboardCheck,
  Award,
  BarChart3,
  BookOpen,
  Users,
  ShieldCheck,
  Clock,
  TrendingUp,
  BrainCircuit,
  Activity,
  Layers,
  ChevronRight,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { Role } from '../../types';

interface LandingPageProps {
  onNavigateToLogin: (role?: Role) => void;
  onNavigateToCourses: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToLogin,
  onNavigateToCourses,
}) => {
  return (
    <div className="w-full bg-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-gray-200 bg-gradient-to-b from-red-50/70 via-white to-gray-50/30 pt-12 pb-20 lg:pt-16 lg:pb-24">
        {/* Subtle decorative circles */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3.5 py-1.5 shadow-2xs">
                <span className="flex h-2 w-2 rounded-full bg-[#B71C1C] animate-ping" />
                <span className="text-xs font-bold text-[#B71C1C]">KIT COIMBATORE • ACADEMIC INTELLIGENCE ERP</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-gray-900 leading-[1.15]">
                Smart Academic Management for <span className="text-[#B71C1C]">Modern Education</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                A unified academic platform connecting students, faculty, HODs, and administrators with predictive AI academic intelligence to detect learning gaps, track attendance, and optimize semester performance.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  id="btn-hero-login"
                  onClick={() => onNavigateToLogin()}
                  className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-[#D32F2F] hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>Login to Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="btn-hero-courses"
                  onClick={onNavigateToCourses}
                  className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-3.5 text-sm font-bold text-gray-800 shadow-2xs hover:border-red-300 hover:bg-red-50/40 transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-[#B71C1C]" />
                  <span>Explore Courses</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-gray-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Autonomous Institution
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  NAAC &apos;A+&apos; Grade Accredited
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Anna University Affiliated
                </span>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-red-50 text-[#B71C1C]">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-900">AI Diagnostic Engine</p>
                      <p className="text-[10px] text-gray-500">Live Academic Risk Detection</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                    MEDIUM RISK
                  </span>
                </div>

                {/* Metric Bars */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-gray-600">DBMS Attendance</span>
                      <span className="text-[#B71C1C] font-bold">77.5% (Warning)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-amber-500" style={{ width: '77.5%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-gray-600">DSA Tree Algorithmic Mastery</span>
                      <span className="text-gray-900 font-bold">88.1% (Strong)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-[#B71C1C]" style={{ width: '88.1%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-gray-600">Python for Data Science</span>
                      <span className="text-emerald-700 font-bold">94.7% (Top 5%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: '94.7%' }} />
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Snippet */}
                <div className="mt-4 rounded-xl border border-red-100 bg-red-50/60 p-3">
                  <p className="text-xs font-bold text-[#B71C1C] flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    Personalized AI Action Plan:
                  </p>
                  <p className="text-xs text-gray-700 mt-1 leading-snug">
                    Revise <strong>BCNF Normalization</strong> & attend 2 upcoming DBMS lectures to secure university eligibility.
                  </p>
                </div>

                {/* Quick Role Triggers */}
                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-4 gap-1.5 text-center">
                  {(['student', 'faculty', 'hod', 'admin'] as Role[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => onNavigateToLogin(role)}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 hover:text-[#B71C1C] border border-gray-100 text-[11px] font-bold capitalize transition-colors"
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DEMO INSTITUTIONAL STATISTICS */}
      <section className="border-b border-gray-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl font-black text-[#B71C1C]">2,400+</p>
              <p className="text-xs font-bold text-gray-700 mt-1">Enrolled Students</p>
              <p className="text-[10px] text-gray-400">UG & PG Programs</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-black text-[#B71C1C]">120+</p>
              <p className="text-xs font-bold text-gray-700 mt-1">Faculty Members</p>
              <p className="text-[10px] text-gray-400">Ph.D & Senior Grantees</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-black text-[#B71C1C]">6</p>
              <p className="text-xs font-bold text-gray-700 mt-1">Departments</p>
              <p className="text-[10px] text-gray-400">Engineering & Tech</p>
            </div>
            <div className="p-4">
              <p className="text-3xl font-black text-[#B71C1C]">150+</p>
              <p className="text-xs font-bold text-gray-700 mt-1">Curricular Courses</p>
              <p className="text-[10px] text-gray-400">Anna Univ / Autonomous</p>
            </div>
            <div className="p-4 col-span-2 md:col-span-1">
              <p className="text-3xl font-black text-[#B71C1C]">98.4%</p>
              <p className="text-xs font-bold text-gray-700 mt-1">AI Diagnostic Accuracy</p>
              <p className="text-[10px] text-gray-400">Validated on 10k Records</p>
            </div>
          </div>
          <p className="text-[11px] text-center text-gray-400 mt-2">
            * Demonstration statistical metrics for Kalaignar Karunanidhi Institute of Technology (KIT).
          </p>
        </div>
      </section>

      {/* 3. PLATFORM CORE MODULES */}
      <section className="py-16 bg-gray-50/50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-wider text-[#B71C1C] uppercase">
              Comprehensive ERP Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Everything Needed for Academic Excellence
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Integrated workflows connecting daily lecture delivery, periodic evaluations, and administrative oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                title: 'Student Management',
                desc: 'Complete student academic profiles, registrations, semester course enrollments, and mentor mappings.',
                icon: Users,
              },
              {
                title: 'Faculty Management',
                desc: 'Subject workload assignments, timetable scheduling, teaching plans, and student performance rosters.',
                icon: GraduationCap,
              },
              {
                title: 'Attendance Engine',
                desc: 'Period-wise digital attendance recording, threshold alerts (<75%), and automated eligibility computation.',
                icon: UserCheck,
              },
              {
                title: 'Assignments & Submissions',
                desc: 'Digital assignment creation, file submissions, deadline monitoring, and rubrics-based grading.',
                icon: ClipboardCheck,
              },
              {
                title: 'Examinations & Seating',
                desc: 'Internal Assessments (IA1, IA2), Model exams, University schedules, and hall tickets.',
                icon: Clock,
              },
              {
                title: 'Marks & Results',
                desc: 'Instant grade calculation (O, A+, A, B, RA), automated SGPA/CGPA formulas, and transcript generation.',
                icon: Award,
              },
              {
                title: 'Department Analytics',
                desc: 'Section comparisons, subject pass rates, historical trends, and institutional audit reporting.',
                icon: BarChart3,
              },
              {
                title: 'AI Academic Intelligence',
                desc: 'Risk detection, weak topic diagnostic analysis, and personalized 7-day revision roadmaps.',
                icon: Sparkles,
                highlight: true,
              },
            ].map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div
                  key={index}
                  className={`rounded-xl border p-5 transition-all ${
                    feat.highlight
                      ? 'border-red-200 bg-red-50/50 shadow-xs'
                      : 'border-gray-200 bg-white shadow-2xs hover:border-red-200 hover:shadow-xs'
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg w-fit mb-3.5 ${
                      feat.highlight
                        ? 'bg-[#B71C1C] text-white'
                        : 'bg-red-50 text-[#B71C1C]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{feat.title}</h3>
                  <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. AI-POWERED ACADEMIC INTELLIGENCE DEEP DIVE & FLOWCHART */}
      <section className="py-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 via-white to-red-50/40 p-8 sm:p-12 shadow-sm">
            <div className="max-w-3xl mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B71C1C] text-white text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Core Differentiator
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                AI-Powered Academic Intelligence
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                Rather than treating academic data as passive archives, KIT&apos;s AI Engine proactively correlates attendance velocity, assessment dips, and topic difficulties to provide explainable risk evaluations and personalized study guidance.
              </p>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-2xs mb-8">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">
                Autonomous Academic Intelligence Pipeline
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 text-center">
                {[
                  { step: '1. Academic Data', desc: 'Attendance, IAs, Assignments, Exam scores' },
                  { step: '2. Data Processing', desc: 'Weighted normalization & trend vectorization' },
                  { step: '3. AI Analysis', desc: 'Gemini 3.7 + statistical ML inference' },
                  { step: '4. Risk Detection', desc: 'LOW / MEDIUM / HIGH risk classification' },
                  { step: '5. Personalized Guidance', desc: 'Weak topic remediation & study schedules' },
                  { step: '6. Academic Growth', desc: 'Target SGPA progression & pass rate gains' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center p-3 rounded-lg border border-red-100 bg-red-50/30 relative"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#B71C1C] text-white text-xs font-bold mb-2">
                      {idx + 1}
                    </div>
                    <p className="text-xs font-bold text-gray-900">{item.step}</p>
                    <p className="text-[10px] text-gray-500 mt-1 leading-snug">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Explainability Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B71C1C] mb-1">
                  <Activity className="w-4 h-4" />
                  Multi-Factor Correlation
                </div>
                <p className="text-xs text-gray-600">
                  Combines daily attendance records, assignment timelines, and 2-phase internal assessments.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B71C1C] mb-1">
                  <BrainCircuit className="w-4 h-4" />
                  Topic-Level Diagnosis
                </div>
                <p className="text-xs text-gray-600">
                  Pinpoints discrete concepts (e.g. BCNF decomposition, AVL balancing) rather than generic subject failures.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B71C1C] mb-1">
                  <TrendingUp className="w-4 h-4" />
                  Transparent Explainability
                </div>
                <p className="text-xs text-gray-600">
                  Never shows an AI risk prediction without itemizing the exact contributing mathematical factors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ROLE PATHWAYS & CALL TO ACTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              Access Your Academic Role
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Select your persona below to experience the customized dashboards and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                role: 'student' as Role,
                title: 'Student Portal',
                desc: 'Track attendance, download notes, submit assignments, check SGPA, and view personalized AI recommendations.',
                buttonText: 'Student Login',
              },
              {
                role: 'faculty' as Role,
                title: 'Faculty Portal',
                desc: 'Mark daily attendance, evaluate assignment submissions, upload exam marks, and generate AI test papers.',
                buttonText: 'Faculty Login',
              },
              {
                role: 'hod' as Role,
                title: 'HOD Portal',
                desc: 'Department-wide attendance audits, subject pass rates, at-risk student intervention rosters, and faculty workload.',
                buttonText: 'HOD Login',
              },
              {
                role: 'admin' as Role,
                title: 'Administrator ERP',
                desc: 'College-wide student records, faculty assignments, course curriculum catalogs, and institutional compliance reports.',
                buttonText: 'Admin Login',
              },
            ].map((p, idx) => (
              <div
                key={idx}
                className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:border-red-300 hover:shadow-md transition-all text-center"
              >
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-[#B71C1C] mb-3">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">{p.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">{p.desc}</p>
                </div>

                <button
                  onClick={() => onNavigateToLogin(p.role)}
                  className="mt-5 w-full rounded-lg bg-[#B71C1C] py-2 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors"
                >
                  {p.buttonText} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. INSTITUTIONAL FOOTER */}
      <footer className="border-t border-gray-200 bg-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#B71C1C] text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-black text-gray-900">KIT Coimbatore</p>
                <p className="text-[10px] text-gray-500">
                  Kalaignar Karunanidhi Institute of Technology • Academic Management System
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
              <span>KIT Campus, Kannampalayam Post, Coimbatore - 641402</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
