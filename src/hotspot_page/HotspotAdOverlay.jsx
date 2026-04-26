import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Play, Pause, SkipForward, ExternalLink,
  Wifi, Clock, Maximize2, Minimize2, Gift
} from 'lucide-react';

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

      {isVideo && (
        <div
          className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-full"
          style={{ background: 'rgba(0,0,0,.4)' }}
        >
          <Clock size={10} className="text-amber-400" />
          <span className="text-xs font-bold text-amber-400 tabular-nums">{secondsLeft}s</span>
        </div>
      )}
    </div>
  );
}

function MediaSection({
  compact, isVideo, isImage, mediaUrl, adTitle, adLink,
  videoRef, videoPlaying, onToggleVideo, onExpand,
}) {
  return (
    <div className="relative group">
      {isImage && (
        <img
          src={mediaUrl}
          alt={adTitle || 'Advertisement'}
          className={`w-full object-cover ${compact ? 'max-h-32' : 'max-h-56'}`}
          onClick={() => adLink && window.open(adLink, '_blank')}
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
          {/* play / pause overlay */}
          <button
            onClick={onToggleVideo}
            className="absolute inset-0 flex items-center justify-center bg-transparent"
          >
            <div className="w-11 h-11 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {videoPlaying
                ? <Pause size={18} className="text-white" />
                : <Play  size={18} className="text-white ml-0.5" />}
            </div>
          </button>
          {/* expand button */}
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
  onExpand, onComplete,
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
        {isVideo && (
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
            onClick={() => window.open(adLink, '_blank')}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-semibold transition-all hover:opacity-80"
            style={{ background: 'rgba(56,189,248,.15)', color: '#38bdf8' }}
          >
            <ExternalLink size={10} /> Visit
          </button>
        )}

        {isVideo && canSkip && skipReady && (
          <button
            onClick={onComplete}
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
            onClick={onComplete}
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
  compact, isVideo, isImage, mediaUrl, adTitle, adLink,
  canSkip, skipReady, skipAfter, totalDuration, secondsLeft,
  videoRef, videoPlaying, progressPct, rewardLabel,
  onToggleVideo, onExpand, onComplete,
}) {
  return (
    <div
      className={`relative overflow-hidden shadow-2xl ${compact ? 'rounded-xl' : 'rounded-2xl'}`}
      style={{ background: 'rgba(10,16,30,.96)', border: '1px solid rgba(148,163,184,.12)' }}
    >
      <RewardBanner compact={compact} isVideo={isVideo} secondsLeft={secondsLeft} rewardLabel={rewardLabel} />

      <MediaSection
        compact={compact} isVideo={isVideo} isImage={isImage}
        mediaUrl={mediaUrl} adTitle={adTitle} adLink={adLink}
        videoRef={videoRef} videoPlaying={videoPlaying}
        onToggleVideo={onToggleVideo} onExpand={onExpand}
      />

      <FooterBar
        compact={compact} isVideo={isVideo} isImage={isImage}
        adTitle={adTitle} adLink={adLink}
        canSkip={canSkip} skipReady={skipReady} skipAfter={skipAfter}
        totalDuration={totalDuration} secondsLeft={secondsLeft}
        onExpand={onExpand} onComplete={onComplete}
      />

      {isVideo && (
        <div className="h-0.5" style={{ background: 'rgba(148,163,184,.1)' }}>
          <div
            className="h-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPct}%`, background: 'linear-gradient(90deg,#34d399,#6366f1)' }}
          />
        </div>
      )}
    </div>
  );
}

function ExpandedModal({
  isVideo, isImage, mediaUrl, adTitle, adLink,
  canSkip, skipReady, secondsLeft, progressPct, rewardLabel,
  expandedRef, onComplete, onCollapse,
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
        <p className="absolute -top-8 right-0 text-xs text-gray-500">
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
                onEnded={onComplete}
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
                  onClick={onComplete}
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
                  onClick={() => window.open(adLink, '_blank')}
                  className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-semibold"
                  style={{ background: 'rgba(56,189,248,.15)', color: '#38bdf8' }}
                >
                  <ExternalLink size={13} /> Visit
                </button>
              )}
              {isImage && (
                <button
                  onClick={onComplete}
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

// ─────────────────────────────────────────────────────────────────────────────
// Main component — only state and logic live here
// ─────────────────────────────────────────────────────────────────────────────
export default function HotspotAdOverlay({ subdomain, onAdComplete }) {
  const [adSettings, setAdSettings]     = useState(null);
  const [loading, setLoading]           = useState(true);
  const [visible, setVisible]           = useState(false);
  const [secondsLeft, setSecondsLeft]   = useState(0);
  const [skipReady, setSkipReady]       = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [expanded, setExpanded]         = useState(false);

  const videoRef     = useRef(null);
  const expandedRef  = useRef(null);
  const timerRef     = useRef(null);
  const skipTimerRef = useRef(null);
  const completedRef = useRef(false);
  const timerStarted = useRef(false);
  const adRef        = useRef(null);

  useEffect(() => { adRef.current = adSettings; }, [adSettings]);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchAd = useCallback(async () => {
    try {
      const res = await fetch('/api/allow_get_ads', { headers: { 'X-Subdomain': subdomain } });
      if (!res.ok) return;
      const raw  = await res.json();
      const data = Array.isArray(raw)
        ? raw.find(ad => ad.ad_enabled && ad.ad_link)
        : (raw.ad_enabled && raw.ad_link ? raw : null);
      if (!data) { setLoading(false); return; }
      setAdSettings(data);
      setSecondsLeft(data.media_type === 'video' ? (data.ad_duration || 15) : 0);
      setLoading(false);
      setVisible(true);
    } catch { setLoading(false); }
  }, [subdomain]);

  useEffect(() => { fetchAd(); }, [fetchAd]);

  // ── Complete handler (stable, called once) ────────────────────────────────
  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearInterval(timerRef.current);
    clearTimeout(skipTimerRef.current);
    setVisible(false);
    setExpanded(false);
    const s = adRef.current;
    onAdComplete?.({ reward_type: s?.reward_type, selected_package: s?.selected_package, free_minutes: s?.free_minutes });
  }, [onAdComplete]);

  // ── Countdown — starts only once ─────────────────────────────────────────
  useEffect(() => {
    if (!visible || adRef.current?.media_type !== 'video' || timerStarted.current) return;
    timerStarted.current = true;

    const skipAfter = adRef.current.skip_after || 5;
    if (adRef.current.can_skip) {
      skipTimerRef.current = setTimeout(() => setSkipReady(true), skipAfter * 1000);
    }
    timerRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); setTimeout(handleComplete, 0); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => { clearInterval(timerRef.current); clearTimeout(skipTimerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // ── Pause inline video while expanded modal is open ───────────────────────
  useEffect(() => {
    if (!videoRef.current) return;
    if (expanded) {
      videoRef.current.pause();
    } else if (videoPlaying) {
      videoRef.current.play().catch(() => {});
    }
  }, [expanded, videoPlaying]);

  // ── Sync expanded video position when modal opens ─────────────────────────
  useEffect(() => {
    if (!expanded) return;
    const t = setTimeout(() => {
      if (expandedRef.current && videoRef.current) {
        expandedRef.current.currentTime = videoRef.current.currentTime;
        if (videoPlaying) expandedRef.current.play().catch(() => {});
      }
    }, 80);
    return () => clearTimeout(t);
  }, [expanded, videoPlaying]);

  // ── ESC closes expanded ───────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const toggleVideo    = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (videoPlaying) { el.pause(); } else { el.play().catch(() => {}); }
    setVideoPlaying(v => !v);
  }, [videoPlaying]);

  const handleExpand   = useCallback(() => setExpanded(true),  []);
  const handleCollapse = useCallback(() => setExpanded(false), []);

  if (loading || !adSettings) return null;

  const {
    ad_link:      mediaUrl,
    media_type:   mediaType,
    ad_title:     adTitle,
    position,
    can_skip:     canSkip,
    reward_type:  rewardType,
    free_minutes: freeMinutes,
    ad_duration:  adDuration,
    skip_after:   skipAfter,
  } = adSettings;

  const isVideo       = mediaType === 'video';
  const isImage       = mediaType === 'image';
  const totalDuration = adDuration || 15;
  const progressPct   = isVideo ? ((totalDuration - secondsLeft) / totalDuration) * 100 : 100;

  const rewardLabel = (() => {
    if (rewardType === 'specific')    return adSettings.package_name || 'Internet Package';
    if (rewardType === 'free_browse') return freeMinutes >= 60 ? `${freeMinutes / 60}hr Free Internet` : `${freeMinutes}min Free Internet`;
    if (rewardType === 'choice')      return 'Choose Your Package';
    return 'Free Internet Access';
  })();

  // props shared by AdCard and ExpandedModal
  const cardProps = {
    isVideo, isImage, mediaUrl, adTitle, adLink: adSettings.ad_link,
    canSkip, skipReady, skipAfter: skipAfter || 5,
    totalDuration, secondsLeft, progressPct, rewardLabel,
    onComplete: handleComplete,
  };

  return (
    <>
      <AnimatePresence>
        {visible && !expanded && (
          <>
            {position === 'top-banner' && (
              <motion.div key="top"
                initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="fixed top-0 inset-x-0 z-[9999]"
              >
                <AdCard {...cardProps} compact videoRef={videoRef} videoPlaying={videoPlaying} onToggleVideo={toggleVideo} onExpand={handleExpand} />
              </motion.div>
            )}

            {position === 'bottom-banner' && (
              <motion.div key="bottom"
                initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="fixed bottom-0 inset-x-0 z-[9999]"
              >
                <AdCard {...cardProps} compact videoRef={videoRef} videoPlaying={videoPlaying} onToggleVideo={toggleVideo} onExpand={handleExpand} />
              </motion.div>
            )}

            {position === 'center-modal' && (
              <motion.div key="center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
                style={{ background: 'rgba(2,6,23,.8)', backdropFilter: 'blur(12px)' }}
              >
                <div className="absolute inset-0" onClick={isImage ? handleComplete : undefined} />
                <div className="relative w-full max-w-sm z-10">
                  <AdCard {...cardProps} videoRef={videoRef} videoPlaying={videoPlaying} onToggleVideo={toggleVideo} onExpand={handleExpand} />
                </div>
              </motion.div>
            )}

            {position === 'bottom-right' && (
              <motion.div key="br"
                initial={{ x: 120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 120, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="fixed bottom-4 right-4 z-[9999] w-80"
              >
                <AdCard {...cardProps} compact videoRef={videoRef} videoPlaying={videoPlaying} onToggleVideo={toggleVideo} onExpand={handleExpand} />
              </motion.div>
            )}

            {position === 'bottom-left' && (
              <motion.div key="bl"
                initial={{ x: -120, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -120, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                className="fixed bottom-4 left-4 z-[9999] w-80"
              >
                <AdCard {...cardProps} compact videoRef={videoRef} videoPlaying={videoPlaying} onToggleVideo={toggleVideo} onExpand={handleExpand} />
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {expanded && (
          <ExpandedModal key="expanded" {...cardProps} expandedRef={expandedRef} onCollapse={handleCollapse} />
        )}
      </AnimatePresence>
    </>
  );
}