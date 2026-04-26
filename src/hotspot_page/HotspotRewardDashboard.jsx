import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Tabs,
  Tab,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  Badge,
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  AccountCircle,
  AccessTime,
  Speed,
  Wifi,
  Share,
  Star,
  EmojiEvents,
  TrendingUp,
  GroupAdd,
  History,
  Redeem,
  Add,
  Remove,
  AttachMoney,
  QueryStats,
  PersonAdd,
  LockOpen,
  Timer,
  Bolt
} from '@mui/icons-material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
// ==================== MAIN REWARDS DASHBOARD ====================
const HotspotRewardsDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Mock customer data
  const [customers, setCustomers] = useState([
    {
      id: 1,
      name: 'John Smith',
      macAddress: 'AA:BB:CC:DD:EE:01',
      totalPoints: 1250,
      loyaltyPoints: 800,
      referralPoints: 450,
      internetUsage: '2.5 hours today',
      status: 'active',
      joinDate: '2024-01-15',
      referredCount: 3,
      tier: 'Gold'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      macAddress: 'AA:BB:CC:DD:EE:02',
      totalPoints: 780,
      loyaltyPoints: 600,
      referralPoints: 180,
      internetUsage: '1 hour today',
      status: 'active',
      joinDate: '2024-02-10',
      referredCount: 1,
      tier: 'Silver'
    },
    {
      id: 3,
      name: 'Mike Chen',
      macAddress: 'AA:BB:CC:DD:EE:03',
      totalPoints: 2150,
      loyaltyPoints: 1200,
      referralPoints: 950,
      internetUsage: '4 hours today',
      status: 'premium',
      joinDate: '2023-12-01',
      referredCount: 7,
      tier: 'Platinum'
    },
    {
      id: 4,
      name: 'Emma Davis',
      macAddress: 'AA:BB:CC:DD:EE:04',
      totalPoints: 450,
      loyaltyPoints: 400,
      referralPoints: 50,
      internetUsage: '30 mins today',
      status: 'active',
      joinDate: '2024-03-05',
      referredCount: 0,
      tier: 'Bronze'
    }
  ]);

  // Available rewards
  const rewards = [
    { id: 1, name: '1 Hour Internet', points: 100, type: 'time', icon: <AccessTime /> },
    { id: 2, name: '2 Hours Internet', points: 180, type: 'time', icon: <Timer /> },
    { id: 3, name: 'Premium Speed (1 Day)', points: 500, type: 'speed', icon: <Bolt /> },
    { id: 4, name: 'Unlimited Day Pass', points: 1000, type: 'access', icon: <LockOpen /> },
    { id: 5, name: 'Social Media Boost', points: 300, type: 'boost', icon: <TrendingUp /> },
    { id: 6, name: 'Free Month', points: 3000, type: 'access', icon: <CardGiftcardIcon /> }
  ];

  // Points earning rules
  const earningRules = [
    { action: 'Daily Login', points: 10, frequency: 'Daily' },
    { action: 'Each Hour Online', points: 5, frequency: 'Per Hour' },
    { action: 'Refer a Friend', points: 150, frequency: 'Per Referral' },
    { action: 'Friend\'s First Purchase', points: 100, frequency: 'Per Purchase' },
    { action: 'Social Media Share', points: 50, frequency: 'Daily' },
    { action: 'Leave Review', points: 200, frequency: 'One Time' }
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRedeem = (customer, reward) => {
    setSelectedCustomer(customer);
    setSelectedReward(reward);
    setRedeemDialogOpen(true);
  };

  const confirmRedeem = () => {
    // Mock redemption logic
    const updatedCustomers = customers.map(c => 
      c.id === selectedCustomer.id 
        ? { ...c, totalPoints: c.totalPoints - selectedReward.points }
        : c
    );
    
    setCustomers(updatedCustomers);
    setSuccessMessage(`${selectedCustomer.name} redeemed ${selectedReward.name} successfully!`);
    setRedeemDialogOpen(false);
    setSelectedCustomer(null);
    setSelectedReward(null);
  };

  const handleAddPoints = (customerId, points) => {
    const updatedCustomers = customers.map(c => 
      c.id === customerId 
        ? { ...c, totalPoints: c.totalPoints + points }
        : c
    );
    setCustomers(updatedCustomers);
  };

  const getTierColor = (tier) => {
    switch(tier) {
      case 'Platinum': return '#e5e4e2';
      case 'Gold': return '#ffd700';
      case 'Silver': return '#c0c0c0';
      default: return '#cd7f32';
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        <EmojiEvents sx={{ mr: 1, verticalAlign: 'middle' }} />
        Hotspot Rewards Management
      </Typography>
      
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Manage customer internet access based on loyalty and referral points
      </Typography>

      {/* Stats Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Star color="warning" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h5">{customers.reduce((sum, c) => sum + c.totalPoints, 0)}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Total Points in System
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupAdd color="success" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h5">{customers.reduce((sum, c) => sum + c.referredCount, 0)}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Total Referrals
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp color="info" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h5">{customers.length}</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Active Customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Redeem color="secondary" sx={{ mr: 1, fontSize: 30 }} />
                <Typography variant="h5">12</Typography>
              </Box>
              <Typography variant="body2" color="textSecondary">
                Redemptions Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Customer Points" icon={<AccountCircle />} iconPosition="start" />
          <Tab label="Rewards Catalog" icon={<CardGiftcardIcon />} iconPosition="start" />
          <Tab label="Earning Rules" icon={<QueryStats />} iconPosition="start" />
          <Tab label="Referral System" icon={<PersonAdd />} iconPosition="start" />
        </Tabs>

        {/* Tab 1: Customer Points */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Customer Points Management
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><strong>Customer</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                    <TableCell><strong>Total Points</strong></TableCell>
                    <TableCell><strong>Loyalty Points</strong></TableCell>
                    <TableCell><strong>Referral Points</strong></TableCell>
                    <TableCell><strong>Internet Usage</strong></TableCell>
                    <TableCell><strong>Actions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar sx={{ mr: 2, bgcolor: getTierColor(customer.tier) }}>
                            {customer.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{customer.name}</Typography>
                            <Typography variant="caption" color="textSecondary">
                              {customer.macAddress}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={customer.tier} 
                          size="small" 
                          sx={{ 
                            bgcolor: getTierColor(customer.tier),
                            color: customer.tier === 'Gold' ? '#000' : '#fff'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="h6" color="primary">
                          {customer.totalPoints}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Star color="warning" sx={{ mr: 1, fontSize: 16 }} />
                          {customer.loyaltyPoints}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Share color="success" sx={{ mr: 1, fontSize: 16 }} />
                          {customer.referralPoints}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Wifi color="action" sx={{ mr: 1, fontSize: 16 }} />
                          {customer.internetUsage}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Add Points">
                            <IconButton 
                              size="small" 
                              color="primary"
                              onClick={() => handleAddPoints(customer.id, 100)}
                            >
                              <Add />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Redeem Points">
                            <IconButton 
                              size="small" 
                              color="secondary"
                              onClick={() => setSelectedCustomer(customer)}
                            >
                              <Redeem />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Tab 2: Rewards Catalog */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Available Rewards for Redemption
            </Typography>
            
            <Grid container spacing={3}>
              {rewards.map((reward) => (
                <Grid item xs={12} sm={6} md={4} key={reward.id}>
                  <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          p: 1.5, 
                          borderRadius: '50%', 
                          bgcolor: 'primary.main',
                          color: 'white',
                          mr: 2 
                        }}>
                          {reward.icon}
                        </Box>
                        <Box>
                          <Typography variant="h6">{reward.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {reward.type === 'time' ? 'Internet Access' : 
                             reward.type === 'speed' ? 'Bandwidth Boost' : 'Special Access'}
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          label={`${reward.points} Points`}
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      </Box>
                      
                      <Typography variant="body2" color="textSecondary">
                        {reward.type === 'time' && 'Add internet time to customer account'}
                        {reward.type === 'speed' && 'Upgrade to premium bandwidth speed'}
                        {reward.type === 'access' && 'Provide unlimited access for period'}
                      </Typography>
                    </CardContent>
                    
                    <CardActions>
                      <Button 
                        fullWidth 
                        variant="contained" 
                        startIcon={<Redeem />}
                        onClick={() => handleRedeem(selectedCustomer || customers[0], reward)}
                        disabled={!selectedCustomer}
                      >
                        Redeem Reward
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Tab 3: Earning Rules */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              Points Earning Rules Configuration
            </Typography>
            
            <Grid container spacing={2}>
              {earningRules.map((rule, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Paper elevation={1} sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      {rule.points}
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">{rule.action}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {rule.frequency} • {rule.points} points per action
                      </Typography>
                    </Box>
                    <Chip label="Active" color="success" size="small" />
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Add New Rule Form */}
            <Paper elevation={1} sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Add New Earning Rule
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Action Name"
                    placeholder="e.g., Weekly Bonus"
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Points"
                    type="number"
                    variant="outlined"
                    InputProps={{
                      endAdornment: <InputAdornment position="end">pts</InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Button fullWidth variant="contained" startIcon={<Add />}>
                    Add Rule
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )}

        {/* Tab 4: Referral System */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Referral Program Management
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonAdd sx={{ mr: 1 }} /> Referral Stats
                    </Typography>
                    
                    <List>
                      <ListItem>
                        <ListItemText 
                          primary="Total Referrals" 
                          secondary={customers.reduce((sum, c) => sum + c.referredCount, 0)} 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText 
                          primary="Points per Referral" 
                          secondary="150 points" 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText 
                          primary="Referral Bonus" 
                          secondary="Both referrer and referee get 150 points" 
                        />
                      </ListItem>
                      <Divider />
                      <ListItem>
                        <ListItemText 
                          primary="Referral Code Format" 
                          secondary="HOTSPOT-XXXXXX" 
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <Share sx={{ mr: 1 }} /> Top Referrers
                    </Typography>
                    
                    <List>
                      {customers
                        .sort((a, b) => b.referredCount - a.referredCount)
                        .slice(0, 3)
                        .map((customer) => (
                          <ListItem key={customer.id}>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: getTierColor(customer.tier) }}>
                                {customer.name.charAt(0)}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                              primary={customer.name}
                              secondary={`${customer.referredCount} referrals • ${customer.referralPoints} points earned`}
                            />
                            <Chip label={`${customer.tier}`} size="small" />
                          </ListItem>
                        ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Referral Link Generator */}
            <Paper elevation={1} sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Generate Referral Link
              </Typography>
              <TextField
                fullWidth
                value="https://hotspot.com/refer/HOTSPOT-ABC123"
                variant="outlined"
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <Button variant="contained" size="small">Copy</Button>
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>
          </Box>
        )}
      </Paper>

      {/* Redemption Dialog */}
      <Dialog open={redeemDialogOpen} onClose={() => setRedeemDialogOpen(false)}>
        <DialogTitle>Confirm Redemption</DialogTitle>
        <DialogContent>
          {selectedCustomer && selectedReward && (
            <>
              <Typography variant="body1" paragraph>
                Are you sure you want to redeem <strong>{selectedReward.name}</strong> for{' '}
                <strong>{selectedCustomer.name}</strong>?
              </Typography>
              
              <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Current Points:</Typography>
                    <Typography variant="h6">{selectedCustomer.totalPoints}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">Cost:</Typography>
                    <Typography variant="h6" color="error">-{selectedReward.points}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">Remaining Points:</Typography>
                    <Typography variant="h5" color="primary">
                      {selectedCustomer.totalPoints - selectedReward.points}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              {selectedCustomer.totalPoints < selectedReward.points && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Not enough points! Customer needs {selectedReward.points - selectedCustomer.totalPoints} more points.
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRedeemDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={confirmRedeem} 
            variant="contained" 
            disabled={selectedCustomer && selectedReward && selectedCustomer.totalPoints < selectedReward.points}
          >
            Confirm Redemption
          </Button>
        </DialogActions>
      </Dialog>

      {/* Customer Portal Preview */}
      <Paper elevation={2} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <Wifi sx={{ mr: 1 }} /> Customer Portal Preview
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#e3f2fd' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Customer Points Card</Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Avatar sx={{ width: 80, height: 80, bgcolor: '#ffd700', mx: 'auto', mb: 2 }}>
                    <Star sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Typography variant="h3" color="primary">1,250</Typography>
                  <Typography variant="body1" color="textSecondary">Available Points</Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Loyalty Points</Typography>
                      <Typography variant="h6">800</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption">Referral Points</Typography>
                      <Typography variant="h6">450</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card sx={{ bgcolor: '#f3e5f5' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Quick Redemption</Typography>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      size="small"
                      startIcon={<AccessTime />}
                    >
                      1 Hour (100 pts)
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      size="small"
                      startIcon={<Timer />}
                    >
                      2 Hours (180 pts)
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      size="small"
                      startIcon={<Bolt />}
                    >
                      Speed Boost (500 pts)
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary"
                      size="small"
                      startIcon={<CardGiftcardIcon />}
                    >
                      Free Day (1000 pts)
                    </Button>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="textSecondary">
                    Share referral link to earn more points:
                  </Typography>
                  <Chip 
                    label="hotspot.com/ref/ABC123" 
                    onDelete={() => {}}
                    deleteIcon={<Share />}
                    sx={{ mt: 1 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage('')}
        message={successMessage}
      />
    </Box>
  );
};

export default HotspotRewardsDashboard;