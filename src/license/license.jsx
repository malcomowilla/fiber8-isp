import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { 
  Card, 
  CardContent, 
  useTheme
} from '@mui/material'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import toast, { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { IoCheckmarkCircle, IoLockClosedOutline } from 'react-icons/io5';

// ─────────────────────────────────────────────────────────
// MODERN LOADER COMPONENT
// ─────────────────────────────────────────────────────────
const ModernLicenseLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center bg-gradient-to-br
       from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4"
    >
      <div className="w-full max-w-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          {/* Soft green glow instead of blue/purple/pink blur */}
          <div className="absolute inset-0 bg-green-400 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>

          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/30 shadow-2xl">
            {/* Single green orb, no rainbow */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 w-32 h-32 bg-green-400 rounded-full opacity-10 blur-xl"
            ></motion.div>

            <div className="relative text-center space-y-6">
              <motion.div
                className="flex justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, linear: true }}
                  className="relative w-20 h-20 flex items-center justify-center"
                >
                  <div className="absolute inset-0 border-4 border-transparent border-t-green-500 border-r-green-500 rounded-full"></div>
                  <div className="absolute inset-2 border-2 border-transparent border-green-500 border-l-green-400 rounded-full opacity-50"></div>
                  <div className="relative p-3 bg-green-500 rounded-full shadow-lg">
                    <IoLockClosedOutline className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-green-600">
                  Verifying License
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please wait while we authenticate your system
                </p>
              </div>

              <div className="space-y-3">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full bg-green-500 rounded-full shadow-lg"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  ></motion.div>
                </div>
                <motion.p
                  className="text-xs font-medium text-gray-600 dark:text-gray-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Initializing...
                </motion.p>
              </div>

              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  ></motion.div>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  ✓ Checking license status
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-gray-600 dark:text-gray-400 mt-8"
        >
          This process typically takes a few seconds
        </motion.p>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
// EMPTY STATE COMPONENT
// ─────────────────────────────────────────────────────────
const EmptyLicenseState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4"
    >
      <div className="text-center max-w-md">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-flex p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-6"
        >
          <IoLockClosedOutline className="w-12 h-12 text-green-600 dark:text-green-400" />
        </motion.div>
        
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          No License Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Unable to retrieve license information. Please contact support or try again later.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:shadow-lg hover:bg-green-600 transition-all"
        >
          Retry
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────
// LICENSE STATUS CARD
// ─────────────────────────────────────────────────────────
const LicenseStatusCard = ({ 
  status, 
  planName, 
  company, 
  expiry, 
  subscribers 
}) => {
  const isActive = status === 'active'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full font-sans"
    >
      <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Status Header — green when active, muted red only when expired */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className={`${
            isActive ? 'bg-green-500' : 'bg-red-500'
          } p-6 text-white flex items-center justify-between shadow-lg`}
        >
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-3 bg-white/20 rounded-full backdrop-blur-sm"
            >
              {isActive ? (
                <IoCheckmarkCircle className="w-8 h-8" />
              ) : (
                <IoLockClosedOutline className="w-8 h-8" />
              )}
            </motion.div>
            <div>
              <h2 className="text-xl font-bold">
                {isActive ? 'License Active' : 'License Inactive'}
              </h2>
              <p className="text-sm opacity-90">
                {isActive 
                  ? 'Your license is up to date'
                  : 'Your license has expired'}
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-full font-semibold text-sm bg-white/20 text-white backdrop-blur-sm">
            {isActive ? '✓ Active' : '! Expired'}
          </div>
        </motion.div>

        {/* License Details — single green tone, varied by opacity only */}
        <CardContent sx={{ p: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200/40 dark:border-green-800/20"
              >
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Product
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  Hotspot & PPPoE
                </p>
              </motion.div>

              {/* Plan Name */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200/40 dark:border-green-800/20"
              >
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Plan Name
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {planName || 'N/A'}
                </p>
              </motion.div>

              {/* Company */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200/40 dark:border-green-800/20"
              >
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Registered To
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {company || 'N/A'}
                </p>
              </motion.div>

              {/* Expiry — slightly stronger green fill so it stands out a touch, still on-palette */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-green-100 dark:bg-green-900/20 border border-green-300/50 dark:border-green-800/30"
              >
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Expiry Date
                </p>
                <p className="text-lg font-bold text-green-700 dark:text-green-400">
                  {expiry || 'N/A'}
                </p>
              </motion.div>
            </div>

            {/* Subscribers Info */}
            {subscribers && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200/40 dark:border-green-800/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                      License Type
                    </p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {subscribers} Users License
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, linear: true }}
                    className="p-3 bg-green-500/15 rounded-full"
                  >
                    <IoCheckmarkCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


const License = () => {
  const theme = useTheme()
  const [licenseData, setLicenseData] = useState(null)
  const [loading, setLoading] = useState(true)
  const subdomain = window.location.hostname.split('.')[0]
  const [licenseTypeHotspot, setLicenseTypeHotspot] = useState('NA')
  const [expiryHotspot, setExpiryHotspot] = useState('NA')
  const [hotspotPlanName, setHotspotPlanName] = useState('NA')
  const [hotspotStatus, setHotspotStatus] = useState('NA')
  const { companySettings, setCompanySettings } = useApplicationSettings()
  const { contact_info, company_name, email_info, logo_preview } = companySettings

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

  const handleGetCompanySettings = useCallback(
    async() => {
      try {
        const response = await fetch('/api/allow_get_company_settings', {
          method: 'GET',
          headers: {
            'X-Subdomain': subdomain,
          },
        })
        const newData = await response.json()
        if (response.ok) {
          const { contact_info, company_name, email_info, logo_url,
            customer_support_phone_number, agent_email, customer_support_email
          } = newData
          setCompanySettings((prevData)=> ({...prevData, 
            contact_info, company_name, email_info,
            customer_support_phone_number, agent_email, customer_support_email,
            logo_preview: logo_url
          }))
        }
      } catch (error) {
        // Handle error silently
      }
    },
    [subdomain, setCompanySettings],
  )
 
  useEffect(() => {
    handleGetCompanySettings()
  }, [handleGetCompanySettings])

  const getCurrentHotspotPlan = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/get_hotspot_and_dial_plan', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok && newData.length > 0) {
        setLicenseData(newData[0])
        setLicenseTypeHotspot(newData[0].hotspot_subscribers)
        setExpiryHotspot(newData[0].expiry)
        setHotspotPlanName(newData[0].name)
        setHotspotStatus(newData[0].status)
      } else {
        if (response.status === 401) {
          toast.error(newData.error, {
            position: "top-center",
            duration: 4000,
          })
          setTimeout(() => {
            window.location.href='/signin'
          }, 1900);
        }
      }
    } catch (error) {
      console.error('Error fetching hotspot plan:', error)
    } finally {
      setLoading(false)
    }
  }, [subdomain])

  useEffect(() => {
    getCurrentHotspotPlan()
  }, [getCurrentHotspotPlan])

  if (loading) {
    return <ModernLicenseLoader />
  }

  if (!licenseData) {
    return <EmptyLicenseState />
  }

  return (
    <>
      <Toaster />
      <ThemeProvider theme={tableTheme}>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-8 font-sans">
          <div className="max-w-2xl mx-auto">

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold font-sans mb-2">
                License Information
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage your system license
              </p>
            </motion.div>

            <LicenseStatusCard
              status={hotspotStatus}
              planName={hotspotPlanName}
              company={company_name}
              expiry={expiryHotspot}
              subscribers={licenseTypeHotspot}
            />
          </div>
        </div>
      </ThemeProvider>
    </>
  )
}

export default License