import React, { useState, useEffect, useMemo } from 'react';
import MaterialTable from 'material-table';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Divider,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Stack,
  Paper
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import RouteIcon from '@mui/icons-material/Route';
import toast, { Toaster } from 'react-hot-toast';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Client-side sanity check only — the backend is the source of truth.
// Private networks are always CIDR blocks (e.g. 10.5.50.0/24).
const CIDR_REGEX = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;

const PrivateNetwork = () => {
  const subdomain = window.location.hostname.split('.')[0];

  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState(false);
  const [currentNetwork, setCurrentNetwork] = useState(null);

  // The private LAN(s) reachable THROUGH this peer over WireGuard —
  // e.g. 10.5.50.0/24. This is the `private_ip` column on the backend.
  // (The peer's own tunnel address, `allowed_ips` / e.g. 10.2.0.154,
  // is server-assigned and never edited here — see the read-only
  // "Peer IP" display in the dialog and table below.)
  const [allowedIps, setAllowedIps] = useState([]);
  const [networkInput, setNetworkInput] = useState('');
  const [networkInputError, setNetworkInputError] = useState('');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadButton, setLoadButton] = useState(false);
  const [loadRefresh, setLoadRefresh] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [networkToDelete, setNetworkToDelete] = useState(null);

  const {
    setShowMenu1, setShowMenu2, setShowMenu3, setShowMenu4, setShowMenu5,
    setShowMenu6, setShowMenu7, setShowMenu8, setShowMenu9, setShowMenu10,
    setShowMenu11, setShowMenu12,
  } = useApplicationSettings();

  const closeAllMenus = () => {
    setShowMenu1(false); setShowMenu2(false); setShowMenu3(false);
    setShowMenu4(false); setShowMenu5(false); setShowMenu6(false);
    setShowMenu7(false); setShowMenu8(false); setShowMenu9(false);
    setShowMenu10(false); setShowMenu11(false); setShowMenu12(false);
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

  // ---------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/wireguard_peers', {
        headers: { 'X-Subdomain': subdomain }
      });
      const result = await response.json();

      if (response.ok) {
        setData(result);
        return;
      }

      if (response.status === 401) {
        toast.error(result.error, { position: 'top-center', duration: 4000 });
        setTimeout(() => { window.location.href = '/signin'; }, 1900);
      }

      if (response.status === 402) {
        setTimeout(() => { window.location.href = '/license-expired'; }, 1800);
      }

      throw new Error(result.error || 'Failed to fetch IP networks');
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const refreshNetwork = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoadRefresh(true);

    try {
      const response = await fetch('/api/wireguard_peers', {
        headers: { 'X-Subdomain': subdomain }
      });
      const result = await response.json();

      if (response.ok) {
        setData(result);
        toast.success('IP networks refreshed successfully', {
          position: 'top-center',
          duration: 5000,
        });
        return;
      }

      toast.error('Failed to refresh IP networks', {
        position: 'top-center',
        duration: 5000,
      });

      if (response.status === 401) {
        toast.error(result.error, { position: 'top-center', duration: 4000 });
        setTimeout(() => { window.location.href = '/signin'; }, 1900);
      }

      if (response.status === 402) {
        setTimeout(() => { window.location.href = '/license-expired'; }, 1800);
      }

      throw new Error(result.error || 'Failed to fetch IP networks');
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
      setLoadRefresh(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // ---------------------------------------------------------------------
  // Dialog helpers
  // ---------------------------------------------------------------------

  const resetForm = () => {
    setAllowedIps([]);
    setNetworkInput('');
    setNetworkInputError('');
  };

  const handleOpenAddDialog = () => {
    setEditing(false);
    setCurrentNetwork(null);
    resetForm();
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (rowData) => {
    setEditing(true);
    setCurrentNetwork(rowData);
    // private_ip holds the LAN network(s) behind this peer
    setAllowedIps(splitNetworks(rowData.private_ip));
    setNetworkInput('');
    setNetworkInputError('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // ---------------------------------------------------------------------
  // Private networks — add one at a time, or paste/type several at once
  // separated by commas, spaces, or newlines.
  // ---------------------------------------------------------------------

  const splitNetworks = (value) =>
    (value || '')
      .split(/[,\s]+/)
      .map((n) => n.trim())
      .filter(Boolean);

  // Takes raw text that may contain several networks and adds every
  // valid, not-yet-added one. Returns the list of invalid entries (if any).
  const addNetworksFromText = (text) => {
    const candidates = splitNetworks(text);
    if (candidates.length === 0) return;

    const invalid = [];
    const toAdd = [];

    candidates.forEach((candidate) => {
      if (!CIDR_REGEX.test(candidate)) {
        invalid.push(candidate);
        return;
      }
      if (allowedIps.includes(candidate) || toAdd.includes(candidate)) {
        return; // silently skip duplicates
      }
      toAdd.push(candidate);
    });

    if (toAdd.length > 0) {
      setAllowedIps((prev) => [...prev, ...toAdd]);
    }

    if (invalid.length > 0) {
      setNetworkInputError(
        `Skipped invalid network${invalid.length > 1 ? 's' : ''}: ${invalid.join(', ')}`
      );
    } else {
      setNetworkInputError('');
    }
  };

  const handleAddNetwork = () => {
    if (!networkInput.trim()) return;
    addNetworksFromText(networkInput);
    setNetworkInput('');
  };

  const handleNetworkInputKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddNetwork();
    }
  };

  const handleNetworkInputPaste = (e) => {
    const pasted = e.clipboardData.getData('text');
    if (/[,\s]/.test(pasted.trim())) {
      e.preventDefault();
      addNetworksFromText(pasted);
      setNetworkInput('');
    }
  };

  const handleRemoveNetwork = (network) => {
    setAllowedIps((prev) => prev.filter((n) => n !== network));
  };

  // ---------------------------------------------------------------------
  // Create / update
  //
  // NOTE: this form only ever edits `private_ip` (the LAN networks
  // behind an existing peer). The peer's own tunnel address
  // (`allowed_ips`, always 10.2.x.x) is server-assigned and never
  // sent from here.
  // ---------------------------------------------------------------------

  const handleSubmit = async () => {
    if (allowedIps.length === 0) {
      showSnackbar('Add at least one private network, e.g. 10.5.50.0/24', 'error');
      return;
    }

    try {
      setLoading(true);
      setLoadButton(true);

      const url = editing
        ? `/api/wireguard_peers/${currentNetwork.id}`
        : '/api/wireguard_peers';
      const method = editing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain
        },
        body: JSON.stringify({
          wireguard_peer: {
            private_ip: allowedIps
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
          (Array.isArray(errorData.errors) ? errorData.errors.join(', ') : null) ||
          'Request failed'
        );
      }

      showSnackbar(
        editing ? 'Network updated successfully' : 'Network created successfully'
      );
      fetchData();
      setOpenDialog(false);
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
      setLoadButton(false);
    }
  };

  // ---------------------------------------------------------------------
  // Delete
  // ---------------------------------------------------------------------

  const handleDeleteClick = (id) => {
    setNetworkToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setNetworkToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/wireguard_peers/${networkToDelete}`, {
        method: 'DELETE',
        headers: { 'X-Subdomain': subdomain }
      });

      if (!response.ok) {
        throw new Error('Failed to delete network');
      }

      showSnackbar('Network deleted successfully');
      fetchData();
    } catch (error) {
      showSnackbar(error.message, 'error');
    } finally {
      setLoading(false);
      setDeleteConfirmOpen(false);
      setNetworkToDelete(null);
    }
  };

  // ---------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------

  return (
    <>
      <Toaster />

      <div onClick={closeAllMenus}>
        <Paper
          elevation={0}
          className="font-sans"
          sx={{
            p: 2.5,
            mb: 3,
            border: '1px solid',
            borderColor: isDark ? '#2a2a2a' : '#e5e0d5',
            borderRadius: 2,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
            <RouteIcon color="success" />
            <Typography variant="h5" className="font-sans" sx={{ fontWeight: 700 }}>
              Private Routes Management
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="flex-start">
            <InfoOutlinedIcon fontSize="small" color="action" sx={{ mt: '2px' }} />
            <Typography variant="body2" color="text.secondary" className="font-sans">
              Each row is an existing WireGuard peer (identified by its own
              tunnel address, e.g. <code>10.2.0.154</code>). Add the private
              subnet(s) behind that peer (e.g. <code>10.5.50.0/24</code>) so
              this site can reach them over WireGuard — useful for TR-069
              ONU management.
            </Typography>
          </Stack>
        </Paper>

        <ThemeProvider theme={tableTheme}>
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <MaterialTable
              title=""
              columns={[
                {
                  // The peer's own WireGuard tunnel address — always
                  // 10.2.x.x, server-assigned, read-only here.
                  title: <p className="text-sm font-sans font-semibold">Peer IP</p>,
                  field: 'allowed_ips',
                },
                {
                  title: <p className="text-sm font-sans font-semibold">Date Created</p>,
                  field: 'created_at',
                },
                {
                  // The LAN network(s) reachable through that peer.
                  title: <p className="text-sm font-sans font-semibold">Private Networks</p>,
                  field: 'private_ip',
                  cellStyle: { maxWidth: 280, whiteSpace: 'normal' },
                  headerStyle: { maxWidth: 280 },
                  render: (rowData) => (
                    <Stack direction="row" flexWrap="wrap" gap={0.5}>
                      {splitNetworks(rowData.private_ip).length === 0 && (
                        <Typography variant="body2" color="text.secondary">—</Typography>
                      )}
                      {splitNetworks(rowData.private_ip).map((network) => (
                        <Chip key={network} label={network} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  ),
                },
                {
                  title: <p className="text-sm font-sans font-semibold">Status</p>,
                  field: 'status',
                },
              ]}
              data={data}
              isLoading={loading}
              actions={[
                {
                  icon: () => (
                    <Tooltip title="Add Private Network">
                      <IconButton color="primary">
                        <AddCircleIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  ),
                  tooltip: 'Add Private Network',
                  isFreeAction: true,
                  onClick: handleOpenAddDialog
                },
                {
                  icon: () => (
                    <Tooltip title="Refresh For Latest Data">
                      <Button
                        variant="contained"
                        className="font-sans"
                        sx={{ textTransform: 'none' }}
                        startIcon={
                          <RefreshIcon className={loadRefresh ? 'animate-spin' : ''} />
                        }
                      >
                        Refresh
                      </Button>
                    </Tooltip>
                  ),
                  isFreeAction: true,
                  onClick: refreshNetwork
                },
                {
                  icon: () => <EditIcon color="primary" />,
                  tooltip: 'Edit Network',
                  onClick: (event, rowData) => handleOpenEditDialog(rowData)
                },
                {
                  icon: () => <DeleteIcon color="error" />,
                  tooltip: 'Delete Network',
                  onClick: (event, rowData) => handleDeleteClick(rowData.id)
                }
              ]}
              localization={{
                body: {
                  emptyDataSourceMessage: (
                    <p className="font-sans">
                      No private networks found. Create your first private network to get started!
                    </p>
                  )
                },
              }}
              options={{
                sorting: true,
                pageSizeOptions: [2, 5, 10, 20],
                pageSize: 20,
                paginationPosition: 'bottom',
                exportButton: true,
                exportAllData: true,
                selection: false,
                search: false,
                searchAutoFocus: true,
                showSelectAllCheckbox: false,
                showTextRowsSelected: false,
                emptyRowsWhenPaging: false,
                actionsColumnIndex: -1,
                headerStyle: {
                  fontFamily: 'monospace',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  fontSize: '12px',
                  backgroundColor: isDark ? '#2a2a2a' : '#f4f1ea',
                  color: isDark ? '#f1f1f1' : '#1a1a1a',
                  borderBottom: isDark ? '2px solid #3a3a3a' : '2px solid #e5e0d5',
                },
                rowStyle: (rowData, index) => ({
                  backgroundColor: isDark
                    ? (index % 2 === 0 ? '#1e1e1e' : '#262626')
                    : (index % 2 === 0 ? '#ffffff' : '#fafaf7'),
                  color: isDark ? '#f1f1f1' : '#1a1a1a',
                }),
              }}
            />
          </div>
        </ThemeProvider>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onClose={handleDeleteCancel}>
          <DialogTitle sx={{ display: 'flex', alignItems: 'center' }} className="font-sans">
            <WarningIcon color="warning" sx={{ mr: 1 }} />
            Confirm Deletion
          </DialogTitle>
          <DialogContent>
            <Typography className="font-sans">
              Are you sure you want to delete this private network?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} className="font-sans">
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              startIcon={<WarningIcon />}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }} className="font-sans">
            {editing ? 'Edit Private Network' : 'Add Private Network'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={3}>
              {editing && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" className="font-sans">
                    Peer IP: <code>{currentNetwork?.allowed_ips}</code> (assigned automatically, cannot be changed)
                  </Typography>
                </Grid>
              )}

              <Grid item xs={12}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="subtitle2" color="text.secondary" className="font-sans" sx={{ mb: 1 }}>
                  Private Networks (reachable through this peer)
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    fullWidth
                    size="small"
                    className="myTextField"
                    label="Add network(s)"
                    placeholder="10.5.50.0/24 — or paste several at once"
                    value={networkInput}
                    onChange={(e) => {
                      setNetworkInput(e.target.value);
                      if (networkInputError) setNetworkInputError('');
                    }}
                    onKeyDown={handleNetworkInputKeyDown}
                    onPaste={handleNetworkInputPaste}
                    error={!!networkInputError}
                    helperText={
                      networkInputError ||
                      'Press Enter to add, or paste/type several separated by commas, spaces, or new lines'
                    }
                  />
                  <Button
                    variant="outlined"
                    onClick={handleAddNetwork}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Add
                  </Button>
                </Stack>

                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {allowedIps.length === 0 && (
                    <Typography variant="body2" color="text.secondary" className="font-sans">
                      No networks added yet.
                    </Typography>
                  )}
                  {allowedIps.map((network) => (
                    <Chip
                      key={network}
                      label={network}
                      onDelete={() => handleRemoveNetwork(network)}
                      variant="outlined"
                    />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} variant="outlined" color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={loadButton}
              startIcon={loadButton && <CircularProgress size={20} />}
            >
              {editing ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default PrivateNetwork;