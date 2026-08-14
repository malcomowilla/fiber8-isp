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
import WifiSharpIcon from '@mui/icons-material/WifiSharp';
import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import PaymentsSharpIcon from '@mui/icons-material/PaymentsSharp';
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
import { FaRegMap } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import { CiSettings } from "react-icons/ci";
import { APP_VERSION, APP_DESCRIPTION } from '../version';
import { CiReceipt } from "react-icons/ci";
import {
  People as PeopleIcon,
  
} from '@mui/icons-material';
import { BsRouter } from "react-icons/bs";
import { GrTechnology } from "react-icons/gr";
import { FaUsersBetweenLines } from "react-icons/fa6";
import { Sparkles, Palette,  MapPinned, LogOut, AlertTriangle, LifeBuoy } from 'lucide-react'
import { LuTv } from "react-icons/lu";
import { MessageSquareText } from 'lucide-react'


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
const navigate = useNavigate() // add useNavigate to your react-router-dom import
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

  // Menu items configuration
  const menuItems = {
    dashboard: {
      icon: <BarChartIcon />,
      label: "Dashboard",
      path: "/admin/admin-dashboard",
      subItems: [
        {
          icon: <ManageAccountsOutlinedIcon />,
          label: "Activity Logs",
          path: "/admin/admin-dashboard"
        },
        {
          icon: <img src="/images/icons8-increase.gif" className="rounded-full
           w-6 h-6" alt="Analytics" />,
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
          icon: <div className="bg-white rounded-full w-8 h-8 
          flex items-center justify-center">
            <span className="text-xs font-bold text-black">MBPS</span>
          </div>,
          label: "PPOE Packages",
          path: "/admin/pppoe-packages"
        },
        {
          icon: <img src="/images/icons8-person.gif" className="rounded-full w-8 h-8" alt="User" />,
          label: "PPOE Subscribers",
          path: "/admin/pppoe-subscribers"
        },
        {
          icon: <AssessmentIcon className="w-6 h-6 text-yellow-600" />,
          label: "Payment Analytics",
          path: "/admin/subscriber-payment-analytics"
        },
        {
          icon: <FaUpload className="w-6 h-6 text-blue-500" />,
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
          icon: <img src="/images/icons8-map-pin.gif" className="w-6 h-6 rounded-full" alt="Nodes" />,
          label: "Nodes",
          path: "/admin/nodes"
        },
        {
          icon: <MapPinned className="w-6 h-6 text-yellow-600" />,
          label: "Network Map",
          path: "/admin/network-map"
        },
        {
          icon: <PiNetworkSlashLight className="w-6 h-6
           text-blue-600" />,
          label: "VPN Tunnel",
          path: "/admin/private-network"
        },
        {
          icon: <RouterIcon  />,
          label: "Routers",
          path: "/admin/nas"
        },
        {
          icon: <TbCloudNetwork />,
          label: "Ip Networks",
          path: "/admin/ip_networks"
        },
        {
          icon: <RiRouterLine className="w-6 h-6 text-orange-500" />,
          label: "ONU",
          path: "/admin/devices"
        },
        {
          icon: < BsRouter />,
          label: "Access Points",
          path: "/admin/access-point"
        },
        {
          icon: <img src="/images/wireguard2.png" className="w-6 h-6 
          rounded-full" alt="Wireguard" />,
          label: "Wireguard",
          path: "/admin/networks-wireguard-config"
        }
      ]
    },
    finance: {
      icon: <PaymentsIcon />,
      label: "Finance",
      subItems: [
        {
          icon: <AssessmentIcon />,
          label: "Finance Dashboard",
          path: "/admin/financial-dashboard"
        },
        {
          icon: <PaymentIcon />,
          label: "Hotspot Payments",
          path: "/admin/hotspot-payments"
        },
        {
          icon: <PaymentIcon />,
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
          icon: <MailOutlineIcon />,
          label: "Email",
          path: "/admin/email"
        },
        {
          icon: <TextsmsSharpIcon />,
          label: "SMS",
          path: "/admin/send-sms"
        },
        {
          icon: <TextsmsSharpIcon />,
          label: "Bulk",
          path: "/admin/bulk-messages"
        },
        {
          icon: <TextsmsSharpIcon />,
          label: "Messages",
          path: "/admin/messages"
        },
        {
          icon: <AiOutlineWhatsApp className="w-6 h-6 text-green-500" />,
          label: "WhatsApp",
          path: "/admin/whatsapp"
        },
            { icon: <MessageSquareText className="w-6 h-6 text-teal-400" />, label: "SMS Templates", path: "/admin/hotspot-sms-templates" }

      ]
    },
    hotspot: {
      icon: <SignalWifi3BarIcon />,
      label: "Hotspot Bundle",
      subItems: [
        {
          icon: <IoStatsChartOutline className="w-6 h-6" />,
          label: "Hotspot Dashboard",
          path: "/admin/hotspot-dashboard"
        },
        {
            icon: <TbHomeStats className=''/>,
            label: "Marketing",
            path: "/admin/hotspot-marketing-dashboard"
        },
        {
            icon: <GrTechnology className=''/>,
            label: "Bypass Hotspot",
            path: "/admin/hotspot-bypass"
        },
        {
          icon: <SiPaloaltonetworks className="w-6 h-6" />,
          label: "Hotspot Package",
          path: "/admin/hotspot-package"
        },
        {
          icon: <LuTv  className="w-6 h-6" />,
          label: "TV Plans",
          path: "/admin/tv-plans"
        },
        {
          icon: <LuTicketsPlane className="w-6 h-6 text-yellow-500" />,
          label: "Vouchers",
          path: "/admin/hotspot-subscriptions"
        },
        {
          icon: <Sparkles className="w-6 h-6 text-amber-400" />,
          label: "Promotions",
          path: "/admin/hotspot-promotions"
        },
        {
          icon: <LuLayoutTemplate />,
          label: "Templates",
          path: "/admin/hotspot-templates"
        },
        {
          icon: <Palette className="w-6 h-6 text-fuchsia-400" />,
          label: "Page Designer",
          path: "/admin/hotspot-page-designer"
        },
        {
          icon: <ImStatsBars className="w-6 h-6 text-yellow-500" />,
          label: "Revenue",
          path: "/admin/hotspot_anlytics"
        },
        {
          icon: <CiSettings className="w-6 h-6 text-green-500" />,
          label: "Settings",
          path: "/admin/hotspot_settings"
        }
      ]
    },
    support: {
      icon: <FcOnlineSupport className="w-6 h-6" />,
      label: "Support",
      subItems: [
        {
          icon: <LuTicketsPlane className="w-6 h-6 text-yellow-500" />,
          label: "Tickets",
          path: "/admin/customer-tickets"
        }
      ]
    },
    users: {
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 18">
        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
      </svg>,
      label: "Users",
      subItems: [
        {
          icon: <img src="/images/icons8-male-user.gif" className="w-6 h-6 rounded-full" alt="User" />,
          label: "Users",
          path: "/admin/user"
        },
        {
          icon: <LuUsers className="w-6 h-6" />,
          label: "User Groups",
          path: "/admin/user-group"
        },
        {
          icon: <FaUsersBetweenLines className="w-6 h-6" />,
          label: "Free Trial",
          path: "/admin/free-trial-users"
        },
        {
          icon: <PeopleIcon className="w-6 h-6 text-green-500" />,
          label: "Partners",
          path: "/admin/partners-management"
        },
      ]
    }
  };

  const quickLinks = [
    { icon: <ReceiptIcon />, label: "Billing Invoices", path: "/admin/invoice" },
    { icon: <FaHandshake className="w-6 h-6" />, label: "Leads", path: "/admin/client-leads" },
    { icon: <FaRegCalendarAlt className="w-6 h-6" />, label: "Scheduler", path: "/admin/scheduler" },
    { icon: <MdOutlineSecurity className="w-6 h-6" />, label: "DDOS", path: "/admin/prevent-ddos" },
    { icon: <MdDevices className="w-6 h-6" />, label: "Equipment", path: "/admin/equipment" },
    { icon: <GrLicense className="w-6 h-6" />, label: "License", path: "/admin/license" },
    { icon: <PermDataSettingIcon />, label: "Settings", path: "/admin/settings" },
    { icon: <LifeBuoy className="w-6 h-6" />, label: "Support Tickets", path: "/admin/support-tickets" },
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

    return (
      <li key={menuKey} className="relative font-sans">
        {seeSidebar ? (
          // Collapsed sidebar view
          <div
            className={`flex items-center p-3 rounded-lg transition-all
               duration-300  cursor-pointer group ${
              isActive(menu.path) ? 'bg-teal-800' : 'hover:bg-teal-700'
            }`}
            onMouseEnter={() => setHoveredMenu(menuKey)}
            onMouseLeave={() => setHoveredMenu(null)}
            onClick={() => {
              if (menu.path) {
                window.innerWidth < 1080 && setSeeSideBar(true);
              }
            }}
          >
            <div className="flex items-center justify-center w-6 h-6">
              {menu.icon}
            </div>
            
            {/* Hover tooltip for collapsed sidebar */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute left-full 
                  ml-2 top-1/2 -translate-y-1/2 bg-gray-900 
                  text-white px-3 py-2 rounded-md shadow-lg 
                  whitespace-nowrap z-50 font-sans"
                >
                  {menu.label}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Submenu for collapsed sidebar */}
            {menu.subItems && isHovered && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="absolute left-full ml-2 top-0 bg-gray-900
                 text-white rounded-lg shadow-xl py-2 z-40 min-w-[200px] font-sans"
              >
                <div className="px-3 py-2 font-semibold border-b border-gray-700">
                  {menu.label}
                </div>
                {menu.subItems.map((subItem, idx) => (
                  <Link
                    key={idx}
                    to={subItem.path}
                    className="flex items-center gap-3 px-4 py-3
                     hover:bg-gray-800 transition-colors"
                    onClick={() => window.innerWidth < 1080 && setSeeSideBar(true)}
                  >
                    <span className="flex-shrink-0">{subItem.icon}</span>
                    <span>{subItem.label}</span>
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
              className={`flex items-center justify-between w-full p-3
                 rounded-lg transition-all duration-300 group ${
                isActive(menu.path) ? 'bg-teal-800' : 'hover:bg-teal-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0">{menu.icon}</span>
                <span>{menu.label}</span>
              </div>
              {menu.subItems && (
                <span className="transition-transform duration-300">
                  {isOpen ? <KeyboardArrowUpSharpIcon /> : <KeyboardArrowDownSharpIcon />}
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
                    className="overflow-hidden"
                  >
                    <div className="ml-4 pl-4 border-l border-teal-600 space-y-1">
                      {menu.subItems.map((subItem, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Link
                            to={subItem.path}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                              isActive(subItem.path) ? 'bg-teal-800/50' : 'hover:bg-teal-700/50'
                            }`}
                            onClick={() => window.innerWidth < 1080 && setSeeSideBar(true)}
                          >
                            <span className="flex-shrink-0">{subItem.icon}</span>
                            <span>{subItem.label}</span>
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
          width: seeSidebar ? "64px" : "240px"
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        // font-sans instead of the old dead "font-montserat" class — this now
        // resolves to var(--font-sans), so appearance-settings font changes
        // (applyTheme -> --font-sans on <html>) apply here live, no reload needed.
        className="fixed top-0 left-0 h-screen bg-gradient-to-b
         bg-primary  to-teal-950 shadow-2xl overflow-hidden
          flex flex-col text-white font-sans z-50"
      >
        {/* Header */}
        <div className="p-4 border-b border-teal-700">
          <div className="flex items-center justify-between">
            {!seeSidebar ? (
              <>
                <div className="flex items-center gap-3">
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-12 w-12 rounded-full border-2 border-white"
                    src={logo_preview || "/images/aitechs.png"}
                    alt={company_name || "Aitechs"}
                    onError={(e) => { e.target.src = "/images/aitechs.png"; }}
                  />
                  {/* Brand/company name uses the display font slot (--font-display)
                      plus its own italic toggle (--font-style-display), independent
                      of body copy — matches how headings behave elsewhere in the app. */}
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-display font-bold text-white text-lg"
                    style={{ fontStyle: 'var(--font-style-display)' }}
                  >
                    {company_name  || "Aitechs"}
                  </motion.span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSeeSideBar(!seeSidebar);
                    collapseAllMenus();
                  }}
                  className="p-2 rounded-lg hover:bg-teal-800 
                  transition-colors"
                >
                  <MdMenuOpen className="w-8 h-8 text-white" />
                </motion.button>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <motion.img
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="h-10 w-10 rounded-full border-2 border-white"
                  src={logo_preview || "/images/aitechs.png"}
                  alt={company_name || "Aitechs"}
                  onError={(e) => { e.target.src = "/images/aitechs.png"; }}
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSeeSideBar(!seeSidebar);
                    collapseAllMenus();
                  }}
                  className="p-2 rounded-lg hover:bg-teal-800 transition-colors"
                >
                  <MdMenuOpen className="w-8 h-8 text-white
                   rotate-180" />
                </motion.button>
              </div>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-2">
            {Object.keys(menuItems).map(renderMenuItem)}
          </ul>

          {/* Quick Links */}
          <div className={`mt-8 ${seeSidebar ? 'px-0' : 'px-2'}`}>
            {!seeSidebar && (
              <div className="text-xs uppercase text-teal-300 
              font-semibold mb-2 tracking-wider">
                Quick Links
              </div>
            )}

            {/* Logout */}
            <div className={`mt-4 ${seeSidebar ? 'px-0' : 'px-2'}`}>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className={`flex items-center gap-3 p-3 rounded-lg w-full transition-all duration-300
                  text-red-300 hover:bg-red-900/30 hover:text-red-200
                  ${seeSidebar ? 'justify-center' : ''}`}
              >
                <LogOut size={20} className="flex-shrink-0" />
                {!seeSidebar && <span className="text-sm font-medium">Log out</span>}
              </button>
            </div>

            <ul className="space-y-1">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-3 p-3 rounded-lg 
                      transition-all duration-300 group ${
                      seeSidebar ? 'justify-center' : ''
                    } ${
                      isActive(link.path) ? 'bg-teal-800' : 'hover:bg-teal-700'
                    }`}
                    onClick={() => window.innerWidth < 1080 && setSeeSideBar(true)}
                  >
                    <span className="flex-shrink-0">{link.icon}</span>
                    {!seeSidebar && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm"
                      >
                        {link.label}
                      </motion.span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Footer */}
        {!seeSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 border-t border-teal-700"
          >
            <div className="text-xs text-teal-300 text-center">
              <p>© {new Date().getFullYear()} {company_name || "Aitechs"}</p>
              <p className="mt-1 text-teal-400">{APP_VERSION}</p>
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