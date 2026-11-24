import { useState } from 'react';
import { 
  Bell, 
  Copy, 
  ArrowDown, 
  ArrowUp, 
  Check, 
  ListChecks, 
  Users, 
  FileText, 
  DollarSign,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { AppUser, AppTransaction } from '../types';

interface HomeScreenProps {
  user: AppUser;
  transactions: AppTransaction[];
  onOpenDetail: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
  onOpenUsdt: () => void;
  onOpenTask: () => void;
  onOpenTeam: () => void;
  onOpenOrder: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
  onNavigateToTab: (tab: 'payment' | 'wallet' | 'statistics' | 'my') => void;
}

export function HomeScreen({
  user,
  transactions,
  onOpenDetail,
  onOpenDeposit,
  onOpenWithdraw,
  onOpenUsdt,
  onOpenTask,
  onOpenTeam,
  onOpenOrder,
  onShowToast,
  onNavigateToTab
}: HomeScreenProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.idNumber);
    setCopied(true);
    onShowToast(`Copied ID: ${user.idNumber}`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-20">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1 px-1">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-full bg-[#E3F2FD] border border-blue-100 flex items-center justify-center shadow-xs">
            <div className="w-6 h-6 rounded-full bg-[#90CAF9] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white mb-1" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {user.phone}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>ID :  {user.idNumber}</span>
              <button
                id="copy-id-btn"
                onClick={handleCopyId}
                className="p-1 text-slate-400 hover:text-slate-600 rounded cursor-pointer"
                title="Copy ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Bell Icon */}
        <button
          id="notification-bell-btn"
          onClick={() => onShowToast('No new notifications', 'info')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer relative"
        >
          <Bell className="w-6 h-6 stroke-[1.75]" />
          <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2.5" />
        </button>
      </div>

      {/* Main Available Balance Green Gradient Card */}
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#00A859] via-[#00B95F] to-[#00C26E] text-white p-6 shadow-md shadow-emerald-500/15">
        
        {/* Abstract shapes matching the screenshot: Top-right yellow & blue circle segments */}
        <div className="absolute -top-12 -right-10 w-44 h-44 rounded-full bg-[#FFCA28] pointer-events-none opacity-95" />
        <div className="absolute top-4 -right-14 w-36 h-36 rounded-full bg-[#4285F4] pointer-events-none opacity-90" />
        {/* Bottom-left subtle soft green contour */}
        <div className="absolute -bottom-16 -left-12 w-40 h-40 rounded-full bg-[#00924B] pointer-events-none opacity-50" />

        <div className="relative z-10 space-y-2">
          <p className="text-sm font-semibold tracking-wide text-emerald-50 opacity-95">
            Available Balance
          </p>
          
          <div className="flex items-baseline justify-between pt-1">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              ₹ {user.balance.toFixed(2)}
            </div>

            <button
              id="detail-btn"
              onClick={onOpenDetail}
              className="px-6 py-1.5 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-sm hover:bg-emerald-50 transition-transform active:scale-95 cursor-pointer"
            >
              Detail
            </button>
          </div>
        </div>
      </div>

      {/* Deposit / Withdrawal Dual Pill Bar */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#00A859] to-[#00B95F] text-white p-3.5 shadow-sm">
        {/* Decorative corner curved accents */}
        <div className="absolute -top-6 -left-6 w-16 h-16 rounded-full bg-[#3B82F6] pointer-events-none opacity-80" />
        <div className="absolute -top-6 -right-6 w-16 h-16 rounded-full bg-[#FFCA28] pointer-events-none opacity-80" />

        <div className="relative z-10 grid grid-cols-2 divide-x divide-white/20">
          
          {/* Deposit Side */}
          <div 
            onClick={onOpenDeposit}
            className="pl-2 pr-3 flex flex-col justify-center cursor-pointer group active:opacity-90"
          >
            <div className="flex items-center gap-1.5 text-xs text-emerald-100 font-medium">
              <span className="text-emerald-300 font-bold text-sm">↑</span>
              <span>Deposit</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
              ₹ {user.depositTotal.toLocaleString()}
            </div>
          </div>

          {/* Withdrawal Side */}
          <div 
            onClick={onOpenWithdraw}
            className="pl-5 pr-2 flex flex-col justify-center cursor-pointer group active:opacity-90"
          >
            <div className="flex items-center gap-1.5 text-xs text-amber-100 font-medium">
              <span className="text-amber-300 font-bold text-sm">↓</span>
              <span>Withdrawal</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight mt-0.5">
              ₹ {user.withdrawalTotal.toLocaleString()}
            </div>
          </div>

        </div>
      </div>

      {/* 4 Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-2 pt-2">
        
        {/* USDT */}
        <button
          id="action-usdt-btn"
          onClick={onOpenUsdt}
          className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="relative w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform">
            {/* 110INR badge */}
            <span className="absolute -top-2 px-1.5 py-0.5 rounded-md bg-[#00C26E] text-white text-[9px] font-extrabold tracking-tight shadow-xs">
              110INR
            </span>
            {/* T-shirt / USDT styled emblem */}
            <div className="w-8 h-8 rounded-lg border-2 border-slate-700 flex items-center justify-center font-bold text-xs">
              ¥
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-800 mt-2">USDT</span>
        </button>

        {/* Task */}
        <button
          id="action-task-btn"
          onClick={onOpenTask}
          className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform">
            <ListChecks className="w-7 h-7 stroke-[1.6]" />
          </div>
          <span className="text-xs font-semibold text-slate-800 mt-2">Task</span>
        </button>

        {/* Team */}
        <button
          id="action-team-btn"
          onClick={onOpenTeam}
          className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform relative">
            <Users className="w-6 h-6 stroke-[1.6]" />
            <span className="absolute bottom-2.5 right-2.5 text-[9px] font-black text-slate-800">+</span>
          </div>
          <span className="text-xs font-semibold text-slate-800 mt-2">Team</span>
        </button>

        {/* Order */}
        <button
          id="action-order-btn"
          onClick={onOpenOrder}
          className="flex flex-col items-center justify-center p-2 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-center text-slate-700 group-hover:scale-105 transition-transform">
            <FileText className="w-6 h-6 stroke-[1.6]" />
          </div>
          <span className="text-xs font-semibold text-slate-800 mt-2">Order</span>
        </button>

      </div>

      {/* Transactions Section */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Transactions
          </h2>
          <button
            id="see-all-transactions-btn"
            onClick={() => onNavigateToTab('wallet')}
            className="text-xs font-bold text-[#1E88E5] hover:underline cursor-pointer"
          >
            See All
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {transactions.slice(0, 5).map((tx) => (
            <div key={tx.id} className="py-3.5 flex items-center justify-between">
              
              {/* Left icon + Title + Date */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FFEAEA] flex items-center justify-center text-[#FF5252] shrink-0">
                  <div className="w-5 h-5 rounded-full border border-[#FF5252] flex items-center justify-center font-bold text-[10px]">
                    $
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    {tx.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {tx.date}
                  </p>
                </div>
              </div>

              {/* Right Amount + Badge */}
              <div className="text-right space-y-1">
                <div className="text-sm font-extrabold text-slate-900">
                  ₹ {tx.amount.toFixed(2)}
                </div>
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                    tx.status === 'Completed'
                      ? 'bg-[#E8F8F0] text-[#00C26E]'
                      : 'bg-[#FFE8EC] text-[#FF4D6D]'
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
