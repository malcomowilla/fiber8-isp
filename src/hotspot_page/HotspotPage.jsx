
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FaWifi,  FaUser, FaKey, FaUserPlus} from 'react-icons/fa'
import { FaPhone } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState, useCallback, useRef } from 'react';
import { TiArrowBackOutline } from "react-icons/ti";
import { SlNotebook } from "react-icons/sl";
import { HiMiniArrowLeftEndOnRectangle } from "react-icons/hi2";
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useNavigate, useLocation } from 'react-router-dom';
import { CiBarcode } from "react-icons/ci";
import { FaArrowAltCircleLeft } from "react-icons/fa";
import { MdOutlineWifi } from "react-icons/md";
import { FaShoppingCart } from "react-icons/fa";
import { BsBoxArrowLeft } from "react-icons/bs";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import { MdCancel } from "react-icons/md";
import { X, ChevronRight, Sparkles } from 'lucide-react';
import { FaLongArrowAltRight } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { 
  
  MapPin,Phone,Clock,Star,CheckCircle, Wifi,CreditCard,Shield,ArrowLeft, 
  Zap,
  ArrowRight,
  AlertCircle,
  Info,
  Lock,
  Globe,
  RefreshCw,
  WifiOff,
  XCircle, 
  AlertTriangle,Smartphone,
     Tag, Receipt, 
} from 'lucide-react';
import TrackEvent from './TrackEvent'
import { createConsumer } from "@rails/actioncable";
import { MacRandomizationInstructions, SimpleMacInstructions, 
  HotspotAutoLoginNotice } from './MacRandomizationInstructions'; // Import MacRandomizationInstructions from './MacRandomizationInstructions'


import HotspotSMSInfo from './HotspotSmsInfo';
import { CiReceipt } from "react-icons/ci";
import HotspotAdOverlay from './HotspotAdOverlay';


const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'Space Mono', monospace; }
    input:-webkit-autofill, input:-webkit-autofill:focus {
      -webkit-box-shadow: 0 0 0 1000px #0f172a inset !important;
      -webkit-text-fill-color: #e2e8f0 !important;
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }

    @keyframes drift {
      0%,100% { transform: translate(0,0) scale(1); }
      33%      { transform: translate(20px,-30px) scale(1.06); }
      66%      { transform: translate(-15px,20px) scale(0.96); }
    }
    @keyframes ripple {
      0%   { transform: scale(0.8); opacity: 0.6; }
      100% { transform: scale(2.4); opacity: 0; }
    }
    @keyframes ticker {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    @keyframes gradientShift {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }

    .drift1 { animation: drift 12s ease-in-out infinite; }
    .drift2 { animation: drift 16s ease-in-out infinite reverse; }
    .drift3 { animation: drift 10s ease-in-out infinite 3s; }
    .ripple  { animation: ripple 2.5s ease-out infinite; }
    .ripple2 { animation: ripple 2.5s ease-out infinite 0.8s; }
    .ripple3 { animation: ripple 2.5s ease-out infinite 1.6s; }
    .ticker-inner { animation: ticker 22s linear infinite; }
    .cursor-blink { animation: blink 1s step-end infinite; }
    .gradient-btn {
      background: linear-gradient(135deg, #0ea5e9, #6366f1);
      background-size: 200% 200%;
      animation: gradientShift 3s ease infinite;
      transition: opacity .2s, transform .15s;
    }
    .gradient-btn:hover:not(:disabled) { opacity:.9; transform:translateY(-1px); }
    .gradient-btn:active:not(:disabled) { transform:translateY(0); }
    .gradient-btn:disabled { animation:none; background:#1e293b; opacity:.5; cursor:not-allowed; }
    .card-glass {
      background: rgba(15,23,42,0.72);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
    }
    .input-base {
      background: rgba(30,41,59,0.55);
      border: 1px solid rgba(148,163,184,0.11);
      transition: border-color .2s, box-shadow .2s;
      color: #e2e8f0;
    }
    .input-base:focus { outline:none; border-color:rgba(56,189,248,.4); box-shadow:0 0 0 3px rgba(56,189,248,.07); }
    .input-base::placeholder { color: rgba(148,163,184,.3); }
    .pkg-card { transition: border-color .2s, transform .15s, background .2s; }
    .pkg-card:hover { transform: translateY(-1px); }
    .pkg-shimmer {
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.04), transparent);
      background-size: 200% 100%;
      animation: shimmer 2.5s infinite;
    }
    .tab-pill {
      transition: background .2s, color .2s, border-color .2s;
    }
  `}</style>
);





const getCsrf = () =>
  document?.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

// ── Status banner ──────────────────────────────────────────────────────────────
function StatusBanner({ status, message, onDismiss }) {
  if (!status) return null;
  const map = {
    error:      { bg: 'rgba(239,68,68,.08)',   border: 'rgba(239,68,68,.25)',   text: '#fca5a5', Icon: AlertCircle },
    success:    { bg: 'rgba(52,211,153,.08)',  border: 'rgba(52,211,153,.25)',  text: '#6ee7b7', Icon: CheckCircle },
    processing: { bg: 'rgba(251,191,36,.08)',  border: 'rgba(251,191,36,.25)',  text: '#fcd34d', Icon: RefreshCw },
    cancelled:  { bg: 'rgba(251,146,60,.08)',  border: 'rgba(251,146,60,.25)',  text: '#fdba74', Icon: X },
  };
  const s = map[status] || map.error;
  return (
    <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-6 }}
      className="flex items-start gap-3 p-4 rounded-2xl border text-sm"
      style={{ background: s.bg, borderColor: s.border, color: s.text }}
    >
      <s.Icon size={16} className={`shrink-0 mt-0.5 ${status==='processing'?'animate-spin':''}`} />
      <span className="flex-1 leading-relaxed">{message}</span>
      {onDismiss && status !== 'processing' && (
        <button onClick={onDismiss} className="shrink-0 text-lg leading-none opacity-60 hover:opacity-100">×</button>
      )}
    </motion.div>
  );
}




function ConnectedScreen({ packageName, expiration, username }) {
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background:'rgba(2,6,23,.92)', backdropFilter:'blur(20px)' }}
    >
      <motion.div
        initial={{ scale:.82, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ type:'spring', stiffness:220, damping:20 }}
        className="card-glass w-full max-w-sm rounded-3xl p-8 text-center border"
        style={{ borderColor:'rgba(52,211,153,.2)', boxShadow:'0 0 60px rgba(52,211,153,.1)' }}
      >
        <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <div className="ripple  absolute inset-0 rounded-full border" style={{ borderColor:'rgba(52,211,153,.5)' }} />
          <div className="ripple2 absolute inset-0 rounded-full border" style={{ borderColor:'rgba(52,211,153,.3)' }} />
          <div className="ripple3 absolute inset-0 rounded-full border" style={{ borderColor:'rgba(52,211,153,.15)' }} />
          <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background:'rgba(52,211,153,.15)', border:'1px solid rgba(52,211,153,.3)' }}>
            <Wifi size={28} style={{ color:'#34d399' }} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-1">Connected!</h2>
        <p className="text-sm mb-7" style={{ color:'#64748b' }}>You're online — enjoy browsing.</p>
        <div className="space-y-2 text-left mb-6">
          {[[  'Username', username], [ 'Package', packageName], ['Expires', expiration]].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background:'rgba(30,41,59,.6)', border:'1px solid rgba(148,163,184,.08)' }}>
              <span className="text-xs" style={{ color:'#64748b' }}>{l}</span>
              <span className="text-sm font-semibold text-slate-200 mono">{v || '—'}</span>
            </div>
          ))}
        </div>
        <p onClick={() => window.location.reload()} className="gradient-btn block w-full 
        py-3.5 rounded-2xl text-white font-semibold text-sm text-center">
          Start Browsing →
        </p>
      </motion.div>
    </motion.div>
  );
}






function PkgCard({ pkg, selected, onClick }) {
  return (
    <motion.button whileTap={{ scale:.98 }} onClick={onClick}
      className="pkg-card relative w-full text-left p-4 rounded-2xl border overflow-hidden"
      style={{
        borderColor: selected ? pkg.accent : 'rgba(148,163,184,.1)',
        background: selected ? `${pkg.accent}0f` : 'rgba(15,23,42,.5)',
      }}
    >
      {selected && <div className="pkg-shimmer absolute inset-0 pointer-events-none" />}

      {pkg.popular && (
        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ background: `${pkg.accent}22`, color: pkg.accent }}>
          Popular
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${pkg.accent}18`, border:`1px solid ${pkg.accent}28` }}>
          <Wifi size={18} style={{ color: pkg.accent }} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-100">{pkg.name}</p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="flex items-center gap-1 text-xs" style={{ color:'#64748b' }}>
              <Clock size={9} /> {pkg.valid}
            </span>
            <span className="flex items-center gap-1 text-xs" style={{ color:'#64748b' }}>
              <Zap size={9} /> {pkg.speed}
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-slate-100 mono">
            <span className="text-xs font-normal mr-0.5" style={{ color:'#64748b' }}>Ksh</span>
            {pkg.price}
          </p>
        </div>
      </div>

      {/* Selected indicator */}
      {selected && (
        <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
          className="mt-3 pt-3 border-t flex items-center gap-2"
          style={{ borderColor:`${pkg.accent}25` }}>
          <CheckCircle size={12} style={{ color: pkg.accent }} />
          <span className="text-xs font-medium" style={{ color: pkg.accent }}>Selected — tap Pay Now to continue</span>
        </motion.div>
      )}
    </motion.button>
  );
}



const HotspotPage = () => {
 const [packages, setPackages] = useState([])
 const [seeForm, setSeeForm] = useState(false)
 const [seePackages, setSeePackages] = useState(true)
 const [seeInstructions, setSeeInstructions] = useState(true)
 const [hotspotPackage, setHotspotPackage] = useState(null)
 const [packageAmount, setPackageAmount] = useState(null)
const [showVoucherError, setShowVoucherError] = useState(false)
const [activeTabPremium, setActiveTabPremium] = useState('packages')
  const [tab, setTab]  = useState('packages');
  const [adCompleted, setAdCompleted] = useState(false);



   const [pkgLoading, setPkgLoading] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(null);
  const [payStep, setPayStep]       = useState('list'); 




  // ── Voucher

  // ── M-Pesa receipt
  const [txCode, setTxCode]         = useState('');

  // ── Shared status
  const [status, setStatus]         = useState(null);
  const [message, setMessage]       = useState('');

  // ── Connection result
  const [connected, setConnected]   = useState(false);
  const [connPkg, setConnPkg]       = useState('');
  const [expiry, setExpiry]         = useState('');

  // ── UI
  const [ready, setReady]           = useState(false);
  const [typedName, setTypedName]   = useState('');



// Add these state variables to the component
const [showAuth, setShowAuth] = useState(false);
const [authType, setAuthType] = useState('login'); // 'login' or 'signup'
const [password, setPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');
const [authError, setAuthError] = useState('');
const [authLoading, setAuthLoading] = useState(false);
const [loadingPay, setLoadingPay] = useState(false);
const [voucherLoad, setVoucherLoad] = useState(false) 
const [transactionLoad, setTransactionLoad] = useState(false)

const {companySettings, setCompanySettings,


  templateStates, setTemplateStates,
  settingsformData, setFormData,
  loading, setLoading,
  success, setsuccess,
  handleChangeHotspotVoucher, voucher, setVoucher,


  hotspotName, setHotspotName,hotspotInfo, setHotspotInfo,
  hotspotBanner, setHotspotBanner,hotspotBannerPreview, setHotspotBannerPreview,email,
  setEmail,hotspotPhoneNumber, setHotspotPhoneNumber,hotspotEmail, setHotspotEmail,
  adSetingsData, setAdSetingsData,adData, setAdData, hotspotCustomization, 
  setHotspotCustomization,hotspotMpesaSettings

} = useApplicationSettings();

 const {company_name, contact_info, email_info, logo_preview} = companySettings
 
 const {enabled, to_right, to_left, to_top} = adSetingsData

 const {attractive, flat,
  minimal, simple, clean, default_template, sleekspot, pepea, premium} = templateStates

const { 
  customize_template_and_package_per_location,enable_autologin
} = hotspotCustomization


const { consumer_key, consumer_secret, passkey, short_code, 
  api_initiator_username, api_initiator_password
 } = hotspotMpesaSettings

  
  const [activeTab, setActiveTab] = useState('packages'); 
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [remainingTime, setRemainingTime] = useState(300);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [voucherName, setVoucherName] = useState('');
const [expiration, setExpiration] = useState('');
const [voucherPackage, setVoucherPackage] = useState('');
const [queryStatus, setQueryStatus] = useState(null);
const [queryMessage, setQueryMessage] = useState('');
const [seeSleekSpotPackages, setSeeSleekSpotPackages] = useState(false);
const [templatesLoaded, setTemplatesLoaded] = useState(false);
const [packageLoaded, setPackageLoaded] = useState(false);

  
const queryParams = new URLSearchParams(window.location.search);
const router_mac = queryParams.get('mac')
const router_ip = queryParams.get('ip')
const router_username = queryParams.get('username')
const storedIp = localStorage.getItem('hotspot_ip')
const storedMac = localStorage.getItem('hotspot_mac') 



const mac = localStorage.getItem("hotspot_mac");
const ip = localStorage.getItem("hotspot_ip");
const username = localStorage.getItem("hotspot_username");

 const subdomain = window.location.hostname.split('.')[0]




  const handleAdComplete = useCallback(
  ({ reward_type, selected_package, free_minutes }) => {
    setAdCompleted(true);

    if (reward_type === 'free_browse') {
      fetch('/api/grant_free_browsing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({ mac, ip, minutes: free_minutes }),
      });
    }

    if (reward_type === 'specific' && selected_package) {
      const pkg = packages.find(p => p.id === parseInt(selected_package));
      if (pkg) setSelectedPkg(pkg);
    }
  },
  [subdomain, mac, ip, packages] // dependencies
);




const handleUserLogin = async (e) => {
  e.preventDefault();
  setAuthLoading(true);
  setAuthError('');

  try {
    const response = await fetch('/api/login_with_username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
        username: username,
        password: password,
        mac: mac,
        ip: ip
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      setIsConnected(true);
      setVoucherName(data.username || username);
      setExpiration(data.expiration || 'Active');
      setVoucherPackage(data.package || 'User Account');
      toast.success('Login successful!', {
        duration: 3000,
        position: 'top-right',
      });
      setShowAuth(false);
    } else {
      setAuthError(data.error || 'Login failed');
    }
  } catch (error) {
    setAuthError('Network error. Please try again.');
  } finally {
    setAuthLoading(false);
  }
};



const handleUserSignup = async (e) => {
  e.preventDefault();
  setAuthLoading(true);
  setAuthError('');

  if (password !== confirmPassword) {
    setAuthError('Passwords do not match');
    setAuthLoading(false);
    return;
  }

  try {
    const response = await fetch('/api/signup_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        mac: mac,
        ip: ip
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      toast.success('Account created successfully!', {
        duration: 3000,
        position: 'top-right',
      });
      
      setAuthType('login');
      setAuthError('');
      
    } else {
      setAuthError(data.error || 'Signup failed');
    }
  } catch (error) {
    setAuthError('Network error. Please try again.');
  } finally {
    setAuthLoading(false);
  }
};



const handleUserLogout = async () => {
  try {
    const response = await fetch('/api/logout_user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
        username: voucherName,
        mac: mac,
        ip: ip
      })
    });

    if (response.ok) {
      setIsConnected(false);
      setVoucherName('');
      setExpiration('');
      setVoucherPackage('');
      toast.success('Logged out successfully', {
        duration: 3000,
        position: 'top-right',
      });
    }
  } catch (error) {
  }
};




  
  useEffect(() => {
    if (remainingTime > 0 && isConnecting) {
      const timer = setTimeout(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [remainingTime, isConnecting]);

 

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg);
    setActiveTab('payment');


  };

 

 



  const ConnectionStatus = () => {
    if (isConnecting) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto mb-4"
            >
              <RefreshCw className="w-full h-full text-blue-500" />
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Connecting...</h3>
            <p className="text-gray-600 mb-4">Please wait while we establish your connection</p>
            <div className="bg-gray-100 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 3 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-full"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Time remaining: {formatTime(remainingTime)}</p>
          </div>
        </motion.div>
      );
    }



    if (isConnected ) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-green-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Connected!</h3>
            <p className="text-gray-600 mb-6">You're now connected to the WiFi</p>
            
            <div className="space-y-4 text-left mb-6">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Package</span>
                <span className="text-black">{voucherPackage || 'No Package'}</span>
              </div>

           <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Username</span> 
                <span className="text-black">
                  {voucherName || 'No Name'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-600">Expiry</span> 
                <span className="text-black">
                  {expiration || 'No Expiration'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 
              bg-gray-50 rounded-lg">
              </div>
            </div>
            
         
          </div>
        </motion.div>
      );
    }

    return null;
  };



  const [error, setError] = useState(false);
  const [seeError, setSeeError] = useState(false)
 const navigate = useNavigate();
 const location = useLocation();
 const [isloading, setisloading] = useState(false)
 const [issuccess, setSuccess] = useState(false);
 const [phoneNumber, setPhoneNumber] = useState('');
 const selectedTemplate = location.state?.template;

 const [isVisible, setIsVisible] = useState(false);
 const [seeAdd, setSeeAdd] = useState(false);
