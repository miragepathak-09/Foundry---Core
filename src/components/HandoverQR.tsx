import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { QrCode, X, ShieldCheck, CheckCircle2, Loader2, Smartphone, Zap } from 'lucide-react';
import { Item } from '../types';
import { useAppContext } from '../AppContext';
import confetti from 'canvas-confetti';

interface HandoverQRProps {
  item: Item;
  onClose: () => void;
}

export const HandoverQR: React.FC<HandoverQRProps> = ({ item, onClose }) => {
  const { updateItemStatus } = useAppContext();
  const [step, setStep] = useState<'generate' | 'scanning' | 'success'>('generate');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (step === 'scanning') {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 30);

      const timer = setTimeout(() => {
        setStep('success');
        triggerConfetti();
        // Update item status to rented/in-use
        updateItemStatus(item.id, 'rented');
      }, 3500);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [step, item.id, updateItemStatus]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 2000 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md glass rounded-[2.5rem] p-8 relative overflow-hidden border-[0.5px] border-white/20"
      >
        {/* Neon Accent */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 ${
          step === 'success' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.8)]' : 'bg-electric-blue shadow-[0_0_20px_rgba(0,243,255,0.8)]'
        }`} />

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">
              {step === 'generate' && 'Secure Handshake'}
              {step === 'scanning' && 'Verifying Protocol'}
              {step === 'success' && 'Handshake Complete'}
            </h3>
            <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">
              {step === 'success' ? 'Transaction Immutable' : 'Dual-Key Encryption Active'}
            </p>
          </div>

          <div className="relative flex justify-center">
            <AnimatePresence mode="wait">
              {step === 'generate' && (
                <motion.div 
                  key="qr"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="p-8 bg-white rounded-3xl relative group cursor-pointer"
                  onClick={() => setStep('scanning')}
                >
                  <QrCode size={180} className="text-black" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-black/60">Tap to Scan (Simulate)</p>
                  </div>
                </motion.div>
              )}

              {step === 'scanning' && (
                <motion.div 
                  key="scanning"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="w-[244px] h-[244px] flex flex-col items-center justify-center space-y-4"
                >
                  <div className="relative">
                    <Loader2 size={80} className="text-electric-blue animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Smartphone size={32} className="text-white" />
                    </div>
                  </div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      className="h-full bg-electric-blue shadow-[0_0_15px_rgba(0,243,255,0.5)]"
                    />
                  </div>
                  <p className="text-[10px] font-mono text-electric-blue font-bold">ESTABLISHING SECURE TUNNEL...</p>
                </motion.div>
              )}

              {step === 'success' && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-[244px] h-[244px] flex flex-col items-center justify-center space-y-4"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                    className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)]"
                  >
                    <CheckCircle2 size={48} className="text-white" />
                  </motion.div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-emerald-400">Success!</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Hash: 0x7a2f...8b9c</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-xs font-bold">{item.title}</p>
                <p className="text-[10px] text-white/40">Rental Handover Protocol</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <ShieldCheck size={16} className="text-emerald-500" />
              <p className="text-[10px] text-white/60 leading-relaxed text-left">
                This transaction is protected by Foundry's Escrow. Funds will be released upon successful return verification.
              </p>
            </div>
          </div>

          {step === 'success' && (
            <button 
              onClick={onClose}
              className="w-full py-4 rounded-2xl bg-white text-black font-bold text-sm uppercase tracking-widest hover:bg-white/90 transition-all active:scale-95"
            >
              Done
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};
