import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TrafficStatsGraph = ({ trafficData }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Download',
        data: [],
        borderColor: '#4fd1c5',
        backgroundColor: 'rgba(79, 209, 197, 0.1)',
        borderWidth: 2,
        tension: 0.1,
        fill: true,
        pointRadius: 0,
      },
      {
        label: 'Upload',
        data: [],
        borderColor: '#9f7aea',
        backgroundColor: 'rgba(159, 122, 234, 0.1)',
        borderWidth: 2,
        tension: 0.1,
        fill: true,
        pointRadius: 0
      }
    ]
  });
  
  const chartRef = useRef(null);
  const dataHistory = useRef([]);
  const maxDataPoints = 30;

  useEffect(() => {
    if (trafficData) {
      // Use data exactly as received from backend
      const newEntry = {
        timestamp: new Date(),
        download: trafficData.download_speed, // Use directly
        upload: trafficData.upload_speed      // Use directly
      };
      
      dataHistory.current = [...dataHistory.current, newEntry].slice(-maxDataPoints);
      
      // Format timestamp only (no data manipulation)
      const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
          hour12: true,
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit'
        });
      };

      setChartData({
        labels: dataHistory.current.map(entry => formatTime(entry.timestamp)),
        datasets: [
          {
            ...chartData.datasets[0],
            data: dataHistory.current.map(entry => entry.download)
          },
          {
            ...chartData.datasets[1],
            data: dataHistory.current.map(entry => entry.upload)
          }
        ]
      });
      
      if (chartRef.current) {
        chartRef.current.update();
      }
    }
  }, [trafficData]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: 'linear'
    },
    plugins: {
      title: {
        display: true,
        text: 'LIVE TRAFFIC',
        color: '#a0aec0',
        font: {
          size: 16
        }
      },
      legend: {
        position: 'top',
        labels: {
          color: '#a0aec0',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          // Display raw values in tooltip
          label: (context) => `${context.dataset.label}: ${context.parsed.y}`
        }
      }
    },
    scales: {
       x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)', // Light gray vertical grid lines
        drawBorder: true,
        borderColor: 'rgba(255, 255, 255, 0.2)'
      },
      ticks: {
        color: '#a0aec0',
        maxTicksLimit: 10,
        autoSkip: true
      }
    },
     y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)', // Light gray horizontal grid lines
        drawBorder: true,
        borderColor: 'rgba(255, 255, 255, 0.2)'
      },
      ticks: {
        color: '#a0aec0',
        callback: (value) => `${value}`
      },
      beginAtZero: true
    }

    
    },

    
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <div className="h-64 w-full">
        <Line 
          ref={chartRef}
          data={chartData} 
          options={options} 
        />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-300">Current Download</p>
          <p className="text-xl font-medium text-teal-400">
            {dataHistory.current.length > 0 
              ? dataHistory.current[dataHistory.current.length - 1].download 
              : '0'}
          </p>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg">
          <p className="text-sm text-gray-300">Current Upload</p>
          <p className="text-xl font-medium text-purple-400">
            {dataHistory.current.length > 0 
              ? dataHistory.current[dataHistory.current.length - 1].upload 
              : '0'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrafficStatsGraph;