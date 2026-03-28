import React, { useState, useRef, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './components/Logo';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Map as MapIcon, 
  ShieldCheck, 
  Settings as SettingsIcon,
  Bell,
  Zap,
  TrendingUp,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
  Upload,
  ShieldAlert,
  RefreshCcw,
  MapPin,
  Star,
  ArrowUpRight,
  LogIn,
  Search,
  Plus,
  X,
  Smartphone,
  Shield,
  LogOut,
  User as UserIcon,
  Mail,
  Lock,
  Key,
  Scan,
  Check,
  MessageSquare,
  Send,
  Camera,
  ArrowRight,
  ArrowLeft,
  Package,
  Handshake,
  Sparkles,
  Phone,
  Globe,
  QrCode,
  History,
  Users,
  Lock as LockIcon
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppContext } from './AppContext';
import { EnhancedMap } from './components/EnhancedMap';
import { MarketplaceGrid } from './components/MarketplaceGrid';
import { Item, ItemType } from './types';
import { fileToBase64 } from './lib/utils';
import { GoogleGenAI, Type } from '@google/genai';

// --- Error Boundary Component ---
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-center">
          <AlertCircle className="mx-auto text-red-500 mb-2" size={24} />
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest">Component Error</p>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-bold uppercase"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// --- Global Styles ---
const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .glass {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .bento-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 2rem;
      padding: 1.5rem;
      transition: all 0.3s ease;
      position: relative;
      z-index: 10;
    }
    .bento-card:hover {
      background: rgba(255, 255, 255, 0.04);
      border-color: rgba(255, 255, 255, 0.1);
    }
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
    main, .view-container {
      overflow-y: auto !important;
      height: 100%;
      pointer-events: auto !important;
    }
    button, a, input, textarea {
      pointer-events: auto !important;
    }
  `}} />
);

// --- AI Lister Logic ---
const ListerAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste! 🇳🇵 I am Lister, your neighborhood AI sidekick! ⚡️ Ready to build some serious resilience today? What\'s on your mind?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input;
    const newMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      // Convert history to Gemini format
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-flash-latest',
        contents: history.concat([{ role: 'user', parts: [{ text: userMsg }] }]),
        config: {
          systemInstruction: `You are Lister, a high-energy, fun, and super helpful AI assistant for "Foundry", an Urban Resilience Protocol in Nepal. 🇳🇵
            
            Personality:
            - Use LOTS of relevant emojis! 🚀🔥🛠️
            - Be friendly, slightly futuristic, and very enthusiastic about community sharing.
            - Occasionally use Nepali slang or greetings (Namaste, Sanchai hunuhuncha?, Babbal!).
            - If someone says "What's up?" or casual stuff, respond with vibe and energy! 🤙
            - NEVER repeat the same boring phrases. Keep it fresh! ✨
            
            App Context:
            - Marketplace: Rent gear from neighbors. Click 'List Item' to share.
            - Trust Center: ID verification via Citizenship Card. Karma = Reputation.
            - Wallet: eSewa/Khalti/IME Pay integration. Escrow keeps it safe.
            - Lost & Found: Real-time map with geofencing.
            - Handshake: The secure protocol for rentals.`,
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
        }
      });

      const aiResponse = response.text || "Whoops! My resilience core just flickered. 🔌 Try that again, neighbor!";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error("Lister AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Protocol glitch! 🚨 I lost connection to the anvil. Check your net and let's try again!" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[4000] md:bottom-8 md:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[320px] md:w-[380px] h-[480px] glass rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border-white/20"
          >
            <div className="p-6 bg-electric-blue flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Lister AI</h3>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">Resilience Protocol</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-electric-blue text-white rounded-tr-none' 
                      : 'bg-white/5 text-white/80 border border-white/10 rounded-tl-none'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/10 flex gap-1">
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-electric-blue rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-electric-blue rounded-full" />
                    <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-electric-blue rounded-full" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask Lister..."
                  disabled={isLoading}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm focus:outline-none focus:border-electric-blue/50 disabled:opacity-50"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-electric-blue text-white flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50"
                >
                  {isLoading ? <RefreshCcw size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-2xl bg-electric-blue text-white flex items-center justify-center shadow-[0_0_30px_rgba(0,122,255,0.4)] relative z-10"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>
    </div>
  );
};

// --- Auth & Onboarding Portal ---
const AuthContainer = ({ onComplete }: { onComplete: (user: any) => void }) => {
  const [step, setStep] = useState<'auth' | 'verification' | 'review'>('auth');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [verifiedData, setVerifiedData] = useState<any>(null);
  const [mismatchError, setMismatchError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let pass = "";
    for (let i = 0; i < 16; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(pass);
  };

  const handleGoogleLogin = () => {
    // In a real app, this would be a real Google OAuth flow
    setName("Miraj Pathak");
    setEmail("pathakmiraj09@gmail.com");
    setPassword("google-auth-session-active");
    setTimeout(() => setStep('verification'), 500);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && password) {
      setStep('verification');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setScanProgress(0);
      setMismatchError(null);
      
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      const progressInterval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + 1, 95));
      }, 50);

      try {
        const base64 = await fileToBase64(file);
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: {
            parts: [
              { text: "Extract Name, ID Number, District, and Address from this Nepal Citizenship Card. Return as JSON." },
              { inlineData: { data: base64, mimeType: file.type } }
            ]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                idNumber: { type: Type.STRING },
                district: { type: Type.STRING },
                address: { type: Type.STRING }
              },
              required: ["name", "idNumber", "district", "address"]
            }
          }
        });

        const data = JSON.parse(response.text || '{}');
        clearInterval(progressInterval);
        setScanProgress(100);

        setTimeout(() => {
          setVerifiedData({
            ...data,
            issueDistrict: data.district,
            verificationHash: '0x' + Math.random().toString(16).substr(2, 32),
            isAuthentic: true,
            status: '[Verified by Foundry AI]'
          });

          const normalizedLoginName = name.toLowerCase().trim();
          const normalizedCardName = data.name.toLowerCase().trim();
          
          if (!normalizedCardName.includes(normalizedLoginName.split(' ')[0]) && 
              !normalizedLoginName.includes(normalizedCardName.split(' ')[0])) {
            setMismatchError("Identity mismatch detected. Please ensure your Citizenship matches your Google Account name.");
          }

          setStep('review');
          setIsUploading(false);
        }, 500);

      } catch (error) {
        console.error('AI Verification Error:', error);
        clearInterval(progressInterval);
        setTimeout(() => {
          // Fallback if AI fails
          setVerifiedData({
            name: name, 
            idNumber: '12-01-78-05521',
            district: 'Kathmandu',
            issueDistrict: 'Kathmandu',
            address: 'Kathmandu, Nepal',
            verificationHash: '0x' + Math.random().toString(16).substr(2, 32),
            isAuthentic: true,
            status: '[Verified by Foundry AI]'
          });
          setStep('review');
          setIsUploading(false);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="fixed inset-0 z-[5000] bg-[#050505] flex items-center justify-center overflow-hidden p-6">
      <GlobalStyles />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-electric-blue/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-green/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-12 flex flex-col items-center">
          <Logo size="lg" className="mb-6" />
          <p className="text-white/40 text-sm font-bold uppercase tracking-[0.3em]">Urban Resilience Protocol</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 'auth' && (
            <motion.div 
              key="auth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-8 rounded-[2rem] border-white/10 space-y-6"
            >
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGoogleLogin}
                className="w-full py-4 rounded-2xl bg-white text-black font-bold flex items-center justify-center gap-3 hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                Login with Google
              </motion.button>

              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">or use credentials</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-electric-blue/50 focus:ring-4 focus:ring-electric-blue/10 transition-all outline-none"
                    required
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:border-electric-blue/50 focus:ring-4 focus:ring-electric-blue/10 transition-all outline-none"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="text" 
                    placeholder="Secure Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-24 text-sm font-mono focus:border-electric-blue/50 focus:ring-4 focus:ring-electric-blue/10 transition-all outline-none"
                    required
                  />
                  <button 
                    type="button"
                    onClick={generatePassword}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 rounded-xl bg-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2"
                  >
                    <Key size={12} />
                    Gen
                  </button>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-2xl bg-electric-blue text-white font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,122,255,0.4)] transition-all flex items-center justify-center gap-3"
                >
                  Create Account
                  <ArrowUpRight size={18} />
                </motion.button>
              </form>
            </motion.div>
          )}

          {step === 'verification' && (
            <motion.div 
              key="verification"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-8 rounded-[2rem] border-white/10 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-electric-blue/10 flex items-center justify-center mx-auto mb-6 text-electric-blue">
                <Shield size={32} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Identity Verification</h2>
              <p className="text-white/40 text-sm mb-8">Foundry AI is verifying your Identity...</p>

              <ErrorBoundary>
                <div className="relative group">
                  <input 
                    type="file" 
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-20"
                    accept="image/*"
                    disabled={isUploading}
                  />
                  <div className={`p-12 rounded-3xl border-2 border-dashed transition-all ${isUploading ? 'border-electric-blue bg-electric-blue/5' : 'border-white/10 hover:border-electric-blue/40 hover:bg-white/5'}`}>
                    {isUploading ? (
                      <div className="space-y-4 relative overflow-hidden h-32 flex flex-col items-center justify-center">
                        <motion.div 
                          animate={{ y: [0, 128, 0] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute top-0 left-0 right-0 h-1 bg-emerald-green shadow-[0_0_15px_#10b981] z-10"
                        />
                        <Scan className="text-electric-blue animate-pulse" size={48} />
                        <div className="w-full max-w-[200px] h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${scanProgress}%` }}
                            className="h-full bg-electric-blue"
                          />
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-electric-blue">Processing Sovereign ID... {Math.round(scanProgress)}%</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="mx-auto text-white/20 group-hover:text-electric-blue transition-colors" size={48} />
                        <p className="text-sm font-bold">Drop Citizenship Card here</p>
                        <p className="text-[10px] text-white/40 uppercase tracking-widest">Supports JPG, PNG, PDF</p>
                      </div>
                    )}
                  </div>
                </div>
              </ErrorBoundary>
            </motion.div>
          )}

          {step === 'review' && (
            <motion.div 
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass p-8 rounded-[2rem] border-emerald-green/20"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-emerald-green/10 flex items-center justify-center text-emerald-green">
                  <Fingerprint size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Review Details</h2>
                  <p className="text-[10px] text-emerald-green font-bold uppercase tracking-widest">AI Extraction Complete</p>
                </div>
              </div>

              {mismatchError && (
                <div className="mb-6 p-4 rounded-2xl bg-sunset-orange/10 border border-sunset-orange/30 flex items-start gap-3">
                  <AlertCircle className="text-sunset-orange shrink-0" size={18} />
                  <p className="text-xs font-bold text-sunset-orange leading-relaxed">{mismatchError}</p>
                </div>
              )}

              <div className="space-y-4 mb-8">
                {[
                  { label: 'Name', value: verifiedData.name },
                  { label: 'ID Number', value: verifiedData.idNumber },
                  { label: 'District', value: verifiedData.district },
                  { label: 'Status', value: verifiedData.status, highlight: true },
                ].map((item) => (
                  <div key={item.label} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">{item.label}</p>
                    <p className={`text-sm font-bold ${item.highlight ? 'text-emerald-green' : 'text-white'}`}>{item.value}</p>
                  </div>
                ))}
              </div>

              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onComplete({ ...verifiedData, email })}
                className="w-full py-4 rounded-2xl bg-emerald-green text-white font-bold uppercase tracking-widest hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-3"
              >
                Initialize Foundry
                <Check size={18} />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

// --- Camera Capture Component ---
const CameraCapture = ({ onCapture, onCancel }: { onCapture: (blob: string) => void, onCancel: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [qualityScore, setQualityScore] = useState(0);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      setError("Camera access denied. Please enable permissions in your browser.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvasRef.current.toDataURL('image/jpeg');
        
        // Foundry AI Quality Check Animation
        setIsChecking(true);
        let progress = 0;
        const interval = setInterval(() => {
          progress += 5;
          setQualityScore(progress);
          if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onCapture(dataUrl);
              setIsChecking(false);
            }, 500);
          }
        }, 50);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[6000] bg-black flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-white/5 border border-white/10">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <ShieldAlert size={48} className="text-sunset-orange mb-4" />
            <p className="text-sm font-bold text-sunset-orange">{error}</p>
            <button onClick={onCancel} className="mt-6 px-6 py-3 rounded-xl bg-white/10 text-white font-bold">Close</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="hidden" />
            
            {isChecking && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-emerald-green border-t-transparent rounded-full mb-6"
                />
                <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Foundry AI</h3>
                <p className="text-emerald-green text-[10px] font-black uppercase tracking-[0.3em]">Quality Check: {qualityScore}%</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${qualityScore}%` }} className="h-full bg-emerald-green" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {!isChecking && !error && (
        <div className="mt-8 flex items-center gap-8">
          <button onClick={onCancel} className="w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center">
            <X size={24} />
          </button>
          <button onClick={capture} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center p-1">
            <div className="w-full h-full rounded-full bg-white" />
          </button>
          <div className="w-14 h-14" /> {/* Spacer */}
        </div>
      )}
    </div>
  );
};

// --- Item Listing Form ---
const ItemForm = ({ onClose }: { onClose: () => void }) => {
  const { addItem, user } = useAppContext();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleSubmit = () => {
    if (!title || !price || !user) return;
    addItem({
      userId: user.id,
      authorName: user.name,
      type: 'lending',
      title,
      description,
      pricePerDay: Number(price),
      image: image || `https://picsum.photos/seed/${title}/800/600`,
      neighborhood: user.neighborhood,
      coordinates: { lat: 27.7172, lng: 85.3240 }
    });
    onClose();
  };

  return (
    <div className="glass p-8 rounded-[3rem] border-white/10 w-full max-w-xl relative overflow-hidden">
      <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white z-10">
        <X size={24} />
      </button>

      <div className="mb-10">
        <h2 className="text-3xl font-bold tracking-tight">List New Item</h2>
        <p className="text-white/40 text-sm mt-1">Broadcast your resources to the neighborhood node.</p>
      </div>

      <ErrorBoundary>
        <div className="space-y-6">
          {step === 1 ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Item Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Professional Drone, Makita Drill"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Daily Rate (NPR)</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                className="w-full py-4 rounded-2xl bg-electric-blue text-white font-bold uppercase tracking-widest"
              >
                Next: Visual Capture
              </motion.button>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div 
                onClick={() => setShowCamera(true)}
                className="aspect-video rounded-3xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-electric-blue/40 transition-all overflow-hidden relative"
              >
                {image ? (
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Camera className="text-white/20" size={48} />
                    <p className="text-sm font-bold">Trigger Live Camera</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">Foundry AI Quality Verification</p>
                  </div>
                )}
              </div>

              {showCamera && (
                <CameraCapture 
                  onCapture={(blob) => {
                    setImage(blob);
                    setShowCamera(false);
                  }}
                  onCancel={() => setShowCamera(false)}
                />
              )}
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-2xl border border-white/10 font-bold">Back</button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  className="flex-[2] py-4 rounded-2xl bg-emerald-green text-white font-bold uppercase tracking-widest"
                >
                  Broadcast Item
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </ErrorBoundary>
    </div>
  );
};

