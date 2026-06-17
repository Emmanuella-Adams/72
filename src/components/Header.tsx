import { useState, useEffect } from "react";
import { Coffee, Layers, BookOpen, Heart, X } from "lucide-react";

const SUPPORTIVE_THOUGHTS = [
  "Take it slow. There is no finish line you need to sprint toward.",
  "Your brain is not broken. It's just highly customized.",
  "Stop rushing. You have permission to learn a single sentence today.",
  "Ditch the guilt. Your 72-hour hyperfixations are beautiful sprints.",
  "Deep breaths. We are building this without AI constraints. Just you, your thoughts, and quiet space."
];

interface HeaderProps {
  onOpenStory: () => void;
}

export default function Header({ onOpenStory }: HeaderProps) {
  const [quote, setQuote] = useState(SUPPORTIVE_THOUGHTS[0]);

  useEffect(() => {
    const randomIdx = Math.floor(Math.random() * SUPPORTIVE_THOUGHTS.length);
    setQuote(SUPPORTIVE_THOUGHTS[randomIdx]);
  }, []);

  return (
    <header className="relative pb-6 mb-8 border-b border-white/10 z-10">
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
            onClick={onOpenStory}
            className="text-[10px] font-mono hover:text-white text-stone-400 flex items-center gap-1 border border-dashed border-white/15 px-2.5 py-1 rounded-md hover:bg-white/5 cursor-pointer transition-all self-start sm:self-auto"
          >
            <BookOpen className="w-3 h-3 text-stone-300" />
            <span>Emma's Story (Origins of 72)</span>
          </button>
        </div>
      </div>
    </header>
  );
}
