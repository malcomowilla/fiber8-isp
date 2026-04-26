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
import {Link, useNavigate, useSearchParams} from 'react-router-dom'
import {useApplicationSettings} from '../settings/ApplicationSettings'
import toast, { Toaster } from 'react-hot-toast';
import { FaLongArrowAltLeft } from "react-icons/fa";
import DeleteInvoice from '../delete/DeleteInvoice'



import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Receipt,
  Payment,
  Phone,
  Person,
  AccessTime,
  CheckCircle,
  Cancel,
  TrendingUp,
  CreditCard,
  CalendarToday,
  FilterList
} from '@mui/icons-material';




const SubscriberTransactions = () => {
 
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
const [transactions, setTransactions] = useState([])


  const navigate = useNavigate()
  const subdomain = window.location.hostname.split('.')[0];
    const {companySettings, setCompanySettings,} = useApplicationSettings()


 

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
setInvoiceId(rowData.id)
setInvoiceTotal(rowData.total)


}





const deleteInvoice = async(id)=> {

  try {
    // setLoading(true)
    const response = await fetch(`/api/subscriber_invoices/${id}`, {
      method: 'DELETE',
      headers: {
        'X-Subdomain': subdomain,
      },
    })
// const newData = response.status !== 204 ? await response.json() : {};

// console.log("Response status:", response.status);
    if (response.ok || response.status === 204) {
      // setLoading(false)
      setInvoices(invoices.filter((invoice) => invoice.id !== id))
      toast.success(
        'Transaction deleted successfully',
        {
          position: 'top-center',
          duration: 4000,
        }
      )
    } else {

      // setLoading(false)
      // toast.error(
      //   newData.error,
      //   {
      //     position: 'top-center',
      //   }
      // )
      toast.error(
        'Failed to delete transaction',
        {
          position: 'top-center',
        }
      )
    }
  } catch (error) {
    // setLoading(false)
    toast.error(
      'Failed to delete transaction, something went wrong',
      
      {
        position: 'top-center',
        duration: 4000
      }
    )
  }
}








  const [searchParams] = useSearchParams();


  const getTransactions = useCallback(
    async() => {
      
      try {
        const response = await fetch(`/api/subscriber_transactions`, {
          headers: { 'X-Subdomain': subdomain },
        });
        const newData = await response.json();



        if (response.ok) {
          // const { invoices } = newData;
          setTransactions(newData);
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
    getTransactions();
   
  }, [getTransactions]);




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
        {/* <Typography variant="h5" component="h2" color="success">
          My Invoice
        </Typography> */}
      </Box>

      <MaterialTable
      onRowClick={handleRowClick}
      title={<p className='
          text-2xl 
         font-bold'> CLIENT BILLING
</p>}

         
        columns={[
{
            title: <p className=' text-black dark:text-white'>Type</p>,
            field: 'type',
            headerStyle: { fontWeight: 'bold' },
            render: rowData => (
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                <p className='dark:text-white'>{rowData.type}</p>
              </Typography>
            )
          },




          {
            title: <p className=' text-black dark:text-white'>Credit</p>,
            field: 'credit',
            headerStyle: { fontWeight: 'bold' },
            render: rowData => (
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                <p className='dark:text-white'>{rowData.credit}</p>
              </Typography>
            )
          },
          
          {
            title: <p className='text-black dark:text-white'>Debit</p>,
            field: 'debit',
            // type: 'date',
            headerStyle: { fontWeight: 'bold' },
            render: rowData =>  <p className='dark:text-white'>{rowData.debit} </p>
          },


           {
            title: <p className='text-black dark:text-white'>Date</p>,
            field: 'date',
            // type: 'description',
            headerStyle: { fontWeight: 'bold' },
            render: rowData =>  <p
             className='dark:text-white'>{rowData.date} </p>
          },
          
          {
            title: <p className='text-black dark:text-white'>Title</p>,
            field: 'title',
            // type: 'date',
            headerStyle: { fontWeight: 'bold' },
            render: rowData => (
              <Typography 
                sx={{ 
                  fontWeight: 500,
                 
                }}
              >
                {rowData.title}
              </Typography>
            )
          },
          {
            title: <p className='text-black dark:text-white'>Description</p>,
            field: 'description',
            headerStyle: { fontWeight: 'bold' },
            render: rowData => (
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
               <p className='dark:text-white'> {rowData.description} </p>
              </Typography>
            )
          },
          
        ]}
        data={transactions}

        
        actions={[
          

             {
                icon: () => (
                  <button
                    className="flex items-center gap-2
                     bg-yellow-500
                      text-white px-4 py-2 rounded-lg hover:from-blue-600
                       hover:to-cyan-600
                      transition-all duration-200 shadow-sm hover:shadow-md"
                    onClick={() => {
                      // Handle add new payment
                      toast.success('Add payment feature coming soon', {
                        position: 'top-center',
                        duration: 3000,
                      });
                    }}
                  >
                    <AddIcon />
                    <span className="text-sm font-medium">Add Payment</span>
                  </button>
                ),
                isFreeAction: true,
                tooltip: 'Add New Payment',
              },

          {
            icon: () => <EditIcon
            
            color="success"
            // onClick={(rowData) => navigate(`/admin/invoice-page`)}
            />,
            onClick: (event, rowData) => navigate(`/admin/subscriber-invoice-page?status=${rowData.status} &invoice_id=${rowData.id} &item=${rowData.item} &total=${rowData.amount} &description=${rowData.description} &invoiceNumber=${rowData.invoice_number} &invoiceDate=${rowData.date} &dueDate=${rowData.due_date} &invoiceDesciption=${rowData.invoice_desciption} &invoiceTotal=${rowData.total} &issuedDate=${rowData.invoice_date}`),

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
        
      
localization={{
                body: {
                  emptyDataSourceMessage: 'No invoices found'
                },
               
              
              
              }}


options={{
  sorting: true,
  actionsColumnIndex: -1,
  pageSizeOptions:[2, 5, 10],
  pageSize: 10,

  
exportButton: true,
exportAllData: true,


  emptyRowsWhenPaging: false,


headerStyle:{
  fontFamily: 'bold',
  textTransform: 'uppercase'
  } ,
  
  
  fontFamily: 'mono'
}}
        components={{
          Container: props => <Paper {...props} elevation={0} />
        }}
      />
    </Paper>
    
    </>
  );
};

export default SubscriberTransactions;



