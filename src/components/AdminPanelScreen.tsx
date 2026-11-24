import { useState, useMemo, FormEvent } from 'react';
import { 
  ShieldCheck, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Check, 
  DollarSign, 
  Users, 
  Wallet, 
  FileSpreadsheet, 
  AlertCircle,
  Eye,
  Sliders,
  ChevronDown,
  Sparkles,
  ArrowLeft,
  Edit3,
  Lock,
  KeyRound,
  Zap
} from 'lucide-react';
import { AppUser, AppTransaction } from '../types';
import { WatchPaysAdminTab } from './WatchPaysAdminTab';

interface AdminPanelScreenProps {
  user: AppUser;
  transactions: AppTransaction[];
  onExitAdmin: () => void;
  onLockAdmin: () => void;
  onUpdateStatus: (txId: string, status: 'Completed' | 'Rejected' | 'Pending', remark?: string) => void;
  onAdjustBalance: (newBalance: number, remark?: string) => void;
  onResetDemo: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function AdminPanelScreen({
  user,
  transactions,
  onExitAdmin,
  onLockAdmin,
  onUpdateStatus,
  onAdjustBalance,
  onResetDemo,
  onShowToast
}: AdminPanelScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'deposit' | 'withdrawal' | 'balance' | 'gateway'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Pending' | 'Completed' | 'Rejected' | 'Close'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Change PIN modal state
  const [isChangePinOpen, setIsChangePinOpen] = useState(false);
  const [newPinInput, setNewPinInput] = useState('');

  // Balance adjustment state
  const [customBalance, setCustomBalance] = useState<string>(user.balance.toString());
  const [adjustmentRemark, setAdjustmentRemark] = useState<string>('Manual Admin Credit');
  
  // Selected tx for detail modal
  const [selectedTx, setSelectedTx] = useState<AppTransaction | null>(null);
  const [adminRemarkInput, setAdminRemarkInput] = useState('');

  // Calculations
  const stats = useMemo(() => {
    let depositSum = 0;
    let withdrawalSum = 0;
    let pendingCount = 0;
    let pendingDepositSum = 0;
    let pendingWithdrawalSum = 0;

    transactions.forEach(t => {
      if (t.status === 'Completed') {
        if (t.type === 'deposit') depositSum += t.amount;
        if (t.type === 'withdrawal') withdrawalSum += t.amount;
      }
      if (t.status === 'Pending') {
        pendingCount += 1;
        if (t.type === 'deposit') pendingDepositSum += t.amount;
        if (t.type === 'withdrawal') pendingWithdrawalSum += t.amount;
      }
    });

    return {
      depositSum,
      withdrawalSum,
      pendingCount,
      pendingDepositSum,
      pendingWithdrawalSum,
      totalCount: transactions.length
    };
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Tab filter
      if (activeTab === 'pending' && t.status !== 'Pending') return false;
      if (activeTab === 'deposit' && t.type !== 'deposit') return false;
      if (activeTab === 'withdrawal' && t.type !== 'withdrawal') return false;

      // Status dropdown filter
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = t.id.toLowerCase().includes(q);
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchPhone = t.userPhone?.toLowerCase().includes(q);
        const matchUserId = t.userId?.toLowerCase().includes(q);
        const matchUtr = t.utr?.toLowerCase().includes(q);
        const matchMethod = t.paymentMethod?.toLowerCase().includes(q);
        const matchAccount = t.accountDetails?.toLowerCase().includes(q);
        const matchAmount = t.amount.toString().includes(q);

        return matchId || matchTitle || matchPhone || matchUserId || matchUtr || matchMethod || matchAccount || matchAmount;
      }

      return true;
    });
  }, [transactions, activeTab, statusFilter, searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast(`Copied: ${text}`, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleApplyBalance = (e: FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customBalance);
    if (isNaN(val) || val < 0) {
      onShowToast('Please enter a valid balance amount', 'error');
      return;
    }
    onAdjustBalance(val, adjustmentRemark);
  };

  const handleExportCsv = () => {
    const headers = ['ID', 'Date', 'Type', 'Title', 'Amount', 'Status', 'Phone', 'UserId', 'PaymentMethod', 'Account', 'UTR'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.date,
      t.type,
      t.title,
      t.amount,
      t.status,
      t.userPhone || user.phone,
      t.userId || user.idNumber,
      t.paymentMethod || 'N/A',
      t.accountDetails || 'N/A',
      t.utr || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `earninghub_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Transactions exported as CSV!', 'success');
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      
      {/* Top Admin Navigation Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-5 shadow-xl border border-slate-800">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Admin Control Panel
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 uppercase tracking-wider">
                  Live
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Deposit & Withdrawal Management (एडमिन पैनल)
              </p>
            </div>
          </div>

          {/* Admin Header Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              id="exit-admin-btn"
              onClick={onExitAdmin}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all active:scale-95 cursor-pointer"
              title="Return to User Interface"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">User App</span>
            </button>

            <button
              id="lock-admin-btn"
              onClick={onLockAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              title="Lock Admin Session"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Admin (लॉग आउट)</span>
            </button>
          </div>
        </div>

        {/* Merchant UPI Gateway Bar & Security Settings */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="text-slate-400">Merchant Gateway:</span>
            <span className="font-mono font-bold text-emerald-400 bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">
              7667340425@fam
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsChangePinOpen(true)}
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer"
            >
              <KeyRound className="w-3 h-3" />
              <span>Change PIN</span>
            </button>

            <button
              onClick={onResetDemo}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Change PIN Modal */}
      {isChangePinOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2 text-slate-900 font-extrabold text-sm">
                <KeyRound className="w-4 h-4 text-emerald-600" />
                <span>Change Admin Secret PIN</span>
              </div>
              <button 
                onClick={() => setIsChangePinOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              अपना नया एडमिन पिन सेट करें। भविष्य में केवल यही पिन एडमिन पैनल खोलेगा।
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (newPinInput.trim().length >= 4) {
                  localStorage.setItem('earninghub_admin_pin', newPinInput.trim());
                  onShowToast('New Admin PIN set successfully!', 'success');
                  setIsChangePinOpen(false);
                  setNewPinInput('');
                } else {
                  onShowToast('PIN must be at least 4 digits', 'error');
                }
              }}
              className="space-y-3"
            >
              <input
                type="password"
                maxLength={8}
                value={newPinInput}
                onChange={(e) => setNewPinInput(e.target.value)}
                placeholder="Enter new 4-8 digit PIN"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center font-mono font-black text-base text-slate-900 focus:outline-none focus:border-[#00A859]"
                autoFocus
              />

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#00A859] hover:bg-[#00924B] text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  Save New PIN
                </button>
                <button
                  type="button"
                  onClick={() => setIsChangePinOpen(false)}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Deposits */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">Total Deposits</span>
            <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ArrowDownLeft className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 tracking-tight">
            ₹ {stats.depositSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
            Completed Deposits
          </span>
        </div>

        {/* Total Withdrawals */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">Total Withdrawals</span>
            <div className="w-6 h-6 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 tracking-tight">
            ₹ {stats.withdrawalSum.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-rose-600 font-bold block mt-0.5">
            Paid to Users
          </span>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-2xl p-3.5 border border-amber-200/80 shadow-xs bg-gradient-to-b from-amber-50/40 to-white">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold text-amber-900">Pending Review</span>
            <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-amber-600 tracking-tight">
            {stats.pendingCount} Action{stats.pendingCount === 1 ? '' : 's'}
          </div>
          <span className="text-[10px] text-amber-700 font-bold block mt-0.5">
            Needs Verification
          </span>
        </div>

        {/* User Current Balance */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[11px] font-bold">User Balance</span>
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-lg font-black text-slate-900 tracking-tight">
            ₹ {user.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <button
            onClick={() => setActiveTab('balance')}
            className="text-[10px] text-blue-600 hover:underline font-bold block mt-0.5 cursor-pointer"
          >
            Adjust Balance →
          </button>
        </div>
      </div>

      {/* Main Admin Tab Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Transactions ({transactions.length})
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-500 text-slate-950 shadow-xs'
              : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Approvals</span>
          {stats.pendingCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-black">
              {stats.pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('deposit')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
            activeTab === 'deposit'
              ? 'bg-[#00A859] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
          <span>Deposits</span>
        </button>

        <button
          onClick={() => setActiveTab('withdrawal')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
            activeTab === 'withdrawal'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ArrowUpRight className="w-3.5 h-3.5 text-rose-500" />
          <span>Withdrawals</span>
        </button>

        <button
          onClick={() => setActiveTab('balance')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
            activeTab === 'balance'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-500" />
          <span>User Balance Tool</span>
        </button>

        <button
          id="admin-watchpays-tab-btn"
          onClick={() => setActiveTab('gateway')}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'gateway'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-emerald-800 hover:bg-emerald-50 border border-emerald-300'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span>WatchPays Gateway (वॉचपेज)</span>
        </button>
      </div>

      {/* Balance Adjustment Panel View */}
      {activeTab === 'balance' && (
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-900">
                User Balance & Wallet Control
              </h3>
              <p className="text-[11px] text-slate-500">
                Manually adjust balance for user ID: {user.idNumber} (Phone: {user.phone})
              </p>
            </div>
          </div>

          <form onSubmit={handleApplyBalance} className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                New User Balance (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={customBalance}
                  onChange={(e) => setCustomBalance(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. 2500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Adjustment Reason / Admin Note
              </label>
              <input
                type="text"
                value={adjustmentRemark}
                onChange={(e) => setAdjustmentRemark(e.target.value)}
                placeholder="e.g. Verified Deposit, Promotional Bonus, Refund"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-98 cursor-pointer"
              >
                Apply Balance Adjustment
              </button>
              <button
                type="button"
                onClick={() => setCustomBalance(user.balance.toString())}
                className="px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* WatchPays Gateway Admin View */}
      {activeTab === 'gateway' && (
        <WatchPaysAdminTab onShowToast={onShowToast} />
      )}

      {/* Search & Export Toolbar */}
      {activeTab !== 'balance' && activeTab !== 'gateway' && (
        <div className="bg-white rounded-2xl p-3 border border-slate-100 shadow-xs space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search phone, ID, UTR, UPI, amount..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-slate-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-2.5 py-2 focus:outline-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending (लंबित)</option>
              <option value="Completed">Completed (सफल)</option>
              <option value="Rejected">Rejected (अस्वीकृत)</option>
              <option value="Close">Close</option>
            </select>

            <button
              onClick={handleExportCsv}
              title="Export CSV"
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
            <span>Showing {filteredTransactions.length} of {transactions.length} records</span>
            {searchQuery && <span>Filter applied</span>}
          </div>
        </div>
      )}

      {/* Transaction List Cards */}
      {activeTab !== 'balance' && (
        <div className="space-y-3">
          {filteredTransactions.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-100">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-bold text-slate-600">No transactions match your search criteria</p>
              <p className="text-[11px] mt-1 text-slate-400">Try changing your filters or search query</p>
            </div>
          ) : (
            filteredTransactions.map((tx) => {
              const isDeposit = tx.type === 'deposit';
              const isWithdrawal = tx.type === 'withdrawal';
              const isPending = tx.status === 'Pending';
              const isCompleted = tx.status === 'Completed';
              const isRejected = tx.status === 'Rejected' || tx.status === 'Close';

              return (
                <div
                  key={tx.id}
                  className={`bg-white rounded-2xl p-4 border transition-all shadow-xs ${
                    isPending
                      ? 'border-amber-300 bg-gradient-to-r from-amber-50/30 to-white'
                      : 'border-slate-100'
                  }`}
                >
                  {/* Top Row: Type, Status, and Amount */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isDeposit
                            ? 'bg-emerald-50 text-emerald-600'
                            : isWithdrawal
                            ? 'bg-rose-50 text-rose-600'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {isDeposit ? (
                          <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" />
                        ) : isWithdrawal ? (
                          <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                        ) : (
                          <DollarSign className="w-4 h-4 stroke-[2.5]" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-slate-900">
                            {tx.title}
                          </span>
                          {/* Type Pill */}
                          <span
                            className={`px-1.5 py-0.2 rounded-md text-[10px] font-black uppercase tracking-wider ${
                              isDeposit
                                ? 'bg-emerald-100/80 text-emerald-800'
                                : isWithdrawal
                                ? 'bg-rose-100/80 text-rose-800'
                                : 'bg-blue-100/80 text-blue-800'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {tx.date}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-base font-black tracking-tight ${
                          isDeposit
                            ? 'text-emerald-600'
                            : isWithdrawal
                            ? 'text-rose-600'
                            : 'text-slate-900'
                        }`}
                      >
                        {isDeposit ? '+' : isWithdrawal ? '-' : ''}₹ {tx.amount.toFixed(2)}
                      </div>

                      {/* Status Badge */}
                      <span
                        className={`inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-black ${
                          isPending
                            ? 'bg-amber-100 text-amber-800 border border-amber-300 animate-pulse'
                            : isCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </div>

                  {/* Middle Row: User Details & Channel */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">User Info:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {tx.userPhone || user.phone} (ID: {tx.userId || user.idNumber})
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Payment Method:</span>
                      <span className="font-semibold text-slate-800">
                        {tx.paymentMethod || (isDeposit ? 'UPI / Paytm' : 'Bank / Wallet')}
                      </span>
                    </div>

                    {tx.accountDetails && (
                      <div className="col-span-2 flex items-center justify-between bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/60">
                        <div className="overflow-hidden text-ellipsis">
                          <span className="text-[10px] text-slate-400 block">Target Account / UPI:</span>
                          <span className="font-mono font-bold text-slate-800 text-xs">
                            {tx.accountDetails}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(tx.accountDetails!, `acc-${tx.id}`)}
                          className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          {copiedId === `acc-${tx.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}

                    {tx.utr && (
                      <div className="col-span-2 flex items-center justify-between bg-emerald-50/50 px-2.5 py-1.5 rounded-lg border border-emerald-200/50">
                        <div>
                          <span className="text-[10px] text-emerald-800 block font-bold">UTR / Reference No:</span>
                          <span className="font-mono font-black text-emerald-900 text-xs">
                            {tx.utr}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopy(tx.utr!, `utr-${tx.id}`)}
                          className="p-1 text-emerald-700 hover:text-emerald-900 cursor-pointer"
                        >
                          {copiedId === `utr-${tx.id}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}

                    {tx.adminRemark && (
                      <div className="col-span-2 text-[11px] text-slate-600 bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                        <strong>Admin Note:</strong> {tx.adminRemark}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: Especially for Pending approvals */}
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-end gap-2 flex-wrap">
                    {isPending ? (
                      <>
                        <button
                          id={`approve-tx-${tx.id}`}
                          onClick={() => onUpdateStatus(tx.id, 'Completed')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#00A859] hover:bg-[#00924B] text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve (स्वीकृत)</span>
                        </button>

                        <button
                          id={`reject-tx-${tx.id}`}
                          onClick={() => onUpdateStatus(tx.id, 'Rejected', 'Rejected by Admin review')}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs transition-all active:scale-95 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject (अस्वीकार)</span>
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-1">
                        <select
                          value={tx.status}
                          onChange={(e) => onUpdateStatus(tx.id, e.target.value as any)}
                          className="text-[11px] font-bold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 cursor-pointer focus:outline-none"
                        >
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Close">Close</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}
