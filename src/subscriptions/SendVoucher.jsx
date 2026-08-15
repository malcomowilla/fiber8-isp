import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useState, useMemo, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { FiSend, FiX, FiPhone } from 'react-icons/fi';
import { HiOutlineWifi } from 'react-icons/hi2';
import { ThemeProvider, createTheme } from '@mui/material/styles';






const SendVoucher = ({ open, setOpen, voucher, useLimit, expiration }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);









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
  






  const handleClose = () => {
    if (loading) return;
    setOpen(false);
  };

  const sendVoucher = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      toast.error('Enter a phone number first', {
        position: 'top-center',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/send_voucher?voucher=${voucher}&phone=${phone}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': window.location.hostname.split('.')[0],
        },
        body: JSON.stringify({
          phone,
          voucher,
          shared_users: useLimit,
          expiration,
        }),
      });
      const newData = await response.json();

      if (response.ok) {
        toast.success('Voucher sent successfully', {
          position: 'top-center',
          duration: 4000,
        });
        setTimeout(() => {
          setLoading(false);
          setOpen(false);
          setPhone('');
        }, 1200);
      } else {
        setLoading(false);
        toast.error(newData?.error || 'Failed to send voucher', {
          position: 'top-center',
          duration: 4000,
        });
      }
    } catch (error) {
      setLoading(false);
      toast.error('Failed to send voucher, server error', {
        position: 'top-center',
        duration: 4000,
      });
    }
  };

  return (
    <div>
      <Toaster />
       <ThemeProvider theme={tableTheme}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="send-voucher-title"
        aria-describedby="send-voucher-description"
      >
        <Box
          className="font-sans absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[92vw] max-w-[420px] bg-white rounded-2xl shadow-2xl outline-none
            overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-emerald-500 to-green-600 px-6 pt-6 pb-8">
            <button
              onClick={handleClose}
              disabled={loading}
              className="absolute right-4 top-4 text-white/80 hover:text-white
                hover:bg-white/10 rounded-full p-1.5 transition-colors disabled:opacity-50"
            >
              <FiX className="text-lg" />
            </button>

            <div className="flex items-center gap-3">
              <div className="bg-white/15 backdrop-blur-sm rounded-xl p-2.5">
                <HiOutlineWifi className="text-white text-2xl" />
              </div>
              <div>
                <p id="send-voucher-title" className="text-white font-bold text-lg leading-tight">
                  Send Voucher
                </p>
                <p className="text-emerald-50 text-sm">To a phone number via SMS</p>
              </div>
            </div>
          </div>

          {/* Voucher code chip, overlapping the header/body seam */}
          <div className="px-6 -mt-4 relative z-10">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                Voucher code
              </span>
              <code className="font-mono text-sm font-bold text-emerald-700 tracking-wide">
                {voucher}
              </code>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 pt-5 pb-6">
            <label
              htmlFor="voucher-phone"
              className="block text-sm font-semibold text-gray-700 mb-1.5"
            >
              Phone number
            </label>
            <div className="relative">
              <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="voucher-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0712 345 678"
                disabled={loading}
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300
                  text-gray-900 text-sm placeholder-gray-400 bg-gray-50
                  focus:outline-none focus:ring-2 focus:ring-emerald-500
                  focus:border-emerald-500 focus:bg-white transition-colors
                  disabled:opacity-60 disabled:cursor-not-allowed"
                onKeyDown={(e) => e.key === 'Enter' && sendVoucher(e)}
              />
            </div>

            <button
              onClick={sendVoucher}
              disabled={loading}
              className="mt-5 w-full flex items-center justify-center gap-2
                bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                disabled:bg-emerald-400 disabled:cursor-not-allowed
                text-white font-semibold text-sm rounded-lg py-2.5
                transition-colors shadow-sm"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white
                    rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend className="text-base" />
                  Send Voucher
                </>
              )}
            </button>
          </div>
        </Box>
      </Modal>
      </ThemeProvider>
    </div>
  );
};

export default SendVoucher;