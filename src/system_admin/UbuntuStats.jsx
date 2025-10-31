import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  Grid, 
  CircularProgress,
  LinearProgress,
  useTheme,
  Tooltip
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MemoryIcon from '@mui/icons-material/Memory';
import StorageIcon from '@mui/icons-material/Storage';
import TimerIcon from '@mui/icons-material/Timer';
import SpeedIcon from '@mui/icons-material/Speed';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import CpuIcon from '@mui/icons-material/Computer';
import { createTheme, ThemeProvider } from '@mui/material/styles';




const StatCard = ({ icon, title, value, color, progress, unit }) => {
  const theme = useTheme();
  


  const defaultMaterialTheme = createTheme({
    props: {
      MuiInputLabel: {
          shrink: true
       }
  },
    palette: {
    
      
      mode:  'light' ,
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '000000',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
  
    },
  
  });
  const [materialuitheme, setMaterialuiTheme] = 
  useState(createTheme(defaultMaterialTheme));




  return (

    <ThemeProvider theme={materialuitheme}>
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      

    >
      <div
className="
  p-6
  h-full
  grid
  grid-cols-1
  lg:grid-cols-1
  gap-4
  xl:grid-cols-1 
  bg-white
  shadow-md
  rounded-lg
  transition-all
  duration-300
  ease-in-out
  overflow-hidden
  border
  border-gray-200
  dark:border-gray-700
  hover:shadow-xl
  hover:-translate-y-0.5
"
 
>
        <div  
        className='mb-2 flex justify-center '
        >
          <Box sx={{ 
            color: color, 
            mr: 2,
            p: 1,
            borderRadius: '50%',
            // bgcolor: theme.palette.mode === 'dark' ? 
            //   `${color}20` : `${color}10`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h5" component="div" fontWeight="bold">
              {value} {unit && <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>{unit}</span>}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
          </Box>
        </div>
        
        {progress !== undefined && (
          <Tooltip title={`${Math.round(progress)}% utilized`} arrow>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{
                height: 8,
                borderRadius: 4,
                mt: 'auto',
                bgcolor: theme.palette.mode === 'dark' ? 
                  `${color}20` : `${color}10`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                }
              }}
            />
          </Tooltip>
        )}
      </div>
    </motion.div>
    </ThemeProvider>
  );
};

