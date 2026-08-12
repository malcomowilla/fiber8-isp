/**
 * HotspotPackageCard.jsx
 * Beautiful package card with shared users, validity, price and purchase button
 */

import { motion } from 'framer-motion';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { Zap, Users, Clock, TrendingUp } from 'lucide-react';
import { useLayoutEffect } from "react";





// ── CSS ────────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  .pkg-card {
    position: relative; overflow: hidden;
    background: linear-gradient(135deg, #fff 0%, #f9fafb 100%);
    border: 1.5px solid #e5e7eb;
    border-radius: 16px;
    padding: 24px;
    transition: all .25s cubic-bezier(.4,0,.2,1);
    box-shadow: 0 4px 16px rgba(0,0,0,.06);
  }
  .pkg-card:hover {
    border-color: #d1d5db;
    box-shadow: 0 12px 32px rgba(0,0,0,.12);
    transform: translateY(-4px);
  }
  .pkg-card::before {
    content: '';
    position: absolute; top: 0; left: 0;
    width: 100%; height: 4px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
    opacity: 0;
    transition: opacity .25s;
  }
  .pkg-card:hover::before { opacity: 1; }

  .pkg-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
  .pkg-badge.popular { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; }
  .pkg-badge.new { background: #dcfce7; color: #166534; }

  .pkg-price {
    font-family: 'JetBrains Mono', monospace;
    font-size: 25px;
    font-weight: 800;
    color: #111827;
    line-height: 1;
  }
  .pkg-currency { font-size: 16px; color: #6b7280; margin-right: 4px; }

  .pkg-feature {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 0; font-size: 13px; color: #374151;
  }
  .pkg-feature-icon {
    width: 28px; height: 28px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    background: #f3f4f6;
  }

  .pkg-btn {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 20px;
    border-radius: 12px; border: none;
    font-size: 14px; font-weight: 700; font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: all .18s cubic-bezier(.34,1.56,.64,1);
    position: relative; overflow: hidden;
  }
  .pkg-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.3), transparent);
    transform: translateX(-100%);
    transition: transform .5s ease;
  }
  .pkg-btn:hover::before { transform: translateX(100%); }

  .pkg-btn-primary {
    background: yellow;
    color: black;
    box-shadow: 0 6px 20px rgba(99,102,241,.3);
  }
  .pkg-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(99,102,241,.4);
  }
  .pkg-btn-primary:active { transform: translateY(0); }

  .pkg-divider { height: 1px; background: #f3f4f6; margin: 16px 0; }

  .pkg-spinner {
    width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,.3);
    border-top: 2px solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ── Variants for animation ────────────────────────────────────────────────────
const packageVariants = {
  hidden: { opacity: 0, y: 20, scale: .95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 220,
      damping: 22,
      delay: i * 0.08,
    },
  }),
};

// ── Main component ─────────────────────────────────────────────────────────────
export default function HotspotPackageCards({
  packages,
  onPackageSelect,
  loading = false,
}) {
  const handleSelect = (pkg) => {
    if (onPackageSelect) {
      onPackageSelect({
        name: pkg.name,
        price: pkg.price,
        validity: pkg.valid,
        shared_users: pkg.shared_users,
        package_id: pkg.id,
      });
    }
  };

  if (!packages || packages.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <p style={{ fontSize: 14, color: '#9ca3af' }}>No packages available</p>
      </div>
    );
  }



