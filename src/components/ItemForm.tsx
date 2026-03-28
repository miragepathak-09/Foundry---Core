import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../AppContext';
import { X, ArrowRight, ArrowLeft, Check, Package, Search, Handshake, Sparkles, Phone, Mail, MapPin, Globe } from 'lucide-react';
import { ItemType } from '../types';

interface ItemFormProps {
  onClose: () => void;
  initialType?: ItemType;
}

export const ItemForm: React.FC<ItemFormProps> = ({ onClose, initialType }) => {
  const { addItem, location, user, mockAITagging } = useAppContext();
  const [step, setStep] = useState(initialType ? 2 : 1);
  const [type, setType] = useState<ItemType>(initialType || 'lost');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState(false);
  const [social, setSocial] = useState('');
  const [homeLocation, setHomeLocation] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [deposit, setDeposit] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);

  const handleAnalyze = () => {
    if (!title || !description) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const tags = mockAITagging(title, description);
      setSuggestedTags(tags);
      setIsAnalyzing(false);
    }, 1500);
  };

  const handleSubmit = () => {
    if (!location || !user) return;
    addItem({
      userId: user.id,
      authorName: user.name,
      type,
      title,
      description,
      coordinates: location,
      contactInfo: {
        phone,
        email,
        whatsapp,
        social,
      },
      homeLocation,
      tags: suggestedTags,
      pricePerDay: type === 'lending' ? Number(pricePerDay) : undefined,
      deposit: type === 'lending' ? Number(deposit) : undefined,
    });
    onClose();
  };

  const steps = [
    {
      title: 'Report Type',
      content: (
        <div className="grid grid-cols-1 gap-4">
          {[
            { id: 'lost', icon: Search, color: 'sunset-orange', label: 'I lost something', sub: 'Report a missing item in your node.' },
            { id: 'found', icon: Package, color: 'emerald-green', label: 'I found something', sub: 'Help return an item to its owner.' },
            { id: 'lending', icon: Handshake, color: 'electric-blue', label: 'Lend a Tool', sub: 'Share resources with neighbors (Lvl 2).' },
            { id: 'borrowing', icon: Globe, color: 'purple-500', label: 'Borrow Request', sub: 'Request a tool from the community.' }
          ].map((opt) => (
            <button 
              key={opt.id}
              disabled={opt.id === 'lending' && user?.level === 1}
              onClick={() => { setType(opt.id as ItemType); setStep(2); }}
              className={`p-6 rounded-3xl border-2 transition-all flex items-center gap-4 text-left relative overflow-hidden group ${
                type === opt.id ? `border-${opt.color} bg-${opt.color}/10` : 'border-white/5 bg-white/5 hover:border-white/20'
              } ${opt.id === 'lending' && user?.level === 1 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-${opt.color}/20 flex items-center justify-center shrink-0`}>
                <opt.icon className={`text-${opt.color}`} size={28} />
              </div>
              <div>
                <h4 className="font-bold text-lg">{opt.label}</h4>
                <p className="text-sm text-white/40">{opt.sub}</p>
              </div>
              {opt.id === 'lending' && user?.level === 1 && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded-lg bg-white/10 text-[8px] font-bold uppercase tracking-widest">
                  Level 2 Required
                </div>
              )}
            </button>
          ))}
        </div>
      )
    },
    {
      title: 'Item Details',
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Item Name</label>
            <input 
              type="text" 
              autoFocus
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              placeholder="e.g. Silver iPhone 15, Makita Drill"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Description</label>
            <textarea 
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
              placeholder="Describe the item, brand, color, or condition..."
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {type === 'lending' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Price per Day (NPR)</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  placeholder="e.g. 200"
                  value={pricePerDay}
                  onChange={e => setPricePerDay(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Trust Deposit (NPR)</label>
                <input 
                  type="number" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  placeholder="e.g. 1000"
                  value={deposit}
                  onChange={e => setDeposit(e.target.value)}
                />
              </div>
            </div>
          )}
          
          <div className="p-4 rounded-3xl bg-electric-blue/5 border border-electric-blue/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="text-electric-blue" size={20} />
              <div>
                <p className="text-sm font-bold">Foundry-GPT Auto-Tagging</p>
                <p className="text-[10px] text-white/40">AI will analyze your description</p>
              </div>
            </div>
            <button 
              onClick={handleAnalyze}
              disabled={!title || !description || isAnalyzing}
              className="px-4 py-2 rounded-xl bg-electric-blue text-white text-xs font-bold hover:bg-electric-blue/80 transition-all disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>

          {suggestedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full bg-emerald-green/10 border border-emerald-green/20 text-[10px] font-bold text-emerald-green flex items-center gap-1">
                  <Check size={12} /> {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )
    },
    {
      title: 'Contact Node',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input 
                  type="tel" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
                <input 
                  type="email" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                  placeholder="hello@foundry.io"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
          <button 
            onClick={() => setWhatsapp(!whatsapp)}
            className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between ${
              whatsapp ? 'bg-emerald-green/10 border-emerald-green/50 text-emerald-green' : 'bg-white/5 border-white/10 text-white/40'
            }`}
          >
            <span className="text-sm font-bold">Available on WhatsApp?</span>
            <div className={`w-10 h-6 rounded-full relative transition-colors ${whatsapp ? 'bg-emerald-green' : 'bg-white/10'}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${whatsapp ? 'left-5' : 'left-1'}`} />
            </div>
          </button>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Social Handle</label>
            <input 
              type="text" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
              placeholder="@username or profile link"
              value={social}
              onChange={e => setSocial(e.target.value)}
            />
          </div>
        </div>
      )
    },
    {
      title: 'Finalize Node',
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Home Location</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={16} />
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                placeholder="Neighborhood or Street Name"
                value={homeLocation}
                onChange={e => setHomeLocation(e.target.value)}
              />
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center gap-3 text-emerald-green">
              <ShieldCheck size={20} />
              <p className="text-sm font-bold">Resilience Pact Active</p>
            </div>
            <p className="text-xs text-white/40 leading-relaxed">
              By submitting, you agree to share this data with verified neighbors in your node. 
              Your exact location is never shared publicly.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-xl glass rounded-[3rem] p-8 md:p-10 relative z-10 overflow-hidden"
      >
        <button 
          onClick={onClose} 
          className="absolute top-8 right-8 p-3 hover:bg-white/10 rounded-2xl transition-all text-white/40 hover:text-white"
        >
          <X size={20} />
        </button>

        <div className="mb-10">
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= step ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/10'}`} />
            ))}
          </div>
          <h2 className="text-4xl font-bold tracking-tight">{steps[step-1].title}</h2>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="min-h-[350px]"
          >
            {steps[step-1].content}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex gap-4">
          {step > 1 && (
            <button 
              onClick={() => setStep(step - 1)}
              className="flex-1 py-5 rounded-[1.5rem] border border-white/10 hover:bg-white/5 font-bold flex items-center justify-center gap-2 transition-all"
            >
              <ArrowLeft size={20} /> Back
            </button>
          )}
          {step < 4 ? (
            <button 
              disabled={step === 1 && !type || step === 2 && (!title || !description)}
              onClick={() => setStep(step + 1)}
              className="flex-[2] py-5 rounded-[1.5rem] bg-white text-black font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Next <ArrowRight size={20} />
            </button>
          ) : (
            <button 
              disabled={!homeLocation}
              onClick={handleSubmit}
              className="flex-[2] py-5 rounded-[1.5rem] bg-emerald-green text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-green/20"
            >
              Broadcast to Node <Check size={20} />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ShieldCheck = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);