const CpuAnimation = ({ usage }) => {
  const bars = 8;
  // Ensure usage is a number between 0-100
  const safeUsage = typeof usage === 'number' ? Math.min(100, Math.max(0, usage)) : 0;
  const heights = Array.from({ length: bars }, (_, i) => {
    const baseHeight = (safeUsage / 100) * Math.random() * 0.8 + 0.2;
    return Math.min(1, baseHeight * (0.8 + Math.random() * 0.4));
  });

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'flex-end', 
      height: 40,
      gap: 0.5,
      ml: 1
    }}>
      {heights.map((height, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${height * 100}%` }}
          transition={{ 
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            delay: i * 0.1
          }}
          style={{
            width: 4,
            backgroundColor: '#4CAF50',
            borderRadius: 2,
          }}
        />
      ))}
    </Box>
  );
};

const UbuntuStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to extract numeric value from strings like "38.58%" or "7.62 GB"
  const extractNumber = (str) => {
    if (!str) return 0;
    const match = str.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };



  const defaultMaterialTheme = createTheme({
    props: {
      MuiInputLabel: {
          shrink: true
       }
  },
    palette: {
    
      
      mode:  'light' ,
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '000000',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
  
    },
  
  });
  const [materialuitheme, setMaterialuiTheme] = 
  useState(createTheme(defaultMaterialTheme));



  const subdomain = window.location.hostname.split('.')[0];
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/system_status", {
        headers: {
          'X-Subdomain': subdomain,
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch system stats');
      
      const data = await response.json();
      
      if (data.system_metrics && data.system_metrics.length > 0) {
        const item = data.system_metrics[0]; // Get the latest entry
        
        // Extract numeric values from strings
        const cpu_usage = extractNumber(item.cpu_usage);
        const memory_total = extractNumber(item.memory_total);
        const memory_free = extractNumber(item.memory_free);
        const memory_used = extractNumber(item.memory_used);
        const disk_total = extractNumber(item.disk_total);
        const disk_free = extractNumber(item.disk_free);
        const disk_used = extractNumber(item.disk_used);
        
        // Calculate percentages safely
        const memory_percent = memory_total > 0 ? (memory_used / memory_total) * 100 : 0;
        const disk_percent = disk_total > 0 ? (disk_used / disk_total) * 100 : 0;
        
        setStats({
          cpu_usage,
          memory_total,
          memory_free,
          memory_used,
          memory_percent,
          disk_total,
          disk_free,
          disk_used,
          disk_percent,
          uptime: item.uptime, // Keep as string since it's already formatted
          load_average: item.load_average,
          raw: item // Keep original data for reference
        });
      } else {
        setStats(null);
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 7000); // Refresh every 7 seconds
    return () => clearInterval(interval);
  }, [subdomain]);

  const safeToFixed = (value, digits = 1) => {
    const num = Number(value);
    return isNaN(num) ? 'N/A' : num.toFixed(digits);
  };

  if (loading && !stats) {
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

  if (!stats) {
    return (
      <Typography color="text.secondary" align="center">
        <p className='text-black'>No system metrics available</p>
      </Typography>
    );
  }


  
  return (
    <AnimatePresence>
      <ThemeProvider theme={materialuitheme}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {/* CPU Usage */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CpuIcon fontSize="large" />
                    <CpuAnimation usage={ <p className='text-black'>{stats.cpu_usage}</p>} />
                  </Box>
                }
                title={<p className='text-black'>CPU Usage</p>}
                value={<p className='text-black'>{safeToFixed(stats.cpu_usage)}</p>}
                progress={stats.cpu_usage}
                color="#4CAF50"
                unit={<p className='text-black'>%</p>}
              />
            </Grid>

            {/* Memory Usage */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<MemoryIcon fontSize="large" />}
                title={<p className='text-black'>Memory Usage</p>}
                value={<p className='text-black'>{safeToFixed(stats.memory_used)} / {safeToFixed(stats.memory_total)}</p>}
                progress={stats.memory_percent}
                color="#2196F3"
                unit={<p className='text-black'>GB</p>}
              />
            </Grid>

            {/* Disk Usage */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<StorageIcon fontSize="large" />}
                title={<p className='text-black'>Disk Usage</p>}
                value={  <p className='text-black'>{safeToFixed(stats.disk_used)} / {safeToFixed(stats.disk_total)}</p>}
                progress={stats.disk_percent}
                color="#FF9800"
                unit={<p className='text-black'>GB</p>}
              />
            </Grid>

            {/* Uptime */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<TimerIcon fontSize="large" />}
                title={<p className='text-black'>System Uptime</p>}
                value={  <p className='text-black'>{stats.uptime || 'N/A'}</p>}
                color="#9C27B0"
              />
            </Grid>

            {/* Load Average */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<SpeedIcon fontSize="large" />}
                title={<p className='text-black'>Load Average</p>}
                value={  <p className='text-black'>{stats.load_average || 'N/A'}</p>}
                color="#00BCD4"
              />
            </Grid>

            {/* Memory Free */}
            <Grid item xs={12} sm={6} md={4}>
              <StatCard
                icon={<NetworkCheckIcon fontSize="large" />}
                title={<p className='text-black'>Available Memory</p>}
                value={<p className='text-black'>{safeToFixed(stats.memory_free)}</p>}
                progress={stats.memory_free / stats.memory_total * 100}
                color="#E91E63"
                unit={<p className='text-black'>GB</p>}
              />
            </Grid>
          </Grid>
        </Box>
      </motion.div>
      </ThemeProvider>
    </AnimatePresence>
  );
};

export default UbuntuStats;