useLayoutEffect(() => {
  const style = document.createElement("style");
  style.innerHTML = CSS;
  document.head.appendChild(style);

  return () => style.remove();
}, []);


  return (
    <>
      {/* <style>{CSS}</style> */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-7xl mx-auto" >
        {packages.map((pkg, index) => {
          const isPopular = pkg.popular || index === 1; // Highlight second package as popular
          const maxUsers = pkg.shared_users || 1;

          return (
            <motion.div
              key={pkg.id || index}
              custom={index}
              variants={packageVariants}
              initial="hidden"
              animate="visible"
              className="pkg-card"
              style={{
                border: isPopular ? '2px solid #6366f1' : undefined,
                background: isPopular
                  ? 'linear-gradient(135deg, #f5f3ff 0%, #fafbff 100%)'
                  : undefined,
              }}
            >
              {/* Badge */}
              {isPopular && (
                <div style={{ marginBottom: 12 }}>
                  <span className="pkg-badge popular">
                    ⭐ Most Popular
                  </span>
                </div>
              )}

              {/* Package name */}
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#111827',
                margin: '0 0 6px',
              }}>
                {pkg.name}
              </h3>

              {/* Price */}
              <div style={{ marginBottom: 18 }}>
                <p className="pkg-price">
                  <span className="pkg-currency">KES</span>
                  {Number(pkg.price || 0).toLocaleString()}
                </p>
                <p style={{ fontSize: 12, color: 'black', margin: '4px 0 0' }}>
                  One-time payment
                </p>
              </div>

              {/* Features list */}
              <div style={{ marginBottom: 16 }}>
                {/* Validity */}
                <div className="pkg-feature">
                  <div className="pkg-feature-icon" style={{ background: '#fef3c7' }}>
                    <Clock size={14} style={{ color: '#d97706' }} />
                  </div>
                  <div>
                    <p style={{ margin: '0 0 2px', fontWeight: 600, color: '#111827' }}>
                      Validity
                    </p>
                    <p style={{ fontSize: 16, color: 'black', margin: 0 }}>
                      {pkg.valid || 'Not specified'}
                    </p>
                  </div>
                </div>

                {/* Shared users / devices */}
                <div className="pkg-feature">
                  <div className="pkg-feature-icon" style={{ background: '#e0e7ff' }}>
                    <Users size={14} style={{ color: '#6366f1' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: '0 0 2px', fontWeight: 600, color: '#111827' }}>
                      Connected Devices
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 4,
                    }}>
                      {/* Device count display with visual indicators */}
                      <div style={{
                        display: 'flex',
                        gap: 3,
                      }}>
                        {Array.from({ length: Math.min(maxUsers, 5) }).map((_, i) => (
                          <div
                            key={i}
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 50,
                              background: '#6366f1',
                              border: '2px solid #fff',
                              boxShadow: '0 2px 6px rgba(99,102,241,.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 10,
                              fontWeight: 700,
                              color: '#fff',
                            }}
                          >
                            {i + 1}
                          </div>
                        ))}
                        {maxUsers > 5 && (
                          <div style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: '#6366f1',
                            padding: '0 6px',
                          }}>
                            +{maxUsers - 5}
                          </div>
                        )}
                      </div>
                      <p style={{ fontSize: 12, color: '#6b7280' }}>
                        Up to <strong>{maxUsers}</strong> {maxUsers > 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Data / Speed indicator (if available) */}
                {pkg.speed && (
                  <div className="pkg-feature">
                    <div className="pkg-feature-icon" style={{ background: '#d1fae5' }}>
                      <Zap size={14} style={{ color: '#059669' }} />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 2px', fontWeight: 600, color: '#111827' }}>
                        Speed
                      </p>
                      <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>
                        {pkg.speed}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pkg-divider" />

              {/* Purchase button */}
              <button
                className="pkg-btn pkg-btn-primary"
                onClick={() => handleSelect(pkg)}
                disabled={loading}
                style={{
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <>
                    <span className="pkg-spinner" />
                    Processing…
                  </>
                ) : (
                  <>
                    Buy Plan
                    <FaLongArrowAltRight size={13} />
                  </>
                )}
              </button>

              {/* Benefit text */}
              <p style={{
                fontSize: 11,
                color: '#9ca3af',
                textAlign: 'center',
                marginTop: 12,
              }}>
                Activate instantly after payment
              </p>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}