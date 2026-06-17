# Seventy-Two (72) 🧠✨

Hey there, I'm **Emmanuella Adams** (⁠｡⁠•̀⁠ᴗ⁠-⁠)⁠✧

I created **72** as a personal, offline-first study companion. It’s a tool built specifically for those of us with AuDHD, who are easily overwhelmed, chronically time-blind, or find themselves trapped in a constant cycle of hyperfixation, study anxiety, and learning burnout.

---

## 🖤 Why I Built This (My Backstory)

For a long time, I was stuck in an exhausting loop. I would find a fascinating new topic(like Python, CSS grid, or baking) get intensely hyperfocused for a brief 72 hours, and then immediately get overwhelmed. The anxiety of time-blindness would kick in. I’d find myself rushing to finish, resorting to quick copy-pastes or over-relying on AI to complete topics just to alleviate the pressure. In the end, the rush meant I forgot everything I had supposedly "learned," leaving me feeling exhausted and disconnected.

Carrying AuDHD made this feel ten times more intense. People saw me as capable, but inside, I just felt tired of the anxiety, tired of trying to please people, and tired of rushing toward imaginary finish lines. 

I realized I wanted to change how I approach learning. I needed a companion that let me take things *slowly*. I didn't want rigid grading bots, competitive streaks, or unsolicited AI engines judging how well I explained a concept.

As one of my pet projects, I got help from my AI companion here to build **72** (Seventy-Two). It's a quiet, gorgeous notebook that acts as a safe harbor for my 72-hour hyperfocus cycles. Here, you have permission to study without pressure.

---

## 🕯️ How It Works (No-AI Active Recall)

When a new obsession takes hold and you feel the urge to rush, **72** gives you an offline space to capture your thoughts and walk away without anxiety:

1. **Jot Down Your Obsessions**: Create a topic card and copy over your chaotic clippings, messy lectures, or transcripts. This lifts the "mental tabs" weight off your mind.
2. **Force the Active Recall**: Close your eyes, try to reconstruct the concepts from memory, and write them down in the explanation desk. No shortcuts.
3. **Audit Your Understanding (No-AI Checking)**: You grade yourself using four honest checklist parameters:
   - *Did I capture the big, grand concept?*
   - *Did I get the key vocabulary or code syntax right?*
   - *Did I account for the edges and exceptions?*
   - *Did I write this without looking back at the source clippings first?*
4. **Reschedule Naturally**: Rate your overall confidence. **72** schedules the next review using Spaced Repetition (1, 3, 7, 14, 30 days). If you struggle, the topic steps back gently. If you master it, it pushes further out.
5. **Take It With You**: Export your entire repository as a beautifully bundled `.txt` chronicle of your milestones.

---

### *We have permission to go slow. One sentence at a time, hihi...(⁠ ⁠´⁠◡⁠‿⁠ゝ⁠◡⁠`⁠)* 🐾

---

## 🛠️ Technological Stack & Architecture

Seventy-Two is built on a highly responsive, client-side offline-first architecture geared for zero cloud dependencies or external trackers:

* **Framework**: React 18+ powered by **Vite**
* **Language**: TypeScript
* **Styling**: Tailwind CSS (Sophisticated minimalist black canvas, custom serif typefaces, smooth spacing)
* **Animation**: motion/react (micro-transitions, elegant drawer collapses)
* **Icons**: Lucide React
* **Data Persistence**: HTML5 LocalStorage (Your notes are safely retained inside your browser)

---

## 🚀 How to Run Locally

Get Seventy-Two up and running on your local machine:

### 1. Install Dependencies
Make sure you have Node.js (v18+) installed. Clone the repository and install packages:
```bash
npm install
```

### 2. Launch Development Server
Boot up the fast Vite static server:
```bash
npm run dev
```
Navigate to the web address indicated in your terminal prompt (e.g., `http://localhost:3000`).

### 3. Production Build
Prepare an optimized compilation for release (outputs static HTML/JS inside `/dist`):
```bash
npm run build
```
