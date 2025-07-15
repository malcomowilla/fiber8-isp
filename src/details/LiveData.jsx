


import { MdOutlineOnlinePrediction } from "react-icons/md";
import { FaUser,FaClock, FaChartLine, FaDownload, FaUpload } from "react-icons/fa";
import { GiNetworkBars } from "react-icons/gi";
import { useState, useEffect, useCallback } from "react";

const LiveData = ({ onlineSessions = [], name,package_name,
  subscriberId, formData
 }) => {

  const [stats, setStats] = useState([]);
  // Sample data - replace with your actual data
  const sampleData = [
    {
      client: "John Doe",
      package: "Premium 100Mbps",
      username: "john123",
      password: "pass123",
      startTime: "10:30 AM",
      upload: "45 Mbps",
      download: "98 Mbps",
      timeOnline: "2h 15m",
      ip: "192.168.1.10"
    },
    {
      client: "Business Corp",
      package: "Enterprise 1Gbps",
      username: "biz456",
      password: "secure789",
      startTime: "9:15 AM",
      upload: "320 Mbps",
      download: "950 Mbps",
      timeOnline: "3h 30m",
      ip: "192.168.1.15"
    },
    {
      client: "Sarah Smith",
      package: "Basic 50Mbps",
      username: "sarahs",
      password: "home123",
      startTime: "11:45 AM",
      upload: "20 Mbps",
      download: "48 Mbps",
      timeOnline: "45m",
      ip: "192.168.1.20"
    }
  ];

  const data = onlineSessions.length > 0 ? onlineSessions : sampleData;

console.log('formData servcie type livedata', formData)
  const subdomain = window.location.hostname.split('.')[0];

  const getPPOEstats = useCallback(
    async() => {


      try {
        const response = await fetch(`/api/get_active_pppoe_users?subscriber_id=${subscriberId}`,
          {
            headers: { 'X-Subdomain': subdomain },
          }
        );
        const data = await response.json();
        
        if (response.ok) {
          setStats(data.users);
          
        } else {
          
        }
      } catch (error) {
        
      }
    },
    [],
  )





useEffect(() => {
  // Initial call
  getPPOEstats();
  
  // Set up interval for polling
  const intervalId = setInterval(() => {
    getPPOEstats();
  }, 7000);

  return () => clearInterval(intervalId);

}, [getPPOEstats]);

  







const [packages, setPackages] = useState([])

const fetchPackages = useCallback(
  async() => {
    
  try {
    const response = await fetch('/api/get_package',{
      method: 'GET',
      headers: {
        'X-Subdomain': subdomain,
      },
  
    }
  
  )
    const newData = await response.json()
  if (response.ok) {
    console.log('package',newData)
    setPackages(newData.package)

  } else {
    console.log('failed to fetch routers')

  }
  
  } catch (error) {
    
    console.log(error)
  
  }
  },
  [],
)


  useEffect(() => {
    
    fetchPackages()
  }, [fetchPackages]);





  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-800">Active Sessions</h2>
          <div className="flex items-center gap-2 bg-orange-100 px-3 py-1 rounded-full">
            <MdOutlineOnlinePrediction className="text-orange-500 animate-pulse" />
            <span className="text-sm font-medium text-orange-700">
              {stats.length} online sessions
            </span>
          </div>
        </div>
        <GiNetworkBars className="text-green-500 text-2xl" />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FaUser className="inline mr-1" /> Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Package
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FaUser className="inline mr-1" /> Username
              </th>
              {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FaKey className="inline mr-1" /> Password
              </th> */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                IP Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FaClock className="inline mr-1" /> Start Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FaUpload className="inline mr-1" /> Upload
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FaDownload className="inline mr-1" /> Download
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <FaChartLine className="inline mr-1" /> Time Online
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats.map((session, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {stats.length > 0 ? name : ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                  {stats.length > 0 ? session.package : ""}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {session?.username}
                </td>
                {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  <span className="bg-gray-100 px-2 py-1 rounded">{session.password}</span>
                </td> */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-mono">
                  {session?.ip_address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {session?.start_time}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-medium">
                  {session?.upload}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-500 font-medium">
                  {session?.download}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {session?.up_time}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
        <div>Last updated: {new Date().toLocaleTimeString()}</div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>All systems operational</span>
        </div>
      </div>
    </div>
  );
};

export default LiveData;