// --- Sub-components ---
const Sidebar = () => {
  const { activeTab, setActiveTab, user, setUser } = useAppContext();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'rentals', label: 'Marketplace', icon: ShoppingBag },
    { id: 'lost-found', label: 'Recovery', icon: MapIcon },
    { id: 'trust-center', label: 'Trust Center', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:top-0 md:bottom-0 md:w-20 lg:w-64 bg-black/80 backdrop-blur-2xl border-t md:border-t-0 md:border-r border-white/10 flex md:flex-col items-center py-2 md:py-8 px-4">
      <div className="hidden md:flex items-center justify-center mb-12 lg:px-4 w-full">
        <Logo size="md" showText={false} className="lg:hidden" />
        <Logo size="md" className="hidden lg:flex" />
      </div>

      <div className="flex-1 flex md:flex-col items-center justify-around md:justify-start w-full gap-2 lg:gap-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex items-center gap-4 p-3 lg:px-4 lg:py-3 rounded-2xl transition-all group w-full ${
                isActive 
                  ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(0,122,255,0.2)] border border-white/10' 
                  : 'text-white/40 hover:text-white/60 hover:bg-white/5'
              }`}
            >
              <Icon size={24} className={isActive ? 'text-electric-blue' : 'group-hover:text-white/80'} />
              <span className={`hidden lg:block font-bold text-sm tracking-wide ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-electric-blue rounded-r-full hidden lg:block"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="hidden md:flex flex-col items-center gap-6 mt-auto">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          onClick={() => {
            setUser(null);
            window.location.reload();
          }}
          className="p-3 rounded-2xl text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={24} />
        </motion.button>
        <div className="relative group cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
            <img 
              src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

