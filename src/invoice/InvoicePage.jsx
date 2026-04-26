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
  Alert
} from '@mui/material';
import { 
  Payment as PaymentIcon,
  Description as DescriptionIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Email as EmailIcon
} from '@mui/icons-material';

import {useApplicationSettings} from '../settings/ApplicationSettings'
import toast, { Toaster } from 'react-hot-toast';
import { useCallback, useEffect, useState } from 'react';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { parseInvoiceDescription } from '../utils/invoiceParser';
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';




const InvoicePage = () => {
  // Sample invoice data
  const {companySettings, setCompanySettings,
     hotspotMpesaSettings, setHotspotMpesaSettings, 
     selectedAccountTypeHotspot,
      setSelectedAccountTypeHotspot} = useApplicationSettings()
  const {company_name, contact_info, email_info, logo_preview} = companySettings
  
  const [searchParams] = useSearchParams();
  const [openPaymentInstructions, setOpenPaymentInstructions] = useState(false);


const { consumer_key, consumer_secret, passkey, short_code, 
  api_initiator_username, api_initiator_password
 } = hotspotMpesaSettings
const navigate = useNavigate()



const subdomain = window.location.hostname.split('.')[0]; 

const handleGetCompanySettings = useCallback(
   async() => {
     try {
       const response = await fetch('/api/allow_get_company_settings', {
         method: 'GET',
         headers: {
           'X-Subdomain': subdomain,
         },
       })
       const newData = await response.json()
       if (response.ok) {
         // setcompanySettings(newData)
         const { contact_info, company_name, email_info, logo_url,
           customer_support_phone_number,agent_email ,customer_support_email
          } = newData
         setCompanySettings((prevData)=> ({...prevData, 
           contact_info, company_name, email_info,
           customer_support_phone_number,agent_email ,customer_support_email,
         
           logo_preview: logo_url
         }))
 
         console.log('company settings fetched', newData)
       }else{
         console.log('failed to fetch company settings')
       }
     } catch (error) {
      //  toast.error('internal servere error  while fetching company settings')
     
     }
   },
   [],
 )
 
 useEffect(() => {
   
   handleGetCompanySettings()
   
 }, [handleGetCompanySettings])

  const invoice = {
    number: 'INV-2023-001',
    date: 'June 15, 2023',
    dueDate: 'July 15, 2023',
    status: 'Pending',
    from: {
      name: 'Aitechs',
      address: '123 Business Rd, City, Country',
      email: 'billing@yourcompany.com',
      phone: '+1 (555) 123-4567'
    },
    to: {
      name: 'Client Name',
      address: '456 Client Ave, City, Country',
      email: 'client@email.com'
    },
    items: [
      { id: 1, description: 'Web Development Services', quantity: 1, rate: 1200.00 },
      { id: 2, description: 'UI/UX Design', quantity: 1, rate: 800.00 },
      { id: 3, description: 'Consultation Hours', quantity: 5, rate: 100.00 }
    ],
    taxRate: 0.1, // 10%
    notes: 'Thank you for your business! Payment is due within 30 days.'
  };

  // Calculate totals
  const subtotal = invoice.items.reduce((sum, item) => sum + (item.rate * item.quantity), 0);
  const tax = subtotal * invoice.taxRate;
  const total = subtotal + tax;

  // const invoiceNumber = searchParams.get('invoiceNumber')
  // const invoiceDesciption = searchParams.get('invoiceDesciption')
  // const invoiceTotal = searchParams.get('invoiceTotal')
  // const issuedDate = searchParams.get('issuedDate')
  // const dueDate = searchParams.get('dueDate')
  const id = searchParams.get('id')

  const [status, setStatus] = useState('N/A')
  const [invoiceNumber, setInvoiceNumber] = useState('N/A')
  const [invoiceDesciption, setInvoiceDesciption] = useState('N/A')
  const [invoiceTotal, setInvoiceTotal] = useState('N/A')
  const [issuedDate, setIssuedDate] = useState('N/A')
  const [dueDate, setDueDate] = useState('N/A')
  const [invoiceData, setInvoiceData] = useState(null); 


  
  // const status = searchParams.get('status')
// const status = (searchParams.get('status') || '').trim()





const fetchSavedHotspotMpesaSettings = useCallback(
  async() => {
    
    try {
      const response = await fetch(`/api/saved_hotspot_mpesa_settings`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
      });
  
      const data = await response.json();

      const newData = data.length > 0 
        ? data.reduce((latest, item) => new Date(item.created_at) > new Date(latest.created_at) ? item : latest, data[0])
        : null;
  
      if (response.ok) {
        // console.log('Fetched hotspot mpesa settings:', newData);
        const { consumer_key, consumer_secret, passkey, short_code } = newData;
        setSelectedAccountTypeHotspot(newData.account_type)
        setHotspotMpesaSettings({ consumer_key, consumer_secret, passkey, 
          short_code,
          api_initiator_username, api_initiator_password
         })
      } else {


        if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
        
      }
if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
        

        
      }
    } catch (error) {
    
    }
  },
  [],
)


