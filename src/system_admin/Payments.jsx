import React, { useState, useEffect, useCallback, useMemo } from 'react';
import MaterialTable from 'material-table';
import { Chip, Paper, Typography } from '@mui/material';
import { SearchOutlined as SearchIcon } from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const statusColors = {
  completed: 'success',
  partial: 'warning',
  overpaid: 'info',
};

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
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

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

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

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/invoice_payments');
      const data = await response.json();
      if (response.ok) {
        setPayments(data);
      } else {
        toast.error('Failed to fetch payments', { position: 'top-center' });
      }
    } catch (error) {
      toast.error('Something went wrong loading payments', { position: 'top-center' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPayments(payments);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFilteredPayments(
      payments.filter(
        (p) =>
          p.company_name?.toLowerCase().includes(lower) ||
          p.reference?.toLowerCase().includes(lower) ||
          p.invoice_number?.toLowerCase().includes(lower) ||
          p.payer_name?.toLowerCase().includes(lower)
      )
    );
  }, [searchTerm, payments]);

  const totalReceived = payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);

  return (
    <>
      <Toaster />
      <ThemeProvider theme={tableTheme}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Total received</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              KES {totalReceived.toLocaleString()}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Payments recorded</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{payments.length}</p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500">Partial payments</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">
              {payments.filter((p) => p.status === 'partial').length}
            </p>
          </div>
        </div>

        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                focus:ring-green-500 focus:border-green-500 p-2.5 dark:bg-gray-700 dark:border-gray-600
                dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
              placeholder="Search by company, receipt no., or invoice..."
            />
          </div>

          <MaterialTable
            title={<p className="text-2xl font-bold">Payments</p>}
            isLoading={loading}
            columns={[
              {
                title: 'Company',
                field: 'company_name',
                render: (row) => <Typography sx={{ fontWeight: 600 }}>{row.company_name || '—'}</Typography>,
              },
              { title: 'Invoice #', field: 'invoice_number' },
              {
                title: 'Receipt No.',
                field: 'reference',
                render: (row) => <span style={{ fontFamily: 'monospace' }}>{row.reference}</span>,
              },
              {
                title: 'Amount',
                field: 'amount',
                render: (row) => (
                  <Typography sx={{ fontWeight: 600 }}>
                    KES {parseFloat(row.amount || 0).toLocaleString()}
                  </Typography>
                ),
              },
              { title: 'Payer', field: 'payer_name' },
              { title: 'Phone', field: 'phone_number' },
              {
                title: 'Status',
                field: 'status',
                render: (row) => (
                  <Chip
                    label={row.status?.charAt(0).toUpperCase() + row.status?.slice(1)}
                    color={statusColors[row.status] || 'default'}
                    variant="outlined"
                    size="small"
                  />
                ),
              },
              {
                title: 'Paid At',
                field: 'paid_at',
                render: (row) => (row.paid_at ? new Date(row.paid_at).toLocaleString() : '—'),
              },
            ]}
            data={filteredPayments}
            localization={{
              body: {
                emptyDataSourceMessage: searchTerm ? 'No matching payments found' : 'No payments recorded yet',
              },
            }}
            options={{
              sorting: true,
              pageSizeOptions: [10, 20, 50],
              pageSize: 20,
              exportButton: true,
              exportAllData: true,
              search: false,
              actionsColumnIndex: -1,
              headerStyle: {
                fontWeight: 700,
                fontSize: '12px',
                textTransform: 'uppercase',
                backgroundColor: isDark ? '#2a2a2a' : '#f4f1ea',
                color: isDark ? '#f1f1f1' : '#1a1a1a',
              },
              rowStyle: (rowData, index) => ({
                backgroundColor: isDark ? (index % 2 === 0 ? '#1e1e1e' : '#262626') : index % 2 === 0 ? '#ffffff' : '#fafaf7',
                color: isDark ? '#f1f1f1' : '#1a1a1a',
              }),
            }}
            components={{ Container: (props) => <Paper {...props} elevation={0} /> }}
          />
        </Paper>
      </ThemeProvider>
    </>
  );
};

export default Payments;