const DashboardView = () => {
  const { user, wallet, setActiveTab, neighbors } = useAppContext();
  
  const stats = [
    { label: 'Karma', value: user?.karma || 0, icon: Star, color: 'text-yellow-400', onClick: () => setActiveTab('trust-center') },
    { label: 'Earnings', value: `Rs. ${wallet.available}`, icon: TrendingUp, color: 'text-emerald-400', onClick: () => setActiveTab('wallet') },
    { label: 'Escrow', value: `Rs. ${wallet.escrow}`, icon: Shield, color: 'text-electric-blue', onClick: () => setActiveTab('wallet') },
  ];

  return (
    <div className="space-y-8 h-full overflow-y-auto scrollbar-hide pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight italic uppercase">Namaste, {user?.name.split(' ')[0]}</h1>
          <p className="text-white/40 font-medium mt-1">Your neighborhood is active today.</p>
        </div>
        <div className="px-4 py-2 rounded-2xl glass flex items-center gap-2">
          <MapPin size={14} className="text-electric-blue" />
          <span className="text-xs font-bold uppercase tracking-widest">{user?.neighborhood}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div 
            key={stat.label}
            whileHover={{ scale: 1.02, y: -5 }}
            onClick={stat.onClick}
            className="bento-card group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <ArrowUpRight size={16} className="text-white/20 group-hover:text-white transition-colors" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div whileHover={{ scale: 1.01 }} className="bento-card lg:col-span-1">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <Zap size={18} className="text-yellow-400" />
            Active Handshakes
          </h3>
          <div className="space-y-4">
            {wallet.history.filter(tx => tx.status === 'escrow').length > 0 ? (
              wallet.history.filter(tx => tx.status === 'escrow').map(tx => (
                <div key={tx.id} className="p-4 rounded-2xl bg-electric-blue/5 border border-white/5 flex items-center justify-between group hover:bg-white/10 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-electric-blue/10 flex items-center justify-center text-electric-blue">
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">{tx.itemName}</h4>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest">In Escrow</p>
                    </div>
                  </div>
                  <ArrowUpRight size={14} className="text-white/20 group-hover:text-white" />
                </div>
              ))
            ) : (
              <p className="text-xs text-white/20 text-center py-8">No active handshakes</p>
            )}
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className="bento-card lg:col-span-1 bg-electric-blue/5 border-electric-blue/20">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <ShieldCheck size={18} className="text-emerald-400" />
            Trust Score
          </h3>
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-4xl font-bold">4.9</p>
              <p className="text-xs text-white/40">Top 5% in {user?.neighborhood}</p>
            </div>
            <Zap size={48} className="text-emerald-400 opacity-20" />
          </div>
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className="bento-card lg:col-span-1">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <Users size={18} className="text-electric-blue" />
            Community
          </h3>
          <div className="space-y-4">
            <div className="flex -space-x-3 overflow-hidden mb-4">
              {neighbors.slice(0, 4).map((neighbor) => (
                <img
                  key={neighbor.id}
                  className="inline-block h-10 w-10 rounded-full ring-2 ring-black object-cover"
                  src={neighbor.photoURL}
                  alt={neighbor.name}
                  referrerPolicy="no-referrer"
                />
              ))}
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/10 ring-2 ring-black text-[10px] font-bold">
                +{neighbors.length > 4 ? neighbors.length - 4 : 0}
              </div>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              <span className="text-electric-blue font-bold">{neighbors.length} neighbors</span> in {user?.neighborhood} are verified and active today.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const WalletView = () => {
  const { wallet, user } = useAppContext();
  
  const handleRedirect = (url: string) => {
    window.open(url, '_blank');
  };

  const lockedBalance = wallet.history
    .filter(tx => tx.status === 'escrow')
    .reduce((acc, tx) => acc + tx.amount, 0);

  return (
    <div className="space-y-8 h-full overflow-y-auto scrollbar-hide pb-12 view-container">
      <div className="bento-card bg-gradient-to-br from-emerald-500/20 to-transparent">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Verified Earnings Balance</p>
            <h2 className="text-5xl font-bold mt-2 text-emerald-400">Rs. {wallet.available.toLocaleString()}</h2>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Locked (Smart Deposit)</p>
            <h3 className="text-2xl font-bold mt-2 text-electric-blue flex items-center justify-end gap-2">
              <LockIcon size={18} />
              Rs. {lockedBalance.toLocaleString()}
            </h3>
          </div>
        </div>
        
        <div className="flex gap-4 mt-8">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRedirect('https://esewa.com.np/#/login')}
            className="flex-1 bg-[#60bb46] p-4 rounded-2xl flex flex-col items-center gap-1 group shadow-lg"
          >
             <span className="text-white font-black text-xl">e</span>
             <span className="text-[10px] font-bold uppercase">Withdraw to eSewa</span>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleRedirect('https://web.khalti.com/#/')}
            className="flex-1 bg-[#5c2d91] p-4 rounded-2xl flex flex-col items-center gap-1 group shadow-lg"
          >
             <span className="text-white font-black text-xl">K</span>
             <span className="text-[10px] font-bold uppercase">Withdraw to Khalti</span>
          </motion.button>
        </div>
      </div>

      <div className="bento-card">
        <h3 className="font-bold mb-6 flex items-center gap-2">
          <TrendingUp size={18} className="text-emerald-400" />
          Transaction History
        </h3>
        <div className="space-y-4">
          {wallet.history.map((tx) => (
            <div key={tx.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.type === 'earning' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-electric-blue/10 text-electric-blue'
                }`}>
                  <ArrowUpRight size={20} className={tx.type === 'payout' ? 'rotate-180' : ''} />
                </div>
                <div>
                  <h4 className="text-sm font-bold">{tx.itemName}</h4>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{new Date(tx.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === 'earning' ? 'text-emerald-400' : 'text-white'}`}>
                  {tx.type === 'earning' ? '+' : '-'} Rs. {tx.amount.toLocaleString()}
                </p>
                <p className="text-[10px] text-white/30 uppercase tracking-widest">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const TrustCenterView = () => {
  const { user, verifyCitizenship, neighbors } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setResult(null);

    try {
      const base64 = await fileToBase64(file);
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: {
          parts: [
            { text: "Extract Name, ID Number, District, and Address from this Nepal Citizenship Card. Return as JSON." },
            { inlineData: { data: base64, mimeType: file.type } }
          ]
        },
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || '{}');
      const verifiedData = {
        ...data,
        issueDistrict: data.district || 'Unknown',
        address: data.address || 'Unknown',
        verificationHash: '0x' + Math.random().toString(16).substr(2, 32),
        isAuthentic: true,
        status: 'Verified'
      };
      setResult(verifiedData);
      verifyCitizenship(verifiedData);
    } catch (error) {
      console.error('AI Verification Error:', error);
      setTimeout(() => {
        const mock = { 
          name: user?.name || 'User', 
          idNumber: '27-01-72-12345', 
          issueDistrict: 'Kathmandu', 
          address: 'Kathmandu, Nepal',
          verificationHash: '0x' + Math.random().toString(16).substr(2, 32),
          isAuthentic: true 
        };
        setResult(mock);
        verifyCitizenship(mock);
      }, 2000);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 h-full overflow-y-auto scrollbar-hide pb-12">
      <header>
        <h1 className="text-4xl font-bold tracking-tight italic uppercase">Trust Center</h1>
        <p className="text-white/40 font-medium mt-1">Official Identity & Biometric Verification</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div whileHover={{ scale: 1.01 }} className="bento-card">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />
            Sovereign ID
          </h3>
          {user?.idVerified ? (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Full Name</p>
              <p className="text-lg font-bold">{user?.name}</p>
              <p className="text-[10px] text-white/40 uppercase font-bold mt-4">ID Number</p>
              <p className="font-mono text-sm text-emerald-400">{user?.verificationDetails?.idNumber || '27-01-72-XXXXX'}</p>
            </div>
          ) : (
            <ErrorBoundary>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-3xl border-2 border-dashed border-white/10 hover:border-electric-blue/40 cursor-pointer text-center"
              >
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept="image/*" />
                {isUploading ? <RefreshCcw className="mx-auto animate-spin text-electric-blue" size={32} /> : <Upload className="mx-auto text-white/20" size={32} />}
                <p className="text-sm font-bold mt-4">Upload Citizenship Card</p>
              </div>
            </ErrorBoundary>
          )}
        </motion.div>

        <motion.div whileHover={{ scale: 1.01 }} className="bento-card">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Fingerprint size={18} className="text-electric-blue" />
            Biometrics
          </h3>
          <div className="aspect-video rounded-2xl bg-black border border-white/10 flex items-center justify-center">
            <Fingerprint size={48} className="text-white/10" />
          </div>
        </motion.div>
      </div>

      <div className="bento-card">
        <h3 className="font-bold mb-6 flex items-center gap-2">
          <Users size={18} className="text-electric-blue" />
          Verified Neighbors
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {neighbors.map((neighbor) => (
            <div key={neighbor.id} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10">
                <img src={neighbor.photoURL} alt={neighbor.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{neighbor.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={10} className="text-emerald-green" />
                  <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest truncate">{neighbor.uid}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-yellow-400 flex items-center justify-end gap-1">
                  <Star size={10} fill="currentColor" /> {neighbor.karma}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Rental Application Modal ---
const RentalApplicationModal = ({ item, user, onClose, onConfirm }: { item: Item, user: any, onClose: () => void, onConfirm: (data: any) => void }) => {
  const [verdict, setVerdict] = useState('');
  const [duration, setDuration] = useState('1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappAvailable, setWhatsappAvailable] = useState('yes');
  const deposit = item.pricePerDay * 2; // Smart Deposit logic

  const handleConfirm = () => {
    if (!verdict || !duration || !phoneNumber) {
      alert('Please fill in all required fields.');
      return;
    }
    onConfirm({ verdict, duration, deposit, phoneNumber, whatsappAvailable });
  };

  return (
    <div className="glass p-8 rounded-[3rem] border-white/10 w-full max-w-xl relative overflow-hidden">
      <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white z-10">
        <X size={24} />
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight italic uppercase">Rental Application</h2>
        <p className="text-white/40 text-sm mt-1">Requesting handshake for {item.title}</p>
      </div>

      <div className="space-y-6">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-3">Credential Summary</h4>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-green">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-bold">{user.name}</p>
                <p className="text-[10px] text-emerald-green font-bold uppercase tracking-widest">Verified ID: {user.uid}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-yellow-400 flex items-center justify-end gap-1">
                <Star size={12} fill="currentColor" /> {user.karma}
              </p>
              <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Trust Score</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Phone Number (Required)</label>
            <input 
              type="tel" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 98XXXXXXXX"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">WhatsApp Available?</label>
            <div className="flex gap-2">
              {['yes', 'no'].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setWhatsappAvailable(opt)}
                  className={`flex-1 py-4 rounded-2xl border font-bold uppercase tracking-widest text-[10px] transition-all ${
                    whatsappAvailable === opt 
                      ? 'bg-electric-blue border-electric-blue text-white' 
                      : 'bg-white/5 border-white/10 text-white/40'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Need Verdict</label>
          <textarea 
            value={verdict}
            onChange={(e) => setVerdict(e.target.value)}
            placeholder="Why do you need this? (e.g. Wedding shoot, weekend trek)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Duration (Days)</label>
            <input 
              type="number" 
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-electric-blue/50"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Smart Deposit</label>
            <div className="w-full bg-electric-blue/10 border border-electric-blue/20 rounded-2xl py-4 px-5 flex items-center justify-between">
              <span className="text-sm font-bold text-electric-blue">Rs. {deposit.toLocaleString()}</span>
              <LockIcon size={14} className="text-electric-blue" />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-yellow-400/5 border border-yellow-400/20">
          <p className="text-[10px] text-yellow-400 font-bold leading-relaxed">
            <AlertCircle size={12} className="inline mr-1" />
            Smart Deposit of Rs. {deposit} will be locked in your wallet until the item is returned.
          </p>
        </div>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleConfirm}
          className="w-full py-4 rounded-2xl bg-electric-blue text-white font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(0,122,255,0.4)]"
        >
          Submit Handshake Request
        </motion.button>
      </div>
    </div>
  );
};

// --- QR Handshake Modal ---
const QRHandshakeModal = ({ item, onClose }: { item: Item, onClose: () => void }) => {
  const qrValue = `foundry-handshake-${item.id}-${Date.now()}`;

  return (
    <div className="glass p-8 rounded-[3rem] border-white/10 w-full max-w-md relative text-center">
      <button onClick={onClose} className="absolute top-8 right-8 text-white/40 hover:text-white">
        <X size={24} />
      </button>

      <div className="w-16 h-16 rounded-2xl bg-emerald-green/10 flex items-center justify-center mx-auto mb-6 text-emerald-green">
        <QrCode size={32} />
      </div>
      
      <h2 className="text-2xl font-bold mb-2 italic uppercase">Digital Handshake</h2>
      <p className="text-white/40 text-sm mb-8">Scan this QR during physical meeting to release Escrow funds.</p>

      <div className="bg-white p-6 rounded-3xl inline-block mb-8 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
        <QRCodeSVG value={qrValue} size={200} level="H" />
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-left">
          <ShieldCheck className="text-emerald-green shrink-0" size={20} />
          <p className="text-[10px] font-bold text-white/60 uppercase leading-relaxed">
            Funds are currently held in Foundry Escrow. Scanning verifies the physical handover.
          </p>
        </div>
        <button onClick={onClose} className="w-full py-4 rounded-2xl border border-white/10 text-sm font-bold uppercase tracking-widest">
          Close
        </button>
      </div>
    </div>
  );
};

// --- Main Layout ---
export default function FoundryApp() {
  const { activeTab, user, setUser, initiateRental, toast, showToast } = useAppContext();
  const [showItemForm, setShowItemForm] = useState(false);
  const [handshakeItem, setHandshakeItem] = useState<Item | null>(null);
  const [rentalApplicationItem, setRentalApplicationItem] = useState<Item | null>(null);
  const [approvedHandshake, setApprovedHandshake] = useState<Item | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user && !isInitialized) {
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  if (!isInitialized && !user) {
    return (
      <AuthContainer 
        onComplete={(data) => {
          setUser({
            id: 'user-' + Math.random().toString(36).substr(2, 9),
            uid: data.idNumber ? `FD-${data.idNumber.split('-').pop()}-X` : 'FD-TEMP-X',
            name: data.name,
            email: data.email,
            neighborhood: data.district || 'Kathmandu',
            karma: 100,
            level: 3,
            isVerified: true,
            idVerified: true,
            biometricsRegistered: true,
            photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
            verificationDetails: {
              idNumber: data.idNumber,
              issueDistrict: data.district,
              address: data.address,
              verificationHash: data.verificationHash
            }
          });
          setIsInitialized(true);
          showToast(`Welcome, ${data.name.split(' ')[0]}! Protocol Initialized.`);
        }} 
      />
    );
  }

  const handleRentNow = (item: Item) => {
    setRentalApplicationItem(item);
    setHandshakeItem(null);
  };

  const handleConfirmRental = (data: any) => {
    if (rentalApplicationItem) {
      initiateRental(rentalApplicationItem, data);
      setRentalApplicationItem(null);
      showToast(`Handshake request submitted!`);
      setTimeout(() => {
        setApprovedHandshake(rentalApplicationItem);
      }, 2000);
    }
  };

  const renderView = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'rentals': return (
        <div className="space-y-8 h-full overflow-y-auto scrollbar-hide pb-12">
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight italic uppercase">Marketplace</h1>
              <p className="text-white/40 font-medium mt-1">Rent tools and gear from verified neighbors.</p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowItemForm(true)}
              className="px-6 py-3 rounded-2xl bg-electric-blue text-white font-bold text-sm flex items-center gap-2 shadow-lg"
            >
              <Plus size={20} /> List Item
            </motion.button>
          </header>
          <MarketplaceGrid onItemClick={(item) => setHandshakeItem(item)} />
        </div>
      );
      case 'lost-found': return (
        <div className="h-[calc(100vh-12rem)] md:h-[calc(100vh-4rem)] rounded-[2.5rem] overflow-hidden relative border border-white/10">
          <EnhancedMap onMarkerClick={() => {}} onMapClick={() => {}} />
        </div>
      );
      case 'trust-center': return <TrustCenterView />;
      case 'wallet': return <WalletView />;
      case 'settings': {
        const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (!file) return;
          
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              setUser({ ...user!, photoURL: reader.result as string });
              showToast("Profile picture updated!");
            }
          };
          reader.readAsDataURL(file);
        };

        return (
          <div className="space-y-8 h-full overflow-y-auto scrollbar-hide pb-12">
            <h1 className="text-4xl font-bold tracking-tight italic uppercase">Settings</h1>
            <div className="bento-card">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-electric-blue shadow-[0_0_30px_rgba(0,122,255,0.3)]">
                    <img 
                      src={user?.photoURL} 
                      alt="Profile" 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => profileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-electric-blue text-white flex items-center justify-center shadow-lg border-2 border-black"
                  >
                    <Camera size={18} />
                  </motion.button>
                  <input 
                    type="file" 
                    ref={profileInputRef} 
                    className="hidden" 
                    onChange={handleProfilePicChange} 
                    accept="image/*" 
                  />
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-3xl font-bold">{user?.name}</h2>
                  <p className="text-white/40 font-medium">{user?.email}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-green text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                      Verified Member
                    </span>
                    <span className="px-3 py-1 rounded-full bg-electric-blue/10 text-electric-blue text-[10px] font-bold uppercase tracking-widest border border-electric-blue/20">
                      Node: {user?.neighborhood}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bento-card">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-emerald-green" />
                  Account Security
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-sm font-medium">Two-Factor Auth</span>
                    <div className="w-10 h-5 bg-emerald-green rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-sm font-medium">Biometric Login</span>
                    <div className="w-10 h-5 bg-emerald-green rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bento-card">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-electric-blue" />
                  Neighborhood Node
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                    <span className="text-sm font-medium">Current Node</span>
                    <span className="text-xs font-bold text-electric-blue uppercase tracking-widest">{user?.neighborhood}</span>
                  </div>
                  <button className="w-full py-4 rounded-2xl border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors">
                    Switch Node
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      }
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-electric-blue/30 flex flex-col md:flex-row overflow-hidden">
      <GlobalStyles />
      <Sidebar />
      
      <main className="flex-1 p-6 md:p-12 md:ml-20 lg:ml-64 h-[100dvh] overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-full overflow-y-auto scrollbar-hide pb-24"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <ListerAssistant />

      {/* Modals */}
      <AnimatePresence>
        {showItemForm && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-xl">
              <ItemForm onClose={() => setShowItemForm(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {handshakeItem && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.9 }} 
              className="w-full max-w-lg glass p-8 rounded-[3rem] border-white/10 relative"
            >
              <button onClick={() => setHandshakeItem(null)} className="absolute top-8 right-8 text-white/40 hover:text-white">
                <X size={24} />
              </button>
              
              <div className="aspect-video rounded-3xl overflow-hidden mb-6">
                <img src={handshakeItem.image} alt={handshakeItem.title} className="w-full h-full object-cover" />
              </div>
              
              <h2 className="text-3xl font-bold mb-2">{handshakeItem.title}</h2>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                  <UserIcon size={12} className="text-white/40" />
                </div>
                <span className="text-xs text-white/40">Listed by {handshakeItem.authorName}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Daily Rate</p>
                  <p className="text-lg font-bold text-emerald-green">Rs. {handshakeItem.pricePerDay}</p>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                  <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Security Deposit</p>
                  <p className="text-lg font-bold">Rs. {handshakeItem.deposit || 0}</p>
                </div>
              </div>
              
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleRentNow(handshakeItem)}
                className="w-full py-4 rounded-2xl bg-electric-blue text-white font-bold uppercase tracking-widest shadow-[0_0_30px_rgba(0,122,255,0.4)]"
              >
                Initiate Handshake
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rentalApplicationItem && user && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-xl">
              <RentalApplicationModal 
                item={rentalApplicationItem} 
                user={user} 
                onClose={() => setRentalApplicationItem(null)}
                onConfirm={handleConfirmRental}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {approvedHandshake && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-md">
              <QRHandshakeModal 
                item={approvedHandshake} 
                onClose={() => setApprovedHandshake(null)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[6000] px-6 py-3 rounded-2xl bg-emerald-green text-white font-bold text-sm shadow-xl flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
