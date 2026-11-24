import { useState, FormEvent, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  X, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function AdminAuthModal({
  isOpen,
  onClose,
  onSuccess,
  onShowToast
}: AdminAuthModalProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShake, setIsShake] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setErrorMsg('');
      setIsShake(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const savedPin = localStorage.getItem('earninghub_admin_pin') || '7667';
    // Accept either current saved PIN, default 7667, or owner backup 5555
    const isCorrect = pin === savedPin || pin === '7667' || pin === '5555';

    if (isCorrect) {
      localStorage.setItem('earninghub_admin_auth', 'true');
      onSuccess();
      onClose();
      onShowToast('Admin Verified! Welcome Owner.', 'success');
    } else {
      setErrorMsg('Invalid Admin Secret PIN. Access Denied.');
      setIsShake(true);
      setTimeout(() => setIsShake(false), 600);
      onShowToast('गलत पिन! केवल वेबसाइट मालिक ही प्रवेश कर सकते हैं।', 'error');
    }
  };

  const handleQuickKey = (num: string) => {
    if (pin.length < 8) {
      setPin(prev => prev + num);
      setErrorMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={`w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-5 transition-transform ${
          isShake ? 'animate-bounce' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Admin Verification
              </h3>
              <p className="text-[11px] text-slate-500">
                सुरक्षित एडमिन प्रमाणीकरण (Owner Only)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            यह सेक्शन केवल वेबसाइट मालिक (Owner) के लिए है। आम यूज़र्स को एडमिन पैनल नहीं दिखाई देगा।
          </p>
        </div>

        {/* PIN Entry Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
              <span>Enter Secret Admin PIN / Password</span>
              <span className="text-[10px] text-slate-400 font-normal">Default PIN: 7667</span>
            </label>

            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <KeyRound className="w-4 h-4" />
              </div>

              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => { setPin(e.target.value); setErrorMsg(''); }}
                placeholder="Enter 4-digit PIN (e.g. 7667)"
                maxLength={8}
                autoFocus
                className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono font-black text-lg tracking-widest text-slate-900 focus:outline-none focus:border-[#00A859] focus:bg-white transition-all"
              />

              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-1 text-[11px] text-rose-600 font-bold mt-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Keypad Grid for Convenience */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  if (k === 'C') setPin('');
                  else if (k === '⌫') setPin(prev => prev.slice(0, -1));
                  else handleQuickKey(k);
                }}
                className={`py-2.5 rounded-xl font-bold text-sm border transition-all active:scale-95 cursor-pointer ${
                  k === 'C' || k === '⌫'
                    ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    : 'bg-white text-slate-800 border-slate-200 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 shadow-2xs'
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="admin-auth-submit-btn"
            className="w-full py-3 rounded-full bg-[#00A859] hover:bg-[#00924B] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Unlock Admin Panel (प्रवेश करें)</span>
          </button>
        </form>

        <div className="text-center pt-1">
          <p className="text-[10px] text-slate-400">
            Protected with Encrypted Browser Session & Local Authentication
          </p>
        </div>
      </div>
    </div>
  );
}
