import { Home, CreditCard, BarChart2, User, Users, Wallet } from 'lucide-react';
import { MainTab } from '../types';

interface BottomNavProps {
  activeTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
}

export function BottomNav({ activeTab, onChangeTab }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 py-1.5 px-4 shadow-lg shadow-slate-300/30 max-w-md mx-auto">
      <div className="flex items-center justify-between relative">
        
        {/* Tab 1: Home */}
        <button
          id="nav-home-btn"
          onClick={() => onChangeTab('home')}
          className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer transition-colors"
        >
          <Home className={`w-6 h-6 stroke-[2] ${
            activeTab === 'home' ? 'text-[#00C26E]' : 'text-slate-400'
          }`} />
          <span className={`text-[10px] font-bold mt-1 ${
            activeTab === 'home' ? 'text-[#00C26E]' : 'text-slate-400'
          }`}>
            Home
          </span>
        </button>

        {/* Tab 2: Payment */}
        <button
          id="nav-payment-btn"
          onClick={() => onChangeTab('payment')}
          className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer transition-colors"
        >
          <CreditCard className={`w-6 h-6 stroke-[2] ${
            activeTab === 'payment' ? 'text-[#00C26E]' : 'text-slate-400'
          }`} />
          <span className={`text-[10px] font-bold mt-1 ${
            activeTab === 'payment' ? 'text-[#00C26E]' : 'text-slate-400'
          }`}>
            Payment
          </span>
        </button>

        {/* Tab 3: Center Elevated Golden Button (Wallet) */}
        <div className="flex-1 flex flex-col items-center justify-center relative -top-3">
          <button
            id="nav-center-wallet-btn"
            onClick={() => onChangeTab('wallet')}
            className={`w-13 h-13 rounded-full bg-[#FFC400] hover:bg-[#FFB703] border-4 border-[#F4F6F9] shadow-md flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${
              activeTab === 'wallet' ? 'ring-2 ring-emerald-500 scale-105' : ''
            }`}
            title="Wallet Hub"
          >
            {/* Dark wallet and coin icon matching screenshots */}
            <div className="relative">
              <div className="w-6 h-5 rounded-md bg-slate-900 flex items-center justify-center text-amber-300 font-bold text-[10px]">
                $
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-300 border border-slate-900 flex items-center justify-center text-[7px] font-black text-slate-900">
                •
              </div>
            </div>
          </button>
        </div>

        {/* Tab 4: Statistics */}
        <button
          id="nav-statistics-btn"
          onClick={() => onChangeTab('statistics')}
          className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer transition-colors"
        >
          <Users className={`w-6 h-6 stroke-[2] ${
            activeTab === 'statistics' ? 'text-[#00C26E]' : 'text-slate-400'
          }`} />
          <span className={`text-[10px] font-bold mt-1 ${
            activeTab === 'statistics' ? 'text-[#00C26E]' : 'text-slate-400'
          }`}>
            Statistics
          </span>
        </button>

        {/* Tab 5: My */}
        <button
          id="nav-my-btn"
          onClick={() => onChangeTab('my')}
          className="flex-1 flex flex-col items-center justify-center py-1 cursor-pointer transition-colors"
        >
          <User className={`w-6 h-6 stroke-[2] ${
            activeTab === 'my' ? 'text-[#00C26E]' : 'text-slate-400'
          }`} />
          <span className={`text-[10px] font-bold mt-1 ${
            activeTab === 'my' ? 'text-[#00C26E]' : 'text-slate-400'
          }`}>
            My
          </span>
        </button>

      </div>
    </div>
  );
}
