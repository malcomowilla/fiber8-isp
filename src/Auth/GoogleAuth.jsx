import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Copy, Download, ShieldCheck, Smartphone, KeyRound, ScanLine } from 'lucide-react';
import { useApplicationSettings } from '../settings/ApplicationSettings';

const GoogleAuthenticatorSetup = ({ userEmail, onComplete }) => {
  const [setupData, setSetupData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null); // 'secret' | 'codes' | null

  const { currentUser, setCurrentUser, currentUsername, currentEmail, setOpenDropDown } = useApplicationSettings();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { y: 16, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 120, damping: 16 },
    },
  };

  const flash = (key) => {
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const subdomain = window.location.hostname.split('.')[0];

  const initiateSetup = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/setup_google_authenticator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({ email: currentEmail }),
      });

      if (!response.ok) throw new Error('Setup failed');
      const data = await response.json();
      setSetupData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCodes = () => {
    if (!setupData?.backup_codes) return;
    const blob = new Blob([setupData.backup_codes.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!setupData) {
    return (
      <div className="min-h-[420px] flex items-center justify-center  font-sans px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center"
        >
          <div className="w-12 h-12 mx-auto mb-5 rounded-xl bg-indigo-50 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-indigo-600" strokeWidth={2} />
          </div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2 tracking-tight">
            Enable two-factor authentication
          </h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            Add an extra layer of security to your account using Google Authenticator or a similar app.
          </p>
          <button
            onClick={initiateSetup}
            disabled={isLoading}
            className="w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg
                       hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-indigo-300
                       transition-colors duration-150 shadow-sm"
          >
            {isLoading ? 'Preparing setup…' : 'Begin setup'}
          </button>
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="text-sm text-red-500 mt-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[600px] bg-slate-50 font-sans py-10 px-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-md mx-auto bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <div className="px-7 pt-7 pb-2">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4.5 h-4.5 text-indigo-600" strokeWidth={2} />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">
              Set up Google Authenticator
            </h2>
          </div>
        </div>

        <motion.div variants={itemVariants} className="px-7 pb-7">
          {/* QR code */}
          <div className="mt-5 mb-6">
            <p className="text-sm text-slate-500 mb-3">
              Scan this code with your authenticator app
            </p>
            <div className="flex justify-center p-5 bg-slate-50 rounded-xl border border-slate-100">
              <img
                src={setupData.qr_code_data_url}
                alt="2FA QR Code"
                className="w-44 h-44 rounded-lg bg-white p-2 shadow-sm"
              />
            </div>
          </div>

          {/* Manual entry */}
          <div className="mb-6">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
              Or enter this key manually
            </p>
            <div className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-100 px-4 py-3 rounded-lg">
              <code className="font-mono text-sm text-slate-700 tracking-wide truncate">
                {setupData.otp_secret}
              </code>
              <CopyToClipboard text={setupData.otp_secret} onCopy={() => flash('secret')}>
                <button className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-md hover:bg-slate-100 transition-colors">
                  {copiedKey === 'secret' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </>
                  )}
                </button>
              </CopyToClipboard>
            </div>
          </div>

          {/* Steps */}
          <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-3">
              <Smartphone className="w-4 h-4 text-slate-400" />
              How to set up
            </h3>
            <ol className="space-y-2.5">
              {[
                'Open Google Authenticator on your phone',
                'Tap the "+" icon and select "Scan QR code"',
                'Point your camera at the code above',
                'Or choose "Enter setup key" and paste it in',
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                  <span className="mt-0.5 shrink-0 w-4.5 h-4.5 flex items-center justify-center rounded-full bg-white border border-slate-200 text-[11px] font-medium text-slate-400">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Backup codes notice */}
          <div className="flex gap-2.5 bg-amber-50 border border-amber-100 rounded-lg p-3.5 mb-4">
            <KeyRound className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 leading-relaxed">
              Save these backup codes somewhere secure. Each one works only once if you lose access to your app.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {setupData.backup_codes.map((code, index) => (
              <div
                key={index}
                className="bg-slate-50 border border-slate-100 py-2.5 rounded-lg text-center font-mono text-sm text-slate-600 select-all"
              >
                {code}
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-3">
            <CopyToClipboard text={setupData.backup_codes.join('\n')} onCopy={() => flash('codes')}>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors">
                {copiedKey === 'codes' ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" /> Copy all
                  </>
                )}
              </button>
            </CopyToClipboard>
            <button
              onClick={downloadCodes}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>

          <button
            onClick={onComplete}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm"
          >
            I've saved my backup codes — finish setup
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default GoogleAuthenticatorSetup;