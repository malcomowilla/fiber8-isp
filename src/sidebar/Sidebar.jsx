
import { useContext, useCallback, useEffect} from 'react'
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
const Sidebar = () => {


const {isExpanded, setIsExpanded, isExpanded1, setIsExpanded1 , isExpanded2, setIsExpanded2,
  
  isExpanded3, setIsExpanded3, isExpanded4, setIsExpanded4, isExpanded5, setIsExpanded5, seeSidebar, 
  setSeeSideBar, isExpanded6, setIsExpanded6, isExpanded7, setIsExpanded7,


} = useContext(ApplicationContext);

const {companySettings, setCompanySettings} = useApplicationSettings()
  
const {company_name, contact_info, email_info, logo_preview} = companySettings





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
   [setCompanySettings],
 )
 
 useEffect(() => {
   
   handleGetCompanySettings()
   
 }, [handleGetCompanySettings])
 
 

  return (


    <>
    

<aside  className={`fixed top-0 left-0 z-50  w-64 h-screen transition-all duration-300 ease-in-out 
  bg-gray-800    sm:bg-gray-800   mogra-regular shadow-xl   lg:block ${seeSidebar ? 'w-[0rem] opacity-0 ' : 'w-[250px] '}    
`}aria-label="Sidebar">
   <div className={`h-full px-3 py-4   overflow-y-hidden
      dark:bg-gray-800
   
   
   `}>
   <div className='flex justify-between   text-white'>
   <img  className='h-[80px] w-[80px] rounded-full'  src={logo_preview} alt="fiber8-logo" />
      <p className='font-extrabold dotted-font lg:text-xl'>{company_name}</p>
      <ArrowBackSharpIcon onClick={()=> setSeeSideBar(!seeSidebar)}/>
   {/* <ion-icon  onClick={()=> setSeeSideBar(!seeSidebar)}  className='menu-black' size='large' name="menu"></ion-icon> */}


   </div>
  

      <ul className="space-y-2 font-extralight">


         <button   onClick={()=> setIsExpanded5(!isExpanded5)} type="button" className="flex 
         flex-row mt-[50px]  hover:bg-black transition-colors dark:bg-white dark:hover:text-black
          items-center w-full p-2 text-base  
             text-white  duration-700  rounded-lg group hover:
              dark:text-black " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                     <BarChartIcon/>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap ">Dashboard</span>
                  {isExpanded5 ?     < KeyboardArrowUpSharpIcon/> : 
                  
                  
                 < KeyboardArrowDownSharpIcon/>
                  }
               
            </button>


         <ul id="dropdown-example" className={` transition-colors  duration-700 ease-in-out   py-1 space-y-1
            
            
            ${isExpanded5 ? 'max-h-[200px] opacity-[1]  overflow-hidden' : 'max-h-2     overflow-hidden '}
            
            `}>




                <li>
                     <Link to='/admin/admin-dashboard' className="flex items-center gap-x-4 w-full p-2  transition
                      duration-75 rounded-lg pl-11 group 
                       dark:text-white text-white space-x-2"> 
                          <ManageAccountsOutlinedIcon/>
                        Management
                        </Link>
                  </li>
                 
                 


                <li>
                     <Link to='/admin/analytics' className="flex items-center  gap-x-4  w-full p-2  transition
                      duration-75 rounded-lg pl-11 group 
                       dark:text-white text-white space-x-2"> 
                       <img src="/images/icons8-increase.gif" className='rounded-full w-8 h-8' alt="" />
                        Analytics
                       </Link>
                  </li>



                  
            </ul>




         
        



            <button   onClick={()=> setIsExpanded(!isExpanded)} type="button" className="flex items-center w-full p-2 
            text-base  dark:hover:bg-white dark:hover:text-black hover:bg-black
                  transition-colors duration-700      
              rounded-lg group 
              dark:text-white  text-white" aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                     <WifiSharpIcon/>
                     <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap ">PPPoe</span>
                     {isExpanded ?     < KeyboardArrowUpSharpIcon/> : 
                  
                  
                  < KeyboardArrowDownSharpIcon/>
                   }
            </button>


            <ul id="dropdown-example" className={` transition-all py-1 space-y-1  duration-700 ease-in-out   overflow-hidden
            
            
            ${isExpanded ? 'max-h-[200px] opacity-[1]  overflow-hidden ' : 'max-h-2     overflow-hidden '}
            
            `}>


            

                  <li   className="flex items-center  w-full p-2 text-white transition
                      duration-75 rounded-lg  space-x-4 group 
                       dark:text-white ">
                              {/* <WifiIcon className='w-[500px]'/>    */}

<div className='bg-white rounded-full text-black w-[2.9rem] h-[2.9rem] pt-3 text-center font-extrabold'>
   <p className='text-sm dotted-font'>MBPS</p>
</div>
                     <Link to='/admin/pppoe-packages'>
                       PPOE packages                 
                       </Link>
                  </li>



                  <li  className="flex items-center w-full p-2 text-white transition
                      duration-75 text-nowrap  space-x-4 group 
                       dark:text-white">
            <img src="/images/icons8-person.gif " className='rounded-full w-10  h-10' alt="" />

                     <Link to='/admin/pppoe-subscribers' >                  
                      PPOE subscribers                 
                  </Link>
                  </li>




                  <li className="flex items-center w-full p-2 text-white transition
                      duration-75   space-x-4 group 
                       dark:text-white">
                                 <WifiIcon className='w-[500px]'/>   


                     <Link to='/admin/pppoe-subscriptions' >                 
                      PPOE subscriptions                  
                      </Link>
                  </li>


            </ul>




         <button   onClick={()=> setIsExpanded4(!isExpanded4)} type="button" className="flex items-center w-full p-2
          text-base transition-colors duration-700
             text-white  rounded-lg group dark:hover:bg-white dark:hover:text-black hover:bg-black
              dark:text-white " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                  <SensorsIcon/>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap ">Network</span>
                  {isExpanded4 ?     < KeyboardArrowUpSharpIcon/> : 
                  
                  
                  < KeyboardArrowDownSharpIcon/>
                   }
            </button>
            <ul id="dropdown-example" className={`transition-all py-2 space-y-2  duration-700 ease-in-out   overflow-hidden
            
            
            ${isExpanded4 ? 'max-h-[300px] opacity-[1] overflow-hidden ' : 'max-h-2     overflow-hidden '}
            
            `}>



                  <li>
                  
                  
                     <Link to='/admin/nodes' className="flex items-center w-full p-2 text-white transition
                      duration-75 rounded-lg  group 
                       dark:text-white  gap-x-3">
                        <img src="/images/icons8-map-pin.gif " className='w-8 h-8 rounded-full' alt="" />
                        Nodes</Link>
                  </li>



                  <li>
                     <Link to='/admin/zones' className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg group  dark:text-white
                       gap-x-3">
                              <img src="/images/icons8-map.gif" className='rounded-full h-8 w-8' alt="" />
                        Zones</Link>
                  </li>
                  <li>
                     <Link  className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg  group 
                      dark:text-white  gap-x-3">
                        <img src="/images/icons8-map (1).gif" className='w-8 h-8 rounded-full' alt="" />
                        Map</Link>
                  </li>

                  <li>
                     <Link  className="flex items-center w-full p-2 text-white 
                     transition duration-75 rounded-lg  group 
                      dark:text-white  gap-x-3">
                        < GroupSharpIcon/>
                        User Group</Link>
                  </li>


                        <li>
                           <Link to='/admin/nas' className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg  group 
                      dark:text-white  gap-x-3">
                           <RouterIcon/>
                           Mikrotik
                           </Link>
                        </li>




            </ul>





            

         
         <li>




         <button   onClick={()=> setIsExpanded1(!isExpanded1)} type="button" className="flex items-center w-full p-2 text-base
              transition duration-75 rounded-lg group dark:hover:bg-white dark:hover:text-black hover:bg-black
              dark:text-white text-white " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                     <PaymentsIcon/>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Payments</span>
                  {isExpanded1 ?     < KeyboardArrowUpSharpIcon/> : 
                  
                  
                 < KeyboardArrowDownSharpIcon/>
                  }
            </button>

            <ul id="dropdown-example" className={` transition-all duration-700 ease-in-out  py-1 space-y-1
            
            
            ${isExpanded1 ? 'max-h-[200px] opacity-[1]  overflow-hidden' : 'max-h-2     overflow-hidden '}
            
            `}>




                 <li>
                     <Link   to='/admin/fixed-payments'className="flex items-center w-full p-2 text-white transition
                      duration-75 rounded-lg  group gap-x-3
                       dark:text-white ">
                        <PaymentIcon />
                         PPOE payments  
                       </Link>
                  </li>




                  
                     <Link to='/admin/hotspot-payments'  className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg  group text-nowrap dark:text-white gap-x-3
                      ">
                         <PaymentsSharpIcon/>
                      Hotspot Payments                  
                      </Link>

                      
  
                 
            </ul>
         </li>





         <li>


         <button   onClick={()=> setIsExpanded2(!isExpanded2)} type="button" className="flex items-center w-full p-2 text-base
             text-white transition duration-75 rounded-lg group dark:hover:bg-white dark:hover:text-black hover:bg-black
              dark:text-white  " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                              <CellTowerIcon/> 

                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Comunication</span>
                  {isExpanded2 ?     < KeyboardArrowUpSharpIcon/> : 
                  
                  
                  < KeyboardArrowDownSharpIcon/>
                   }
            </button>
            <ul id="dropdown-example" className={` transition-all duration-700 ease-in-out  py-1 space-y-1
            
            
            ${isExpanded2 ? 'max-h-[200px] opacity-[1] overflow-hidden ' : 'max-h-3      overflow-hidden '}
            
            `}>




                  <li className="flex items-center w-full p-2 gap-x-4 text-white transition
                      duration-75 rounded-lg pl-11 group 
                       dark:text-white "> 
                       <MailOutlineIcon/>
                   Email
                  </li>

                  <li className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg pl-11 group  dark:text-white gap-x-4
                      " >
                        <TextsmsSharpIcon/>
                    SMS
                  </li>


                  <li  className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg pl-11 group gap-x-4
                      dark:text-white ">
                        <img src="/images/logo-whatsapp.svg" className='sm:w-[30px] max-sm:w-[30px]' alt="" />
                     Whatsap
                  </li>
            </ul>
         </li>
         <li>





         <button   onClick={()=> setIsExpanded3(!isExpanded3)} type="button" className="flex items-center w-full p-2 text-base
             text-white transition duration-75 rounded-lg group 
              dark:text-white dark:hover:bg-white dark:hover:text-black hover:bg-black " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                   <SignalWifi3BarIcon/>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Hotspot Bundle</span>
                  {isExpanded3 ?     < KeyboardArrowUpSharpIcon/> : 
                  
                  
                  < KeyboardArrowDownSharpIcon/>
                   }
            </button>
            <ul id="dropdown-example" className={`transition-all text-nowrap mr-0  duration-700 ease-in-out  py-2 space-y-2
             
         9
            ${isExpanded3 ?  'max-h-[800px] opacity-[1]  overflow-hidden' : 'max-h-3  overflow-hidden     '}
            
            `}>




                  <li>
                     <Link  to='/admin/hotspot-package' className="flex items-center w-full p-2 text-white transition
                      duration-75 rounded-lg  group gap-x-3 text-nowrap 
                       dark:text-white "> 
                        <WavesIcon/>
                      Hotspot  Package</Link>
                  </li>


                  <li className="flex  w-full p-2 text-white
                     transition duration-75  rounded-lg  group  gap-x-3  dark:text-white
                      ">
                        <Groups2Icon/>
                        Hotspot  Subscribers
                  </li>


                  <li>
                     <Link to='/admin/hotspot-subscriptions' className="flex items-center w-full p-2 text-white 
                     transition duration-75 rounded-lg group 
                      dark:text-white gap-x-3  ">
                        <WifiIcon/>
                      Vouchers</Link>
                  </li>





                  <li>
                     <Link to='/admin/hotspot_anlytics'  className="flex items-center w-full p-2 text-white 
                     transition duration-75 rounded-lg  group 
                      dark:text-white gap-x-3  ">
                        <WifiIcon/>
                        Hotspot     Overview</Link>
                  </li>
            </ul>
         </li>



         <li  onClick={()=> setIsExpanded6(!isExpanded6)} className="flex items-center hover:cursor-pointer >
             p-2 text-white rounded-lg dark:text-white dark:hover:bg-white dark:hover:text-black hover:bg-black  group">
                  <MessageIcon/>
               <span className="flex-1 ms-3 whitespace-nowrap">Messages</span>
               <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium
                  dark:text-gray-300">
                     {isExpanded6 ?     < KeyboardArrowUpSharpIcon/> : 
                  
                  
                  < KeyboardArrowDownSharpIcon/>
                   }
                </span>
         </li>


               <ul     className={`transition-all duration-700 ease-in-out  py-1 space-y-1
             
            
             ${isExpanded6 ? 'max-h-[200px] opacity-[1] overflow-hidden ' : 'max-h-0     overflow-hidden '}
             
             `}>
                  <li className='  space-x-2 
                   text-white  rounded-lg p-2 ms-3 text-lg font-medium' >
                  <ion-icon name="logo-twitch" ></ion-icon>

                     <Link to='/admin/sms'>
                     sms
                     </Link>
                  </li>
               </ul>

        



         <li    className="flex items-center p-2 text-white
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
               <span className="flex-1 ms-3 whitespace-nowrap ">Users</span>
               {isExpanded7 ?     < KeyboardArrowUpSharpIcon/> : 
                  
                  
                  < KeyboardArrowDownSharpIcon/>
                   }
            
         </li>


<ul  className={`transition-all duration-700 ease-in-out  py-2 space-y-2
             
            
             ${isExpanded7 ? 'max-h-[200px] opacity-[1]  overflow-hidden' : 'max-h-0     overflow-hidden '}
             
             `} >
   <li className=' rounded-lg  space-x-2  text-white p-2 flex'>
<img src="/images/icons8-male-user.gif" className='rounded-full w-8 h-8' alt="user" />
     <Link to='/admin/user'> User </Link>

      </li>



   <li className=' rounded-lg  text-white  space-x-3  p-2 flex'>
      <img src="/images/icons8-people.gif" className='rounded-full w-8 h-8' alt="" />
   <Link to='/admin/user-group'>
      User Group
      </Link>
       </li>


       

</ul>

        

         <li  className="flex items-center p-2 text-white rounded-lg
             dark:text-white hover:cursor-pointer translate-y-[-1.4rem]
              dark:hover:bg-white dark:hover:text-black hover:bg-black  group">
           
           <ReceiptIcon/>
               <span className="flex-1 ms-3 whitespace-nowrap">Invoices</span>
               <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            
         </li>
         






         <li className='dark:hover:bg-white  p-2  flex items-center 
             text-white rounded-lg dark:text-white   group dark:hover:text-black hover:bg-black'>
            <Link  to='/admin/settings' >
                  <PermDataSettingIcon/>
               <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
            </Link>
         </li>
      </ul>
   </div>
</aside>


    </>

  )
}

export default Sidebar
