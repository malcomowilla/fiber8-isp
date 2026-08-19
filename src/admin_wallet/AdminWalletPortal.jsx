import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Wallet, 
  Wifi, 
  Server, 
  ArrowUpRight, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Eye,
  EyeOff,
  History,
  RefreshCw,
  Settings,
  Clock,
  DollarSign,
  Calendar,
  Save,
  TrendingUp,
  AlertCircle,
  Lock,
  Shield,
  X,
  Mail,
  MessageSquare,
  LogOut
} from 'lucide-react';
import { useNavigate } from "react-router";




// API Service
const apiService = {
  async getBalances() {    
    const response = await fetch('/api/admin/wallet_balances', {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]')?.content
      }
    });
    const data = await response.json();
    return data;
  },

  async verifyWalletPin(pin) {
    const response = await fetch('/api/admin/verify_wallet_pin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]')?.content,
        'X-Subdomain': window.location.hostname.split('.')[0]
      },
      body: JSON.stringify({ pin })
    });
    return response.json();
  },

  async sendWithdrawalOtp(phoneNumber) {
    const response = await fetch('/api/admin/send_withdrawal_otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]')?.content,
        'X-Subdomain': window.location.hostname.split('.')[0]
      },
      body: JSON.stringify({ phone_number: phoneNumber })
    });
    return response.json();
  },

  async verifyWithdrawalOtp(otp) {
    const response = await fetch('/api/admin/verify_withdrawal_otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]')?.content,
        'X-Subdomain': window.location.hostname.split('.')[0]
      },
      body: JSON.stringify({ otp })
    });
    return response.json();
  },

  async initiateWithdrawal(request) {
    const response = await fetch('/api/admin/withdraw', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-Subdomain": window.location.hostname.split('.')[0],
        'X-Idempotency-Key': request.idempotencyKey

      },
      body: JSON.stringify(request)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Withdrawal failed');
    }
    
    return response.json();
  },

  async setWalletPin(pin) {
    const response = await fetch('/api/admin/set_wallet_pin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]')?.content,
        'X-Subdomain': window.location.hostname.split('.')[0]
      },
      body: JSON.stringify({ pin })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to set PIN');
    }
    
    return response.json();
  },

  async getTransactionHistory() {
    const response = await fetch('/api/admin/transactions', {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  async getPayoutSettings() {
    const response = await fetch('/api/admin/payout_settings', {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  async updatePayoutSettings(settings) {
    const response = await fetch('/api/admin/payout_settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]')?.content
      },
      body: JSON.stringify(settings)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update settings');
    }
    
    return response.json();
  },

  async getRevenueBreakdown(walletType, days = 30) {
    const response = await fetch(`/api/admin/revenue_breakdown?type=${walletType}&days=${days}`, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  // ─── Logout ───────────────────────────────────────────────────────────────
  async logout() {
    const response = await fetch('/api/admin/logout', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('[name="csrf-token"]')?.content
      }
    });
    return response.json();
  }
};

// ─── Logout Confirm Modal ─────────────────────────────────────────────────────
function LogoutModal({ isOpen, onClose, onConfirm, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans
">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-lg">
            <LogOut size={24} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Sign Out</h2>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to sign out of the Admin Wallet Portal?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PIN Verification Modal ───────────────────────────────────────────────────
function PinVerificationModal({ isOpen, onClose, onVerifySuccess }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (pin.length !== 4) { setError('PIN must be 4 digits'); return; }
    setLocalLoading(true);
    try {
      const response = await apiService.verifyWalletPin(pin);
      if (response.success) { onVerifySuccess(); setPin(''); setError(''); }
      else setError(response.error || 'Invalid PIN');
    } catch (err) {
      setError(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans
">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg"><Lock size={24} className="text-blue-600" /></div>
            <h2 className="text-2xl font-bold text-gray-900">Enter PIN</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <p className="text-gray-600 mb-6">Enter your 4-digit wallet PIN to proceed with the withdrawal</p>
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Wallet PIN</label>
            <input
              type="password" value={pin}
              onChange={(e) => { setPin(e.target.value.slice(0, 4).replace(/\D/g, '')); setError(''); }}
              maxLength="4" placeholder="0000"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition font-mono"
              disabled={localLoading}
            />
            {error && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle size={16} /> {error}</p>}
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={pin.length !== 4 || localLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {localLoading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />} Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── OTP Verification Modal ───────────────────────────────────────────────────
function OtpVerificationModal({ isOpen, onClose, onVerifySuccess, method = 'sms' }) {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCountdown > 0) timer = setInterval(() => setResendCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError('OTP must be 6 digits'); return; }
    setLocalLoading(true);
    try {
      const response = await apiService.verifyWithdrawalOtp(otp);
      if (response.success) { onVerifySuccess(); setOtp(''); setError(''); }
      else setError(response.error || 'Invalid OTP');
    } catch (err) {
      setError(err.message);
    } finally {
      setLocalLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans
">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${method === 'sms' ? 'bg-green-100' : 'bg-purple-100'}`}>
              {method === 'sms' ? <MessageSquare size={24} className="text-green-600" /> : <Mail size={24} className="text-purple-600" />}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verify OTP</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <p className="text-gray-600 mb-2">Enter the 6-digit code sent via {method === 'sms' ? 'SMS' : 'email'}</p>
        <p className="text-sm text-gray-500 mb-6">Check your {method === 'sms' ? 'phone' : 'email inbox'} for the code</p>
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">One-Time Password</label>
            <input
              type="text" value={otp}
              onChange={(e) => { setOtp(e.target.value.slice(0, 6).replace(/\D/g, '')); setError(''); }}
              maxLength="6" placeholder="000000"
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition font-mono"
              disabled={localLoading}
            />
            {error && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><AlertCircle size={16} /> {error}</p>}
          </div>
          <div className="text-center">
            {resendCountdown > 0
              ? <p className="text-sm text-gray-500">Resend code in {resendCountdown}s</p>
              : <button type="button" onClick={() => setResendCountdown(60)} className="text-sm text-blue-600 hover:text-blue-700 font-medium">Didn't receive code? Resend</button>
            }
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={otp.length !== 6 || localLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {localLoading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />} Verify
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── PIN Setup Modal ──────────────────────────────────────────────────────────
function PinSetupModal({ isOpen, onClose, onSuccess }) {
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSetPin = async (e) => {
    e.preventDefault();
    if (newPin.length !== 4) { setError('PIN must be 4 digits'); return; }
    if (newPin !== confirmPin) { setError('PINs do not match'); return; }
    setSaving(true);
    try {
      const response = await apiService.setWalletPin(newPin);
      if (response.success) { onSuccess(); resetForm(); }
      else setError(response.error || 'Failed to set PIN');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => { setNewPin(''); setConfirmPin(''); setError(''); onClose(); };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 font-sans
">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg"><Shield size={24} className="text-amber-600" /></div>
            <h2 className="text-2xl font-bold text-gray-900">Set Wallet PIN</h2>
          </div>
          <button onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <p className="text-gray-600 mb-6">Create a secure 4-digit PIN to protect your withdrawals</p>
        <form onSubmit={handleSetPin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Create PIN (4 digits)</label>
            <input type="password" value={newPin}
              onChange={(e) => { setNewPin(e.target.value.slice(0, 4).replace(/\D/g, '')); setError(''); }}
              maxLength="4" placeholder="0000" disabled={saving}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition font-mono"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm PIN</label>
            <input type="password" value={confirmPin}
              onChange={(e) => { setConfirmPin(e.target.value.slice(0, 4).replace(/\D/g, '')); setError(''); }}
              maxLength="4" placeholder="0000" disabled={saving}
              className="w-full px-4 py-3 text-center text-2xl tracking-widest border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition font-mono"
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700"><strong>Security Tip:</strong> Choose a PIN that's easy to remember but hard to guess. Avoid birthdays or sequential numbers.</p>
          </div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={resetForm} className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition">Cancel</button>
            <button type="submit" disabled={newPin.length !== 4 || saving}
              className="flex-1 px-4 py-2 bg-amber-600 text-white font-medium rounded-xl hover:bg-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Shield size={18} />} Set PIN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────
const AdminWalletPortal = () => {
  const [balances, setBalances] = useState({ 
    hotspot: { total: 0, pending: 0, paid: 0, lastPaidAt: null },
    pppoe: { total: 0, pending: 0, paid: 0, lastPaidAt: null }
  });

  const isSubmittingRef = useRef(false);
    const [idempotencyKey, setIdempotencyKey] = useState(() => crypto.randomUUID());
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('hotspot');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pinVerified, setPinVerified] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpMethod, setOtpMethod] = useState('sms');
  const [notification, setNotification] = useState(null);
  const [showBalance, setShowBalance] = useState({ hotspot: true, pppoe: true });
  const [transactions, setTransactions] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showRevenueBreakdown, setShowRevenueBreakdown] = useState(false);
  const [revenueData, setRevenueData] = useState(null);
  const [availablePpoeBalance, setAvailablePpoeBalance] = useState(0);
  const [paidPpoeBalance, setPaidPpoeBalance] = useState(0);
  const [availableHotspotBalance, setAvailableHotspotBalance] = useState(0);
  const [paidHotspotBalance, setPaidHotspotBalance] = useState(0);
  const [payoutSettings, setPayoutSettings] = useState({
    hotspot: { enabled: true, intervalHours: 24, minAmount: 10, autoPayout: true },
    pppoe: { enabled: true, intervalHours: 24, minAmount: 10, autoPayout: true },
    transactionFeePercent: 1,
    platformFeePercent: 4
  });
  const [savingSettings, setSavingSettings] = useState(false);

  // ─── Logout state ───────────────────────────────────────────────────────────
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const subdomain = window.location.hostname.split('.')[0];
  let navigate = useNavigate();



  useEffect(() => {
    loadTransactionHistory();
    loadPayoutSettings();
    fetchLoadAvailablePPOEBalance();
    fetchLoadAvailableHotspotBalance();
    fetchLoadAlredyPaidPPOEBalance();
    fetchLoadAlredyPaidHotspotBalance();
  }, []);










  const handleWithdrawalFlow = async (e) => {
    e.preventDefault();

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      showNotification('Please enter a valid phone number', 'error');
      return;
    }

    const minAmount = payoutSettings[selectedWallet]?.minAmount ?? 0;
    if (amount < minAmount) {
      showNotification(`Minimum withdrawal amount is ${formatCurrency(minAmount)}`, 'error');
      return;
    }

    // Step 1: PIN not verified yet -> open PIN modal
    if (!pinVerified) {
      setShowPinModal(true);
      return;
    }

    // Step 2: PIN verified but OTP not yet -> send OTP, then open OTP modal
    if (!otpVerified) {
      try {
        const response = await apiService.sendWithdrawalOtp(phoneNumber);
        if (response.success) {
          setShowOtpModal(true);
        } else {
          showNotification(response.error || 'Failed to send OTP', 'error');
        }
      } catch (error) {
        showNotification('Failed to send OTP: ' + error.message, 'error');
      }
      return;
    }

    // Step 3: Both verified -> process the withdrawal
    processWithdrawal();
  };




  const fetchLoadAvailablePPOEBalance = useCallback(async() => {
    try {
      setLoading(true);
      const response = await fetch('/api/pending_pppoe_balance', { method: 'GET', headers: { 'X-Subdomain': subdomain } });
      const data = await response.json();
      if (response.ok) setAvailablePpoeBalance(data);
      else showNotification('Failed to load PPPOE balance', 'error');
      setLoading(false);
    } catch (error) {
      showNotification('Failed to load balances: ' + error.message, 'error');
      setLoading(false);
    }
  }, [subdomain]);

  const fetchLoadAvailableHotspotBalance = useCallback(async() => {
    try {
      setLoading(true);
      const response = await fetch('/api/pending_hotspot_balance', { method: 'GET', headers: { 'X-Subdomain': subdomain } });
      const data = await response.json();
      if (response.ok) setAvailableHotspotBalance(data);
      else showNotification('Failed to load hotspot balance', 'error');
      setLoading(false);
    } catch (error) {
      showNotification('Failed to load balances: ' + error.message, 'error');
      setLoading(false);
    }
  }, [subdomain]);

  const fetchLoadAlredyPaidPPOEBalance = useCallback(async() => {
    try {
      setLoading(true);
      const response = await fetch('/api/already_paid_pppoebalance', { method: 'GET', headers: { 'X-Subdomain': subdomain } });
      const data = await response.json();
      if (response.ok) setPaidPpoeBalance(data);
      else showNotification('Failed to load paid PPPOE balance', 'error');
      setLoading(false);
    } catch (error) {
      showNotification('Failed to load balances: ' + error.message, 'error');
      setLoading(false);
    }
  }, [subdomain]);

  const fetchLoadAlredyPaidHotspotBalance = useCallback(async() => {
    try {
      setLoading(true);
      const response = await fetch('/api/already_paid_hotspotbalance', { method: 'GET', headers: { 'X-Subdomain': subdomain } });
      const data = await response.json();
      if (response.ok) setPaidHotspotBalance(data);
      else showNotification('Failed to load paid hotspot balance', 'error');
      setLoading(false);
    } catch (error) {
      showNotification('Failed to load balances: ' + error.message, 'error');
      setLoading(false);
    }
  }, [subdomain]);

  const loadTransactionHistory = async () => {
    try { const data = await apiService.getTransactionHistory(); setTransactions(data); }
    catch (error) { console.error('Failed to load transactions', error); }
  };

  const loadPayoutSettings = async () => {
    try { const data = await apiService.getPayoutSettings(); setPayoutSettings(data); }
    catch (error) { console.error('Failed to load payout settings', error); }
  };

  const loadRevenueBreakdown = async (walletType) => {
    try { const data = await apiService.getRevenueBreakdown(walletType, 30); setRevenueData(data); }
    catch (error) { showNotification('Failed to load revenue data', 'error'); }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  // ─── Logout handler ─────────────────────────────────────────────────────────
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiService.logout();
      navigate('')
      window.location.href = '/admin-wallet-login';
    } catch (error) {
      // Even if the API call fails, redirect to login
      window.location.href = '/admin-wallet-login';
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };


  
  // 4. processWithdrawal — hard-guard against re-entry, restore the min-amount check
  const processWithdrawal = async () => {
    if (isSubmittingRef.current) return; // already in flight, ignore
    isSubmittingRef.current = true;

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      showNotification('Please enter a valid amount', 'error');
      isSubmittingRef.current = false;
      return;
    }
    if (!phoneNumber || phoneNumber.length < 10) {
      showNotification('Please enter a valid phone number', 'error');
      isSubmittingRef.current = false;
      return;
    }

    const minAmount = payoutSettings[selectedWallet]?.minAmount ?? 0;
    if (amount < minAmount) {
      showNotification(`Minimum withdrawal amount is ${formatCurrency(minAmount)}`, 'error');
      isSubmittingRef.current = false;
      return;
    }

    setIsProcessing(true);
    try {
      const result = await apiService.initiateWithdrawal({
        amount,
        phonenumber: phoneNumber,
        wallettype: selectedWallet,
        description: description || `Withdrawal from ${selectedWallet.toUpperCase()} wallet`,
        idempotencyKey
      });
      if (result.success) {
        showNotification('Withdrawal initiated successfully!', 'success');
        resetWithdrawalForm();
        await loadTransactionHistory();
      }
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setIsProcessing(false);
      isSubmittingRef.current = false;
    }
  };
  // 5. Reset the idempotency key whenever the form resets, so a genuinely new
  //    withdrawal gets a fresh key (don't reuse a key across separate withdrawals).
  const resetWithdrawalForm = () => {
    setWithdrawAmount('');
    setPhoneNumber('');
    setDescription('');
    setPinVerified(false);
    setOtpVerified(false);
    setIdempotencyKey(crypto.randomUUID());
  };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try { await apiService.updatePayoutSettings(payoutSettings); showNotification(<p className='font-sans
'>Payout settings saved successfully</p>, 'success'); }
    catch (error) { showNotification('Failed to save settings:' + error.message, 'error'); }
    finally { setSavingSettings(false); }
  };

  const toggleBalanceVisibility = (wallet) => {
    setShowBalance(prev => ({ ...prev, [wallet]: !prev[wallet] }));
  };

  const formatCurrency = (amount) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', minimumFractionDigits: 2 }).format(amount);
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-KE', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
  };
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8 font-sans
">
      {/* Modals */}
      <PinVerificationModal isOpen={showPinModal} onClose={() => setShowPinModal(false)}
        onVerifySuccess={() => { setPinVerified(true); setShowPinModal(false); showNotification('PIN verified successfully', 'success'); }}
      />
      <OtpVerificationModal isOpen={showOtpModal} onClose={() => setShowOtpModal(false)}
        onVerifySuccess={() => { setOtpVerified(true); setShowOtpModal(false); showNotification('OTP verified successfully', 'success'); processWithdrawal(); }}
        method={otpMethod}
      />
      <PinSetupModal isOpen={showPinSetup} onClose={() => setShowPinSetup(false)}
        onSuccess={() => { showNotification('Wallet PIN set successfully!', 'success'); setShowPinSetup(false); }}
      />

      {/* ─── Logout Confirm Modal ─── */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
      />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">Admin Wallet Portal</h1>
            <p className="text-gray-600 mt-2">Manage wallet balances and process withdrawals securely</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => setShowPinSetup(true)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-md transition font-medium">
              <Shield size={18} /><span>Set Wallet PIN</span>
            </button>
            <button onClick={() => { setShowRevenueBreakdown(!showRevenueBreakdown); if (!showRevenueBreakdown && selectedWallet) loadRevenueBreakdown(selectedWallet); }}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-200">
              <TrendingUp size={18} className="text-blue-500" /><span className="font-medium">Revenue Breakdown</span>
            </button>
            <button onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-200">
              <Settings size={18} className="text-gray-600" /><span className="font-medium">Settings</span>
            </button>

            {/* ─── Logout Button ─── */}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl shadow-sm transition font-medium"
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Security Status Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className={`rounded-xl p-4 ${pinVerified ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">PIN Verification</p>
                <p className={`text-xs mt-1 ${pinVerified ? 'text-green-600' : 'text-gray-500'}`}>{pinVerified ? '✓ Verified' : 'Required'}</p>
              </div>
              {pinVerified ? <CheckCircle size={24} className="text-green-600" /> : <Lock size={24} className="text-gray-400" />}
            </div>
          </div>
          <div className={`rounded-xl p-4 ${otpVerified ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">OTP Verification</p>
                <p className={`text-xs mt-1 ${otpVerified ? 'text-green-600' : 'text-gray-500'}`}>{otpVerified ? '✓ Verified' : 'Required'}</p>
              </div>
              {otpVerified ? <CheckCircle size={24} className="text-green-600" /> : <MessageSquare size={24} className="text-gray-400" />}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <AlertCircle size={16} className="text-blue-600" /> Two-Factor Secure
            </p>
            <p className="text-xs text-gray-600 mt-2">PIN + OTP protection enabled</p>
          </div>
        </div>

        {/* Balance Cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Wifi className="text-white" size={24} /><h2 className="text-white font-semibold text-lg">Hotspot Wallet</h2></div>
                <button onClick={() => toggleBalanceVisibility('hotspot')} className="text-white/80 hover:text-white transition">
                  {showBalance.hotspot ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center gap-2 text-gray-500"><Loader2 size={20} className="animate-spin" /><span>Loading balance...</span></div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-500">Available for Withdrawal</span>
                    <span className="text-2xl font-bold text-gray-800">{showBalance.hotspot ? formatCurrency(availableHotspotBalance) : '••••••'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Already Paid Out</span>
                    <span className="font-medium text-green-600">{showBalance.hotspot ? formatCurrency(paidHotspotBalance) : '••••••'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-purple-100">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><Server className="text-white" size={24} /><h2 className="text-white font-semibold text-lg">PPPoE Wallet</h2></div>
                <button onClick={() => toggleBalanceVisibility('pppoe')} className="text-white/80 hover:text-white transition">
                  {showBalance.pppoe ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="flex items-center gap-2 text-gray-500"><Loader2 size={20} className="animate-spin" /><span>Loading balance...</span></div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <span className="text-gray-500">Available for Withdrawal</span>
                    <span className="text-2xl font-bold text-gray-800">{showBalance.pppoe ? formatCurrency(availablePpoeBalance) : '••••••'}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Already Paid Out</span>
                    <span className="font-medium text-green-600">{showBalance.pppoe ? formatCurrency(paidPpoeBalance) : '••••••'}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
            <div className="flex items-center gap-3">
              <ArrowUpRight className="text-green-400" size={24} />
              <h2 className="text-white font-semibold text-lg">Initiate Withdrawal</h2>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleWithdrawalFlow} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Wallet</label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setSelectedWallet('hotspot')}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${selectedWallet === 'hotspot' ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      <div className="flex items-center justify-center gap-2"><Wifi size={18} /><span>Hotspot</span></div>
                    </button>
                    <button type="button" onClick={() => setSelectedWallet('pppoe')}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${selectedWallet === 'pppoe' ? 'bg-purple-500 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      <div className="flex items-center justify-center gap-2"><Server size={18} /><span>PPPoE</span></div>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (KES)</label>
                  <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" step="1" min="1" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">OTP Method</label>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setOtpMethod('sms')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${otpMethod === 'sms' ? 'bg-green-100 text-green-700 border-2 border-green-500' : 'bg-gray-100 text-gray-700 border-2 border-gray-200'}`}>
                      📱 SMS
                    </button>
                    <button type="button" onClick={() => setOtpMethod('email')}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${otpMethod === 'email' ? 'bg-purple-100 text-purple-700 border-2 border-purple-500' : 'bg-gray-100 text-gray-700 border-2 border-gray-200'}`}>
                      📧 Email
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Withdrawal reason" className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition" />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-800 mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-blue-600" /> Security Process
                </p>
                <ol className="text-sm text-gray-700 space-y-2 ml-6 list-decimal">
                  <li>{pinVerified ? '✓' : '1.'} Verify your 4-digit wallet PIN</li>
                  <li>{otpVerified ? '✓' : '2.'} Receive and enter OTP via {otpMethod.toUpperCase()}</li>
                  <li>{otpVerified ? '✓' : '3.'} Confirm and process withdrawal</li>
                </ol>
              </div>

              <button type="submit" disabled={isProcessing || isSubmittingRef.current || !withdrawAmount || !phoneNumber}

                className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg">
                {isProcessing ? (<><Loader2 size={20} className="animate-spin" /><span>Processing...</span></>) : (
                  <><ArrowUpRight size={20} /><span>{!pinVerified ? 'Verify PIN' : !otpVerified ? 'Send OTP' : 'Process Withdrawal'}</span></>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
              <div className="flex items-center gap-3">
                <Settings className="text-blue-400" size={24} />
                <h2 className="text-white font-semibold text-lg">Payout Settings</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="border rounded-xl p-5 border-blue-100">
                  <div className="flex items-center gap-2 mb-4"><Wifi size={20} className="text-blue-500" /><h3 className="font-semibold text-gray-800">Hotspot Payout Settings</h3></div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={payoutSettings.hotspot.enabled}
                        onChange={(e) => setPayoutSettings(prev => ({ ...prev, hotspot: { ...prev.hotspot, enabled: e.target.checked } }))}
                        className="w-4 h-4 text-blue-500 rounded" />
                      <span className="text-gray-700">Enable Auto Payout</span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payout Interval</label>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <select value={payoutSettings.hotspot.intervalHours}
                          onChange={(e) => setPayoutSettings(prev => ({ ...prev, hotspot: { ...prev.hotspot, intervalHours: parseInt(e.target.value) } }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                          <option value={1}>Every hour</option>
                          <option value={6}>Every 6 hours</option>
                          <option value={12}>Every 12 hours</option>
                          <option value={24}>Every 24 hours</option>
                          <option value={48}>Every 2 days</option>
                          <option value={168}>Every week</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Payout Amount (KES)</label>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-gray-400" />
                        <input type="number" value={payoutSettings.hotspot.minAmount}
                          onChange={(e) => setPayoutSettings(prev => ({ ...prev, hotspot: { ...prev.hotspot, minAmount: parseFloat(e.target.value) || 0 } }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" step="1" min="1" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-xl p-5 border-purple-100">
                  <div className="flex items-center gap-2 mb-4"><Server size={20} className="text-purple-500" /><h3 className="font-semibold text-gray-800">PPPoE Payout Settings</h3></div>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" checked={payoutSettings.pppoe.enabled}
                        onChange={(e) => setPayoutSettings(prev => ({ ...prev, pppoe: { ...prev.pppoe, enabled: e.target.checked } }))}
                        className="w-4 h-4 text-purple-500 rounded" />
                      <span className="text-gray-700">Enable Auto Payout</span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Payout Interval</label>
                      <div className="flex items-center gap-2">
                        <Clock size={16} className="text-gray-400" />
                        <select value={payoutSettings.pppoe.intervalHours}
                          onChange={(e) => setPayoutSettings(prev => ({ ...prev, pppoe: { ...prev.pppoe, intervalHours: parseInt(e.target.value) } }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
                          <option value={1}>Every hour</option>
                          <option value={6}>Every 6 hours</option>
                          <option value={12}>Every 12 hours</option>
                          <option value={24}>Every 24 hours</option>
                          <option value={48}>Every 2 days</option>
                          <option value={168}>Every week</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Payout Amount (KES)</label>
                      <div className="flex items-center gap-2">
                        <DollarSign size={16} className="text-gray-400" />
                        <input type="number" value={payoutSettings.pppoe.minAmount}
                          onChange={(e) => setPayoutSettings(prev => ({ ...prev, pppoe: { ...prev.pppoe, minAmount: parseFloat(e.target.value) || 0 } }))}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" step="1" min="1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <button onClick={handleSaveSettings} disabled={savingSettings}
                  className="flex items-center gap-2 px-6 py-2 bg-black text-white font-medium rounded-xl transition disabled:opacity-50">
                  {savingSettings ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  <span>{savingSettings ? 'Saving...' : 'Save Settings'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Revenue Breakdown */}
        {showRevenueBreakdown && revenueData && (
          <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-white" size={24} />
                <h2 className="text-white font-semibold text-lg">Revenue Breakdown - {selectedWallet.toUpperCase()} (Last 30 Days)</h2>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-xl font-bold text-blue-600">{formatCurrency(revenueData.total || 0)}</p>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-xl">
                  <p className="text-sm text-gray-500">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">{formatCurrency(revenueData.pending || 0)}</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <p className="text-sm text-gray-500">Paid Out</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(revenueData.paid || 0)}</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <p className="text-sm text-gray-500">Transactions</p>
                  <p className="text-xl font-bold text-purple-600">{revenueData.count || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transaction History */}
        <div>
          <button onClick={() => setShowHistory(!showHistory)} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium mb-4 transition">
            <History size={20} /><span>{showHistory ? 'Hide' : 'Show'} Transaction History</span>
          </button>
          {showHistory && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
                <h3 className="text-white font-semibold text-lg">Recent Transactions</h3>
              </div>
              <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
                {transactions.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <History size={48} className="mx-auto mb-3 text-gray-300" /><p>No transactions yet</p>
                  </div>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} className="p-4 hover:bg-gray-50 transition">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${tx.type === 'withdrawal' ? 'bg-red-100' : 'bg-green-100'}`}>
                            <ArrowUpRight size={16} className={tx.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{tx.type === 'withdrawal' ? 'Withdrawal' : 'Deposit'}</p>
                            <p className="text-xs text-gray-500">{tx.description || (tx.phoneNumber ? `To: ${tx.phoneNumber}` : '')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${tx.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'}`}>
                            {tx.type === 'withdrawal' ? '-' : '+'}{formatCurrency(tx.amount)}
                          </p>
                          <p className="text-xs text-gray-500">{formatDate(tx.timestamp)}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>{tx.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => { fetchLoadAvailablePPOEBalance(); fetchLoadAvailableHotspotBalance(); fetchLoadAlredyPaidPPOEBalance(); fetchLoadAlredyPaidHotspotBalance(); loadTransactionHistory(); }}
          className="fixed bottom-6 right-6 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all border border-gray-200"
          title="Refresh Balances"
        >
          <RefreshCw size={20} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default AdminWalletPortal;