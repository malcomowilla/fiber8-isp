import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const TERMS_SECTIONS = [
  {
    title: 'Billing & Payments',
    body: 'Hotspot plans are billed at a flat KES 1,000 per router per month. PPPoE plans are billed monthly based on active connected subscribers at KES 10 per client. All payments are processed via M-Pesa. Charges are non-refundable once a billing cycle has started.',
  },
  {
    title: 'Free Trial',
    body: 'New accounts receive a 7-day free trial with full platform access. No credit card is required to start. You may cancel at any time during the trial with no charges applied.',
  },
  {
    title: 'Cancellation',
    body: 'There are no long-term contracts. You may cancel your subscription at any time; service continues until the end of the current paid billing cycle, after which access is suspended.',
  },
  {
    title: 'Reseller Commissions',
    body: 'Commission rates for resellers are set by the parent ISP and may be adjusted with prior notice. Payouts are calculated on collected revenue and disbursed monthly via M-Pesa, subject to a minimum payout threshold.',
  },
  {
    title: 'Acceptable Use',
    body: 'The platform may not be used for unlawful purposes, network abuse, or to circumvent fair-usage and bandwidth policies set by the ISP administrator. Violations may result in suspension without refund.',
  },
  {
    title: 'Service Availability',
    body: 'We target 99.9% uptime but do not guarantee uninterrupted service. Scheduled maintenance will be communicated in advance where possible.',
  },
  {
    title: 'Changes to Terms',
    body: 'These terms may be updated periodically. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.',
  },
];

const TermsAndConditions = () => {
  return (
    <div className="landing-root min-h-screen" data-theme="dark"
      style={{ background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold mb-10 text-theme-secondary hover:text-theme-primary">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-theme-primary mb-3">
          Terms & Conditions
        </h1>
        <p className="text-theme-secondary mb-10">
          Last updated: {new Date().toLocaleDateString('en-KE', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>

        <div className="space-y-4">
          {TERMS_SECTIONS.map((t, i) => (
            <motion.div key={t.title}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card-glass rounded-2xl p-5">
              <h2 className="text-sm font-bold text-theme-primary mb-1.5">{t.title}</h2>
              <p className="text-sm text-theme-secondary leading-relaxed">{t.body}</p>
            </motion.div>
          ))}
        </div>

        <p className="text-sm text-theme-secondary mt-10">
          Questions about these terms? <Link to="/#contact" className="underline">Contact us</Link> — full legal documentation available on request.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;