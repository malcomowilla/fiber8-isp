
import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'

import {Link} from  'react-router-dom'

const Sidebar = () => {


const {isExpanded, setIsExpanded, isExpanded1, setIsExpanded1 , isExpanded2, setIsExpanded2,
  
  isExpanded3, setIsExpanded3, isExpanded4, setIsExpanded4, isExpanded5, setIsExpanded5, seeSidebar, 
  setSeeSideBar, isExpanded6, setIsExpanded6, isExpanded7, setIsExpanded7,isExpanded8, setIsExpanded8 


} = useContext(ApplicationContext);
  
  return (


    <>

    

<aside id="sidebar-multi-level-sidebar" className={`fixed top-0 left-0 z-50  w-64 h-screen transition-all duration-600 ease-in-out 
  bg-gray-50  overflow-auto   lg:block ${seeSidebar ? 'w-[0]' : 'w-[250px]'}    
`}aria-label="Sidebar">
   <div className={`h-full px-3 py-4 overflow-y-auto  font-mono dark:bg-gray-800
   
   
   `}>

   <span className="sr-only">Open sidebar</span>
   <ion-icon  onClick={()=> setSeeSideBar(!seeSidebar)}  className='menu-black'  name="menu"></ion-icon>



      <ul className="space-y-2 font-mono">





         <button   onClick={()=> setIsExpanded5(!isExpanded5)} type="button" className="flex items-center w-full p-2 text-base
             text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100
              dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                  <ion-icon name="bar-chart-outline"></ion-icon>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap ">Dashboard</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>


         <ul id="dropdown-example" className={` transition-all duration-700 ease-in-out  py-2 space-y-2
            
            
            ${isExpanded5 ? 'visible' : 'hidden'}
            
            `}>




                <li>
                     <a className="flex items-center w-full p-2 text-gray-900 transition
                      duration-75 rounded-lg pl-11 group hover:bg-gray-100
                       dark:text-white dark:hover:bg-gray-700 space-x-2">
                        <ion-icon name="analytics-outline"></ion-icon>
                          <Link to='/admin/admin-dashboard'>
                        Management</Link>
                       </a>
                  </li>
                 
                 


                <li>
                     <a  className="flex items-center w-full p-2 text-gray-900 transition
                      duration-75 rounded-lg pl-11 group hover:bg-gray-100
                       dark:text-white dark:hover:bg-gray-700 space-x-2">
                        <ion-icon name="bar-chart-outline"></ion-icon>
                          <Link to='/admin/analytics'>
                        Analytics</Link>
                       </a>
                  </li>
            </ul>




         
         <li>
            
           
         </li>
         <li>



            <button   onClick={()=> setIsExpanded(!isExpanded)} type="button" className="flex items-center w-full p-2 text-base
             text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100
              dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                  <ion-icon name="logo-rss"></ion-icon>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap ">PPPoe</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>


            <ul id="dropdown-example" className={` transition-all duration-700 ease-in-out  py-2 space-y-2
            
            
            ${isExpanded ? 'visible' : 'hidden'}
            
            `}>



                  <li>
                     <a className="flex items-center w-full p-2 text-gray-900 transition
                      duration-75 rounded-lg pl-11 group hover:bg-gray-100
                       dark:text-white dark:hover:bg-gray-700"><Link to='/admin/pppoe-packages'>
                       PPOE packages                  </Link>
</a>
                  </li>



                  <li>

                     <a className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white
                      dark:hover:bg-gray-700">                  <Link to='/admin/pppoe-subscribers'>
                      PPOE subscribers                  </Link>
</a>
                  </li>


                  <li>
                     <a  className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100
                      dark:text-white dark:hover:bg-gray-700">                  <Link to='/admin/pppoe-subscriptions'>
                      PPPOE subscriptions                  </Link>
</a>
                  </li>
            </ul>
         </li>
         <li>





         <button   onClick={()=> setIsExpanded4(!isExpanded4)} type="button" className="flex items-center w-full p-2 text-base
             text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100
              dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                   <ion-icon  name="wifi-outline"  size='small'></ion-icon>

                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Network</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>
            <ul id="dropdown-example" className={` transition-all duration-500 ease-in-out  py-2 space-y-2
            
            
            ${isExpanded4 ? 'visible' : 'hidden'}
            
            `}>



                  <li>
                  
                  
                     <Link to='/admin/nodes' className="flex items-center w-full p-2 text-gray-900 transition
                      duration-75 rounded-lg pl-11 group hover:bg-gray-100 
                       dark:text-white dark:hover:bg-gray-700 gap-x-3">
                        <ion-icon name="pin-outline"></ion-icon>
                        Nodes</Link>
                  </li>



                  <li>
                     <Link to='/admin/zones' className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white
                      dark:hover:bg-gray-700 gap-x-3">
                             <ion-icon name="location-outline"></ion-icon>

                        Zones</Link>
                  </li>
                  <li>
                     <Link  className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100
                      dark:text-white dark:hover:bg-gray-700 gap-x-3">
                        <ion-icon name="locate-outline"></ion-icon>
                        Map</Link>
                  </li>

                  <li>
                     <Link  className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100
                      dark:text-white dark:hover:bg-gray-700 gap-x-3">
                        <ion-icon name="body-outline"></ion-icon>
                        User Group</Link>
                  </li>


                        <li>
                           <Link to='/admin/nas' className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100
                      dark:text-white dark:hover:bg-gray-700 gap-x-3">
                        <ion-icon name="wifi-outline"></ion-icon>
                           
                           NAS
                           </Link>
                        </li>


            </ul>
         </li>
         <li>




         <button   onClick={()=> setIsExpanded1(!isExpanded1)} type="button" className="flex items-center w-full p-2 text-base
             text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100
              dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                             <ion-icon name="cash-outline" size='small' ></ion-icon>

                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Payments</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>

            <ul id="dropdown-example" className={` transition-all duration-500 ease-in-out  py-2 space-y-2
            
            
            ${isExpanded1 ? 'visible' : 'hidden'}
            
            `}>




                 <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 transition
                      duration-75 rounded-lg pl-11 group hover:bg-gray-100
                       dark:text-white dark:hover:bg-gray-700"> <Link to='/admin/fixed-payments'>PPOE payments  </Link>
                       </a>
                  </li>




                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white
                      dark:hover:bg-gray-700"><Link to='/admin/hotspot-payments'>
                      Hotspot Payments                  </Link>
</a>
                  </li>
                 
            </ul>
         </li>
         <li>














         <button   onClick={()=> setIsExpanded2(!isExpanded2)} type="button" className="flex items-center w-full p-2 text-base
             text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100
              dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                             <ion-icon name="analytics" size='small'></ion-icon>

                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Comunication</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>
            <ul id="dropdown-example" className={` transition-all duration-500 ease-in-out  py-2 space-y-2
            
            
            ${isExpanded2 ? 'visible' : 'hidden'}
            
            `}>




                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 transition
                      duration-75 rounded-lg pl-11 group hover:bg-gray-100
                       dark:text-white dark:hover:bg-gray-700">Email</a>
                  </li>
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white
                      dark:hover:bg-gray-700">SMS</a>
                  </li>
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100
                      dark:text-white dark:hover:bg-gray-700">Whatsap</a>
                  </li>
            </ul>
         </li>
         <li>





         <button   onClick={()=> setIsExpanded3(!isExpanded3)} type="button" className="flex items-center w-full p-2 text-base
             text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100
              dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                              <ion-icon name="radio-outline" size='small'></ion-icon>

                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Hotspot Bundle</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>
            <ul id="dropdown-example" className={`transition-all duration-500 ease-in-out  py-2 space-y-2
             
            
            ${isExpanded3 ? 'visible' : 'hidden'}
            
            `}>




                  <li>
                     <a  className="flex items-center w-full p-2 text-gray-900 transition
                      duration-75 rounded-lg pl-11 group hover:bg-gray-100
                       dark:text-white dark:hover:bg-gray-700"> <Link to='/admin/hotspot-package'>Hotspot packages</Link></a>
                  </li>


                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white
                      dark:hover:bg-gray-700">Hotspot subscribers</a>
                  </li>
                  <li>
                     <a  className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100
                      dark:text-white dark:hover:bg-gray-700"><Link to='/admin/hotspot-subscriptions'>Hotspot subscriptions</Link></a>
                  </li>
            </ul>
         </li>



         <li  onClick={()=> setIsExpanded6(!isExpanded6)}>
            <a className="flex items-center
             p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <ion-icon name="chatbubbles-outline" size='small'></ion-icon>
               <span className="flex-1 ms-3 whitespace-nowrap">Messages</span>
               <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium
                text-gray-800   dark:text-gray-300">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
                </span>
            </a>
         </li>


               <ul     className={`transition-all duration-500 ease-in-out  py-2 space-y-2
             
            
             ${isExpanded6 ? 'visible' : 'hidden'}
             
             `}>
                  <li className='  space-x-2 dark:hover:bg-gray-700
                   hover:bg-gray-100  rounded-lg p-2 ms-3 text-lg font-medium' >
                  <ion-icon name="logo-twitch"></ion-icon>

                     <Link to='/admin/sms'>
                     sms
                     </Link>
                  </li>
               </ul>

         <li>
            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg
             dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75
                dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                 aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Invoices</span>
               <span className="inline-flex items-center justify-center w-3 h-3 
               p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full
                dark:bg-blue-900 dark:text-blue-300">3</span>
            </a>
         </li>


         <li onClick={()=> setIsExpanded7(!isExpanded7)}>
            <a  className="flex items-center p-2 text-gray-900
             rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75
                dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap ">Users</span>
               <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </a>
         </li>


<ul  className={`transition-all duration-500 ease-in-out  py-2 space-y-2
             
            
             ${isExpanded7 ? 'visible' : 'hidden'}
             
             `} >
   <li className='dark:hover:bg-gray-700  hover:bg-gray-100 rounded-lg  space-x-2  p-2'>
   <ion-icon name="accessibility-outline"></ion-icon>

     <Link to='/admin/user'> User </Link> </li>
   <li className=' hover:bg-gray-100  dark:hover:bg-gray-700 rounded-lg    space-x-3  p-2'>
   <ion-icon name="people-outline"></ion-icon>
   <Link to='/admin/user-group'>
      User Group
      </Link>
       </li>

</ul>



         <li>
            <a  className="flex items-center 
            p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                         <ion-icon name="hammer" size='small'></ion-icon>

               <span className="flex-1 ms-3 whitespace-nowrap"><Link to='/admin/settings'>Settings</Link></span>
            </a>
         </li>
        
         
      </ul>
   </div>
</aside>


    </>

  )
}

export default Sidebar
