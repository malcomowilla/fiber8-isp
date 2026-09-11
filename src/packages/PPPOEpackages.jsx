import DeleteIcon from '@mui/icons-material/Delete';
import { makeStyles } from '@mui/styles';
import { IconButton, Chip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import DeletePackage from '../delete/DeletePackage'
import MaterialTable from 'material-table'
import EditPackage from '../edit/EditPackage'
import { useState, useEffect, useCallback, useMemo } from 'react'
import PackageNotification from '.././notification/PackageNotification'
import DeletePackageNotification from '.././notification/DeletePackageNotification'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';
import { useDebounce } from 'use-debounce';
import { useApplicationSettings } from '../settings/ApplicationSettings'
import { Search, RefreshCw, CheckCircle2, XCircle, RotateCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// ─────────────────────────────────────────────────────────────────────────
// Design tokens — green / IBM Plex Mono, matches EditPackage.jsx
// ─────────────────────────────────────────────────────────────────────────
const GREEN = '#0f9d58';
const GREEN_DARK = '#0b7a44';
const GREEN_SOFT = 'rgba(15,157,88,0.08)';
const fontStack = "'IBM Plex Mono', 'Roboto Mono', monospace";

const PLAN_TYPE_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'standard', label: 'Standard' },
  { value: 'shared', label: 'Shared' },
  { value: 'dedicated', label: 'Dedicated' },
  { value: 'enterprise', label: 'Enterprise' },
];

const useStyles = makeStyles({
  customSearchFieldFocus: {
    '& .MuiOutlinedInput-input:focus': {
      border: '2px solid red',
      borderColor: 'transparent'
    },
  },
});

