

import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import {Profile} from '../profile/Profile'
import {useState, useEffect, useCallback} from 'react'
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import EastSharpIcon from '@mui/icons-material/EastSharp';
import {useApplicationSettings} from '../settings/ApplicationSettings'
import { LuBotMessageSquare } from "react-icons/lu";
import { FiDollarSign, FiAlertTriangle, FiInfo } from 'react-icons/fi';
import { FaArrowRightLong } from "react-icons/fa6";
import { FaIdCard } from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";








const Header = () => {
  
const {  handleThemeSwitch
} = useContext(ApplicationContext);


const {fetchCurrentUser, currentUser, companySettings,

  selectedProvider, setSelectedProvider,
  smsSettingsForm, setSmsSettingsForm,
  smsBalance, setSmsBalance,
  showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
        providerSms, setProviderSms} = useApplicationSettings()

  const [user, setUser] = useState(null);
  const [icon, setIcon] = useState()

const {isExpanded, setIsExpanded, isExpanded1, setIsExpanded1 , isExpanded2, setIsExpanded2,
  
  isExpanded3, setIsExpanded3, isExpanded4, setIsExpanded4, isExpanded5, setIsExpanded5,  
   isExpanded6, setIsExpanded6, isExpanded7, setIsExpanded7,


} = useContext(ApplicationContext);
const [companyId, setCompanyId] = useState('')

const {seeSidebar, setSeeSideBar, setPreferDarkMode, preferDarkMode


} = useContext(ApplicationContext); 





const getCompanyId = useCallback(
  async() => {
    
    try {
      const response = await fetch('/api/company_ids', {
        headers: {
          'X-Subdomain': subdomain,
        },
      })
      const newData = await response.json()
      if (response.ok) {
        setCompanyId(newData[0].company_id)
      }
    } catch (error) {
      
    }
  },
  [],
)



useEffect(() => {
  getCompanyId()
  
}, [getCompanyId]);



const handleGetSmsProviderSettings = useCallback(
  async() => {
    


    try {
      const response = await fetch(`/api/sms_provider_settings`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
      });

      const newData = await response.json()
      if (response.ok) {
               setProviderSms(newData[0].sms_provider)

       

      } else {
        if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
        
      }
if (response.status === 401) {
 
   setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/signin'
         }, 1900);
}
       
      }
    } catch (error) {
      console.log(error)
    }
  },
  [],
)


useEffect(() => {
  handleGetSmsProviderSettings()
  
}, [handleGetSmsProviderSettings]);

const subdomain = window.location.hostname.split('.')[0];

  const getSmsBalance  = useCallback(
    async(selectedProvider) => {

      try {
        const response = await fetch(`/api/get_sms_balance?selected_provider=${providerSms}`, {
          headers: {
            'X-Subdomain': subdomain,
          },
        })
        const newData = await response.json()

        if (response.status === 403) {
          // toast.error('acess denied for sms balance', {
          //   duration: 4000,
          //   position: 'top-center',
          // })
        }
        if(response.ok){
setSmsBalance(newData.message)
        }else{
         
            console.log('failed to fetch sms balance')
        }
      } catch (error) {
        console.log('error', error)
      }

    },
    [],
  )

  useEffect(() => {

    if (selectedProvider) {
      getSmsBalance(selectedProvider)
    }
    // getSmsBalance()
   
  }, [getSmsBalance, selectedProvider]);




  const fetchSavedSmsSettings = useCallback(
  async() => {
    
    try {
      const response = await fetch(`/api/saved_sms_settings`, {
        headers: {
          'Content-Type': 'application/json',
          'X-Subdomain': subdomain,
        },
      });
  
      const data = await response.json();

      const newData = data.length > 0 
        ? data.reduce((latest, item) => new Date(item.sms_setting_updated_at) > new Date(latest.sms_setting_updated_at) ? item : latest, data[0])
        : null;
        console.log('newdata updated at', newData)
  
      if (response.ok) {
        console.log('Fetched saved  SMS settings:', newData);
        const { api_key, api_secret, sender_id, short_code, sms_provider, partnerID } = newData;
        // setSmsSettingsForm({ api_key, api_secret, sender_id, short_code, partnerID });
        setSelectedProvider(sms_provider);
        // setSelectedProvider(newData[0].sms_provider);
      } else {

        if (response.status === 402) {
        setTimeout(() => {
          // navigate('/license-expired')
          window.location.href='/license-expired'
         }, 1800);
        
      }
if (response.status === 401) {
 
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
  fetchSavedSmsSettings();
 
}, [fetchSavedSmsSettings]);





  return (
    <div className={`flex  dark:text-white text-black cursor-pointer  w-full  p-10 h-20   
    
    justify-between`}>
      {/* <div className='hidden'>
      <ion-icon  onClick={()=> setSeeSideBar(!seeSidebar)} className='menu-black'  name="menu" size='large'></ion-icon>

      </div> */}


      <div   style={{ cursor: 'pointer',}}  onClick={()=> 
      setSeeSideBar(!seeSidebar)} className='transition-all 
      duration-500    '>
        
      {seeSidebar ?   <FaArrowRightLong className='ml-[60px] fixed w-7 h-7'/>  : <ArrowBackSharpIcon  />}

</div>
<div className="flex items-center justify-between bg-white 
rounded-lg px-4 py-4 border border-gray-300 shadow-sm">
  <div className="flex items-center gap-3">
    <FaIdCard className="text-green-600 h-6 w-6" />
    <div>
      <p className="text-sm text-black">Company ID</p>
      <p className="font-mono text-gray-900">{companyId || 'FFETE' }</p>
    </div>
  </div>
  <button 
    onClick={() => navigator.clipboard.writeText(companyId || 'FFETE')}
    className="text-black hover:text-green-500 transition-colors"
  >
    <FaCopy  className="text-green-600 w-6 h-6"/>
  </button>
</div>



{/* <p> Hello {user}</p> */}
<div  className='flex flex-row gap-x-4 justify-between'>
 
<div className="flex flex-row gap-x-3 items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow">
  {providerSms ? (
    <>
      <div className="p-2 bg-green-100 dark:bg-blue-900 rounded-full">
        <LuBotMessageSquare className="text-green-600 dark:text-blue-300 w-6 h-6" />
      </div>
      <div className="flex-1" id='sms-balance'>
        <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
          SMS Provider: <span className="text-green-600 dark:text-blue-300 font-semibold">{providerSms}</span>
        </p>
        <div className="flex items-center gap-2 mt-1">
          {/* <FiDollarSign className="text-green-500 dark:text-blue-400" /> */}
          KSH
          <span className="text-gray-600 dark:text-gray-300">
            Balance: <span className="font-bold text-green-600 dark:text-blue-300">{smsBalance}</span>
          </span>
        </div>
      </div>
    </>
  ) : (
    <>
      <div  className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
        <FiAlertTriangle className="text-red-500 dark:text-red-400 w-6 h-6" />
      </div>
      <div id='sms-balance' className="flex-1">
        <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
          SMS Provider <span className="text-red-500 dark:text-red-400">Not Configured</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          <FiInfo className="inline mr-1" />
          Please configure SMS settings in admin panel
        </p>
      </div>
    </>
  )}
</div>

<div onClick={()=> setPreferDarkMode(!preferDarkMode)} id='dark-light'>
<div onClick={handleThemeSwitch}>
<ion-icon onClick={()=>setIcon(!icon)}  name={icon ? 'moon-outline' : 'sunny'} size='large'></ion-icon>
</div>
</div>

      <div id='profile' className='profile'>
      <Profile/>

      </div>
        
      </div>
</div>

      
  )
}

export default Header
