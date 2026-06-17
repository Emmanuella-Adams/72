import { useState, useEffect } from "react";
import { 
  getTopics, 
  createTopic, 
  deleteTopic, 
  submitSelfEvaluation, 
  getDashboardStats 
} from "./lib/storage";
import { LearningTopic, SelfEvaluation } from "./types";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import CreateTopic from "./components/CreateTopic";
import TopicList from "./components/TopicList";
import TopicDetail from "./components/TopicDetail";
import { Info, Sparkles, AlertCircle, Heart, Github } from "lucide-react";

export default function App() {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [viewDueOnly, setViewDueOnly] = useState(false);

  // Initialize topics lists on load
  useEffect(() => {
    const loaded = getTopics();
    setTopics(loaded);
    if (loaded.length > 0) {
      setSelectedTopic(loaded[0]);
    }
  }, []);

  const handleAddTopic = (title: string, notes: string, customQuestions: string[]) => {
    const newTopic = createTopic(title, notes, customQuestions);
    const updated = getTopics();
    setTopics(updated);
    setSelectedTopic(newTopic);
  };

  const handleDeleteTopic = (id: string) => {
    deleteTopic(id);
    const updated = getTopics();
    setTopics(updated);
    
    if (selectedTopic?.id === id) {
      setSelectedTopic(updated.length > 0 ? updated[0] : null);
    }
  };

  const handleUpdateTopicScore = (
    id: string,
    explanation: string,
    evaluation: SelfEvaluation
  ) => {
    const updated = submitSelfEvaluation(id, explanation, evaluation);
    if (updated) {
      const allUpdated = getTopics();
      setTopics(allUpdated);
      setSelectedTopic(updated);
    }
  };

  const stats = getDashboardStats(topics);

  return (
    <div className="min-h-screen px-4 py-8 md:py-12 max-w-7xl mx-auto selection:bg-white selection:text-black">
      {/* App Header */}
      <Header />

      {/* Stats Dashboard */}
      <Dashboard 
        stats={stats} 
        onViewDueOnlyToggle={setViewDueOnly} 
        viewDueOnly={viewDueOnly} 
      />

      {/* Core Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        
        {/* Left Side Column: Topic List & Entry (Takes 5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <CreateTopic onAddTopic={handleAddTopic} />
          
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-xl shadow-black/20">
            <h3 className="font-serif font-bold text-sm uppercase tracking-wider text-white mb-4 flex items-center justify-between">
              <span>My Subject Catalog</span>
              <span className="text-[10px] font-mono text-stone-400 lowercase font-normal">
                {topics.length} registered
              </span>
            </h3>
            
            <TopicList
              topics={topics}
              onSelectTopic={setSelectedTopic}
              onDeleteTopic={handleDeleteTopic}
              selectedTopicId={selectedTopic?.id}
              viewDueOnly={viewDueOnly}
            />
          </div>

          {/* AuDHD Inclusive Info banner */}
          <div className="bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-4 md:p-5 font-mono text-xs leading-relaxed space-y-3 text-stone-300">
            <div className="flex items-center gap-1.5 font-bold mb-1 border-b border-white/5 pb-2 text-white">
              <AlertCircle className="w-4 h-4 text-stone-400" />
              <span>Study Philosophy for "72":</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              <strong>1. No AI cheating signals:</strong> We removed grading bots. It is just you and your honest assessment. If you didn't remember something, just mark it. No shame, no AI anxiety.
            </p>
            <p className="text-[11px] leading-relaxed">
              <strong>2. Hyperfocus Sprints:</strong> When a new obsession strikes, dump your source notes immediately. This lifts the "mental tabs" burden.
            </p>
            <p className="text-[11px] leading-relaxed">
              <strong>3. Spaced Repetition:</strong> We schedule reviews in 1, 3, 7, 14, and 30-day increments. If you rate yourself low, the interval downshifts gently.
            </p>
          </div>
        </div>

        {/* Right Side Column: Active Recall & Detailed Session Desk (Takes 7 cols) */}
        <div className="lg:col-span-7">
          {selectedTopic ? (
            <TopicDetail
              key={selectedTopic.id}
              topic={selectedTopic}
              onUpdateTopic={handleUpdateTopicScore}
            />
          ) : (
            <div className="border border-dashed border-white/10 p-12 text-center bg-white/[0.01] rounded-3xl flex flex-col items-center justify-center min-h-[440px] shadow-inner">
              <Sparkles className="w-10 h-10 text-stone-500 mb-4 stroke-[1.5]" />
              <h3 className="text-xl font-serif font-bold text-white mb-2">No Topic Selected</h3>
              <p className="max-w-md font-mono text-xs text-stone-400 leading-relaxed">
                Log or select a learning subject from your catalog to trigger your self-explanation study desk. Embrace the slow, tactile rhythm of learning without external pressure.
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Humble simple minimalist footer */}
      <footer className="mt-16 pt-8 border-t border-white/10 text-center font-mono text-[10px] text-stone-500 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col items-start gap-1.5 text-left">
          <span>© {new Date().getFullYear()} Seventy-Two. All data resides safely in your browser storage.</span>
          <span className="text-[9px] text-stone-600 block leading-normal">
            with ❤️ from the neurodivergent family. (Don't mind me, off topic: I also explain quantum and AI simply, check out my <a href="https://ladyanuelle.vercel.app" target="_blank" rel="noreferrer" className="underline hover:text-stone-400">studio</a>.)
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="https://github.com/Emmanuella-Adams/72"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
          <span className="flex items-center gap-1.5">
            Made by <a href="https://emmanuellaadams.vercel.app/" target="_blank" rel="noreferrer" className="underline text-stone-400 hover:text-white transition-colors">Emma Adams</a> with <Heart className="w-3 h-3 text-stone-500 fill-stone-500" />
          </span>
        </div>
      </footer>
    </div>
  );
}