const PPPOEpackages = () => {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [loading, setloading] = useState(false)
  const [tableData, setTableData] = useState([])
  const {
    settingsformData,
    showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
    showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
    showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
    showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
  } = useApplicationSettings()

  const [openDelete, setOpenDelete] = useState(false);
  const [showNotification, setShowNotification] = useState(false)
  const [routerName, setRouterName] = useState('');
  const [creationError, setCreationError] = useState(false)
  const [error, setError] = useState([])
  const [deleteNotification, setDeleteNotification] = useState(false)
  const [planTypeFilter, setPlanTypeFilter] = useState('all')
  const [syncingId, setSyncingId] = useState(null)
  const [syncingAll, setSyncingAll] = useState(false)

  const initialValue = {
    name: '',
    router_profile_name: '',
    description: '',
    plan_type: 'standard',
    status: 'active',
    public: false,
    validity: '',
    validity_period_units: 'days',
    download_limit: '',
    upload_limit: '',
    price: '',
    upload_burst_limit: '',
    download_burst_limit: '',
    router_name: settingsformData.router_name,
    ip_pool: '',
    daily_charge: '',
    burst_threshold_download: '',
    burst_threshold_upload: '',
    burst_time: '',
    burst_upload_speed: '',
    burst_download_speed: '',
    aggregation: '',
    fup_enabled: false,
    fup_data_limit: '',
    fup_data_unit: 'GB',
    fup_throttle_plan_id: '',
    sync_immediately: true,
  }

  const [formData, setFormData] = useState(initialValue)

  const [offlineerror, setofflineerror] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [priceError, setPriceError] = useState(false)
  const [uploadLimitError, setUploadLimitError] = useState(false)
  const [downloadLimitError, setDownloadLimitError] = useState(false)
  const [validityError, setValidityError] = useState(false)
  const [uploadBurstSpeedError, setUploadBurstSpeedError] = useState(false)
  const [downloadBurstSpeedError, setDownloadBurstSpeedError] = useState(false)
  const [validityPeriodUnitError, setUnitsError] = useState(false)
  const [editPackage, setEditPackage] = useState(false)

  const [selectedRouter, setSelectedRouter] = useState('')

  const [search, setSearch] = useState('')
  const [searchchInput] = useDebounce(search, 1000)

  const handleRowClick = (event, rowData) => {
    setFormData(rowData);
    setEditPackage(true)
  };

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
      primary: { main: GREEN },
      background: {
        paper: isDark ? '#151515' : '#ffffff',
        default: isDark ? '#151515' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f1f1f1' : '#111111',
        secondary: isDark ? '#a3a3a3' : '#6b7280',
      },
    },
    typography: { fontFamily: fontStack },
  }), [isDark]);

  const handleClickOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const handleClickOpen = () => {
    setOpen(true);
    setFormData(initialValue)
    setEditPackage(false)
  };

  const handleClose = () => setOpen(false);

  useEffect(() => {
    setTimeout(() => { setofflineerror(false) }, 8000);
  }, [offlineerror]);

  const subdomain = window.location.hostname.split('.')[0]

  const createPackage = async (e) => {
    e.preventDefault();
    if (!selectedRouter) {
      toast.error(<p className='font-sans'>Please select a router</p>)
      return
    }
    if (!formData.ip_pool_id) {
      toast.error(<p className='font-sans'>Please select an IP pool for this router</p>)
      return
    }

    try {
      setNameError(false);
      setPriceError(false);
      setUploadLimitError(false);
      setDownloadLimitError(false);
      setUnitsError(false)
      let hasError = false;

      if (hasError) return;

      setloading(true);
      const url = formData.id ? `/api/update_package/${formData.id}` : '/api/create_package';
      const method = formData.id ? 'PATCH' : 'POST';
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify({
          package: {
            ...formData,
            router_name: settingsformData.router_name,
            use_radius: settingsformData.use_radius,
            nas_router: formData.nas_router,
            // The join table (package_routers) needs BOTH ids — this is what
            // router_attrs() on the backend actually reads to attach a router.
            routers: [
              { nas_router_id: formData.nas_router_id, ip_pool_id: formData.ip_pool_id },
            ],
          },
          sync_immediately: formData.sync_immediately !== false,
        })
      });

      const newData = await response.json();

      if (response.status === 402) {
        setTimeout(() => { window.location.href = '/license-expired' }, 1800);
      }
      if (response.status === 401) {
        toast.error(newData.error, { position: "top-center", duration: 4000 })
        setTimeout(() => { window.location.href = '/signin' }, 1900);
      }
      if (response.status === 423) {
        setTimeout(() => { window.location.href = '/account-locked' }, 1800);
      }

      if (response.ok) {
        setOpen(false);
        setloading(false);
        setShowNotification(true);
        setTimeout(() => { setShowNotification(false) }, 10000);
        setofflineerror(false);
        if (formData.id) {
          setTableData(tableData.map(item => (item.id === formData.id ? newData : item)));
          toast.success('package updated successfully', { position: "top-center", duration: 4000 })
        } else {
          setTableData([...tableData, newData]);
          toast.success('package created successfully', { position: "top-center", duration: 4000 })
        }
      } else {
        setOpen(true)
        setloading(false);
        toast.error(newData.error, { position: "top-center", duration: 8000 })
        setError(newData.error);
      }
    } catch (error) {
      setOpen(false);
      setloading(false);
      setofflineerror(true);
      toast.error('failed to update package server error', { position: "top-center", duration: 4000 })
    }
  }

  const fetchPackages = useCallback(async () => {
    try {
      const response = await fetch('/api/get_package', { headers: { 'X-Subdomain': subdomain } })
      const newData = await response.json()

      if (response.ok) {
        setTableData(newData.filter((poe_package) => {
          return search.toLowerCase() === '' ? poe_package : poe_package.name.toLowerCase().includes(search)
        }))
        if (response.status === 402) {
          setTimeout(() => { window.location.href = '/license-expired' }, 1800);
        }
        if (response.status === 401) {
          toast.error(newData.error, { position: "top-center", duration: 4000 })
          setTimeout(() => { window.location.href = '/signin' }, 1900);
        }
      } else {
        if (response.status === 402) {
          setTimeout(() => { window.location.href = '/license-expired' }, 1800);
        }
        if (response.status === 401) {
          toast.error(newData.error, { position: "top-center", duration: 4000 })
          setTimeout(() => { window.location.href = '/signin' }, 1900);
        }
        toast.error(newData.error, { position: 'top-center', duration: 5000 })
        toast.error('Failed to get packages', { position: 'top-center', duration: 4000 })
      }
    } catch (error) {
      console.log(error)
      setofflineerror(true)
    }
  }, [search])

  useEffect(() => { fetchPackages() }, [fetchPackages]);

  const deletePackage = async (id) => {
    try {
      const response = await fetch(`/api/package/${id}?router_name=${settingsformData.router_name}`, {
        method: "DELETE",
        headers: { 'X-Subdomain': subdomain },
      })
      if (response.ok) {
        setTableData((tableData) => tableData.filter(item => item.id !== id))
        toast.success('package deleted successfully', { position: "top-center", duration: 4000 })
      } else {
        const newData = await response.json()
        toast.error(newData.error, { position: 'top-center', duration: 4000 })
      }
    } catch (error) {
      toast.error(`failed to delete package, server error`)
    }
  }

  const handleSyncOne = async (pkg) => {
    setSyncingId(pkg.id)
    try {
      const response = await fetch(`/api/packages/${pkg.id}/sync`, {
        method: 'POST',
        headers: { 'X-Subdomain': subdomain },
      })
      const newData = await response.json()
      if (response.ok) {
        setTableData((prev) => prev.map((item) => (item.id === pkg.id ? newData : item)))
        toast.success(`${pkg.name} synced to router`, { position: 'top-center', duration: 3000 })
      } else {
        toast.error(newData.error || 'Sync failed', { position: 'top-center', duration: 4000 })
      }
    } catch (error) {
      toast.error('Sync failed, server error', { position: 'top-center', duration: 4000 })
    } finally {
      setSyncingId(null)
    }
  }

  const handleSyncAll = async () => {
    setSyncingAll(true)
    try {
      const response = await fetch('/api/packages/sync_all', {
        method: 'POST',
        headers: { 'X-Subdomain': subdomain },
      })
      const newData = await response.json()
      if (response.ok) {
        toast.success(`Queued ${newData.queued} package(s) for sync`, { position: 'top-center', duration: 3000 })
        setTimeout(fetchPackages, 2500)
      } else {
        toast.error(newData.error || 'Failed to queue sync', { position: 'top-center', duration: 4000 })
      }
    } catch (error) {
      toast.error('Failed to queue sync, server error', { position: 'top-center', duration: 4000 })
    } finally {
      setSyncingAll(false)
    }
  }

  // A package is considered synced when it has at least one router assignment
  // and every assignment reports synced === true.
  const packageSyncState = (pkg) => {
    const routers = pkg.package_routers || []
    if (routers.length === 0) return 'unknown'
    return routers.every((pr) => pr.synced) ? 'synced' : 'pending'
  }

  const filteredData = useMemo(() => {
    if (planTypeFilter === 'all') return tableData
    return tableData.filter((pkg) => (pkg.plan_type || 'standard') === planTypeFilter)
  }, [tableData, planTypeFilter])

  const statusChip = (status) => {
    const isActive = (status || 'active') === 'active'
    return (
      <Chip
        size="small"
        label={isActive ? 'active' : 'inactive'}
        style={{
          fontFamily: fontStack,
          fontSize: '11px',
          fontWeight: 700,
          backgroundColor: isActive ? GREEN_SOFT : 'rgba(107,114,128,0.12)',
          color: isActive ? GREEN_DARK : '#6b7280',
          border: `1px solid ${isActive ? 'rgba(15,157,88,0.35)' : 'rgba(107,114,128,0.3)'}`,
        }}
      />
    )
  }

  const DeleteButton = ({ id }) => (
    <IconButton style={{ color: '#8B0000' }} onClick={handleClickOpenDelete}>
      <DeleteIcon />
    </IconButton>
  );

  const EditButton = ({ rowData }) => (
    <IconButton style={{ color: GREEN }} onClick={() => handleClickOpen(rowData)}>
      <EditIcon />
    </IconButton>
  );

  const columns = [
    {
      title: 'Plan name', field: 'name',
      render: (rowData) => (
        <div>
          <p className='m-0 font-bold' style={{ fontFamily: fontStack }}>{rowData.name}</p>
          <p className='m-0 text-xs text-gray-500 dark:text-gray-400 capitalize' style={{ fontFamily: fontStack }}>
            {rowData.plan_type || 'standard'}
          </p>
        </div>
      ),
    },
    { title: 'Router', field: 'nas_router' },
    {
      title: 'Speed (Down/Up)', field: 'speed',
      render: (rowData) => (
        <span style={{ fontFamily: fontStack }}>
          {rowData.download_limit || rowData.speed || '-'}M / {rowData.upload_limit || ''}M
        </span>
      ),
    },
    {
      title: 'Price', field: 'price',
      render: (rowData) => <span style={{ fontFamily: fontStack, fontWeight: 700, color: GREEN_DARK }}>Ksh {Number(rowData.price || 0).toLocaleString()}</span>,
    },
    {
      title: 'Validity', field: 'validity',
      render: (rowData) => <span style={{ fontFamily: fontStack }}>{rowData.validity} {rowData.validity_period_units || 'days'}</span>,
    },
    {
      title: 'Status', field: 'status',
      render: (rowData) => statusChip(rowData.status),
    },
    {
      title: 'Sync', field: 'sync',
      render: (rowData) => {
        const state = packageSyncState(rowData)
        const isSyncing = syncingId === rowData.id
        return (
          <IconButton
            size="small"
            title={state === 'synced' ? 'Synced — click to re-sync' : 'Not synced — click to sync now'}
            onClick={(e) => { e.stopPropagation(); handleSyncOne(rowData) }}
            disabled={isSyncing}
          >
            {isSyncing ? (
              <RotateCw size={16} className='animate-spin' color={GREEN} />
            ) : state === 'synced' ? (
              <CheckCircle2 size={16} color={GREEN} />
            ) : (
              <XCircle size={16} color='#d97706' />
            )}
          </IconButton>
        )
      },
    },
    {
      title: 'Action', field: 'Action',
      render: (rowData) => (
        <>
          <DeleteButton id={rowData.id} />
          <EditButton rowData={rowData} />
        </>
      ),
    },
  ]

  return (
    <>
      <Toaster />
      <div
        className='overflow-hidden'
        style={{ fontFamily: fontStack }}
        onClick={() => {
          setShowMenu1(false); setShowMenu2(false); setShowMenu3(false); setShowMenu4(false)
          setShowMenu5(false); setShowMenu6(false); setShowMenu7(false); setShowMenu8(false)
          setShowMenu9(false); setShowMenu10(false); setShowMenu11(false); setShowMenu12(false)
        }}
      >
        <EditPackage
          open={open} uploadBurstSpeedError={uploadBurstSpeedError} downloadBurstSpeedError={downloadBurstSpeedError}
          handleClose={handleClose} formData={formData} validityError={validityError}
          nameError={nameError} uploadLimitError={uploadLimitError} downloadLimitError={downloadLimitError}
          isloading={loading} priceError={priceError} validityPeriodUnitError={validityPeriodUnitError}
          createPackage={createPackage} offlineerror={offlineerror}
          showNotification={showNotification} setofflineerror={setofflineerror} setFormData={setFormData}
          tableData={tableData} allPackages={tableData} routerName={routerName} setRouterName={setRouterName}
          editPackage={editPackage} setEditPackage={setEditPackage}
          selectedRouter={selectedRouter} setSelectedRouter={setSelectedRouter}
        />

        <DeletePackage
          openDelete={openDelete} handleCloseDelete={handleCloseDelete}
          deletePackage={deletePackage} id={formData.id} loading={loading}
        />

        {/* Header */}
        <div className='px-3 pt-3'>
          <p className='m-0 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400' style={{ fontFamily: fontStack }}>
            PPPoE · Plans
          </p>
          <div className='flex items-center justify-between flex-wrap gap-2'>
            <p className='m-0 text-xl font-bold dark:text-white' style={{ fontFamily: fontStack }}>PPPoE Packages</p>
            <div className='flex items-center gap-2'>
              <button
                onClick={handleSyncAll}
                disabled={syncingAll}
                style={{ fontFamily: fontStack, borderColor: GREEN, color: GREEN_DARK }}
                className='rounded-full px-4 py-2 text-sm font-semibold border flex items-center gap-1.5
                  hover:bg-[rgba(15,157,88,0.08)] transition disabled:opacity-50 disabled:cursor-not-allowed'
              >
                <RefreshCw size={15} className={syncingAll ? 'animate-spin' : ''} /> Sync all
              </button>
              <button
                onClick={handleClickOpen}
                style={{ fontFamily: fontStack, backgroundColor: GREEN }}
                className='rounded-full px-5 py-2 text-sm font-semibold text-white flex items-center gap-1
                  hover:opacity-90 transition'
              >
                <AddIcon fontSize='small' /> New plan
              </button>
            </div>
          </div>
        </div>

        {/* Plan-type filter chips */}
        <div className='flex gap-2 px-3 pt-3 flex-wrap'>
          {PLAN_TYPE_FILTERS.map((f) => {
            const isActive = planTypeFilter === f.value
            return (
              <button
                key={f.value}
                onClick={() => setPlanTypeFilter(f.value)}
                style={{
                  fontFamily: fontStack,
                  borderColor: isActive ? GREEN : 'rgba(0,0,0,0.12)',
                  backgroundColor: isActive ? GREEN_SOFT : 'transparent',
                  color: isActive ? GREEN_DARK : 'inherit',
                }}
                className='rounded-full px-4 py-1.5 text-xs font-semibold border transition dark:text-gray-200'
              >
                {f.label}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="flex items-center max-w-sm px-3 py-3">
          <label htmlFor="simple-search" className="sr-only">Search</label>
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <Search className='w-4 h-4' color={GREEN} />
            </div>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ fontFamily: fontStack }}
              className="bg-gray-50 border border-gray-300 text-gray-900
              text-sm rounded-full focus:ring-2 focus:ring-[#0f9d58] focus:border-[#0f9d58] block w-full ps-10 p-2.5
              dark:bg-[#151515] dark:border-[#333] dark:placeholder-gray-400 dark:text-white"
              placeholder="Search for packages..."
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#e5e0d5] dark:border-[#2a2a2a] overflow-hidden shadow-sm mx-3">
          <ThemeProvider theme={tableTheme}>
            <MaterialTable
              columns={columns}
              title={<p style={{ fontFamily: fontStack }} className='font-bold text-xl'>PPPoE Packages</p>}
              data={filteredData}
              icons={{ Add: () => <AddIcon onClick={handleClickOpen} /> }}
              actions={[
                { icon: () => <AddIcon style={{ color: GREEN }} onClick={handleClickOpen} />, isFreeAction: true, tooltip: 'Add Package' },
                { icon: () => <GetAppIcon style={{ color: GREEN }} />, isFreeAction: true, tooltip: 'Import' },
              ]}
              onRowClick={handleRowClick}
              localization={{
                body: {
                  emptyDataSourceMessage: <p style={{ fontFamily: fontStack }}>No packages found. Create your first package to get started!</p>
                },
              }}
              options={{
                sorting: true,
                pageSizeOptions: [2, 5, 10, 20],
                pageSize: 20,
                paginationPosition: 'bottom',
                exportButton: true,
                exportAllData: true,
                selection: true,
                search: false,
                searchAutoFocus: true,
                showSelectAllCheckbox: false,
                showTextRowsSelected: false,
                emptyRowsWhenPaging: false,
                actionsColumnIndex: -1,
                headerStyle: {
                  fontFamily: fontStack,
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: '12px',
                  backgroundColor: isDark ? '#1c1c1c' : '#f2faf6',
                  color: isDark ? '#f1f1f1' : '#0b7a44',
                  borderBottom: isDark ? '2px solid #2a2a2a' : `2px solid ${GREEN_SOFT}`,
                },
                rowStyle: (rowData, index) => ({
                  backgroundColor: isDark
                    ? (index % 2 === 0 ? '#151515' : '#1c1c1c')
                    : (index % 2 === 0 ? '#ffffff' : '#f9fdfb'),
                  color: isDark ? '#f1f1f1' : '#111111',
                  fontFamily: fontStack,
                }),
              }}
            />
          </ThemeProvider>
        </div>

        <div className='px-3'>
          {showNotification && <PackageNotification />}
          {deleteNotification && <DeletePackageNotification />}
          {creationError && (
            <Stack sx={{ width: '50%', mt: 2 }} spacing={1}>
              <Alert severity="error">
                <AlertTitle>Package Error</AlertTitle>
                <p className='font-extrabold text-2xl' style={{ fontFamily: fontStack, color: '#dc2626' }}>{error}</p>
              </Alert>
            </Stack>
          )}
        </div>

        <div className='px-3'>
          {offlineerror && (
            <Stack sx={{ width: '50%', marginTop: 3 }}>
              <Alert severity="error">
                <AlertTitle>Offline</AlertTitle>
                <p className='font-extrabold text-2xl' style={{ fontFamily: fontStack, color: '#dc2626' }}>
                  Something went wrong please try again later
                </p>
              </Alert>
            </Stack>
          )}
        </div>
      </div>
    </>
  )
}

export default PPPOEpackages