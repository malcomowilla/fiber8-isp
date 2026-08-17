import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import styled from "styled-components";
import { motion } from "framer-motion";
import { useApplicationSettings } from '../settings/ApplicationSettings';
const SettingsNotification = lazy(() => import('../notification/SettingsNotification'))
import Backdrop from '../backdrop/Backdrop'

import UiLoader from '../uiloader/UiLoader'
import { MdAttachEmail, MdDns, MdAlternateEmail } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// Shared field styling — one source of truth instead of a repeated sx block per field
const fieldSx = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
    transition: 'background-color 0.2s ease',
    '& fieldset': {
      borderColor: 'rgba(99, 102, 241, 0.18)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(99, 102, 241, 0.4)',
    },
    '&.Mui-focused': {
      backgroundColor: 'rgba(99, 102, 241, 0.06)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366f1',
      borderWidth: '2px',
    },
  },
  '& label.Mui-focused': {
    color: '#6366f1',
  },
};

const iconSx = { fontSize: '1.05rem', color: '#6366f1' };

const GradientButton = styled(motion.button)`
  margin-top: 32px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 30px;
  font-size: 0.95rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  border-radius: 999px;
  cursor: pointer;
  box-shadow: 0 8px 20px -6px rgba(99, 102, 241, 0.55);
  transition: box-shadow 0.25s ease;

  &:hover {
    box-shadow: 0 10px 26px -6px rgba(99, 102, 241, 0.7);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SectionCard = ({ title, subtitle, children }) => (
  <div className="rounded-2xl border border-indigo-500/15 dark:border-white/10 bg-indigo-500/[0.03] dark:bg-white/[0.03] p-5 sm:p-6 mb-5">
    <div className="mb-4">
      <p className="dark:text-white text-black roboto-condensed font-semibold text-sm">{title}</p>
      {subtitle && (
        <p className="dark:text-white/45 text-black/45 text-xs roboto-condensed-light mt-0.5">{subtitle}</p>
      )}
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
      {children}
    </div>
  </div>
);

const EmailSettings = () => {
  const subdomain = window.location.hostname.split('.')[0]
  const [emailSettingsForm, setEmailSettingsForm] = useState({
    smtp_host: '',
    smtp_username: '',
    sender_email: '',
    smtp_password: '',
    api_key: '',
    domain: '',
    smtp_port: '',
  })

  const { domain, api_key, smtp_host, smtp_username, sender_email, smtp_password, smtp_port } = emailSettingsForm

  const { isloading, setisloading } = useApplicationSettings()
  const [open, setOpen] = useState(false);
  const [openNotifactionSettings, setOpenSettings] = useState(false)
  const [useSsl, setUseSsl] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setEmailSettingsForm((prevData) => (
      { ...prevData, [name]: value }
    ))
  }

  const getEmailSettings = useCallback(
    async () => {
      try {
        const response = await fetch('/api/email_settings', {
          headers: {
            'X-Subdomain': subdomain,
          },
        })
        const newData = await response.json()

        if (response.ok) {
          const { domain, api_key, smtp_host, smtp_username, sender_email, smtp_password, smtp_port } = newData[0]
          setEmailSettingsForm({ ...emailSettingsForm, domain, smtp_host, smtp_username, sender_email, smtp_port })
        } else {
          toast.error(newData.error, {
            duration: 5000,
            position: 'top-center',
          })
          toast.error('failed to fetch email settings', {
            duration: 3000,
            position: 'top-center',
          })
        }
      } catch (error) {
        toast.error('internal server error something went wrong with getting email settings', {
          duration: 2000,
          position: 'top-center',
        })
      }
    },
    [],
  )

  useEffect(() => {
    getEmailSettings()
  }, [getEmailSettings]);

  const saveEmailSettings = async (e) => {
    e.preventDefault()
    setisloading(true);
    setOpen(true);
    try {
      const response = await fetch('/api/email_settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
        body: JSON.stringify(emailSettingsForm),
      })

      const newData = await response.json()

      const { domain, api_key, smtp_host, smtp_username, sender_email, smtp_password } = newData

      if (response.status === 402) {
        setTimeout(() => {
          window.location.href = '/license-expired';
        }, 1800);
      }

      if (response.ok) {
        setEmailSettingsForm({ ...emailSettingsForm, domain, api_key, smtp_host, smtp_username, sender_email, smtp_password })
        toast.success('Email settings saved successfully', {
          duration: 3000,
          position: 'top-center',
        })
        setOpenSettings(true);
        setOpen(false);
      } else {
        if (response.status === 402) {
          setTimeout(() => {
            window.location.href = '/license-expired'
          }, 1800);
        }
        if (response.status === 401) {
          toast.error(newData.error, {
            position: "top-center",
            duration: 4000,
          })
          setTimeout(() => {
            window.location.href = '/signin'
          }, 1900);
        }

        toast.success('Failed to save email settings', {
          duration: 3000,
          position: 'top-center',
        })
        setisloading(false);
        setOpenSettings(false);
        setOpen(false);
      }
    } catch (error) {
      setisloading(false);
      setOpenSettings(false);
      setOpen(false);
    }
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseNotifaction = () => {
    setOpenSettings(false);
  };

  return (
    <>
      <Backdrop handleClose={handleClose} open={open} />
      <SettingsNotification open={openNotifactionSettings} handleClose={handleCloseNotifaction} />
      <Toaster />
      <Suspense fallback={<div>{<UiLoader />}</div>}>

        <div className="mt-8">
          <form onSubmit={saveEmailSettings}>

            <SectionCard title="SMTP Server" subtitle="Connection details for outbound mail delivery">
              <TextField
                label="SMTP Host"
                name="smtp_host"
                value={smtp_host}
                onChange={handleChange}
                fullWidth
                InputProps={{ startAdornment: <MdDns className="mr-2" style={{ color: '#6366f1' }} /> }}
                sx={fieldSx}
              />
              <TextField
                label="SMTP Port"
                name="smtp_port"
                value={smtp_port}
                onChange={handleChange}
                fullWidth
                InputProps={{ startAdornment: <MdDns className="mr-2" style={{ color: '#6366f1' }} /> }}
                sx={fieldSx}
              />
              <TextField
                label="SMTP Username"
                name="smtp_username"
                value={smtp_username}
                onChange={handleChange}
                fullWidth
                InputProps={{ startAdornment: <MdAttachEmail className="mr-2" style={{ color: '#6366f1' }} /> }}
                sx={fieldSx}
              />
              <TextField
                label="SMTP Password"
                name="smtp_password"
                value={smtp_password}
                onChange={handleChange}
                fullWidth
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  startAdornment: <TbLockPassword className="mr-2" style={{ color: '#6366f1' }} />,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                        {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={fieldSx}
              />

              <div className="sm:col-span-2">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={useSsl}
                        onChange={(e) => setUseSsl(e.target.checked)}
                        sx={{
                          color: 'rgba(99, 102, 241, 0.4)',
                          '&.Mui-checked': { color: '#6366f1' },
                        }}
                      />
                    }
                    label={<span className="dark:text-white/70 text-black/70 text-sm roboto-condensed">Use SSL</span>}
                  />
                </FormGroup>
              </div>
            </SectionCard>

            <SectionCard title="Sender Identity" subtitle="How recipients see mail sent from your platform">
              <TextField
                label="Sender Email"
                name="sender_email"
                value={sender_email}
                onChange={handleChange}
                fullWidth
                InputProps={{ startAdornment: <MdAlternateEmail className="mr-2" style={{ color: '#6366f1' }} /> }}
                sx={fieldSx}
              />
            </SectionCard>

            <SectionCard title="API Access" subtitle="Used for provider-based transactional email delivery">
              <div className="sm:col-span-2">
                <TextField
                  label="Api Key"
                  name="api_key"
                  value={api_key}
                  onChange={handleChange}
                  fullWidth
                  type={showApiKey ? 'text' : 'password'}
                  InputProps={{
                    startAdornment: <FaKey className="mr-2" style={{ color: '#6366f1' }} />,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowApiKey((v) => !v)} edge="end" size="small">
                          {showApiKey ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={fieldSx}
                />
              </div>
            </SectionCard>

            <GradientButton
              type="submit"
              disabled={isloading}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
            >
              {isloading ? 'Saving…' : 'Save Settings'}
            </GradientButton>
          </form>
        </div>
      </Suspense>
    </>
  )
}

export default EmailSettings