

// import { Chart as ChartJS,   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend } from "chart.js";
// import {  Bar } from "react-chartjs-2"; 
import {linearChartData} from './HotspotLinearChartData'
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

import RouterIcon from '@mui/icons-material/Router';

import { LuUsers } from "react-icons/lu";
import { LineChart, Line,BarChart, Bar , XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area , 
    ResponsiveContainer,
    AreaChart} from 'recharts';

// ChartJS.register(   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend);
import {motion } from 'framer-motion'





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




const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

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

  return (
    <>

    <div className='grid  grid-auto-fit gap-3'>
   














</div>


<div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <AreaChart
          data={userActivity}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#yellow" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#yellow" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(date) => date.split('-')[2]} // Show only day
          />
          <YAxis />
          <Tooltip 
            formatter={(value) => [value, value === value ? 'Active Users' : 'Total Users']}
            labelFormatter={(date) => `Date: ${date}`}
          />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="activeUsers" 
            stroke="#8884d8" 
            fillOpacity={1} 
            fill="url(#colorActive)" 
            name="Active Users"
          />
          <Area 
            type="monotone" 
            dataKey="totalUsers" 
            stroke="#82ca9d" 
            fillOpacity={1} 
            fill="url(#colorTotal)" 
            name="Total Users"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
        </>
  )
}

export default HotspotAnalytics
















