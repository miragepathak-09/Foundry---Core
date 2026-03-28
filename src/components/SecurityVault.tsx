import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Fingerprint, Lock, History, CheckCircle2, X, AlertCircle, ExternalLink } from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Transaction } from '../types';

interface SecurityVaultProps {
  onClose: () => void;
  transactions: Transaction[];
}

export const SecurityVault: React.FC<SecurityVaultProps> = ({ onClose, transactions }) => {
  const { user, setUser } = useAppContext();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRegisterBiometrics = async () => {
    setIsRegistering(true);
    
    // Defensive check for WebAuthn API
    if (!window.PublicKeyCredential) {
      console.error('WebAuthn not supported');
      setIsRegistering(false);
      return;
    }

    try {
      // Mock biometric prompt simulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (user) {
        setUser({ ...user, biometricsRegistered: true });
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Biometric registration failed:', err);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl glass rounded-[2.5rem] p-8 relative overflow-hidden border-[0.5px] border-white/20"
      >
        {/* Neon Accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_20px_rgba(16,185,129,0.8)]" />

        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Biometric Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                <Shield size={20} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Security Vault</h3>
            </div>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <Fingerprint className={`w-10 h-10 ${user?.biometricsRegistered ? 'text-emerald-400' : 'text-white/20'}`} />
              </div>
              
              <div className="text-center space-y-1">
                <h4 className="font-bold">Biometric Authentication</h4>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Passkey Protocol v3.0</p>
              </div>

              <button 
                onClick={handleRegisterBiometrics}
                disabled={isRegistering || user?.biometricsRegistered}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  user?.biometricsRegistered 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                {isRegistering ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : user?.biometricsRegistered ? (
                  <>
                    <CheckCircle2 size={16} />
                    Registered
                  </>
                ) : (
                  'Register Biometrics'
                )}
              </button>

              <p className="text-[10px] text-center text-white/30 leading-relaxed">
                Secure your transactions with hardware-level encryption and biometric verification.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-yellow-400/5 border border-yellow-400/10 flex items-start gap-3">
              <AlertCircle className="text-yellow-400 shrink-0" size={16} />
              <p className="text-[10px] text-yellow-400/80 leading-relaxed">
                Foundry uses a "Defensive Architecture" where exact locations are only revealed after a biometric handshake.
              </p>
            </div>
          </div>

          {/* Ledger Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-electric-blue/10 text-electric-blue">
                <History size={20} />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Immutable Ledger</h3>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {transactions.map((tx, idx) => (
                <motion.div 
                  key={tx.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 group hover:border-white/20 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold">{tx.itemName}</p>
                      <p className="text-[10px] text-white/40">{tx.counterparty}</p>
                    </div>
                    <div className={`text-xs font-bold ${tx.type === 'earning' ? 'text-emerald-400' : 'text-white'}`}>
                      {tx.type === 'earning' ? '+' : '-'} Rs. {tx.amount}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'completed' ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                      <span className="text-[10px] uppercase tracking-widest font-bold text-white/30">{tx.status}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[8px] font-mono text-white/20 group-hover:text-white/40 transition-colors">
                      {tx.hash.substring(0, 10)}...
                      <ExternalLink size={8} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Biometric Prompt Mockup */}
      <AnimatePresence>
        {isRegistering && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-xs glass rounded-3xl p-6 border border-white/20 shadow-2xl z-[1100]"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                <Fingerprint className="text-white animate-pulse" size={24} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold">Register Foundry Passkey</p>
                <p className="text-[10px] text-white/40">Use your device's biometric sensor to securely link your account.</p>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2 }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    className={className} 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
