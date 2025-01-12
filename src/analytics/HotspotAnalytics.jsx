

import { Chart as ChartJS,   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend } from "chart.js";
import {  Bar } from "react-chartjs-2"; 
import {linearChartData} from './HotspotLinearChartData'
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';

import RouterIcon from '@mui/icons-material/Router';


ChartJS.register(   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend);





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
  return (
    <>

    <div className='grid  grid-auto-fit gap-3'>
   




<div className="max-w-[17rem] p-6 bg-white border  h-[10rem] border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <ion-icon name="people-outline" size='large'></ion-icon>

    <a href="#">
        <h5 className="mb-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Hotspot Subscribers</h5>
    </a>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400 text-3xl dotted-font ">110</p>
  
</div>







<div className="max-w-[17rem] p-6 bg-white border  h-[10rem] border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

<WifiIcon/>
    <a href="#">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Subscribers Active</h5>
    </a>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400 text-3xl dotted-font ">80</p>
  
</div>













</div>




<div className='mt-7 grid grid-auto-fit gap-3'>

<div className="max-w-[17rem] p-6 bg-white border  h-[10rem] border-gray-200 
rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

<WifiOffIcon/>
    <a href="#">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Active This Month</h5>
    </a>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400 text-3xl dotted-font ">150</p>
  
</div>




<div className="max-w-[17rem] p-6 bg-white border  h-[10rem] border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
<RouterIcon className='w-20'/>
    <a href="#">
        <h5 className="mb-2 text-xl font-semibold tracking-tight text-gray-900 dark:text-white">Total Hotspot Routers</h5>
    </a>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400 text-3xl dotted-font ">350</p>
  
</div>




<div className="max-w-[17rem] p-6 bg-white border  h-[10rem] border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

<img src="/images/icons8-money.gif" alt="" />
    <a href="#">
        <h5 className="mb-1 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Total Hotspot Income</h5>
    </a>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400 text-3xl dotted-font ">200</p>
  
</div>



<div className="max-w-[17rem] p-6 bg-white border  h-[10rem] border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

<WifiOffIcon/>
    <a href="#">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Subscribers Offline</h5>
    </a>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400  text-3xl dotted-font ">200</p>
  
</div>
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
















