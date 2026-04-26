import React, { useState, useEffect } from 'react';
import MaterialTable from 'material-table';
import {
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Slider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Switch,
  Divider,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Avatar
} from '@mui/material';
import {
  AttachMoney,
  People,
  TrendingUp,
  BarChart,
  PieChart,
  Timeline,
  Settings,
  Add,
  Delete,
  Edit,
  Visibility,
  Share,
  Download,
  PersonAdd,
  Group,
  AccountBalance,
  MonetizationOn,
  CheckCircle,
  Cancel,
  Payment,
  Receipt,
  Percent,
  Star,
  TrendingFlat,
  MoreVert,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';

const ResellerCommissionDashboard = () => {
  // State for resellers
  const [resellers, setResellers] = useState([
    { 
      id: 1, 
      name: 'Tech Solutions Ltd', 
      email: 'contact@techsolutions.com',
      phone: '+1 (555) 123-4567',
      tier: 'Gold', 
      commissionRate: 15, 
      activeHotspots: 15,
      activeUsers: 245, 
      totalRevenue: 12500, 
      totalCommission: 1875,
      joinDate: '2024-01-15',
      status: 'Active',
      performance: 92,
      paymentMethod: 'Bank Transfer'
    },
    { 
      id: 2, 
      name: 'Connect Pro', 
      email: 'info@connectpro.com',
      phone: '+1 (555) 987-6543',
      tier: 'Silver', 
      commissionRate: 12, 
      activeHotspots: 12,
      activeUsers: 180, 
      totalRevenue: 8900, 
      totalCommission: 1068,
      joinDate: '2024-02-20',
      status: 'Active',
      performance: 85,
      paymentMethod: 'PayPal'
    },
    { 
      id: 3, 
      name: 'Net Masters', 
      email: 'sales@netmasters.com',
      phone: '+1 (555) 456-7890',
      tier: 'Bronze', 
      commissionRate: 10, 
      activeHotspots: 8,
      activeUsers: 95, 
      totalRevenue: 5200, 
      totalCommission: 520,
      joinDate: '2024-03-10',
      status: 'Active',
      performance: 78,
      paymentMethod: 'Bank Transfer'
    },
    { 
      id: 4, 
      name: 'Urban WiFi', 
      email: 'hello@urbanwifi.com',
      phone: '+1 (555) 321-0987',
      tier: 'Gold', 
      commissionRate: 15, 
      activeHotspots: 25,
      activeUsers: 310, 
      totalRevenue: 16500, 
      totalCommission: 2475,
      joinDate: '2024-01-05',
      status: 'Active',
      performance: 95,
      paymentMethod: 'Wire Transfer'
    },
    { 
      id: 5, 
      name: 'Digital Bridge', 
      email: 'support@digitalbridge.com',
      phone: '+1 (555) 654-3210',
      tier: 'Starter', 
      commissionRate: 8, 
      activeHotspots: 3,
      activeUsers: 45, 
      totalRevenue: 2100, 
      totalCommission: 168,
      joinDate: '2024-04-15',
      status: 'Active',
      performance: 65,
      paymentMethod: 'PayPal'
    },
  ]);

  // State for commission scenarios
  const [scenarios, setScenarios] = useState([
    {
      id: 1,
      name: 'Percentage of Revenue',
      description: 'Reseller gets fixed percentage of total revenue',
      formula: 'Commission = Total Revenue × Commission Rate',
      commissionRate: 15,
      minUsers: 0,
      maxUsers: 1000,
      status: 'Active',
      resellerCount: 5,
      createdDate: '2024-01-01'
    },
    {
      id: 2,
      name: 'Per User Commission',
      description: 'Fixed amount for each active user',
      formula: 'Commission = Active Users × $0.50',
      commissionRate: 0.5,
      minUsers: 0,
      maxUsers: 500,
      status: 'Active',
      resellerCount: 3,
      createdDate: '2024-01-15'
    },
    {
      id: 3,
      name: 'Tiered Commission',
      description: 'Commission rate increases with performance',
      formula: 'Tier 1: 10%, Tier 2: 12%, Tier 3: 15%',
      commissionRate: 'Variable',
      minUsers: 0,
      maxUsers: 1000,
      status: 'Active',
      resellerCount: 4,
      createdDate: '2024-02-01'
    },
    {
      id: 4,
      name: 'Bonus + Base',
      description: 'Base commission plus performance bonus',
      formula: '10% base + $500 bonus for targets',
      commissionRate: 10,
      minUsers: 0,
      maxUsers: 1000,
      status: 'Inactive',
      resellerCount: 2,
      createdDate: '2024-02-15'
    },
    {
      id: 5,
      name: 'Revenue Sharing',
      description: 'Share of total network revenue pool',
      formula: '(Individual Revenue ÷ Total) × Pool',
      commissionRate: 'Variable',
      minUsers: 100,
      maxUsers: 1000,
      status: 'Active',
      resellerCount: 3,
      createdDate: '2024-03-01'
    },
  ]);

  // State for commission payouts
  const [payouts, setPayouts] = useState([
    {
      id: 1,
      resellerName: 'Tech Solutions Ltd',
      period: 'December 2024',
      users: 245,
      revenue: 12500,
      commission: 1875,
      status: 'Paid',
      paymentDate: '2024-12-05',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 2,
      resellerName: 'Connect Pro',
      period: 'December 2024',
      users: 180,
      revenue: 8900,
      commission: 1068,
      status: 'Pending',
      paymentDate: '2025-01-05',
      paymentMethod: 'PayPal'
    },
    {
      id: 3,
      resellerName: 'Net Masters',
      period: 'December 2024',
      users: 95,
      revenue: 5200,
      commission: 520,
      status: 'Paid',
      paymentDate: '2024-12-05',
      paymentMethod: 'Bank Transfer'
    },
    {
      id: 4,
      resellerName: 'Urban WiFi',
      period: 'December 2024',
      users: 310,
      revenue: 16500,
      commission: 2475,
      status: 'Paid',
      paymentDate: '2024-12-05',
      paymentMethod: 'Wire Transfer'
    },
    {
      id: 5,
      resellerName: 'Digital Bridge',
      period: 'December 2024',
      users: 45,
      revenue: 2100,
      commission: 168,
      status: 'Processing',
      paymentDate: '2025-01-10',
      paymentMethod: 'PayPal'
    },
  ]);

  // State for simulation
  const [simulation, setSimulation] = useState({
    hotspotCount: 10,
    averageUsersPerHotspot: 50,
    averageRevenuePerUser: 2.5,
    commissionRate: 15,
    simulationPeriod: 30,
    selectedScenario: 1
  });

  // Dialog states
  const [addResellerDialog, setAddResellerDialog] = useState(false);
  const [addScenarioDialog, setAddScenarioDialog] = useState(false);
  const [viewPayoutDialog, setViewPayoutDialog] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);

  // New reseller form
  const [newReseller, setNewReseller] = useState({
    name: '',
    email: '',
    phone: '',
    tier: 'Starter',
    commissionRate: 8,
    activeHotspots: 0,
    paymentMethod: 'Bank Transfer'
  });

  // New scenario form
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    formula: '',
    commissionRate: 10,
    minUsers: 0,
    maxUsers: 1000,
    status: 'Active'
  });

  // Calculate totals
  const calculateTotals = () => {
    const totalResellers = resellers.length;
    const totalActiveUsers = resellers.reduce((sum, r) => sum + r.activeUsers, 0);
    const totalActiveHotspots = resellers.reduce((sum, r) => sum + r.activeHotspots, 0);
    const totalRevenue = resellers.reduce((sum, r) => sum + r.totalRevenue, 0);
    const totalCommission = resellers.reduce((sum, r) => sum + r.totalCommission, 0);
    const averageCommissionRate = resellers.reduce((sum, r) => sum + r.commissionRate, 0) / resellers.length;
    const totalPendingPayouts = payouts.filter(p => p.status === 'Pending' || p.status === 'Processing').reduce((sum, p) => sum + p.commission, 0);
    const totalPaidPayouts = payouts.filter(p => p.status === 'Paid').reduce((sum, p) => sum + p.commission, 0);

    return {
      totalResellers,
      totalActiveUsers,
      totalActiveHotspots,
      totalRevenue,
      totalCommission,
      averageCommissionRate,
      totalPendingPayouts,
      totalPaidPayouts
    };
  };

  const totals = calculateTotals();

  // Calculate simulation results
  const calculateSimulation = () => {
    const totalUsers = simulation.hotspotCount * simulation.averageUsersPerHotspot;
    const totalRevenue = totalUsers * simulation.averageRevenuePerUser;
    const totalCommission = totalRevenue * (simulation.commissionRate / 100);
    
    return {
      totalUsers,
      totalRevenue,
      totalCommission,
      dailyRevenue: totalRevenue / simulation.simulationPeriod,
      dailyCommission: totalCommission / simulation.simulationPeriod,
      commissionPerHotspot: totalCommission / simulation.hotspotCount,
      revenuePerUser: simulation.averageRevenuePerUser
    };
  };

  const simulationResults = calculateSimulation();

  // Material Table columns for resellers
  const resellerColumns = [
    {
      title: 'Reseller',
      field: 'name',
      render: (rowData) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
            {rowData.name.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="body2" fontWeight="medium">
              {rowData.name}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {rowData.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      title: 'Tier',
      field: 'tier',
      render: (rowData) => (
        <Chip
          label={rowData.tier}
          size="small"
          color={
            rowData.tier === 'Gold' ? 'warning' :
            rowData.tier === 'Silver' ? 'secondary' :
            rowData.tier === 'Bronze' ? 'default' : 'primary'
          }
          variant="outlined"
        />
      )
    },
    {
      title: 'Hotspots',
      field: 'activeHotspots',
      type: 'numeric',
      render: (rowData) => (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" fontWeight="bold">
            {rowData.activeHotspots}
          </Typography>
        </Box>
      )
    },
    {
      title: 'Active Users',
      field: 'activeUsers',
      type: 'numeric',
      render: (rowData) => (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" fontWeight="bold">
            {rowData.activeUsers}
          </Typography>
        </Box>
      )
    },
    {
      title: 'Revenue',
      field: 'totalRevenue',
      type: 'currency',
      currencySetting: { currencyCode: 'USD', minimumFractionDigits: 0 },
      render: (rowData) => (
        <Typography variant="body2" color="success.main" fontWeight="bold">
          ${rowData.totalRevenue.toLocaleString()}
        </Typography>
      )
    },
    {
      title: 'Commission',
      field: 'totalCommission',
      type: 'currency',
      currencySetting: { currencyCode: 'USD', minimumFractionDigits: 0 },
      render: (rowData) => (
        <Typography variant="body2" color="primary.main" fontWeight="bold">
          ${rowData.totalCommission.toLocaleString()}
        </Typography>
      )
    },
    {
      title: 'Commission Rate',
      field: 'commissionRate',
      render: (rowData) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" fontWeight="bold">
            {rowData.commissionRate}%
          </Typography>
          <IconButton size="small" onClick={() => handleEditCommissionRate(rowData)}>
            <Edit fontSize="small" />
          </IconButton>
        </Box>
      )
    },
    {
      title: 'Performance',
      field: 'performance',
      render: (rowData) => (
        <Box>
          <LinearProgress 
            variant="determinate" 
            value={rowData.performance} 
            color={
              rowData.performance >= 90 ? 'success' :
              rowData.performance >= 70 ? 'warning' : 'error'
            }
            sx={{ mb: 0.5 }}
          />
          <Typography variant="caption">
            {rowData.performance}%
          </Typography>
        </Box>
      )
    },
    {
      title: 'Status',
      field: 'status',
      render: (rowData) => (
        <Chip
          label={rowData.status}
          size="small"
          color={rowData.status === 'Active' ? 'success' : 'error'}
          variant="filled"
        />
      )
    },
  ];

  // Material Table columns for scenarios
  const scenarioColumns = [
    {
      title: 'Scenario Name',
      field: 'name',
      render: (rowData) => (
        <Box>
          <Typography variant="body2" fontWeight="medium">
            {rowData.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {rowData.description}
          </Typography>
        </Box>
      )
    },
    {
      title: 'Formula',
      field: 'formula',
      render: (rowData) => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {rowData.formula}
        </Typography>
      )
    },
    {
      title: 'Commission Rate',
      field: 'commissionRate',
      render: (rowData) => (
        <Typography variant="body2" fontWeight="bold" color="primary">
          {typeof rowData.commissionRate === 'number' ? `${rowData.commissionRate}%` : rowData.commissionRate}
        </Typography>
      )
    },
    {
      title: 'User Range',
      field: 'minUsers',
      render: (rowData) => (
        <Typography variant="body2">
          {rowData.minUsers} - {rowData.maxUsers} users
        </Typography>
      )
    },
    {
      title: 'Resellers',
      field: 'resellerCount',
      render: (rowData) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Group fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">
            {rowData.resellerCount} resellers
          </Typography>
        </Box>
      )
    },
    {
      title: 'Status',
      field: 'status',
      render: (rowData) => (
        <Chip
          label={rowData.status}
          size="small"
          color={rowData.status === 'Active' ? 'success' : 'default'}
        />
      )
    },
    {
      title: 'Created',
      field: 'createdDate',
      type: 'date'
    },
  ];

  // Material Table columns for payouts
  const payoutColumns = [
    {
      title: 'Reseller',
      field: 'resellerName'
    },
    {
      title: 'Period',
      field: 'period'
    },
    {
      title: 'Users',
      field: 'users',
      type: 'numeric'
    },
    {
      title: 'Revenue',
      field: 'revenue',
      type: 'currency',
      currencySetting: { currencyCode: 'USD', minimumFractionDigits: 0 },
      render: (rowData) => `$${rowData.revenue.toLocaleString()}`
    },
    {
      title: 'Commission',
      field: 'commission',
      type: 'currency',
      currencySetting: { currencyCode: 'USD', minimumFractionDigits: 0 },
      render: (rowData) => (
        <Typography variant="body2" color="primary.main" fontWeight="bold">
          ${rowData.commission.toLocaleString()}
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
          color={
            rowData.status === 'Paid' ? 'success' :
            rowData.status === 'Processing' ? 'warning' :
            rowData.status === 'Pending' ? 'info' : 'error'
          }
        />
      )
    },
    {
      title: 'Payment Date',
      field: 'paymentDate',
      type: 'date'
    },
    {
      title: 'Payment Method',
      field: 'paymentMethod'
    },
    {
      title: 'Actions',
      field: 'actions',
      render: (rowData) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => handleViewPayout(rowData)}>
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          {rowData.status === 'Pending' && (
            <Tooltip title="Mark as Paid">
              <IconButton size="small" onClick={() => handleMarkAsPaid(rowData)}>
                <CheckCircle fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )
    },
  ];

  // Handlers
  const handleAddReseller = () => {
    const newResellerData = {
      id: resellers.length + 1,
      ...newReseller,
      activeUsers: 0,
      totalRevenue: 0,
      totalCommission: 0,
      joinDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      performance: 50
    };
    
    setResellers([...resellers, newResellerData]);
    setAddResellerDialog(false);
    setNewReseller({
      name: '',
      email: '',
      phone: '',
      tier: 'Starter',
      commissionRate: 8,
      activeHotspots: 0,
      paymentMethod: 'Bank Transfer'
    });
  };

  const handleAddScenario = () => {
    const newScenarioData = {
      id: scenarios.length + 1,
      ...newScenario,
      resellerCount: 0,
      createdDate: new Date().toISOString().split('T')[0]
    };
    
    setScenarios([...scenarios, newScenarioData]);
    setAddScenarioDialog(false);
    setNewScenario({
      name: '',
      description: '',
      formula: '',
      commissionRate: 10,
      minUsers: 0,
      maxUsers: 1000,
      status: 'Active'
    });
  };

  const handleEditCommissionRate = (reseller) => {
    const newRate = prompt(`Enter new commission rate for ${reseller.name}:`, reseller.commissionRate);
    if (newRate && !isNaN(newRate)) {
      const updatedResellers = resellers.map(r => {
        if (r.id === reseller.id) {
          const newCommission = r.totalRevenue * (parseFloat(newRate) / 100);
          return { ...r, commissionRate: parseFloat(newRate), totalCommission: newCommission };
        }
        return r;
      });
      setResellers(updatedResellers);
    }
  };

  const handleViewPayout = (payout) => {
    setSelectedPayout(payout);
    setViewPayoutDialog(true);
  };

  const handleMarkAsPaid = (payout) => {
    setPayouts(payouts.map(p => 
      p.id === payout.id ? { ...p, status: 'Paid', paymentDate: new Date().toISOString().split('T')[0] } : p
    ));
  };

  const handleDeleteReseller = (resellerId) => {
    if (window.confirm('Are you sure you want to delete this reseller?')) {
      setResellers(resellers.filter(r => r.id !== resellerId));
    }
  };

  const handleDeleteScenario = (scenarioId) => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      setScenarios(scenarios.filter(s => s.id !== scenarioId));
    }
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          <MonetizationOn sx={{ mr: 2, verticalAlign: 'middle' }} />
          Reseller Commission Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage resellers, commission scenarios, and payout distributions
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Group color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">{totals.totalResellers}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Active Resellers
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'success.main' }}>
                +2 this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">{totals.totalActiveUsers.toLocaleString()}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Active Users
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'success.main' }}>
                +1,234 this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney color="warning" sx={{ mr: 1 }} />
                <Typography variant="h6">${totals.totalRevenue.toLocaleString()}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Total Revenue
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'success.main' }}>
                12.5% growth
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalance color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">${totals.totalCommission.toLocaleString()}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Total Commissions
              </Typography>
              <Typography variant="caption" sx={{ display: 'block', color: 'success.main' }}>
                ${totals.totalPendingPayouts.toLocaleString()} pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Resellers Table */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            <Group sx={{ mr: 1, verticalAlign: 'middle' }} />
            Resellers
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setAddResellerDialog(true)}
          >
            Add Reseller
          </Button>
        </Box>

        <MaterialTable
          title=""
          columns={resellerColumns}
          data={resellers}
          options={{
            search: true,
            paging: true,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20],
            actionsColumnIndex: -1,
            sorting: true,
            grouping: true,
            exportButton: true,
            exportAllData: true,
            filtering: true,
            headerStyle: {
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            },
            rowStyle: (rowData) => ({
              backgroundColor: rowData.status === 'Inactive' ? '#f9f9f9' : 'white'
            })
          }}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit Reseller',
              onClick: (event, rowData) => console.log('Edit', rowData)
            },
            {
              icon: 'delete',
              tooltip: 'Delete Reseller',
              onClick: (event, rowData) => handleDeleteReseller(rowData.id)
            },
            {
              icon: 'payment',
              tooltip: 'Make Payment',
              onClick: (event, rowData) => console.log('Payment', rowData)
            },
            {
              icon: 'visibility',
              tooltip: 'View Details',
              onClick: (event, rowData) => console.log('View', rowData)
            }
          ]}
          localization={{
            body: {
              emptyDataSourceMessage: 'No resellers found'
            },
            toolbar: {
              searchTooltip: 'Search resellers',
              searchPlaceholder: 'Search...'
            }
          }}
        />
      </Paper>

      {/* Commission Scenarios Table */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            <BarChart sx={{ mr: 1, verticalAlign: 'middle' }} />
            Commission Scenarios
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setAddScenarioDialog(true)}
          >
            Add Scenario
          </Button>
        </Box>

        <MaterialTable
          title=""
          columns={scenarioColumns}
          data={scenarios}
          options={{
            search: true,
            paging: true,
            pageSize: 5,
            pageSizeOptions: [5, 10, 20],
            actionsColumnIndex: -1,
            sorting: true,
            grouping: true,
            exportButton: true,
            filtering: true,
            headerStyle: {
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            }
          }}
          actions={[
            {
              icon: 'edit',
              tooltip: 'Edit Scenario',
              onClick: (event, rowData) => console.log('Edit', rowData)
            },
            {
              icon: 'delete',
              tooltip: 'Delete Scenario',
              onClick: (event, rowData) => handleDeleteScenario(rowData.id)
            },
            {
              icon: 'settings',
              tooltip: 'Configure',
              onClick: (event, rowData) => console.log('Configure', rowData)
            }
          ]}
          localization={{
            body: {
              emptyDataSourceMessage: 'No scenarios found'
            }
          }}
        />
      </Paper>

      {/* Commission Payouts Table */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            <Payment sx={{ mr: 1, verticalAlign: 'middle' }} />
            Commission Payouts
          </Typography>
          <Box>
            <Button
              variant="outlined"
              startIcon={<Download />}
              sx={{ mr: 1 }}
            >
              Export
            </Button>
            <Button
              variant="outlined"
              startIcon={<Receipt />}
            >
              Run Payroll
            </Button>
          </Box>
        </Box>

        <MaterialTable
          title=""
          columns={payoutColumns}
          data={payouts}
          options={{
            search: true,
            paging: true,
            pageSize: 10,
            pageSizeOptions: [5, 10, 20],
            actionsColumnIndex: -1,
            sorting: true,
            grouping: true,
            exportButton: true,
            filtering: true,
            headerStyle: {
              backgroundColor: '#f5f5f5',
              fontWeight: 'bold',
            },
            rowStyle: (rowData) => ({
              backgroundColor: rowData.status === 'Paid' ? '#f0f9f0' : 'white'
            })
          }}
          localization={{
            body: {
              emptyDataSourceMessage: 'No payouts found'
            }
          }}
        />
      </Paper>

      {/* Simulation Panel */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
          Commission Simulation
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Box sx={{ p: 2 }}>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" gutterBottom>
                    Number of Hotspots: {simulation.hotspotCount}
                  </Typography>
                  <Slider
                    value={simulation.hotspotCount}
                    onChange={(e, value) => setSimulation({...simulation, hotspotCount: value})}
                    min={1}
                    max={100}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" gutterBottom>
                    Average Users per Hotspot: {simulation.averageUsersPerHotspot}
                  </Typography>
                  <Slider
                    value={simulation.averageUsersPerHotspot}
                    onChange={(e, value) => setSimulation({...simulation, averageUsersPerHotspot: value})}
                    min={10}
                    max={200}
                    step={10}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" gutterBottom>
                    Average Revenue per User: ${simulation.averageRevenuePerUser}
                  </Typography>
                  <Slider
                    value={simulation.averageRevenuePerUser}
                    onChange={(e, value) => setSimulation({...simulation, averageRevenuePerUser: value})}
                    min={0.5}
                    max={10}
                    step={0.5}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" gutterBottom>
                    Commission Rate: {simulation.commissionRate}%
                  </Typography>
                  <Slider
                    value={simulation.commissionRate}
                    onChange={(e, value) => setSimulation({...simulation, commissionRate: value})}
                    min={5}
                    max={30}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                Simulation Results ({simulation.simulationPeriod} days):
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">
                      Total Users
                    </Typography>
                    <Typography variant="h6">
                      {simulationResults.totalUsers.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">
                      Total Revenue
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      ${simulationResults.totalRevenue.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">
                      Total Commission
                    </Typography>
                    <Typography variant="h6" color="primary.main">
                      ${simulationResults.totalCommission.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" color="textSecondary">
                      Per Hotspot
                    </Typography>
                    <Typography variant="body1">
                      ${simulationResults.commissionPerHotspot.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography variant="caption" color="textSecondary">
                  Daily Average:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="body2">
                    Revenue: ${simulationResults.dailyRevenue.toFixed(2)}
                  </Typography>
                  <Typography variant="body2">
                    Commission: ${simulationResults.dailyCommission.toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* Add Reseller Dialog */}
      <Dialog open={addResellerDialog} onClose={() => setAddResellerDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Reseller</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Company Name"
              value={newReseller.name}
              onChange={(e) => setNewReseller({...newReseller, name: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={newReseller.email}
              onChange={(e) => setNewReseller({...newReseller, email: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Phone"
              value={newReseller.phone}
              onChange={(e) => setNewReseller({...newReseller, phone: e.target.value})}
              margin="normal"
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Tier</InputLabel>
                  <Select
                    value={newReseller.tier}
                    onChange={(e) => setNewReseller({...newReseller, tier: e.target.value})}
                    label="Tier"
                  >
                    <MenuItem value="Starter">Starter</MenuItem>
                    <MenuItem value="Bronze">Bronze</MenuItem>
                    <MenuItem value="Silver">Silver</MenuItem>
                    <MenuItem value="Gold">Gold</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Commission Rate %"
                  type="number"
                  value={newReseller.commissionRate}
                  onChange={(e) => setNewReseller({...newReseller, commissionRate: e.target.value})}
                  margin="normal"
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Initial Hotspots"
              type="number"
              value={newReseller.activeHotspots}
              onChange={(e) => setNewReseller({...newReseller, activeHotspots: e.target.value})}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Payment Method</InputLabel>
              <Select
                value={newReseller.paymentMethod}
                onChange={(e) => setNewReseller({...newReseller, paymentMethod: e.target.value})}
                label="Payment Method"
              >
                <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                <MenuItem value="PayPal">PayPal</MenuItem>
                <MenuItem value="Wire Transfer">Wire Transfer</MenuItem>
                <MenuItem value="Check">Check</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddResellerDialog(false)}>Cancel</Button>
          <Button onClick={handleAddReseller} variant="contained">Add Reseller</Button>
        </DialogActions>
      </Dialog>

      {/* Add Scenario Dialog */}
      <Dialog open={addScenarioDialog} onClose={() => setAddScenarioDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Commission Scenario</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Scenario Name"
              value={newScenario.name}
              onChange={(e) => setNewScenario({...newScenario, name: e.target.value})}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={newScenario.description}
              onChange={(e) => setNewScenario({...newScenario, description: e.target.value})}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              fullWidth
              label="Formula"
              value={newScenario.formula}
              onChange={(e) => setNewScenario({...newScenario, formula: e.target.value})}
              margin="normal"
              placeholder="e.g., Commission = Revenue × Rate"
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Commission Rate (%)"
                  type="number"
                  value={newScenario.commissionRate}
                  onChange={(e) => setNewScenario({...newScenario, commissionRate: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={newScenario.status}
                    onChange={(e) => setNewScenario({...newScenario, status: e.target.value})}
                    label="Status"
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Min Users"
                  type="number"
                  value={newScenario.minUsers}
                  onChange={(e) => setNewScenario({...newScenario, minUsers: e.target.value})}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Max Users"
                  type="number"
                  value={newScenario.maxUsers}
                  onChange={(e) => setNewScenario({...newScenario, maxUsers: e.target.value})}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddScenarioDialog(false)}>Cancel</Button>
          <Button onClick={handleAddScenario} variant="contained">Add Scenario</Button>
        </DialogActions>
      </Dialog>

      {/* View Payout Dialog */}
      <Dialog open={viewPayoutDialog} onClose={() => setViewPayoutDialog(false)} maxWidth="sm" fullWidth>
        {selectedPayout && (
          <>
            <DialogTitle>Payout Details</DialogTitle>
            <DialogContent>
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="h6">{selectedPayout.resellerName}</Typography>
                    <Typography variant="body2" color="textSecondary">{selectedPayout.period}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Users</Typography>
                    <Typography variant="h6">{selectedPayout.users}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Revenue</Typography>
                    <Typography variant="h6" color="success.main">${selectedPayout.revenue.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Commission</Typography>
                    <Typography variant="h6" color="primary.main">${selectedPayout.commission.toLocaleString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Status</Typography>
                    <Chip
                      label={selectedPayout.status}
                      color={
                        selectedPayout.status === 'Paid' ? 'success' :
                        selectedPayout.status === 'Processing' ? 'warning' :
                        selectedPayout.status === 'Pending' ? 'info' : 'error'
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="body2" color="textSecondary">Payment Method</Typography>
                    <Typography variant="body1">{selectedPayout.paymentMethod}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">Payment Date</Typography>
                    <Typography variant="body1">{selectedPayout.paymentDate}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewPayoutDialog(false)}>Close</Button>
              {selectedPayout.status === 'Pending' && (
                <Button onClick={() => handleMarkAsPaid(selectedPayout)} variant="contained">
                  Mark as Paid
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ResellerCommissionDashboard;