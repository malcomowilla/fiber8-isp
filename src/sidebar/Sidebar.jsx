
import { useContext, useCallback, useEffect, useState} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'
import {Link} from  'react-router-dom'
import WifiIcon from '@mui/icons-material/Wifi';
// import RssFeedIcon from '@mui/icons-material/RssFeed';
import RouterIcon from '@mui/icons-material/Router';
import SensorsIcon from '@mui/icons-material/Sensors';
import BarChartIcon from '@mui/icons-material/BarChart';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PaymentsIcon from '@mui/icons-material/Payments';
import CellTowerIcon from '@mui/icons-material/CellTower';
import SignalWifi3BarIcon from '@mui/icons-material/SignalWifi3Bar';
import MessageIcon from '@mui/icons-material/Message';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
// import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import WavesIcon from '@mui/icons-material/Waves';
import Groups2Icon from '@mui/icons-material/Groups2';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import TextsmsSharpIcon from '@mui/icons-material/TextsmsSharp';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import GroupSharpIcon from '@mui/icons-material/GroupSharp';
import WifiSharpIcon from '@mui/icons-material/WifiSharp';
import KeyboardArrowUpSharpIcon from '@mui/icons-material/KeyboardArrowUpSharp';
import KeyboardArrowDownSharpIcon from '@mui/icons-material/KeyboardArrowDownSharp';
import PaymentsSharpIcon from '@mui/icons-material/PaymentsSharp';
import {useApplicationSettings} from '../settings/ApplicationSettings';
import toast,{Toaster} from 'react-hot-toast';
import { LuUsers } from "react-icons/lu";

import { motion, AnimatePresence } from "framer-motion";
import { LuTicketsPlane } from "react-icons/lu";
import { FcOnlineSupport } from "react-icons/fc";
import { FaUpload } from "react-icons/fa6";
import { BsHddNetwork } from "react-icons/bs";
import { LuLayoutTemplate } from "react-icons/lu";
import { MdSettingsInputAntenna } from "react-icons/md";
import { TfiDashboard } from "react-icons/tfi";
import { CgComponents } from "react-icons/cg";
import { TbCloudNetwork } from "react-icons/tb";
import { MdOutlineQueryStats } from "react-icons/md";
import { IoStatsChartOutline } from "react-icons/io5";
import { SiPaloaltonetworks } from "react-icons/si";
import { FaHandshake } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { AiOutlineWhatsApp } from "react-icons/ai";





