"use client";

import React from 'react';

export default function FloatingHeroImage() {
  return (
    <div className="relative w-full z-20 mt-10 lg:mt-0">
      <style dangerouslySetInnerHTML={{__html: `
        /* Horizontal Focus Animation */
        @keyframes card-focus {
          0%, 30% {
            transform: scale(1.05) translateY(-10px);
            opacity: 1;
            filter: drop-shadow(0 20px 40px rgba(255, 255, 255, 0.15)) brightness(1.1);
          }
          35%, 95% {
            transform: scale(0.95) translateY(0);
            opacity: 0.7;
            filter: drop-shadow(0 0 0 transparent) brightness(1);
          }
          100% {
            transform: scale(1.05) translateY(-10px);
            opacity: 1;
            filter: drop-shadow(0 20px 40px rgba(255, 255, 255, 0.15)) brightness(1.1);
          }
        }

        .horizontal-card {
          animation: card-focus 6s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
          will-change: transform, opacity, filter;
        }

        /* Hide scrollbar for a cleaner mobile experience */
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
      
      {/* Horizontal List Container */}
      <div className="flex flex-row gap-[20px] overflow-x-auto lg:overflow-x-visible hide-scrollbar snap-x snap-mandatory w-full max-w-[100vw] px-[10vw] lg:px-0 py-10 lg:justify-center items-center">
        
        {/* Card 1 - Saludable (Active 0s to 2s) */}
        <div 
          className="horizontal-card shrink-0 snap-center w-[220px] lg:w-[280px]" 
          style={{ animationDelay: '0s' }}
        >
          <img src="/card-saludable.png" alt="Estado Saludable" className="w-full h-auto object-contain bg-transparent" />
        </div>

        {/* Card 2 - Vulnerable (Active 2s to 4s) */}
        <div 
          className="horizontal-card shrink-0 snap-center w-[220px] lg:w-[280px]" 
          style={{ animationDelay: '-4s' }}
        >
          <img src="/card-vulnerable.png" alt="Estado Vulnerable" className="w-full h-auto object-contain bg-transparent" />
        </div>

        {/* Card 3 - Critico (Active 4s to 6s) */}
        <div 
          className="horizontal-card shrink-0 snap-center w-[220px] lg:w-[280px]" 
          style={{ animationDelay: '-2s' }}
        >
          <img src="/card-critico.png" alt="Estado Crítico" className="w-full h-auto object-contain bg-transparent" />
        </div>

      </div>
    </div>
  );
}
