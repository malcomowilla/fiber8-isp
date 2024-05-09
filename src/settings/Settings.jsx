import {useState, useTransition} from 'react'
import GeneralSettings from './GeneralSettings'
import MpesaSettings from './MpesaSettings'
import EmailSettings from './EmailSettings'
import SmsSettings from './SmsSettings'

const Settings = () => {
    const [selectedTab, setSelectedTab] = useState('GENERAL')
    const [isPending, startTransition] = useTransition()


    const selectTab = (tab) => {
      startTransition(()=> {
        setSelectedTab(tab)
      })
    }
  return (
    <div className= ' w-full h-screen'>

        <div className='flex sm:flex-row   h-20 border p-2 overflow-x-scroll font-mono gap-x-20 cursor-pointer '>
        <p  onClick={()=>      selectTab('GENERAL')} className='hover:dark:bg-gray-600 p-2 h-10 rounded-lg hover:bg-gray-300
         transition-all duration-300'>GENERAL</p>
      <p   onClick={()=> selectTab('SMS')} className='hover:dark:bg-gray-600 p-2 h-10 rounded-lg hover:bg-gray-300 
      transition-all duration-300'>SMS</p>

      
      <p   onClick={()=> selectTab('MPESA')} className='hover:dark:bg-gray-600 p-2 h-10 rounded-lg hover:bg-gray-300
       transition-all duration-300'>MPESA</p>
      <p className='hover:dark:bg-gray-600 p-2 h-10 rounded-lg hover:bg-gray-300 transition-all duration-300'>WEBSITE</p>
      <p className='hover:dark:bg-gray-600 p-2 h-10 rounded-lg hover:bg-gray-300 transition-all duration-300'>SUPPORT</p>
      <p    onClick={()=> selectTab('EMAIL')} className='hover:dark:bg-gray-600 p-2 h-10 rounded-lg
       hover:bg-gray-300 transition-all duration-300'>EMAIL</p>
      <p className='hover:dark:bg-gray-600 p-2 h-10 rounded-lg hover:bg-gray-300 transition-all duration-300'>PAYMENT</p>
      <p className='hover:dark:bg-gray-600 p-2 h-10 rounded-lg hover:bg-gray-300 transition-all duration-300'>NOTIFICATION</p>
        </div>
  
{selectedTab === 'GENERAL' && <GeneralSettings/>}
{selectedTab === 'MPESA' && <MpesaSettings/>}

{selectedTab === 'EMAIL' && <EmailSettings/>}

{selectedTab === 'SMS' && <SmsSettings/>}
{/* {selectedTab && <Sms/>}
{selectedTab && <Mpesa/>}
{selectedTab && <Website/>}
{selectedTab && <Support/>}
{selectedTab && <Email/>}
{selectedTab && <Payment/>}
{selectedTab && <Notification/>} */}





    </div>
  )
}

export default Settings
