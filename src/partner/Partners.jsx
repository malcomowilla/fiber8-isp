
// src/components/partners/Partners.jsx (updated with MaterialTable)
import React, { useState, useEffect, useCallback } from 'react';
import MaterialTable from 'material-table';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
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
  LinearProgress
} from '@mui/material';
import {
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  Store as StoreIcon,
  Apartment as BuildingIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Paid as PaidIcon,
  History as HistoryIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  Error as ErrorIcon,
  MoreVert as MoreIcon
} from '@mui/icons-material';
import PartnerForm from './PartnerForm';
// import PartnerDetails from './PartnerDetails';
import PayoutManagement from './PayoutManagement';
import PartnerPortal from './PartnerPortal';

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openPayouts, setOpenPayouts] = useState(false);
  const [openPortal, setOpenPortal] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [stats, setStats] = useState({
    totalPartners: 0,
    activePartners: 0,
    totalCommissions: 0,
    pendingPayouts: 0,
    monthlyGrowth: 0
  });

  // Fetch partners
  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/partners');
      const data = await response.json();
      if (response.ok) {
        setPartners(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch partners:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const calculateStats = (partnersData) => {
    const total = partnersData.length;
    const active = partnersData.filter(p => p.status === 'active').length;
    const totalCommissions = partnersData.reduce((sum, p) => sum + (p.total_earned || 0), 0);
    const pendingPayouts = partnersData.reduce((sum, p) => sum + (p.pending_payout || 0), 0);
    
    setStats({
      totalPartners: total,
      activePartners: active,
      totalCommissions,
      pendingPayouts,
      monthlyGrowth: 12.5
    });
  };

  // MaterialTable columns
  const columns = [
    {
      title: 'Partner',
      field: 'name',
      render: (rowData) => (
        <Box display="flex" alignItems="center">
          <Avatar 
            sx={{ 
              mr: 2, 
              bgcolor: getAvatarColor(rowData.type),
              width: 40,
              height: 40
            }}
          >
            {rowData.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {rowData.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {rowData.type}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      title: 'Contact',
      field: 'email',
      render: (rowData) => (
        <Box>
          <Typography variant="body2">{rowData.email}</Typography>
          <Typography variant="caption" color="textSecondary">
            {rowData.phone}
          </Typography>
        </Box>
      )
    },
    {
      title: 'Commission',
      field: 'commission_rate',
      render: (rowData) => (
        <Chip 
          label={`${rowData.commission_rate}%`}
          size="small"
          color="primary"
          variant="outlined"
        />
      )
    },
    {
      title: 'Earnings',
      field: 'total_earned',
      render: (rowData) => (
        <Typography variant="body2" fontWeight="medium" color="success.main">
          ${rowData.total_earned?.toLocaleString() || '0'}
        </Typography>
      )
    },
    {
      title: 'Pending',
      field: 'pending_payout',
      render: (rowData) => (
        <Typography variant="body2" fontWeight="medium" color="warning.main">
          ${rowData.pending_payout?.toLocaleString() || '0'}
        </Typography>
      )
    },
    {
      title: 'Status',
      field: 'status',
      render: (rowData) => (
        <Chip 
          label={rowData.status}
          size="small"
          color={rowData.status === 'active' ? 'success' : 'default'}
          variant="filled"
        />
      )
    },
    {
      title: 'Hotspots',
      field: 'hotspots_count',
      render: (rowData) => (
        <Chip 
          label={rowData.hotspots_count || 0}
          size="small"
          variant="outlined"
        />
      )
    },
    {
      title: 'Last Payout',
      field: 'last_payout',
      render: (rowData) => (
        <Typography variant="body2">
          {rowData.last_payout ? new Date(rowData.last_payout).toLocaleDateString() : 'Never'}
        </Typography>
      )
    },
    {
      title: 'Actions',
      field: 'actions',
      render: (rowData) => (
        <Box display="flex" gap={1}>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => handleViewDetails(rowData)}>
              <ViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEditPartner(rowData)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="View Portal">
            <IconButton size="small" onClick={() => handleOpenPortal(rowData)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

  const getAvatarColor = (type) => {
    const colors = {
      landlord: '#4caf50',
      reseller: '#2196f3',
      affiliate: '#ff9800',
      agent: '#9c27b0'
    };
    return colors[type] || '#607d8b';
  };

  const handleAddPartner = () => {
    setFormMode('create');
    setSelectedPartner(null);
    setOpenForm(true);
  };

  const handleEditPartner = (partner) => {
    setFormMode('edit');
    setSelectedPartner(partner);
    setOpenForm(true);
  };

  const handleViewDetails = (partner) => {
    setSelectedPartner(partner);
    setOpenDetails(true);
  };

  const handleOpenPortal = (partner) => {
    setSelectedPartner(partner);
    setOpenPortal(true);
  };

  const handleManagePayouts = (partner) => {
    setSelectedPartner(partner);
    setOpenPayouts(true);
  };

  const filteredPartners = partners.filter(partner =>
    partner.name?.toLowerCase().includes(search.toLowerCase()) ||
    partner.email?.toLowerCase().includes(search.toLowerCase()) ||
    partner.phone?.includes(search)
  );

  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight="bold">
            Partner Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleAddPartner}
          >
            Add New Partner
          </Button>
        </Box>
        
        {/* Stats */}
        <Grid container spacing={3} mb={3}>
          {[
            { value: stats.totalPartners, label: 'Total Partners', icon: PeopleIcon, color: 'primary' },
            { value: stats.activePartners, label: 'Active', icon: CheckIcon, color: 'success' },
            { value: `$${stats.totalCommissions.toLocaleString()}`, label: 'Total Commissions', icon: MoneyIcon, color: 'warning' },
            { value: `$${stats.pendingPayouts.toLocaleString()}`, label: 'Pending Payouts', icon: PendingIcon, color: 'error' },
            { value: `+${stats.monthlyGrowth}%`, label: 'Monthly Growth', icon: TrendingUpIcon, color: 'info' }
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {stat.label}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: `${stat.color}.light` }}>
                      <stat.icon />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Search and Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center">
            <TextField
              placeholder="Search partners..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
              <InputLabel>Type</InputLabel>
              <Select label="Type" defaultValue="all">
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="landlord">Landlord</MenuItem>
                <MenuItem value="reseller">Reseller</MenuItem>
                <MenuItem value="affiliate">Affiliate</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select label="Status" defaultValue="all">
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            
            <Tooltip title="Refresh">
              <IconButton onClick={fetchPartners}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
            >
              More Filters
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
                <PeopleIcon sx={{ mr: 2, color: 'primary.main' }} />
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Partners
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {partners.length} total partners
                  </Typography>
                </Box>
              </Box>
            }
            columns={columns}
            data={filteredPartners}
            isLoading={loading}
            actions={[
              {
                icon: () => (
                  <Button
                    variant="contained"
                    startIcon={<PersonAddIcon />}
                    size="small"
                  >
                    Add Partner
                  </Button>
                ),
                tooltip: 'Add New Partner',
                isFreeAction: true,
                onClick: handleAddPartner
              },
              {
                icon: () => (
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    size="small"
                  >
                    Export
                  </Button>
                ),
                tooltip: 'Export to CSV',
                isFreeAction: true
              }
            ]}
            options={{
              sorting: true,
              search: false,
              paging: true,
              pageSize: 10,
              pageSizeOptions: [10, 25, 50],
              headerStyle: {
                backgroundColor: '#f8fafc',
                fontWeight: 'bold',
                fontSize: '0.875rem'
              },
              rowStyle: {
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer'
                }
              },
              maxBodyHeight: '500px'
            }}
            localization={{
              body: {
                emptyDataSourceMessage: (
                  <Box textAlign="center" py={4}>
                    <PeopleIcon sx={{ fontSize: 60, color: '#e0e0e0', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      No partners found
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Add your first partner to get started
                    </Typography>
                  </Box>
                )
              }
            }}
            onRowClick={(event, rowData) => handleViewDetails(rowData)}
          />
        </CardContent>
      </Card>

      {/* Modals */}
      <PartnerForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        partner={selectedPartner}
        mode={formMode}
        onSuccess={fetchPartners}
      />

      <PartnerDetails
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        partner={selectedPartner}
        onEdit={() => {
          setOpenDetails(false);
          handleEditPartner(selectedPartner);
        }}
        onManagePayouts={() => {
          setOpenDetails(false);
          handleManagePayouts(selectedPartner);
        }}
      />

      {selectedPartner && (
        <Dialog
          open={openPortal}
          onClose={() => setOpenPortal(false)}
          maxWidth="xl"
          fullWidth
          sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}
        >
          <DialogTitle>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">
                {selectedPartner.name} - Partner Portal
              </Typography>
              <IconButton onClick={() => setOpenPortal(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            <PartnerPortal partner={selectedPartner} />
          </DialogContent>
        </Dialog>
      )}

      <PayoutManagement
        open={openPayouts}
        onClose={() => setOpenPayouts(false)}
        partner={selectedPartner}
        onSuccess={fetchPartners}
      />
    </Container>
  );
};

export default Partners;