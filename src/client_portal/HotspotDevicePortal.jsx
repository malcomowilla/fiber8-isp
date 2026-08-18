

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






function PortalLogin({ onLogin }) {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const subdomain = getSubdomain();

  const submit = async (e) => {
    e.preventDefault();
    if (!phone.trim()) { toast.error("Enter your phone number"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/hotspot/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Subdomain": subdomain },
        body: JSON.stringify({ phone_number: phone }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "No account found for this number"); return; }
      onLogin(data.token, data.customer);
    } catch {
      toast.error("Could not connect. Check your internet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Wifi size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">My Hotspot Account</h1>
          <p className="text-sm text-gray-400 mt-1">
            Log in with the phone number you paid with
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white
              uppercase tracking-wide mb-1.5">
                Phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712 345 678"
                className="w-full bg-white/8 border border-white/12 rounded-xl px-4 py-3
                 text-sm text-black placeholder-white/25 focus:outline-none focus:border-green-500/60 focus:ring-1 focus:ring-green-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold
               rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <RefreshCw size={15} className="animate-spin" />
              ) : (
                <LogIn size={15} />
              )}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-600 mt-4">
          Use the same phone number you used to pay for your TV plan or voucher
        </p>
      </motion.div>
    </div>
  );
}




function PortalDashboard({ token, customer, onLogout }) {
  const subdomain = getSubdomain();
  const [tab, setTab]           = useState("overview");
  const [session, setSession]   = useState(null);
  const [devices, setDevices]   = useState([]);
  const [plans, setPlans]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showAdd, setShowAdd]   = useState(false);
  const [deleting, setDeleting] = useState(null);

  // Add device form state
  const [addForm, setAddForm]   = useState({ name: "", mac: "", type: "tv" });
  const [addErr, setAddErr]     = useState("");
  const [addSaving, setAddSaving] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const authHeaders = useCallback(
    () => ({ Authorization: `Bearer ${token}`, "X-Subdomain": subdomain }),
    [token, subdomain]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sRes, dRes, pRes] = await Promise.all([
        fetch("/api/hotspot/portal/session",    { headers: authHeaders() }),
        fetch("/api/hotspot/portal/my_devices", { headers: authHeaders() }),
        fetch("/api/allow_get_hotspot_packages", { headers: { "X-Subdomain": subdomain } }),
      ]);
      const [s, d, p] = await Promise.all([sRes.json(), dRes.json(), pRes.json()]);
      setSession(s);
      setDevices(Array.isArray(d) ? d : d.devices || []);
      setPlans(Array.isArray(p) ? p : []);
    } catch {
      toast.error("Failed to load account data");
    } finally {
      setLoading(false);
    }
  }, [authHeaders, subdomain]);

  useEffect(() => { load(); }, [load]);

  const handleAddDevice = async (e) => {
    e.preventDefault();
    if (!isValidMac(addForm.mac)) { setAddErr("Enter a valid MAC (AA:BB:CC:DD:EE:FF)"); return; }
    if (!addForm.name.trim()) { toast.error("Give the device a name"); return; }
    setAddSaving(true);
    try {
      const res = await fetch("/api/hotspot/portal/add_device", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ mac_address: addForm.mac, device_name: addForm.name, device_type: addForm.type }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to add device"); return; }
      toast.success(`${addForm.name} added — it will connect automatically!`);
      setDevices((p) => [data, ...p]);
      setAddForm({ name: "", mac: "", type: "tv" });
      setShowAdd(false);
      setShowInstructions(false);
    } catch {
      toast.error("Network error");
    } finally {
      setAddSaving(false);
    }
  };

  const removeDevice = async (device) => {
    setDeleting(device.id);
    try {
      const res = await fetch(`/api/hotspot/portal/devices/${device.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) { toast.error("Failed to remove device"); return; }
      toast.success(`${device.device_name} removed`);
      setDevices((p) => p.filter((d) => d.id !== device.id));
    } catch {
      toast.error("Network error");
    } finally {
      setDeleting(null);
    }
  };

  const renew = async (planId) => {
    try {
      const res = await fetch("/api/hotspot/portal/renew", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ plan_id: planId }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Renewal failed"); return; }
      toast.success("Plan renewed successfully!");
      load();
    } catch {
      toast.error("Network error");
    }
  };

  const TABS = [
    { id: "overview", label: "Overview",   Icon: Wifi },
    { id: "devices",  label: "My Devices", Icon: Tv,         badge: devices.length },
    { id: "plans",    label: "Buy Data",   Icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans
">
      <div className="max-w-lg mx-auto px-4 py-6">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Wifi size={18} />
            </div>
            <div>
              <p className="font-bold text-sm">{customer?.username || "My Account"}</p>
              <p className="text-xs text-gray-500">Hotspot Portal</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/10 rounded-lg px-3 py-1.5 transition"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white/5 border border-white/8 rounded-xl p-1 mb-5 overflow-x-auto">
          {TABS.map(({ id, label, Icon, badge }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                tab === id
                  ? "bg-green-500/15 text-green-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon size={13} />
              {label}
              {badge > 0 && (
                <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-1.5 rounded-full">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-4"
            >
              {loading ? (
                <div className="flex justify-center py-12">
                  <RefreshCw size={24} className="animate-spin text-green-500" />
                </div>
              ) : (
                <>
                  {/* Balance card */}
                  <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Account status
                      </p>
                      <button onClick={load} className="text-gray-500 hover:text-white transition">
                        <RefreshCw size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {[
                        { label: "Plan", value: session?.plan || "—" },
                        { label: "Expires", value: session?.expiry ? new Date(session.expiry).toLocaleDateString("en-KE", { day: "numeric", month: "short" }) : "—" },
                        { label: "Sessions", value: session?.sessions ?? "—" },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-white/5 rounded-xl p-3">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">{label}</p>
                          <p className="text-sm font-bold">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => { setTab("plans"); }}
                      className="p-4 bg-green-500/8 border border-green-500/20 rounded-xl text-left hover:border-green-500/40 hover:bg-green-500/12 transition"
                    >
                      <Zap size={18} className="text-green-400 mb-2" />
                      <p className="text-sm font-bold">Buy Data</p>
                      <p className="text-xs text-gray-500">Top up your plan</p>
                    </button>
                    <button
                      onClick={() => { setTab("devices"); setShowAdd(true); }}
                      className="p-4 bg-cyan-500/8 border border-cyan-500/20 rounded-xl text-left hover:border-cyan-500/40 hover:bg-cyan-500/12 transition"
                    >
                      <Tv size={18} className="text-cyan-400 mb-2" />
                      <p className="text-sm font-bold">Add Device</p>
                      <p className="text-xs text-gray-500">Bypass TV login</p>
                    </button>
                  </div>

                  {/* TV setup info */}
                  <div className="bg-cyan-500/6 border border-cyan-500/15 rounded-xl p-4">
                    <div className="flex gap-2">
                      <Info size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                      <div className="text-xs text-cyan-300/80 leading-relaxed">
                        <strong className="text-cyan-300">Register your Smart TV</strong> and it will
                        connect to Wi-Fi automatically — no login page, no voucher. Perfect for TVs,
                        gaming consoles, printers, and any device that can't open a browser.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ── MY DEVICES ── */}
          {tab === "devices" && (
            <motion.div
              key="devices"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-4"
            >
              {/* Add device form */}
              <div className="bg-white/5 border border-white/8 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setShowAdd((p) => !p)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-2">
                    <Plus size={15} className="text-green-400" />
                    <span className="text-sm font-semibold">Add TV or device</span>
                  </div>
                  <motion.div animate={{ rotate: showAdd ? 45 : 0 }}>
                    <Plus size={14} className="text-gray-500" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showAdd && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/8 overflow-hidden"
                    >
                      <form onSubmit={handleAddDevice} className="p-5 space-y-4">
                        {/* Device type */}
                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            Device type
                          </label>
                          <div className="grid grid-cols-3 gap-1.5">
                            {DEVICE_TYPES.map(({ value, label, Icon }) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setAddForm((p) => ({ ...p, type: value }))}
                                className={`flex flex-col items-center gap-1 py-2 rounded-lg border text-[11px] font-semibold transition ${
                                  addForm.type === value
                                    ? "border-green-500 bg-green-500/10 text-green-400"
                                    : "border-white/10 text-gray-500 hover:border-white/20"
                                }`}
                              >
                                <Icon size={14} />
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">
                            Device name
                          </label>
                          <input
                            type="text"
                            value={addForm.name}
                            onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                            placeholder='e.g. "Bedroom TV"'
                            className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-green-500/50"
                          />
                        </div>

                        {/* MAC instructions toggle */}
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                              MAC address
                            </label>
                            <button
                              type="button"
                              onClick={() => setShowInstructions((p) => !p)}
                              className="text-[11px] text-cyan-400 hover:text-cyan-300"
                            >
                              {showInstructions ? "Hide" : "How to find it?"}
                            </button>
                          </div>

                          <AnimatePresence>
                            {showInstructions && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden mb-2"
                              >
                                <MacInstructions deviceType={addForm.type} />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <input
                            type="text"
                            value={addForm.mac}
                            onChange={(e) => {
                              const v = formatMac(e.target.value);
                              setAddForm((p) => ({ ...p, mac: v }));
                              if (addErr && isValidMac(v)) setAddErr("");
                            }}
                            placeholder="AA:BB:CC:DD:EE:FF"
                            className="w-full bg-white/6 border border-white/12 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 font-mono focus:outline-none focus:border-green-500/50"
                          />
                          {addErr && (
                            <p className="text-xs text-red-400 mt-1">{addErr}</p>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={addSaving}
                          className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {addSaving ? (
                            <><RefreshCw size={14} className="animate-spin" /> Adding…</>
                          ) : (
                            <><Shield size={14} /> Bypass This Device</>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Device list */}
              {devices.length === 0 && !showAdd ? (
                <div className="text-center py-10">
                  <Tv size={32} className="text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No devices added yet</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Add your TV or console to skip the login page
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <AnimatePresence>
                    {devices.map((device, i) => (
                      <motion.div
                        key={device.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 bg-white/4 border border-white/8 rounded-xl p-3"
                      >
                        <div className="w-9 h-9 bg-cyan-500/12 border border-cyan-500/20 rounded-xl flex items-center justify-center text-cyan-400 shrink-0">
                          <Smartphone type={device.device_type} size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{device.device_name}</p>
                          <p className="text-[11px] font-mono text-gray-500">
                            {device.mac_address}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              device.status === "active"
                                ? "bg-green-500/15 text-green-400"
                                : "bg-yellow-500/15 text-yellow-400"
                            }`}
                          >
                            {device.status || "Active"}
                          </span>
                          <button
                            onClick={() => removeDevice(device)}
                            disabled={deleting === device.id}
                            className="p-1.5 rounded-lg border border-red-500/20 bg-red-500/8 text-red-400 hover:bg-red-500/16 transition disabled:opacity-50"
                          >
                            {deleting === device.id ? (
                              <RefreshCw size={11} className="animate-spin" />
                            ) : (
                              <Trash2 size={11} />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              <div className="bg-cyan-500/6 border border-cyan-500/15 rounded-xl p-3">
                <p className="text-xs text-cyan-300/80 leading-relaxed">
                  ℹ️ Devices listed here bypass the hotspot login page. They connect to
                  Wi-Fi normally but go online automatically. Remove a device to block it.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── BUY DATA ── */}
          {tab === "plans" && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-3"
            >
              {loading ? (
                <div className="flex justify-center py-12">
                  <RefreshCw size={24} className="animate-spin text-green-500" />
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">
                  No plans available
                </div>
              ) : (
                plans.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between bg-white/5 border border-white/8 rounded-xl p-4 hover:border-green-500/30 hover:bg-green-500/5 transition"
                  >
                    <div>
                      <p className="font-bold">{plan.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {plan.valid} · {plan.upload_limit || "Unlimited"} speed
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-green-400">
                        KES {Number(plan.price || 0).toLocaleString()}
                      </p>
                      <button
                        onClick={() => renew(plan.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition"
                      >
                        Buy
                      </button>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HotspotDevicePortal() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("hsp_token") || null
  );
  const [customer, setCustomer] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem("hsp_customer")); }
    catch { return null; }
  });

  const handleLogin = (t, c) => {
    sessionStorage.setItem("hsp_token", t);
    sessionStorage.setItem("hsp_customer", JSON.stringify(c));
    setToken(t);
    setCustomer(c);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("hsp_token");
    sessionStorage.removeItem("hsp_customer");
    setToken(null);
    setCustomer(null);
  };

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            fontFamily: "inherit",
            fontSize: 13,
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid rgba(255,255,255,.1)",
          },
        }}
      />
      <AnimatePresence mode="wait">
  {token ? (
    <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <PortalDashboard token={token} customer={customer} onLogout={handleLogout} />
    </motion.div>
  ) : (
    <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <PortalLogin onLogin={handleLogin} />
    </motion.div>
  )}
</AnimatePresence>
    </>
  );
}