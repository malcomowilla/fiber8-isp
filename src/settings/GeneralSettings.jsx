import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Backdrop from '../backdrop/Backdrop'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import AlertTitle from '@mui/material/AlertTitle';
import Autocomplete from '@mui/material/Autocomplete';
import { useDebounce } from 'use-debounce';
import { motion } from "framer-motion";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { FaRegBuilding } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { MdOutlinePhonelinkSetup } from "react-icons/md";
import { GrRobot } from "react-icons/gr";
import { useApplicationSettings } from './ApplicationSettings';
import toast, { Toaster } from 'react-hot-toast';
import { FiUsers } from "react-icons/fi";
import { BsRouter } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { FaPhone } from "react-icons/fa";
import { MdTextsms } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import {
  Title as TitleIcon,
  AccessTime as AccessTimeIcon,
  Public as PublicIcon,
  Security as SecurityIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { Grid, InputAdornment, Divider, Chip } from '@mui/material';
import { RefreshCw } from 'lucide-react';
import { FaWifi } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {useState, useEffect, useCallback, useMemo, createContext, Suspense, lazy} from 'react'




const SettingsNotification = lazy(() => import('../notification/SettingsNotification'))

// ─── Design tokens ────────────────────────────────────────────────────────────
const tokens = {
  radius: '12px',
  radiusSm: '8px',
  border: '1px solid',
  transition: 'all 0.18s ease',
  shadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
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
  '& .MuiFormHelperText-root': { fontSize: '0.75rem', marginTop: '4px', lineHeight: 1.4 },
};

const accordionSx = {
  background: 'transparent',
  boxShadow: 'none',
  border: tokens.border,
  borderColor: 'divider',
  borderRadius: `${tokens.radius} !important`,
  mb: 1.5,
  '&:before': { display: 'none' },
  '&.Mui-expanded': { mt: 0 },
};

const accordionSummarySx = {
  px: 2.5,
  py: 0.5,
  minHeight: '56px !important',
  borderRadius: tokens.radius,
  '&.Mui-expanded': { borderRadius: `${tokens.radius} ${tokens.radius} 0 0` },
  '& .MuiAccordionSummary-content': { my: '14px !important' },
};

const accordionDetailsSx = {
  px: 3,
  pt: 2,
  pb: 3,
  borderTop: tokens.border,
  borderColor: 'divider',
};

// ─── Section header icon+label ────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, iconClass = '', label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <Icon style={{ width: 18, height: 18 }} className={iconClass} />
    <span style={{ fontWeight: 500, fontSize: '0.9375rem' }}>{label}</span>
  </div>
);

// ─── Checkbox row with label + description ────────────────────────────────────
const SettingsCheckbox = ({ label, description, checked, onChange, name }) => (
  <div style={{ marginBottom: '8px' }}>
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          name={name}
          size="small"
          sx={{
            color: 'text.secondary',
            '&.Mui-checked': { color: 'primary.main' },
            padding: '6px 8px 6px 9px',
          }}
        />
      }
      label={
        <div>
          <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4 }}>{label}</p>
          {description && (
            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {description}
            </p>
          )}
        </div>
      }
      sx={{ alignItems: 'flex-start', mb: 0 }}
    />
  </div>
);

// ─── Section divider with label ───────────────────────────────────────────────
const SectionLabel = ({ children }) => (
  <div style={{ margin: '24px 0 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{ flex: 1, height: '1px', background: 'var(--divider)' }} />
    <span style={{ fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
      {children}
    </span>
    <div style={{ flex: 1, height: '1px', background: 'var(--divider)' }} />
  </div>
);

// ─── Info box ─────────────────────────────────────────────────────────────────
const InfoBox = ({ children, variant = 'info' }) => {
  const colors = {
    info: { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.2)', text: 'inherit' },
    warning: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.25)', text: 'inherit' },
  };
  const c = colors[variant] || colors.info;
  return (
    <div style={{
      background: c.bg,
      border: `1px solid ${c.border}`,
      borderRadius: tokens.radiusSm,
      padding: '10px 14px',
      marginTop: '12px',
      fontSize: '0.8125rem',
      lineHeight: 1.55,
      color: c.text,
    }}>
      {children}
    </div>
  );
};

// ─── Save button ──────────────────────────────────────────────────────────────
const SaveButton = ({ children = 'Save settings', loading = false, type = 'submit', onClick }) => (
  <motion.button
    type={type}
    onClick={onClick}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '7px',
      padding: '9px 22px',
      fontSize: '0.875rem',
      fontWeight: 500,
      color: '#fff',
      background: '#1a1a1a',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      marginTop: '20px',
      letterSpacing: '0.01em',
      transition: 'background 0.15s',
    }}
    onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; }}
    onMouseLeave={e => { e.currentTarget.style.background = '#1a1a1a'; }}
    disabled={loading}
  >
    {loading ? <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <SaveIcon style={{ fontSize: 15 }} />}
    {loading ? 'Saving…' : children}
  </motion.button>
);

// ─── Wrapper that applies CSS vars for dark mode compatibility ─────────────────
const cssVars = `
  :root { --divider: rgba(0,0,0,0.08); --text-secondary: #6b7280; --text-tertiary: #9ca3af; }
  .dark { --divider: rgba(255,255,255,0.1); --text-secondary: #9ca3af; --text-tertiary: #6b7280; }
  @keyframes spin { to { transform: rotate(360deg); } }
`;





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

const GeneralContext = createContext(null);

