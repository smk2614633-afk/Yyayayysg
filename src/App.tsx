/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useEarningHub } from './hooks/useEarningHub';
import { HomeScreen } from './components/HomeScreen';
import { PaymentScreen } from './components/PaymentScreen';
import { StatisticsScreen } from './components/StatisticsScreen';
import { WalletScreen } from './components/WalletScreen';
import { MyScreen } from './components/MyScreen';
import { AdminPanelScreen } from './components/AdminPanelScreen';
import { AdminAuthModal } from './components/AdminAuthModal';
import { BottomNav } from './components/BottomNav';
import { CustomerServiceBot } from './components/CustomerServiceBot';
import { 
  DepositModal, 
  WithdrawModal, 
  DetailModal, 
  UsdtModal, 
  TeamModal 
} from './components/ActionModals';
import { WatchPaysPaymentModal } from './components/WatchPaysPaymentModal';
import { MainTab } from './types';
import { CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';

export default function App() {
  const {
    user,
    transactions,
    offers,
    toastMessage,
    showToast,
    claimOffer,
    depositMoney,
    withdrawMoney,
    toggleSelling,
    resetDemo,
    updateTransactionStatus,
    updateUserBalanceDirectly
  } = useEarningHub();

  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('earninghub_admin_auth') === 'true';
  });
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isWatchPaysOpen, setIsWatchPaysOpen] = useState(false);
  const [watchPaysAmount, setWatchPaysAmount] = useState<number>(1000);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUsdtOpen, setIsUsdtOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  const handleLockAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('earninghub_admin_auth');
    setIsAdminOpen(false);
    showToast('Admin Session Locked. Only Owner can re-login.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 font-sans flex justify-center selection:bg-[#00C26E] selection:text-white">
      
      {/* Mobile Device Frame Container (max-w-md centered on desktop, full width on mobile) */}
      <div className="w-full max-w-md min-h-screen bg-[#F4F6F9] flex flex-col relative px-4 pt-3 pb-6 sm:shadow-2xl sm:border-x sm:border-slate-200">
        
        {/* Top Header Bar - Admin Switcher is ONLY shown when Owner is verified */}
        <div className="flex items-center justify-between py-1.5 px-1 mb-1 border-b border-slate-200/60">
          <div className="flex items-center gap-1.5 text-xs font-black text-slate-800">
            <span className="w-2 h-2 rounded-full bg-[#00A859] animate-pulse" />
            <span>EarningHub</span>
          </div>

          {isAdminAuthenticated ? (
            <button
              id="toggle-admin-panel-btn"
              onClick={() => setIsAdminOpen(!isAdminOpen)}
              className={`px-3 py-1 rounded-full text-[11px] font-black flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer ${
                isAdminOpen
                  ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAdminOpen ? 'Exit Admin' : 'Admin Panel (Owner)'}</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
              <span>VIP 1</span>
            </div>
          )}
        </div>

        {/* View Switcher: Admin Panel vs User App */}
        {isAdminOpen && isAdminAuthenticated ? (
          <main className="flex-1">
            <AdminPanelScreen
              user={user}
              transactions={transactions}
              onExitAdmin={() => setIsAdminOpen(false)}
              onLockAdmin={handleLockAdmin}
              onUpdateStatus={updateTransactionStatus}
              onAdjustBalance={updateUserBalanceDirectly}
              onResetDemo={resetDemo}
              onShowToast={showToast}
            />
          </main>
        ) : (
          <>
            {/* Main Tab Screen Switcher */}
            <main className="flex-1">
              {activeTab === 'home' && (
                <HomeScreen
                  user={user}
                  transactions={transactions}
                  onOpenDetail={() => setIsDetailOpen(true)}
                  onOpenDeposit={() => setIsDepositOpen(true)}
                  onOpenWithdraw={() => setIsWithdrawOpen(true)}
                  onOpenUsdt={() => setIsUsdtOpen(true)}
                  onOpenTask={() => setActiveTab('payment')}
                  onOpenTeam={() => setIsTeamOpen(true)}
                  onOpenOrder={() => setActiveTab('statistics')}
                  onShowToast={showToast}
                  onNavigateToTab={(t) => setActiveTab(t)}
                />
              )}

              {activeTab === 'payment' && (
                <PaymentScreen
                  user={user}
                  offers={offers}
                  onClaimOffer={claimOffer}
                  onShowToast={showToast}
                />
              )}

              {activeTab === 'statistics' && (
                <StatisticsScreen
                  user={user}
                  onToggleSelling={toggleSelling}
                />
              )}

              {activeTab === 'wallet' && (
                <WalletScreen
                  user={user}
                  transactions={transactions}
                  onOpenDeposit={() => setIsDepositOpen(true)}
                  onOpenWithdraw={() => setIsWithdrawOpen(true)}
                />
              )}

              {activeTab === 'my' && (
                <MyScreen
                  user={user}
                  onOpenTeam={() => setIsTeamOpen(true)}
                  onOpenDeposit={() => setIsDepositOpen(true)}
                  onOpenWithdraw={() => setIsWithdrawOpen(true)}
                  onOpenSupport={() => setIsSupportOpen(true)}
                  onResetDemo={resetDemo}
                  onShowToast={showToast}
                  isAdminAuthenticated={isAdminAuthenticated}
                  onOpenAdmin={() => {
                    if (isAdminAuthenticated) {
                      setIsAdminOpen(true);
                    } else {
                      setIsAdminAuthModalOpen(true);
                    }
                  }}
                  onOpenAdminAuth={() => setIsAdminAuthModalOpen(true)}
                />
              )}
            </main>

            {/* Floating Customer Service Mascot Bot */}
            <CustomerServiceBot
              isOpen={isSupportOpen}
              onClose={() => setIsSupportOpen(!isSupportOpen)}
              onOpenDeposit={() => { setIsSupportOpen(false); setIsDepositOpen(true); }}
              onOpenWithdraw={() => { setIsSupportOpen(false); setIsWithdrawOpen(true); }}
            />

            {/* Bottom 5-Tab Navigation Bar */}
            <BottomNav
              activeTab={activeTab}
              onChangeTab={(tab) => setActiveTab(tab)}
            />
          </>
        )}

        {/* Action Modals */}
        <DepositModal
          isOpen={isDepositOpen}
          onClose={() => setIsDepositOpen(false)}
          onDeposit={depositMoney}
          onOpenWatchPays={(amt) => {
            setWatchPaysAmount(amt);
            setIsWatchPaysOpen(true);
          }}
        />

        {/* WatchPays Payment Gateway Modal */}
        <WatchPaysPaymentModal
          isOpen={isWatchPaysOpen}
          amount={watchPaysAmount}
          userId={user.idNumber}
          userPhone={user.phone}
          onClose={() => setIsWatchPaysOpen(false)}
          onSuccess={(amt, orderNo) => {
            depositMoney(amt, `WatchPays (${orderNo.slice(-6)})`);
          }}
          onShowToast={showToast}
        />

        <WithdrawModal
          isOpen={isWithdrawOpen}
          onClose={() => setIsWithdrawOpen(false)}
          availableBalance={user.balance}
          onWithdraw={withdrawMoney}
        />

        <DetailModal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          user={user}
        />

        <UsdtModal
          isOpen={isUsdtOpen}
          onClose={() => setIsUsdtOpen(false)}
          rate={user.exchangeRate}
        />

        <TeamModal
          isOpen={isTeamOpen}
          onClose={() => setIsTeamOpen(false)}
          idNumber={user.idNumber}
          onShowToast={showToast}
        />

        {/* Secret Admin Authentication Modal */}
        <AdminAuthModal
          isOpen={isAdminAuthModalOpen}
          onClose={() => setIsAdminAuthModalOpen(false)}
          onSuccess={() => {
            setIsAdminAuthenticated(true);
            setIsAdminOpen(true);
          }}
          onShowToast={showToast}
        />

        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200 w-11/12 max-w-sm">
            <div className={`rounded-2xl p-3 px-4 shadow-xl border flex items-center gap-2.5 text-xs font-bold ${
              toastMessage.type === 'success'
                ? 'bg-[#00A859] text-white border-emerald-600 shadow-emerald-500/20'
                : toastMessage.type === 'error'
                ? 'bg-rose-600 text-white border-rose-700 shadow-rose-500/20'
                : 'bg-slate-900 text-white border-slate-800'
            }`}>
              {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
              {toastMessage.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
