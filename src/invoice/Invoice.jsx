import React, { useState, useCallback, useEffect } from 'react';
import MaterialTable from 'material-table';
import { 
  IconButton, 
  Chip,
  Paper,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import toast, { Toaster } from 'react-hot-toast';
import DeleteInvoice from '../delete/DeleteInvoice';
import {  CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteInvoice, setOpenDeleteInvoice] = useState(false);
  const [invoiceId, setInvoiceId] = useState('');
    const [isSearching, setIsSearching] = useState(false);


  const statusColors = {
    paid: 'success',
    pending: 'warning',
    overdue: 'error'
  };

  const navigate = useNavigate();
  const subdomain = window.location.hostname.split('.')[0];
  const { companySettings, setCompanySettings } = useApplicationSettings();

  // Filter invoices based on search term (invoice_number or status)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInvoices(invoices);
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = invoices.filter(inv => 
      inv.invoice_number?.toLowerCase().includes(lowerSearch) ||
      inv.status?.toLowerCase().includes(lowerSearch)
    );
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleCloseDelete = () => {
    setOpenDeleteInvoice(false);
  };

  const deleteInvoice = async (id) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
        headers: { 'X-Subdomain': subdomain },
      });
      if (response.ok || response.status === 204) {
        setInvoices(invoices.filter((invoice) => invoice.id !== id));
        toast.success('Invoice deleted successfully', { position: 'top-center', duration: 4000 });
      } else {
        const newData = await response.json();
        toast.error(newData.error || 'Failed to delete invoice', { position: 'top-center' });
      }
    } catch (error) {
      toast.error('Failed to delete invoice something went wrong', { position: 'top-center', duration: 4000 });
    }
  };

  const handleGetCompanySettings = useCallback(async () => {
    try {
      const response = await fetch('/api/allow_get_company_settings', {
        method: 'GET',
        headers: { 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) {
        const { contact_info, company_name, email_info, logo_url,
          customer_support_phone_number, agent_email, customer_support_email } = newData;
        setCompanySettings((prev) => ({
          ...prev,
          contact_info, company_name, email_info,
          customer_support_phone_number, agent_email, customer_support_email,
          logo_preview: logo_url
        }));
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    handleGetCompanySettings();
  }, [handleGetCompanySettings]);

  const getInvoices = useCallback(async () => {
    try {
      setIsSearching(true);
      const response = await fetch('/api/invoices', {
        headers: { 'X-Subdomain': subdomain },
      });
      const newData = await response.json();
      if (response.ok) {
        setInvoices(newData);
        setIsSearching(false)
      } else {
        if (response.status === 403) {
          toast.error('permission denied to get invoices', { duration: 6000 });
           setIsSearching(false)
        }
        if (response.status === 401) {
           setIsSearching(false)
          toast.error(newData.error, { position: "top-center", duration: 4000 });
          setTimeout(() => { window.location.href = '/signin'; }, 1900);
        }
      }
    } catch (error) {
       setIsSearching(false)
    }

  }, []);

  useEffect(() => {
    getInvoices();
  }, [getInvoices]);

  return (
    <>
      <Toaster />
      <DeleteInvoice 
        handleCloseDelete={handleCloseDelete} 
        openDeleteInvoice={openDeleteInvoice} 
        deleteInvoice={deleteInvoice} 
        id={invoiceId} 
      />
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* Custom Search Bar */}

        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 w-full bg-gray-50 border border-gray-300 
                text-gray-900 text-sm rounded-lg focus:ring-green-500
                 focus:border-green-500 
                p-2.5 dark:bg-gray-700 dark:border-gray-600
                 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-green-500
                 dark:focus:border-green-500"
              placeholder="Search by invoice number or status..."
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <CircularProgress size={16} className="text-green-500" />
              </div>
            )}
          </div>
        </div>




       

        <MaterialTable
          title={
            <p className='bg-gradient-to-r from-green-600 via-blue-400 to-cyan-500 bg-clip-text text-transparent text-2xl font-bold'>
              Subscription Invoice
            </p>
          }
          columns={[
            { title: 'Invoice #', field: 'invoice_number', headerStyle: { fontWeight: 'bold' },
              render: rowData => <Typography variant="body1" sx={{ fontWeight: 500 }}>{rowData.invoice_number}</Typography> },
            { title: 'Invoice Date', field: 'invoice_date', type: 'date', headerStyle: { fontWeight: 'bold' },
              render: rowData => rowData.invoice_date },
            { title: 'Due Date', field: 'due_date', type: 'date', headerStyle: { fontWeight: 'bold' },
              render: rowData => (
                <Typography sx={{ 
                  fontWeight: 500,
                  color: rowData.due_date < new Date() && rowData.status !== 'paid' ? 'error.main' : 'inherit'
                }}>
                  {rowData.due_date}
                </Typography>
              ) },
            { title: 'Total', field: 'total', headerStyle: { fontWeight: 'bold' },
              render: rowData => <Typography variant="body1" sx={{ fontWeight: 500 }}>ksh {rowData.total}</Typography> },
            { title: 'Status', field: 'status', headerStyle: { fontWeight: 'bold' },
              render: (rowData) => (
                <Chip
                  label={rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)}
                  color={statusColors[rowData.status] || 'default'}
                  variant="outlined"
                  sx={{ fontWeight: 500, borderWidth: 1.5, textTransform: 'capitalize' }}
                />
              ) },
          ]}
          data={filteredInvoices}   // Use filtered data
          actions={[
            { icon: () => <EditIcon color="success" />, 
              onClick: (event, rowData) => navigate(`/admin/invoice-page?status=${rowData.status}&id=${rowData.id}&invoiceNumber=${rowData.invoice_number}&invoiceDate=${rowData.date}&dueDate=${rowData.due_date}&invoiceDesciption=${rowData.invoice_desciption}&invoiceTotal=${rowData.total}&issuedDate=${rowData.invoice_date}`),
              tooltip: 'Edit Invoice' },
            { icon: () => <DeleteIcon color="error" />, 
              tooltip: 'Delete Invoice', 
              onClick: (event, rowData) => { setInvoiceId(rowData.id); setOpenDeleteInvoice(true); } },
          ]}
          localization={{ body: { emptyDataSourceMessage: searchTerm ? 'No matching invoices found' : 'No invoices found' } }}
          options={{
            sorting: true,
            actionsColumnIndex: -1,
            pageSizeOptions: [5, 10, 25],
            pageSize: 10,
            exportButton: true,
            exportAllData: true,
            emptyRowsWhenPaging: false,
            headerStyle: { fontFamily: 'bold', textTransform: 'uppercase' },
            fontFamily: 'mono',
            search: false,           // Disable built-in search
          }}
          components={{ Container: props => <Paper {...props} elevation={0} /> }}
        />
      </Paper>
    </>
  );
};

export default Invoice;