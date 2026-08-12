import { motion } from 'framer-motion';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { FiKey, FiShield, FiCheck, FiMail, FiSmartphone } from 'react-icons/fi';
import { Backdrop } from '@mui/material';
import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Lottie from 'react-lottie';
import LoadingAnimation from '../loader/loading_animation.json';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

function generateAvatar(name) {
  const avatar = createAvatar(lorelei, {
    seed: name,
    backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'],
    radius: 50,
    size: 64,
  });
  return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
}

// A small, self-contained toggle row so the three auth switches below share
// one consistent, dark-mode-aware look instead of three copy-pasted blocks.
const ToggleRow = ({ icon: Icon, label, description, checked, onChange }) => (
  <label className="flex items-center justify-between gap-4 py-3.5 cursor-pointer">
    <div className="flex items-center gap-3 min-w-0">
      <span
        className={`flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors ${
          checked
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
            : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
        }`}
      >
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{label}</p>
        {description && <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{description}</p>}
      </div>
    </div>
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
    <div
      className="relative w-11 h-6 shrink-0 bg-slate-200 dark:bg-slate-700 rounded-full peer
        peer-focus:ring-4 peer-focus:ring-emerald-200 dark:peer-focus:ring-emerald-900
        peer-checked:bg-emerald-500 transition-colors
        after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white
        after:rounded-full after:h-5 after:w-5 after:transition-all
        peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full"
    />
  </label>
);

