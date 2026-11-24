import { useState } from 'react';
import { 
  Copy, 
  Check, 
  Users, 
  CreditCard, 
  ShieldCheck, 
  HelpCircle, 
  RotateCcw, 
  ChevronRight,
  Headphones,
  Award,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Lock
} from 'lucide-react';
import { AppUser } from '../types';

interface MyScreenProps {
  user: AppUser;
  onOpenTeam: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenSupport: () => void;
  onResetDemo: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  isAdminAuthenticated: boolean;
  onOpenAdmin: () => void;
  onOpenAdminAuth: () => void;
}

export function MyScreen({
  user,
  onOpenTeam,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenSupport,
  onResetDemo,
  onShowToast,
  isAdminAuthenticated,
  onOpenAdmin,
  onOpenAdminAuth
}: MyScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.idNumber);
    setCopied(true);
    onShowToast(`Copied ID: ${user.idNumber}`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Title */}
      <div className="text-center py-1">
        <h1 className="text-lg font-extrabold text-[#00B360] tracking-tight">
          My Profile
        </h1>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-[#E3F2FD] border-2 border-blue-100 flex items-center justify-center shadow-xs">
            <div className="w-7 h-7 rounded-full bg-[#90CAF9] flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-white mb-1" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                {user.phone}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                VIP 1
              </span>
              {isAdminAuthenticated && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                  Owner
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5 font-medium">
              <button 
                onClick={onOpenAdminAuth}
                className="hover:text-slate-800 transition-colors text-left"
                title="Account ID"
              >
                ID : {user.idNumber}
              </button>
              <button
                onClick={handleCopyId}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                title="Copy ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Balance Bar inside Profile */}
        <div className="bg-gradient-to-r from-[#00A859] to-[#00C26E] rounded-2xl p-4 text-white flex items-center justify-between">
          <div>
            <span className="text-xs text-emerald-100 block font-medium">Available Balance</span>
            <div className="text-2xl font-black mt-0.5">₹ {user.balance.toFixed(2)}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onOpenDeposit}
              className="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-xs hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
            >
              Deposit
            </button>
            <button
              onClick={onOpenWithdraw}
              className="px-3 py-1.5 rounded-xl bg-emerald-900/40 border border-white/20 text-white font-bold text-xs shadow-xs hover:bg-emerald-900/60 active:scale-95 transition-all cursor-pointer"
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* Account Menu Options */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs divide-y divide-slate-100 overflow-hidden">
        
        {/* Admin Panel Option - ONLY visible if user has verified Admin PIN */}
        {isAdminAuthenticated && (
          <button
            id="my-screen-admin-panel-btn"
            onClick={onOpenAdmin}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left bg-gradient-to-r from-slate-900 to-slate-800 text-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>Admin Panel (एडमिन पैनल)</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 text-[9px] font-black uppercase">
                    Owner
                  </span>
                </div>
                <div className="text-[10px] text-slate-300">
                  Manage user deposits & withdrawals (डिपॉजिट और विड्रॉल)
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
        )}

        <button
          onClick={onOpenTeam}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Team & Referral Invitation</div>
              <div className="text-[10px] text-slate-400">Invite friends & earn lifetime commission</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={() => onShowToast(`Bound UPI: ${user.upiId || '255888888@paytm'}`, 'info')}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Bank Card / UPI Account</div>
              <div className="text-[10px] text-slate-400">Paytm / PhonePe / Bank details</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onOpenSupport}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">24/7 Customer Service</div>
              <div className="text-[10px] text-slate-400">Instant AI & live agent support</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        <button
          onClick={onResetDemo}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">Reset Demo Data</div>
              <div className="text-[10px] text-slate-400">Restore exact values from original photo</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

      </div>

      {/* Discrete Owner Admin Gateway - Hidden from regular users */}
      <div className="pt-2 text-center">
        <button
          id="my-screen-admin-login-link"
          onClick={onOpenAdminAuth}
          className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-600 transition-colors py-1 px-3 rounded-full hover:bg-slate-200/50 cursor-pointer"
        >
          <Lock className="w-3 h-3 text-slate-400" />
          <span>{isAdminAuthenticated ? 'Admin Mode (Active)' : 'Owner / Admin Login'}</span>
        </button>
      </div>

    </div>
  );
}