const Sidebar = () => {


const {isExpanded, setIsExpanded, isExpanded1, setIsExpanded1 , isExpanded2, setIsExpanded2,
  
  isExpanded3, setIsExpanded3, isExpanded4, setIsExpanded4, isExpanded5, setIsExpanded5, seeSidebar, 
  setSeeSideBar, isExpanded6, setIsExpanded6, isExpanded7, setIsExpanded7,


} = useContext(ApplicationContext);

const {companySettings, setCompanySettings} = useApplicationSettings()
  
const {company_name, contact_info, email_info, logo_preview} = companySettings
const [showMenu1, setShowMenu1] = useState(false);

const [showMenu2, setShowMenu2] = useState(false);

const [showMenu3, setShowMenu3] = useState(false);

const [showMenu4, setShowMenu4] = useState(false);

const [showMenu5, setShowMenu5] = useState(false);

const [showMenu6, setShowMenu6] = useState(false);
const [showMenu7, setShowMenu7] = useState(false);
const [showMenu8, setShowMenu8] = useState(false);
const [showMenu9, setShowMenu9] = useState(false);

const [showMenu10, setShowMenu10] = useState(false);
const [showMenu11, setShowMenu11] = useState(false);
const [showMenu12, setShowMenu12] = useState(false);







useEffect(() => {
  const handleResize = () => {
    setSeeSideBar(window.innerWidth < 1080);
  };

  // Call once to set the correct initial state
  handleResize();

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);




const subdomain = window.location.hostname.split('.')[0]; 

const handleGetCompanySettings = useCallback(
   async() => {
     try {
       const response = await fetch('/api/allow_get_company_settings', {
         method: 'GET',
         headers: {
           'X-Subdomain': subdomain,
         },
       })
       const newData = await response.json()
       if (response.ok) {
         // setcompanySettings(newData)
         const { contact_info, company_name, email_info, logo_url,
           customer_support_phone_number,agent_email ,customer_support_email
          } = newData
         setCompanySettings((prevData)=> ({...prevData, 
           contact_info, company_name, email_info,
           customer_support_phone_number,agent_email ,customer_support_email,
         
           logo_preview: logo_url
         }))
 
         console.log('company settings fetched', newData)
       }else{
         console.log('failed to fetch company settings')
       }
     } catch (error) {
       toast.error('internal servere error  while fetching company settings')
     
     }
   },
   [],
 )
 
 useEffect(() => {
   
   handleGetCompanySettings()
   
 }, [handleGetCompanySettings])
 
//  /admin/hotspot-dashboard

  return (


    <>
    

<aside  className={`fixed top-0 left-0 z-50  w-64 h-screen transition-all duration-300 ease-in-out 
  bg-gray-800        mogra-regular shadow-xl   
  lg:block ${seeSidebar ? 'w-[58px]' : 'w-[240px] ml-1'}    
`}aria-label="Sidebar">
   <div className={`h-full px-3 py-4   
      dark:bg-gray-800
   
   
   `}>
   <div className='flex justify-between   text-white'>
{seeSidebar ? (
  <img
  className="h-[28px] w-[28px] rounded-full"
  src={logo_preview || "/images/aitechs.png"}
  alt={company_name || "Aitechs"}
  onError={(e) => { e.target.src = "/images/aitechs.png"; }}
/>
):  <img
  className="h-[80px] w-[80px] rounded-full"
  src={logo_preview || "/images/aitechs.png"}
  alt={company_name || "Aitechs"}
  onError={(e) => { e.target.src = "/images/aitechs.png"; }}
/>}
   
   {/* <img  className='h-[80px] w-[80px] rounded-full'  src={logo_preview || 
   '/images/aitechs.png'}  alt="company-logo" /> */}

   {seeSidebar ? null : <p className='font-extrabold roboto-condensed lg:text-xl'>{company_name || "Aitechs"}</p>}


      {!seeSidebar &&  
        <ArrowBackSharpIcon className='cursor-pointer'
         onClick={()=> {
          setSeeSideBar(!seeSidebar)
          if (!seeSidebar) {
            setIsExpanded(false)
            setIsExpanded2(false)
            setIsExpanded3(false)
            setIsExpanded4(false)
            setIsExpanded5(false)
            setIsExpanded6(false)
            setIsExpanded7(false)

          }
         }}/>
}
   {/* <ion-icon  onClick={()=> setSeeSideBar(!seeSidebar)}  className='menu-black' size='large' name="menu"></ion-icon> */}







   </div>
  




      <ul className="font-extralight roboto-condensed ">
{seeSidebar ? (
   <button 
         
         onMouseEnter={() => {
          setShowMenu1(true)
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
         onClick={()=> setIsExpanded5(!isExpanded5)} type="button" className="flex 
         flex-row mt-[50px]  hover:bg-black  dark:bg-white dark:hover:text-black
          items-center  p-2 text-base  
             text-white  duration-700  rounded-lg group hover:
              dark:text-black " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                     <BarChartIcon />
                     {showMenu1 &&  <ul 
                     onMouseEnter={() => setShowMenu1(true)}
                              onMouseLeave={() => setShowMenu1(false)}

                     className="flex-1 ms-3 
                     
                     text-left rtl:text-right 
                     whitespace-nowrap text-black
                     bg-white shadow-lg rounded-lg
                     ">
                      <p className='text-center'>Dashboard </p>
                     
                       <motion.li
              onClick={() => {
                if (window.innerWidth < 962) {
                  setSeeSideBar(true);
                }
              }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/admin/admin-dashboard"
                  className="flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black
                   hover:bg-gray-700"
                >
                  <ManageAccountsOutlinedIcon />
                  Management
                </Link>
              </motion.li>

              <motion.li
              onClick={() => {
                if (window.innerWidth < 962) {
                  setSeeSideBar(true);
                }
              }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Link
                  to="/admin/analytics"
                  className="flex items-center gap-x-4 w-full 
                  p-2 transition duration-75 rounded-lg pl-11 group text-black
                   hover:bg-gray-700"
                >
                  <img
                    src="/images/icons8-increase.gif"
                    className="rounded-full w-8 h-8"
                    alt="Analytics"
                  />
                  Analytics
                </Link>
              </motion.li>










              <motion.li
              onClick={() => {
                if (window.innerWidth < 962) {
                  setSeeSideBar(true);
                }
              }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Link
                  to="/admin/router-stats"
                  className="flex items-center gap-x-4 w-full p-2 transition 
                  duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700"
                >
                <MdOutlineQueryStats  className='w-6 h-6'/>
                  Routers Stats
                </Link>
              </motion.li>
                     </ul>}
                    


                 

               
            </button>
):  <button 
         
       
         onClick={()=> setIsExpanded5(!isExpanded5)} type="button" className="flex 
         flex-row mt-[50px]  hover:bg-black transition-colors dark:bg-white dark:hover:text-black
          items-center w-full p-2 text-base  
             text-white  duration-700  rounded-lg group hover:
              dark:text-black " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                     <BarChartIcon/>
                     {!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right 
                     whitespace-nowrap">Dashboard</span>}
                  {isExpanded ? (
                     <KeyboardArrowUpSharpIcon/>

                   ):     <>  
                   
                    
                    {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
}

                     </>
}
               
            </button>}

        


         <motion.ul id="dropdown-example"
        className="py-1 space-y-1"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isExpanded5 ? 1 : 0,
          height: isExpanded5 ? "auto" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}>




<AnimatePresence>
          {isExpanded5 && (
            <>
              <motion.li
              onClick={() => {
                if (window.innerWidth < 962) {
                  setSeeSideBar(true);
                }
              }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  to="/admin/admin-dashboard"
                  className="flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white
                   hover:bg-gray-700"
                >
                  <ManageAccountsOutlinedIcon />
                  Management
                </Link>
              </motion.li>

              <motion.li
              onClick={() => {
                if (window.innerWidth < 962) {
                  setSeeSideBar(true);
                }
              }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Link
                  to="/admin/analytics"
                  className="flex items-center gap-x-4 w-full p-2 transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700"
                >
                  <img
                    src="/images/icons8-increase.gif"
                    className="rounded-full w-8 h-8"
                    alt="Analytics"
                  />
                  Analytics
                </Link>
              </motion.li>










              <motion.li
              onClick={() => {
                if (window.innerWidth < 962) {
                  setSeeSideBar(true);
                }
              }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <Link
                  to="/admin/router-stats"
                  className="flex items-center gap-x-4 w-full p-2 transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700"
                >
                <MdOutlineQueryStats  className='w-6 h-6'/>
                  Routers Stats
                </Link>
              </motion.li>
            </>
          )}
        </AnimatePresence>
     
            </motion.ul>




         
        


{seeSidebar ? (
  <button  
   onMouseEnter={() => {
    setShowMenu2(true)
    setShowMenu1(false)
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
    setIsExpanded(false)
   }}
  
  onClick={()=> setIsExpanded(!isExpanded)} type="button" className="flex items-center w-full p-2 
            text-base  dark:hover:bg-white dark:hover:text-black hover:bg-black
                  transition-colors duration-700      
              rounded-lg group 
              dark:text-white  text-white" aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                     <WifiSharpIcon/>
{showMenu2 ? (
<ul 
onMouseLeave={() => setShowMenu2(false)}
className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap 

bg-white shadow-lg rounded-lg text-black
">
  
  <p className='text-center'>PPPoe </p>


<motion.li 
onClick={() => {
  if (window.innerWidth < 962) {
    setSeeSideBar(true);
  }
}}
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.2, delay: 0.1 }}
className="flex items-center  w-full p-2 text-black transition
                      duration-75 rounded-lg  space-x-4 group 
                       ">
                              {/* <WifiIcon className='w-[500px]'/>    */}

<div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
<div className='bg-black rounded-full text-black w-[2.9rem] h-[2.9rem]
 pt-3 text-center font-extrabold shadow-2xl'>
   <p className='text-sm dotted-font text-white' >MBPS</p>
</div>
                     <Link className='' to='/admin/pppoe-packages'>
                       PPOE packages                 
                       </Link>

                       </div>
                  </motion.li>


                  

                  <motion.li 
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.2 }}
                  className="flex items-center w-full p-2 text-black transition
                      duration-75 text-nowrap  space-x-4 group 
                      ">

                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>    
            <img src="/images/icons8-person.gif " className='rounded-full w-10  h-10' alt="" />

                     <Link className='text-wrap' to='/admin/pppoe-subscribers' >                  
                      PPOE subscribers                 
                  </Link>

                  </div>
                  </motion.li>
</ul>

): null}
                    

                   

                   {isExpanded ? (
                     <KeyboardArrowUpSharpIcon/>

                   ):     <>  
                   
                    
                    {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
}

                     </>
}
            </button>
):   <button   onClick={()=> setIsExpanded(!isExpanded)} type="button" className="flex items-center w-full p-2 
            text-base  dark:hover:bg-white dark:hover:text-black hover:bg-black
                  transition-colors duration-700      
              rounded-lg group 
              dark:text-white  text-white" aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                     <WifiSharpIcon/>

{!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap ">PPPoe</span>}
                    

{!seeSidebar && (
  <>
  {isExpanded ? (
                     <KeyboardArrowUpSharpIcon/>

                   ):     <>  
                   
                    
                    {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
}

                     </>
}
  </>
)}
                   

                 
            </button>}
          


            <motion.ul id="dropdown-example"
        className="py-1 space-y-1"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isExpanded ? 1 : 0,
          height: isExpanded ? "auto" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}>


<AnimatePresence>
{isExpanded &&  (
   <>

<motion.li 
onClick={() => {
  if (window.innerWidth < 962) {
    setSeeSideBar(true);
  }
}}
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.2, delay: 0.1 }}
className="flex items-center  w-full p-2 text-white transition
                      duration-75 rounded-lg  space-x-4 group 
                       dark:text-white ">
                              {/* <WifiIcon className='w-[500px]'/>    */}

<div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
<div className='bg-white rounded-full text-black w-[2.9rem] h-[2.9rem] pt-3 text-center font-extrabold'>
   <p className='text-sm dotted-font'>MBPS</p>
</div>
                     <Link className='' to='/admin/pppoe-packages'>
                       PPOE packages                 
                       </Link>

                       </div>
                  </motion.li>


                  

                  <motion.li 
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.2 }}
                  className="flex items-center w-full p-2 text-white transition
                      duration-75 text-nowrap  space-x-4 group 
                       dark:text-white">

                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>    
            <img src="/images/icons8-person.gif " className='rounded-full w-10  h-10' alt="" />

                     <Link className='text-wrap' to='/admin/pppoe-subscribers' >                  
                      PPOE subscribers                 
                  </Link>

                  </div>
                  </motion.li>



                  





                  {/* <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.3 }}
                  className="flex items-center w-full p-2 text-white transition
                      duration-75   space-x-4 group 
                       dark:text-white">
                                 <WifiIcon className='w-6 h-6 text-blue-500'/>   


                     <Link to='/admin/pppoe-subscriptions' >                 
                      PPOE subscriptions                  
                      </Link>
                  </motion.li> */}




                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.3 }}
                  className="flex items-center w-full p-2 text-white transition
                      duration-75   space-x-4 group 
                       dark:text-white">

                        <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                                 <FaUpload className='w-6 h-6 text-yellow-600'/>   


                     <Link to='/admin/upload-subscriber' >                 
                      upload subscribers                  
                      </Link>

                      </div>
                  </motion.li>

                  

   </>
)}

                

                  </AnimatePresence>

            </motion.ul>



{seeSidebar ? (
 <button  
 onMouseEnter={() => {

   setShowMenu3(true)
   setShowMenu4(false)
   setShowMenu2(false)
   setShowMenu5(false)
   setShowMenu6(false)
   setShowMenu7(false)
   setShowMenu8(false)
   setShowMenu9(false)
   setShowMenu10(false)
   setShowMenu11(false)
   setShowMenu12(false)

   
 }}
 type="button" className="flex items-center w-full p-2
          text-base transition-colors duration-700
             text-white  rounded-lg group dark:hover:bg-white dark:hover:text-black
              hover:bg-black
              dark:text-white " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                  <SensorsIcon/>
                

{showMenu3 ? (

            <ul
            
            onMouseLeave={() => {
              setShowMenu3(false)
            
            }}
            id="dropdown-example"
        className="py-1 space-y-1 bg-white shadow-lg rounded-lg"
     >

Network

  
   <motion.li
   onClick={() => {
    if (window.innerWidth < 962) {
      setSeeSideBar(true);
    }
  }}
   initial={{ opacity: 0, x: -20 }}
   animate={{ opacity: 1, x: 0 }}
   exit={{ opacity: 0, x: -20 }}
   transition={{ duration: 0.2 , delay: 0.1 }}
   >

    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                     <Link to='/admin/nodes' className="flex items-center w-full p-2 text-black
                      transition
                      duration-75 rounded-lg  group 
                       dark:text-white  gap-x-3">
                        <img src="/images/icons8-map-pin.gif " className='w-8 h-8 rounded-full' alt="" />
                        <p className='text-black'>Nodes </p></Link>

                        </div>
                  </motion.li>



                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.2 }}
                  >
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                     <Link to='/admin/zones' className="flex items-center w-full p-2 ttext-black
                     transition duration-75 rounded-lg group  
                       gap-x-3">
                              <img src="/images/icons8-map.gif" className='rounded-full h-8 w-8' alt="" />
                        Zones</Link>

                        </div>
                  </motion.li>






               



                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.2 }}
                  >
                    
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                     <Link to='/admin/networks-wireguard-config' className="flex items-center w-full p-2
                      text-black
                     transition duration-75 rounded-lg group  
                       gap-x-3">
                        <div>
                              <img src='/images/wireguard2.png' className='rounded-full h-7 w-7' />
                              </div>
                        wireguard</Link>

                        </div>
                  </motion.li>





                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.2 }}
                  >
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                     <Link to='/admin/ip_networks' className="flex items-center w-full p-2 text-black
                     transition duration-75 rounded-lg group  
                       gap-x-3">
                        <div>
                              <TbCloudNetwork className='rounded-full h-7 w-7' />
                              </div>
                        ip_networks</Link>

