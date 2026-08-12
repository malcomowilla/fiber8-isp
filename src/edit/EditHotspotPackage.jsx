import React from "react";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { useApplicationSettings } from "../settings/ApplicationSettings";
import { Button } from "../components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import Autocomplete from "@mui/material/Autocomplete";
import { IoWifiOutline } from "react-icons/io5";
import { FaLongArrowAltUp, FaLongArrowAltDown } from "react-icons/fa";
import { LuCalendar1 } from "react-icons/lu";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Select, MenuItem, InputLabel, Stack, Divider, CircularProgress } from "@mui/material";
import {
  Tv, Smartphone, Monitor, Printer, Router, Globe, ShieldAlert, Server
} from 'lucide-react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import toast, { Toaster } from 'react-hot-toast';




// ─── Shared MUI focus styles ──────────────────────────────────────────────────
const focusSx = {
  "& label.Mui-focused": { color: "black", fontSize: "17px" },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
      borderWidth: "3px",
    },
    "&.Mui-focused fieldset": { borderColor: "black" },
  },
};

const DEVICE_TYPES = [
  { value: 'tv',      label: 'Smart TV',      icon: Tv,        emoji: '📺' },
  { value: 'phone',   label: 'Phone/Tablet',  icon: Smartphone, emoji: '📱' },
  { value: 'pc',      label: 'PC/Laptop',     icon: Monitor,    emoji: '💻' },
  { value: 'printer', label: 'Printer',       icon: Printer,    emoji: '🖨️' },
  { value: 'router',  label: 'Router',        icon: Router,     emoji: '📡' },
  { value: null,      label: 'All Devices',   icon: Globe,      emoji: '🌐' },
];

