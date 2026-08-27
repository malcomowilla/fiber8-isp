import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, Tooltip } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LockResetIcon from '@mui/icons-material/LockReset';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaymentIcon from '@mui/icons-material/Payment';
import BuildIcon from '@mui/icons-material/Build';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClientList from './ClientList';
import InviteClient from './InviteClient';
import Settings from './Settings';
import { ToastContainer, toast, Slide } from 'react-toastify';
import ResetPassword from './ResetPassword';
import ResetPasswordSystemAdmin from './ResetPasswordSystemAdmin';
import UptimeDisplay from './UptimeDisplay';
import SystemAdminProfile from './SystemAdminProfile';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import ClientRequests from './ClientRequests';
import PasskeyList from './PasskeyList';
import { IoMdKey } from 'react-icons/io';
import { LuPackageMinus } from 'react-icons/lu';
import PlanManager from './PlanManager';
import CompanyLeads from './CompanyLeads';
import { FaHandshake } from 'react-icons/fa';
import { GiRecycle } from 'react-icons/gi';
import WriteChanges from './WriteChanges';
import UbuntuStats from './UbuntuStats';
import { MdDevicesOther } from 'react-icons/md';
import NetworkComponents from './NetworkComponents';
import FinancialDashboard from './FinancialDashboard';
import Payments from './Payments';
import { MaintenancePanel } from '../maintenace/MaintenanceMode';
import SystemAdminSupportOverview from './SystemAdminSupportOverview';
import { LifeBuoy } from 'lucide-react';
import SystemAnnouncementsManager from './SystemAnnouncementsManager';
import { Megaphone, MessageSquare } from 'lucide-react';



const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { value: 0, label: 'System stats', Icon: DashboardIcon },
    ],
  },
  {
    label: 'Customers & billing',
    items: [
      { value: 3, label: 'Invite client', Icon: PeopleIcon },
      { value: 14, label: 'Payments', Icon: PaymentIcon },
      { value: 12, label: 'Financial dashboard', Icon: AssessmentIcon },
          { value: 15, label: 'Support', Icon: LifeBuoy },

      { value: -1, label: 'Reset client password', Icon: LockResetIcon, action: 'resetPassword' },
    ],
  },
  {
    label: 'Plans & network',
    items: [
      { value: 8, label: 'Plan manager', Icon: LuPackageMinus },
      { value: 11, label: 'System components', Icon: MdDevicesOther },
      { value: 9, label: 'Company leads', Icon: FaHandshake },
    ],
  },
  {
    label: 'System',
    items: [
      { value: 2, label: 'Settings', Icon: SettingsIcon },
      { value: 13, label: 'Maintenance', Icon: BuildIcon },
      { value: 10, label: 'Changelogs', Icon: GiRecycle },
       { value: 16, label: 'Announcements', Icon: Megaphone },
    ],
  },
  {
    label: 'Account',
    items: [
      { value: 4, label: 'Profile', Icon: null, isAvatar: true },
      { value: 5, label: 'Reset admin password', Icon: LockResetIcon },
      { value: 7, label: 'Passkeys', Icon: IoMdKey },
    ],
  },


];

const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap((section) => section.items);

const PAGE_TITLES = {
  '-1': 'Reset Password · Client',
  0: 'System Statistics',
  1: 'Client Management',
  2: 'Settings',
  3: 'Invite Client',
  4: 'Profile',
  5: 'Reset Password · Admin',
  6: 'Client Requests',
  7: 'Passkeys',
  8: 'Plan Manager',
  9: 'Company Leads',
  10: 'Changelogs',
  11: 'System Components',
  12: 'Financial Dashboard',
  13: 'Maintenance',
  14: 'Payments',
  15: 'Support Overview',
};









const PlatformSmsBalanceCard = () => {
  const [balance, setBalance] = useState(null);
  useEffect(() => {
    fetch('/api/platform_sms_balance')
      .then(r => r.json())
      .then(d => setBalance(d.balance))
      .catch(() => setBalance('—'));
  }, []);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
      <MessageSquare size={18} className="text-emerald-500" />
      <div>
        <p className="text-xs text-slate-500">TextSMS balance</p>
        <p className="text-lg font-semibold">{balance ?? '…'}</p>
      </div>
    </div>
  );
};





