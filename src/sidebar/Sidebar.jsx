import { useContext, useCallback, useEffect, useState } from 'react'
import { ApplicationContext } from '../context/ApplicationContext'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useApplicationSettings } from '../settings/ApplicationSettings'
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import BarChartIcon from '@mui/icons-material/BarChart';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';

import CellTowerIcon from '@mui/icons-material/CellTower';
import PaymentsIcon from '@mui/icons-material/Payments';

import RouterIcon from '@mui/icons-material/Router';
import SensorsIcon from '@mui/icons-material/Sensors';
import WifiIcon from '@mui/icons-material/Wifi';
import SignalWifi3BarIcon from '@mui/icons-material/SignalWifi3Bar';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TextsmsSharpIcon from '@mui/icons-material/TextsmsSharp';
import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import {
  LuUsers,
  LuTicketsPlane,
  LuLayoutTemplate,
  FaUpload,
  FcOnlineSupport,
  MdSettingsInputAntenna,
  CgComponents,
  TbCloudNetwork,
  IoStatsChartOutline,
  SiPaloaltonetworks,
  FaHandshake,
  FaRegCalendarAlt,
  AiOutlineWhatsApp,
  PiNetworkSlashLight,
  TbLicense,
  CiMoneyCheck1,
  MdOutlineSecurity,
  MdMenuOpen,
  MdDevices,
  FaPhoneVolume,
  RiRouterLine,
  ImStatsDots,
  GrLicense,
  TbHomeStats
} from '../icons'; // Create an icons index file
import { ImStatsBars } from "react-icons/im";
import { CiSettings } from "react-icons/ci";
import { APP_VERSION, APP_DESCRIPTION } from '../version';
import {
  People as PeopleIcon,
} from '@mui/icons-material';
import { BsRouter } from "react-icons/bs";
import { GrTechnology } from "react-icons/gr";
import { FaUsersBetweenLines } from "react-icons/fa6";
// import {
//   Sparkles, Palette, MapPinned, LogOut, AlertTriangle, LifeBuoy,
//   MessageSquareText, TrendingUp, UserRound, CircleUserRound, Radar,
//   ShieldCheck, Users as UsersIcon,
// } from 'lucide-react'

import {
  Sparkles, Palette, MapPinned, LogOut, AlertTriangle, LifeBuoy,
  MessageSquareText, TrendingUp, UserRound, CircleUserRound, Radar,
  ShieldCheck, Users as UsersIcon, Stethoscope,
} from 'lucide-react'
import { LuTv } from "react-icons/lu";


