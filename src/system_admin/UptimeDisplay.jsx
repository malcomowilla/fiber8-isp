import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import TimerIcon from '@mui/icons-material/Timer';

const UptimeDisplay = () => {
  const [uptime, setUptime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [loginTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const diff = now - loginTime;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setUptime({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [loginTime]);

  const timeUnit = (value, unit) => (
    <motion.div
      key={`${value}-${unit}`}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      style={{ display: 'inline-block' }}
    >
      <Typography
        variant="h6"
        component="span"
        sx={{
          fontWeight: 'bold',
          color: '#1976d2',
          mx: 0.5
        }}
      >
        {value.toString().padStart(2, '0')}
      </Typography>
      <Typography
        variant="caption"
        component="span"
        sx={{ color: 'text.secondary' }}
      >
        {unit}
      </Typography>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          bgcolor: 'rgba(25, 118, 210, 0.05)',
          borderRadius: 2,
          p: 1.5,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}
      >
        <motion.div
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <TimerIcon sx={{ color: '#1976d2' }} />
        </motion.div>
        <Box>
          {timeUnit(uptime.hours, 'h')}:
          {timeUnit(uptime.minutes, 'm')}:
          {timeUnit(uptime.seconds, 's')}
        </Box>
      </Box>
    </motion.div>
  );
};

export default UptimeDisplay;
