import React from 'react';
import { motion } from 'motion/react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = "", 
  size = 'md', 
  showText = true 
}) => {
  const sizeMap = {
    sm: { icon: 24, text: 'text-sm' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 64, text: 'text-4xl' },
    xl: { icon: 80, text: 'text-5xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* SVG Icon: Anvil + Shield */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: [0.95, 1.05, 0.95],
          opacity: 1,
          filter: [
            'drop-shadow(0 0 8px rgba(0, 122, 255, 0.3))',
            'drop-shadow(0 0 20px rgba(0, 122, 255, 0.6))',
            'drop-shadow(0 0 8px rgba(0, 122, 255, 0.3))'
          ]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="relative flex items-center justify-center"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="chrome-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#007AFF" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#007AFF" />
            </linearGradient>
            <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#007AFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#007AFF" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Shield Silhouette - More Angular */}
          <path
            d="M50 2 L10 22 V52 L50 98 L90 52 V22 L50 2Z"
            stroke="url(#chrome-gradient)"
            strokeWidth="3"
            strokeLinejoin="miter"
          />

          {/* Anvil Shape - More Geometric/Forged */}
          <path
            d="M25 35 H75 L80 42 H65 V58 H80 L75 65 H25 L20 58 H35 V42 H20 L25 35Z"
            fill="white"
            fillOpacity="0.05"
            stroke="url(#chrome-gradient)"
            strokeWidth="2"
            strokeLinejoin="miter"
          />

          {/* Glowing Core (AI/Gemini) */}
          <circle cx="50" cy="48" r="10" fill="url(#core-glow)" />
          <motion.path 
            d="M50 40 L56 48 L50 56 L44 48 L50 40Z"
            fill="#007AFF"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
              filter: ['brightness(1)', 'brightness(2)', 'brightness(1)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </svg>
      </motion.div>

      {/* Brand Typography */}
      {showText && (
        <div className={`flex items-center font-black tracking-[0.3em] uppercase italic ${currentSize.text} text-white`}>
          <span>F</span>
          {/* Custom "O" - Scan Ring / Molten Core */}
          <div className="relative flex items-center justify-center mx-2 h-[1em] w-[1em]">
            {/* Outer Ring */}
            <motion.div
              animate={{ 
                rotate: 360,
                borderColor: ['rgba(0,122,255,0.3)', 'rgba(0,122,255,1)', 'rgba(0,122,255,0.3)']
              }}
              transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, borderColor: { duration: 2, repeat: Infinity } }}
              className="absolute inset-0 border-2 border-electric-blue rounded-full"
            />
            {/* Inner Glowing Core - Molten/AI Hybrid */}
            <motion.div
              animate={{ 
                scale: [0.8, 1.2, 0.8],
                opacity: [0.5, 0.9, 0.5],
                boxShadow: [
                  '0 0 5px rgba(0,122,255,0.5), 0 0 10px rgba(255,99,33,0.2)',
                  '0 0 20px rgba(0,122,255,0.8), 0 0 30px rgba(255,99,33,0.4)',
                  '0 0 5px rgba(0,122,255,0.5), 0 0 10px rgba(255,99,33,0.2)'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1/2 h-1/2 bg-gradient-to-br from-electric-blue to-sunset-orange rounded-full blur-[1px]"
            />
            {/* Scan Line */}
            <motion.div
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-[1px] bg-white/50 z-10 shadow-[0_0_5px_white]"
            />
          </div>
          <span>UNDRY</span>
        </div>
      )}
    </div>
  );
};