// ─── BurstSection ─────────────────────────────────────────────────────────────
function BurstSection({ hotspotPackage, setHotspotPackage }) {
  const enabled = !!hotspotPackage.burst_enabled;

  const set = (field, value) =>
    setHotspotPackage((prev) => ({ ...prev, [field]: value }));

  const disable = () =>
    setHotspotPackage((prev) => ({
      ...prev,
      burst_enabled: false,
      burst_limit_download: "",
      burst_limit_upload: "",
      burst_threshold_download: "",
      burst_threshold_upload: "",
      burst_time: "",
    }));

  return (
    <div className="mt-6 rounded-xl border-2 border-gray-200 overflow-hidden font-sans">
      {/* ── Toggle header ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            ⚡ Enable Speed Burst?
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Allow users to temporarily exceed normal speed limits
          </p>
        </div>

        {/* Yes / No toggle */}
        <div className="flex rounded-lg border-2 border-gray-300 overflow-hidden text-sm font-semibold shadow-sm">
          <button
            type="button"
            onClick={() => set("burst_enabled", true)}
            className={`px-4 py-2 transition-all cursor-pointer border-none font-medium
              ${
                enabled
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={disable}
            className={`px-4 py-2 transition-all cursor-pointer border-none border-l border-gray-300 font-medium
              ${
                !enabled
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
          >
            No
          </button>
        </div>
      </div>

      {/* ── Burst fields ── */}
      {enabled && (
        <div className="px-4 py-5 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Burst Limit Download */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Burst Download Limit <span className="text-red-500">*</span>
            </label>
            <TextField
              fullWidth
              size="small"
              className="myTextField"
              placeholder="e.g., 20M"
              value={hotspotPackage.burst_limit_download || ""}
              onChange={(e) => set("burst_limit_download", e.target.value)}
              helperText="Max burst download speed"
              sx={focusSx}
              InputProps={{
                startAdornment: (
                  <FaLongArrowAltDown className="mr-2 text-blue-500" />
                ),
              }}
            />
          </div>

          {/* Burst Limit Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Burst Upload Limit <span className="text-red-500">*</span>
            </label>
            <TextField
              fullWidth
              size="small"
              className="myTextField"
              placeholder="e.g., 10M"
              value={hotspotPackage.burst_limit_upload || ""}
              onChange={(e) => set("burst_limit_upload", e.target.value)}
              helperText="Max burst upload speed"
              sx={focusSx}
              InputProps={{
                startAdornment: (
                  <FaLongArrowAltUp className="mr-2 text-blue-500" />
                ),
              }}
            />
          </div>

          {/* Burst Threshold Download */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Download Threshold <span className="text-red-500">*</span>
            </label>
            <TextField
              fullWidth
              size="small"
              className="myTextField"
              placeholder="e.g., 10M"
              value={hotspotPackage.burst_threshold_download || ""}
              onChange={(e) => set("burst_threshold_download", e.target.value)}
              helperText="Speed at which burst activates"
              sx={focusSx}
              InputProps={{
                startAdornment: (
                  <FaLongArrowAltDown className="mr-2 text-gray-400" />
                ),
              }}
            />
          </div>

          {/* Burst Threshold Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Upload Threshold <span className="text-red-500">*</span>
            </label>
            <TextField
              fullWidth
              size="small"
              className="myTextField"
              placeholder="e.g., 5M"
              value={hotspotPackage.burst_threshold_upload || ""}
              onChange={(e) => set("burst_threshold_upload", e.target.value)}
              helperText="Speed at which burst activates"
              sx={focusSx}
              InputProps={{
                startAdornment: (
                  <FaLongArrowAltUp className="mr-2 text-gray-400" />
                ),
              }}
            />
          </div>

          {/* Burst Duration */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Burst Duration (seconds) <span className="text-red-500">*</span>
            </label>
            <TextField
              fullWidth
              size="small"
              className="myTextField"
              type="number"
              placeholder="e.g., 10"
              inputProps={{ min: 1 }}
              value={hotspotPackage.burst_time || ""}
              onChange={(e) => set("burst_time", e.target.value)}
              helperText="How long the burst lasts"
              sx={focusSx}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── DeviceTypeSection ────────────────────────────────────────────────────────
function DeviceTypeSection({ hotspotPackage, setHotspotPackage }) {
  return (
    <Stack sx={{ width: '100%', mt: 3 }}>
      <Alert severity="success">
        <AlertTitle><p className="font-sans">📱 Device Type (Optional)</p></AlertTitle>
        <p className="font-sans"> Select which device this package is optimized for. Leave empty if it's for all devices. </p>
      </Alert>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
          gap: 2,
          mt: 2,
        }}
      >
        {DEVICE_TYPES.map(({ value, label, icon: IconComponent, emoji }) => {
          const isSelected = hotspotPackage.intended_device_type === value;
          return (
            <Box
              key={value || 'all'}
              onClick={() =>
                setHotspotPackage({
                  ...hotspotPackage,
                  intended_device_type: value,
                  device_icon: emoji,
                })
              }
              sx={{
                p: 2.5,
                border: '2px solid',
                borderColor: isSelected ? '#10b981' : '#e5e7eb',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all .2s ease',
                backgroundColor: isSelected ? 'rgba(16,185,129,0.08)' : 'transparent',
                '&:hover': {
                  borderColor: '#10b981',
                  backgroundColor: 'rgba(16,185,129,0.04)',
                },
              }}
            >
              <div className="flex flex-col items-center gap-2 font-sans">
                <div className="text-2xl">{emoji}</div>
                <div className="flex items-center gap-1.5">
                  <IconComponent size={16} />
                  <span className="text-sm font-medium text-center">{label}</span>
                </div>
              </div>
            </Box>
          );
        })}
      </Box>

      {hotspotPackage.intended_device_type && (
        <Alert severity="info" sx={{ mt: 2 }}>
          ✓ This package is tagged for:{' '}
          <strong>
            {DEVICE_TYPES.find(d => d.value === hotspotPackage.intended_device_type)?.label}
          </strong>
        </Alert>
      )}
    </Stack>
  );
}

// ─── RouterSelectionSection ───────────────────────────────────────────────────
// Pulled out into its own component and rendered unconditionally so it never
// gets hidden by the Free Trial toggle (or any other toggle in the future).
function RouterSelectionSection({ loadingRouters, routers, selectedRouter, handleRouterChange, routerDetails }) {
  return (
    <div
      className="font-sans"
      style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}
    >
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <Server className="w-5 h-5" />
        Select Router *
      </h3>

      {loadingRouters ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <CircularProgress size={30} />
          <span style={{ marginLeft: '12px' }}>Loading routers...</span>
        </div>
      ) : routers.length === 0 ? (
        <Alert severity="warning">No routers found. Add a router first.</Alert>
      ) : (
        <>
          <FormControl fullWidth style={{ marginBottom: '12px' }}>
            <InputLabel>Select Router</InputLabel>
            <Select value={selectedRouter} onChange={handleRouterChange} label="Select Router">
              <MenuItem value=""><em>Choose a router...</em></MenuItem>
              {routers.map((router) => (
                <MenuItem key={router.id} value={router.name}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Server className="w-4 h-4" />
                    {router.name}
                  </div>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {routerDetails && (
            <div style={{ padding: '12px', backgroundColor: 'white', borderRadius: '6px', borderLeft: '4px solid #2196F3' }}>
              <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Selected Router:</p>
              <div style={{ fontSize: '13px' }}>
                <div>Name: <strong>{routerDetails.name}</strong></div>
                <div>IP: <strong>{routerDetails.ip_address}</strong></div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── FreeTrial Section ────────────────────────────────────────────────────────
function FreeTrialSection({ hotspotPackage, setHotspotPackage }) {
  const enabled = !!hotspotPackage.enable_free_trial;

  const set = (field, value) =>
    setHotspotPackage((prev) => ({ ...prev, [field]: value }));

  const disable = () =>
    setHotspotPackage((prev) => ({
      ...prev,
      enable_free_trial: false,
      free_trial_duration_minutes: "",
      free_trial_download_limit: "",
      free_trial_upload_limit: "",
    }));

  return (
    <div className="mt-6 rounded-xl border-2 border-amber-200 overflow-hidden font-sans">
      {/* ── Toggle header ── */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-300">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            🎁 Offer Free Trial?
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            Give new users free access for a limited time
          </p>
        </div>

        {/* Yes / No toggle */}
        <div className="flex rounded-lg border-2 border-gray-300 overflow-hidden text-sm font-semibold shadow-sm">
          <button
            type="button"
            onClick={() => set("enable_free_trial", true)}
            className={`px-4 py-2 transition-all cursor-pointer border-none font-medium
              ${
                enabled
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={disable}
            className={`px-4 py-2 transition-all cursor-pointer border-none border-l border-gray-300 font-medium
              ${
                !enabled
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
          >
            No
          </button>
        </div>
      </div>

      {/* ── Free Trial fields ── */}
      {enabled && (
        <div className="px-4 py-5 bg-white grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Trial Duration */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Trial Duration (minutes) <span className="text-red-500">*</span>
            </label>
            <TextField
              fullWidth
              size="small"
              className="myTextField"
              type="number"
              placeholder="e.g., 30"
              inputProps={{ min: 1 }}
              value={hotspotPackage.free_trial_duration_minutes || ""}
              onChange={(e) => set("free_trial_duration_minutes", e.target.value)}
              helperText="How long the trial lasts"
              sx={focusSx}
            />
          </div>

          {/* Trial Download Limit */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Trial Download Limit <span className="text-red-500">*</span>
            </label>
            <TextField
              fullWidth
              size="small"
              className="myTextField"
              placeholder="e.g., 100MB, 1GB"
              value={hotspotPackage.free_trial_download_limit || ""}
              onChange={(e) => set("free_trial_download_limit", e.target.value)}
              helperText="Max download during trial"
              sx={focusSx}
              InputProps={{
                startAdornment: (
                  <FaLongArrowAltDown className="mr-2 text-amber-500" />
                ),
              }}
            />
          </div>

          {/* Trial Upload Limit */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">
              Trial Upload Limit <span className="text-red-500">*</span>
            </label>
            <TextField
              fullWidth
              size="small"
              className="myTextField"
              placeholder="e.g., 50MB, 500MB"
              value={hotspotPackage.free_trial_upload_limit || ""}
              onChange={(e) => set("free_trial_upload_limit", e.target.value)}
              helperText="Max upload during trial"
              sx={focusSx}
              InputProps={{
                startAdornment: (
                  <FaLongArrowAltUp className="mr-2 text-amber-500" />
                ),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EditHotspotPackage ───────────────────────────────────────────────────────
const EditHotspotPackage = ({
  handleClose,
  loading,
  open,
  hotspotPackage,
  setHotspotPackage,
  createHotspotPackage,
  handleChangeTimeFrom,
  handleChangeTimeUntil,
  handleWeekdayChange,
  editing,
  nodes,
  setNodes,
  setSelectedRouter,
  selectedRouter
}) => {
  const {
    name,
    validity,
    download_limit,
    upload_limit,
    price,
    validity_period_units,
    shared_users,
    location,
  } = hotspotPackage;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChangeHotspotPackage = (e) => {
    const { value, id } = e.target;
    setHotspotPackage({ ...hotspotPackage, [id]: value });
  };

  const { dateTimeValue } = useApplicationSettings();
  const enable = !!hotspotPackage.enable_free_trial;

  const [loadingRouters, setLoadingRouters] = useState(false);
  const [routerDetails, setRouterDetails] = useState(null);
  const [routers, setRouters] = useState([]);

  const subdomain = window.location.hostname.split('.')[0];

  const fetchRouters = useCallback(async () => {
    try {
      setLoadingRouters(true);
      const response = await fetch('/api/routers', {
        headers: { 'X-Subdomain': subdomain }
      });
      const data = await response.json();
      setRouters(data || []);

      // Pre-select if editing
      // NOTE: was referencing an undefined `formData` before — fixed to use
      // hotspotPackage, which is the actual source of truth for this form.
      if (hotspotPackage?.id && hotspotPackage?.nas_router) {
        setSelectedRouter(hotspotPackage.nas_router);
        const router = data.find(r => r.name === hotspotPackage.nas_router);
        if (router) setRouterDetails(router);
      }
    } catch (error) {
      toast.error('Failed to load routers');
    } finally {
      setLoadingRouters(false);
    }
  }, [hotspotPackage, subdomain]);

  useEffect(() => {
    if (open) {
      fetchRouters();
    }
  }, [open, fetchRouters]);

  const handleRouterChange = (e) => {
    const routerName = e.target.value;
    setSelectedRouter(routerName);
    const selected = routers.find(r => r.name === routerName);
    setRouterDetails(selected || null);
    setHotspotPackage({
      ...hotspotPackage,
      nas_router: selected?.name || ''
    });
  };

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
      background: {
        paper: isDark ? '#1e1e1e' : '#ffffff',
        default: isDark ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f1f1' : '#1a1a1a',
        secondary: isDark ? '#a3a3a3' : '#6b7280',
      },
    },
  }), [isDark]);

  return (
    <ThemeProvider theme={tableTheme}>
      <Toaster />

      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          fullScreen={fullScreen}
          fullWidth={true}
          maxWidth="lg"
        >
          <DialogContent sx={{ maxHeight: "90vh", overflowY: "auto" }}>
            <form onSubmit={createHotspotPackage}>
              {/* ── Header ── */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editing ? <p className="font-sans">Edit Hotspot Package</p> : <p className="font-sans">Create New Hotspot Package</p>}
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-sans">
                  Configure package details, limits, burst, and free trial options
                </p>
              </div>

              <TextField
                fullWidth
                label="Package Name"
                id="name"
                value={name || ""}
                onChange={handleChangeHotspotPackage}
                className="myTextField"
                placeholder="e.g., Daily Lite Bundle"
                sx={focusSx}
                margin="normal"
                InputProps={{
                  startAdornment: <IoWifiOutline className="mr-2" />,
                }}
              />

              {/* ── Router Selection ──
                  Always rendered regardless of the Free Trial toggle — a
                  package (trial or not) still needs to be tied to a router. */}
              <RouterSelectionSection
                loadingRouters={loadingRouters}
                routers={routers}
                selectedRouter={selectedRouter}
                handleRouterChange={handleRouterChange}
                routerDetails={routerDetails}
              />

              {!enable && (
                <>
                  <div className="bg-blue-50 p-4 rounded-lg mb-6 font-sans">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      📋 Basic Information
                    </h3>

                    {/* Price / Upload / Download row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                      <TextField
                        label={<p className="font-sans">Price (KES)</p>}
                        id="price"
                        type="number"
                        value={price || ""}
                        onChange={handleChangeHotspotPackage}
                        className="myTextField"
                        sx={focusSx}
                        InputProps={{
                          startAdornment: <span className="mr-2 font-bold">KES</span>,
                        }}
                      />

                      <TextField
                        label={<p className="font-sans">Upload Speed (Mbps) </p>}
                        id="upload_limit"
                        type="number"
                        value={upload_limit || ""}
                        onChange={handleChangeHotspotPackage}
                        className="myTextField"
                        sx={focusSx}
                        InputProps={{
                          startAdornment: (
                            <FaLongArrowAltUp className="mr-2 text-blue-500" />
                          ),
                        }}
                      />

                      <TextField
                        label={<p className="font-sans">Download Speed (Mbps)</p>}
                        id="download_limit"
                        type="number"
                        value={download_limit || ""}
                        onChange={handleChangeHotspotPackage}
                        className="myTextField"
                        sx={focusSx}
                        InputProps={{
                          startAdornment: (
                            <FaLongArrowAltDown className="mr-2 text-green-500" />
                          ),
                        }}
                      />
                    </div>
                  </div>

                  {/* ── SECTION 2: Validity & Timing ── */}
                  <div className="bg-green-50 p-4 rounded-lg mb-6 font-sans">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      ⏱️ Validity & Timing
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <TextField
                        label={<p className="font-sans">Validity Period </p>}
                        id="validity"
                        type="number"
                        value={validity || ""}
                        onChange={handleChangeHotspotPackage}
                        className="myTextField"
                        sx={focusSx}
                        InputProps={{
                          startAdornment: <LuCalendar1 className="mr-2" />,
                        }}
                      />

                      <Autocomplete
                        options={["days", "hours", "minutes"]}
                        value={validity_period_units || ""}
                        onChange={(event, newValue) => {
                          setHotspotPackage({
                            ...hotspotPackage,
                            validity_period_units: newValue,
                          });
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label={<p className="font-sans">Period Units </p>}
                            className="myTextField"
                            sx={focusSx}
                          />
                        )}
                        fullWidth
                      />
                    </div>

                    <TextField
                      fullWidth
                      label={<p className="font-sans">Simultaneous Users Allowed </p>}
                      id="shared_users"
                      value={shared_users || ""}
                      onChange={handleChangeHotspotPackage}
                      className="myTextField"
                      sx={focusSx}
                      margin="normal"
                      helperText={<p className="font-sans">Number of devices that can use this package simultaneously </p>}
                    />

                    {/* Time Pickers */}
                    <DemoContainer components={["TimePicker", "TimePicker"]} sx={{ mt: 3 }}>
                      <TimePicker
                        label={<p className="font-sans"> Valid From </p>}
                        value={hotspotPackage.valid_from}
                        onChange={handleChangeTimeFrom}
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                      />
                      <TimePicker
                        label={<p className="font-sans">Valid Until </p>}
                        value={hotspotPackage.valid_until}
                        onChange={handleChangeTimeUntil}
                        viewRenderers={{
                          hours: renderTimeViewClock,
                          minutes: renderTimeViewClock,
                          seconds: renderTimeViewClock,
                        }}
                      />
                    </DemoContainer>

                    {/* Weekdays */}
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3 font-sans">
                        📅 Valid Days
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-sans">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <label
                            key={day}
                            className="flex items-center space-x-2 p-3 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-green-600 rounded border-gray-300"
                              checked={hotspotPackage.weekdays?.includes(day) || false}
                              onChange={() => handleWeekdayChange(day)}
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {day.slice(0, 3)}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* <Divider sx={{ my: 3 }} />

            
              <DeviceTypeSection
                hotspotPackage={hotspotPackage}
                setHotspotPackage={setHotspotPackage}
              /> */}

              <Divider sx={{ my: 3 }} />

              {/* ── SECTION 4: Burst ── */}
              {!enable && (
                <BurstSection
                  hotspotPackage={hotspotPackage}
                  setHotspotPackage={setHotspotPackage}
                />
              )}

              {/* ── SECTION 5: Free Trial ── */}
              <FreeTrialSection
                hotspotPackage={hotspotPackage}
                setHotspotPackage={setHotspotPackage}
              />

              {/* ── Actions ── */}
              <DialogActions sx={{ mt: 6, gap: 2 }}>
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400 transition font-sans"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClose();
                  }}
                >
                  Cancel
                </button>

                <Button
                  variant="default"
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                >
                  {editing ? <p className="font-sans">Update Package</p> : <p className="font-sans">Create Package</p>}

                  {loading && (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-blue-600 rounded-full animate-spin" />
                  )}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    </ThemeProvider>
  );
};

export default EditHotspotPackage;