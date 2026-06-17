import { useState } from "react";
import { LearningTopic } from "../types";
import { Search, Calendar, Trash2, ArrowRight, Hourglass } from "lucide-react";

interface TopicListProps {
  topics: LearningTopic[];
  onSelectTopic: (topic: LearningTopic) => void;
  onDeleteTopic: (id: string) => void;
  selectedTopicId?: string;
  viewDueOnly: boolean;
}

export default function TopicList({
  topics,
  onSelectTopic,
  onDeleteTopic,
  selectedTopicId,
  viewDueOnly,
}: TopicListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const isDue = (topic: LearningTopic) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const reviewDate = new Date(topic.nextReviewDate);
    reviewDate.setHours(0, 0, 0, 0);
    return reviewDate.getTime() <= today.getTime();
  };

  const filteredTopics = topics.filter((topic) => {
    const matchesSearch =
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.notes.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (viewDueOnly) {
      return matchesSearch && isDue(topic);
    }
    return matchesSearch;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Search Input styled beautifully */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="w-4 h-4 text-stone-500" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter studies..."
          className="w-full bg-white/5 border border-white/10 text-white rounded-xl pl-9 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-white/25 placeholder:text-stone-500 transition-colors"
        />
      </div>

      {filteredTopics.length === 0 ? (
        <div className="border border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/[0.01]">
          <p className="text-stone-400 font-mono text-xs leading-relaxed">
            {viewDueOnly
              ? "Wonderful! No hyperfocus repeats due today. Take a cognitive break."
              : "No matches in your register. Hit 'Record' above to jot down a new sprint."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredTopics.map((topic) => {
            const dueNow = isDue(topic);
            const score = topic.evaluation?.score;
            const isSelected = selectedTopicId === topic.id;

            return (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic)}
                className={`group border rounded-xl p-3.5 text-left transition-all duration-150 cursor-pointer flex justify-between items-start gap-3 ${
                  isSelected
                    ? "bg-white text-black border-white shadow-xl shadow-white/5"
                    : "bg-white/[0.02] text-white border-white/5 hover:bg-white/5 hover:border-white/10"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {dueNow ? (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono leading-none flex items-center gap-1 font-bold ${
                        isSelected 
                          ? "bg-black text-white" 
                          : "bg-white text-black shadow-sm py-0.5"
                      }`}>
                        <Hourglass className="w-2.5 h-2.5" />
                        DUE
                      </span>
                    ) : (
                      <span className={`px-1.5 py-0.5 rounded border text-[9px] font-mono leading-none ${
                        isSelected ? "border-black/20 text-black/60" : "border-white/10 text-stone-400"
                      }`}>
                        {topic.intervalDays}d rate
                      </span>
                    )}

                    {score !== undefined && (
                      <span className={`text-[9.5px] font-mono font-bold leading-none uppercase ${
                        isSelected ? "text-stone-800" : "text-stone-300"
                      }`}>
                        Score: {score}%
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-serif font-bold truncate leading-snug">
                    {topic.title}
                  </h4>

                  <p className={`text-[11px] truncate font-sans mt-1 leading-normal ${
                    isSelected ? "text-black/60" : "text-stone-400"
                  }`}>
                    {topic.notes}
                  </p>

                  <div className={`flex items-center gap-1 text-[9.5px] font-mono mt-2.5 ${
                    isSelected ? "text-black/55" : "text-stone-400"
                  }`}>
                    <Calendar className="w-3 h-3" />
                    <span>Next: {new Date(topic.nextReviewDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric"
                    })}</span>
                  </div>
                </div>

                {/* Delete and selection visual cues */}
                <div className="flex flex-col items-end gap-3 self-stretch justify-between shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to remove this focus topic from local storage?")) {
                        onDeleteTopic(topic.id);
                      }
                    }}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      isSelected
                        ? "border-black/10 text-black/60 hover:bg-black/5 hover:text-red-700"
                        : "border-white/5 text-stone-500 bg-white/5 hover:bg-white/10 hover:text-red-400"
                    }`}
                    title="Delete topic"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <ArrowRight className={`w-4 h-4 transition-transform ${
                    isSelected ? "translate-x-1 text-black" : "text-stone-400 group-hover:translate-x-1"
                  }`} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
