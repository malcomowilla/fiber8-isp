
import {Link} from 'react-router-dom'
import {motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react';
import { useApplicationSettings } from '../settings/ApplicationSettings';

const AdminDashboard = () => {
const {showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,} = useApplicationSettings()

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

const [totalSubscribers, setTotalSubscribers] = useState(0);
const [registrations, setRegistrations] = useState({
    todayCount: 0,
    thisWeekCount: 0,
    thisMonthCount: 0,
    lastMonthCount: 0
  });


// <Route path='/admin/today-subscribers' element={<TodayRegisteredSubscribers/>}/>

// <Route path='/admin/this-month-subscribers' element={<ThisMonthRegisteredSubscribers/>}/>


{/* <Route path='/admin/this-week-subscribers' element={<ThisWeekRegisteredSubscribers/>}/> */}

  useEffect(() => {
    const fetchRegistrationStats = async () => {
      try {
        const response = await fetch('/api/registration_stats');
        const data = await response.json();
        setRegistrations(data);
      } catch (error) {
        console.error('Error fetching registration stats:', error);
      }
    };
  
    fetchRegistrationStats();
  }, []);


const subdomain = window.location.hostname.split('.')[0];
  const fetchtotalSubscribers = useCallback(
    async() => {
      try {
        const response = await fetch('/api/total_subscribers', {
          headers: {
            'X-Subdomain': subdomain,
          },
        });

        const newData = await response.json();

        if (response.ok) {
          setTotalSubscribers(newData.total_subscribers)
        } else {
          console.log('failed to fetch total subscribers')
        }
      } catch (error) {
        console.log('failed to fetch total subscribers')
      }
      
    },
    [],
  )
  
useEffect(() => {
  fetchtotalSubscribers()
  
}, [fetchtotalSubscribers]);




const [status, setStatus] = useState([])


const getSubscriptions = useCallback(
  async() => {
    
    try {
      const response = await fetch('/api/subscriptions', {
        headers: { 'X-Subdomain': subdomain },
      })
      const data = await response.json()
      setStatus(data)
      // setSubscriptions(data)
    }
    catch (error) {
      console.log(error)
    }
  },
  [subdomain]
)



useEffect(() => {
  getSubscriptions() 
 
}, [getSubscriptions]);
  return (
   <>
   
   
   
   
<div 

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
className='grid grid-auto-fit gap-y-5 gap-x-4

 nanum-gothic-coding-regular'>


<motion.div 

variants={cardVariants}
initial="hidden"
animate="visible"
transition={{ duration: 0.5, delay: 0.1 }}
className="w-full max-w-md p-4 bg-white border border-gray-200 

bg-gradient-to-r from-white to-white  rounded-lg shadow-2xl sm:p-8 dark:bg-gray-800 
 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <div className='flex flex-row gap-x-3 dark:text-black'>
      <ion-icon name="person-outline"></ion-icon>
        <h5 className="text-xl font-bold leading-none
        
        text-gray-900 dark:text-black">Subscribers</h5>
        </div>
        <Link  to='/admin/pppoe-subscribers' className="text-sm font-medium text-black
         hover:underline dark:text-black">
            View all
        </Link>
   </div>
   <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            

             
            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Total
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        {totalSubscribers}
                    </div>
                </div>
            </li>
            <li className="py-3 sm:py-4">
                <div className="flex items-center">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Online
                        </p>
                      
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $67
                    </div>
                </div>
            </li>
            <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Conected without Internet
                        </p>
                      
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $367
                    </div>
                </div>
            </li>
            <li className="pt-3 pb-0 sm:pt-4">
                <div className="flex items-center ">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate
                         dark:text-black">
                            Off Line
                        </p>
                      
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $2367
                    </div>
                </div>
            </li>








            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Active Subscription
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $3467
                    </div>
                </div>
            </li>






            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Active Last Month
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $3467
                    </div>
                </div>
            </li>










            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Active This Month
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $3467
                    </div>
                </div>
            </li>






            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Expired Within 30 days
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900
                     dark:text-black">
                        $3467
                    </div>
                </div>
            </li>



            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Subscription Renewed Today
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $3467
                    </div>
                </div>
            </li>



            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Advanced Renewals
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base
                     font-semibold text-gray-900 dark:text-black">
                        $3467
                    </div>
                </div>
            </li>




            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Expired
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $3467
                    </div>
                </div>
            </li>


            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Dormant
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $3467
                    </div>
                </div>
            </li>


            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Expired Today
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $3467
                    </div>
                </div>
            </li>




            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Expiring In the Next Four Days
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base 
                    font-semibold text-gray-900 dark:text-black">
                        $3467
                    </div>
                </div>
            </li>




            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Expired in the Last Four Days
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base 
                    font-semibold text-gray-900 dark:text-black">
                        $3467
                    </div>
                </div>
            </li>
        </ul>
   </div>
</motion.div>

   
   

   


<motion.div
  variants={cardVariants}
  initial="hidden"
  animate="visible"
  transition={{ duration: 0.5, delay: 0.4 }}
  className="w-full max-w-md p-4 bg-white 
  bg-gradient-to-r from-white to-white border border-gray-200 rounded-lg shadow-2xl sm:p-8
  dark:bg-gray-800  cursor-pointer dark:border-gray-700 dark:text-black max-h-[400px]">

  <div className="flex items-center justify-between mb-4">
    <div className='flex flex-row gap-x-3'>
      <ion-icon name="person-outline"></ion-icon>
      <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-black">Registrations</h5>
    </div>
  </div>
  
  <div className="flow-root">
    <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
      <Link to ='/admin/today-subscribers' className="py-3 sm:py-4">
      <li className="py-3 sm:py-4">
        <div className="flex items-center">
          <div className="flex-1 min-w-0 ms-4">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
              Registered Today
            </p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-black">
            {registrations.todayCount || 0}
          </div>
        </div>
      </li>
      </Link>



      <Link to="/admin/this-week-subscribers " className='cursor-pointer'>
      <li className="py-3 sm:py-4">
        <div className="flex items-center">
          <div className="flex-1 min-w-0 ms-4">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
              Registered This Week
            </p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-black">
            {registrations.thisWeekCount || 0}
          </div>
        </div>
      </li>
      </Link>



      <Link to="/admin/this-month-subscribers">
      <li className="py-3 sm:py-4">
        <div className="flex items-center">
          <div className="flex-1 min-w-0 ms-4">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
              Registered This Month
            </p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-black">
            {registrations.thisMonthCount || 0}
          </div>
        </div>
      </li>
      </Link>
      
      <li className="pt-3 pb-0 sm:pt-4">
        <div className="flex items-center">
          <div className="flex-1 min-w-0 ms-4">
            <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
              Registered Last Month
            </p>
          </div>
          <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-black">
            {registrations.lastMonthCount || 0}
          </div>
        </div>
      </li>
    </ul>
  </div>
</motion.div>
   
   
   






<motion.div 
 variants={cardVariants}
 initial="hidden"
 animate="visible"
 transition={{ duration: 0.5, delay: 0.5 }}
className="w-full max-w-md p-4 bg-white 

bg-gradient-to-r from-white to-white border border-gray-200 rounded-lg shadow-2xl sm:p-8
 dark:bg-gray-800 dark:border-gray-700  max-h-[400px] dark:text-black">

    <div className="flex items-center justify-between mb-4">

<div className='flex flex-row gap-x-3'>

<ion-icon name="newspaper-outline"></ion-icon>
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-black">Hotspot Sales</h5>
        </div>
        
   </div>
   <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="py-3 sm:py-4">
                <div className="flex items-center">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                        Packages Sold Today
                        </p>
                      
                    </div>
                    
                </div>
            </li>
            <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                        Packages Sold Yesterday

                     </p>
                       
                    </div>
                   
                </div>
            </li>
            

            <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                        Packages Sold This Week

                        </p>
                      
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $367
                    </div>
                </div>
            </li>
            <li className="pt-3 pb-0 sm:pt-4">
                <div className="flex items-center ">
                 
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900
                         truncate dark:text-black">
                        Packages Sold This Month

                        </p>
                       
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $2367
                    </div>
                </div>
            </li>




           
            <li className="pt-3 pb-0 sm:pt-4">
                <div className="flex items-center ">
                 
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                        Packages Sold Last Month

                        </p>
                       
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">

                    </div>
                </div>
            </li>
        </ul>
   </div>
</motion.div>







 
<motion.div 
 variants={cardVariants}
 initial="hidden"
 animate="visible"
 transition={{ duration: 0.5, delay: 0.6 }}
className="w-full max-w-md p-4 bg-white bg-gradient-to-r from-stone-500 to-white border

border-gray-200 rounded-lg shadow-2xl sm:p-8
 dark:bg-gray-800 dark:border-gray-700  max-h-[400px]">

    <div className="flex items-center justify-between mb-4">

<div className='flex flex-row gap-x-3'>

<ion-icon name="newspaper-outline"></ion-icon>
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Package Sales</h5>
        </div>
        
   </div>
   <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="py-3 sm:py-4">
                <div className="flex items-center">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        Packages Sold Today
                        </p>
                      
                    </div>
                    
                </div>
            </li>
            <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        Packages Sold Yesterday

                     </p>
                       
                    </div>
                   
                </div>
            </li>
            

            <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        Packages Sold This Week

                        </p>
                      
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $367
                    </div>
                </div>
            </li>
            <li className="pt-3 pb-0 sm:pt-4">
                <div className="flex items-center ">
                 
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        Packages Sold This Month

                        </p>
                       
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $2367
                    </div>
                </div>
            </li>




           
            <li className="pt-3 pb-0 sm:pt-4">
                <div className="flex items-center ">
                 
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        Packages Sold Last Month

                        </p>
                       
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">

                    </div>
                </div>
            </li>
        </ul>
   </div>

   
</motion.div>  
   
   













   
</div>
   
   
   
   
   
   </>
  )
}

export default AdminDashboard