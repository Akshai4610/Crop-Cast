/* ═══════════════════════════════════════════════
   PREMIUM AGRI-PLAYGROUND (PUBLIC)
   File: src/pages/public/PlaygroundPage.jsx
   -------------------------------------------------
   ✔ Guess the Crop Quiz
   ✔ Interactive Polls
   ✔ Dynamic Fun Facts
   ✔ Premium GSAP & Framer Motion Visuals
   ═══════════════════════════════════════════════ */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Award, Brain, BarChart3, ChevronRight, HelpCircle, RefreshCw } from "lucide-react";
import { gsap } from "gsap";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

// ── QUIZ DATA ───────────────
const QUIZ_QUESTIONS = [
  {
    question: "Which crop is known as 'The Golden Grain'?",
    options: ["Rice", "Wheat", "Maize", "Barley"],
    answer: "Maize",
    hint: "It thrives in high temperatures and originated in Mexico."
  },
  {
    question: "Which of these requires standing water for growth?",
    options: ["Coffee", "Rice", "Cotton", "Apple"],
    answer: "Rice",
    hint: "It's a staple for over half the world's population."
  },
  {
    question: "Which Brazilian export is the world's most traded tropical crop?",
    options: ["Sugarcane", "Banana", "Coffee", "Soybean"],
    answer: "Coffee",
    hint: "You probably drank some this morning!"
  }
];

// ── FUN FACTS ───────────────
const FUN_FACTS = [
  { title: "Apple History", text: "There are over 7,500 varieties of apples grown worldwide." },
  { title: "Honey Power", text: "Honey is the only food that never spoils. Archaeologists found it in 3000-year-old tombs." },
  { title: "Strawberry Secrecy", text: "Strawberries are the only fruit that wear their seeds on the outside." },
  { title: "Corn Counts", text: "An average ear of corn has an even number of rows (usually 16)." }
];

export default function PlaygroundPage() {
  const [currentQ, setCurrentQ]   = useState(0);
  const [score,    setScore]      = useState(0);
  const [showRes,  setShowRes]    = useState(false);
  const [pollVoted, setPollVoted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const heroRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(heroRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  const handleAnswer = (opt) => {
    if (opt === QUIZ_QUESTIONS[currentQ].answer) setScore(score + 1);
    
    if (currentQ + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setShowRes(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#020804] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-24 sm:py-32">
        
        {/* HERO SECTION */}
        <div ref={heroRef} className="text-center mb-20">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Brain size={14} /> Agri-Playground
          </motion.div>
          <h1 className="text-4xl sm:text-6xl font-black mb-6 leading-tight" style={{ fontFamily: "serif" }}>
            Learn. Play. <span className="text-emerald-400">Grow.</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Test your knowledge, participate in community polls, and discover amazing facts about the world of agriculture.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* ── QUIZ CARD ─────────────── */}
          <div className="lg:col-span-2 glass-card p-8 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] group-hover:bg-emerald-500/10 transition-colors duration-700" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
                    <HelpCircle className="text-emerald-400" />
                  </div>
                  <h2 className="text-2xl font-bold tracking-tight">Crop Quiz</h2>
                </div>
                {quizStarted && !showRes && (
                  <span className="text-xs font-bold text-emerald-400/60 uppercase tracking-widest">
                    Question {currentQ + 1} / {QUIZ_QUESTIONS.length}
                  </span>
                )}
              </div>

              <AnimatePresence mode="wait">
                {!quizStarted ? (
                  <motion.div 
                    key="start"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="text-center py-12"
                  >
                    <p className="text-gray-400 mb-8 italic">Ready to see how much you know about farming?</p>
                    <button 
                      onClick={() => setQuizStarted(true)}
                      className="px-8 py-3 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all shadow-[0_8px_30px_rgba(16,185,129,0.3)]"
                    >
                      Start Quiz
                    </button>
                  </motion.div>
                ) : showRes ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Award size={40} className="text-emerald-400" />
                    </div>
                    <h3 className="text-3xl font-black mb-2">Score: {score} / {QUIZ_QUESTIONS.length}</h3>
                    <p className="text-gray-500 mb-8">
                      {score === 3 ? "Harvest Level: PRO! 🌾" : "Nice try! Keep growing. 🌱"}
                    </p>
                    <button 
                      onClick={() => { setQuizStarted(false); setShowRes(false); setCurrentQ(0); setScore(0); }}
                      className="flex items-center gap-2 mx-auto px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition-all text-sm font-bold"
                    >
                      <RefreshCw size={14} /> Try Again
                    </button>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={currentQ}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  >
                    <p className="text-xl font-medium mb-8 text-white/90">
                      {QUIZ_QUESTIONS[currentQ].question}
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                      {QUIZ_QUESTIONS[currentQ].options.map((opt) => (
                        <button 
                          key={opt}
                          onClick={() => handleAnswer(opt)}
                          className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group"
                        >
                          <span className="flex items-center justify-between">
                            {opt}
                            <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                          </span>
                        </button>
                      ))}
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-emerald-400/80">
                      <span className="font-bold mr-1 italic">💡 Hint:</span> {QUIZ_QUESTIONS[currentQ].hint}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── SIDEBAR SECTIONS ─────────────── */}
          <div className="space-y-8">
            
            {/* POLL CARD */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="text-emerald-400" size={18} />
                <h3 className="font-bold">Daily Poll</h3>
              </div>
              <p className="text-sm text-gray-400 mb-6">What's your favorite growing season?</p>
              
              {!pollVoted ? (
                <div className="space-y-3">
                  {["Monsoon 🌧️", "Summer ☀️", "Winter ❄️"].map((opt) => (
                    <button 
                      key={opt}
                      onClick={() => setPollVoted(true)}
                      className="w-full p-3 rounded-xl border border-white/5 bg-white/5 text-sm text-left hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {[[ "Monsoon", 42 ], [ "Summer", 28 ], [ "Winter", 30 ]].map(([l, v]) => (
                    <div key={l} className="space-y-1.5">
                      <div className="flex justify-between text-[11px] font-bold tracking-widest uppercase text-gray-500">
                        <span>{l}</span>
                        <span>{v}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${v}%` }}
                          className="h-full bg-emerald-500"
                        />
                      </div>
                    </div>
                  ))}
                  <p className="text-[10px] text-center text-emerald-400/40 mt-4 italic">Thanks for voting!</p>
                </div>
              )}
            </div>

            {/* FUN FACTS CAROUSEL */}
            <div className="glass-card p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                 <Leaf className="text-emerald-500/20" size={40} />
               </div>
               <h3 className="font-bold mb-4 flex items-center gap-2">
                 Did You Know?
               </h3>
               
               <div className="space-y-4">
                 {FUN_FACTS.slice(0, 2).map((fact, idx) => (
                   <div key={idx} className="pb-4 last:pb-0 border-b last:border-0 border-white/5">
                     <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">{fact.title}</h4>
                     <p className="text-xs leading-relaxed text-gray-400">{fact.text}</p>
                   </div>
                 ))}
               </div>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
