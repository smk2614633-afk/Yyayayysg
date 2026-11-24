import { useState } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  History, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  Plus
} from 'lucide-react';
import { AppUser, AppTransaction } from '../types';

interface WalletScreenProps {
  user: AppUser;
  transactions: AppTransaction[];
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export function WalletScreen({
  user,
  transactions,
  onOpenDeposit,
  onOpenWithdraw
}: WalletScreenProps) {
  const [historyTab, setHistoryTab] = useState<'all' | 'deposits' | 'withdrawals'>('all');

  const depositTransactions = transactions.filter(t => t.type === 'deposit');
  const otherTransactions = transactions.filter(t => t.type !== 'deposit');

  return (
    <div className="space-y-4 pb-20">
      
      {/* Top Title & Subtitle */}
      <div className="space-y-0.5 pt-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Wallet
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Real money balance & transactions
        </p>
      </div>

      {/* Royal Blue Gradient Card matching Screenshot 4 */}
      <div className="rounded-[26px] bg-gradient-to-br from-[#1E6BFF] via-[#0062FF] to-[#0052E0] text-white p-6 shadow-md shadow-blue-500/20 space-y-4">
        <div>
          <span className="text-xs font-semibold text-blue-100 opacity-90 block">
            Available Balance
          </span>
          <div className="text-4xl font-black tracking-tight mt-1">
            ₹{user.balance.toFixed(2)}
          </div>
        </div>

        {/* Sub-row: Pending, Total Earned, Withdrawn */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/20 text-xs">
          <div>
            <span className="text-[11px] text-blue-200 block">Pending</span>
            <div className="font-bold text-white mt-0.5">₹{user.pending.toFixed(2)}</div>
          </div>
          <div>
            <span className="text-[11px] text-blue-200 block">Total Earned</span>
            <div className="font-bold text-white mt-0.5">₹{user.reward.toFixed(2)}</div>
          </div>
          <div>
            <span className="text-[11px] text-blue-200 block">Withdrawn</span>
            <div className="font-bold text-white mt-0.5">₹{user.withdrawalTotal.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* 3 Square Action Buttons: Deposit, Withdraw, History */}
      <div className="grid grid-cols-3 gap-3">
        
        <button
          id="wallet-deposit-btn"
          onClick={onOpenDeposit}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all cursor-pointer group active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0062FF] flex items-center justify-center group-hover:scale-105 transition-transform">
            <ArrowDown className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold text-slate-800">Deposit</span>
        </button>

        <button
          id="wallet-withdraw-btn"
          onClick={onOpenWithdraw}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all cursor-pointer group active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0062FF] flex items-center justify-center group-hover:scale-105 transition-transform">
            <ArrowUp className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold text-slate-800">Withdraw</span>
        </button>

        <button
          id="wallet-history-btn"
          onClick={() => setHistoryTab(historyTab === 'deposits' ? 'all' : 'deposits')}
          className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-all cursor-pointer group active:scale-95"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0062FF] flex items-center justify-center group-hover:scale-105 transition-transform">
            <History className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold text-slate-800">History</span>
        </button>

      </div>

      {/* Green Exchange Rate Banner */}
      <div className="bg-[#E2F7ED] rounded-2xl px-4 py-3.5 flex items-center justify-between text-[#00A859] font-bold text-xs sm:text-sm">
        <span>Real Time Exchange Rates (INR/USDT)</span>
        <span className="text-lg font-black tracking-tight">{user.exchangeRate}</span>
      </div>

      {/* Deposit History */}
      <div className="space-y-2">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
          Deposit History
        </h3>

        {depositTransactions.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-slate-100 text-center text-xs text-slate-400 font-medium">
            No deposits yet
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-xs">
            {depositTransactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#00A859] flex items-center justify-center font-bold">
                    ↓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{tx.title}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-extrabold text-slate-900">₹{tx.amount.toFixed(2)}</div>
                  <span className="text-[9px] font-bold text-[#00C26E] bg-[#E8F8F0] px-1.5 py-0.5 rounded">
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="space-y-2">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
          Transaction History
        </h3>

        <div className="bg-white rounded-2xl border border-slate-100 divide-y divide-slate-100 shadow-xs">
          {transactions.map((tx) => (
            <div key={tx.id} className="p-3.5 flex items-center justify-between">
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {tx.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {tx.date}
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-xs font-extrabold text-slate-900">
                  ₹{tx.amount.toFixed(2)}
                </div>
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-bold ${
                    tx.status === 'Completed'
                      ? 'bg-[#E8F8F0] text-[#00C26E]'
                      : 'bg-[#FFE8EC] text-[#FF4D6D]'
                  }`}>
                    {tx.status.toLowerCase()}
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
