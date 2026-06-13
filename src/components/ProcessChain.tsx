import React from "react";
import { cn } from "../lib/utils";
import { 
  Baby, 
  Book, 
  Clock, 
  Wrench, 
  Layers, 
  Lightbulb, 
  Target, 
  Link 
} from "lucide-react";

interface ProcessChainProps {
  isDark?: boolean;
}

const STEPS = [
  { icon: <Baby className="w-3 h-3" />, label: "Layman" },
  { icon: <Book className="w-3 h-3" />, label: "Definition" },
  { icon: <Clock className="w-3 h-3" />, label: "When Use" },
  { icon: <Wrench className="w-3 h-3" />, label: "How Make" },
  { icon: <Layers className="w-3 h-3" />, label: "Types" },
  { icon: <Lightbulb className="w-3 h-3" />, label: "Ponder" },
  { icon: <Target className="w-3 h-3" />, label: "Conclusion" },
  { icon: <Link className="w-3 h-3" />, label: "Sources" },
];

export default function ProcessChain({ isDark }: ProcessChainProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 mb-10 overflow-x-auto no-scrollbar">
      <div className="flex items-center justify-between min-w-[600px] py-4">
        {STEPS.map((step, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center gap-2 group">
              <div
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-75",
                  isDark 
                    ? "bg-[#013E37] border-[#FFEFB3] text-[#FFEFB3] shadow-[4px_4px_0px_0px_#FFEFB3] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px]" 
                    : "bg-[#FFEFB3] border-[#013E37] text-[#013E37] shadow-[4px_4px_0px_0px_#013E37] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px]"
                )}
              >
                {step.icon}
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity",
                isDark ? "text-teal-200" : "text-teal-600"
              )}>
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={cn(
                "h-[2px] flex-grow mx-2 mb-6",
                isDark ? "bg-teal-800" : "bg-teal-100"
              )} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
