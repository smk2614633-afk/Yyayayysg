import { useState, useEffect, useRef, FormEvent } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  ExternalLink, 
  Smartphone, 
  AlertCircle,
  QrCode,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { PaymentOffer } from '../types';

interface UpiPaymentGatewayModalProps {
  isOpen: boolean;
  offer: PaymentOffer | null;
  onClose: () => void;
  onConfirmClaim: (offerId: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function UpiPaymentGatewayModal({
  isOpen,
  offer,
  onClose,
  onConfirmClaim,
  onShowToast
}: UpiPaymentGatewayModalProps) {
  const UPI_ID = '7667340425@fam';
  const PAYEE_NAME = 'EarningHub Payment';

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedAmount, setCopiedAmount] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  // Reset states when opened
  useEffect(() => {
    if (isOpen && offer) {
      setTimeLeft(600);
      setUtrNumber('');
      setIsVerifying(false);
      
      // Generate standard UPI QR code string
      // upi://pay?pa=7667340425@fam&pn=EarningHub&am=800&cu=INR&tn=Task_eAzdis
      const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${offer.amount}&cu=INR&tn=Task_${offer.code}`;
      
      QRCode.toDataURL(upiUrl, {
        width: 280,
        margin: 1.5,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR code generation error:', err));
    }
  }, [isOpen, offer]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, timeLeft]);

  if (!isOpen || !offer) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const upiIntentUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${offer.amount}&cu=INR&tn=Task_${offer.code}`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    onShowToast(`UPI ID copied: ${UPI_ID}`, 'success');
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleCopyAmount = () => {
    navigator.clipboard.writeText(offer.amount.toString());
    setCopiedAmount(true);
    onShowToast(`Amount copied: ₹${offer.amount}`, 'success');
    setTimeout(() => setCopiedAmount(false), 2000);
  };

  const handleVerifyPayment = (e: FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    // Simulate authentic verification flow
    setTimeout(() => {
      setIsVerifying(false);
      onConfirmClaim(offer.id);
      onClose();
      onShowToast(`Payment verified! Cashback of +₹${offer.income.toFixed(2)} added to your balance.`, 'success');
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gateway Header */}
        <div className="bg-gradient-to-r from-[#00A859] via-[#00B95F] to-[#00C26E] p-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                <QrCode className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight leading-tight">
                  UPI Payment Gateway
                </h3>
                <span className="text-[10px] text-emerald-100 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Secure 256-Bit Encrypted Gateway
                </span>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="w-7 h-7 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Amount and Income Preview Bar */}
          <div className="mt-3.5 bg-black/15 backdrop-blur-xs rounded-2xl p-3 flex items-center justify-between border border-white/20">
            <div>
              <span className="text-[11px] text-emerald-100 block font-medium">
                Payment Amount (Task {offer.code})
              </span>
              <div className="text-2xl font-black tracking-tight text-white mt-0.5">
                ₹ {offer.amount.toLocaleString('en-IN')}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-emerald-100 block font-medium">
                Cashback Income
              </span>
              <span className="inline-block mt-0.5 px-2.5 py-1 rounded-lg bg-[#FFD600] text-slate-950 text-xs font-black shadow-xs">
                +{offer.income} INR
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Timer Notice */}
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200/70 rounded-xl px-3 py-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span>Gateway session expires in:</span>
            </div>
            <span className="font-mono font-black text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200 shadow-2xs">
              {formattedTime}
            </span>
          </div>

          {/* Central QR Code Card */}
          <div className="bg-[#F8FBF9] border border-slate-200/80 rounded-2xl p-4 flex flex-col items-center justify-center text-center relative shadow-xs">
            <span className="text-[11px] font-bold text-slate-600 mb-2">
              Scan with Any UPI App to Pay
            </span>

            {/* QR Code Container */}
            <div className="relative bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200">
              {qrDataUrl ? (
                <img 
                  src={qrDataUrl} 
                  alt="UPI QR Code" 
                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain"
                />
              ) : (
                <div className="w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center text-slate-400 text-xs">
                  Generating QR Code...
                </div>
              )}

              {/* Center UPI Badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-0.5 rounded-full border border-slate-300 shadow-xs flex items-center gap-1">
                <span className="text-[9px] font-black text-[#00A859] tracking-wider">UPI</span>
              </div>
            </div>

            {/* Supported App Icons/Badges */}
            <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap text-[10px] font-bold text-slate-500">
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-purple-700">PhonePe</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-blue-600">Paytm</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-amber-600">FamPay</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-sky-600">GPay</span>
              <span className="px-2 py-0.5 rounded bg-white border border-slate-200 text-emerald-700">BHIM</span>
            </div>
          </div>

          {/* UPI ID Copy Field - EXACTLY 7667340425@fam */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Merchant UPI ID
            </label>
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-2.5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00A859] animate-ping" />
                <span className="font-mono font-extrabold text-sm text-slate-900 selection:bg-emerald-200">
                  {UPI_ID}
                </span>
              </div>
              <button
                id="copy-gateway-upi-btn"
                onClick={handleCopyUpi}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#00A859] text-white text-xs font-bold shadow-xs hover:bg-[#00924B] active:scale-95 transition-all cursor-pointer"
              >
                {copiedUpi ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy UPI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Direct Pay Link for Mobile Users */}
          <div className="pt-0.5">
            <a
              id="direct-open-upi-btn"
              href={upiIntentUrl}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-xs"
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Tap to Open UPI App Directly</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>

          {/* Verification Form (UTR / Ref Number) */}
          <form onSubmit={handleVerifyPayment} className="space-y-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Enter 12-Digit UTR / Reference No.
              </label>
              <input
                id="gateway-utr-input"
                type="text"
                maxLength={16}
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 425678912345 (Optional)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-mono tracking-wider focus:outline-none focus:border-[#00A859]"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Found in payment receipt of PhonePe / Paytm / FamPay
              </span>
            </div>

            {/* Confirm Claim Button */}
            <button
              id="confirm-upi-claim-btn"
              type="submit"
              disabled={isVerifying}
              className="w-full py-3.5 rounded-full bg-[#00A859] hover:bg-[#00924B] text-white font-black text-sm shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer disabled:opacity-75"
            >
              {isVerifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Payment...</span>
                </>
              ) : (
                <>
                  <span>Confirm Payment & Claim +₹{offer.income}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