const GeneralSettings = ({ children }) => {
  const {
    handleChange, settingsformData, isloading, setisloading,
    setFormData, companySettings, setCompanySettings,
    handleChangeSubscriberSettings, subscriberSettings, setSubscriberSettings,
    handleChangeAdminSettings, adminSettings, setAdminSettings,
    showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
    showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
    showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
    showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
    formDataGeneralSettings, setFormDataGeneralSettings,
    hotspotCustomization, setHotspotCustomization, handleChangeHotspotCustomization,
    handleChangeNasSettings, nasSettingsForm, setNasSettingsForm,
    handleChanageAccessPointSettings,
    accessPointSettingsForm, setAccessPointSettingsForm,
  } = useApplicationSettings();

  const { contact_info, company_name, email_info, logo_url,
    agent_email, customer_support_email, customer_support_phone_number, location } = companySettings;

  let { enable_2fa_for_admin_email, enable_2fa_for_admin_sms, send_password_via_sms,
    send_password_via_email, check_is_inactive,
    checkinactiveminutes, checkinactivehrs, checkinactivedays,
    enable_2fa_google_auth, enable_2fa_for_admin_passkeys } = adminSettings;

  const { prefix, minimum_digits, use_autogenerated_number_as_ppoe_username, notify_user_account_created,
    send_reminder_sms_expiring_subscriptions, account_number_starting_value,
    use_autogenerated_number_as_ppoe_password,
    enable_customer_portal, installation_fee, send_welcome_message,
    subscriber_welcome_message, lock_account_to_mac,
    notify_user_payment_received, invoice_created_or_paid,
    expiration_reminder, expiration_reminder_minutes, expiration_reminder_hours, expiration_reminder_days } = subscriberSettings;

  const { notification_when_unreachable, unreachable_duration_minutes, notification_phone_number } = nasSettingsForm;

  const [routerName] = useDebounce(settingsformData.router_name, 1000);
  const [open, setOpen] = useState(false);
  const [openNotifactionSettings, setOpenSettings] = useState(false);
  const [routers, setRouters] = useState([]);
  const [smsProviders, setSmsProviders] = useState([]);
  const [mikrotik_router, setRouter] = useState(null);
  const [sms_provider, setSmsProvider] = useState({ sms_provider: '' });
  const [loadHotspotCustomization, setLoadHotspotCustomization] = useState(false);
  const [loadAdminSettings, setLoadAdminSettings] = useState(false)
  const [loadCompanySettings, setLoadCompanySettings] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false);
  const [loadGeneralSettings, setLoadGeneralSettings] = useState(false)
  const [loadNasSettings, setLoadNasSettings] = useState(false)
  const [loadSubscriberSetting, setLoadSubscriberSetting] = useState(false)


  const isDark = useIsDarkMode();
  const subdomain = window.location.hostname.split('.')[0];

  const tableTheme = useMemo(() => createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: { main: '#2563eb' },
      background: {
        paper: isDark ? '#1c1c1e' : '#ffffff',
        default: isDark ? '#111113' : '#f9f9fb',
      },
      text: {
        primary: isDark ? '#f0f0f0' : '#111827',
        secondary: isDark ? '#a3a3a3' : '#6b7280',
      },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiAccordion: { defaultProps: { disableGutters: true } },
      MuiCheckbox: {
        styleOverrides: {
          root: { borderRadius: 4 },
        },
      },
    },
  }), [isDark]);

  // ── API handlers (unchanged logic) ──────────────────────────────────────────

  const handleGetCompanySettings = useCallback(async () => {
    try {
      const response = await fetch('/api/get_company_settings', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) {
        const { contact_info, company_name, email_info, logo_url, customer_support_phone_number, agent_email, customer_support_email, location } = newData;
        setCompanySettings(prev => ({ ...prev, contact_info, company_name, email_info, customer_support_phone_number, agent_email, customer_support_email, logo_preview: logo_url, location }));
      } else {
        if (response.status === 402) setTimeout(() => { window.location.href = '/license-expired'; }, 1800);
        if (response.status === 401) { toast.error(newData.error, { position: 'top-center', duration: 4000 }); setTimeout(() => { window.location.href = '/signin'; }, 1900); }
      }
    } catch { toast.error('Error fetching company settings'); }
  }, [setCompanySettings]);

  useEffect(() => { handleGetCompanySettings(); }, [handleGetCompanySettings]);

  const fetchRouters = useMemo(() => async () => {
    try {
      const response = await fetch('/api/routers', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) setRouters(newData);
    } catch {}
  }, []);

  useEffect(() => { fetchRouters(); }, [fetchRouters, routerName]);
  useEffect(() => { setRouter(settingsformData.router_name); }, [settingsformData.router_name]);

  useEffect(() => {
    const fetchRouterSettings = async () => {
      try {
        const response = await fetch('/api/router_settings', { headers: { 'X-Subdomain': subdomain } });
        const newData = await response.json();
        if (response.ok) {
          const { router_name, use_radius } = newData[0];
          setFormData({ ...settingsformData, router_name, use_radius });
          setRouter(router_name);
        }
      } catch {  }
    };
    fetchRouterSettings();
  }, []);

  const handleClose = () => setOpen(false);
  const handleCloseNotifaction = () => setOpenSettings(false);
  const handleFormDataChangeForCompany = e => setCompanySettings(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) setCompanySettings(prev => ({ ...prev, logo: file, logo_preview: URL.createObjectURL(file) }));
  };

  const handleCreateCompanySettings = async e => {
    e.preventDefault();
    try {
      setisloading(true);
      setLoadCompanySettings(true)
      const formData = new FormData();
      ['company_name', 'contact_info', 'email_info', 'agent_email', 'customer_support_phone_number', 'customer_support_email', 'location'].forEach(k => formData.append(k, companySettings[k]));
      if (companySettings.logo) formData.append('logo', companySettings.logo);
      const response = await fetch('/api/company_settings', { method: 'POST', headers: { 'X-Subdomain': subdomain }, body: formData });
      const newData = await response.json();
      if (response.ok) {
        setisloading(false);
        setLoadCompanySettings(false)
        toast.success('Company settings updated', { position: 'top-center', duration: 4000 });
        const { contact_info, company_name, email_info, logo_url, agent_email, customer_support_email, customer_support_phone_number, location } = newData;
        setCompanySettings(prev => ({ ...prev, contact_info, company_name, customer_support_phone_number, customer_support_email, agent_email, location, email_info, logo_preview: logo_url }));
      } else {
        setLoadCompanySettings(false)
        toast.error('Failed to save company settings', { position: 'top-center', duration: 3000 });
        setisloading(false);
      }
    } catch {
      setLoadCompanySettings(false)
      toast.error('Failed to save company settings', { position: 'top-center', duration: 3000 });
      setisloading(false);
    }
  };

  const getAdminSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/admin_settings', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) {
        const { enable_2fa_for_admin_email, enable_2fa_for_admin_sms, send_password_via_sms, send_password_via_email, check_is_inactive, enable_2fa_for_admin_passkeys, checkinactiveminutes, checkinactivehrs, checkinactivedays, enable_2fa_google_auth } = newData[0];
        setAdminSettings(prev => ({ ...prev, enable_2fa_for_admin_email, enable_2fa_for_admin_sms, send_password_via_sms, enable_2fa_for_admin_passkeys, send_password_via_email, check_is_inactive, enable_2fa_google_auth, checkinactiveminutes, checkinactivehrs, checkinactivedays }));
      }
    } catch { toast.error('Failed to fetch admin settings', { position: 'top-center', duration: 3000 }); }
  }, [setAdminSettings, subdomain]);

  useEffect(() => { getAdminSettings(); }, [getAdminSettings]);

  const handleChangeAdminSetting = async e => {
    e.preventDefault();
    setLoadAdminSettings(true)
    try {
      const url = subdomain === 'demo' && (enable_2fa_google_auth || enable_2fa_for_admin_passkeys || enable_2fa_for_admin_email || enable_2fa_for_admin_sms) ? '/api/admin_settings_demo' : '/api/admin_settings';
      const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain }, body: JSON.stringify({ admin_setting: adminSettings }) });
      const data = await response.json();
      if (response.ok) {
        setLoadAdminSettings(false)
        toast.success('Admin settings updated', { position: 'top-center', duration: 4000 });
        setisloading(false); setOpen(false); setOpenSettings(true);
        const { enable_2fa_for_admin_email, enable_2fa_for_admin_sms, send_password_via_sms, send_password_via_email, check_is_inactive, enable_2fa_for_admin_passkeys, checkinactiveminutes, checkinactivehrs, checkinactivedays } = data;
        setAdminSettings(prev => ({ ...prev, enable_2fa_for_admin_email, enable_2fa_for_admin_sms, send_password_via_sms, enable_2fa_for_admin_passkeys, send_password_via_email, check_is_inactive, checkinactiveminutes, checkinactivehrs, checkinactivedays }));
      } else {
        setLoadAdminSettings(false)
        toast.error(subdomain === 'demo' ? 'Demo mode — admin settings cannot be changed' : 'Failed to update admin settings', { position: 'top-center', duration: 4000 });
      }
    } catch {
      setLoadAdminSettings(false)
      toast.error('Server error updating admin settings', { position: 'top-center', duration: 4000 });
    }
  };

  const handleGetSmsProviderSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/sms_provider_settings', { headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) { setSmsProvider({ sms_provider: newData[0].sms_provider }); localStorage.setItem('sms_provider', JSON.stringify(newData[0].sms_provider)); }
    } catch {}
  }, []);

  useEffect(() => { handleGetSmsProviderSettings(); }, [handleGetSmsProviderSettings]);

  const saveSmsProviderSetting = async e => {
    e.preventDefault();
    try {
      const response = await fetch('/api/sms_provider_settings', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain }, body: JSON.stringify({ sms_provider_setting: sms_provider }) });
      const newData = await response.json();
      if (response.ok) { toast.success('SMS settings updated', { duration: 4000, position: 'top-center' }); setSmsProvider({ sms_provider: newData.sms_provider }); localStorage.setItem('sms_provider', JSON.stringify(newData.sms_provider)); }
      else toast.error('Failed to update SMS settings', { duration: 4000, position: 'top-center' });
    } catch { toast.error('Error updating SMS settings', { duration: 3000, position: 'top-center' }); }
  };

  const fetchSavedSmsSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/saved_sms_settings', { headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain } });
      const data = await response.json();
      if (response.ok) setSmsProviders(data);
    } catch { toast.error('Failed to fetch SMS settings', { duration: 3000, position: 'top-center' }); }
  }, []);

  useEffect(() => { fetchSavedSmsSettings(); }, [fetchSavedSmsSettings]);

  const saveSubcriberSettings = async e => {
    e.preventDefault();
    try {
      setisloading(true); setOpen(true);
      setLoadSubscriberSetting(true)
      const response = await fetch('/api/subscriber_settings', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain }, body: JSON.stringify({ subscriber_setting: subscriberSettings }) });
      const newData = await response.json();
      if (response.ok) {
        setLoadSubscriberSetting(false)
        setSubscriberSettings({ ...subscriberSettings, prefix: newData.prefix, minimum_digits: newData.minimum_digits, use_autogenerated_number_as_ppoe_username: newData.use_autogenerated_number_as_ppoe_username, notify_user_account_created: newData.notify_user_account_created, send_reminder_sms_expiring_subscriptions: newData.send_reminder_sms_expiring_subscriptions, account_number_starting_value: newData.account_number_starting_value, use_autogenerated_number_as_ppoe_password: newData.use_autogenerated_number_as_ppoe_password, enable_customer_portal: newData.enable_customer_portal, installation_fee: newData.installation_fee, lock_account_to_mac: newData.lock_account_to_mac, notify_user_payment_received: newData.notify_user_payment_received, invoice_created_or_paid: newData.invoice_created_or_paid, expiration_reminder_minutes: newData.expiration_reminder_minutes, expiration_reminder_hours: newData.expiration_reminder_hours, expiration_reminder_days: newData.expiration_reminder_days, expiration_reminder: newData.expiration_reminder });
        setisloading(false); setOpen(false); setOpenSettings(true);
        toast.success('Subscriber settings saved', { position: 'top-center', duration: 4000 });
      } else { setisloading(false); 
        setLoadSubscriberSetting(false)
        setOpen(false); toast.error('Failed to save subscriber settings', { position: 'top-center', duration: 3000 }); }
    } catch { 
      setLoadSubscriberSetting(false)
      setisloading(false); setOpen(false); toast.error('Error saving subscriber settings', { position: 'top-center', duration: 3000 }); }
  };

  const fetchSubscriberSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/subscriber_settings', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) {
        const { prefix, minimum_digits, use_autogenerated_number_as_ppoe_username, notify_user_account_created, send_reminder_sms_expiring_subscriptions, account_number_starting_value, use_autogenerated_number_as_ppoe_password, enable_customer_portal, installation_fee, lock_account_to_mac, subscriber_welcome_message, notify_user_payment_received, invoice_created_or_paid, expiration_reminder_minutes, expiration_reminder_hours, expiration_reminder_days, expiration_reminder } = newData[0];
        setSubscriberSettings({ ...subscriberSettings, prefix, minimum_digits, use_autogenerated_number_as_ppoe_username, notify_user_account_created, send_reminder_sms_expiring_subscriptions, account_number_starting_value, use_autogenerated_number_as_ppoe_password, enable_customer_portal, installation_fee, lock_account_to_mac, subscriber_welcome_message, notify_user_payment_received, invoice_created_or_paid, expiration_reminder_minutes, expiration_reminder_hours, expiration_reminder_days, expiration_reminder });
      }
    } catch {}
  }, []);

  useEffect(() => { fetchSubscriberSettings(); }, [fetchSubscriberSettings]);

  const handleSaveHotspotCustomization = async e => {
    e.preventDefault(); setLoadHotspotCustomization(true);
    try {
      const response = await fetch('/api/hotspot_customizations', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain }, body: JSON.stringify({ customize_template_and_package_per_location: hotspotCustomization.customize_template_and_package_per_location, enable_autologin: hotspotCustomization.enable_autologin, enable_compensation: hotspotCustomization.enable_compensation, compensation_minutes: hotspotCustomization.compensation_minutes, compensation_hours: hotspotCustomization.compensation_hours, enable_free_trial: hotspotCustomization.enable_free_trial, free_trial_duration_minutes: hotspotCustomization.free_trial_duration_minutes, free_trial_download_limit: hotspotCustomization.free_trial_download_limit, free_trial_upload_limit: hotspotCustomization.free_trial_upload_limit }) });
      const newData = await response.json();
      if (response.ok) { setLoadHotspotCustomization(false); 
        setHotspotCustomization({ ...newData }); toast.success(<p className='font-sans'>Hotspot settings updated</p>,
           { duration: 3000, position: 'top-right' }); }
      else { setLoadHotspotCustomization(false); toast.error(<p className='font-sans'>Hotspot update failed</p>, { duration: 3000, position: 'top-right' }); }
    } catch { setLoadHotspotCustomization(false); toast.error(<p className='font-sans'>Hotspot update failed</p>, { duration: 3000, position: 'top-right' }); }
  };

  const handleGetHotspotCustomizations = useCallback(async () => {
    try {
      const response = await fetch('/api/allow_get_hotspot_customization', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) setHotspotCustomization({ customize_template_and_package_per_location: newData[0].customize_template_and_package_per_location, enable_autologin: newData[0].enable_autologin, enable_compensation: newData[0].enable_compensation, compensation_minutes: newData[0].compensation_minutes, compensation_hours: newData[0].compensation_hours, enable_free_trial: newData[0].enable_free_trial, free_trial_duration_minutes: newData[0].free_trial_duration_minutes, free_trial_download_limit: newData[0].free_trial_download_limit, free_trial_upload_limit: newData[0].free_trial_upload_limit });
    } catch {}
  }, []);

  useEffect(() => { handleGetHotspotCustomizations(); }, [handleGetHotspotCustomizations]);

  const handleSaveSystemGeneralSettings = async e => {
    e.preventDefault();
    setLoadGeneralSettings(true)
    try {
      const response = await fetch('/api/general_settings', { method: 'POST',
         headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
          body: JSON.stringify({ title: formDataGeneralSettings.title, timezone: formDataGeneralSettings.timezone, allowed_ips: formDataGeneralSettings.allowed_ips }) });
      const newData = await response.json();
      if (response.ok) {
        setLoadGeneralSettings(false)
         setFormDataGeneralSettings({ title: newData.title, timezone: newData.timezone, 
        allowed_ips: newData.allowed_ips }); toast.success('General settings updated', { duration: 3000, position: 'top-right' }); }
      else {
         setLoadGeneralSettings(false)
        toast.error(<p className='font-sans'>General settings update failed</p>, { duration: 3000, position: 'top-right' });
      }
    } catch {
      setLoadGeneralSettings(false)
      toast.error(<p className='font-sans'>General settings update failed</p>, { duration: 3000, position: 'top-right' }); }
  };

  const handleGetSystemGeneralSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/general_settings', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) setFormDataGeneralSettings({ title: newData[0].title, timezone: newData[0].timezone, allowed_ips: newData[0].allowed_ips });
    } catch {}
  }, []);

  useEffect(() => { handleGetSystemGeneralSettings(); }, [handleGetSystemGeneralSettings]);

  const handleSaveAccessPointSettings = async e => {
    e.preventDefault();
    try {
      setisloading(true); setOpen(true);
      const response = await fetch('/api/access_point_settings', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain }, body: JSON.stringify({ access_point_setting: accessPointSettingsForm }) });
      const newData = await response.json();
      if (response.ok) { setAccessPointSettingsForm({ ...accessPointSettingsForm, notification_when_unreachable: newData.notification_when_unreachable, unreachable_duration_minutes: newData.unreachable_duration_minutes, notification_phone_number: newData.notification_phone_number }); toast.success('Access point settings updated', { duration: 3000, position: 'top-right' }); setOpen(false); setOpenSettings(true); }
      else { toast.error('Access point update failed', { duration: 3000, position: 'top-right' }); setOpen(false); setOpenSettings(false); }
    } catch { setOpenSettings(false); toast.error('Access point update failed', { duration: 3000, position: 'top-right' }); }
  };

  const handleGetAccessPointSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/access_point_settings', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) setAccessPointSettingsForm({ ...accessPointSettingsForm, notification_when_unreachable: newData[0].notification_when_unreachable, unreachable_duration_minutes: newData[0].unreachable_duration_minutes, notification_phone_number: newData[0].notification_phone_number });
    } catch {}
  }, []);

  useEffect(() => { handleGetAccessPointSettings(); }, [handleGetAccessPointSettings]);

  const handleSaveNasSettings = async e => {
    e.preventDefault();
    setLoadNasSettings(true)
    try {
      setisloading(true); setOpen(true);
      const response = await fetch('/api/nas_settings', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain }, body: JSON.stringify({ nas_setting: nasSettingsForm }) });
      const newData = await response.json();
      if (response.ok) {
        setLoadNasSettings(false)
         setNasSettingsForm({ ...nasSettingsForm, notification_when_unreachable: newData.notification_when_unreachable,
           unreachable_duration_minutes: newData.unreachable_duration_minutes, 
           notification_phone_number: newData.notification_phone_number, use_radius:newData.use_radius  }); toast.success('NAS settings updated', { duration: 3000, position: 'top-right' }); setOpen(false); setOpenSettings(true); }
      else {
        setLoadNasSettings(false)
        toast.error('NAS settings update failed', { duration: 3000, position: 'top-right' }); setOpen(false); setOpenSettings(false); }
    } catch {
      setLoadNasSettings(false)
      setOpenSettings(false); toast.error('NAS settings update failed', { duration: 3000, position: 'top-right' }); }
  };

  const handleGetNasSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/nas_settings', { headers: { 'X-Subdomain': subdomain } });
      const newData = await response.json();
      if (response.ok) setNasSettingsForm({ ...nasSettingsForm, notification_when_unreachable: newData[0].notification_when_unreachable, 
        unreachable_duration_minutes: newData[0].unreachable_duration_minutes, 
        use_radius:newData[0].use_radius,
        notification_phone_number: newData[0].notification_phone_number });
    } catch {}
  }, []);

  useEffect(() => { handleGetNasSettings(); }, [handleGetNasSettings]);

  // ─── Timezones list ──────────────────────────────────────────────────────────
  const timezones = [
    { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
    { value: 'GMT', label: 'GMT (Greenwich Mean Time)' },
    { value: 'Africa/Abidjan', label: 'Africa — Abidjan (GMT)' },
    { value: 'Africa/Accra', label: 'Africa — Accra (GMT)' },
    { value: 'Africa/Addis_Ababa', label: 'Africa — Addis Ababa (EAT, UTC+3)' },
    { value: 'Africa/Algiers', label: 'Africa — Algiers (CET, UTC+1)' },
    { value: 'Africa/Cairo', label: 'Africa — Cairo (EET, UTC+2)' },
    { value: 'Africa/Casablanca', label: 'Africa — Casablanca (WET, UTC+0/+1)' },
    { value: 'Africa/Dar_es_Salaam', label: 'Africa — Dar es Salaam (EAT, UTC+3)' },
    { value: 'Africa/Johannesburg', label: 'Africa — Johannesburg (SAST, UTC+2)' },
    { value: 'Africa/Kampala', label: 'Africa — Kampala (EAT, UTC+3)' },
    { value: 'Africa/Khartoum', label: 'Africa — Khartoum (EAT, UTC+3)' },
    { value: 'Africa/Lagos', label: 'Africa — Lagos (WAT, UTC+1)' },
    { value: 'Africa/Nairobi', label: 'Africa — Nairobi (EAT, UTC+3)' },
    { value: 'Africa/Tripoli', label: 'Africa — Tripoli (EET, UTC+2)' },
    { value: 'Africa/Tunis', label: 'Africa — Tunis (CET, UTC+1)' },
    { value: 'America/Anchorage', label: 'America — Anchorage (AKST, UTC-9)' },
    { value: 'America/Argentina/Buenos_Aires', label: 'America — Buenos Aires (ART, UTC-3)' },
    { value: 'America/Bogota', label: 'America — Bogotá (COT, UTC-5)' },
    { value: 'America/Chicago', label: 'America — Chicago (CST, UTC-6)' },
    { value: 'America/Denver', label: 'America — Denver (MST, UTC-7)' },
    { value: 'America/Los_Angeles', label: 'America — Los Angeles (PST, UTC-8)' },
    { value: 'America/Mexico_City', label: 'America — Mexico City (CST, UTC-6)' },
    { value: 'America/New_York', label: 'America — New York (EST, UTC-5)' },
    { value: 'America/Sao_Paulo', label: 'America — São Paulo (BRT, UTC-3)' },
    { value: 'America/Toronto', label: 'America — Toronto (EST, UTC-5)' },
    { value: 'America/Vancouver', label: 'America — Vancouver (PST, UTC-8)' },
    { value: 'Asia/Bangkok', label: 'Asia — Bangkok (ICT, UTC+7)' },
    { value: 'Asia/Dubai', label: 'Asia — Dubai (GST, UTC+4)' },
    { value: 'Asia/Hong_Kong', label: 'Asia — Hong Kong (HKT, UTC+8)' },
    { value: 'Asia/Jakarta', label: 'Asia — Jakarta (WIB, UTC+7)' },
    { value: 'Asia/Kolkata', label: 'Asia — Kolkata (IST, UTC+5:30)' },
    { value: 'Asia/Riyadh', label: 'Asia — Riyadh (AST, UTC+3)' },
    { value: 'Asia/Seoul', label: 'Asia — Seoul (KST, UTC+9)' },
    { value: 'Asia/Shanghai', label: 'Asia — Shanghai (CST, UTC+8)' },
    { value: 'Asia/Singapore', label: 'Asia — Singapore (SGT, UTC+8)' },
    { value: 'Asia/Tokyo', label: 'Asia — Tokyo (JST, UTC+9)' },
    { value: 'Europe/Amsterdam', label: 'Europe — Amsterdam (CET, UTC+1)' },
    { value: 'Europe/Berlin', label: 'Europe — Berlin (CET, UTC+1)' },
    { value: 'Europe/London', label: 'Europe — London (GMT, UTC+0)' },
    { value: 'Europe/Moscow', label: 'Europe — Moscow (MSK, UTC+3)' },
    { value: 'Europe/Paris', label: 'Europe — Paris (CET, UTC+1)' },
    { value: 'Australia/Brisbane', label: 'Australia — Brisbane (AEST, UTC+10)' },
    { value: 'Australia/Sydney', label: 'Australia — Sydney (AEDT, UTC+11)' },
    { value: 'Pacific/Auckland', label: 'Pacific — Auckland (NZDT, UTC+13)' },
    { value: 'Pacific/Honolulu', label: 'Pacific — Honolulu (HST, UTC-10)' },
  ];

  // ─── Shared text field sx ───────────────────────────────────────────────────
  const tf = { sx: { ...fieldSx, width: '100%' } };

  return (
    <>
      <style>{cssVars}</style>
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 
        'center', padding: '2rem' }}><RefreshCw style={{ animation: 'spin 1s linear infinite', color: '#3b82f6', width: 28, height: 28 }} /></div>}>
        <ThemeProvider theme={tableTheme}>
          <Toaster toastOptions={{ style: { fontSize: '0.875rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }} />
          <Backdrop handleClose={handleClose} open={open} />
          <SettingsNotification open={openNotifactionSettings} handleClose={handleCloseNotifaction} />

          <div className='font-sans
' style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

            {/* ── User Registration ──────────────────────────────────────────── */}
            <form onSubmit={handleChangeAdminSetting} className='font-sans
'>
              <Accordion sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />} sx={accordionSummarySx}>
                  <SectionHeader icon={FiUsers} label="User registration" />
                </AccordionSummary>
                <AccordionDetails sx={accordionDetailsSx}>

                  <SectionLabel>
                    
                    Two-factor authentication</SectionLabel>

                  <div style={{ display: 'grid', gap: '4px' }} className='font-sans
'>
                    <SettingsCheckbox
                      checked={enable_2fa_for_admin_sms}
                      label={<span>Two-factor via SMS <span style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 500 }}>⚠ Experimental — contact support if issues arise</span></span>}
                      description="Administrators receive a one-time password by SMS during login, adding a second layer of verification on top of their password."
                      onChange={handleChangeAdminSettings}
                      name="enable_2fa_for_admin_sms"
                    />
                    <SettingsCheckbox
                      checked={enable_2fa_for_admin_email}
                      label={<span>Two-factor via email <span style={{ color: '#dc2626', fontSize: '0.75rem', fontWeight: 500 }}>⚠ Experimental — contact support if issues arise</span></span>}
                      description="Administrators receive a one-time password by email during login. Use this when SMS delivery is unavailable."
                      onChange={handleChangeAdminSettings}
                      name="enable_2fa_for_admin_email"
                    />
                    <SettingsCheckbox
                      checked={enable_2fa_for_admin_passkeys}
                      label="Two-factor via passkeys"
                      description="Administrators authenticate with a biometric scan (Face ID, fingerprint) or a device prompt instead of a one-time code. Passkeys use public-key cryptography and are phishing-resistant."
                      onChange={handleChangeAdminSettings}
                      name="enable_2fa_for_admin_passkeys"
                    />
                    <SettingsCheckbox
                      checked={enable_2fa_google_auth}
                      label="Two-factor via Google Authenticator"
                      description="Administrators enter a 6-digit TOTP code from the Google Authenticator app after their password. The code rotates every 30 seconds and is tied to the user's secret key."
                      onChange={handleChangeAdminSettings}
                      name="enable_2fa_google_auth"
                    />
                  </div>

                  <SectionLabel>Inactivity timeout</SectionLabel>

                  <SettingsCheckbox
                    label="Automatically log out inactive administrators"
                    description="When enabled, administrators are signed out after the inactivity period below is reached."
                    value={check_is_inactive}
                    checked={check_is_inactive}
                    onChange={handleChangeAdminSettings}
                    name="check_is_inactive"
                  />

                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    {[
                      { id: 'checkinactivehrs', label: 'Hours', name: 'checkinactivehrs', value: checkinactivehrs, help: 'Enter 0 to disable' },
                      { id: 'checkinactivedays', label: 'Days', name: 'checkinactivedays', value: checkinactivedays, help: 'Enter 0 to disable' },
                      { id: 'checkinactiveminutes', label: 'Minutes', name: 'checkinactiveminutes', value: checkinactiveminutes, help: 'Enter 0 to disable' },
                    ].map(f => (
                      <Grid key={f.id} item xs={12} sm={4}>
                        <TextField {...tf}
                        
                        sx={{
                           '& label.Mui-focused': { color: '#10b981' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                  borderWidth: '2px',
                },
              },
                        }}
                        id={f.id} label={`Inactivity timeout (${f.label.toLowerCase()})`}
                        className='myTextField'
                         type="number" onChange={handleChangeAdminSettings} name={f.name} 
                         value={f.value} helperText={f.help}
                         
                         
                         />
                      </Grid>
                    ))}
                  </Grid>

                  <InfoBox>
                    The session ends after <strong>whichever limit is reached first</strong>. For example, setting 2 hours, 1 day, and 30 minutes triggers a logout after 30 minutes of inactivity.
                  </InfoBox>

                  <SectionLabel>User invitation</SectionLabel>

                  <div style={{ display: 'grid', gap: '4px' }}>
                    <SettingsCheckbox
                      checked={send_password_via_email}
                      label="Send login credentials by email"
                      description="New users receive their initial password in their inbox. Recommended for business email addresses."
                      onChange={handleChangeAdminSettings}
                      name="send_password_via_email"
                    />
                    <SettingsCheckbox
                      checked={send_password_via_sms}
                      label="Send login credentials by SMS"
                      description="New users receive their initial password by text message. Useful when email access is limited or as a backup delivery method."
                      onChange={handleChangeAdminSettings}
                      name="send_password_via_sms"
                    />
                  </div>

                  <InfoBox variant="warning">
                    <strong>Security note:</strong> Enable at least one invitation method so new users can securely receive their credentials. For critical accounts, consider enabling both.
                  </InfoBox>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SaveButton loading={loadAdminSettings}>Save registration settings</SaveButton>
                  </div>
                </AccordionDetails>
              </Accordion>
            </form>

            {/* ── SMS Settings ───────────────────────────────────────────────── */}
            <form onSubmit={saveSmsProviderSetting}>
              <Accordion sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />} sx={accordionSummarySx}>
                  <SectionHeader icon={MdTextsms} iconClass="text-green-500" label="SMS settings" />
                </AccordionSummary>
                <AccordionDetails sx={accordionDetailsSx}>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '16px', marginTop: 0 }}>
                    Choose the SMS provider used for system-wide message delivery — notifications, OTPs, and subscription reminders.
                  </p>
                  <Autocomplete
                    value={smsProviders.find(p => p.sms_provider === sms_provider.sms_provider) || null}
                    sx={{ maxWidth: 480, ...fieldSx }}
                    getOptionLabel={p => p.sms_provider}
                    options={smsProviders}
                    renderInput={params => (
                      <TextField {...params} name="sms_provider" label="SMS provider"
                      className='myTextField'
                      sx={{
                         '& label.Mui-focused': { color: '#10b981' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                  borderWidth: '2px',
                },
              },
                      }}
                       InputProps={{ ...params.InputProps, startAdornment: <MdTextsms 
                        style={{ marginRight: 8, flexShrink: 0 }} /> }} sx={fieldSx} />
                    )}
                    onChange={(_, newValue) => setSmsProvider({ sms_provider: newValue ? newValue.sms_provider : '' })}
                    renderOption={(props, option) => (
                      <li {...props} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px' }}>
                        <MdTextsms style={{ flexShrink: 0, color: '#6b7280' }} />
                        <span style={{ fontSize: '0.875rem' }}>{option.sms_provider}</span>
                      </li>
                    )}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SaveButton>Save SMS settings</SaveButton>
                  </div>
                </AccordionDetails>
              </Accordion>
            </form>

            {/* ── Subscriber Settings ────────────────────────────────────────── */}
            <form onSubmit={saveSubcriberSettings}>
              <Accordion sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />} sx={accordionSummarySx}>
                  <SectionHeader icon={CiUser} label="Subscriber settings" />
                </AccordionSummary>
                <AccordionDetails sx={accordionDetailsSx}>

                  <SectionLabel>Notifications</SectionLabel>
                  <div style={{ display: 'grid', gap: '4px' }}>
                    <SettingsCheckbox label="Notify customer on successful subscription renewal" onChange={() => {}} />
                    <SettingsCheckbox label="Email receipt to customer on renewal" onChange={() => {}} />
                    <SettingsCheckbox label="Automatically send reminder SMS for expiring subscriptions" onChange={() => {}} />
                    <SettingsCheckbox
                      label="Notify customer when account is created"
                      checked={notify_user_account_created}
                      onChange={handleChangeSubscriberSettings}
                      name="notify_user_account_created"
                    />
                    <SettingsCheckbox
                      label="Notify customer when payment is received"
                      checked={notify_user_payment_received}
                      onChange={handleChangeSubscriberSettings}
                      name="notify_user_payment_received"
                    />
                    <SettingsCheckbox
                      label="Notify customer when an invoice is created or paid"
                      checked={invoice_created_or_paid}
                      onChange={handleChangeSubscriberSettings}
                      name="invoice_created_or_paid"
                    />
                    <SettingsCheckbox
                      label="Send welcome message after account creation"
                      checked={subscriber_welcome_message}
                      onChange={handleChangeSubscriberSettings}
                      name="subscriber_welcome_message"
                    />
                  </div>

                  <SectionLabel>Account numbering</SectionLabel>
                  <SettingsCheckbox
                    label="Use auto-generated account number as PPPoE username"
                    checked={use_autogenerated_number_as_ppoe_username}
                    onChange={handleChangeSubscriberSettings}
                    name="use_autogenerated_number_as_ppoe_username"
                  />
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField {...tf} name="prefix" label="Account number prefix" onChange={handleChangeSubscriberSettings} value={prefix} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField {...tf} name="minimum_digits" label="Minimum digits" 
                      type="number" helperText="Zeros are prepended — e.g. SUB001 for 3 digits" 
                      onChange={handleChangeSubscriberSettings} value={minimum_digits} className='myTextField' />
                    </Grid>
                  </Grid>

                  <div style={{ marginTop: 16 }}>
                    <Alert severity="info" sx={{ borderRadius: tokens.radiusSm, fontSize: '0.8125rem' }}>
                      <AlertTitle sx={{ fontSize: '0.875rem', fontWeight: 500 }}>Account number counter</AlertTitle>
                      Set the starting counter value after importing customers to continue numbering from the right point. Enter the highest existing account number (without prefix).
                    </Alert>
                    <TextField {...tf} sx={{ ...fieldSx, width: '100%', mt: 1.5 }} label="Current account number (exclude prefix)"
                    className='myTextField'
                     />
                  </div>

                  <SectionLabel>Access & security</SectionLabel>
                  <div style={{ display: 'grid', gap: '4px' }}>
                    <SettingsCheckbox
                      label="Lock PPPoE account to first detected MAC address"
                      description="The first MAC address seen will become the account's sticky MAC. It must be manually removed to switch devices."
                      checked={lock_account_to_mac}
                      onChange={handleChangeSubscriberSettings}
                      name="lock_account_to_mac"
                    />
                    <SettingsCheckbox label="Allow subscriber accounts to have more than one client device" onChange={() => {}} />
                    <SettingsCheckbox label="Use the same username/password for all devices in a multi-device account" onChange={() => {}} />
                    <SettingsCheckbox
                      label="Enable customer portal"
                      checked={enable_customer_portal}
                      onChange={handleChangeSubscriberSettings}
                      name="enable_customer_portal"
                    />
                  </div>

                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField {...tf} label="Installation fee"
                       onChange={handleChangeSubscriberSettings} 
                       value={installation_fee} name="installation_fee"
                       className='myTextField'
                        InputProps={{ startAdornment: <span style={{ marginRight: 6, color: 'var(--text-secondary)' }}>KES</span> }} />
                    </Grid>
                  </Grid>

                  <SectionLabel>Expiration reminders</SectionLabel>
                  <SettingsCheckbox
                    label="Send expiration reminders to clients"
                    checked={expiration_reminder}
                    onChange={handleChangeSubscriberSettings}
                    name="expiration_reminder"
                  />
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    {[
                      { id: 'expiration_reminder_days', label: 'Days before expiration', name: 'expiration_reminder_days', value: expiration_reminder_days },
                      { id: 'expiration_reminder_hours', label: 'Hours before expiration', name: 'expiration_reminder_hours', value: expiration_reminder_hours },
                      { id: 'expiration_reminder_minutes', label: 'Minutes before expiration', name: 'expiration_reminder_minutes', value: expiration_reminder_minutes },
                    ].map(f => (
                      <Grid key={f.id} item xs={12} sm={4}>
                        <TextField {...tf} id={f.id} label={f.label} onChange={handleChangeSubscriberSettings}
                         name={f.name} value={f.value} className='myTextField' />
                      </Grid>
                    ))}
                  </Grid>
                  <InfoBox>
                    Reminders are sent to clients before their subscriptions expire so they can renew in time. All three intervals are active simultaneously.
                  </InfoBox>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SaveButton loading={loadSubscriberSetting}>Save subscriber settings</SaveButton>
                  </div>
                </AccordionDetails>
              </Accordion>
            </form>

            {/* ── Hotspot ────────────────────────────────────────────────────── */}
            <form onSubmit={handleSaveHotspotCustomization}>
              <Accordion sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />} sx={accordionSummarySx}>
                  <SectionHeader icon={FaWifi} iconClass="text-red-600" label="Hotspot" />
                </AccordionSummary>
                <AccordionDetails sx={accordionDetailsSx}>
                  <div style={{ display: 'grid', gap: '4px', marginBottom: 16 }}>
                    {/* <SettingsCheckbox
                      label="Customise templates and packages per location"
                      checked={hotspotCustomization.customize_template_and_package_per_location}
                      onChange={handleChangeHotspotCustomization}
                      name="customize_template_and_package_per_location"
                    /> */}
                    <SettingsCheckbox
                      label="Enable auto-login for hotspot users"
                      checked={hotspotCustomization.enable_autologin}
                      onChange={handleChangeHotspotCustomization}
                      name="enable_autologin"
                    />
                    <SettingsCheckbox
                      label="Enable session compensation"
                      description="Grant users extra time when the hotspot has an outage."
                      checked={hotspotCustomization.enable_compensation}
                      onChange={handleChangeHotspotCustomization}
                      name="enable_compensation"
                    />
                  </div>

                  {hotspotCustomization.enable_compensation && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <TextField {...tf} InputProps={{ startAdornment: <IoTimeOutline style={{ marginRight: 8 }} /> }} 
                        name="compensation_minutes" 
                        value={hotspotCustomization.compensation_minutes}
                         onChange={handleChangeHotspotCustomization} className='myTextField' label="Compensation (minutes)" type="text" />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField {...tf} InputProps={{ startAdornment: <IoTimeOutline style={{ marginRight: 8 }} /> }}
                         name="compensation_hours" value={hotspotCustomization.compensation_hours}
                          onChange={handleChangeHotspotCustomization} className='myTextField' label="Compensation (hours)" type="text" />
                      </Grid>
                    </Grid>
                  )}

                  {/* <SectionLabel>Free trial</SectionLabel>
                  <SettingsCheckbox
                    label="Enable free trial for hotspot users"
                    checked={hotspotCustomization.enable_free_trial}
                    onChange={handleChangeHotspotCustomization}
                    name="enable_free_trial"
                  /> */}
                  {hotspotCustomization.enable_free_trial && (
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                      <Grid item xs={12} sm={4}>
                        <TextField {...tf} InputProps={{ startAdornment: <IoTimeOutline style={{ marginRight: 8 }} /> }} 
                        name="free_trial_duration_minutes"
                        className='myTextField'
                         value={hotspotCustomization.free_trial_duration_minutes || ''}
                          onChange={handleChangeHotspotCustomization} label="Trial duration (minutes)" type="number" inputProps={{ min: 1 }} 
                          helperText="Session length" />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField {...tf} InputProps={{ startAdornment: <FaLongArrowAltDown style={{ marginRight: 8 }} /> }}
                         name="free_trial_download_limit" value={hotspotCustomization.free_trial_download_limit || ''}
                          onChange={handleChangeHotspotCustomization} label="Download limit (Mbps)" 
                          type="number" inputProps={{ min: 0 }} className='myTextField'
                           helperText="Max download speed during trial" />
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <TextField {...tf} InputProps={{ startAdornment: <FaLongArrowAltUp style={{ marginRight: 8 }} /> }} 
                        
                        name="free_trial_upload_limit" value={hotspotCustomization.free_trial_upload_limit || ''}
                        
                        onChange={handleChangeHotspotCustomization} label="Upload limit (Mbps)" type="number" 
                        className='myTextField'
                        inputProps={{ min: 0 }} helperText="Max upload speed during trial" />
                      </Grid>
                    </Grid>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SaveButton loading={loadHotspotCustomization}>Save hotspot settings</SaveButton>
                  </div>
                </AccordionDetails>
              </Accordion>
            </form>

            {/* ── Company Settings ───────────────────────────────────────────── */}
            <form onSubmit={handleCreateCompanySettings}>
              <Accordion sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />} sx={accordionSummarySx}>
                  <SectionHeader icon={FaRegBuilding} iconClass="text-cyan-600" label="Company settings" />
                </AccordionSummary>
                <AccordionDetails sx={accordionDetailsSx}>
                  <Grid container spacing={2}>
                    {[
                      { name: 'company_name', label: 'Company name', value: company_name, icon: <FaRegBuilding style={{ marginRight: 8, color: 'var(--text-secondary)' }} /> },
                      { name: 'email_info', label: 'Email', value: email_info, icon: <MdOutlineMailOutline style={{ marginRight: 8, color: 'var(--text-secondary)' }} /> },
                      { name: 'contact_info', label: 'Contact info', value: contact_info, icon: <MdOutlinePhonelinkSetup style={{ marginRight: 8, color: 'var(--text-secondary)' }} /> },
                      { name: 'location', label: 'Location', value: location, icon: <IoLocationOutline style={{ marginRight: 8, color: 'var(--text-secondary)' }} /> },
                      { name: 'customer_support_phone_number', label: 'Support phone', value: customer_support_phone_number, icon: <FaPhone style={{ marginRight: 8, color: 'var(--text-secondary)' }} /> },
                      { name: 'customer_support_email', label: 'Support email', value: customer_support_email, icon: <MdOutlineMailOutline style={{ marginRight: 8, color: 'var(--text-secondary)' }} /> },
                    ].map(f => (
                      <Grid key={f.name} item xs={12} sm={6}>
                        <TextField {...tf} name={f.name} 
                        className='myTextField'


sx={{                 '& label.Mui-focused': { color: '#10b981' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                  borderWidth: '2px',
                },
              },
                        }}
                        value={f.value} onChange={handleFormDataChangeForCompany} 
                        label={f.label} InputProps={{ startAdornment: f.icon }} />
                      </Grid>
                    ))}

                    {/* Logo upload */}
                    <Grid item xs={12}>
                      <p style={{ fontSize: '0.875rem', fontWeight: 500, marginBottom: 10, marginTop: 4 }}>Company logo</p>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="logo-upload" style={{ display: 'none' }} />
                      <label htmlFor="logo-upload" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        minHeight: 120, border: '1.5px dashed var(--divider)',
                        borderRadius: tokens.radius, cursor: 'pointer', padding: 16,
                        transition: 'border-color 0.15s',
                      }}>
                        {companySettings.logo_preview ? (
                          <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img src={companySettings.logo_preview} alt="Logo preview" style={{ maxWidth: 220, maxHeight: 160, objectFit: 'contain', borderRadius: 6 }} />
                            <button
                              onClick={e => { e.preventDefault(); setCompanySettings(prev => ({ ...prev, logo: null, logo_preview: null })); }}
                              style={{ position: 'absolute', top: -8, right: -8, background: '#ef4444', color: '#fff', border: 'none', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, lineHeight: 1 }}
                            >×</button>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <p style={{ margin: '0 0 4px', fontSize: '0.875rem' }}>Click to upload company logo</p>
                            <p style={{ margin: 0, fontSize: '0.75rem' }}>PNG, JPG — up to 5 MB</p>
                          </div>
                        )}
                      </label>
                    </Grid>
                  </Grid>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SaveButton loading={loadCompanySettings}>Save company settings</SaveButton>
                  </div>
                </AccordionDetails>
              </Accordion>
            </form>

            {/* ── NAS Settings ───────────────────────────────────────────────── */}
            <form onSubmit={handleSaveNasSettings}>
              <Accordion sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />} sx={accordionSummarySx}>
                  <SectionHeader icon={BsRouter} iconClass="text-green-700 dark:text-green-500" label="NAS settings" />
                </AccordionSummary>
                <AccordionDetails sx={accordionDetailsSx}>
                  <SettingsCheckbox
                    label="Notify me when a NAS becomes unreachable"
                    checked={notification_when_unreachable}
                    onChange={handleChangeNasSettings}
                    name="notification_when_unreachable"
                  />

                  <SettingsCheckbox
  label="Use FreeRADIUS"
  description="When disabled, hotspot users/profiles are pushed directly to the MikroTik router — no RADIUS server config needed. Vouchers and packages sync natively instead."
  checked={nasSettingsForm.use_radius}
  onChange={handleChangeNasSettings}
  name="use_radius"
