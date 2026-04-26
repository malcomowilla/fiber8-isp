import { useContext } from 'react'
import { ApplicationContext } from '../context/ApplicationContext'
import { Profile } from '../profile/Profile'
import { useState, useEffect, useCallback } from 'react'
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import EastSharpIcon from '@mui/icons-material/EastSharp';
import { useApplicationSettings } from '../settings/ApplicationSettings'
import { LuBotMessageSquare } from "react-icons/lu";
import { FiDollarSign, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { FaArrowRightLong } from "react-icons/fa6";
import { FaIdCard } from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import { MdMenu, MdClose } from "react-icons/md";

const Header = () => {
  const { handleThemeSwitch, seeSidebar, setSeeSideBar, setPreferDarkMode, preferDarkMode } = useContext(ApplicationContext);
  
  const { 
    companySettings,
    showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
    showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
    showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
    showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
    providerSms, setProviderSms, smsBalance, setSmsBalance, setSelectedProvider
  } = useApplicationSettings();

  const [user, setUser] = useState(null);
  const [icon, setIcon] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const subdomain = window.location.hostname.split('.')[0];

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close all other menus when opening mobile menu
    if (!isMobileMenuOpen) {
      setShowMenu1(false); setShowMenu2(false); setShowMenu3(false);
      setShowMenu4(false); setShowMenu5(false); setShowMenu6(false);
      setShowMenu7(false); setShowMenu8(false); setShowMenu9(false);
      setShowMenu10(false); setShowMenu11(false); setShowMenu12(false);
    }
  };

  const getCompanyId = useCallback(async () => {
    try {
      const response = await fetch('/api/company_ids', {
        headers: { 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) {
        setCompanyId(newData[0].company_id);
      }
    } catch (error) {
      console.error('Error fetching company ID:', error);
    }
  }, [subdomain]);

  const handleGetSmsProviderSettings = useCallback(async () => {
    try {
      const response = await fetch(`/api/sms_provider_settings`, {
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) {
        setProviderSms(newData[0].sms_provider);
      } else {
        if (response.status === 402) {
          setTimeout(() => { window.location.href = '/license-expired'; }, 1800);
        }
        if (response.status === 401) {
          setTimeout(() => { window.location.href = '/signin'; }, 1900);
        }
      }
    } catch (error) {
      console.error('Error fetching SMS provider settings:', error);
    }
  }, [subdomain, setProviderSms]);

  const getSmsBalance = useCallback(async () => {
    try {
      const response = await fetch(`/api/get_sms_balance?selected_provider=${providerSms}`, {
        headers: { 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) {
        setSmsBalance(newData.message);
      }
    } catch (error) {
      console.error('Error fetching SMS balance:', error);
    }
  }, [providerSms, subdomain, setSmsBalance]);

  const fetchSavedSmsSettings = useCallback(async () => {
    try {
      const response = await fetch(`/api/saved_sms_settings`, {
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain },
      });
      const data = await response.json();
      const newData = data.length > 0 
        ? data.reduce((latest, item) => new Date(item.sms_setting_updated_at) > new Date(latest.sms_setting_updated_at) ? item : latest, data[0])
        : null;
      if (response.ok && newData) {
        setSelectedProvider(newData.sms_provider);
      }
    } catch (error) {
      console.error('Error fetching SMS settings:', error);
    }
  }, [subdomain, setSelectedProvider]);

  useEffect(() => {
    getCompanyId();
    handleGetSmsProviderSettings();
    fetchSavedSmsSettings();
  }, [getCompanyId, handleGetSmsProviderSettings, fetchSavedSmsSettings]);

  useEffect(() => {
    if (providerSms) {
      getSmsBalance();
    }
  }, [getSmsBalance, providerSms]);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
     <div className="w-full p-4 sm:p-10 h-auto sm:h-20 dark:text-white text-black cursor-pointer">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div style={{ cursor: 'pointer' }} onClick={() => setSeeSideBar(!seeSidebar)} className="transition-all duration-500">
            {seeSidebar ? <FaArrowRightLong className="w-7 h-7" /> : <ArrowBackSharpIcon />}
          </div>
          <div className="flex items-center justify-between bg-white rounded-lg px-4 py-4 border border-gray-300 shadow-sm w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <FaIdCard className="text-green-600 h-6 w-6" />
              <div>
                <p className="text-sm text-black">Company ID</p>
                <p className="font-mono text-gray-900">{companyId || 'FFETE'}</p>
              </div>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(companyId || 'FFETE')}
              className="text-black hover:text-green-500 transition-colors"
            >
              <FaCopy className="text-green-600 w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="flex flex-row gap-x-3 items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full sm:w-auto">
            {providerSms ? (
              <>
                <div className="p-2 bg-green-100 dark:bg-blue-900 rounded-full">
                  <LuBotMessageSquare className="text-green-600 dark:text-blue-300 w-6 h-6" />
                </div>
                <div className="flex-1" id="sms-balance">
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    SMS Provider: <span className="text-green-600 dark:text-blue-300 font-semibold">{providerSms}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    SMS
                    <span className="text-gray-600 dark:text-gray-300">
                      Balance: <span className="font-bold text-green-600 dark:text-blue-300">{smsBalance}</span>
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <FiAlertTriangle className="text-red-500 dark:text-red-400 w-6 h-6" />
                </div>
                <div id="sms-balance" className="flex-1">
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                    SMS Provider <span className="text-red-500 dark:text-red-400">Not Configured</span>
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <FiInfo className="inline mr-1" />
                    Please configure SMS settings in admin panel
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div onClick={() => setPreferDarkMode(!preferDarkMode)} id="dark-light">
              <div onClick={handleThemeSwitch}>
                <ion-icon
                  onClick={() => setIcon(!icon)}
                  name={icon ? 'moon-outline' : 'sunny'}
                  size="large"
                ></ion-icon>
              </div>
            </div>
            <div id="profile" className="profile">
              <Profile />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Header;