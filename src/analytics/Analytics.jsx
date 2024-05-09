
import { Chart as ChartJS,   BarElement, CategoryScale,  LinearScale, Title, Tooltip, Legend } from "chart.js";
import {  Bar } from "react-chartjs-2"; 
import {linearChartData} from './linearChartData'

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
    <div>
        <Bar            options={options}

 data={linearChartData}/>
        
        </div>
  )
}

export default Analytics