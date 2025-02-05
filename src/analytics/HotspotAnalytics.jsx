

import { Chart as ChartJS,   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend } from "chart.js";
import {  Bar } from "react-chartjs-2"; 
import {linearChartData} from './HotspotLinearChartData'
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

import RouterIcon from '@mui/icons-material/Router';

import { LuUsers } from "react-icons/lu";

ChartJS.register(   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend);
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
  return (
    <>

    <div className='grid  grid-auto-fit gap-3'>
   




<motion.div 
 variants={cardVariants}
 initial="hidden"
 animate="visible"
 transition={{ duration: 0.5, delay: 0.6 }}
className="max-w-[17rem] p-6 bg-white border  h-[10rem] border-gray-200 rounded-lg shadow
 bg-gradient-to-r from-blue-500 to-blue-600
dark:bg-gray-800 dark:border-gray-700">
<LuUsers className='text-white w-8 h-8'/>
    <a href="#">
        <h5 className="mb-1 text-2xl font-semibold tracking-tight text-white">Hotspot Subscribers</h5>
    </a>
    <p className="mb-3 font-normal text-white  text-3xl dotted-font
    
    ">110</p>
  
</motion.div>







<motion.div 
 variants={cardVariants}
 initial="hidden"
 animate="visible"
 transition={{ duration: 0.5, delay: 0.5 }}
className="max-w-[17rem] p-6 bg-white border  h-[10rem] border-gray-200 rounded-lg
bg-gradient-to-r from-yellow-500 to-red-600
shadow dark:bg-gray-800 dark:border-gray-700">

<WifiIcon   className='text-white w-8 h-8'/>
    <a href="#">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-white">Subscribers Active</h5>
    </a>
    <p className="mb-3 font-normal text-white text-3xl dotted-font ">80</p>
  
</motion.div>













</div>




<div className='mt-7 grid grid-auto-fit gap-3'>

<motion.div 
 variants={cardVariants}
 initial="hidden"
 animate="visible"
 transition={{ duration: 0.5, delay: 0.4 }}
className="max-w-[17rem] p-6 bg-white border
bg-gradient-to-r from-indigo-500 to-blue-800
h-[10rem] border-gray-200 
rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

<WifiOffIcon className='text-white w-8 h-8'/>
    <a href="#">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-white">Active This Month</h5>
    </a>
    <p className="mb-3 font-normal text-white text-3xl dotted-font ">150</p>
  
</motion.div>




<motion.div 
 variants={cardVariants}
 initial="hidden"
 animate="visible"
 transition={{ duration: 0.5, delay: 0.4 }}
className="max-w-[17rem] p-6 bg-white border  h-[10rem] border-gray-200 rounded-lg
bg-gradient-to-r from-stone-500 to-neutral-600
shadow dark:bg-gray-800 dark:border-gray-700">
<RouterIcon className='w-20 text-white'/>
    <a href="#">
        <h5 className="mb-2 text-xl font-semibold tracking-tight text-white">Total Hotspot Routers</h5>
    </a>
    <p className="mb-3 font-normal text-white text-3xl dotted-font ">350</p>
  
</motion.div>




<motion.div
 variants={cardVariants}
 initial="hidden"
 animate="visible"
 transition={{ duration: 0.5, delay: 0.4 }}
className="max-w-[17rem] p-6 bg-white border  h-[10rem] border-gray-200 
bg-gradient-to-r from-fuchsia-500 to-purple-600
rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

<img src="/images/icons8-money.gif"  className='rounded-full' alt="" />
    <a href="#">
        <h5 className="mb-1 text-2xl font-semibold tracking-tight text-white">Total Hotspot Income</h5>
    </a>
    <p className="mb-3 font-normal text-white text-3xl dotted-font ">200</p>
  
</motion.div>



<motion.div 
 variants={cardVariants}
 initial="hidden"
 animate="visible"
 transition={{ duration: 0.5, delay: 0.4 }}
className="max-w-[17rem] p-6 bg-white border  h-[10rem] border-gray-200 
bg-gradient-to-l from-green-500 to-green-600
rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

<WifiOffIcon className='text-white w-8 h-8'/>
    <a href="#">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-white">Subscribers Offline</h5>
    </a>
    <p className="mb-3 font-normal text-white  text-3xl dotted-font ">200</p>
  
</motion.div>
</div>

<div className='translate-y-[60px] flex lg:flex-row gap-x-20  sm:flex-col max-sm:flex-col'>

<div>
        <Bar   height="360px"
  width="360px"
  options={{ maintainAspectRatio: false }}           

 data={linearChartData}/>
</div>


<Bar     height="200px"
  width="100px"
  options={{ maintainAspectRatio: false }}  

data={linearChartData}/>

        </div>
        </>
  )
}

export default HotspotAnalytics
















