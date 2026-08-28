
import { useState, useEffect, useCallback } from 'react'
import { Server, Cpu, HardDrive, Activity, RefreshCw, Monitor } from 'lucide-react'

const ProxmoxDashboard = () => {
  const [dashboard, setDashboard] = useState([])
  const [loading, setLoading] = useState(true)
  const subdomain = window.location.hostname.split('.')[0]

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await fetch('/api/proxmox/dashboard', {
        headers: { 'X-Subdomain': subdomain }
      })
      const data = await response.json()
      setDashboard(data.dashboard || [])
    } catch (error) {
      console.error('Failed to fetch Proxmox data:', error)
    } finally {
      setLoading(false)
    }
  }, [subdomain])

  useEffect(() => {
    fetchDashboard()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboard, 30000)
    return () => clearInterval(interval)
  }, [fetchDashboard])

  const formatBytes = (bytes) => {
    if (!bytes) return '0 GB'
    return `${(bytes / 1024 / 1024 / 1024).toFixed(1)} GB`
  }

  const formatPercent = (used, total) => {
    if (!total) return 0
    return ((used / total) * 100).toFixed(1)
  }

  const getStatusColor = (status) => {
    return status === 'online' ? 'text-green-500' : 'text-red-500'
  }

  if (loading) return (
    <div className="flex items-center justify-center py-12 font-sans">
      <RefreshCw size={24} className="animate-spin text-blue-500 mr-2" />
      <span>Loading Proxmox data...</span>
    </div>
  )

  return (
    <div className="p-6 font-sans space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Server size={24} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Proxmox Monitor
          </h1>
        </div>
        <button
          onClick={fetchDashboard}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Nodes */}
      {dashboard.map((node) => (
        <div key={node.node} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
          {/* Node Header */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Server size={20} className="text-blue-600" />
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">{node.node}</h2>
              <span className={`text-sm font-medium ${getStatusColor(node.status)}`}>
                ● {node.status}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              Uptime: {Math.floor(node.uptime / 3600)}h
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* Resource Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* CPU */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Cpu size={18} className="text-blue-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">CPU</span>
                </div>
                <p className="text-3xl font-bold text-blue-600">
                  {(node.cpu * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">{node.maxcpu} cores</p>
                <div className="mt-2 h-2 bg-blue-200 rounded-full">
                  <div
                    className="h-2 bg-blue-600 rounded-full"
                    style={{ width: `${(node.cpu * 100).toFixed(1)}%` }}
                  />
                </div>
              </div>

              {/* Memory */}
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity size={18} className="text-green-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">Memory</span>
                </div>
                <p className="text-3xl font-bold text-green-600">
                  {formatPercent(node.mem, node.maxmem)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatBytes(node.mem)} / {formatBytes(node.maxmem)}
                </p>
                <div className="mt-2 h-2 bg-green-200 rounded-full">
                  <div
                    className="h-2 bg-green-600 rounded-full"
                    style={{ width: `${formatPercent(node.mem, node.maxmem)}%` }}
                  />
                </div>
              </div>

              {/* Disk */}
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <HardDrive size={18} className="text-purple-600" />
                  <span className="font-semibold text-gray-900 dark:text-white">Disk</span>
                </div>
                <p className="text-3xl font-bold text-purple-600">
                  {formatPercent(node.disk, node.maxdisk)}%
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatBytes(node.disk)} / {formatBytes(node.maxdisk)}
                </p>
                <div className="mt-2 h-2 bg-purple-200 rounded-full">
                  <div
                    className="h-2 bg-purple-600 rounded-full"
                    style={{ width: `${formatPercent(node.disk, node.maxdisk)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* VMs */}
            {node.vms?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Monitor size={16} />
                  Virtual Machines ({node.vms.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {node.vms.map(vm => (
                    <div key={vm.vmid} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">{vm.name}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          vm.status === 'running' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {vm.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">ID: {vm.vmid} | CPU: {vm.cpus} cores</p>
                      <p className="text-xs text-gray-500">RAM: {formatBytes(vm.maxmem)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Containers */}
            {node.containers?.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Server size={16} />
                  Containers ({node.containers.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {node.containers.map(ct => (
                    <div key={ct.vmid} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-white">{ct.name}</span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          ct.status === 'running' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {ct.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">ID: {ct.vmid}</p>
                      <p className="text-xs text-gray-500">RAM: {formatBytes(ct.maxmem)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProxmoxDashboard