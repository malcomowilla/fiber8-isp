import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton,
  Typography, Box, CircularProgress, Slide, useMediaQuery, useTheme,
  TextField, Divider, Avatar, InputAdornment, MenuItem
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Close as CloseIcon, Person as PersonIcon, Email as EmailIcon,
  Business as BusinessIcon, Phone as PhoneIcon
} from '@mui/icons-material';
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

const STATUS_OPTIONS = [
  { value: 'new', label: 'New', color: '#38bdf8' },
  { value: 'contacted', label: 'Contacted', color: '#fbbf24' },
  { value: 'qualified', label: 'Qualified', color: '#a78bfa' },
  { value: 'converted', label: 'Converted', color: '#34d399' },
  { value: 'lost', label: 'Lost', color: '#f87171' },
];

const ACCENT = '#6366f1';

const EditLead = ({ open, setOpen, formData, setFormData, createLead }) => {
  const outerTheme = useTheme();
  const fullScreen = useMediaQuery(outerTheme.breakpoints.down('sm'));
  const [submitting, setSubmitting] = useState(false);
  const isDark = useIsDarkMode();

  const modalTheme = useMemo(
    () => createTheme({ palette: { mode: isDark ? 'dark' : 'light' }, typography: { fontFamily: 'inherit' } }),
    [isDark]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await createLead(e);
    setSubmitting(false);
  };

  const handleClose = () => setOpen(false);
  const fieldSx = { mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '10px' } };

  return (
    <ThemeProvider theme={modalTheme}>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          elevation: 0,
          className: 'border border-slate-200 dark:border-slate-800',
          sx: {
            borderRadius: fullScreen ? 0 : 3,
            minWidth: { xs: '100%', sm: '500px' },
            maxWidth: '100%',
            m: fullScreen ? 0 : 2,
            position: 'relative',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{
          background: `linear-gradient(135deg, ${ACCENT}, #8b5cf6)`,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 2
        }}>
          <Typography variant="h6" fontWeight={700}>
            {formData.id ? 'Edit Lead' : 'New Lead'}
          </Typography>
          <IconButton edge="end" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: ACCENT, fontSize: '2rem' }}>
                {formData.name?.charAt(0).toUpperCase() || <PersonIcon fontSize="large" />}
              </Avatar>
            </Box>

            <TextField
              fullWidth margin="normal" label="Full Name" name="name"
              className='myTextField'
              value={formData.name || ''} onChange={handleChange} required
              InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon fontSize="small" color="action" /></InputAdornment>) }}
              variant="outlined" sx={fieldSx}
            />

            <TextField
              fullWidth margin="normal" label="Email Address" name="email" type="email"
              value={formData.email || ''} onChange={handleChange} 
              className='myTextField'
              InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon fontSize="small" color="action" /></InputAdornment>) }}
              variant="outlined" sx={fieldSx}
            />

            <TextField
              fullWidth margin="normal" label="Company Name" name="company_name"
              value={formData.company_name || ''} onChange={handleChange}
              className='myTextField'
              InputProps={{ startAdornment: (<InputAdornment position="start"><BusinessIcon fontSize="small" color="action" /></InputAdornment>) }}
              variant="outlined" sx={fieldSx}
            />

            <TextField
              fullWidth margin="normal" label="Phone Number" name="phone_number"
              value={formData.phone_number || ''} onChange={handleChange}
              className='myTextField'
              InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon fontSize="small" color="action" /></InputAdornment>) }}
              variant="outlined" sx={fieldSx}
            />

            <TextField
              fullWidth select margin="normal" label="Status" name="status"
              className='myTextField'
              value={formData.status || 'new'} onChange={handleChange}
              variant="outlined" sx={{ ...fieldSx, mb: 0 }}
            >
              {STATUS_OPTIONS.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: s.color }} />
                    {s.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>

          <Divider className="dark:!border-slate-800" />

          <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <Button
              type="submit" variant="contained" disabled={submitting}
              startIcon={submitting ? <CircularProgress size={18} sx={{ color: 'white' }} /> : null}
              sx={{
                minWidth: 130,
                background: `linear-gradient(135deg, ${ACCENT}, #8b5cf6)`,
                '&:hover': { background: `linear-gradient(135deg, #4f46e5, #7c3aed)` },
              }}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </ThemeProvider>
  );
};

export default EditLead;