const [hotspotIp, setHotspotIp] = useState('');
const [matchedPool, setMatchedPool] = useState(null);
const [templateFound, setTemplateFound] = useState('');
const [receipt_number, setReceiptNumber] = useState('');


if (router_mac && router_ip) {
  localStorage.setItem("hotspot_mac", router_mac);
  localStorage.setItem("hotspot_ip", router_ip);
  localStorage.setItem("hotspot_username", router_username);
}


let stkQueryInterval = 5000;
let stkQueryIntervalId = null;
const stkQueryIntervalIdRef = useRef(null);
const pollIntervalIdRef = useRef(null);



const cable = createConsumer(`wss://${window.location.hostname}/cable?X-ip=${ip}`);


     

const startTransactionStatus = () => {
const transactionstatusInterval = setInterval(async() => {
  try {
    const response = await fetch('/api/receipt_number_status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
        mac: mac,
        ip: ip
      })
  })
const newData = await response.json();
  if (response.ok) {
    if (newData.connected) {
      // setIsConnected(true);
      setConnected(true)
      clearInterval(transactionstatusInterval)
    }else{
       clearInterval(transactionstatusInterval)
    }
    
  } else {
     setIsConnected(false);
      clearInterval(transactionstatusInterval)

    
  }
  } catch (error) {
     clearInterval(transactionstatusInterval)
    
  }
  
}, 5000);
}


const loginWithReceiptNumber = async(e) => {
  e.preventDefault();
  try {
    setAuthLoading(true);
    setTransactionLoad(true)
    const response = await fetch('/api/login_with_receipt_number', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
      body: JSON.stringify({
        receipt_number: receipt_number,
        mac: mac,
        ip: ip
      })
    });
    if (response.ok) {

      //  setIsConnected(true);
       setAuthLoading(false);
       setTransactionLoad(false)
       toast.success('Connection Successful', {
        duration: 3000,
        position: 'top-right',
      });
      startTransactionStatus()

    } else {
      setAuthLoading(false);
      setTransactionLoad(false)
      const newData = await response.json();
      startTransactionStatus()
      toast.error(`Login failed => ${newData.error}`, {
        duration: 3000,
        position: 'top-right',
      });
      
    }
    
  } catch (error) {
    setAuthLoading(false);
    setTransactionLoad(false)
    toast.error('Something went wrong, please try again', {
      duration: 3000,
      position: 'top-right',
    });
    
  }

}



const startQueryStatus = () => {
  if (stkQueryIntervalIdRef.current) {
    clearInterval(stkQueryIntervalIdRef.current);
    stkQueryIntervalIdRef.current = null;
  }

  stkQueryIntervalIdRef.current = setInterval(async () => {
    try {
      const checkout_request_id = localStorage.getItem('checkout_request_id');
      
      if (!checkout_request_id) {
        clearInterval(stkQueryIntervalIdRef.current);
        stkQueryIntervalIdRef.current = null;
        return;
      }

      const response = await fetch(
        `/api/query_status`,
        {
          method: "POST",
          headers: {
            "X-Subdomain": subdomain,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            checkout_request_id: checkout_request_id
          }),
        }
      );

      const newData = await response.json();

      if (response.ok) {
        
        switch(newData.response.ResultCode) {
          case "0":
            clearInterval(stkQueryIntervalIdRef.current);
            stkQueryIntervalIdRef.current = null;
            setQueryStatus('success');
              setConnected(true)
//  setIsConnected(true);
  // startPolling();
            setQueryMessage('Payment successful!.');
            setSuccessMessage('Payment successful.');
             
            setSuccess(true);
            setSeeError(false);
            setTimeout(() => {
              localStorage.removeItem('checkout_request_id');
              localStorage.removeItem('payment_status');
            }, 30000);
            localStorage.setItem('payment_status', 'success');
           
            break;
            
          case "4999":
            setQueryStatus('processing');
            setQueryMessage('The transaction is still under processing. Please wait...');
            localStorage.setItem('payment_status', 'processing');
            break;
            
          case "1037":
            clearInterval(stkQueryIntervalIdRef.current);
            stkQueryIntervalIdRef.current = null;
            setQueryStatus('no_response');
            setQueryMessage('No response received from user. Please complete the M-Pesa prompt.');
            setError('No response received. Please try again.');
            setSeeError(true);
            setTimeout(() => {
              localStorage.removeItem('checkout_request_id');
              localStorage.removeItem('payment_status');
            }, 10000);
            localStorage.setItem('payment_status', 'no_response');
            break;
            
          case "1032":
            clearInterval(stkQueryIntervalIdRef.current);
            stkQueryIntervalIdRef.current = null;
            setQueryStatus('cancelled');
            setQueryMessage('Payment was cancelled by user. Please try again.');
            setError('Payment was cancelled. Please try again.');
            setSeeError(true);
            setTimeout(() => {
              localStorage.removeItem('checkout_request_id');
              localStorage.removeItem('payment_status');
            }, 15000);
            localStorage.setItem('payment_status', 'cancelled');
            break;
            
          case "2001":
            clearInterval(stkQueryIntervalIdRef.current);
            stkQueryIntervalIdRef.current = null;
            setQueryStatus('invalid_initiator');
            setQueryMessage('The initiator information is invalid.');
            setError('Invalid payment details.');
            setSeeError(true);
            setTimeout(() => {
              localStorage.removeItem('checkout_request_id');
              localStorage.removeItem('payment_status');
            }, 10000);
            localStorage.setItem('payment_status', 'invalid_initiator');
            break;
            
          default:
            clearInterval(stkQueryIntervalIdRef.current);
            stkQueryIntervalIdRef.current = null;
            setQueryStatus('error');
            //  setIsConnected(true);

            setQueryMessage(newData.response.ResultDesc || 'Payment failed Service is unavailable. Please try again later.');
            setError(newData.response.ResultDesc || 'Payment failed Service is unavailable. Please try again later.');
            setSeeError(true);
            setTimeout(() => {
              localStorage.removeItem('checkout_request_id');
              localStorage.removeItem('payment_status');
            }, 10000);
            localStorage.setItem('payment_status', 'error');
        }
      } else {
      }
    } catch (error) {
    }
  }, stkQueryInterval);
};



useEffect(() => {
  return () => {
    if (stkQueryIntervalIdRef.current) {
      clearInterval(stkQueryIntervalIdRef.current);
    }
  };
}, []);




let pollInterval = 50000; 
let intervalId = null;

const startPolling = () => {
  intervalId = setInterval(async () => {
    try {
      const res = await fetch(
        `/api/payment_and_connected_status?ip=${ip}&mac=${mac}`,
        {
          method: "POST",
          headers: {
            "X-Subdomain": subdomain,
          },
        }
      );

      const data = await res.json();

      if (data.paid && data.connected) {
        clearInterval(intervalId);
        setIsConnected(true);
      }
    } catch (err) {
    }
  }, pollInterval);
};







const handleGetHotspotCustomizations = useCallback(
  async() => {
     try {
    const response = await fetch('/api/allow_get_hotspot_customization', {
      headers: {
        'X-Subdomain': subdomain,
      },
    })
    const newData = await response.json()
    if (response.ok) {
      setHotspotCustomization({
        customize_template_and_package_per_location: newData[0].customize_template_and_package_per_location,
        enable_autologin: newData[0].enable_autologin 
      })
    } else {
    }
  } catch (error) {
    console.log(error)
  }
  },
  [],
)




  useEffect(() => {
    
   const timer = setTimeout(() => setSeeAdd(true), 2000);
    return () => clearTimeout(timer);

  }, []);



  useEffect(() => {
   if (enabled && seeForm) {
 fetch("/api/track_ad_event", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "X-Subdomain": subdomain,
      },
      body: JSON.stringify({
        event_type: 'Ad View',
      })
    }).then(res => console.log("Event tracked"))
      .catch(err => console.error(err));
   }
  }, [enabled, subdomain, seeForm]);



 
const { vouchers } = voucher




const getTextStyle = () => {
    let style = {};
    if (textFormat.bold) style.fontWeight = 'bold';
    if (textFormat.italic) style.fontStyle = 'italic';
    if (textFormat.underline) style.textDecoration = 'underline';
    if (textFormat.align) style.textAlign = textFormat.align;
    return style;
  };



  const [textFormat, setTextFormat] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: 'left'
  });

 

const getAdd = useCallback(
  async() => {
    try {
      const response = await fetch('/api/ads', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })

      const newData = await response.json()
      if (response.ok) {
        const {title, description, business_name, business_type, offer_text, discount,
           cat_text, background_color, text_color, image, imagePreview,   image_preview, target_url,website, phone, email} = newData[0]


        setAdData(prevData => ({...prevData, title, description, 
           businessName: business_name,
           businessType: business_type,    offerText: offer_text,
            discount, 
           catText:cat_text, backgroundColor: background_color,
            textColor: text_color,
            targetUrl: target_url,
            image,
            imagePreview:image_preview, target_url,
            contact: { website, phone, email }
          
          }))
     }
    } catch (error) {
      
    }
  },
  [],
)





 const makeHotspotPayment = async (e) => {
  e.preventDefault();
  setisloading(true);
  setError(false);
  setSuccess(false);
    setQueryStatus(null); 
  setQueryMessage(''); 
  setLoadingPay(true); setStatus(null);
    // if (!selectedPkg || !phoneNumber) return;
    

  try {
    const response = await fetch("/api/make_payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Subdomain": subdomain,
      },
      body: JSON.stringify({
        phone_number: phoneNumber,
        amount: packageAmount || selectedPackage.price,
        package: hotspotPackage || selectedPackage.name,
        ip: ip,
        mac: mac,
      }),
    });

    const newData = await response.json();
    if (response.ok) {
      setSuccess(true);
      localStorage.setItem('checkout_request_id', newData.checkout_request_id)
       setPhoneNumber('')
       setQueryStatus('processing');
      setQueryMessage('The transaction is still under processing. Please wait...');

      setStatus('processing');
        setMessage('STK push sent — enter your M-Pesa PIN on your phone to complete payment.');


       startQueryStatus();
        setLoadingPay(false);
    } else {
      setError(true);
      setSeeError(true);
      setPhoneNumber('')
        setQueryStatus('error');
      setQueryMessage(newData.message || 'Payment initiation failed');
       setStatus('error');
        setMessage(newData.message || 'Payment failed. Please try again.');
        setLoadingPay(false);
    }
  } catch (error) {
    setError(true);
     setPhoneNumber('')
     setQueryStatus('error');
    setQueryMessage('Network error. Please check your connection.');

     setStatus('error');
      setLoadingPay(false);
  } finally {
    setisloading(false);
     setPhoneNumber('')
  }
};





const getAddSettings = useCallback(
  async() => {
    try {
      const response = await fetch('/api/ad_settings', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        const {enabled, to_right, to_left, to_top} = newData[0]
        setAdSetingsData({...adSetingsData, enabled, to_right, 
          to_left, to_top})
      }
    } catch (error) {
      
    }
  },
  []
)






 const getHotspotSettings = useCallback(
  async () => {
    try {
      const response = await fetch('/api/get_hotspot_settings', {
        headers: {
          'X-Subdomain': subdomain,
        },
      });
      const newData = await response.json();
      if (response.ok) {
        const { phone_number, hotspot_name, hotspot_info,
           hotspot_banner, email } = newData;
        setHotspotPhoneNumber(phone_number);
        setHotspotName(hotspot_name);
        setHotspotInfo(hotspot_info);
        setHotspotEmail(email)
       
      } else {
      }
    } catch (error) {
      
    }
  },
  [
  ]
);







 const handleGetCompanySettings = useCallback(
  async() => {
    try {
      const response = await fetch('/api/allow_get_company_settings', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        const { contact_info, company_name, email_info, logo_url,
          customer_support_phone_number,agent_email ,customer_support_email
         } = newData
        setCompanySettings((prevData)=> ({...prevData, 
          contact_info, company_name, email_info,
          customer_support_phone_number,agent_email ,customer_support_email,
        
          logo_preview: logo_url
        }))

      }else{
      }
    } catch (error) {
    
    }
  },
  [],
)



