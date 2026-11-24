import { useState } from 'react';
import { X, Send, Bot, Headphones, ShieldCheck, Check } from 'lucide-react';

interface CustomerServiceBotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export function CustomerServiceBot({
  isOpen,
  onClose,
  onOpenDeposit,
  onOpenWithdraw
}: CustomerServiceBotProps) {
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Hello! Welcome to 24/7 Customer Service. How can I assist you with your deposit, withdrawal, or USDT exchange today?',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');

  const quickQuestions = [
    'How to deposit via Paytm/UPI?',
    'What is USDT exchange rate?',
    'When will my withdrawal arrive?',
    'How to earn cashback?'
  ];

  const handleSend = (userText: string) => {
    if (!userText.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...messages, { sender: 'user' as const, text: userText, time }];
    setMessages(newMessages);
    setInput('');

    // Generate smart response
    setTimeout(() => {
      let reply = "Thank you for reaching out! Our finance team reviews all transactions automatically.";
      const lower = userText.toLowerCase();

      if (lower.includes('deposit') || lower.includes('paytm') || lower.includes('upi')) {
        reply = "You can deposit using Paytm, PhonePe, Mobikwik, Freecharge, or USDT. Deposits are credited instantly to your available balance.";
      } else if (lower.includes('usdt') || lower.includes('exchange') || lower.includes('rate')) {
        reply = "The current real-time exchange rate is fixed at 110 INR per 1 USDT. Both deposits and withdrawals are supported at this rate.";
      } else if (lower.includes('withdraw') || lower.includes('payout')) {
        reply = "Withdrawals are processed within 5-15 minutes directly to your bound UPI ID or Bank Account with 100% security.";
      } else if (lower.includes('cashback') || lower.includes('income')) {
        reply = "You earn a 4.5% cashback commission on accepted payment tasks. Go to the Payment tab to claim available codes!";
      }

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 700);
  };

  return (
    <>
      {/* Floating Mascot Head Trigger in bottom right */}
      {!isOpen && (
        <button
          id="customer-service-mascot-btn"
          onClick={onClose} // toggles open from parent
          className="fixed bottom-18 right-4 z-40 w-13 h-13 rounded-full bg-white border-2 border-[#00C853] shadow-lg flex items-center justify-center p-1 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          title="Customer Service"
        >
          {/* Green friendly robot mascot */}
          <div className="w-full h-full rounded-full bg-[#E8F8F0] flex items-center justify-center relative overflow-hidden">
            {/* Robot Head */}
            <div className="w-8 h-7 bg-[#00C853] rounded-lg relative flex flex-col items-center justify-center shadow-xs">
              {/* Antenna */}
              <div className="w-1 h-1.5 bg-[#FFD600] -top-1.5 absolute rounded-full" />
              {/* Eyes */}
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
              {/* Smile */}
              <div className="w-3 h-0.5 bg-white/90 rounded-full" />
              {/* Headset ear pads */}
              <div className="w-1 h-3 bg-slate-800 -left-1 absolute rounded-l" />
              <div className="w-1 h-3 bg-slate-800 -right-1 absolute rounded-r" />
            </div>
          </div>
          {/* Ping indicator */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00C853] rounded-full border-2 border-white animate-ping" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#00C853] rounded-full border-2 border-white" />
        </button>
      )}

      {/* Interactive Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div 
            className="w-full max-w-md h-[560px] max-h-[90vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#00A859] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Live Customer Support</h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-100">
                    <span className="w-2 h-2 rounded-full bg-[#FFD600] animate-pulse" />
                    <span>Online • Instant Reply</span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-white/10 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#F8FBF9]">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#00A859] text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-100 shadow-xs rounded-bl-xs'
                  }`}>
                    <p>{m.text}</p>
                    <span className={`text-[9px] block text-right mt-1 ${
                      m.sender === 'user' ? 'text-emerald-100' : 'text-slate-400'
                    }`}>
                      {m.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions */}
            <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="px-2.5 py-1 rounded-full bg-[#E8F8F0] text-[#00A859] hover:bg-[#D4F4E4] text-[10px] font-semibold whitespace-nowrap transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Type your message..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#00A859]"
              />
              <button
                onClick={() => handleSend(input)}
                className="w-8 h-8 rounded-full bg-[#00A859] text-white flex items-center justify-center hover:bg-[#00924B] cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
