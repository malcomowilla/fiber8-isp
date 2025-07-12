import { useState, useEffect, useCallback } from "react";
import {useApplicationSettings} from '../settings/ApplicationSettings'
import toast, { Toaster } from 'react-hot-toast';


const HotspotTrial = () => {
  const [timeLeft, setTimeLeft] = useState(60); // 10 minutes in seconds
  const {settingsformData, setFormData} = useApplicationSettings()


//   settingsformData.router_name
  useEffect(() => {
    if (timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const subdomain = window.location.hostname.split('.')[0];


const fetchRouters = useCallback(
  async() => {
    try {
      const response = await fetch('/api/allow_get_router_settings', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
const newData = await response.json()
      if (response) {
        console.log('fetched router settings', newData)
        const {router_name} = newData[0]
        setFormData({...settingsformData, router_name})
      } else {
        console.log('failed to fetch router settings')
      }
    } catch (error) {
      console.log(error)
    }
  },
  [],
)



  useEffect(() => {
   
    fetchRouters()
  }, [fetchRouters]);
  
  











  const hotspotTrial  = async() => {
const response = await fetch('/api/hotspot_trial', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Subdomain': subdomain,
    },
    body: JSON.stringify({router_name: settingsformData.router_name}),
  });


  try {
    if (response.ok) {
      setTimeLeft(0)
      toast.sucess('conected sucesfully,enjoy the free wi-fi',{
        duration: 7000,
        position: "top-center",
      })
    } else {
        toast.error(
            'Failed to start trial',
            {
              duration: 7000,
              position: "top-center",
            }
        )
      throw new Error('Failed to start trial');
    }
  } catch (error) {
    toast.error(
        'Failed to start trial',
        {
          duration: 7000,
          position: "top-center",
        }
    )
  }
  }




  

  return (
    <>
     <Toaster />
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 animate-slide-up">
          Welcome to Free Wi-Fi!
        </h1>
        <p className="text-gray-600 mb-6 animate-slide-up delay-100">
          Enjoy complimentary internet access for a limited time.
        </p>

        {/* Countdown Timer */}
        <div className="bg-gray-100 p-6 rounded-lg mb-6 animate-slide-up delay-200">
          <p className="text-sm text-gray-600 mb-2">Time Remaining</p>
          <p className="text-3xl font-bold text-gray-800">{formatTime(timeLeft)}</p>
        </div>

        {/* Call-to-Action Button */}
        <button
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:scale-105 transition-transform duration-300 animate-slide-up delay-300"
          onClick={hotspotTrial}
        >
          Start Free Trial
        </button>

        {/* Footer */}
        <p className="text-sm text-gray-500 mt-6 animate-slide-up delay-400">
          By continuing, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>
          .
        </p>
      </div>
    </div>

    </>
  );
};

export default HotspotTrial;