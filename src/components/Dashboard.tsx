import { DashboardStats } from "../types";
import { Award, Layers, Clock, Flame } from "lucide-react";

interface DashboardProps {
  stats: DashboardStats;
  onViewDueOnlyToggle: (dueOnly: boolean) => void;
  viewDueOnly: boolean;
}

export default function Dashboard({ stats, onViewDueOnlyToggle, viewDueOnly }: DashboardProps) {
  let subtext = "Every sprint is valid. There are no deadlines here.";
  if (stats.reviewsDueToday === 0) {
    if (stats.totalTopics === 0) {
      subtext = "Empty notebook. Capture whatever caught your fancy in the last 72 hours.";
    } else {
      subtext = "Clean desk! Go stretch, pet an animal, or let your mind wander.";
    }
  } else if (stats.reviewsDueToday <= 2) {
    subtext = "Just a tiny dose of review. Perfect for low executive function days.";
  } else {
    subtext = "A full review queue. Tackle them in bite-sized chunks, or ignore them. No pressure.";
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 md:p-6 rounded-2xl shadow-xl shadow-black/30 mb-8 flex flex-col gap-6">
      
      {/* Top section: Header & Toggle Buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-stone-300" />
            My Active Focus Registry
          </h2>
          <p className="text-xs font-mono text-stone-400 mt-1">
            {subtext}
          </p>
        </div>
        
        <button
          onClick={() => onViewDueOnlyToggle(!viewDueOnly)}
          className={`px-4 py-1.5 rounded-full border text-xs font-mono transition-all cursor-pointer ${
            viewDueOnly
              ? "bg-white text-black border-white shadow-lg shadow-white/10"
              : "bg-transparent text-white border-white/20 hover:border-white/40 hover:bg-white/5"
          }`}
        >
          {viewDueOnly ? "Filter: Showing Due Today" : "Filter: All Topics"}
        </button>
      </div>

      {/* Grid: 3 Glass Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Metric 1 */}
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-white/[0.04]">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Award className="w-5 h-5 text-stone-300" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
              {stats.averageScore}%
            </div>
            <div className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">
              Self-Reported Recall
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-white/[0.04]">
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Flame className="w-5 h-5 text-stone-300" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white tracking-tight">
              {stats.totalTopics}
            </div>
            <div className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">
              Topics Registered
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <button
          onClick={() => onViewDueOnlyToggle(true)}
          className={`p-4 rounded-xl flex items-center gap-4 transition-all hover:bg-white/[0.04] text-left cursor-pointer group border ${
            stats.reviewsDueToday > 0 
              ? "bg-white/10 border-white/20 hover:border-white/35" 
              : "bg-white/[0.02] border-white/5"
          }`}
        >
          <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <Clock className="w-5 h-5 text-stone-300 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="text-2xl font-mono font-bold text-white tracking-tight flex items-center gap-2">
              <span>{stats.reviewsDueToday}</span>
              {stats.reviewsDueToday > 0 && (
                <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              )}
            </div>
            <div className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">
              Reviews Due Today
            </div>
          </div>
        </button>

      </div>
    </div>
  );
}