</div>
                  </motion.li>







                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.2 }}
                  >
                    
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                     <Link to='/admin/network-components' className="flex items-center w-full p-2
                      text-black
                     transition duration-75 rounded-lg group  
                       gap-x-3">
                        <div>
                              <CgComponents className='rounded-full h-7 w-7' />
                              </div>
                        components</Link>


                        </div>
                  </motion.li>

                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.3 }}
                  >

                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                     <Link  className="flex items-center w-full p-2 text-black
                     transition duration-75 rounded-lg  group 
                        gap-x-3">
                        <img src="/images/icons8-map (1).gif" className='w-8 h-8 rounded-full' alt="" />
                        Map</Link>
                        </div>
                  </motion.li>






                   


                        <motion.li
                        onClick={() => {
                          if (window.innerWidth < 962) {
                            setSeeSideBar(true);
                          }
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 , delay: 0.5 }}
                        >

                          <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                           <Link to='/admin/nas' className="flex items-center w-full p-2 text-black
                     transition duration-75 rounded-lg  group 
                    gap-x-3">
                           <RouterIcon/>
                           Routers
                           </Link>

                           </div>
                        </motion.li>

               




            </ul>
): null}

                   
                    {isExpanded ? (
                     <KeyboardArrowUpSharpIcon/>

                   ):     <>  
                   
                    
                    {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
}

                     </>
}
            </button>
):  <button   onClick={()=> setIsExpanded4(!isExpanded4)} type="button" className="flex items-center w-full p-2
          text-base transition-colors duration-700
             text-white  rounded-lg group dark:hover:bg-white dark:hover:text-black
              hover:bg-black
              dark:text-white " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                  <SensorsIcon/>
                  {!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right
                   whitespace-nowrap ">Network</span>}
                    {isExpanded ? (
                     <KeyboardArrowUpSharpIcon/>

                   ):     <>  
                   
                    
                    {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
}

                     </>
}
            </button>}
        




            <motion.ul id="dropdown-example"
        className="py-1 space-y-1"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isExpanded4 ? 1 : 0,
          height: isExpanded4 ? "auto" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}>


