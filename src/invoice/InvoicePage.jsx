import React from 'react';
import {
  Box,
  Typography,
  Button,
  Divider,
  Paper,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Alert,
  Stack,
} from '@mui/material';
import {
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

import { useApplicationSettings } from '../settings/ApplicationSettings';
import toast, { Toaster } from 'react-hot-toast';
import { useCallback, useEffect, useState, useRef } from 'react';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { parseInvoiceDescription } from '../utils/invoiceParser';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// ---------------------------------------------------------------------------
// Design tokens for the printable invoice. Kept local so the "paper" surface
// reads consistently whether it's on screen, printed, or exported to PDF.
// ---------------------------------------------------------------------------
const ACCENT = '#0f9d58'; // brand green, matches the "success" palette already in use
const INK = '#14171a';
const MUTED = '#6b7280';
const HAIRLINE = '#e5e7eb';

const currency = (value) =>
  `KES ${parseFloat(value || 0).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

const InvoicePage = () => {
  const {
    companySettings,
    setCompanySettings,
    hotspotMpesaSettings,
    setHotspotMpesaSettings,
    selectedAccountTypeHotspot,
    setSelectedAccountTypeHotspot,
  } = useApplicationSettings();
  const { company_name, logo_preview } = companySettings;

  const [searchParams] = useSearchParams();
  const [openPaymentInstructions, setOpenPaymentInstructions] = useState(false);

  const {
    short_code,
    api_initiator_username,
    api_initiator_password,
  } = hotspotMpesaSettings;

  const navigate = useNavigate();
  const subdomain = window.location.hostname.split('.')[0];

  const handleGetCompanySettings = useCallback(async () => {
    try {
      const response = await fetch('/api/allow_get_company_settings', {
        method: 'GET',
        headers: { 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) {
        const {
          contact_info,
          company_name,
          email_info,
          logo_url,
          customer_support_phone_number,
          agent_email,
          customer_support_email,
        } = newData;
        setCompanySettings((prevData) => ({
          ...prevData,
          contact_info,
          company_name,
          email_info,
          customer_support_phone_number,
          agent_email,
          customer_support_email,
          logo_preview: logo_url,
        }));
      }
    } catch (error) {
      // silent: company letterhead is optional decoration
    }
  }, []);

  useEffect(() => {
    handleGetCompanySettings();
  }, [handleGetCompanySettings]);

  // Sample fallback content, only used when the API notes/from-block are empty.
  const fallback = {
    from: { name: 'Aitechs' },
    notes: 'Thank you for your business! Payment is due within 2 days.',
  };

  const id = searchParams.get('id');

  const [status, setStatus] = useState('N/A');
  const [invoiceNumber, setInvoiceNumber] = useState('N/A');
  const [invoiceDesciption, setInvoiceDesciption] = useState('N/A');
  const [invoiceTotal, setInvoiceTotal] = useState('N/A');
  const [issuedDate, setIssuedDate] = useState('N/A');
  const [dueDate, setDueDate] = useState('N/A');
  const [invoiceData, setInvoiceData] = useState(null);

  const fetchSavedHotspotMpesaSettings = useCallback(async () => {
    try {
      const response = await fetch(`/api/saved_hotspot_mpesa_settings`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
      });

      const data = await response.json();

      const newData =
        data.length > 0
          ? data.reduce(
              (latest, item) =>
                new Date(item.created_at) > new Date(latest.created_at) ? item : latest,
              data[0]
            )
          : null;

      if (response.ok) {
        const { consumer_key, consumer_secret, passkey, short_code } = newData;
        setSelectedAccountTypeHotspot(newData.account_type);
        setHotspotMpesaSettings({
          consumer_key,
          consumer_secret,
          passkey,
          short_code,
          api_initiator_username,
          api_initiator_password,
        });
      } else {
        if (response.status === 402) {
          setTimeout(() => {
            window.location.href = '/license-expired';
          }, 1800);
        }
        if (response.status === 401) {
          toast.error(newData.error, { position: 'top-center', duration: 4000 });
          setTimeout(() => {
            window.location.href = '/signin';
          }, 1900);
        }
      }
    } catch (error) {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchSavedHotspotMpesaSettings();
  }, [fetchSavedHotspotMpesaSettings]);

  const fetchHotspotMpesaSettings = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/hotspot_mpesa_settings?account_type=${selectedAccountTypeHotspot}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Subdomain': subdomain,
          },
        }
      );

      const newData = await response.json();

      if (response.ok) {
        if (!newData || newData.length === 0 || !newData.account_type) {
          setHotspotMpesaSettings({
            consumer_key: '',
            consumer_secret: '',
            passkey: '',
            short_code: '',
            api_initiator_username: '',
            api_initiator_password: '',
          });
        } else {
          const {
            consumer_key,
            consumer_secret,
            passkey,
            short_code,
            api_initiator_username,
            api_initiator_password,
          } = newData;

          setHotspotMpesaSettings((prevData) => ({
            ...prevData,
            consumer_key,
            consumer_secret,
            passkey,
            short_code,
            api_initiator_username,
            api_initiator_password,
          }));
        }
      }
    } catch (error) {
      // ignore
    }
  }, [selectedAccountTypeHotspot]);

  useEffect(() => {
    if (selectedAccountTypeHotspot) {
      fetchHotspotMpesaSettings();
    }
  }, [fetchHotspotMpesaSettings, selectedAccountTypeHotspot]);

  const getInvoices = useCallback(async () => {
    try {
      const response = await fetch(`/api/get_invoice?id=${id}`, {
        headers: { 'X-Subdomain': subdomain },
      });
      const newData = await response.json();

      if (response.ok) {
        setStatus(newData.status);
        setInvoiceNumber(newData.invoice_number);
        setInvoiceDesciption(newData.invoice_desciption);
        setInvoiceTotal(newData.total);
        setIssuedDate(newData.invoice_date);
        setDueDate(newData.due_date);

        const parsed = parseInvoiceDescription(newData.invoice_desciption);
        setInvoiceData(parsed);
      } else {
        if (response.status === 403) {
          toast.error('permision denied to get invoices', { duration: 6000 });
        }
        if (response.status === 401) {
          toast.error(newData.error, { position: 'top-center', duration: 4000 });
          setTimeout(() => {
            window.location.href = '/signin';
          }, 1900);
        }
      }
    } catch (error) {
      // ignore
    }
  }, []);

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  const componentRef = useRef(null);
  const isPaid = status?.toLowerCase() === 'paid';

  const subtotal =
    invoiceData?.items
      ?.filter((item) => item.amount)
      .reduce((sum, item) => sum + item.amount, 0) || 0;

  const downloadInvoiceAsFormattedPDF = async () => {
    try {
      const invoiceElement = document.querySelector('.printable-content');

      const canvas = await html2canvas(invoiceElement, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          const element = clonedDoc.querySelector('.printable-content');
          if (element) {
            element.style.width = '100%';
            element.style.maxWidth = '800px';
            element.style.margin = '0 auto';
            element.style.padding = '20px';
            element.style.boxSizing = 'border-box';
            element.style.fontSize = '14px';

            element.querySelectorAll('*').forEach((el) => {
              const computedColor = window.getComputedStyle(el).color;
              if (computedColor !== 'rgb(0, 0, 0)') {
                el.style.color = '#000000';
              }
            });
          }
        },
      });

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const contentWidth = pdfWidth - margin * 2;
      const contentHeight = pdfHeight - margin * 2;

      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      let heightLeft = imgHeight;
      let position = margin;

      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= contentHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
        heightLeft -= contentHeight;
      }

      const fileName = `Invoice-${invoiceNumber || 'Unknown'}-${
        new Date().toISOString().split('T')[0]
      }.pdf`;
      pdf.save(fileName);

      toast.success('PDF generated successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <>
      <Toaster />

      {/* ------------------------------------------------------------------ */}
      {/* Payment instructions dialog                                        */}
      {/* ------------------------------------------------------------------ */}
      <Dialog
        open={openPaymentInstructions}
        onClose={() => setOpenPaymentInstructions(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: ACCENT, color: 'white', fontWeight: 700 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <PaymentIcon />
            Pay via M-Pesa
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom fontWeight={600}>
            Follow these steps to complete your payment
          </Typography>

          <Stack spacing={2} sx={{ mt: 3 }}>
            {[
              { label: 'Go to', bold: 'M-Pesa', tail: 'on your phone' },
              { label: 'Select', bold: 'Lipa Na M-Pesa' },
            ].map((step, i) => (
              <Box key={i} display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: `${ACCENT}22`, color: ACCENT, width: 28, height: 28, fontWeight: 700 }}>
                  {i + 1}
                </Avatar>
                <Typography>
                  {step.label} <strong>{step.bold}</strong> {step.tail}
                </Typography>
              </Box>
            ))}

            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: `${ACCENT}22`, color: ACCENT, width: 28, height: 28, fontWeight: 700 }}>3</Avatar>
              <Typography>
                Select <strong>Paybill</strong>, enter Business No.{' '}
                <Box
                  component="span"
                  sx={{
                    bgcolor: 'grey.100',
                    px: 1.5,
                    py: 0.4,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                  }}
                >
                  {short_code || '4007893'}
                </Box>
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: `${ACCENT}22`, color: ACCENT, width: 28, height: 28, fontWeight: 700 }}>4</Avatar>
              <Typography>
                Enter <strong>Account Number</strong>{' '}
                <Box
                  component="span"
                  sx={{
                    bgcolor: 'grey.100',
                    px: 1.5,
                    py: 0.4,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                  }}
                >
                  {invoiceNumber}
                </Box>
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: `${ACCENT}22`, color: ACCENT, width: 28, height: 28, fontWeight: 700 }}>5</Avatar>
              <Typography>
                Enter <strong>Amount</strong>{' '}
                <Box
                  component="span"
                  sx={{
                    bgcolor: 'grey.100',
                    px: 1.5,
                    py: 0.4,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                  }}
                >
                  {currency(invoiceTotal)}
                </Box>
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={2}>
              <Avatar sx={{ bgcolor: `${ACCENT}22`, color: ACCENT, width: 28, height: 28, fontWeight: 700 }}>6</Avatar>
              <Typography>
                Enter your <strong>M-Pesa PIN</strong> and confirm
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Alert severity="info" sx={{ borderRadius: 2 }} icon={<ScheduleIcon fontSize="inherit" />}>
            <Typography variant="body2">
              Once payment is successful, your invoice status updates automatically within{' '}
              <strong>1–3 minutes</strong>. You'll receive an SMS confirmation.
            </Typography>
          </Alert>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            variant="contained"
            fullWidth
            size="large"
            sx={{ bgcolor: ACCENT, '&:hover': { bgcolor: '#0c7f47' } }}
            onClick={() => setOpenPaymentInstructions(false)}
          >
            I've made the payment
          </Button>
          <Button
            variant="outlined"
            onClick={() => setOpenPaymentInstructions(false)}
            sx={{ mt: 1, borderColor: HAIRLINE, color: MUTED }}
            fullWidth
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* ------------------------------------------------------------------ */}
      {/* Page                                                                */}
      {/* ------------------------------------------------------------------ */}
      <Box sx={{ maxWidth: 800, mx: 'auto', my: 4, px: { xs: 2, sm: 0 } }}>
        {/* Action bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            mb: 2,
          }}
        >
          <Button
            onClick={() => navigate(-1)}
            startIcon={<FaLongArrowAltLeft />}
            sx={{ color: MUTED, textTransform: 'none' }}
          >
            Back
          </Button>

          <Stack direction="row" spacing={1} className="no-print">
            <Button variant="outlined" onClick={() => window.print()} startIcon={<PrintIcon />} sx={{ borderColor: HAIRLINE, color: INK }}>
              Print
            </Button>
            <Button
              onClick={downloadInvoiceAsFormattedPDF}
              variant="outlined"
              startIcon={<DownloadIcon />}
              sx={{ borderColor: HAIRLINE, color: INK }}
            >
              Download
            </Button>
            {isPaid ? (
              <Chip icon={<CheckCircleIcon />} label="Paid" sx={{ bgcolor: `${ACCENT}1a`, color: ACCENT, fontWeight: 700 }} />
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<PaymentIcon />}
                onClick={() => setOpenPaymentInstructions(true)}
                sx={{ px: 3, bgcolor: ACCENT, '&:hover': { bgcolor: '#0c7f47' } }}
              >
                Pay now
              </Button>
            )}
          </Stack>
        </Box>

        {/* Invoice document */}
        <Paper
          ref={componentRef}
          className="printable-content"
          elevation={0}
          sx={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 3,
            border: `1px solid ${HAIRLINE}`,
            boxShadow: '0 1px 3px rgba(16,24,32,0.06), 0 12px 24px -12px rgba(16,24,32,0.12)',
          }}
        >
          {/* accent rail */}
          <Box sx={{ height: 6, bgcolor: isPaid ? ACCENT : '#e0a800' }} />

          <Box sx={{ p: { xs: 3, sm: 5 } }}>
            {/* Letterhead */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 2,
                mb: 4,
              }}
            >
              <Box>
                <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                  <Box
                    component="img"
                    src={logo_preview || '/images/aitechs.png'}
                    onError={(e) => {
                      e.target.src = '/images/aitechs.png';
                    }}
                    alt={company_name || 'Aitechs'}
                    sx={{ height: 44, width: 44, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 800, color: INK, letterSpacing: -0.3 }}>
                    {company_name || fallback.from.name}
                  </Typography>
                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    display: 'inline-block',
                    fontFamily: 'monospace',
                    letterSpacing: 0.5,
                    color: MUTED,
                    bgcolor: 'grey.50',
                    border: `1px solid ${HAIRLINE}`,
                    borderRadius: 1,
                    px: 1,
                    py: 0.4,
                  }}
                >
                  INVOICE {invoiceNumber}
                </Typography>
              </Box>

              <Box textAlign={{ xs: 'left', sm: 'right' }}>
                <Chip
                  size="small"
                  label={isPaid ? 'Paid' : 'Unpaid'}
                  icon={isPaid ? <CheckCircleIcon fontSize="small" /> : <ScheduleIcon fontSize="small" />}
                  sx={{
                    fontWeight: 700,
                    mb: 1.5,
                    bgcolor: isPaid ? `${ACCENT}1a` : '#fff4d6',
                    color: isPaid ? ACCENT : '#8a6100',
                  }}
                />
                <Typography variant="body2" sx={{ color: MUTED }}>
                  Issued <Box component="span" sx={{ color: INK, fontWeight: 700 }}>{issuedDate}</Box>
                </Typography>
                <Typography variant="body2" sx={{ color: MUTED }}>
                  Due <Box component="span" sx={{ color: INK, fontWeight: 700 }}>{dueDate}</Box>
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ borderColor: HAIRLINE, mb: 4 }} />

            {/* Bill to */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="overline" sx={{ color: MUTED, fontWeight: 700, letterSpacing: 1 }}>
                  Billed to
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, color: INK }}>
                  {company_name}
                </Typography>
              </Grid>
            </Grid>

            {/* Line items */}
            <Box sx={{ mb: 4, borderRadius: 2, overflow: 'hidden', border: `1px solid ${HAIRLINE}` }}>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 1fr 1fr 1fr',
                  bgcolor: 'grey.50',
                  py: 1.25,
                  px: 2,
                }}
              >
                <Typography variant="caption" sx={{ fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Description
                </Typography>
                <Typography variant="caption" textAlign="right" sx={{ fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Rate
                </Typography>
                <Typography variant="caption" textAlign="right" sx={{ fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Qty
                </Typography>
                <Typography variant="caption" textAlign="right" sx={{ fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Amount
                </Typography>
              </Box>

              {invoiceData?.items?.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '3fr 1fr 1fr 1fr',
                    px: 2,
                    py: 1.75,
                    borderTop: `1px solid ${HAIRLINE}`,
                    '&:hover': { bgcolor: 'grey.50' },
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: INK }}>
                      {item.description}
                    </Typography>
                    <Typography variant="caption" sx={{ color: MUTED }}>
                      {item.details}
                    </Typography>
                  </Box>
                  <Typography textAlign="right" variant="body2" sx={{ alignSelf: 'center', color: MUTED }}>
                    {item.rate || '-'}
                  </Typography>
                  <Typography textAlign="right" variant="body2" sx={{ alignSelf: 'center', color: MUTED }}>
                    {item.quantity ?? '-'}
                  </Typography>
                  <Typography
                    textAlign="right"
                    variant="body2"
                    sx={{ alignSelf: 'center', fontWeight: 700, color: INK, fontFamily: 'monospace' }}
                  >
                    {item.amount?.toLocaleString()} {item.currency || 'KES'}
                  </Typography>
                </Box>
              ))}

              {(!invoiceData?.items || invoiceData.items.length === 0) && (
                <Box sx={{ py: 4, textAlign: 'center', borderTop: `1px solid ${HAIRLINE}` }}>
                  <Typography color="text.secondary">
                    {invoiceDesciption || 'No line items available'}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Totals */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
              <Box sx={{ width: { xs: '100%', sm: 300 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: MUTED }}>
                    Subtotal
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: INK, fontFamily: 'monospace' }}>
                    {currency(subtotal)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 1.5, borderColor: HAIRLINE }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: INK }}>
                    Total due
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: ACCENT, fontFamily: 'monospace' }}>
                    {currency(invoiceTotal)}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ borderColor: HAIRLINE, mb: 3 }} />

            {/* Footer note */}
            <Typography variant="body2" sx={{ color: MUTED }}>
              {isPaid
                ? 'Thank you for your business — payment has been received in full.'
                : fallback.notes}
            </Typography>
          </Box>
        </Paper>
      </Box>

      <style>{`
        @media print {
          .no-print { display: none !important; }
        }
      `}</style>
    </>
  );
};

export default InvoicePage;