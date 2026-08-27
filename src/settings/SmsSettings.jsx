import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Grid, InputAdornment } from '@mui/material';
import Backdrop from '../backdrop/Backdrop';
import UiLoader from '../uiloader/UiLoader';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { IoIosKey } from 'react-icons/io';
import { FaIdBadge } from 'react-icons/fa6';
import { FaRegIdCard } from 'react-icons/fa6';
import { LiaUserSecretSolid } from 'react-icons/lia';
import { TbCircleDashedNumber4 } from 'react-icons/tb';
import { MdTextsms } from 'react-icons/md';
import { RefreshCw, Save, MessageSquare, Wallet, FileText } from 'lucide-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import OwitechBulkSmsPanel from './OwitechBulkSmsPanel';

const SettingsNotification = lazy(() => import('../notification/SettingsNotification'));

// ─── Design tokens (shared with GeneralSettings) ──────────────────────────────
const tokens = {
  radius: '12px',
  radiusSm: '8px',
  border: '1px solid',
  transition: 'all 0.18s ease',
};

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: tokens.radiusSm,
    transition: tokens.transition,
    '& fieldset': { borderColor: 'divider' },
    '&:hover fieldset': { borderColor: 'text.secondary' },
    '&.Mui-focused fieldset': { borderColor: 'primary.main', borderWidth: '1.5px' },
  },
  '& label.Mui-focused': { color: 'primary.main' },
  '& .MuiFormHelperText-root': { fontSize: '0.75rem', marginTop: '4px', lineHeight: 1.5 },
};

