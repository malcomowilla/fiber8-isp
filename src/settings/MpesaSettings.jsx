import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { motion, AnimatePresence } from "framer-motion";
import {
  VpnKey,
  Payment,
  Business,
  Lock,
  Phone,
  Info,
} from "@mui/icons-material";
import { useEffect, useState, useCallback, lazy } from "react";
import { useApplicationSettings } from '../settings/ApplicationSettings';
import toast, { Toaster } from 'react-hot-toast';
const SettingsNotification = lazy(() => import('../notification/SettingsNotification'));
import Backdrop from '../backdrop/Backdrop';
import { Autocomplete } from '@mui/material';
import { CiUser } from "react-icons/ci";

const MUI_FOCUS = {
  "& label.Mui-focused": { color: "black", fontSize: "16px" },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "black", borderWidth: "3px" },
    "&.Mui-focused fieldset": { borderColor: "black" },
  },
};

const MpesaSettings = () => {
  const {
    selectedAccountTypeHotspot, setSelectedAccountTypeHotspot,
    hotspotMpesaSettings, setHotspotMpesaSettings,
    selectedAccountTypeSubscriber, setSelectedAccountTypeSubscriber,
    dialMpesaSettings, setDialMpesaSettings,
  } = useApplicationSettings();

  const { consumer_key, consumer_secret, passkey, short_code,
    api_initiator_username, api_initiator_password, phone_number } = hotspotMpesaSettings;

  const [open, setOpen]                     = useState(false);
  const [openNotifactionSettings, setOpenSettings] = useState(false);
  const [isloading, setisloading]           = useState(false);
  const [loadRegisterUrls, setLoadRegisterUrls] = useState(false);

  // ── "I don't have API keys" toggle ──────────────────────────────────────
  const [noApiKeys, setNoApiKeys] = useState(false);

  const subdomain = window.location.hostname.split('.')[0];





  // ── Fetch hotspot M-Pesa settings ────────────────────────────────────────
  const fetchHotspotMpesaSettings = useCallback(async () => {
    try {
      const res = await fetch(`/api/hotspot_mpesa_settings?account_type=${selectedAccountTypeHotspot}`, {
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      });
      const newData = await res.json();
      if (res.ok) {
        const { consumer_key, consumer_secret, passkey, short_code,
          api_initiator_username, 
          api_initiator_password, phone_number, no_api_keys } = newData[0];
        setHotspotMpesaSettings(prev => ({
          ...prev, consumer_key, consumer_secret, passkey, short_code,
          api_initiator_username, api_initiator_password, phone_number,
        }));

setNoApiKeys(no_api_keys)
        // Auto-enable "no API keys" mode if only phone_number is set
        // if (phone_number && !consumer_key) setNoApiKeys(true);
      }
    } catch (_) {
      toast.error('Failed to load M-Pesa settings', { position: 'top-center' });
    }
  }, [selectedAccountTypeHotspot]);

  useEffect(() => {
    fetchHotspotMpesaSettings();
  }, [fetchHotspotMpesaSettings, selectedAccountTypeHotspot]);


useEffect(() => {
  if (noApiKeys === false) {
   fetchHotspotMpesaSettings()
  }
}, [fetchHotspotMpesaSettings]);


  
  const saveHotspotMpesaSettings = async (e) => {
    e.preventDefault();
    try {
      setisloading(true); setOpen(true);
      const res = await fetch('/api/hotspot_mpesa_settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({
          // When "no API keys" mode is on, send only phone_number — omit API fields
          ...(noApiKeys
            ? { phone_number }
            : { consumer_key, consumer_secret, passkey, short_code,
                api_initiator_username, api_initiator_password,
                account_type: selectedAccountTypeHotspot }),
          phone_number,
          no_api_keys: noApiKeys,
        }),
      });
      const newData = await res.json();
      if (res.status === 402) { setTimeout(() => { window.location.href = '/license-expired'; }, 1800); return; }
      if (res.ok) {
        setisloading(false); setOpen(false); setOpenSettings(true);
        toast.success('M-Pesa settings saved', { duration: 3000, position: 'top-center' });
        setHotspotMpesaSettings(prev => ({ ...prev, ...newData }));
      } else {
        setOpen(false); setisloading(false);
        toast.error('Failed to save M-Pesa settings', { position: 'top-center' });
      }
    } catch (_) {
      setisloading(false); setOpen(false);
      toast.error('Something went wrong. Please try again.', { position: 'top-center' });
    }
  };

  const handleChangeMPesaHotspotSettings = (e) => {
    const { type, name, checked, value } = e.target;
    setHotspotMpesaSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const registerUrls = async () => {
    try {
      setLoadRegisterUrls(true);
      const res = await fetch('/api/register_urls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      });
      const newData = await res.json();
      if (res.ok) toast.success('M-Pesa URLs registered', { duration: 4000, position: 'top-center' });
      else toast.error(newData.error || 'Failed to register URLs', { position: 'top-center' });
    } catch (e) {
      toast.error(String(e), { position: 'top-center' });
    } finally {
      setLoadRegisterUrls(false);
    }
  };

  return (
    <>
      <Toaster />
      <Backdrop handleClose={() => setOpen(false)} open={open} />
      <SettingsNotification open={openNotifactionSettings}
       handleClose={() => setOpenSettings(false)} />

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mt-10 min-h-screen p-6"
      >
        

          {/* ── Page header ── */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-xl font-semibold flex items-center gap-2">
              <Payment /> M-Pesa Settings
            </p>
            <button type="button" onClick={registerUrls}
              className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm font-medium hover:bg-green-200 transition-colors">
              {loadRegisterUrls ? 'Registering…' : 'Register URLs'}
            </button>
          </div>

          <form onSubmit={saveHotspotMpesaSettings} className="space-y-6">

            {/* ── "No API keys" checkbox ── */}
            <div className="p-4 rounded-2xl border"
              style={{ background: noApiKeys ? 'rgba(251,191,36,.05)' : 'rgba(148,163,184,.04)',
                borderColor: noApiKeys ? 'rgba(251,191,36,.3)' : 'rgba(148,163,184,.15)' }}>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={noApiKeys}
                    onChange={e => setNoApiKeys(e.target.checked)}
                    sx={{
                      color: '#ca8a04',
                      '&.Mui-checked': { color: '#ca8a04' },
                    }}
                  />
                }
                label={
                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                    I am using a <strong>Till number</strong>, <strong>Paybill</strong>,{' '}
                    or <strong>phone number</strong> — without Safaricom API keys
                  </span>
                }
              />

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8 leading-relaxed">
                Check this if you do not have a Safaricom developer account (consumer key / secret / passkey).
                You will provide your M-Pesa phone number below and payments will be collected
                through our Paybill on your behalf. A <strong>1% transaction fee</strong> is deducted
                and the remainder is sent to your phone number.
              </p>
            </div>

            {/* ── API fields — hidden when noApiKeys is checked ── */}
            <AnimatePresence initial={false}>
              {!noApiKeys && (
                <motion.div
                  key="api-fields"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden space-y-1"
                >
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Safaricom API Credentials
                  </p>

                  <Box sx={{ "& .MuiTextField-root": { m: 1, width: "100%" }, ...MUI_FOCUS }} noValidate>
                    <TextField onChange={handleChangeMPesaHotspotSettings}
                      name="short_code" value={short_code || ''} className="myTextField" label="Short Code"
                      InputProps={{ startAdornment: <Business className="mr-2" /> }} />

                    <TextField onChange={handleChangeMPesaHotspotSettings}
                      name="consumer_key" value={consumer_key || ''} className="myTextField" label="Consumer Key"
                      InputProps={{ startAdornment: <VpnKey className="mr-2" /> }} />

                    <TextField onChange={handleChangeMPesaHotspotSettings}
                      name="consumer_secret" value={consumer_secret || ''} className="myTextField" label="Consumer Secret"
                      InputProps={{ startAdornment: <Lock className="mr-2" /> }} />

                    <TextField onChange={handleChangeMPesaHotspotSettings}
                      name="passkey" value={passkey || ''} className="myTextField" label="Pass Key"
                      InputProps={{ startAdornment: <VpnKey className="mr-2" /> }} />
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Phone number — shown when noApiKeys is checked ── */}
            <AnimatePresence initial={false}>
              {noApiKeys && (
                <motion.div
                  key="phone-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  {/* Yellow info strip */}
                  <div className="rounded-2xl overflow-hidden border mb-4"
                    style={{ borderColor: 'rgba(251,191,36,.2)' }}>
                    <div className="px-4 py-3 flex items-start gap-3"
                      style={{ background: 'rgba(251,191,36,.08)', borderBottom: '1px solid rgba(251,191,36,.15)' }}>
                      <Payment style={{ fontSize: 18, color: '#ca8a04', flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p className="font-semibold text-sm text-yellow-700 dark:text-yellow-400 mb-0.5">
                          Payments collected via our Paybill
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                          Since you don't have Safaricom API keys, your customers will pay through our
                          platform Paybill. We deduct a <strong>1% transaction fee</strong> and
                          M-Pesa the rest to the phone number you enter below.
                        </p>
                      </div>
                    </div>

                    <div className="px-4 py-4">
                      <Box sx={{ "& .MuiTextField-root": { m: 0, width: "100%" }, ...MUI_FOCUS }}>
                        <TextField
                          onChange={handleChangeMPesaHotspotSettings}
                          name="phone_number"
                          value={phone_number || ''}
                          className="myTextField"
                          label="Your M-Pesa Phone Number"
                          placeholder="e.g. 0712 345 678"
                          InputProps={{ startAdornment: <Phone className="mr-2" style={{ color: '#ca8a04' }} /> }}
                        />
                      </Box>
                    </div>
                  </div>

                  {/* B2B coming soon notice */}
                  <div className="flex items-start gap-3 p-4 rounded-2xl"
                    style={{ background: 'rgba(99,102,241,.06)', border: '1px solid rgba(99,102,241,.18)' }}>
                    <Info style={{ fontSize: 18, color: '#818cf8', flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p className="text-sm font-semibold mb-1" style={{ color: '#818cf8' }}>
                        🔜 Direct B2B Paybill / Till — coming soon
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        If you have your own Paybill or Till number but <em>no</em> Safaricom API credentials,
                        direct integration is not currently possible — M-Pesa B2B requires API access.
                        Once we enable B2B support, you will be able to point payments straight to your
                        Paybill or Till with zero API setup, giving your customers a fully branded payment
                        experience under your business name. Until then, use the phone number option above.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Save button ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <button type="submit"
                className="w-full p-3 border rounded-sm dark:border-teal-500 dark:text-blue-300
                  border-gray-800 hover:bg-green-500 hover:text-white transition-all duration-300">
                {isloading ? 'Saving…' : 'Save Settings'}
              </button>
            </motion.div>

          </form>
      </motion.div>
    </>
  );
};

export default MpesaSettings;