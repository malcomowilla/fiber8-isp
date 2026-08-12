// app/javascript/components/DailyRevenueDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ReactApexChart from 'react-apexcharts';
import { 
  TrendingUp, Calendar, DollarSign, RefreshCw,
  BarChart3, TrendingDown, Download, Upload
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Box, Button, Chip, Typography, useTheme  } from '@mui/material';
import { Add as AddIcon, GetApp as GetAppIcon } from '@mui/icons-material';
import { FaRegCheckCircle, FaRegTimesCircle, FaRegClock } from "react-icons/fa";
import { format } from 'date-fns';
import { LuDollarSign, LuClock, LuCalendar } from "react-icons/lu";
import {useApplicationSettings} from '../settings/ApplicationSettings'
import MaterialTable from "material-table";
import {motion } from 'framer-motion';



const PaymentAnalytics = () => {
  const [revenueData, setRevenueData] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    allTime: 0,
    last7Days: [],
    loading: true
  });
  const [paymentData, setPaymentData] = useState([]);


  const [loadingRefresh, setLoadingRefresh] = useState(false);
  const [loadingDailyRevenue, setLoadDaiyRevenue] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const subdomain = window.location.hostname.split('.')[0];

  // Chart states
  const [revenueChart, setRevenueChart] = useState({
    series: [{ name: 'Revenue', data: [] }],
    options: {
      chart: {
        height: 350,
        type: 'area',
        toolbar: { show: false }
      },
      colors: ['#3B82F6'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 3 },
      xaxis: { categories: [] },
      yaxis: {
        title: { text: 'Revenue (KES)' },
        labels: {
          formatter: function(val) {
            return 'KES ' + val.toLocaleString();
          }
        }
      },
      tooltip: {
        y: { formatter: function(val) { return 'KES ' + val.toLocaleString(); } }
      }
    }
  });



    const [state, setState] = React.useState({
          
            series: [44, 55, 13, 43, 22],
            options: {
              chart: {
                width: 380,
                type: 'pie',
              },
              labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
              responsive: [{
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200
                  },
                  legend: {
                    position: 'bottom'
                  }
                }
              }]
            },
          
          
        });

  const [dailyTrafficChart, setDailyTrafficChart] = useState({
    series: [{ name: 'Transactions', data: [] }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
        toolbar: { show: false }
      },
      colors: ['#10B981'],
      plotOptions: {
        bar: { borderRadius: 4, horizontal: false }
      },
      dataLabels: { enabled: false },
      xaxis: { categories: [] },
      yaxis: { title: { text: 'Count' } }
    }
  });




   const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };


  const getPaymentData = useCallback(
  async() => {
     try {
    const response = await fetch(`/api/hotspot_mpesa_revenues`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Subdomain': subdomain,
      }
    });
const data = await response.json();
    if (response.ok) {
      setPaymentData(data)
      
    } else {
      

        console.log('failed to fetch payment data')
    }
  } catch (error) {
    console.log('failed to fetch payment data')
    
  }
  },
  [subdomain],
)