const SystemAdminProfile = () => {
  const {
    currentSystemAdmin,
    systemAdminEmail,
    loginWithPasskey,
    setLoginWithPasskey,
    useEmailAuthentication,
    setUseEmailAuthentication,
    usePhoneNumberAuthentication,
    setUsePhoneNumberAuthentication,
    fetchCurrentSystemAdmin,
  } = useApplicationSettings();

  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('');
  const [openLoad, setOpenLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passkeyCreated, setPasskeyCreated] = useState(false);

  function handleChangePasskey() {
    setLoginWithPasskey(!loginWithPasskey);
    setUseEmailAuthentication(false);
    setUsePhoneNumberAuthentication(false);
  }

  function handleChangeEmailAuth() {
    setUseEmailAuthentication(!useEmailAuthentication);
    setUsePhoneNumberAuthentication(false);
    setLoginWithPasskey(false);
  }

  function handleChangePhoneNumberAuth() {
    setUsePhoneNumberAuthentication(!usePhoneNumberAuthentication);
    setUseEmailAuthentication(false);
    setLoginWithPasskey(false);
  }

  useEffect(() => {
    fetchCurrentSystemAdmin();
  }, [fetchCurrentSystemAdmin]);

  useEffect(() => {
    const checkPasskeyStatus = async () => {
      try {
        const response = await fetch('/api/get_passkey_credentials_system_admin');
        const data = await response.json();
        if (response.ok) {
          setPasskeyCreated((data.credentials?.length ?? 0) > 0);
        }
      } catch (error) {
        // silent — leave passkeyCreated as-is if the check fails
      }
    };
    checkPasskeyStatus();
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
  };

  const subdomain = window.location.hostname.split('.')[0];
  const subdomain_aitechs = window.location.host;

  function arrayBufferToBase64Url(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary).replace(/\//g, '_').replace(/\+/g, '-').replace(/=+$/, '');
  }

  async function signupWithWebAuthn(e) {
    e.preventDefault();
    setOpenLoad(true);
    setIsRegistering(true);
    setRegistrationStatus('starting');
    setLoading(true);
    const response = await fetch('/api/webauthn/register_webauthn_system_admin', {
      method: 'POST',
      headers: { 'X-Subdomain': subdomain, 'X-Subdomain-Aitechs': subdomain_aitechs },
      body: JSON.stringify({ email: currentSystemAdmin.email, phone_number: currentSystemAdmin.phone_number }),
    });

    const options = await response.json();
    setRegistrationStatus('authenticating');
    const challenge = options.challenge;

    try {
      if (response.ok) {
        setRegistrationStatus('authenticating');
        setTimeout(() => {
          setIsRegistering(false);
        }, 3000);
        setOpenLoad(false);
        setLoading(false);
      } else {
        setRegistrationStatus('error');
        setTimeout(() => {
          setIsRegistering(false);
        }, 3000);
        setOpenLoad(false);
        setLoading(false);
        toast.error(options.error || 'passkey creation failed');
      }
    } catch (error) {
      toast.error(options.error || 'passkey creation failed');
      setTimeout(() => {
        setIsRegistering(false);
      }, 3000);
      setRegistrationStatus('error');
    }

    function base64UrlToBase64(base64Url) {
      return base64Url.replace(/_/g, '/').replace(/-/g, '+');
    }

    if (typeof options.user.id === 'string') {
      options.user.id = Uint8Array.from(atob(base64UrlToBase64(options.user.id)), (c) => c.charCodeAt(0));
    }

    if (typeof options.challenge === 'string') {
      options.challenge = Uint8Array.from(atob(base64UrlToBase64(options.challenge)), (c) => c.charCodeAt(0));
    }

    try {
      const credential = await navigator.credentials.create({ publicKey: options });

      const credentialJson = {
        id: credential.id,
        rp: { name: 'aitechs' },
        rawId: arrayBufferToBase64Url(credential.rawId),
        type: credential.type,
        response: {
          attestationObject: arrayBufferToBase64Url(credential.response.attestationObject),
          clientDataJSON: arrayBufferToBase64Url(credential.response.clientDataJSON),
        },
        challenge: challenge,
      };

      const createResponse = await fetch('/api/webauthn/create_webauthn_system_admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
          'X-Subdomain-Aitechs': subdomain_aitechs,
        },
        body: JSON.stringify({
          credential: credentialJson,
          email: currentSystemAdmin.email,
          phone_number: currentSystemAdmin.phone_number,
        }),
      });

      const data = await createResponse.json();

      if (createResponse.ok) {
        toast.success('created passkey sucessfully');
        setPasskeyCreated(true);
        setOpenLoad(false);
        setLoading(false);
      } else {
        setOpenLoad(false);
        setLoading(false);
        toast.error(data.error || 'passkey creation failed');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again later2.');
      setOpenLoad(false);
      setLoading(false);
    }
  }

  const changeSystemAdminSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOpenLoad(true);
    const response = await fetch('/api/create_system_admin_settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        login_with_passkey: loginWithPasskey,
        use_email_authentication: useEmailAuthentication,
        use_sms_authentication: usePhoneNumberAuthentication,
      }),
    });

    try {
      if (response.ok) {
        setLoading(false);
        setOpenLoad(false);
        toast.success('Login with passkey has been updated successfully', { duration: 7000, position: 'top-center' });
      } else {
        setLoading(false);
        setOpenLoad(false);
        toast.error('Failed to update login with passkey', { duration: 7000, position: 'top-center' });
      }
    } catch (error) {
      setLoading(false);
      setOpenLoad(false);
      toast.error('Failed to update login with passkey', { duration: 3000, position: 'top-center' });
    }
  };

  useEffect(() => {
    const getSystemAdminSettings = async () => {
      try {
        const response = await fetch('/api/get_system_admin_settings');
        const data = await response.json();
        if (response.ok) {
          const { login_with_passkey } = data[0];
          setLoginWithPasskey(login_with_passkey);
          setUseEmailAuthentication(data[0].use_email_authentication);
          setUsePhoneNumberAuthentication(data[0].use_sms_authentication);
        }
      } catch (error) {}
    };
    getSystemAdminSettings();
  }, []);

  return (
    <div className="font-sans max-w-2xl mx-auto">
      <Toaster />

      {loading && (
        <Backdrop open={openLoad} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Lottie className="relative z-50" options={defaultOptions} height={400} width={400} />
        </Backdrop>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6"
      >
        <img
          src={generateAvatar(systemAdminEmail)}
          alt={`${systemAdminEmail}'s avatar`}
          className="w-16 h-16 rounded-full shrink-0 border border-slate-200 dark:border-slate-700"
        />
        <div className="min-w-0">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">{systemAdminEmail}</p>
          <span className="inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
            System Admin
          </span>
        </div>
      </motion.div>

      {/* Bio */}
      <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          <span className="font-semibold text-slate-900 dark:text-slate-100">Bio:</span> Controller of the
          infrastructure.
        </p>
      </div>

      {/* Security key */}
      <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <FiShield className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Security key</h2>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FiKey className={passkeyCreated ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'} />
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Passkey status</span>
            </div>
            {passkeyCreated && (
              <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                <FiCheck className="w-3.5 h-3.5" /> Registered
              </span>
            )}
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {passkeyCreated
              ? 'Your account is secured with a passkey. You can use it to sign in quickly and securely.'
              : 'Enhance your account security by registering a passkey for passwordless authentication.'}
          </p>

          <button
            type="button"
            onClick={signupWithWebAuthn}
            disabled={passkeyCreated || isRegistering}
            title={passkeyCreated ? 'You already have a registered passkey' : 'Register a new passkey for secure access'}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors
              ${
                passkeyCreated
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20'
              }`}
          >
            {isRegistering ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-700 dark:border-emerald-400" />
                <span>
                  {registrationStatus === 'starting'
                    ? 'Initializing...'
                    : registrationStatus === 'authenticating'
                    ? 'Verify on your device...'
                    : registrationStatus === 'success'
                    ? 'Successfully registered!'
                    : registrationStatus === 'error'
                    ? 'Registration failed'
                    : 'Processing...'}
                </span>
              </>
            ) : (
              <>
                <FiKey className="w-4 h-4" />
                <span>{passkeyCreated ? 'Passkey registered' : 'Register passkey'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Sign-in preferences */}
      <form onSubmit={changeSystemAdminSettings}>
        <div className="mt-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 sm:p-6">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Sign-in preferences</h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Choose how you verify it's you at login</p>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            <ToggleRow
              icon={FiKey}
              label="Login with passkey"
              description="Sign in without a password"
              checked={loginWithPasskey}
              onChange={handleChangePasskey}
            />
            <ToggleRow
              icon={FiSmartphone}
              label="SMS authentication"
              description="Get a one-time code by text"
              checked={usePhoneNumberAuthentication}
              onChange={handleChangePhoneNumberAuth}
            />
            <ToggleRow
              icon={FiMail}
              label="Email authentication"
              description="Get a one-time code by email"
              checked={useEmailAuthentication}
              onChange={handleChangeEmailAuth}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
          >
            Save changes
          </button>
          <button
            type="button"
            onClick={() => console.log('Logout')}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-red-200 dark:border-red-900 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 text-sm font-medium transition-colors"
          >
            Log out
          </button>
        </div>
      </form>
    </div>
  );
};

export default SystemAdminProfile;