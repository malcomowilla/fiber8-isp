import {useState, useTransition, lazy, Suspense} from 'react'
const GeneralSettings = lazy(() => import('./GeneralSettings'))
const MpesaSettings = lazy(() => import('./MpesaSettings'))
import EmailSettings from './EmailSettings'
const SmsSettings = lazy(() => import('./SmsSettings'))
const SupportSettings = lazy(() => import('./SupportSettings'))
const  RadiusSettings = lazy(() => import('./RadiusSettings'))
const LicenseSettings = lazy(() => import('./LicenseSettings'))
const TaskSettings = lazy(() => import('./TaskSettings'))
import {useApplicationSettings} from './ApplicationSettings'
const GoogleMapSetting = lazy(() => import('./GoogleMapSetting'))


import UiLoader from '../uiloader/UiLoader'

const Settings = () => {
    const [selectedTab, setSelectedTab] = useState('GENERAL')
    const [isPending, startTransition] = useTransition()
    const { showMenu1, setShowMenu1, showMenu2, setShowMenu2, showMenu3, setShowMenu3,
      showMenu4, setShowMenu4, showMenu5, setShowMenu5, showMenu6, setShowMenu6,
       showMenu7, setShowMenu7, showMenu8, setShowMenu8, showMenu9, setShowMenu9,
        showMenu10, setShowMenu10, showMenu11, setShowMenu11, showMenu12, setShowMenu12,
} = useApplicationSettings()


    const selectTab = (tab) => {
      startTransition(()=> {
        setSelectedTab(tab)
      })
    }
  return (
    <Suspense fallback={<div className='flex justify-center items-center '>{ <UiLoader/> }</div>}>
    <div className= 'w-full h-screen'
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
    >

        <div className='flex sm:flex-row  text-white bg-black h-20 border p-2 
        overflow-x-scroll   lg:overflow-hidden  roboto-condensed gap-x-20 cursor-pointer rounded-xl '>
        <p  onClick={()=>      selectTab('GENERAL')} className='hover:dark:bg-g
        ray-600 p-2 h-10 hover:text-black rounded-lg hover:bg-blue-300

         transition-all duration-300'>GENERAL</p>
      <p   onClick={()=> selectTab('SMS')} className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300
      transition-all duration-300 hover:text-black '>SMS</p>


{/* 
<p   onClick={()=> selectTab('RADIUS')} className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300
      transition-all duration-300 hover:text-black '>RADIUS</p> */}


<p   onClick={()=> selectTab('LICENSE')} className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300
      transition-all duration-300 hover:text-black '>LICENSE</p>

      
      <p   onClick={()=> selectTab('MPESA')} className='hover:dark:bg-gray-200 p-2 h-10
       rounded-lg hover:bg-blue-300
       transition-all duration-300 hover:text-black'>MPESA</p>


       
      <p onClick={()=> selectTab('MAP')} className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300 transition-all
       duration-300 hover:text-black'>MAP</p>
      <p 
      onClick={()=> selectTab('SUPPORT')}
      className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300
       transition-all duration-300 hover:text-black'>SUPPORT</p>



      <p    onClick={()=> selectTab('EMAIL')} className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg
       hover:bg-blue-300 transition-all duration-300 hover:text-black'>EMAIL</p>



      <p    onClick={()=> selectTab('TASK')} className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg
       hover:bg-blue-300 transition-all duration-300 hover:text-black'>TASK</p>


      <p className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300 transition-all 
      duration-300 hover:text-black'>PAYMENT</p>




      <p className='hover:dark:bg-gray-200 p-2 h-10 rounded-lg hover:bg-blue-300 
      transition-all duration-300 hover:text-black'>NOTIFICATION</p>
        </div>
  
{selectedTab === 'GENERAL' && <GeneralSettings/>}
{selectedTab === 'MPESA' && <MpesaSettings/>}

{selectedTab === 'EMAIL' && <EmailSettings/>}
{selectedTab === 'LICENSE' && <LicenseSettings/>}


{selectedTab === 'SMS' && <SmsSettings/>}
{selectedTab === 'RADIUS' && <RadiusSettings/>}

{selectedTab === 'SUPPORT' && <SupportSettings/>}

{selectedTab === 'TASK' && <TaskSettings/>}
{selectedTab === 'MAP' && <GoogleMapSetting/>}  
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