const Sidebar = () => {
  const {
    isExpanded,
    setIsExpanded,
    seeSidebar,
    setSeeSideBar,
    setCurrentUser
  } = useContext(ApplicationContext);

  const { companySettings, setCompanySettings } = useApplicationSettings();
  const { company_name, logo_preview } = companySettings;
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const navigate = useNavigate()
  const subdomain = window.location.hostname.split('.')[0];

  // Use a single state for all expanded menus
  const [expandedMenus, setExpandedMenus] = useState({
    dashboard: false,
    pppoe: false,
    network: false,
    finance: false,
    communication: false,
    hotspot: false,
    support: false,
    users: false
  });

  const [hoveredMenu, setHoveredMenu] = useState(null);

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      const response = await fetch('/api/logout', {
        method: "DELETE",
        credentials: 'include',
        headers: { 'X-Subdomain': subdomain },
      })
      const newData = await response.json()

      if (response.status === 401) {
        toast.error(newData.error, { position: "top-center", duration: 4000 })
        setTimeout(() => { window.location.href = '/signin' }, 1900)
        return
      }
      if (response.ok) {
        setCurrentUser(null)
        navigate('/signin')
      } else if (response.status === 402) {
        setTimeout(() => navigate('/license-expired'), 1800)
      }
    } catch (error) {
      toast.error('Logout failed', { position: "top-center", duration: 4000 })
    } finally {
      setLoggingOut(false)
      setShowLogoutConfirm(false)
    }
  }

  // Small helper so every leaf icon renders inside a consistent,
  // softly-tinted chip — replaces the old mix of bare icons / raw
  // gifs with one visual language sidebar-wide.
  const IconChip = ({ children, tint = 'text-teal-200' }) => (
    <span className={`flex items-center justify-center w-7 h-7 rounded-lg
      bg-white/5 group-hover:bg-white/10 transition-colors shrink-0 ${tint}`}>
      {children}
    </span>
  );

  // Menu items configuration
  const menuItems = {
    dashboard: {
      icon: <BarChartIcon />,
      label: "Dashboard",
      path: "/admin/admin-dashboard",
      subItems: [
        {
          icon: <IconChip tint="text-sky-300"><ManageAccountsOutlinedIcon style={{ fontSize: 18 }} /></IconChip>,
          label: "Activity Logs",
          path: "/admin/admin-dashboard"
        },
        {
          // was: <img src="/images/icons8-increase.gif" .../>
          icon: <IconChip tint="text-emerald-300"><TrendingUp size={17} /></IconChip>,
          label: "Analytics",
          path: "/admin/analytics"
        },
      ]
    },
    pppoe: {
      icon: <WifiIcon />,
      label: "PPPoe",
      subItems: [
        {
          icon: <div className="flex items-center justify-center w-7 h-7 rounded-lg
            bg-white text-[9px] font-bold text-teal-900 tracking-tight shrink-0">
            MBPS
          </div>,
          label: "PPOE Packages",
          path: "/admin/pppoe-packages"
        },
        {
          // was: <img src="/images/icons8-person.gif" .../>
          icon: <IconChip tint="text-sky-300"><UserRound size={17} /></IconChip>,
          label: "PPOE Subscribers",
          path: "/admin/pppoe-subscribers"
        },
        {
          icon: <IconChip tint="text-yellow-300"><AssessmentIcon style={{ fontSize: 17 }} /></IconChip>,
          label: "Payment Analytics",
          path: "/admin/subscriber-payment-analytics"
        },
        {
          icon: <IconChip tint="text-blue-300"><FaUpload size={15} /></IconChip>,
          label: "Upload Subscribers",
          path: "/admin/upload-subscriber"
        }
      ]
    },
    network: {
      icon: <SensorsIcon />,
      label: "Network",
      subItems: [
        {
          // was: <img src="/images/icons8-map-pin.gif" .../>
          icon: <IconChip tint="text-rose-300"><Radar size={17} /></IconChip>,
          label: "Nodes",
          path: "/admin/nodes"
        },
        {
          icon: <IconChip tint="text-yellow-300"><MapPinned size={17} /></IconChip>,
          label: "Network Map",
          path: "/admin/network-map"
        },
        {
          icon: <IconChip tint="text-blue-300"><PiNetworkSlashLight size={17} /></IconChip>,
          label: "VPN Tunnel",
          path: "/admin/private-network"
        },
        {
          icon: <IconChip><RouterIcon style={{ fontSize: 17 }} /></IconChip>,
          label: "Routers",
          path: "/admin/nas"
        },
        {
          icon: <IconChip><TbCloudNetwork size={17} /></IconChip>,
          label: "Ip Networks",
          path: "/admin/ip_networks"
        },
        {
          icon: <IconChip tint="text-orange-300"><RiRouterLine size={17} /></IconChip>,
          label: "ONU",
          path: "/admin/devices"
        },
        {
          icon: <IconChip><BsRouter size={16} /></IconChip>,
          label: "Access Points",
          path: "/admin/access-point"
        },
        {
          // was: <img src="/images/wireguard2.png" .../>
          icon: <IconChip tint="text-emerald-300"><ShieldCheck size={17} /></IconChip>,
          label: "Wireguard",
          path: "/admin/networks-wireguard-config"
        },

        
        {
  icon: <IconChip tint="text-red-300"><Stethoscope size={17} /></IconChip>,
  label: "Troubleshooting",
  path: "/admin/network-troubleshooting"
}
      ]
    },
    finance: {
      icon: <PaymentsIcon />,
      label: "Finance",
      subItems: [
        {
          icon: <IconChip><AssessmentIcon style={{ fontSize: 17 }} /></IconChip>,
          label: "Finance Dashboard",
          path: "/admin/financial-dashboard"
        },
        {
          icon: <IconChip tint="text-emerald-300"><PaymentIcon style={{ fontSize: 17 }} /></IconChip>,
          label: "Hotspot Payments",
          path: "/admin/hotspot-payments"
        },
        {
          icon: <IconChip tint="text-emerald-300"><PaymentIcon style={{ fontSize: 17 }} /></IconChip>,
          label: "PpPoe Payments",
          path: "/admin/pppoe-payments"
        }
      ]
    },
    communication: {
      icon: <CellTowerIcon />,
      label: "Communication",
      subItems: [
        {
          icon: <IconChip><MailOutlineIcon style={{ fontSize: 17 }} /></IconChip>,
          label: "Email",
          path: "/admin/email"
        },
        {
          icon: <IconChip><TextsmsSharpIcon style={{ fontSize: 17 }} /></IconChip>,
          label: "SMS",
          path: "/admin/send-sms"
        },
        {
          icon: <IconChip><TextsmsSharpIcon style={{ fontSize: 17 }} /></IconChip>,
          label: "Bulk",
          path: "/admin/bulk-messages"
        },
        {
          icon: <IconChip><TextsmsSharpIcon style={{ fontSize: 17 }} /></IconChip>,
          label: "Messages",
          path: "/admin/messages"
        },
        {
          icon: <IconChip tint="text-green-300"><AiOutlineWhatsApp size={17} /></IconChip>,
          label: "WhatsApp",
          path: "/admin/whatsapp"
        },
        {
          icon: <IconChip tint="text-teal-300"><MessageSquareText size={17} /></IconChip>,
          label: "SMS Templates",
          path: "/admin/hotspot-sms-templates"
        }
      ]
    },
    hotspot: {
      icon: <SignalWifi3BarIcon />,
      label: "Hotspot Bundle",
      subItems: [
        {
          icon: <IconChip><IoStatsChartOutline size={17} /></IconChip>,
          label: "Hotspot Dashboard",
          path: "/admin/hotspot-dashboard"
        },
        {
          icon: <IconChip><TbHomeStats size={17} /></IconChip>,
          label: "Marketing",
          path: "/admin/hotspot-marketing-dashboard"
        },
        {
          icon: <IconChip><GrTechnology size={16} /></IconChip>,
          label: "Bypass Hotspot",
          path: "/admin/hotspot-bypass"
        },
        {
          icon: <IconChip><SiPaloaltonetworks size={16} /></IconChip>,
          label: "Hotspot Package",
          path: "/admin/hotspot-package"
        },
        {
          icon: <IconChip><LuTv size={17} /></IconChip>,
          label: "TV Plans",
          path: "/admin/tv-plans"
        },
        {
          icon: <IconChip tint="text-yellow-300"><LuTicketsPlane size={17} /></IconChip>,
          label: "Vouchers",
          path: "/admin/hotspot-subscriptions"
        },
        {
          icon: <IconChip tint="text-amber-300"><Sparkles size={17} /></IconChip>,
          label: "Promotions",
          path: "/admin/hotspot-promotions"
        },
        {
          icon: <IconChip><LuLayoutTemplate size={17} /></IconChip>,
          label: "Templates",
          path: "/admin/hotspot-templates"
        },
        {
          icon: <IconChip tint="text-fuchsia-300"><Palette size={17} /></IconChip>,
          label: "Page Designer",
          path: "/admin/hotspot-page-designer"
        },
        {
          icon: <IconChip tint="text-yellow-300"><ImStatsBars size={16} /></IconChip>,
          label: "Revenue",
          path: "/admin/hotspot_anlytics"
        },
        {
          icon: <IconChip tint="text-red-300"><AlertTriangle size={17} /></IconChip>,
          label: "Incidents",
          path: "/admin/incidents"
        },
        {
          icon: <IconChip tint="text-green-300"><CiSettings size={17} /></IconChip>,
          label: "Settings",
          path: "/admin/hotspot_settings"
        }
      ]
    },
    support: {
      icon: <FcOnlineSupport size={20} />,
      label: "Support",
      subItems: [
        {
          icon: <IconChip tint="text-yellow-300"><LuTicketsPlane size={17} /></IconChip>,
          label: "Tickets",
          path: "/admin/customer-tickets"
        }
      ]
    },
    users: {
      // was: raw inline <svg> path
      icon: <UsersIcon size={20} />,
      label: "Users",
      subItems: [
        {
          // was: <img src="/images/icons8-male-user.gif" .../>
          icon: <IconChip tint="text-sky-300"><CircleUserRound size={17} /></IconChip>,
          label: "Users",
          path: "/admin/user"
        },
        {
          icon: <IconChip><LuUsers size={17} /></IconChip>,
          label: "User Groups",
          path: "/admin/user-group"
        },
        {
          icon: <IconChip><FaUsersBetweenLines size={16} /></IconChip>,
          label: "Free Trial",
          path: "/admin/free-trial-users"
        },
        {
          icon: <IconChip tint="text-green-300"><PeopleIcon style={{ fontSize: 17 }} /></IconChip>,
          label: "Partners",
          path: "/admin/partners-management"
        },
      ]
    }
  };

  const quickLinks = [
    { icon: <ReceiptIcon />, label: "Billing Invoices", path: "/admin/invoice" },
    { icon: <FaHandshake size={18} />, label: "Leads", path: "/admin/client-leads" },
    { icon: <FaRegCalendarAlt size={18} />, label: "Scheduler", path: "/admin/scheduler" },
    { icon: <MdOutlineSecurity size={19} />, label: "DDOS", path: "/admin/prevent-ddos" },
    { icon: <MdDevices size={19} />, label: "Equipment", path: "/admin/equipment" },
    { icon: <GrLicense size={17} />, label: "License", path: "/admin/license" },
    { icon: <PermDataSettingIcon />, label: "Settings", path: "/admin/settings" },
    { icon: <LifeBuoy size={19} />, label: "Support Tickets", path: "/admin/support-tickets" },
  ];

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => {
      const newState = {
        dashboard: false,
        pppoe: false,
        network: false,
        finance: false,
        communication: false,
        hotspot: false,
        support: false,
        users: false
      };
      if (!prev[menu]) {
        newState[menu] = true;
      }
      return newState;
    });
  };

  const collapseAllMenus = () => {
    setExpandedMenus({
      dashboard: false,
      pppoe: false,
      network: false,
      finance: false,
      communication: false,
      hotspot: false,
      support: false,
      users: false
    });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleResize = () => {
      setSeeSideBar(window.innerWidth < 1080);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setSeeSideBar]);

  useEffect(() => {
    if (window.innerWidth < 1080 && seeSidebar) {
      collapseAllMenus();
    }
  }, [seeSidebar, location]);

  const handleGetCompanySettings = useCallback(async () => {
    try {
      const response = await fetch('/api/allow_get_company_settings', {
        method: 'GET',
        headers: { 'X-Subdomain': subdomain },
      });

      if (response.ok) {
        const newData = await response.json();
        setCompanySettings(prev => ({
          ...prev,
          ...newData,
          logo_preview: newData.logo_url
        }));
      }
    } catch (error) {
      toast.error('Internal server error while fetching company settings');
    }
  }, [subdomain, setCompanySettings]);

  useEffect(() => {
    handleGetCompanySettings();
  }, [handleGetCompanySettings]);

  // Render menu item
  const renderMenuItem = (menuKey) => {
    const menu = menuItems[menuKey];
    const isOpen = expandedMenus[menuKey];
    const isHovered = hoveredMenu === menuKey;
    const active = isActive(menu.path);

    return (
      <li key={menuKey} className="relative font-sans">
        {seeSidebar ? (
          // Collapsed sidebar view
          <div
            className={`relative flex items-center p-3 rounded-xl transition-all
               duration-200 cursor-pointer group ${
              active ? 'bg-white/10' : 'hover:bg-white/5'
            }`}
            onMouseEnter={() => setHoveredMenu(menuKey)}
            onMouseLeave={() => setHoveredMenu(null)}
            onClick={() => {
              if (menu.path) {
                window.innerWidth < 1080 && setSeeSideBar(true);
              }
            }}
          >
            {active && (
              <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1
                rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
            )}
            <div className="flex items-center justify-center w-6 h-6 mx-auto text-white/90">
              {menu.icon}
            </div>

            {/* Hover tooltip for collapsed sidebar */}
            <AnimatePresence>
              {isHovered && !menu.subItems && (
                <motion.div
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-900/95
                  backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-lg shadow-xl
                  ring-1 ring-white/10 whitespace-nowrap z-50 font-sans"
                >
                  {menu.label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submenu flyout for collapsed sidebar */}
            {menu.subItems && isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute left-full ml-3 top-0 bg-gray-900/95 backdrop-blur-sm
                 text-white rounded-xl shadow-2xl ring-1 ring-white/10 py-2 z-40
                 min-w-[210px] font-sans"
              >
                <div className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider
                  text-white/50 border-b border-white/10 mb-1">
                  {menu.label}
                </div>
                {menu.subItems.map((subItem, idx) => (
                  <Link
                    key={idx}
                    to={subItem.path}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 mx-1 rounded-lg
                     transition-colors ${
                       isActive(subItem.path) ? 'bg-white/10' : 'hover:bg-white/5'
                     }`}
                    onClick={() => window.innerWidth < 1080 && setSeeSideBar(true)}
                  >
                    <span className="flex-shrink-0">{subItem.icon}</span>
                    <span className="text-sm">{subItem.label}</span>
                  </Link>
                ))}
              </motion.div>
            )}
          </div>
        ) : (
          // Expanded sidebar view
          <div className="space-y-1">
            <button
              onClick={() => menu.subItems ? toggleMenu(menuKey) : null}
              className={`relative flex items-center justify-between w-full p-3
                 rounded-xl transition-all duration-200 group ${
                active ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1
                  rounded-r-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
              )}
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 text-white/90">{menu.icon}</span>
                <span className="text-sm font-medium text-white/90">{menu.label}</span>
              </div>
              {menu.subItems && (
                <span className="text-white/50 transition-transform duration-200">
                  {isOpen ? <KeyboardArrowUpSharpIcon fontSize="small" /> : <KeyboardArrowDownSharpIcon fontSize="small" />}
                </span>
              )}
            </button>

            {/* Submenu for expanded sidebar */}
            {menu.subItems && (
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="ml-5 pl-4 border-l border-white/10 space-y-0.5 py-1">
                      {menu.subItems.map((subItem, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.04 }}
                        >
                          <Link
                            to={subItem.path}
                            className={`group flex items-center gap-2.5 py-2 px-2.5 rounded-lg
                             transition-colors duration-150 ${
                              isActive(subItem.path)
                                ? 'bg-white/10 text-white'
                                : 'text-white/75 hover:bg-white/5 hover:text-white'
                            }`}
                            onClick={() => window.innerWidth < 1080 && setSeeSideBar(true)}
                          >
                            <span className="flex-shrink-0">{subItem.icon}</span>
                            <span className="text-sm">{subItem.label}</span>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        )}
      </li>
    );
  };

  return (
    <>
      <motion.aside
        id="sidebar"
        initial={false}
        animate={{
          width: seeSidebar ? "68px" : "252px"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        // font-sans resolves to var(--font-sans) — appearance-settings font
        // changes (applyTheme -> --font-sans on <html>) apply here live.
        className="fixed top-0 left-0 h-screen bg-gradient-to-b from-teal-900
         via-primary to-teal-950 shadow-2xl shadow-black/40 ring-1 ring-white/5
         overflow-hidden flex flex-col text-white font-sans z-50"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!seeSidebar ? (
              <>
                <div className="flex items-center gap-3 min-w-0">
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-11 w-11 rounded-full border-2 border-white/80
                     ring-2 ring-emerald-400/30 shrink-0 object-cover"
                    src={logo_preview || "/images/aitechs.png"}
                    alt={company_name || "Aitechs"}
                    onError={(e) => { e.target.src = "/images/aitechs.png"; }}
                  />
                  {/* Brand/company name uses the display font slot (--font-display)
                      plus its own italic toggle (--font-style-display). */}
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-display font-bold text-white text-base truncate"
                    style={{ fontStyle: 'var(--font-style-display)' }}
                  >
                    {company_name || "Aitechs"}
                  </motion.span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setSeeSideBar(!seeSidebar);
                    collapseAllMenus();
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                >
                  <MdMenuOpen className="w-6 h-6 text-white/80" />
                </motion.button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-3 w-full">
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-9 w-9 rounded-full border-2 border-white/80
                   ring-2 ring-emerald-400/30 object-cover"
                  src={logo_preview || "/images/aitechs.png"}
                  alt={company_name || "Aitechs"}
                  onError={(e) => { e.target.src = "/images/aitechs.png"; }}
                />
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setSeeSideBar(!seeSidebar);
                    collapseAllMenus();
                  }}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <MdMenuOpen className="w-6 h-6 text-white/80 rotate-180" />
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3
          [&::-webkit-scrollbar]:w-1.5
          [&::-webkit-scrollbar-track]:bg-transparent
          [&::-webkit-scrollbar-thumb]:bg-white/10
          [&::-webkit-scrollbar-thumb]:rounded-full">
          {!seeSidebar && (
            <div className="text-xs uppercase text-white/40 font-semibold
              mb-2 tracking-wider px-1">
              Menu
            </div>
          )}
          <ul className="space-y-1">
            {Object.keys(menuItems).map(renderMenuItem)}
          </ul>

          {/* Quick Links */}
          <div className={`mt-6 ${seeSidebar ? 'px-0' : 'px-0'}`}>
            {!seeSidebar && (
              <div className="text-xs uppercase text-white/40
              font-semibold mb-2 tracking-wider px-1">
                Quick Links
              </div>
            )}

            <ul className="space-y-1">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-3 p-3 rounded-xl
                      transition-all duration-200 group ${
                      seeSidebar ? 'justify-center' : ''
                    } ${
                      isActive(link.path) ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                    onClick={() => window.innerWidth < 1080 && setSeeSideBar(true)}
                  >
                    <span className="flex-shrink-0 text-white/80">{link.icon}</span>
                    {!seeSidebar && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-white/85"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Logout */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={`flex items-center gap-3 p-3 rounded-xl w-full transition-all duration-200
                  text-red-300 hover:bg-red-500/10 hover:text-red-200
                  ${seeSidebar ? 'justify-center' : ''}`}
              >
                <LogOut size={19} className="flex-shrink-0" />
                {!seeSidebar && <span className="text-sm font-medium">Log out</span>}
              </button>
            </div>
          </div>
        </nav>

        {/* Footer */}
        {!seeSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-white/10"
          >
            <div className="text-xs text-white/40 text-center">
              <p>© {new Date().getFullYear()} {company_name || "Aitechs"}</p>
              <p className="mt-1 inline-block px-2 py-0.5 rounded-full bg-white/5 text-white/50">
                {APP_VERSION}
              </p>
            </div>
          </motion.div>
        )}
      </motion.aside>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => !loggingOut && setShowLogoutConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700 font-sans"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                  <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Log out?</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                You'll need to sign in again to access the dashboard.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  disabled={loggingOut}
                  className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium
                    text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700
                    hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex-1 py-2.5 px-4 rounded-lg text-sm font-medium text-white
                    bg-red-600 hover:bg-red-700 transition-colors
                    disabled:opacity-70 disabled:cursor-not-allowed
                    flex items-center justify-center gap-2"
                >
                  {loggingOut && (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {loggingOut ? 'Logging out…' : 'Log out'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;