useEffect(() => {
  getPaymentData();
}, [getPaymentData]);






  const fetchRevenueSummary = async () => {
    setLoadingRefresh(true);
    try {
      const response = await fetch('/api/revenue_summary', {
        headers: { 'Content-Type': 'application/json', 'X-Subdomain': subdomain }
      });
      const data = await response.json();
      
      if (data.success) {
        setLoadingRefresh(false);
        setRevenueData({
        //   today: data.summary.today,
        //   thisWeek: data.summary.this_week,
        //   thisMonth: data.summary.this_month,
        //   allTime: data.summary.all_time,
        //   last7Days: data.last_7_days,
          loading: false
        });
toast.success('Successfully refreshed revenue data', {
  position: "top-right",
  duration: 4000,


  
});
        // Update revenue chart
        const chartData = data.last_7_days.map(day => day.revenue);
        const categories = data.last_7_days.map(day => 
          new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
        );
        
        setRevenueChart(prev => ({
          ...prev,
          series: [{ name: 'Revenue', data: chartData }],
          options: { ...prev.options, xaxis: { categories } }
        }));
      }else{
        setLoadingRefresh(false);
        toast.error('Failed to fetch revenue data', {
          position: "top-right",
          duration: 4000,


        });
      }
    } catch (error) {
      toast.error('Failed to fetch revenue data');
      setLoadingRefresh(false);
    }
  };

  const fetchDailyRevenue = async (date) => {
    try {
      setLoadDaiyRevenue(true);
      const response = await fetch(`/api/daily_revenue?date=${date}`, {
        headers: { 'X-Subdomain': subdomain }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLoadDaiyRevenue(false);
        // Update daily traffic chart
        if (data.transactions) {
          const hourlyData = Array(24).fill(0);
          data.transactions.forEach(tx => {
            const hour = new Date(tx.created_at).getHours();
            hourlyData[hour]++;
          });
          
          setDailyTrafficChart({
            series: [{ name: 'Transactions', data: hourlyData }],
            options: {
              ...dailyTrafficChart.options,
              xaxis: { 
                categories: Array.from({length: 24}, (_, i) => `${i}:00`)
              }
            }
          });
        }

        toast.success(`Revenue for ${selectedDate}: ${formatCurrency(data.total_revenue)}`);
        return data;
      }else{
        setLoadDaiyRevenue(false);
        toast.error('Failed to fetch revenue data', {
          position: "top-right",
          duration: 4000,


        });
      }
    } catch (error) {
      toast.error('Failed to fetch revenue data server error');
    }
  };

  // Add bandwidth chart
  const [bandwidthChart, setBandwidthChart] = useState({
    series: [
      { name: 'Download', data: [] },
      { name: 'Upload', data: [] }
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        toolbar: { show: false }
      },
      colors: ['#008FFB', '#00E396'],
      stroke: { curve: 'smooth', width: 3 },
      xaxis: { 
        type: 'datetime',
        labels: { datetimeUTC: false }
      },
      yaxis: { title: { text: 'Mbps' } },
      legend: { position: 'top' }
    }
  });

  const fetchBandwidthData = async () => {
    try {
      const response = await fetch('/api/bandwidth_stats', {
        headers: { 'X-Subdomain': subdomain }
      });
      const data = await response.json();
      
      if (data.success) {
        setBandwidthChart(prev => ({
          ...prev,
          series: [
            { name: 'Download', data: data.hourly_download },
            { name: 'Upload', data: data.hourly_upload }
          ]
        }));
      }
    } catch (error) {
      console.error('Failed to fetch bandwidth data');
    }
  };

  useEffect(() => {
    fetchRevenueSummary();
    fetchBandwidthData();
    
    const interval = setInterval(() => {
      fetchRevenueSummary();
      fetchBandwidthData();
    }, 300000);
    
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatCurrency(value)}
          </p>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (revenueData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
        <span className="ml-3 text-gray-600">Loading revenue data...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <Toaster />
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Dashboard</h1>
          <p className="text-gray-600">Real-time MPESA revenue tracking</p>
        </div>
        <button 
          onClick={() => {
            fetchRevenueSummary();
            fetchBandwidthData();
          }}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw size={18} className={`mr-2 ${loadingRefresh ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Revenue" 
          value={revenueData.today} 
          // icon={<DollarSign size={24} className="text-green-600" />}
          icon='KSh'
          color="bg-green-100"
        />
        
        <StatCard 
          title="This Week" 
          value={revenueData.thisWeek} 
          icon={<Calendar size={24} className="text-blue-600" />}
          color="bg-blue-100"
        />
        
        <StatCard 
          title="This Month" 
          value={revenueData.thisMonth} 
          icon={<BarChart3 size={24} className="text-purple-600" />}
          color="bg-purple-100"
        />
        
        <StatCard 
          title="Last Month" 
          value={revenueData.allTime} 
          icon={<TrendingUp size={24} className="text-orange-600" />}
          color="bg-orange-100"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Last 7 Days Revenue</h2>
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-gray-500" />
              <span className="text-gray-600">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
          <ReactApexChart 
            options={revenueChart.options} 
            series={revenueChart.series} 
            type="area" 
            height={350} 
          />
        </div>

        {/* Bandwidth Chart */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Network Bandwidth</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Download size={18} className="text-blue-500 mr-2" />
                <span className="text-sm text-gray-600">Download</span>
              </div>
              <div className="flex items-center">
                <Upload size={18} className="text-green-500 mr-2" />
                <span className="text-sm text-gray-600">Upload</span>
              </div>
            </div>
          </div>
          <ReactApexChart 
            options={bandwidthChart.options} 
            series={bandwidthChart.series} 
            type="line" 
            height={350} 
          />
        </div> */}

     <motion.div 
        variants={cardVariants}
        className="p-6 bg-white rounded-xl shadow-md"
      >
        <Typography variant="h6" className="font-semibold 
        mb-4 dark:text-black">Recent Payments</Typography>
        <MaterialTable
          columns={[
            { 
              title: "User", 
              field: "user",
              render: (rowData) => (
                <Typography variant="body2" fontWeight={500}>
                  <p className=''>{rowData.voucher} </p>
                </Typography>
              )
            },



             { 
              title: "Name", 
              field: "name",
              render: (rowData) => (
                <Typography variant="body2" fontWeight={500}>
                  <p className=''>{rowData.voucher} </p>
                </Typography>
              )
            },

            { 
              title: "Method", 
              field: "method",
              render: (rowData) => (
                <Chip 
                  label={rowData.payment_method} 
                  size="small"
                  color={
                    rowData.payment_method === 'MPesa' ? 'primary' : 
                    rowData.method === 'Cash' ? 'secondary' : 'default'
                  }
                />
              )
            },
            { 
              title: "Amount", 
              field: "amount",
              render: (rowData) => (
                <Typography variant="body2" fontWeight={500}>
                  KSh {rowData.amount}
                </Typography>
              )
            },


             { 
              title: "Reference",
              field: "reference",
              render: (rowData) => (
                <Typography variant="body2" fontWeight={500}>
                  <p className=''>{rowData.reference} </p>
                </Typography>
              )
            },

            { 
              title: "Date", 
              field: "time_paid",
              // render: (rowData) => format(new Date(rowData.date), 'PPpp'),
              defaultSort: 'desc'
            },
          ]}
          data={paymentData}
          title='Subscriber Payments'
         
localization={{
                body: {
                  emptyDataSourceMessage: 'No Recent Payments'
                },
               
              
              
              }}


options={{
  sorting: true,
  pageSizeOptions:[2, 5, 10],
  pageSize: 5,
  paginationPosition: 'bottom',
exportButton: true,
exportAllData: true,
selection: true,
search:false,
searchAutoFocus: true,
showSelectAllCheckbox: false,
showTextRowsSelected: false,
  emptyRowsWhenPaging: false,
headerStyle:{
  fontFamily: 'bold',
  textTransform: 'uppercase'
  } ,
  
  
  fontFamily: 'mono'
}}
        />
      </motion.div>


        {/* Top 5 Payers Pie Chart */}
    
<div className="shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top 5 Payers</h2>

                <ReactApexChart options={state.options} series={state.series} type="pie" width={380} />
</div>



<div className="shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Most Bought Wifi Packages</h2>

                <ReactApexChart options={state.options} series={state.series} type="pie" width={380} />
</div>
        
      </div>
    </div>
  );
};

export default PaymentAnalytics;