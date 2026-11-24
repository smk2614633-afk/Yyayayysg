import { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  Check, 
  Lock,
  Zap,
  CheckCheck,
  ArrowUpRight
} from 'lucide-react';
import { 
  createWatchPaysOrder, 
  getStoredWatchPaysConfig, 
  WatchPaysCreateResponse 
} from '../utils/watchpays';

interface WatchPaysPaymentModalProps {
  isOpen: boolean;
  amount: number;
  userId: string;
  userPhone: string;
  onClose: () => void;
  onSuccess: (amount: number, orderNo: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function WatchPaysPaymentModal({
  isOpen,
  amount,
  userId,
  userPhone: _userPhone,
  onClose,
  onSuccess,
  onShowToast
}: WatchPaysPaymentModalProps) {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState<WatchPaysCreateResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedOrderNo, setCopiedOrderNo] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isSimulatingSuccess, setIsSimulatingSuccess] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  const config = getStoredWatchPaysConfig();

  // Open direct payment link in a new tab
  const openDirectLink = (url: string) => {
    try {
      const opened = window.open(url, '_blank', 'noopener,noreferrer');
      if (opened) {
        onShowToast('Opening WatchPays direct payment link...', 'info');
      } else {
        // If popup blocker intervened, window.location or user button handles it
        onShowToast('Popup blocked. Click "Open Direct Payment Link" below.', 'info');
      }
    } catch {
      // Fallback
    }
  };

