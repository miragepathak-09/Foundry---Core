import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Zap, 
  Shield, 
  Bell, 
  ArrowUpRight, 
  Plus, 
  MapPin, 
  Activity, 
  Users, 
  QrCode,
  CheckCircle2,
  AlertCircle,
  Clock,
  Heart,
  X,
  Package,
  Handshake,
  Loader2,
  Search,
  Wallet,
  Star,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpLeft
} from 'lucide-react';
import { useAppContext } from '../AppContext';
import { Item, ItemType, User } from '../types';
import { HandoverQR } from './HandoverQR';
import { EnhancedMap } from './EnhancedMap';
import { ItemForm } from './ItemForm';
import { PermissionModal } from './PermissionModal';
import { TrustVerification } from './TrustVerification';
import { MarketplaceGrid } from './MarketplaceGrid';
import { SecurityVault } from './SecurityVault';
import { useWallet } from '../hooks/useWallet';

export const MarketplaceDashboard: React.FC = () => {
  const { user, items, location, setLocation, updateItemStatus, neighbors, setNeighbors } = useAppContext();
  const { wallet, lockInEscrow } = useWallet();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showQR, setShowQR] = useState<Item | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showSyncComplete, setShowSyncComplete] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(true);
  const [showTrustModal, setShowTrustModal] = useState(false);
  const [showSecurityVault, setShowSecurityVault] = useState(false);
  const [showFABMenu, setShowFABMenu] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [showItemForm, setShowItemForm] = useState<ItemType | null>(null);

  const startSync = () => {
    setIsSyncing(true);
    setSyncProgress(0);
    
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    setTimeout(() => {
      const mockNeighbors: User[] = [
        { id: 'n1', uid: 'FD-2026-N1', name: 'Rajesh Hamal', email: 'rajesh@nepal.np', neighborhood: 'Baneshwor', karma: 450, level: 2, isVerified: true, rating: 4.8 },
        { id: 'n2', uid: 'FD-2026-N2', name: 'Bipana Thapa', email: 'bipana@nepal.np', neighborhood: 'Lalitpur', karma: 320, level: 2, isVerified: true, rating: 4.9 },
        { id: 'n3', uid: 'FD-2026-N3', name: 'Sunil Thapa', email: 'sunil@nepal.np', neighborhood: 'Thamel', karma: 280, level: 1, isVerified: false, rating: 4.2 },
      ];
      setNeighbors(mockNeighbors);
      setIsSyncing(false);
      setShowSyncComplete(true);
      setTimeout(() => setShowSyncComplete(false), 3000);
    }, 2500);
  };

  const handleGrantLocation = () => {
    setShowPermissionModal(false);
    setLocation({ lat: 27.7172, lng: 85.3240 }); 
  };

  const handleRentNow = (item: Item) => {
    if (!user?.idVerified) {
      setShowTrustModal(true);
      return;
    }
    if (!user?.biometricsRegistered) {
      setShowSecurityVault(true);
      return;
    }
    
    // Lock deposit in escrow
    if (item.deposit) {
      lockInEscrow(item.deposit, item.id, item.title, item.authorName || 'Owner');
    }
    
    setShowQR(item);
    setSelectedItem(null);
  };

  const karmaProgress = (user?.karma || 0) % 100;
  const karmaLevel = Math.floor((user?.karma || 0) / 100) + 1;

  const stats = [
    { label: 'Items Saved', value: items.filter(i => i.status === 'resolved').length, icon: CheckCircle2, color: 'text-emerald-green' },
    { label: 'Tools Shared', value: items.filter(i => i.type === 'lending').length, icon: Zap, color: 'text-yellow-400' },
    { label: 'Neighbors', value: neighbors.length > 0 ? neighbors.length : 124, icon: Users, color: 'text-sunset-orange' },
    { label: 'Karma Rank', value: '#12', icon: Trophy, color: 'text-yellow-400' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-8 space-y-8 selection:bg-emerald-500/30">
      {/* Permission Modal */}
      <AnimatePresence>
        {showPermissionModal && (
          <PermissionModal 
            onGrantLocation={handleGrantLocation}
            onDenyLocation={() => setShowPermissionModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Trust Verification Modal */}
      <AnimatePresence>
        {showTrustModal && (
          <TrustVerification onClose={() => setShowTrustModal(false)} />
        )}
      </AnimatePresence>

      {/* Security Vault Modal */}
      <AnimatePresence>
        {showSecurityVault && (
          <SecurityVault 
            onClose={() => setShowSecurityVault(false)} 
            transactions={wallet.history}
          />
        )}
      </AnimatePresence>

      {/* Header Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold tracking-tight">Foundry Marketplace</h1>
          <p className="text-white/40 text-sm font-bold uppercase tracking-[0.2em]">Kathmandu Node // Resilience Protocol v2.5</p>
        </div>
        
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowSecurityVault(true)}
            className="glass rounded-2xl px-6 py-3 flex items-center gap-4 border-[0.5px] border-white/20 cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Wallet size={20} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Available Balance</p>
              <p className="text-lg font-bold">Rs. {wallet.available}</p>
            </div>
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">In Escrow</p>
              <p className="text-lg font-bold text-yellow-400">Rs. {wallet.escrow}</p>
            </div>
          </motion.div>

          <button 
            onClick={() => setShowTrustModal(true)}
            className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-2 border-[0.5px] ${
              user?.idVerified ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-white text-black hover:bg-white/90 border-white/20'
            }`}
          >
            {user?.idVerified ? <CheckCircle2 size={16} /> : <Shield size={16} />}
            {user?.idVerified ? 'Verified ID' : 'Verify ID'}
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Top-Left: Live Interactive Map (Large) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-8 h-[500px] bento-card relative overflow-hidden p-0 border-[0.5px] border-white/20 shadow-2xl"
        >
          <div className="absolute top-6 left-6 z-[1000] flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-black/40 backdrop-blur-md border-[0.5px] border-white/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-green animate-pulse shadow-[0_0_10px_rgba(46,204,113,0.8)]" />
              <span className="text-xs font-bold uppercase tracking-wider">Live Node: {user?.neighborhood}</span>
            </div>
            
            <div className="flex-1 bg-black/40 backdrop-blur-md border-[0.5px] border-white/20 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-lg min-w-[200px] group-focus-within:border-emerald-500/50 transition-all">
              <Search className="text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Search Kathmandu (e.g., Thamel, Patan)..." 
                className="bg-transparent border-none outline-none text-white text-xs w-full placeholder:text-gray-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value.toLowerCase();
                    if (val.includes('thamel')) setLocation({ lat: 27.7150, lng: 85.3123 });
                    else if (val.includes('patan')) setLocation({ lat: 27.6710, lng: 85.3240 });
                    (e.target as HTMLInputElement).value = '';
                  }
                }}
              />
            </div>
          </div>

          <EnhancedMap 
            onMarkerClick={setSelectedItem}
            onMapClick={(lat, lng) => console.log('Map clicked at:', lat, lng)}
          />

          {/* Scanning Overlay */}
          <AnimatePresence>
            {isSyncing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-[1001] bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="relative w-24 h-24 mb-6">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="text-emerald-400 w-10 h-10" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Scanning Contacts</h3>
                <p className="text-xs text-gray-400 mb-6 max-w-[200px]">Finding trusted neighbors in Kathmandu...</p>
                
                <div className="w-full max-w-[200px] bg-white/5 h-1.5 rounded-full overflow-hidden mb-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${syncProgress}%` }}
                    className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                </div>
                <div className="text-emerald-400 font-mono text-[10px] font-bold">{syncProgress}%</div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-6 left-6 right-6 z-[1000] flex justify-between items-end pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
              {['lost', 'found', 'rental'].map(type => (
                <div key={type} className="px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border-[0.5px] border-white/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${type === 'lost' ? 'bg-sunset-orange' : type === 'found' ? 'bg-emerald-green' : 'bg-yellow-400'}`} />
                  {type}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top-Right: Karma Level Card (Square) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="md:col-span-4 bento-card flex flex-col items-center justify-center space-y-6 text-center border-[0.5px] border-white/20"
        >
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-white/5"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={440}
                strokeDashoffset={440 - (440 * karmaProgress) / 100}
                className="text-emerald-green transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold">{user?.karma}</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Karma</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-green/10 text-emerald-green text-xs font-bold uppercase tracking-widest">
              <Trophy size={14} />
              Local Hero Lvl {karmaLevel}
            </div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs font-bold">
              <Star size={12} fill="currentColor" />
              {user?.rating} Rating
            </div>
          </div>

          <div className="w-full space-y-3">
            <button 
              onClick={startSync}
              disabled={isSyncing}
              className="w-full py-3 rounded-xl bg-white/5 border-[0.5px] border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50"
            >
              {isSyncing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Users size={16} />
                  Find Neighbors
                </>
              )}
            </button>
            
            <AnimatePresence>
              {showSyncComplete && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] text-emerald-green font-bold uppercase tracking-widest"
                >
                  {neighbors.length} Neighbors Found in Nepal
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Middle: Featured Marketplace Grid (Wide) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-12"
        >
          <MarketplaceGrid onItemClick={setSelectedItem} />
        </motion.div>

        {/* Bottom: Quick Stats (Small Cards) */}
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="md:col-span-3 bento-card flex items-center gap-4 group border-[0.5px] border-white/20"
          >
            <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </motion.div>
        ))}

      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-lg glass rounded-[2.5rem] p-8 space-y-6 relative border-[0.5px] border-white/20"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-3xl ${
                  selectedItem.type === 'lost' ? 'bg-sunset-orange/10 text-sunset-orange' : 
                  selectedItem.type === 'found' ? 'bg-emerald-green/10 text-emerald-green' : 
                  'bg-yellow-400/10 text-yellow-400'
                }`}>
                  <Activity size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                  <p className="text-white/40 text-sm uppercase tracking-widest font-bold">{selectedItem.type} • {selectedItem.neighborhood || 'Local Node'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-2">
                  <p className="text-xs uppercase tracking-widest text-white/30 font-bold">Description</p>
                  <p className="text-white/80 leading-relaxed">{selectedItem.description}</p>
                </div>

                {selectedItem.type === 'lending' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-3xl bg-yellow-400/5 border border-yellow-400/10 space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-yellow-400/60 font-bold">Daily Rent</p>
                      <p className="text-xl font-bold">Rs. {selectedItem.pricePerDay}</p>
                    </div>
                    <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Trust Deposit</p>
                      <p className="text-xl font-bold">Rs. {selectedItem.deposit}</p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Owner</p>
                    <p className="font-bold flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-electric-blue/20 text-electric-blue flex items-center justify-center text-[10px]">
                        {selectedItem.authorName?.[0] || 'A'}
                      </div>
                      {selectedItem.authorName || 'Anonymous'}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] text-yellow-400 font-bold">
                      <Star size={10} fill="currentColor" />
                      {selectedItem.authorRating} Rating
                    </div>
                  </div>
                  <div className="p-4 rounded-3xl bg-white/5 border border-white/10 space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Posted</p>
                    <p className="font-bold flex items-center gap-2">
                      <Clock size={14} className="text-white/30" />
                      {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {selectedItem.type === 'lending' && (
                  <button 
                    onClick={() => handleRentNow(selectedItem)}
                    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(250,204,21,0.2)]"
                  >
                    <Handshake size={20} /> Rent Now
                  </button>
                )}
                {selectedItem.type === 'lost' && (
                  <button className="flex-1 bg-emerald-green hover:bg-emerald-green/90 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(46,204,113,0.2)]">
                    <Heart size={20} /> I Found This
                  </button>
                )}
                <button className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10">
                  Message
                </button>
              </div>
              
              <div className="flex justify-center">
                <button className="text-[10px] text-sunset-orange hover:text-sunset-orange/80 font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                  <AlertTriangle size={12} /> Report Dispute
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-8 right-8 z-[100]">
        <AnimatePresence>
          {showFABMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              className="absolute bottom-20 right-0 flex flex-col gap-3 items-end"
            >
              <button 
                onClick={() => { setShowItemForm('lost'); setShowFABMenu(false); }}
                className="bg-sunset-orange hover:bg-sunset-orange/90 text-white px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-3 whitespace-nowrap transition-all active:scale-95 border-[0.5px] border-white/20"
              >
                <MapPin size={20} />
                Report Lost
              </button>
              <button 
                onClick={() => { setShowItemForm('found'); setShowFABMenu(false); }}
                className="bg-emerald-green hover:bg-emerald-green/90 text-white px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-3 whitespace-nowrap transition-all active:scale-95 border-[0.5px] border-white/20"
              >
                <Package size={20} />
                Post Found
              </button>
              <button 
                onClick={() => { setShowItemForm('lending'); setShowFABMenu(false); }}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-3 whitespace-nowrap transition-all active:scale-95 border-[0.5px] border-white/20"
              >
                <Zap size={20} />
                List for Rent
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFABMenu(!showFABMenu)}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${showFABMenu ? 'bg-white text-black rotate-45' : 'bg-emerald-500 text-white shadow-emerald-500/40'}`}
        >
          <Plus size={32} />
        </motion.button>
      </div>

      {/* Handover QR Modal */}
      <AnimatePresence>
        {showQR && (
          <HandoverQR item={showQR} onClose={() => setShowQR(null)} />
        )}
      </AnimatePresence>

      {/* Item Form Modal */}
      <AnimatePresence>
        {showItemForm && (
          <ItemForm 
            initialType={showItemForm} 
            onClose={() => setShowItemForm(null)} 
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto pt-12 pb-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/20">
        <div className="flex items-center gap-2">
          <Shield size={20} />
          <span className="text-xs font-bold uppercase tracking-[0.2em]">Foundry Node Security Active</span>
        </div>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Nodes</a>
        </div>
        <div className="text-[10px] font-mono">
          v2.5.0-STABLE // {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};