useEffect(() => {
  fetchSavedHotspotMpesaSettings();
 
}, [fetchSavedHotspotMpesaSettings]);








const fetchHotspotMpesaSettings = useCallback(async () => {
  try {
    const response = await fetch(`/api/hotspot_mpesa_settings?account_type=${selectedAccountTypeHotspot}`, {
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      },
    });

    const newData = await response.json();

    if (response.ok) {
      
      if (
        !newData || // Handles null or undefined
        newData.length === 0 || // Handles empty array
        !newData.account_type // Handles missing or null provider
      ) {
      
        setHotspotMpesaSettings({ 
          consumer_key: '', 
          consumer_secret: '', 
          passkey: '', 
          short_code: '' ,
          api_initiator_username: '',
          api_initiator_password: ''
        });
      
        // setSelectedProvider('');
      } else {
      
        const { consumer_key, consumer_secret, passkey, short_code,
          api_initiator_username, api_initiator_password
         } = newData;
      

        setHotspotMpesaSettings(prevData => ({
          ...prevData, 
          consumer_key, consumer_secret, passkey, short_code,
          api_initiator_username, api_initiator_password
        }));
      
      }
    } else {
      
    }
  } catch (error) {

  }
}, [selectedAccountTypeHotspot]);


useEffect(() => {
  if (selectedAccountTypeHotspot) {
    fetchHotspotMpesaSettings();
  }
}, [fetchHotspotMpesaSettings, selectedAccountTypeHotspot]);





  const getInvoices = useCallback(
    async() => {
      
      try {
        const response = await fetch(`/api/get_invoice?id=${id}`, {
          headers: { 'X-Subdomain': subdomain },
        });
        const newData = await response.json();



        if (response.ok) {
          // const { invoices } = newData;
          setStatus(newData.status)
          setInvoiceNumber(newData.invoice_number)
          setInvoiceDesciption(newData.invoice_desciption)
          setInvoiceTotal(newData.total)
          setIssuedDate(newData.invoice_date)
          setDueDate(newData.due_date)

            const parsed = parseInvoiceDescription(newData.invoice_desciption);
      setInvoiceData(parsed);
        }else{
          if (response.status === 403) {
            toast.error('permision denied to get invoices', {
              duration: 6000, 
            })
            
          }

if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    duration: 4000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}

        }
      } catch (error) {
        
      }
    },
    [],
  )
  


  useEffect(() => {
    getInvoices();
   
  }, [getInvoices]);
  const componentRef = useRef(null);
   


  const downloadInvoiceAsFormattedPDF = async () => {
    try {
      // const loadingToast = toast.loading('Creating formatted PDF...');
      
      const invoiceElement = document.querySelector('.printable-content');
      
      // Options for better PDF quality
      const canvas = await html2canvas(invoiceElement, {
        scale: 3, // Higher resolution for PDF
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Optimize cloned element for PDF
          const element = clonedDoc.querySelector('.printable-content');
          if (element) {
            element.style.width = '100%';
            element.style.maxWidth = '800px';
            element.style.margin = '0 auto';
            element.style.padding = '20px';
            element.style.boxSizing = 'border-box';
            element.style.fontSize = '14px';
            
            // Force all colors to black for better PDF printing
            element.querySelectorAll('*').forEach(el => {
              const computedColor = window.getComputedStyle(el).color;
              if (computedColor !== 'rgb(0, 0, 0)') {
                el.style.color = '#000000';
              }
            });
          }
        }
      });
      
      // PDF settings
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Calculate dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Add margins
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);
      const contentHeight = pdfHeight - (margin * 2);
      
      // Calculate image dimensions to fit within margins
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * contentWidth) / canvas.width;
      
      // Convert canvas to image
      const imgData = canvas.toDataURL('image/jpeg', 0.95); // Good quality JPEG
      
      // Check if content fits on one page
      let heightLeft = imgHeight;
      let position = margin;
      
      // Add first page
      pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
      heightLeft -= contentHeight;
      
      // Add additional pages if content is longer than one page
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', margin, position, imgWidth, imgHeight);
        heightLeft -= contentHeight;
      }
      
      // Save the PDF
      const fileName = `Invoice-${invoiceNumber || 'Unknown'}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      // toast.dismiss(loadingToast);
      toast.success('PDF generated successfully!');
      
    } catch (error) {
      // console.error('PDF generation error:', error);
      // toast.error('Failed to generate PDF');
    }
  };
  



  return (
    <>
          <Toaster />


<Dialog
  open={openPaymentInstructions}
  onClose={() => setOpenPaymentInstructions(false)}
  maxWidth="sm"
  fullWidth
  PaperProps={{ sx: { borderRadius: 2 } }}
>
  <DialogTitle sx={{ bgcolor: 'success.main', color: 'white', fontWeight: 'bold' }}>
    <Box display="flex" alignItems="center" gap={1}>
      <PaymentIcon />
      Pay via M-Pesa
    </Box>
  </DialogTitle>
  
  <DialogContent dividers sx={{ mt: 2 }}>
    <Typography variant="body1" gutterBottom fontWeight="medium">
      Follow these simple steps to complete your payment:
    </Typography>
    
    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Step 1 */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: 'success.light', width: 28, height: 28 }}>1</Avatar>
        <Typography>Go to <strong>M-Pesa</strong> on your phone</Typography>
      </Box>
      
      {/* Step 2 */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: 'success.light', width: 28, height: 28 }}>2</Avatar>
        <Typography>Select <strong>Lipa Na M-Pesa</strong></Typography>
      </Box>
      
      {/* Step 3 - Paybill */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: 'success.light', width: 28, height: 28 }}>3</Avatar>
        <Typography>
          Select <strong>Paybill:</strong>{' '} And Enter Business No
          <Box component="span" sx={{ 
            bgcolor: 'grey.100', 
            px: 2, 
            py: 0.5, 
            borderRadius: 1,
            fontFamily: 'monospace',
            fontWeight: 'bold'
          }}>
            {short_code || '4007893'}
          </Box>
        </Typography>
      </Box>
      
      {/* Step 4 - Account Number */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: 'success.light', width: 28, height: 28 }}>4</Avatar>
        <Typography>
          Enter <strong>Account Number:</strong>{' '}
          <Box component="span" sx={{ 
            bgcolor: 'grey.100', 
            px: 2, 
            py: 0.5, 
            borderRadius: 1,
            fontFamily: 'monospace',
            fontWeight: 'bold'
          }}>
            {invoiceNumber}
          </Box>
        </Typography>
      </Box>
      
      {/* Step 5 - Amount */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: 'success.light', width: 28, height: 28 }}>5</Avatar>
        <Typography>
          Enter <strong>Amount:</strong>{' '}
          <Box component="span" sx={{ 
            bgcolor: 'grey.100', 
            px: 2, 
            py: 0.5, 
            borderRadius: 1,
            fontFamily: 'monospace',
            fontWeight: 'bold'
          }}>
            KES {parseFloat(invoiceTotal || 0).toLocaleString()}
          </Box>
        </Typography>
      </Box>
      
      {/* Step 6 - PIN */}
      <Box display="flex" alignItems="center" gap={2}>
        <Avatar sx={{ bgcolor: 'success.light', width: 28, height: 28 }}>6</Avatar>
        <Typography>Enter your <strong>M-Pesa PIN</strong> and confirm</Typography>
      </Box>
    </Box>
    
    <Divider sx={{ my: 3 }} />
    
    <Alert severity="info" sx={{ borderRadius: 2 }}>
      <Typography variant="body2">
        Once payment is successful, your invoice
         status will be updated automatically within <strong>1-3 minutes</strong>.
        You will receive an SMS confirmation.
      </Typography>
    </Alert>
  </DialogContent>
  
  <DialogActions sx={{ p: 3, pt: 2 }}>
    <Button 
      variant="contained" 
      color="success" 
      fullWidth
      size="large"
      onClick={() => setOpenPaymentInstructions(false)}
    >
      I've Made the Payment
    </Button>
    <Button 
      variant="outlined" 
      onClick={() => setOpenPaymentInstructions(false)}
      sx={{ mt: 1 }}
      fullWidth
    >
      Close
    </Button>
  </DialogActions>
</Dialog>


<Box
sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>

  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button variant="outlined" 
           onClick={() => window.print()}
            color="success" startIcon={<PrintIcon />}>Print Invoice</Button>

            
            <Button
            
             onClick={downloadInvoiceAsFormattedPDF}
            variant="outlined"  color="success" 
            startIcon={<DownloadIcon />}>Download</Button>
            {/* <Button variant="outlined" startIcon={<EmailIcon />}>Email</Button> */}




              {status === 'paid' ? (
            <Chip label="Paid" color="success" />
          ) : (
            
            <Button 
            variant="contained" 
            color="success"
            size="large"
            startIcon={<PaymentIcon />}
              onClick={() => setOpenPaymentInstructions(true)}
            sx={{ px: 4 }}
          >
            Pay Now
          </Button>
          )}
          
          </Box>



      <Paper
      ref={componentRef} 
className="printable-content"
      elevation={3} 
        
      sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <FaLongArrowAltLeft
        
        onClick={() => {
navigate(-1)
          // setSeeInvoicePage(false)
          // setSeeInvoice(true)
        }} className='w-7 h-7 cursor-pointer'/>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Typography variant="h8" sx={{ fontWeight: '', display: 'flex', alignItems: 'center' }}>
              <DescriptionIcon color="success" sx={{ mr: 1,  }} />
              <p><span className='font-bold text-lg'>Invoice No: </span>{invoiceNumber}</p>
            </Typography>
            <Chip 
              label={status} 
              color={status === 'paid' ? 'success' : 'warning'} 
              sx={{ mt: 1 }}
            />
          </Box>
          
          <Box textAlign="right">
            <div className='flex justify-center p-3'>

               <img
  className="h-[80px] w-[80px] rounded-full"
  src={logo_preview || "/images/aitechs.png"}
  alt={company_name || "Aitechs"}
  onError={(e) => { e.target.src = "/images/aitechs.png"; }}
/>
            </div>
            <div>
              <p className='font-light'>Issued: <span className='text-black font-bold'>{issuedDate}</span> </p>
            </div>


            <div>
              <p className='font-light'>Due: <span className='text-black font-bold'>{dueDate}</span> </p>
            </div>
          </Box>
        </Box>

        {/* From/To */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">From</Typography>
            <Typography variant="body1" sx={{ fontWeight: 900 }}>{invoice.from.name}</Typography>
            {/* <Typography variant="body2">{invoice.from.address}</Typography> */}
            {/* <Typography variant="body2">{invoice.from.email}</Typography> */}
            {/* <Typography variant="body2">{invoice.from.phone}</Typography> */}
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Bill To</Typography>
            <Typography variant="body1" sx={{ fontWeight: 800 }}>
              
              <p className='text-black'>{company_name}</p>
              
              </Typography>
            {/* <Typography variant="body2">{invoice.to.address}</Typography> */}
            {/* <Typography variant="body2">{invoice.to.email}</Typography> */}
          </Grid>





<Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">Status</Typography>
            <Typography variant="body1" sx={{ fontWeight: 800 }}>
              
              <p className='text-black'>{status === 'paid' ? <p className='text-green-500'>Paid </p> : <p className='text-red-500'>Unpaid </p>}</p>
              
              </Typography>
            {/* <Typography variant="body2">{invoice.to.address}</Typography> */}
            {/* <Typography variant="body2">{invoice.to.email}</Typography> */}
          </Grid>

          
        </Grid>

       
{/* Items Table */}
<Box sx={{ mb: 4 }}>
  {/* Header */}
  <Box sx={{ 
    display: 'grid', 
    gridTemplateColumns: '3fr 1fr 1fr 1fr',
    borderBottom: '1px solid',
    borderColor: 'divider',
    py: 1,
    fontWeight: 'bold',
    bgcolor: 'action.hover'
  }}>
    <Typography>Description</Typography>
    <Typography textAlign="right">Rate</Typography>
    <Typography textAlign="right">Qty</Typography>
    <Typography textAlign="right">Amount (KES)</Typography>
  </Box>

  {/* Dynamic Rows */}
  {invoiceData?.items?.map((item, index) => (
    <Box key={index} sx={{ 
      display: 'grid', 
      gridTemplateColumns: '3fr 1fr 1fr 1fr',
      borderBottom: '1px solid',
      borderColor: 'divider',
      py: 2,
      '&:hover': { bgcolor: 'action.hover' }
    }}>
      <Box>
        <Typography variant="body2" fontWeight="medium">
          {item.description}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {item.details}
        </Typography>
      </Box>
      <Typography textAlign="right" sx={{ alignSelf: 'center' }}>
        {item.rate || '-'}
      </Typography>
      <Typography textAlign="right" sx={{ alignSelf: 'center' }}>
        {item.quantity ?? '-'}
      </Typography>
      <Typography textAlign="right" fontWeight="bold" sx={{ alignSelf: 'center' }}>
        {item.amount?.toLocaleString()} {item.currency || 'KES'}
      </Typography>
    </Box>
  ))}

  {/* Fallback */}
  {(!invoiceData?.items || invoiceData.items.length === 0) && (
    <Box sx={{ py: 4, textAlign: 'center' }}>
      <Typography color="text.secondary">
        {invoiceDesciption || 'No line items available'}
      </Typography>
    </Box>
  )}
</Box>

{/* Totals */}
<Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
  <Box sx={{ width: 300 }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
      <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
      <Typography variant="body2" fontWeight="medium">
        {invoiceData?.items
          ?.filter(item => item.amount)
          .reduce((sum, item) => sum + item.amount, 0)
          .toLocaleString() || '0'} KES
      </Typography>
    </Box>
    
    <Divider sx={{ my: 1.5 }} />
    
    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="subtitle1" fontWeight="bold">Total Due:</Typography>
      <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
        {parseFloat(invoiceTotal || 0).toLocaleString()} KES
      </Typography>
    </Box>
  </Box>
</Box>

{/* Notes */}
<Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
  {/* Fix status comparison: use lowercase "paid" */}
  {status?.toLowerCase() === 'paid' ? (
    <span className="text-black dark:text-white">
      Thank you for your business! Payment is successfully completed.
    </span>
  ) : (
    invoice.notes || 'Thank you for your business! Payment is due within 2 days.'
  )}
</Typography>

        {/* Notes */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {status === 'Paid' ? (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              <p className='text-black dark:text-white'>Thank you for your business! Payment is succesfully completed </p>
            </Typography>
          )
         
          : 
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            {invoice.notes}
          </Typography>
          }
        </Typography>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
         

        
        </Box>
      </Paper>
    </Box>
    </>
  );
};

export default InvoicePage;