"use client";

import { useState, useRef, useEffect } from "react";
import { Info, X } from "lucide-react";

export default function InfoTooltip({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative flex items-center" ref={popoverRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-[#94a3b8] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#1e293b] rounded-full p-1"
        aria-label="Más información"
      >
        <Info className="w-4 h-4" />
      </button>
      
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-64 bg-[#0a0a0d] border border-zinc-800 rounded-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 text-[13px] text-zinc-400 font-medium leading-relaxed transform origin-bottom-right animate-in fade-in zoom-in-95 duration-200">
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-[#94a3b8] hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
          {content}
        </div>
      )}
    </div>
  );
}
