import { useState, useEffect } from "react";

const SUBDOMAIN = window?.location?.hostname?.split(".")[0] || "your-subdomain";

const headers = {
  "X-Subdomain": SUBDOMAIN,
  "Content-Type": "application/json",
};

function formatDate(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

function isToday(iso) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

function Modal({ open, title, body, confirmLabel, confirmVariant, onConfirm, onCancel }) {
  if (!open) return null;

  const confirmClasses =
    confirmVariant === "danger"
      ? "bg-[#A32D2D] text-[#FCEBEB] border-[#A32D2D]"
      : confirmVariant === "warn"
      ? "bg-[#854F0B] text-[#FAEEDA] border-[#854F0B]"
      : "bg-transparent text-[#1a1a1a] border-[#ddd]";

  return (
    <div className="fixed inset-0 bg-black/45 z-[100] flex items-center justify-center">
      <div className="bg-white rounded-xl border-[0.5px] border-[#ddd] p-6 w-[360px] max-w-[90%]">
        <p className="text-base font-medium mb-2">{title}</p>
        <p className="text-[13px] text-[#666] mb-5 leading-relaxed">{body}</p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-[7px] rounded-lg text-[13px] cursor-pointer border-[0.5px] border-[#ddd] bg-transparent text-[#1a1a1a]"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-[7px] rounded-lg text-[13px] cursor-pointer border-[0.5px] ${confirmClasses}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 bg-white border-[0.5px] border-[#ddd] rounded-lg px-4 py-[10px] text-[13px] flex items-center gap-2 z-[200]">
      <span className="text-[#1D9E75] text-base">✓</span>
      {message}
    </div>
  );
}

export default function FreeTrialUsers() {
  const [devices, setDevices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [logoutTarget, setLogoutTarget] = useState(null);

  useEffect(() => {
    fetchDevices();
  }, []);

  async function fetchDevices() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/hotspot_sessions/free_trial_devices", { headers });
      if (!res.ok) throw new Error("Failed to load devices");
      const data = await res.json();
      setDevices(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 2800);
  }

  async function handleDelete() {
    try {
      const res = await fetch(`/api/hotspot_sessions/free_trial_devices/${deleteTarget.id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) throw new Error("Delete failed");
      setDevices((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      showToast("Device record deleted");
    } catch (e) {
      showToast("Error: " + e.message);
    } finally {
      setDeleteTarget(null);
    }
  }

  async function handleLogout() {
    try {
      const res = await fetch("/api/hotspot_sessions/logout_user", {
        method: "POST",
        headers,
        body: JSON.stringify({ mac: logoutTarget.mac_address }),
      });
      if (!res.ok) throw new Error("Logout failed");
      showToast(`${logoutTarget.mac_address} logged out`);
    } catch (e) {
      showToast("Error: " + e.message);
    } finally {
      setLogoutTarget(null);
    }
  }

  const filtered = devices.filter(
    (d) =>
      d.mac_address.toLowerCase().includes(search.toLowerCase()) ||
      d.package.toLowerCase().includes(search.toLowerCase())
  );

  const totalToday = devices.filter((d) => isToday(d.used_at)).length;
  const uniquePackages = new Set(devices.map((d) => d.package)).size;

  return (
    <div className="max-w-[860px] mx-auto my-8 px-4 font-sans">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-lg font-medium m-0">Free trial users</h1>
          <p className="text-[13px] text-[#888] mt-0.5">
            Manage and monitor hotspot free trial sessions
          </p>
        </div>
        <button
          className="bg-transparent border-[0.5px] border-[#ddd] rounded-lg px-3 py-[7px] cursor-pointer text-[13px] text-[#666] hover:bg-[#f5f5f5]"
          onClick={fetchDevices}
        >
          ↻ Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        <div className="bg-[#f1f0e8] rounded-lg px-3.5 py-3">
          <p className="text-xs text-[#888] m-0 mb-1">Total devices</p>
          <p className="text-[22px] font-medium m-0">{devices.length}</p>
        </div>
        <div className="bg-[#f1f0e8] rounded-lg px-3.5 py-3">
          <p className="text-xs text-[#888] m-0 mb-1">Active today</p>
          <p className="text-[22px] font-medium m-0">{totalToday}</p>
        </div>
        <div className="bg-[#f1f0e8] rounded-lg px-3.5 py-3">
          <p className="text-xs text-[#888] m-0 mb-1">Packages</p>
          <p className="text-[22px] font-medium m-0">{uniquePackages}</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          className="w-full px-3 py-2 text-[13px] border-[0.5px] border-[#ddd] rounded-lg outline-none focus:border-[#bbb]"
          placeholder="Search by MAC or package…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="border-[0.5px] border-[#e0e0e0] rounded-xl overflow-hidden bg-white">
        {loading ? (
          <p className="text-center py-10 text-[#bbb] text-[13px]">Loading…</p>
        ) : error ? (
          <p className="text-center py-10 text-[13px] text-[#A32D2D]">{error}</p>
        ) : filtered.length === 0 ? (
          <p className="text-center py-10 text-[#bbb] text-[13px]">No devices found</p>
        ) : (
          <table className="w-full border-collapse text-[13px] table-fixed">
            <thead>
              <tr className="bg-[#f9f9f8]">
                <th className="w-[38%] px-3 py-2.5 text-left font-medium text-xs text-[#888] border-b-[0.5px] border-[#e0e0e0]">
                  MAC address
                </th>
                <th className="w-[25%] px-3 py-2.5 text-left font-medium text-xs text-[#888] border-b-[0.5px] border-[#e0e0e0]">
                  Package
                </th>
                <th className="w-[22%] px-3 py-2.5 text-left font-medium text-xs text-[#888] border-b-[0.5px] border-[#e0e0e0]">
                  Used at
                </th>
                <th className="w-[15%] px-3 py-2.5 text-right font-medium text-xs text-[#888] border-b-[0.5px] border-[#e0e0e0]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr
                  key={d.id}
                  className={i < filtered.length - 1 ? "border-b-[0.5px] border-[#e0e0e0]" : ""}
                >
                  <td className="px-3 py-[11px] align-middle whitespace-nowrap overflow-hidden text-ellipsis font-mono text-xs text-[#666]">
                    {d.mac_address}
                  </td>
                  <td className="px-3 py-[11px] align-middle whitespace-nowrap overflow-hidden text-ellipsis">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#E1F5EE] text-[#0F6E56]">
                      {d.package}
                    </span>
                  </td>
                  <td className="px-3 py-[11px] align-middle whitespace-nowrap overflow-hidden text-ellipsis text-[#888]">
                    {formatDate(d.used_at)}
                  </td>
                  <td className="px-3 py-[11px] align-middle whitespace-nowrap overflow-hidden text-ellipsis text-right">
                    <button
                      title="Log out device"
                      onClick={() => setLogoutTarget(d)}
                      className="border-[0.5px] border-[#ddd] rounded-lg px-2 py-[5px] cursor-pointer text-sm text-[#888] bg-transparent transition-colors hover:bg-[#FAEEDA] hover:text-[#854F0B] hover:border-[#FAC775]"
                    >
                      ⏏
                    </button>
                    <button
                      title="Delete record"
                      onClick={() => setDeleteTarget(d)}
                      className="ml-1.5 border-[0.5px] border-[#ddd] rounded-lg px-2 py-[5px] cursor-pointer text-sm text-[#888] bg-transparent transition-colors hover:bg-[#FCEBEB] hover:text-[#A32D2D] hover:border-[#F09595]"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modals */}
      <Modal
        open={!!deleteTarget}
        title="Delete device"
        body={`Remove ${deleteTarget?.mac_address} from the free trial list? This device will be able to claim a trial again.`}
        confirmLabel="Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <Modal
        open={!!logoutTarget}
        title="Log out device"
        body={`Disconnect ${logoutTarget?.mac_address} from the hotspot? The free trial record will remain intact.`}
        confirmLabel="Log out"
        confirmVariant="warn"
        onConfirm={handleLogout}
        onCancel={() => setLogoutTarget(null)}
      />

      <Toast message={toast} />
    </div>
  );
}