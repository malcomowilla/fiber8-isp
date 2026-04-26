// src/components/partners/PayoutManagement.jsx
import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Stack,
  Checkbox,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Paid as PaidIcon,
  Pending as PendingIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  AccountBalanceWallet as WalletIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  MoreVert as MoreIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

// Mock data generator
const generateMockPayouts = () => {
  const partners = ['John Doe', 'Sarah Smith', 'Mike Johnson', 'Emily Brown', 'David Wilson'];
  const statuses = ['pending', 'processing', 'paid', 'failed'];
  const paymentMethods = ['Bank Transfer', 'Mobile Money', 'Cash', 'PayPal'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `payout-${i + 1}`,
    partner_id: `partner-${Math.floor(Math.random() * 5) + 1}`,
    partner_name: partners[Math.floor(Math.random() * partners.length)],
    partner_type: ['Landlord', 'Reseller', 'Affiliate'][Math.floor(Math.random() * 3)],
    amount: Math.floor(Math.random() * 1000) + 100,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    reference: `PAYOUT-REF-${1000 + i}`,
    payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    processed_at: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString() : null,
    notes: Math.random() > 0.7 ? 'Special payment requested' : '',
    bank_details: Math.random() > 0.5 ? {
      bank_name: 'Sample Bank',
      account_number: '1234567890',
      account_name: 'Test Account'
    } : null,
    mobile_money: Math.random() > 0.5 ? {
      provider: ['M-Pesa', 'Airtel Money', 'Tigo Pesa'][Math.floor(Math.random() * 3)],
      number: `07${Math.floor(Math.random() * 100000000)}`
    } : null
  }));
};