<AnimatePresence>

   {isExpanded4 && (
      <>
   <motion.li
   onClick={() => {
    if (window.innerWidth < 962) {
      setSeeSideBar(true);
    }
  }}
   initial={{ opacity: 0, x: -20 }}
   animate={{ opacity: 1, x: 0 }}
   exit={{ opacity: 0, x: -20 }}
   transition={{ duration: 0.2 , delay: 0.1 }}
   >

    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                     <Link to='/admin/nodes' className="flex items-center w-full p-2 text-white transition
                      duration-75 rounded-lg  group 
                       dark:text-white  gap-x-3">
                        <img src="/images/icons8-map-pin.gif " className='w-8 h-8 rounded-full' alt="" />
                        Nodes</Link>

                        </div>
                  </motion.li>



                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.2 }}
                  >
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                     <Link to='/admin/zones' className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg group  dark:text-white
                       gap-x-3">
                              <img src="/images/icons8-map.gif" className='rounded-full h-8 w-8' alt="" />
                        Zones</Link>

                        </div>
                  </motion.li>






               



                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.2 }}
                  >
                    
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                     <Link to='/admin/networks-wireguard-config' className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg group  dark:text-white
                       gap-x-3">
                        <div>
                              <img src='/images/wireguard2.png' className='rounded-full h-7 w-7' />
                              </div>
                        wireguard</Link>

                        </div>
                  </motion.li>





                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.2 }}
                  >
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                     <Link to='/admin/ip_networks' className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg group  dark:text-white
                       gap-x-3">
                        <div>
                              <TbCloudNetwork className='rounded-full h-7 w-7' />
                              </div>
                        ip_networks</Link>

</div>
                  </motion.li>







                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.2 }}
                  >
                    
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                     <Link to='/admin/network-components' className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg group  dark:text-white
                       gap-x-3">
                        <div>
                              <CgComponents className='rounded-full h-7 w-7' />
                              </div>
                        components</Link>


                        </div>
                  </motion.li>

                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.3 }}
                  >

                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                     <Link  className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg  group 
                      dark:text-white  gap-x-3">
                        <img src="/images/icons8-map (1).gif" className='w-8 h-8 rounded-full' alt="" />
                        Map</Link>
                        </div>
                  </motion.li>



                  {/* <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.3 }}
                  className="flex items-center w-full p-2 text-white transition
                      duration-75   space-x-4 group 
                       dark:text-white">
                                 <BsHddNetwork className='w-6 h-6 text-red-500'/>   


                     <Link to='/admin/ip-pool-table' >                 
                      ip pool               
                      </Link>
                  </motion.li> */}



                   


                        <motion.li
                        onClick={() => {
                          if (window.innerWidth < 962) {
                            setSeeSideBar(true);
                          }
                        }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 , delay: 0.5 }}
                        >

                          <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                           <Link to='/admin/nas' className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg  group 
                      dark:text-white  gap-x-3">
                           <RouterIcon/>
                           Routers
                           </Link>

                           </div>
                        </motion.li>

      </>
   )}
               



                        </AnimatePresence>

            </motion.ul>





            

         
         <li>

