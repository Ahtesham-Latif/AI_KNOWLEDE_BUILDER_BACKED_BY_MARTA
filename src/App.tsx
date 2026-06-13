/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import Header from "./components/Header";
import InputSection from "./components/InputSection";
import ProcessChain from "./components/ProcessChain";
import KnowledgeDisplay from "./components/KnowledgeDisplay";
import { KnowledgeResponse } from "./types";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, Terminal, Moon, Sun, XCircle } from "lucide-react";

import { generateKnowledge } from "./services/knowledgeService";
import { cn } from "./lib/utils";
import ErrorBoundary from "./components/ErrorBoundary";
import LoaderSkeleton from "./components/LoaderSkeleton";

export default function App() {
  const [data, setData] = useState<KnowledgeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [isDonkey, setIsDonkey] = useState(false);
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Student");

  // Toggle dark class on body
  useEffect(() => {
    if (isDark) {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [isDark]);

  const handleGenerate = async (topic: string, audience: string) => {
    // donkey check
    if (audience.toLowerCase() === "donkey") {
      setIsDonkey(true);
      setData(null);
      setError(null);
      return;
    }

    setIsDonkey(false);

    // Rate limit check (1 minute)
    const now = Date.now();
    const waitTime = 60000; // 1 minute
    if (lastRequestTime && now - lastRequestTime < waitTime) {
      setShowLimitModal(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateKnowledge(topic, audience);
      setData(result);
      setLastRequestTime(Date.now());
    } catch (err: any) {
      console.error("Knowledge Generation Error:", err);
      setError(err.message || "An unexpected error occurred during AI generation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 selection:bg-teal-500 selection:text-white pb-20",
      isDark ? "bg-[#013E37] text-[#FFEFB3]" : "bg-[#FFEFB3] text-[#013E37]"
    )}>
      <div className="max-w-6xl mx-auto relative px-4">
        {/* Toggle Theme - Now Absolute within container instead of fixed to avoid dragging */}
        <div className="absolute top-8 right-4 z-50">
          <button 
            onClick={() => setIsDark(!isDark)}
            className={cn(
              "p-3 border-2 transition-all shadow-bento",
              isDark 
                ? "bg-[#FFEFB3] border-[#FFEFB3] text-[#013E37] shadow-bento-white hover:bg-white" 
                : "bg-[#013E37] border-[#013E37] text-[#FFEFB3] hover:bg-teal-800"
            )}
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <Header isDark={isDark} />
        
        <main>
          <InputSection 
            onGenerate={handleGenerate} 
            isLoading={isLoading} 
            isDark={isDark} 
            topic={topic}
            setTopic={setTopic}
            audience={audience}
            setAudience={setAudience}
          />
          
          <ProcessChain isDark={isDark} />

          <AnimatePresence mode="wait">
            {isDonkey && (
              <motion.div
                key="donkey-screen"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-xl mx-auto py-20 text-center"
              >
                <div className={cn(
                  "border-4 p-12 shadow-bento transition-colors duration-300",
                  isDark ? "bg-[#013E37] border-[#FFEFB3] text-[#FFEFB3]" : "bg-[#FFEFB3] border-[#013E37] text-[#013E37]"
                )}>
                  <div className="text-8xl mb-8">😂</div>
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
                    Look Who is asking
                  </h2>
                  <p className="text-xl font-bold uppercase tracking-widest opacity-60">
                    A Donkey tbh 😂
                  </p>
                </div>
              </motion.div>
            )}

            {error && !isDonkey && (
              <motion.div
                key="error-banner"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-4xl mx-auto mb-8"
              >
                <div className={cn(
                  "border-2 p-4 flex items-start space-x-3 text-red-600 shadow-bento",
                  isDark ? "bg-[#FFEFB3] border-[#FFEFB3]" : "bg-white border-[#013E37]"
                )}>
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-extrabold font-sans uppercase text-xs tracking-widest">System Note</h4>
                    <p className="text-sm font-medium mt-1">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {isLoading && !isDonkey && (
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LoaderSkeleton isDark={isDark} />
              </motion.div>
            )}

            {data && !isLoading && !isDonkey && (
              <motion.div
                key="knowledge-report"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorBoundary fallback={
                  <div className={cn(
                    "max-w-4xl mx-auto p-12 border-4 text-center",
                    isDark ? "bg-[#013E37] border-red-500 text-white" : "bg-white border-red-500 text-[#013E37]"
                  )}>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-4 text-red-500">Display Error</h2>
                    <p className="font-bold">Something went wrong while rendering the knowledge cards. Please try generating again.</p>
                  </div>
                }>
                  <KnowledgeDisplay 
                    data={data} 
                    onDeepDive={(newTopic) => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setTopic(newTopic);
                    }}
                    isDark={isDark}
                  />
                </ErrorBoundary>
              </motion.div>
            )}

            {!data && !isLoading && !error && (
              <motion.div
                key="waiting-input-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={cn(
                  "flex flex-col items-center justify-center py-20 pointer-events-none opacity-20",
                  isDark ? "text-teal-100" : "text-teal-900"
                )}
              >
                <Terminal className="w-16 h-16 mb-4" />
                <p className="font-black text-xs uppercase tracking-[0.4em] italic">AWAITING_INPUT_SEQUENCE</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className={cn(
          "py-8 mt-12 border-t-2 transition-colors",
          isDark ? "border-[#FFEFB3]/20" : "border-[#013E37]/10"
        )}>
          <div className={cn(
            "flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] uppercase font-black tracking-[0.2em]",
            isDark ? "text-teal-200/50" : "text-teal-300"
          )}>
            <div className="text-center md:text-left">
              © {new Date().getFullYear()} AI KNOWLEDGE BUILDER | V2.3.0<br/>
              <span className="opacity-80 underline underline-offset-4 decoration-teal-500/30">Developer: Ahtesham Latif</span>
            </div>
            <div className="text-center md:text-right">
              BUILT FOR STRUCTURED INTELLIGENCE
              <div className="mt-1 opacity-60">PROPRIETARY_EXTRACTION_ENGINE</div>
            </div>
          </div>
        </footer>
      </div>

      {/* Rate Limit Modal */}
      <AnimatePresence>
        {showLimitModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-teal-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
               className="bg-[#FFEFB3] border-4 border-[#013E37] p-8 max-w-md w-full shadow-bento relative"
            >
              <button 
                onClick={() => setShowLimitModal(false)}
                className="absolute top-4 right-4 text-[#013E37] hover:scale-110 transition-transform"
              >
                <XCircle className="w-6 h-6" />
              </button>
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-teal-100 rounded-full">
                  <AlertCircle className="w-12 h-12 text-[#013E37]" />
                </div>
                <h3 className="text-2xl font-black text-[#013E37] uppercase tracking-tighter">System Cooling</h3>
                <p className="text-[#013E37] font-bold leading-relaxed">
                  Bro, wait for the system to cool you asked really intelligent question.
                </p>
                <button
                  onClick={() => setShowLimitModal(false)}
                  className="w-full bg-[#013E37] text-white py-3 font-black uppercase tracking-widest hover:bg-teal-800 transition-colors shadow-sm"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
