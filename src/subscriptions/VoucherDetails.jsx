import * as React from "react";
import { useState, useMemo, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import { AnimatePresence, motion } from "framer-motion";
import {
  X, Wifi, Clock, Gauge, Users, Phone, LogIn,
  CreditCard, Hash, Banknote, User, Calendar, LogOut, Loader2,
} from "lucide-react";
import { ThemeProvider, createTheme } from '@mui/material/styles';






const statusStyles = {
  active: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  expired: "bg-red-50 text-red-600 ring-red-200",
  used: "bg-amber-50 text-amber-600 ring-amber-200",
};

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-2 text-gray-500 text-sm">
        <Icon className="w-4 h-4" />
        {label}
      </div>
      <span className="text-sm font-medium text-gray-800">{value}</span>
    </div>
  );
}

function VoucherDetails({
  openVoucherDetails, handleCloseVoucherDetails, voucher, useLimit, speed, phone,
  createdAt, updatedAt, status, expiration, payment_method, reference, amount,
  customer, time_paid, isOnline, loadingLogout, logoutUser, loginBy,
}) {
  const [confirmLogout, setConfirmLogout] = useState(false);



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
    <Dialog
      open={openVoucherDetails}
      onClose={handleCloseVoucherDetails}
      fullWidth
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: "20px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" } }}
    >
      <div className="font-sans">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-6 pb-8 relative">
          <button
            onClick={handleCloseVoucherDetails}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {isOnline && (
            <button
              onClick={() => setConfirmLogout(true)}
              title="Force logout"
              className="absolute top-4 left-4 text-white/80 hover:text-white transition-colors"
            >
              {loadingLogout ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogOut className="w-5 h-5" />}
            </button>
          )}

          <div className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center">
              <Wifi className="w-6 h-6 text-white" />
            </div>
            <p className="text-white font-semibold text-lg">{voucher}</p>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ring-1 ${statusStyles[status] || "bg-white/20 text-white ring-white/30"}`}>
                {status}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${isOnline ? "bg-emerald-400/20 text-white" : "bg-white/10 text-white/70"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? "bg-emerald-300 animate-pulse" : "bg-white/40"}`} />
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* Inline confirm-logout banner instead of a Popper */}
        <AnimatePresence>
          {confirmLogout && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-red-50 overflow-hidden"
            >
              <div className="px-6 py-3 flex items-center justify-between gap-3">
                <p className="text-sm text-red-700">Log out this device?</p>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => setConfirmLogout(false)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg text-gray-600 hover:bg-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => { setConfirmLogout(false); logoutUser(); }}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Body */}
        <div className="px-6 py-4">
          <InfoRow icon={Clock} label="Expiration" value={expiration} />
          <InfoRow icon={Gauge} label="Speed limit" value={speed} />
          <InfoRow icon={Users} label="Device limit" value={useLimit} />
          <InfoRow icon={Phone} label="Phone" value={phone} />
          <InfoRow icon={LogIn} label="Login method" value={loginBy} />
          <InfoRow icon={Calendar} label="Created" value={createdAt} />
          <InfoRow icon={Calendar} label="Updated" value={updatedAt} />

          {(payment_method || reference || amount || customer || time_paid) && (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-4 mb-1">
                Payment
              </p>
              <InfoRow icon={CreditCard} label="Method" value={payment_method} />
              <InfoRow icon={Hash} label="Reference" value={reference} />
              <InfoRow icon={Banknote} label="Amount" value={amount ? `KES ${amount}` : null} />
              <InfoRow icon={User} label="Customer" value={customer} />
              <InfoRow icon={Clock} label="Time paid" value={time_paid} />
            </>
          )}
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={handleCloseVoucherDetails}
            className="w-full py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
    </ThemeProvider>
  );
}

export default VoucherDetails;