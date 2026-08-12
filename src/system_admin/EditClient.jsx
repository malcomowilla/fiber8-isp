import React, { useState, useEffect, useMemo } from 'react';
import {
  TextField,
  Button,
  Box,
  IconButton,
  InputAdornment,
  CircularProgress,
  Modal,
  FormControlLabel,
  Checkbox,
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  Email,
  Phone,
  Person,
  Business,
  Lock,
  Edit,
  Close,
  AccountBalanceWallet,
  Info,
} from '@mui/icons-material';
import 'react-toastify/dist/ReactToastify.css';

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

const EditClient = ({ open, onClose, handleChange, formData, handleInvite, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  const isDark = useIsDarkMode();

  const modalTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          success: { main: '#10b981' },
        },
        typography: { fontFamily: 'inherit' },
      }),
    [isDark]
  );

  const handleWalletAdminChange = (e) => {
    const isWalletAdmin = e.target.checked;
    setFormData((prev) => ({ ...prev, wallet_admin: isWalletAdmin }));
  };

  const fieldSx = { '& .MuiOutlinedInput-root': { borderRadius: '10px' } };

  return (
    <ThemeProvider theme={modalTheme}>
      <Modal open={open} onClose={onClose} aria-labelledby="edit-client-modal" className="font-sans">
        <Box className="flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg"
          >
            <Box
              className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-6 sm:p-7 max-h-[90vh] overflow-y-auto"
            >
              <IconButton
                onClick={onClose}
                className="!absolute !top-4 !right-4 !text-slate-400 dark:!text-slate-500"
                size="small"
              >
                <Close fontSize="small" />
              </IconButton>

              <div className="flex items-center gap-3 mb-1">
                <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <Edit fontSize="small" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Edit client</h2>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Update account details and permissions</p>
                </div>
              </div>

              <Divider className="!my-4 dark:!border-slate-800" />

              {formData.wallet_admin && (
                <Alert severity="info" sx={{ mb: 2, borderRadius: '10px' }} icon={<AccountBalanceWallet fontSize="small" />}>
                  This user has Wallet Admin privileges and can access the admin wallet portal.
                </Alert>
              )}

              <form onSubmit={(e) => handleInvite(e)}>
                <div className="flex flex-col gap-4">
                  <TextField
                    fullWidth
                    label="Name"
                    name="username"
                     className='myTextField'
                    value={formData.username || ''}
                    onChange={handleChange}
                    variant="outlined"
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                     className='myTextField'
                    value={formData.email || ''}
                    onChange={handleChange}
                    variant="outlined"
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone_number"
                     className='myTextField'
                    value={formData.phone_number || ''}
                    onChange={handleChange}
                    variant="outlined"
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Company"
                     className='myTextField'
                    name="company"
                    value={formData.company || ''}
                    onChange={handleChange}
                    variant="outlined"
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Business fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                     className='myTextField'
                    type="password"
                    value={formData.password || ''}
                    onChange={handleChange}
                    variant="outlined"
                    placeholder="Leave blank to keep current password"
                    sx={fieldSx}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 mt-6 mb-3">
                  <Chip label="Permissions" size="small" />
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>

                <Box
                  className={`rounded-xl p-3 border transition-colors ${
                    formData.wallet_admin
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-700'
                      : 'bg-transparent border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.wallet_admin || false}
                        onChange={handleWalletAdminChange}
                        icon={<AccountBalanceWallet fontSize="small" />}
                        checkedIcon={<AccountBalanceWallet fontSize="small" sx={{ color: '#10b981' }} />}
                        sx={{ '&.Mui-checked': { color: '#10b981' } }}
                      />
                    }
                    label={
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            Wallet admin
                          </span>
                          <IconButton
                            size="small"
                            onMouseEnter={() => setShowWalletInfo(true)}
                            onMouseLeave={() => setShowWalletInfo(false)}
                            sx={{ p: 0 }}
                          >
                            <Info fontSize="small" className="!text-slate-400" />
                          </IconButton>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Grants access to view wallet balances and process withdrawals
                        </p>
                      </div>
                    }
                  />

                  {showWalletInfo && (
                    <div className="mt-2 p-3 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-xs text-sky-700 dark:text-sky-300">
                      <p className="font-semibold mb-1">Wallet admin privileges include:</p>
                      <ul className="list-disc list-inside space-y-0.5">
                        <li>View hotspot &amp; PPPoE wallet balances</li>
                        <li>Initiate withdrawals via STK push</li>
                        <li>Access transaction history</li>
                        <li>Configure payout settings</li>
                      </ul>
                    </div>
                  )}
                </Box>

                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={onClose}
                    fullWidth
                    sx={{ borderRadius: '10px', textTransform: 'none' }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="success"
                    fullWidth
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={18} /> : <Edit fontSize="small" />}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                  >
                    {loading ? 'Updating…' : 'Update client'}
                  </Button>
                </div>
              </form>
            </Box>
          </motion.div>
        </Box>
      </Modal>
    </ThemeProvider>
  );
};

export default EditClient;