/>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField {...tf} label="Alert after (minutes)" onChange={handleChangeNasSettings} name="unreachable_duration_minutes" value={unreachable_duration_minutes} helperText="How long a NAS must be unreachable before triggering an alert" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField {...tf} label="Notification phone number" onChange={handleChangeNasSettings}
                       name="notification_phone_number" value={notification_phone_number} 
                       helperText="Number to receive unreachable alerts" 
                       className='myTextField'

sx={{
    '& label.Mui-focused': { color: '#10b981' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                  borderWidth: '2px',
                },
              },
                        }}
                       InputProps={{ startAdornment: <FaPhone style={{ marginRight: 8, color: 'var(--text-secondary)' }} /> }} />
                    </Grid>
                  </Grid>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SaveButton loading={loadNasSettings}>Save NAS settings</SaveButton>
                  </div>
                </AccordionDetails>
              </Accordion>
            </form>

            {/* ── Access Point Settings ──────────────────────────────────────── */}
            <form onSubmit={handleSaveAccessPointSettings}>
              <Accordion sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />} sx={accordionSummarySx}>
                  <SectionHeader icon={BsRouter} iconClass="text-green-700 dark:text-green-500" label="Access point settings" />
                </AccordionSummary>
                <AccordionDetails sx={accordionDetailsSx}>
                  <SettingsCheckbox
                    label="Notify me when an access point becomes unreachable"
                    checked={accessPointSettingsForm.notification_when_unreachable}
                    onChange={handleChanageAccessPointSettings}
                    name="notification_when_unreachable"
                  />
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField {...tf} label="Alert after (minutes)" onChange={handleChanageAccessPointSettings} name="unreachable_duration_minutes" value={accessPointSettingsForm.unreachable_duration_minutes} helperText="How long an access point must be unreachable before triggering an alert" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField {...tf} label="Notification phone number" onChange={handleChanageAccessPointSettings} name="notification_phone_number" value={accessPointSettingsForm.notification_phone_number} helperText="Number to receive unreachable alerts" InputProps={{ startAdornment: <FaPhone style={{ marginRight: 8, color: 'var(--text-secondary)' }} /> }} />
                    </Grid>
                  </Grid>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SaveButton>Save access point settings</SaveButton>
                  </div>
                </AccordionDetails>
              </Accordion>
            </form>

            {/* ── General Settings ───────────────────────────────────────────── */}
            <form onSubmit={handleSaveSystemGeneralSettings}>
              <Accordion sx={accordionSx}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 20 }} />} sx={accordionSummarySx}>
                  <SectionHeader icon={GrRobot} iconClass="text-blue-700" label="General settings" />
                </AccordionSummary>
                <AccordionDetails sx={accordionDetailsSx}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        {...tf}