const loadHotspotPage = useCallback(
  async() => {
    try {
       setTemplatesLoaded(false);
    const response = await fetch("/api/hotspot_page_data", {
      headers: {
        "X-Subdomain": subdomain
      }
    });

    const data = await response.json();

    if (response.ok) {
       setTemplatesLoaded(true);
        const { attractive, flat,
        minimal, simple, clean, default_template, sleekspot,
         pepea, premium} = data.templates

     setTemplateStates({
       ...templateStates,
       sleekspot: sleekspot,
       default_template: default_template,
       attractive: attractive,
       flat: flat,
       minimal: minimal,
       simple: simple,
       clean: clean,
       pepea: pepea,
       premium: premium,
     });

      const {title, description, business_name, business_type, offer_text, discount,
           cat_text, background_color, text_color, image, 
           imagePreview,   image_preview, target_url,website, 
           phone,} = data.ads

 setAdData(prevData => ({...prevData, title, description, 
           businessName: business_name,
           businessType: business_type,    offerText: offer_text,
            discount, 
           catText:cat_text, backgroundColor: background_color,
            textColor: text_color,
            targetUrl: target_url,
            image,
            imagePreview:image_preview, target_url,
            contact: { website, phone, email }
          
          }))      
       const {enabled, to_right, to_left, to_top} = data.ad_settings
        setAdSetingsData({...adSetingsData, enabled, to_right, 
          to_left, to_top})
          setHotspotCustomization({
        customize_template_and_package_per_location: data.customization.customize_template_and_package_per_location,
        enable_autologin: data.customization.enable_autologin 
      })

     
      const { phone_number, hotspot_name, hotspot_info, email } =
        data.hotspot_settings;

      setHotspotPhoneNumber(phone_number);
      setHotspotName(hotspot_name);
      setHotspotInfo(hotspot_info);
      setHotspotEmail(email);
    }else{
       setTemplatesLoaded(true);
    }
  } catch (error) {
     setTemplatesLoaded(true);
  }
  },
  [],
)

 const getHotspotTemplates = useCallback(
  async() => {
    setTemplatesLoaded(false);
    const response = await fetch('/api/allow_get_hotspot_templates', {
      method: 'GET',
      headers: {
        'X-Subdomain': subdomain,

      },
    });

const newData = await response.json();
    if (response.ok) {
      setTemplatesLoaded(true);
      const { attractive, flat,
        minimal, simple, clean, default_template, sleekspot,
         pepea, premium} = newData[0]

     setTemplateStates({
       ...templateStates,
       sleekspot: sleekspot,
       default_template: default_template,
       attractive: attractive,
       flat: flat,
       minimal: minimal,
       simple: simple,
       clean: clean,
       pepea: pepea,
       premium: premium,
     });
    } else {
      toast.error('failed to get hotspot templates settings', {
        duration: 3000,
        position: 'top-right',
      });
    }

  },
  [],
)

useEffect(() => {
  getHotspotTemplates();
  getHotspotSettings()
  getAddSettings()
  handleGetCompanySettings()
  
  getAdd()
  handleGetHotspotCustomizations()
 
}, [getHotspotTemplates, getHotspotSettings, getAddSettings,
getAdd, handleGetHotspotCustomizations, handleGetCompanySettings
  

]);








const voucherAutoLogin = useCallback(async () => {
  try {
    const sessionResponse = await fetch(`/api/check_session?username=${username} &mac=${mac} &ip=${ip}`,

      {
        method: 'GET',
        headers: {
          'X-Subdomain': subdomain,
        },
      }
    );
    const sessionData = await sessionResponse.json();

    if (sessionResponse.ok && sessionData.session_active) {
      setVoucherName(sessionData.username)
      setExpiration(sessionData.expiration)
      setVoucherPackage(sessionData.package)
      const loginResponse = await fetch('/api/login_with_hotspot_voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({
          voucher: sessionData.username,
          stored_mac: storedMac,
          stored_ip: storedIp,
          mac: mac,
          ip: sessionData.ip,
        }),
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok) {
        
        setLoading(false);
          // setIsConnected(true);
          setConnected(true)
        toast.success('Connection Successful', {
          duration: 3000,
          position: 'top-right',
        });
        
  setVoucherName(loginData.username)
      setExpiration(loginData.expiration)
      setVoucherPackage(loginData.package)
      } else {
        setLoading(false);
        toast.error('Connection failed');
      }
    } else {
      setLoading(false);
      toast.error('No active session found');
      navigate('/hotspot-page')
    }
  } catch (error) {
    setLoading(false);
  }
}, []);



useEffect(() => {
  if (enable_autologin) {
    voucherAutoLogin() 
  }
  
}, [voucherAutoLogin, enable_autologin]);

const [voucherError, setVoucherError] = useState('')
const [seeVoucherError, setSeeVoucherError] = useState(false)
const loginWithVoucher = async(e) => {

  e.preventDefault()
  
    try {
      setLoading(true)
       setLoadingPay(true)
      setIsLoading(true)
         setVoucherLoad(true); setStatus(null);
      const response = await fetch('/api/login_with_hotspot_voucher', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
    
        },
  
        body: JSON.stringify({
          voucher: vouchers,
          router_name: settingsformData.router_name,
          stored_mac: storedMac,
          stored_ip: storedIp, 
          mac: mac,
          ip: ip
        })
    
    
      });
    
    
      const newData = await response.json();
      if (response.ok) {
        
        setLoading(false)
         setIsLoading(false)
        setVoucherLoad(false)

      
         setVoucherName(newData.username)
      setExpiration(newData.expiration)
      setVoucherPackage(newData.package)
        //  setIsConnected(true)
         setConnected(true)
        toast.success('Connection Successful', {
          duration: 3000,
          position: 'top-right',
        });
        

      } else {
        setLoading(false)
        setVoucherError(newData.error)
        setShowVoucherError(true)
        setIsLoading(false)
        setVoucherLoad(false)
        toast.error('Connection failed', {
          duration: 3000,
          position: 'top-right',
        });
  
        toast.error(newData.error, {
          duration: 5000,
          position: 'top-right',
        });
        setStatus('error'); setMessage(newData.error||'Invalid voucher code.');
      }
    } catch (error) {
      setShowVoucherError(true)
      setLoading(false)
      setIsLoading(false)
      setVoucherLoad(false)
      setStatus('error'); setMessage('Network error. Try again.');
    }
   
  }


      const packageVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
      };

  const containerVariants = {
    hidden: { opacity: 0, x: '100vw' },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 50 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.1,
      textShadow: "0px 0px 8px rgb(255, 255, 255)",
      boxShadow: "0px 0px 8px rgb(0, 0, 0, 0.2)"
    }
  };







  const pollRef = useRef(null);
  // typing animation
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setTypedName(hotspotName.slice(0, ++i));
      if (i === hotspotName.length) clearInterval(t);
    }, 65);
    return () => clearInterval(t);
  }, [hotspotName]);

  useEffect(() => { setTimeout(() => setReady(true), 80); }, []);
  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // Fetch packages
  useEffect(() => {
    (async () => {
      try {
        setPkgLoading(true);
        setPackageLoaded(false)
        const res = await fetch('/api/allow_get_hotspot_packages', {
          headers: { 'X-Subdomain': subdomain }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.length) {
            // map colour palette by index
            const accents = ['#38bdf8','#a78bfa','#34d399','#fb923c','#f472b6','#facc15'];
            setPackages(data.map((p, i) => ({ ...p, accent: accents[i % accents.length] })));
            setPackageLoaded(true)
          }
        }
      } catch (_) {} finally { setPkgLoading(false); }
    })();
  }, []);





  const startPoll = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/receipt_number_status', {
          method: 'POST',
          headers: { 'Content-Type':'application/json', 'X-Subdomain':subdomain, 'X-CSRF-Token':getCsrf() },
          body: JSON.stringify({ mac, ip })
        });
        const data = await res.json();
        if (res.ok && data.connected) {
          clearInterval(pollRef.current);
          // setUsername(data.username || '');
          setConnPkg(data.package || '');
          setExpiry(data.expiration || '');
          setStatus('success');
          setMessage('Payment confirmed! Connecting you…');
          setTimeout(() => setConnected(true), 700);
          setLoadingPay(false);
           setStatus('success'); setMessage('Voucher accepted!');
        setTimeout(() => setConnected(true), 700);
        }
      } catch (_) {}
    }, 5000);
    setTimeout(() => {
      if (pollRef.current) clearInterval(pollRef.current);
      setStatus('error');
      setMessage('Timed out. Please check your M-Pesa SMS and try the receipt tab.');
      setLoadingPay(false);
    }, 120000);
  };






const handlePackagePay = async (e) => {
    e.preventDefault();
    if (!selectedPkg || !phoneNumber) return;
    setLoadingPay(true); setStatus(null);
  setError(false);
  setSuccess(false);
    setQueryStatus(null); 
  setQueryMessage(''); 

    try {
      const res = await fetch('/api/make_payment', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'X-Subdomain':subdomain, 'X-CSRF-Token':getCsrf() },
        body: JSON.stringify({ phone_number:phoneNumber, amount:selectedPkg.price, package:selectedPkg.name, ip, mac })
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('checkout_request_id', data.checkout_request_id);
        setStatus('processing');
        setMessage('STK push sent — enter your M-Pesa PIN on your phone to complete payment.');

 setSuccess(true);
      localStorage.setItem('checkout_request_id', data.checkout_request_id)
       setPhoneNumber('')
       setQueryStatus('processing');
      setQueryMessage('The transaction is still under processing. Please wait...');

      setStatus('processing');
        setMessage('STK push sent — enter your M-Pesa PIN on your phone to complete payment.');
setLoadingPay(false);

       startQueryStatus();
      } else {
        setStatus('error');
        setMessage(data.message || 'Payment failed. Please try again.');
        setLoadingPay(false);



        setError(true);
      setSeeError(true);
      setPhoneNumber('')
        setQueryStatus('error');
      setQueryMessage(data.message || 'Payment initiation failed');
      }
    } catch (_) {
      setStatus('error');
      setMessage('Network error. Check your connection and try again.');
      setLoadingPay(false);
    }
  };




  




  // ── M-Pesa receipt ────────────────────────────────────────────────────────
  const handleReceipt = async (e) => {
    e.preventDefault();
    if (!txCode.trim()) return;
    setTransactionLoad(true); setStatus('processing');
    setMessage('Verifying your M-Pesa transaction…');
    try {
      const res = await fetch('/api/login_with_receipt_number', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'X-Subdomain':subdomain, 'X-CSRF-Token':getCsrf() },
        body: JSON.stringify({ receipt_number:txCode.trim().toUpperCase(), mac, ip })
      });
      const data = await res.json();
      if (res.ok) {
        // setUsername(data.username||'');
           setConnPkg(data.package||''); setExpiry(data.expiration||'');
          setStatus('success'); setMessage('Transaction verified! Connecting…');
          // setTimeout(() => setConnected(true), 700);
          setTransactionLoad(false);

          setMessage('Transaction found — activating your session…');
          //  startPoll(); 
          startTransactionStatus()
      } else {
        setStatus('error'); setMessage(data.error||'Transaction not found. Check the code and try again.');
        setTransactionLoad(false);
      }
    } catch (_) {
      setStatus('error'); setMessage('Network error. Try again.');
      setTransactionLoad(false)
      //  setLoading(false);
    }
  };

  const TABS = [
    { id:'packages', label:'Buy Package', icon:CreditCard },
    { id:'voucher',  label:'Voucher',     icon:Tag },
    { id:'mpesa',    label:'M-Pesa Code', icon:Receipt },
  ];


// useEffect(() => {
  
//   const fetchHotspotPackages = async() => {
//     try {
//       setPackageLoaded(false)
//       const response = await fetch('/api/allow_get_hotspot_packages', {
//         headers: {
//           'X-Subdomain': subdomain,
//         },
//       })
//       const newData = await response.json()
//       if (response.ok) {
//         // setPackages(newData)
//         setPackages(newData)
//         setPackageLoaded(true)
//       } else {
//          setPackageLoaded(true)
//         // toast.error('failed to fetch hotspot packages', {
//         //   duration: 7000,
//         //   position: "top-center",
//         // });
//       }
//     } catch (error) {
//        setPackageLoaded(true)
//       // toast.error('Something went wrong', {
//       //   duration: 7000,
//       //   position: "top-center",
//       // });
//       console.log(error)
//     }
//   }
//   fetchHotspotPackages()
// }, [subdomain]);  


if (success) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center 
      justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 50 }}
        className="bg-white p-8 rounded-lg shadow-lg text-center"
      >
        <MdOutlineWifi className="text-green-500 w-12 h-12 mx-auto mb-4" />
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900"
        >
          Connected!
        </motion.h2>
      </motion.div>
    </motion.div>
  );
}