const cssVars = `
  :root { --divider: rgba(0,0,0,0.08); --text-secondary: #6b7280; --text-tertiary: #9ca3af; }
  .dark { --divider: rgba(255,255,255,0.1); --text-secondary: #9ca3af; --text-tertiary: #6b7280; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

// ─── Shared components ────────────────────────────────────────────────────────

const SectionLabel = ({ children }) => (
  <div style={{ margin: '24px 0 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{ flex: 1, height: '1px', background: 'var(--divider)' }} />
    <span style={{
      fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em',
      textTransform: 'uppercase', color: 'var(--text-tertiary)', whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
    <div style={{ flex: 1, height: '1px', background: 'var(--divider)' }} />
  </div>
);

const InfoBox = ({ children, variant = 'info' }) => {
  const colors = {
    info:    { bg: 'rgba(59,130,246,0.06)',  border: 'rgba(59,130,246,0.2)' },
    neutral: { bg: 'rgba(107,114,128,0.06)', border: 'rgba(107,114,128,0.18)' },
  };
  const c = colors[variant] || colors.info;
  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: tokens.radiusSm, padding: '10px 14px',
      fontSize: '0.8125rem', lineHeight: 1.6,
    }}>
      {children}
    </div>
  );
};

const SaveButton = ({ children = 'Save settings', loading = false, type = 'submit', onClick }) => (
  <motion.button
    type={type}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    disabled={loading}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '9px 22px', fontSize: '0.875rem', fontWeight: 500,
      color: '#fff', background: loading ? '#6b7280' : '#1a1a1a',
      border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer',
      letterSpacing: '0.01em', transition: 'background 0.15s',
    }}
    onMouseEnter={e => { if (!loading) e.currentTarget.style.background = '#2563eb'; }}
    onMouseLeave={e => { if (!loading) e.currentTarget.style.background = '#1a1a1a'; }}
  >
    {loading
      ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
      : <Save size={14} />}
    {loading ? 'Saving…' : children}
  </motion.button>
);

// ─── Card wrapper ─────────────────────────────────────────────────────────────
const Card = ({ children, style = {} }) => (
  <div style={{
    border: '1px solid var(--divider)',
    borderRadius: tokens.radius,
    padding: '24px',
    marginBottom: '12px',
    ...style,
  }}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, iconClass = '', title, description }) => (
  <div style={{ marginBottom: description ? 16 : 20 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: description ? 6 : 0 }}>
      <Icon style={{ width: 18, height: 18, flexShrink: 0 }} className={iconClass} />
      <span style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{title}</span>
    </div>
    {description && (
      <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55, paddingLeft: 28 }}>
        {description}
      </p>
    )}
  </div>
);

// ─── Provider options ─────────────────────────────────────────────────────────
const PROVIDER_OPTIONS = [
  { label: 'SMS Leopard',    value: 'SMS leopard' },
  { label: 'Africa\'s Talking', value: 'Africastalking' },
  { label: 'Advanta',        value: 'Advanta' },
  { label: 'Mobitech Bulk',  value: 'Mobitech Bulk' },
  { label: 'Afrokatt',       value: 'Afrokatt' },
  { label: 'Talk Sasa',      value: 'Talk Sasa' },
  { label: 'Afrinet',        value: 'Afrinet' },
  { label: 'EgoSMS',         value: 'EgoSMS' },
  { label: 'BlessedTexts',   value: 'BlessedTexts' },
  { label: 'TextSms',        value: 'TextSms' },
  { label: 'Mobiweb',        value: 'Mobiweb' },
  { label: 'Mobivas',        value: 'Mobivas' },
  { label: 'MoveSMS',        value: 'MoveSMS' },
  { label: 'HostPinnacle',   value: 'HostPinnacle' },
  { label: 'Bytewave',       value: 'Bytewave' },
  { label: 'CrowdComm',      value: 'CrowdComm' },
  { label: 'Ujumbe',         value: 'Ujumbe' },
];

// The platform-managed option — not a real credential provider, so it's
// handled entirely outside PROVIDER_OPTIONS/renderProviderFields.
const PROVIDER_MODE_PLATFORM = 'Owitech Bulk SMS';

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsDark(root.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);
  return isDark;
}

// ─── Component ────────────────────────────────────────────────────────────────
const SmsSettings = () => {
  const {
    isloading, setisloading,
    selectedProvider, setSelectedProvider,
    smsSettingsForm, setSmsSettingsForm,
    smsBalance, setSmsBalance,
    providerSms, setProviderSms,
  } = useApplicationSettings();

  const [open, setOpen] = useState(false);
  const [openNotifactionSettings, setOpenSettings] = useState(false);
  const [smsSettingId, setSmsSettingId] = useState(null);
  const [smsTemplates, setSmsTemplates] = useState({ send_voucher_template: '', voucher_template: '' });
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [savingTemplates, setSavingTemplates] = useState(false);
  const [savingCredentials, setSavingCredentials] = useState(false);

  // ── Provider mode: platform-managed vs bring-your-own-credentials ─────────
  const [providerMode, setProviderMode] = useState(
    selectedProvider === PROVIDER_MODE_PLATFORM ? 'platform' : 'custom'
  );
  const [switchingMode, setSwitchingMode] = useState(false);

  useEffect(() => {
    setProviderMode(selectedProvider === PROVIDER_MODE_PLATFORM ? 'platform' : 'custom');
  }, [selectedProvider]);

  const subdomain = window.location.hostname.split('.')[0];
  const { api_key, api_secret, sender_id, short_code, partnerID, username } = smsSettingsForm;
  const { send_voucher_template, voucher_template } = smsTemplates;

  const isDark = useIsDarkMode();
  const muiTheme = {
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: { main: '#2563eb' },
      background: { paper: isDark ? '#1c1c1e' : '#ffffff', default: isDark ? '#111113' : '#f9f9fb' },
      text: { primary: isDark ? '#f0f0f0' : '#111827', secondary: isDark ? '#a3a3a3' : '#6b7280' },
    },
    shape: { borderRadius: 8 },
  };

  // ── API calls ────────────────────────────────────────────────────────────────

  const handleGetSmsProviderSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/sms_provider_settings', {
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) setProviderSms(newData[0].sms_provider);
      else {
        if (response.status === 402) setTimeout(() => { window.location.href = '/license-expired'; }, 1800);
        if (response.status === 401) setTimeout(() => { window.location.href = '/signin'; }, 1900);
      }
    } catch {}
  }, []);

  useEffect(() => { handleGetSmsProviderSettings(); }, [handleGetSmsProviderSettings]);

  const getSmsBalance = useCallback(async () => {
    try {
      const response = await fetch(`/api/get_sms_balance?selected_provider=${providerSms}`, {
        headers: { 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) setSmsBalance(newData.message);
      else toast.error('Failed to fetch SMS balance', { duration: 3000, position: 'top-center' });
    } catch {
      toast.error('Failed to fetch SMS balance', { duration: 3000, position: 'top-center' });
    }
  }, []);

  useEffect(() => { if (selectedProvider) getSmsBalance(selectedProvider); }, [getSmsBalance, selectedProvider]);

  const fetchSavedSmsSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/saved_sms_settings', {
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      });
      const data = await response.json();
      const newData = data.length > 0
        ? data.reduce((latest, item) => new Date(item.sms_setting_updated_at) > new Date(latest.sms_setting_updated_at) ? item : latest, data[0])
        : null;
      if (response.ok && newData) {
        const { api_key, api_secret, sender_id, short_code, sms_provider, partnerID, username } = newData;
        setSmsSettingId(newData.id);
        setSmsSettingsForm({ api_key, api_secret, sender_id, short_code, partnerID, username });
        setSelectedProvider(sms_provider);
      }
    } catch {
      toast.error('Failed to fetch SMS settings', { duration: 3000, position: 'top-center' });
    }
  }, []);

  useEffect(() => { fetchSavedSmsSettings(); }, [fetchSavedSmsSettings]);

  const fetchSmsSettings = useCallback(async () => {
    try {
      const response = await fetch(`/api/sms_settings?provider=${selectedProvider}`, {
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) {
        if (!newData || newData.length === 0 || !newData.sms_provider) {
          setSmsSettingsForm({ api_key: '', api_secret: '', sender_id: '', short_code: '', partnerID: '', username: '' });
        } else {
          const { api_key, api_secret, sender_id, short_code, partnerID, username } = newData;
          setSmsSettingsForm({ api_key: api_key || '', api_secret: api_secret || '', sender_id: sender_id || '', short_code: short_code || '', partnerID: partnerID || '', username: username || '' });
        }
      }
    } catch {
      toast.error('Failed to fetch SMS settings', { duration: 3000, position: 'top-center' });
    }
  }, [selectedProvider, setSmsSettingsForm, subdomain]);

  // Only fetch credential-shaped settings when we're actually in custom-provider
  // mode — the platform mode has no credentials to fetch.
  useEffect(() => {
    if (selectedProvider && selectedProvider !== PROVIDER_MODE_PLATFORM) fetchSmsSettings();
  }, [fetchSmsSettings, selectedProvider]);

  const saveSmsSettings = async e => {
    e.preventDefault();
    setSavingCredentials(true);
    setOpen(true);
    try {
      const response = await fetch('/api/sms_settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ api_key, sms_setting_id: smsSettingId, api_secret, sender_id, short_code, sms_provider: selectedProvider, partnerID, username }),
      });
      const newData = await response.json();
      if (response.ok) {
        setSavingCredentials(false);
        const { api_key: k, api_secret: s, sender_id: sid, short_code: sc, partnerID: pid, username: u } = newData;
        setSelectedProvider(newData.sms_provider);
        setSmsSettingsForm({ ...smsSettingsForm, api_key: k, api_secret: s, sender_id: sid, short_code: sc, partnerID: pid, username: u });
        setOpenSettings(true); setOpen(false);
        toast.success('SMS credentials saved', { duration: 3000, position: 'top-center' });
      } else {
        setSavingCredentials(false);
        setOpen(false);
        if (response.status === 402) setTimeout(() => { window.location.href = '/license-expired'; }, 1800);
        if (response.status === 401) setTimeout(() => { window.location.href = '/signin'; }, 1900);
        toast.error('Failed to save SMS credentials', { duration: 3000, position: 'top-center' });
      }
    } catch {
      setSavingCredentials(false); setOpen(false);
      toast.error('Failed to save SMS credentials', { duration: 2000, position: 'top-center' });
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setSmsSettingsForm(prev => ({ ...prev, [name]: value }));
  };

  const getSmsTemplate = useCallback(async () => {
    try {
      const response = await fetch('/api/sms_templates');
      const newData = await response.json();
      if (response.ok) {
        const { send_voucher_template, voucher_template } = newData[0];
        setSmsTemplates(prev => ({ ...prev, send_voucher_template, voucher_template }));
      } else {
        if (response.status === 402) setTimeout(() => { window.location.href = '/license-expired'; }, 1800);
        if (response.status === 401) setTimeout(() => { window.location.href = '/signin'; }, 1900);
        toast.error('Failed to fetch SMS templates', { duration: 3000, position: 'top-center' });
      }
    } catch {
      toast.error('Failed to fetch SMS templates', { duration: 2000, position: 'top-center' });
    }
  }, []);

  useEffect(() => { getSmsTemplate(); }, [getSmsTemplate]);

  const saveSmsTemplate = async e => {
    e.preventDefault();
    setSavingTemplates(true);
    try {
      const response = await fetch('/api/sms_templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ send_voucher_template: smsTemplates.send_voucher_template, voucher_template: smsTemplates.voucher_template }),
      });
      const newData = await response.json();
      setSavingTemplates(false);
      if (response.ok) {
        setSmsTemplates(prev => ({ ...prev, send_voucher_template: newData.send_voucher_template, voucher_template: newData.voucher_template }));
        toast.success('Templates saved', { duration: 3000, position: 'top-center' });
      } else {
        toast.error('Failed to save templates', { duration: 3000, position: 'top-center' });
      }
    } catch {
      setSavingTemplates(false);
      toast.error('Failed to save templates', { duration: 3000, position: 'top-center' });
    }
  };

  const handleClose = () => setOpen(false);
  const handleCloseNotifaction = () => setOpenSettings(false);

  // ── Provider mode switch handlers ──────────────────────────────────────────
  const handleUsePlatformSms = async () => {
    setSwitchingMode(true);
    try {
      const response = await fetch('/api/sms_settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
        body: JSON.stringify({ sms_setting_id: smsSettingId, sms_provider: PROVIDER_MODE_PLATFORM }),
      });
      const newData = await response.json();
      if (response.ok) {
        setSmsSettingId(newData.id ?? smsSettingId);
        setSelectedProvider(PROVIDER_MODE_PLATFORM);
        setProviderMode('platform');
        toast.success('Owitech Bulk SMS activated', { duration: 2500, position: 'top-center' });
      } else {
        toast.error('Failed to switch provider', { duration: 2500, position: 'top-center' });
      }
    } catch {
      toast.error('Failed to switch provider', { duration: 2500, position: 'top-center' });
    } finally {
      setSwitchingMode(false);
    }
  };

  const handleUseCustomProvider = () => {
    setProviderMode('custom');
    setSelectedProvider('');
    setSmsSettingsForm({ api_key: '', api_secret: '', sender_id: '', short_code: '', partnerID: '', username: '' });
  };

  // ── Provider-specific fields ───────────────────────────────────────────────
  const renderProviderFields = () => {
    if (!selectedProvider) return null;

    const fields = [];

    if (selectedProvider === 'TextSms') {
      fields.push(
        <Grid key="partnerID" item xs={12} sm={6}>
          <TextField {...tf} label="Partner ID" name="partnerID" value={partnerID} onChange={handleChange}
          className='myTextField'
            InputProps={{ startAdornment: <InputAdornment position="start"><FaIdBadge style={{ color: 'var(--text-secondary)' }} /></InputAdornment> }} />
        </Grid>
      );
    }

    if (selectedProvider === 'SMS leopard') {
      fields.push(
        <Grid key="api_secret" item xs={12} sm={6}>
          <TextField {...tf} label="API secret" name="api_secret" value={api_secret} onChange={handleChange}
          className='myTextField'
            InputProps={{ startAdornment: <InputAdornment position="start"><LiaUserSecretSolid style={{ color: 'var(--text-secondary)' }} /></InputAdornment> }} />
        </Grid>
      );
    }

    if (selectedProvider === 'Africastalking') {
      fields.push(
        <Grid key="username" item xs={12} sm={6}>
          <TextField {...tf} label="Username" name="username" value={username} onChange={handleChange}
          className='myTextField'
            InputProps={{ startAdornment: <InputAdornment position="start"><LiaUserSecretSolid style={{ color: 'var(--text-secondary)' }} /></InputAdornment> }} />
        </Grid>,
        <Grid key="short_code" item xs={12} sm={6}>
          <TextField {...tf} label="Short code" name="short_code" value={short_code} onChange={handleChange}
          className='myTextField'
            InputProps={{ startAdornment: <InputAdornment position="start"><TbCircleDashedNumber4 style={{ color: 'var(--text-secondary)' }} /></InputAdornment> }} />
        </Grid>
      );
    }

    return fields;
  };

  const tf = { sx: { ...fieldSx, width: '100%' } };

  return (
    <>
      <style>{cssVars}</style>
      <ThemeProvider theme={createTheme(muiTheme)}>
        <Toaster toastOptions={{ style: { fontSize: '0.875rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }} />
        <Backdrop handleClose={handleClose} open={open} />
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
          <RefreshCw style={{ animation: 'spin 1s linear infinite', color: '#3b82f6', width: 28, height: 28 }} /></div>}>
          <SettingsNotification open={openNotifactionSettings} handleClose={handleCloseNotifaction} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* ── SMS balance strip (custom-provider mode only) ──────────────── */}
            {providerMode === 'custom' && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px',
                border: '1px solid var(--divider)',
                borderRadius: tokens.radius,
                gap: 16,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Wallet size={16} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>SMS balance</span>
                </div>
                <span style={{ fontSize: '0.9375rem', fontWeight: 500 }}>
                  {smsBalance ?? <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic', fontSize: '0.8125rem' }}>Not loaded</span>}
                </span>
              </div>
            )}

            {/* ── Provider mode switch ────────────────────────────────────────── */}
            <Card>
              <CardHeader
                icon={AccountBalanceWalletIcon}
                title="How do you want to send SMS?"
                description="Choose a managed option with no setup, or connect your own provider."
              />
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleUsePlatformSms}
                  disabled={switchingMode}
                  style={{
                    flex: '1 1 220px', textAlign: 'left', padding: '14px 16px',
                    borderRadius: tokens.radiusSm,
                    border: providerMode === 'platform' ? '2px solid #2563eb' : '1px solid var(--divider)',
                    background: providerMode === 'platform' ? 'rgba(37,99,235,0.06)' : 'transparent',
                    cursor: switchingMode ? 'not-allowed' : 'pointer',
                    opacity: switchingMode ? 0.7 : 1,
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Owitech Bulk SMS</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    No API keys. Buy credits, we handle delivery.
                  </div>
                </button>
                <button
                  type="button"
                  onClick={handleUseCustomProvider}
                  style={{
                    flex: '1 1 220px', textAlign: 'left', padding: '14px 16px',
                    borderRadius: tokens.radiusSm,
                    border: providerMode === 'custom' ? '2px solid #2563eb' : '1px solid var(--divider)',
                    background: providerMode === 'custom' ? 'rgba(37,99,235,0.06)' : 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Custom provider</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                    Use your own SMS Leopard, TextSMS, Africa's Talking, etc. account.
                  </div>
                </button>
              </div>
            </Card>

            {providerMode === 'platform' ? (
              <OwitechBulkSmsPanel subdomain={subdomain} />
            ) : (
              <>
                {/* ── Provider credentials ───────────────────────────────────────── */}
                <form onSubmit={saveSmsSettings}>
                  <Card>
                    <CardHeader
                      icon={MdTextsms}
                      iconClass="text-green-500"
                      title="Provider credentials"
                      description="Select your SMS provider and enter the credentials from their dashboard."
                    />

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Autocomplete
                          options={PROVIDER_OPTIONS}
                          value={PROVIDER_OPTIONS.find(o => o.value === selectedProvider) || null}
                          onChange={(_, newValue) => setSelectedProvider(newValue?.value || '')}
                          getOptionLabel={o => o.label}
                          disableClearable
                          isOptionEqualToValue={(o, v) => o.value === v.value}
                          renderInput={params => (
                            <TextField
                            className='myTextField'
                              {...params}
                              label="Provider"
                              sx={fieldSx}
                              InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                  <>
                                    <InputAdornment position="start">
                                      <MdTextsms style={{ color: 'var(--text-secondary)' }} />
                                    </InputAdornment>
                                    {params.InputProps.startAdornment}
                                  </>
                                ),
                              }}
                            />
                          )}
                          renderOption={(props, option) => (
                            <li {...props} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px' }}>
                              <MdTextsms style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
                              <span style={{ fontSize: '0.875rem' }}>{option.label}</span>
                            </li>
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <TextField {...tf} label="API key" name="api_key" value={api_key}
                        className='myTextField'
                        onChange={handleChange}
                          InputProps={{ startAdornment: <InputAdornment position="start"><IoIosKey 
                          style={{ color: 'var(--text-secondary)' }} /></InputAdornment> }} />
                      </Grid>

                      {renderProviderFields()}

                      <Grid item xs={12} sm={6}>
                        <TextField {...tf} label="Sender ID" name="sender_id" value={sender_id} 
                        onChange={handleChange} className='myTextField'
                          InputProps={{ startAdornment: <InputAdornment position="start"><FaRegIdCard
                           style={{ color: 'var(--text-secondary)' }} /></InputAdornment> }} />
                      </Grid>
                    </Grid>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                      <SaveButton loading={savingCredentials}>Save credentials</SaveButton>
                    </div>
                  </Card>
                </form>
              </>
            )}

          
            {/* ── PPPoE welcome message ──────────────────────────────────────── */}
            {/* <Card>
              <CardHeader
                icon={MessageSquare}
                title="PPPoE subscriber welcome message"
                description="Sent to new PPPoE subscribers when their account is created."
              />
              <TextField
                {...tf}
                multiline
                rows={4}
                className='myTextField'
                label="Welcome message"
                value={welcomeMessage}
                onChange={e => setWelcomeMessage(e.target.value)}
                placeholder="Hi {{name}}, your account has been created…"
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <SaveButton onClick={e => { e.preventDefault();  }}>
                  Save message
                </SaveButton>
              </div>
            </Card> */}

          </div>
        </Suspense>
      </ThemeProvider>
    </>
  );
};

export default SmsSettings;