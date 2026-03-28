import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Upload, CheckCircle2, X, FileText, AlertCircle } from 'lucide-react';
import { useAppContext } from '../AppContext';

interface TrustVerificationProps {
  onClose: () => void;
}

export const TrustVerification: React.FC<TrustVerificationProps> = ({ onClose }) => {
  const { verifyUser } = useAppContext();
  const [step, setStep] = useState<'intro' | 'upload' | 'verifying' | 'success'>('intro');
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = () => {
    setStep('verifying');
    setTimeout(() => {
      verifyUser();
      setStep('success');
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md glass rounded-[2.5rem] p-8 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <AnimatePresence mode="wait">
          {step === 'intro' && (
            <motion.div 
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 text-center"
            >
              <div className="w-20 h-20 bg-emerald-500/20 rounded-[2rem] flex items-center justify-center mx-auto">
                <Shield className="text-emerald-400 w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Trust Verification</h2>
                <p className="text-white/40 text-sm">Verify your identity to unlock high-stakes rentals and lending features in Kathmandu.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 mt-1 shrink-0" size={16} />
                  <p className="text-xs text-white/60">Upload Citizenship ID or Nagarpalika Verification.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 mt-1 shrink-0" size={16} />
                  <p className="text-xs text-white/60">Unlock Rs. 5000+ daily rental limit.</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="text-emerald-400 mt-1 shrink-0" size={16} />
                  <p className="text-xs text-white/60">Verified Badge on your profile.</p>
                </div>
              </div>
              <button 
                onClick={() => setStep('upload')}
                className="w-full py-4 rounded-2xl bg-emerald-green hover:bg-emerald-green/90 text-white font-bold transition-all"
              >
                Start Verification
              </button>
            </motion.div>
          )}

          {step === 'upload' && (
            <motion.div 
              key="upload"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Upload Document</h2>
                <p className="text-white/40 text-sm">Please provide a clear photo of your Nepal Citizenship ID.</p>
              </div>
              
              <div 
                className="border-2 border-dashed border-white/10 rounded-3xl p-12 flex flex-col items-center justify-center space-y-4 hover:border-emerald-500/50 transition-all cursor-pointer bg-white/5"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="text-white/20 w-12 h-12" />
                <div className="text-center">
                  <p className="text-sm font-bold">Click to upload</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">JPG, PNG or PDF (Max 5MB)</p>
                </div>
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              {file && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <FileText className="text-emerald-400" size={20} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{file.name}</p>
                    <p className="text-[10px] text-white/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <CheckCircle2 className="text-emerald-400" size={20} />
                </div>
              )}

              <button 
                disabled={!file}
                onClick={handleUpload}
                className="w-full py-4 rounded-2xl bg-emerald-green hover:bg-emerald-green/90 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit for Review
              </button>
            </motion.div>
          )}

          {step === 'verifying' && (
            <motion.div 
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8 py-12 text-center"
            >
              <div className="relative w-24 h-24 mx-auto">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="text-emerald-400 w-10 h-10" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Verifying Identity</h2>
                <p className="text-white/40 text-sm">Foundry AI is cross-referencing your ID with Nagarpalika records...</p>
              </div>
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.2em]">
                <span className="animate-pulse">Secure Link Established</span>
              </div>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8 text-center"
            >
              <div className="w-24 h-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(46,204,113,0.4)]">
                <CheckCircle2 className="text-white w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Identity Verified!</h2>
                <p className="text-white/40 text-sm">Welcome to the Foundry Trust Network. You now have full access to all rental features.</p>
              </div>
              <button 
                onClick={onClose}
                className="w-full py-4 rounded-2xl bg-white text-black font-bold transition-all"
              >
                Enter Marketplace
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
