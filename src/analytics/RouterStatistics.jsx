
import { useState, useEffect, useCallback } from 'react'
import { useApplicationSettings } from '../settings/ApplicationSettings';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle,
  Clock,
} from 'react-feather';

import { MdOutlineRouter } from "react-icons/md";



const RouterStatistics = () => {
const [routerData, setRouterData] = useState(null);
const [currentRouterImage, setCurrentRouterImage] = useState(null);
const [uptime, setUptime] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const {showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,} = useApplicationSettings();



const formatUptime = (seconds) => {
    if (!seconds) return 'N/A';
    
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let result = [];
    if (days > 0) result.push(`${days}d`);
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    if (secs > 0 && result.length < 2) result.push(`${secs}s`);

    return result.join(' ') || '0s';
  };

    const [mikotik, setMikotik] = useState([
        {
            "id": 1,
            "name": "hAP ax lite",
            "image": '/images/hAP_ax_lite.png'
        },

        {
            "id": 2,
            "name": "RB951Ui-2HnD",
            "image": '/images/RB951Ui-2HnD.png'
        },
        {
            "id": 3,
            "name": "hAP ac²",
            "image": '/images/hAP_ac².png'
        },
        {
            "id": 4,
            "name": "cAP ac",
            "image": '/images/cAP_ac.png'
        },
        {
            "id": 5,
            "name": "hAP ac",
            "image": '/images/'
        },
        {
            "id": 6,
            "name": "hEX lite",
            "image": '/images/hEX_lite.png'
        },
        {
            "id": 7,
            "name": "hEX",
            "image": '/images/hEX.png'
        },
        {
            "id": 8,
            "name": "hEX PoE lite",
            "image": '/images/hEX_PoE_lite.png'
        },
        {
            "id": 9,
            "name": "RB4011iGS+RM",
            "image": '/images/RB4011iGS+RM.png'
        },
        {
            "id": 10,
            "name": "CCR2004-16G-2S+",
        "image": '/images/CCR2004-16G-2S+.png'
        },
        {
            "id": 11,
            "name": "CCR2004-16G-2S+PC",
            "image": '/images/CCR2004-16G-2S+PC.png'
        },
        {
            "id": 12,
            "name": "CCR2004-1G-12S+2XS",
            "image": '/images/CCR2004-1G-12S+2XS.png'
        },
        {
            "id": 13,
            "name": "CCR2116-12G-4S+",
            "image": '/images/CCR2116-12G-4S+.png'
        },
        {
            "id": 14,
            "name": "CCR2216-1G-12XS-2XQ",
            "image": '/images/CCR2216-1G-12XS-2XQ.png'
        },
        {
            "id": 15,
            "name": "L009UiGS-RM",
            "image": '/images/L009UiGS-RM.png'
        }, 
        {
            "id": 16,
            "name": "RB5009UG+S+IN",
            "image": '/images/RB5009UG+S+IN.png'
        },
        {
            "id": 17,
            "name": "hEX refresh",
            "image": '/public/images/hEX_refresh.png'
        },
        {
            "id": 18,
            "name": "hAP ac³",
            "image": '/images/hAP_ac³.png'
        },{
            "id": 19,
            "name": "hAP ac lite",
            "image": '/images/hAP_ac_lite.png'
        }, {
            "id": 20,
            "name": "hAP ac lite TC",
            "image": '/images/hAP_ac_lite_TC.png'
        }, {
            "id": 21,
            "name": "cAP",
            "image": '/images/cAP.png'
        }, {
            "id": 22,
            "name": "RB4011iGS+5HacQ2HnD-IN",
            "image": '/images/RB4011iGS+5HacQ2HnD-IN.png'

        }, {
            "id": 23,
            "name": "hAP ax lite LTE6",
            "image": '/public/images/hAP_ax_lite_LTE6.png'
        },
        {
            "id": 24,
            "name": "L009UiGS-2HaxD-IN",
            "image": '/images/L009UiGS-2HaxD-IN.png'
        },
        {
            "id": 25,
            "name": "RB2011UiAS-2HnD-IN",
            "image": '/images/RB2011UiAS-2HnD-IN.png'
        }

    ])





    const subdomain = window.location.hostname.split('.')[0];
    const fetchRouterInfo = useCallback(async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch("/api/router_info", {
            headers: { 'X-Subdomain': window.location.hostname.split('.')[0] },
          });
          
          if (!response.ok) throw new Error('Failed to fetch router info');
          
          const data = await response.json();
          setRouterData(data.board_name);
          setUptime(data.uptime);
          
          const matchedRouter = mikotik.find(router => router.name === data.board_name);
          setCurrentRouterImage(matchedRouter?.image || null);
          
        } catch (err) {
          setError(err.message);
          setRouterData(null);
          setUptime(null);
        } finally {
          setLoading(false);
        }
      }, []);
    
      useEffect(() => {
        fetchRouterInfo();
        const intervalId = setInterval(fetchRouterInfo, 300000);
        return () => clearInterval(intervalId);
      }, [fetchRouterInfo]);
    
  return (
    <motion.div 
    onClick={() => {
      setShowMenu1(false)
      setShowMenu2(false)
      setShowMenu3(false)
      setShowMenu4(false) 
      setShowMenu5(false)
      setShowMenu6(false)
      setShowMenu7(false)
      setShowMenu8(false)
      setShowMenu9(false)
      setShowMenu10(false)
      setShowMenu11(false)  
      setShowMenu12(false)
    }}
    className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {loading && (
      <motion.div
        className="flex items-center justify-center py-8"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        <RefreshCw className="text-blue-500 animate-spin" size={24} />
      </motion.div>
    )}

    {error && (
      <motion.div 
        className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
      >
        <AlertTriangle className="text-red-500 mr-3" />
        <div>
          <p className="font-medium text-red-800 dark:text-red-200">Connection Error</p>
          <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
        </div>
      </motion.div>
    )}

    {!loading && !error && routerData && (
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {currentRouterImage ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 flex-shrink-0"
            >
              <img 
                src={currentRouterImage} 
                alt={routerData}
                className="w-full h-full object-contain"
              />
            </motion.div>
          ) : (
            <div className="w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
              <MdOutlineRouter className="text-gray-400" size={32} />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center">
              <Wifi className="text-green-500 mr-2" size={18} />
              Router Status
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Model: <span className="font-medium">{routerData}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <Clock className="text-blue-500" size={18} />
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Uptime</p>
            <p className="font-mono text-blue-600 dark:text-blue-300">
              {uptime}
            </p>
          </div>
        </div>
      </div>
    )}

    {!loading && !error && !routerData && (
      <div className="flex items-center justify-center p-6 text-center">
        <div>
          <WifiOff className="text-gray-400 mx-auto mb-2" size={32} />
          <p className="text-gray-500 dark:text-gray-400">No router data available</p>
        </div>
      </div>
    )}
  </motion.div>
  )
}

export default RouterStatistics
