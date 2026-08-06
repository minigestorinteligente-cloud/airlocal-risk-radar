"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface AgentSectionHeaderProps {
  fase: 1 | 2 | 3 | 4 | 5;
  agent?: 'guardian' | 'leakHunter' | 'strategist' | 'oracle' | 'none';
  title?: string;
  description?: string;
  subtitle?: string;
  agentName?: string;
}

const agentDict = {
  guardian: {
    name: "El Guardián",
    icon: "/assets/icon-guardian.webp",
    color: "#00D1B2",
    description: "Analizó la salud financiera de tu propiedad e identificó el potencial económico actual."
  },
  leakHunter: {
    name: "El Cazafugas",
    icon: "/assets/icon-cazafugas.webp",
    color: "#00D1B2",
    description: "Identificó las principales fugas que afectan tu rentabilidad."
  },
  strategist: {
    name: "El Estratega",
    icon: "/assets/icon-estratega.webp",
    color: "#00D1B2",
    description: "Priorizó las acciones con mayor impacto económico."
  },
  oracle: {
    name: "El Oráculo",
    icon: "/assets/icon-cazafugas.webp",
    color: "#00D1B2",
    description: "Modeló distintos escenarios de recuperación y crecimiento."
  },
  none: {
    name: "PLAN DE ACCIÓN",
    icon: "",
    color: "#00D1B2",
    description: "Organizó el orden correcto para ejecutar las mejoras."
  }
};

export const AgentSectionHeader: React.FC<AgentSectionHeaderProps> = ({ 
  fase, 
  agent = 'none', 
  title, 
  description,
  subtitle,
  agentName
}) => {
  const currentAgent = agentDict[agent] || agentDict.none;

  // Resolve dynamic values based on fase if not explicitly passed
  let displayTitle = title;
  let displayDesc = description;
  let displaySubtitle = subtitle;

  if (!displayTitle) {
    if (fase === 1) displayTitle = "DIAGNÓSTICO OPERATIVO";
    else if (fase === 2) displayTitle = "DETECCIÓN DE FUGAS";
    else if (fase === 3) displayTitle = "OPORTUNIDADES PRIORIZADAS";
    else if (fase === 4) displayTitle = "PROYECCIÓN DE RECUPERACIÓN";
    else if (fase === 5) displayTitle = "PLAN DE ACCIÓN 30·60·90";
  }

  if (!displayDesc) {
    displayDesc = currentAgent.description;
  }

  if (!displaySubtitle) {
    if (fase === 1) displaySubtitle = "¿Qué tan saludable está tu operación y cuánto dinero estás dejando sobre la mesa?";
    else if (fase === 2) displaySubtitle = "¿Dónde se está escapando exactamente tu dinero?";
    else if (fase === 3) displaySubtitle = "¿Qué acciones generan el mayor impacto económico?";
    else if (fase === 4) displaySubtitle = "¿Cuánto podría recuperar si ejecuto estas mejoras?";
    else if (fase === 5) displaySubtitle = "¿Cuál es el orden correcto para implementar los cambios?";
  }

  return (
    <div className="w-full grid grid-cols-[64px_1fr] md:grid-cols-[72px_1fr] gap-4 md:gap-6 mt-16 mb-8 text-left items-start animate-in fade-in slide-in-from-top-4 duration-500">
      {/* 1. Track Izquierdo: Círculo con Número + Línea Vertical + Icono */}
      <div className="flex flex-col items-center relative pt-4 pb-4 w-full">
        {/* Línea vertical: 1px, rgba(255,255,255,0.12), por detrás de círculo e icono, conecta número → icono */}
        <div className="absolute top-0 bottom-0 w-[1px] bg-white/12 left-1/2 -translate-x-1/2 pointer-events-none" />

        {/* Círculo con Número: diámetro 42px, borde 1px sólido gris neutro, fondo muy oscuro, texto blanco, font-weight 700 */}
        <div className="w-[42px] h-[42px] rounded-full border border-neutral-700 bg-[#0B0C10] flex items-center justify-center text-lg font-bold text-white z-10 relative select-none">
          {fase}
        </div>

        {/* Separador/Conexión */}
        <div className="h-8 md:h-10" />

        {/* Icono del Agente: 64px (móvil) / 72px (desktop), z-10, glow, no reducir */}
        <div 
          className="relative w-16 h-16 md:w-[72px] md:h-[72px] shrink-0 flex items-center justify-center rounded-2xl bg-white/[0.02] border border-white/5 z-10 overflow-hidden"
          style={{
            boxShadow: agent !== 'none' ? `0 0 30px ${currentAgent.color}15, inset 0 1px 1px rgba(255,255,255,0.02)` : undefined,
            borderColor: agent !== 'none' ? `${currentAgent.color}20` : 'rgba(255,255,255,0.05)'
          }}
        >
          {agent !== 'none' && currentAgent.icon ? (
            <img 
              src={currentAgent.icon} 
              alt={currentAgent.name} 
              className="w-full h-full object-contain"
            />
          ) : (
            <CheckCircle2 
              className="w-10 h-10 md:w-12 md:h-12" 
              style={{ color: currentAgent.color }}
            />
          )}
        </div>
      </div>

      {/* 2. Bloque de Texto Derecho: Narrativa + Título + Subtítulo */}
      {/* pt-[90px] en móvil y pt-[98px] en desktop para alinear exactamente con el top del icono */}
      <div className="flex-1 flex flex-col pt-[90px] md:pt-[98px]">
        {/* Fila Narrativa Superior */}
        <div className="text-[18px] font-medium leading-snug">
          {/* Nombre Agente: color acento, size 18-20px, font weight 700, uppercase */}
          <span 
            className="font-bold uppercase tracking-wider mr-2 text-[18px] md:text-[20px]"
            style={{ color: currentAgent.color }}
          >
            {agentName ? agentName.toUpperCase() : (agent === 'none' ? 'PLAN DE ACCIÓN' : currentAgent.name.toUpperCase())}
          </span>
          {/* Narrativa: color rgba(255,255,255,0.82), size 18px, weight 500, no cursiva */}
          <span 
            className="font-medium text-[18px]"
            style={{ color: 'rgba(255,255,255,0.82)' }}
          >
            — {displayDesc}
          </span>
        </div>

        {/* Título Principal: blanco, 48px desktop, 42px tablet, 34px móvil, weight 800 */}
        <h2 className="text-[34px] sm:text-[42px] md:text-[48px] font-extrabold text-white leading-tight uppercase tracking-tight mt-3">
          {displayTitle}
        </h2>

        {/* Subtítulo: 24px, weight 600, color acento, no mayúsculas */}
        <p 
          className="text-[24px] font-semibold mt-2 leading-snug"
          style={{ color: currentAgent.color }}
        >
          {displaySubtitle}
        </p>
      </div>
    </div>
  );
};

export default AgentSectionHeader;