sx={{
                           '& label.Mui-focused': { color: '#10b981' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                  borderWidth: '2px',
                },
              },
                        }}

                        className='myTextField'
                        label="System title"
                        value={formDataGeneralSettings.title || ''}
                        onChange={e => setFormDataGeneralSettings({ ...formDataGeneralSettings, title: e.target.value })}
                        InputProps={{ startAdornment: <InputAdornment position="start"><TitleIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        fullWidth
                        options={timezones}
                        getOptionLabel={o => o.label}
                        value={timezones.find(tz => tz.value === formDataGeneralSettings.timezone) || null}
                        onChange={(_, newValue) => setFormDataGeneralSettings({ ...formDataGeneralSettings, timezone: newValue ? newValue.value : '' })}
                        renderInput={params => (
                          <TextField
                            {...params}
                            label="Timezone"
                            className='myTextField'

sx={{
                           '& label.Mui-focused': { color: '#10b981' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                  borderWidth: '2px',
                },
              },
                        }}

                        
                        InputProps={{ ...params.InputProps, startAdornment: <><InputAdornment position="start">
                              <AccessTimeIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment>{params.InputProps.startAdornment}</> }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <li {...props} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px' }}>
                            <PublicIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <span style={{ fontSize: '0.875rem' }}>{option.label}</span>
                          </li>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        {...tf}
                        multiline
                        rows={3}
                        className='myTextField'

sx={{
                           '& label.Mui-focused': { color: '#10b981' },
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#10b981',
                  borderWidth: '2px',
                },
              },
                        }}
                        label="Allowed IP addresses (comma-separated)"
                        value={formDataGeneralSettings.allowed_ips || ''}
                        onChange={e => setFormDataGeneralSettings({ ...formDataGeneralSettings, allowed_ips: e.target.value })}
                        helperText="Only requests from these IPs will be allowed to access the system. Leave blank to allow all."
                        InputProps={{ startAdornment: <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                          <SecurityIcon sx={{ fontSize: 18, color: 'text.secondary' }} /></InputAdornment> }}
                      />
                    </Grid>
                  </Grid>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <SaveButton loading={loadGeneralSettings}>Save general settings</SaveButton>
                  </div>
                </AccordionDetails>
              </Accordion>
            </form>

          </div>
        </ThemeProvider>
      </Suspense>
    </>
  );
};

export default GeneralSettings;