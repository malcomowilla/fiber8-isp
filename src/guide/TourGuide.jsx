import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import toast, { Toaster } from 'react-hot-toast';

/* ─────────────────────────────────────────────
   Inject global styles for Shepherd + panel
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

  /* ── Shepherd overrides ── */
  .shepherd-element {
    border-radius: 16px !important;
    border: none !important;
    box-shadow: 0 24px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.1) !important;
    font-family: 'DM Sans', sans-serif !important;
    max-width: 340px !important;
    overflow: hidden !important;
  }
  .shepherd-content {
    padding: 0 !important;
    background: #ffffff !important;
  }
  .shepherd-header {
    background: linear-gradient(135deg, #059669, #0d9488) !important;
    padding: 14px 18px 12px !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
  }
  .shepherd-title {
    font-family: 'Sora', sans-serif !important;
    font-size: 14px !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    flex: 1 !important;
    letter-spacing: -0.01em !important;
  }
  .shepherd-cancel-icon {
    color: rgba(255,255,255,0.7) !important;
    font-size: 18px !important;
    font-weight: 300 !important;
    background: none !important;
    border: none !important;
    cursor: pointer !important;
    line-height: 1 !important;
    transition: color 0.15s !important;
  }
  .shepherd-cancel-icon:hover { color: #fff !important; }
  .shepherd-text {
    font-family: 'DM Sans', sans-serif !important;
    font-size: 14px !important;
    line-height: 1.6 !important;
    color: #374151 !important;
    padding: 16px 18px !important;
    border-bottom: 1px solid #f3f4f6 !important;
  }
  .shepherd-footer {
    display: flex !important;
    gap: 8px !important;
    padding: 12px 18px !important;
    background: #f9fafb !important;
    justify-content: flex-end !important;
  }
  .shepherd-button {
    border-radius: 8px !important;
    font-family: 'DM Sans', sans-serif !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    padding: 7px 16px !important;
    border: none !important;
    cursor: pointer !important;
    transition: all 0.15s !important;
    letter-spacing: 0.01em !important;
  }
  .shepherd-btn-back {
    background: #f3f4f6 !important;
    color: #6b7280 !important;
  }
  .shepherd-btn-back:hover { background: #e5e7eb !important; color: #374151 !important; }
  .shepherd-btn-next {
    background: linear-gradient(135deg, #059669, #0d9488) !important;
    color: #ffffff !important;
    box-shadow: 0 2px 8px rgba(5,150,105,0.35) !important;
  }
  .shepherd-btn-next:hover { opacity: 0.9 !important; transform: translateY(-1px) !important; }
  .shepherd-btn-finish {
    background: linear-gradient(135deg, #059669, #0d9488) !important;
    color: #fff !important;
    padding: 7px 22px !important;
  }
  .shepherd-btn-skip {
    background: transparent !important;
    color: #9ca3af !important;
    font-weight: 500 !important;
  }
  .shepherd-btn-skip:hover { color: #ef4444 !important; }
  .shepherd-has-title .shepherd-content .shepherd-cancel-icon { top: auto !important; }
  .shepherd-modal-overlay-container { opacity: 0.55 !important; }
  .shepherd-arrow:before {
    background: #059669 !important;
  }

  /* ── Step progress indicator injected into header ── */
  .tour-step-badge {
    background: rgba(255,255,255,0.2);
    color: #fff;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 99px;
    font-family: 'DM Sans', sans-serif;
    letter-spacing: 0.04em;
  }

  /* ── Floating button animation ── */
  @keyframes tg-breathe {
    0%, 100% { box-shadow: 0 0 0 0 rgba(5,150,105,0.45), 0 4px 20px rgba(5,150,105,0.3); }
    50%       { box-shadow: 0 0 0 10px rgba(5,150,105,0), 0 4px 20px rgba(5,150,105,0.3); }
  }
  @keyframes tg-slide-up {
    from { opacity: 0; transform: translateY(12px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes tg-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }
  .tg-panel-enter { animation: tg-slide-up 0.22s cubic-bezier(0.34,1.56,0.64,1) both; }
  .tg-fab { animation: tg-breathe 2.8s ease-in-out infinite; }
`;

function injectStyles() {
  if (document.getElementById('tour-guide-styles')) return;
  const tag = document.createElement('style');
  tag.id = 'tour-guide-styles';
  tag.textContent = STYLES;
  document.head.appendChild(tag);
}

/* ─── Tour step metadata ─── */
const STEP_ICONS = {
  welcome: '👋',
  sidebar: '🗂️',
  'system license': '🔑',
  profile: '👤',
  notifications: '🔔',
  'dark light mode': '🌗',
  'sidebar-toggle': '☰',
  'user-invite-card': '➕',
  'manage-payment-card': '💳',
  timer: '🕐',
  'welcome-message': '💬',
  'sms balance': '📨',
  finish: '🎉',
};

/* ─── Help panel menu items ─── */
function HelpPanel({ onStartTour, onViewDocs, onContact, companyName, onClose }) {
  const items = [
    {
      icon: '🗺️',
      label: 'Interactive Tour',
      desc: 'Step-by-step walkthrough of every feature',
      color: 'from-emerald-500 to-teal-500',
      badge: 'Recommended',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      action: onStartTour,
    },
    {
      icon: '📖',
      label: 'Documentation',
      desc: 'Full guides, FAQs and how-to articles',
      color: 'from-blue-500 to-indigo-500',
      badge: null,
      action: onViewDocs,
    },
    {
      icon: '💬',
      label: 'WhatsApp Support',
      desc: 'Chat with our technical team instantly',
      color: 'from-green-500 to-lime-500',
      badge: 'Live',
      badgeColor: 'bg-green-100 text-green-700',
      action: onContact,
    },
  ];

  return (
    <div
      className="tg-panel-enter"
      style={{
        position: 'fixed',
        bottom: 84,
        right: 20,
        width: 300,
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 24px 60px rgba(0,0,0,0.16), 0 4px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        zIndex: 1001,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #059669, #0d9488)',
        padding: '16px 18px 14px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
            Help & Resources
          </span>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8,
            color: '#fff', cursor: 'pointer', padding: '3px 8px', fontSize: 13, lineHeight: 1,
          }}>✕</button>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.4 }}>
          Get the most out of <strong style={{ color: '#fff' }}>{companyName || 'your system'}</strong>
        </p>
      </div>

      {/* Items */}
      <div style={{ padding: '10px 12px 12px' }}>
        {items.map((item, i) => (
          <button
            key={i}
            onClick={item.action}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 10px', borderRadius: 12, border: '1px solid #f3f4f6',
              background: '#fafafa', cursor: 'pointer', textAlign: 'left',
              marginBottom: i < items.length - 1 ? 8 : 0,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#f0fdf4';
              e.currentTarget.style.borderColor = '#a7f3d0';
              e.currentTarget.style.transform = 'translateX(2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#fafafa';
              e.currentTarget.style.borderColor = '#f3f4f6';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            {/* icon */}
            <div style={{
              width: 40, height: 40, borderRadius: 11, flexShrink: 0,
              background: 'linear-gradient(135deg, #059669, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, boxShadow: '0 2px 8px rgba(5,150,105,0.25)',
            }}>
              {item.icon}
            </div>

            {/* text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '1px 7px', borderRadius: 99,
                    background: item.badgeColor?.split(' ')[0]?.replace('bg-', '') === 'emerald' ? '#d1fae5' : '#dcfce7',
                    color: item.badgeColor?.split(' ')[0]?.replace('bg-', '') === 'emerald' ? '#065f46' : '#166534',
                    letterSpacing: '0.03em',
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
              <p style={{ fontSize: 11, color: '#6b7280', margin: 0, lineHeight: 1.4 }}>{item.desc}</p>
            </div>

            {/* arrow */}
            <span style={{ color: '#d1d5db', fontSize: 14, flexShrink: 0 }}>›</span>
          </button>
        ))}
      </div>

      {/* Footer tip */}
      <div style={{
        padding: '10px 16px 12px',
        borderTop: '1px solid #f3f4f6',
        background: '#f9fafb',
        display: 'flex', alignItems: 'flex-start', gap: 8,
      }}>
        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>💡</span>
        <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, lineHeight: 1.5 }}>
          <strong style={{ color: '#6b7280' }}>Tip:</strong> You can restart the tour anytime from this menu. Tour remembers where you are!
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
const TourGuide = () => {
  const [tour, setTour] = useState(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [tourRunning, setTourRunning] = useState(false);
  const location = useLocation();
  const panelRef = useRef(null);

  const { companySettings, setCompanySettings } = useApplicationSettings();
  const {
    contact_info, company_name, email_info, logo_url,
    agent_email, customer_support_email, customer_support_phone_number,
  } = companySettings;

  useEffect(() => { injectStyles(); }, []);

  /* ── fetch company settings ── */
  const handleGetCompanySettings = useCallback(async () => {
    try {
      const res = await fetch('/api/get_company_settings');
      const data = await res.json();
      if (res.ok) {
        const { contact_info, company_name, email_info, logo_url } = data;
        setCompanySettings(prev => ({ ...prev, contact_info, company_name, email_info, logo_preview: logo_url }));
      }
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Error fetching company settings', err);
    }
  }, [setCompanySettings]);

  useEffect(() => { handleGetCompanySettings(); }, [handleGetCompanySettings]);

  /* ── build steps ── */
  const makeSteps = useCallback((tourInstance, compName) => {
    const totalSteps = 13;
    let currentStep = 0;

    const mkButtons = (opts = {}) => {
      const btns = [];
      if (opts.canGoBack) btns.push({ text: '← Back', classes: 'shepherd-button shepherd-btn-back', action() { return this.back(); } });
      if (opts.canSkip !== false) btns.push({ text: 'Skip tour', classes: 'shepherd-button shepherd-btn-skip', action() { return this.complete(); } });
      btns.push({
        text: opts.isLast ? 'Finish 🎉' : 'Next →',
        classes: `shepherd-button ${opts.isLast ? 'shepherd-btn-finish' : 'shepherd-btn-next'}`,
        action() { return opts.isLast ? this.complete() : this.next(); },
      });
      return btns;
    };

    const steps = [
      {
        id: 'welcome',
        title: `${STEP_ICONS.welcome} Welcome to ${compName || 'your dashboard'}!`,
        text: `<p>We're glad you're here. This quick tour will walk you through everything you need to know to get started confidently.</p><p style="margin-top:8px;color:#6b7280;font-size:13px;">It only takes about <strong>2 minutes</strong> to complete.</p>`,
        buttons: mkButtons({ canSkip: true }),
      },
      {
        id: 'sidebar',
        title: `${STEP_ICONS.sidebar} Navigation Menu`,
        attachTo: { element: '#sidebar-multi-level-sidebar', on: 'right' },
        text: `<p>Your main navigation lives here. Use it to jump between <strong>Customers</strong>, <strong>Packages</strong>, <strong>Reports</strong>, and more.</p><p style="margin-top:8px;font-size:13px;color:#6b7280;">💡 <em>Tip: You can collapse the sidebar to give yourself more screen space.</em></p>`,
        beforeShowPromise: () => new Promise(r => { document.querySelector('#sidebar-multi-level-sidebar') ? r() : setTimeout(r, 500); }),
        buttons: mkButtons({ canGoBack: true }),
      },
      {
        id: 'system license',
        title: `${STEP_ICONS['system license']} System License`,
        attachTo: { element: '#system-license', on: 'bottom' },
        text: `<p>This shows your <strong>current license status</strong> for both PPPoE and Hotspot services.</p><p style="margin-top:8px;font-size:13px;color:#6b7280;">🔑 Upgrade anytime to unlock more customers and features.</p>`,
        scrollTo: false,
        buttons: mkButtons({ canGoBack: true }),
      },
      {
        id: 'profile',
        title: `${STEP_ICONS.profile} Your Profile`,
        attachTo: { element: '#profile', on: 'left' },
        text: `<p>Click here to manage your <strong>profile, password</strong>, and security settings like <strong>Google Authenticator</strong> and <strong>Passkeys</strong>.</p><p style="margin-top:8px;font-size:13px;color:#6b7280;">📞 You can also contact support directly from here.</p>`,
        buttons: mkButtons({ canGoBack: true }),
      },
      {
        id: 'notifications',
        title: `${STEP_ICONS.notifications} Notifications`,
        attachTo: { element: '.notifications-bell', on: 'bottom' },
        text: `<p>Stay informed! New messages, billing alerts, and system updates will appear here as <strong>notification badges</strong>.</p><p style="margin-top:8px;font-size:13px;color:#6b7280;">🔔 You'll never miss an important update.</p>`,
        buttons: mkButtons({ canGoBack: true }),
      },
      {
        id: 'dark light mode',
        title: `${STEP_ICONS['dark light mode']} Dark / Light Mode`,
        attachTo: { element: '#dark-light', on: 'left' },
        text: `<p>Toggle between <strong>dark mode</strong> and <strong>light mode</strong> to suit your working environment and reduce eye strain.</p>`,
        scrollTo: false,
        buttons: mkButtons({ canGoBack: true }),
      },
      {
        id: 'sidebar-toggle',
        title: `${STEP_ICONS['sidebar-toggle']} Sidebar Toggle`,
        attachTo: { element: '#sidebar-toggle', on: 'bottom' },
        text: `<p>Use this button to <strong>show or hide the sidebar</strong>, giving you more room to work when you need it.</p>`,
        scrollTo: false,
        buttons: mkButtons({ canGoBack: true }),
      },
      {
        id: 'user-invite-card',
        title: `${STEP_ICONS['user-invite-card']} Invite Users`,
        attachTo: { element: '.user-invite-card', on: 'bottom' },
        text: `<p>Quickly <strong>invite a new team member</strong> or staff account to your company workspace directly from this shortcut.</p><p style="margin-top:8px;font-size:13px;color:#6b7280;">👥 Perfect for adding technicians or billing staff.</p>`,
        scrollTo: false,
        buttons: mkButtons({ canGoBack: true }),
      },
      {
        id: 'manage-payment-card',
        title: `${STEP_ICONS['manage-payment-card']} Manage Payments`,
        attachTo: { element: '.manage-payment-card', on: 'bottom' },
        text: `<p>A quick shortcut to <strong>view and manage customer transactions</strong> — payments, invoices, and billing history.</p><p style="margin-top:8px;font-size:13px;color:#6b7280;">💳 Keep your finances in order with a single click.</p>`,
        scrollTo: false,
        buttons: mkButtons({ canGoBack: true }),
      },
      {
        id: 'timer',
        title: `${STEP_ICONS.timer} Live Clock`,
        attachTo: { element: '#timer', on: 'bottom' },
        text: `<p>The live clock shows the <strong>current system time</strong>, helping you track billing cycles, session times, and scheduled tasks.</p>`,
        scrollTo: false,
        buttons: mkButtons({ canGoBack: true }),
      },
      {
        id: 'welcome-message',
        title: `${STEP_ICONS['welcome-message']} Welcome Greeting`,
        attachTo: { element: '.welcome-message', on: 'bottom' },
        text: `<p>Your personalized <strong>welcome message</strong> appears here. It greets you by name and shows key daily stats at a glance.</p>`,
        scrollTo: false,
        buttons: mkButtons({ canGoBack: true }),
      },
      {
        id: 'sms balance',
        title: `${STEP_ICONS['sms balance']} SMS Balance`,
        attachTo: { element: '#sms-balance', on: 'bottom' },
        text: `<p>This shows your <strong>available SMS credits</strong>. Use them to send automated billing reminders, expiry notices, and alerts to your customers.</p><p style="margin-top:8px;font-size:13px;color:#6b7280;">📨 Low on credits? Upgrade your plan to top up.</p>`,
        scrollTo: false,
        buttons: mkButtons({ canGoBack: true }),
      },
      {
        id: 'finish',
        title: `${STEP_ICONS.finish} You're all set!`,
        text: `<p>Great job! You've completed the tour of <strong>${compName || 'your dashboard'}</strong>.</p><p style="margin-top:8px;color:#6b7280;font-size:13px;">🎯 You can restart this tour anytime from the <strong>Help</strong> button in the bottom-right corner.</p><p style="margin-top:6px;font-size:13px;color:#6b7280;">Need more help? Contact support via <strong>WhatsApp</strong> or browse the <strong>Docs</strong>.</p>`,
        buttons: mkButtons({ isLast: true }),
      },
    ];

    steps.forEach(s => tourInstance.addStep(s));
  }, []);

  /* ── build tour ── */
  useEffect(() => {
    if (!location.pathname.includes('/admin')) return;

    const newTour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        scrollTo: { behavior: 'smooth', block: 'center' },
        cancelIcon: { enabled: true },
        popperOptions: {
          modifiers: [{ name: 'offset', options: { offset: [0, 14] } }],
        },
      },
    });

    makeSteps(newTour, company_name);

    newTour.on('start',    () => setTourRunning(true));
    newTour.on('complete', () => { setTourRunning(false); setPanelOpen(false); });
    newTour.on('cancel',   () => { setTourRunning(false); });

    setTour(newTour);

    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour) {
      setTimeout(() => { newTour.start(); localStorage.setItem('hasSeenTour', 'true'); }, 800);
    }

    return () => { try { newTour.complete(); } catch {} };
  }, [location.pathname, company_name, makeSteps]);

  /* ── close panel on outside click ── */
  useEffect(() => {
    if (!panelOpen) return;
    const handle = e => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setPanelOpen(false);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [panelOpen]);

  /* ── actions ── */
  const handleStartTour = () => {
    setPanelOpen(false);
    if (!tour) return;
    if (!location.pathname.includes('admin')) {
      toast('Tour is only available on admin pages', {
        icon: '⚠️',
        style: { fontFamily: "'DM Sans', sans-serif", fontSize: 13, borderRadius: 10 },
      });
      return;
    }
    try { tour.complete(); } catch {}
    setTimeout(() => { tour.start(); }, 120);
  };

  const handleViewDocs = () => {
    setPanelOpen(false);
    window.open('/docs', '_blank');
  };

  const handleContactSupport = () => {
    setPanelOpen(false);
    window.open(
      `https://wa.me/254791568852?text=Hi,%20I%20need%20help%20with%20${encodeURIComponent(company_name || 'the system')}`,
      '_blank'
    );
  };

  /* ── only render on allowed pages ── */
  const allowedPaths = ['/admin/analytics', '/admin/finance-stats', '/admin/admin-dashboard'];
  const isAllowed = allowedPaths.some(p => location.pathname.includes(p));
  if (!isAllowed) return null;

  return (
    <>
      <Toaster position="top-right" />

      {/* ── Help panel ── */}
      {panelOpen && (
        <div ref={panelRef}>
          <HelpPanel
            companyName={company_name}
            onStartTour={handleStartTour}
            onViewDocs={handleViewDocs}
            onContact={handleContactSupport}
            onClose={() => setPanelOpen(false)}
          />
        </div>
      )}

      {/* ── FAB button ── */}
      <button
        onClick={() => setPanelOpen(o => !o)}
        className="tg-fab"
        title="Help & Resources"
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: panelOpen
            ? 'linear-gradient(135deg, #374151, #1f2937)'
            : 'linear-gradient(135deg, #059669, #0d9488)',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1002,
          transition: 'background 0.2s, transform 0.2s',
          fontFamily: "'DM Sans', sans-serif",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
      >
        {/* icon — rotates to X when open */}
        <span style={{
          fontSize: 22,
          lineHeight: 1,
          display: 'inline-block',
          transition: 'transform 0.25s',
          transform: panelOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          {panelOpen ? '✕' : '?'}
        </span>

        {/* pulse ring */}
        {!panelOpen && !tourRunning && (
          <span style={{
            position: 'absolute',
            inset: -4,
            borderRadius: '50%',
            border: '2px solid rgba(5,150,105,0.5)',
            animation: 'tg-breathe 2.8s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}
      </button>

      {/* ── Tooltip label that appears next to FAB on first load ── */}
      {!localStorage.getItem('hasSeenTour') && !panelOpen && (
        <div style={{
          position: 'fixed',
          bottom: 29,
          right: 82,
          background: '#1f2937',
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
          fontFamily: "'DM Sans', sans-serif",
          padding: '6px 12px',
          borderRadius: 8,
          whiteSpace: 'nowrap',
          zIndex: 1001,
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          pointerEvents: 'none',
          animation: 'tg-slide-up 0.4s 1.2s both',
        }}>
          👋 Need help? Click here
          <span style={{
            position: 'absolute', right: -6, top: '50%', transform: 'translateY(-50%)',
            width: 0, height: 0,
            borderTop: '6px solid transparent', borderBottom: '6px solid transparent',
            borderLeft: '6px solid #1f2937',
          }} />
        </div>
      )}
    </>
  );
};

export default TourGuide;