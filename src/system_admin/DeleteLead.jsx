import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton,
  Typography, Box, CircularProgress, Slide, useMediaQuery, useTheme,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Close as CloseIcon, Warning as WarningIcon } from '@mui/icons-material';
import { forwardRef } from 'react';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
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

const DeleteLead = ({ id, openDelete, setOpenDelete, isloading, deleteLead }) => {
  const outerTheme = useTheme();
  const fullScreen = useMediaQuery(outerTheme.breakpoints.down('sm'));
  const isDark = useIsDarkMode();

  const modalTheme = useMemo(
    () => createTheme({ palette: { mode: isDark ? 'dark' : 'light' }, typography: { fontFamily: 'inherit' } }),
    [isDark]
  );

  const handleDeleteClient = () => deleteLead(id);

  return (
    <ThemeProvider theme={modalTheme}>
      <Dialog
        fullScreen={fullScreen}
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        TransitionComponent={Transition}
        PaperProps={{
          elevation: 0,
          className: 'border border-slate-200 dark:border-slate-800',
          sx: {
            borderRadius: fullScreen ? 0 : 3,
            minWidth: { xs: '100%', sm: '400px' },
            maxWidth: '100%',
            m: fullScreen ? 0 : 2,
            position: 'relative',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{
          position: 'absolute', top: -64, left: -64, right: 0, bottom: 0,
          background: 'linear-gradient(135deg, #f87171, #dc2626)',
          transform: 'rotate(-12deg) scale(1.5)', transformOrigin: '0 100%', zIndex: 0
        }} />

        <DialogTitle sx={{ position: 'relative', zIndex: 1, color: 'white', pt: 3, pb: 4, textAlign: 'center' }}>
          <IconButton sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }} onClick={() => setOpenDelete(false)}>
            <CloseIcon />
          </IconButton>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WarningIcon sx={{ color: '#dc2626', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" component="span" fontWeight="bold">
              Delete Lead
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ position: 'relative', zIndex: 1, pt: 3, pb: 2 }}>
          <Typography variant="subtitle1" align="center" sx={{ mb: 1, fontWeight: 500 }}>
            Are you sure you want to delete this lead?
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            This action cannot be undone.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ position: 'relative', zIndex: 1, px: 2, pb: 2, gap: 1, justifyContent: 'center' }}>
          <Button variant="outlined" color="inherit" onClick={() => setOpenDelete(false)} sx={{ minWidth: 100 }}>
            Cancel
          </Button>
          <Button
            variant="contained" onClick={handleDeleteClient} disabled={isloading}
            sx={{ minWidth: 100, background: 'linear-gradient(135deg, #f87171, #dc2626)',
              '&:hover': { background: 'linear-gradient(135deg, #ef4444, #b91c1c)' } }}
          >
            {isloading ? <CircularProgress size={22} sx={{ color: 'white' }} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default DeleteLead;