const DashboardSytemAdmin = () => {
  const [value, setValue] = useState(0);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const stored = window.localStorage.getItem('owitech-theme');
    if (stored) return stored === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
  });

  const { currentSystemAdmin, systemAdminEmail } = useApplicationSettings();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    window.localStorage.setItem('owitech-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  function generateAvatar(name) {
    const avatar = createAvatar(lorelei, {
      seed: name,
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9'],
      radius: 50,
      size: 64,
    });
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
  }

  const subdomain = window.location.hostname.split('.')[0];

  const handleLogout = async () => {
    const response = await fetch('/api/logout_system_admin', {
      method: 'DELETE',
      headers: { 'X-Subdomain': subdomain },
    });

    if (response.ok) {
      toast.success('Logged out successfully!', { transition: Slide });
      setTimeout(() => {
        window.location.href = '/system-admin-login';
      }, 1000);
    } else {
      toast.error('Logout failed. Please try again.', { transition: Slide });
    }
  };

  const selectItem = useCallback((item) => {
    if (item.action === 'resetPassword') {
      setShowResetPassword(true);
      setValue(-1);
    } else {
      setValue(item.value);
      setShowResetPassword(false);
    }
    setMobileNavOpen(false);
  }, []);

  const pageTitle = showResetPassword ? PAGE_TITLES['-1'] : PAGE_TITLES[value] ?? 'Dashboard';

  const renderIcon = (item, className = 'w-5 h-5') => {
    if (item.isAvatar) {
      return (
        <Avatar
          src={generateAvatar(systemAdminEmail)}
          alt={`${systemAdminEmail}'s avatar`}
          sx={{ width: 22, height: 22 }}
        />
      );
    }
    const Icon = item.Icon;
    if (!Icon) return null;
    return <Icon className={className} />;
  };

  const isActive = (item) =>
    item.action === 'resetPassword' ? showResetPassword : !showResetPassword && value === item.value;

  const NavList = ({ onNavigate }) => (
    <nav className="flex flex-col gap-6 px-3">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          {!sidebarCollapsed && (
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {section.label}
            </p>
          )}
          <ul className="flex flex-col gap-1">
            {section.items.map((item) => {
              const active = isActive(item);
              return (
                <li key={`${item.value}-${item.label}`}>
                  <Tooltip title={sidebarCollapsed ? item.label : ''} placement="right">
                    <button
                      type="button"
                      onClick={() => onNavigate(item)}
                      className={`group w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors
                        ${
                          active
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100'
                        }`}
                    >
                      <span
                        className={`flex items-center justify-center shrink-0 ${
                          active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                        }`}
                      >
                        {renderIcon(item)}
                      </span>
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                      {active && !sidebarCollapsed && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

      <div className="flex h-screen overflow-hidden">
        {/* Desktop sidebar */}
        <aside
          className={`hidden sm:flex flex-col shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200 ${
            sidebarCollapsed ? 'w-[76px]' : 'w-64'
          }`}
        >
          <div className="flex items-center gap-2 h-16 px-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500 text-white font-bold shrink-0">
              O
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">Owitech</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">System Admin</p>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <NavList onNavigate={selectItem} />
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogoutIcon className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && <span>Log out</span>}
            </button>
            <button
              type="button"
              onClick={() => setSidebarCollapsed((v) => !v)}
              className="mt-1 w-full hidden sm:flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
            >
              {sidebarCollapsed ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
              {!sidebarCollapsed && <span>Collapse</span>}
            </button>
          </div>
        </aside>

        {/* Mobile sidebar */}
        <AnimatePresence>
          {mobileNavOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileNavOpen(false)}
                className="fixed inset-0 z-40 bg-slate-950/50 sm:hidden"
              />
              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sm:hidden flex flex-col"
              >
                <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-500 text-white font-bold">O</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Owitech</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">System Admin</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <CloseIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto py-4">
                  <NavList onNavigate={selectItem} />
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 p-3">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <LogoutIcon className="w-5 h-5" />
                    <span>Log out</span>
                  </button>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="flex items-center justify-between h-16 shrink-0 px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="sm:hidden p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <MenuIcon className="w-5 h-5" />
              </button>
              <h1 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 truncate">
                {pageTitle}
              </h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:block">
                <UptimeDisplay />
              </div>

              <div className="hidden md:block">
    <PlatformSmsBalanceCard />
  </div>
              <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
                <button
                  type="button"
                  onClick={() => setDarkMode((v) => !v)}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
                >
                  {darkMode ? <LightModeOutlinedIcon className="w-5 h-5" /> : <DarkModeOutlinedIcon className="w-5 h-5" />}
                </button>
              </Tooltip>
              <button
                type="button"
                onClick={() => selectItem(ALL_NAV_ITEMS.find((i) => i.value === 4))}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="hidden sm:block text-xs font-medium text-slate-600 dark:text-slate-300 max-w-[140px] truncate">
                  {systemAdminEmail}
                </span>
                <Avatar
                  src={generateAvatar(systemAdminEmail)}
                  alt={`${systemAdminEmail}'s avatar`}
                  sx={{ width: 28, height: 28 }}
                />
              </button>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-6 shadow-sm">
                <AnimatePresence mode="wait">
                  {showResetPassword ? (
                    <motion.div
                      key="reset-password"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ResetPassword
                        onClose={() => {
                          setShowResetPassword(false);
                          setValue(0);
                        }}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={value}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {value === 0 && <UbuntuStats />}
                      {value === 1 && <ClientList />}
                      {value === 2 && <Settings />}
                      {value === 3 && <InviteClient />}
                      {value === 4 && <SystemAdminProfile />}
                      {value === 5 && <ResetPasswordSystemAdmin />}
                      {value === 6 && <ClientRequests />}
                      {value === 7 && <PasskeyList />}
                      {value === 8 && <PlanManager />}
                      {value === 9 && <CompanyLeads />}
                      {value === 10 && <WriteChanges />}
                      {value === 11 && <NetworkComponents />}
                      {value === 12 && <FinancialDashboard />}
                      {value === 13 && <MaintenancePanel />}
                      {value === 14 && <Payments />}
                      {value === 15 && <SystemAdminSupportOverview />}
                      {value === 16 && <SystemAnnouncementsManager />}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardSytemAdmin;