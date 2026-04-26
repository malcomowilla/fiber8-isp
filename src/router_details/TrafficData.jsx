import React, { useState, useEffect, useRef } from 'react';
import ReactApexChart from 'react-apexcharts';

const TrafficStatsGraph = ({ trafficData }) => {
  const [chartData, setChartData] = useState({
    series: [
      {
        name: 'Download Speed',
        data: [],
      },
      {
        name: 'Upload Speed', 
        data: [],
      }
    ],
    options: {
      chart: {
        id: 'live-traffic',
        height: 350,
        type: 'line',
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 1000
          }
        },
        toolbar: {
          show: true
        },
        zoom: {
          enabled: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        width: 3,
        curve: 'smooth'
      },
      title: {
        text: 'Network Traffic - Real Time',
        align: 'left'
      },
      markers: {
        size: 0
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false, // 👈 CRITICAL: This displays local time instead of UTC
          formatter: function(value, timestamp, opts) {
            // Use local time formatting
            const date = new Date(timestamp);
            return date.toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            });
          }
        }
      },
      yaxis: {
        title: {
          text: 'Speed (Mbps)'
        },
        min: 0
      },
      tooltip: {
        x: {
          formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
            // Show full local time in tooltip
            const date = new Date(value);
            return date.toLocaleString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            });
          }
        }
      },
      colors: ['#008FFB', '#00E396'],
      legend: {
        position: 'top'
      }
    },
  });

  const dataHistory = useRef([]);
  const maxDataPoints = 30;

  useEffect(() => {
    if (trafficData) {
      // Use local time timestamp
      const now = new Date();
      const newEntry = {
        timestamp: now.getTime(), // This is local time in milliseconds
        download: trafficData.download_speed,
        upload: trafficData.upload_speed
      };
      
      dataHistory.current = [...dataHistory.current, newEntry].slice(-maxDataPoints);
      
      setChartData(prev => ({
        ...prev,
        series: [
          {
            name: 'Download Speed',
            data: dataHistory.current.map(entry => [entry.timestamp, entry.download])
          },
          {
            name: 'Upload Speed',
            data: dataHistory.current.map(entry => [entry.timestamp, entry.upload])
          }
        ]
      }));
    }
  }, [trafficData]);

  // Get current local time for display
  const getCurrentLocalTime = () => {
    return new Date().toLocaleTimeString('en-US', {
      hour12: true,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      {/* Timezone info */}
      {/* <div className="mb-2 text-sm text-gray-600 text-center">
        Local Time: {getCurrentLocalTime()}
      </div> */}
      
      <div className="h-60 w-full">
        <ReactApexChart 
          options={chartData.options} 
          series={chartData.series} 
          type="line" 
          height="100%"
        />
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-600">Current Download</p>
          <p className="text-xl font-bold text-blue-600">
            {dataHistory.current.length > 0 
              ? `${dataHistory.current[dataHistory.current.length - 1].download}` 
              : '0'}
          </p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-200">
          <p className="text-sm text-gray-600">Current Upload</p>
          <p className="text-xl font-bold text-green-600">
            {dataHistory.current.length > 0 
              ? `${dataHistory.current[dataHistory.current.length - 1].upload}` 
              : '0 '}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrafficStatsGraph;