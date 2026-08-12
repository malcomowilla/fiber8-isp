
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wifi, Tv, Smartphone, Monitor, Printer, Router,
  Plus, Trash2, CheckCircle, AlertCircle, RefreshCw,
  X, Eye, EyeOff, LogIn, LogOut, Zap, Clock, Shield,
  ArrowRight, CreditCard, Info,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getSubdomain = () => window.location.hostname.split(".")[0];

function formatMac(raw) {
  const clean = raw.replace(/[^0-9a-fA-F]/g, "").slice(0, 12);
  return clean.match(/.{1,2}/g)?.join(":") || clean;
}

function isValidMac(mac) {
  return /^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(mac.trim());
}

const DEVICE_TYPES = [
  { value: "tv",      label: "Smart TV",     Icon: Tv },
  { value: "phone",   label: "Phone/Tablet", Icon: Smartphone },
  { value: "pc",      label: "PC/Laptop",    Icon: Monitor },
  { value: "printer", label: "Printer",      Icon: Printer },
  { value: "router",  label: "Router",       Icon: Router },
  { value: "other",   label: "Other",        Icon: Wifi },
];

function DeviceIcon({ type, size = 16 }) {
  const found = DEVICE_TYPES.find((d) => d.value === type);
  const Icon  = found?.Icon || Wifi;
  return <Icon size={size} />;
}

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepDots({ total, current }) {
  return (
    <div className="flex gap-1.5 justify-center mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < current
              ? "bg-green-500 w-4"
              : i === current
              ? "bg-green-400 w-6"
              : "bg-gray-300 w-1.5"
          }`}
        />
      ))}
    </div>
  );
}

// ─── MAC instructions card ────────────────────────────────────────────────────

function MacInstructions({ deviceType }) {
  const instructions = {
    tv: [
      "Go to Settings on your TV",
      'Open "Network" or "About"',
      'Find "MAC Address" or "Physical Address"',
      "Write down the 12-character code (e.g. AA:BB:CC:DD:EE:FF)",
    ],
    phone: [
      "Go to Settings → About Phone",
      'Tap "Status" or "Wi-Fi MAC address"',
      "Some phones: Settings → Privacy → disable MAC randomization first",
    ],
    pc: [
      "Windows: open Command Prompt, type `ipconfig /all`",
      'Look for "Physical Address" under your Wi-Fi adapter',
      "Mac: System Settings → Wi-Fi → Details → Hardware Address",
    ],
    printer: [
      "Print a network configuration page from the printer menu",
      "Or check Settings → Network → Wireless → MAC Address",
    ],
    default: [
      "Check the device's Settings → Network section",
      'Look for "MAC Address", "Hardware Address", or "Physical Address"',
    ],
  };

  const steps = instructions[deviceType] || instructions.default;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Info size={14} className="text-blue-500 shrink-0" />
        <p className="text-sm font-semibold text-blue-800">
          How to find your MAC address
        </p>
      </div>
      <ol className="space-y-1.5">
        {steps.map((step, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-blue-700">
            <span className="shrink-0 w-4 h-4 bg-blue-200 text-blue-800 rounded-full flex items-center justify-center font-bold text-[10px]">
              {i + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. ADD DEVICE MODAL  (embed inside HotspotPage after payment)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Usage in HotspotPage.jsx — show this after payment is confirmed:
 *
 *   {queryStatus === 'success' && showAddDevice && (
 *     <AddDeviceModal
 *       subdomain={subdomain}
 *       mac={mac}
 *       ip={ip}
 *       onClose={() => setShowAddDevice(false)}
 *     />
 *   )}
 *
 * The user doesn't need a login token here — they're already authenticated
 * by the payment flow. Pass their session mac/ip to tie the device to their plan.
 */
export function AddDeviceModal({ subdomain, mac, ip, onClose }) {
  const [step, setStep] = useState(0); // 0=type  1=instructions  2=mac  3=done
  const [deviceType, setDeviceType] = useState("tv");
  const [deviceName, setDeviceName] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [macError, setMacError]     = useState("");
  const [saving, setSaving]         = useState(false);

  const handleMacInput = (e) => {
    const formatted = formatMac(e.target.value);
    setMacAddress(formatted);
    if (macError && isValidMac(formatted)) setMacError("");
  };

  const handleSave = async () => {
    if (!isValidMac(macAddress)) {
      setMacError("Enter a valid MAC address (AA:BB:CC:DD:EE:FF)");
      return;
    }
    if (!deviceName.trim()) {
      toast.error("Give your device a name");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/hotspot/portal/add_device_no_auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Subdomain": subdomain,
        },
        body: JSON.stringify({
          mac_address: macAddress,
          device_name: deviceName,
          device_type: deviceType,
          owner_mac: mac,
          owner_ip: ip,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to add device");
        return;
      }
      setStep(3);
    } catch {
      toast.error("Network error — please try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center
     bg-black/60 backdrop-blur-sm p-4 font-sans
">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {step === 3 ? "Device added! 🎉" : "Add your TV or device"}
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {step === 3
                ? "Your device will connect automatically"
                : "Skip the login page for your smart TV, console, or printer"}
            </p>
          </div>
          {step !== 3 && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="px-5 py-5">
          <StepDots total={3} current={step} />

          <AnimatePresence mode="wait">
            {/* Step 0: device type */}
            {step === 0 && (
              <motion.div
                key="type"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  What kind of device?
                </p>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {DEVICE_TYPES.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      onClick={() => setDeviceType(value)}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-semibold transition-all ${
                        deviceType === value
                          ? "border-green-500 bg-green-50 text-green-700"
                          : "border-gray-200 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <Icon size={18} />
                      {label}
                    </button>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Device name
                  </label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder='e.g. "Living room Samsung TV"'
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setStep(1)}
                  disabled={!deviceName.trim()}
                  className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                >
                  Next <ArrowRight size={15} />
                </button>
              </motion.div>
            )}

            {/* Step 1: instructions */}
            {step === 1 && (
              <motion.div
                key="instructions"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <MacInstructions deviceType={deviceType} />
                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(0)}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    className="flex-2 flex-grow py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition flex items-center justify-center gap-2 text-sm"
                  >
                    I have the MAC <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: enter MAC */}
            {step === 2 && (
              <motion.div
                key="mac"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
              >
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                  MAC address
                </label>
                <input
                  type="text"
                  value={macAddress}
                  onChange={handleMacInput}
                  placeholder="AA:BB:CC:DD:EE:FF"
                  className="w-full border border-gray-200 rounded-xl px-3 py-3 text-center font-mono text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent mb-1"
                />
                {/* Progress dots */}
                <div className="flex gap-1 justify-center mb-1">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 w-3 rounded-full transition-all ${
                        macAddress.replace(/:/g, "").length > i
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                {macError && (
                  <p className="text-xs text-red-500 text-center mb-2">{macError}</p>
                )}
                <p className="text-xs text-gray-400 text-center mb-5">
                  {macAddress.replace(/:/g, "").length} / 12 characters
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving || !isValidMac(macAddress)}
                    className="flex-grow py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 text-sm"
                  >
                    {saving ? (
                      <><RefreshCw size={14} className="animate-spin" /> Saving…</>
                    ) : (
                      <><Shield size={14} /> Bypass this device</>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: done */}
            {step === 3 && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-green-500" />
                </div>
                <p className="font-bold text-gray-900 mb-1">{deviceName}</p>
                <p className="text-sm text-gray-500 mb-1">
                  MAC: <span className="font-mono text-xs">{macAddress}</span>
                </p>
                <p className="text-xs text-gray-400 mb-6">
                  Your device is now registered. Connect it to Wi-Fi and it will
                  go online automatically — no login page.
                </p>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-left">
                  <p className="text-xs font-semibold text-amber-800 mb-1">
                    ⚠️ Important: disable MAC randomization
                  </p>
                  <p className="text-xs text-amber-700">
                    Some phones and tablets randomize their MAC address. On your
                    TV or device, go to Settings → Network and disable "Random
                    MAC" or "Private Wi-Fi address" so it always uses the same
                    address you just registered.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition"
                >
                  Done — start browsing
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}