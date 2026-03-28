import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import FoundryApp from './FoundryApp';
import { PermissionModal } from './components/PermissionModal';
import { AnimatePresence, motion } from 'motion/react';
import { Bell, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { matches } = useAppContext();
  const [lastMatchCount, setLastMatchCount] = useState(0);
  const [showMatchToast, setShowMatchToast] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    const hasSeenPermission = localStorage.getItem('foundry_permission_seen');
    if (!hasSeenPermission) {
      setShowPermissionModal(true);
    }
  }, []);

  const handleGrantPermission = () => {
    localStorage.setItem('foundry_permission_seen', 'true');
    setShowPermissionModal(false);
  };

  // Match Notification Logic
  useEffect(() => {
    if (matches.length > lastMatchCount) {
      setShowMatchToast(true);
      setLastMatchCount(matches.length);
      const timer = setTimeout(() => setShowMatchToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [matches, lastMatchCount]);

  return (
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-electric-blue/30">
      <FoundryApp />

      <AnimatePresence>
        {showPermissionModal && (
          <PermissionModal 
            onGrantLocation={handleGrantPermission}
            onDenyLocation={handleGrantPermission}
          />
        )}
      </AnimatePresence>

      {/* Match Toast Notification */}
      <AnimatePresence>
        {showMatchToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-[3000] w-full max-w-sm"
          >
            <div className="glass p-4 rounded-3xl border-emerald-green/50 flex items-center gap-4 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-green flex items-center justify-center">
                <Bell className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <h4 className="font-bold text-sm">Smart Match!</h4>
                <p className="text-xs text-white/60">A potential match was found nearby.</p>
              </div>
              <button 
                onClick={() => setShowMatchToast(false)}
                className="text-xs font-bold uppercase tracking-widest text-emerald-green hover:text-white transition-colors"
              >
                View
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Security Status Overlay */}
      <div className="fixed top-6 right-6 z-[2000] hidden md:flex items-center gap-3 px-4 py-2 rounded-full glass border-emerald-green/20">
        <ShieldCheck size={16} className="text-emerald-green" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Node Secure</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