{!seeSidebar ? (
<button   onClick={()=> setIsExpanded1(!isExpanded1)} type="button" className="flex items-center w-full p-2 text-base
              transition duration-75 rounded-lg group dark:hover:bg-white dark:hover:text-black hover:bg-black
              dark:text-white text-white " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                     <PaymentsIcon/>
                     {!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right
                      whitespace-nowrap">Payments</span>}

                  
                    {isExpanded ? (
                     <KeyboardArrowUpSharpIcon/>

                   ):     <>  
                   
                    
                    {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
}

                     </>
}
            </button>
): <button   onClick={()=> setIsExpanded1(!isExpanded1)} type="button" className="flex items-center w-full p-2 text-base
              transition duration-75 rounded-lg group dark:hover:bg-white dark:hover:text-black hover:bg-black
              dark:text-white text-white " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                     <PaymentsIcon/>
                     {!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right
                      whitespace-nowrap">Payments</span>}

                  
                    {isExpanded ? (
                     <KeyboardArrowUpSharpIcon/>

                   ):     <>  
                   
                    
                    {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
}

                     </>
}
            </button>}
         

            <motion.ul id="dropdown-example"
        className="py-1 space-y-1"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isExpanded1 ? 1 : 0,
          height: isExpanded1 ? "auto" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}>


<AnimatePresence>
{isExpanded1 && (
   <>

<motion.li
onClick={() => {
  if (window.innerWidth < 962) {
    setSeeSideBar(true);
  }
}}
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
exit={{ opacity: 0, x: -20 }}
transition={{ duration: 0.2, delay: 0.1 }}
>
                     <Link   to='/admin/fixed-payments'  className="flex items-center w-full p-2 text-white transition
                      duration-75 rounded-lg  group gap-x-3
                       dark:text-white ">
                        <PaymentIcon />
                         PPOE payments  
                       </Link>
                  </motion.li>




                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2, delay: 0.2 }}
                  >
                     <Link to='/admin/hotspot-payments'  className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg  group text-nowrap dark:text-white gap-x-3
                      ">
                         <PaymentsSharpIcon/>
                      Hotspot Payments                  
                      </Link>
                      </motion.li>
   </>
)}
                
                      
                      </AnimatePresence>
                 
            </motion.ul>
         </li>







         <li>
          {seeSidebar ? (
 <button 
 onMouseEnter={() => {
  setShowMenu2(false)
  setShowMenu3(false)
  setShowMenu1(false)
  setShowMenu4(false)
  setShowMenu5(true)
  setShowMenu6(false)
  setShowMenu7(false)
  setShowMenu8(false)
  setShowMenu9(false)
  setShowMenu10(false)
  setShowMenu11(false)  
  setShowMenu12(false)
 }}
 onClick={()=> setIsExpanded2(!isExpanded2)} type="button" className="flex 
         items-center w-full
          p-2 text-base
             text-white transition duration-75 rounded-lg group dark:hover:bg-white
              dark:hover:text-black
              hover:bg-black
              dark:text-white  " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                              <CellTowerIcon/> 

{showMenu5 ? (
  <ul 
  
  onMouseLeave={() => {
    setShowMenu5(false)
  }}
  className="flex-1 ms-3 text-left rtl:text-right 
                              whitespace-nowrap bg-white shadow-lg rounded-lg">Comunication
                              
                              <motion.li
 onClick={() => {
  if (window.innerWidth < 962) {
    setSeeSideBar(true);
  }
}}
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
  transition={{ duration: 0.2, delay: 0.1 }}
 className="flex items-center w-full p-2 gap-x-4  transition
                      duration-75 rounded-lg pl-11 group 
                       text-black cursor-pointer "> 
                       <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                       <MailOutlineIcon />
                   Email

                   </div>
                  </motion.li>

                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.2 }}
                  className="flex items-center w-full p-2 text-black
                     transition duration-75 rounded-lg pl-11 group cursor-pointer 
                       gap-x-4
                      " >

                        <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black
                   hover:bg-gray-700'>
                        <TextsmsSharpIcon/>
                    <Link to='/admin/send-sms' >SMS</Link>

                    </div>
                  </motion.li>



                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.2 }}
                  className="flex items-center w-full p-2 text-black
                     transition duration-75 rounded-lg pl-11 group cursor-pointer 
                     gap-x-4
                      " >
                        <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                        <TextsmsSharpIcon/>
                    <Link to='/admin/messages' >Messages</Link>
                    </div>
                  </motion.li>

                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.2 }}
                  className="flex items-center w-full p-2 textblack
                     transition duration-75 rounded-lg pl-11 group   gap-x-4
                      " >
                        <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                        <TextsmsSharpIcon/>
                    <Link to='/admin/bulk-messages' >Bulk</Link>  
                    </div>
                  </motion.li>

                  <motion.li 
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }} 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2, delay: 0.3 }}
                  className="flex items-center w-full p-2 text-black
                     transition duration-75 rounded-lg pl-11 group gap-x-4
                      dark:text-white ">

                        <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                      
                      <AiOutlineWhatsApp className='w-6 h-6' />
                     <p className='text-black'>Whatsap</p>

                     </div>
                  </motion.li> 
                              </ul>
): null}
                            

            </button>
          ):  <button   onClick={()=> setIsExpanded2(!isExpanded2)} type="button" className="flex 
         items-center w-full
          p-2 text-base
             text-white transition duration-75 rounded-lg group dark:hover:bg-white
              dark:hover:text-black
              hover:bg-black
              dark:text-white  " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                              <CellTowerIcon/> 
                              {!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right 
                              whitespace-nowrap">Comunication</span>}

                    {isExpanded ? (
                     <KeyboardArrowUpSharpIcon/>

                   ):     <>  
                   
                    
                    {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
}

                     </>
}
            </button>}
        
            <motion.ul
            
            id="dropdown-example"
        className="py-1 space-y-1"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isExpanded2 ? 1 : 0,
          height: isExpanded2 ? "auto" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}>



<AnimatePresence>
   {isExpanded2 && (
      <>
 <motion.li
 onClick={() => {
  if (window.innerWidth < 962) {
    setSeeSideBar(true);
  }
}}
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -20 }}
  transition={{ duration: 0.2, delay: 0.1 }}
 className="flex items-center w-full p-2 gap-x-4 text-white transition
                      duration-75 rounded-lg pl-11 group 
                       dark:text-white cursor-pointer "> 
                       <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                       <MailOutlineIcon />
                   Email

                   </div>
                  </motion.li>

                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.2 }}
                  className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg pl-11 group cursor-pointer  dark:text-white gap-x-4
                      " >

                        <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                        <TextsmsSharpIcon/>
                    <Link to='/admin/send-sms' >SMS</Link>

                    </div>
                  </motion.li>



                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.2 }}
                  className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg pl-11 group cursor-pointer  dark:text-white gap-x-4
                      " >
                        <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                        <TextsmsSharpIcon/>
                    <Link to='/admin/messages' >Messages</Link>
                    </div>
                  </motion.li>

                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.2 }}
                  className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg pl-11 group  dark:text-white gap-x-4
                      " >
                        <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                        <TextsmsSharpIcon/>
                    <Link to='/admin/bulk-messages' >Bulk</Link>  
                    </div>
                  </motion.li>

                  <motion.li 
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }} 
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2, delay: 0.3 }}
                  className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg pl-11 group gap-x-4
                      dark:text-white ">

                        <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                        <img src="/images/logo-whatsapp.svg" className='sm:w-[30px] max-sm:w-[30px]' alt="" />
                     Whatsap

                     </div>
                  </motion.li>

      </>
   )}
                 

                  </AnimatePresence>
            </motion.ul>
         </li>
         <li>



{seeSidebar ? (

 <button  
 onMouseEnter={() => {
   setShowMenu7(false)
   setShowMenu8(false)
   setShowMenu9(false)
   setShowMenu10(false)
   setShowMenu11(false)
   setShowMenu12(false)
   setShowMenu6(true)
   setShowMenu5(false)
   setShowMenu4(false)
   setShowMenu3(false)
   setShowMenu2(false)
    setShowMenu1(false)



 }}
 onClick={()=> setIsExpanded3(!isExpanded3)} type="button" className="flex items-center w-full p-2
  text-base
             text-white transition duration-75 rounded-lg group 
              dark:text-white dark:hover:bg-white dark:hover:text-black hover:bg-black "
               aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                   <SignalWifi3BarIcon/>
                   
                   {showMenu6 ? (
 <ul 
 onMouseLeave={() => {
  setShowMenu6(false)
 
  
 }}
 className="flex-1 ms-3 text-left rtl:text-right
                    bg-white shadow-lg">Hotspot Bundle
                    
                    

<motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.1 }}
                  >
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-6 group text-black hover:bg-gray-700'>
                     <Link  to='/admin/hotspot-dashboard' className="flex items-center w-full p-2
                      text-black transition
                      duration-75 rounded-lg  group gap-x-3 text-nowrap 
                       "> 
                        <IoStatsChartOutline className='text-black '/>
                      Hotspot  Dashboard</Link>
                      </div>
                  </motion.li>


                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.1 }}
                  >
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-6 group text-black hover:bg-gray-700'>
                     <Link  to='/admin/hotspot-package' className="flex items-center w-full p-2
                      text-black transition
                      duration-75 rounded-lg  group gap-x-3 text-nowrap 
                       dark:text-white "> 
                        <SiPaloaltonetworks className='text-black'/>
                      Hotspot  Package</Link>
                      </div>
                  </motion.li>




