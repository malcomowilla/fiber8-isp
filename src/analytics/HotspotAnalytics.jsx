

import { LuUsers } from "react-icons/lu";
import { LineChart, Line,BarChart, Bar , XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
    ResponsiveContainer,
    } from 'recharts';

import {motion } from 'framer-motion'

import {useApplicationSettings} from '../settings/ApplicationSettings'

import MaterialTable from "material-table";
import { Box, Button, Chip, Typography, useTheme  } from '@mui/material';
import { Add as AddIcon, GetApp as GetAppIcon } from '@mui/icons-material';

import { FaRegCheckCircle, FaRegTimesCircle, FaRegClock } from "react-icons/fa";

import { format } from 'date-fns';
import { LuDollarSign, LuClock, LuCalendar } from "react-icons/lu";


const HotspotAnalytics = () => {

    
  const options={
    options: {
        scales: {
          y: {
            beginAtZero: true
            
          }
        },


        plugins: {
            title: {
                display: false,
                text: 'Custom Chart Title'
            },
            
        },
        responsive: true,
               
        
      },
  }
  const theme = useTheme();

  const {showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,} = useApplicationSettings();

  const userActivity = [
    { date: '2022-01-01', activeUsers: 100, totalUsers: 1000 },
    { date: '2022-01-02', activeUsers: 200, totalUsers: 2000 },
    { date: '2022-01-03', activeUsers: 300, totalUsers: 3000 },
    { date: '2022-01-04', activeUsers: 400, totalUsers: 4000 },
    { date: '2022-01-05', activeUsers: 500, totalUsers: 5000 },
    { date: '2022-01-06', activeUsers: 600, totalUsers: 6000 },
    { date: '2022-01-07', activeUsers: 700, totalUsers: 7000 },
    { date: '2022-01-08', activeUsers: 800, totalUsers: 8000 },
    { date: '2022-01-09', activeUsers: 900, totalUsers: 9000 },
    { date: '2022-01-10', activeUsers: 1000, totalUsers: 10000 },
    { date: '2022-01-11', activeUsers: 1100, totalUsers: 11000 },
  ];




  const revenueData = [
    { date: '2023-01', revenue: 4500, users: 120 },
    { date: '2023-02', revenue: 5200, users: 150 },
    { date: '2023-03', revenue: 4800, users: 135 },
    { date: '2023-04', revenue: 6100, users: 180 },
    { date: '2023-05', revenue: 5700, users: 160 },
    { date: '2023-06', revenue: 6900, users: 210 },
  ];

  const dailyData = [
    { hour: '00:00', revenue: 120 },
    { hour: '04:00', revenue: 80 },
    { hour: '08:00', revenue: 200 },
    { hour: '12:00', revenue: 350 },
    { hour: '16:00', revenue: 280 },
    { hour: '20:00', revenue: 180 },
  ];

  const paymentData = [
    { id: 1, voucher: 'VIP24H', method: 'M-Pesa', amount: 500, date: '2023-06-15T10:30:00' },
    { id: 2, voucher: 'STD8H', method: 'Cash', amount: 200, date: '2023-06-15T11:45:00' },
    { id: 3, voucher: 'VIP24H', method: 'M-Pesa', amount: 500, date: '2023-06-14T09:15:00' },
    { id: 4, voucher: 'STD1H', method: 'Card', amount: 100, date: '2023-06-14T14:20:00' },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const StatCard = ({ title, value, icon, trend, color }) => (
    <motion.div 
      variants={cardVariants}
      className={`p-6 rounded-xl shadow-md bg-white`}
    >
      <div className="flex justify-between items-start">
        <div>
          <Typography variant="subtitle2" color="textSecondary">
            <p className='dark:text-black text-black'>{title} </p>
          </Typography>
          <Typography variant="h4" className="mt-1 font-bold">
            <p className='dark:text-black text-black'> {value} </p>
          </Typography>
        </div>
        <Box 
          className={`p-3 rounded-full`}
          sx={{ bgcolor: `${color}.50`, color: `${color}.600` }}
        >
          {icon}
        </Box>
      </div>
      {trend && (
        <Typography 
          variant="caption" 
          className={`mt-2 flex items-center ${trend.value > 0 ? 'text-green-600' : 'text-red-600'}`}
        >
          {trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </Typography>
      )}
    </motion.div>
  );


  const statusChip = (status) => {
    switch(status) {
      case 'success':
        return (
          <Chip 
            icon={<FaRegCheckCircle size={14} />}
            label="Delivered"
            color="success"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      case 'failed':
        return (
          <Chip 
            icon={<FaRegTimesCircle size={14} />}
            label="Failed"
            color="error"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
      default:
        return (
          <Chip 
            icon={<FaRegClock size={14} />}
            label="Pending"
            color="warning"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        );
    }
  };

  return (
    <>
<div
onClick={() => {
  setShowMenu1(false) 
  setShowMenu2(false)
  setShowMenu3(false)
  setShowMenu4(false)
  setShowMenu5(false)
  setShowMenu6(false)
  setShowMenu7(false)
  setShowMenu8(false)
  setShowMenu9(false)
  setShowMenu10(false)
  setShowMenu11(false)  
  setShowMenu12(false)
}}
className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <Typography variant="h4" className="font-bold">Hotspot Analytics Dashboard</Typography>
        <Typography variant="body2" color="textSecondary">Monitor your hotspot performance and revenue</Typography>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
       <StatCard 
          title="Today's Revenue" 
          value="KSh 24,500" 
          icon={<LuDollarSign  className='text-black' size={24} />} 
          trend={{ value: 12, label: 'vs yesterday' }}
          color="primary"
        />
        <StatCard 
          title="Active Users" 
          value="142" 
          icon={<LuUsers className='text-black' size={24} />} 
          trend={{ value: 8, label: 'vs yesterday' }}
          color="secondary"
        />
        <StatCard 
          title="Avg. Session" 
          value="2h 15m" 
          icon={<LuClock size={24} className='text-black' />} 
          color="info"
        />
        <StatCard 
          title="Monthly Revenue" 
          value="KSh 189,200" 
          icon={<LuCalendar size={24} className='text-black' />} 
          trend={{ value: 18, label: 'vs last month' }}
          color="success"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <motion.div 
          variants={cardVariants}
          className="p-6 bg-white rounded-xl shadow-md"
        >
          <Typography variant="h6" className="font-semibold mb-4 dark:text-black">Monthly Revenue Trend</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`KSh ${value}`, value === value ? 'Revenue' : 'Users']}
              />
              <Legend />
              <Bar dataKey="revenue" fill="green" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Daily Revenue Pattern */}
        <motion.div 
          variants={cardVariants}
          className="p-6 bg-white rounded-xl shadow-md"
        >
          <Typography variant="h6" className="font-semibold mb-4 dark:text-black">Daily Revenue Pattern</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip formatter={(value) => [`KSh ${value}`, 'Revenue']} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#82ca9d" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                name="Revenue (KSh)"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Payments */}
      <motion.div 
        variants={cardVariants}
        className="p-6 bg-white rounded-xl shadow-md"
      >
        <Typography variant="h6" className="font-semibold 
        mb-4 dark:text-black">Recent Payments</Typography>
        <MaterialTable
          columns={[
            { 
              title: "Voucher", 
              field: "voucher",
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
                  label={rowData.method} 
                  size="small"
                  color={
                    rowData.method === 'M-Pesa' ? 'primary' : 
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
              title: "Date", 
              field: "date",
              render: (rowData) => format(new Date(rowData.date), 'PPpp'),
              defaultSort: 'desc'
            },
          ]}
          data={paymentData}
          options={{
            paging: true,
            pageSize: 5,
            search: true,
            showTitle: false,
            toolbar: true,
            headerStyle: {
              backgroundColor: '#f9fafb',
              color: 'black'
            },
            rowStyle: {
              '&:hover': {
                backgroundColor: '#f3f4f6'
              }
            }
          }}
        />
      </motion.div>
    </div>
   
        </>
  )
}

export default HotspotAnalytics
















