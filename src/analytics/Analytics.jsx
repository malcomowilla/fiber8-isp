
import { Chart as ChartJS,   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend,  ArcElement } from "chart.js";

import {  Bar } from "react-chartjs-2"; 
import {  Pie } from "react-chartjs-2"; 

import {linearChartData} from './linearChartData'
import {linearChartData2} from './linearChataData2'
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { useState , useEffect } from 'react'

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
const [date, setDate] = useState(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }))
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


  return (
    <>
      <p className='capitalize mb-10 dark:text-white text-black text-2xl'>{date} </p>

    <div className='grid  grid-auto-fit  gap-4'>
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <ion-icon name="people-outline" size='large'></ion-icon>
    <a href="#">
        <h5 className="mb-2  font-semibold raleway-dots-regular tracking-tight text-gray-900 dark:text-white">Total Subscribers</h5>
    </a>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400  text-2xl">200</p>
  
</div>


<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
<WifiIcon/>
    <a href="#">
        <h5 className="mb-2  font-semibold tracking-tight text-gray-900 dark:text-white raleway-dots-regular ">Subscribers Online</h5>
    </a>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400   text-2xl">200</p>
  
</div>


<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
<WifiOffIcon/>
    <a href="#">
        <h5 className="mb-2 raleway-dots-regular font-semibold tracking-tight text-gray-900 dark:text-white ">Subscribers Offline</h5>
    </a>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400   text-2xl">200</p>
  
</div>
</div>


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