
import {Link} from 'react-router-dom'
import {motion } from 'framer-motion'

const AdminDashboard = () => {


const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
   <>
   
   
   
   
<div className='grid grid-auto-fit gap-y-5 gap-x-4

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
                <div className="flex items-center">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate
                         dark:text-black">
                            View Subscriber
                        </p>
                      
                    </div>
                    <div className="inline-flex items-center text-base 
                    font-semibold text-gray-900 dark:text-black">
                        $320
                    </div>
                </div>
            </li>

             
            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Total
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $3467
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
bg-gradient-to-r from-white to-white border border-gray-200 rounded-lg  shadow-2xl sm:p-8
 dark:bg-gray-800 dark:border-gray-700 dark:text-black max-h-[400px]">

    <div className="flex items-center justify-between mb-4">

<div className='flex flex-row gap-x-3'>
      <ion-icon name="person-outline"></ion-icon>
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-black">Registrations</h5>
        </div>
        
   </div>
   <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="py-3 sm:py-4">
                <div className="flex items-center">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate
                         dark:text-black">
                        Registered Today
                        </p>
                      
                    </div>
                    
                </div>
            </li>
            <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Registered This week
                     </p>
                       
                    </div>
                   
                </div>
            </li>
            
            <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                        Registered This Month

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
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-black">
                            Registered Last Month
                        </p>
                       
                    </div>
                    <div className="inline-flex items-center text-base font-semibold
                     text-gray-900 dark:text-black">
                        $2367
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