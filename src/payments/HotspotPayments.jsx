import { useState, useEffect, useCallback } from 'react';
import MaterialTable from 'material-table';
import { IconButton, Tooltip, Chip, Box, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
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
import { useDebounce } from 'use-debounce';
import toast, { Toaster } from 'react-hot-toast';
import EditPayment from '../edit/EditPayment';
import DeletePayment from './DeletePayment';
import PaymentDetails from './PaymentDetails';




const HotspotPayments = () => {
  const [search, setSearch] = useState('');
  const [searchInput] = useDebounce(search, 1000);
  const [isSearching, setIsSearching] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0
  });
  const [amountDisbursed, setAmountDisbursed] = useState(0)

  const subdomain = window.location.hostname.split('.')[0];

  // Fetch payments from backend
  const fetchPayments = useCallback(async () => {
    try {
      setIsSearching(true);
      const response = await fetch('/api/hotspot_mpesa_revenues', {
        headers: {
          'X-Subdomain': subdomain,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setIsSearching(false);
        
        // Filter based on search
        const filteredData = searchInput 
          ? data.filter(payment => 
              payment.voucher?.toLowerCase().includes(searchInput.toLowerCase()) ||
              payment.reference?.toLowerCase().includes(searchInput.toLowerCase()) ||
              payment.name?.toLowerCase().includes(searchInput.toLowerCase()) ||
              payment?.phone_number.includes(searchInput) ||
              payment.payment_method?.toLowerCase().includes(searchInput.toLowerCase())
            )
          : data;
        
        setPayments(filteredData);
        
        // Calculate statistics
        calculateStats(filteredData);
      } else {
        setIsSearching(false);
        toast.error(data.error || 'Failed to fetch payments', {
          position: 'top-center',
          duration: 4000,
        });
      }
    } catch (error) {
      setIsSearching(false);
      toast.error('Failed to fetch payments: Server error', {
        position: 'top-center',
        duration: 4000,
      });
    }
  }, [searchInput, subdomain]);

  // Calculate statistics
  const calculateStats = (paymentData) => {
    const totalRevenue = paymentData.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
    const totalPayments = paymentData.length;
    const successfulPayments = paymentData.filter(p => p.redeemed === true || p.status === 'successful').length;
    const pendingPayments = paymentData.filter(p => p.redeemed === false || p.status === 'pending').length;

    setStats({
      totalRevenue,
      totalPayments,
      successfulPayments,
      pendingPayments
    });
  };

  // Fetch payments on mount and when search changes
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  // Handle delete payment
  const handleDeletePayment = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/hotspot_mpesa_revenues/${id}`, {
        method: 'DELETE',
        headers: {
          'X-Subdomain': subdomain,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Payment deleted successfully', {
          position: 'top-center',
          duration: 4000,
        });
        // Remove deleted payment from state
        setPayments(prev => prev.filter(payment => payment.id !== id));
        setOpenDelete(false);
      } else {
        toast.error(data.error || 'Failed to delete payment', {
          position: 'top-center',
          duration: 4000,
        });
      }
    } catch (error) {
      toast.error('Failed to delete payment: Server error', {
        position: 'top-center',
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setOpenEdit(true);
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setOpenDetails(true);
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Columns configuration
  const columns = [
    {
      title: 'Voucher',
      field: 'voucher',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <Tooltip title="Voucher code" arrow>
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-blue-500" />
            <code className="font-mono text-sm bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded">
              {rowData.voucher || 'N/A'}
            </code>
          </div>
        </Tooltip>
      ),
    },
    {
      title: 'Payment Method',
      field: 'payment_method',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <div className="flex items-center gap-2">
          <Payment className="w-4 h-4 text-green-500" />
          <Chip
            label={rowData.payment_method || 'N/A'}
            size="small"
            variant="outlined"
            className={`border ${
              rowData.payment_method?.toLowerCase() === 'mpesa' 
                ? 'border-green-200 text-green-700 bg-green-50'
                : 'border-blue-200 text-blue-700 bg-blue-50'
            }`}
          />
        </div>
      ),
    },
    {
      title: 'Reference',
      field: 'reference',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <div className="font-mono text-sm text-gray-600 dark:text-gray-300">
          {rowData.reference || 'N/A'}
        </div>
      ),
    },
    {
      title: 'Amount',
      field: 'amount',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <div className="flex items-center gap-2">
          {/* <CreditCard className="w-4 h-4 text-purple-500" /> */}
          <span className="font-bold text-purple-600 dark:text-purple-400">
            {formatCurrency(rowData.amount)}
          </span>
        </div>
      ),
    },


{
  title: 'Disbursed',
  field: 'paid_out',
  headerClassName: 'dark:text-black font-semibold',
  render: (rowData) => (
    <div className="flex items-center gap-2">
      {rowData.paid_out ? (
        <>
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-green-700">Yes</span>
          {rowData.paid_out_at && (
            <Tooltip title={rowData.paid_out_at} arrow>
              <AccessTime className="w-3 h-3 text-gray-400 ml-1" />
            </Tooltip>
          )}
        </>
      ) : (
        <>
          <Cancel className="w-4 h-4 text-amber-500" />
          <span className="text-amber-600">No</span>
        </>
      )}
    </div>
  ),
},


    {
      title: 'Customer',
      field: 'name',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <div className="flex items-center gap-2">
          <Person className="w-4 h-4 text-gray-500" />
          <span>{rowData.name || 'Anonymous'}</span>
        </div>
      ),
    },
    {
      title: 'Time Paid',
      field: 'time_paid',
      headerClassName: 'dark:text-black font-semibold',
      render: (rowData) => (
        <Tooltip title={formatTime(rowData.time_paid)} arrow>
          <div className="flex items-center gap-2">
            <AccessTime className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {formatTime(rowData.time_paid)}
            </span>
          </div>
        </Tooltip>
      ),
    },
    // {
    //   title: 'Status',
    //   field: 'redeemed',
    //   headerClassName: 'dark:text-black font-semibold',
    //   render: (rowData) => {
    //     const isRedeemed = rowData.redeemed === true || rowData.status === 'successful';
    //     return (
    //       <Chip
    //         icon={isRedeemed ? <CheckCircle /> : <Cancel />}
    //         label={isRedeemed ? 'Redeemed' : 'Pending'}
    //         size="small"
    //         sx={{
    //           backgroundColor: isRedeemed ? '#d1fae5' : '#fee2e2',
    //           color: isRedeemed ? '#065f46' : '#991b1b',
    //           fontWeight: 'bold',
    //         }}
    //       />
    //     );
    //   },
    // },
    {
      title: 'Actions',
      field: 'actions',
      headerClassName: 'dark:text-black font-semibold',
      sorting: false,
      render: (rowData) => (
        <div className="flex items-center gap-1">
          <Tooltip title="View details">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(rowData);
              }}
              className="hover:bg-blue-50"
            >
              <SearchIcon fontSize="small" className="text-blue-600" />
            </IconButton>
          </Tooltip>
          
        
          
          <Tooltip title="Delete payment">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPayment(rowData);
                setOpenDelete(true);
              }}
              className="hover:bg-red-50"
            >
              <DeleteIcon fontSize="small" className="text-red-600" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  // Handle row click
  const handleRowClick = (event, rowData) => {
    handleViewDetails(rowData);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchPayments();
    toast.success('Payments refreshed', {
      position: 'top-center',
      duration: 2000,
    });
  };

  // Handle export
  const handleExport = () => {
    // Implement export functionality
    toast.success('Export started', {
      position: 'top-center',
      duration: 2000,
    });
  };

  return (
    <div className="p-4 space-y-6">
      <Toaster />
      
      {/* Edit Payment Modal */}
      {selectedPayment && (
        <EditPayment
          open={openEdit}
          setOpen={setOpenEdit}
          payment={selectedPayment}
          onSave={() => {
            fetchPayments();
            toast.success('Payment updated successfully', {
              position: 'top-center',
              duration: 4000,
            });
          }}
        />
      )}

      {/* Delete Payment Modal */}
      {selectedPayment && (
        <DeletePayment
          open={openDelete}
          setOpen={setOpenDelete}
          paymentId={selectedPayment.id}
          onDelete={handleDeletePayment}
          loading={loading}
        />
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <PaymentDetails
          open={openDetails}
          setOpen={setOpenDetails}
          payment={selectedPayment}
        />
      )}

      {/* Statistics Dashboard */}
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-700">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
         */}



        {/* <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Payments</p>
              <p className="text-2xl font-bold text-green-700">{stats.totalPayments}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <Receipt className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div> */}


{/*         
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Successful</p>
              <p className="text-2xl font-bold text-purple-700">
                {stats.successfulPayments}
              </p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div> */}


        
        {/* <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-amber-600 font-medium">Pending</p>
              <p className="text-2xl font-bold text-amber-700">
                {stats.pendingPayments}
              </p>
            </div>
            <div className="p-2 bg-amber-100 rounded-lg">
              <AccessTime className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div> */}

      {/* Search and Actions Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full bg-gray-50 border border-gray-300 
                text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 
                p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
                dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search by voucher, reference, name..."
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <CircularProgress size={16} className="text-blue-500" />
              </div>
            )}
          </div>
        </div>


        
        
        <div className="flex items-center gap-2">
          <Tooltip title="Refresh payments">
            <IconButton
              onClick={handleRefresh}
              className="bg-blue-50 hover:bg-blue-100 text-blue-600"
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Export payments">
            <IconButton
              onClick={handleExport}
              className="bg-green-50 hover:bg-green-100 text-green-600"
            >
              <FileDownloadIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Filter payments">
            <IconButton
              className="bg-purple-50 hover:bg-purple-100 text-purple-600"
            >
              <FilterList />
            </IconButton>
          </Tooltip>
        </div>
      </div>

      {/* Payments Table */}
      <div className=" rounded-xl
       shadow-sm border border-gray-200 dark:border-gray-700
        ">
        <div style={{ maxWidth: "100%", position: "relative" }}>
          {isSearching && (
            <div className="absolute inset-0 flex justify-center items-center  
              bg-white dark:bg-gray-800 bg-opacity-80 z-[2]">
              <div className="flex flex-col items-center gap-2">
                <CircularProgress className="text-blue-500" />
                <p className="text-gray-600 dark:text-gray-300">Loading payments...</p>
              </div>
            </div>
          )}
          
          <MaterialTable
            columns={columns}
            title={
              <div className="flex items-center gap-3 p-4">
                <div className="p-2  bg-yellow-500
                  rounded-lg">
                  <Receipt className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Hotspot Payments
                  </h2>
                 
                </div>
              </div>
            }
            onRowClick={handleRowClick}
            data={payments}
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
            ]}

            localization={{
              body: {
                emptyDataSourceMessage: (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Receipt className="w-16 h-16 text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-medium mb-2">
                      No payments found
                    </p>
                    <p className="text-gray-400 text-sm">
                      {search ? 'Try a different search term' : 'No payment records yet'}
                    </p>
                  </div>
                ),
              },
              header: {
                actions: 'Actions',
              },
              pagination: {
                labelRowsSelect: 'rows',
                labelDisplayedRows: '{from}-{to} of {count}',
                firstTooltip: 'First Page',
                previousTooltip: 'Previous Page',
                nextTooltip: 'Next Page',
                lastTooltip: 'Last Page',
              },
            }}

             options={{
                sorting: true,
                pageSizeOptions: [10, 25, 50, 100],
                pageSize: 10,
                paginationType: 'stepped',
                exportButton: {
                  csv: true,
                  pdf: false
                },
                exportAllData: true,
                selection: false,
                search: false,
                searchAutoFocus: true,
                showSelectAllCheckbox: false,
                showTextRowsSelected: false,
                emptyRowsWhenPaging: false,
                headerStyle: {
                  backgroundColor: '#f8fafc',
                  color: '#1e293b',
                  fontWeight: '600',
                  fontSize: '0.875rem',
                  textTransform: 'uppercase',
                  borderBottom: '2px solid #e2e8f0',
                  padding: '16px',
                },
                rowStyle: {
                  '&:hover': {
                    backgroundColor: '#f1f5f9',
                    cursor: 'pointer'
                  }
                },
                cellStyle: {
                  padding: '12px 16px',
                  borderRight: '1px solid #f1f5f9'
                },
                draggable: false,
                filterCellStyle: {
                  padding: '16px'
                }
              }}
              components={{
                Container: props => (
                  <div className="rounded-b-xl overflow-hidden">
                    {props.children}
                  </div>
                )
              }}
          />
        </div>
      </div>
    </div>
  );
};

export default HotspotPayments;