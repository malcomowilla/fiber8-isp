
import {Link} from 'react-router-dom'

const AdminDashboard = () => {
  return (
   <>
   
   
   
   
<div className='grid grid-auto-fit gap-y-5 gap-x-4 nanum-gothic-coding-regular '>
<div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 
 dark:border-gray-700">
    <div className="flex items-center justify-between mb-4">
      <div className='flex flex-row gap-x-3'>
      <ion-icon name="person-outline"></ion-icon>
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Subscribers</h5>
        </div>
        <Link  to='/admin/pppoe-subscribers' className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
            View all
        </Link>
   </div>
   <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="py-3 sm:py-4">
                <div className="flex items-center">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            View Subscriber
                        </p>
                      
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $320
                    </div>
                </div>
            </li>

             
            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Total
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>
            <li className="py-3 sm:py-4">
                <div className="flex items-center">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Online
                        </p>
                      
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $67
                    </div>
                </div>
            </li>
            <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Conected without Internet
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
                            Off Line
                        </p>
                      
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $2367
                    </div>
                </div>
            </li>








            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Active Subscription
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>






            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Active Last Month
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>










            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Active This Month
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>






            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Expired Within 30 days
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>



            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Subscription Renewed Today
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>



            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Advanced Renewals
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>




            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Expired
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>


            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Dormant
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>


            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Expired Today
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>




            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Expiring In the Next Four Days
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>




            <li className="py-3 sm:py-4">
               <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Expired in the Last Four Days
                        </p>
                     
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $3467
                    </div>
                </div>
            </li>
        </ul>
   </div>
</div>

   
   

   



<div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8
 dark:bg-gray-800 dark:border-gray-700  max-h-[400px]">

    <div className="flex items-center justify-between mb-4">

<div className='flex flex-row gap-x-3'>
      <ion-icon name="person-outline"></ion-icon>
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Registrations</h5>
        </div>
        
   </div>
   <div className="flow-root">
        <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
            <li className="py-3 sm:py-4">
                <div className="flex items-center">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        Registered Today
                        </p>
                      
                    </div>
                    
                </div>
            </li>
            <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                    
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            Registered This week
                     </p>
                       
                    </div>
                   
                </div>
            </li>
            
            <li className="py-3 sm:py-4">
                <div className="flex items-center ">
                   
                    <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                        Registered This Month

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
                            Registered Last Month
                        </p>
                       
                    </div>
                    <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                        $2367
                    </div>
                </div>
            </li>
        </ul>
   </div>
</div>

   
   
   






<div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8
 dark:bg-gray-800 dark:border-gray-700  max-h-[400px]">

    <div className="flex items-center justify-between mb-4">

<div className='flex flex-row gap-x-3'>

<ion-icon name="newspaper-outline"></ion-icon>
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">Hotspot Sales</h5>
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
</div>







 
<div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8
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
</div>  
   
   













   
</div>
   
   
   
   
   
   </>
  )
}

export default AdminDashboard