<motion.li
onClick={() => {
  if (window.innerWidth < 962) {
    setSeeSideBar(true);
  }
}}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 transition={{ duration: 0.2 , delay: 0.1 }}
>

<div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-6 group text-black hover:bg-gray-700'>
<Link  to='/admin/hotspot-templates' className="flex items-center w-full p-2 text-black transition
                      duration-75 rounded-lg  group gap-x-3 text-nowrap 
                       "> 
                        <LuLayoutTemplate/>
                      Hotspot  Templates</Link>
</div>
  </motion.li>




                  <motion.li 
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.3 }}
                  >
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-6 group text-black hover:bg-gray-700'>
                     <Link to='/admin/hotspot-subscriptions' className="flex items-center w-full p-2
                      text-black
                     transition duration-75 rounded-lg group 
                     gap-x-3  ">
                        🎫
                      Vouchers</Link>
                      </div>
                  </motion.li>





                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.4 }}
                  >
                     <Link to='/admin/hotspot_anlytics'  className="flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-6 group text-black hover:bg-gray-700  ">
                        <WifiIcon/>
                        Hotspot     Overview</Link>
                  </ motion.li>



                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.4 }}
                  >
                     <Link to='/admin/hotspot_settings'  className="flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-6 group text-black hover:bg-gray-700">
                        <MdSettingsInputAntenna/>
                        Settings</Link>
                  </ motion.li>
                    
                    </ul>
                   ): null}
                  



                  
            </button>

):  <button   onClick={()=> setIsExpanded3(!isExpanded3)} type="button" className="flex items-center w-full p-2 text-base
             text-white transition duration-75 rounded-lg group 
              dark:text-white dark:hover:bg-white dark:hover:text-black hover:bg-black " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                   <SignalWifi3BarIcon/>
                   {!seeSidebar && <span className="flex-1 ms-3 text-left rtl:text-right
                    whitespace-nowrap">Hotspot Bundle</span>}
                     {isExpanded ? (
                     <KeyboardArrowUpSharpIcon/>

                   ):     <>  
                   
                    
                    {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
}

                     </>
}
            </button>
}




            <motion.ul id="dropdown-example"
            
            className={`py-1 space-y-1 `}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isExpanded3 ? 1 : 0,
          height: isExpanded3 ? "auto" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}>
<AnimatePresence>

{isExpanded3 && (
   <>






<motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.1 }}
                  >
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-6 group text-white hover:bg-gray-700'>
                     <Link  to='/admin/hotspot-dashboard' className="flex items-center w-full p-2
                      text-white transition
                      duration-75 rounded-lg  group gap-x-3 text-nowrap 
                       dark:text-white "> 
                        <IoStatsChartOutline className='text-white '/>
                      Hotspot  Dashboard</Link>
                      </div>
                  </motion.li>


                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.1 }}
                  >
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-6 group text-white hover:bg-gray-700'>
                     <Link  to='/admin/hotspot-package' className="flex items-center w-full p-2 text-white transition
                      duration-75 rounded-lg  group gap-x-3 text-nowrap 
                       dark:text-white "> 
                        <SiPaloaltonetworks className='text-white'/>
                      Hotspot  Package</Link>
                      </div>
                  </motion.li>




<motion.li
onClick={() => {
  if (window.innerWidth < 962) {
    setSeeSideBar(true);
  }
}}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 transition={{ duration: 0.2 , delay: 0.1 }}
>

<div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-6 group text-white hover:bg-gray-700'>
<Link  to='/admin/hotspot-templates' className="flex items-center w-full p-2 text-white transition
                      duration-75 rounded-lg  group gap-x-3 text-nowrap 
                       dark:text-white "> 
                        <LuLayoutTemplate/>
                      Hotspot  Templates</Link>
</div>
  </motion.li>


{/* 
                  <motion.li 
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.2 }}
                  className="flex  w-full p-2 text-white
                     transition duration-75  rounded-lg  group  gap-x-3  dark:text-white
                      ">
                        <Groups2Icon/>
                        Hotspot  Subscribers
                  </motion.li> */}



                  <motion.li 
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 , delay: 0.3 }}
                  >
                    <div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-6 group text-white hover:bg-gray-700'>
                     <Link to='/admin/hotspot-subscriptions' className="flex items-center w-full p-2 text-white 
                     transition duration-75 rounded-lg group 
                      dark:text-white gap-x-3  ">
                        🎫
                      Vouchers</Link>
                      </div>
                  </motion.li>





                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.4 }}
                  >
                     <Link to='/admin/hotspot_anlytics'  className="flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-6 group text-white hover:bg-gray-700  ">
                        <WifiIcon/>
                        Hotspot     Overview</Link>
                  </ motion.li>



                  <motion.li
                  onClick={() => {
                    if (window.innerWidth < 962) {
                      setSeeSideBar(true);
                    }
                  }}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.4 }}
                  >
                     <Link to='/admin/hotspot_settings'  className="flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-6 group text-white hover:bg-gray-700">
                        <MdSettingsInputAntenna/>
                        Settings</Link>
                  </ motion.li>

                 

                 

   </>
) }

</AnimatePresence>

            </motion.ul>
         </li>



      

{seeSidebar ? (

 <li  
 
 onMouseEnter={()=> {
  setShowMenu8(false)
  setShowMenu9(false)
  setShowMenu10(false)
  setShowMenu11(false)
  setShowMenu12(false)
  setShowMenu7(true)
  setShowMenu6(false)
  setShowMenu5(false)
  setShowMenu4(false)
  setShowMenu3(false)
  setShowMenu2(false)
  setShowMenu1(false)

 }}
 onClick={()=> setIsExpanded6(!isExpanded6)} type="button" className="flex items-center p-2 text-white
             rounded-lg dark:text-white hover:cursor-pointer group
             dark:hover:bg-white dark:hover:text-black hover:bg-black"
               aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
   <FcOnlineSupport className='w-5 h-5'/>


{showMenu7 ? (
<ul 
onMouseLeave={() => {
  setShowMenu7(false)
}}
className="flex-1 ms-3 text-left rtl:text-right
                   whitespace-nowrap bg-white text-black shadow-lg rounded-lg ">
                    
                    <p className='text-center'>Support </p>
                   
                   <li  
                  
                   
                   onClick={()=> setIsExpanded6(!isExpanded6)} type="button" className="flex
                    items-center p-2 text-white
             rounded-lg dark:text-white hover:cursor-pointer group
             dark:hover:bg-white dark:hover:text-black hover:bg-black"
               aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
   {/* < FcOnlineSupport className='w-5 h-5'/> */}

{!seeSidebar &&    <span className="flex-1 ms-3 text-left rtl:text-right
                   whitespace-nowrap">Support</span>}
                 
            </li>



<motion.li 
onClick={() => {
  if (window.innerWidth < 962) {
    setSeeSideBar(true);
  }
}}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.1 }}
                  className='  space-x-2 
                   text-white  rounded-lg p-2 ms-3 text-lg font-medium' >
                  {/* <ion-icon name="logo-twitch" ></ion-icon> */}


<div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                     <Link to='/admin/customer-tickets' className='flex items-center gap-x-2
                      text-black'>
                     <LuTicketsPlane className='w-5 h-5 text-red-600'/>

                     Tickets
                     </Link>
                     </div>
                  </motion.li>
                   </ul>
): null}
      
            </li>




):  <li   onClick={()=> setIsExpanded6(!isExpanded6)} type="button" className="flex items-center p-2 text-white
             rounded-lg dark:text-white hover:cursor-pointer group
             dark:hover:bg-white dark:hover:text-black hover:bg-black"
               aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                {!seeSidebar &&    < FcOnlineSupport className='w-5 h-5'/>
}

