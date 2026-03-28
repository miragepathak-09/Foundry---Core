import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Users, Shield, ArrowRight } from 'lucide-react';

interface PermissionModalProps {
  onGrantLocation: () => void;
  onDenyLocation: () => void;
}

export const PermissionModal: React.FC<PermissionModalProps> = ({ onGrantLocation, onDenyLocation }) => {
  const [step, setStep] = useState<'location' | 'complete'>('location');

  const handleLocationRequest = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          onGrantLocation();
          setStep('complete');
        },
        () => {
          onDenyLocation();
          setStep('complete');
        }
      );
    } else {
      onDenyLocation();
      setStep('complete');
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        {step === 'location' && (
          <motion.div
            key="location-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="bg-[#151619] border border-white/10 rounded-[2rem] p-8 max-w-md w-full shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
            
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center relative">
                <MapPin className="text-emerald-400 w-10 h-10" />
                <div className="absolute inset-0 bg-emerald-500/20 rounded-[2rem] animate-ping" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white text-center mb-4">
              Foundry Needs Your Location
            </h2>
            
            <p className="text-gray-400 text-center mb-8 leading-relaxed">
              Foundry needs your location to show you neighbors in <span className="text-emerald-400 font-bold">Kathmandu</span>. This helps us alert you to lost items in your immediate vicinity.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleLocationRequest}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Allow Location Access
                <ArrowRight size={18} />
              </button>
              
              <button
                onClick={onDenyLocation}
                className="w-full bg-white/5 hover:bg-white/10 text-gray-400 font-medium py-4 rounded-xl transition-all"
              >
                Not Now
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-500 uppercase tracking-widest">
              <Shield size={12} />
              Privacy Secured • End-to-End Encrypted
            </div>
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            key="complete-modal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#151619] border border-white/10 rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
              >
                <Users className="text-green-400 w-8 h-8" />
              </motion.div>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">Welcome to the Node</h2>
            <p className="text-gray-400 mb-6">Your neighborhood is active. Let's start building resilience.</p>
            
            <button
              onClick={() => setStep('location')} // Close logic handled by parent
              className="w-full bg-white text-black font-bold py-4 rounded-xl"
            >
              Get Started
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
