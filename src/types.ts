export interface AppUser {
  phone: string;
  idNumber: string;
  balance: number;
  depositTotal: number;
  withdrawalTotal: number;
  cashbackRate: number;
  reward: number;
  pending: number;
  sell: number;
  depositMetric: number;
  commission: number;
  exchangeRate: number; // 110 INR/USDT
  inProcessAmount: number;
  inProcessOrders: number;
  estimatedIncome: number;
  isSellingOpen: boolean;
  upiId?: string;
  bankAccount?: string;
}

export interface PaymentOffer {
  id: string;
  code: string;
  amount: number;
  income: number;
  category: 'Top Picks' | '100-499' | '500-1999' | '2000-4999';
  claimed: boolean;
}

export interface AppTransaction {
  id: string;
  title: string;
  amount: number;
  date: string;
  status: 'Completed' | 'Close' | 'Pending' | 'Rejected';
  type: 'deposit' | 'withdrawal' | 'reward' | 'commission';
  userPhone?: string;
  userId?: string;
  paymentMethod?: string;
  accountDetails?: string;
  utr?: string;
  adminRemark?: string;
}

export type MainTab = 'home' | 'payment' | 'wallet' | 'statistics' | 'my';