const PayoutManagement = () => {
  const [payouts, setPayouts] = useState([]);
  const [filteredPayouts, setFilteredPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPayouts, setSelectedPayouts] = useState([]);
  const [openProcessDialog, setOpenProcessDialog] = useState(false);
  const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    paid: 0,
    failed: 0,
    totalAmount: 0
  });

  // Initialize with mock data
  useEffect(() => {
    setTimeout(() => {
      const mockPayouts = generateMockPayouts();
      setPayouts(mockPayouts);
      setFilteredPayouts(mockPayouts);
      calculateStats(mockPayouts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    filterPayouts();
  }, [payouts, searchQuery, statusFilter]);

  const filterPayouts = () => {
    let filtered = payouts;

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.partner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.payment_method?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    setFilteredPayouts(filtered);
  };

  const calculateStats = (payoutData) => {
    const pending = payoutData.filter(p => p.status === 'pending').length;
    const processing = payoutData.filter(p => p.status === 'processing').length;
    const paid = payoutData.filter(p => p.status === 'paid').length;
    const failed = payoutData.filter(p => p.status === 'failed').length;
    const totalAmount = payoutData
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);

    setStats({ pending, processing, paid, failed, totalAmount });
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      const mockPayouts = generateMockPayouts();
      setPayouts(mockPayouts);
      setFilteredPayouts(mockPayouts);
      calculateStats(mockPayouts);
      setLoading(false);
    }, 500);
  };

  const handleProcessPayout = (payoutId) => {
    setProcessing(true);
    setTimeout(() => {
      setPayouts(prev => prev.map(p => 
        p.id === payoutId ? { ...p, status: 'processing' } : p
      ));
      setProcessing(false);
      setOpenProcessDialog(false);
      alert(`Payout ${payoutId} marked as processing!`);
    }, 1000);
  };

  const handleBulkProcess = () => {
    if (selectedPayouts.length === 0) return;

    setProcessing(true);
    setTimeout(() => {
      setPayouts(prev => prev.map(p => 
        selectedPayouts.includes(p.id) ? { ...p, status: 'processing' } : p
      ));
      setSelectedPayouts([]);
      setProcessing(false);
      setOpenBulkDialog(false);
      alert(`${selectedPayouts.length} payouts marked as processing!`);
    }, 1500);
  };

  const handleMarkAsPaid = (payoutId) => {
    setTimeout(() => {
      setPayouts(prev => prev.map(p => 
        p.id === payoutId ? { ...p, status: 'paid', processed_at: new Date().toISOString() } : p
      ));
      alert(`Payout ${payoutId} marked as paid!`);
    }, 500);
  };

  const handleExport = () => {
    // Mock export functionality
    alert('Export functionality would download CSV file in a real application');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      processing: '#2196f3',
      paid: '#4caf50',
      failed: '#f44336'
    };
    return colors[status] || '#9e9e9e';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <PendingIcon />,
      processing: <ScheduleIcon />,
      paid: <CheckIcon />,
      failed: <ErrorIcon />
    };
    return icons[status] || <PendingIcon />;
  };

  // MaterialTable columns
  const columns = [
    {
      title: 'Partner',
      field: 'partner_name',
      render: (rowData) => (
        <Box display="flex" alignItems="center">
          <Avatar 
            sx={{ 
              mr: 2, 
              bgcolor: rowData.partner_type === 'Landlord' ? '#4caf50' : 
                      rowData.partner_type === 'Reseller' ? '#2196f3' : '#ff9800',
              width: 36,
              height: 36
            }}
          >
            {rowData.partner_name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {rowData.partner_name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {rowData.partner_type}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      title: 'Amount',
      field: 'amount',
      render: (rowData) => (
        <Typography variant="body1" fontWeight="bold" color="primary">
          ${rowData.amount}
        </Typography>
      )
    },
    {
      title: 'Status',
      field: 'status',
      render: (rowData) => (
        <Chip
          icon={getStatusIcon(rowData.status)}
          label={rowData.status}
          size="small"
          sx={{
            backgroundColor: `${getStatusColor(rowData.status)}20`,
            color: getStatusColor(rowData.status),
            fontWeight: 'medium'
          }}
        />
      )
    },
    {
      title: 'Payment Method',
      field: 'payment_method',
      render: (rowData) => (
        <Typography variant="body2">
          {rowData.payment_method}
        </Typography>
      )
    },
    {
      title: 'Reference',
      field: 'reference',
      render: (rowData) => (
        <code style={{ 
          fontFamily: 'monospace', 
          fontSize: '0.75rem',
          backgroundColor: '#f5f5f5',
          padding: '2px 6px',
          borderRadius: '4px'
        }}>
          {rowData.reference}
        </code>
      )
    },
    {
      title: 'Date',
      field: 'created_at',
      render: (rowData) => (
        <Typography variant="body2">
          {new Date(rowData.created_at).toLocaleDateString()}
        </Typography>
      )
    },
    {
      title: 'Actions',
      field: 'actions',
      render: (rowData) => (
        <Stack direction="row" spacing={1}>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => {
                setSelectedPayout(rowData);
                setOpenDetailsDialog(true);
              }}
            >
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {rowData.status === 'pending' && (
            <Tooltip title="Process Payout">
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedPayout(rowData);
                  setOpenProcessDialog(true);
                }}
              >
                <PaidIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          
          {rowData.status === 'processing' && (
            <Tooltip title="Mark as Paid">
              <IconButton
                size="small"
                onClick={() => handleMarkAsPaid(rowData.id)}
              >
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      )
    }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
        <Typography variant="body2" sx={{ ml: 2 }}>Loading payout data...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Payout Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage partner payouts and commission disbursements
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight="bold" color="warning.main">
                    ${stats.totalAmount.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Pending Amount
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.light' }}>
                  <PendingIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Pending Payouts
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.light' }}>
                  <ScheduleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.processing}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Processing
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.light' }}>
                  <PaidIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.paid}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Paid This Month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.light' }}>
                  <CheckIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    {stats.failed}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Failed
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.light' }}>
                  <ErrorIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              placeholder="Search payouts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{ flexGrow: 1, maxWidth: 400 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="processing">Processing</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
            
            <Tooltip title="Refresh Data">
              <IconButton onClick={handleRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Main Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          <MaterialTable
            title={
              <Box display="flex" alignItems="center" p={2}>
                <PaidIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Payout Management
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {filteredPayouts.length} payouts • ${stats.totalAmount.toLocaleString()} pending
                  </Typography>
                </Box>
              </Box>
            }
            columns={columns}
            data={filteredPayouts}
            actions={[
              {
                icon: () => (
                  <Button
                    variant="contained"
                    startIcon={<PaidIcon />}
                    size="small"
                    onClick={() => setOpenBulkDialog(true)}
                    disabled={selectedPayouts.length === 0 || processing}
                  >
                    Process Selected ({selectedPayouts.length})
                  </Button>
                ),
                tooltip: 'Process Selected Payouts',
                isFreeAction: true
              },
              {
                icon: () => (
                  <Button
                    variant="outlined"
                    startIcon={<ScheduleIcon />}
                    size="small"
                  >
                    Schedule Payouts
                  </Button>
                ),
                tooltip: 'Schedule Payouts',
                isFreeAction: true
              }
            ]}
            options={{
              sorting: true,
              search: false,
              paging: true,
              pageSize: 10,
              pageSizeOptions: [10, 25, 50],
              selection: true,
              selectionProps: (rowData) => ({
                disabled: rowData.status !== 'pending',
                color: 'primary'
              }),
              headerStyle: {
                backgroundColor: '#f8fafc',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              },
              rowStyle: (rowData) => ({
                backgroundColor: rowData.status === 'pending' ? '#fff8e1' : 
                               rowData.status === 'processing' ? '#e3f2fd' : 
                               rowData.status === 'paid' ? '#e8f5e8' : '#ffebee',
                '&:hover': {
                  backgroundColor: rowData.status === 'pending' ? '#ffecb3' : 
                                 rowData.status === 'processing' ? '#bbdefb' : 
                                 rowData.status === 'paid' ? '#c8e6c9' : '#ffcdd2',
                  cursor: 'pointer'
                }
              }),
              maxBodyHeight: '500px'
            }}
            onSelectionChange={(rows) => {
              setSelectedPayouts(rows.map(row => row.id));
            }}
            onRowClick={(event, rowData) => {
              setSelectedPayout(rowData);
              setOpenDetailsDialog(true);
            }}
            localization={{
              body: {
                emptyDataSourceMessage: (
                  <Box textAlign="center" py={4}>
                    <PaidIcon sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      No payouts found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      All payouts are processed or no pending payouts available
                    </Typography>
                  </Box>
                )
              },
              toolbar: {
                nRowsSelected: '{0} row(s) selected'
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Process Payout Dialog */}
      <Dialog open={openProcessDialog} onClose={() => setOpenProcessDialog(false)}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Process Payout
            </Typography>
            <IconButton onClick={() => setOpenProcessDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPayout && (
            <Box mt={2}>
              <Alert severity="info" sx={{ mb: 3 }}>
                Processing payout for {selectedPayout.partner_name}
              </Alert>
              
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Amount" 
                    secondary={
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ${selectedPayout.amount}
                      </Typography>
                    }
                  />
                </ListItem>
                
                <Divider />
                
                <ListItem>
                  <ListItemText 
                    primary="Payment Method" 
                    secondary={selectedPayout.payment_method}
                  />
                </ListItem>
                
                <Divider />
                
                <ListItem>
                  <ListItemText 
                    primary="Reference" 
                    secondary={selectedPayout.reference}
                  />
                </ListItem>
                
                <Divider />
                
                <ListItem>
                  <ListItemText 
                    primary="Status" 
                    secondary={
                      <Chip
                        label={selectedPayout.status}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(selectedPayout.status)}20`,
                          color: getStatusColor(selectedPayout.status)
                        }}
                      />
                    }
                  />
                </ListItem>
              </List>
              
              <Box mt={3}>
                <Alert severity="warning">
                  This will mark the payout as processing. Confirm payment has been initiated.
                </Alert>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProcessDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => handleProcessPayout(selectedPayout?.id)} 
            variant="contained"
            disabled={processing}
            startIcon={processing ? <CircularProgress size={20} /> : <PaidIcon />}
          >
            {processing ? 'Processing...' : 'Confirm Processing'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Process Dialog */}
      <Dialog open={openBulkDialog} onClose={() => setOpenBulkDialog(false)}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Process Multiple Payouts
            </Typography>
            <IconButton onClick={() => setOpenBulkDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Alert severity="info" sx={{ mb: 3 }}>
              You are about to process {selectedPayouts.length} payouts
            </Alert>
            
            <Box mb={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Selected Payouts:
              </Typography>
              <List dense>
                {payouts
                  .filter(p => selectedPayouts.includes(p.id))
                  .slice(0, 5)
                  .map(payout => (
                    <ListItem key={payout.id}>
                      <ListItemIcon>
                        <PaidIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={payout.partner_name}
                        secondary={`$${payout.amount} • ${payout.reference}`}
                      />
                    </ListItem>
                  ))}
                {selectedPayouts.length > 5 && (
                  <ListItem>
                    <ListItemText 
                      primary={`...and ${selectedPayouts.length - 5} more`}
                      secondary=""
                    />
                  </ListItem>
                )}
              </List>
            </Box>
            
            <Box mt={3}>
              <Alert severity="warning">
                This action will mark all selected payouts as processing. Make sure payments have been initiated.
              </Alert>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBulkDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleBulkProcess} 
            variant="contained"
            disabled={processing || selectedPayouts.length === 0}
            startIcon={processing ? <CircularProgress size={20} /> : <PaidIcon />}
          >
            {processing ? 'Processing...' : `Process ${selectedPayouts.length} Payouts`}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Payout Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight="bold">
              Payout Details
            </Typography>
            <IconButton onClick={() => setOpenDetailsDialog(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedPayout && (
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Partner Information
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2 }}>
                      {selectedPayout.partner_name?.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedPayout.partner_name}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {selectedPayout.partner_type}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Amount
                  </Typography>
                  <Typography variant="h5" color="primary" fontWeight="bold">
                    ${selectedPayout.amount}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Status
                  </Typography>
                  <Chip
                    icon={getStatusIcon(selectedPayout.status)}
                    label={selectedPayout.status}
                    sx={{
                      backgroundColor: `${getStatusColor(selectedPayout.status)}20`,
                      color: getStatusColor(selectedPayout.status),
                      fontWeight: 'medium'
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Payment Method
                  </Typography>
                  <Typography variant="body1">
                    {selectedPayout.payment_method}
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Reference
                  </Typography>
                  <Typography variant="body1" fontFamily="monospace">
                    {selectedPayout.reference}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Created Date
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedPayout.created_at).toLocaleString()}
                  </Typography>
                </Grid>
                
                {selectedPayout.processed_at && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Processed Date
                    </Typography>
                    <Typography variant="body1">
                      {new Date(selectedPayout.processed_at).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
                
                {selectedPayout.notes && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                      Notes
                    </Typography>
                    <Typography variant="body1">
                      {selectedPayout.notes}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
          {selectedPayout?.status === 'pending' && (
            <Button 
              variant="contained"
              onClick={() => {
                setOpenDetailsDialog(false);
                setOpenProcessDialog(true);
              }}
            >
              Process Payout
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PayoutManagement;