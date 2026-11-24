import { AppUser, PaymentOffer, AppTransaction } from '../types';

export const INITIAL_USER: AppUser = {
  phone: '255888888',
  idNumber: '269499',
  balance: 1361.92,
  depositTotal: 5680,
  withdrawalTotal: 4771,
  cashbackRate: 4.5,
  reward: 255.6,
  pending: 0,
  sell: 200.00,
  depositMetric: 1172.00,
  commission: 52.74,
  exchangeRate: 110,
  inProcessAmount: 0.00,
  inProcessOrders: 0,
  estimatedIncome: 0.00,
  isSellingOpen: false,
  upiId: '255888888@paytm',
  bankAccount: 'HDFC Bank - 50100492819'
};

export const INITIAL_TRANSACTIONS: AppTransaction[] = [
  {
    id: 'tx-pending-1',
    title: 'Deposit INR',
    amount: 1500.00,
    date: '2026-09-11 11:15:20',
    status: 'Pending',
    type: 'deposit',
    userPhone: '255888888',
    userId: '269499',
    paymentMethod: 'UPI (7667340425@fam)',
    accountDetails: '7667340425@fam',
    utr: '425983719201'
  },
  {
    id: 'tx-pending-2',
    title: 'Withdrawal INR',
    amount: 800.00,
    date: '2026-09-11 10:45:10',
    status: 'Pending',
    type: 'withdrawal',
    userPhone: '255888888',
    userId: '269499',
    paymentMethod: 'Paytm Wallet',
    accountDetails: '255888888@paytm',
    utr: 'WDR-99213840'
  },
  {
    id: 'tx-1',
    title: 'Deposit INR',
    amount: 1172.00,
    date: '2026-09-11 08:18:43',
    status: 'Completed',
    type: 'deposit',
    userPhone: '255888888',
    userId: '269499',
    paymentMethod: 'Paytm UPI',
    accountDetails: '255888888@paytm',
    utr: '425881029482'
  },
  {
    id: 'tx-2',
    title: 'Deposit INR',
    amount: 1495.00,
    date: '2026-09-11 08:17:11',
    status: 'Close',
    type: 'deposit',
    userPhone: '9876543210',
    userId: '189302',
    paymentMethod: 'PhonePe',
    accountDetails: '9876543210@ybl',
    adminRemark: 'Payment timed out by user'
  },
  {
    id: 'tx-3',
    title: 'Deposit INR',
    amount: 100.00,
    date: '2026-09-10 16:44:17',
    status: 'Completed',
    type: 'deposit',
    userPhone: '255888888',
    userId: '269499',
    paymentMethod: 'FamPay',
    accountDetails: '7667340425@fam',
    utr: '425719382049'
  },
  {
    id: 'tx-4',
    title: 'Deposit INR',
    amount: 100.00,
    date: '2026-09-09 21:51:03',
    status: 'Completed',
    type: 'deposit',
    userPhone: '255888888',
    userId: '269499',
    paymentMethod: 'UPI QR',
    accountDetails: '7667340425@fam',
    utr: '425619382011'
  },
  {
    id: 'tx-5',
    title: 'Deposit INR',
    amount: 788.00,
    date: '2026-09-09 21:49:15',
    status: 'Completed',
    type: 'deposit',
    userPhone: '255888888',
    userId: '269499',
    paymentMethod: 'Google Pay',
    accountDetails: '255888888@okhdfcbank',
    utr: '425510293847'
  },
  {
    id: 'tx-6',
    title: 'Withdrawal INR',
    amount: 2025.00,
    date: '2026-09-08 14:12:00',
    status: 'Completed',
    type: 'withdrawal',
    userPhone: '255888888',
    userId: '269499',
    paymentMethod: 'HDFC Bank',
    accountDetails: '50100492819 (HDFC0001234)',
    utr: 'WDR-88192039'
  },
  {
    id: 'tx-7',
    title: 'Reward INR',
    amount: 11.00,
    date: '2026-09-08 11:20:00',
    status: 'Completed',
    type: 'reward',
    userPhone: '255888888',
    userId: '269499',
    paymentMethod: 'System Bonus'
  }
];

export const INITIAL_OFFERS: PaymentOffer[] = [
  {
    id: 'off-1',
    code: 'eAzdis',
    amount: 800,
    income: 36.00,
    category: '500-1999',
    claimed: false
  },
  {
    id: 'off-2',
    code: 'cANrJ5',
    amount: 850,
    income: 38.25,
    category: '500-1999',
    claimed: false
  },
  {
    id: 'off-3',
    code: 'LoMjG1',
    amount: 1900,
    income: 85.50,
    category: '500-1999',
    claimed: false
  },
  {
    id: 'off-4',
    code: 'aK93vP',
    amount: 250,
    income: 11.25,
    category: '100-499',
    claimed: false
  },
  {
    id: 'off-5',
    code: 'xN82pL',
    amount: 450,
    income: 20.25,
    category: '100-499',
    claimed: false
  },
  {
    id: 'off-6',
    code: 'uR71sD',
    amount: 2800,
    income: 126.00,
    category: '2000-4999',
    claimed: false
  },
  {
    id: 'off-7',
    code: 'qM64tY',
    amount: 4500,
    income: 202.50,
    category: '2000-4999',
    claimed: false
  }
];
