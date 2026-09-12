import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import PackageNotification from '.././notification/PackageNotification';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useDebounce } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast';
import {
  Gauge, ShieldAlert, Database, Server, Wifi, DollarSign,
  ArrowUp, ArrowDown, Clock, Hash, Layers, CheckCircle2, RefreshCw,
} from 'lucide-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { CircularProgress } from '@mui/material';

// ─────────────────────────────────────────────────────────────────────────
// Design tokens — green / IBM Plex Mono, clean sleek sectioned form
// ─────────────────────────────────────────────────────────────────────────
const GREEN = '#0f9d58';
const GREEN_DARK = '#0b7a44';
const GREEN_SOFT = 'rgba(15,157,88,0.08)';
const GREEN_BORDER = 'rgba(15,157,88,0.35)';

const fontStack = "'IBM Plex Mono', 'Roboto Mono', monospace";

const fieldSx = {
  fontFamily: fontStack,
  '& label': { fontFamily: fontStack },
  '& input, & textarea': { fontFamily: fontStack },
  '& label.Mui-focused': { color: GREEN },
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: GREEN,
      borderWidth: '2px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: GREEN_BORDER,
    },
  },
};

const PLAN_TYPES = [
  { value: 'standard', label: 'Standard', title: 'Standard PPPoE (FTTH)', desc: 'Prepaid balance with an expiry date. The default for home fibre customers.' },
  { value: 'shared', label: 'Shared', title: 'Parent Shared Account', desc: 'One plan, one balance and one expiry shared across every location in a family.' },
  { value: 'dedicated', label: 'Dedicated', title: 'Dedicated Internet', desc: 'Label for dedicated links. Bills exactly like a standard plan in this release.' },
  { value: 'enterprise', label: 'Enterprise', title: 'Enterprise Business', desc: 'Postpaid. The account never expires on a date, it accrues usage and is cut at its credit limit.' },
];

const SectionHeader = ({ index, title, subtitle }) => (
  <div className="flex items-baseline gap-3 mb-3" style={{ fontFamily: fontStack }}>
    <span
      style={{
        color: GREEN,
        fontWeight: 700,
        fontSize: '12px',
        letterSpacing: '0.08em',
      }}
    >
      {index}
    </span>
    <div>
      <p className="m-0 font-bold text-base dark:text-white" style={{ fontFamily: fontStack }}>{title}</p>
      {subtitle && (
        <p className="m-0 text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: fontStack }}>
          {subtitle}
        </p>
      )}
    </div>
  </div>
);

const SectionCard = ({ children, style }) => (
  <div
    style={{
      border: '1px solid rgba(0,0,0,0.08)',
      borderRadius: '16px',
      padding: '20px',
      marginTop: '18px',
      background: 'inherit',
      ...style,
    }}
    className="dark:border-[#2a2a2a]"
  >
    {children}
  </div>
);

