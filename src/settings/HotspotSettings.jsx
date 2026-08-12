import  { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useCallback, useEffect, useMemo } from 'react';
import { useApplicationSettings } from "../settings/ApplicationSettings";
import LoadingAnimation from '../loader/loading_animation.json'
import Lottie from 'react-lottie';
import { GrConfigure } from "react-icons/gr";
import HotspotScript from './HotspotScript'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import {RefreshCw} from 'lucide-react';
import { ThemeProvider, createTheme } from '@mui/material/styles';




const HotspotSettings = () => {
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const [open, setOpen] = useState(false);
const options = ['Numeric', 'Words', 'Mixed'];

// Expiration mode options, each with a short explanation shown to the user
const expiryOptions = [
  {
    value: 'Real-time expiration',
    label: 'Real-time expiration',
    recommended: true,
    description:
      'Plan expires at a fixed time after purchase, regardless of actual usage. For example, a 2-hour plan purchased at 10:00 AM expires at 12:00 PM.',
  },
  {
    value: 'Accumulated time',
    label: 'Accumulated time',
    recommended: false,
    description:
      'Plan expires when total session time reaches the limit. Time only counts while connected. For example, a 2-hour plan can be used across multiple sessions until 2 hours of actual usage.',
  },
];

  const [voucherType, setVoucherType] = useState(options[0]);
  const [voucher_expiration, setVoucherExpiration] = useState(expiryOptions[0].value);

  // Voucher code customization
  const MIN_CODE_LENGTH = 4;
  const MAX_CODE_LENGTH = 16;
  const MAX_PREFIX_LENGTH = 4;
  const [codeLength, setCodeLength] = useState(8);
  const [voucherPrefix, setVoucherPrefix] = useState('');



  const handleClose = () => {
    setOpen(false);
  }

const {phoneNumber, setPhoneNumber,hotspotName, setHotspotName,hotspotInfo, setHotspotInfo,
  email, setEmail,hotspotPhoneNumber, setHotspotPhoneNumber,hotspotEmail, setHotspotEmail,
  hotspotBanner, setHotspotBanner,hotspotBannerPreview, setHotspotBannerPreview} = useApplicationSettings()









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





  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHotspotBanner(file);
      setHotspotBannerPreview(URL.createObjectURL(file)); // Generate preview URL
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: LoadingAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  const subdomain = window.location.hostname.split('.')[0];

  // Handle code length input, clamped between MIN and MAX
  const handleCodeLengthChange = (e) => {
    const raw = e.target.value;
    if (raw === '') {
      setCodeLength('');
      return;
    }
    const parsed = parseInt(raw, 10);
    if (Number.isNaN(parsed)) return;
    setCodeLength(parsed);
  };

  const handleCodeLengthBlur = () => {
    let value = parseInt(codeLength, 10);
    if (Number.isNaN(value)) value = MIN_CODE_LENGTH;
    if (value < MIN_CODE_LENGTH) value = MIN_CODE_LENGTH;
    if (value > MAX_CODE_LENGTH) value = MAX_CODE_LENGTH;
    setCodeLength(value);
  };

  // Handle prefix input, capped at MAX_PREFIX_LENGTH characters
  const handlePrefixChange = (e) => {
    const value = e.target.value.slice(0, MAX_PREFIX_LENGTH);
    setVoucherPrefix(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("phone_number", hotspotPhoneNumber);
    formData.append("hotspot_name", hotspotName);
    formData.append("hotspot_info", hotspotInfo);
    formData.append("email", hotspotEmail);
    formData.append("voucher_type", voucherType);
    formData.append("voucher_expiration", voucher_expiration);
    formData.append("code_length", codeLength || MIN_CODE_LENGTH);
    formData.append("voucher_prefix", voucherPrefix);
    if (hotspotBanner) {
      formData.append("hotspot_banner", hotspotBanner); // Append the file
    }

    try {
      setLoading(true);
      const response = await fetch('/api/hotspot_settings', {
        method: 'POST',
        headers: {
          'X-Subdomain': subdomain,
        },
        body: formData, // Use FormData instead of JSON
      });

      const newData = await response.json();


  if (response.status === 402) {
    setTimeout(() => {
      navigate('/license-expired')
     }, 1800);
    
  }


      if (response.ok) {
        setLoading(false);
        setHotspotPhoneNumber(newData.phone_number);
        setHotspotName(newData.hotspot_name);
        setHotspotInfo(newData.hotspot_info);
        setHotspotEmail(newData.email);
        setVoucherType(newData.voucher_type);
        setVoucherExpiration(newData.voucher_expiration);
        if (newData.code_length) setCodeLength(newData.code_length);
        if (newData.voucher_prefix !== undefined && newData.voucher_prefix !== null) {
          setVoucherPrefix(newData.voucher_prefix);
        }
        // setHotspotBanner(newData.hotspot_banner);
        toast.success(<p className="font-sans
">Hotspot settings saved successfully</p>, {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#22c55e",
            color: "#fff",
          },
        });
      } else {
        setLoading(false);
        toast.error(
          <p className="font-sans
">Failed to save hotspot settings, please try again later</p>,
          {
            duration: 4000,
            position: "top-right",
            style: {
              background: "#eb5757",
              color: "#fff",
            },
          }
        );
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        <p className="font-sans
">Failed to save hotspot settings, please try again later</p>,
        {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#eb5757",
            color: "#fff",
          },
        }
      );
    }
  };

  const getHotspotSettings = useCallback(
    async () => {
      try {
        const response = await fetch('/api/hotspot_settings', {
          headers: {
            'X-Subdomain': subdomain,
          },
        });
        const newData = await response.json();
        if (response.ok) {
          const { phone_number, hotspot_name, hotspot_info, 
            hotspot_banner, email, voucher_type, voucher_expiration,
            code_length, voucher_prefix } = newData;
          setHotspotPhoneNumber(phone_number);
          setHotspotName(hotspot_name);
          setHotspotInfo(hotspot_info);
          setHotspotEmail(email)
            setVoucherType(voucher_type);
            if (voucher_expiration === null) {
              setVoucherExpiration(expiryOptions[0].value);
              
            }
            setVoucherExpiration(voucher_expiration);
            if (code_length) {
              setCodeLength(code_length);
            }
            if (voucher_prefix !== undefined && voucher_prefix !== null) {
              setVoucherPrefix(voucher_prefix);
            }
          // setHotspotBanner(hotspot_banner);
          if (hotspot_banner) {
            setHotspotBannerPreview(hotspot_banner); 
          }
        } else {
          if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
        
      }
if (response.status === 401) {
  toast.error(<p className="font-sans
">{newData.error} </p>, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
        }
      } catch (error) {
        toast.error(<p className="font-sans
">The operation failed while fetching hotspot settings.Please retry in a moment</p>, {
          duration: 3000,
          position: "top-right",
          style: {
            background: "#eb5757",
            color: "#fff",
          },
        });
      }
    },
    [],
  );

  useEffect(() => {
    getHotspotSettings();
  }, [getHotspotSettings]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const inputVariants = {
    hover: { scale: 1.02 },
    focus: { scale: 1.05, borderColor: "#3b82f6" }, // Blue border on focus
  };

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  const selectedExpiryOption = expiryOptions.find(
    (opt) => opt.value === voucher_expiration
  );



  return (
    <>
                    <ThemeProvider theme={tableTheme}>
    
    <HotspotScript handleClose={handleClose} open={open}/>


      {/* {loading ? <Lottie className='relative z-50' options={defaultOptions} height={400} width={400} /> : null} */}
      <Toaster />
        <h1 className="text-2xl 
        
        mb-6 font-bold  
      font-sans
 inline-block
      ">Hotspot Settings</h1>


        <motion.form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto  p-6 rounded-lg shadow-md font-sans
"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >

          
          {/* Contact Us Phone Number */}
          <motion.div className="mb-4" variants={containerVariants}>
            <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2" htmlFor="phoneNumber">
              Contact Us Phone Number
            </label>
            <motion.input
              type="text"
              id="phoneNumber"
              value={hotspotPhoneNumber}
              onChange={(e) => setHotspotPhoneNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter phone number"
              whileHover="hover"
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>







<motion.div className="mb-4" variants={containerVariants}>
  <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2"
   htmlFor="voucherExpiration">
              Voucher Expiration
            </label>


              <Autocomplete
        value={voucher_expiration}
        className='myTextField'
        disableClearable
        onChange={(event, newValue) => {
          setVoucherExpiration(newValue);
        }}
        options={expiryOptions.map((opt) => opt.value)}
        renderOption={(props, option) => {
          const opt = expiryOptions.find((o) => o.value === option);
          return (
            <li {...props} key={option}>
              <div className="flex flex-col py-1">
                <span className="font-medium flex items-center gap-2">
                  {opt.label}
                  {opt.recommended && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Recommended
                    </span>
                  )}
                </span>
                <span className="text-xs text-gray-500 mt-0.5">
                  {opt.description}
                </span>
              </div>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            id="voucherExpiration"
          />
        )}
      />
      {selectedExpiryOption && (
        <p className="text-xs text-gray-500 mt-2">
          {selectedExpiryOption.description}
        </p>
      )}


</motion.div>

          {/* Hotspot Name */}
          <motion.div className="mb-4" variants={containerVariants}>
            <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2" htmlFor="hotspotName">
              Hotspot Name
            </label>
            <motion.input
              type="text"
              id="hotspotName"
              value={hotspotName}
              onChange={(e) => setHotspotName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter hotspot name"
              whileHover="hover"
              whileFocus="focus"
              variants={inputVariants}
            />
          </motion.div>


<motion.div className="mb-4" variants={containerVariants}>
  <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2" htmlFor="voucherTypeInput">
              Voucher Type
            </label>


              <Autocomplete
        value={voucherType}
        className='myTextField'
        onChange={(event, newValue) => {
          setVoucherType(newValue);
        }}
        // inputValue={inputValue}
        // onInputChange={(event, newInputValue) => {
        //   (newInputValue);
        // }}
        id="controllable-states-demo"
        options={options}
        // sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params}
         />}
      />


</motion.div>

          {/* Voucher Code Length + Prefix */}
          <motion.div className="mb-4 grid grid-cols-2 gap-4" variants={containerVariants}>
            <div>
              <label className="block text-gray-700 dark:text-white text-sm font-bold mb-2" htmlFor="codeLength">
                Code Length
              </label>
              <motion.input
                type="number"
                id="codeLength"
                min={MIN_CODE_LENGTH}
                max={MAX_CODE_LENGTH}
                value={codeLength}
                onChange={handleCodeLengthChange}
                onBlur={handleCodeLengthBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. 8"
                whileHover="hover"
                whileFocus="focus"
                variants={inputVariants}
              />
              <p className="text-xs text-gray-500 mt-1">
                Between {MIN_CODE_LENGTH} and {MAX_CODE_LENGTH} characters
              </p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="voucherPrefix">
                Prefix (Optional)
              </label>
              <motion.input
                type="text"
                id="voucherPrefix"
                value={voucherPrefix}
                onChange={handlePrefixChange}
                maxLength={MAX_PREFIX_LENGTH}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="e.g. WIFI"
                whileHover="hover"
                whileFocus="focus"
                variants={inputVariants}
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum {MAX_PREFIX_LENGTH} characters
              </p>
            </div>
          </motion.div>





<div className='flex flex-row gap-2 justify-center'>
           <motion.button
            onClick={(e) => {
              setOpen(true)
              e.preventDefault()

            }}
            className="w-fit bg-green-500 text-white  flex
            justify-center items-center
            py-2 px-4  mt-2 gap-2
            rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2  focus:ring-green-500"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            configure
            <GrConfigure className=""/>

          </motion.button>

        

          <motion.button
            type="submit"
            className="w-fit bg-green-500 text-white  flex
            justify-center items-center
            py-2 px-4  mt-2 gap-2
            rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2  focus:ring-green-500"
            whileHover="hover"
            whileTap="tap"
            variants={buttonVariants}
          >
            {loading ?<> <RefreshCw className='animate-spin text-white w-5 h-5 mx-auto ' /> Saving... </> : <p>Save Settings</p>}
            {/* <RefreshCw className={`${loading ? 'animate-spin text-white w-5 h-5 mx-auto ' : 'text-white w-5 h-5'}`} /> */}
          </motion.button>
          </div>



         
        </motion.form>
      </ThemeProvider>

    </>
  );
};

export default HotspotSettings;