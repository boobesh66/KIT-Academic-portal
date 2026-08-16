import React, { useState } from 'react';
import { Calendar, Clock, MapPin, User, Download, Filter } from 'lucide-react';
import { TimetableSlot } from '../../types';
import { TIMETABLE_SLOTS } from '../../data/mockData';

interface StudentTimetableProps {
  slots?: TimetableSlot[];
}

export const StudentTimetable: React.FC<StudentTimetableProps> = ({ slots = TIMETABLE_SLOTS }) => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = [
    { num: 1, time: '09:00 - 10:00' },
    { num: 2, time: '10:00 - 11:00' },
    { num: 3, time: '11:15 - 12:15' },
    { num: 4, time: '12:15 - 01:15' },
    { num: 5, time: '01:45 - 02:45' },
    { num: 6, time: '02:45 - 03:45' },
    { num: 7, time: '03:45 - 04:45' },
  ];

  const filteredSlots = slots.filter((s) => s.day === selectedDay);

  return (
    <div id="student-timetable-view" className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#B71C1C] uppercase tracking-wider">
            Academic Schedule • Even Semester 2025-2026
          </span>
          <h1 className="text-2xl font-black text-gray-900 mt-1">Class Timetable & Venues</h1>
          <p className="text-xs text-gray-500 mt-1">
            Department of AI & Data Science • Year III • Section A (LH-302).
          </p>
        </div>

        <button
          onClick={() => alert('Official Section A Timetable PDF downloaded.')}
          className="flex items-center gap-2 rounded-xl bg-[#B71C1C] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#D32F2F] transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Timetable PDF</span>
        </button>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`rounded-lg px-5 py-2 text-xs font-bold transition-all ${
              selectedDay === day
                ? 'bg-[#B71C1C] text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Daily Schedule Timeline */}
      <div className="space-y-3">
        {filteredSlots.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-white border border-gray-200">
            <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-xs text-gray-500">No scheduled sessions for this day.</p>
          </div>
        ) : (
          filteredSlots.map((slot, idx) => (
            <div
              key={slot.id}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white hover:border-red-200 hover:shadow-xs transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center h-14 w-24 rounded-lg bg-red-50 text-center shrink-0 border border-red-100">
                  <span className="text-[10px] font-bold text-[#B71C1C] uppercase">
                    Slot {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-gray-800 mt-0.5">
                    {slot.type}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#B71C1C] bg-red-50 px-2 py-0.5 rounded">
                      {slot.subjectCode}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900">{slot.subjectName}</h3>
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                      {slot.facultyName}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      Room {slot.room}
                    </span>
                  </div>
                </div>
              </div>

              <span className="hidden sm:inline-block text-xs font-semibold px-2.5 py-1 rounded bg-gray-100 text-gray-700">
                {slot.time}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Break timings notice */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>Tea Break: 11:00 AM - 11:15 AM • Lunch Break: 01:15 PM - 01:45 PM</span>
        </div>
        <span className="text-gray-400 text-[11px]">KIT Academic Time Regulations</span>
      </div>
    </div>
  );
};
