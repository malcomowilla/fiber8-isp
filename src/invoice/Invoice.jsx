import React, { useState, useCallback, useEffect, useMemo } from 'react';
import MaterialTable from 'material-table';
import {
  Chip,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import toast, { Toaster } from 'react-hot-toast';
import DeleteInvoice from '../delete/DeleteInvoice';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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
    overdue: 'error',
  };

  const navigate = useNavigate();
  const subdomain = window.location.hostname.split('.')[0];
  const { setCompanySettings } = useApplicationSettings();

  // Filter invoices based on search term (invoice_number or status)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredInvoices(invoices);
      return;
    }
    const lowerSearch = searchTerm.toLowerCase();
    const filtered = invoices.filter(
      (inv) =>
        inv.invoice_number?.toLowerCase().includes(lowerSearch) ||
        inv.status?.toLowerCase().includes(lowerSearch)
    );
    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCloseDelete = () => {
    setOpenDeleteInvoice(false);
  };

  function useIsDarkMode() {
    const [isDark, setIsDark] = useState(
      () =>
        typeof document !== 'undefined' &&
        document.documentElement.classList.contains('dark')
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

  const isDark = useIsDarkMode();

  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? 'dark' : 'light',
          background: {
            paper: isDark ? '#1e1e1e' : '#ffffff',
            default: isDark ? '#1e1e1e' : '#ffffff',
          },
          text: {
            primary: isDark ? '#f1f1f1' : '#1a1a1a',
            secondary: isDark ? '#a3a3a3' : '#6b7280',
          },
        },
      }),
    [isDark]
  );

  const deleteInvoice = async (id) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
        headers: { 'X-Subdomain': subdomain },
      });
      if (response.ok || response.status === 204) {
        setInvoices(invoices.filter((invoice) => invoice.id !== id));
        toast.success('Invoice deleted successfully', {
          position: 'top-center',
          duration: 4000,
        });
      } else {
        const newData = await response.json();
        toast.error(newData.error || 'Failed to delete invoice', {
          position: 'top-center',
        });
      }
    } catch (error) {
      toast.error('Failed to delete invoice something went wrong', {
        position: 'top-center',
        duration: 4000,
      });
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
        const {
          contact_info,
          company_name,
          email_info,
          logo_url,
          customer_support_phone_number,
          agent_email,
          customer_support_email,
        } = newData;
        setCompanySettings((prev) => ({
          ...prev,
          contact_info,
          company_name,
          email_info,
          customer_support_phone_number,
          agent_email,
          customer_support_email,
          logo_preview: logo_url,
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
        setIsSearching(false);
      } else {
        if (response.status === 403) {
          toast.error('permission denied to get invoices', { duration: 6000 });
          setIsSearching(false);
        }
        if (response.status === 401) {
          setIsSearching(false);
          toast.error(newData.error, { position: 'top-center', duration: 4000 });
          setTimeout(() => {
            window.location.href = '/signin';
          }, 1900);
        }
      }
    } catch (error) {
      setIsSearching(false);
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
              <ThemeProvider theme={tableTheme}>

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
                 dark:focus:border-green-500 font-sans"
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
            title={<p className="text-2xl font-bold font-sans">Billing & Subscription</p>}
            columns={[
              {
                title: 'Invoice #',
                field: 'invoice_number',
                headerStyle: { fontWeight: 'bold' },
                render: (rowData) => (
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {rowData.invoice_number}
                  </Typography>
                ),
              },
              {
                title: 'Invoice Date',
                field: 'invoice_date',
                type: 'date',
                headerStyle: { fontWeight: 'bold' },
                render: (rowData) => rowData.invoice_date,
              },
              {
                title: 'Due Date',
                field: 'due_date',
                type: 'date',
                headerStyle: { fontWeight: 'bold' },
                render: (rowData) => (
                  <Typography
                    sx={{
                      fontWeight: 500,
                      color:
                        rowData.due_date < new Date() && rowData.status !== 'paid'
                          ? 'error.main'
                          : 'inherit',
                    }}
                  >
                    {rowData.due_date}
                  </Typography>
                ),
              },
              {
                title: 'Total',
                field: 'total',
                headerStyle: { fontWeight: 'bold' },
                render: (rowData) => (
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    ksh {rowData.total}
                  </Typography>
                ),
              },
              {
                title: 'Status',
                field: 'status',
                headerStyle: { fontWeight: 'bold' },
                render: (rowData) => (
                  <Chip
                    label={rowData.status.charAt(0).toUpperCase() + rowData.status.slice(1)}
                    color={statusColors[rowData.status] || 'default'}
                    variant="outlined"
                    sx={{ fontWeight: 500, borderWidth: 1.5, textTransform: 'capitalize' }}
                  />
                ),
              },
            ]}
            data={filteredInvoices}
            actions={rowActions}
            localization={{
              body: {
                emptyDataSourceMessage: searchTerm ? (
                  <p className="font-sans">No matching invoices found</p>
                ) : (
                  <p className="font-sans">No invoices found</p>
                ),
              },
            }}
            options={{
              sorting: true,
              pageSizeOptions: [2, 5, 10, 20],
              pageSize: 20,
              paginationPosition: 'bottom',
              exportButton: true,
              exportAllData: true,
              selection: true,
              search: false,
              searchAutoFocus: true,
              showSelectAllCheckbox: false,
              showTextRowsSelected: false,
              emptyRowsWhenPaging: false,
              actionsColumnIndex: -1,
              headerStyle: {
                fontFamily: 'monospace',
                textTransform: 'uppercase',
                fontWeight: 700,
                fontSize: '12px',
                backgroundColor: isDark ? '#2a2a2a' : '#f4f1ea',
                color: isDark ? '#f1f1f1' : '#1a1a1a',
                borderBottom: isDark ? '2px solid #3a3a3a' : '2px solid #e5e0d5',
              },
              rowStyle: (rowData, index) => ({
                backgroundColor: isDark
                  ? index % 2 === 0
                    ? '#1e1e1e'
                    : '#262626'
                  : index % 2 === 0
                  ? '#ffffff'
                  : '#fafaf7',
                color: isDark ? '#f1f1f1' : '#1a1a1a',
                fontFamily: 'monospace',
              }),
            }}
            components={{
              Container: (props) => <Paper {...props} elevation={0} />,
              // Fully own the rendering of each row action button instead of
              // letting material-table clone the icon element itself — that
              // clone path is what was making Edit/Delete invisible.
              Action: (props) => {
                const { action, data } = props;

                // Toolbar/global actions (not used here, but keep this from
                // silently swallowing anything unexpected) fall back to null.
                if (!action || typeof action !== 'object') return null;

                if (action.name === 'edit') {
                  return (
                    <Tooltip title={action.tooltip}>
                      <IconButton
                        size="small"
                        onClick={(event) => action.onClick(event, data)}
                      >
                        <EditIcon color="success" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                if (action.name === 'delete') {
                  return (
                    <Tooltip title={action.tooltip}>
                      <IconButton
                        size="small"
                        onClick={(event) => action.onClick(event, data)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  );
                }

                return null;
              },
            }}
          />
      </Paper>
              </ThemeProvider>


      {/*
        Pins the actions column (last column, since actionsColumnIndex: -1)
        to the right edge so it stays visible while the rest of the table
        scrolls horizontally underneath it. MaterialTable doesn't expose a
        prop for this, so it's done via a global style targeting the last
        <th>/<td> in each row.
      */}
      <style>{`
        .MuiTableRow-root > *:last-child {
          position: sticky;
          right: 0;
          z-index: 2;
          background-color: inherit;
        }
        .MuiTableHead-root .MuiTableRow-root > *:last-child {
          z-index: 3;
        }
      `}</style>
    </>
  );
};

export default Invoice;