const EditPackage = ({
  open, handleClose, formData, loading, setFormData, showNotification,
  createPackage, offlineerror, isloading,
  editPackage, allPackages, selectedRouter, setSelectedRouter,
}) => {
  const [routers, setRouters] = useState([]);
  const [mikrotik_router, setRouter] = useState(null);
  const [loadingRouters, setLoadingRouters] = useState(false);
  const [routerDetails, setRouterDetails] = useState(null);
  const { router_name } = formData;

  function useIsDarkMode() {
    const [isDark, setIsDark] = useState(
      () => typeof document !== 'undefined' &&
        document.documentElement.classList.contains('dark')
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

  const isDark = useIsDarkMode();

  const tableTheme = useMemo(() => createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: { main: GREEN },
      background: {
        paper: isDark ? '#151515' : '#ffffff',
        default: isDark ? '#151515' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f1f1' : '#111111',
        secondary: isDark ? '#a3a3a3' : '#6b7280',
      },
    },
    typography: { fontFamily: fontStack },
  }), [isDark]);

  useEffect(() => { setRouter(router_name); }, [router_name]);
  useDebounce(router_name, 1000);

  const subdomain = window.location.hostname.split('.')[0];

  const fetchRouters = useCallback(async () => {
    try {
      setLoadingRouters(true);
      const response = await fetch('/api/routers', { headers: { 'X-Subdomain': subdomain } });
      const data = await response.json();
      setRouters(data || []);
      if (formData?.id && formData?.nas_router) {
        setSelectedRouter(formData.nas_router);
        const router = data.find(r => r.name === formData.nas_router);
        if (router) setRouterDetails(router);
      }
    } catch (error) {
      toast.error('Failed to load routers');
    } finally {
      setLoadingRouters(false);
    }
  }, [formData, subdomain]);

  useEffect(() => { if (open) fetchRouters(); }, [open, fetchRouters]);

  // ── IP pools ─────────────────────────────────────────────────────────
  // Package.nas_router and Package.ip_pool are plain name strings — same
  // flat pattern as HotspotPackage/NasRouter.find_by(name:) elsewhere in
  // the app. No join table, no _id juggling: pick a router, pick one of
  // its pools, done.
  const [ipPools, setIpPools] = useState([]);
  const [loadingIpPools, setLoadingIpPools] = useState(false);

  const fetchIpPools = useCallback(async () => {
    try {
      setLoadingIpPools(true);
      const response = await fetch('/api/ip_pools', { headers: { 'X-Subdomain': subdomain } });
      const data = await response.json();
      setIpPools(data || []);
    } catch (error) {
      toast.error('Failed to load IP pools');
    } finally {
      setLoadingIpPools(false);
    }
  }, [subdomain]);

  useEffect(() => { if (open) fetchIpPools(); }, [open, fetchIpPools]);

  const poolsForRouter = useMemo(() => {
    const routerId = routers.find(r => r.name === selectedRouter)?.id;
    if (!routerId) return [];
    return ipPools.filter(p => p.nas_router_id === routerId);
  }, [ipPools, selectedRouter, routers]);

  const handleIpPoolChange = (e) => setFormData({ ...formData, ip_pool: e.target.value });

  // ── FUP helpers ──────────────────────────────────────────────────────
  const fupEnabled = !!formData.fup_enabled;
  const fupDataUnit = formData.fup_data_unit || 'GB';

  const eligibleFupPlans = useMemo(() => {
    const currentDownload = Number(formData.download_limit) || 0;
    if (!Array.isArray(allPackages)) return [];
    return allPackages.filter((pkg) => {
      if (editPackage && pkg.id === formData.id) return false;
      return Number(pkg.download_limit) < currentDownload;
    });
  }, [allPackages, formData.download_limit, formData.id, editPackage]);

  const toggleFup = (e) => {
    const checked = e.target.checked;
    setFormData({
      ...formData,
      fup_enabled: checked,
      ...(checked ? {} : { fup_data_limit: '', fup_throttle_plan_id: '' }),
    });
  };

  const onFupUnitChange = (e) => setFormData({ ...formData, fup_data_unit: e.target.value });
  const onFupThrottlePlanChange = (e) => setFormData({ ...formData, fup_throttle_plan_id: e.target.value });

  const handleRouterChange = (e) => {
    const routerName = e.target.value;
    setSelectedRouter(routerName);
    const selected = routers.find(r => r.name === routerName);
    setRouterDetails(selected || null);
    // Auto-fill the pool when the router only has one — most routers do.
    // Only leaves it blank (forcing a manual pick) when there's a real choice.
    const matchingPools = ipPools.filter(p => p.nas_router_id === selected?.id);
    setFormData({
      ...formData,
      router_name: selected?.name || '',
      nas_router: selected?.name || '',
      ip_pool: matchingPools.length === 1 ? matchingPools[0].name : '',
    });
  };

  const onChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const setPlanType = (value) => setFormData({ ...formData, plan_type: value });

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ThemeProvider theme={tableTheme}>
      <Toaster />
      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={fullScreen}
        fullWidth
        maxWidth="md"
        PaperProps={{
          style: {
            borderRadius: fullScreen ? 0 : '20px',
            fontFamily: fontStack,
          },
        }}
      >
        <DialogContent style={{ fontFamily: fontStack }}>
          <div className="mb-1">
            <p className="m-0 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400" style={{ fontFamily: fontStack }}>
              PPPoE · Plans · {editPackage ? 'Edit' : 'New'}
            </p>
            <p className="m-0 text-xl font-bold dark:text-white" style={{ fontFamily: fontStack }}>
              {editPackage ? `Edit ${formData.name || 'plan'}` : 'New PPPoE plan'}
            </p>
            <p className="m-0 text-sm text-gray-500 dark:text-gray-400" style={{ fontFamily: fontStack }}>
              Name it, set the speed and price, pick the routers. Everything else is optional.
            </p>
          </div>

          <form onSubmit={createPackage}>

            {/* Plan type */}
            <SectionCard>
              <SectionHeader
                index="●"
                title="Plan type"
                subtitle="What kind of plan is this? The type drives how customers on this plan are billed."
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PLAN_TYPES.map((pt) => {
                  const isSelected = (formData.plan_type || 'standard') === pt.value;
                  return (
                    <div
                      key={pt.value}
                      onClick={() => setPlanType(pt.value)}
                      style={{
                        cursor: 'pointer',
                        borderRadius: '12px',
                        border: `1.5px solid ${isSelected ? GREEN : 'rgba(0,0,0,0.1)'}`,
                        background: isSelected ? GREEN_SOFT : 'transparent',
                        padding: '12px',
                        transition: 'all .15s ease',
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm dark:text-white" style={{ fontFamily: fontStack }}>{pt.label}</span>
                        {isSelected && <CheckCircle2 size={16} color={GREEN} />}
                      </div>
                      <p className="m-0 mt-1 text-xs font-semibold dark:text-gray-200" style={{ fontFamily: fontStack }}>{pt.title}</p>
                      <p className="m-0 mt-1 text-xs text-gray-500 dark:text-gray-400 leading-snug" style={{ fontFamily: fontStack }}>{pt.desc}</p>
                    </div>
                  );
                })}
              </div>
            </SectionCard>

            {/* 01 · Basics */}
            <SectionCard>
              <SectionHeader index="01" title="Basics" subtitle="What is it called. The name is what customers see. The profile name is what the router sees." />
              <div className="flex flex-col sm:flex-row gap-3">
                <TextField
                  id="name" label="Plan name" placeholder="e.g. Home 10M"

                  className='myTextField'
                  value={formData.name || ''} onChange={onChange}
                  InputProps={{ startAdornment: <Wifi className="mr-2 w-4 h-4"
                     color={GREEN} /> }}
                  sx={fieldSx} fullWidth
                />
                <TextField
                className='myTextField'
                  id="router_profile_name" label="Router profile name" placeholder="Leave empty to use the plan name"
                  value={formData.router_profile_name || ''} onChange={onChange}
                  sx={fieldSx} fullWidth
                />
              </div>
              <TextField

                id="description" label="Description" placeholder="Optional. Shown on the customer portal and invoices."
                value={formData.description || ''} onChange={onChange}
                sx={{ ...fieldSx, mt: 2 }} fullWidth multiline minRows={2}
              />
              <div className="flex items-center gap-8 mt-3 flex-wrap">
                <FormControl sx={{ minWidth: 160, ...fieldSx }}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label" id="status" label="Status"
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!!formData.public}
                    onChange={(e) => setFormData({ ...formData, public: e.target.checked })}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: GREEN },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: GREEN },
                    }}
                  />
                  <span className="text-sm dark:text-gray-200" style={{ fontFamily: fontStack }}>Public — customers can pick it themselves</span>
                </div>
              </div>
            </SectionCard>

            {/* 02 · Speed */}
            <SectionCard>
              <SectionHeader index="02" title="Speed" subtitle="How fast. Speeds in MikroTik form: 10M, 512k, 1G." />
              <p className="m-0 mb-2 text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: fontStack }}>
                {(formData.download_limit || 'n/a')}M down · {(formData.upload_limit || 'n/a')}M up
              </p>
              <div className="flex gap-3 flex-wrap">
                <TextField
                className='myTextField'
                  id="download_limit" label="Download (mbps)" type="number"
                  value={formData.download_limit || ''} onChange={onChange}
                  InputProps={{ startAdornment: <ArrowDown className="mr-2 w-4 h-4" color={GREEN} /> }}
                  sx={fieldSx} fullWidth
                />
                <TextField
                className='myTextField'
                  id="upload_limit" label="Upload (mbps)" type="number"
                  value={formData.upload_limit || ''} onChange={onChange}
                  InputProps={{ startAdornment: <ArrowUp className="mr-2 w-4 h-4" color={GREEN} /> }}
                  sx={fieldSx} fullWidth
                />
                <TextField
                className='myTextField'
                  id="aggregation" label="Aggregation"
                  value={formData.aggregation || ''} onChange={onChange}
                  InputProps={{ startAdornment: <Hash className="mr-2 w-4 h-4" color={GREEN} /> }}
                  sx={fieldSx} fullWidth
                />
              </div>

              <Alert
                severity="info"
                icon={<Layers size={18} color={GREEN} />}
                sx={{ mt: 2, borderRadius: '12px', fontFamily: fontStack, backgroundColor: GREEN_SOFT, color: 'inherit' }}
              >
                <AlertTitle sx={{ fontFamily: fontStack, fontWeight: 700 }}>Burst</AlertTitle>
                A short boost when a download starts. Threshold and burst time are set automatically, or tune them below.
              </Alert>

              <div className="flex gap-3 flex-wrap mt-3">
                <TextField
                className='myTextField'
                  id="burst_download_speed" label="Burst download (mbps)"
                  value={formData.burst_download_speed || ''} onChange={onChange}
                  InputProps={{ startAdornment: <ArrowDown className="mr-2 w-4 h-4" /> }}
                  sx={fieldSx} fullWidth
                />
                <TextField
                  className='myTextField'
                  id="burst_upload_speed" label="Burst upload (mbps)"
                  value={formData.burst_upload_speed || ''} onChange={onChange}
                  InputProps={{ startAdornment: <ArrowUp className="mr-2 w-4 h-4" /> }}
                  sx={fieldSx} fullWidth
                />
                <TextField
                  className='myTextField'
                  id="burst_threshold_download" label="Burst threshold down (mbps)"
                  value={formData.burst_threshold_download || ''} onChange={onChange}
                  sx={fieldSx} fullWidth
                />
                <TextField

                  className='myTextField'
                  id="burst_threshold_upload" label="Burst threshold up (mbps)"
                  value={formData.burst_threshold_upload || ''} onChange={onChange}
                  sx={fieldSx} fullWidth
                />
                <TextField
                  className='myTextField'

                  id="burst_time" label="Burst time (s)" type="number"
                  value={formData.burst_time || ''} onChange={onChange}
                  InputProps={{ startAdornment: <Clock className="mr-2 w-4 h-4" /> }}
                  sx={fieldSx} fullWidth
                />
              </div>
            </SectionCard>

            {/* 03 · Price */}
            <SectionCard>
              <SectionHeader index="03" title="Price" subtitle="What it costs. Price per validity period, before tax." />
              <div className="flex gap-3 flex-wrap items-start">
                <TextField
                  className='myTextField'
                  id="price" label="Price (KES)" type="number"
                  value={formData.price || ''} onChange={onChange}
                  InputProps={{ startAdornment: <DollarSign className="mr-2 w-4 h-4" color={GREEN} /> }}
                  sx={fieldSx} fullWidth
                />
                <TextField
                className='myTextField'
                  id="validity" label="Validity" type="number"
                  value={formData.validity || ''} onChange={onChange}
                  sx={fieldSx} fullWidth
                />
                <FormControl sx={{ minWidth: 160, ...fieldSx }}>
                  <InputLabel id="validity-unit-label">Unit</InputLabel>
                  <Select
                    labelId="validity-unit-label" id="validity_period_units" label="Unit"
                    value={formData.validity_period_units || 'days'}
                    onChange={(e) => setFormData({ ...formData, validity_period_units: e.target.value })}
                  >
                    <MenuItem value="days">days</MenuItem>
                    <MenuItem value="hours">hours</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                className='myTextField'
                  id="daily_charge" label="Daily charge"
                  value={formData.daily_charge || ''} onChange={onChange}
                  sx={fieldSx} fullWidth
                />
              </div>
              <p className="m-0 mt-2 text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: fontStack }}>
                How long one payment lasts.
              </p>
            </SectionCard>

            {/* 04 · Fair usage */}
            <SectionCard style={{
              borderColor: fupEnabled ? GREEN_BORDER : undefined,
              backgroundColor: fupEnabled ? GREEN_SOFT : undefined,
            }}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <SectionHeader index="04" title="Fair usage" subtitle="Slow heavy users. Past the cap the customer drops to a slower plan, then comes back when the period resets." />
                <div className="flex items-center gap-2">
                  <Gauge size={18} color={fupEnabled ? GREEN : '#9ca3af'} />
                  <Switch
                    checked={fupEnabled}
                    onChange={toggleFup}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': { color: GREEN },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: GREEN },
                    }}
                  />
                </div>
              </div>

              {fupEnabled ? (
                <div className="mt-3 space-y-3" style={{ animation: 'fupFadeIn .2s ease' }}>
                  <div className="flex gap-3 flex-wrap">
                    <TextField
                    className='myTextField'
                      id="fup_data_limit" label="Fair usage cap" type="number" placeholder="e.g. 500"
                      value={formData.fup_data_limit || ''} onChange={onChange}
                      InputProps={{ startAdornment: <Database className="mr-2 w-4 h-4" color={GREEN} /> }}
                      helperText={formData.fup_data_limit ? `Limit: ${Number(formData.fup_data_limit).toLocaleString()} ${fupDataUnit}` : 'Off means unlimited at full speed.'}
                      sx={{ ...fieldSx, flex: 2 }} fullWidth
                    />
                    <FormControl sx={{ flex: 1, minWidth: 120, ...fieldSx }}>
                      <InputLabel id="fup-unit-label">Unit</InputLabel>
                      <Select labelId="fup-unit-label" id="fup_data_unit" value={fupDataUnit} label="Unit" onChange={onFupUnitChange}>
                        <MenuItem value="GB">GB</MenuItem>
                        <MenuItem value="TB">TB</MenuItem>
                      </Select>
                    </FormControl>
                  </div>

                  <FormControl fullWidth error={eligibleFupPlans.length === 0} sx={fieldSx}>
                    <InputLabel id="fup-throttle-plan-label">Throttle plan (switch to when limit exceeded)</InputLabel>
                    <Select
                      labelId="fup-throttle-plan-label" id="fup_throttle_plan_id"
                      value={formData.fup_throttle_plan_id || ''}
                      label="Throttle plan (switch to when limit exceeded)"
                      onChange={onFupThrottlePlanChange}
                      disabled={eligibleFupPlans.length === 0}
                    >
                      {eligibleFupPlans.map((pkg) => (
                        <MenuItem key={pkg.id} value={pkg.id}>{pkg.name} — {pkg.download_limit} Mbps</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {eligibleFupPlans.length === 0 && (
                    <Alert severity="warning" icon={<ShieldAlert size={18} />} sx={{ borderRadius: '12px', fontFamily: fontStack }}>
                      No eligible FUP plans found. Create a plan with a lower download speed first.
                      Current plan speed: {formData.download_limit || 0} Mbps.
                    </Alert>
                  )}
                </div>
              ) : (
                <p className="m-0 mt-1 text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: fontStack }}>
                  Off means unlimited at full speed.
                </p>
              )}
            </SectionCard>

            {/* 05 · Routers */}
            <SectionCard>
              <SectionHeader
                index="05"
                title="Routers"
                subtitle="Where it runs. Only routers with a PPPoE pool can carry a plan. The first pool you pick is the default."
              />
              {loadingRouters ? (
                <div className="flex items-center justify-center py-5">
                  <CircularProgress size={26} style={{ color: GREEN }} />
                  <span className="ml-3 text-sm dark:text-gray-200" style={{ fontFamily: fontStack }}>Loading routers…</span>
                </div>
              ) : routers.length === 0 ? (
                <Alert severity="warning" sx={{ borderRadius: '12px', fontFamily: fontStack }}>No routers found. Add a router first.</Alert>
              ) : (
                <>
                  <FormControl fullWidth sx={{ mb: 1.5, ...fieldSx }}>
                    <InputLabel id="router-select-label">Select router</InputLabel>
                    <Select
                      labelId="router-select-label" value={selectedRouter || ''}
                      onChange={handleRouterChange} label="Select router"
                    >
                      <MenuItem value=""><em>Choose a router…</em></MenuItem>
                      {routers.map((router) => (
                        <MenuItem key={router.id} value={router.name}>
                          <div className="flex items-center gap-2">
                            <Server className="w-4 h-4" color={GREEN} />
                            {router.name}
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {routerDetails && (
                    <div
                      className="dark:bg-[#1e1e1e]"
                      style={{ padding: '12px 16px', background: 'white', borderRadius: '10px', borderLeft: `4px solid ${GREEN}` }}
                    >
                      <p className="m-0 font-bold text-sm dark:text-white" style={{ fontFamily: fontStack }}>Selected router</p>
                      <div className="text-xs mt-1 dark:text-gray-300" style={{ fontFamily: fontStack }}>
                        <div>Name: <strong>{routerDetails.name}</strong></div>
                        <div>IP: <strong>{routerDetails.ip_address}</strong></div>
                      </div>
                    </div>
                  )}

                  {poolsForRouter.length > 1 ? (
                    <FormControl
                      fullWidth
                      disabled={!selectedRouter}
                      sx={{ mt: 1.5, ...fieldSx }}
                    >
                      <InputLabel id="ip-pool-select-label">Select IP pool</InputLabel>
                      <Select
                        labelId="ip-pool-select-label"
                        value={formData.ip_pool || ''}
                        onChange={handleIpPoolChange}
                        label="Select IP pool"
                      >
                        <MenuItem value=""><em>Choose a pool…</em></MenuItem>
                        {poolsForRouter.map((pool) => (
                          <MenuItem key={pool.id} value={pool.name}>
                            {pool.name} ({pool.ip_range_start} – {pool.ip_range_end})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : poolsForRouter.length === 1 ? (
                    <div
                      className="mt-3 dark:bg-[#1e1e1e]"
                      style={{ padding: '10px 14px', background: '#f7faf8', borderRadius: '10px', fontFamily: fontStack }}
                    >
                      <span className="text-xs text-gray-500 dark:text-gray-400">Pool: </span>
                      <span className="text-sm font-semibold dark:text-white">
                        {poolsForRouter[0].name} ({poolsForRouter[0].ip_range_start} – {poolsForRouter[0].ip_range_end})
                      </span>
                    </div>
                  ) : null}
                  {selectedRouter && !loadingIpPools && poolsForRouter.length === 0 && (
                    <Alert severity="warning" sx={{ mt: 1, borderRadius: '12px', fontFamily: fontStack }}>
                      No IP pools found on this router. Create one on the IP Pools page first.
                    </Alert>
                  )}

                  <div
                    className="flex items-center gap-2 mt-3 dark:bg-[#1c1c1c]"
                    style={{ padding: '10px 14px', background: GREEN_SOFT, borderRadius: '10px' }}
                  >
                    <RefreshCw size={16} color={GREEN} />
                    <label className="flex items-center gap-2 cursor-pointer flex-1" style={{ fontFamily: fontStack }}>
                      <span className="text-sm dark:text-gray-200">Sync to router immediately</span>
                    </label>
                    <Switch
                      checked={formData.sync_immediately !== false}
                      onChange={(e) => setFormData({ ...formData, sync_immediately: e.target.checked })}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': { color: GREEN },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: GREEN },
                      }}
                    />
                  </div>
                  <p className="m-0 mt-1 text-xs text-gray-500 dark:text-gray-400" style={{ fontFamily: fontStack }}>
                    Creates or updates the PPP profile on every selected router as soon as you save.
                  </p>
                </>
              )}
            </SectionCard>

            <DialogActions sx={{ mt: 2, px: 0 }}>
              <button
                onClick={(e) => { handleClose(); e.preventDefault(); }}
                disabled={isloading}
                style={{ fontFamily: fontStack }}
                className="rounded-full px-5 py-2 text-sm font-semibold border border-gray-300
                  text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:border-gray-600
                  dark:hover:bg-[#222] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isloading}
                style={{ fontFamily: fontStack, backgroundColor: GREEN }}
                className="rounded-full px-6 py-2 text-sm font-semibold text-white min-w-[120px]
                  flex items-center justify-center gap-2 transition hover:opacity-90
                  disabled:opacity-60 disabled:cursor-not-allowed"
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = GREEN_DARK)}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = GREEN)}
              >
                {isloading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    {editPackage ? 'Updating…' : 'Saving…'}
                  </>
                ) : (
                  editPackage ? 'Update plan' : 'Save plan'
                )}
              </button>
            </DialogActions>
          </form>

          {showNotification && <PackageNotification />}
          {offlineerror && (
            <p className="text-red-500 font-extrabold mt-2" style={{ fontFamily: fontStack }}>
              Something went wrong please try again later
            </p>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes fupFadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </ThemeProvider>
  );
};

export default EditPackage;