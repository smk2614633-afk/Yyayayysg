import { useState } from 'react';
import { 
  Wallet, 
  Repeat, 
  DollarSign, 
  Coins, 
  ArrowUpRight,
  TrendingUp,
  Zap,
  Clock
} from 'lucide-react';
import { AppUser } from '../types';

interface StatisticsScreenProps {
  user: AppUser;
  onToggleSelling: () => void;
}

export function StatisticsScreen({ user, onToggleSelling }: StatisticsScreenProps) {
  const todayDate = '11/09/2026';

  return (
    <div className="space-y-4 pb-20">
      
      {/* Title */}
      <div className="text-center py-1">
        <h1 className="text-lg font-extrabold text-[#00B360] tracking-tight">
          Statistics
        </h1>
      </div>

      {/* Main White Card Container */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-5">
        
        {/* Statistics Header */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-4 bg-[#00A859] rounded-full" />
          <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
            Statistics <span className="font-normal text-slate-400 text-xs">({todayDate})</span>
          </h2>
        </div>

        {/* 2x2 Metric Grid */}
        <div className="grid grid-cols-2 gap-3">
          
          {/* Balance */}
          <div className="bg-[#F8FBF9] rounded-2xl p-3.5 border border-slate-100/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4D88FF] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Balance</span>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                ₹ {user.balance.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Sell */}
          <div className="bg-[#F8FBF9] rounded-2xl p-3.5 border border-slate-100/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFA726] text-white flex items-center justify-center shrink-0 shadow-xs">
              <span className="font-extrabold text-sm">⇄</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Sell</span>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                ₹ {user.sell.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Deposit */}
          <div className="bg-[#F8FBF9] rounded-2xl p-3.5 border border-slate-100/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00C26E] text-white flex items-center justify-center shrink-0 shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Deposit</span>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                ₹ {user.depositMetric.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Commission */}
          <div className="bg-[#F8FBF9] rounded-2xl p-3.5 border border-slate-100/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5252] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium block">Commission</span>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                ₹ {user.commission.toFixed(2)}
              </div>
            </div>
          </div>

        </div>

        {/* Section 2: Payment */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#00A859] rounded-full" />
            <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
              Payment
            </h2>
          </div>

          {/* Green banner: Real Time Exchange Rates(INR/USDT) 110 */}
          <div className="bg-[#E2F7ED] rounded-xl px-4 py-3 flex items-center justify-between text-[#00A859] font-bold text-xs sm:text-sm">
            <span>Real Time Exchange Rates(INR/USDT)</span>
            <span className="text-base font-black tracking-tight">{user.exchangeRate}</span>
          </div>

          {/* 4 Metric Sub-Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            
            <div className="bg-[#F8FBF9] rounded-xl p-3 border border-slate-100/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <span className="text-amber-500 font-bold">⚡</span>
                <span>In Process Amount</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 mt-1">
                ₹ {user.inProcessAmount.toFixed(2)}
              </div>
            </div>

            <div className="bg-[#F8FBF9] rounded-xl p-3 border border-slate-100/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <span className="text-amber-500 font-bold">⚡</span>
                <span>In Process Orders</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 mt-1">
                {user.inProcessOrders}
              </div>
            </div>

            <div className="bg-[#F8FBF9] rounded-xl p-3 border border-slate-100/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <span className="text-amber-500 font-bold">⚡</span>
                <span>Commission Rate</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 mt-1">
                {user.cashbackRate.toFixed(2)} %
              </div>
            </div>

            <div className="bg-[#F8FBF9] rounded-xl p-3 border border-slate-100/80">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <span className="text-amber-500 font-bold">⚡</span>
                <span>Estimated Income</span>
              </div>
              <div className="text-sm font-extrabold text-slate-900 mt-1">
                ₹ {user.estimatedIncome.toFixed(2)}
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Big Yellow Action Button: Closed Selling / Open Selling */}
      <div className="pt-2 px-1">
        <button
          id="toggle-selling-btn"
          onClick={onToggleSelling}
          className={`w-full py-4 rounded-full font-extrabold text-base tracking-wide shadow-md transition-all active:scale-98 cursor-pointer ${
            user.isSellingOpen
              ? 'bg-[#00C26E] text-white shadow-emerald-500/20'
              : 'bg-[#FFC400] hover:bg-[#FFB703] text-white shadow-amber-500/20'
          }`}
        >
          {user.isSellingOpen ? 'Selling Orders Active (Click to Pause)' : 'Closed Selling'}
        </button>
      </div>

    </div>
  );
}
