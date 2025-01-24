import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Grid, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PercentIcon from '@mui/icons-material/Percent';

const StatCard = ({ icon, title, value, color }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <Card
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'background.paper',
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.02)',
          transition: 'all 0.2s ease-in-out'
        }
      }}
    >
      <Box sx={{ color: color, mr: 2 }}>{icon}</Box>
      <Box>
        <Typography variant="h6" component="div">
          {value}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
      </Box>
    </Card>
  </motion.div>
);

const UptimeStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/statistics/uptime');
        if (!response.ok) throw new Error('Failed to fetch statistics');
        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center">
        Error loading statistics: {error}
      </Typography>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* Session Duration */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<AccessTimeIcon fontSize="large" />}
                title="Session Duration"
                value={`${stats.hours}h ${stats.minutes}m ${stats.seconds}s`}
                color="#1976d2"
              />
            </Grid>

            {/* Total Requests */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<LocalShippingIcon fontSize="large" />}
                title="Total Collection Requests"
                value={stats.request_stats.total_requests}
                color="#2e7d32"
              />
            </Grid>

            {/* Total Confirmations */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<CheckCircleIcon fontSize="large" />}
                title="Total Confirmations"
                value={stats.request_stats.total_confirmations}
                color="#ed6c02"
              />
            </Grid>

            {/* Confirmation Rate */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<PercentIcon fontSize="large" />}
                title="Confirmation Rate"
                value={`${stats.request_stats.confirmation_rate}%`}
                color="#9c27b0"
              />
            </Grid>
          </Grid>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
};

export default UptimeStats;
