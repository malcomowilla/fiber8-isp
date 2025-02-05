
import { Chart as ChartJS,   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend,  ArcElement } from "chart.js";

import {  Bar } from "react-chartjs-2"; 
import {  Pie } from "react-chartjs-2"; 

import {linearChartData} from './linearChartData'
import {linearChartData2} from './linearChataData2'
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useState , useEffect } from 'react'  
import { LiaUserSolid } from "react-icons/lia";
import {motion } from 'framer-motion'

ChartJS.register(   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend, ArcElement);





const Analytics = () => {
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
               
        
      },
  }
  
  const {welcomeMessage, welcome, setFormData, settingsformData} = useApplicationSettings()
const [date, setDate] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', 
  minute: 'numeric', second: 'numeric', hour12: true }))
const [datetime, setdateTime] = useState(true)

// useEffect(() => {
//   setDate(new Date().toLocaleDateString())


// },[date]);



useEffect(() => {
  const timeout = setTimeout(() => {
    setdateTime(false)

  }, 9000);
 clearTimeout(timeout)
}, []);
 


useEffect(() => {
  const interval = setInterval(() => {
    setDate(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }));

  }, 1000);
  return () => clearInterval(interval);

}, [date]);


const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

  return (
    <>
    
    <div className="p-6">
      {/* <p className="capitalize mb-10 dark:text-white text-black text-2xl">{date}</p> */}

      <div className="grid grid-auto-fit gap-6">
        {/* Total Subscribers Card */}
        <motion.div
          className="max-w-sm p-6 bg-gradient-to-r from-blue-500 to-blue-600 border border-gray-200 
          rounded-lg shadow-lg dark:border-gray-700 transform transition-all hover:scale-105"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{scale: 1.1}}
        >
          <LiaUserSolid className="w-10 h-10 mb-4 text-white" />
          <a href="#">
            <h5 className="mb-2 text-xl font-semibold tracking-tight text-white raleway-dots-regular">
              Total Subscribers
            </h5>
          </a>
          <p className="mb-3 font-normal text-white text-3xl">200</p>
        </motion.div>

        {/* Subscribers Online Card */}
        <motion.div
         whileHover={{scale: 1.1}}
          className="max-w-sm p-6 bg-gradient-to-r from-green-500 to-green-600 border border-gray-200 rounded-lg shadow-lg dark:border-gray-700 transform transition-all hover:scale-105"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <WifiIcon className="w-10 h-10 mb-4 text-white" />
          <a href="#">
            <h5 className="mb-2 text-xl font-semibold tracking-tight text-white raleway-dots-regular">
              Subscribers Online
            </h5>
          </a>
          <p className="mb-3 font-normal text-white text-3xl">200</p>
        </motion.div>

        {/* Subscribers Offline Card */}
        <motion.div
         whileHover={{scale: 1.1}}
          className="max-w-sm p-6 bg-gradient-to-r from-red-500 to-red-600 border border-gray-200 rounded-lg shadow-lg dark:border-gray-700 transform transition-all hover:scale-105"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <WifiOffIcon className="w-10 h-10 mb-4 text-white" />
          <a href="#">
            <h5 className="mb-2 text-xl font-semibold tracking-tight text-white raleway-dots-regular">
              Subscribers Offline
            </h5>
          </a>
          <p className="mb-3 font-normal text-white text-3xl">200</p>
        </motion.div>
      </div>
    </div>


    <motion.div 
    variants={cardVariants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 0.5, delay: 0.6 }}
    id="wrapper" class="max-w-xl px-4 py-4 mx-auto ">
            <div className="sm:grid sm:h-32 sm:grid-flow-row sm:gap-4 sm:grid-cols-3">
                <div id="jh-stats-positive" className="flex flex-col justify-center px-4 py-4
                 bg-white border border-gray-300 rounded-lg shadow-lg sm:px-6 sm:py-8 sm:h-32">
                    <motion.div
                    transition={{ duration: 0.5}}
                    whileHover={{ scale: 1.3 }}
                    >
                        <div>
                            <p className="flex items-center justify-end text-green-500 text-md">
                                <span className="font-bold">6%</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path class="heroicon-ui" d="M20 15a1 1 0 002 0V7a1 1 0 00-1-1h-8a1 1 0 000 2h5.59L13 13.59l-3.3-3.3a1 1 0 00-1.4 0l-6 6a1 1 0 001.4 1.42L9 12.4l3.3 3.3a1 1 0 001.4 0L20 9.4V15z"/></svg>
                            </p>  
                        </div>
                        <p className="text-3xl font-semibold text-center text-gray-800">43</p>
                        <p className="text-lg text-center text-gray-500">New Tickets</p>
                    </motion.div>
                </div>
    
               

               
            </div>
        </motion.div>





    <div className='translate-y-[60px] flex lg:flex-row gap-x-20  sm:flex-col max-sm:flex-col'>

<div>
        <Bar   height="390px"
  width="390px"
  options={{ maintainAspectRatio: false }}           

 data={linearChartData}/>
</div>


<Pie      height="200px"
  width="100px"
  options={{ maintainAspectRatio: false }}  

data={linearChartData2}/>




        </div>



        
        </>
  )
}

export default Analytics