{!seeSidebar &&    <span className="flex-1 ms-3 text-left rtl:text-right
                   whitespace-nowrap">Support</span>}

                 {isExpanded ? (
                     <KeyboardArrowUpSharpIcon/>

                   ):     <>  
                   
                    
                    {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
}

                     </>
}
                   
                
                 
            </li>}

        

               <motion.ul   
              id="dropdown-example"
            
              className={`py-1 space-y-1 `}
          initial={{ opacity: 0, height: 0 }}
          animate={{
            opacity: isExpanded6 ? 1 : 0,
            height: isExpanded6 ? "60px" : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}  
             >


<AnimatePresence>
              {isExpanded6 && (
                <>

<motion.li 
onClick={() => {
  if (window.innerWidth < 962) {
    setSeeSideBar(true);
  }
}}
                   initial={{ opacity: 0, x: -20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   transition={{ duration: 0.2 , delay: 0.1 }}
                  className='  space-x-2 
                   text-white  rounded-lg p-2 ms-3 text-lg font-medium' >
                  {/* <ion-icon name="logo-twitch" ></ion-icon> */}


<div className='flex items-center gap-x-4 w-full p-2 
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                     <Link to='/admin/customer-tickets' className='flex items-center gap-x-2 text-white'>
                     <LuTicketsPlane className='w-5 h-5 text-red-600'/>

                     Tickets
                     </Link>
                     </div>
                  </motion.li>











                  
                </>
              )}

</AnimatePresence>

                 
               </motion.ul>

        
{seeSidebar ? (
    <li  
    
    onMouseEnter={() => {
      setShowMenu12(false)
      setShowMenu11(false)
       setShowMenu10(false)
      setShowMenu9(false)
      setShowMenu8(true)
      setShowMenu7(false)
      setShowMenu6(false)
      setShowMenu5(false)
      setShowMenu4(false)
       setShowMenu3(false)
        setShowMenu2(false)
         setShowMenu1(false)



    }}
    className="flex items-center p-2 text-white
             rounded-lg dark:text-white hover:cursor-pointer group
             dark:hover:bg-white dark:hover:text-black hover:bg-black" onClick={()=> setIsExpanded7(!isExpanded7)}>
            
               <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75
                 group-hover:dark:text-black  " 
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 
                  9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 
                  0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 
                  0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
               </svg>
               {showMenu8 ? (
                <ul
                onMouseLeave={() => {
                  setShowMenu8(false)
                }}
                className="flex-1 ms-3 whitespace-nowrap
                bg-white rounded-lg shadow-lg
                ">
                  
                  <p className='text-black text-center'>Users </p>
                
<motion.li 
onClick={() => {
  if (window.innerWidth < 962) {
    setSeeSideBar(true);
  }
}}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 transition={{ duration: 0.2, delay: 0.1 }}
className=' rounded-lg  space-x-2  text-white p-2 flex'>

  <div className='flex items-center gap-x-4 w-full p-2 cursor-pointer
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
<img src="/images/icons8-male-user.gif" className='rounded-full w-8 h-8' alt="user" />
     <Link to='/admin/user t'> User </Link>

</div>
      </motion.li>


      <motion.li
      onClick={() => {
        if (window.innerWidth < 962) {
          setSeeSideBar(true);
        }
      }}
       initial={{ opacity: 0, x: -20 }}
       animate={{ opacity: 1, x: 0 }}
       exit={{ opacity: 0, x: -20 }}
       transition={{ duration: 0.2, delay: 0.2 }}
      className=' rounded-lg  text-white  space-x-3  p-2 flex'>

        <div className='flex items-center gap-x-4 w-full p-2  cursor-pointer
                  transition duration-75 rounded-lg pl-11 group text-black hover:bg-gray-700'>
                    <Link to='/admin/user-group'>
                    <LuUsers className='w-6 h-6' />
      </Link>

   <Link to='/admin/user-group'>
      User Group
      </Link>
      </div>

       </motion.li>
                
                </ul>

               ): null}
              
                 {isExpanded ? (
                     <KeyboardArrowUpSharpIcon/>

                   ):     <>  
                   
                    
                    {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
}

                     </>
}
            
         </li>
):   <li    className="flex items-center p-2 text-white
             rounded-lg dark:text-white hover:cursor-pointer group
             dark:hover:bg-white dark:hover:text-black hover:bg-black" onClick={()=> setIsExpanded7(!isExpanded7)}>
            
               <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75
                 group-hover:dark:text-black  " 
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 
                  9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 
                  0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 
                  0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
               </svg>
               {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap ">Users</span>}
                 {isExpanded ? (
                     <KeyboardArrowUpSharpIcon/>

                   ):     <>  
                   
                    
                    {!seeSidebar &&   < KeyboardArrowDownSharpIcon/>
}

                     </>
}
            
         </li>}

       


<motion.ul   id="dropdown-example"
        className="py-1 space-y-1"
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isExpanded7 ? 1 : 0,
          height: isExpanded7 ? "auto" : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }} >
  


      <AnimatePresence>
{isExpanded7 && (
   <>

<motion.li 
onClick={() => {
  if (window.innerWidth < 962) {
    setSeeSideBar(true);
  }
}}
 initial={{ opacity: 0, x: -20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -20 }}
 transition={{ duration: 0.2, delay: 0.1 }}
className=' rounded-lg  space-x-2  text-white p-2 flex'>

  <div className='flex items-center gap-x-4 w-full p-2 cursor-pointer
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
<img src="/images/icons8-male-user.gif" className='rounded-full w-8 h-8' alt="user" />
     <Link to='/admin/user'> User </Link>

</div>
      </motion.li>


      <motion.li
      onClick={() => {
        if (window.innerWidth < 962) {
          setSeeSideBar(true);
        }
      }}
       initial={{ opacity: 0, x: -20 }}
       animate={{ opacity: 1, x: 0 }}
       exit={{ opacity: 0, x: -20 }}
       transition={{ duration: 0.2, delay: 0.2 }}
      className=' rounded-lg  text-white  space-x-3  p-2 flex'>

        <div className='flex items-center gap-x-4 w-full p-2  cursor-pointer
                  transition duration-75 rounded-lg pl-11 group text-white hover:bg-gray-700'>
                    <Link to='/admin/user-group'>
      <img src="/images/icons8-people.gif" className='rounded-full w-8 h-8' alt="" />
      </Link>

   <Link to='/admin/user-group'>
      User Group
      </Link>
      </div>

       </motion.li>
   </>
)}
  
       </AnimatePresence>

</motion.ul>


        
{seeSidebar ? (
 <li  className="flex items-center p-2 text-white rounded-lg
             dark:text-white hover:cursor-pointer translate-y-[-1.4rem]
              dark:hover:bg-white dark:hover:text-black hover:bg-black  group">
           
           <ReceiptIcon/>
               {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap">Invoices</span>}

               <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            
         </li>
):  <li  className="flex items-center p-2 text-white rounded-lg
             dark:text-white hover:cursor-pointer translate-y-[-1.4rem]
              dark:hover:bg-white dark:hover:text-black hover:bg-black  group">
           
           <ReceiptIcon/>
               {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap">Invoices</span>}

               <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            
         </li>}
        
         


{seeSidebar ? (
    <li
    onMouseEnter={() => {
      setShowMenu10(true)
      setShowMenu11(false)
      setShowMenu12(false)
      setShowMenu9(false)
      setShowMenu8(false)
      setShowMenu7(false)
      setShowMenu6(false)
      setShowMenu5(false)
      setShowMenu4(false)
      setShowMenu3(false)
      setShowMenu2(false)
      setShowMenu1(false)
    }}
         onClick={() => {
          if (window.innerWidth < 962) {
            setSeeSideBar(true);
          }
        }}
         className='dark:hover:bg-white  p-2  flex items-center 
             text-white rounded-lg dark:text-white   group dark:hover:text-black
             
             cuursor-pointer
             hover:bg-black'>


            <Link  to='/admin/client-leads' className='flex ' >
                  <FaHandshake className='w-6 h-6'/>
                  {showMenu10 && <span 
                  onMouseLeave={()=> {
                    setShowMenu10(false)
                  }}
                  className="flex-1 ms-3 whitespace-nowrap bg-white rounded-lg *:
                  text-black px-2 py-[-2px]
                  ">Leads</span>}
            </Link>
         </li>


):   <li

         onClick={() => {
          if (window.innerWidth < 962) {
            setSeeSideBar(true);
          }
        }}
         className='dark:hover:bg-white  p-2  flex items-center 
             text-white rounded-lg dark:text-white   group dark:hover:text-black
             
             cuursor-pointer
             hover:bg-black'>


            <Link  to='/admin/client-leads' className='flex ' >
                  <FaHandshake className='w-6 h-6'/>
                  {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap">Leads</span>}
            </Link>
         </li>

}
       

{seeSidebar ? (
 
  <li

onMouseEnter={() => {
      setShowMenu9(false)
      setShowMenu10(false)
      setShowMenu11(true)
      setShowMenu12(false)
      setShowMenu9(false)
      setShowMenu8(false)
      setShowMenu7(false)
      setShowMenu6(false)
      setShowMenu5(false)
      setShowMenu4(false)
      setShowMenu3(false)
      setShowMenu2(false)
      setShowMenu1(false)
    }}
         onClick={() => {
          if (window.innerWidth < 962) {
            setSeeSideBar(true);
          }
        }}
         className='dark:hover:bg-white  p-2  flex items-center 
             text-white rounded-lg dark:text-white   group dark:hover:text-black
             
             cuursor-pointer
             hover:bg-black'>


            <Link  to='/admin/scheduler' className='flex ' >
                  <FaRegCalendarAlt  className='w-6 h-6'/>
                   {showMenu11 && <span 
                  onMouseLeave={()=> {
                    setShowMenu11(false)
                  }}
                  className="flex-1 ms-3 whitespace-nowrap bg-white rounded-lg *:
                  text-black px-2 py-[-2px]
                  ">Events</span>}
            </Link>
         </li>
):  <li
         onClick={() => {
          if (window.innerWidth < 962) {
            setSeeSideBar(true);
          }
        }}
         className='dark:hover:bg-white  p-2  flex items-center 
             text-white rounded-lg dark:text-white   group dark:hover:text-black
             
             cuursor-pointer
             hover:bg-black'>


            <Link  to='/admin/scheduler' className='flex ' >
                  <FaRegCalendarAlt  className='w-6 h-6'/>
                  {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap">Scheduler</span>}
            </Link>
         </li>}
 


{seeSidebar ? (
<li

onMouseEnter={() => {
      setShowMenu9(false)
      setShowMenu10(false)
      setShowMenu11(false)
      setShowMenu12(true)
      setShowMenu9(false)
      setShowMenu8(false)
      setShowMenu7(false)
      setShowMenu6(false)
      setShowMenu5(false)
      setShowMenu4(false)
      setShowMenu3(false)
      setShowMenu2(false)
      setShowMenu1(false)
    }}
         onClick={() => {
          if (window.innerWidth < 962) {
            setSeeSideBar(true);
          }
        }}
         className='dark:hover:bg-white  p-2  flex items-center 
             text-white rounded-lg dark:text-white   group dark:hover:text-black hover:bg-black'>
            <Link  to='/admin/settings' >
                  <PermDataSettingIcon/>
                   {showMenu12 && <span 
                  onMouseLeave={()=> {
                    setShowMenu12(false)
                  }}
                  className="flex-1 ms-3 whitespace-nowrap bg-white rounded-lg *:
                  text-black px-2 py-[-2px]
                  ">Settings</span>}
            </Link>
         </li>
): <li
         onClick={() => {
          if (window.innerWidth < 962) {
            setSeeSideBar(true);
          }
        }}
         className='dark:hover:bg-white  p-2  flex items-center 
             text-white rounded-lg dark:text-white   group dark:hover:text-black hover:bg-black'>
            <Link  to='/admin/settings' >
                  <PermDataSettingIcon/>
                  {!seeSidebar && <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>}
            </Link>
         </li>}
         
      </ul>
   </div>
</aside>


    </>

  )
}

export default Sidebar
