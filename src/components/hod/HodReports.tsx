import React, { useState } from 'react';
import { FileCheck2, Download, Printer, CheckCircle2, BarChart2, ShieldCheck } from 'lucide-react';

export const HodReports: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('attendance_audit');

  const handlePrintOrExport = (reportName: string) => {
    alert(`Exported official PDF: "${reportName}" for Office of Academic Dean.`);
  };

  return (
    <div id="hod-reports-view" className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            Academic Compliance & Accreditation
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Department Audit & NBA / NAAC Reports</h1>
          <p className="text-xs text-gray-500 mt-1">
            Department of AI & Data Science • Statistical summaries ready for internal and external inspections.
          </p>
        </div>

        <button
          onClick={() => handlePrintOrExport('Comprehensive_Department_Audit_2026.pdf')}
          className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Audit Bundle</span>
        </button>
      </div>

      {/* Reports Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            id: 'attendance_audit',
            title: 'Attendance Shortage & Condonation List',
            desc: 'Complete roster of students with attendance < 75% for Anna University reporting.',
            badge: 'Mandatory COE File',
            generated: 'Updated 24 Mar 2026',
          },
          {
            id: 'nba_co_po',
            title: 'NBA Criteria 3: Course Outcome (CO-PO) Attainment',
            desc: 'Direct & indirect attainment calculations across all 18 curriculum courses.',
            badge: 'NBA Ready',
            generated: 'Updated 20 Mar 2026',
          },
          {
            id: 'ia_marks_sheet',
            title: 'Continuous Internal Assessment (CIA) Master Sheet',
            desc: 'Consolidated Internal Assessment 1, 2, and Model Exam marks verified by faculty.',
            badge: 'Verified',
            generated: 'Updated 22 Mar 2026',
          },
        ].map((rep) => (
          <div
            key={rep.id}
            onClick={() => setSelectedReport(rep.id)}
            className={`p-5 rounded-xl border cursor-pointer transition-all ${
              selectedReport === rep.id
                ? 'border-red-300 bg-red-50/40 shadow-xs'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-[#B71C1C]">
                {rep.badge}
              </span>
              <span className="text-[10px] text-gray-400">{rep.generated}</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 leading-snug">{rep.title}</h3>
            <p className="text-xs text-gray-600 mt-2 leading-relaxed">{rep.desc}</p>
            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#B71C1C]">View Document →</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrintOrExport(rep.title);
                }}
                className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Document */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-xs">
        <div className="border-b border-gray-200 pb-4 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {selectedReport === 'attendance_audit'
                ? 'Official Attendance Condonation & Shortage Audit (Sem V)'
                : selectedReport === 'nba_co_po'
                ? 'NBA CO-PO Direct Attainment Summary Table'
                : 'Consolidated Internal Assessment Master Statement'}
            </h2>
            <p className="text-xs text-gray-500">
              Department of Artificial Intelligence & Data Science • Academic Year 2025-2026
            </p>
          </div>
          <button
            onClick={() => handlePrintOrExport('Current_View.pdf')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700"
          >
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>

        {/* Mock Sample Document Table */}
        <table className="w-full text-left text-xs text-gray-700">
          <thead className="border-b border-gray-200 bg-gray-50 text-[11px] font-bold uppercase text-gray-500">
            <tr>
              <th className="px-4 py-2.5">Reg. Number</th>
              <th className="px-4 py-2.5">Student Name</th>
              <th className="px-4 py-2.5 text-center">Current Attendance</th>
              <th className="px-4 py-2.5 text-center">Subjects Below 75%</th>
              <th className="px-4 py-2.5 text-center">Status / Recommendation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="px-4 py-3 font-mono font-bold">711522205004</td>
              <td className="px-4 py-3 font-semibold">Deepak K</td>
              <td className="px-4 py-3 text-center font-bold text-red-600">68.2%</td>
              <td className="px-4 py-3 text-center">AD3302 (DBMS), CS3301 (DSA)</td>
              <td className="px-4 py-3 text-center text-red-700 font-bold">Condonation Required</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono font-bold">711522205023</td>
              <td className="px-4 py-3 font-semibold">Karthik R</td>
              <td className="px-4 py-3 text-center font-bold text-amber-600">77.5%</td>
              <td className="px-4 py-3 text-center">AD3302 (77.5%)</td>
              <td className="px-4 py-3 text-center text-amber-700 font-bold">Eligible (Under Monitoring)</td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono font-bold">711522205012</td>
              <td className="px-4 py-3 font-semibold">Gowtham M</td>
              <td className="px-4 py-3 text-center font-bold text-emerald-700">92.4%</td>
              <td className="px-4 py-3 text-center">None</td>
              <td className="px-4 py-3 text-center text-emerald-700 font-bold">Safe & Eligible</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
