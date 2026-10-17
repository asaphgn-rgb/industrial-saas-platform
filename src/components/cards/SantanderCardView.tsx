import React, { useState } from 'react';
import { DigitalCard } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import {
  Wifi,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ShieldCheck,
  CreditCard as CreditCardIcon,
  Sparkles,
  QrCode,
  Building2,
  Flame
} from 'lucide-react';

interface SantanderCardViewProps {
  card?: DigitalCard;
  isBlackCard?: boolean;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  cardBrand?: string;
  cardType?: string;
  onCardClick?: () => void;
  className?: string;
  theme?: 'light' | 'dark' | 'red-canvas';
}

export const SantanderCardView: React.FC<SantanderCardViewProps> = ({
  card,
  isBlackCard = true,
  cardNumber = '**** **** **** 1234',
  cardHolder = 'FABIANO ASAPH C SILVA',
  expiryDate = '11/30',
  cardBrand = 'SANTANDER UNIQUE MASTERCARD BL',
  cardType = 'Cartão crédito | Titular',
  onCardClick,
  className,
  theme = 'red-canvas',
}) => {
  const [showSensitive, setShowSensitive] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const displayMasked = card?.lastFourDigits
    ? `**** **** **** ${card.lastFourDigits}`
    : cardNumber;

  const isBenefitCard = cardBrand.includes('DYAMOND') || card?.type === 'benefit';

  return (
    <div className={cn("flex flex-col items-center select-none w-full", className)}>
      {/* Physical-Feel Santander Unique Card */}
      <div
        onClick={() => {
          setIsFlipped(!isFlipped);
          if (onCardClick) onCardClick();
        }}
        className={cn(
          "w-full max-w-[340px] sm:max-w-[360px] h-[205px] sm:h-[215px] rounded-2xl relative overflow-hidden transition-all duration-500 cursor-pointer shadow-2xl",
          "border border-white/20 hover:scale-[1.01] active:scale-[0.99]",
          isBenefitCard
            ? "bg-gradient-to-b from-[#161F33] via-[#0E1526] to-[#080D18] text-white border-amber-400/30"
            : isBlackCard
            ? "bg-gradient-to-b from-[#1E1E1E] via-[#141414] to-[#0A0A0A] text-white"
            : "bg-gradient-to-b from-[#CC0000] via-[#B30000] to-[#800000] text-white"
        )}
        style={{
          boxShadow: '0 18px 38px -12px rgba(0,0,0,0.65), 0 4px 12px rgba(0,0,0,0.25)',
        }}
      >
        {/* Subtle Brushed Metal / Carbon Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/60 pointer-events-none" />

        {/* Diagonal Sheen Overlay */}
        <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/[0.07] to-transparent rotate-45 pointer-events-none" />

        {!isFlipped ? (
          /* FRONT SIDE (Verbatim Santander Unique Mastercard Black & DYAMOND Co-brand) */
          <div className="h-full flex flex-col justify-between p-5 relative z-10">
            {/* Top Row: Santander Wordmark & Flame Icon + Mastercard/NFC */}
            <div className="flex items-center justify-between">
              {/* Santander Brand Mark */}
              <div className="flex items-center gap-2">
                {/* Santander Flame Icon */}
                <div className="w-7 h-7 rounded-full bg-[#EC0000] flex items-center justify-center shadow-md">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-white"
                  >
                    <path d="M12 2C10.5 4.5 9 6.5 9 9c0 1.8 1 3.2 2.5 3.8C10 13.5 9 15 9 17c0 2.8 2.2 5 5 5s5-2.2 5-5c0-3.5-3-6-3-9 0-.5.1-1 .2-1.5C14.5 8 13.5 5 12 2z" />
                    <path d="M9 13.5C7.8 14.2 7 15.5 7 17c0 2.2 1.8 4 4 4 .7 0 1.4-.2 2-.5-1.5-.8-2.5-2.3-2.5-4 0-1.2.5-2.3 1.5-3-.3 0-.7 0-1 0z" opacity="0.8" />
                  </svg>
                </div>
                <div>
                  <span className="text-sm font-bold tracking-tight font-sans text-white/95 block leading-none">
                    Santander
                  </span>
                  <span className="text-[8px] font-extrabold uppercase tracking-wider text-[#EC0000] block mt-0.5">
                    DYAMOND
                  </span>
                </div>
              </div>

              {/* Contactless Icon & Black Label */}
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-white/70 rotate-90" />
                <span className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded bg-white/10 text-white/90 border border-white/10">
                  {isBenefitCard ? 'CLUB MAIS' : 'BLACK'}
                </span>
              </div>
            </div>

            {/* Middle Row: EMV Metallic Chip */}
            <div className="flex items-center justify-between my-auto">
              <div className="w-10 h-8 rounded-md bg-gradient-to-br from-[#E2B755] via-[#D4AF37] to-[#996515] p-0.5 shadow-md border border-[#F3E5AB]/40 flex items-center justify-center">
                <div className="w-full h-full border border-black/30 rounded-sm grid grid-cols-2 gap-0.5 opacity-70">
                  <div className="border-r border-b border-black/40" />
                  <div className="border-b border-black/40" />
                  <div className="border-r border-black/40" />
                  <div />
                </div>
              </div>

              {/* DYAMOND Partner co-branding insignia */}
              <div className="text-right">
                <span className="text-[9px] uppercase tracking-widest text-slate-300 font-mono font-bold block">
                  DYAMOND PARTNER
                </span>
                <span className="text-[10px] font-bold text-white/90">
                  {isBenefitCard ? 'Clube de Benefícios' : 'Banco Santander (Brasil) S.A.'}
                </span>
              </div>
            </div>

            {/* Bottom Row: Titular Name & Mastercard Overlapping Circles */}
            <div className="flex items-end justify-between pt-1">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-slate-400 font-sans">
                  {cardType}
                </p>
                <p className="text-xs font-black tracking-wider text-white font-mono truncate max-w-[220px]">
                  {cardHolder}
                </p>
              </div>

              {/* Mastercard Brand Marks (Two intersecting circles) */}
              <div className="flex items-center -space-x-2.5 opacity-95">
                <div className="w-6 h-6 rounded-full bg-[#EB001B]" />
                <div className="w-6 h-6 rounded-full bg-[#F79E1B]/90" />
              </div>
            </div>
          </div>
        ) : (
          /* BACK SIDE OF CARD */
          <div className="h-full flex flex-col justify-between py-4 px-5 relative z-10 bg-[#0F0F0F]">
            {/* Magnetic Stripe */}
            <div className="w-[calc(100%+2.5rem)] -mx-5 h-9 bg-black border-y border-white/10" />

            {/* Signature & Tokenized CVV Strip */}
            <div className="space-y-1 my-auto">
              <div className="flex justify-between text-[9px] text-slate-400">
                <span>Assinatura do Titular • DYAMOND White Label</span>
                <span className="font-mono">CVV / CVC</span>
              </div>
              <div className="flex h-7">
                <div className="flex-1 bg-white/20 rounded-l flex items-center px-3 text-[10px] font-mono italic text-slate-300">
                  {cardHolder}
                </div>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSensitive(!showSensitive);
                  }}
                  className="w-12 bg-white text-black font-mono font-bold text-xs flex items-center justify-center rounded-r shadow-inner cursor-pointer hover:bg-slate-100"
                  title="Clique para revelar/ocultar CVV dinâmico"
                >
                  {showSensitive ? '729' : '•••'}
                </div>
              </div>
            </div>

            {/* Regulatory Footer */}
            <div className="text-[8px] text-slate-400 leading-tight border-t border-white/10 pt-2 flex justify-between items-center">
              <span>Ouvidoria Santander: 0800 762 7777</span>
              <span>SAC DYAMOND: 0800 726 0322</span>
            </div>
          </div>
        )}
      </div>

      {/* Card Detail Below */}
      <div className="text-center mt-3 space-y-0.5">
        <p className={cn(
          "text-[11px] font-medium tracking-tight",
          theme === 'red-canvas' ? "text-white/80" : "text-slate-500"
        )}>
          {cardType}
        </p>
        <h3 className={cn(
          "text-xs sm:text-sm font-black tracking-wider",
          theme === 'red-canvas' ? "text-white" : "text-slate-900"
        )}>
          {cardBrand}
        </h3>
        <p className={cn(
          "text-xs sm:text-sm font-mono font-bold tracking-widest",
          theme === 'red-canvas' ? "text-white/90" : "text-slate-700"
        )}>
          {displayMasked}
        </p>
      </div>
    </div>
  );
};
