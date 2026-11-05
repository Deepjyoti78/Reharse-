import React, { useState } from 'react';
import { 
  History, 
  Search, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Trash2, 
  Eye, 
  Sparkles 
} from 'lucide-react';
import { useInterview } from '../../context/InterviewContext';
import type { PerformanceReport } from '../../types/interview';
import { instantScrollToTop } from '../../utils/scroll';

export const InterviewHistoryView: React.FC = () => {
  const { 
    pastReports, 
    setActiveReport, 
    setCurrentStage, 
    setCurrentView, 
    deleteReportFromHistory, 
    startInterviewFlow 
  } = useInterview();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');

  const filteredReports = pastReports.filter(report => {
    const matchesQuery = 
      report.jobRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.interviewerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.performanceLabel.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedTypeFilter === 'all' || report.interviewType === selectedTypeFilter;

    return matchesQuery && matchesType;
  });

  const handleOpenReport = (report: PerformanceReport) => {
    setActiveReport(report);
    setCurrentStage('report');
    setCurrentView('interview-flow');
    instantScrollToTop();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 md:py-12 font-sans">
      {/* Return button */}
      <button
        onClick={() => setCurrentView('landing')}
        className="inline-flex items-center gap-1.5 text-xs text-[#3a2318]/70 hover:text-[#3a2318] mb-6 font-medium transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Home</span>
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3a2318]/10 text-[#3a2318] text-[11px] font-mono uppercase tracking-wider mb-2">
            <History className="w-3 h-3 text-[#b4532a]" />
            <span>Session Archives</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#2a170f] font-normal leading-tight">
            Interview History & <em className="italic text-[#b4532a]">Reports.</em>
          </h1>
          <p className="text-xs sm:text-sm text-[#3a2318]/75 font-sans mt-1">
            Review past transcripts, evaluation scores, and track your performance trajectory.
          </p>
        </div>

        <button
          onClick={() => startInterviewFlow()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-[#fbf7ee] text-xs font-medium transition-all shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#dfa84c]" />
          <span>Start New Rehearsal</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#3a2318]/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by role, interviewer or score..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#f5e9d0] border border-[#3a2318]/20 text-xs text-[#2a170f] placeholder:text-[#3a2318]/45 focus:outline-none focus:border-[#b4532a] focus:bg-[#fbf5e6] transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'technical', 'behavioral', 'hr', 'coding'].map((track) => (
            <button
              key={track}
              type="button"
              onClick={() => setSelectedTypeFilter(track)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize whitespace-nowrap transition-all ${
                selectedTypeFilter === track
                  ? 'bg-[#3a2318] text-[#f8eed8]'
                  : 'bg-[#f0e3c5] text-[#3a2318] hover:bg-[#e4d4b1]'
              }`}
            >
              {track === 'all' ? 'All Tracks' : track}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      {filteredReports.length > 0 ? (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <div
              key={report.id}
              className="rounded-2xl bg-[#faf5e8] border border-[#3a2318]/15 p-5 shadow-xs hover:border-[#3a2318]/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 interactive-card"
            >
              <div className="flex items-start gap-4">
                {/* Score badge */}
                <div className="w-14 h-14 rounded-2xl bg-[#3a2318] text-[#f8eed8] flex flex-col items-center justify-center shrink-0 border border-[#3a2318]">
                  <span className="font-serif text-xl font-bold leading-none text-[#dfa84c]">
                    {report.overallScore}
                  </span>
                  <span className="text-[9px] font-mono text-[#f8eed8]/60 mt-0.5">/ 100</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-serif text-xl text-[#2a170f] font-normal">
                      {report.jobRole}
                    </h3>
                    <span className="text-[10px] font-mono uppercase bg-[#b4532a]/10 text-[#b4532a] px-2 py-0.5 rounded-full font-medium">
                      {report.interviewType}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#3a2318]/70 font-sans">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 opacity-60" />
                      <span>{report.createdAt}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 opacity-60" />
                      <span>{report.durationMinutes} min session</span>
                    </span>
                    <span>•</span>
                    <span>Interviewer: {report.interviewerName}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleOpenReport(report)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#b4532a] hover:bg-[#97421f] text-white text-xs font-medium transition-all shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Report</span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteReportFromHistory(report.id)}
                  className="p-2 rounded-xl text-red-800 hover:bg-red-100/70 transition-colors cursor-pointer"
                  title="Delete Session"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl bg-[#faf5e8] border border-[#3a2318]/15 p-12 text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#3a2318]/10 text-[#3a2318] flex items-center justify-center mx-auto mb-4">
            <History className="w-8 h-8 text-[#b4532a]" />
          </div>
          <h3 className="font-serif text-2xl text-[#2a170f] mb-2">No Past Sessions Found</h3>
          <p className="text-xs sm:text-sm text-[#3a2318]/70 font-sans mb-6">
            Complete your first simulated mock round to receive tactical AI feedback, rubric scores, and a detailed performance scorecard.
          </p>
          <button
            onClick={() => startInterviewFlow()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#b4532a] hover:bg-[#97421f] text-white text-xs font-medium transition-all shadow-md cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dfa84c]" />
            <span>Start First Mock Interview</span>
          </button>
        </div>
      )}
    </div>
  );
};
