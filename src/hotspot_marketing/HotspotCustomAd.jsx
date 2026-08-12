// HotspotCustomAd.jsx
import { ExternalLink, X } from 'lucide-react';

export default function HotspotCustomAd({ adSettings, onComplete, subdomain, onAdClick }) {
  const elements = JSON.parse(adSettings.design_config || '[]');
  const bg = adSettings.design_background || '#0ea5e9';
  const link = adSettings.ad_link;

  const canvasW = parseInt(adSettings.design_canvas_w) || 320;
  const canvasH = parseInt(adSettings.design_canvas_h) || 280;

  return (
    <div
      // Tapping anywhere on the ad ALWAYS tracks a click.
      // It NEVER redirects — redirecting is exclusively the Visit button's job.
      onClick={() => onAdClick?.({ trackOnly: true })}
      style={{
        position: 'relative',
        width: canvasW,
        height: canvasH,
        maxWidth: 320,
        background: bg,
        borderRadius: 10,
        overflow: 'hidden',
        cursor: 'pointer', // clicking always does *something* (tracks), even without a link
      }}
    >
      {elements.map((el) => {
        if (el.type === 'text') {
          return (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: el.x,
                top: el.y,
                width: el.width,
                fontFamily: el.fontFamily,
                fontSize: el.fontSize,
                color: el.color,
                fontWeight: el.fontWeight,
                fontStyle: el.fontStyle,
                textDecoration: el.textDecoration,
                textAlign: el.align,
                lineHeight: 1.3,
                pointerEvents: 'none',
              }}
            >
              {el.content}
            </div>
          );
        }

        if (el.type === 'button' || el.type === 'badge') {
          return (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                background: el.bg,
                borderRadius: el.radius,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: el.fontFamily,
                fontSize: el.fontSize,
                color: el.color,
                fontWeight: 600,
                pointerEvents: 'none', // purely visual now — the card click above already handles tracking
              }}
            >
              {el.content}
            </div>
          );
        }

        if (el.type === 'shape') {
          return (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: el.x,
                top: el.y,
                width: el.shape === 'circle' ? el.size : el.size,
                height: el.shape === 'circle' ? el.size : el.size * 0.6,
                background: el.bg,
                borderRadius: el.shape === 'circle' ? '50%' : el.shape === 'badge' ? '50px' : '6px',
                opacity: el.opacity,
                pointerEvents: 'none',
              }}
            />
          );
        }

        if (el.type === 'image' && el.src) {
          return (
            <div
              key={el.id}
              style={{
                position: 'absolute',
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                overflow: 'hidden',
                borderRadius: 8,
                pointerEvents: 'none',
              }}
            >
              <img
                src={el.src}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          );
        }

        return null;
      })}

      {/* Visit button — the ONLY thing that redirects. Only rendered if a
          link actually exists; no link means no button, and no redirect
          is ever possible for this ad, by choice made in settings. */}
      {link && (
        <button
          onClick={(e) => {
            e.stopPropagation(); // don't also fire the card's trackOnly click
            onAdClick?.(); // no opts → tracks AND redirects
          }}
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: '4px 10px',
            borderRadius: 20,
            border: 'none',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            fontSize: 11,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          <ExternalLink size={11} /> Visit
        </button>
      )}

      {/* Close button — dismiss only, never tracks a click, never redirects */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onComplete?.('dismissed');
        }}
        style={{
          position: 'absolute',
          top: 8,
          right: 8,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)',
          border: 'none',
          color: '#fff',
          fontSize: 13,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}