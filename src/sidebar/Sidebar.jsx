
import { useContext} from 'react'
import {ApplicationContext} from '../context/ApplicationContext'

import {Link} from  'react-router-dom'

const Sidebar = () => {


const {isExpanded, setIsExpanded, isExpanded1, setIsExpanded1 , isExpanded2, setIsExpanded2,
  
  isExpanded3, setIsExpanded3, isExpanded4, setIsExpanded4, isExpanded5, setIsExpanded5, seeSidebar, setSeeSideBar


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
         <li>
            <a href="#"
             className="flex items-center p-2 text-gray-900 rounded-lg
              dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg 
               className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400
                group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" 
                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0
                   0 0-1-1.066h.002Z"/>
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1
                   0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z"/>
               </svg>
               <span onClick={()=> setIsExpanded5(!isExpanded5)} className="ms-3 ">Dashboard</span>
            </a>
         </li>


         <ul id="dropdown-example" className={` transition-all duration-700 ease-in-out  py-2 space-y-2
            
            
            ${isExpanded5 ? 'visible' : 'hidden'}
            
            `}>




                 <Link to='/layout/admin-dashboard'> <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 transition
                      duration-75 rounded-lg pl-11 group hover:bg-gray-100
                       dark:text-white dark:hover:bg-gray-700">Analytics</a>
                  </li>
                  </Link>
                 
                 
            </ul>


















         
         <li>
            
           
         </li>
         <li>



            <button   onClick={()=> setIsExpanded(!isExpanded)} type="button" className="flex items-center w-full p-2 text-base
             text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100
              dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example"
               data-collapse-toggle="dropdown-example">
                  <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition
                   duration-75 group-hover:text-gray-900
                    dark:text-gray-400 dark:group-hover:text-white" aria-hidden="true" 
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                     <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 
                     2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 
                     2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z"/>
                  </svg>
                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap ">PPPoe</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>


            <ul id="dropdown-example" className={` transition-all duration-700 ease-in-out  py-2 space-y-2
            
            
            ${isExpanded ? 'visible' : 'hidden'}
            
            `}>



<Link to='/layout/pppoe-packages'>
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 transition
                      duration-75 rounded-lg pl-11 group hover:bg-gray-100
                       dark:text-white dark:hover:bg-gray-700">PPOE packages</a>
                  </li>
                  </Link>

                  <Link to='/layout/pppoe-subscribers'>

                  <li>

                     <a href="#" className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white
                      dark:hover:bg-gray-700">PPOE subscribers</a>
                  </li>
                  </Link>


                  <Link to='/layout/pppoe-subscriptions'>
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100
                      dark:text-white dark:hover:bg-gray-700">PPPOE subscriptions</a>
                  </li>
                  </Link>
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
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 transition
                      duration-75 rounded-lg pl-11 group hover:bg-gray-100
                       dark:text-white dark:hover:bg-gray-700">Nodes</a>
                  </li>
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white
                      dark:hover:bg-gray-700">Zones</a>
                  </li>
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100
                      dark:text-white dark:hover:bg-gray-700">Map</a>
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




               <Link to='/layout/fixed-payments'>   <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 transition
                      duration-75 rounded-lg pl-11 group hover:bg-gray-100
                       dark:text-white dark:hover:bg-gray-700">PPOE payments</a>
                  </li>

                  </Link>
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white
                      dark:hover:bg-gray-700">Hotspot Payments</a>
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

                  <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Hotspot</span>
                  <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                     <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                  </svg>
            </button>
            <ul id="dropdown-example" className={` transition-all duration-500 ease-in-out  py-2 space-y-2
            
            
            ${isExpanded3 ? 'visible' : 'hidden'}
            
            `}>




                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 transition
                      duration-75 rounded-lg pl-11 group hover:bg-gray-100
                       dark:text-white dark:hover:bg-gray-700">Hotspot packages</a>
                  </li>
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white
                      dark:hover:bg-gray-700">Hotspot subscribers</a>
                  </li>
                  <li>
                     <a href="#" className="flex items-center w-full p-2 text-gray-900 
                     transition duration-75 rounded-lg pl-11 group hover:bg-gray-100
                      dark:text-white dark:hover:bg-gray-700">Hotspot subscriptions</a>
                  </li>
            </ul>
         </li>
         <li>






            <a href="#" className="flex items-center
             p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
            <ion-icon name="chatbubbles-outline" size='small'></ion-icon>
               <span className="flex-1 ms-3 whitespace-nowrap">Messages</span>
               <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium
                text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300">Pro</span>
            </a>
         </li>
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
         <li>
            <a href="#" className="flex items-center p-2 text-gray-900
             rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
               <svg className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75
                dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" 
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z"/>
               </svg>
               <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
            </a>
         </li>
         <li>
            <a href="#" className="flex items-center 
            p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                         <ion-icon name="hammer" size='small'></ion-icon>

               <span className="flex-1 ms-3 whitespace-nowrap">Settings</span>
            </a>
         </li>
        
         
      </ul>
   </div>
</aside>


    </>
//     <div className=' p-[30px] max-sm:text-2xl flex flex-col gap-y-4 cursor-pointer font-mono text-white lg:text-sm md:text-xs'>

   

//        <div className='flex justify-between items-center flex-row gap-x-4 translate-x-[-30px]'>
//         <div className=''>
//         <ion-icon name="home-outline"></ion-icon>

//         </div>



//         <div onClick={()=> setIsExpanded3(!isExpanded3)   } >Dasboard  </div>

        
//         <div>
// ˅
// </div>
        
// </div>


//       <div className={`grid overflow-hidden transition-all duration-300 ease-in-out  gap-y-2

// ${isExpanded3 ? 'h-5' : 'h-0'}
// `}>

// <Link to='/admin-dashboard'>

// <div className='flex justify-evenly'>statistics</div>
// </Link>
// </div>


//             <div  onClick={()=> setIsExpanded5(!isExpanded5)}  className='flex  flex-row 
//             justify-evenly gap-x-4 translate-x-[-30px]'>

//               <div>
//               <ion-icon name="radio-outline"></ion-icon>

//               </div>

              
//              <div>  Hotspot</div> 
 
//              <div>{'˅'}</div>
//               </div>

// <div className={`grid overflow-hidden transition-all duration-300 ease-in-out gap-y-2

// ${isExpanded5 ? 'h-20' : 'h-0'}
// `}>
// <div>Hotspot Packages</div>
// <div className='text-nowrap'>Hotspot Subscribers</div>
// </div>


                      
//           <div onClick={()=> setIsExpanded(!isExpanded)   } 
//            className='flex  '>PPPOE  
//            <div>˅</div>

//           </div>
//           <div className={`grid overflow-y-hidden  transition-all duration-300 ease-in-out gap-y-4 

// ${isExpanded ? 'h-20' : 'h-0'}
// `}>
//     <Link to='/layout/edit-package'>  <div>PPPOE packages</div></Link>


//           <div>PPPOE Subscribers   </div>
//             <div className='text-nowrap'> PPPOE Subscriptions    </div>
//           </div>
           





//             <div onClick={()=> setIsExpanded1(!isExpanded1)   } className='flex
//              justify-evenly gap-x-4 translate-x-[-30px]'>

//               <div>
//               <ion-icon name="analytics"></ion-icon>

//               </div>
//             Comunication
//                  <div>{'˅'}</div>
                 
//                  </div>


// <div className={`grid overflow-hidden transition-all duration-300 ease-in-out  

// ${isExpanded1 ? 'h-20' : 'h-0'}
// `}>

// <div className=''>Emails</div>
// <div>SMS</div>
// <div>Whatsap</div>
// </div>

//             <div className='flex justify-evenly gap-x-4  translate-x-[-30px] '>

//               <div>
//               <ion-icon name="people-outline" ></ion-icon>

//               </div>
//               Users  <span>{'˅'}</span> </div>


// <div   onClick={()=> setIsExpanded2(!isExpanded2)   } className='flex flex-row 
// justify-evenly gap-x-4 translate-x-[-30px]'>

//   <div>
//   <ion-icon  name="wifi-outline" ></ion-icon>

//   </div>
//   <div>
//   Network

//   </div>
//      <div>{'˅'}</div>
     
//       </div>


// <div  className={`grid overflow-hidden transition-all duration-300 ease-in-out  gap-y-2

// ${isExpanded2 ? 'h-20' : 'h-0'}
// `}>

  
//           <div>Zones</div>
//             <div>Nodes</div>
// </div>
           


// <div className='flex justify-evenly'>Voucher</div>


//             <div  onClick={()=> setIsExpanded4(!isExpanded4)   }  className='flex  flex-row 
//             justify-evenly gap-x-4 translate-x-[-30px]'>

//               <div>
//               <ion-icon name="cash-outline" ></ion-icon>


//               </div>


//           <div>
//           Payments 

//           </div>
              
//                 <div>{'˅'}</div> 
                
//                 </div>

//               <div className={`grid overflow-hidden transition-all duration-300 ease-in-out  gap-y-2

// ${isExpanded4 ? 'h-20' : 'h-0'}
// `}>
//             <div>PPPOE payments</div>
//             <div>Hotspot Payments</div>
//             </div>

//             <div className='flex justify-evenly'>Messages</div>
//             <div className='flex justify-evenly'>Invoices</div>
//             <div className='flex justify-evenly 
//             flex-row gap-x-4 translate-x-[-30px]'> 

//             <div>
//             <ion-icon name="hammer"></ion-icon>

//             </div>

//             <div>
//             Settings

//             </div>
            
            
//             </div> 


//     </div>
  )
}

export default Sidebar
