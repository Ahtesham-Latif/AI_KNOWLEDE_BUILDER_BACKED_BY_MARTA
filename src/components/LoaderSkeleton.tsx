/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { cn } from "@/src/lib/utils";
import { 
  Baby, 
  BookOpen, 
  Clock, 
  Wrench, 
  Layers, 
  Lightbulb, 
  Target,
  Link,
  Youtube
} from "lucide-react";

interface LoaderSkeletonProps {
  isDark?: boolean;
  isLoading?: boolean;
}

export default function LoaderSkeleton({ isDark, isLoading = true }: LoaderSkeletonProps) {
  const [stageIndex, setStageIndex] = useState(0);

  const stages = [
    "Retrieving sources...",
    "Mapping concepts...",
    "Building structure...",
    "Synthesizing sections...",
    "Formatting output...",
    "Almost ready..."
  ];

  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => {
        if (prev < stages.length - 1) {
          return prev + 1;
        }
        return prev; // keep "Almost ready..." once we reach the end
      });
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentStageText = stages[stageIndex];
    let currentLength = 0;
    setTypedText("");
    const timer = setInterval(() => {
      if (currentLength < currentStageText.length) {
        currentLength++;
        setTypedText(currentStageText.substring(0, currentLength));
      } else {
        clearInterval(timer);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [stageIndex]);

  const shimmerClass = isDark ? "animate-shiver-morph-dark" : "animate-shiver-morph-light";

  const skeletonConfig = [
    {
      title: "🧒 Layman Term",
      icon: <Baby className="w-4 h-4" />,
      span: "lg:col-span-2",
      height: "min-h-[180px]",
      lines: [
        "w-full h-4",
        "w-[94%] h-4",
        "w-[88%] h-4",
        "w-[91%] h-4",
        "w-[60%] h-4"
      ]
    },
    {
      title: "📡 Definition",
      icon: <BookOpen className="w-4 h-4" />,
      span: "lg:col-span-1",
      height: "min-h-[180px]",
      lines: [
        `w-full h-4 italic border-l-4 ${isDark ? "border-[#ffefb3]/60" : "border-[#013e37]/40"} pl-2`,
        `w-[85%] h-4 italic border-l-4 ${isDark ? "border-[#ffefb3]/60" : "border-[#013e37]/40"} pl-2`,
        `w-[70%] h-4 italic border-l-4 ${isDark ? "border-[#ffefb3]/60" : "border-[#013e37]/40"} pl-2`
      ]
    },
    {
      title: "⏱️ When to Use",
      icon: <Clock className="w-4 h-4" />,
      span: "lg:col-span-1",
      height: "min-h-[180px]",
      lines: [
        "w-full h-4",
        "w-[90%] h-4",
        "w-[80%] h-4"
      ]
    },
    {
      title: "🛠️ How to Make",
      icon: <Wrench className="w-4 h-4" />,
      span: "lg:col-span-1 lg:row-span-2",
      height: "min-h-[380px]",
      isList: true,
      itemsCount: 6
    },
    {
      title: "🧩 Types",
      icon: <Layers className="w-4 h-4" />,
      span: "lg:col-span-1",
      height: "min-h-[180px]",
      isList: true,
      itemsCount: 4
    },
    {
      title: "💡 Points to Ponder",
      icon: <Lightbulb className="w-4 h-4" />,
      span: "lg:col-span-2",
      height: "min-h-[180px]",
      isList: true,
      itemsCount: 4
    },
    {
      title: "🎯 Conclusion",
      icon: <Target className="w-4 h-4" />,
      span: "lg:col-span-2",
      height: "min-h-[180px]",
      lines: [
        `w-[70%] h-6 mx-auto border ${isDark ? "border-[#ffefb3]/20" : "border-[#013e37]/20"} rounded mb-4`,
        "w-full h-4",
        "w-[85%] h-4"
      ]
    },
    {
      title: "🔗 Recommended Sources",
      icon: <Link className="w-4 h-4" />,
      span: "lg:col-span-2",
      height: "min-h-[180px]",
      isList: true,
      itemsCount: 3
    },
    {
      title: "📺 Best Video Guide",
      icon: <Youtube className="w-4 h-4" />,
      span: "lg:col-span-4",
      height: "min-h-[260px]",
      isVideo: true
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 pb-24 animate-fade-in">
      {/* Background container following the Vintage-Brutalist palette */}
      <div className={cn(
        "p-6 border-4 transition-colors duration-300",
        isDark 
          ? "bg-[#013e37] border-[#ffefb3] shadow-[8px_8px_0px_#ffefb3]" 
          : "bg-[#ffefb3] border-[#013e37] shadow-[8px_8px_0px_#013e37]"
      )}>
        
        {/* Skeleton Top Label */}
        <div className="text-center mb-10 space-y-2">
          <span className={cn(
            "font-mono font-black text-[10px] uppercase tracking-[0.4em] block",
            isDark ? "text-[#ffefb3]/70" : "text-[#013e37]/70"
          )}>
            PROCESSING_KNOWLEDGE_PIPELINE
          </span>
          <h2 className={cn(
            "text-2xl md:text-3xl lg:text-4xl font-mono font-black uppercase tracking-tight leading-tight min-h-[40px]",
            isDark ? "text-[#ffefb3]" : "text-[#013e37]"
          )}>
            {typedText}
            <span className="animate-pulse">_</span>
          </h2>
        </div>

        {/* Bento Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skeletonConfig.map((card, idx) => (
            <div 
              key={idx} 
              className={cn(
                card.span, 
                card.height,
                "border-4 flex flex-col overflow-hidden h-full transition-transform duration-300",
                isDark 
                  ? "border-[#ffefb3] shadow-[4px_4px_0px_#ffefb3] bg-[#012b26]" 
                  : "border-[#013e37] shadow-[4px_4px_0px_#013e37] bg-[#fffdf5]"
              )}
            >
              {/* Card Header Band with conditional and completely anonymized shimmer elements */}
              <div className={cn(
                "p-3 flex items-center justify-between border-b-4",
                isDark 
                  ? "border-[#ffefb3] bg-[#ffefb3] text-[#013e37]" 
                  : "border-[#013e37] bg-[#013e37] text-[#ffefb3]"
              )}>
                <div className="flex items-center gap-2 w-full">
                  {isLoading ? (
                    <>
                      {/* Shimmer icon box */}
                      <div className={cn("w-5 h-5 rounded flex-shrink-0", shimmerClass)} />
                      {/* Shimmer header text bar */}
                      <div className={cn("h-3 rounded", shimmerClass)} style={{ width: `${Math.max(50, 100 - (card.title.length * 2.2))}%`, maxWidth: "150px" }} />
                    </>
                  ) : (
                    <>
                      <div className="text-[#ffe97a] flex-shrink-0">{card.icon}</div>
                      <h3 className="font-extrabold text-[10px] uppercase tracking-widest truncate">{card.title}</h3>
                    </>
                  )}
                </div>
                <div className="flex space-x-1.5 flex-shrink-0">
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full border",
                    isDark ? "border-[#013e37]/30" : "border-[#ffefb3]/30",
                    shimmerClass
                  )} />
                  <div className={cn(
                    "w-2.5 h-2.5 rounded-full border",
                    isDark ? "border-[#013e37]/30" : "border-[#ffefb3]/30",
                    shimmerClass
                  )} />
                </div>
              </div>

              {/* Card Body skeleton content */}
              <div className="flex-1 p-5 space-y-3 flex flex-col justify-center">
                {card.isVideo ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4">
                    {/* Fake Video Player Box */}
                    <div className={cn(
                      "w-full aspect-video md:max-w-2xl border-4 border-dashed rounded relative flex items-center justify-center overflow-hidden",
                      isDark ? "border-[#ffefb3]/30 bg-[#01342e]" : "border-[#013e37]/30 bg-[#fffdf5]"
                    )}>
                      <div className={cn("absolute inset-0 opacity-40", shimmerClass)} />
                      <div className={cn(
                        "w-16 h-16 rounded-full border-4 flex items-center justify-center z-10 animate-pulse",
                        isDark ? "border-[#ffefb3] bg-[#013e37]" : "border-[#013e37] bg-[#fff8d6]"
                      )}>
                        <div className={cn(
                          "w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent translate-x-0.5",
                          isDark 
                            ? "border-l-12 border-l-[#ffefb3]" 
                            : "border-l-12 border-l-[#013e37]"
                        )} />
                      </div>
                    </div>
                  </div>
                ) : card.isList ? (
                  <ul className="space-y-3.5">
                    {Array.from({ length: card.itemsCount || 3 }).map((_, i) => (
                      <li key={i} className="flex items-center space-x-3">
                        <div className={cn(
                          "w-2.5 h-2.5 rounded-full flex-shrink-0 border",
                          isDark ? "border-[#ffefb3]/30" : "border-[#013e37]/30",
                          shimmerClass
                        )} />
                        <div 
                          className={cn(
                            "h-3.5 rounded border",
                            isDark ? "border-[#ffefb3]/10" : "border-[#013e37]/10",
                            shimmerClass
                          )} 
                          style={{ width: `${80 - (i % 3) * 15}%` }} 
                        />
                      </li>
                    ))}
                  </ul>
                ) : (
                  card.lines?.map((lineClass, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "rounded border",
                        isDark ? "border-[#ffefb3]/10" : "border-[#013e37]/10",
                        shimmerClass,
                        lineClass
                      )} 
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic Pipeline Stage Text */}
        <div className={cn(
          "mt-12 py-4 flex flex-col items-center justify-center border-t-4 border-dashed",
          isDark ? "border-t-[#ffefb3]/30" : "border-t-[#013e37]/30"
        )}>
          <div className="h-8 flex items-center justify-center">
              <p
                className={cn(
                  "font-mono text-xs uppercase font-extrabold tracking-[0.25em] flex items-center gap-2",
                  isDark ? "text-[#ffefb3]" : "text-[#013e37]"
                )}
              >
                <span className={cn(
                  "w-2 h-2 rounded-full inline-block",
                  isDark ? "bg-[#ffefb3]" : "bg-[#013e37]"
                )} />
                {stages[stageIndex]}
              </p>
          </div>
          <p className={cn(
            "font-mono text-[9px] uppercase tracking-widest mt-1",
            isDark ? "text-[#ffefb3]/50" : "text-[#013e37]/50"
          )}>
            EST_REMAINING_TIME: ~10s
          </p>
        </div>

      </div>
    </div>
  );
}
