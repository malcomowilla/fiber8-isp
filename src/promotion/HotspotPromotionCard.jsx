import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Clock, Flame, ArrowRight, Users } from 'lucide-react';

/**
 * Fetches currently-active promotions for this hotspot and renders a
 * sleek, dark-glass promo carousel matching the HotspotPage "attractive"
 * template. Drop <HotspotPromotionCard onSelectPromotion={...} /> above
 * the package list in HotspotPage.jsx.
 *
 * onSelectPromotion(promo) is called with the raw promo object when the
 * customer taps "Claim Offer" — wire it to your existing handlePkgClick /
 * setSelectedPkg flow, using promo.promotional_price as the amount charged.
 */

const formatCountdown = (seconds) => {
  if (seconds <= 0) return 'Ending now';
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
};

function PromoTimer({ endsIn }) {
  const [remaining, setRemaining] = useState(endsIn);

  useEffect(() => {
    setRemaining(endsIn);
    const id = setInterval(() => setRemaining((r) => Math.max(r - 1, 0)), 1000);
    return () => clearInterval(id);
  }, [endsIn]);

  return (
    <div className="flex items-center gap-1.5 mono text-xs font-semibold" style={{ color: '#fbbf24' }}>
      <Clock size={11} />
      {formatCountdown(remaining)}
    </div>
  );
}

function PromoCard({ promo, onSelect }) {
  const stockRatio =
    promo.max_redemptions && promo.remaining_stock != null
      ? Math.max(promo.remaining_stock / promo.max_redemptions, 0)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full text-left rounded-2xl overflow-hidden border shrink-0"
      style={{
        borderColor: 'rgba(251,191,36,.28)',
        background: 'linear-gradient(135deg, rgba(251,191,36,.09), rgba(15,23,42,.6))',
      }}
    >
      {/* animated sheen */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'linear-gradient(120deg, transparent 30%, rgba(251,191,36,.08) 50%, transparent 70%)',
          backgroundSize: '200% 100%',
          animation: 'promoShimmer 3s linear infinite',
        }}
      />

      <div className="relative p-4">
        {/* Badge + countdown row */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide"
            style={{ background: 'rgba(251,191,36,.18)', color: '#fbbf24' }}>
            <Flame size={10} />
            {promo.badge_text || `${promo.savings_percent}% OFF`}
          </div>
          {promo.show_countdown_timer && <PromoTimer endsIn={promo.seconds_remaining} />}
        </div>

        {/* Name + description */}
        <p className="text-sm font-bold text-slate-100 mb-0.5">{promo.name}</p>
        {promo.description && (
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#94a3b8' }}>
            {promo.description}
          </p>
        )}

        {/* Price row */}
        <div className="flex items-end justify-between mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold mono text-slate-100">
              Ksh {Number(promo.promotional_price).toFixed(2)}
            </span>
            <span className="text-xs mono line-through" style={{ color: '#64748b' }}>
              Ksh {Number(promo.original_price).toFixed(2)}
            </span>
          </div>
          <span className="text-[10px] font-semibold" style={{ color: '#64748b' }}>
            {promo.package_name}
          </span>
        </div>

        {/* Stock indicator */}
        {promo.show_stock_indicator && stockRatio != null && (
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="flex items-center gap-1 text-[10px]" style={{ color: '#64748b' }}>
                <Users size={9} /> {promo.remaining_stock} left
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,.15)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.round(stockRatio * 100)}%`,
                  background: stockRatio < 0.2 ? '#f87171' : '#fbbf24',
                }}
              />
            </div>
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => onSelect(promo)}
          className="w-full mt-3.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold text-black transition-transform active:scale-[.98]"
          style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)' }}
        >
          <Sparkles size={12} /> Claim Offer <ArrowRight size={12} />
        </button>
      </div>

      <style>{`
        @keyframes promoShimmer {
          0%   { background-position: -100% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </motion.div>
  );
}

export default function HotspotPromotionCard({ subdomain, onSelectPromotion }) {
  const [promotions, setPromotions] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const fetchPromotions = useCallback(async () => {
    try {
      const res = await fetch('/api/hotspot_active_promotions', {
        headers: { 'X-Subdomain': subdomain },
      });
      if (res.ok) {
        const data = await res.json();
        setPromotions(data);
      }
    } catch (_) {
      /* fail silently on the captive portal — promos are optional */
    } finally {
      setLoaded(true);
    }
  }, [subdomain]);

  useEffect(() => {
    fetchPromotions();
    const id = setInterval(fetchPromotions, 60000); // re-sync every minute
    return () => clearInterval(id);
  }, [fetchPromotions]);

  if (!loaded || promotions.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-2.5 px-1">
        <Flame size={12} style={{ color: '#fbbf24' }} />
        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: '#fbbf24' }}>
          Limited-time offers
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {promotions.map((promo) => (
            <PromoCard key={promo.id} promo={promo} onSelect={onSelectPromotion} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}