if (loading) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 50 }}
        className="bg-white p-8 rounded-lg shadow-lg text-center"
      >
        <MdOutlineWifi className="text-yellow-500 w-12 h-12 mx-auto animate-pulse mb-4" />
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-gray-900"
        >
          Connecting...
        </motion.h2>
      </motion.div>
    </motion.div>
  );
}


  const reset = () => { setStatus(null); setMessage(''); setLoading(false); if (pollRef.current) clearInterval(pollRef.current); };
  const switchTab = (t) => { setTab(t); reset(); setPayStep('list'); setSelectedPkg(null); setPhoneNumber(''); };




  return (

    <>

{/*     
{enable_autologin ? (
  <MacRandomizationInstructions />
): null} */}

      <ConnectionStatus />

{/* < HotspotSMSInfo/> */}

{!templatesLoaded && (
  <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <RefreshCw className="w-12 h-12 animate-spin text-blue-500
         mx-auto mb-4" />
        <p className="text-gray-600">Loading hotspot page...</p>
      </div>
    </div>
)}


{/* Payment Status Modal */}
{queryStatus && (
  <div className="fixed inset-0 z-50 flex items-center justify-center
   bg-black/70 backdrop-blur-sm">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="relative max-w-md w-full mx-4"
    >
      {/* Modal Content */}
      <div className={`rounded-2xl shadow-2xl ${
        queryStatus === 'success' ? 'bg-gradient-to-br from-green-50 to-emerald-100' :
        queryStatus === 'processing' ? 'bg-gradient-to-br from-yellow-50 to-amber-100' :
        queryStatus === 'cancelled' ? 'bg-gradient-to-br from-orange-50 to-red-100' :
        queryStatus === 'no_response' ? 'bg-gradient-to-br from-blue-50 to-cyan-100' :
        queryStatus === 'invalid_initiator' ? 'bg-gradient-to-br from-red-50 to-pink-100' :
        'bg-gradient-to-br from-gray-50 to-slate-100'
      }`}>
        
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {queryStatus === 'processing' && (
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              )}
              {queryStatus === 'success' && (
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              )}
              {queryStatus === 'cancelled' && (
                <div className="p-2 bg-orange-100 rounded-full">
                  <XCircle className="w-6 h-6 text-orange-600" />
                </div>
              )}
              {queryStatus === 'no_response' && (
                <div className="p-2 bg-blue-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
              )}
              {queryStatus === 'invalid_initiator' && (
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              )}
              {queryStatus === 'error' && (
                <div className="p-2 bg-gray-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-gray-600" />
                </div>
              )}
              
              <h3 className="text-xl font-bold text-gray-900">
                {queryStatus === 'processing' && 'Payment Processing'}
                {queryStatus === 'success' && 'Payment Successful'}
                {queryStatus === 'cancelled' && 'Payment Cancelled'}
                {queryStatus === 'no_response' && 'No Response'}
                {queryStatus === 'invalid_initiator' && 'Invalid Information'}
                {queryStatus === 'error' && 'Payment Error'}
              </h3>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => {
                // For processing status, show confirmation before closing
                if (queryStatus === 'processing') {
                  if (window.confirm('Are you sure you want to stop checking payment status? You can check again later.')) {
                    if (stkQueryIntervalId) {
                      clearInterval(stkQueryIntervalId);
                      stkQueryIntervalId = null;
                    }
                    setQueryStatus(null);
                    setQueryMessage('');
                  }
                } else {
                  setQueryStatus(null);
                  setQueryMessage('');
                }
              }}
              className="p-2 hover:bg-gray-200/50 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Modal Body */}
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 mb-4">
              {queryMessage}
            </p>
            
            {/* Additional info based on status */}
            {queryStatus === 'processing' && (
              <div className="mt-4">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                </div>
                <p className="text-sm text-gray-600">
                  We're checking your payment status .....
                </p>
              </div>
            )}
            
            {queryStatus === 'success' && (
              <div className="mt-4">
                <div className="flex items-center justify-center text-green-600 mb-4">
                  <CheckCircle className="w-12 h-12" />
                </div>
                <p className="text-sm text-gray-600">
                  You should be connected to the WiFi automatically.
                </p>
              </div>
            )}
            
            {queryStatus === 'no_response' && (
              <div className="mt-4">
                <div className="flex items-center justify-center text-blue-600 mb-4">
                  <AlertCircle className="w-12 h-12" />
                </div>
                <p className="text-sm text-gray-600">
                  Please check your phone for the M-Pesa prompt.
                </p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {queryStatus === 'processing' && (
              <>
                <button
                  onClick={() => {
                    if (stkQueryIntervalId) {
                      clearInterval(stkQueryIntervalId);
                      stkQueryIntervalId = null;
                    }
                    setQueryStatus(null);
                    setQueryMessage('');
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Stop Checking
                </button>
                <button
                  onClick={() => {
                    // Refresh the status check
                    if (stkQueryIntervalId) {
                      clearInterval(stkQueryIntervalId);
                      stkQueryIntervalId = null;
                    }
                    startQueryStatus();
                  }}
                  className="flex-1 py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Check Now
                </button>
              </>
            )}
            
            {(queryStatus === 'success' || queryStatus === 'cancelled' || 
              queryStatus === 'no_response' || queryStatus === 'invalid_initiator' || 
              
              queryStatus === 'error') && (
              <>
                <button
                  onClick={() => {
                    setQueryStatus(null);
                    setQueryMessage('');
                  }}
                  className="flex-1 py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Close
                </button>
                
                {(queryStatus === 'cancelled' || queryStatus === 'error' || 
                  queryStatus === 'no_response' || queryStatus === 'invalid_initiator') && (
                  <button
                    onClick={() => {
                      setQueryStatus(null);
                      setQueryMessage('');
                      // Navigate back to packages
                      setSeeForm(false);
                      setSeePackages(true);
                    }}
                    className="flex-1 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </>
            )}
          </div>
          
          {/* Status Info */}
          <div className="mt-6 pt-4 border-t border-gray-200/50">
            <div className="flex items-center justify-center text-sm text-gray-500">
              {queryStatus === 'processing' && (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>Checking...</span>
                </>
              )}
              {queryStatus === 'success' && (
                <span>✅ Payment confirmed and processed</span>
              )}
              {queryStatus === 'cancelled' && (
                <span>❌ Transaction was cancelled</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
)}



<HotspotAdOverlay
  subdomain={subdomain}
  onAdComplete={handleAdComplete}
/>




{attractive && (
  <>
 <Styles />

      <AnimatePresence>
        {connected && <ConnectedScreen username={voucherName} 
         packageName={voucherPackage}
         expiration={expiry} />}
      </AnimatePresence>

      <div className="min-h-screen relative flex flex-col items-center
       justify-center px-4 py-12 overflow-hidden"
        style={{ background:'#020617', fontFamily:"'Plus Jakarta Sans',sans-serif" }}>

        {/* Background blobs */}
        <div className="drift1 absolute -top-32 -left-24 w-[480px]
         h-[480px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(56,189,248,.09) 0%,transparent 65%)' }} />
        <div className="drift2 absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(99,102,241,.09) 0%,transparent 65%)' }} />
        <div className="drift3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(circle,rgba(52,211,153,.05) 0%,transparent 65%)' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:'radial-gradient(rgba(148,163,184,.07) 1px,transparent 1px)', backgroundSize:'28px 28px' }} />

        {/* Ticker */}
        <div className="absolute top-0 inset-x-0 overflow-hidden border-b"
          style={{ background:'rgba(15,23,42,.85)', borderColor:'rgba(148,163,184,.06)', backdropFilter:'blur(8px)', zIndex:10 }}>
          <div className="py-2 flex">
            <div className="ticker-inner flex whitespace-nowrap">
              {[0,1].map(k => (
                <span key={k} className="mono text-xs mr-24" style={{ color:'#334155' }}>
                  📶 {hotspotName} &nbsp;·&nbsp; Fast &amp; Secure WiFi &nbsp;·&nbsp; Buy a package, use a voucher, or enter your M-Pesa code &nbsp;·&nbsp; Support: {hotspotPhoneNumber} &nbsp;·&nbsp; Enjoy browsing! 🌐 &nbsp;·&nbsp;
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity:0, y:32 }}
          animate={{ opacity:ready?1:0, y:ready?0:32 }}
          transition={{ duration:.55, ease:[.16,1,.3,1] }}
          className="relative w-full max-w-md mt-10"
        >
          <div className="card-glass rounded-3xl border overflow-hidden"
            style={{ borderColor:'rgba(148,163,184,.1)', boxShadow:'0 0 40px rgba(56,189,248,.06)' }}>

            {/* Header */}
            <div className="px-7 pt-8 pb-6 text-center border-b"
              style={{ borderColor:'rgba(148,163,184,.07)' }}>
              <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl"
                  style={{ background:'rgba(56,189,248,.08)', border:'1px solid rgba(56,189,248,.15)' }} />
                <Wifi size={26} className="relative" style={{ color:'#38bdf8' }} />
                <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full"
                  style={{ background:'radial-gradient(circle,rgba(56,189,248,.7),transparent)' }} />
              </div>
              <div className="h-8 flex items-center justify-center mb-1">
                <h1 className="text-2xl font-bold text-white">
                  {typedName || hotspotName}<span className="cursor-blink" style={{ color:'#38bdf8' }}>|</span> 
                </h1>
              </div>
              <p className="text-sm" style={{ color:'#475569' }}>Connect to the internet</p>
              <div className="flex items-center justify-center gap-5 mt-3">
                {[{I:Shield,l:'Secure'},{I:Lock,l:'Private'},{I:Globe,l:'Fast'}].map(({I,l})=>(
                  <div key={l} className="flex items-center gap-1.5">
                    <I size={11} style={{ color:'#38bdf8' }} />
                    <span className="text-xs" style={{ color:'#475569' }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab bar */}
            <div className="px-5 pt-5">
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl"
                style={{ background:'rgba(15,23,42,.5)', border:'1px solid rgba(148,163,184,.07)' }}>
                {TABS.map(t => {
                  const Icon = t.icon;
                  const active = tab === t.id;
                  return (
                    <button key={t.id} onClick={() => switchTab(t.id)}
                      className={`tab-pill flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-semibold border
                        ${active ? 'border-sky-400/30 text-sky-300' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                      style={{ background: active ? 'rgba(56,189,248,.1)' : 'transparent' }}
                    >
                      <Icon size={14} />
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab content */}
            <div className="px-5 pt-5 pb-7">
              <AnimatePresence mode="wait">

                {/* ══════════════════════ PACKAGES TAB ══════════════════════ */}
                {tab === 'packages' && (
                  <motion.div key="packages"
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:12 }}
                    transition={{ duration:.2 }}
                  >
                    {/* LIST step */}
                    {payStep === 'list' && (
                      <div className="space-y-3">

                        {/* Info strip */}
                        <div className="flex items-start gap-3 p-3.5 rounded-2xl mb-1"
                          style={{ background:'rgba(56,189,248,.05)', border:'1px solid rgba(56,189,248,.1)' }}>
                          <CreditCard size={15} className="shrink-0 mt-0.5" style={{ color:'#38bdf8' }} />
                          <div>
                            <p className="text-sm font-semibold text-slate-200 mb-0.5">Choose a plan</p>
                            <p className="text-xs leading-relaxed" style={{ color:'#64748b' }}>
                              Select a package below and pay instantly via M-Pesa STK push.
                            </p>
                          </div>
                        </div>

                        {/* Loading skeleton */}
                        {pkgLoading && (
                          <div className="space-y-3">
                            {[1,2,3].map(i => (
                              <div key={i} className="h-20 rounded-2xl animate-pulse"
                                style={{ background:'rgba(30,41,59,.4)' }} />
                            ))}
                          </div>
                        )}

                        {/* Package cards */}
                        {!pkgLoading && packages.map((pkg, i) => (
                          <motion.div key={pkg.id}
                            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                            transition={{ delay: i * 0.07 }}>
                            <PkgCard pkg={pkg} selected={selectedPkg?.id === pkg.id}
                              onClick={() => setSelectedPkg(prev => prev?.id === pkg.id ? null : pkg)} />
                          </motion.div>
                        ))}

                        {/* CTA */}
                        <AnimatePresence>
                          {selectedPkg && (
                            <motion.button
                              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                              onClick={() => setPayStep('pay')}
                              className="w-full py-4 rounded-2xl flex 
                              items-center justify-center gap-2 font-bold text-sm text-white mt-1"
                              style={{ background:`linear-gradient(135deg,${selectedPkg.accent},${selectedPkg.accent}99)` }}
                            >
                              Pay Now — Ksh {selectedPkg.price} <ArrowRight size={15} />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    {/* PAY step */}
                    {payStep === 'pay' && selectedPkg && (
                      <motion.div key="pay"
                        initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }}
                        transition={{ duration:.2 }}
                        className="space-y-4"
                      >
                        {/* Back + package summary */}
                        <button onClick={() => { setPayStep('list'); reset(); }}
                          className="flex items-center gap-1.5 text-xs 
                          font-semibold mb-1 transition-colors"
                          style={{ color:'#64748b' }}
                          onMouseEnter={e=>e.currentTarget.style.color='#94a3b8'}
                          onMouseLeave={e=>e.currentTarget.style.color='#64748b'}
                        >
                          <ArrowLeft size={13} /> Back to packages
                        </button>

                        {/* Selected package recap */}
                        <div className="flex items-center gap-3 p-4 
                        rounded-2xl border"
                          style={{ background:`${selectedPkg.accent}0a`, borderColor:`${selectedPkg.accent}25` }}>
                          <div className="w-11 h-11 rounded-xl flex
                           items-center justify-center shrink-0"
                            style={{ background:`${selectedPkg.accent}18` }}>
                            <Wifi size={18} style={{ color:selectedPkg.accent }} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-slate-200">{selectedPkg.name}</p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="flex items-center gap-1 text-xs" style={{ color:'#64748b' }}>
                                <Clock size={9}/> {selectedPkg.valid}
                              </span>
                              <span className="flex items-center gap-1 text-xs" style={{ color:'#64748b' }}>
                                <Zap size={9}/> {selectedPkg.speed}
                              </span>
                            </div>
                          </div>
                          <p className="text-lg font-bold mono text-slate-100 shrink-0">
                            <span className="text-xs font-normal mr-0.5" style={{ color:'#64748b' }}>Ksh</span>
                            {selectedPkg.price}
                          </p>
                        </div>

                        {/* Phone input */}
                        <form onSubmit={handlePackagePay} className="space-y-4">
                          <div>
                            <label className="block text-xs font-semibold 
                            uppercase tracking-wider mb-2"
                              style={{ color:'#64748b' }}>M-Pesa Phone Number</label>
                            <div className="relative">
                              <Phone size={14} className="absolute
                               left-4 top-1/2 -translate-y-1/2"
                                style={{ color:'#475569' }} />
                              <input
                                type="tel"
                                value={phoneNumber}
                                onChange={e => setPhoneNumber(e.target.value)}
                                placeholder="07XX XXX XXX"
                                required
                                className="input-base w-full pl-11 pr-4
                                 py-3.5 rounded-xl text-sm mono tracking-wide"
                              />
                            </div>
                            <p className="text-xs mt-1.5" style={{ color:'#334155' }}>
                              You'll receive a push prompt on this number
                            </p>
                          </div>

                          <AnimatePresence>
                            {status && (
                              <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}>
                                <StatusBanner status={status} message={message} onDismiss={status!=='processing'?reset:undefined} />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {(!status || status === 'error' || status === 'cancelled') && (
                            <button type="submit" disabled={loadingPay || !phoneNumber}
                              className="gradient-btn w-full py-4 rounded-2xl text-white font-bold text-sm 
                              flex items-center justify-center gap-2">
                              {loadingPay
                                ? <><RefreshCw size={15} className="animate-spin"/> Sending STK push…</>
                                : <>Pay Ksh {selectedPkg.price} via M-Pesa <ArrowRight size={15}/></>}
                            </button>
                          )}
                        </form>

                        {/* M-Pesa notice */}
                        <div className="flex items-start gap-2.5 p-3.5 rounded-2xl"
                          style={{ background:'rgba(30,41,59,.4)', border:'1px solid rgba(148,163,184,.07)' }}>
                          <Smartphone size={14} className="shrink-0 mt-0.5" style={{ color:'#64748b' }} />
                          <p className="text-xs leading-relaxed" style={{ color:'#64748b' }}>
                            After tapping Pay, you'll get an M-Pesa prompt on your phone. Enter your PIN to complete. Internet activates automatically within seconds.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* ══════════════════════ VOUCHER TAB ═══════════════════════ */}
                {tab === 'voucher' && (
                  <motion.div key="voucher"
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} 
                    exit={{ opacity:0, x:12 }}
                    transition={{ duration:.2 }}
                  >
                    <div className="flex items-start gap-3 p-4 rounded-2xl mb-5"
                      style={{ background:'rgba(167,139,250,.06)', border:'1px solid rgba(167,139,250,.15)' }}>
                      <Tag size={15} className="shrink-0 mt-0.5" style={{ color:'#a78bfa' }} />
                      <div>
                        <p className="text-sm font-semibold text-slate-200 mb-0.5">Have a voucher?</p>
                        <p className="text-xs leading-relaxed" style={{ color:'#64748b' }}>
                          Enter your 8-character prepaid voucher code. Codes are not case-sensitive.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={loginWithVoucher} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                          style={{ color:'#64748b' }}>Voucher Code</label>
                        <input
                          type="text"
                          // value={voucher}
                          // onChange={e => setVoucher(e.target.value.toUpperCase())}
                          placeholder="e.g.  A B C 1 2 3 4 5"

onChange={(e) => handleChangeHotspotVoucher(e)}
value={vouchers}
  name="vouchers"
                          // maxLength={8}
                          // required
                          className="input-base w-full text-center py-4 text-xl font-bold tracking-[0.4em] rounded-xl mono"
                        />
                        {/* Progress dots */}
                        <div className="flex gap-1.5 mt-2.5 justify-center">
                          {Array.from({length:8}).map((_,i) => (
                            <div key={i} className="h-1 flex-1 rounded-full transition-all duration-200"
                              style={{ background: voucher.length > i ? '#a78bfa' : 'rgba(148,163,184,.15)' }} />
                          ))}
                        </div>
                        <p className="text-xs text-center mt-1.5" style={{ color:'#334155' }}>
                          {voucher.length} / 8
                        </p>
                      </div>

                      <AnimatePresence>
                        {status && (
                          <motion.div initial={{ opacity:0, height:0 }}
                           animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}>
                            <StatusBanner status={status} message={message} onDismiss={reset} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button type="submit" disabled={voucherLoad || voucher.length < 4}
                        className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
                        style={{ background:'linear-gradient(135deg,#7c3aed,#a78bfa)', opacity: voucherLoad||voucher.length<4 ? .45 : 1, cursor: voucherLoad||voucher.length<4 ? 'not-allowed':'pointer' }}>
                        {voucherLoad
                          ? <><RefreshCw size={15} className="animate-spin"/> Connecting…</>
                          : <>Connect with Voucher <ArrowRight size={15}/></>}
                      </button>
                    </form>

                    <div className="mt-5 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color:'#334155' }}>
                        Where to get a voucher
                      </p>
                      {[
                        'Purchase from the WiFi operator or agent',
                        'Received via SMS after M-Pesa payment',
                        'Ask at the front desk / reception',
                      ].map(tip => (
                        <div key={tip} className="flex items-start gap-2">
                          <ChevronRight size={12} className="shrink-0 mt-0.5" style={{ color:'#a78bfa' }} />
                          <p className="text-xs" style={{ color:'#475569' }}>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ══════════════════════ MPESA CODE TAB ════════════════════ */}
                {tab === 'mpesa' && (
                  <motion.div key="mpesa"
                    initial={{ opacity:0, x:12 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-12 }}
                    transition={{ duration:.2 }}
                  >
                    <div className="flex items-start gap-3 p-4 rounded-2xl mb-5"
                      style={{ background:'rgba(52,211,153,.05)', border:'1px solid rgba(52,211,153,.15)' }}>
                      <Smartphone size={15} className="shrink-0 mt-0.5" style={{ color:'#34d399' }} />
                      <div>
                        <p className="text-sm font-semibold text-slate-200 mb-0.5">Already paid via M-Pesa?</p>
                        <p className="text-xs leading-relaxed" style={{ color:'#64748b' }}>
                          Enter the transaction code from your M-Pesa confirmation SMS to connect without paying again.
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleReceipt} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-2"
                          style={{ color:'#64748b' }}>M-Pesa Transaction Code</label>
                        <div className="relative">
                          <Receipt size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:'#475569' }} />
                          <input
                            type="text"
                            value={txCode}
                            onChange={e => setTxCode(e.target.value.toUpperCase())}
                            placeholder="e.g.  QHJ1234ABC"
                            required
                            className="input-base w-full pl-11 pr-4 py-3.5 rounded-xl text-sm mono tracking-widest"
                          />
                        </div>
                        {/* Format example */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex gap-0.5">
                            {['Q','H','J','1','2','3','4','A','B','C'].map((c,i) => (
                              <div key={i} className="w-5 h-5 rounded flex items-center justify-center mono"
                                style={{
                                  fontSize:'9px', fontWeight:'bold',
                                  background: i<3?'rgba(52,211,153,.12)': i<7?'rgba(56,189,248,.1)':'rgba(167,139,250,.12)',
                                  color:       i<3?'#34d399':           i<7?'#38bdf8':           '#a78bfa',
                                }}>
                                {c}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs" 
                          style={{ color:'#334155' }}>example format</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {status && (
                          <motion.div initial={{ opacity:0, height:0 }} 
                          animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}>
                            <StatusBanner status={status} message={message} 
                            onDismiss={status!=='processing'?reset:undefined} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button type="submit" disabled={transactionLoad || txCode.length < 6}
                        className="w-full py-4 rounded-2xl font-bold text-sm text-black flex items-center justify-center gap-2 transition-all"
                        style={{ background:'linear-gradient(135deg,#34d399,#10b981)', opacity:transactionLoad||txCode.length<6?.45:1, cursor:transactionLoad||txCode.length<6?'not-allowed':'pointer' }}>
                        {transactionLoad
                          ? <><RefreshCw size={15} className="animate-spin text-black"/> Verifying…</>
                          : <>Verify & Connect <ArrowRight size={15}/></>}
                      </button>
                    </form>

                    {/* Steps */}
                    <div className="mt-5 space-y-2.5">
                      <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color:'#334155' }}>
                        How to find your code
                      </p>
                      {[
                        'Open your M-Pesa messages',
                        'Find the payment confirmation SMS',
                        'Copy the code at the top (e.g. QHJ1234ABC)',
                      ].map((s, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mono"
                            style={{ background:'rgba(52,211,153,.12)', color:'#34d399', border:'1px solid rgba(52,211,153,.2)' }}>
                            {i+1}
                          </div>
                          <p className="text-xs" style={{ color:'#475569' }}>{s}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>
          </div>

          {/* Status pill */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:ready?1:0 }} transition={{ delay:.4 }}
            className="flex items-center justify-between mt-3 px-5 py-3 rounded-2xl"
            style={{ background:'rgba(15,23,42,.6)', border:'1px solid rgba(148,163,184,.07)', backdropFilter:'blur(12px)' }}>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <span className="text-xs mono" style={{ color:'#334155' }}>Not connected</span>
            </div>
            {ip && <span className="text-xs mono" style={{ color:'#334155' }}>IP: {ip}</span>}
          </motion.div>

          {/* Footer */}
          <motion.div initial={{ opacity:0 }} animate={{ opacity:ready?1:0 }}
           transition={{ delay:.5 }}
            className="text-center mt-5 space-y-1.5">
            <p className="text-xs" style={{ color:'#334155' }}>Need help?</p>
            <a href={`tel:${hotspotPhoneNumber}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold"
              style={{ color:'#38bdf8' }}>
              <Phone size={11}/> {hotspotPhoneNumber}
            </a>
          </motion.div>
        </motion.div>
      </div>
  </>
)}


{premium && (
  
  <>

 <div className="min-h-screen bg-gradient-to-br
  from-gray-900 to-black text-white">
  
      
      {/* Main Container */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8"
        >
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
              <Wifi className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{hotspotName}</h1>
              <p className="text-gray-400">Fast, Secure, Reliable Internet</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="w-4 h-4 text-green-400" />
              <span>🔒 Secure Connection</span>
            </div>
            
          </div>
        </motion.header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Device Info & Instructions */}
          <div className="lg:col-span-1 space-y-6">
            {/* Device Info Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Device Information
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3
                 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">MAC Address</span>
                  <code className="font-mono text-sm">{mac || 'Not Available'}</code>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">IP Address</span>
                  <code className="font-mono text-sm">{ip || 'Not Available'}</code>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-400">Username</span>
                  <span className="font-medium">{username || 'Guest'}</span>
                </div>
              </div>
            </motion.div>

            {/* Instructions Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                How to Connect
              </h3>
              
              <ol className="space-y-3">
                {[
                  "Select a WiFi package below",
                  "Enter your phone number",
                  "Complete payment via M-Pesa",
                  "Automatically connect to WiFi"
                ].map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-sm mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              
              <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-800/50">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-blue-400 mr-2" />
                  <span className="text-sm">
                    <strong>Tip:</strong> Disable mac randomization to automatically reconnect
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Support Card */}
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
            >
              <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors">
                  📞 Call Support: {hotspotPhoneNumber}
                </button>
                {/* <button className="w-full text-left p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors">
                  💬 Live Chat Support
                </button> */}
                <button className="w-full text-left p-3 bg-gray-900/50 hover:bg-gray-800 rounded-lg transition-colors">
                  📧 Email: {hotspotEmail}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2">
            {/* Tab Navigation */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex flex-wrap justify-center gap-2 sm:gap-3"
            >
              <button
                onClick={() => setActiveTab('packages')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'packages'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Packages
                </span>
              </button>
              
              <button
                onClick={() => setActiveTab('voucher')}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeTab === 'voucher'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
              >
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Voucher Code
                </span>
              </button>




              <button
      onClick={() => setActiveTab('receipt')}
      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all text-sm sm:text-base ${
        activeTab === 'receipt'
          ? 'bg-purple-500'
          : 'bg-gray-800 hover:bg-gray-700'
      }`}
    >
      <span className="flex items-center text-white">
        <CiReceipt className="w-4 h-4 mr-2 text-white" />
        Receipt
      </span>
    </button>
            </motion.div>




   {activeTab === 'receipt' && (
                <div className='flex justify-center p-2'>
                  
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full
                   mx-4 shadow-2xl">
                    
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            {authType === 'login' ? (
              <CiReceipt className="w-6 h-6 text-yellow-600" />
            ) : (
              <FaUserPlus className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <div>
          <h2 className="text-2xl font-bold text-gray-900">
            M-PESA Receipt Number
          </h2>

          <h3> 
            if you've already paid but not connected , enter your receipt
            number to connect or you can also login with the receipt
             number if not a voucher
          </h3>
          </div>
        </div>
        
      </div>

     

      {/* Auth form */}
      <form onSubmit={loginWithReceiptNumber}>
        {/* Username field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
          Receipt Number
          </label>
          <div className="relative">
            <div className="absolute justify-center left-0 pl-3
            flex items-center pointer-events-none">
              <CiReceipt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={receipt_number}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className="pl-10 w-full p-3 border
               border-gray-300 rounded-lg text-black
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. UBLCH7C12C"
              required
            />
          </div>
        </div>

      
        {/* Password field */}
       

       

        {/* Error message */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{authError}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={authLoading}
          className="w-full py-3 
          bg-gradient-to-r from-blue-500 to-purple-500
           text-white font-bold rounded-lg
            hover:opacity-90 transition-opacity disabled:opacity-50 
            disabled:cursor-not-allowed"
        >
          {authLoading ? (
            <span className="flex items-center justify-center">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              {authType === 'login' ? 'Logging in...' : 'Logging In...'}
            </span>
          ) : (
            <span className="flex items-center justify-center">
              {authType === 'login' ? 'Login to Hotspot' : 'Logging In...'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          )}
        </button>
      </form>

     

    </div>
    </div>
              )}


            {/* Packages Tab */}
            {activeTab === 'packages' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Success Message */}
                {successMessage && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-4 bg-gradient-to-r from-green-500/20
                     to-emerald-500/20 border border-green-500/30 
                     rounded-xl"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                      <span>{successMessage}</span>
                    </div>
                  </motion.div>
                )}

              
                  
{!packageLoaded && (
  <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <RefreshCw className="w-12 h-12 animate-spin text-blue-500
         mx-auto mb-4" />
        <p className="text-gray-600">Loading hotspot package...</p>
      </div>
    </div>
)}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {packages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePackageSelect(pkg)}
                      className={`${pkg.color} rounded-2xl p-6 cursor-pointer transition-all hover:shadow-2xl`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-2xl font-bold">{pkg.name}</h3>
                          <p className="text-white/80">High-Speed Internet</p>
                        </div>
                        <Zap className="w-8 h-8 text-white/50" />
                      </div>
                      
                      <div className="mb-6">
                        <div className="text-3xl font-bold mb-1">Ksh {pkg.price}</div>
                        <div className="text-sm opacity-80">
                          {/* {pkg.valid >= 86400
                            ? `${pkg.valid / 86400} Days`
                            : pkg.duration >= 3600
                            ? `${pkg.duration / 3600} Hours`
                            : `${pkg.duration / 60} Minutes`} */}
                            {pkg.valid}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4" />
                          <span className="text-sm">{pkg.upload_speed || 'Unlimited'}</span>
                        </div>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </motion.div>
                  ))}
                </div>

               

               
              </motion.div>
            )}




 {activeTab === 'payment' && (
                  <>
 {selectedPackage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-xl font-bold">Selected Package</h3>
                        <p className="text-gray-400">{selectedPackage.name} • {selectedPackage.upload_speed || 'Unlimited'}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPackage(null);
                          setActiveTab('packages');
                        }}
                        className="p-2 hover:bg-gray-700 rounded-lg"
                      >
                        <X className="w-5 h-5" />
                      </button> 
                    </div>
                    
                    <form onSubmit={makeHotspotPayment}>
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                          Phone Number (M-Pesa)
                        </label>
                        <div className="flex">
                          {/* <div className="flex-shrink-0 px-4 py-3
                           bg-gray-900 border border-r-0 border-gray-700
                            rounded-l-lg">
                            +254
                          </div> */}
                          <input
                            type="tel"
                            // value={phoneNumber}
                            // onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            value={phoneNumber}
onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="07XX XXX XXX"
                            className="flex-grow p-3 bg-gray-900 border border-gray-700 rounded-r-lg focus:outline-none focus:border-blue-500"
                            // maxLength="9"
                          />
                        </div>
                      </div>
                      
                      <div className="mb-6 p-4 bg-gray-900/50 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span>Package</span>
                          <span className="font-semibold">{selectedPackage.name}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span>Duration</span>
                          <span>
                            {/* {selectedPackage.duration >= 86400
                              ? `${selectedPackage.duration / 86400} Days`
                              : selectedPackage.duration >= 3600
                              ? `${selectedPackage.duration / 3600} Hours`
                              : `${selectedPackage.duration / 60} Minutes`} */}
                              {selectedPackage.valid}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Speed</span>
                          <span>{selectedPackage.upload_speed || 'Unlimited'}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <div className="text-2xl font-bold">Ksh {selectedPackage.price}</div>
                          <div className="text-sm text-gray-400">Total Amount</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <img src="/mpesa-logo.png" alt="M-Pesa" className="h-8" />
                          <span className="text-sm">Payment Method</span>
                        </div>
                      </div>
                        {/* Error Message */}

  {isloading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center text-white flex items-center"
        >
          <SmartphoneIcon className="mr-2" />
          Please wait while we initiate your payment.....
          You will be asked for M-Pesa PIN on your phone.........
        </motion.div>
      )}

             {issuccess && (
        <motion.div
        onClick={() => setSuccess(false)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center text-green-600 flex
          cursor-pointer
          items-center"
        >
          <CheckCircleIcon className="mr-2" />
          Payment initiated successfully! Enter Your Mpesa Pin To Complete The Transaction.

        </motion.div>
      )}

{seeError && (
  <>
{error && (
        <motion.div
        onClick={() => setSeeError(false)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center text-red-600
          cursor-pointer
          flex items-center mb-3"
        >
          <ErrorIcon className="mr-2" />
          Something went wrong. Please try again.
        </motion.div>
      )}

  </>
)}



                {/* {error && (
                  <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-4 bg-gradient-to-r from-red-500/20
                     to-orange-500/20 border border-red-500/30 rounded-xl mb-3
                     cursor-pointer
                     "
                  >
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                      <span>{error}</span>
                    </div>
                  </motion.div>
                )} */}


                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <span className="flex items-center justify-center">
                            <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                            Processing Payment...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            Pay Now
                            <ArrowRight className="w-5 h-5 ml-2" />
                          </span>
                        )}
                      </button>
                      
                      <p className="text-sm text-gray-400 text-center mt-4">
                        You will receive an M-Pesa prompt on your phone
                      </p>
                    </form>
                  </motion.div>
                )}
                  </>
                )}



            {/* Voucher Tab */}
            {activeTab === 'voucher' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Enter Voucher Code</h3>
                  <p className="text-gray-400">Redeem your prepaid voucher code</p>
                </div>
                
                <form onSubmit={loginWithVoucher}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                      Voucher Code
                    </label>
                    <input
                     onChange={(e) => handleChangeHotspotVoucher(e)}
            value={vouchers}
              name="vouchers"
                      placeholder="Enter voucher code"
                      className="w-full p-4 bg-gray-900 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 text-center font-mono text-xl tracking-widest"
                      maxLength="8"
                    />
                  </div>
                  
                  {showVoucherError && (
                    <div
                    onClick={() => setShowVoucherError(false)}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl cursor-pointer">
                      <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                        <span>{voucherError}</span>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoading || !vouchers}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                        Validating Voucher...
                      </span>
                    ) : (
                      'Connect with Voucher'
                    )}
                  </button>
                </form>
                
                <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    About Vouchers
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Vouchers are case-insensitive</li>
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400 text-sm"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-2">
                <WifiOff className="w-4 h-4" />
                <span>Hotspot v2.0 • Terms & Conditions • Privacy Policy</span>
              </div>
            </div>
            <div>
              © {new Date().getFullYear()} Premium WiFi Hotspot. All rights reserved.
            </div>
          </div>
        </motion.footer>
      </div>
    </div>
  </>
)}




{pepea ? (
  <>

<Toaster />
{/* <MacRandomizationInstructions /> */}
  {seePackages ? (
    <div>
<section className='bg-yellow-300 flex  flex-col justify-center'>
    


<div>
    <p className='text-center text-xl'>{hotspotName} </p>
    <FaWifi className='text-yellow-500 w-[55px] h-[55px] mx-auto mb-4' />
    <p className='text-center text-xl'>WIFI</p>
    <p className='text-center'>IS AVAILABLE NOW</p>
</div>


<div className='flex flex-row gap-2 items-center justify-center'>
     <div className="grid place-content-center bg-emerald-950 px-4 py-2 text-yellow-50">
      <h1 className="max-w-2xl text-center text-xl leading-snug">
        Wacha Stress Za Bundles Kuisha Jisort Na {" "}
        <span className="relative">
          {hotspotName}
          <svg
            viewBox="0 0 286 73"
            fill="none"
            className="absolute -left-2 -right-2 -top-2 bottom-0 translate-y-1"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              transition={{
                duration: 1.25,
                ease: "easeInOut",
              }}
              d="M142.293 1C106.854 16.8908 6.08202 7.17705 1.23654 43.3756C-2.10604 68.3466 29.5633 73.2652 122.688 71.7518C215.814 70.2384 316.298 70.689 275.761 38.0785C230.14 1.37835 97.0503 24.4575 52.9384 1"
              stroke="#FACC15"
              strokeWidth="3"
            />
          </svg>
        </span>{" "}
      </h1>
    </div>
</div>


<div className='flex items-center justify-center mt-4 px-2'>
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="flex flex-wrap justify-center gap-2 sm:gap-3"
  >
    <button
      onClick={() => setActiveTabPremium('packages')}
      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium 
        transition-all text-sm sm:text-base ${
        activeTab === 'packages'
          ? 'bg-amber-500'
          : 'bg-black hover:bg-gray-700'
      }`}
    >
      <span className="flex items-center text-white">
        <CreditCard className="w-4 h-4 mr-2 text-white" />
        Packages
      </span>
    </button>

    <button
      onClick={() => setActiveTabPremium('receipt')}
      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all text-sm sm:text-base ${
        activeTab === 'receipt'
          ? 'bg-amber-500'
          : 'bg-gray-800 hover:bg-gray-700'
      }`}
    >
      <span className="flex items-center text-white">
        <CiReceipt className="w-4 h-4 mr-2 text-white" />
        Receipt
      </span>
    </button>

   
  </motion.div>
</div>




                       {activeTabPremium === 'receipt' && (
                <div className='flex justify-center p-2'>
                  
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full
                   mx-4 shadow-2xl">
                    
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            {authType === 'login' ? (
              <CiReceipt className="w-6 h-6 text-yellow-600" />
            ) : (
              <FaUserPlus className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <div>
          <h2 className="text-2xl font-bold text-gray-900">
            M-PESA Receipt Number
          </h2>

          <h3> 
            if you've already paid but not connected , enter your receipt
            number to connect or you can also login with the receipt
             number if not a voucher
          </h3>
          </div>
        </div>
        
      </div>

     

      {/* Auth form */}
      <form onSubmit={loginWithReceiptNumber}>
        {/* Username field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
          Receipt Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CiReceipt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={receipt_number}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. UBLCH7C12C"
              required
            />
          </div>
        </div>

      
        {/* Password field */}
       

       

        {/* Error message */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{authError}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={authLoading}
          className="w-full py-3 bg-yellow-600 text-white font-bold rounded-lg
            hover:opacity-90 transition-opacity disabled:opacity-50 
            disabled:cursor-not-allowed"
        >
          {authLoading ? (
            <span className="flex items-center justify-center">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              {authType === 'login' ? 'Logging in...' : 'Logging In...'}
            </span>
          ) : (
            <span className="flex items-center justify-center">
              {authType === 'login' ? 'Login to Hotspot' : 'Logging In...'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          )}
        </button>
      </form>

     

    </div>
    </div>
              )}








              {activeTabPremium === 'userandpassword' && (
                <div className='flex justify-center p-2'>
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full
                   mx-4 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            {authType === 'login' ? (
              <FaUser className="w-6 h-6 text-yellow-600" />
            ) : (
              <FaUserPlus className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            {authType === 'login' ? 'Login' : 'Create Account'}
          </h2>
        </div>
        
      </div>

      {/* Tab switcher */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => {
            setAuthType('login');
            setAuthError('');
          }}
          className={`flex-1 py-2 px-4 rounded-md text-center 
            font-medium transition-colors ${
            authType === 'login'
              ? 'bg-white shadow'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Login
        </button>
        
      </div>

      {/* Auth form */}
      <form onSubmit={authType === 'login' ? handleUserLogin : handleUserSignup}>
        {/* Username field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center
             pointer-events-none">
              <FaUser className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={username}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your username"
              required
            />
          </div>
        </div>

      
        {/* Password field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
             Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaKey className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
              required
            />
          </div>
        </div>

       

        {/* Error message */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{authError}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={authLoading}
          className="w-full py-3 bg-yellow-600 text-white font-bold rounded-lg
            hover:opacity-90 transition-opacity disabled:opacity-50 
            disabled:cursor-not-allowed"
        >
          {authLoading ? (
            <span className="flex items-center justify-center">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              {authType === 'login' ? 'Logging in...' : 'Creating account...'}
            </span>
          ) : (
            <span className="flex items-center justify-center">
              {authType === 'login' ? 'Login to Hotspot' : 'Create Account'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          )}
        </button>
      </form>

     

    </div>
    </div>
              )}


         
{!packageLoaded && (
  <div className="flex items-center justify-center ">
      <div className="text-center">
        <RefreshCw className="w-12 h-12 animate-spin text-blue-500
         mx-auto mb-4" />
        <p className="text-gray-600">Loading hotspot package...</p>
      </div>
    </div>
)}


<div className='flex flex-row gap-2 items-center justify-center mt-4'>
<div className='grid grid-cols-3 gap-3 px-4 py-2
 text-black rounded-lg'>
            {activeTabPremium === 'packages' && (
              <> 

{packages.map((pkg, index) => (
    <motion.div
      key={index}
      className="bg-white p-4 rounded-lg shadow-lg"
      variants={packageVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
      <p className="text-gray-600">Valid For {pkg.valid}</p>
      <p className="text-black font-bold mt-2"> Price: {pkg.price} bob</p>
      
<button 
  onClick={() => {


          setHotspotPackage(pkg.name)
          setPackageAmount(pkg.price)
          setSeePackages(false);
          setSeeForm(true);
          setSeeInstructions(false);
        }}
className='bg-yellow-300 text-white rounded-lg px-4 py-2 
font-bold flex gap-2'>
    <p>Buy Plan </p>
    <FaLongArrowAltRight />
</button>
      
    </motion.div>
  ))}
              </>
            )}

 
</div>
</div>


{showVoucherError ? (
 <div className="flex items-center p-4 mb-4 text-sm text-red-800
 cursor-pointer f
relative
 rounded-lg bg-red-50
  dark:bg-gray-800 dark:text-red-400" role="alert">
  <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" 
  fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 
    1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1
     1 0 0 1 0 2Z"/>
  </svg>
  <div className='flex' onClick={() => setShowVoucherError(false)}>
    <span className="font-bold text-lg"><span className='font-medium'>{voucherError || 'Voucher verification failed'}</span>
      </span>   
    <MdCancel className='text-black w-4 h-4 absolute right-0 '/>
  </div>
</div>
): null}




{activeTabPremium === 'packages' && (
<div className='flex flex-col gap-2 items-center justify-center mt-4'>
  <form onSubmit={loginWithVoucher}>
   <input
 onChange={(e) => handleChangeHotspotVoucher(e)}
            value={vouchers}
              name="vouchers"
              className="  bg-gray-100 rounded-lg p-4 focus:outline-none"
              placeholder="Enter your voucher code"
            />

              <div>
                <p>please login to use the hotspot</p>
              </div>
            <button className='bg-yellow-400 text-white rounded-lg px-4 py-2 font-bold flex gap-2'>
              <p>connect</p>
            </button>
            </form>

</div>
)}

</section>




      <section className='flex flex-row'>

<section className="bg-white shadow-lg rounded-xl p-6 max-w-md
 w-full border border-gray-100 ">

  <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
    How to Purchase
  </h3>
  
  <ul className="space-y-3">
    <li className="flex items-start">
      <span className="bg-blue-100 text-yellow-600 rounded-full p-1 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="text-gray-700">Tap the package you want to purchase</span>
    </li>
    
    <li className="flex items-start">
      <span className="bg-blue-100 text-yellow-600 rounded-full p-1 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="text-gray-700">Enter Your Phone Number</span>
    </li>
    
    <li className="flex items-start">
      <span className="bg-blue-100 text-yellow-600 rounded-full p-1 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="text-gray-700">Click <strong className="text-yellow-600">Connect Now</strong></span>
    </li>
    
    <li className="flex items-start">
      <span className="bg-blue-100 text-yellow-600 rounded-full p-1 mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      </span>
      <span className="text-gray-700">Enter your Mobile PIN in the prompt and wait a few seconds to complete the process</span>
    </li>
  </ul>

  <div className="mt-6 text-center">
    <p className="text-sm text-gray-500">
      Need help? <a href="#" className="text-yellow-600 hover:underline"><FaPhoneVolume /> 
      Call us at <strong className="text-yellow-600">{hotspotPhoneNumber}</strong></a>
    </p>
  </div>


</section>

</section>

    </div>
  ): null}
    




{seeForm ? (
<>
  
    <div className='bg-yellow-300 flex flex-col justify-center 
    h-screen
    items-center p-4 rounded-lg'>
      <form onSubmit={makeHotspotPayment}>
        <input
value={phoneNumber}
onChange={(e) => setPhoneNumber(e.target.value)}
              // type="password"
              className="  bg-gray-100 rounded-lg p-4 focus:outline-none"
              placeholder="Enter your phone number"
            />

              
            <button className='bg-yellow-400 mt-2 text-white rounded-lg px-4 py-2 font-bold
             flex gap-2'>
              <p>subscribe</p>
            </button>
            <FaLongArrowAltLeft className='w-7 h-7 cursor-pointer'
            onClick={() => {
                setSeeForm(false)
                setSeePackages(true)
            }}
            />
            </form>

   {isloading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center text-gray-700 flex items-center"
        >
          <SmartphoneIcon className="mr-2" />
          You will be prompted for M-Pesa PIN on your phone (STK).
        </motion.div>
      )}





             {issuccess && (
        <motion.div
        onClick={() => setSuccess(false)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center text-green-600 flex
          cursor-pointer
          items-center"
        >
          <CheckCircleIcon className="mr-2" />
          Payment initiated successfully! You will receive an M-PESA prompt.
        </motion.div>
      )}



{seeError && (
  <>
{error && (
        <motion.div
        onClick={() => setSeeError(false)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center text-red-600
          cursor-pointer
          flex items-center"
        >
          <ErrorIcon className="mr-2" />
          Something went wrong. Please try again.
        </motion.div>
      )}

  </>
)}

      
    </div>

{enabled ? (
<>
{seeAdd ? (
      <div 
  className="rounded-2xl flex flex-col justify-between
             fixed z-50 animate-slide-in-right
             backdrop-blur-lg shadow-2xl p-4
             mx-4 mb-4
             bottom-0 left-0 right-0
             sm:bottom-4 sm:left-auto sm:right-4 sm:mx-0
             sm:max-w-sm w-auto sm:w-80"
  style={{ 
    background: adData.backgroundColor,
    color: adData.textColor
  }}
>
  {/* Close Button */}
  <button 
    onClick={() => setSeeAdd(false)}  
    className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors z-10"
  >
    <X className="w-4 h-4" />
  </button>

  <div className="flex flex-col sm:flex-row gap-3">
    {/* Image Section */}
    {adData.imagePreview && (
      <div className="flex-shrink-0">
        <img
          src={adData.imagePreview}
          alt="Business preview"
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl"
        />
      </div>
    )}

    {/* Content Section */}
    <div className="flex-1 min-w-0">
      {/* Discount Badge */}
      {adData.discount && (
        <div className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold mb-2">
          <span>✨</span>
          {adData.discount}
        </div>
      )}

      {/* Title */}
      <h3 
        className="text-lg sm:text-xl font-bold mb-1 truncate"
        style={getTextStyle()}
        title={adData.title}
      >
        {adData.title || 'Business Name'}
      </h3>
      
      {/* Description */}
      <p 
        className="text-sm sm:text-base opacity-90 mb-2 line-clamp-2"
        style={getTextStyle()}
      >
        {adData.description || 'Business description...'}
      </p>

      {/* Business Info - Compact */}
      <div className="space-y-1 mb-2">
        {adData.businessName && (
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{adData.businessName}</span>
          </div>
        )}
        
        {adData.location.address && (
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{adData.location.address}</span>
          </div>
        )}
      </div>

      {/* Services Preview - Only show on larger screens */}
    {adData.services.some(s => s.trim() !== '') && (
      <div className="hidden sm:block mb-2">
        <div className="flex flex-wrap gap-1">
          {adData.services.filter(s => s.trim() !== '').slice(0, 2).map((service, index) => (
            <span key={index} className="bg-white/20 px-2 py-1 rounded text-xs">
              {service}
            </span>
          ))}
          {adData.services.filter(s => s.trim() !== '').length > 2 && (
            <span className="bg-white/20 px-2 py-1 rounded text-xs">
              +{adData.services.filter(s => s.trim() !== '').length - 2}
            </span>
          )}
        </div>
      </div>
    )}
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex flex-col sm:flex-row gap-2 mt-3">
    <button 
      className="bg-white text-gray-800 py-2 px-4 rounded-full font-bold hover:bg-gray-100
       transition-colors flex-1 text-sm sm:text-base"
      style={{ color: adData.backgroundColor.split(' ')[0] }}
    >
      {adData.ctaText}
    </button>
    
    {/* Secondary Actions - Show on larger screens */}
    <div className="hidden sm:flex gap-2">
      {/* <button className="bg-white/20 py-2 px-3 rounded-lg text-sm hover:bg-white/30 transition-colors flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        Directions
      </button> */}



      <button
      onClick={() => {
    
        window.location.href = `tel:${adData.contact.phone}`;
        TrackEvent({eventType: 'click', button_name: 'call'})

      }}
      
      className="bg-white/20 py-2 px-3 rounded-lg text-sm
       hover:bg-white/30 transition-colors flex items-center gap-1">
        <Phone className="w-3 h-3" />
       <TrackEvent eventType="click" button_name="Call">
  Call
</TrackEvent>
      </button>
    </div>

    {/* Mobile secondary actions */}
    <div className="flex sm:hidden gap-2">
      

      <button 
      
       onClick={() => {
    
        window.location.href = `tel:${adData.contact.phone}`;
        TrackEvent({eventType: 'click', button_name: 'call'})

      }}
      className="flex-1 bg-white/20 py-2 px-3 rounded-lg text-xs hover:bg-white/30 transition-colors">
        Call Now
      </button>
    </div>
  </div>
</div>
): null}
     
</>
): null}
 

 
    </>
): null}
  </>
): null}














{default_template ? (

<>
<Toaster/>
<div className="min-h-screen   relative  z-0 flex items-center justify-center
 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 
 transition-colors duration-300 ">


{seeInstructions ? (


<div className='bg-white dark:bg-gray-800  
z-50 absolute left-0 top-0


flex flex-col items-center justify-center
text-white p-10 rounded-md cursor-pointer'  >

<p className='text-3xl absolute top-0 font-semibold text-gray-900 dark:text-white dotted-font'>{hotspotName} </p>
<div className='flex flex-row gap-2 items-center justify-center'>
<SlNotebook  className='w-5 h-5 text-teal-500'/>
<h2 className=" text-lg font-semibold text-gray-900 dark:text-white dotted-font">How To Purchase:</h2>

</div>


<ol className="max-w-md space-y-1 text-gray-500 list-decimal  mt-4 dark:text-gray-400">
<li>
    <span className="dotted-font font-thin  text-gray-900 dark:text-white">  Tap the package you want to purchase</span>
</li>
<li>
    <span className="dotted-font font-thin text-gray-900
     dark:text-white">Enter Your Phone Number</span> 
</li>
<li>
    <span className="dotted-font font-thin text-gray-900
     dark:text-white">click connect now</span> 
</li>


<li>
    <span className="dotted-font font-thin text-gray-900 dark:text-white">Enter your Mobile PIN in the prompt and wait
      a few seconds to complete the process
      </span> 
</li>
</ol>

<div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white dotted-font">
          Contact Us
        </h3>
        <div className="mt-2 space-y-2">
          <p className="dotted-font font-thin text-gray-900 dark:text-white">
              <span className='font-bold'>Email: </span> {hotspotEmail === null ? 'Not Available' : hotspotEmail}
          </p>
          <p className="dotted-font font-thin text-gray-900 dark:text-white">
            <span className='font-bold'>Phone Number: </span> {hotspotPhoneNumber === null ? 'Not Available' : hotspotPhoneNumber}
          </p>
        </div>
      </div>

<Link to='/hotspot-login' className='flex flex-row items-center justify-center'>
<div className='flex flex-row items-center justify-center'>
<HiMiniArrowLeftEndOnRectangle className='w-8 h-8 text-teal-500'/>
<p className='dotted-font font-thin text-gray-900 mt-3'>
  Already subscribed?</p>
</div>

</Link>

</div>
): null}




  {seeForm  ?  (

<>
<form onSubmit={makeHotspotPayment}>
<motion.div
className="max-w-md w-full bg-white rounded-xl shadow-lg p-6"
// variants={containerVariants}
initial="hidden"
animate="visible"
>
<div className="text-center mb-6">
<FaWifi className="text-blue-500 w-12 h-12 mx-auto mb-4" />
<h1 className="text-3xl  text-gray-900  dotted-font font-thin">Welcome to {hotspotName}</h1>
<p className="text-gray-600 dotted-font ">Connect and enjoy fast browsing.</p>
</div>


<motion.div
className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
whileHover={{ scale: 1.02 }}
>
{/* <FaLock className="text-green-500 w-8 h-8" /> */}
<FaPhone className="text-green-500 w-8 h-8"/>


<input type="text"
value={phoneNumber}
onChange={(e) => setPhoneNumber(e.target.value)}
className='w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none' 
placeholder="Enter your phone number"/>


{/* <p className="text-gray-700">Secure Connection</p> */}


</motion.div>

<motion.div
className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
whileHover={{ scale: 1.02 }}
>

</motion.div>





<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg shadow-md"
    >
      <button
      type='submit'
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-500 text-white  rounded-full shadow-md
focus:outline-none dotted-font font-thin"
      >
        {loading ? (
          <CircularProgress size={24} className="text-white" />
        ) : (
          <>
            {/* <LocalAtmIcon className="mr-2" /> */}
            Pay Now
          </>
        )}
      </button>

      {isloading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center text-gray-700 flex items-center"
        >
          <SmartphoneIcon className="mr-2" />
          You will be prompted for M-Pesa PIN on your phone (STK).
        </motion.div>
        
      )}

{/* 
      <div className="mt-4">
  {queryStatus === 'processing' && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 text-center text-yellow-600 flex items-center"
    >
      <Clock className="mr-2" />
      Transaction is still under processing...
    </motion.div>
  )}
  {queryStatus === 'success' && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 text-center text-green-600 flex items-center"
    >
      <CheckCircleIcon className="mr-2" />
      Payment successful! You are now connected.
    </motion.div>
  )}
  {queryStatus === 'no_response' && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 text-center text-blue-600 flex items-center"
    >
      <AlertCircle className="mr-2" />
      No response from user. Please complete the M-Pesa prompt.
    </motion.div>
  )}
  {queryStatus === 'cancelled' && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 text-center text-orange-600 flex items-center"
    >
      <ErrorIcon className="mr-2" />
      Payment cancelled by user. Please try again.
    </motion.div>
  )}
  {queryStatus === 'invalid_initiator' && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 text-center text-red-600 flex items-center"
    >
      <ErrorIcon className="mr-2" />
      Invalid payment details. Please contact support.
    </motion.div>
  )}
</div> */}





       {issuccess && (
        <motion.div
        onClick={() => setSuccess(false)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center text-green-600 flex items-center"
        >
          <CheckCircleIcon className="mr-2" />
          Payment initiated successfully! You will receive an M-PESA prompt.
        </motion.div>
      )}

     {seeError && (
  <>
{error && (
        <motion.div
         onClick={() => setSeeError(false)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center text-red-600
          cursor-pointer
          flex items-center"
        >
          <ErrorIcon className="mr-2" />
          Something went wrong. Please try again.
        </motion.div>
      )}

  </>
)}

    </motion.div>

<div className='flex justify-center items-center cursor-pointer' onClick={()=>  {
setSeeForm(false)
setSeePackages(true)
setSeeInstructions(true)
} }>
<TiArrowBackOutline className="mt-6 text-center w-8 h-8"/>

</div>

</motion.div>

</form>


{enabled ? (
<>
{seeAdd ? (
      <div 
  className="rounded-2xl flex flex-col justify-between
             fixed z-50 animate-slide-in-right
             backdrop-blur-lg shadow-2xl p-4
             mx-4 mb-4
             bottom-0 left-0 right-0
             sm:bottom-4 sm:left-auto sm:right-4 sm:mx-0
             sm:max-w-sm w-auto sm:w-80"
  style={{ 
    background: adData.backgroundColor,
    color: adData.textColor
  }}
>
  {/* Close Button */}
  <button 
    onClick={() => setSeeAdd(false)}  
    className="absolute top-2 right-2 text-white/80 hover:text-white transition-colors z-10"
  >
    <X className="w-4 h-4" />
  </button>

  <div className="flex flex-col sm:flex-row gap-3">
    {/* Image Section */}
    {adData.imagePreview && (
      <div className="flex-shrink-0">
        <img
          src={adData.imagePreview}
          alt="Business preview"
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl"
        />
      </div>
    )}

    {/* Content Section */}
    <div className="flex-1 min-w-0">
      {/* Discount Badge */}
      {adData.discount && (
        <div className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold mb-2">
          <span>✨</span>
          {adData.discount}
        </div>
      )}

      {/* Title */}
      <h3 
        className="text-lg sm:text-xl font-bold mb-1 truncate"
        style={getTextStyle()}
        title={adData.title}
      >
        {adData.title || 'Business Name'}
      </h3>
      
      {/* Description */}
      <p 
        className="text-sm sm:text-base opacity-90 mb-2 line-clamp-2"
        style={getTextStyle()}
      >
        {adData.description || 'Business description...'}
      </p>

      {/* Business Info - Compact */}
      <div className="space-y-1 mb-2">
        {adData.businessName && (
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{adData.businessName}</span>
          </div>
        )}
        
        {adData.location.address && (
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{adData.location.address}</span>
          </div>
        )}
      </div>

      {/* Services Preview - Only show on larger screens */}
    {adData.services.some(s => s.trim() !== '') && (
      <div className="hidden sm:block mb-2">
        <div className="flex flex-wrap gap-1">
          {adData.services.filter(s => s.trim() !== '').slice(0, 2).map((service, index) => (
            <span key={index} className="bg-white/20 px-2 py-1 rounded text-xs">
              {service}
            </span>
          ))}
          {adData.services.filter(s => s.trim() !== '').length > 2 && (
            <span className="bg-white/20 px-2 py-1 rounded text-xs">
              +{adData.services.filter(s => s.trim() !== '').length - 2}
            </span>
          )}
        </div>
      </div>
    )}
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex flex-col sm:flex-row gap-2 mt-3">
    <button 
      className="bg-white text-gray-800 py-2 px-4 rounded-full font-bold hover:bg-gray-100
       transition-colors flex-1 text-sm sm:text-base"
      style={{ color: adData.backgroundColor.split(' ')[0] }}
    >
      {adData.ctaText}
    </button>
    
    {/* Secondary Actions - Show on larger screens */}
    <div className="hidden sm:flex gap-2">
      {/* <button className="bg-white/20 py-2 px-3 rounded-lg text-sm hover:bg-white/30 transition-colors flex items-center gap-1">
        <MapPin className="w-3 h-3" />
        Directions
      </button> */}



      <button
      onClick={() => {
    
        window.location.href = `tel:${adData.contact.phone}`;
        TrackEvent({eventType: 'click', button_name: 'call'})

      }}
      
      className="bg-white/20 py-2 px-3 rounded-lg text-sm
       hover:bg-white/30 transition-colors flex items-center gap-1">
        <Phone className="w-3 h-3" />
       <TrackEvent eventType="click" button_name="Call">
  Call
</TrackEvent>
      </button>
    </div>

    {/* Mobile secondary actions */}
    <div className="flex sm:hidden gap-2">
      

      <button 
      
       onClick={() => {
    
        window.location.href = `tel:${adData.contact.phone}`;
        TrackEvent({eventType: 'click', button_name: 'call'})

      }}
      className="flex-1 bg-white/20 py-2 px-3 rounded-lg text-xs hover:bg-white/30 transition-colors">
        Call Now
      </button>
    </div>
  </div>
</div>
): null}
     
</>
): null}
 
</>

  ): null}
 





  

  {seePackages && (
<motion.div className="max-w-md w-full mx-auto text-center mt-[320px] sm:mt-0">
<h2 className="text-2xl text-white mb-4 dotted-font font-thin">Choose Your Plan</h2>
<div className="h-96 overflow-y-auto  sm:overflow-visible 

grid grid-cols-1 gap-6">
  {packages.map((pkg, index) => (
    <motion.div
      key={index}
      className="bg-white p-4 rounded-lg shadow-lg"
      variants={packageVariants}
      initial="hidden"
      animate="visible"
    >
      <h3 className="text-xl font-bold text-gray-900">{pkg.name}</h3>
      <p className="text-gray-600">Valid For {pkg.valid}</p>
      <p className="text-blue-500 font-bold mt-2"> Price: Ksh{pkg.price}</p>
      <button
        onClick={() => {


          setHotspotPackage(pkg.name)
          setPackageAmount(pkg.price)
          setSeePackages(false);
          setSeeForm(true);
          setSeeInstructions(false);
        }}
        className="p-2 bg-blue-500 mt-2 rounded-md cursor-pointer dotted-font font-thin"
      >
        Subscribe
      </button>
    </motion.div>
  ))}
</div>
</motion.div>
)}


</div>
</>
): null}



{sleekspot ? (

<>

<>
      <Toaster />
      <div className={`min-h-screen relative z-0 flex flex-col 
        items-center justify-center bg-green-500 p-4`}>
       
        {/* Header Section */}
        <div className="w-full text-center mb-8">
          <h1 className="text-3xl font-bold text-white 
          ">{hotspotName}</h1>
          <p className="text-xl text-gray-200 mt-2">Fast and reliable internet access</p>
        </div>

        {/* Floating Card for Form or Packages */}
        <motion.div
          className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {seeForm ? (

            <>

{enabled ? (
<>
{seeAdd ? (
      <div 
  className="rounded-2xl flex flex-col justify-between
             fixed z-50 animate-slide-in-right
             backdrop-blur-lg shadow-2xl p-4
             mx-4 mb-4
             bottom-0 left-0 right-0
             sm:bottom-4 sm:left-auto sm:right-4 sm:mx-0
             sm:max-w-sm w-auto sm:w-80"
  style={{ 
    background: adData.backgroundColor,
    color: adData.textColor
  }}
>
  {/* Close Button */}
  <button 
    onClick={() => setSeeAdd(false)}  
    className="absolute top-2 right-2 text-white/80
     hover:text-white transition-colors z-10"
  >
    <X className="w-4 h-4" />
  </button>

  <div className="flex flex-col sm:flex-row gap-3">
    {/* Image Section */}
    {adData.imagePreview && (
      <div className="flex-shrink-0">
        <img
          src={adData.imagePreview}
          alt="Business preview"
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl"
        />
      </div>
    )}

    {/* Content Section */}
    <div className="flex-1 min-w-0">
      {/* Discount Badge */}
      {adData.discount && (
        <div className="inline-flex items-center gap-1 bg-yellow-400
         text-yellow-900 px-2 py-1 rounded-full text-xs font-bold mb-2">
          <span>✨</span>
          {adData.discount}
        </div>
      )}

      {/* Title */}
      <h3 
        className="text-lg sm:text-xl font-bold mb-1 truncate"
        style={getTextStyle()}
        title={adData.title}
      >
        {adData.title || 'Business Name'}
      </h3>
      
      {/* Description */}
      <p 
        className="text-sm sm:text-base opacity-90 mb-2 line-clamp-2"
        style={getTextStyle()}
      >
        {adData.description || 'Business description...'}
      </p>

      {/* Business Info - Compact */}
      <div className="space-y-1 mb-2">
        {adData.businessName && (
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{adData.businessName}</span>
          </div>
        )}
        
        {adData.location.address && (
          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{adData.location.address}</span>
          </div>
        )}
      </div>

      {/* Services Preview - Only show on larger screens */}
    {adData.services.some(s => s.trim() !== '') && (
      <div className="hidden sm:block mb-2">
        <div className="flex flex-wrap gap-1">
          {adData.services.filter(s => s.trim() !== '').slice(0, 2).map((service, index) => (
            <span key={index} className="bg-white/20 px-2 py-1 rounded text-xs">
              {service}
            </span>
          ))}
          {adData.services.filter(s => s.trim() !== '').length > 2 && (
            <span className="bg-white/20 px-2 py-1 rounded text-xs">
              +{adData.services.filter(s => s.trim() !== '').length - 2}
            </span>
          )}
        </div>
      </div>
    )}
    </div>
  </div>

  {/* Action Buttons */}
  <div className="flex flex-col sm:flex-row gap-2 mt-3">
    <button 
      className="bg-white text-gray-800 py-2 px-4 rounded-full font-bold hover:bg-gray-100
       transition-colors flex-1 text-sm sm:text-base"
      style={{ color: adData.backgroundColor.split(' ')[0] }}
    >
      {adData.ctaText}
    </button>
    
    <div className="hidden sm:flex gap-2">
     
      <button
      onClick={() => {
    
        window.location.href = `tel:${adData.contact.phone}`;
        TrackEvent({eventType: 'click', button_name: 'call'})

      }}
      
      className="bg-white/20 py-2 px-3 rounded-lg text-sm
       hover:bg-white/30 transition-colors flex items-center gap-1">
        <Phone className="w-3 h-3" />
       <TrackEvent eventType="click" button_name="Call">
  Call
</TrackEvent>
      </button>
    </div>

    {/* Mobile secondary actions */}
    <div className="flex sm:hidden gap-2">
      

      <button 
      
       onClick={() => {
    
        window.location.href = `tel:${adData.contact.phone}`;
        TrackEvent({eventType: 'click', button_name: 'call'})

      }}
      className="flex-1 bg-white/20 py-2 px-3 rounded-lg text-xs hover:bg-white/30 transition-colors">
        Call Now
      </button>
    </div>
  </div>
</div>
): null}
     
</>
): null}
 

            <form onSubmit={makeHotspotPayment}>
              <div className="text-center mb-6">
                <FaWifi className="text-purple-600 w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800">Connect 
                  to Hotspot</h2>
                <p className="text-gray-600">Enter your phone number to proceed</p>
              </div>

              <motion.div
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg mb-4"
                whileHover={{ scale: 1.02 }}
              >
                <FaPhone className="text-purple-600 w-8 h-8" />
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}

                  className="w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none"
                  placeholder="Enter your phone number"
                />
              </motion.div>

              
             



<motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-6
       bg-gray-50 rounded-lg shadow-md"
    >
      <button
      type='submit'
        disabled={loading}
        className="w-full py-3 bg-purple-600 text-white
                 rounded-full shadow-md focus:outline-none dotted-font font-thin"
      >
        {loading ? (
          <CircularProgress size={24} className="text-white" />
        ) : (
          <>
            <LocalAtmIcon className="mr-2" />
            Pay Now
          </>
        )}
      </button>

      {isloading && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center text-gray-700 flex items-center"
        >
          <SmartphoneIcon className="mr-2" />
          You will be prompted for M-Pesa PIN on your phone (STK).
        </motion.div>
      )}

<div className="mt-4">
  {queryStatus === 'processing' && (
    <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg mb-3">
      <div className="flex items-center text-yellow-800">
        <Clock className="w-4 h-4 mr-2" />
        The transaction is still under processing...
      </div>
    </div>
  )}
  {queryStatus === 'success' && (
    <div className="p-3 bg-green-100 border border-green-300 rounded-lg mb-3">
      <div className="flex items-center text-green-800">
        <CheckCircle className="w-4 h-4 mr-2" />
        Payment successful! You're connected.
      </div>
    </div>
  )}
  {queryStatus === 'no_response' && (
    <div className="p-3 bg-blue-100 border border-blue-300 rounded-lg mb-3">
      <div className="flex items-center text-blue-800">
        <AlertCircle className="w-4 h-4 mr-2" />
        No response received. Complete M-Pesa prompt.
      </div>
    </div>
  )}
  {queryStatus === 'cancelled' && (
    <div className="p-3 bg-orange-100 border border-orange-300 rounded-lg mb-3">
      <div className="flex items-center text-orange-800">
        <XCircle className="w-4 h-4 mr-2" />
        Payment cancelled. Please try again.
      </div>
    </div>
  )}
  {queryStatus === 'invalid_initiator' && (
    <div className="p-3 bg-red-100 border border-red-300 rounded-lg mb-3">
      <div className="flex items-center text-red-800">
        <AlertTriangle className="w-4 h-4 mr-2" />
        Invalid information. Contact support.
      </div>
    </div>
  )}
</div>


  {issuccess && (
        <motion.div
        onClick={() => setSuccess(false)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center text-green-600 
          cursor-pointer
          flex items-center"
        >
          <CheckCircleIcon className="mr-2" />
          Payment initiated successfully! You will receive an M-PESA prompt.
        </motion.div>
      )}

       {seeError && (
  <>
{error && (
        <motion.div
         onClick={() => setSeeError(false)}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-4 text-center text-red-600
          cursor-pointer
          flex items-center"
        >
          <ErrorIcon className="mr-2" />
          Something went wrong. Please try again.
        </motion.div>
      )}

  </>
)}
    </motion.div>

              <div className='flex justify-center items-center cursor-pointer
               mt-6' onClick={()=>  {
                setSeeForm(false);
                setSeePackages(true);
                setSeeInstructions(true);
              } }>
              <FaArrowAltCircleLeft className='w-8 h-8'/>

              </div>
 
              <div
                className="flex justify-center items-center cursor-pointer 
                mt-6"
                onClick={() => {
                  setSeeForm(false);
                  setSeePackages(true);
                  setSeeInstructions(true);
                }}
              >
              </div>
              </form>
            </>
          ) : (
            <>


<form onSubmit={(e)=> loginWithVoucher(e)}>
<input type="text"

onChange={(e) => handleChangeHotspotVoucher(e)}
value={vouchers}
  name="vouchers"
className='w-full text-gray-700 bg-gray-100 rounded-lg p-2 focus:outline-none' 
placeholder="Enter your voucher code"/>

<motion.button
type='submit'
                variants={buttonVariants}
                whileHover="hover"
                className="w-full py-3 bg-purple-600
                 text-white rounded-full shadow-md 
                 mt-4"
              >
                Connect Now
              </motion.button>
              </form>


<div className='flex items-center justify-center mt-4 px-2'>
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    className="flex flex-wrap justify-center gap-2 sm:gap-3"
  >
    <button
      onClick={() => setActiveTabPremium('packages')}
      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all text-sm sm:text-base ${
        activeTab === 'packages'
          ? 'bg-purple-500'
          : 'bg-black hover:bg-gray-700'
      }`}
    >
      <span className="flex items-center text-white">
        <CreditCard className="w-4 h-4 mr-2 text-white" />
        Packages
      </span>
    </button>

    <button
      onClick={() => setActiveTabPremium('receipt')}
      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium transition-all text-sm sm:text-base ${
        activeTab === 'receipt'
          ? 'bg-amber-500'
          : 'bg-gray-800 hover:bg-gray-700'
      }`}
    >
      <span className="flex items-center text-white">
        <CiReceipt className="w-4 h-4 mr-2 text-white" />
        Receipt
      </span>
    </button>

   
  </motion.div>
</div>



                       {activeTabPremium === 'receipt' && (
                <div className='flex justify-center p-2'>
                  
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full
                   mx-4 shadow-2xl">
                    
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-full">
            {authType === 'login' ? (
              <CiReceipt className="w-6 h-6 text-yellow-600" />
            ) : (
              <FaUserPlus className="w-6 h-6 text-yellow-600" />
            )}
          </div>
          <div>
          <h2 className="text-2xl font-bold text-gray-900">
            M-PESA Receipt Number
          </h2>

          <h3> 
            if you've already paid but not connected , enter your receipt
            number to connect or you can also login with the receipt
             number if not a voucher
          </h3>
          </div>
        </div>
        
      </div>

     

      {/* Auth form */}
      <form onSubmit={loginWithReceiptNumber}>
        {/* Username field */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
          Receipt Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CiReceipt className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={receipt_number}
              onChange={(e) => setReceiptNumber(e.target.value)}
              className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. UBLCH7C12C"
              required
            />
          </div>
        </div>

      
        {/* Password field */}
       

       

        {/* Error message */}
        {authError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{authError}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={authLoading}
          className="w-full py-3 bg-purple-600 text-white font-bold rounded-lg
            hover:opacity-90 transition-opacity disabled:opacity-50 
            disabled:cursor-not-allowed"
        >
          {authLoading ? (
            <span className="flex items-center justify-center">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              {authType === 'login' ? 'Logging in...' : 'Logging In...'}
            </span>
          ) : (
            <span className="flex items-center justify-center">
              {authType === 'login' ? 'Login to Hotspot' : 'Logging In...'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </span>
          )}
        </button>
      </form>

     

    </div>
    </div>
              )}


{showVoucherError ? (
 <div className="flex items-center p-4 mb-4 text-sm text-red-800
 cursor-pointer f
relative
 rounded-lg bg-red-50
  dark:bg-gray-800 dark:text-red-400" role="alert">
  <svg className="shrink-0 inline w-4 h-4 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" 
  fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 
    1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1
     1 0 0 1 0 2Z"/>
  </svg>
  <div className='flex' onClick={() => setShowVoucherError(false)}>
    <span className="font-bold text-lg">Danger alert! <span className='font-medium'>{voucherError || 'Voucher verification failed'}</span>
      </span>   
    <MdCancel className='text-black w-4 h-4 absolute right-0 '/>
  </div>
</div>
): null}
           
                         
{!packageLoaded && (
  <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <RefreshCw className="w-12 h-12 animate-spin text-blue-500
         mx-auto mb-4" />
        <p className="text-gray-600">Loading hotspot package...</p>
      </div>
    </div>
)}

           {activeTabPremium === 'packages' && (
            <>

              <h2 className="text-2xl font-bold text-gray-800
               text-center mb-6">Choose Your Plan</h2>
    <div className="space-y-4">
                {packages.map((pkg, index) => (
                  <motion.div
                    key={index}
                    className="bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      setSeePackages(false);
                      setHotspotPackage(pkg.name)
                      setPackageAmount(pkg.price)
                      setSeeForm(true);
                      setSeeInstructions(false);
                    }}
                  >
                    <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
                    <p className="text-gray-600">Valid For {pkg.valid}</p>
                    <p className="text-purple-600 font-bold mt-2">Price: Ksh{pkg.price}</p>
                  </motion.div>
                ))}
              </div>
            </>
           ) }

              
            </>
          )}

<div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900
         dark:text-white">
          Contact Us
        </h3>
        <div className="mt-2 space-y-2">
          <p className="  text-gray-900 dark:text-white">
              <span className='font-bold'>Email: {hotspotEmail} </span> 
          </p>
          <p className=" text-gray-900 dark:text-black">
            <span className='font-bold'>Phone Number: {hotspotPhoneNumber} </span> 
          </p>
        </div>
      </div>
        </motion.div>

        {/* Instructions Section */}
        {seeInstructions && (
          <div className="mt-8 text-center text-white">
            <h2 className="text-xl font-bold mb-4 text-white">How To Purchase:</h2>
            <ol className="space-y-2">
              <li>1. Tap the package you want to purchase</li>
              <li>2. Enter Your Phone Number</li>
              <li>3. Click "Connect Now"</li>
              <li>4. Enter your Mpesa PIN in the prompt</li>
            </ol>
          </div>
        )}
      </div>
    </>
</>
):null}






  

   
    </>
  );
};



export default HotspotPage