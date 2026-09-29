import React from 'react';
import { mockMoMs } from '../../data/mockData';
import { MessageSquare, Calendar, Clock, Users, CheckCircle2, Plus } from 'lucide-react';

export default function MeetingsMomView() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Minutes of Meeting (MoM) Archive</h2>
          <p className="text-xs text-slate-500 mt-0.5">Centralized record of team syncs, sprint retrospectives, and architecture reviews</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-semibold shadow-sm transition-all">
          <Plus className="w-3.5 h-3.5" />
          <span>Publish New MoM</span>
        </button>
      </div>

      <div className="space-y-4">
        {mockMoMs.map((mom) => (
          <div
            key={mom.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{mom.title}</h3>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> {mom.date}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {mom.time}
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Organizer:</span>
                <p className="font-bold text-slate-800 mt-0.5">{mom.organizer}</p>
                <span className="text-slate-400 font-medium mt-2 block">Track:</span>
                <p className="font-semibold text-slate-700 mt-0.5">{mom.project}</p>
                <span className="text-slate-400 font-medium mt-2 block">Attendees:</span>
                <p className="font-semibold text-slate-700 mt-0.5">{mom.attendees} participants</p>
              </div>

              <div className="md:col-span-2">
                <span className="text-slate-400 font-medium block mb-2">Key Decisions & Agreed Action Items:</span>
                <ul className="space-y-1.5">
                  {mom.keyDecisions.map((dec, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>{dec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

