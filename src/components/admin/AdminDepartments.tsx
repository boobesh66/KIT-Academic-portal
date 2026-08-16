import React, { useState } from 'react';
import { Building2, Users, GraduationCap, Plus, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { DEPARTMENTS } from '../../data/mockData';
import { Department } from '../../types';

export const AdminDepartments: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>(DEPARTMENTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [hodName, setHodName] = useState('');
  const [studentCount, setStudentCount] = useState(240);
  const [facultyCount, setFacultyCount] = useState(16);

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name,
      code,
      hodName,
      totalStudents: Number(studentCount),
      totalFaculty: Number(facultyCount),
      averageAttendance: 88.5,
      averagePassRate: 92.0,
      atRiskCount: 4,
    };
    setDepartments([...departments, newDept]);
    setShowAddModal(false);
    setName('');
    setCode('');
    setHodName('');
  };

  return (
    <div id="admin-departments-view" className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            Academic Infrastructure
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Academic Departments & Branches</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage engineering divisions, HOD appointments, sanctioned intake, and faculty allotments.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Department</span>
        </button>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-xs hover:border-red-200 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded bg-red-50 px-2.5 py-1 text-xs font-bold text-[#B71C1C] border border-red-100">
                  {dept.code}
                </span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  NBA Accredited
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 leading-snug">{dept.name}</h3>
              <p className="text-xs text-gray-600 mt-1">
                <strong>HOD: </strong>
                {dept.hodName}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2 rounded bg-gray-50 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Students</p>
                  <p className="text-sm font-black text-gray-900 mt-0.5">{dept.studentCount}</p>
                </div>
                <div className="p-2 rounded bg-gray-50 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Faculty</p>
                  <p className="text-sm font-black text-gray-900 mt-0.5">{dept.facultyCount}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span>Sanctioned Intake: {dept.studentCount / 4} / yr</span>
              <button
                onClick={() => alert(`Editing department settings for ${dept.name}`)}
                className="text-[#B71C1C] font-semibold hover:underline"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
            <h3 className="text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              Add New Engineering Department
            </h3>
            <form onSubmit={handleAddDepartment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Biomedical Engineering"
                  className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Program Code</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. BME"
                    className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Head of Dept (HOD)</label>
                  <input
                    type="text"
                    required
                    value={hodName}
                    onChange={(e) => setHodName(e.target.value)}
                    placeholder="e.g. Dr. K. Sundaram"
                    className="w-full p-2 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#B71C1C] hover:bg-[#D32F2F] rounded-lg shadow-xs"
                >
                  Save Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
