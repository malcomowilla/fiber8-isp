import React from 'react'
import { useState, useEffect, useCallback } from 'react'
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip,
  Divider,
  useTheme
} from '@mui/material'
import { 
  CheckCircle, 
  Business, 
  Category, 
  Person, 
  CalendarToday,
  Security
} from '@mui/icons-material'
import { Suspense } from "react"
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
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4"
    >
      <div className="w-full max-w-md">
        {/* Main Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 rounded-3xl blur-2xl opacity-20 animate-pulse"></div>

          {/* Glass Card */}
          <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/30 shadow-2xl">
            {/* Animated Background Orbs */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 blur-xl"
            ></motion.div>
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], rotate: -360 }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-tr from-purple-400 to-pink-400 rounded-full opacity-20 blur-xl"
            ></motion.div>

            {/* Content */}
            <div className="relative text-center space-y-6">
              {/* Animated Icon */}
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
                  {/* Outer Ring */}
                  <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full"></div>
                  
                  {/* Middle Ring */}
                  <div className="absolute inset-2 border-2 border-transparent border-b-pink-500 border-l-blue-400 rounded-full opacity-50"></div>
                  
                  {/* Inner Icon */}
                  <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
                    <IoLockClosedOutline className="w-8 h-8 text-white" />
                  </div>
                </motion.div>
              </motion.div>

              {/* Heading */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Verifying License
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Please wait while we authenticate your system
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                {/* Main Progress */}
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  ></motion.div>
                </div>

                {/* Status Text */}
                <motion.p
                  className="text-xs font-medium text-gray-600 dark:text-gray-400"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Initializing...
                </motion.p>
              </div>

              {/* Loading Dots */}
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  ></motion.div>
                ))}
              </div>

              {/* Subtle Info */}
              <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  ✓ Checking license status
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
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
          className="inline-flex p-4 bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-full mb-6"
        >
          <IoLockClosedOutline className="w-12 h-12 text-orange-600 dark:text-orange-400" />
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
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
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
      className="w-full font-sans
"
    >
      <Card elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Status Header with Gradient */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-gradient-to-r ${
            isActive
              ? 'from-green-500 via-emerald-500 to-teal-500'
              : 'from-orange-500 via-red-500 to-pink-500'
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

          {/* Status Badge */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className={`px-4 py-2 rounded-full font-semibold text-sm ${
              isActive
                ? 'bg-white/20 text-white'
                : 'bg-white/20 text-white'
            } backdrop-blur-sm`}
          >
            {isActive ? '✓ Active' : '! Expired'}
          </motion.div>
        </motion.div>

        {/* License Details */}
        <CardContent sx={{ p: 6 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200/30 dark:border-blue-800/20"
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
                className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200/30 dark:border-purple-800/20"
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
                className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-200/30 dark:border-green-800/20"
              >
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Registered To
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {company || 'N/A'}
                </p>
              </motion.div>

              {/* Expiry */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-xl border ${
                  isActive
                    ? 'bg-gradient-to-br from-teal-50 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/10 border-teal-200/30 dark:border-teal-800/20'
                    : 'bg-gradient-to-br from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/10 border-orange-200/30 dark:border-orange-800/20'
                }`}
              >
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
                  Expiry Date
                </p>
                <p className={`text-lg font-bold ${
                  isActive
                    ? 'text-teal-600 dark:text-teal-400'
                    : 'text-orange-600 dark:text-orange-400'
                }`}>
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
                className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 rounded-xl border border-indigo-200/30 dark:border-indigo-800/20"
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
                    className="p-3 bg-indigo-500/20 rounded-full"
                  >
                    <IoCheckmarkCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
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

// ─────────────────────────────────────────────────────────
// MAIN LICENSE COMPONENT
// ─────────────────────────────────────────────────────────
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

  // Loading State
  if (loading) {
    return <ModernLicenseLoader />
  }

  // Empty State
  if (!licenseData) {
    return <EmptyLicenseState />
  }

  // Main Content
  return (
    <>
      <Toaster />
      <ThemeProvider theme={tableTheme}>
        <div className="min-h-screen bg-gradient-to-br
         from-slate-50 to-slate-100 dark:from-slate-900
          dark:to-slate-800 p-4 sm:p-8 font-sans
">
          <div className="max-w-2xl mx-auto">

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold font-sans
 mb-2">
                License Information
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                View and manage your system license
              </p>
            </motion.div>

            {/* License Card */}
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