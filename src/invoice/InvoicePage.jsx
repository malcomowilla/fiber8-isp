import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Paper,
  Grid,
  Chip
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
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useSearchParams } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";



const InvoicePage = () => {
  // Sample invoice data
  const {companySettings, setCompanySettings,} = useApplicationSettings()
  const {company_name, contact_info, email_info, logo_preview} = companySettings
  
  const [searchParams] = useSearchParams();

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
       toast.error('internal servere error  while fetching company settings')
     
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

  const invoiceNumber = searchParams.get('invoiceNumber')
  const invoiceDesciption = searchParams.get('invoiceDesciption')
  const invoiceTotal = searchParams.get('invoiceTotal')
  const issuedDate = searchParams.get('issuedDate')
  const dueDate = searchParams.get('dueDate')
  // const status = searchParams.get('status')
const status = (searchParams.get('status') || '').trim()

  const componentRef = useRef(null);
   const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });


  

  const handleDownloadPDF = () => {
  // Simply trigger the browser's print dialog and let user "Save as PDF"
  window.print();
};


  return (
    <>
          <Toaster />

<Box
sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>

  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Button variant="outlined" 
           onClick={() => window.print()}
            color="success" startIcon={<PrintIcon />}>Print Invoice</Button>

            
            <Button
            
             onClick={handleDownloadPDF}
            variant="outlined"  color="success" startIcon={<DownloadIcon />}>Download</Button>
            {/* <Button variant="outlined" startIcon={<EmailIcon />}>Email</Button> */}




              {status === 'paid' ? (
            <Chip label="Paid" color="success" />
          ) : (
            
            <Button 
            variant="contained" 
            color="success"
            size="large"
            startIcon={<PaymentIcon />}
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
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '3fr 1fr 1fr 1fr',
            borderBottom: '1px solid',
            borderColor: 'divider',
            py: 1,
            fontWeight: 'bold'
          }}>
            <Typography>Description</Typography>
            <Typography textAlign="right">Rate</Typography>
            <Typography textAlign="right">Qty</Typography>
            <Typography textAlign="right">Amount</Typography>
          </Box>
          
            <Box  sx={{ 
              display: 'grid', 
              gridTemplateColumns: '3fr 1fr 1fr 1fr',
              borderBottom: '1px solid',
              borderColor: 'divider',
              py: 2
            }}>
              <Typography>{invoiceDesciption}</Typography>
              <Typography textAlign="right">ksh {invoiceTotal}</Typography>
              <Typography textAlign="right"> ksh {invoiceTotal}</Typography>
              <Typography textAlign="right">ksh {(invoiceTotal)}</Typography>
            </Box>
        </Box>

        {/* Totals */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Box sx={{ width: 300 }}>
            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Subtotal:</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
            </Box> */}


            {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Tax ({invoice.taxRate * 100}%):</Typography>
              <Typography>${tax.toFixed(2)}</Typography>
            </Box> */}


            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <Typography>Total:</Typography>
              
              <Typography>ksh {invoiceTotal}</Typography>
            </Box>



            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <Typography>Sub Total:</Typography>
              
              <Typography>ksh {invoiceTotal}</Typography>
            </Box>
          </Box>
        </Box>

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