import { Grid, Switch, FormControlLabel, InputAdornment } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Warning as WarningIcon, CheckCircle as CheckCircleIcon, Settings as SettingsIcon, CalendarToday as CalendarIcon, Lock as LicenseIcon, Phone as PhoneIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { RefreshCw, Save, ShieldAlert } from 'lucide-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// ─── Design tokens (shared system) ───────────────────────────────────────────
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
  '& .MuiFormHelperText-root': { fontSize: '0.75rem', marginTop: '4px', lineHeight: 1.4 },
};

const cssVars = `
  :root  { --divider: rgba(0,0,0,0.08); --text-secondary: #6b7280; --text-tertiary: #9ca3af; }
  .dark  { --divider: rgba(255,255,255,0.1); --text-secondary: #9ca3af; --text-tertiary: #6b7280; }
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

const Card = ({ children, style = {} }) => (
  <div style={{
    border: '1px solid var(--divider)',
    borderRadius: tokens.radius,
    padding: '28px',
    ...style,
  }}>
    {children}
  </div>
);

const CardHeader = ({ icon: Icon, iconClass = '', title, description }) => (
  <div style={{ marginBottom: 24 }}>
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

const InfoBox = ({ children, variant = 'info' }) => {
  const colors = {
    info:    { bg: 'rgba(59,130,246,0.06)',  border: 'rgba(59,130,246,0.2)' },
    warning: { bg: 'rgba(245,158,11,0.07)',  border: 'rgba(245,158,11,0.25)' },
    success: { bg: 'rgba(34,197,94,0.06)',   border: 'rgba(34,197,94,0.22)' },
  };
  const c = colors[variant] || colors.info;
  return (
    <div style={{
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: tokens.radiusSm, padding: '12px 16px',
      fontSize: '0.8125rem', lineHeight: 1.6,
    }}>
      {children}
    </div>
  );
};

const SaveButton = ({ loading = false, children = 'Save settings' }) => (
  <motion.button
    type="submit"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    disabled={loading}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '9px 22px', fontSize: '0.875rem', fontWeight: 500,
      color: '#fff', background: loading ? '#6b7280' : '#1a1a1a',
      border: 'none', borderRadius: '8px',
      cursor: loading ? 'not-allowed' : 'pointer',
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

// ─── Live preview pill ────────────────────────────────────────────────────────
const PreviewRow = ({ label, value }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '8px 0', borderBottom: '1px solid var(--divider)',
  }}>
    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{label}</span>
    <span style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{value}</span>
  </div>
);

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
const LicenseSettings = () => {
  const [loading, setLoading]           = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [initialValues, setInitialValues] = useState({
    warningDays: 2,
    phoneNotification: false,
    phoneNumber: '',
  });

  const subdomain = window.location.hostname.split('.')[0];
  const isDark = useIsDarkMode();

  const muiTheme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: { main: '#2563eb' },
      background: {
        paper:   isDark ? '#1c1c1e' : '#ffffff',
        default: isDark ? '#111113' : '#f9f9fb',
      },
      text: {
        primary:   isDark ? '#f0f0f0' : '#111827',
        secondary: isDark ? '#a3a3a3' : '#6b7280',
      },
    },
    shape: { borderRadius: 8 },
  });

  const fetchSettings = useCallback(async () => {
    try {
      const res  = await fetch('/api/license_settings', { headers: { 'X-Subdomain': subdomain } });
      const data = await res.json();
      if (res.ok) {
        setInitialValues({
          warningDays:       data[0].expiry_warning_days  ?? 2,
          phoneNotification: data[0].phone_notification   ?? false,
          phoneNumber:       data[0].phone_number         ?? '',
        });
      } else {
        if (res.status === 402) setTimeout(() => { window.location.href = '/license-expired'; }, 1800);
        if (res.status === 401) {
          toast.error(data.error, { position: 'top-center', duration: 4000 });
          setTimeout(() => { window.location.href = '/signin'; }, 1900);
        }
      }
    } catch {
      // silently fail — toast shown only on hard errors
    } finally {
      setLoading(false);
    }
  }, [subdomain]);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: Yup.object({
      warningDays: Yup.number()
        .min(1, 'Must be at least 1 day')
        .max(30, 'Cannot exceed 30 days')
        .required('Required'),
      phoneNumber: Yup.string().when('phoneNotification', {
        is: true,
        then: () =>
          Yup.string()
            .matches(/^[0-9]+$/, 'Digits only')
            .min(10, 'At least 10 digits')
            .max(15, '15 digits maximum')
            .required('Required when SMS notifications are on'),
        otherwise: () => Yup.string().notRequired(),
      }),
    }),
    onSubmit: async values => {
      try {
        setSubmitLoading(true);
        const response = await fetch('/api/license_settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
          body: JSON.stringify({
            expiry_warning_days: values.warningDays,
            phone_notification:  values.phoneNotification,
            phone_number:        values.phoneNumber,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to save settings');
        }
        const updatedData = await response.json();
        setInitialValues({
          warningDays:       updatedData.expiry_warning_days,
          phoneNotification: updatedData.phone_notification,
          phoneNumber:       updatedData.phone_number,
        });
        toast.success('License settings saved', { position: 'top-center', duration: 3000 });
      } catch (err) {
        toast.error(err.message, { position: 'top-center', duration: 3000 });
      } finally {
        setSubmitLoading(false);
      }
    },
  });

  // ── Loading skeleton ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <RefreshCw style={{ animation: 'spin 1s linear infinite', color: '#3b82f6', width: 28, height: 28 }} />
        <style>{cssVars}</style>
      </div>
    );
  }

  const tf = { sx: { ...fieldSx, width: '100%' } };

  return (
    <>
      <style>{cssVars}</style>
      <ThemeProvider theme={muiTheme}>
        <Toaster toastOptions={{ style: { fontSize: '0.875rem', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' } }} />

        <form onSubmit={formik.handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* ── Main settings card ─────────────────────────────────────────── */}
            <Card>
              <CardHeader
                icon={ShieldAlert}
                title="License settings"
                description="Configure expiration warnings and how administrators are notified when the license is about to expire."
              />

              <SectionLabel>Expiration warning</SectionLabel>

              <Grid container spacing={3} alignItems="flex-start">
                <Grid item xs={12} sm={6}>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: '0 0 14px' }}>
                    Choose how many days before expiry the warning should appear. A smaller number means less lead time; 7–14 days is typical.
                  </p>
                  <TextField
                    {...tf}
                    name="warningDays"
                    label="Days before expiry"
                    type="number"
                    value={formik.values.warningDays}
                    onChange={formik.handleChange}
                    className='myTextField'
                    onBlur={formik.handleBlur}
                    error={formik.touched.warningDays && Boolean(formik.errors.warningDays)}
                    helperText={formik.touched.warningDays && formik.errors.warningDays}
                    inputProps={{ min: 1, max: 30 }}
                    sx={{ ...fieldSx, width: '100%', maxWidth: 200 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                {/* Live preview */}
                <Grid item xs={12} sm={6}>
                  <div style={{
                    border: '1px solid var(--divider)',
                    borderRadius: tokens.radiusSm,
                    padding: '16px',
                  }}>
                    <p style={{ margin: '0 0 12px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>
                      Preview
                    </p>
                    <PreviewRow
                      label="Warning shown"
                      value={`${formik.values.warningDays} day${formik.values.warningDays !== 1 ? 's' : ''} before expiry`}
                    />
                    <PreviewRow
                      label="SMS notifications"
                      value={formik.values.phoneNotification ? 'Enabled' : 'Disabled'}
                    />
                    {formik.values.phoneNotification && formik.values.phoneNumber && (
                      <PreviewRow
                        label="Notify number"
                        value={formik.values.phoneNumber}
                      />
                    )}
                  </div>
                </Grid>
              </Grid>

              <SectionLabel>SMS notifications</SectionLabel>

              <FormControlLabel
                control={
                  <Switch
                    name="phoneNotification"
                    checked={formik.values.phoneNotification}
                    onChange={formik.handleChange}
                    color="primary"
                    size="small"
                  />
                }
                label={
                  <div style={{ marginLeft: 4 }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 500 }}>Enable SMS notifications</p>
                    <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Send a text message to the number below when the license is close to expiring.
                    </p>
                  </div>
                }
                sx={{ alignItems: 'flex-start', mb: formik.values.phoneNotification ? 2 : 0 }}
              />

              {formik.values.phoneNotification && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ marginTop: 16 }}
                >
                  <TextField
                    name="phoneNumber"
                    label="Notification phone number"
                    className='myTextField'
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={(formik.touched.phoneNumber && formik.errors.phoneNumber) || 'Include country code — e.g. 254712345678'}
                    placeholder="254712345678"
                    sx={{ ...fieldSx, width: '100%', maxWidth: 300 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <InfoBox variant="info" style={{ marginTop: 12 }}>
                    Standard SMS rates apply. Make sure the number is reachable and can receive international messages if your provider is abroad.
                  </InfoBox>
                </motion.div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--divider)' }}>
                <SaveButton loading={submitLoading}>Save license settings</SaveButton>
              </div>
            </Card>

          </div>
        </form>
      </ThemeProvider>
    </>
  );
};

export default LicenseSettings;