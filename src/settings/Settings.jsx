import {useState, useTransition, lazy, Suspense} from 'react'


// import GeneralSettings from './GeneralSettings'

const GeneralSettings = lazy(() => import('./GeneralSettings'))
// import MpesaSettings from './MpesaSettings'
const MpesaSettings = lazy(() => import('./MpesaSettings'))
import EmailSettings from './EmailSettings'
// import SmsSettings from './SmsSettings'
const SmsSettings = lazy(() => import('./SmsSettings'))
const SupportSettings = lazy(() => import('./SupportSettings'))

import UiLoader from '../uiloader/UiLoader'

const Settings = () => {
    const [selectedTab, setSelectedTab] = useState('GENERAL')
    const [isPending, startTransition] = useTransition()


    const selectTab = (tab) => {
      startTransition(()=> {
        setSelectedTab(tab)
      })
    }
  return (
    <Suspense fallback={<div className='flex justify-center items-center '>{ <UiLoader/> }</div>}>
    <div className= ' w-full h-screen'>

        <div className='flex sm:flex-row  text-white bg-black h-20 border p-2 
        overflow-x-scroll   lg:overflow-hidden  font-mono gap-x-20 cursor-pointer rounded-xl '>
        <p  onClick={()=>      selectTab('GENERAL')} className='hover:dark:bg-g
        ray-600 p-2 h-10 hover:text-black rounded-lg hover:bg-blue-300

         transition-all duration-300'>GENERAL</p>
      <p   onClick={()=> selectTab('SMS')} className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300
      transition-all duration-300 hover:text-black '>SMS</p>

      
      <p   onClick={()=> selectTab('MPESA')} className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300
       transition-all duration-300 hover:text-black'>MPESA</p>
      <p className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300 transition-all
       duration-300 hover:text-black'>WEBSITE</p>
      <p 
      onClick={()=> selectTab('SUPPORT')}
      className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300
       transition-all duration-300 hover:text-black'>SUPPORT</p>



      <p    onClick={()=> selectTab('EMAIL')} className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg
       hover:bg-blue-300 transition-all duration-300 hover:text-black'>EMAIL</p>
      <p className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300 transition-all 
      duration-300 hover:text-black'>PAYMENT</p>
      <p className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300 
      transition-all duration-300 hover:text-black'>NOTIFICATION</p>
        </div>
  
{selectedTab === 'GENERAL' && <GeneralSettings/>}
{selectedTab === 'MPESA' && <MpesaSettings/>}

{selectedTab === 'EMAIL' && <EmailSettings/>}

{selectedTab === 'SMS' && <SmsSettings/>}
{selectedTab === 'SUPPORT' && <SupportSettings/>}
{/* {selectedTab && <Sms/>}
{selectedTab && <Mpesa/>}
{selectedTab && <Website/>}
{selectedTab && <Support/>}
{selectedTab && <Email/>}
{selectedTab && <Payment/>}
{selectedTab && <Notification/>} */}





    </div>
    </Suspense>
  )
}

export default Settings
