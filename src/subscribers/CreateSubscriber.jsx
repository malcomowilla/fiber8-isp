import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import SubscriberDetails from './SubscriberDetails';
import {useSearchParams} from 'react-router-dom';


const  CreateSubscriber = () => {
  const [value, setValue] = React.useState(0);

  const [searchParams] = useSearchParams();




  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <Box sx={{ width: '100%',  }}>
         <TabContext value={value}>
      <Tabs
        onChange={handleChange}
        value={value}
        textColor="black"
        aria-label="Tabs where each tab needs to be selected manually"
      >
        <Tab label="SUBSCRIBER DETAILS" value="1" />
      
      </Tabs>

       <TabPanel 
       value={value}
            
       >

<SubscriberDetails
   
  />
      </TabPanel>
      </TabContext>
    </Box>
  )
}

export default CreateSubscriber
