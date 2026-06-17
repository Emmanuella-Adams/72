import { useState, useEffect } from "react";
import { Coffee, Layers, BookOpen, Heart, X } from "lucide-react";

const SUPPORTIVE_THOUGHTS = [
  "Take it slow. There is no finish line you need to sprint toward.",
  "Your brain is not broken. It's just highly customized.",
  "Stop rushing. You have permission to learn a single sentence today.",
  "Ditch the guilt. Your 72-hour hyperfixations are beautiful sprints.",
  "Deep breaths. We are building this without AI constraints. Just you, your thoughts, and quiet space."
];

export default function Header() {
  const [quote, setQuote] = useState(SUPPORTIVE_THOUGHTS[0]);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * SUPPORTIVE_THOUGHTS.length);
    setQuote(SUPPORTIVE_THOUGHTS[randomIdx]);
  }, []);

  return (
    <header className={`relative pb-6 mb-8 border-b border-white/10 ${isStoryOpen ? "z-[99999]" : "z-10"}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center">
              <span className="text-xl font-serif font-black text-white italic tracking-tighter">72</span>
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-white tracking-tight leading-none">
                Seventy-Two
              </h1>
              <p className="text-[11px] font-mono text-stone-400 mt-1 uppercase tracking-widest">
                A Safe Notebook for Hyperfocused Minds
              </p>
            </div>
          </div>
          <p className="text-xs font-serif italic text-stone-300 mt-3 pl-3 border-l-2 border-white/20 max-w-xl leading-relaxed">
            "{quote}"
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2 font-mono text-[10px] text-stone-400">
          <div className="px-3 py-1 bg-white/5 border border-white/10 backdrop-blur-md rounded-full flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-300 animate-pulse"></span>
            <span>Created by Emma Adams & Assistant</span>
          </div>
          
          <button
            onClick={() => setIsStoryOpen(true)}
            className="text-[10px] font-mono hover:text-white text-stone-400 flex items-center gap-1 border border-dashed border-white/15 px-2.5 py-1 rounded-md hover:bg-white/5 cursor-pointer transition-all self-start sm:self-auto"
          >
            <BookOpen className="w-3 h-3 text-stone-300" />
            <span>Emma's Story (Origins of 72)</span>
          </button>
        </div>
      </div>

      {/* Confession / About Modal */}
      {isStoryOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-lg z-[99999] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#0e0e0e] border border-white/15 rounded-3xl p-6 md:p-8 shadow-2xl shadow-black/90">
            {/* Close Button */}
            <button
              onClick={() => setIsStoryOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-stone-400 hover:text-white cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-serif italic text-stone-400 bg-white/5 border border-white/10 w-9 h-9 rounded-full flex items-center justify-center font-bold">72</span>
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
                "On top of that, I have a hyperfixation schedule that completely morphs every 72 hours. I have a long trail of half-finished books, half-coded apps, and fleeting ideas. The moment anxiety sets in about not finishing, my brain immediately screeches: <em>'What if we use AI to do it fast?'</em>"
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
    </header>
  );
}
