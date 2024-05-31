
import { Chart as ChartJS,   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend } from "chart.js";
import {  Bar } from "react-chartjs-2"; 
import {linearChartData} from './linearChartData'
import WifiOffIcon from '@mui/icons-material/WifiOff';
import WifiIcon from '@mui/icons-material/Wifi';
ChartJS.register(   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend);





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
        responsive: true,
               
        
      },
  }
  return (
    <>

    <div className='grid  grid-auto-fit'>
      <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <ion-icon name="people-outline" size='large'></ion-icon>
    <a href="#">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Total Subscribers</h5>
    </a>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">200</p>
  
</div>


<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
<WifiIcon/>
    <a href="#">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Subscribers Online</h5>
    </a>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">200</p>
  
</div>


<div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
<WifiOffIcon/>
    <a href="#">
        <h5 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Subscribers Offline</h5>
    </a>
    <p className="mb-3 font-normal text-gray-500 dark:text-gray-400">200</p>
  
</div>
</div>


    <div className='translate-y-[60px] flex justify-center'>
      <div style={{ width: '1500px', height: '500px' }}>

        <Bar            options={options}

 data={linearChartData}/>
              </div>

        </div>
        </>
  )
}

export default Analytics