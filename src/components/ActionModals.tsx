import { useState, FormEvent, useEffect } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  ArrowDown, 
  ArrowUp, 
  CreditCard, 
  Copy, 
  Check, 
  ShieldCheck, 
  Info,
  DollarSign,
  Users,
  Repeat,
  QrCode,
  Zap
} from 'lucide-react';
import { AppUser } from '../types';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, method: string) => void;
  onOpenWatchPays?: (amount: number) => void;
}

export function DepositModal({ isOpen, onClose, onDeposit, onOpenWatchPays }: DepositModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedMethod, setSelectedMethod] = useState<string>('WatchPays (Auto Gateway)');
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copiedUpi, setCopiedUpi] = useState(false);

  const UPI_ID = '7667340425@fam';
  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  useEffect(() => {
    if (isOpen && effectiveAmount > 0) {
      const upiStr = `upi://pay?pa=${UPI_ID}&pn=EarningHub&am=${effectiveAmount}&cu=INR&tn=Deposit`;
      QRCode.toDataURL(upiStr, {
        width: 180,
        margin: 1,
        color: { dark: '#0f172a', light: '#ffffff' }
      })
      .then(url => setQrUrl(url))
      .catch(err => console.error(err));
    }
  }, [isOpen, effectiveAmount]);

  if (!isOpen) return null;

  const quickAmounts = [100, 500, 1000, 1500, 2000, 5000];
  const methods = ['WatchPays (Auto Gateway)', 'Paytm', 'PhonePe', 'Mobikwik', 'USDT (110 INR)'];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (finalAmount > 0) {
      if (selectedMethod.startsWith('WatchPays') && onOpenWatchPays) {
        onClose();
        onOpenWatchPays(finalAmount);
        return;
      }
      onDeposit(finalAmount, selectedMethod);
      onClose();
    }
  };

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-[#00A859] flex items-center justify-center">
              <ArrowDown className="w-4 h-4 stroke-[3]" />
            </div>
            <h3 className="font-extrabold text-base">Deposit INR (रिचार्ज करें)</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Select Amount (INR)</label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => { setSelectedAmount(amt); setCustomAmount(''); }}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    selectedAmount === amt && !customAmount
                      ? 'bg-[#00A859] text-white border-[#00A859]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ₹ {amt}
                </button>
              ))}
            </div>

            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Or enter custom INR amount"
              className="w-full mt-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00A859]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">Select Payment Channel</label>
            <div className="grid grid-cols-2 gap-2">
              {methods.map((m) => {
                const isWatchPays = m.startsWith('WatchPays');
                return (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setSelectedMethod(m)}
                    className={`p-2.5 rounded-xl text-xs font-bold border text-left transition-all cursor-pointer flex items-center justify-between ${
                      selectedMethod === m
                        ? 'bg-emerald-50 text-[#00A859] border-[#00A859] ring-1 ring-[#00A859]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      {isWatchPays && <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />}
                      <span>{m}</span>
                    </span>
                    {isWatchPays && (
                      <span className="text-[9px] uppercase px-1.5 py-0.2 bg-emerald-200 text-emerald-800 rounded font-black">
                        API
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* If WatchPays Selected: Show API Gateway Information */}
          {selectedMethod.startsWith('WatchPays') ? (
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-900">
                <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                <span>WatchPays Instant Gateway (Direct Link Pay)</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Clicking proceed will generate your signed order and <strong>directly open the official WatchPays payment link</strong> for instant UPI and NetBanking payment.
              </p>
            </div>
          ) : (
            /* Manual UPI Gateway Info for Deposit */
            <div className="bg-[#F8FBF9] border border-slate-200 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">UPI ID for Deposit:</span>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#00A859] bg-white border border-[#00A859]/30 px-2 py-0.5 rounded-md cursor-pointer hover:bg-emerald-50"
                >
                  {copiedUpi ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="font-mono text-xs font-black text-slate-900 bg-white p-2 rounded-lg border border-slate-200 flex items-center justify-between">
                <span>{UPI_ID}</span>
                <span className="text-[10px] text-emerald-600 font-sans font-bold">₹{effectiveAmount}</span>
              </div>

              {qrUrl && (
                <div className="flex flex-col items-center justify-center pt-1">
                  <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                    <img src={qrUrl} alt="Deposit QR" className="w-32 h-32 object-contain" />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">Scan with Paytm / PhonePe / FamPay</span>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#00A859] hover:bg-[#00924B] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            {selectedMethod.startsWith('WatchPays') && <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />}
            <span>
              {selectedMethod.startsWith('WatchPays') ? 'Proceed with WatchPays Gateway' : 'Confirm Deposit'}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onWithdraw: (amount: number, channel: string, account: string) => boolean;
}

export function WithdrawModal({ isOpen, onClose, availableBalance, onWithdraw }: WithdrawModalProps) {
  const [amount, setAmount] = useState<string>('500');
  const [account, setAccount] = useState<string>('255888888@paytm');
  const [channel, setChannel] = useState<string>('UPI');

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (parsed > 0) {
      const ok = onWithdraw(parsed, channel, account);
      if (ok) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-slate-900">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ArrowUp className="w-4 h-4 stroke-[3]" />
            </div>
            <h3 className="font-extrabold text-base">Withdrawal INR</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#EBFBF3] rounded-xl p-3 text-xs text-[#009E52] flex justify-between font-semibold">
          <span>Available for Withdrawal:</span>
          <span className="font-extrabold">₹ {availableBalance.toFixed(2)}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Withdrawal Amount (INR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount (min ₹100)"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00A859]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Channel</label>
            <div className="grid grid-cols-2 gap-2">
              {['UPI (Paytm/PhonePe)', 'Bank Account'].map((ch) => (
                <button
                  type="button"
                  key={ch}
                  onClick={() => setChannel(ch)}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    channel === ch
                      ? 'bg-emerald-50 text-[#00A859] border-[#00A859]'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">UPI ID or Account Number</label>
            <input
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00A859]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-[#00A859] hover:bg-[#00924B] text-white font-extrabold text-sm shadow-md transition-all active:scale-95 cursor-pointer"
          >
            Submit Withdrawal
          </button>
        </form>
      </div>
    </div>
  );
}

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AppUser;
}

export function DetailModal({ isOpen, onClose, user }: DetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-base text-slate-900">Available Balance Detail</h3>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="bg-[#E8F8F0] p-4 rounded-2xl flex justify-between items-center">
            <span className="font-bold text-[#00A859]">Available Balance</span>
            <span className="text-xl font-black text-[#00A859]">₹ {user.balance.toFixed(2)}</span>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Cumulative Deposit:</span>
              <span className="font-bold text-slate-900">₹ {user.depositTotal.toFixed(2)}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Cumulative Withdrawal:</span>
              <span className="font-bold text-slate-900">₹ {user.withdrawalTotal.toFixed(2)}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Earned Commission:</span>
              <span className="font-bold text-emerald-600">₹ {user.commission.toFixed(2)}</span>
            </div>
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-500 font-medium">Reward Balance:</span>
              <span className="font-bold text-slate-900">₹ {user.reward.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs cursor-pointer"
        >
          Close Detail
        </button>
      </div>
    </div>
  );
}

interface UsdtModalProps {
  isOpen: boolean;
  onClose: () => void;
  rate: number;
}

export function UsdtModal({ isOpen, onClose, rate }: UsdtModalProps) {
  const [inrVal, setInrVal] = useState<string>('1100');
  const [usdtVal, setUsdtVal] = useState<string>('10');

  if (!isOpen) return null;

  const handleInrChange = (val: string) => {
    setInrVal(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setUsdtVal((num / rate).toFixed(2));
    } else {
      setUsdtVal('');
    }
  };

  const handleUsdtChange = (val: string) => {
    setUsdtVal(val);
    const num = parseFloat(val);
    if (!isNaN(num)) {
      setInrVal((num * rate).toFixed(2));
    } else {
      setInrVal('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <h3 className="font-extrabold text-base text-slate-900">USDT Exchange Rate</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-[#E2F7ED] p-3.5 rounded-2xl flex items-center justify-between text-[#00A859] font-bold text-xs sm:text-sm">
          <span>Real Time Exchange Rate:</span>
          <span className="text-base font-black">1 USDT = {rate} INR</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">INR Amount</label>
            <input
              type="number"
              value={inrVal}
              onChange={(e) => handleInrChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00A859]"
            />
          </div>

          <div className="text-center font-bold text-slate-400 text-xs">⇅</div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">USDT (TRC-20)</label>
            <input
              type="number"
              value={usdtVal}
              onChange={(e) => handleUsdtChange(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00A859]"
            />
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-[#00A859] text-white font-bold text-xs cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
}

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  idNumber: string;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function TeamModal({ isOpen, onClose, idNumber, onShowToast }: TeamModalProps) {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const inviteLink = `https://earninghub.app/invite?ref=${idNumber}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    onShowToast('Invitation link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <h3 className="font-extrabold text-base text-slate-900">Team & Referral</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-purple-50 p-4 rounded-2xl space-y-2">
          <span className="text-xs font-bold text-purple-900 block">Your Invitation ID:</span>
          <div className="text-2xl font-black text-purple-700">{idNumber}</div>
          <p className="text-[11px] text-purple-700">
            Earn 10% commission on every order or cashback task completed by your direct team members!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-2">
          <span className="text-xs text-slate-600 font-mono truncate flex-1">{inviteLink}</span>
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-[#00A859] text-white font-bold text-xs cursor-pointer"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-slate-900 text-white font-bold text-xs cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
