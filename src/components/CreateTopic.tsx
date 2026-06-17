import { useState, FormEvent } from "react";
import { Plus, X, ListPlus, Hash, FilePenLine } from "lucide-react";

interface CreateTopicProps {
  onAddTopic: (title: string, notes: string, customQuestions: string[]) => void;
}

const TEMPLATE_QUESTIONS = [
  "Define this concept in a single sentence without using any complex jargon.",
  "What is the most common mistake or misunderstanding about this topic?",
  "What is 1 practical or real-world application of this concept?",
];

export default function CreateTopic({ onAddTopic }: CreateTopicProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [questions, setQuestions] = useState<string[]>(TEMPLATES_COPY());
  const [newQuestion, setNewQuestion] = useState("");
  const [error, setError] = useState("");

  function TEMPLATES_COPY() {
    return [...TEMPLATE_QUESTIONS];
  }

  const handleAddQuestion = () => {
    if (newQuestion.trim()) {
      setQuestions([...questions, newQuestion.trim()]);
      setNewQuestion("");
    }
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please add a title for this study hyperfocus.");
      return;
    }
    if (!notes.trim()) {
      setError("Paste in some course notes, transcripts, or chaotic thoughts to record.");
      return;
    }

    onAddTopic(title, notes, questions.filter(q => q.trim().length > 0));
    setTitle("");
    setNotes("");
    setQuestions(TEMPLATES_COPY());
    setIsOpen(false);
  };

  return (
    <div className="mb-6 relative z-10">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-4 px-6 rounded-2xl border border-white/10 bg-white/5 text-white hover:bg-white/10 hover:border-white/20 active:scale-[0.99] font-serif font-bold text-left cursor-pointer transition-all flex items-center justify-between shadow-xl shadow-black/30"
        >
          <span className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </span>
            <span>Record a New Hyperfocus Sprint</span>
          </span>
          <span className="text-xs font-mono text-stone-400 font-normal">Sleek Notebook Style</span>
        </button>
      ) : (
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 md:p-6 rounded-3xl shadow-2xl shadow-black/50 animate-fade-in relative">
          
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-stone-400 hover:text-white cursor-pointer transition-colors"
            title="Cancel"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <FilePenLine className="w-5 h-5 text-stone-300" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                Log New Study Topic
              </h3>
              <p className="text-[11px] font-mono text-stone-400">
                Put down your chaotic research so you can step away without anxiety
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <p className="text-xs font-mono text-stone-200 bg-red-950/40 border border-red-500/20 px-3 py-2 rounded-xl">
                 {error}
              </p>
            )}

            {/* Title */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-1.5">
                Topic Title or Subject
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Asynchronous Python, CSS Grid, French cooking verbs..."
                className="w-full border border-white/10 rounded-xl px-3.5 py-2.5 bg-white/5 text-sm text-white focus:outline-none focus:border-white/25 focus:bg-white/10 transition-colors placeholder:text-stone-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-1.5">
                Course Transcripts, Messy Notes, or Braindumps
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
                placeholder="Fling raw snippets from web articles, slide printouts, messy ideas, or transcripts. We will preserve these for your future reference and recall sessions."
                className="w-full border border-white/10 rounded-xl px-3.5 py-2.5 bg-white/5 text-sm text-white focus:outline-none focus:border-white/25 focus:bg-white/10 transition-colors placeholder:text-stone-500 font-sans leading-relaxed"
              />
            </div>

            {/* Active Recall Prompts Entry */}
            <div className="border-t border-white/10 pt-4">
              <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2">
                Configure Active-Recall Test Questions
              </label>
              
              <div className="space-y-2 mb-3 max-h-[160px] overflow-y-auto pr-1">
                {questions.map((q, idx) => (
                  <div key={idx} className="flex gap-2 items-center bg-white/[0.02] border border-white/5 px-3 py-2 rounded-lg">
                    <span className="text-[10px] font-mono text-stone-400">Q{idx+1}:</span>
                    <input
                      type="text"
                      value={q}
                      onChange={(e) => {
                        const copy = [...questions];
                        copy[idx] = e.target.value;
                        setQuestions(copy);
                      }}
                      className="flex-1 bg-transparent hover:bg-white/5 text-stone-200 text-xs focus:outline-none border-b border-transparent focus:border-stone-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(idx)}
                      className="text-stone-500 hover:text-white transition-colors cursor-pointer text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Question Row */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="Create custom check question..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-white/20"
                />
                <button
                  type="button"
                  onClick={handleAddQuestion}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-mono cursor-pointer transition-colors flex items-center gap-1 shrink-0"
                >
                  <ListPlus className="w-4.5 h-4.5" />
                  Add Q
                </button>
              </div>
            </div>

            {/* Submit Forms panel */}
            <div className="flex gap-2 justify-end pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-white text-xs font-mono cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-white text-black hover:bg-stone-200 rounded-xl text-xs font-mono font-bold cursor-pointer transition-all shadow-md active:scale-95"
              >
                Store Sprints in Local Storage
              </button>
            </div>
          </form>

        </div>
      )}
    </div>
  );
}
