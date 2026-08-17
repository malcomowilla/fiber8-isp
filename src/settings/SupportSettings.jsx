import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import Tooltip from "@mui/material/Tooltip";
import { motion } from "framer-motion";
import styled from "styled-components";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import TagRoundedIcon from "@mui/icons-material/TagRounded";
import PinRoundedIcon from "@mui/icons-material/PinRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import TextField from '@mui/material/TextField';
import { useState, useEffect, useCallback, lazy } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import Backdrop from '../backdrop/Backdrop'

const SettingsNotification = lazy(() => import('../notification/SettingsNotification'))

// Shared field styling — a single source of truth instead of a repeated sx block per field
const fieldSx = {
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    backgroundColor: 'rgba(99, 102, 241, 0.04)',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
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

const GradientButton = styled(motion.button)`
  margin-top: 28px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  font-size: 0.92rem;
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

const SupportSettings = () => {

    const [open, setOpen] = useState(false);
    const [openNotifactionSettings, setOpenSettings] = useState(false)
    const [ticketForm, setTicketForm] = useState({
        prefix: '',
        minimum_digits: '',
    })

    const { prefix, minimum_digits } = ticketForm

    const subdomain = window.location.hostname.split('.')[0]

    const handleChange = (e) => {
        const { type, name, checked, value } = e.target;
        const capitalizedName = value.toUpperCase()
        setTicketForm((prevFormData) => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : capitalizedName,
        }));
    }

    const fetchTicketSettings = useCallback(
        async () => {
            try {
                const response = await fetch('/api/ticket_settings', {
                    method: 'GET',
                    headers: {
                        'X-Subdomain': subdomain,
                    },
                })
                const newData = await response.json()
                if (response.ok) {
                    setTicketForm({
                        prefix: newData[0].prefix,
                        minimum_digits: newData[0].minimum_digits
                    })
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

                    toast.error(newData.error, {
                        position: 'top-center',
                        duration: 5000,
                    })
                    toast.error('failed to fetch ticket settings', {
                        position: 'top-center',
                        duration: 4000,
                    })
                }
            } catch (error) {
                toast.error(
                    'failed to fetch ticket settings, Please retry in a moment',
                    {
                        position: 'top-center',
                        duration: 4000,
                    }
                )
            }
        },
        [],
    )

    useEffect(() => {
        fetchTicketSettings()
    }, [fetchTicketSettings]);

    const handleCreateTicketSettings = async (e) => {
        e.preventDefault()
        try {
            setOpen(true);
            const response = await fetch('/api/ticket_settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Subdomain': subdomain,
                },
                body: JSON.stringify({
                    prefix, minimum_digits
                }),
            })
            const newData = await response.json()

            if (response.status === 402) {
                setTimeout(() => {
                    window.location.href = '/license-expired';
                }, 1800);
            }

            if (response.ok) {
                toast.success('ticket settings saved successfully', {
                    position: 'top-center',
                    duration: 5000,
                })
                setOpenSettings(true)
                setOpen(false)
                setTicketForm({
                    prefix: newData.prefix,
                    minimum_digits: newData.minimum_digits
                })
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
                toast.error('failed to save ticket settings', {
                    duration: 3000,
                    position: 'top-center',
                })
                setOpenSettings(false);
                setOpen(false);
            }
        } catch (error) {
            setOpenSettings(false);
            setOpen(false);
            toast.error(
                'failed to save ticket settings',
                {
                    position: 'top-center',
                    duration: 4000,
                }
            )
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
            <Toaster />
            <Backdrop handleClose={handleClose} open={open} />
            <SettingsNotification open={openNotifactionSettings} handleClose={handleCloseNotifaction} />

            <div>
                <form onSubmit={handleCreateTicketSettings}>
                    <Accordion
                        disableGutters
                        elevation={0}
                        sx={{
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            border: '1px solid',
                            borderColor: 'rgba(99, 102, 241, 0.15)',
                            borderRadius: '18px !important',
                            overflow: 'hidden',
                            '&:before': { display: 'none' },
                        }}
                        className="dark:!border-white/10"
                    >
                        <AccordionSummary
                            expandIcon={
                                <KeyboardArrowDownRoundedIcon
                                    className="dark:text-white text-black"
                                    sx={{ fontSize: '1.6rem' }}
                                />
                            }
                            aria-controls="panel1-content"
                            id="panel1-header"
                            className="dark:!bg-white/[0.04]"
                            sx={{
                                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                                px: 2.5,
                                py: 1,
                                '& .MuiAccordionSummary-content': { my: 1.5 },
                            }}
                        >
                            <Typography variant="h6" component="div">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        whileHover={{ scale: 1.08, rotate: [0, 8, -8, 0] }}
                                        transition={{ duration: 0.45 }}
                                        className="flex items-center justify-center w-10 h-10 rounded-xl shadow-md"
                                        style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
                                    >
                                        <SupportAgentRoundedIcon sx={{ fontSize: '1.4rem', color: 'white' }} />
                                    </motion.div>
                                    <div>
                                        <p className="dark:text-white text-black  font-semibold text-base leading-tight">
                                            Support Ticket Settings
                                        </p>
                                        <p className="dark:text-white/50 text-black/45 text-xs ">
                                            Prefixes, numbering & ticket formatting
                                        </p>
                                    </div>
                                </div>
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails
                            sx={{
                                px: 3,
                                py: 3,
                            }}
                        >
                            <p className="dark:text-white/60 text-black/55 text-sm  mb-5 max-w-xl">
                                Configure system-wide settings for support tickets — including ticket ID prefixes
                                and minimum digit padding used across the platform.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <TextField
                                    name="prefix"
                                    onChange={handleChange}
                                    value={prefix}
                                    fullWidth
                                    label="Prefix"
                                    InputProps={{
                                        startAdornment: <TagRoundedIcon sx={{ fontSize: '1.1rem', mr: 1, color: '#6366f1' }} />,
                                    }}
                                    helperText={
                                        <span className="dark:text-white/40 text-black/40 text-xs roboto-condensed">
                                            Any short code, e.g. FK, TQ, QM, M, A
                                        </span>
                                    }
                                    sx={fieldSx}
                                />

                                <TextField
                                    name="minimum_digits"
                                    value={minimum_digits}
                                    onChange={handleChange}
                                    type="number"
                                    fullWidth
                                    label="Minimum Digits"
                                    InputProps={{
                                        startAdornment: <PinRoundedIcon sx={{ fontSize: '1.1rem', mr: 1, color: '#6366f1' }} />,
                                    }}
                                    helperText={
                                        <span className="dark:text-white/40 text-black/40 text-xs ">
                                            Zero-padded, e.g. SUB001 for three digits
                                        </span>
                                    }
                                    sx={fieldSx}
                                />
                            </div>

                            <Tooltip title="Update ticket settings system-wide">
                                <GradientButton
                                    type="submit"
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                >
                                    <SaveRoundedIcon sx={{ fontSize: '1.1rem' }} />
                                    Update Settings
                                </GradientButton>
                            </Tooltip>
                        </AccordionDetails>
                    </Accordion>
                </form>
            </div>
        </>
    );
};

export default SupportSettings;