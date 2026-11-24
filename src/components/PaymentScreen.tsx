import { useState } from 'react';
import { AlertTriangle, Check, Sparkles, QrCode } from 'lucide-react';
import { AppUser, PaymentOffer } from '../types';
import { UpiPaymentGatewayModal } from './UpiPaymentGatewayModal';

interface PaymentScreenProps {
  user: AppUser;
  offers: PaymentOffer[];
  onClaimOffer: (offerId: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export function PaymentScreen({ user, offers, onClaimOffer, onShowToast }: PaymentScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Top Picks');
  const [selectedOfferForUpi, setSelectedOfferForUpi] = useState<PaymentOffer | null>(null);

  const categories = ['Top Picks', '100-499', '500-1999', '2000-4999'];

  const filteredOffers = offers.filter((offer) => {
    if (selectedCategory === 'Top Picks') return true;
    return offer.category === selectedCategory;
  });

  return (
    <div className="space-y-4 pb-20">
      
      {/* Title */}
      <div className="text-center py-1">
        <h1 className="text-lg font-extrabold text-[#00B360] tracking-tight">
          Payment
        </h1>
      </div>

      {/* Main Cashback Green Gradient Card */}
      <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#00A859] via-[#00B95F] to-[#00C26E] text-white p-5 shadow-md shadow-emerald-500/15">
        
        {/* Abstract shapes matching Screenshot 2 */}
        <div className="absolute -top-10 -right-8 w-40 h-40 rounded-full bg-[#FFCA28] pointer-events-none opacity-95" />
        <div className="absolute top-6 -right-12 w-32 h-32 rounded-full bg-[#4285F4] pointer-events-none opacity-90" />
        
        {/* White Bar chart pillars graphic on the right */}
        <div className="absolute top-8 right-6 flex items-end gap-2 pointer-events-none opacity-90 z-10">
          <div className="w-3.5 h-12 bg-white/70 rounded-xs" />
          <div className="w-3.5 h-20 bg-white/90 rounded-xs" />
          <div className="w-3.5 h-16 bg-white/80 rounded-xs" />
          <div className="w-3.5 h-24 bg-white rounded-xs" />
        </div>

        <div className="relative z-10 space-y-3">
          <div>
            <span className="text-xs font-semibold text-emerald-100 block">Cashback</span>
            <div className="text-4xl font-black tracking-tight mt-0.5">
              {user.cashbackRate.toFixed(1)}%
            </div>
          </div>

          {/* 3 inner semi-transparent rounded boxes */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            
            {/* Left Box: Balance */}
            <div className="bg-white/15 backdrop-blur-xs border border-white/20 rounded-xl p-3 flex flex-col justify-between">
              <span className="text-[11px] text-emerald-100 font-medium">Balance</span>
              <div className="text-xl font-extrabold tracking-tight mt-1">
                ∫ {user.balance.toFixed(2)}
              </div>
            </div>

            {/* Right Stack: Reward & Pending */}
            <div className="space-y-2">
              <div className="bg-white/15 backdrop-blur-xs border border-white/20 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-[10px] text-emerald-100 font-medium">Reward</span>
                <div className="text-sm font-extrabold tracking-tight">
                  ∫ {user.reward.toFixed(1)}
                </div>
              </div>
              
              <div className="bg-white/15 backdrop-blur-xs border border-white/20 rounded-xl p-2.5 flex flex-col justify-between">
                <span className="text-[10px] text-emerald-100 font-medium">Pending</span>
                <div className="text-sm font-extrabold tracking-tight">
                  ∫ {user.pending}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Warning Alert Banner */}
      <div className="bg-[#EBFBF3] border border-[#B9F0D6] rounded-2xl p-3 text-xs text-[#009E52] font-semibold space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">⚠</span>
          <p className="leading-tight">
            Please use Freecharge, Mobikwik, FamPay, PhonePe or Paytm for payment!
          </p>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-[#B9F0D6]/60 text-[11px]">
          <span className="text-slate-600 font-medium">Official UPI Gateway:</span>
          <span className="font-mono font-bold text-[#00894B] bg-white px-2 py-0.5 rounded border border-[#B9F0D6]">
            7667340425@fam
          </span>
        </div>
      </div>

      {/* Filter Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`filter-${cat.replace(/\s+/g, '-').toLowerCase()}-btn`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#00894B] text-white shadow-xs'
                  : 'bg-[#F0F3F7] text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Payment Offers List */}
      <div className="space-y-3">
        {filteredOffers.map((offer) => (
          <div
            key={offer.id}
            className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs flex items-center justify-between transition-all"
          >
            {/* Left Content */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-[#00A859]">
                  INR
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#E8F8F0] text-[#00A859] text-xs font-bold">
                  Code <span className="font-mono">{offer.code}</span>
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="text-slate-600 font-medium">
                  Amount: <strong className="font-extrabold text-slate-900">∫ {offer.amount}</strong>
                </span>
                <span className="font-extrabold text-[#FF4D4D]">
                  Income: +{offer.income}
                </span>
              </div>
            </div>

            {/* Right Action Button */}
            <div>
              <button
                id={`claim-offer-${offer.code}-btn`}
                disabled={offer.claimed}
                onClick={() => {
                  if (offer.claimed) return;
                  setSelectedOfferForUpi(offer);
                }}
                className={`px-5 py-2 rounded-full font-bold text-xs shadow-xs transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                  offer.claimed
                    ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    : 'bg-[#00A859] hover:bg-[#00924B] text-white'
                }`}
              >
                {!offer.claimed && <QrCode className="w-3.5 h-3.5" />}
                <span>{offer.claimed ? 'Claimed' : 'Claim'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* UPI Payment Gateway Modal */}
      <UpiPaymentGatewayModal
        isOpen={Boolean(selectedOfferForUpi)}
        offer={selectedOfferForUpi}
        onClose={() => setSelectedOfferForUpi(null)}
        onConfirmClaim={(offerId) => {
          onClaimOffer(offerId);
          setSelectedOfferForUpi(null);
        }}
        onShowToast={onShowToast}
      />

    </div>
  );
}
