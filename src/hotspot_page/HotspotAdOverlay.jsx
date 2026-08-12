import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Play, Pause, SkipForward, ExternalLink,
  Wifi, Clock, Maximize2, Minimize2, Gift
} from 'lucide-react';
import HotspotCustomAd from '../hotspot_marketing/HotspotCustomAd';

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components are defined OUTSIDE HotspotAdOverlay.
// Defining them inside causes React to treat them as new component types on
// every render → unmount + remount → the flicker/ping you were seeing.
// ─────────────────────────────────────────────────────────────────────────────

function RewardBanner({ compact, isVideo, secondsLeft, rewardLabel }) {
  return (
    <div
      className={`flex items-center gap-2.5 ${compact ? 'px-3 py-2' : 'px-4 py-3'}`}
      style={{
        background: 'linear-gradient(90deg, rgba(16,185,129,.15), rgba(99,102,241,.12))',
        borderBottom: '1px solid rgba(16,185,129,.2)',
      }}
    >
      {isVideo && (
        <>
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(16,185,129,.2)' }}
          >
            <Gift size={13} className="text-emerald-400" />
          </div>

          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-emerald-300 truncate ${compact ? 'text-xs' : 'text-sm'}`}>
              Watch this ad to unlock free internet!
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Wifi size={10} className="text-emerald-500 shrink-0" />
              <p className={`text-emerald-500 truncate ${compact ? 'text-[10px]' : 'text-xs'}`}>
                Reward: <strong className="text-emerald-300">{rewardLabel}</strong>
              </p>
            </div>
          </div>

          <div
            className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-full"
            style={{ background: 'rgba(0,0,0,.4)' }}
          >
            <Clock size={10} className="text-amber-400" />
            <span className="text-xs font-bold text-amber-400 tabular-nums">{secondsLeft}s</span>
          </div>
        </>
      )}
    </div>
  );
}

function MediaSection({
  compact, isVideo, isImage, videoRef, mediaUrl, adTitle, adLink,
  videoPlaying, onToggleVideo, onExpand, onAdClick,
}) {
  return (
    <div className="relative group">
      {isImage && (
        <img
          src={mediaUrl}
          alt={adTitle || 'Advertisement'}
          className={`w-full object-cover ${compact ? 'max-h-32' : 'max-h-56'}`}
          style={{ cursor: adLink ? 'pointer' : 'default' }}
        />
      )}

      {isVideo && (
        <>
          <video
            ref={videoRef}
            src={mediaUrl}
            autoPlay
            playsInline
            className={`w-full object-cover ${compact ? 'max-h-32' : 'max-h-56'}`}
          />
          <button
            onClick={() => { onAdClick?.({ trackOnly: true }); onToggleVideo(); }}
            className="absolute inset-0 flex items-center justify-center bg-transparent"
          >
            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {videoPlaying
                ? <Pause size={18} className="text-white" />
                : <Play size={18} className="text-white ml-0.5" />}
            </div>
          </button>
          <button
            onClick={onExpand}
            className="absolute top-2 right-2 flex items-center gap-1 text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ background: 'rgba(0,0,0,.65)' }}
          >
            <Maximize2 size={11} className="text-white" />
            <span className="text-white">Expand</span>
          </button>
        </>
      )}
    </div>
  );
}

function FooterBar({
  compact, isVideo, isImage, adTitle, adLink,
  canSkip, skipReady, skipAfter, totalDuration, secondsLeft,
  onExpand, onComplete, onAdClick,
}) {
  const skipCountdown = Math.max(0, skipAfter - (totalDuration - secondsLeft));

  return (
    <div className={`flex items-center justify-between gap-2 ${compact ? 'px-2.5 py-2' : 'px-4 py-3'}`}>
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <span
          className="shrink-0 font-bold px-2 py-0.5 rounded text-xs"
          style={{ background: 'rgba(56,189,248,.15)', color: '#38bdf8' }}
        >Ad</span>
        {adTitle && <p className="text-xs font-medium text-slate-300 truncate">{adTitle}</p>}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {(isVideo || isImage) && (
          <button
            onClick={onExpand}
            className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(148,163,184,.1)', color: '#94a3b8' }}
          >
            <Maximize2 size={10} />
          </button>
        )}

        {isImage && adLink && (
          <button
            onClick={onAdClick}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{ background: 'rgba(56,189,248,.15)', color: '#38bdf8' }}
          >
            <ExternalLink size={10} /> Visit
          </button>
        )}

        {isVideo && adLink && (
          <button
            onClick={onAdClick}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{ background: 'rgba(56,189,248,.15)', color: '#38bdf8' }}
          >
            <ExternalLink size={10} /> Visit
          </button>
        )}

        {isVideo && canSkip && skipReady && (
          <button
            onClick={() => onComplete('skipped')}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{ background: 'rgba(52,211,153,.15)', color: '#34d399' }}
          >
            <SkipForward size={10} /> Skip
          </button>
        )}

        {isVideo && canSkip && !skipReady && (
          <span
            className="text-xs px-2.5 py-1 rounded-lg tabular-nums"
            style={{ background: 'rgba(148,163,184,.08)', color: '#64748b' }}
          >
            Skip in {skipCountdown}s
          </span>
        )}

        {isImage && (
          <button
            onClick={() => onComplete('dismissed')}
            className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:opacity-80"
            style={{ background: 'rgba(148,163,184,.15)' }}
          >
            <X size={12} className="text-slate-400" />
          </button>
        )}
      </div>
    </div>
  );
}

function AdCard({
  compact, isVideo, isImage, isCustomDesign, mediaUrl, adTitle, adLink,
  canSkip, skipReady, skipAfter, totalDuration, secondsLeft,
  videoRef, videoPlaying, progressPct, rewardLabel,
  onToggleVideo, onExpand, onComplete, adSettings, onAdClick, subdomain,
}) {
  return (
    <div
      className={`relative overflow-hidden shadow-2xl ${compact ? 'rounded-xl' : 'rounded-2xl'}`}
      style={{ background: 'rgba(10,16,30,.96)', border: '1px solid rgba(148,163,184,.12)' }}
    >
      <RewardBanner compact={compact} isVideo={isVideo} secondsLeft={secondsLeft} rewardLabel={rewardLabel} />

      {!isCustomDesign && (
        <MediaSection
          compact={compact} isVideo={isVideo} isImage={isImage}
          mediaUrl={mediaUrl} adTitle={adTitle} adLink={adLink}
          videoRef={videoRef} videoPlaying={videoPlaying}
          onToggleVideo={onToggleVideo} onExpand={onExpand}
          onAdClick={onAdClick}
        />
      )}

      {!isCustomDesign && (
        <FooterBar
          compact={compact} isVideo={isVideo} isImage={isImage}
          adTitle={adTitle} adLink={adLink}
          canSkip={canSkip} skipReady={skipReady} skipAfter={skipAfter}
          totalDuration={totalDuration} secondsLeft={secondsLeft}
          onExpand={onExpand} onComplete={onComplete}
          onAdClick={onAdClick}
        />
      )}

      {isVideo && (
        <div className="h-0.5" style={{ background: 'rgba(148,163,184,.1)' }}>
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#34d399,#6366f1)' }}
          />
        </div>
      )}

      {isCustomDesign && (
        <HotspotCustomAd
          adSettings={adSettings}
          onComplete={onComplete}
          subdomain={subdomain}
          onAdClick={onAdClick}
        />
      )}
    </div>
  );
}

function ExpandedModal({
  isVideo, isImage, mediaUrl, adTitle, adLink,
  canSkip, skipReady, secondsLeft, progressPct, rewardLabel,
  expandedRef, onComplete, onCollapse, onAdClick,
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,.93)', backdropFilter: 'blur(16px)' }}
      onClick={onCollapse}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 24 }}
        className="relative w-full max-w-3xl mx-4"
        onClick={e => e.stopPropagation()}
      >
        <p className="absolute -top-8 right-0 text-xs text-white">
          Press ESC or click outside to close
        </p>

        <div
          className="rounded-2xl overflow-hidden shadow-2xl"
          style={{ background: 'rgba(10,16,30,.98)', border: '1px solid rgba(148,163,184,.15)' }}
        >
          <RewardBanner compact={false} isVideo={isVideo} secondsLeft={secondsLeft} rewardLabel={rewardLabel} />

          <div className="relative">
            {isImage && (
              <img src={mediaUrl} alt={adTitle || 'Ad'} className="w-full max-h-[65vh] object-contain" />
            )}
            {isVideo && (
              <video
                ref={expandedRef}
                src={mediaUrl}
                autoPlay
                controls
                playsInline
                className="w-full max-h-[65vh] object-contain"
                onEnded={() => onComplete('completed')}
              />
            )}
          </div>

          <div className="px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <span
                className="shrink-0 text-xs font-bold px-2 py-0.5 rounded"
                style={{ background: 'rgba(56,189,248,.15)', color: '#38bdf8' }}
              >Ad</span>
              {adTitle && <p className="text-sm font-medium text-white truncate">{adTitle}</p>}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isVideo && canSkip && skipReady && (
                <button
                  onClick={() => onComplete('skipped')}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold hover:opacity-80"
                  style={{ background: 'rgba(52,211,153,.18)', color: '#34d399' }}
                >
                  <SkipForward size={13} /> Skip Ad
                </button>
              )}
              {isVideo && !skipReady && (
                <span
                  className="text-xs px-3 py-1.5 rounded-lg tabular-nums"
                  style={{ background: 'rgba(148,163,184,.08)', color: '#64748b' }}
                >
                  <Clock size={10} className="inline mr-1" />{secondsLeft}s remaining
                </span>
              )}
              {isImage && adLink && (
                <button
                  onClick={onAdClick}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold"
                  style={{ background: 'rgba(56,189,248,.15)', color: '#38bdf8' }}
                >
                  <ExternalLink size={13} /> Visit
                </button>
              )}
              {isVideo && adLink && (
                <button
                  onClick={onAdClick}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold"
                  style={{ background: 'rgba(56,189,248,.15)', color: '#38bdf8' }}
                >
                  <ExternalLink size={13} /> Visit
                </button>
              )}
              {isImage && (
                <button
                  onClick={() => onComplete('dismissed')}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold"
                  style={{ background: 'rgba(148,163,184,.12)', color: '#94a3b8' }}
                >
                  <X size={13} /> Close Ad
                </button>
              )}
              <button
                onClick={onCollapse}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg hover:opacity-80"
                style={{ background: 'rgba(148,163,184,.1)', color: '#64748b' }}
              >
                <Minimize2 size={12} />
              </button>
            </div>
          </div>

          {isVideo && (
            <div className="h-1" style={{ background: 'rgba(148,163,184,.1)' }}>
              <div
                className="h-full transition-all duration-1000 ease-linear"
                style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#34d399,#6366f1)' }}
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

const POSITION_STYLES = {
  'top-banner':    { className: 'fixed top-0 inset-x-0 z-[9999]', initial: { y: -80, opacity: 0 }, compact: true },
  'bottom-banner': { className: 'fixed bottom-0 inset-x-0 z-[9999]', initial: { y: 80, opacity: 0 }, compact: true },
  'bottom-right':  { className: 'fixed bottom-4 right-4 z-[9999] w-80', initial: { x: 120, opacity: 0 }, compact: true },
  'bottom-left':   { className: 'fixed bottom-4 left-4 z-[9999] w-80', initial: { x: -120, opacity: 0 }, compact: true },
  'top-left':      { className: 'fixed top-4 left-4 z-[9999] w-80', initial: { x: -120, opacity: 0 }, compact: true },
  'top-right':     { className: 'fixed top-4 right-4 z-[9999] w-80', initial: { x: 120, opacity: 0 }, compact: true },
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
export default function HotspotAdOverlay({ subdomain, onAdComplete }) {
  const [ads, setAds]         = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [expandedAdId, setExpandedAdId] = useState(null);

  const expandedRef  = useRef(null);
  const videoRefs    = useRef({});   // { [adId]: videoElement }
  const timerRefs    = useRef({});   // { [adId]: intervalId }
  const skipTimerRefs = useRef({});  // { [adId]: timeoutId }

  const getVideoRef = (adId) => {
    if (!videoRefs.current[adId]) {
      videoRefs.current[adId] = { current: null };
    }
    return videoRefs.current[adId];
  };

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchAd = useCallback(async () => {
    try {
      const res = await fetch('/api/allow_get_ads', { headers: { 'X-Subdomain': subdomain } });
      if (!res.ok) { setLoading(false); return; }
      const raw = await res.json();
      const list = Array.isArray(raw) ? raw : [raw];

      const eligible = list.filter(
        ad => ad.ad_enabled && (ad.ad_link || ad.media_url || ad.media_type === 'custom_design')
      );

      if (!eligible.length) { setLoading(false); return; }

      // Group ads by position so multiple ads in different corners can show
      // at once. If several ads share the same position, rotate which one
      // wins this page load, so every ad in that slot eventually gets shown
      // and tracked — instead of always picking just the first one.
      const byPosition = {};
      eligible.forEach(ad => {
        const pos = ad.position || 'bottom-right';
        (byPosition[pos] = byPosition[pos] || []).push(ad);
      });

      const chosen = Object.values(byPosition).map(group => {
        if (group.length === 1) return group[0];
        const key = `ad_rotation_${group[0].position || 'bottom-right'}`;
        const last = parseInt(localStorage.getItem(key) || '0', 10);
        const next = (last + 1) % group.length;
        localStorage.setItem(key, String(next));
        return group[next];
      });

      const withState = chosen.map(ad => ({
        ...ad,
        secondsLeft: ad.media_type === 'video' ? (ad.ad_duration || 15) : 0,
        skipReady: false,
        videoPlaying: true,
        completed: false,
        viewTracked: false,
      }));

      setAds(withState);
      setLoading(false);
      setVisible(true);
    } catch {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => { fetchAd(); }, [fetchAd]);

  // ── Tracking ──────────────────────────────────────────────────────────────
  const trackEvent = useCallback((adId, eventType) => {
    if (!adId) return;
    fetch('/api/track_ad_event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      body: JSON.stringify({ event_type: eventType, ad_id: adId }),
    }).catch(() => {});
  }, [subdomain]);

  const handleAdClick = useCallback((ad, opts = {}) => {
    trackEvent(ad.id, 'click');
    if (!opts.trackOnly && ad.ad_link) window.open(ad.ad_link, '_blank');
  }, [trackEvent]);

  // Fire one "view" event per ad, the moment each becomes visible
  useEffect(() => {
    if (!visible || !ads.length) return;
    setAds(prev => {
      let changed = false;
      const next = prev.map(ad => {
        if (!ad.viewTracked) {
          trackEvent(ad.id, 'Ad View');
          changed = true;
          return { ...ad, viewTracked: true };
        }
        return ad;
      });
      return changed ? next : prev;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, ads.length]);

  const handleComplete = useCallback((adId, reason = 'completed') => {
    clearInterval(timerRefs.current[adId]);
    clearTimeout(skipTimerRefs.current[adId]);

    setAds(prev => {
      const ad = prev.find(a => a.id === adId);
      if (!ad || ad.completed) return prev;

      const isVideoAd = ad.media_type === 'video';
      if (isVideoAd) {
        trackEvent(adId, reason === 'skipped' ? 'video_skipped' : 'video_completed');
      } else if (ad.media_type === 'image') {
        trackEvent(adId, 'dismissed');
      }

      // Reward granting is a video-only, watch-to-unlock mechanic.
      // Image/design ads are click-to-visit and never grant a reward on close,
      // regardless of what reward_type is set on them.
      if (isVideoAd) {
        onAdComplete?.({
          reward_type: ad.reward_type,
          selected_package: ad.selected_package,
          free_minutes: ad.free_minutes,
        });
      }

      return prev.map(a => a.id === adId ? { ...a, completed: true } : a);
    });

    setExpanded(false);
  }, [onAdComplete, trackEvent]);

  // ── Countdown timers — one per video ad ───────────────────────────────────
  useEffect(() => {
    ads.forEach(ad => {
      if (ad.media_type !== 'video' || ad.completed || timerRefs.current[ad.id]) return;

      const skipAfter = ad.skip_after || 5;
      if (ad.can_skip) {
        skipTimerRefs.current[ad.id] = setTimeout(() => {
          setAds(prev => prev.map(a => a.id === ad.id ? { ...a, skipReady: true } : a));
        }, skipAfter * 1000);
      }

      timerRefs.current[ad.id] = setInterval(() => {
        setAds(prev => prev.map(a => {
          if (a.id !== ad.id) return a;
          if (a.secondsLeft <= 1) {
            clearInterval(timerRefs.current[ad.id]);
            setTimeout(() => handleComplete(ad.id, 'completed'), 0);
            return { ...a, secondsLeft: 0 };
          }
          return { ...a, secondsLeft: a.secondsLeft - 1 };
        }));
      }, 1000);
    });

    return () => {
      Object.values(timerRefs.current).forEach(id => clearInterval(id));
      Object.values(skipTimerRefs.current).forEach(id => clearTimeout(id));
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ads.length]);

  // ── Pause inline video while expanded modal is open ───────────────────────
  useEffect(() => {
    ads.forEach(ad => {
      const ref = videoRefs.current[ad.id];
      if (!ref?.current) return;
      if (expanded && expandedAdId === ad.id) {
        ref.current.pause();
      } else if (ad.videoPlaying) {
        ref.current.play().catch(() => {});
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, expandedAdId, ads]);

  // ── Sync expanded video position when modal opens ─────────────────────────
  useEffect(() => {
    if (!expanded || !expandedAdId) return;
    const t = setTimeout(() => {
      const ref = videoRefs.current[expandedAdId];
      const ad = ads.find(a => a.id === expandedAdId);
      if (expandedRef.current && ref?.current) {
        expandedRef.current.currentTime = ref.current.currentTime;
        if (ad?.videoPlaying) expandedRef.current.play().catch(() => {});
      }
    }, 80);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded, expandedAdId]);

  // ── ESC closes expanded ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleVideo = useCallback((adId) => {
    const ref = videoRefs.current[adId];
    setAds(prev => prev.map(a => {
      if (a.id !== adId) return a;
      if (ref?.current) {
        if (a.videoPlaying) ref.current.pause(); else ref.current.play().catch(() => {});
      }
      return { ...a, videoPlaying: !a.videoPlaying };
    }));
  }, []);

  const handleExpand = useCallback((adId) => {
    setExpandedAdId(adId);
    setExpanded(true);
  }, []);

  const handleCollapse = useCallback(() => setExpanded(false), []);

  if (loading || !ads.length) return null;

  const visibleAds = ads.filter(ad => !ad.completed);
  const expandedAd = ads.find(a => a.id === expandedAdId);

  const buildCardProps = (ad) => {
    const isVideo        = ad.media_type === 'video';
    const isImage         = ad.media_type === 'image';
    const isCustomDesign = ad.media_type === 'custom_design';
    const totalDuration  = ad.ad_duration || 15;
    const progressPct    = isVideo ? ((totalDuration - ad.secondsLeft) / totalDuration) * 100 : 100;

    const rewardLabel = (() => {
      if (ad.reward_type === 'specific')    return ad.package_name || 'Internet Package';
      if (ad.reward_type === 'free_browse') return ad.free_minutes >= 60 ? `${ad.free_minutes / 60}hr Free Internet` : `${ad.free_minutes}min Free Internet`;
      if (ad.reward_type === 'choice')      return 'Choose Your Package';
      return 'Free Internet Access';
    })();

    return {
      isVideo, isImage, isCustomDesign,
      mediaUrl: ad.media_url, adTitle: ad.ad_title, adLink: ad.ad_link,
      adSettings: ad,
      canSkip: ad.can_skip, skipReady: ad.skipReady, skipAfter: ad.skip_after || 5,
      totalDuration, secondsLeft: ad.secondsLeft, progressPct, rewardLabel,
      onComplete: (reason) => handleComplete(ad.id, reason),
      onAdClick: (opts) => handleAdClick(ad, opts),
      subdomain,
    };
  };

  return (
    <>
      <AnimatePresence>
        {visible && !expanded && visibleAds.map(ad => {
          const cardProps = buildCardProps(ad);

          if (ad.position === 'center-modal') {
            return (
              <motion.div key={ad.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                style={{ background: 'rgba(2,6,23,.8)', backdropFilter: 'blur(12px)' }}
              >
                <div
                  className="absolute inset-0"
                  onClick={cardProps.isImage ? () => handleComplete(ad.id, 'dismissed') : undefined}
                />
                <div className="relative w-full max-w-sm z-10">
                  <AdCard
                    {...cardProps}
                    videoRef={getVideoRef(ad.id)}
                    videoPlaying={ad.videoPlaying}
                    onToggleVideo={() => toggleVideo(ad.id)}
                    onExpand={() => handleExpand(ad.id)}
                  />
                </div>
              </motion.div>
            );
          }

          const cfg = POSITION_STYLES[ad.position] || POSITION_STYLES['bottom-right'];

          return (
            <motion.div key={ad.id}
              initial={cfg.initial}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={cfg.initial}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className={cfg.className}
            >
              <AdCard
                {...cardProps}
                compact={cfg.compact}
                videoRef={getVideoRef(ad.id)}
                videoPlaying={ad.videoPlaying}
                onToggleVideo={() => toggleVideo(ad.id)}
                onExpand={() => handleExpand(ad.id)}
              />
            </motion.div>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && expandedAd && (
          <ExpandedModal
            key="expanded"
            {...buildCardProps(expandedAd)}
            expandedRef={expandedRef}
            onCollapse={handleCollapse}
          />
        )}
      </AnimatePresence>
    </>
  );
}