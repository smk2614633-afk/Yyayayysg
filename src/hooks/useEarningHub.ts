import { useState, useEffect } from 'react';
import { AppUser, PaymentOffer, AppTransaction } from '../types';
import { INITIAL_USER, INITIAL_TRANSACTIONS, INITIAL_OFFERS } from '../data/initialData';

const STORAGE_KEY = 'earninghub_app_data_v2';

export function useEarningHub() {
  const [user, setUser] = useState<AppUser>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USER;
  });

  const [transactions, setTransactions] = useState<AppTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_txs');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TRANSACTIONS;
  });

  const [offers, setOffers] = useState<PaymentOffer[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + '_offers');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_OFFERS;
  });

  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY + '_user', JSON.stringify(user));
      localStorage.setItem(STORAGE_KEY + '_txs', JSON.stringify(transactions));
      localStorage.setItem(STORAGE_KEY + '_offers', JSON.stringify(offers));
    } catch (e) {
      console.error(e);
    }
  }, [user, transactions, offers]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((current) => (current?.text === text ? null : current));
    }, 2800);
  };

  const claimOffer = (offerId: string) => {
    const target = offers.find(o => o.id === offerId);
    if (!target) return;

    if (target.claimed) {
      showToast('This offer has already been claimed!', 'info');
      return;
    }

    // Add income to balance and reward
    const earnedIncome = target.income;
    setUser(prev => ({
      ...prev,
      balance: Number((prev.balance + earnedIncome).toFixed(2)),
      reward: Number((prev.reward + earnedIncome).toFixed(2)),
      commission: Number((prev.commission + earnedIncome).toFixed(2)),
    }));

    // Update offer claimed state
    setOffers(prev => prev.map(o => o.id === offerId ? { ...o, claimed: true } : o));

    // Add transaction
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
    const newTx: AppTransaction = {
      id: `tx-${Date.now()}`,
      title: `Claim ${target.code}`,
      amount: earnedIncome,
      date: dateStr,
      status: 'Completed',
      type: 'commission'
    };
    setTransactions(prev => [newTx, ...prev]);

    showToast(`Claimed +₹${earnedIncome.toFixed(2)} for code ${target.code}!`, 'success');
  };

  const depositMoney = (amount: number, method: string) => {
    if (amount <= 0) return;

    setUser(prev => ({
      ...prev,
      balance: Number((prev.balance + amount).toFixed(2)),
      depositTotal: Number((prev.depositTotal + amount).toFixed(2)),
      depositMetric: Number((prev.depositMetric + amount).toFixed(2))
    }));

    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
    const newTx: AppTransaction = {
      id: `tx-${Date.now()}`,
      title: 'Deposit INR',
      amount: amount,
      date: dateStr,
      status: 'Completed',
      type: 'deposit',
      userPhone: user.phone,
      userId: user.idNumber,
      paymentMethod: method,
      accountDetails: method.includes('USDT') ? 'TRC20 Wallet' : '7667340425@fam',
      utr: `${Math.floor(100000000000 + Math.random() * 900000000000)}`
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast(`Deposit of ₹${amount.toFixed(2)} via ${method} completed!`, 'success');
  };

  const withdrawMoney = (amount: number, channel: string, account: string) => {
    if (amount <= 0) {
      showToast('Please enter a valid withdrawal amount', 'error');
      return false;
    }
    if (amount > user.balance) {
      showToast('Insufficient available balance for this withdrawal', 'error');
      return false;
    }

    setUser(prev => ({
      ...prev,
      balance: Number((prev.balance - amount).toFixed(2)),
      withdrawalTotal: Number((prev.withdrawalTotal + amount).toFixed(2))
    }));

    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
    const newTx: AppTransaction = {
      id: `tx-${Date.now()}`,
      title: 'Withdrawal INR',
      amount: amount,
      date: dateStr,
      status: 'Pending',
      type: 'withdrawal',
      userPhone: user.phone,
      userId: user.idNumber,
      paymentMethod: channel,
      accountDetails: account,
      utr: `WDR-${Math.floor(10000000 + Math.random() * 90000000)}`
    };
    setTransactions(prev => [newTx, ...prev]);
    showToast(`Withdrawal of ₹${amount.toFixed(2)} to ${account} submitted for Admin Review!`, 'success');
    return true;
  };

  const updateTransactionStatus = (
    txId: string, 
    newStatus: 'Completed' | 'Rejected' | 'Pending', 
    adminRemark?: string
  ) => {
    const targetTx = transactions.find(t => t.id === txId);
    if (!targetTx) return;

    // Handle user balance side effects
    if (targetTx.status === 'Pending') {
      if (targetTx.type === 'deposit' && newStatus === 'Completed') {
        // Admin approves a pending deposit -> credit user balance
        setUser(prev => ({
          ...prev,
          balance: Number((prev.balance + targetTx.amount).toFixed(2)),
          depositTotal: Number((prev.depositTotal + targetTx.amount).toFixed(2))
        }));
        showToast(`Deposit ₹${targetTx.amount} Approved! User balance credited.`, 'success');
      } else if (targetTx.type === 'withdrawal' && newStatus === 'Rejected') {
        // Admin rejects a pending withdrawal -> refund user balance
        setUser(prev => ({
          ...prev,
          balance: Number((prev.balance + targetTx.amount).toFixed(2)),
          withdrawalTotal: Math.max(0, Number((prev.withdrawalTotal - targetTx.amount).toFixed(2)))
        }));
        showToast(`Withdrawal ₹${targetTx.amount} Rejected! Balance refunded to user.`, 'info');
      } else if (targetTx.type === 'withdrawal' && newStatus === 'Completed') {
        showToast(`Withdrawal ₹${targetTx.amount} Approved & marked completed!`, 'success');
      }
    } else {
      showToast(`Transaction status updated to ${newStatus}`, 'info');
    }

    setTransactions(prev => prev.map(t => {
      if (t.id === txId) {
        return {
          ...t,
          status: newStatus,
          adminRemark: adminRemark !== undefined ? adminRemark : t.adminRemark
        };
      }
      return t;
    }));
  };

  const updateUserBalanceDirectly = (newBalance: number, remark?: string) => {
    if (isNaN(newBalance) || newBalance < 0) return;
    const diff = Number((newBalance - user.balance).toFixed(2));
    setUser(prev => ({
      ...prev,
      balance: Number(newBalance.toFixed(2))
    }));

    if (diff !== 0) {
      const now = new Date();
      const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
      const adjustmentTx: AppTransaction = {
        id: `tx-adj-${Date.now()}`,
        title: diff > 0 ? 'Admin Credit Adjustment' : 'Admin Debit Adjustment',
        amount: Math.abs(diff),
        date: dateStr,
        status: 'Completed',
        type: diff > 0 ? 'reward' : 'withdrawal',
        userPhone: user.phone,
        userId: user.idNumber,
        paymentMethod: 'Admin Override',
        adminRemark: remark || 'Direct manual balance adjustment by Admin'
      };
      setTransactions(prev => [adjustmentTx, ...prev]);
    }

    showToast(`User balance successfully adjusted to ₹${newBalance.toFixed(2)}`, 'success');
  };

  const toggleSelling = () => {
    setUser(prev => {
      const nextState = !prev.isSellingOpen;
      showToast(nextState ? 'Selling mode activated! Accepting orders...' : 'Selling mode closed.', 'info');
      return {
        ...prev,
        isSellingOpen: nextState,
        inProcessAmount: nextState ? 850.00 : 0.00,
        inProcessOrders: nextState ? 1 : 0,
        estimatedIncome: nextState ? 38.25 : 0.00
      };
    });
  };

  const resetDemo = () => {
    localStorage.removeItem(STORAGE_KEY + '_user');
    localStorage.removeItem(STORAGE_KEY + '_txs');
    localStorage.removeItem(STORAGE_KEY + '_offers');
    setUser(INITIAL_USER);
    setTransactions(INITIAL_TRANSACTIONS);
    setOffers(INITIAL_OFFERS);
    showToast('Reset to original screenshot values!', 'info');
  };

  return {
    user,
    setUser,
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
  };
}
