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
import { Info, Sparkles, AlertCircle, Heart, Github, BookOpen, X } from "lucide-react";

export default function App() {
  const [topics, setTopics] = useState<LearningTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [viewDueOnly, setViewDueOnly] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

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
      <Header onOpenStory={() => setIsStoryOpen(true)} />

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

      {/* Emma's Story/Origins Modal at absolute root level for flawless overlay z-indexing */}
      {isStoryOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[999999] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0e0e0e] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/90 my-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsStoryOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-stone-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center">
                <span className="text-xl font-serif font-black text-white italic tracking-tighter">72</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-white">How "72" Came to Be</h2>
            </div>
            
            <p className="text-[11px] font-mono text-stone-400 mb-6 uppercase tracking-wider">
              A raw note from Emma Adams to fellow hyperfocused learners
            </p>

            <div className="space-y-4 text-xs text-stone-300 font-sans leading-relaxed max-h-[350px] overflow-y-auto pr-2">
              <p>
                "I have a confession to make. I'm completely time-blind. When I try to learn something new, like Python or coding, I get incredibly excited, start hyperfocusing, and then immediately get overwhelmed. My head physically aches, and I begin to rush. Where am I rushing to? I don't know."
              </p>
              <p>
                "But I feel this constant, heavy pressure. I have AuDHD, which makes everything ten times more intense. People see me as a strong learner, but inside, I carry a lot of anxiety and tire easily from the constant, exhausting pace."
              </p>
              <p>
                "To escape that pressure, I had a bad habit of rushing through content just to declare it finished. I'd lean too heavily on AI as a shortcut to get fast answers, completely bypassing my own understanding. And then, because I rushed, I would forget everything within a few days."
              </p>
              <p>
                "On top of that, I have a hyperfixation schedule that completely morphs every 72 hours. I have a long trail of half-finished books, half-coded apps, and fleeting ideas. The moment anxiety sets in about not finishing, my brain immediately screches: <em>'What if we use AI to do it fast?'</em>"
              </p>
              <p>
                "I got tired of the anxiety. I got tired of the constant pressure. I wanted to build a quiet sanctuary. A space where there are no grading bots, no competitive visual badges, and no automated algorithms evaluating whether my explanation was perfect. I just wanted a simple companion where I could type out my thoughts, honestly score my own understanding, download my study materials, and take it slow."
              </p>
              <p className="border-t border-white/10 pt-4 mt-4 text-white font-serif italic">
                "So, as one of my pet projects, I got help from my AI companion here to build <strong>Seventy-Two</strong>. It's a tribute to my 72-hour hyperfocus cycles. Here, our interest is a beautiful sprint, the pace is entirely ours, and we learn one sentence at a time. No rushing, no shame."
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setIsStoryOpen(false)}
                className="px-5 py-2.5 bg-white text-black font-mono font-bold text-xs rounded-xl hover:bg-stone-200 transition-all cursor-pointer shadow-lg"
              >
                Close & Return to Practice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
