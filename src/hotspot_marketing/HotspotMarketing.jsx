import React, { useState, useEffect, useCallback } from 'react';
import { Edit, Trash2, Eye, EyeOff, Calendar, BarChart3 } from 'lucide-react';
import {useNavigate} from 'react-router-dom'
  import { ToastContainer, toast } from 'react-toastify';
  import MaterialTable from 'material-table';
import { 
  Delete, 
  Visibility, 
  VisibilityOff, 
  BarChart,
  CalendarToday,
  Add,
  Star,
  LocalOffer
} from '@mui/icons-material';
import { CiSettings } from "react-icons/ci";
import DeleteHotspotAd from '../delete/DeleteHotspotAd';



function SkeletonBlock({ h = 'h-8', w = 'w-full', rounded = 'rounded-lg' }) {
  return <div className={`skeleton ${h} ${w} ${rounded}`} />;
}



const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');
    .dash-root { font-family: 'Plus Jakarta Sans', sans-serif; }
    .mono { font-family: 'Space Mono', monospace; }
    @keyframes shimmer {
      0%   { background-position: -400px 0; }
      100% { background-position:  400px 0; }
    }
    @keyframes countUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    @keyframes gradientShift {
      0%,100% { background-position: 0% 50%; }
      50%      { background-position: 100% 50%; }
    }
      
    @keyframes pulse-ring {
      0%   { transform:scale(1); opacity:.6; }
      100% { transform:scale(1.8); opacity:0; }
    }
    .skeleton {
      background: linear-gradient(90deg, #2984D1 25%, #075F5A 50%, #1A7595 75%);
      background-size: 400px 100%;
      animation: shimmer 1.4s infinite;
    }
    .stat-num { animation: countUp 0.5s ease forwards; }
    .gradient-animated {
      background: linear-gradient(135deg, #0ea5e9, #6366f1, #8b5cf6);
      background-size: 200% 200%;
      animation: gradientShift 4s ease infinite;
    }
    .live-dot::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #34d399;
      animation: pulse-ring 1.5s ease-out infinite;
    }
    .card-hover { transition: transform .2s, box-shadow .2s; }
    .card-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,.3); }
    .rank-1 { background: linear-gradient(135deg,#ffd700,#f59e0b); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .rank-2 { background: linear-gradient(135deg,#c0c0c0,#94a3b8); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .rank-3 { background: linear-gradient(135deg,#cd7f32,#b45309); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
    .scrollbar-thin::-webkit-scrollbar { width: 4px; }
    .scrollbar-thin::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  `}</style>
);


const HotspotMarketing = () => {
    const navigate = useNavigate()
    const [numberOfAds, setNumberOfAds] = useState(0)
  
  const [ads, setAds] = useState([]);
  const [openDeleteHotspotAdd, setOpenDeleteHotspotAdd] = useState(false);
  const [adId, setAdId] = useState(0)
  const [loading, setLoading]         = useState(true);






 const handleCloseDeleteHotspotAdd = () => (
    setOpenDeleteHotspotAdd(false)
 )

const subdomain = window.location.hostname.split('.')[0]

  const getNumberOfAds = useCallback(
    async() => {
     
      try {
        const response = await fetch('/api/number_of_ads', {
          headers: {
            'X-Subdomain': subdomain,
          },
        })

        const newData = await response.json()


        
        if (response.ok) {

          setNumberOfAds(newData)
          
        } else {
          console.log('failed to get number of ads')
          if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    autoClose: 5000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
        }
      } catch (error) {
          toast.error('Internal server error while getting number of ads', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      }
    },
    [],
  )
  

  useEffect(() => {
    getNumberOfAds()
  }, [getNumberOfAds]);







const getAdd = useCallback(
  async() => {
    try {
      const response = await fetch('/api/ad_settings', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })

      const newData = await response.json()
      if (response.ok) {
        console.log('ad settings fetched', newData)
        setAds(newData)
       
        console.log('ad settings fetched', newData)
      }else{
         if (response.status === 401) {
  toast.error(newData.error, {
    position: "top-center",
    autoClose: 5000,
  })
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
      }
    } catch (error) {
      
    }
  },
  [],
)



useEffect(() => {
  getAdd()
}, [getAdd]);


const [totalClicks, setTotalClicks] = useState(0)
const [totalImpressions, setTotalImpressions] = useState(0)






const getTotalImpressions = useCallback(
  async() => {
   
    try {
      
      const response = await fetch('/api/total_ad_impressions', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
       const newData = await response.json()
      if (response.ok) {
       
        setTotalImpressions(newData)
        setLoading(false)
        
      }
    } catch (error) {

      
    }
  },
  [],
)


useEffect(() => {
  
  getTotalImpressions()
}, [getTotalImpressions]);

const getTotalClicks = useCallback(
  async() => {
    
    try {
      const response = await fetch('/api/total_ad_clicks', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
       const newData = await response.json()
      if (response.ok) {
       
        setTotalClicks(newData)
        setLoading(false)
        
      } else {
        console.log('failed to get total clicks')

        
      }
    } catch (error) {
      
    }
  },
  [],
)


useEffect(() => {
  
  getTotalClicks()
}, [getTotalClicks]);


  const toggleAdStatus = (adId) => {
    setAds(ads.map(ad => 
      ad.id === adId 
        ? { ...ad, status: ad.status === 'active' ? 'paused' : 'active' }
        : ad
    ));
  };

  const deleteAd = async() => {
    try {
      const response = await fetch(`/api/ad_settings/${adId}`, {
        headers: {
          'X-Subdomain': subdomain,
        },
        method: 'DELETE',
        
      })
      if (response.ok) {
        setOpenDeleteHotspotAdd(false)
        toast.success('Ad deleted successfully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
            setAds(ads.filter(ad => ad.id !== adId));

        
      } else {
        toast.error('Failed to delete ad', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        
      }
    } catch (error) {
      toast.error('error while deleting ad, please try again', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
    }
  };



 const columns = [
    {
      title: <p className='text-black font-semibold'>Ad Title</p>,
      field: 'ad_title',
      headerStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' },
      render: rowData => (
        <div className="flex items-center space-x-3">
          {rowData.image_url && (
            <img 
              src={rowData?.image_url} 
              alt={rowData?.title}
              className="w-10 h-10 rounded-lg object-cover"
            />
          )}
          <div>
            <p className="font-semibold text-gray-900">{rowData?.ad_title}</p>
            {/* <p className="text-sm text-gray-500">{rowData?.business_name}</p> */}
          </div>
        </div>
      )
    },
    {
      title: <p className='text-black font-semibold'>Status</p>,
      field: 'ad_enabled',
      headerStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' },
      render: rowData => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          rowData.ad_enabled === true
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {rowData.ad_enabled === true ? 'Active' : 'Paused'}
        </span>
      )
    },
    {
      title: <p className='text-black font-semibold'>Performance</p>,
      field: 'performance',
      headerStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' },
      render: rowData => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <BarChart className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">
              {totalImpressions || 0} impressions
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {totalClicks || 0} clicks (
            {totalImpressions > 0 
              ? ((rowData.clicks / rowData.impressions) * 100).toFixed(1) 
              : 0
            }%)
          </div>
        </div>
      )
    },
    {
      title: <p className='text-black font-semibold'>Created</p>,
      field: 'created_at',
      headerStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' },
      render: rowData => (
        <div className="flex items-center space-x-2">
          <CalendarToday className="w-4 h-4 text-gray-700" />
          <span className="text-sm text-gray-600">
            {rowData.created_at}
          </span>
        </div>
      )
    },
    {
      title: <p className='text-black font-semibold'>Actions</p>,
      field: 'actions',
      headerStyle: { fontWeight: 'bold', backgroundColor: '#f8fafc' },
      render: rowData => (
        <div className="flex space-x-1">
          {/* <button
            onClick={(e) => {
              e.stopPropagation();
              toggleAdStatus(rowData.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              rowData.status === 'active' 
                ? 'text-yellow-600 hover:bg-yellow-50' 
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            {rowData.status === 'active' ? 
              <VisibilityOff className="w-4 h-4" /> : 
              <Visibility className="w-4 h-4" />
            }
          </button> */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              // editAd(rowData.id);
            }}
            className="p-2 text-blue-600 rounded-lg
             hover:bg-blue-50 transition-colors"
          >
            <Edit 
            onClick={() => {
             navigate(`/admin/add-settings?id=${rowData.id} &ad_enabled=${rowData.ad_enabled} &ad_title=${rowData.ad_title} &position=${rowData.position} &media_type=${rowData.media_type} &reward_type=${rowData.reward_type} &free_minutes=${rowData.free_minutes} &selected_package=${rowData.selected_package} &ad_link=${rowData.ad_link}  &skip_after=${rowData.skip_after} &can_skip=${rowData.can_skip} &ad_duration=${rowData.ad_duration}`)
            }}
            className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // deleteAd(rowData.id);
              setAdId(rowData.id)
              setOpenDeleteHotspotAdd(true)
            }}
            className="p-2 text-red-600 rounded-lg
             hover:bg-red-50 transition-colors"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      )
    }
  ];

  // Stats cards data
  const stats = [
    {
      title: <p className='dark:text-white text-black'>Total Ads</p>,
      value: <p className='dark:text-white text-black'>{numberOfAds}</p>,
      icon: <LocalOffer className="w-6 h-6 dark:text-white" />,
      color: 'text-gray-900'
    },
    {
      title: 'Active Ads',
      value: ads.filter(ad => ad.status === 'active').length,
      icon: <Star className="w-6 h-6" />,
      color: 'text-green-600'
    },
    {
      title: 'Total Impressions',
      value: <p className='dark:text-white text-black'>{totalImpressions}</p>,
      icon: <BarChart className="w-6 h-6 dark:text-white text-black" />,
      color: 'text-gray-900'
    },
    {
      title: 'Total Clicks',
      value: totalClicks,
      icon: <Visibility className="w-6 h-6" />,
      color: 'text-blue-600'
    }
  ];




  return (
    <>
    <Styles />  
      <ToastContainer />
      <DeleteHotspotAd handleCloseDeleteHotspotAdd={handleCloseDeleteHotspotAdd}
        openDeleteHotspotAdd={openDeleteHotspotAdd}
        deleteHotspotAdd={deleteAd}
        />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Ad Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your WiFi hotspot advertisements
              </p>
            </div>


 <div className="flex flex-col items-center justify-center">
     <div className="text-6xl">🚧</div> <h1 className="text-2xl
      font-bold mt-4">Under Development</h1> 
 <p className="text-gray-500">
        </p> </div>

        
            <button 
              onClick={() => navigate('/admin/add-settings')}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <CiSettings className="w-5 h-5" />
              <span>Ad Settings</span>
            </button>
          </div>

          {/* Stats Cards */}
          
        
          <div className="grid grid-cols-1 md:grid-cols-2 
          lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white dark:bg-gray-700
               rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className={`text-2xl font-bold ${stat.color}`}>
                      
                      {loading ? (
                        <>
                        <div className="space-y-2">
          <SkeletonBlock h="h-7" w="w-10" />
          {/* <SkeletonBlock h="h-3" w="w-20" rounded="rounded" /> */}
        </div>
                        </>
                      ): stat.value}
                    </h3>
                    <p className="text-gray-600  dark:text-gray-400 mt-1">
                      {loading ? (
                        <>
                        <div className="space-y-2">
          <SkeletonBlock h="h-7" w="w-20" />
          {/* <SkeletonBlock h="h-3" w="w-20" rounded="rounded" /> */}
        </div>
                        </>
                      ): stat.title}
                      
                    </p>
                  </div>
                  <div className="text-gray-400">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Material Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <MaterialTable
              // onRowClick={handleRowClick}
              title={
                <p className='bg-gradient-to-r from-green-600 via-blue-400 to-cyan-500 
                bg-clip-text text-transparent text-2xl font-bold'>
                  Active Advertisements
                </p>
              }
              columns={columns}
              data={ads}
              options={{
                headerStyle: {
                  backgroundColor: '#f8fafc',
                  fontWeight: 'bold',
                  color: '#1f2937'
                },
                rowStyle: {
                  backgroundColor: '#ffffff'
                },
                pageSize: 10,
                pageSizeOptions: [5, 10, 20],
                paginationType: 'stepped',
                showFirstLastPageButtons: true,
                exportButton: true,
                exportAllData: true,
                actionsColumnIndex: -1,
                sorting: true,
                search: true,
                filtering: false,
                draggable: false,
                emptyRowsWhenPaging: false,
                showTitle: true,
                toolbar: true,
                padding: 'dense'
              }}
              localization={{
                body: {
                  emptyDataSourceMessage: 'No ads found. Create your first ad to get started!'
                },
                toolbar: {
                  searchTooltip: 'Search ads',
                  searchPlaceholder: 'Search ads...',
                  exportTitle: 'Export Ads',
                  exportAriaLabel: 'Export Ads'
                },
                pagination: {
                  labelDisplayedRows: '{from}-{to} of {count}',
                  labelRowsSelect: 'rows',
                  labelRowsPerPage: 'Rows per page:',
                  firstAriaLabel: 'First page',
                  firstTooltip: 'First page',
                  previousAriaLabel: 'Previous page',
                  previousTooltip: 'Previous page',
                  nextAriaLabel: 'Next page',
                  nextTooltip: 'Next page',
                  lastAriaLabel: 'Last page',
                  lastTooltip: 'Last page'
                },
                header: {
                  actions: 'Actions'
                }
              }}


              
              actions={[
                {
                  icon: () => <Add className="text-white" />,
                  tooltip: 'Add New Ad',
                  isFreeAction: true,
                  onClick: () => navigate('/admin/add-settings')
                }
              ]}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default HotspotMarketing;