

import {useState, useEffect, useCallback} from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Divider, 
  Paper,
  Grid,
  Chip,
  IconButton
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
import { FaLongArrowAltLeft } from "react-icons/fa";
import { useSearchParams } from 'react-router-dom';
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const SubscriberInvoicePage = () => {
  // Sample invoice data
  const {companySettings, setCompanySettings,} = useApplicationSettings()
  const {company_name, contact_info, email_info, 
    logo_preview, location} = companySettings



  
  const [searchParams] = useSearchParams();
  const [subscriberName, setSubscriberName] = useState('N/A')
  const [subscriberEmail, setSubscriberEmail] = useState('N/A')
  const [subscriberPhone, setSubscriberPhone] = useState('N/A')
  const [subscribersAccountNumber, setSubscribersAccountNumber] = useState('N/A')
  const [shortCode, setShortCode] = useState('N/A')

const navigate = useNavigate()



const subdomain = window.location.hostname.split('.')[0]; 

const invoice_id = searchParams.get('invoice_id')

 const getInvoices = useCallback(
    async() => {
      
      try {
        const response = await fetch(`/api/get_subscriber_details_by_invoice?invoice_id=${invoice_id}`, {
          headers: { 'X-Subdomain': subdomain },
        });
        const newData = await response.json();

        if (response.ok) {
          setSubscriberName(newData.subscriber.name)
          setSubscriberEmail(newData.subscriber.email)
          setSubscriberPhone(newData.subscriber.phone_number)
          setSubscribersAccountNumber(newData.subscriber.ref_no)
          setShortCode(newData.shortcode)
          // const { invoices } = newData;
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








  const downloadInvoiceAsImage = async () => {
    try {
      // Show loading state
      const loadingToast = toast.loading('Generating invoice image...');
      
      // Get the invoice element
      const invoiceElement = document.querySelector('.printable-content');
      
      // Create canvas from the invoice element
      const canvas = await html2canvas(invoiceElement, {
        scale: 3, // Higher resolution (3x)
        useCORS: true, // Allow cross-origin images
        backgroundColor: '#ffffff', // White background
        logging: false, // Disable console logs
        allowTaint: true, // Allow tainted canvas
        onclone: (clonedDoc) => {
          // Fix any styling issues on the cloned element
          const clonedElement = clonedDoc.querySelector('.printable-content');
          if (clonedElement) {
            // Ensure proper styling for the screenshot
            clonedElement.style.width = '100%';
            clonedElement.style.maxWidth = '800px';
            clonedElement.style.margin = '0 auto';
            clonedElement.style.padding = '0';
            clonedElement.style.background = '#ffffff';
          }
        }
      });
      
      // Convert canvas to blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Invoice-${invoiceNumber || 'unknown'}-${Date.now()}.png`;
          
          // Append to body and click
          document.body.appendChild(link);
          link.click();
          
          // Clean up
          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.dismiss(loadingToast);
            toast.success('Invoice downloaded successfully!');
          }, 100);
        }
      }, 'image/png', 1.0); // Highest quality
      
    } catch (error) {
      toast.error('Failed to generate invoice image');
    }
  };

  // Alternative: Download as JPEG with higher compression
  const downloadInvoiceAsJPEG = async () => {
    try {
      toast.loading('Generating JPEG invoice...');
      
      const invoiceElement = document.querySelector('.printable-content');
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true
      });
      
      // Convert canvas to JPEG (smaller file size)
      const jpegUrl = canvas.toDataURL('image/jpeg', 0.9); // 90% quality
      const link = document.createElement('a');
      link.href = jpegUrl;
      link.download = `Invoice-${invoiceNumber}-${Date.now()}.jpg`;
      link.click();
      
      toast.success('Invoice JPEG downloaded!');
    } catch (error) {
      toast.error('Failed to generate JPEG');
    }
  };





    // Better version with proper margins and formatting
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


  



    // Simple version for quick download
  const downloadQuickPDF = async () => {
    try {
      const invoiceElement = document.querySelector('.printable-content');
      const canvas = await html2canvas(invoiceElement, { scale: 2 });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${Date.now()}.pdf`);
      
      toast.success('PDF downloaded!');
    } catch (error) {
      toast.error('Failed to generate PDF');
    }
  };



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
           customer_support_phone_number,agent_email ,customer_support_email,
           location
          } = newData
         setCompanySettings((prevData)=> ({...prevData, 
           contact_info, company_name, email_info,
           customer_support_phone_number,agent_email ,customer_support_email,
           location,
         
           logo_preview: logo_url
         }))
 
        //  console.log('company settings fetched', newData)
       }else{
        //  console.log('failed to fetch company settings')
       }
     } catch (error) {
      //  toast.error(' error while fetching company settings')
     
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
  const invoiceDesciption = searchParams.get('description')
  const invoiceTotal = searchParams.get('total')
  const issuedDate = searchParams.get('issuedDate')
  const dueDate = searchParams.get('dueDate')
  const item = searchParams.get('item')
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
  
  <Box sx={{ maxWidth: 900, mx: 'auto', my: 4 }}>
    {/* Action Buttons */}
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      mb: 3, 
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{ 
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          p: 1
        }}
      >
        <FaLongArrowAltLeft className='w-5 h-5' />
      </IconButton>
      
      <Button 
        variant="outlined" 
        onClick={() => window.print()}
        startIcon={<PrintIcon />}
        sx={{ 
          borderColor: '#4CAF50',
          color: '#4CAF50',
          '&:hover': { borderColor: '#388E3C', backgroundColor: '#E8F5E9' }
        }}
      >
        Print
      </Button>
      
      <Button
        onClick={downloadInvoiceAsFormattedPDF}
        variant="contained"
        startIcon={<DownloadIcon />}
        sx={{ 
          backgroundColor: '#2196F3',
          '&:hover': { backgroundColor: '#1976D2' }
        }}
      >
        Download 
      </Button>
      
      {status === 'paid' ? (
        <Chip 
          label="PAID" 
          color="success" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '0.8rem',
            ml: 'auto'
          }}
        />
      ) : (
        <Chip 
          label={status}
          color={`${status === 'paid' ? 'success' : 'warning'}`}
          sx={{ 
            fontWeight: 'bold',
            fontSize: '0.8rem',
            ml: 'auto'
          }}
        />
      )}
    </Box>

    {/* Invoice Container */}
    <Paper
      ref={componentRef}
      className="printable-content"
      elevation={0}
      sx={{ 
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}
    >
      {/* Invoice Header */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        mb: 4,
        pb: 3,
        borderBottom: '2px solid #2196F3'
      }}>
        <Box sx={{ mb: { xs: 3, md: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ 
              backgroundColor: '#2196F3',
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DescriptionIcon sx={{ color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                color: '#1a237e',
                letterSpacing: '-0.5px'
              }}>
                INVOICE
              </Typography>
              <Typography variant="body2" sx={{ color: '#666' }}>
                Professional Billing Document
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
              Invoice Number
            </Typography>
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              color: '#2196F3',
              fontFamily: 'monospace'
            }}>
              {invoiceNumber}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Box sx={{ 
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: { xs: 'flex-start', md: 'flex-end' }
          }}>
            <img
              className="h-16 w-16 rounded-lg border-2 border-gray-100"
              src={logo_preview || "/images/aitechs.png"}
              alt={company_name || "Aitechs"}
              onError={(e) => { e.target.src = "/images/aitechs.png"; }}
              style={{ marginBottom: '12px' }}
            />
            
            <Box sx={{ 
              backgroundColor: status === 'paid' ? '#E8F5E9' : '#FFF3E0',
              px: 2,
              py: 1,
              borderRadius: 2,
              mb: 2
            }}>
              <Typography variant="caption" sx={{ 
                fontWeight: 600,
                color: status === 'paid' ? '#2E7D32' : '#F57C00'
              }}>
                {status === 'paid' ? 'PAID IN FULL' : 'PAYMENT PENDING'}
              </Typography>
            </Box>
            
            <Box sx={{ 
              backgroundColor: '#F5F7FA',
              p: 2,
              borderRadius: 2,
              textAlign: 'left'
            }}>
              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                Issued Date
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                {issuedDate}
              </Typography>
              
              <Typography variant="caption" sx={{ color: '#666', display: 'block' }}>
                Due Date
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {dueDate}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Company & Client Info */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            backgroundColor: '#F8F9FA',
            p: 3,
            borderRadius: 2,
            borderLeft: '4px solid #2196F3'
          }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600,
              color: '#1a237e',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{ 
                width: 8,
                height: 8,
                backgroundColor: '#2196F3',
                borderRadius: '50%'
              }} />
              INVOICED BY
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {company_name || 'N/A'}
            </Typography>

              <Typography variant="body2" sx={{ color: '#666' }}>
             {location || 'N/A'}
            </Typography>

              <Typography variant="body2" sx={{ color: '#666' }}>
             {email_info || 'N/A'}
            </Typography>

             <Typography variant="body2" sx={{ color: '#666' }}>
             {contact_info || 'N/A'}
            </Typography>
            
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            backgroundColor: '#F8F9FA',
            p: 3,
            borderRadius: 2,
            borderLeft: '4px solid #4CAF50'
          }}>
            <Typography variant="subtitle1" sx={{ 
              fontWeight: 600,
              color: '#1a237e',
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{ 
                width: 8,
                height: 8,
                backgroundColor: '#4CAF50',
                borderRadius: '50%'
              }} />
              INVOICED TO
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {subscriberName || 'N/A'}
            </Typography>

              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {subscriberPhone || 'N/A'}
            </Typography>


             <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              {subscriberEmail || 'N/A'}
            </Typography>
           
          </Box>
        </Grid>
      </Grid>

      {/* Invoice Items Table */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          color: '#1a237e',
          mb: 2,
          fontSize: '1.1rem'
        }}>
          Invoice Details
        </Typography>
        
        {/* Table Header */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '3fr 1fr 1fr 1fr'  },
          gap: 2,
          backgroundColor: '#1a237e',
          color: 'white',
          p: 2,
          borderRadius: 1,
          mb: 2
        }}>
          <Typography sx={{ fontWeight: 600 }}>DESCRIPTION</Typography>
            <Typography sx={{ fontWeight: 600, textAlign: { xs: 'left', md: 'right' } }}>ITEM</Typography>

          <Typography sx={{ fontWeight: 600, textAlign: { xs: 'left', md: 'right' } }}>QTY</Typography>
          <Typography sx={{ fontWeight: 600, textAlign: { xs: 'left', md: 'right' } }}>AMOUNT</Typography>
        </Box>
        
        {/* Table Row */}
        <Box sx={{ 
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '3fr 1fr 1fr 1fr' },
          gap: 2,
          p: 2,
          borderBottom: '1px solid #e0e0e0',
          '&:hover': { backgroundColor: '#F9F9F9' }
        }}>
          <Box>
            <Typography sx={{ fontWeight: 500, mb: 0.5 }}>
              {invoiceDesciption}
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Internet Service Subscription
            </Typography>
          </Box>
          <Typography sx={{ 
            fontWeight: 500,
            textAlign: { xs: 'left', md: 'right' }
          }}>
            {item}
          </Typography>
          <Typography sx={{ 
            fontWeight: 500,
            textAlign: { xs: 'left', md: 'right' }
          }}>
            1
          </Typography>
          <Typography sx={{ 
            fontWeight: 500,
            textAlign: { xs: 'left', md: 'right' }
          }}>
            Ksh {invoiceTotal}
          </Typography>
        </Box>
      </Box>

      {/* Totals Section */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'flex-end',
        gap: 3
      }}>
        <Box sx={{ 
          width: { xs: '100%', md: 300 },
          backgroundColor: '#F8F9FA',
          p: 3,
          borderRadius: 2,
          border: '1px solid #e0e0e0'
        }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ 
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1
            }}>
              Summary
            </Typography>
            
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1.5
            }}>
              <Typography sx={{ color: '#666' }}>Subtotal</Typography>
              <Typography sx={{ fontWeight: 500 }}>Ksh {invoiceTotal}</Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1.5
            }}>
              <Typography sx={{ color: '#666' }}>Tax (0%)</Typography>
              <Typography sx={{ fontWeight: 500 }}>Ksh 0.00</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography sx={{ fontWeight: 600, color: '#1a237e' }}>
                Total Amount
              </Typography>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                color: '#2196F3'
              }}>
                Ksh {invoiceTotal}
              </Typography>
            </Box>
          </Box>
          
          {status !== 'paid' && (
            <Box sx={{ 
              mt: 3,
              p: 2,
              backgroundColor: '#FFF3E0',
              borderRadius: 1,
              borderLeft: '3px solid #FF9800'
            }}>
              <Typography variant="body2" sx={{ color: '#E65100' }}>
                <strong>Note:</strong> Payment due by {dueDate}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Payment Status & Notes */}
      <Box sx={{ 
        mt: 4,
        pt: 3,
        borderTop: '1px solid #e0e0e0'
      }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ 
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1,
              fontWeight: 900
            }}>
              Payment Details
            </Typography>
            <Box sx={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              backgroundColor: status === 'paid' ? '#E8F5E9' : '#FFF3E0',
              borderRadius: 1
            }}>
              <Box sx={{ 
                width: 12,
                height: 12,
                backgroundColor: status === 'paid' ? '#4CAF50' : '#FF9800',
                borderRadius: '50%'
              }} />
              {/* <Typography sx={{ 
                fontWeight: 500,
                color: status === 'paid' ? '#2E7D32' : '#E65100'
              }}>
                {status === 'paid' ? 'Payment Completed' : 'Awaiting Payment'}
              </Typography> */}
               {/* <Typography sx={{ fontWeight: 500 }}>Ksh 0.00</Typography> */}
               <div className='flex flex-col'>
               

                <div className='flex gap-2'> 
<p className='font-bold'>Paybill:</p>
<p>{shortCode}</p>

                </div>


                <div className='flex gap-2'>
                <p className='font-bold'>Client Account Number:</p>
                <p>{subscribersAccountNumber}</p>
                </div>
                </div>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" sx={{ 
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              mb: 1
            }}>
              Notes
            </Typography>
            <Box sx={{ 
              p: 2,
              backgroundColor: '#F5F7FA',
              borderRadius: 1,
              borderLeft: '3px solid #9C27B0'
            }}>
              <Typography variant="body2" sx={{ color: '#555' }}>
                {status === 'paid' 
                  ? 'Thank you for your business. Payment successfully processed.'
                  : 'Please make payment by the due date to avoid service interruption.'
                }
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box sx={{ 
        mt: 4,
        pt: 3,
        borderTop: '1px dashed #e0e0e0',
        textAlign: 'center'
      }}>
        <Typography variant="caption" sx={{ color: '#999' }}>
          Invoice generated electronically • Valid without signature • {company_name || "Aitechs"}
        </Typography>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          gap: 2,
          mt: 1,
          flexWrap: 'wrap'
        }}>
          {contact_info && (
            <Typography variant="caption" sx={{ color: '#666' }}>
              📞 {contact_info}
            </Typography>
          )}
          {email_info && (
            <Typography variant="caption" sx={{ color: '#666' }}>
              ✉️ {email_info}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  </Box>
</>
  );
};

export default SubscriberInvoicePage;