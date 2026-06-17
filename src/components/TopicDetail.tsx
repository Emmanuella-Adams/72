import { useState, useEffect } from "react";
import { LearningTopic, SelfEvaluation, ReviewAttempt } from "../types";
import { 
  BookOpen, 
  History, 
  Compass, 
  Download, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  Smile, 
  Meh, 
  Frown, 
  Flame, 
  CheckSquare, 
  CornerDownRight, 
  FileDown,
  CalendarDays,
  PenTool,
  AlertTriangle,
  Check,
  ChevronDown,
  X
} from "lucide-react";

interface TopicDetailProps {
  key?: string;
  topic: LearningTopic;
  onUpdateTopic: (
    id: string,
    explanation: string,
    evaluation: SelfEvaluation
  ) => void;
}

export default function TopicDetail({ topic, onUpdateTopic }: TopicDetailProps) {
  const [explanation, setExplanation] = useState(topic.explanation || "");
  const [activeTab, setActiveTab] = useState<"recall" | "evaluate" | "history">("recall");
  
  // Self-evaluation checklist states
  const [recalledCore, setRecalledCore] = useState(topic.evaluation?.recalledCore ?? false);
  const [recalledDetails, setRecalledDetails] = useState(topic.evaluation?.recalledDetails ?? false);
  const [recalledCaveats, setRecalledCaveats] = useState(topic.evaluation?.recalledCaveats ?? false);
  const [notesCorrect, setNotesCorrect] = useState(topic.evaluation?.notesCorrect ?? false);
  const [confidence, setConfidence] = useState<'fragile' | 'steady' | 'bulletproof'>(topic.evaluation?.confidenceLevel ?? 'steady');
  const [thoughts, setThoughts] = useState(topic.evaluation?.thoughts ?? "");
  
  // Custom manual adjustment slider state
  const [scoreSlider, setScoreSlider] = useState(topic.evaluation?.score ?? 50);

  const [message, setMessage] = useState("");
  const [exportFileName, setExportFileName] = useState("");
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Sync state if topic swaps
  useEffect(() => {
    setExplanation(topic.explanation || "");
    setRecalledCore(topic.evaluation?.recalledCore ?? false);
    setRecalledDetails(topic.evaluation?.recalledDetails ?? false);
    setRecalledCaveats(topic.evaluation?.recalledCaveats ?? false);
    setNotesCorrect(topic.evaluation?.notesCorrect ?? false);
    setConfidence(topic.evaluation?.confidenceLevel ?? 'steady');
    setThoughts(topic.evaluation?.thoughts ?? "");
    setScoreSlider(topic.evaluation?.score ?? 50);
    setMessage("");
    const titleClean = topic.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    setExportFileName(`72_sprint_${titleClean}`);
    setIsExportMenuOpen(false);
  }, [topic.id, topic.title]);

  // Calculate automated score suggestion based on checked metrics
  const calculatedSuggestedScore = () => {
    let score = 25; // Base entry/honesty attempt
    if (recalledCore) score += 25;
    if (recalledDetails) score += 20;
    if (recalledCaveats) score += 15;
    if (notesCorrect) score += 15;
    return Math.min(score, 100);
  };

  // Synchronize score suggestion if checklist toggled
  const applySuggestedScore = () => {
    setScoreSlider(calculatedSuggestedScore());
  };

  const handleSaveEvaluation = () => {
    if (!explanation.trim()) {
      setMessage("⚠ Write down your self-explanation attempt first!");
      return;
    }

    const newEval: SelfEvaluation = {
      score: scoreSlider,
      recalledCore,
      recalledDetails,
      recalledCaveats,
      notesCorrect,
      confidenceLevel: confidence,
      thoughts: thoughts.trim()
    };

    onUpdateTopic(topic.id, explanation.trim(), newEval);
    setMessage("✓ Your recall index has been updated locally and re-scheduled!");
    setTimeout(() => setMessage(""), 3000);
    setActiveTab("history");
  };

  // Notes file export/download capability!
  const triggerNotesDownload = () => {
    const filename = `${exportFileName.trim() || '72_sprint'}.txt`;

    let fileContent = `==================================================
72 REGISTER REGISTER: ${topic.title.toUpperCase()}
==================================================
Registered: ${new Date(topic.createdAt).toLocaleString()}
Spaced Repetition Schedule: ${topic.intervalDays} Day Interval
Next Active Recall Session: ${new Date(topic.nextReviewDate).toLocaleDateString()}
Confidence Level: ${confidence.toUpperCase()}
Latest Self-Assessment Score: ${scoreSlider}/100

[ORIGINAL STUDY SOURCE NOTES]
${topic.notes}

[LATEST ACTIVE-RECALL SELF-EXPLANATION]
${explanation || "No explanation logged yet."}

[SELF-REFLECTION THOUGHTS]
${thoughts || "No reflective thoughts written yet."}

[ACTIVE RECALL TEST PROMPTS / QUESTIONS]
${topic.customPromptQuestions.length > 0
  ? topic.customPromptQuestions.map((q, idx) => `Q${idx + 1}: ${q}`).join("\n")
  : "None configured."
}

[HISTORIC RETENTION ATTEMPTS LOG]
${topic.history.length > 0 
  ? topic.history.map((h, i) => `Attempt #${i+1} (${new Date(h.date).toLocaleDateString()}) - Score: ${h.evaluation.score}%
  - Explanation: "${h.explanation}"
  - Reflection: "${h.evaluation.thoughts || 'None'}"`).join("\n\n")
  : "No older attempts archived."
}

==================================================
Made with Seventy-Two (72)
==================================================`;

    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const getConfidenceStyle = (level: string) => {
    switch(level) {
      case 'bulletproof': return 'bg-white text-black font-bold border border-white';
      case 'steady': return 'bg-white/10 text-white font-medium border border-white/20';
      case 'fragile': return 'bg-red-950/40 text-red-200 border border-red-500/20';
      default: return '';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-4 md:p-6 animate-fade-in relative">
      
      {/* Detail header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 mb-4 gap-4">
        <div>
          <h3 className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight">
            {topic.title}
          </h3>
          <p className="text-[10px] font-mono text-stone-400 mt-1 uppercase tracking-widest flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Review Scheduled for: {new Date(topic.nextReviewDate).toLocaleDateString(undefined, { 
              weekday: "short", 
              month: "short", 
              day: "numeric" 
            })}</span>
          </p>
        </div>

        {/* Minimalist export popover menu */}
        <div className="relative">
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer border border-white/10 transition-all shadow-md shrink-0 active:scale-95"
            title="Export Options"
          >
            <FileDown className="w-4 h-4 text-stone-300" />
            <span>Export & Downloads</span>
            <ChevronDown className={`w-3.5 h-3.5 ml-0.5 text-stone-400 transition-transform duration-200 ${isExportMenuOpen ? "rotate-180" : ""}`} />
          </button>

          {isExportMenuOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#0e0e0e]/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl z-40 animate-fade-in flex flex-col gap-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="font-mono text-[10px] text-stone-400 font-bold uppercase tracking-wider">Export Settings</span>
                <button 
                  onClick={() => setIsExportMenuOpen(false)}
                  className="p-1 hover:bg-white/5 text-stone-500 hover:text-stone-300 rounded cursor-pointer transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-mono text-[9px] text-stone-400 uppercase tracking-widest block">Text File Name:</label>
                <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 focus-within:border-white/20 transition-all">
                  <input
                    type="text"
                    value={exportFileName}
                    onChange={(e) => setExportFileName(e.target.value)}
                    placeholder="filename"
                    className="bg-transparent text-white font-mono text-xs focus:outline-none w-full border-b border-dashed border-white/10 focus:border-white/30"
                  />
                  <span className="font-mono text-[10px] text-stone-500 shrink-0 select-none ml-1">.txt</span>
                </div>
              </div>

              <button
                onClick={() => {
                  triggerNotesDownload();
                  setIsExportMenuOpen(false);
                }}
                className="w-full px-3 py-2 bg-white text-black hover:bg-stone-200 font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
              >
                <FileDown className="w-3.5 h-3.5 text-black" />
                <span>Save to offline file</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Embedded reference clipping pad */}
      <div className="relative mb-6 bg-white/[0.02] border border-white/5 p-4 rounded-xl">
        <span className="absolute -top-3 left-4 px-2 bg-stone-900 border border-white/10 text-[9px] font-mono tracking-wider font-semibold text-stone-400 uppercase rounded">
          Source Clipping Reference Pad
        </span>
        <p className="text-xs font-mono text-stone-300 whitespace-pre-wrap leading-relaxed max-h-[140px] overflow-y-auto pr-2">
          {topic.notes}
        </p>
      </div>

      {/* Tab select desk */}
      <div className="flex border-b border-white/10 mb-6 font-mono text-xs gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab("recall")}
          className={`px-3 py-2 rounded-t-xl transition-all border-t border-x cursor-pointer ${
            activeTab === "recall" 
              ? "bg-white/10 text-white border-white/20" 
              : "border-transparent text-stone-400 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <PenTool className="w-3.5 h-3.5" />
            1. Recall & Self-Test
          </span>
        </button>

        <button
          onClick={() => setActiveTab("evaluate")}
          className={`px-3 py-2 rounded-t-xl transition-all border-t border-x cursor-pointer ${
            activeTab === "evaluate" 
              ? "bg-white/10 text-white border-white/20" 
              : "border-transparent text-stone-400 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <CheckSquare className="w-3.5 h-3.5" />
            2. Measure Retention (No-AI)
          </span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`px-3 py-2 rounded-t-xl transition-all border-t border-x cursor-pointer ${
            activeTab === "history" 
              ? "bg-white/10 text-white border-white/20" 
              : "border-transparent text-stone-400 hover:text-white font-normal"
          }`}
        >
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <History className="w-3.5 h-3.5" />
            Sprint History ({topic.history.length})
          </span>
        </button>
      </div>

      {/* Error / success banner */}
      {message && (
        <div className={`mb-4 px-3.5 py-2.5 rounded-xl border font-mono text-xs ${
          message.startsWith("⚠") 
            ? "bg-red-950/40 text-red-200 border-red-500/20" 
            : "bg-emerald-950/40 text-emerald-200 border-emerald-500/20"
        }`}>
          {message}
        </div>
      )}

      {/* Screen 1: Active Recall & Test Prompts */}
      {activeTab === "recall" && (
        <div className="space-y-5 animate-fade-in text-left">
          <div className="bg-white/[0.02] border border-white/10 p-3.5 rounded-xl text-xs font-mono text-stone-300 leading-normal">
            <div className="flex items-center gap-1.5 font-bold mb-1 col-span-1 border-b border-white/5 pb-1 text-white">
              <Sparkles className="w-3.5 h-3.5 text-stone-400" />
              <span>How to perform physical active-recall:</span>
            </div>
            <p className="text-stone-400 mt-1">
              Close your eyes, recall what you can about this topic entirely from memory (without looking at notes!), and summarize your findings below. Be as messy, chaotic, or weird as you like. No rigid grading systems—just slow, mindful mastery.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2">
              My Self-Explanation / Brain Summary:
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={6}
              placeholder="Lock onto your brain focus. Translate the concepts out loud, scribble bullet points, or list terms here..."
              className="w-full border border-white/10 rounded-xl p-3 bg-white/5 font-sans text-sm text-white focus:outline-none focus:border-white/20 focus:bg-white/10 leading-relaxed placeholder:text-stone-500"
            />
          </div>

          {/* Preset or custom active recall testing list */}
          {topic.customPromptQuestions.length > 0 && (
            <div className="border border-white/5 p-4 rounded-xl bg-white/[0.01]">
              <h4 className="text-xs font-mono uppercase tracking-widest text-stone-400 border-b border-white/5 pb-2 mb-3 font-semibold">
                Self-Test Diagnostics Checklist
              </h4>
              <div className="space-y-3">
                {topic.customPromptQuestions.map((q, idx) => (
                  <div key={idx} className="flex gap-2 items-start text-xs font-sans text-stone-300">
                    <span className="font-mono text-[10px] bg-white/10 text-stone-200 px-1.5 rounded mt-0.5 select-none shrink-0 font-bold">Q{idx+1}</span>
                    <p className="leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => setActiveTab("evaluate")}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-mono font-bold text-xs hover:bg-stone-200 cursor-pointer transition-all active:scale-95"
            >
              Next Step: Measure Understanding
            </button>
          </div>
        </div>
      )}

      {/* Screen 2: Custom Retention evaluation desk (No AI, fully interactive) */}
      {activeTab === "evaluate" && (
        <div className="space-y-6 animate-fade-in text-left">
          <div className="border border-white/10 p-4 rounded-xl bg-white/[0.02]">
            <h4 className="text-sm font-serif font-bold text-white mb-1.5 flex items-center gap-1.5">
              <CheckSquare className="w-5 h-5 text-stone-400" />
              Retention Checkpoint Matrix
            </h4>
            <p className="text-[11px] font-mono text-stone-400 mb-4 leading-relaxed">
              Compare your summary against the source pad. Hold yourself to an honest, supportive standard.
            </p>

            {/* Checklist elements */}
            <div className="space-y-3.5">
              
              <div 
                onClick={() => setRecalledCore(!recalledCore)}
                className="flex items-start gap-3 cursor-pointer select-none group focus:outline-none"
              >
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
                  recalledCore 
                    ? 'bg-white border-white text-black' 
                    : 'border-white/20 bg-white/5 text-transparent group-hover:border-white/40'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                </div>
                <div className="text-xs leading-normal">
                  <p className="font-mono font-semibold text-white">Grand Concept Recalled</p>
                  <p className="text-stone-400 font-sans mt-0.5">I explained the big-picture theory/mechanism comfortably in my own words.</p>
                </div>
              </div>

              <div 
                onClick={() => setRecalledDetails(!recalledDetails)}
                className="flex items-start gap-3 cursor-pointer select-none group focus:outline-none"
              >
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
                  recalledDetails 
                    ? 'bg-white border-white text-black' 
                    : 'border-white/20 bg-white/5 text-transparent group-hover:border-white/40'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                </div>
                <div className="text-xs leading-normal">
                  <p className="font-mono font-semibold text-white">Technical Facts & Terms Correct</p>
                  <p className="text-stone-400 font-sans mt-0.5">I listed crucial words, key parameters, values, definitions, or code syntax correctly.</p>
                </div>
              </div>

              <div 
                onClick={() => setRecalledCaveats(!recalledCaveats)}
                className="flex items-start gap-3 cursor-pointer select-none group focus:outline-none"
              >
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
                  recalledCaveats 
                    ? 'bg-white border-white text-black' 
                    : 'border-white/20 bg-white/5 text-transparent group-hover:border-white/40'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                </div>
                <div className="text-xs leading-normal">
                  <p className="font-mono font-semibold text-white">Caveats, Edges, & Disclaimers Accounted</p>
                  <p className="text-stone-400 font-sans mt-0.5">I accounted for boundary limitations, risks, exceptions, or common pitfalls.</p>
                </div>
              </div>

              <div 
                onClick={() => setNotesCorrect(!notesCorrect)}
                className="flex items-start gap-3 cursor-pointer select-none group focus:outline-none"
              >
                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-150 ${
                  notesCorrect 
                    ? 'bg-white border-white text-black' 
                    : 'border-white/20 bg-white/5 text-transparent group-hover:border-white/40'
                }`}>
                  <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                </div>
                <div className="text-xs leading-normal">
                  <p className="font-mono font-semibold text-white">Complete Recall Honesty Metric</p>
                  <p className="text-stone-400 font-sans mt-0.5">I wrote this down without cheating, looking back, or re-reading my clippings beforehand!</p>
                </div>
              </div>

            </div>

            {/* Suggested Score Prompt */}
            <div className="mt-5 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
              <span className="text-[11px] font-mono text-stone-400">
                Checklist index suggests score: <strong className="text-white bg-white/10 px-1.5 py-0.5 rounded font-mono font-bold text-xs">{calculatedSuggestedScore()}%</strong>
              </span>
              <button
                type="button"
                onClick={applySuggestedScore}
                className="text-[10px] font-mono underline text-stone-300 hover:text-white cursor-pointer"
              >
                Sync Slider to Suggestion
              </button>
            </div>
          </div>

          {/* Interactive Score Slider */}
          <div className="border border-white/10 p-4 rounded-xl bg-white/[0.02] space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/5">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400 font-bold">
                My Dial-in Retention Score
              </span>
              <span className="text-xl font-mono font-bold text-white">
                {scoreSlider}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={scoreSlider}
              onChange={(e) => setScoreSlider(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer bg-white/10 h-1.5 rounded"
            />

            <div className="flex justify-between text-[10px] font-mono text-stone-500">
              <span>0% Blank trace</span>
              <span>50% Basic grasp</span>
              <span>100% Solid mastery</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Confidence metric */}
            <div className="border border-white/10 p-4 rounded-xl bg-white/[0.02]">
              <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2 font-bold">
                My Confidence Curve
              </label>
              
              <div className="grid grid-cols-3 gap-2">
                {(['fragile', 'steady', 'bulletproof'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setConfidence(level)}
                    className={`py-2 rounded-lg text-xs font-mono capitalize transition-all cursor-pointer ${
                      confidence === level 
                        ? getConfidenceStyle(level)
                        : 'bg-white/5 hover:bg-white/10 text-stone-400 border border-transparent'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Self-Reflection written block */}
            <div className="border border-white/10 p-4 rounded-xl bg-white/[0.02]">
              <label className="block text-xs font-mono uppercase tracking-widest text-stone-400 mb-2 font-bold">
                Self-Reflection thoughts
              </label>
              <input
                type="text"
                value={thoughts}
                onChange={(e) => setThoughts(e.target.value)}
                placeholder="What slipped? What made it click? e.g. drawing helped..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder:text-stone-500 font-sans focus:outline-none focus:border-white/20"
              />
            </div>
          </div>

          {/* Action Log Save Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleSaveEvaluation}
              className="px-6 py-3 bg-white text-black font-mono font-bold text-xs rounded-xl hover:bg-stone-200 transition-all shadow-xl active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              <span>Verify & Re-schedule Spaced Review</span>
            </button>
          </div>
        </div>
      )}

      {/* Screen 3: Spaced Repetition log history archive */}
      {activeTab === "history" && (
        <div className="space-y-4 animate-fade-in text-left">
          <h4 className="text-sm font-serif font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2 mb-2">
            My Focus Record Log History
          </h4>

          {topic.history.length === 0 && !topic.evaluation ? (
            <p className="text-xs font-mono text-stone-400 italic bg-white/[0.01] p-4 text-center border border-white/5 rounded-xl">
              No historical checks recorded yet. Fill in your explanation and check understanding to register progress!
            </p>
          ) : (
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              
              {/* Current latest checkpoint if initialized */}
              {topic.evaluation && (
                <div className="border border-white/25 rounded-xl p-4 bg-white/5">
                  <div className="flex justify-between items-start font-mono text-[10px] text-stone-400 pb-2 border-b border-white/5 mb-2">
                    <span>Latest assessment (Current View)</span>
                    <span className="font-bold text-white bg-white/15 px-2 py-0.5 rounded font-mono">
                      Rating: {topic.evaluation.score}%
                    </span>
                  </div>
                  
                  <p className="text-xs font-sans text-stone-200 leading-relaxed italic bg-white/[0.02] border border-white/5 p-2 rounded-lg whitespace-pre-wrap">
                    "{topic.explanation}"
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 text-[10px] font-mono text-stone-400 mt-2.5 pt-2 border-t border-white/5">
                    <div>
                      <strong>Confidence Curve:</strong> <span className="text-stone-200 uppercase">{topic.evaluation.confidenceLevel}</span>
                    </div>
                    {topic.evaluation.thoughts && (
                      <div className="truncate text-right">
                        <strong>Reflection:</strong> <span className="text-stone-200 italic">"{topic.evaluation.thoughts}"</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Archeology/Old study list history records */}
              {topic.history.slice().reverse().map((attempt, index) => {
                const attemptDate = new Date(attempt.date).toLocaleString(undefined, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div key={index} className="border border-white/5 rounded-xl p-4 bg-white/[0.01]">
                    <div className="flex justify-between items-start font-mono text-[10px] text-stone-500 pb-2 border-b border-white/5 mb-2">
                      <span>Logged on: {attemptDate}</span>
                      <span className="font-bold text-stone-300">
                        Score: {attempt.evaluation.score}%
                      </span>
                    </div>

                    <p className="text-xs font-sans text-stone-400 leading-relaxed italic bg-white/[0.02] border border-white/5 p-2 rounded-lg whitespace-pre-wrap">
                      "{attempt.explanation}"
                    </p>

                    <div className="flex justify-between text-[10px] font-mono text-stone-500 mt-2">
                      <span>Confidence: {attempt.evaluation.confidenceLevel}</span>
                      {attempt.evaluation.thoughts && (
                        <span className="italic truncate pr-2 max-w-[180px]">Reflection: "{attempt.evaluation.thoughts}"</span>
                      )}
                    </div>
                  </div>
                );
              })}

            </div>
          )}
        </div>
      )}

    </div>
  );
}
