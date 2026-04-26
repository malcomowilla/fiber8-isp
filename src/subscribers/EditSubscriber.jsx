import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import SubscriberDetails from './SubscriberDetails';
import Subscriptions from './Subscriptions';
import {useSearchParams} from 'react-router-dom';
import TabList from '@mui/lab/TabList';
import LiveData from './LiveData';
import {useState, useEffect, useCallback} from 'react'
import { LiaEdit } from "react-icons/lia";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegBuilding } from "react-icons/fa";
import { FaRegClock } from "react-icons/fa6";
import {Link} from 'react-router-dom'
import EditWalletBalance from './EditWalletBalance';
import SubscriberInvoice from './SubscriberInvoice';
import SubscriberTransactions from './SubscriberTransactions';
import { createConsumer } from "@rails/actioncable";
const cable = createConsumer(`wss://${window.location.hostname}/cable`);




const EditSubscriber = () => {
  const [value, setValue] = React.useState("1");

  const [searchParams] = useSearchParams();
const [subscriberName, setSubscriberName] = useState('')
const [userName, setUserName] = useState('')
const [location, setLocation] = useState('')
  const subscriberId = searchParams.get('id')

const [buildingName, setBuildingName] = useState('')
const [createdAT, setCreatedAT] = useState('')
const [updatedAT, setUpdatedAT] = useState('')
const [walletBalance, setWalletBalance] = useState(0)

const [openWalletBalance, setOpenWalletBalance] = useState(false)


const subdomain = window.location.hostname.split('.')[0];




 useEffect(() => {
    const subscription = cable.subscriptions.create(
      { channel: "SubscriberChannel" ,
        "X-SubscriberId": subscriberId,
  }, 
      {
        received(data) {
           console.log('received data from subscriber channel', data)
            setWalletBalance(data.amount)
           
          
         
        },
        connected() {
          console.log("Connected to SubscriberChannel");
        },
        disconnected() {
          console.log("Disconnected from SubscriberChannel");
        },
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [subdomain]);




const getSubscriberWalletBlance = useCallback(
  async() => {
    try {
      const response = await fetch(`/api/subscriber_wallet_balances?subscriber_id=${subscriberId}`, {
        method: 'GET',
        headers: {
          'X-Subdomain': subdomain,
          
        },

      })
      const newData = await response.json()
      if (response.ok) {
        setWalletBalance(newData[0].amount)
      }
    } catch (error) {
      
    }
  },
  [],
)


useEffect(() => {
  
    getSubscriberWalletBlance()
}, [getSubscriberWalletBlance]);




const handleCloseWalletBalance = () => {
  setOpenWalletBalance(false);
}

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };





const getSubscriber = useCallback(
  async() => {
    try {
        
        const response = await fetch(`/api/get_subscriber_by_id?id=${subscriberId}`, {
          headers: {
            'X-Subdomain': subdomain,
          },
       
        })

        if (response.ok) {
            const data = await response.json()
            const {name, id} = data
            setSubscriberName(name)
           setUserName(data.ppoe_username)
           setLocation(data.location)
           setBuildingName(data.building_name)
           setCreatedAT(data.created_at)
           setUpdatedAT(data.updated_at)
            
        } else {
            
        }
    } catch (error) {
        
    }
  },
  [],
)


useEffect(() => {
    getSubscriber()
  
}, [getSubscriber]);


  return (
    <>

    <EditWalletBalance handleCloseWalletBalance={handleCloseWalletBalance}
     openWalletBalance={openWalletBalance}/>
    <Box sx={{ width: '100%',  }}>
      <div className='flex flex-row gap-2 items-center
      cursor-pointer hover:shadow-xl w-fit h-fit'>
           <Link to='/admin/pppoe-subscribers' className='font-bold
            text-black text-xl dark:text-white'>
            
            {subscriberName}
            
                        

            </Link>



            <Link to='/admin/pppoe-subscribers'>
<LiaEdit className='text-xl'/>
</Link>
            </div>


<div className='flex gap-2 items-center'> 

    <p className='text-black dark:text-white border-r border-black 
    dark:border-white
    pr-4'>{userName} <span>

     </span></p> 

{/* {location?.map(loc =><> {loc} </>)} */}
<FaLocationDot className='text-black w-5 h-5 
       dark:text-white ' />
     <p className='border-r border-black pr-4 dark:border-white'>  {location}</p>


<div className='border-r border-black pr-4  flex gap-2
    dark:border-white'>
      <FaRegBuilding className='text-black w-5 h-5 
       dark:text-white ' />

<p>{buildingName}</p>
</div>


<div className='flex gap-2 items-center'>
    <FaRegClock className='text-black w-5 h-5 
       dark:text-white ' />
     <p className='border-r border-black pr-4 dark:border-white'> 
      <span className='font-bold'>CREATED DATE: </span> {createdAT}</p>

</div>




<div className='flex gap-2 items-center'>
    <FaRegClock className='text-black w-5 h-5 
       dark:text-white ' />
     <p className='border-r border-black pr-4 dark:border-white'> <span className='font-bold'>
      UPDATED DATE: </span> {updatedAT}</p>

</div>



<div className='flex items-center flex-row '>
     <p className=''> <span className='font-bold'>
      WALLET: </span> <span className='bg-green-100 p-1 rounded-lg border-l-green-400
      border-l-4 dark:text-black
      '>ksh {walletBalance}
      
      </span>

      </p>
      
      <LiaEdit className='text-black w-6 h-6  cursor-pointer
       dark:text-white ' onClick={()=>{setOpenWalletBalance(true)}}/>

</div>



</div>


         <TabContext value={value}>
      <TabList
         sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "green", // Set custom indicator color
              },
            }}
              onChange={handleChange}
              aria-label="lab API tabs example"
              textColor="gray"
              // variant={isMobile ? 'scrollable' : 'standard'}
              scrollButtons="auto"
      >
        <Tab label="SUBSCRIBER DETAILS" value="1" />
                <Tab label="SUBSCRIPTIONS" value="2" />

        <Tab label="LIVE DATA" value="3" />
        <Tab label="INVOICES"  value="4" />
         <Tab label="PAYMENT HISTORY" value="5" />
        {/* <Tab label="DEVICES" /> */}
        
        <Tab label="COMUNICATIONS" />
        <Tab label="ACTIVITY LOGS" />
      </TabList>

       <TabPanel 
       value='1'
            
       >

<SubscriberDetails
   
  />
      </TabPanel>



      <TabPanel 
       value='2'
            
       >

<Subscriptions
   
  />
      </TabPanel>





      <TabPanel 
       value='3'
       >
<LiveData
  />
      </TabPanel>


      <TabPanel 
       value='4'
       >
<SubscriberInvoice
/>
      </TabPanel>


      <TabPanel
       value='5'>
        <SubscriberTransactions
        />
      </TabPanel>

      
      </TabContext>
    </Box>

    </>
  )
}

export default EditSubscriber