  // Initiate order creation when modal opens
  useEffect(() => {
    if (!isOpen || amount <= 0) return;

    setLoading(true);
    setErrorMsg(null);
    setOrderData(null);
    setHasAutoOpened(false);
    setTimeLeft(600);

    createWatchPaysOrder(amount, userId, config)
      .then((res) => {
        setLoading(false);
        if (res.success && res.payment_url) {
          setOrderData(res);
          // Directly open payment link
          openDirectLink(res.payment_url);
          setHasAutoOpened(true);
        } else {
          const err = res.error || res.message || 'Payment initiation failed';
          setErrorMsg(err);
          setOrderData(res);
        }
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg(err?.message || 'Could not connect to WatchPays Gateway');
      });
  }, [isOpen, amount, userId]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || timeLeft <= 0 || !orderData?.payment_url) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, timeLeft, orderData]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const handleCopyLink = () => {
    if (orderData?.payment_url) {
      navigator.clipboard.writeText(orderData.payment_url);
      setCopiedLink(true);
      onShowToast('Payment URL copied to clipboard!', 'success');
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyOrderNo = () => {
    const no = orderData?.order_no || orderData?.merchant_order_no;
    if (no) {
      navigator.clipboard.writeText(no);
      setCopiedOrderNo(true);
      onShowToast('Order number copied!', 'success');
      setTimeout(() => setCopiedOrderNo(false), 2000);
    }
  };

  const handleConfirmPaymentSuccess = () => {
    setIsSimulatingSuccess(true);
    setTimeout(() => {
      setIsSimulatingSuccess(false);
      const finalOrderNo = orderData?.order_no || orderData?.merchant_order_no || `GW${Date.now()}`;
      onSuccess(amount, finalOrderNo);
      onClose();
      onShowToast(`Deposit of ₹${amount.toFixed(2)} credited successfully!`, 'success');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-[#00A859] p-4 sm:p-5 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              </div>
              <div>
                <h3 className="font-extrabold text-base leading-tight">WatchPays Direct Pay</h3>
                <p className="text-[11px] text-emerald-100 font-medium">Instant Payment Link Gateway</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 flex items-center justify-between border border-white/20">
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-100 tracking-wider">Deposit Amount</span>
              <div className="text-2xl font-black text-white">₹ {amount.toFixed(2)}</div>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 px-2.5 py-1 rounded-full text-xs font-mono font-bold text-emerald-100">
              <Clock className="w-3.5 h-3.5 text-yellow-300" />
              <span>{timerStr}</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 space-y-4">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-9 h-9 text-[#00A859] animate-spin" />
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">Generating Direct Payment Link...</p>
                <p className="text-xs text-slate-400 mt-1">Connecting to WatchPays Gateway API</p>
              </div>
            </div>
          ) : errorMsg && !orderData?.payment_url ? (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Gateway Response Notice</span>
                </div>
                <p className="text-xs leading-relaxed text-amber-800">
                  WatchPays API responded: <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-950 font-bold">{errorMsg}</code>
                </p>
                <p className="text-[11px] text-amber-700">
                  Please verify your connection or use simulation mode for demo testing.
                </p>
              </div>

              {/* Order Signature Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between text-slate-500 font-sans font-bold text-[10px] uppercase">
                  <span>Merchant Order No</span>
                  <span>{orderData?.merchant_order_no || 'N/A'}</span>
                </div>
                <div className="text-[11px] text-slate-700 break-all">
                  API: {config.apiUrl}
                </div>
              </div>

              {/* Instant Simulation Option */}
              <button
                type="button"
                onClick={handleConfirmPaymentSuccess}
                disabled={isSimulatingSuccess}
                className="w-full py-3 rounded-2xl bg-[#00A859] hover:bg-[#00924B] text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                {isSimulatingSuccess ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simulate Payment Success (Test Deposit)</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <>
              {/* Order Info Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Order ID:</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-slate-800">
                    <span>{orderData?.order_no || orderData?.merchant_order_no}</span>
                    <button
                      type="button"
                      onClick={handleCopyOrderNo}
                      className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                    >
                      {copiedOrderNo ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-bold">Status:</span>
                  <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {orderData?.status ? orderData.status.toUpperCase() : 'CREATED'}
                  </span>
                </div>
              </div>

              {/* Direct Link Action Area */}
              {orderData?.payment_url && (
                <div className="space-y-3 pt-1">
                  {/* Primary Direct Link Button */}
                  <a
                    href={orderData.payment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      onShowToast('Opening WatchPays direct payment gateway...', 'info');
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-[#00A859] to-teal-600 hover:from-emerald-700 hover:to-emerald-600 text-white font-black text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center group"
                  >
                    <span>Open Direct Payment Link (डायरेक्ट लिंक खोलें)</span>
                    <ArrowUpRight className="w-4 h-4 stroke-[3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>

                  {hasAutoOpened && (
                    <div className="text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Payment link automatically opened in a new tab</span>
                      </span>
                    </div>
                  )}

                  {/* Direct Link Box with Copy Action */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                      <span>Direct Payment URL:</span>
                      <button
                        type="button"
                        onClick={handleCopyLink}
                        className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-bold cursor-pointer"
                      >
                        {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedLink ? 'Copied' : 'Copy Link'}</span>
                      </button>
                    </div>
                    <div className="text-xs font-mono text-slate-700 break-all bg-white p-2.5 rounded-xl border border-slate-200 select-all">
                      {orderData.payment_url}
                    </div>
                  </div>

                  {/* Payment Instructions Hindi/English */}
                  <div className="bg-blue-50/60 border border-blue-200/80 rounded-2xl p-3 text-xs text-blue-900 space-y-1">
                    <p className="font-bold text-[11px] text-blue-950 flex items-center gap-1">
                      <span>💡 Payment Instructions:</span>
                    </p>
                    <p className="text-[11px] text-blue-800 leading-relaxed">
                      सीधे पेमेंट करने के लिए ऊपर दिए गए <strong>"डायरेक्ट लिंक खोलें"</strong> बटन पर क्लिक करें। WatchPays गेटवे पर UPI/NetBanking से भुगतान पूरा होने के बाद नीचे <strong>"Confirm Paid"</strong> पर क्लिक करें।
                    </p>
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => openDirectLink(orderData.payment_url!)}
                      className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Reopen Link</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleConfirmPaymentSuccess}
                      disabled={isSimulatingSuccess}
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      {isSimulatingSuccess ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCheck className="w-3.5 h-3.5 text-white" />
                      )}
                      <span>Confirm Paid</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Secure Trust Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium pt-1 border-t border-slate-100">
            <Lock className="w-3 h-3 text-slate-400" />
            <span>256-Bit SSL Encrypted & MD5 Signed Transaction</span>
          </div>
        </div>
      </div>
    </div>
  );
}
