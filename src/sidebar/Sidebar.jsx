
import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'

import {Link} from  'react-router-dom'
import WifiIcon from '@mui/icons-material/Wifi';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import RouterIcon from '@mui/icons-material/Router';
import SensorsIcon from '@mui/icons-material/Sensors';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PaymentsIcon from '@mui/icons-material/Payments';
import CellTowerIcon from '@mui/icons-material/CellTower';
import SignalWifi3BarIcon from '@mui/icons-material/SignalWifi3Bar';
import MessageIcon from '@mui/icons-material/Message';
import PermDataSettingIcon from '@mui/icons-material/PermDataSetting';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import WavesIcon from '@mui/icons-material/Waves';
import Groups2Icon from '@mui/icons-material/Groups2';
const Sidebar = () => {


const {isExpanded, setIsExpanded, isExpanded1, setIsExpanded1 , isExpanded2, setIsExpanded2,
  
  isExpanded3, setIsExpanded3, isExpanded4, setIsExpanded4, isExpanded5, setIsExpanded5, seeSidebar, 
  setSeeSideBar, isExpanded6, setIsExpanded6, isExpanded7, setIsExpanded7,isExpanded8, setIsExpanded8 


} = useContext(ApplicationContext);
  
  return (


    <>
    

<aside  className={`fixed top-0 left-0 z-50  w-64 h-screen transition-all duration-500 ease-in-out 
  bg-gray-800    sm:bg-gray-800     lg:block ${seeSidebar ? 'w-[0] opacity-0' : 'w-[250px] '}    
`}aria-label="Sidebar">
   <div className={`h-full px-3 py-4   overflow-y-hidden
      dark:bg-gray-800
   
   
   `}>
   <div className='flex justify-between   text-white'>
   <img  className='h-[50px] w-[80px]'  src="/images/fiber8logo1.png" alt="fiber8-logo" />
      <p className='font-extrabold font-mono lg:text-xl'>Fiber 8</p>
   <ion-icon  onClick={()=> setSeeSideBar(!seeSidebar)}  className='menu-black' size='large' name="menu"></ion-icon>


   </div>
  

      <ul className="space-y-2 font-extralight">


         <button   onClick={()=> setIsExpanded5(!isExpanded5)} type="button" className="flex flex-col 
         dark:flex-row mt-[50px]  
          items-center w-full p-2 text-base
             text-white transition duration-300  rounded-lg group hover:
              dark:text-white " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                     <BarChartIcon/>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap ">Dashboard</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>


         <ul id="dropdown-example" className={` transition-all  duration-700 ease-in-out   py-1 space-y-1
            
            
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
                           <TrendingUpIcon/>
                        Analytics
                       </Link>
                  </li>



                  
            </ul>




         
        



            <button   onClick={()=> setIsExpanded(!isExpanded)} type="button" className="flex items-center w-full p-2 
            text-base
                        
              rounded-lg group 
              dark:text-white  text-white" aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                  
      <WifiIcon className='w-[500px]'/>   
      
                     <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap ">PPPoe</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>


            <ul id="dropdown-example" className={` transition-all py-1 space-y-1  duration-700 ease-in-out   overflow-hidden
            
            
            ${isExpanded ? 'max-h-[200px] opacity-[1]  overflow-hidden ' : 'max-h-2     overflow-hidden '}
            
            `}>


            

                  <li   className="flex items-center  w-full p-2 text-white transition
                      duration-75 rounded-lg  space-x-4 group 
                       dark:text-white ">
                            <RssFeedIcon/>
                     <Link to='/admin/pppoe-packages'>
                       PPOE packages                 
                       </Link>
                  </li>



                  <li  className="flex items-center w-full p-2 text-white transition
                      duration-75 text-nowrap  space-x-4 group 
                       dark:text-white">
                                                       <RssFeedIcon/>

                     <Link to='/admin/pppoe-subscribers' >                  
                      PPOE subscribers                 
                  </Link>
                  </li>




                  <li className="flex items-center w-full p-2 text-white transition
                      duration-75   space-x-4 group 
                       dark:text-white">
                                                            <RssFeedIcon/>


                     <Link to='/admin/pppoe-subscriptions' >                 
                      PPOE subscriptions                  
                      </Link>
                  </li>


            </ul>




         <button   onClick={()=> setIsExpanded4(!isExpanded4)} type="button" className="flex items-center w-full p-2 text-base
             text-white  rounded-lg group 
              dark:text-white " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                  <SensorsIcon/>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap ">Network</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>
            <ul id="dropdown-example" className={`transition-all py-2 space-y-2  duration-700 ease-in-out   overflow-hidden
            
            
            ${isExpanded4 ? 'max-h-[300px] opacity-[1] overflow-hidden ' : 'max-h-2     overflow-hidden '}
            
            `}>



                  <li>
                  
                  
                     <Link to='/admin/nodes' className="flex items-center w-full p-2 text-white transition
                      duration-75 rounded-lg pl-11 group 
                       dark:text-white  gap-x-3">
                        <ion-icon name="pin-outline" ></ion-icon>
                        Nodes</Link>
                  </li>



                  <li>
                     <Link to='/admin/zones' className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg pl-11 group  dark:text-white
                       gap-x-3">
                             <ion-icon name="location-outline"></ion-icon>

                        Zones</Link>
                  </li>
                  <li>
                     <Link  className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg pl-11 group 
                      dark:text-white  gap-x-3">
                        <ion-icon name="locate-outline" ></ion-icon>
                        Map</Link>
                  </li>

                  <li>
                     <Link  className="flex items-center w-full p-2 text-white 
                     transition duration-75 rounded-lg pl-11 group 
                      dark:text-white  gap-x-3">
                        <ion-icon name="body-outline" ></ion-icon>
                        User Group</Link>
                  </li>


                        <li>
                           <Link to='/admin/nas' className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg pl-11 group 
                      dark:text-white  gap-x-3">
                           <RouterIcon/>
                           NAS
                           </Link>
                        </li>




            </ul>





            

         
         <li>




         <button   onClick={()=> setIsExpanded1(!isExpanded1)} type="button" className="flex items-center w-full p-2 text-base
              transition duration-75 rounded-lg group 
              dark:text-white text-white " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                     <PaymentsIcon/>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Payments</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>

            <ul id="dropdown-example" className={` transition-all duration-700 ease-in-out  py-1 space-y-1
            
            
            ${isExpanded1 ? 'max-h-[200px] opacity-[1]  overflow-hidden' : 'max-h-2     overflow-hidden '}
            
            `}>




                 <li>
                     <Link   to='/admin/fixed-payments'className="flex items-center w-full p-2 text-white transition
                      duration-75 rounded-lg pl-11 group gap-x-3
                       dark:text-white ">
                        <PaymentIcon />
                         PPOE payments  
                       </Link>
                  </li>




                  
                     <Link to='/admin/hotspot-payments'  className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg pl-11 group  dark:text-white gap-x-3
                      ">
                         <MoneyOffIcon/>
                      Hotspot Payments                  
                      </Link>

                      
  
                 
            </ul>
         </li>





         <li>


         <button   onClick={()=> setIsExpanded2(!isExpanded2)} type="button" className="flex items-center w-full p-2 text-base
             text-white transition duration-75 rounded-lg group 
              dark:text-white  " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                              <CellTowerIcon/> 

                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Comunication</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>
            <ul id="dropdown-example" className={` transition-all duration-700 ease-in-out  py-1 space-y-1
            
            
            ${isExpanded2 ? 'max-h-[200px] opacity-[1] overflow-hidden ' : 'max-h-3      overflow-hidden '}
            
            `}>




                  <li className="flex items-center w-full p-2 text-white transition
                      duration-75 rounded-lg pl-11 group 
                       dark:text-white "> 
                   Email
                  </li>
                  <li>
                     <a className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg pl-11 group  dark:text-white
                      " >SMS</a>
                  </li>
                  <li>
                     <a  className="flex items-center w-full p-2 text-white
                     transition duration-75 rounded-lg pl-11 group 
                      dark:text-white ">Whatsap</a>
                  </li>
            </ul>
         </li>
         <li>





         <button   onClick={()=> setIsExpanded3(!isExpanded3)} type="button" className="flex items-center w-full p-2 text-base
             text-white transition duration-75 rounded-lg group 
              dark:text-white " aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                   <SignalWifi3BarIcon/>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Hotspot Bundle</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>
            <ul id="dropdown-example" className={`transition-all  t duration-700 ease-in-out   py-1 space-y-1
             
            
            ${isExpanded3 ?  'max-h-[800px] opacity-[1]  overflow-hidden' : 'max-h-3  overflow-hidden     '}
            
            `}>




                  <li>
                     <Link  to='/admin/hotspot-package' className="flex items-center w-full p-2 text-white transition
                      duration-75 rounded-lg pl-11 group gap-x-2 text-nowrap 
                       dark:text-white "> 
                        <WavesIcon/>
                       Hotspot package</Link>
                  </li>


                  <li className="flex  w-full p-2 text-white
                     transition duration-75  rounded-lg pl-11 group  gap-x-2  dark:text-white
                      ">
                        <Groups2Icon/>
                     Hotspot subscribers
                  </li>


                  <li>
                     <Link to='/admin/hotspot-subscriptions' className="flex items-center w-full p-2 text-white 
                     transition duration-75 rounded-lg pl-11 group 
                      dark:text-white gap-x-2  ">
                        <WifiIcon/>
                        Hotspot subscriptions</Link>
                  </li>
            </ul>
         </li>



         <li  onClick={()=> setIsExpanded6(!isExpanded6)} className="flex items-center hover:cursor-pointer >
             p-2 text-white rounded-lg dark:text-white   group">
                  <MessageIcon/>
               <span className="flex-1 ms-3 whitespace-nowrap">Messages</span>
               <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium
                  dark:text-gray-300">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
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
             rounded-lg dark:text-white hover:cursor-pointer group" onClick={()=> setIsExpanded7(!isExpanded7)}>
            
               <svg className="flex-shrink-0 w-5 h-5 text-white transition duration-75
                dark:text-gray-400 group-hover:text-white dark:group-hover:text-white" 
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 
                  9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 
                  0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 
                  0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap ">Users</span>
               <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            
         </li>


<ul  className={`transition-all duration-700 ease-in-out  py-2 space-y-2
             
            
             ${isExpanded7 ? 'max-h-[200px] opacity-[1]  overflow-hidden' : 'max-h-0     overflow-hidden '}
             
             `} >
   <li className=' rounded-lg  space-x-2  text-white p-2'>
   <ion-icon name="accessibility-outline"  size='large'></ion-icon>

     <Link to='/admin/user'> User </Link>

      </li>



   <li className=' rounded-lg  text-white  space-x-3  p-2'>
   <ion-icon name="people-outline" size='large'></ion-icon>
   <Link to='/admin/user-group'>
      User Group
      </Link>
       </li>


       

</ul>



         <li className='translate-y-[-5px]'>
            <Link  to='/admin/settings' className="flex items-center 
             text-white rounded-lg dark:text-white   group">
                  <PermDataSettingIcon/>
               <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
            </Link>
         </li>
        



         <li  className="flex items-center p-2 text-white rounded-lg
             dark:text-white hover:cursor-pointer  group">
           
           <ReceiptIcon/>
               <span className="flex-1 ms-3 whitespace-nowrap">Invoices</span>
               <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            
         </li>
         
      </ul>
   </div>
</aside>


    </>

  )
}

export default Sidebar
