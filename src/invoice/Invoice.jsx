import React, { useState, useCallback, useEffect } from 'react';
import MaterialTable from 'material-table';
import { 
  IconButton, 
  Chip,
  Paper,
  Typography,
  Box,
  Button, 
  Divider, 
  Grid,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Payment as PaymentIcon,
  Description as DescriptionIcon,

  Print as PrintIcon,
  Download as DownloadIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import {Link, useNavigate} from 'react-router-dom'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import toast, { Toaster } from 'react-hot-toast';
import { FaLongArrowAltLeft } from "react-icons/fa";
import DeleteInvoice from '../delete/DeleteInvoice'




const Invoice = () => {
 
const [invoices, setInvoices] = useState([])
  const statusColors = {
    paid: 'success',
    pending: 'warning',
    overdue: 'error'
  };
const [seeInvoice, setSeeInvoice] = useState(true)
const [seeInvoicePage, setSeeInvoicePage] = useState(false)
const [issuedDate, setIssuedDate] = useState('')
const [dueDate, setDueDate] = useState('')
const [status, setStatus] = useState('')
const [invoiceNumber, setInvoiceNumber] = useState('')
const [invoiceTotal, setInvoiceTotal] = useState('')
const [invoiceDesciption, setInvoiceDesciption] = useState('')
const [openDeleteInvoice, setOpenDeleteInvoice] = useState(false)
const [invoiceId, setInvoiceId] = useState('')


  const navigate = useNavigate()
  const subdomain = window.location.hostname.split('.')[0];
    const {companySettings, setCompanySettings,} = useApplicationSettings()
  const {company_name, contact_info, email_info, logo_preview} = companySettings



  const handleCloseDelete = () => {
    setOpenDeleteInvoice(false);
  }


const handleRowClick = (event, rowData) => { 
setStatus(rowData.status)
setDueDate(rowData.due_date)
setIssuedDate(rowData.invoice_date)
setSeeInvoicePage(true)
setSeeInvoice(false)
setInvoiceNumber(rowData.invoice_number)
setInvoiceDesciption(rowData.invoice_desciption)
// setInvoiceId(rowData.id)
setInvoiceTotal(rowData.total)
console.log('invoice row data', rowData)


}





const deleteInvoice = async(id)=> {

  try {
    // setLoading(true)
    const response = await fetch(`/api/invoices/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Subdomain': subdomain,
      },
    })
const newData = response.status !== 204 ? await response.json() : {};

// console.log("Response status:", response.status);
    if (response.ok || response.status === 204) {
      // setLoading(false)
      setInvoices(invoices.filter((invoice) => invoice.id !== id))
      toast.success(
        'Invoice deleted successfully',
        {
          position: 'top-center',
          duration: 4000,
        }
      )
    } else {

      // setLoading(false)
      toast.error(
        newData.error,
        {
          position: 'top-center',
        }
      )
      toast.error(
        'Failed to delete invoice',
        {
          position: 'top-center',
        }
      )
    }
  } catch (error) {
    // setLoading(false)
    toast.error(
      'Failed to delete invoice something went wrong',
      
      {
        position: 'top-center',
        duration: 4000
      }
    )
  }
}








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




  const getInvoices = useCallback(
    async() => {
      
      try {
        const response = await fetch('/api/invoices', {
          headers: { 'X-Subdomain': subdomain },
        });
        const newData = await response.json();



        if (response.ok) {
          console.log('invoices fetched', newData);
          // const { invoices } = newData;
          setInvoices(newData);
        }else{
          if (response.status === 403) {
            toast.error('permision denied to get invoices', {
              duration: 6000, 
            })
            
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



  return (
    <>
<Toaster />
<DeleteInvoice handleCloseDelete={handleCloseDelete} 
openDeleteInvoice={openDeleteInvoice}  deleteInvoice={deleteInvoice} id={invoiceId}/>

<Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <DescriptionIcon color="success" sx={{ fontSize: 32, mr: 1 }} />
        <Typography variant="h5" component="h2" color="success">
          My Invoice
        </Typography>
      </Box>

      <MaterialTable
      onRowClick={handleRowClick}
      title={<p className='bg-gradient-to-r from-green-600 via-blue-400
         to-cyan-500 bg-clip-text text-transparent text-2xl font-bold'>Your Payment invoices</p>}
        columns={[
          {
            title: <p className=' text-black'>Invoice #</p>,
            field: 'invoice_number',
            headerStyle: { fontWeight: 'bold' },
            render: rowData => (
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                <p className='dark:text-white'>{rowData.invoice_number}</p>
              </Typography>
            )
          },
          
          {
            title: <p className='text-black'>Invoice Date</p>,
            field: 'invoice_date',
            type: 'date',
            headerStyle: { fontWeight: 'bold' },
            render: rowData =>  <p className='dark:text-white'>{rowData.invoice_date} </p>
          },
          {
            title: <p className='text-black'>Due Date</p>,
            field: 'due_date',
            type: 'date',
            headerStyle: { fontWeight: 'bold' },
            render: rowData => (
              <Typography 
                sx={{ 
                  fontWeight: 500,
                  color: rowData.due_date < new Date() && rowData.status !== 'paid' 
                    ? 'error.main' 
                    : 'inherit'
                }}
              >
                {rowData.due_date}
              </Typography>
            )
          },
          {
            title: <p className='text-black'>Total</p>,
            field: 'total',
            headerStyle: { fontWeight: 'bold' },
            render: rowData => (
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
               <p className='dark:text-white'> ksh {rowData.total} </p>
              </Typography>
            )
          },
          {
            title: <p className='text-black'>Status</p>,
            field: 'status',
            headerStyle: { fontWeight: 'bold' },
            render: (rowData) => (
              <Chip
                label={rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)}
                color={statusColors[rowData.status] || 'default'}
                variant="outlined"
                sx={{ 
                  fontWeight: 500,
                  borderWidth: 1.5,
                  textTransform: 'capitalize'
                }}
              />
            )
          },


          
        ]}
        data={invoices}

        
        actions={[
          

          {
            icon: () => <EditIcon
            
            color="success"
            // onClick={(rowData) => navigate(`/admin/invoice-page`)}
            />,
            onClick: (event, rowData) => navigate(`/admin/invoice-page?status=${rowData.status} &invoiceNumber=${rowData.invoice_number} &invoiceDate=${rowData.date} &dueDate=${rowData.due_date} &invoiceDesciption=${rowData.invoice_desciption} &invoiceTotal=${rowData.total} &issuedDate=${rowData.invoice_date}`),

            tooltip: 'Edit Invoice',
            // onClick: (event, rowData) => console.log('Edit', rowData)
          },
          {
            icon: () => <DeleteIcon 
            onClick={(event, rowData) => setOpenDeleteInvoice(true)}
            color="error" />,
            tooltip: 'Delete Invoice',
            onClick: (event, rowData) => setInvoiceId(rowData.id)
          },
          // {
          //   icon: () => <PaymentIcon color="action" />,
          //   tooltip: 'Record Payment',
          //   onClick: (event, rowData) => console.log('Payment', rowData)
          // }
        ]}
        
        options={{
          actionsColumnIndex: -1,
          pageSize: 10,
          pageSizeOptions: [5, 10, 20],
          headerStyle: {
            backgroundColor: '#f5f5f5',
            fontWeight: 'bold',
            fontSize: '14px'
          },
          rowStyle: rowData => ({
            backgroundColor: rowData.status === 'overdue' ? '#fff8f8' : 'inherit'
          })
        }}
        components={{
          Container: props => <Paper {...props} elevation={0} />
        }}
      />
    </Paper>
    
    </>
  );
};

export default Invoice;



